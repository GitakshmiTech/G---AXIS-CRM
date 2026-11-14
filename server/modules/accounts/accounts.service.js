//===========================================================================================
//    ACCOUNTS MODULE SERVICE
//    Handles Account (Client Company) CRUD operations and role-scoped querying
//===========================================================================================

const { Op } = require('sequelize');
const { sequelize, Account, Contact, Deal, Industry, Staff, Lead, AuditLog } = require('../../database/models');
const { getNextCode } = require('../../common/helpers/codeSequence.helper');
const { formatDateDDMMYYYY, formatTimeAMPM } = require('../../common/helpers/date.helper');
const { buildRowScope, canAccessRecord } = require('../../common/helpers/scope.helper');

//===========================================================================================
//    HELPER: Shape raw Account row for API responses
//===========================================================================================
const shapeAccount = (raw) => ({
  id: raw.account_id,
  code: raw.account_code,
  name: raw.account_name,
  domain: raw.domain || '',
  website: raw.website || '',
  phone: raw.phone || '',
  industry: raw.industry?.industry_name || '',
  employeeCount: raw.employee_count || 0,
  annualRevenue: raw.annual_revenue || 0,
  owner: raw.owner ? `${raw.owner.first_name} ${raw.owner.last_name}` : '',
  ownerEmail: raw.owner?.email || '',
  ownerPhoto: raw.owner?.profile_photo_url || '',
  ownerId: raw.owner_id,
  address: [raw.hq_street_address, raw.hq_city, raw.hq_state, raw.hq_country].filter(Boolean).join(', '),
  city: raw.hq_city || '',
  state: raw.hq_state || '',
  country: raw.hq_country || 'India',
  postalCode: raw.hq_postal_code || '',
  status: raw.status || 'active',
  sourceLeadId: raw.source_lead_id,
  contacts: (raw.contacts || []).map((c) => ({
    id: c.contact_id,
    code: c.contact_code,
    name: `${c.first_name} ${c.last_name}`,
    email: c.email,
    phone: c.mobile_phone,
    designation: c.designation,
    isDecisionMaker: c.is_decision_maker,
  })),
  deals: (raw.deals || []).map((d) => ({
    id: d.deal_id,
    code: d.deal_code,
    name: d.deal_name,
    value: d.expected_value,
    status: d.status,
  })),
  createdDate: formatDateDDMMYYYY(raw.created_at),
  createdTime: formatTimeAMPM(raw.created_at),
});

//===========================================================================================
//    GET ACCOUNTS — Paginated and filtered list (scoped by role)
//===========================================================================================
const getAccounts = async (queryParams = {}, currentUser = null) => {
  const { page = 1, limit = 10, search = '', status = 'All' } = queryParams;
  const offset = (Number(page) - 1) * Number(limit);

  const scopeFilter = buildRowScope(currentUser, 'owner_id');
  const where = { ...scopeFilter };

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    where[Op.or] = [
      { account_name: { [Op.like]: term } },
      { account_code: { [Op.like]: term } },
      { domain: { [Op.like]: term } },
      { phone: { [Op.like]: term } },
    ];
  }
  if (status && status !== 'All') where.status = status;

  const { count, rows } = await Account.findAndCountAll({
    where,
    include: [
      { model: Industry, as: 'industry', attributes: ['industry_name'], required: false },
      { model: Staff, as: 'owner', attributes: ['staff_id', 'first_name', 'last_name', 'email', 'profile_photo_url'], required: false },
      { model: Contact, as: 'contacts', attributes: ['contact_id', 'contact_code', 'first_name', 'last_name', 'email', 'mobile_phone', 'designation', 'is_decision_maker'], required: false },
      { model: Deal, as: 'deals', attributes: ['deal_id', 'deal_code', 'deal_name', 'expected_value', 'status'], required: false },
    ],
    order: [['created_at', 'DESC']],
    limit: Number(limit),
    offset,
    distinct: true,
  });

  return {
    accounts: rows.map((a) => shapeAccount(a.toJSON())),
    totalEntries: count,
    currentPage: Number(page),
    pageSize: Number(limit),
    totalPages: Math.ceil(count / Number(limit)),
  };
};

