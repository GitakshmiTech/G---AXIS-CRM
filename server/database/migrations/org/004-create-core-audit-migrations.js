'use strict';

//===========================================================================================
//    MIGRATION: CREATE CORE AUDIT LOGS & MIGRATIONS (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Audit Logs
    await queryInterface.createTable('core_audit_logs', {
      cal_id:         { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      cal_user_id:    { type: Sequelize.CHAR(36),        allowNull: false },
      cal_action:     { type: Sequelize.STRING(50) },
      cal_entity:     { type: Sequelize.STRING(100) },
      cal_entity_id:  { type: Sequelize.STRING(36) },
      cal_old_values: { type: Sequelize.JSON },
      cal_new_values: { type: Sequelize.JSON },
      cal_ip_address: { type: Sequelize.STRING(45) },
      cal_created_at: { type: Sequelize.DATE,             defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 2. Migrations
    await queryInterface.createTable('core_migrations', {
      cmg_id:           { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      cmg_product_code: { type: Sequelize.STRING(30),  allowNull: false },
      cmg_file_name:    { type: Sequelize.STRING(255), allowNull: false },
      cmg_run_at:       { type: Sequelize.DATE,         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('core_migrations');
    await queryInterface.dropTable('core_audit_logs');
  }
};
