//===========================================================================================
//    DEALS MODULE SERVICE
//    Handles Deal CRUD, stage progression, pipeline data retrieval, and role scoping
//===========================================================================================

const { Op } = require('sequelize');
const { sequelize, Deal, DealStage, Account, Contact, Product, Staff, Lead, AuditLog } = require('../../database/models');
const { formatDateDDMMYYYY, formatTimeAMPM, parseDDMMYYYYtoSQL } = require('../../common/helpers/date.helper');
const { buildRowScope, canAccessRecord } = require('../../common/helpers/scope.helper');

//===========================================================================================
//    HELPER: Shape raw Deal row for API responses
//===========================================================================================
const shapeDeal = (raw) => ({
  id: raw.deal_id,
  code: raw.deal_code,
  name: raw.deal_name,
  accountId: raw.account_id,
  accountName: raw.account?.account_name || '',
  accountCode: raw.account?.account_code || '',
  contactName: raw.primaryContact ? `${raw.primaryContact.first_name} ${raw.primaryContact.last_name}`.trim() : '',
  contactEmail: raw.primaryContact?.email || '',
  productName: raw.product?.product_name || '',
  productCode: raw.product?.product_code || '',
  stage: raw.stage?.stage_name || 'Qualification',
  stageId: raw.deal_stage_id,
  stageOrder: raw.stage?.stage_order || 1,
  isWon: raw.stage?.is_won || false,
  isLost: raw.stage?.is_lost || false,
  expectedValue: raw.expected_value || 0,
  expectedArr: raw.expected_arr || 0,
  contractTermMonths: raw.contract_term_months || 12,
  winProbability: raw.win_probability || 20,
  expectedCloseDate: raw.expected_close_date ? formatDateDDMMYYYY(raw.expected_close_date) : '',
  owner: raw.owner ? `${raw.owner.first_name} ${raw.owner.last_name}` : '',
  ownerEmail: raw.owner?.email || '',
  ownerId: raw.owner_id,
  status: raw.status || 'open',
  closedAt: raw.closed_at ? formatDateDDMMYYYY(raw.closed_at) : null,
  sourceLeadId: raw.source_lead_id,
  createdDate: formatDateDDMMYYYY(raw.created_at),
  createdTime: formatTimeAMPM(raw.created_at),
});

//===========================================================================================
//    STANDARD INCLUDES for Deal queries
//===========================================================================================
const DEAL_INCLUDES = [
  { model: DealStage, as: 'stage', attributes: ['deal_stage_id', 'stage_name', 'stage_order', 'default_probability', 'is_won', 'is_lost'], required: false },
  { model: Account, as: 'account', attributes: ['account_id', 'account_code', 'account_name'], required: false },
  { model: Contact, as: 'primaryContact', attributes: ['contact_id', 'first_name', 'last_name', 'email'], required: false },
  { model: Product, as: 'product', attributes: ['product_id', 'product_code', 'product_name'], required: false },
  { model: Staff, as: 'owner', attributes: ['staff_id', 'first_name', 'last_name', 'email', 'profile_photo_url'], required: false },
];

//===========================================================================================
//    GET DEALS — Paginated, searchable, filtered list (scoped by role)
//===========================================================================================
const getDeals = async (queryParams = {}, currentUser = null) => {
  const { page = 1, limit = 10, search = '', status = 'All', stage = 'All', accountId } = queryParams;
  const offset = (Number(page) - 1) * Number(limit);

  const scopeFilter = buildRowScope(currentUser, 'owner_id');
  const where = { ...scopeFilter };

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    where[Op.or] = [
      { deal_name: { [Op.like]: term } },
      { deal_code: { [Op.like]: term } },
    ];
  }
  if (status && status !== 'All') where.status = status;
  if (accountId) where.account_id = accountId;

  const stageInclude = {
    model: DealStage,
    as: 'stage',
    attributes: ['deal_stage_id', 'stage_name', 'stage_order', 'default_probability', 'is_won', 'is_lost'],
    where: stage && stage !== 'All' ? { stage_name: stage } : undefined,
    required: !!(stage && stage !== 'All'),
  };

  const { count, rows } = await Deal.findAndCountAll({
    where,
    include: [
      stageInclude,
      { model: Account, as: 'account', attributes: ['account_id', 'account_code', 'account_name'], required: false },
      { model: Contact, as: 'primaryContact', attributes: ['contact_id', 'first_name', 'last_name', 'email'], required: false },
      { model: Product, as: 'product', attributes: ['product_id', 'product_code', 'product_name'], required: false },
      { model: Staff, as: 'owner', attributes: ['staff_id', 'first_name', 'last_name', 'email', 'profile_photo_url'], required: false },
    ],
    order: [['created_at', 'DESC']],
    limit: Number(limit),
    offset,
  });

  return {
    deals: rows.map((d) => shapeDeal(d.toJSON())),
    totalEntries: count,
    currentPage: Number(page),
    pageSize: Number(limit),
    totalPages: Math.ceil(count / Number(limit)),
  };
};

