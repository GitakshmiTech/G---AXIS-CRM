'use strict';

//===========================================================================================
//    MODEL: CRM LEAD (crm_leads)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrmLead = sequelize.define('CrmLead', {
    lds_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    lds_lead_no: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    lds_company: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    lds_contact: {
      type: DataTypes.STRING(150)
    },
    lds_email: {
      type: DataTypes.STRING(150)
    },
    lds_phone: {
      type: DataTypes.STRING(20)
    },
    lds_source: {
      type: DataTypes.STRING(50)
    },
    lds_website: {
      type: DataTypes.STRING(255)
    },
    lds_industry_id: {
      type: DataTypes.CHAR(36)
    },
    lds_city_id: {
      type: DataTypes.CHAR(36)
    },
    lds_requirement: {
      type: DataTypes.STRING(1000)
    },
    lds_exp_value: {
      type: DataTypes.DECIMAL(12, 2)
    },
    lds_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'new'
    },
    lds_lost_reason: {
      type: DataTypes.STRING(255)
    },
    lds_branch_id: {
      type: DataTypes.CHAR(36)
    },
    lds_assigned_to: {
      type: DataTypes.CHAR(36)
    },
    lds_created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    lds_updated_by: {
      type: DataTypes.CHAR(36)
    }
  }, {
    tableName: 'crm_leads',
    timestamps: true,
    createdAt: 'lds_created_at',
    updatedAt: 'lds_updated_at'
  });

  return CrmLead;
};