//===========================================================================================
//    GET ACCOUNT BY ID (scoped by role)
//===========================================================================================
const getAccountById = async (id, currentUser = null) => {
  const scopeFilter = buildRowScope(currentUser, 'owner_id');
  const account = await Account.findOne({
    where: { account_id: id, ...scopeFilter },
    include: [
      { model: Industry, as: 'industry', required: false },
      { model: Staff, as: 'owner', required: false },
      { model: Contact, as: 'contacts', required: false },
      { model: Deal, as: 'deals', required: false },
      { model: Lead, as: 'sourceLead', required: false },
    ],
  });
  if (!account) return null;
  return shapeAccount(account.toJSON());
};

//===========================================================================================
//    CREATE ACCOUNT — Standalone account creation
//===========================================================================================
const createAccount = async (data, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  const ownerId = currentUser?.roleCode === 'BDE' ? currentUser.staffId : (data.ownerId || actorId);

  const transaction = await sequelize.transaction();
  try {
    const accountCode = await getNextCode('ACC-', transaction);

    // Resolve industry FK
    let industryId = null;
    if (data.industry) {
      let ind = await Industry.findOne({ where: { industry_name: data.industry }, transaction });
      if (!ind) ind = await Industry.create({ industry_name: data.industry, is_active: true }, { transaction });
      industryId = ind.industry_id;
    }

    const newAccount = await Account.create(
      {
        account_code: accountCode,
        account_name: data.name,
        domain: data.domain || null,
        website: data.website || null,
        phone: data.phone || null,
        industry_id: industryId,
        employee_count: Number(data.employeeCount) || 0,
        annual_revenue: Number(data.annualRevenue) || 0,
        hq_street_address: data.address || null,
        hq_city: data.city || null,
        hq_state: data.state || null,
        hq_country: data.country || 'India',
        hq_postal_code: data.postalCode || null,
        owner_id: ownerId,
        created_by: actorId,
        status: 'active',
      },
      { transaction }
    );

    await AuditLog.create(
      { actor_id: actorId, action: 'created', entity_type: 'account', entity_id: newAccount.account_id, details: { account_code: accountCode, name: data.name } },
      { transaction }
    );

    await transaction.commit();
    return await getAccountById(newAccount.account_id, currentUser);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

//===========================================================================================
//    UPDATE ACCOUNT
//===========================================================================================
const updateAccount = async (id, data, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  const account = await Account.findByPk(id);
  if (!account) throw new Error(`Account ${id} not found`);

  if (!canAccessRecord(currentUser, account)) {
    throw new Error('Access restricted: Insufficient permissions for this account.');
  }

  const transaction = await sequelize.transaction();
  try {
    const fields = {};
    if (data.name !== undefined) fields.account_name = data.name;
    if (data.domain !== undefined) fields.domain = data.domain;
    if (data.website !== undefined) fields.website = data.website;
    if (data.phone !== undefined) fields.phone = data.phone;
    if (data.employeeCount !== undefined) fields.employee_count = Number(data.employeeCount) || 0;
    if (data.annualRevenue !== undefined) fields.annual_revenue = Number(data.annualRevenue) || 0;
    if (data.address !== undefined) fields.hq_street_address = data.address;
    if (data.city !== undefined) fields.hq_city = data.city;
    if (data.state !== undefined) fields.hq_state = data.state;
    if (data.country !== undefined) fields.hq_country = data.country;
    if (data.postalCode !== undefined) fields.hq_postal_code = data.postalCode;
    if (data.status !== undefined) fields.status = data.status;

    if (data.industry) {
      let ind = await Industry.findOne({ where: { industry_name: data.industry }, transaction });
      if (ind) fields.industry_id = ind.industry_id;
    }

    await account.update(fields, { transaction });
    await AuditLog.create(
      { actor_id: actorId, action: 'edited', entity_type: 'account', entity_id: account.account_id, details: { updatedFields: Object.keys(fields) } },
      { transaction }
    );

    await transaction.commit();
    return await getAccountById(id, currentUser);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = { getAccounts, getAccountById, createAccount, updateAccount };
