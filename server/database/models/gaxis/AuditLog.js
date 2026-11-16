'use strict';

//===========================================================================================
//    MODEL: GAX AUDIT LOG (g_axis_main.gax_audit_logs)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    aud_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    aud_admin_id: {
      type: DataTypes.CHAR(36)
    },
    aud_action: {
      type: DataTypes.STRING(50)
    },
    aud_entity: {
      type: DataTypes.STRING(100)
    },
    aud_entity_id: {
      type: DataTypes.STRING(36)
    },
    aud_old_values: {
      type: DataTypes.JSON
    },
    aud_new_values: {
      type: DataTypes.JSON
    },
    aud_ip_address: {
      type: DataTypes.STRING(45)
    },
    aud_user_agent: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'gax_audit_logs',
    timestamps: true,
    createdAt: 'aud_created_at',
    updatedAt: false
  });

  return AuditLog;
};
