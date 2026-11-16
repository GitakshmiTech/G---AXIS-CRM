'use strict';

//===========================================================================================
//    MODEL: CORE ORG MODULE (core_org_modules)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoreOrgModule = sequelize.define('CoreOrgModule', {
    com_module_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    com_product_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    com_is_enabled: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1
    },
    com_enabled_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'core_org_modules',
    timestamps: false
  });

  return CoreOrgModule;
};
