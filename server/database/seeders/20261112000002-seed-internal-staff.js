//===========================================================================================
//    SEEDER 02: INTERNAL STAFF MEMBERS (HOST CRM ONLY)
//    Seeds initial team members for Gitakshmi Technologies internal CRM
//===========================================================================================

"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash("Admin@123", 10);

    await queryInterface.bulkInsert("staff", [
      {
        staff_id: 1,
        employee_code: "EMP-80102",
        first_name: "Arthur",
        last_name: "Pendelton",
        email: "arthur@gcrm.internal",
        phone: "+91 98250 11223",
        password_hash: passwordHash,
        designation: "Chief Commercial Officer",
        job_title: "Head of Global Enterprise Sales",
        role_id: 1,
        role_level: "L5_EXECUTIVE",
        department_id: 3,
        branch_id: 1,
        territory_id: 1,
        reporting_manager_id: null,
        office_location: "Executive Suite 701, Kaivanna Complex, Ahmedabad",
        operation_timezone: "Asia/Kolkata",
        profile_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
        status: "active",
        remember_me_enabled: true,
      },
      {
        staff_id: 2,
        employee_code: "EMP-1012",
        first_name: "Marcus",
        last_name: "Vance",
        email: "marcus.vance@gcrm-enterprise.com",
        phone: "+91 98980 44556",
        password_hash: passwordHash,
        designation: "Senior Strategic Director",
        job_title: "Director of Enterprise Sales",
        role_id: 2,
        role_level: "L4_DIRECTOR",
        department_id: 1,
        branch_id: 1,
        territory_id: 1,
        reporting_manager_id: 1,
        office_location: "Kaivanna Complex, Ahmedabad",
        operation_timezone: "Asia/Kolkata",
        profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
        status: "active",
        remember_me_enabled: true,
      },
      {
        staff_id: 3,
        employee_code: "EMP-88219",
        first_name: "Alex",
        last_name: "Rivera",
        email: "alex.rivera@gcrm-enterprise.com",
        phone: "+91 94260 77889",
        password_hash: passwordHash,
        designation: "Lead Technical Architect",
        job_title: "Pre-Sales Solutions Lead",
        role_id: 2,
        role_level: "L3_SENIOR",
        department_id: 2,
        branch_id: 1,
        territory_id: 1,
        reporting_manager_id: 2,
        office_location: "Kaivanna Complex, Ahmedabad",
        operation_timezone: "Asia/Kolkata",
        profile_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
        status: "active",
        remember_me_enabled: false,
      },
      {
        staff_id: 4,
        employee_code: "EMP-1048",
        first_name: "Sarah",
        last_name: "Jenkins",
        email: "sarah.jenkins@gcrm-enterprise.com",
        phone: "+91 98765 43210",
        password_hash: passwordHash,
        designation: "Enterprise Business Development Executive",
        job_title: "BDE - Strategic Accounts",
        role_id: 3,
        role_level: "L2_EXECUTIVE",
        department_id: 1,
        branch_id: 1,
        territory_id: 1,
        reporting_manager_id: 2,
        office_location: "Kaivanna Complex, Ahmedabad",
        operation_timezone: "Asia/Kolkata",
        profile_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
        status: "active",
        remember_me_enabled: true,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("staff", null, {});
  },
};

