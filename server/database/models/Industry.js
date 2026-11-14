//===========================================================================================
//    INDUSTRY MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Industry = sequelize.define(
  'Industry',
  {
    industry_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    industry_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    industry_tier_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'industries',
    timestamps: false,
  }
);

module.exports = Industry;

