//===========================================================================================
//    LEADS MODULE SERVICE (ENTERPRISE CRM LOGIC)
//    Handles lead retrieval, deduplication check, code sequence generation,
//    atomic qualification, activity/notes logging, and deal conversion
//===========================================================================================

const { Op } = require('sequelize');
const {
  sequelize,
  Lead,
  LeadStatus,
  LeadSource,
  Industry,
  Staff,
  Account,
  Contact,
  Deal,
  DealStage,
  Activity,
  Note,
  AuditLog,
} = require('../../database/models');
const { getNextCode } = require('../../common/helpers/codeSequence.helper');
const { formatDateDDMMYYYY, formatTimeAMPM, parseDDMMYYYYtoSQL } = require('../../common/helpers/date.helper');
const { buildRowScope, canAccessRecord } = require('../../common/helpers/scope.helper');

//===========================================================================================
//    HELPER: Map UI priority → DB lead_health ENUM
//===========================================================================================
const HEALTH_MAP = { High: 'hot', Medium: 'warm', Low: 'cold' };

//===========================================================================================
//    HELPER: Shape a raw Lead DB row into the frontend DataTable format
//===========================================================================================
const shapeLead = (raw) => ({
  id: raw.lead_id,
  code: raw.lead_code,
  name: raw.full_name,
  designation: raw.designation || '',
  email: raw.email,
  phone: raw.phone,
  companyName: raw.company_name,
  stage: raw.status?.status_name || 'New',
  priority: raw.deal_signal || 'Low',
  leadSource: raw.source?.source_name || 'Website',
  industry: raw.industry?.industry_name || 'Information Technology',
  employeeScale: raw.employee_scale || '0 - 50',
  website: raw.website || '',
  address: raw.street_address || '',
  city: raw.city || '',
  state: raw.state_province || '',
  country: raw.country || 'India',
  postalCode: raw.postal_code || '',
  estimatedDealValue: raw.estimated_deal_value,
  notes: raw.qualification_notes || '',
  avatar:
    raw.owner?.profile_photo_url ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  companyLogo:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&crop=faces',
  createdDate: formatDateDDMMYYYY(raw.created_at),
  createdTime: formatTimeAMPM(raw.created_at),
  convertedAccountId: raw.converted_account_id,
  convertedContactId: raw.converted_contact_id,
  convertedAt: raw.converted_at ? formatDateDDMMYYYY(raw.converted_at) : null,
  activities: raw.activities || [],
  notesList: raw.notes || [],
});

//===========================================================================================
//    STANDARD INCLUDES for Lead queries
//===========================================================================================
const LEAD_INCLUDES = [
  { model: LeadStatus, as: 'status', attributes: ['lead_status_id', 'status_name', 'allows_conversion', 'is_terminal'] },
  { model: LeadSource, as: 'source', attributes: ['lead_source_id', 'source_name'] },
  { model: Industry, as: 'industry', attributes: ['industry_id', 'industry_name'], required: false },
  { model: Staff, as: 'owner', attributes: ['staff_id', 'employee_code', 'first_name', 'last_name', 'email', 'profile_photo_url'], required: false },
];

