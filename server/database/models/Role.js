//===========================================================================================
//    ROLE MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Role = sequelize.define(
  'Role',
  {
    role_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    role_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    role_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    role_type: {
      type: DataTypes.ENUM('system', 'custom'),
      defaultValue: 'custom',
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Role;

