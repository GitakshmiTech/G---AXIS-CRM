'use strict';

//===========================================================================================
//    MIGRATION: CREATE CORE PERMISSIONS & ROLES RBAC (org_<code>)
//===========================================================================================

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Permissions
    await queryInterface.createTable('core_permissions', {
      prm_id:        { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      prm_module_id: { type: Sequelize.CHAR(36),    allowNull: false },
      prm_action_id: { type: Sequelize.CHAR(36),    allowNull: false },
      prm_code:      { type: Sequelize.STRING(100), allowNull: false, unique: true },
      prm_status:    { type: Sequelize.STRING(20),  defaultValue: 'active' }
    });

    // 2. Roles
    await queryInterface.createTable('core_roles', {
      rol_id:          { type: Sequelize.CHAR(36),    primaryKey: true, allowNull: false },
      rol_name:        { type: Sequelize.STRING(100), allowNull: false, unique: true },
      rol_description: { type: Sequelize.STRING(255) },
      rol_data_scope:  { type: Sequelize.STRING(10),  defaultValue: 'own' }, // own / team / branch / all
      rol_status:      { type: Sequelize.STRING(20),  defaultValue: 'active' },
      rol_created_by:  { type: Sequelize.CHAR(36) },
      rol_created_at:  { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      rol_updated_at:  { type: Sequelize.DATE,        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 3. Role Permissions
    await queryInterface.createTable('core_role_permissions', {
      rlp_role_id:       { type: Sequelize.CHAR(36), primaryKey: true, allowNull: false },
      rlp_permission_id: { type: Sequelize.CHAR(36), primaryKey: true, allowNull: false }
    });

    // 4. User Roles
    await queryInterface.createTable('core_user_roles', {
      url_user_id:   { type: Sequelize.CHAR(36), primaryKey: true, allowNull: false },
      url_role_id:   { type: Sequelize.CHAR(36), primaryKey: true, allowNull: false },
      url_branch_id: { type: Sequelize.CHAR(36) }
    });

    // 5. User Branches
    await queryInterface.createTable('core_user_branches', {
      ubr_user_id:   { type: Sequelize.CHAR(36), primaryKey: true, allowNull: false },
      ubr_branch_id: { type: Sequelize.CHAR(36), primaryKey: true, allowNull: false }
    });

    // 6. User Permission Overrides
    await queryInterface.createTable('core_user_permission_overrides', {
      upo_user_id:       { type: Sequelize.CHAR(36),  primaryKey: true, allowNull: false },
      upo_permission_id: { type: Sequelize.CHAR(36),  primaryKey: true, allowNull: false },
      upo_type:          { type: Sequelize.STRING(10), allowNull: false } // allow / deny
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('core_user_permission_overrides');
    await queryInterface.dropTable('core_user_branches');
    await queryInterface.dropTable('core_user_roles');
    await queryInterface.dropTable('core_role_permissions');
    await queryInterface.dropTable('core_roles');
    await queryInterface.dropTable('core_permissions');
  }
};