//===========================================================================================
//    GET DEAL BY ID (scoped by role)
//===========================================================================================
const getDealById = async (id, currentUser = null) => {
  const scopeFilter = buildRowScope(currentUser, 'owner_id');
  const deal = await Deal.findOne({
    where: { deal_id: id, ...scopeFilter },
    include: DEAL_INCLUDES,
  });
  if (!deal) return null;
  return shapeDeal(deal.toJSON());
};

//===========================================================================================
//    GET PIPELINE SUMMARY — All stages with deal counts and total values (scoped by role)
//===========================================================================================
const getPipelineSummary = async (currentUser = null) => {
  const scopeFilter = buildRowScope(currentUser, 'owner_id');

  const stages = await DealStage.findAll({
    where: { is_active: true },
    order: [['stage_order', 'ASC']],
  });

  const summary = await Promise.all(
    stages.map(async (stage) => {
      const deals = await Deal.findAll({
        where: {
          deal_stage_id: stage.deal_stage_id,
          status: 'open',
          ...scopeFilter,
        },
        attributes: ['deal_id', 'deal_code', 'deal_name', 'expected_value'],
      });
      return {
        stageId: stage.deal_stage_id,
        stageName: stage.stage_name,
        stageOrder: stage.stage_order,
        defaultProbability: stage.default_probability,
        isWon: stage.is_won,
        isLost: stage.is_lost,
        dealCount: deals.length,
        totalValue: deals.reduce((sum, d) => sum + Number(d.expected_value || 0), 0),
        deals: deals.map((d) => ({ id: d.deal_id, code: d.deal_code, name: d.deal_name, value: d.expected_value })),
      };
    })
  );

  return summary;
};

//===========================================================================================
//    UPDATE DEAL STAGE — Move deal through the pipeline
//===========================================================================================
const updateDealStage = async (id, stageId, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  const deal = await Deal.findByPk(id);
  if (!deal) throw new Error(`Deal ${id} not found`);

  if (!canAccessRecord(currentUser, deal)) {
    throw new Error('Access restricted: Insufficient permissions for this deal.');
  }

  const stage = await DealStage.findByPk(stageId);
  if (!stage) throw new Error(`Stage ${stageId} not found`);

  const transaction = await sequelize.transaction();
  try {
    const updateFields = {
      deal_stage_id: stageId,
      win_probability: parseFloat(stage.default_probability),
    };

    if (stage.is_won) {
      updateFields.status = 'won';
      updateFields.closed_at = new Date();
    } else if (stage.is_lost) {
      updateFields.status = 'lost';
      updateFields.closed_at = new Date();
    } else {
      updateFields.status = 'open';
      updateFields.closed_at = null;
    }

    await deal.update(updateFields, { transaction });
    await AuditLog.create(
      { actor_id: actorId, action: 'edited', entity_type: 'deal', entity_id: deal.deal_id, details: { movedToStage: stage.stage_name, status: updateFields.status } },
      { transaction }
    );

    await transaction.commit();
    return await getDealById(id, currentUser);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

//===========================================================================================
//    UPDATE DEAL — General field updates
//===========================================================================================
const updateDeal = async (id, data, currentUser = null) => {
  const actorId = currentUser?.staffId || (typeof currentUser === 'number' ? currentUser : 1);
  const deal = await Deal.findByPk(id);
  if (!deal) throw new Error(`Deal ${id} not found`);

  if (!canAccessRecord(currentUser, deal)) {
    throw new Error('Access restricted: Insufficient permissions for this deal.');
  }

  const transaction = await sequelize.transaction();
  try {
    const fields = {};
    if (data.name !== undefined) fields.deal_name = data.name;
    if (data.expectedValue !== undefined) fields.expected_value = Number(data.expectedValue) || 0;
    if (data.expectedArr !== undefined) fields.expected_arr = Number(data.expectedArr) || 0;
    if (data.contractTermMonths !== undefined) fields.contract_term_months = Number(data.contractTermMonths) || 12;
    if (data.winProbability !== undefined) fields.win_probability = Number(data.winProbability) || 0;
    if (data.expectedCloseDate !== undefined) fields.expected_close_date = parseDDMMYYYYtoSQL(data.expectedCloseDate);
    if (data.primaryContactId !== undefined) fields.primary_contact_id = data.primaryContactId;
    if (data.primaryProductId !== undefined) fields.primary_product_id = data.primaryProductId;
    if (data.ownerId !== undefined && currentUser?.roleCode !== 'BDE') fields.owner_id = data.ownerId;
    if (data.stageId !== undefined) fields.deal_stage_id = data.stageId;

    await deal.update(fields, { transaction });
    await AuditLog.create(
      { actor_id: actorId, action: 'edited', entity_type: 'deal', entity_id: deal.deal_id, details: { updatedFields: Object.keys(fields) } },
      { transaction }
    );

    await transaction.commit();
    return await getDealById(id, currentUser);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = { getDeals, getDealById, getPipelineSummary, updateDeal, updateDealStage };
