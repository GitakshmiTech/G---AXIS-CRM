//===========================================================================================
//    NOTE MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Note = sequelize.define(
  'Note',
  {
    note_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    lead_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    account_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    contact_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    deal_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    note_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_internal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: 'notes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Note;

