//===========================================================================================
//    ACCOUNT MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Account = sequelize.define(
  'Account',
  {
    account_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    account_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    account_name: {
      type: DataTypes.STRING(190),
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING(190),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    industry_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    account_type_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    employee_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    annual_revenue: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0.0,
    },
    owner_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    hq_street_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hq_city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    hq_state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    hq_country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    hq_postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    regional_presence: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    source_lead_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: 'accounts',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

module.exports = Account;

