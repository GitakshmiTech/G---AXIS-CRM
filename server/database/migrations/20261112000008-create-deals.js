//===========================================================================================
//    MIGRATION 08: DEALS AND DEAL STAGE HISTORY
//    Creates deals pipeline table and stage audit trail
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Deals Table
    await queryInterface.createTable("deals", {
      deal_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      deal_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      deal_name: {
        type: Sequelize.STRING(190),
        allowNull: false,
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
      primary_contact_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "contacts",
          key: "contact_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      source_lead_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "leads",
          key: "lead_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      primary_product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "products",
          key: "product_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      deal_stage_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "deal_stages",
          key: "deal_stage_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      expected_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      expected_arr: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0.00,
      },
      contract_term_months: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: true,
        defaultValue: 12,
      },
      win_probability: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      expected_close_date: {
        type: Sequelize.DATEONLY,
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
      status: {
        type: Sequelize.ENUM("open", "won", "lost"),
        allowNull: false,
        defaultValue: "open",
      },
      lost_reason_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "lost_reasons",
          key: "lost_reason_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      closed_at: {
        type: Sequelize.DATE,
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

    // 2. Deal Stage History
    await queryInterface.createTable("deal_stage_history", {
      history_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      deal_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "deals",
          key: "deal_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      from_stage_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "deal_stages",
          key: "deal_stage_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      to_stage_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "deal_stages",
          key: "deal_stage_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      changed_by: {
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
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("deal_stage_history");
    await queryInterface.dropTable("deals");
  },
};

