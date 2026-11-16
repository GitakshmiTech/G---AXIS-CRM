'use strict';

//===========================================================================================
//    MIGRATION: CREATE GAX PRODUCTS, MODULES, PLANS (g_axis_main)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Products
    await queryInterface.createTable('gax_products', {
      prd_id:           { type: Sequelize.CHAR(36),         primaryKey: true, allowNull: false },
      prd_code:         { type: Sequelize.STRING(30),        allowNull: false, unique: true },
      prd_name:         { type: Sequelize.STRING(150),       allowNull: false },
      prd_table_prefix: { type: Sequelize.STRING(10),        allowNull: false, unique: true },
      prd_description:  { type: Sequelize.STRING(500) },
      prd_base_url:     { type: Sequelize.STRING(255) },
      prd_sort_order:   { type: Sequelize.INTEGER.UNSIGNED,  defaultValue: 0 },
      prd_status:       { type: Sequelize.STRING(20),        defaultValue: 'active' },
      prd_created_at:   { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      prd_updated_at:   { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. Modules
    await queryInterface.createTable('gax_modules', {
      mod_id:               { type: Sequelize.CHAR(36),         primaryKey: true, allowNull: false },
      mod_product_id:       { type: Sequelize.CHAR(36),         allowNull: false },
      mod_parent_module_id: { type: Sequelize.CHAR(36) },
      mod_code:             { type: Sequelize.STRING(50),        allowNull: false },
      mod_name:             { type: Sequelize.STRING(150),       allowNull: false },
      mod_sort_order:       { type: Sequelize.INTEGER.UNSIGNED,  defaultValue: 0 },
      mod_status:           { type: Sequelize.STRING(20),        defaultValue: 'active' },
      mod_created_at:       { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      mod_updated_at:       { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 3. Plans
    await queryInterface.createTable('gax_plans', {
      pln_id:            { type: Sequelize.CHAR(36),         primaryKey: true, allowNull: false },
      pln_product_id:    { type: Sequelize.CHAR(36),         allowNull: false },
      pln_code:          { type: Sequelize.STRING(30),        allowNull: false, unique: true },
      pln_name:          { type: Sequelize.STRING(100),       allowNull: false },
      pln_tier:          { type: Sequelize.STRING(20) },
      pln_billing_cycle: { type: Sequelize.STRING(10) },
      pln_price:         { type: Sequelize.DECIMAL(12, 2),   defaultValue: 0 },
      pln_currency:      { type: Sequelize.CHAR(3),          defaultValue: 'INR' },
      pln_max_users:     { type: Sequelize.INTEGER.UNSIGNED },
      pln_max_branches:  { type: Sequelize.INTEGER.UNSIGNED },
      pln_trial_days:    { type: Sequelize.INTEGER.UNSIGNED,  defaultValue: 0 },
      pln_status:        { type: Sequelize.STRING(20),        defaultValue: 'active' },
      pln_created_at:    { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      pln_updated_at:    { type: Sequelize.DATE,              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 4. Plan Modules
    await queryInterface.createTable('gax_plan_modules', {
      plm_plan_id:     { type: Sequelize.CHAR(36), primaryKey: true, allowNull: false },
      plm_module_id:   { type: Sequelize.CHAR(36), primaryKey: true, allowNull: false },
      plm_limit_value: { type: Sequelize.INTEGER.UNSIGNED }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('gax_plan_modules');
    await queryInterface.dropTable('gax_plans');
    await queryInterface.dropTable('gax_modules');
    await queryInterface.dropTable('gax_products');
  }
};
