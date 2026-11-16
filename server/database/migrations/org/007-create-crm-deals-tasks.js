'use strict';

//===========================================================================================
//    MIGRATION: CREATE CRM DEALS & TASKS (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Deals
    await queryInterface.createTable('crm_deals', {
      deal_id:             { type: Sequelize.CHAR(36),        primaryKey: true, allowNull: false },
      deal_no:             { type: Sequelize.STRING(30),       allowNull: false, unique: true },
      deal_title:          { type: Sequelize.STRING(200),      allowNull: false },
      deal_account_id:     { type: Sequelize.CHAR(36),        allowNull: false },
      deal_lead_id:        { type: Sequelize.CHAR(36) },
      deal_product_id:     { type: Sequelize.CHAR(36) },
      deal_plan_id:        { type: Sequelize.CHAR(36) },
      deal_user_count:     { type: Sequelize.INTEGER.UNSIGNED },
      deal_value:          { type: Sequelize.DECIMAL(12, 2) },
      deal_stage:          { type: Sequelize.STRING(20),       defaultValue: 'prospect' },
      deal_probability:    { type: Sequelize.TINYINT.UNSIGNED },
      deal_close_date:     { type: Sequelize.DATEONLY },
      deal_closed_at:      { type: Sequelize.DATE },
      deal_lost_reason:    { type: Sequelize.STRING(255) },
      deal_onboard_req_id: { type: Sequelize.CHAR(36) },
      deal_branch_id:      { type: Sequelize.CHAR(36) },
      deal_owner_id:       { type: Sequelize.CHAR(36) },
      deal_created_by:     { type: Sequelize.CHAR(36),         allowNull: false },
      deal_created_at:     { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deal_updated_at:     { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. Tasks
    await queryInterface.createTable('crm_tasks', {
      tsk_id:          { type: Sequelize.CHAR(36),   primaryKey: true, allowNull: false },
      tsk_title:       { type: Sequelize.STRING(200), allowNull: false },
      tsk_description: { type: Sequelize.STRING(1000) },
      tsk_rel_type:    { type: Sequelize.STRING(20) }, // lead / account / deal
      tsk_rel_id:      { type: Sequelize.STRING(36) },
      tsk_due_at:      { type: Sequelize.DATE },
      tsk_priority:    { type: Sequelize.STRING(10),  defaultValue: 'medium' },
      tsk_status:      { type: Sequelize.STRING(20),  defaultValue: 'open' },
      tsk_assigned_to: { type: Sequelize.CHAR(36) },
      tsk_created_by:  { type: Sequelize.CHAR(36),    allowNull: false },
      tsk_created_at:  { type: Sequelize.DATE,         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      tsk_updated_at:  { type: Sequelize.DATE,         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('crm_tasks');
    await queryInterface.dropTable('crm_deals');
  }
};
