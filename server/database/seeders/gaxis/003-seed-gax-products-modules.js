'use strict';

//===========================================================================================
//    SEEDER: GAX PRODUCTS & MODULES (g-axis-main)
//===========================================================================================

module.exports = {
  async up(queryInterface) {
    // 1. CRM Product
    await queryInterface.bulkInsert('gax_products', [
      {
        prd_id: '1',
        prd_code: 'CRM',
        prd_name: 'G-CRM',
        prd_table_prefix: 'crm',
        prd_description: 'Enterprise Customer Relationship Management and Sales Pipeline',
        prd_base_url: '/crm',
        prd_sort_order: 1,
        prd_status: 'active',
        prd_created_at: new Date(),
        prd_updated_at: new Date()
      }
    ], {});

    // 2. CRM Modules
    await queryInterface.bulkInsert('gax_modules', [
      {
        mod_id: '1',
        mod_product_id: '1',
        mod_parent_module_id: null,
        mod_code: 'crm.leads',
        mod_name: 'Leads Management',
        mod_sort_order: 1,
        mod_status: 'active',
        mod_created_at: new Date(),
        mod_updated_at: new Date()
      },
      {
        mod_id: '2',
        mod_product_id: '1',
        mod_parent_module_id: null,
        mod_code: 'crm.accounts',
        mod_name: 'Accounts & Contacts',
        mod_sort_order: 2,
        mod_status: 'active',
        mod_created_at: new Date(),
        mod_updated_at: new Date()
      },
      {
        mod_id: '3',
        mod_product_id: '1',
        mod_parent_module_id: null,
        mod_code: 'crm.deals',
        mod_name: 'Deals & Opportunities',
        mod_sort_order: 3,
        mod_status: 'active',
        mod_created_at: new Date(),
        mod_updated_at: new Date()
      },
      {
        mod_id: '4',
        mod_product_id: '1',
        mod_parent_module_id: null,
        mod_code: 'crm.tasks',
        mod_name: 'Tasks & Followups',
        mod_sort_order: 4,
        mod_status: 'active',
        mod_created_at: new Date(),
        mod_updated_at: new Date()
      }
    ], {});

    // 3. CRM Enterprise Plan
    await queryInterface.bulkInsert('gax_plans', [
      {
        pln_id: '1',
        pln_product_id: '1',
        pln_code: 'CRM_ENTERPRISE',
        pln_name: 'CRM Enterprise Suite',
        pln_tier: 'enterprise',
        pln_billing_cycle: 'yearly',
        pln_price: 150000.00,
        pln_currency: 'INR',
        pln_max_users: 100,
        pln_max_branches: 10,
        pln_trial_days: 14,
        pln_status: 'active',
        pln_created_at: new Date(),
        pln_updated_at: new Date()
      }
    ], {});

    // 4. Plan Modules
    await queryInterface.bulkInsert('gax_plan_modules', [
      { plm_plan_id: '1', plm_module_id: '1', plm_limit_value: null },
      { plm_plan_id: '1', plm_module_id: '2', plm_limit_value: null },
      { plm_plan_id: '1', plm_module_id: '3', plm_limit_value: null },
      { plm_plan_id: '1', plm_module_id: '4', plm_limit_value: null }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('gax_plan_modules', null, {});
    await queryInterface.bulkDelete('gax_plans', null, {});
    await queryInterface.bulkDelete('gax_modules', null, {});
    await queryInterface.bulkDelete('gax_products', null, {});
  }
};
