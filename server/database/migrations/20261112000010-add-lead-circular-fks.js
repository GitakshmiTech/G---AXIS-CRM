//===========================================================================================
//    MIGRATION 10: ADD CIRCULAR FOREIGN KEYS
//    Adds source_lead_id FK from accounts and contacts to leads
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add FK from accounts.source_lead_id -> leads.lead_id
    await queryInterface.addConstraint("accounts", {
      fields: ["source_lead_id"],
      type: "foreign key",
      name: "fk_accounts_source_lead",
      references: {
        table: "leads",
        field: "lead_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // Add FK from contacts.source_lead_id -> leads.lead_id
    await queryInterface.addConstraint("contacts", {
      fields: ["source_lead_id"],
      type: "foreign key",
      name: "fk_contacts_source_lead",
      references: {
        table: "leads",
        field: "lead_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint("accounts", "fk_accounts_source_lead");
    await queryInterface.removeConstraint("contacts", "fk_contacts_source_lead");
  },
};

