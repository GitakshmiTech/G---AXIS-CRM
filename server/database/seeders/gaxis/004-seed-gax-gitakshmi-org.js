'use strict';

//===========================================================================================
//    SEEDER: GAX GITAKSHMI ORGANISATION (g-axis-main)
//===========================================================================================

module.exports = {
  async up(queryInterface) {
    // 1. Organisation
    await queryInterface.bulkInsert('gax_organisations', [
      {
        org_id: '1',
        org_code: 'GITAKSHMI',
        org_name: 'Gitakshmi Technologies Private Limited',
        org_legal_name: 'Gitakshmi Technologies Private Limited',
        org_db_name: 'org_gitakshmi',
        org_db_host: 'localhost',
        org_db_port: 3306,
        org_email: 'info@gitakshmi.com',
        org_phone: '+917900000000',
        org_website: 'https://gitakshmi.com',
        org_gst_no: '24AAAAA0000A1Z5',
        org_pan_no: 'AAAAA0000A',
        org_address_line1: 'Corporate Tower, SG Highway',
        org_address_line2: 'Prahlad Nagar',
        org_country_id: '1',
        org_state_id: '1',
        org_city_id: '1',
        org_pincode: '380015',
        org_logo_url: null,
        org_status: 'active',
        org_activated_at: new Date(),
        org_suspended_at: null,
        org_remarks: 'Primary Organization',
        org_created_by: '1',
        org_created_at: new Date(),
        org_updated_at: new Date()
      }
    ], {});

    // 2. Subscriptions (Supports multiple products per org)
    await queryInterface.bulkInsert('gax_subscriptions', [
      {
        sub_id: '1',
        sub_org_id: '1',
        sub_product_id: '1', // Product 1: CRM
        sub_plan_id: '1',
        sub_start_date: new Date(),
        sub_end_date: new Date('2030-12-31'),
        sub_auto_renew: 1,
        sub_status: 'active',
        sub_created_at: new Date(),
        sub_updated_at: new Date()
      }
    ], {});

    // 3. Subscription Modules
    await queryInterface.bulkInsert('gax_subscription_modules', [
      { sbm_subscription_id: '1', sbm_module_id: '1' },
      { sbm_subscription_id: '1', sbm_module_id: '2' },
      { sbm_subscription_id: '1', sbm_module_id: '3' },
      { sbm_subscription_id: '1', sbm_module_id: '4' }
    ], {});

    // 4. Licence
    await queryInterface.bulkInsert('gax_licences', [
      {
        lic_id: '1',
        lic_org_id: '1',
        lic_subscription_id: '1',
        lic_key: 'GAXIS-GITAKSHMI-CRM-2026-ENTERPRISE-KEY',
        lic_user_limit: 100,
        lic_valid_from: new Date(),
        lic_valid_to: new Date('2030-12-31'),
        lic_status: 'active',
        lic_created_at: new Date(),
        lic_updated_at: new Date()
      }
    ], {});

    // 5. Tenant Users (Only org_id, core_user_id and email needed for login routing)
    await queryInterface.bulkInsert('gax_tenant_users', [
      {
        tnu_id: '1',
        tnu_org_id: '1',
        tnu_core_user_id: '1',
        tnu_email: 'admin@gitakshmi.com',
        tnu_is_default: 1,
        tnu_status: 'active',
        tnu_created_at: new Date(),
        tnu_updated_at: new Date()
      },
      {
        tnu_id: '2',
        tnu_org_id: '1',
        tnu_core_user_id: '2',
        tnu_email: 'marcus@gitakshmi.com',
        tnu_is_default: 1,
        tnu_status: 'active',
        tnu_created_at: new Date(),
        tnu_updated_at: new Date()
      },
      {
        tnu_id: '3',
        tnu_org_id: '1',
        tnu_core_user_id: '3',
        tnu_email: 'sarah@gitakshmi.com',
        tnu_is_default: 1,
        tnu_status: 'active',
        tnu_created_at: new Date(),
        tnu_updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('gax_tenant_users', null, {});
    await queryInterface.bulkDelete('gax_licences', null, {});
    await queryInterface.bulkDelete('gax_subscription_modules', null, {});
    await queryInterface.bulkDelete('gax_subscriptions', null, {});
    await queryInterface.bulkDelete('gax_organisations', null, {});
  }
};
