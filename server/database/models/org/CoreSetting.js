'use strict';

//===========================================================================================
//    MODEL: CORE SETTING (core_settings)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoreSetting = sequelize.define('CoreSetting', {
    set_key: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false
    },
    set_value: {
      type: DataTypes.JSON
    }
  }, {
    tableName: 'core_settings',
    timestamps: true,
    createdAt: false,
    updatedAt: 'set_updated_at'
  });

  return CoreSetting;
};
