//===========================================================================================
//    SEEDER 03: SAMPLE LEADS (HOST CRM ONLY)
//    Seeds initial prospect data for testing the Leads workspace
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("leads", [
      {
        lead_id: 1,
        lead_code: "LD-000001",
        full_name: "Sarah Lin",
        designation: "VP of Cloud Infrastructure",
        email: "slin@hyperscale.io",
        phone: "+91 98765 43210",
        office_phone: "+91 79 4001 2233",
        company_name: "HyperScale Systems Inc.",
        industry_id: 1,
        employee_scale: "250 - 1000",
        workforce_size: 480,
        annual_revenue: 12500000.00,
        website: "https://hyperscale.io",
        lead_source_id: 1,
        creation_method_id: 1,
        estimated_deal_value: 120000.00,
        lead_status_id: 4, // Qualified
        owner_id: 4, // Sarah Jenkins
        assignment_status: "assigned",
        assignment_type: "manual",
        is_draft: false,
        qualification_notes: "Evaluated architecture requirements for Q1 rollout.",
        discovery_summary: "Multi-region hybrid deployment needed.",
        executive_background: "Ex-Google infrastructure team.",
        lead_health: "hot",
        deal_signal: "High",
        street_address: "Kaivanna Complex, Ambawadi",
        city: "Ahmedabad",
        state_province: "Gujarat",
        country: "India",
        postal_code: "380009",
        sla_breached: false,
        created_by: 1,
        created_at: new Date("2026-11-06T10:30:00Z"),
        updated_at: new Date("2026-11-06T10:30:00Z"),
      },
      {
        lead_id: 2,
        lead_code: "LD-000002",
        full_name: "Elena Rostova",
        designation: "Chief Information Officer",
        email: "e.rostova@novatech.io",
        phone: "+91 98251 99887",
        office_phone: "+91 79 4990 8811",
        company_name: "Novatech Systems LLC",
        industry_id: 2,
        employee_scale: "1000 - 5000",
        workforce_size: 2100,
        annual_revenue: 45000000.00,
        website: "https://novatech.io",
        lead_source_id: 5,
        creation_method_id: 1,
        estimated_deal_value: 350000.00,
        lead_status_id: 3, // In Discussion
        owner_id: 2, // Marcus Vance
        assignment_status: "assigned",
        assignment_type: "manual",
        is_draft: false,
        qualification_notes: "Initial scope discussion completed at tech expo.",
        discovery_summary: "Looking to replace legacy CRM for 800 agents.",
        executive_background: "Former SAP solution director.",
        lead_health: "warm",
        deal_signal: "Medium",
        street_address: "SG Highway",
        city: "Ahmedabad",
        state_province: "Gujarat",
        country: "India",
        postal_code: "380054",
        sla_breached: false,
        created_by: 1,
        created_at: new Date("2026-11-07T14:15:00Z"),
        updated_at: new Date("2026-11-07T14:15:00Z"),
      },
    ]);

    // Update sequence counter for leads to start after the 2 seeded leads
    await queryInterface.sequelize.query(
      "UPDATE code_sequences SET next_value = 3 WHERE prefix = 'LD-';"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("leads", null, {});
  },
};

