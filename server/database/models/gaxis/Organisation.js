'use strict';

//===========================================================================================
//    MODEL: ORGANISATION (g_axis_main.gax_organisations)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Organisation = sequelize.define('Organisation', {
    org_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    org_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    org_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    org_legal_name: {
      type: DataTypes.STRING(200)
    },
    org_db_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    org_db_host: {
      type: DataTypes.STRING(100),
      defaultValue: 'localhost'
    },
    org_db_port: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 3306
    },
    org_email: {
      type: DataTypes.STRING(150)
    },
    org_phone: {
      type: DataTypes.STRING(20)
    },
    org_website: {
      type: DataTypes.STRING(255)
    },
    org_gst_no: {
      type: DataTypes.STRING(20)
    },
    org_pan_no: {
      type: DataTypes.STRING(20)
    },
    org_address_line1: {
      type: DataTypes.STRING(255)
    },
    org_address_line2: {
      type: DataTypes.STRING(255)
    },
    org_country_id: {
      type: DataTypes.CHAR(36)
    },
    org_state_id: {
      type: DataTypes.CHAR(36)
    },
    org_city_id: {
      type: DataTypes.CHAR(36)
    },
    org_pincode: {
      type: DataTypes.STRING(10)
    },
    org_logo_url: {
      type: DataTypes.STRING(255)
    },
    org_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending'
    },
    org_activated_at: {
      type: DataTypes.DATE
    },
    org_suspended_at: {
      type: DataTypes.DATE
    },
    org_remarks: {
      type: DataTypes.STRING(500)
    },
    org_created_by: {
      type: DataTypes.CHAR(36)
    }
  }, {
    tableName: 'gax_organisations',
    timestamps: true,
    createdAt: 'org_created_at',
    updatedAt: 'org_updated_at'
  });

  return Organisation;
};
