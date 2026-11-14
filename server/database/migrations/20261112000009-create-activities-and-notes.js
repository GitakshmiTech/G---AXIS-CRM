//===========================================================================================
//    MIGRATION 09: ACTIVITIES, NOTES, AND AUDIT LOGS
//    Creates activity scheduling, notes, and tamper-evident audit logging
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Activities Table
    await queryInterface.createTable("activities", {
      activity_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      activity_type_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "activity_types",
          key: "activity_type_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      title: {
        type: Sequelize.STRING(190),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lead_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "leads",
          key: "lead_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      account_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "accounts",
          key: "account_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      contact_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "contacts",
          key: "contact_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      deal_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "deals",
          key: "deal_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      assigned_to: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "staff",
          key: "staff_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      start_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      meeting_link: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("open", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "open",
      },
      completed_at: {
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
    });

    // 2. Notes Table
    await queryInterface.createTable("notes", {
      note_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      lead_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "leads",
          key: "lead_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      account_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "accounts",
          key: "account_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      contact_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "contacts",
          key: "contact_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      deal_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "deals",
          key: "deal_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      note_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_internal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    });

    // 3. Audit Logs Table
    await queryInterface.createTable("audit_logs", {
      audit_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      occurred_at: {
        type: Sequelize.DATE(3),
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)"),
      },
      actor_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "staff",
          key: "staff_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      action: {
        type: Sequelize.ENUM(
          "created",
          "edited",
          "deleted",
          "converted",
          "approved",
          "rejected",
          "login",
          "logout",
          "exported",
          "imported"
        ),
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      details: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      verification_hash: {
        type: Sequelize.CHAR(64),
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("audit_logs");
    await queryInterface.dropTable("notes");
    await queryInterface.dropTable("activities");
  },
};

