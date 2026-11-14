//===========================================================================================
//    CONTACT MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Contact = sequelize.define(
  'Contact',
  {
    contact_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    contact_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(190),
      allowNull: false,
    },
    office_phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    mobile_phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    account_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    is_decision_maker: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    source_lead_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: 'contacts',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

module.exports = Contact;

