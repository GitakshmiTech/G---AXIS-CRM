//===========================================================================================
//    MIGRATION 01: MASTER LOOKUPS
//    Creates baseline lookup tables: roles, departments, branches, territories,
//    lead sources, creation methods, lead statuses, deal stages, tiers, account types,
//    lost reasons, and activity types
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Roles
    await queryInterface.createTable("roles", {
      role_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      role_code: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      role_name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      role_type: { type: Sequelize.ENUM("system", "custom"), allowNull: false, defaultValue: "custom" },
      description: { type: Sequelize.STRING(255), allowNull: true },
      status: { type: Sequelize.ENUM("active", "inactive"), allowNull: false, defaultValue: "active" },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") },
    });

    // 2. Departments
    await queryInterface.createTable("departments", {
      department_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      department_name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    // 3. Branches
    await queryInterface.createTable("branches", {
      branch_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      branch_code: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      branch_name: { type: Sequelize.STRING(150), allowNull: false },
      company_name: { type: Sequelize.STRING(150), allowNull: true },
      street_address: { type: Sequelize.STRING(255), allowNull: true },
      city: { type: Sequelize.STRING(100), allowNull: true },
      state: { type: Sequelize.STRING(100), allowNull: true },
      country: { type: Sequelize.STRING(100), allowNull: true },
      postal_code: { type: Sequelize.STRING(20), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") },
    });

    // 4. Sales Territories
    await queryInterface.createTable("sales_territories", {
      territory_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      territory_name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      region: { type: Sequelize.STRING(100), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    // 5. Lead Sources
    await queryInterface.createTable("lead_sources", {
      lead_source_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      source_name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    // 6. Lead Creation Methods
    await queryInterface.createTable("lead_creation_methods", {
      creation_method_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      method_name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    // 7. Lead Statuses (Pipeline Stages)
    await queryInterface.createTable("lead_statuses", {
      lead_status_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      status_name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      stage_order: { type: Sequelize.SMALLINT, allowNull: false },
      allows_conversion: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_terminal: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    // 8. Deal Stages
    await queryInterface.createTable("deal_stages", {
      deal_stage_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      stage_name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      stage_order: { type: Sequelize.SMALLINT, allowNull: false },
      default_probability: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 0.00 },
      is_won: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_lost: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    // 9. Industry Tiers
    await queryInterface.createTable("industry_tiers", {
      industry_tier_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      tier_name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    // 10. Account Types
    await queryInterface.createTable("account_types", {
      account_type_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      type_name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    // 11. Lost Reasons
    await queryInterface.createTable("lost_reasons", {
      lost_reason_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      reason_name: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      applies_to: { type: Sequelize.ENUM("lead", "deal", "both"), allowNull: false, defaultValue: "both" },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    // 12. Activity Types
    await queryInterface.createTable("activity_types", {
      activity_type_id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      type_name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("activity_types");
    await queryInterface.dropTable("lost_reasons");
    await queryInterface.dropTable("account_types");
    await queryInterface.dropTable("industry_tiers");
    await queryInterface.dropTable("deal_stages");
    await queryInterface.dropTable("lead_statuses");
    await queryInterface.dropTable("lead_creation_methods");
    await queryInterface.dropTable("lead_sources");
    await queryInterface.dropTable("sales_territories");
    await queryInterface.dropTable("branches");
    await queryInterface.dropTable("departments");
    await queryInterface.dropTable("roles");
  },
};

