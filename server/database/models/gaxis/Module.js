'use strict';

//===========================================================================================
//    MODEL: MODULE (g_axis_main.gax_modules)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Module = sequelize.define('Module', {
    mod_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    mod_product_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    mod_parent_module_id: {
      type: DataTypes.CHAR(36)
    },
    mod_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mod_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    mod_sort_order: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    mod_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'gax_modules',
    timestamps: true,
    createdAt: 'mod_created_at',
    updatedAt: 'mod_updated_at'
  });

  return Module;
};
