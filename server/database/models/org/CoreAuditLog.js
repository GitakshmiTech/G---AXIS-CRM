'use strict';

//===========================================================================================
//    MODEL: CORE AUDIT LOG (core_audit_logs)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoreAuditLog = sequelize.define('CoreAuditLog', {
    cal_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    cal_user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    cal_action: {
      type: DataTypes.STRING(50)
    },
    cal_entity: {
      type: DataTypes.STRING(100)
    },
    cal_entity_id: {
      type: DataTypes.STRING(36)
    },
    cal_old_values: {
      type: DataTypes.JSON
    },
    cal_new_values: {
      type: DataTypes.JSON
    },
    cal_ip_address: {
      type: DataTypes.STRING(45)
    }
  }, {
    tableName: 'core_audit_logs',
    timestamps: true,
    createdAt: 'cal_created_at',
    updatedAt: false
  });

  return CoreAuditLog;
};
