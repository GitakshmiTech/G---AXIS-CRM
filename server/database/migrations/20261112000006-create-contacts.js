//===========================================================================================
//    MIGRATION 06: CONTACTS (CLIENT CONTACT PERSONS)
//    Creates contacts table linked to accounts
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("contacts", {
      contact_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      contact_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      first_name: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      designation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(190),
        allowNull: false,
      },
      office_phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      mobile_phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      account_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "accounts",
          key: "account_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      is_decision_maker: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      source_lead_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
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
    await queryInterface.dropTable("contacts");
  },
};

