'use strict';

//===========================================================================================
//    CRM LEADS SERVICE
//===========================================================================================

const { sequelize } = require('../../../database/connection');
const { initOrgModels } = require('../../../database/models');

/**
 * Fetch all leads (from database or sample example response)
 */
const getLeads = async () => {
  try {
    const { CrmLead } = initOrgModels(sequelize);
    const leads = await CrmLead.findAll({
      order: [['lds_created_at', 'DESC']]
    });

    if (leads && leads.length > 0) {
      return leads;
    }
  } catch (error) {
    console.warn('Database query fallback to sample leads:', error.message);
  }

  // Sample example response data matching CRM schema
  return [
    {
      lds_id: '1',
      lds_lead_no: 'LD-0001',
      lds_company: 'Acme Global Solutions',
      lds_contact: 'Vikram Mehta',
      lds_email: 'vikram@acmeglobal.com',
      lds_phone: '+919876500001',
      lds_source: 'website',
      lds_website: 'https://acmeglobal.com',
      lds_requirement: 'Full suite CRM requirement for 50 sales agents',
      lds_exp_value: 250000.00,
      lds_status: 'contacted',
      lds_branch_id: '1',
      lds_assigned_to: '3'
    },
    {
      lds_id: '2',
      lds_lead_no: 'LD-0002',
      lds_company: 'Zenith Logistics Ltd',
      lds_contact: 'Pooja Sharma',
      lds_email: 'pooja@zenithlogistics.in',
      lds_phone: '+919876500002',
      lds_source: 'referral',
      lds_website: 'https://zenithlogistics.in',
      lds_requirement: 'Pipeline tracking and sales territory management',
      lds_exp_value: 180000.00,
      lds_status: 'new',
      lds_branch_id: '1',
      lds_assigned_to: '3'
    }
  ];
};

module.exports = {
  getLeads
};
