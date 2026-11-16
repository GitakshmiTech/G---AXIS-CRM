'use strict';

//===========================================================================================
//    MODEL: CORE USER PRODUCT (core_user_products)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoreUserProduct = sequelize.define('CoreUserProduct', {
    cup_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    cup_user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    cup_product_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    cup_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'core_user_products',
    timestamps: true,
    createdAt: 'cup_created_at',
    updatedAt: 'cup_updated_at'
  });

  return CoreUserProduct;
};
