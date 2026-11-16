'use strict';

//===========================================================================================
//    MODELS: GLOBAL LOOKUPS (g_axis_main)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Country = sequelize.define('Country', {
    cou_id: { type: DataTypes.CHAR(36), primaryKey: true, allowNull: false },
    cou_name: { type: DataTypes.STRING(100), allowNull: false },
    cou_iso2_code: { type: DataTypes.CHAR(2), allowNull: false, unique: true },
    cou_phone_code: { type: DataTypes.STRING(8) },
    cou_currency_code: { type: DataTypes.CHAR(3) },
    cou_status: { type: DataTypes.STRING(20), defaultValue: 'active' }
  }, {
    tableName: 'gax_countries',
    timestamps: false
  });

  const State = sequelize.define('State', {
    sta_id: { type: DataTypes.CHAR(36), primaryKey: true, allowNull: false },
    sta_country_id: { type: DataTypes.CHAR(36), allowNull: false },
    sta_name: { type: DataTypes.STRING(100), allowNull: false },
    sta_code: { type: DataTypes.STRING(10) },
    sta_status: { type: DataTypes.STRING(20), defaultValue: 'active' }
  }, {
    tableName: 'gax_states',
    timestamps: false
  });

  const City = sequelize.define('City', {
    cty_id: { type: DataTypes.CHAR(36), primaryKey: true, allowNull: false },
    cty_state_id: { type: DataTypes.CHAR(36), allowNull: false },
    cty_name: { type: DataTypes.STRING(100), allowNull: false },
    cty_status: { type: DataTypes.STRING(20), defaultValue: 'active' }
  }, {
    tableName: 'gax_cities',
    timestamps: false
  });

  const OrgType = sequelize.define('OrgType', {
    ogt_id: { type: DataTypes.CHAR(36), primaryKey: true, allowNull: false },
    ogt_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    ogt_status: { type: DataTypes.STRING(20), defaultValue: 'active' }
  }, {
    tableName: 'gax_org_types',
    timestamps: false
  });

  const Industry = sequelize.define('Industry', {
    ind_id: { type: DataTypes.CHAR(36), primaryKey: true, allowNull: false },
    ind_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    ind_status: { type: DataTypes.STRING(20), defaultValue: 'active' }
  }, {
    tableName: 'gax_industries',
    timestamps: false
  });

  return { Country, State, City, OrgType, Industry };
};
