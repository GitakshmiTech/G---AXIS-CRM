//===========================================================================================
//    DEAL STAGE MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const DealStage = sequelize.define(
  'DealStage',
  {
    deal_stage_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    stage_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    stage_order: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
    },
    default_probability: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
    },
    is_won: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_lost: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'deal_stages',
    timestamps: false,
  }
);

module.exports = DealStage;

