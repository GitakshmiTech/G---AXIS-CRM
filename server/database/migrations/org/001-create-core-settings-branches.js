'use strict';

//===========================================================================================
//    MIGRATION: CREATE CORE SETTINGS, BRANCHES & DEPARTMENTS (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Settings
    await queryInterface.createTable('core_settings', {
      set_key:        { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
      set_value:      { type: Sequelize.JSON },
      set_updated_at: { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. Branches
    await queryInterface.createTable('core_branches', {
      brn_id:             { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      brn_code:           { type: Sequelize.STRING(30),  allowNull: false, unique: true },
      brn_name:           { type: Sequelize.STRING(150), allowNull: false },
      brn_address:        { type: Sequelize.STRING(500) },
      brn_country_id:     { type: Sequelize.CHAR(36) },
      brn_state_id:       { type: Sequelize.CHAR(36) },
      brn_city_id:        { type: Sequelize.CHAR(36) },
      brn_is_head_office: { type: Sequelize.TINYINT(1),  defaultValue: 0 },
      brn_status:         { type: Sequelize.STRING(20),  defaultValue: 'active' },
      brn_created_at:     { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      brn_updated_at:     { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 3. Departments
    await queryInterface.createTable('core_departments', {
      dep_id:         { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      dep_branch_id:  { type: Sequelize.CHAR(36) },
      dep_name:       { type: Sequelize.STRING(100), allowNull: false },
      dep_status:     { type: Sequelize.STRING(20),  defaultValue: 'active' },
      dep_created_at: { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      dep_updated_at: { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('core_departments');
    await queryInterface.dropTable('core_branches');
    await queryInterface.dropTable('core_settings');
  }
};
