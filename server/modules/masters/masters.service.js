//===========================================================================================
//    MASTERS MODULE SERVICE
//    Provides dropdown and lookup options for Leads, Accounts, Contacts, and Deals
//===========================================================================================

const {
  LeadStatus,
  LeadSource,
  Industry,
  Product,
  DealStage,
  Staff,
} = require('../../database/models');

/**
 * Fetch all dropdown options required for Leads & Deals workflows
 */
const getLeadOptions = async () => {
  const [statuses, sources, industries, products, stages, staff] = await Promise.all([
    LeadStatus.findAll({
      where: { is_active: true },
      order: [['stage_order', 'ASC']],
      attributes: ['lead_status_id', 'status_name', 'stage_order', 'allows_conversion', 'is_terminal'],
    }),
    LeadSource.findAll({
      where: { is_active: true },
      order: [['source_name', 'ASC']],
      attributes: ['lead_source_id', 'source_name'],
    }),
    Industry.findAll({
      where: { is_active: true },
      order: [['industry_name', 'ASC']],
      attributes: ['industry_id', 'industry_name'],
    }),
    Product.findAll({
      where: { is_active: true },
      order: [['product_name', 'ASC']],
      attributes: ['product_id', 'product_code', 'product_name'],
    }),
    DealStage.findAll({
      where: { is_active: true },
      order: [['stage_order', 'ASC']],
      attributes: ['deal_stage_id', 'stage_name', 'stage_order', 'default_probability', 'is_won', 'is_lost'],
    }),
    Staff.findAll({
      where: { status: 'active' },
      order: [['first_name', 'ASC']],
      attributes: ['staff_id', 'employee_code', 'first_name', 'last_name', 'email', 'designation', 'profile_photo_url'],
    }),
  ]);

  return {
    statuses: statuses.map((s) => ({
      id: s.lead_status_id,
      name: s.status_name,
      order: s.stage_order,
      allowsConversion: s.allows_conversion,
      isTerminal: s.is_terminal,
    })),
    sources: sources.map((src) => ({
      id: src.lead_source_id,
      name: src.source_name,
    })),
    industries: industries.map((ind) => ({
      id: ind.industry_id,
      name: ind.industry_name,
    })),
    products: products.map((p) => ({
      id: p.product_id,
      code: p.product_code,
      name: p.product_name,
    })),
    dealStages: stages.map((stg) => ({
      id: stg.deal_stage_id,
      name: stg.stage_name,
      order: stg.stage_order,
      probability: stg.default_probability,
      isWon: stg.is_won,
      isLost: stg.is_lost,
    })),
    staffMembers: staff.map((st) => ({
      id: st.staff_id,
      code: st.employee_code,
      name: `${st.first_name} ${st.last_name}`,
      email: st.email,
      designation: st.designation,
      avatar: st.profile_photo_url,
    })),
    priorities: ['High', 'Medium', 'Low'],
    employeeScales: ['0 - 50', '50 - 200', '200 - 500', '500+'],
  };
};

module.exports = {
  getLeadOptions,
};

