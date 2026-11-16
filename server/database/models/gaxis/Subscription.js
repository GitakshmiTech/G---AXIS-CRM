'use strict';

//===========================================================================================
//    MODEL: SUBSCRIPTION (g_axis_main.gax_subscriptions)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subscription = sequelize.define('Subscription', {
    sub_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    sub_org_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    sub_product_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    sub_plan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    sub_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    sub_end_date: {
      type: DataTypes.DATEONLY
    },
    sub_auto_renew: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    sub_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'trial'
    }
  }, {
    tableName: 'gax_subscriptions',
    timestamps: true,
    createdAt: 'sub_created_at',
    updatedAt: 'sub_updated_at'
  });

  return Subscription;
};
