'use strict';

//===========================================================================================
//    MODEL: CORE DEPARTMENT (core_departments)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoreDepartment = sequelize.define('CoreDepartment', {
    dep_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    dep_branch_id: {
      type: DataTypes.CHAR(36)
    },
    dep_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dep_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'core_departments',
    timestamps: true,
    createdAt: 'dep_created_at',
    updatedAt: 'dep_updated_at'
  });

  return CoreDepartment;
};
