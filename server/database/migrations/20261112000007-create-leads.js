//===========================================================================================
//    MIGRATION 07: LEADS AND LEAD ASSOCIATIONS
//    Creates leads table, product interest junction, and status history log
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Leads Table
    await queryInterface.createTable("leads", {
      lead_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      lead_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(190),
        allowNull: false,
        unique: true,
      },
      secondary_email: {
        type: Sequelize.STRING(190),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      office_phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      skype_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      company_name: {
        type: Sequelize.STRING(190),
        allowNull: false,
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
      employee_scale: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "0 - 50",
      },
      workforce_size: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      annual_revenue: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      lead_source_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "lead_sources",
          key: "lead_source_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      creation_method_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "lead_creation_methods",
          key: "creation_method_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      estimated_deal_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0.00,
      },
      lead_status_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "lead_statuses",
          key: "lead_status_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
      assignment_status: {
        type: Sequelize.ENUM("unassigned", "assigned", "reassigned"),
        allowNull: false,
        defaultValue: "unassigned",
      },
      assignment_type: {
        type: Sequelize.ENUM("manual", "round_robin", "weighted", "geography", "ai_match"),
        allowNull: false,
        defaultValue: "manual",
      },
      is_draft: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      qualification_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      discovery_summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      executive_background: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lead_health: {
        type: Sequelize.ENUM("hot", "warm", "cold"),
        allowNull: true,
        defaultValue: "warm",
      },
      deal_signal: {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: "Medium",
      },
      street_address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      state_province: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: "India",
      },
      postal_code: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      sla_due_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      first_response_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sla_breached: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      converted_account_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "accounts",
          key: "account_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      converted_contact_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "contacts",
          key: "contact_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      converted_at: {
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
      updated_by: {
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

    // 2. Lead Product Interests (Junction)
    await queryInterface.createTable("lead_product_interests", {
      lead_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        references: {
          model: "leads",
          key: "lead_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        references: {
          model: "products",
          key: "product_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 3. Lead Status History
    await queryInterface.createTable("lead_status_history", {
      history_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      lead_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "leads",
          key: "lead_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      from_status_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "lead_statuses",
          key: "lead_status_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      to_status_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "lead_statuses",
          key: "lead_status_id",
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
      remarks: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("lead_status_history");
    await queryInterface.dropTable("lead_product_interests");
    await queryInterface.dropTable("leads");
  },
};

