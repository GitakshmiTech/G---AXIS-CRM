'use strict';

//===========================================================================================
//    SEEDER: CORE USERS, USER ROLES & USER PRODUCTS (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface) {
    // 1. Core Users (Internal profile & authentication details)
    await queryInterface.bulkInsert('core_users', [
      {
        usr_id: '1',
        usr_employee_code: 'EMP-001',
        usr_name: 'Arthur Pendelton',
        usr_email: 'admin@gitakshmi.com',
        usr_phone: '+919876543210',
        usr_password_hash: '$2b$10$hKDVYx8LwO6o07Y9yq0e2eHlM0e80Xp9sQ8G1C1p1O6u4x4Z8j7Ce', // Admin@123
        usr_department_id: '1',
        usr_reporting_to: null,
        usr_status: 'active',
        usr_created_at: new Date(),
        usr_updated_at: new Date()
      },
      {
        usr_id: '2',
        usr_employee_code: 'EMP-002',
        usr_name: 'Marcus Vance',
        usr_email: 'marcus@gitakshmi.com',
        usr_phone: '+919876543211',
        usr_password_hash: '$2b$10$hKDVYx8LwO6o07Y9yq0e2eHlM0e80Xp9sQ8G1C1p1O6u4x4Z8j7Ce', // Admin@123
        usr_department_id: '1',
        usr_reporting_to: '1',
        usr_status: 'active',
        usr_created_at: new Date(),
        usr_updated_at: new Date()
      },
      {
        usr_id: '3',
        usr_employee_code: 'EMP-003',
        usr_name: 'Sarah Jenkins',
        usr_email: 'sarah@gitakshmi.com',
        usr_phone: '+919876543212',
        usr_password_hash: '$2b$10$hKDVYx8LwO6o07Y9yq0e2eHlM0e80Xp9sQ8G1C1p1O6u4x4Z8j7Ce', // Admin@123
        usr_department_id: '1',
        usr_reporting_to: '2',
        usr_status: 'active',
        usr_created_at: new Date(),
        usr_updated_at: new Date()
      }
    ], {});

    // 2. User Roles
    await queryInterface.bulkInsert('core_user_roles', [
      { url_user_id: '1', url_role_id: '1', url_branch_id: '1' },
      { url_user_id: '2', url_role_id: '2', url_branch_id: '1' },
      { url_user_id: '3', url_role_id: '3', url_branch_id: '1' }
    ], {});

    // 3. User Products (Supports multiple products per user)
    await queryInterface.bulkInsert('core_user_products', [
      {
        cup_id: '1',
        cup_user_id: '1',
        cup_product_id: '1', // CRM
        cup_status: 'active',
        cup_created_at: new Date(),
        cup_updated_at: new Date()
      },
      {
        cup_id: '2',
        cup_user_id: '2',
        cup_product_id: '1', // CRM
        cup_status: 'active',
        cup_created_at: new Date(),
        cup_updated_at: new Date()
      },
      {
        cup_id: '3',
        cup_user_id: '3',
        cup_product_id: '1', // CRM
        cup_status: 'active',
        cup_created_at: new Date(),
        cup_updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('core_user_products', null, {});
    await queryInterface.bulkDelete('core_user_roles', null, {});
    await queryInterface.bulkDelete('core_users', null, {});
  }
};
