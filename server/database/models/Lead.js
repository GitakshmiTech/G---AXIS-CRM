//===========================================================================================
//    LEAD MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Lead = sequelize.define(
  'Lead',
  {
    lead_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    lead_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(190),
      allowNull: false,
      unique: true,
    },
    secondary_email: {
      type: DataTypes.STRING(190),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    office_phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    skype_id: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING(190),
      allowNull: false,
    },
    industry_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    employee_scale: {
      type: DataTypes.STRING(50),
      defaultValue: '0 - 50',
    },
    workforce_size: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    annual_revenue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lead_source_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    creation_method_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    estimated_deal_value: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    lead_status_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    lost_reason_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    assignment_status: {
      type: DataTypes.ENUM('unassigned', 'assigned', 'reassigned'),
      defaultValue: 'unassigned',
    },
    assignment_type: {
      type: DataTypes.ENUM('manual', 'round_robin', 'weighted', 'geography', 'ai_match'),
      defaultValue: 'manual',
    },
    is_draft: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    qualification_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discovery_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    executive_background: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lead_health: {
      // DB ENUM: 'hot' | 'warm' | 'cold'
      type: DataTypes.ENUM('hot', 'warm', 'cold'),
      defaultValue: 'warm',
    },
    deal_signal: {
      // Priority signal: High | Medium | Low (varchar in DB)
      type: DataTypes.STRING(10),
      defaultValue: 'Medium',
    },
    street_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state_province: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    sla_due_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    first_response_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sla_breached: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    converted_account_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    converted_contact_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    converted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: 'leads',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

module.exports = Lead;

