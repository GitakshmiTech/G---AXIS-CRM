//===========================================================================================
//    SEQUELIZE MODEL REGISTRY & ASSOCIATIONS
//    Centralized database models initialization and relational associations setup
//===========================================================================================

const { sequelize } = require('../connection');
const Role = require('./Role');
const Staff = require('./Staff');
const LeadStatus = require('./LeadStatus');
const LeadSource = require('./LeadSource');
const Industry = require('./Industry');
const Product = require('./Product');
const DealStage = require('./DealStage');
const Lead = require('./Lead');
const Account = require('./Account');
const Contact = require('./Contact');
const Deal = require('./Deal');
const Activity = require('./Activity');
const Note = require('./Note');
const AuditLog = require('./AuditLog');

//===========================================================================================
//    RELATIONAL ASSOCIATIONS
//===========================================================================================

// --- Staff & Role Associations ---
Staff.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(Staff, { foreignKey: 'role_id', as: 'staff' });

// --- Lead Associations ---
Lead.belongsTo(LeadStatus, { foreignKey: 'lead_status_id', as: 'status' });
Lead.belongsTo(LeadSource, { foreignKey: 'lead_source_id', as: 'source' });
Lead.belongsTo(Industry, { foreignKey: 'industry_id', as: 'industry' });
Lead.belongsTo(Staff, { foreignKey: 'owner_id', as: 'owner' });
Lead.belongsTo(Account, { foreignKey: 'converted_account_id', as: 'convertedAccount' });
Lead.belongsTo(Contact, { foreignKey: 'converted_contact_id', as: 'convertedContact' });
Lead.hasMany(Activity, { foreignKey: 'lead_id', as: 'activities' });
Lead.hasMany(Note, { foreignKey: 'lead_id', as: 'notes' });

// --- Account Associations ---
Account.belongsTo(Staff, { foreignKey: 'owner_id', as: 'owner' });
Account.belongsTo(Industry, { foreignKey: 'industry_id', as: 'industry' });
Account.belongsTo(Lead, { foreignKey: 'source_lead_id', as: 'sourceLead' });
Account.hasMany(Contact, { foreignKey: 'account_id', as: 'contacts' });
Account.hasMany(Deal, { foreignKey: 'account_id', as: 'deals' });
Account.hasMany(Activity, { foreignKey: 'account_id', as: 'activities' });

// --- Contact Associations ---
Contact.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });
Contact.belongsTo(Staff, { foreignKey: 'owner_id', as: 'owner' });
Contact.belongsTo(Lead, { foreignKey: 'source_lead_id', as: 'sourceLead' });
Contact.hasMany(Deal, { foreignKey: 'primary_contact_id', as: 'deals' });

// --- Deal Associations ---
Deal.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });
Deal.belongsTo(Contact, { foreignKey: 'primary_contact_id', as: 'primaryContact' });
Deal.belongsTo(Lead, { foreignKey: 'source_lead_id', as: 'sourceLead' });
Deal.belongsTo(Product, { foreignKey: 'primary_product_id', as: 'product' });
Deal.belongsTo(DealStage, { foreignKey: 'deal_stage_id', as: 'stage' });
Deal.belongsTo(Staff, { foreignKey: 'owner_id', as: 'owner' });
Deal.hasMany(Activity, { foreignKey: 'deal_id', as: 'activities' });
Deal.hasMany(Note, { foreignKey: 'deal_id', as: 'notes' });

// --- Activity & Note Associations ---
Activity.belongsTo(Staff, { foreignKey: 'assigned_to', as: 'assignee' });
Activity.belongsTo(Staff, { foreignKey: 'created_by', as: 'creator' });
Note.belongsTo(Staff, { foreignKey: 'created_by', as: 'author' });

module.exports = {
  sequelize,
  Role,
  Staff,
  LeadStatus,
  LeadSource,
  Industry,
  Product,
  DealStage,
  Lead,
  Account,
  Contact,
  Deal,
  Activity,
  Note,
  AuditLog,
};

