//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, common drawer layout, form inputs, and back action button
//==================================================================================================================
import React, { useState, useEffect, memo, useCallback } from 'react';
import { Drawer } from '../../../components/sidebar/Drawer';
import { TextInput } from '../../../components/inputs/TextInput';
import { IdInput } from '../../../components/inputs/IdInput';
import { DropdownInput } from '../../../components/inputs/DropdownInput';
import { PhoneNumber } from '../../../components/inputs/PhoneNumber';
import { BackButton } from '../../../components/buttons/BackButton';

//==================================================================================================================
//    VIEW MEMBER DRAWER COMPONENT (Image 2)
//    Slide-over inspection and management drawer for BDE/Sales team member
//==================================================================================================================
export const ViewMemberDrawer = memo(({
  isOpen = false,
  onClose,
  member = null,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: '#001',
    firstName: 'Alfredo',
    lastName: 'Rhiel',
    email: 'johnson.doe@gmail.com',
    phone: '79 6565 9000',
    countryCode: '+91',
    designation: 'Senior Manager',
    role: 'Choose Role',
    department: 'HR & Admin',
    grade: 'Trainee / Entry Level',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        code: member.code || '#001',
        firstName: member.firstName || (member.name ? member.name.split(' ')[0] : 'Alfredo'),
        lastName: member.lastName || (member.name ? member.name.split(' ').slice(1).join(' ') : 'Rhiel'),
        email: member.email || 'johnson.doe@gmail.com',
        phone: member.contact ? member.contact.replace('+91', '').trim() : '79 6565 9000',
        countryCode: '+91',
        designation: member.designation || 'Senior Manager',
        role: member.role || 'Sales Executive',
        department: member.department || 'HR & Admin',
        grade: member.grade || 'Trainee / Entry Level',
        status: member.status || 'Active',
        avatar: member.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      });
    }
  }, [member]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="View Member"
      subtitle="View employee member details, assigned system role, and account status."
      width="w-full sm:w-[560px]"
      headerClassName="px-6 py-2"
      bodyClassName="px-6 py-2"
      footer={
        <div className="px-6 py-2.5 sm:py-3 bg-white-100 sticky bottom-0 z-20 flex items-center justify-between w-full shrink-0">
          <BackButton onClick={onClose} label="Back" />
        </div>
      }
    >
      <div className="flex flex-col gap-5 py-2">
        {/* ==============================================================================================================
            Member Avatar Section (Read-Only)
        ============================================================================================================== */}
        <div className="flex items-center gap-4 pb-2">
          <img
            src={formData.avatar}
            alt={formData.firstName}
            className="w-16 h-16 rounded-full object-cover border-none"
          />
        </div>

        {/* ==============================================================================================================
            Form Fields (Read-Only)
        ============================================================================================================== */}
        {/* Employee Code */}
        <IdInput
          label="Employee Code"
          name="code"
          value={formData.code}
          disabled
        />

        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            disabled
          />
          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled
          />
        </div>

        {/* Email & Contact Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled
          />
          <PhoneNumber
            label="Contact Number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e?.target ? e.target.value : e)}
            disabled
          />
        </div>

        {/* Designation & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DropdownInput
            label="Designation"
            value={formData.designation}
            options={['Senior Manager', 'Sales Manager', 'Sales Executive', 'Account Executive']}
            onChange={(val) => handleChange('designation', val)}
            disabled
          />
          <DropdownInput
            label="Role"
            value={formData.role}
            options={['Choose Role', 'Sales Executive', 'Senior Sales Executive', 'Sales Manager']}
            onChange={(val) => handleChange('role', val)}
            disabled
          />
        </div>

        {/* Department & Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DropdownInput
            label="Department"
            value={formData.department}
            options={['HR & Admin', 'Sales & BD', 'Enterprise Sales', 'Client Acquisition']}
            onChange={(val) => handleChange('department', val)}
            disabled
          />
          <DropdownInput
            label="Grade"
            value={formData.grade}
            options={['Trainee / Entry Level', 'Associate', 'Mid-Senior Level', 'Senior Manager']}
            onChange={(val) => handleChange('grade', val)}
            disabled
          />
        </div>

        {/* Status Radio Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <label className="text-xs font-semibold text-black-90">
            Status
          </label>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-not-allowed opacity-80">
              <input
                type="radio"
                name="memberStatus"
                value="Active"
                checked={formData.status === 'Active'}
                disabled
                className="w-4 h-4 text-success accent-success focus:ring-success cursor-not-allowed"
              />
              <span className="text-xs font-medium text-black-90">Active</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-not-allowed opacity-80">
              <input
                type="radio"
                name="memberStatus"
                value="Inactive"
                checked={formData.status === 'Inactive'}
                disabled
                className="w-4 h-4 text-alert accent-alert focus:ring-alert cursor-not-allowed"
              />
              <span className="text-xs font-medium text-black-90">Inactive</span>
            </label>
          </div>
        </div>
      </div>
    </Drawer>
  );
});

ViewMemberDrawer.displayName = 'ViewMemberDrawer';

export default ViewMemberDrawer;
