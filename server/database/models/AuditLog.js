//===========================================================================================
//    AUDIT LOG MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const AuditLog = sequelize.define(
  'AuditLog',
  {
    audit_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    occurred_at: {
      type: DataTypes.DATE(3),
      defaultValue: DataTypes.NOW,
    },
    actor_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    action: {
      type: DataTypes.ENUM(
        'created',
        'edited',
        'deleted',
        'converted',
        'approved',
        'rejected',
        'login',
        'logout',
        'exported',
        'imported'
      ),
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    verification_hash: {
      type: DataTypes.CHAR(64),
      allowNull: true,
    },
  },
  {
    tableName: 'audit_logs',
    timestamps: false,
  }
);

module.exports = AuditLog;

