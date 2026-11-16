'use strict';

//===========================================================================================
//    MIGRATION: CREATE GAX ONBOARDING REQUESTS & AUDIT LOGS (g_axis_main)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Onboarding Requests
    await queryInterface.createTable('gax_onboarding_requests', {
      obr_id:             { type: Sequelize.CHAR(36),         primaryKey: true, allowNull: false },
      obr_source_org_id:  { type: Sequelize.CHAR(36) },
      obr_source_deal_id: { type: Sequelize.CHAR(36) },
      obr_company_name:   { type: Sequelize.STRING(200),      allowNull: false },
      obr_contact_name:   { type: Sequelize.STRING(150) },
      obr_email:          { type: Sequelize.STRING(150) },
      obr_phone:          { type: Sequelize.STRING(20) },
      obr_gst_no:         { type: Sequelize.STRING(20) },
      obr_country_id:     { type: Sequelize.CHAR(36) },
      obr_state_id:       { type: Sequelize.CHAR(36) },
      obr_city_id:        { type: Sequelize.CHAR(36) },
      obr_product_id:     { type: Sequelize.CHAR(36) },
      obr_plan_id:        { type: Sequelize.CHAR(36) },
      obr_user_count:     { type: Sequelize.INTEGER.UNSIGNED },
      obr_start_date:     { type: Sequelize.DATEONLY },
      obr_status:         { type: Sequelize.STRING(20),       defaultValue: 'pending' },
      obr_reviewed_by:    { type: Sequelize.CHAR(36) },
      obr_reviewed_at:    { type: Sequelize.DATE },
      obr_remarks:        { type: Sequelize.STRING(500) },
      obr_created_org_id: { type: Sequelize.CHAR(36) },
      obr_created_at:     { type: Sequelize.DATE,             defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      obr_updated_at:     { type: Sequelize.DATE,             defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. Platform Audit Logs
    await queryInterface.createTable('gax_audit_logs', {
      aud_id:             { type: Sequelize.BIGINT.UNSIGNED,  primaryKey: true, autoIncrement: true },
      aud_admin_id:       { type: Sequelize.CHAR(36) },
      aud_action:         { type: Sequelize.STRING(50) },
      aud_entity:         { type: Sequelize.STRING(100) },
      aud_entity_id:      { type: Sequelize.STRING(36) },
      aud_old_values:     { type: Sequelize.JSON },
      aud_new_values:     { type: Sequelize.JSON },
      aud_ip_address:     { type: Sequelize.STRING(45) },
      aud_user_agent:     { type: Sequelize.STRING(255) },
      aud_created_at:     { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('gax_audit_logs');
    await queryInterface.dropTable('gax_onboarding_requests');
  }
};
