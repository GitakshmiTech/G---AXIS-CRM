'use strict';

//===========================================================================================
//    MODEL: SUPER ADMIN (g_axis_main.gax_super_admins)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SuperAdmin = sequelize.define('SuperAdmin', {
    adm_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    adm_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    adm_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    adm_phone: {
      type: DataTypes.STRING(20)
    },
    adm_password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    adm_mfa_enabled: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    adm_mfa_secret: {
      type: DataTypes.STRING(255)
    },
    adm_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    },
    adm_last_login_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'gax_super_admins',
    timestamps: true,
    createdAt: 'adm_created_at',
    updatedAt: 'adm_updated_at'
  });

  return SuperAdmin;
};
