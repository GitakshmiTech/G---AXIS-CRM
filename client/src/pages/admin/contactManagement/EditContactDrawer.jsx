//==================================================================================================================
//    EDIT CONTACT DRAWER COMPONENT (SUPER ADMIN WORKSPACE)
//    Slide-over drawer for updating contact stakeholder information and profile specifics
//==================================================================================================================

import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { Drawer } from '../../../components/common/Drawer';
import { TextInput } from '../../../components/common/input common/TextInput/TextInput';
import { DropdownInput } from '../../../components/common/input common/DropdownInput/DropdownInput';
import { PhoneNumber } from '../../../components/common/input common/PhoneNumber/PhoneNumber';
import { BackButton } from '../../../components/common/buttons/BackButton';
import { ContactAvatarPlaceholder } from '../../../components/common/ContactAvatarPlaceholder';
import { LEAD_SOURCES } from '../../../constants/leadsConstants';

//==================================================================================================================
//    EDIT / VIEW CONTACT DRAWER
//==================================================================================================================
export const EditContactDrawer = memo(({
  isOpen = false,
  onClose,
  onSave,
  initialData = null,
  mode = 'edit', // 'view' | 'edit'
}) => {
  const [formData, setFormData] = useState({
    firstName: 'Johnson',
    lastName: 'Doe',
    designation: 'VP of Sales',
    leadSource: 'LinkedIn',
    email: 'johnson.doe@abccompany.com',
    phone: '98765 43210',
    companyName: 'ABC Company Pvt Ltd',
    assignedBde: 'Johnson Doe',
    avatar: '',
    uploadedAvatar: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      const names = (initialData.name || 'Johnson Doe').split(' ');
      setFormData({
        firstName: names[0] || 'Johnson',
        lastName: names.slice(1).join(' ') || 'Doe',
        designation: initialData.designation || 'VP of Sales',
        leadSource: initialData.leadSource || 'LinkedIn',
        email: initialData.email || 'johnson.doe@abccompany.com',
        phone: initialData.phone || '98765 43210',
        companyName: initialData.companyName || 'ABC Company Pvt Ltd',
        assignedBde: initialData.assignedBde || 'Johnson Doe',
        avatar: '',
        uploadedAvatar: null,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDropdownChange = useCallback((name, val) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
  }, []);

  const handleUploadProfileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar: url, uploadedAvatar: url }));
    }
  };

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    if (onSave) onSave({ ...formData, name: `${formData.firstName} ${formData.lastName}`.trim() });
    if (onClose) onClose();
  }, [formData, onSave, onClose]);

  return (
    //==================================================================================================================
    //    DRAWER CONTAINER
    //==================================================================================================================
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'view' ? 'View Contact' : 'Edit Contact'}
      subtitle="Create and qualify a new enterprise prospect. Real-time deduplication verification is active across customer records."
      width="w-full sm:w-[700px]"
      headerClassName="p-5 pb-2"
      bodyClassName="px-6 pt-1 pb-5"
      footer={
        <div className="px-6 py-4 bg-white-100 border-t border-stroke sticky bottom-0 z-20 flex justify-between items-center shrink-0">
          <BackButton onClick={onClose} label="Back" />
          {mode !== 'view' && (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white-100 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Save Details
            </button>
          )}
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Top Profile Image Upload Section (Same as BDE) */}
        <div className="flex items-center gap-4">
          {formData.uploadedAvatar ? (
            <div className="w-[76px] h-[76px] rounded-full border border-stroke overflow-hidden shrink-0">
              <img
                src={formData.uploadedAvatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <ContactAvatarPlaceholder size="w-[76px] h-[76px]" />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {mode !== 'view' && (
            <button
              type="button"
              onClick={handleUploadProfileClick}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none shadow-xs active:scale-95"
            >
              Upload Profile
            </button>
          )}
        </div>

        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="First Name"
            name="firstName"
            placeholder="Enter First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextInput
            label="Last Name"
            name="lastName"
            placeholder="Enter Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        {/* Row 2: Designation & Lead Source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="Designation"
            name="designation"
            placeholder="Enter Designation Name"
            value={formData.designation}
            onChange={handleChange}
          />
          <DropdownInput
            label="Lead Source"
            name="leadSource"
            placeholder="Select Lead Source"
            options={LEAD_SOURCES}
            value={formData.leadSource}
            onChange={(e) => handleDropdownChange('leadSource', e.target.value)}
          />
        </div>

        {/* Row 3: Email & Contact Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <PhoneNumber
            label="Contact Number"
            name="phone"
            placeholder="98765 43210"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Row 4: Company Name & Assigned BDE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="Company Name"
            name="companyName"
            placeholder="Enter Company Name"
            value={formData.companyName}
            onChange={handleChange}
          />
          <TextInput
            label="Assigned BDE"
            name="assignedBde"
            placeholder="Johnson Doe"
            value={formData.assignedBde}
            onChange={handleChange}
          />
        </div>
      </form>
    </Drawer>
  );
});

EditContactDrawer.displayName = 'EditContactDrawer';
export default EditContactDrawer;
