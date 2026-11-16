'use strict';

//===========================================================================================
//    MODEL: CORE USER (core_users)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoreUser = sequelize.define('CoreUser', {
    usr_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    usr_employee_code: {
      type: DataTypes.STRING(30),
      unique: true
    },
    usr_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    usr_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    usr_phone: {
      type: DataTypes.STRING(20)
    },
    usr_password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    usr_department_id: {
      type: DataTypes.CHAR(36)
    },
    usr_reporting_to: {
      type: DataTypes.CHAR(36)
    },
    usr_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'core_users',
    timestamps: true,
    createdAt: 'usr_created_at',
    updatedAt: 'usr_updated_at'
  });

  return CoreUser;
};
