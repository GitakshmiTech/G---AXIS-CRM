'use strict';

//===========================================================================================
//    MODEL: CRM FOLLOWUP (crm_followups)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrmFollowup = sequelize.define('CrmFollowup', {
    flw_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    flw_lead_id: {
      type: DataTypes.CHAR(36)
    },
    flw_deal_id: {
      type: DataTypes.CHAR(36)
    },
    flw_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    flw_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    flw_notes: {
      type: DataTypes.STRING(1000)
    },
    flw_outcome: {
      type: DataTypes.STRING(255)
    },
    flw_next_at: {
      type: DataTypes.DATE
    },
    flw_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'planned'
    },
    flw_assigned_to: {
      type: DataTypes.CHAR(36)
    },
    flw_created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false
    }
  }, {
    tableName: 'crm_followups',
    timestamps: true,
    createdAt: 'flw_created_at',
    updatedAt: 'flw_updated_at'
  });

  return CrmFollowup;
};
