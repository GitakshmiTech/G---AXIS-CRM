//===========================================================================================
//    CONTACTS MODULE SERVICE
//    Handles Contact (Person) CRUD operations linked to Accounts with role-scoping
//===========================================================================================

const { Op } = require('sequelize');
const { sequelize, Contact, Account, Staff, Lead, AuditLog } = require('../../database/models');
const { getNextCode } = require('../../common/helpers/codeSequence.helper');
const { formatDateDDMMYYYY, formatTimeAMPM } = require('../../common/helpers/date.helper');
const { buildRowScope, canAccessRecord } = require('../../common/helpers/scope.helper');

//===========================================================================================
//    HELPER: Shape raw Contact row for API responses
//===========================================================================================
const shapeContact = (raw) => ({
  id: raw.contact_id,
  code: raw.contact_code,
  firstName: raw.first_name,
  lastName: raw.last_name,
  name: `${raw.first_name} ${raw.last_name}`.trim(),
  designation: raw.designation || '',
  department: raw.department || '',
  email: raw.email,
  officePhone: raw.office_phone || '',
  mobilePhone: raw.mobile_phone || '',
  accountId: raw.account_id,
  accountName: raw.account?.account_name || '',
  accountCode: raw.account?.account_code || '',
  owner: raw.owner ? `${raw.owner.first_name} ${raw.owner.last_name}` : '',
  ownerEmail: raw.owner?.email || '',
  ownerId: raw.owner_id,
  isDecisionMaker: raw.is_decision_maker || false,
  sourceLeadId: raw.source_lead_id,
  createdDate: formatDateDDMMYYYY(raw.created_at),
  createdTime: formatTimeAMPM(raw.created_at),
});

//===========================================================================================
//    GET CONTACTS — Paginated, searchable, optionally filtered by account (scoped by role)
//===========================================================================================
const getContacts = async (queryParams = {}, currentUser = null) => {
  const { page = 1, limit = 10, search = '', accountId } = queryParams;
  const offset = (Number(page) - 1) * Number(limit);

  const scopeFilter = buildRowScope(currentUser, 'owner_id');
  const where = { ...scopeFilter };

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    where[Op.or] = [
      { first_name: { [Op.like]: term } },
      { last_name: { [Op.like]: term } },
      { email: { [Op.like]: term } },
      { contact_code: { [Op.like]: term } },
      { mobile_phone: { [Op.like]: term } },
    ];
  }
  if (accountId) where.account_id = accountId;

  const { count, rows } = await Contact.findAndCountAll({
    where,
    include: [
      { model: Account, as: 'account', attributes: ['account_id', 'account_code', 'account_name'], required: false },
      { model: Staff, as: 'owner', attributes: ['staff_id', 'first_name', 'last_name', 'email'], required: false },
    ],
    order: [['created_at', 'DESC']],
    limit: Number(limit),
    offset,
  });

  return {
    contacts: rows.map((c) => shapeContact(c.toJSON())),
    totalEntries: count,
    currentPage: Number(page),
    pageSize: Number(limit),
    totalPages: Math.ceil(count / Number(limit)),
  };
};

//===========================================================================================
//    GET CONTACT BY ID (scoped by role)
//===========================================================================================
const getContactById = async (id, currentUser = null) => {
  const scopeFilter = buildRowScope(currentUser, 'owner_id');
  const contact = await Contact.findOne({
    where: { contact_id: id, ...scopeFilter },
    include: [
      { model: Account, as: 'account', required: false },
      { model: Staff, as: 'owner', required: false },
      { model: Lead, as: 'sourceLead', required: false },
    ],
  });
  if (!contact) return null;
  return shapeContact(contact.toJSON());
};

//===========================================================================================
//    CREATE CONTACT
//===========================================================================================
const createContact = async (data, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  const ownerId = currentUser?.roleCode === 'BDE' ? currentUser.staffId : (data.ownerId || actorId);

  const transaction = await sequelize.transaction();
  try {
    const contactCode = await getNextCode('CNT-', transaction);

    const newContact = await Contact.create(
      {
        contact_code: contactCode,
        first_name: data.firstName,
        last_name: data.lastName || '.',
        designation: data.designation || null,
        department: data.department || null,
        email: data.email,
        office_phone: data.officePhone || null,
        mobile_phone: data.mobilePhone || null,
        account_id: data.accountId,
        owner_id: ownerId,
        is_decision_maker: data.isDecisionMaker || false,
        created_by: actorId,
      },
      { transaction }
    );

    await AuditLog.create(
      { actor_id: actorId, action: 'created', entity_type: 'contact', entity_id: newContact.contact_id, details: { contact_code: contactCode, name: `${data.firstName} ${data.lastName}`, email: data.email } },
      { transaction }
    );

    await transaction.commit();
    return await getContactById(newContact.contact_id, currentUser);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

//===========================================================================================
//    UPDATE CONTACT
//===========================================================================================
const updateContact = async (id, data, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  const contact = await Contact.findByPk(id);
  if (!contact) throw new Error(`Contact ${id} not found`);

  if (!canAccessRecord(currentUser, contact)) {
    throw new Error('Access restricted: Insufficient permissions for this contact.');
  }

  const transaction = await sequelize.transaction();
  try {
    const fields = {};
    if (data.firstName !== undefined) fields.first_name = data.firstName;
    if (data.lastName !== undefined) fields.last_name = data.lastName;
    if (data.designation !== undefined) fields.designation = data.designation;
    if (data.department !== undefined) fields.department = data.department;
    if (data.email !== undefined) fields.email = data.email;
    if (data.officePhone !== undefined) fields.office_phone = data.officePhone;
    if (data.mobilePhone !== undefined) fields.mobile_phone = data.mobilePhone;
    if (data.accountId !== undefined) fields.account_id = data.accountId;
    if (data.isDecisionMaker !== undefined) fields.is_decision_maker = data.isDecisionMaker;

    await contact.update(fields, { transaction });
    await AuditLog.create(
      { actor_id: actorId, action: 'edited', entity_type: 'contact', entity_id: contact.contact_id, details: { updatedFields: Object.keys(fields) } },
      { transaction }
    );

    await transaction.commit();
    return await getContactById(id, currentUser);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = { getContacts, getContactById, createContact, updateContact };
