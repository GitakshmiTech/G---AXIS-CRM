'use strict';

//===========================================================================================
//    MIGRATION: CREATE GAX ORGANISATIONS & SUBSCRIPTIONS (g_axis_main)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Organisations
    await queryInterface.createTable('gax_organisations', {
      org_id:            { type: Sequelize.CHAR(36),         primaryKey: true, allowNull: false },
      org_code:          { type: Sequelize.STRING(30),        allowNull: false, unique: true },
      org_name:          { type: Sequelize.STRING(200),       allowNull: false },
      org_legal_name:    { type: Sequelize.STRING(200) },
      org_db_name:       { type: Sequelize.STRING(64),        allowNull: false, unique: true },
      org_db_host:       { type: Sequelize.STRING(100),       defaultValue: 'localhost' },
      org_db_port:       { type: Sequelize.INTEGER.UNSIGNED,  defaultValue: 3306 },
      org_email:         { type: Sequelize.STRING(150) },
      org_phone:         { type: Sequelize.STRING(20) },
      org_website:       { type: Sequelize.STRING(255) },
      org_gst_no:        { type: Sequelize.STRING(20) },
      org_pan_no:        { type: Sequelize.STRING(20) },
      org_address_line1: { type: Sequelize.STRING(255) },
      org_address_line2: { type: Sequelize.STRING(255) },
      org_country_id:    { type: Sequelize.CHAR(36) },
      org_state_id:      { type: Sequelize.CHAR(36) },
      org_city_id:       { type: Sequelize.CHAR(36) },
      org_pincode:       { type: Sequelize.STRING(10) },
      org_logo_url:      { type: Sequelize.STRING(255) },
      org_status:        { type: Sequelize.STRING(20),        defaultValue: 'pending' },
      org_activated_at:  { type: Sequelize.DATE },
      org_suspended_at:  { type: Sequelize.DATE },
      org_remarks:       { type: Sequelize.STRING(500) },
      org_created_by:    { type: Sequelize.CHAR(36) },
      org_created_at:    { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      org_updated_at:    { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. Subscriptions
    await queryInterface.createTable('gax_subscriptions', {
      sub_id:         { type: Sequelize.CHAR(36),   primaryKey: true, allowNull: false },
      sub_org_id:     { type: Sequelize.CHAR(36),   allowNull: false },
      sub_product_id: { type: Sequelize.CHAR(36),   allowNull: false },
      sub_plan_id:    { type: Sequelize.CHAR(36),   allowNull: false },
      sub_start_date: { type: Sequelize.DATEONLY,   allowNull: false },
      sub_end_date:   { type: Sequelize.DATEONLY },
      sub_auto_renew: { type: Sequelize.TINYINT(1), defaultValue: 0 },
      sub_status:     { type: Sequelize.STRING(20), defaultValue: 'trial' },
      sub_created_at: { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      sub_updated_at: { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 3. Subscription Modules
    await queryInterface.createTable('gax_subscription_modules', {
      sbm_subscription_id: { type: Sequelize.CHAR(36), primaryKey: true, allowNull: false },
      sbm_module_id:       { type: Sequelize.CHAR(36), primaryKey: true, allowNull: false }
    });

    // 4. Licences
    await queryInterface.createTable('gax_licences', {
      lic_id:              { type: Sequelize.CHAR(36),        primaryKey: true, allowNull: false },
      lic_org_id:          { type: Sequelize.CHAR(36),        allowNull: false },
      lic_subscription_id: { type: Sequelize.CHAR(36),        allowNull: false },
      lic_key:             { type: Sequelize.STRING(64),      allowNull: false, unique: true },
      lic_user_limit:      { type: Sequelize.INTEGER.UNSIGNED },
      lic_valid_from:      { type: Sequelize.DATEONLY,         allowNull: false },
      lic_valid_to:        { type: Sequelize.DATEONLY,         allowNull: false },
      lic_status:          { type: Sequelize.STRING(20),       defaultValue: 'active' },
      lic_created_at:      { type: Sequelize.DATE,             defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      lic_updated_at:      { type: Sequelize.DATE,             defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('gax_licences');
    await queryInterface.dropTable('gax_subscription_modules');
    await queryInterface.dropTable('gax_subscriptions');
    await queryInterface.dropTable('gax_organisations');
  }
};
