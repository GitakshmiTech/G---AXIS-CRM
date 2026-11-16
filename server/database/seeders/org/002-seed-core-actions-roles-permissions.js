'use strict';

//===========================================================================================
//    SEEDER: CORE ACTIONS, ROLES & PERMISSIONS (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface) {
    // 1. Actions
    await queryInterface.bulkInsert('core_actions', [
      { act_id: '1', act_code: 'view',    act_name: 'View' },
      { act_id: '2', act_code: 'create',  act_name: 'Create' },
      { act_id: '3', act_code: 'edit',    act_name: 'Edit' },
      { act_id: '4', act_code: 'delete',  act_name: 'Delete' },
      { act_id: '5', act_code: 'approve', act_name: 'Approve' },
      { act_id: '6', act_code: 'export',  act_name: 'Export' }
    ], {});

    // 2. Roles
    await queryInterface.bulkInsert('core_roles', [
      {
        rol_id: '1',
        rol_name: 'CRM Admin',
        rol_description: 'Full administrative access across all records and tenant settings',
        rol_data_scope: 'all',
        rol_status: 'active',
        rol_created_by: '1',
        rol_created_at: new Date(),
        rol_updated_at: new Date()
      },
      {
        rol_id: '2',
        rol_name: 'Sales Manager',
        rol_description: 'Team lead oversight with visibility across assigned team members',
        rol_data_scope: 'team',
        rol_status: 'active',
        rol_created_by: '1',
        rol_created_at: new Date(),
        rol_updated_at: new Date()
      },
      {
        rol_id: '3',
        rol_name: 'BDE',
        rol_description: 'Business Development Executive with own lead pipeline ownership',
        rol_data_scope: 'own',
        rol_status: 'active',
        rol_created_by: '1',
        rol_created_at: new Date(),
        rol_updated_at: new Date()
      }
    ], {});

    // 3. Subscribed Modules for CRM
    await queryInterface.bulkInsert('core_org_modules', [
      {
        com_module_id: '1',
        com_product_id: '1',
        com_is_enabled: 1,
        com_enabled_at: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('core_org_modules', null, {});
    await queryInterface.bulkDelete('core_roles', null, {});
    await queryInterface.bulkDelete('core_actions', null, {});
  }
};
