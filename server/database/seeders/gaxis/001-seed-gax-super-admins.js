'use strict';

//===========================================================================================
//    SEEDER: GAX SUPER ADMIN (g-axis-main)
//===========================================================================================

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('gax_super_admins', [
      {
        adm_id: '1',
        adm_name: 'G-Axis Super Admin',
        adm_email: 'superadmin@gaxis.com',
        adm_phone: '+919999999999',
        adm_password_hash: '$2b$10$hKDVYx8LwO6o07Y9yq0e2eHlM0e80Xp9sQ8G1C1p1O6u4x4Z8j7Ce', // Admin@123
        adm_mfa_enabled: 0,
        adm_mfa_secret: null,
        adm_status: 'active',
        adm_last_login_at: null,
        adm_created_at: new Date(),
        adm_updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('gax_super_admins', { adm_id: '1' }, {});
  }
};
