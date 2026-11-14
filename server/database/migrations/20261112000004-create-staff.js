//===========================================================================================
//    MIGRATION 04: STAFF (USERS & ROLES)
//    Creates staff table for internal CRM users, login credentials, and hierarchy
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("staff", {
      staff_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      employee_code: {
        type: Sequelize.STRING(30),
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
      email: {
        type: Sequelize.STRING(190),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      designation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      job_title: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      role_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "roles",
          key: "role_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      role_level: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      department_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "departments",
          key: "department_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      branch_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "branches",
          key: "branch_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      territory_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "sales_territories",
          key: "territory_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      reporting_manager_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "staff",
          key: "staff_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      office_location: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      operation_timezone: {
        type: Sequelize.STRING(64),
        allowNull: true,
        defaultValue: "UTC",
      },
      profile_photo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive", "suspended"),
        allowNull: false,
        defaultValue: "active",
      },
      remember_me_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("staff");
  },
};

