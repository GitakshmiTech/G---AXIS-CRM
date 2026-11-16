'use strict';

//===========================================================================================
//    MODEL: CRM CONTACT (crm_contacts)
//===========================================================================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrmContact = sequelize.define('CrmContact', {
    cnt_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    cnt_account_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    cnt_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    cnt_designation: {
      type: DataTypes.STRING(100)
    },
    cnt_email: {
      type: DataTypes.STRING(150)
    },
    cnt_phone: {
      type: DataTypes.STRING(20)
    },
    cnt_is_primary: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    cnt_created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false
    }
  }, {
    tableName: 'crm_contacts',
    timestamps: true,
    createdAt: 'cnt_created_at',
    updatedAt: 'cnt_updated_at'
  });

  return CrmContact;
};
