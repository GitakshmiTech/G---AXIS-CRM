//==================================================================================================================
//    EDIT CONTACT DRAWER COMPONENT (SUPER ADMIN WORKSPACE)
//    Slide-over drawer for updating contact stakeholder information and profile specifics
//==================================================================================================================

import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { Drawer } from '../../common/sidebar/Drawer';
import { TextInput } from '../../common/inputs/TextInput';
import { DropdownInput } from '../../common/inputs/DropdownInput';
import { PhoneNumber } from '../../common/inputs/PhoneNumber';
import { BackButton } from '../../common/buttons/BackButton';
import { ContactAvatarPlaceholder } from '../../common/avatar/ContactAvatarPlaceholder';
import { LEAD_SOURCES } from '../../../constants/leadsConstants';
import { editContactSchema } from '../../../utils/validationSchemas';
import { clearFieldError, focusFirstInvalidField, validateForm } from '../../../utils/validationUtils';

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
  const isView = mode === 'view';
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    leadSource: '',
    email: '',
    phone: '',
    companyName: '',
    assignedBde: '',
    avatar: '',
    uploadedAvatar: null,
  });

  const fileInputRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      const names = (initialData.name || '').trim().split(' ');
      setFormData({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        designation: initialData.designation || '',
        leadSource: initialData.leadSource || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        companyName: initialData.companyName || '',
        assignedBde: initialData.assignedBde || '',
        avatar: initialData.avatar || '',
        uploadedAvatar: null,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(setFieldErrors, name);
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

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    const validation = await validateForm(editContactSchema, formData);
    if (Object.keys(validation.errors).length) { setFieldErrors(validation.errors); focusFirstInvalidField(formRef.current, validation.errors); return; }
    setFieldErrors({});
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
      headerClassName="px-6 py-2"
      bodyClassName="px-6 py-2"
      footer={
        <div className="px-6 py-2.5 sm:py-3 bg-white-100 sticky bottom-0 z-20 flex justify-between items-center shrink-0">
          <BackButton onClick={onClose} label="Back" />
          {mode !== 'view' && (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white-100 text-xs sm:text-sm font-semibold px-5 py-1.5 sm:py-2 rounded-[7px] border-b-2 border-black-90/20 transition-all cursor-pointer active:scale-95"
            >
              Save Details
            </button>
          )}
        </div>
      }
    >
      <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Top Profile Image Upload Section (Same as BDE) */}
        <div className="flex items-center gap-4">
          {formData.uploadedAvatar ? (
            <div className="w-[76px] h-[76px] rounded-full border-none overflow-hidden shrink-0">
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
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer   active:scale-95"
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
            disabled={isView}
            error={fieldErrors.firstName}
          />
          <TextInput
            label="Last Name"
            name="lastName"
            placeholder="Enter Last Name"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isView}
            error={fieldErrors.lastName}
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
            disabled={isView}
          />
          <DropdownInput
            label="Lead Source"
            name="leadSource"
            placeholder="Select Lead Source"
            options={LEAD_SOURCES}
            value={formData.leadSource}
            onChange={(e) => handleDropdownChange('leadSource', e.target.value)}
            disabled={isView}
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
            disabled={isView}
            error={fieldErrors.email}
          />
          <PhoneNumber
            label="Contact Number"
            name="phone"
            placeholder=""
            value={formData.phone}
            onChange={handleChange}
            disabled={isView}
            error={fieldErrors.phone}
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
            disabled={isView}
          />
          <TextInput
            label="Assigned BDE"
            name="assignedBde"
            placeholder="Johnson Doe"
            value={formData.assignedBde}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
      </form>
    </Drawer>
  );
});

EditContactDrawer.displayName = 'EditContactDrawer';
export default EditContactDrawer;
