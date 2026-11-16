'use strict';

//===========================================================================================
//    MODEL: PLAN (g_axis_main.gax_plans)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Plan = sequelize.define('Plan', {
    pln_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    pln_product_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    pln_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    pln_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pln_tier: {
      type: DataTypes.STRING(20)
    },
    pln_billing_cycle: {
      type: DataTypes.STRING(10)
    },
    pln_price: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    pln_currency: {
      type: DataTypes.CHAR(3),
      defaultValue: 'INR'
    },
    pln_max_users: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    pln_max_branches: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    pln_trial_days: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    pln_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'gax_plans',
    timestamps: true,
    createdAt: 'pln_created_at',
    updatedAt: 'pln_updated_at'
  });

  return Plan;
};
