'use strict';

//===========================================================================================
//    MODEL: CORE BRANCH (core_branches)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoreBranch = sequelize.define('CoreBranch', {
    brn_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    brn_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    brn_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    brn_address: {
      type: DataTypes.STRING(500)
    },
    brn_country_id: {
      type: DataTypes.CHAR(36)
    },
    brn_state_id: {
      type: DataTypes.CHAR(36)
    },
    brn_city_id: {
      type: DataTypes.CHAR(36)
    },
    brn_is_head_office: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    brn_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'core_branches',
    timestamps: true,
    createdAt: 'brn_created_at',
    updatedAt: 'brn_updated_at'
  });

  return CoreBranch;
};
