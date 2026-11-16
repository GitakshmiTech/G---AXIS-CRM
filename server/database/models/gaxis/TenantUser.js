'use strict';

//===========================================================================================
//    MODEL: TENANT USER (g-axis-main.gax_tenant_users)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TenantUser = sequelize.define('TenantUser', {
    tnu_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    tnu_org_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    tnu_core_user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    tnu_email: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    tnu_is_default: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1
    },
    tnu_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'gax_tenant_users',
    timestamps: true,
    createdAt: 'tnu_created_at',
    updatedAt: 'tnu_updated_at'
  });

  return TenantUser;
};
