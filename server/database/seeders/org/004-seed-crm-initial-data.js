'use strict';

//===========================================================================================
//    SEEDER: CRM INITIAL DATA (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface) {
    // 1. Leads
    await queryInterface.bulkInsert('crm_leads', [
      {
        lds_id: '1',
        lds_lead_no: 'LD-0001',
        lds_company: 'Acme Global Solutions',
        lds_contact: 'Vikram Mehta',
        lds_email: 'vikram@acmeglobal.com',
        lds_phone: '+919876500001',
        lds_source: 'website',
        lds_website: 'https://acmeglobal.com',
        lds_industry_id: '1',
        lds_city_id: '1',
        lds_requirement: 'Full suite CRM requirement for 50 sales agents',
        lds_exp_value: 250000.00,
        lds_status: 'contacted',
        lds_lost_reason: null,
        lds_branch_id: '1',
        lds_assigned_to: '3',
        lds_created_by: '1',
        lds_updated_by: '3',
        lds_created_at: new Date(),
        lds_updated_at: new Date()
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
        lds_industry_id: '2',
        lds_city_id: '2',
        lds_requirement: 'Pipeline tracking and sales territory management',
        lds_exp_value: 180000.00,
        lds_status: 'new',
        lds_lost_reason: null,
        lds_branch_id: '1',
        lds_assigned_to: '3',
        lds_created_by: '3',
        lds_updated_by: null,
        lds_created_at: new Date(),
        lds_updated_at: new Date()
      }
    ], {});

    // 2. Accounts
    await queryInterface.bulkInsert('crm_accounts', [
      {
        acc_id: '1',
        acc_no: 'ACC-0001',
        acc_company: 'NovaTech Enterprises',
        acc_industry_id: '1',
        acc_email: 'contact@novatech.com',
        acc_phone: '+919876500010',
        acc_gst_no: '24NOVAT0000A1Z1',
        acc_address: '101 Tech Park, Infocity, Gandhinagar',
        acc_country_id: '1',
        acc_state_id: '1',
        acc_city_id: '1',
        acc_lead_id: null,
        acc_conv_org_id: null,
        acc_branch_id: '1',
        acc_owner_id: '3',
        acc_created_by: '1',
        acc_created_at: new Date(),
        acc_updated_at: new Date()
      }
    ], {});

    // 3. Contacts
    await queryInterface.bulkInsert('crm_contacts', [
      {
        cnt_id: '1',
        cnt_account_id: '1',
        cnt_name: 'Rajesh Patel',
        cnt_designation: 'Managing Director',
        cnt_email: 'rajesh@novatech.com',
        cnt_phone: '+919876500011',
        cnt_is_primary: 1,
        cnt_created_by: '1',
        cnt_created_at: new Date(),
        cnt_updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('crm_contacts', null, {});
    await queryInterface.bulkDelete('crm_accounts', null, {});
    await queryInterface.bulkDelete('crm_leads', null, {});
  }
};
