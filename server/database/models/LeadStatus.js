//===========================================================================================
//    LEAD STATUS MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const LeadStatus = sequelize.define(
  'LeadStatus',
  {
    lead_status_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    status_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    stage_order: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
    },
    allows_conversion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_terminal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'lead_statuses',
    timestamps: false,
  }
);

module.exports = LeadStatus;

