'use strict';

//===========================================================================================
//    MODEL: CRM TASK (crm_tasks)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrmTask = sequelize.define('CrmTask', {
    tsk_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    tsk_title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    tsk_description: {
      type: DataTypes.STRING(1000)
    },
    tsk_rel_type: {
      type: DataTypes.STRING(20) // lead / account / deal
    },
    tsk_rel_id: {
      type: DataTypes.STRING(36)
    },
    tsk_due_at: {
      type: DataTypes.DATE
    },
    tsk_priority: {
      type: DataTypes.STRING(10),
      defaultValue: 'medium'
    },
    tsk_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'open'
    },
    tsk_assigned_to: {
      type: DataTypes.CHAR(36)
    },
    tsk_created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false
    }
  }, {
    tableName: 'crm_tasks',
    timestamps: true,
    createdAt: 'tsk_created_at',
    updatedAt: 'tsk_updated_at'
  });

  return CrmTask;
};
