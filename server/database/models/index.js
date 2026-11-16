'use strict';

//===========================================================================================
//    DATABASE MODELS FACTORY & ASSOCIATIONS
//===========================================================================================

// G-Axis Main Models
const initSuperAdmin = require('./gaxis/SuperAdmin');
const initOrganisation = require('./gaxis/Organisation');
const initProduct = require('./gaxis/Product');
const initModule = require('./gaxis/Module');
const initPlan = require('./gaxis/Plan');
const initSubscription = require('./gaxis/Subscription');
const initLicence = require('./gaxis/Licence');
const initTenantUser = require('./gaxis/TenantUser');
const initLookups = require('./gaxis/Lookups');
const initOnboardingRequest = require('./gaxis/OnboardingRequest');
const initAuditLog = require('./gaxis/AuditLog');

// Org Models
const initCoreSetting = require('./org/CoreSetting');
const initCoreBranch = require('./org/CoreBranch');
const initCoreDepartment = require('./org/CoreDepartment');
const initCoreUser = require('./org/CoreUser');
const initCoreUserProduct = require('./org/CoreUserProduct');
const initCoreAction = require('./org/CoreAction');
const initCoreOrgModule = require('./org/CoreOrgModule');
const initCorePermission = require('./org/CorePermission');
const initCoreRole = require('./org/CoreRole');
const initCoreAuditLog = require('./org/CoreAuditLog');
const initCrmLead = require('./org/CrmLead');
const initCrmFollowup = require('./org/CrmFollowup');
const initCrmAccount = require('./org/CrmAccount');
const initCrmContact = require('./org/CrmContact');
const initCrmDeal = require('./org/CrmDeal');
const initCrmTask = require('./org/CrmTask');

/**
 * Initialize all models for the g-axis-main control plane database
 */
const initGaxisModels = (sequelize) => {
  const models = {
    SuperAdmin: initSuperAdmin(sequelize),
    Organisation: initOrganisation(sequelize),
    Product: initProduct(sequelize),
    Module: initModule(sequelize),
    Plan: initPlan(sequelize),
    Subscription: initSubscription(sequelize),
    Licence: initLicence(sequelize),
    TenantUser: initTenantUser(sequelize),
    ...initLookups(sequelize),
    OnboardingRequest: initOnboardingRequest(sequelize),
    AuditLog: initAuditLog(sequelize)
  };

  // Associations for Gaxis
  models.Product.hasMany(models.Module, { foreignKey: 'mod_product_id', as: 'modules' });
  models.Module.belongsTo(models.Product, { foreignKey: 'mod_product_id', as: 'product' });

  models.Product.hasMany(models.Plan, { foreignKey: 'pln_product_id', as: 'plans' });
  models.Plan.belongsTo(models.Product, { foreignKey: 'pln_product_id', as: 'product' });

  models.Organisation.hasMany(models.Subscription, { foreignKey: 'sub_org_id', as: 'subscriptions' });
  models.Subscription.belongsTo(models.Organisation, { foreignKey: 'sub_org_id', as: 'organisation' });

  models.Organisation.hasMany(models.TenantUser, { foreignKey: 'tnu_org_id', as: 'tenantUsers' });
  models.TenantUser.belongsTo(models.Organisation, { foreignKey: 'tnu_org_id', as: 'organisation' });

  return models;
};

/**
 * Initialize all models for a specific tenant database (e.g. org_gitakshmi)
 */
const initOrgModels = (sequelize) => {
  const models = {
    CoreSetting: initCoreSetting(sequelize),
    CoreBranch: initCoreBranch(sequelize),
    CoreDepartment: initCoreDepartment(sequelize),
    CoreUser: initCoreUser(sequelize),
    CoreUserProduct: initCoreUserProduct(sequelize),
    CoreAction: initCoreAction(sequelize),
    CoreOrgModule: initCoreOrgModule(sequelize),
    CorePermission: initCorePermission(sequelize),
    CoreRole: initCoreRole(sequelize),
    CoreAuditLog: initCoreAuditLog(sequelize),
    CrmLead: initCrmLead(sequelize),
    CrmFollowup: initCrmFollowup(sequelize),
    CrmAccount: initCrmAccount(sequelize),
    CrmContact: initCrmContact(sequelize),
    CrmDeal: initCrmDeal(sequelize),
    CrmTask: initCrmTask(sequelize)
  };

  // Associations for Org
  models.CoreBranch.hasMany(models.CoreDepartment, { foreignKey: 'dep_branch_id', as: 'departments' });
  models.CoreDepartment.belongsTo(models.CoreBranch, { foreignKey: 'dep_branch_id', as: 'branch' });

  models.CoreDepartment.hasMany(models.CoreUser, { foreignKey: 'usr_department_id', as: 'users' });
  models.CoreUser.belongsTo(models.CoreDepartment, { foreignKey: 'usr_department_id', as: 'department' });

  // User Products (Multiple products per user)
  models.CoreUser.hasMany(models.CoreUserProduct, { foreignKey: 'cup_user_id', as: 'products' });
  models.CoreUserProduct.belongsTo(models.CoreUser, { foreignKey: 'cup_user_id', as: 'user' });

  // CRM Associations
  models.CoreUser.hasMany(models.CrmLead, { foreignKey: 'lds_assigned_to', as: 'assignedLeads' });
  models.CrmLead.belongsTo(models.CoreUser, { foreignKey: 'lds_assigned_to', as: 'assignedUser' });

  models.CrmLead.hasMany(models.CrmFollowup, { foreignKey: 'flw_lead_id', as: 'followups' });
  models.CrmFollowup.belongsTo(models.CrmLead, { foreignKey: 'flw_lead_id', as: 'lead' });

  models.CrmAccount.hasMany(models.CrmContact, { foreignKey: 'cnt_account_id', as: 'contacts' });
  models.CrmContact.belongsTo(models.CrmAccount, { foreignKey: 'cnt_account_id', as: 'account' });

  models.CrmAccount.hasMany(models.CrmDeal, { foreignKey: 'deal_account_id', as: 'deals' });
  models.CrmDeal.belongsTo(models.CrmAccount, { foreignKey: 'deal_account_id', as: 'account' });

  return models;
};

module.exports = {
  initGaxisModels,
  initOrgModels
};
