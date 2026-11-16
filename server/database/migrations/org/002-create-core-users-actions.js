'use strict';

//===========================================================================================
//    MIGRATION: CREATE CORE USERS, USER PRODUCTS, ACTIONS & ORG MODULES (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Users (Personal profile, authentication credentials and hierarchy)
    await queryInterface.createTable('core_users', {
      usr_id:            { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      usr_employee_code: { type: Sequelize.STRING(30),  unique: true },
      usr_name:          { type: Sequelize.STRING(150), allowNull: false },
      usr_email:         { type: Sequelize.STRING(150), allowNull: false, unique: true },
      usr_phone:         { type: Sequelize.STRING(20) },
      usr_password_hash: { type: Sequelize.STRING(255), allowNull: false },
      usr_department_id: { type: Sequelize.CHAR(36) },
      usr_reporting_to:  { type: Sequelize.CHAR(36) },
      usr_status:        { type: Sequelize.STRING(20),  defaultValue: 'active' },
      usr_created_at:    { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      usr_updated_at:    { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. User Products (Supports assigning multiple products per user, e.g. CRM, HRMS)
    await queryInterface.createTable('core_user_products', {
      cup_id:         { type: Sequelize.CHAR(36),   primaryKey: true, allowNull: false },
      cup_user_id:    { type: Sequelize.CHAR(36),   allowNull: false }, // FK -> core_users
      cup_product_id: { type: Sequelize.CHAR(36),   allowNull: false }, // Product reference (e.g. '1' for CRM)
      cup_status:     { type: Sequelize.STRING(20), defaultValue: 'active' },
      cup_created_at: { type: Sequelize.DATE,       defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      cup_updated_at: { type: Sequelize.DATE,       defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 3. Actions
    await queryInterface.createTable('core_actions', {
      act_id:   { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      act_code: { type: Sequelize.STRING(20),  allowNull: false, unique: true },
      act_name: { type: Sequelize.STRING(50),  allowNull: false }
    });

    // 4. Org Modules
    await queryInterface.createTable('core_org_modules', {
      com_module_id:  { type: Sequelize.CHAR(36),   primaryKey: true, allowNull: false },
      com_product_id: { type: Sequelize.CHAR(36),   allowNull: false },
      com_is_enabled: { type: Sequelize.TINYINT(1), defaultValue: 1 },
      com_enabled_at: { type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('core_org_modules');
    await queryInterface.dropTable('core_actions');
    await queryInterface.dropTable('core_user_products');
    await queryInterface.dropTable('core_users');
  }
};
