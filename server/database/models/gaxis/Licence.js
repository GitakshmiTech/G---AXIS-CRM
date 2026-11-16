'use strict';

//===========================================================================================
//    MODEL: LICENCE (g_axis_main.gax_licences)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Licence = sequelize.define('Licence', {
    lic_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    lic_org_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    lic_subscription_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    lic_key: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    lic_user_limit: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    lic_valid_from: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    lic_valid_to: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    lic_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'gax_licences',
    timestamps: true,
    createdAt: 'lic_created_at',
    updatedAt: 'lic_updated_at'
  });

  return Licence;
};
