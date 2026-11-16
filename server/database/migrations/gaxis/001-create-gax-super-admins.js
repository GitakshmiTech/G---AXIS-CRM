'use strict';

//===========================================================================================
//    MIGRATION: CREATE GAX_SUPER_ADMINS (g_axis_main)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gax_super_admins', {
      adm_id:            { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      adm_name:          { type: Sequelize.STRING(150), allowNull: false },
      adm_email:         { type: Sequelize.STRING(150), allowNull: false, unique: true },
      adm_phone:         { type: Sequelize.STRING(20) },
      adm_password_hash: { type: Sequelize.STRING(255), allowNull: false },
      adm_mfa_enabled:   { type: Sequelize.TINYINT(1),  defaultValue: 0 },
      adm_mfa_secret:    { type: Sequelize.STRING(255) },
      adm_status:        { type: Sequelize.STRING(20),  defaultValue: 'active' },
      adm_last_login_at: { type: Sequelize.DATE },
      adm_created_at:    { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      adm_updated_at:    { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('gax_super_admins');
  }
};
