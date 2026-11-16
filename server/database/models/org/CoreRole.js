'use strict';

//===========================================================================================
//    MODEL: CORE ROLE (core_roles)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoreRole = sequelize.define('CoreRole', {
    rol_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    rol_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    rol_description: {
      type: DataTypes.STRING(255)
    },
    rol_data_scope: {
      type: DataTypes.STRING(10),
      defaultValue: 'own' // own / team / branch / all
    },
    rol_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    },
    rol_created_by: {
      type: DataTypes.CHAR(36)
    }
  }, {
    tableName: 'core_roles',
    timestamps: true,
    createdAt: 'rol_created_at',
    updatedAt: 'rol_updated_at'
  });

  return CoreRole;
};