//===========================================================================================
//    GET LEADS — Paginated, searchable, filtered list (scoped by role)
//===========================================================================================
const getLeads = async (queryParams = {}, currentUser = null) => {
  const { page = 1, limit = 10, search = '', stage = 'All', priority = 'All', source = 'All' } = queryParams;
  const offset = (Number(page) - 1) * Number(limit);

  // Apply row-level scoping based on user role (BDE: self, SALES_MANAGER: team, SUPER_ADMIN: all)
  const scopeFilter = buildRowScope(currentUser, 'owner_id');
  const where = { ...scopeFilter };

  // Search across name, code, company, email, phone
  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    where[Op.or] = [
      { full_name: { [Op.like]: term } },
      { lead_code: { [Op.like]: term } },
      { company_name: { [Op.like]: term } },
      { email: { [Op.like]: term } },
      { phone: { [Op.like]: term } },
    ];
  }

  // Priority / deal signal filter
  if (priority && priority !== 'All') {
    where.deal_signal = priority;
  }

  // Build dynamic include with optional stage/source filtering
  const includes = [
    {
      model: LeadStatus,
      as: 'status',
      attributes: ['lead_status_id', 'status_name', 'allows_conversion', 'is_terminal'],
      where: stage && stage !== 'All' ? { status_name: stage } : undefined,
      required: !!(stage && stage !== 'All'),
    },
    {
      model: LeadSource,
      as: 'source',
      attributes: ['lead_source_id', 'source_name'],
      where: source && source !== 'All' ? { source_name: source } : undefined,
      required: !!(source && source !== 'All'),
    },
    { model: Industry, as: 'industry', attributes: ['industry_id', 'industry_name'], required: false },
    { model: Staff, as: 'owner', attributes: ['staff_id', 'first_name', 'last_name', 'profile_photo_url'], required: false },
  ];

  const { count, rows } = await Lead.findAndCountAll({
    where,
    include: includes,
    order: [['created_at', 'DESC']],
    limit: Number(limit),
    offset,
  });

  return {
    leads: rows.map((l) => shapeLead(l.toJSON())),
    totalEntries: count,
    currentPage: Number(page),
    pageSize: Number(limit),
    totalPages: Math.ceil(count / Number(limit)),
  };
};

//===========================================================================================
//    GET LEAD BY ID (scoped by role)
//===========================================================================================
const getLeadById = async (id, currentUser = null) => {
  const scopeFilter = buildRowScope(currentUser, 'owner_id');
  const where = { lead_id: id, ...scopeFilter };

  const lead = await Lead.findOne({
    where,
    include: [
      ...LEAD_INCLUDES,
      { model: Activity, as: 'activities', required: false },
      { model: Note, as: 'notes', required: false },
      { model: Account, as: 'convertedAccount', required: false },
      { model: Contact, as: 'convertedContact', required: false },
    ],
  });
  if (!lead) return null;
  return shapeLead(lead.toJSON());
};

//===========================================================================================
//    CHECK DUPLICATE — Deduplication by email, phone across leads + contacts
//===========================================================================================
const checkDuplicate = async ({ email, phone }) => {
  const conditions = [];
  if (email && email.trim()) conditions.push({ email: email.trim() });
  if (phone && phone.trim()) conditions.push({ phone: phone.trim() });
  if (!conditions.length) return { isDuplicate: false, matchedLeads: [], matchedContacts: [] };

  const [matchedLeads, matchedContacts] = await Promise.all([
    Lead.findAll({
      where: { [Op.or]: conditions },
      attributes: ['lead_id', 'lead_code', 'full_name', 'email', 'phone', 'company_name'],
    }),
    Contact.findAll({
      where: { [Op.or]: [{ email: email?.trim() }].filter(Boolean) },
      attributes: ['contact_id', 'contact_code', 'first_name', 'last_name', 'email'],
    }),
  ]);

  return {
    isDuplicate: matchedLeads.length > 0 || matchedContacts.length > 0,
    matchedLeads,
    matchedContacts,
  };
};

