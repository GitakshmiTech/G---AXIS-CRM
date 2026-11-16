'use strict';

//===========================================================================================
//    MODEL: CRM ACCOUNT (crm_accounts)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrmAccount = sequelize.define('CrmAccount', {
    acc_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    acc_no: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    acc_company: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    acc_industry_id: {
      type: DataTypes.CHAR(36)
    },
    acc_email: {
      type: DataTypes.STRING(150)
    },
    acc_phone: {
      type: DataTypes.STRING(20)
    },
    acc_gst_no: {
      type: DataTypes.STRING(20)
    },
    acc_address: {
      type: DataTypes.STRING(500)
    },
    acc_country_id: {
      type: DataTypes.CHAR(36)
    },
    acc_state_id: {
      type: DataTypes.CHAR(36)
    },
    acc_city_id: {
      type: DataTypes.CHAR(36)
    },
    acc_lead_id: {
      type: DataTypes.CHAR(36)
    },
    acc_conv_org_id: {
      type: DataTypes.CHAR(36)
    },
    acc_branch_id: {
      type: DataTypes.CHAR(36)
    },
    acc_owner_id: {
      type: DataTypes.CHAR(36)
    },
    acc_created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false
    }
  }, {
    tableName: 'crm_accounts',
    timestamps: true,
    createdAt: 'acc_created_at',
    updatedAt: 'acc_updated_at'
  });

  return CrmAccount;
};
