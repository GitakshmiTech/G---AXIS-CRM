//===========================================================================================
//    DEAL MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Deal = sequelize.define(
  'Deal',
  {
    deal_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    deal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    deal_name: {
      type: DataTypes.STRING(190),
      allowNull: false,
    },
    account_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    primary_contact_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    source_lead_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    primary_product_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    deal_stage_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    expected_value: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    expected_arr: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    contract_term_months: {
      type: DataTypes.SMALLINT.UNSIGNED,
      defaultValue: 12,
    },
    win_probability: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 20.0,
    },
    expected_close_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'won', 'lost'),
      defaultValue: 'open',
    },
    lost_reason_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: 'deals',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

module.exports = Deal;

