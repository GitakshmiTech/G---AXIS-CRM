'use strict';

//===========================================================================================
//    MODEL: CORE PERMISSION (core_permissions)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CorePermission = sequelize.define('CorePermission', {
    prm_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    prm_module_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    prm_action_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    prm_code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    prm_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'core_permissions',
    timestamps: false
  });

  return CorePermission;
};
