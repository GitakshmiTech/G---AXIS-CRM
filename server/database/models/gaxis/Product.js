'use strict';

//===========================================================================================
//    MODEL: PRODUCT (g_axis_main.gax_products)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    prd_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    prd_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    prd_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    prd_table_prefix: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    prd_description: {
      type: DataTypes.STRING(500)
    },
    prd_base_url: {
      type: DataTypes.STRING(255)
    },
    prd_sort_order: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    prd_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'gax_products',
    timestamps: true,
    createdAt: 'prd_created_at',
    updatedAt: 'prd_updated_at'
  });

  return Product;
};
