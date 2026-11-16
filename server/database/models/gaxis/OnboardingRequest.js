'use strict';

//===========================================================================================
//    MODEL: ONBOARDING REQUEST (g_axis_main.gax_onboarding_requests)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OnboardingRequest = sequelize.define('OnboardingRequest', {
    obr_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    obr_source_org_id: {
      type: DataTypes.CHAR(36)
    },
    obr_source_deal_id: {
      type: DataTypes.CHAR(36)
    },
    obr_company_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    obr_contact_name: {
      type: DataTypes.STRING(150)
    },
    obr_email: {
      type: DataTypes.STRING(150)
    },
    obr_phone: {
      type: DataTypes.STRING(20)
    },
    obr_gst_no: {
      type: DataTypes.STRING(20)
    },
    obr_country_id: {
      type: DataTypes.CHAR(36)
    },
    obr_state_id: {
      type: DataTypes.CHAR(36)
    },
    obr_city_id: {
      type: DataTypes.CHAR(36)
    },
    obr_product_id: {
      type: DataTypes.CHAR(36)
    },
    obr_plan_id: {
      type: DataTypes.CHAR(36)
    },
    obr_user_count: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    obr_start_date: {
      type: DataTypes.DATEONLY
    },
    obr_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending'
    },
    obr_reviewed_by: {
      type: DataTypes.CHAR(36)
    },
    obr_reviewed_at: {
      type: DataTypes.DATE
    },
    obr_remarks: {
      type: DataTypes.STRING(500)
    },
    obr_created_org_id: {
      type: DataTypes.CHAR(36)
    }
  }, {
    tableName: 'gax_onboarding_requests',
    timestamps: true,
    createdAt: 'obr_created_at',
    updatedAt: 'obr_updated_at'
  });

  return OnboardingRequest;
};
