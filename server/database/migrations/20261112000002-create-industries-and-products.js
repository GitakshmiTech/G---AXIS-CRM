//===========================================================================================
//    MIGRATION 02: INDUSTRIES AND PRODUCTS
//    Creates industries (linked to industry_tiers), products, and product_plans
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Industries Table
    await queryInterface.createTable("industries", {
      industry_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      industry_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      industry_tier_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "industry_tiers",
          key: "industry_tier_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });

    // 2. Products Table
    await queryInterface.createTable("products", {
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      product_code: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      product_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });

    // 3. Product Plans Table
    await queryInterface.createTable("product_plans", {
      product_plan_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "products",
          key: "product_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      plan_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      billing_cycle: {
        type: Sequelize.ENUM("monthly", "quarterly", "yearly", "one_time"),
        allowNull: false,
        defaultValue: "yearly",
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("product_plans");
    await queryInterface.dropTable("products");
    await queryInterface.dropTable("industries");
  },
};

