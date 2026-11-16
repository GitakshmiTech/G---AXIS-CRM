'use strict';

//===========================================================================================
//    MODEL: CRM DEAL (crm_deals)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrmDeal = sequelize.define('CrmDeal', {
    deal_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    deal_no: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    deal_title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    deal_account_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    deal_lead_id: {
      type: DataTypes.CHAR(36)
    },
    deal_product_id: {
      type: DataTypes.CHAR(36)
    },
    deal_plan_id: {
      type: DataTypes.CHAR(36)
    },
    deal_user_count: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    deal_value: {
      type: DataTypes.DECIMAL(12, 2)
    },
    deal_stage: {
      type: DataTypes.STRING(20),
      defaultValue: 'prospect'
    },
    deal_probability: {
      type: DataTypes.TINYINT.UNSIGNED
    },
    deal_close_date: {
      type: DataTypes.DATEONLY
    },
    deal_closed_at: {
      type: DataTypes.DATE
    },
    deal_lost_reason: {
      type: DataTypes.STRING(255)
    },
    deal_onboard_req_id: {
      type: DataTypes.CHAR(36)
    },
    deal_branch_id: {
      type: DataTypes.CHAR(36)
    },
    deal_owner_id: {
      type: DataTypes.CHAR(36)
    },
    deal_created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false
    }
  }, {
    tableName: 'crm_deals',
    timestamps: true,
    createdAt: 'deal_created_at',
    updatedAt: 'deal_updated_at'
  });

  return CrmDeal;
};
