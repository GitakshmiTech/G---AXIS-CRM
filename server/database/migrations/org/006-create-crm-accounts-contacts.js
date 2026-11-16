'use strict';

//===========================================================================================
//    MIGRATION: CREATE CRM ACCOUNTS & CONTACTS (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Accounts
    await queryInterface.createTable('crm_accounts', {
      acc_id:          { type: Sequelize.CHAR(36),   primaryKey: true, allowNull: false },
      acc_no:          { type: Sequelize.STRING(30),  allowNull: false, unique: true },
      acc_company:     { type: Sequelize.STRING(200), allowNull: false },
      acc_industry_id: { type: Sequelize.CHAR(36) },
      acc_email:       { type: Sequelize.STRING(150) },
      acc_phone:       { type: Sequelize.STRING(20) },
      acc_gst_no:      { type: Sequelize.STRING(20) },
      acc_address:     { type: Sequelize.STRING(500) },
      acc_country_id:  { type: Sequelize.CHAR(36) },
      acc_state_id:    { type: Sequelize.CHAR(36) },
      acc_city_id:     { type: Sequelize.CHAR(36) },
      acc_lead_id:     { type: Sequelize.CHAR(36) },
      acc_conv_org_id: { type: Sequelize.CHAR(36) },
      acc_branch_id:   { type: Sequelize.CHAR(36) },
      acc_owner_id:    { type: Sequelize.CHAR(36) },
      acc_created_by:  { type: Sequelize.CHAR(36),    allowNull: false },
      acc_created_at:  { type: Sequelize.DATE,         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      acc_updated_at:  { type: Sequelize.DATE,         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. Contacts
    await queryInterface.createTable('crm_contacts', {
      cnt_id:          { type: Sequelize.CHAR(36),   primaryKey: true, allowNull: false },
      cnt_account_id:  { type: Sequelize.CHAR(36),   allowNull: false },
      cnt_name:        { type: Sequelize.STRING(150), allowNull: false },
      cnt_designation: { type: Sequelize.STRING(100) },
      cnt_email:       { type: Sequelize.STRING(150) },
      cnt_phone:       { type: Sequelize.STRING(20) },
      cnt_is_primary:  { type: Sequelize.TINYINT(1), defaultValue: 0 },
      cnt_created_by:  { type: Sequelize.CHAR(36),   allowNull: false },
      cnt_created_at:  { type: Sequelize.DATE,         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      cnt_updated_at:  { type: Sequelize.DATE,         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('crm_contacts');
    await queryInterface.dropTable('crm_accounts');
  }
};
