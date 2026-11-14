//===========================================================================================
//    MIGRATION 05: ACCOUNTS (CLIENT COMPANIES)
//    Creates accounts table for client organizations
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("accounts", {
      account_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      account_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      account_name: {
        type: Sequelize.STRING(190),
        allowNull: false,
      },
      domain: {
        type: Sequelize.STRING(190),
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      industry_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "industries",
          key: "industry_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      account_type_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "account_types",
          key: "account_type_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      employee_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      annual_revenue: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },
      owner_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "staff",
          key: "staff_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      hq_street_address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      hq_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      hq_state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      hq_country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      hq_postal_code: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      regional_presence: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      source_lead_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
      created_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "staff",
          key: "staff_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("accounts");
  },
};

