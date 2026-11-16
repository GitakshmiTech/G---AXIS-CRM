'use strict';

//===========================================================================================
//    MIGRATION: CREATE CRM LEADS & FOLLOWUPS (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Leads
    await queryInterface.createTable('crm_leads', {
      lds_id:          { type: Sequelize.CHAR(36),        primaryKey: true, allowNull: false },
      lds_lead_no:     { type: Sequelize.STRING(30),       allowNull: false, unique: true },
      lds_company:     { type: Sequelize.STRING(200),      allowNull: false },
      lds_contact:     { type: Sequelize.STRING(150) },
      lds_email:       { type: Sequelize.STRING(150) },
      lds_phone:       { type: Sequelize.STRING(20) },
      lds_source:      { type: Sequelize.STRING(50) },
      lds_website:     { type: Sequelize.STRING(255) },
      lds_industry_id: { type: Sequelize.CHAR(36) },
      lds_city_id:     { type: Sequelize.CHAR(36) },
      lds_requirement: { type: Sequelize.STRING(1000) },
      lds_exp_value:   { type: Sequelize.DECIMAL(12, 2) },
      lds_status:      { type: Sequelize.STRING(20),       defaultValue: 'new' },
      lds_lost_reason: { type: Sequelize.STRING(255) },
      lds_branch_id:   { type: Sequelize.CHAR(36) },
      lds_assigned_to: { type: Sequelize.CHAR(36) },
      lds_created_by:  { type: Sequelize.CHAR(36),        allowNull: false },
      lds_updated_by:  { type: Sequelize.CHAR(36) },
      lds_created_at:  { type: Sequelize.DATE,             defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      lds_updated_at:  { type: Sequelize.DATE,             defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. Followups
    await queryInterface.createTable('crm_followups', {
      flw_id:          { type: Sequelize.CHAR(36),   primaryKey: true, allowNull: false },
      flw_lead_id:     { type: Sequelize.CHAR(36) },
      flw_deal_id:     { type: Sequelize.CHAR(36) },
      flw_type:        { type: Sequelize.STRING(20), allowNull: false },
      flw_at:          { type: Sequelize.DATE,        allowNull: false },
      flw_notes:       { type: Sequelize.STRING(1000) },
      flw_outcome:     { type: Sequelize.STRING(255) },
      flw_next_at:     { type: Sequelize.DATE },
      flw_status:      { type: Sequelize.STRING(20),  defaultValue: 'planned' },
      flw_assigned_to: { type: Sequelize.CHAR(36) },
      flw_created_by:  { type: Sequelize.CHAR(36),   allowNull: false },
      flw_created_at:  { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      flw_updated_at:  { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('crm_followups');
    await queryInterface.dropTable('crm_leads');
  }
};
