'use strict';

//===========================================================================================
//    MODEL: CORE ACTION (core_actions)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoreAction = sequelize.define('CoreAction', {
    act_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    act_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    act_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'core_actions',
    timestamps: false
  });

  return CoreAction;
};
