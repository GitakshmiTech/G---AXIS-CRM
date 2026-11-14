//===========================================================================================
//    PRODUCT MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Product = sequelize.define(
  'Product',
  {
    product_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    product_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    product_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'products',
    timestamps: false,
  }
);

module.exports = Product;