//===========================================================================================
//    CREATE LEAD — Atomically assigns code, resolves master FKs, inserts row, audit logs
//===========================================================================================
const createLead = async (leadData, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  const ownerId = currentUser?.roleCode === 'BDE'
    ? currentUser.staffId
    : (leadData.ownerId || leadData.owner_id || actorId);

  const transaction = await sequelize.transaction();
  try {
    // Robust attribute extraction supporting all common naming conventions
    const name = (
      leadData.name ||
      leadData.full_name ||
      leadData.fullName ||
      leadData.leadName ||
      ''
    ).trim();

    const email = (
      leadData.email ||
      leadData.primary_email ||
      ''
    ).trim();

    const phone = (
      leadData.phone ||
      leadData.mobile ||
      leadData.contactNumber ||
      leadData.mobile_phone ||
      ''
    ).trim();

    const companyName = (
      leadData.companyName ||
      leadData.company_name ||
      leadData.company ||
      leadData.organizationName ||
      leadData.organization ||
      (name ? `${name}'s Company` : 'Individual Prospect')
    ).trim();

    const {
      designation = '',
      leadSource = 'Website',
      priority = 'Medium',
      stage = 'New',
      industry = '',
      employeeScale = '0 - 50',
      website = '',
      address = '',
      city = '',
      state = '',
      country = 'India',
      postalCode = '',
      estimatedDealValue = 0,
      notes = '',
    } = leadData;

    // 1. Atomic code generation
    const leadCode = await getNextCode('LD-', transaction);

    // 2. Resolve lead status
    let statusRecord = await LeadStatus.findOne({ where: { status_name: stage }, transaction });
    if (!statusRecord) statusRecord = await LeadStatus.findOne({ where: { stage_order: 1 }, transaction });

    // 3. Resolve or auto-create lead source
    let sourceRecord = await LeadSource.findOne({ where: { source_name: leadSource }, transaction });
    if (!sourceRecord) {
      sourceRecord = await LeadSource.create({ source_name: leadSource, is_active: true }, { transaction });
    }

    // 4. Resolve or auto-create industry
    let industryRecord = null;
    if (industry) {
      industryRecord = await Industry.findOne({ where: { industry_name: industry }, transaction });
      if (!industryRecord) {
        industryRecord = await Industry.create({ industry_name: industry, is_active: true }, { transaction });
      }
    }

    // 5. Map UI priority → DB lead_health ENUM (hot/warm/cold)
    const leadHealth = HEALTH_MAP[priority] || 'warm';

    // 6. Create lead row
    const newLead = await Lead.create(
      {
        lead_code: leadCode,
        full_name: name,
        designation,
        email,
        phone,
        company_name: companyName,
        industry_id: industryRecord ? industryRecord.industry_id : null,
        employee_scale: employeeScale,
        website,
        lead_source_id: sourceRecord ? sourceRecord.lead_source_id : 1,
        lead_status_id: statusRecord ? statusRecord.lead_status_id : 1,
        lead_health: leadHealth,
        deal_signal: priority,
        estimated_deal_value: Number(estimatedDealValue) || 0,
        street_address: address,
        city,
        state_province: state,
        country,
        postal_code: postalCode,
        qualification_notes: notes,
        owner_id: ownerId,
        created_by: actorId,
      },
      { transaction }
    );

    // 7. Audit log
    await AuditLog.create(
      {
        actor_id: actorId,
        action: 'created',
        entity_type: 'lead',
        entity_id: newLead.lead_id,
        details: { lead_code: leadCode, name, email, companyName, stage, priority },
      },
      { transaction }
    );

    await transaction.commit();
    return await getLeadById(newLead.lead_id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

//===========================================================================================
//    UPDATE LEAD — Partial update with FK resolution, scoping check, and audit log
//===========================================================================================
const updateLead = async (id, updateData, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  const lead = await Lead.findByPk(id);
  if (!lead) throw new Error(`Lead with ID ${id} not found`);

  // Verify row-level permission
  if (!canAccessRecord(currentUser, lead)) {
    throw new Error('Access restricted: You do not have permission to modify this lead.');
  }

  const transaction = await sequelize.transaction();
  try {
    const fields = {};

    if (updateData.name !== undefined) fields.full_name = updateData.name;
    if (updateData.designation !== undefined) fields.designation = updateData.designation;
    if (updateData.email !== undefined) fields.email = updateData.email;
    if (updateData.phone !== undefined) fields.phone = updateData.phone;
    if (updateData.companyName !== undefined) fields.company_name = updateData.companyName;
    if (updateData.employeeScale !== undefined) fields.employee_scale = updateData.employeeScale;
    if (updateData.website !== undefined) fields.website = updateData.website;
    if (updateData.address !== undefined) fields.street_address = updateData.address;
    if (updateData.city !== undefined) fields.city = updateData.city;
    if (updateData.state !== undefined) fields.state_province = updateData.state;
    if (updateData.country !== undefined) fields.country = updateData.country;
    if (updateData.postalCode !== undefined) fields.postal_code = updateData.postalCode;
    if (updateData.estimatedDealValue !== undefined) fields.estimated_deal_value = Number(updateData.estimatedDealValue) || 0;
    if (updateData.notes !== undefined) fields.qualification_notes = updateData.notes;
    if (updateData.priority !== undefined) {
      fields.deal_signal = updateData.priority;
      fields.lead_health = HEALTH_MAP[updateData.priority] || 'warm';
    }

    // Resolve FK lookups only if fields changed
    if (updateData.stage) {
      const s = await LeadStatus.findOne({ where: { status_name: updateData.stage }, transaction });
      if (s) fields.lead_status_id = s.lead_status_id;
    }
    if (updateData.leadSource) {
      const src = await LeadSource.findOne({ where: { source_name: updateData.leadSource }, transaction });
      if (src) fields.lead_source_id = src.lead_source_id;
    }
    if (updateData.industry) {
      const ind = await Industry.findOne({ where: { industry_name: updateData.industry }, transaction });
      if (ind) fields.industry_id = ind.industry_id;
    }

    fields.updated_by = actorId;
    await lead.update(fields, { transaction });

    await AuditLog.create(
      { actor_id: actorId, action: 'edited', entity_type: 'lead', entity_id: lead.lead_id, details: { updatedFields: Object.keys(fields) } },
      { transaction }
    );

    await transaction.commit();
    return await getLeadById(id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

//===========================================================================================
//    CONVERT LEAD → Account + Contact + Deal  (Atomic Transaction)
//===========================================================================================
const convertLead = async (id, dealPayload = {}, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  const lead = await Lead.findByPk(id, {
    include: [{ model: Industry, as: 'industry', required: false }],
  });
  if (!lead) throw new Error(`Lead with ID ${id} not found`);
  if (!canAccessRecord(currentUser, lead)) {
    throw new Error('Access restricted: You do not have permission to convert this lead.');
  }
  if (lead.converted_account_id) throw new Error(`Lead ${lead.lead_code} has already been converted`);

  const transaction = await sequelize.transaction();
  try {
    // 1. Generate all codes atomically
    const [accountCode, contactCode, dealCode] = await Promise.all([
      getNextCode('ACC-', transaction),
      getNextCode('CNT-', transaction),
      getNextCode('DL-', transaction),
    ]);

    // 2. Create Account (Client Company)
    const newAccount = await Account.create(
      {
        account_code: accountCode,
        account_name: lead.company_name,
        website: lead.website || null,
        phone: lead.phone,
        industry_id: lead.industry_id,
        hq_street_address: lead.street_address,
        hq_city: lead.city,
        hq_state: lead.state_province,
        hq_country: lead.country || 'India',
        hq_postal_code: lead.postal_code,
        source_lead_id: lead.lead_id,
        owner_id: lead.owner_id || actorId,
        created_by: actorId,
        status: 'active',
      },
      { transaction }
    );

    // 3. Create Primary Contact
    const nameParts = (lead.full_name || '').trim().split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || '.';

    const newContact = await Contact.create(
      {
        contact_code: contactCode,
        first_name: firstName,
        last_name: lastName,
        designation: lead.designation || 'Primary Contact',
        email: lead.email,
        mobile_phone: lead.phone,
        account_id: newAccount.account_id,
        owner_id: lead.owner_id || actorId,
        is_decision_maker: true,
        source_lead_id: lead.lead_id,
        created_by: actorId,
      },
      { transaction }
    );

    // 4. Resolve Deal Stage
    let dealStageRecord = null;
    if (dealPayload.stage) {
      dealStageRecord = await DealStage.findOne({ where: { stage_name: dealPayload.stage }, transaction });
    }
    if (!dealStageRecord) {
      dealStageRecord = await DealStage.findOne({ where: { stage_order: 2 }, transaction });
    }

    // 5. Create Deal
    const dealAmount = dealPayload.amount !== undefined && dealPayload.amount !== ''
      ? parseFloat(String(dealPayload.amount).replace(/[^0-9.]/g, '')) || 0
      : Number(lead.estimated_deal_value) || 0;

    const expectedCloseDate = dealPayload.closeDate ? parseDDMMYYYYtoSQL(dealPayload.closeDate) : null;

    const newDeal = await Deal.create(
      {
        deal_code: dealCode,
        deal_name: `${lead.company_name} — Contract Deal`,
        account_id: newAccount.account_id,
        primary_contact_id: newContact.contact_id,
        source_lead_id: lead.lead_id,
        deal_stage_id: dealStageRecord ? dealStageRecord.deal_stage_id : 2,
        expected_value: dealAmount,
        win_probability: dealStageRecord ? parseFloat(dealStageRecord.default_probability) : 35.0,
        expected_close_date: expectedCloseDate,
        owner_id: lead.owner_id || actorId,
        status: dealStageRecord?.is_won ? 'won' : 'open',
        created_by: actorId,
      },
      { transaction }
    );

    // 6. Resolve 'Converted' status
    let convertedStatus = await LeadStatus.findOne({ where: { status_name: 'Converted' }, transaction });
    if (!convertedStatus) convertedStatus = await LeadStatus.findOne({ where: { is_terminal: true }, transaction });

    // 7. Update Lead with conversion pointers
    await lead.update(
      {
        converted_account_id: newAccount.account_id,
        converted_contact_id: newContact.contact_id,
        converted_at: new Date(),
        lead_status_id: convertedStatus ? convertedStatus.lead_status_id : lead.lead_status_id,
        updated_by: actorId,
      },
      { transaction }
    );

    // 8. Audit log
    await AuditLog.create(
      {
        actor_id: actorId,
        action: 'converted',
        entity_type: 'lead',
        entity_id: lead.lead_id,
        details: {
          lead_code: lead.lead_code,
          account_code: accountCode,
          contact_code: contactCode,
          deal_code: dealCode,
          deal_amount: dealAmount,
        },
      },
      { transaction }
    );

    await transaction.commit();

    return {
      message: 'Lead converted successfully to Account, Contact, and Deal',
      account: newAccount.toJSON(),
      contact: newContact.toJSON(),
      deal: newDeal.toJSON(),
      lead: await getLeadById(lead.lead_id),
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

//===========================================================================================
//    NOTES
//===========================================================================================
const addLeadNote = async (leadId, { noteText, isInternal = false }, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  return await Note.create({ lead_id: leadId, note_text: noteText, is_internal: isInternal, created_by: actorId });
};

const getLeadNotes = async (leadId, currentUser = null) => {
  const lead = await Lead.findByPk(leadId);
  if (!lead || !canAccessRecord(currentUser, lead)) {
    return [];
  }
  return await Note.findAll({
    where: { lead_id: leadId },
    include: [{ model: Staff, as: 'author', attributes: ['first_name', 'last_name', 'email'] }],
    order: [['created_at', 'DESC']],
  });
};

//===========================================================================================
//    ACTIVITIES
//===========================================================================================
const addLeadActivity = async (leadId, activityData, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  return await Activity.create({
    lead_id: leadId,
    title: activityData.title,
    description: activityData.description || '',
    assigned_to: activityData.assignedTo || actorId,
    start_at: activityData.startAt || new Date(),
    status: activityData.status || 'open',
    meeting_link: activityData.meetingLink || null,
    created_by: actorId,
  });
};

const getLeadActivities = async (leadId, currentUser = null) => {
  const lead = await Lead.findByPk(leadId);
  if (!lead || !canAccessRecord(currentUser, lead)) {
    return [];
  }
  return await Activity.findAll({
    where: { lead_id: leadId },
    include: [{ model: Staff, as: 'assignee', attributes: ['first_name', 'last_name', 'email'] }],
    order: [['start_at', 'DESC']],
  });
};

module.exports = {
  getLeads,
  getLeadById,
  checkDuplicate,
  createLead,
  updateLead,
  convertLead,
  addLeadNote,
  getLeadNotes,
  addLeadActivity,
  getLeadActivities,
};
