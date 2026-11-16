'use strict';

//===========================================================================================
//    SEEDER: GAX GLOBAL LOOKUPS (g-axis-main)
//===========================================================================================

module.exports = {
  async up(queryInterface) {
    // 1. Countries
    await queryInterface.bulkInsert('gax_countries', [
      {
        cou_id: '1',
        cou_name: 'India',
        cou_iso2_code: 'IN',
        cou_phone_code: '+91',
        cou_currency_code: 'INR',
        cou_status: 'active'
      }
    ], {});

    // 2. States
    await queryInterface.bulkInsert('gax_states', [
      {
        sta_id: '1',
        sta_country_id: '1',
        sta_name: 'Gujarat',
        sta_code: 'GJ',
        sta_status: 'active'
      }
    ], {});

    // 3. Cities
    await queryInterface.bulkInsert('gax_cities', [
      {
        cty_id: '1',
        cty_state_id: '1',
        cty_name: 'Ahmedabad',
        cty_status: 'active'
      },
      {
        cty_id: '2',
        cty_state_id: '1',
        cty_name: 'Surat',
        cty_status: 'active'
      }
    ], {});

    // 4. Org Types
    await queryInterface.bulkInsert('gax_org_types', [
      { ogt_id: '1', ogt_name: 'Private Limited Company', ogt_status: 'active' },
      { ogt_id: '2', ogt_name: 'Limited Liability Partnership (LLP)', ogt_status: 'active' },
      { ogt_id: '3', ogt_name: 'Sole Proprietorship', ogt_status: 'active' }
    ], {});

    // 5. Industries
    await queryInterface.bulkInsert('gax_industries', [
      { ind_id: '1', ind_name: 'Information Technology & Services', ind_status: 'active' },
      { ind_id: '2', ind_name: 'Manufacturing & Engineering', ind_status: 'active' },
      { ind_id: '3', ind_name: 'Healthcare & Pharmaceuticals', ind_status: 'active' },
      { ind_id: '4', ind_name: 'Financial Services & Banking', ind_status: 'active' }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('gax_industries', null, {});
    await queryInterface.bulkDelete('gax_org_types', null, {});
    await queryInterface.bulkDelete('gax_cities', null, {});
    await queryInterface.bulkDelete('gax_states', null, {});
    await queryInterface.bulkDelete('gax_countries', null, {});
  }
};
