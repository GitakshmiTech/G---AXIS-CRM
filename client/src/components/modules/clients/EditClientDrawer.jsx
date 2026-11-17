//==================================================================================================================
//    EDIT CLIENT DRAWER COMPONENT (SUPER ADMIN WORKSPACE)
//    Slide-over drawer for updating enterprise client profile and account specifications
//==================================================================================================================

import React, { useState, useEffect, memo, useCallback } from 'react';
import { Drawer } from '../../common/sidebar/Drawer';
import { TextInput } from '../../common/inputs/TextInput';
import { DropdownInput } from '../../common/inputs/DropdownInput';
import { PhoneNumber } from '../../common/inputs/PhoneNumber';
import { UploadDropzone } from '../../common/inputs/UploadDropzone';
import { BackButton } from '../../common/buttons/BackButton';
import {
  INDUSTRY_OPTIONS,
  EMPLOYEE_SCALE_OPTIONS,
  COUNTRY_OPTIONS,
  STATE_OPTIONS,
  CITY_OPTIONS,
} from '../../../constants/leadsConstants';

//==================================================================================================================
//    EDIT CLIENT DRAWER
//==================================================================================================================
export const EditClientDrawer = memo(({
  isOpen = false,
  onClose,
  onSave,
  initialData = null,
  mode = 'edit', // 'view' | 'edit'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    industryType: '',
    employeeScale: '0 - 50',
    website: '',
    email: '',
    phone: '',
    address: 'Kaivanna Complex, 304 - 306 & 701, Chimanlal Girdharlal Rd, Panchavati Society, Ambawadi, Ahmedabad',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    postalCode: '380009',
    assignedBde: 'Johnson Doe',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        industryType: initialData.industryType || '',
        employeeScale: initialData.employeeScale || '0 - 50',
        website: initialData.website || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || 'Kaivanna Complex, 304 - 306 & 701, Chimanlal Girdharlal Rd, Panchavati Society, Ambawadi, Ahmedabad',
        country: initialData.country || 'India',
        state: initialData.state || 'Gujarat',
        city: initialData.city || 'Ahmedabad',
        postalCode: initialData.postalCode || '380009',
        assignedBde: initialData.assignedBde || 'Johnson Doe',
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

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    if (onSave) onSave(formData);
    if (onClose) onClose();
  }, [formData, onSave, onClose]);

  const isView = mode === 'view';

  return (
    //==================================================================================================================
    //    DRAWER CONTAINER
    //==================================================================================================================
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isView ? 'View Client Details' : 'Edit Client'}
      subtitle="Create and qualify a new enterprise prospect. Real-time deduplication verification is active across customer records."
      width="w-full sm:w-[560px]"
      bodyClassName="px-6 py-2"
      footer={
        <div className="px-6 py-2.5 sm:py-3 bg-white-100 sticky bottom-0 z-20 flex justify-between items-center shrink-0">
          <BackButton onClick={onClose} label="Back" />
          {!isView && (
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Upload Document Box (Common Component) */}
        {!isView && <UploadDropzone label="Upload Document (PNG, JPG or PDF (Max 5MB))" />}

        {/* Row 1: Client Name & Industry Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="Client Name"
            name="name"
            placeholder="Enter Client Name"
            value={formData.name}
            onChange={handleChange}
            disabled={isView}
          />
          <DropdownInput
            label="Industry Type"
            name="industryType"
            placeholder="Select Industry Type"
            options={INDUSTRY_OPTIONS}
            value={formData.industryType}
            onChange={(e) => handleDropdownChange('industryType', e.target.value)}
            disabled={isView}
          />
        </div>

        {/* Row 2: Employee Scale & Company Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DropdownInput
            label="Employee Scale"
            name="employeeScale"
            placeholder="0 - 50"
            options={EMPLOYEE_SCALE_OPTIONS}
            value={formData.employeeScale}
            onChange={(e) => handleDropdownChange('employeeScale', e.target.value)}
            disabled={isView}
          />
          <TextInput
            label="Company Website"
            name="website"
            placeholder="Enter Company Website"
            value={formData.website}
            onChange={handleChange}
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
          />
          <PhoneNumber
            label="Contact Number"
            name="phone"
            placeholder="98765 43210"
            value={formData.phone}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        {/* Row 4: Address (Full Width) */}
        <TextInput
          label="Address"
          name="address"
          placeholder="Kaivanna Complex, 304 - 306 & 701, Chimanlal Girdharlal Rd, Panchavati Society, Ambawadi, Ahmedabad"
          value={formData.address}
          onChange={handleChange}
          disabled={isView}
        />

        {/* Row 5: Country & State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DropdownInput
            label="Country"
            name="country"
            placeholder="India"
            options={COUNTRY_OPTIONS}
            value={formData.country}
            onChange={(e) => handleDropdownChange('country', e.target.value)}
            disabled={isView}
          />
          <DropdownInput
            label="State"
            name="state"
            placeholder="Gujarat"
            options={STATE_OPTIONS}
            value={formData.state}
            onChange={(e) => handleDropdownChange('state', e.target.value)}
            disabled={isView}
          />
        </div>

        {/* Row 6: City & Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DropdownInput
            label="City"
            name="city"
            placeholder="Ahmedabad"
            options={CITY_OPTIONS}
            value={formData.city}
            onChange={(e) => handleDropdownChange('city', e.target.value)}
            disabled={isView}
          />
          <TextInput
            label="Postal Code"
            name="postalCode"
            placeholder="380009"
            value={formData.postalCode}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        {/* Row 7: Assigned BDE */}
        <TextInput
          label="Assigned BDE"
          name="assignedBde"
          placeholder="Johnson Doe"
          value={formData.assignedBde}
          onChange={handleChange}
          disabled={true}
        />
      </form>
    </Drawer>
  );
});

EditClientDrawer.displayName = 'EditClientDrawer';
export default EditClientDrawer;
