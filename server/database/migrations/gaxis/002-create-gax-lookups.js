'use strict';

//===========================================================================================
//    MIGRATION: CREATE GAX GLOBAL LOOKUPS (g_axis_main)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Countries
    await queryInterface.createTable('gax_countries', {
      cou_id:            { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      cou_name:          { type: Sequelize.STRING(100), allowNull: false },
      cou_iso2_code:     { type: Sequelize.CHAR(2),     allowNull: false, unique: true },
      cou_phone_code:    { type: Sequelize.STRING(8) },
      cou_currency_code: { type: Sequelize.CHAR(3) },
      cou_status:        { type: Sequelize.STRING(20),  defaultValue: 'active' }
    });

    // 2. States
    await queryInterface.createTable('gax_states', {
      sta_id:         { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      sta_country_id: { type: Sequelize.CHAR(36),    allowNull: false },
      sta_name:       { type: Sequelize.STRING(100), allowNull: false },
      sta_code:       { type: Sequelize.STRING(10) },
      sta_status:     { type: Sequelize.STRING(20),  defaultValue: 'active' }
    });

    // 3. Cities
    await queryInterface.createTable('gax_cities', {
      cty_id:       { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      cty_state_id: { type: Sequelize.CHAR(36),    allowNull: false },
      cty_name:     { type: Sequelize.STRING(100), allowNull: false },
      cty_status:   { type: Sequelize.STRING(20),  defaultValue: 'active' }
    });

    // 4. Org Types
    await queryInterface.createTable('gax_org_types', {
      ogt_id:     { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      ogt_name:   { type: Sequelize.STRING(100), allowNull: false, unique: true },
      ogt_status: { type: Sequelize.STRING(20),  defaultValue: 'active' }
    });

    // 5. Industries
    await queryInterface.createTable('gax_industries', {
      ind_id:     { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      ind_name:   { type: Sequelize.STRING(100), allowNull: false, unique: true },
      ind_status: { type: Sequelize.STRING(20),  defaultValue: 'active' }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('gax_industries');
    await queryInterface.dropTable('gax_org_types');
    await queryInterface.dropTable('gax_cities');
    await queryInterface.dropTable('gax_states');
    await queryInterface.dropTable('gax_countries');
  }
};
