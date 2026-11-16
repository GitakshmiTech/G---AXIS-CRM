'use strict';

//===========================================================================================
//    MIGRATION: CREATE GAX TENANT USERS (g-axis-main)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // Maps email to tenant org_id and core_user_id for routing login requests
    await queryInterface.createTable('gax_tenant_users', {
      tnu_id:           { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      tnu_org_id:       { type: Sequelize.CHAR(36),    allowNull: false }, // FK -> gax_organisations
      tnu_core_user_id: { type: Sequelize.CHAR(36),    allowNull: false }, // Points to core_users.usr_id
      tnu_email:        { type: Sequelize.STRING(150), allowNull: false }, // Lookup key during login
      tnu_is_default:   { type: Sequelize.TINYINT(1),  defaultValue: 1 },
      tnu_status:       { type: Sequelize.STRING(20),  defaultValue: 'active' },
      tnu_created_at:   { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      tnu_updated_at:   { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('gax_tenant_users');
  }
};
