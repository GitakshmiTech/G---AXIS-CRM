'use strict';

//===========================================================================================
//    SEEDER: CORE SETTINGS & BRANCHES (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface) {
    // 1. Settings
    await queryInterface.bulkInsert('core_settings', [
      {
        set_key: 'general_locale',
        set_value: JSON.stringify({
          timezone: 'Asia/Kolkata',
          currency: 'INR',
          date_format: 'DD/MM/YYYY',
          time_format: '12h'
        }),
        set_updated_at: new Date()
      },
      {
        set_key: 'crm_preferences',
        set_value: JSON.stringify({
          lead_code_prefix: 'LD-',
          lead_code_digits: 4,
          auto_assignment: 'round_robin',
          default_stage: 'new'
        }),
        set_updated_at: new Date()
      }
    ], {});

    // 2. Branches
    await queryInterface.bulkInsert('core_branches', [
      {
        brn_id: '1',
        brn_code: 'HO-AHM',
        brn_name: 'Head Office - Ahmedabad',
        brn_address: 'Corporate Tower, SG Highway, Ahmedabad',
        brn_country_id: '1',
        brn_state_id: '1',
        brn_city_id: '1',
        brn_is_head_office: 1,
        brn_status: 'active',
        brn_created_at: new Date(),
        brn_updated_at: new Date()
      }
    ], {});

    // 3. Departments
    await queryInterface.bulkInsert('core_departments', [
      {
        dep_id: '1',
        dep_branch_id: '1',
        dep_name: 'Sales & Business Development',
        dep_status: 'active',
        dep_created_at: new Date(),
        dep_updated_at: new Date()
      },
      {
        dep_id: '2',
        dep_branch_id: '1',
        dep_name: 'Management & Operations',
        dep_status: 'active',
        dep_created_at: new Date(),
        dep_updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('core_departments', null, {});
    await queryInterface.bulkDelete('core_branches', null, {});
    await queryInterface.bulkDelete('core_settings', null, {});
  }
};
