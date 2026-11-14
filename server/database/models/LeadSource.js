//===========================================================================================
//    LEAD SOURCE MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const LeadSource = sequelize.define(
  'LeadSource',
  {
    lead_source_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    source_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'lead_sources',
    timestamps: false,
  }
);

module.exports = LeadSource;

