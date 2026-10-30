//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, common drawer layout, form inputs, and back action button
//==================================================================================================================
import React, { useState, useEffect, memo, useCallback } from 'react';
import { Drawer } from '../../../components/common/Drawer';
import { TextInput } from '../../../components/common/input common/TextInput/TextInput';
import { IdInput } from '../../../components/common/input common/IdInput/IdInput';
import { DropdownInput } from '../../../components/common/input common/DropdownInput/DropdownInput';
import { PhoneNumber } from '../../../components/common/input common/PhoneNumber/PhoneNumber';
import { BackButton } from '../../../components/common/buttons/BackButton';

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
      subtitle="Update Employee member details, assigned system role, and account status."
      width="w-full sm:w-[560px]"
      footer={
        <div className="px-6 py-4 bg-white-100 border-t border-stroke sticky bottom-0 z-20 flex items-center justify-between w-full shrink-0">
          <BackButton onClick={onClose} label="Back" />
          {onSave && (
            <button
              type="button"
              onClick={() => onSave(formData)}
              className="px-5 py-2 rounded-lg bg-primary text-white-100 text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
            >
              Save Changes
            </button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-5 py-2">
        {/* ==============================================================================================================
            Member Avatar Upload Section
        ============================================================================================================== */}
        <div className="flex items-center gap-4 pb-2">
          <img
            src={formData.avatar}
            alt={formData.firstName}
            className="w-16 h-16 rounded-full object-cover border border-stroke shadow-3xs"
          />
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-primary text-white-100 text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-3xs"
            >
              Upload Profile
            </button>
            <button
              type="button"
              className="px-3.5 py-2 rounded-lg bg-alert/10 text-alert border border-alert/20 text-xs font-semibold hover:bg-alert/20 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>

        {/* ==============================================================================================================
            Form Fields
        ============================================================================================================== */}
        {/* Employee Code */}
        <IdInput
          label="Employee Code"
          name="code"
          value={formData.code}
        />

        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>

        {/* Email & Contact Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <PhoneNumber
            label="Contact Number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e?.target ? e.target.value : e)}
          />
        </div>

        {/* Designation & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DropdownInput
            label="Designation"
            value={formData.designation}
            options={['Senior Manager', 'Sales Manager', 'Sales Executive', 'Account Executive']}
            onChange={(val) => handleChange('designation', val)}
          />
          <DropdownInput
            label="Role"
            value={formData.role}
            options={['Choose Role', 'Sales Executive', 'Senior Sales Executive', 'Sales Manager']}
            onChange={(val) => handleChange('role', val)}
          />
        </div>

        {/* Department & Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DropdownInput
            label="Department"
            value={formData.department}
            options={['HR & Admin', 'Sales & BD', 'Enterprise Sales', 'Client Acquisition']}
            onChange={(val) => handleChange('department', val)}
          />
          <DropdownInput
            label="Grade"
            value={formData.grade}
            options={['Trainee / Entry Level', 'Associate', 'Mid-Senior Level', 'Senior Manager']}
            onChange={(val) => handleChange('grade', val)}
          />
        </div>

        {/* Status Radio Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <label className="text-xs font-semibold text-black-90">
            Status
          </label>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="memberStatus"
                value="Active"
                checked={formData.status === 'Active'}
                onChange={() => handleChange('status', 'Active')}
                className="w-4 h-4 text-success accent-success focus:ring-success cursor-pointer"
              />
              <span className="text-xs font-medium text-black-90">Active</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="memberStatus"
                value="Inactive"
                checked={formData.status === 'Inactive'}
                onChange={() => handleChange('status', 'Inactive')}
                className="w-4 h-4 text-alert accent-alert focus:ring-alert cursor-pointer"
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
