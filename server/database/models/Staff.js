//===========================================================================================
//    STAFF MODEL DEFINITION
//===========================================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Staff = sequelize.define(
  'Staff',
  {
    staff_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_code: {
      type: DataTypes.STRING(30),
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
    email: {
      type: DataTypes.STRING(190),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    job_title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    role_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    role_level: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
    },
    department_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    branch_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    territory_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    reporting_manager_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    office_location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    operation_timezone: {
      type: DataTypes.STRING(50),
      defaultValue: 'Asia/Kolkata',
    },
    profile_photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'invited', 'suspended', 'offboarded'),
      defaultValue: 'active',
    },
    remember_me_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'staff',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Staff;

