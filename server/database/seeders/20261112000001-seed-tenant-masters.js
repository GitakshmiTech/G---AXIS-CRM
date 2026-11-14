//===========================================================================================
//    SEEDER 01: TENANT MASTERS & OPERATIONAL LOOKUPS (REUSABLE BY ANY TENANT)
//    Seeds default roles, departments, branches, territories, sequences, statuses,
//    deal stages, industries, products, and activity types
//===========================================================================================

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Roles
    await queryInterface.bulkInsert("roles", [
      { role_id: 1, role_code: "SUPER_ADMIN", role_name: "Super Administrator", role_type: "system", description: "Full system administrative access", status: "active" },
      { role_id: 2, role_code: "SALES_MANAGER", role_name: "Sales Manager", role_type: "system", description: "Manages sales team, approvals, and quotas", status: "active" },
      { role_id: 3, role_code: "BDE", role_name: "Business Development Executive", role_type: "system", description: "Prospecting, lead qualification, and deal closing", status: "active" },
    ]);

    // 2. Departments
    await queryInterface.bulkInsert("departments", [
      { department_id: 1, department_name: "Sales & Business Development", is_active: true },
      { department_id: 2, department_name: "Enterprise Solutions", is_active: true },
      { department_id: 3, department_name: "Executive Leadership", is_active: true },
    ]);

    // 3. Branches
    await queryInterface.bulkInsert("branches", [
      { branch_id: 1, branch_code: "HQ-01", branch_name: "Corporate Headquarters", company_name: "Gitakshmi Technologies", city: "Ahmedabad", state: "Gujarat", country: "India", is_active: true },
    ]);

    // 4. Sales Territories
    await queryInterface.bulkInsert("sales_territories", [
      { territory_id: 1, territory_name: "India - West", region: "APAC", is_active: true },
      { territory_id: 2, territory_name: "North America - East", region: "NA", is_active: true },
      { territory_id: 3, territory_name: "EMEA", region: "EMEA", is_active: true },
    ]);

    // 5. Code Sequences (Auto-numbering counters)
    await queryInterface.bulkInsert("code_sequences", [
      { prefix: "LD-", next_value: 1, pad_length: 6 },
      { prefix: "ACC-", next_value: 1, pad_length: 6 },
      { prefix: "CNT-", next_value: 1, pad_length: 6 },
      { prefix: "DL-", next_value: 1, pad_length: 6 },
    ]);

    // 6. Lead Sources
    await queryInterface.bulkInsert("lead_sources", [
      { lead_source_id: 1, source_name: "Website", is_active: true },
      { lead_source_id: 2, source_name: "LinkedIn", is_active: true },
      { lead_source_id: 3, source_name: "Referral", is_active: true },
      { lead_source_id: 4, source_name: "Cold Call", is_active: true },
      { lead_source_id: 5, source_name: "Exhibition", is_active: true },
      { lead_source_id: 6, source_name: "Partner", is_active: true },
    ]);

    // 7. Lead Creation Methods
    await queryInterface.bulkInsert("lead_creation_methods", [
      { creation_method_id: 1, method_name: "Manual Form", is_active: true },
      { creation_method_id: 2, method_name: "CSV Import", is_active: true },
      { creation_method_id: 3, method_name: "Inbound Webhook", is_active: true },
      { creation_method_id: 4, method_name: "API Integration", is_active: true },
    ]);

    // 8. Lead Statuses (Pipeline Stages)
    await queryInterface.bulkInsert("lead_statuses", [
      { lead_status_id: 1, status_name: "New", stage_order: 1, allows_conversion: false, is_terminal: false, is_active: true },
      { lead_status_id: 2, status_name: "Contacted", stage_order: 2, allows_conversion: false, is_terminal: false, is_active: true },
      { lead_status_id: 3, status_name: "In Discussion", stage_order: 3, allows_conversion: false, is_terminal: false, is_active: true },
      { lead_status_id: 4, status_name: "Qualified", stage_order: 4, allows_conversion: true, is_terminal: false, is_active: true },
      { lead_status_id: 5, status_name: "Converted", stage_order: 5, allows_conversion: false, is_terminal: true, is_active: true },
      { lead_status_id: 6, status_name: "Lost", stage_order: 6, allows_conversion: false, is_terminal: true, is_active: true },
    ]);

    // 9. Deal Stages
    await queryInterface.bulkInsert("deal_stages", [
      { deal_stage_id: 1, stage_name: "Qualification", stage_order: 1, default_probability: 20.00, is_won: false, is_lost: false, is_active: true },
      { deal_stage_id: 2, stage_name: "Discovery", stage_order: 2, default_probability: 35.00, is_won: false, is_lost: false, is_active: true },
      { deal_stage_id: 3, stage_name: "Demo", stage_order: 3, default_probability: 50.00, is_won: false, is_lost: false, is_active: true },
      { deal_stage_id: 4, stage_name: "Proposal", stage_order: 4, default_probability: 65.00, is_won: false, is_lost: false, is_active: true },
      { deal_stage_id: 5, stage_name: "Negotiation", stage_order: 5, default_probability: 80.00, is_won: false, is_lost: false, is_active: true },
      { deal_stage_id: 6, stage_name: "Approval", stage_order: 6, default_probability: 85.00, is_won: false, is_lost: false, is_active: true },
      { deal_stage_id: 7, stage_name: "PO / Contract", stage_order: 7, default_probability: 95.00, is_won: false, is_lost: false, is_active: true },
      { deal_stage_id: 8, stage_name: "Closed Won", stage_order: 8, default_probability: 100.00, is_won: true, is_lost: false, is_active: true },
      { deal_stage_id: 9, stage_name: "Closed Lost", stage_order: 9, default_probability: 0.00, is_won: false, is_lost: true, is_active: true },
    ]);

    // 10. Industry Tiers
    await queryInterface.bulkInsert("industry_tiers", [
      { industry_tier_id: 1, tier_name: "Tier 1 - Enterprise (F500)", is_active: true },
      { industry_tier_id: 2, tier_name: "Tier 2 - Mid-Market ($10M-$100M)", is_active: true },
      { industry_tier_id: 3, tier_name: "Tier 3 - SMB (<$10M)", is_active: true },
    ]);

    // 11. Industries
    await queryInterface.bulkInsert("industries", [
      { industry_id: 1, industry_name: "Information Technology", industry_tier_id: 1, is_active: true },
      { industry_id: 2, industry_name: "SaaS & Cloud Services", industry_tier_id: 1, is_active: true },
      { industry_id: 3, industry_name: "Financial Services & Fintech", industry_tier_id: 1, is_active: true },
      { industry_id: 4, industry_name: "Healthcare & Life Sciences", industry_tier_id: 1, is_active: true },
      { industry_id: 5, industry_name: "Manufacturing & Logistics", industry_tier_id: 2, is_active: true },
      { industry_id: 6, industry_name: "Retail & E-commerce", industry_tier_id: 2, is_active: true },
    ]);

    // 12. Account Types
    await queryInterface.bulkInsert("account_types", [
      { account_type_id: 1, type_name: "Prospect", is_active: true },
      { account_type_id: 2, type_name: "Customer", is_active: true },
      { account_type_id: 3, type_name: "Strategic Partner", is_active: true },
      { account_type_id: 4, type_name: "Vendor / Supplier", is_active: true },
    ]);

    // 13. Products
    await queryInterface.bulkInsert("products", [
      { product_id: 1, product_code: "G_CRM", product_name: "Enterprise CRM Suite", description: "Complete multi-tenant CRM with Leads, Pipeline, and Analytics", is_active: true },
      { product_id: 2, product_code: "G_CLOUD", product_name: "Cloud Data Platform", description: "High-throughput cloud storage and integration bus", is_active: true },
      { product_id: 3, product_code: "G_AI", product_name: "CyberGuard AI Assistant", description: "Automated threat intelligence and lead scoring", is_active: true },
    ]);

    // 14. Product Plans
    await queryInterface.bulkInsert("product_plans", [
      { product_plan_id: 1, product_id: 1, plan_name: "Professional (per seat)", billing_cycle: "yearly", is_active: true },
      { product_plan_id: 2, product_id: 1, plan_name: "Enterprise Dedicated", billing_cycle: "yearly", is_active: true },
      { product_plan_id: 3, product_id: 2, plan_name: "Scale Volume 10TB", billing_cycle: "monthly", is_active: true },
    ]);

    // 15. Lost Reasons
    await queryInterface.bulkInsert("lost_reasons", [
      { lost_reason_id: 1, reason_name: "Price Too High / Budget Constraints", applies_to: "both", is_active: true },
      { lost_reason_id: 2, reason_name: "Selected Competitor Solution", applies_to: "both", is_active: true },
      { lost_reason_id: 3, reason_name: "Feature Gap / Technical Mismatch", applies_to: "both", is_active: true },
      { lost_reason_id: 4, reason_name: "Project Postponed / Shelved", applies_to: "both", is_active: true },
      { lost_reason_id: 5, reason_name: "No Response / Prospect Unresponsive", applies_to: "both", is_active: true },
    ]);

    // 16. Activity Types
    await queryInterface.bulkInsert("activity_types", [
      { activity_type_id: 1, type_name: "Phone Call", is_active: true },
      { activity_type_id: 2, type_name: "Video Meeting", is_active: true },
      { activity_type_id: 3, type_name: "Product Demo", is_active: true },
      { activity_type_id: 4, type_name: "Email Follow-up", is_active: true },
      { activity_type_id: 5, type_name: "Task", is_active: true },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("activity_types", null, {});
    await queryInterface.bulkDelete("lost_reasons", null, {});
    await queryInterface.bulkDelete("product_plans", null, {});
    await queryInterface.bulkDelete("products", null, {});
    await queryInterface.bulkDelete("account_types", null, {});
    await queryInterface.bulkDelete("industries", null, {});
    await queryInterface.bulkDelete("industry_tiers", null, {});
    await queryInterface.bulkDelete("deal_stages", null, {});
    await queryInterface.bulkDelete("lead_statuses", null, {});
    await queryInterface.bulkDelete("lead_creation_methods", null, {});
    await queryInterface.bulkDelete("lead_sources", null, {});
    await queryInterface.bulkDelete("code_sequences", null, {});
    await queryInterface.bulkDelete("sales_territories", null, {});
    await queryInterface.bulkDelete("branches", null, {});
    await queryInterface.bulkDelete("departments", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  },
};

