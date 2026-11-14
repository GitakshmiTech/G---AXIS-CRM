//===========================================================================================
//    ACTIVITY MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Activity = sequelize.define(
  'Activity',
  {
    activity_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    activity_type_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(190),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    assigned_to: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    meeting_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'completed', 'cancelled'),
      defaultValue: 'open',
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: 'activities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Activity;

