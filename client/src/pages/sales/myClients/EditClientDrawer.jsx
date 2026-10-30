//==================================================================================================================
//    EDIT CLIENT DRAWER COMPONENT (SALES WORKSPACE)
//    Slide-over drawer for updating enterprise client profile and account specifications
//==================================================================================================================

import React, { useState, useEffect, memo, useCallback } from 'react';
import { Drawer } from '../../../components/common/Drawer';
import { TextInput } from '../../../components/common/input common/TextInput/TextInput';
import { DropdownInput } from '../../../components/common/input common/DropdownInput/DropdownInput';
import { PhoneNumber } from '../../../components/common/input common/PhoneNumber/PhoneNumber';
import { UploadDropzone } from '../../../components/common/UploadDropzone';
import { BackButton } from '../../../components/common/buttons/BackButton';
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

  return (
    //==================================================================================================================
    //    DRAWER CONTAINER
    //==================================================================================================================
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'view' ? 'View Client' : 'Edit Client'}
      subtitle="Create and qualify a new enterprise prospect. Real-time deduplication verification is active across customer records."
      width="w-full sm:w-[560px]"
      bodyClassName="px-6 py-5"
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
        {/* Upload Document Box (Common Component) */}
        <UploadDropzone label="Upload Document (PNG, JPG or PDF (Max 5MB))" />

        {/* Row 1: Client Name & Industry Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="Client Name"
            name="name"
            placeholder="Enter Client Name"
            value={formData.name}
            onChange={handleChange}
          />
          <DropdownInput
            label="Industry Type"
            name="industryType"
            placeholder="Select Industry Type"
            options={INDUSTRY_OPTIONS}
            value={formData.industryType}
            onChange={(e) => handleDropdownChange('industryType', e.target.value)}
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
          />
          <TextInput
            label="Company Website"
            name="website"
            placeholder="Enter Company Website"
            value={formData.website}
            onChange={handleChange}
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

        {/* Row 4: Address (Full Width) */}
        <TextInput
          label="Address"
          name="address"
          placeholder="Kaivanna Complex, 304 - 306 & 701, Chimanlal Girdharlal Rd, Panchavati Society, Ambawadi, Ahmedabad"
          value={formData.address}
          onChange={handleChange}
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
          />
          <DropdownInput
            label="State"
            name="state"
            placeholder="Gujarat"
            options={STATE_OPTIONS}
            value={formData.state}
            onChange={(e) => handleDropdownChange('state', e.target.value)}
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
          />
          <TextInput
            label="Postal Code"
            name="postalCode"
            placeholder="380009"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </div>

        {/* Row 7: Assigned BDE */}
        <TextInput
          label="Assigned BDE"
          name="assignedBde"
          placeholder="Johnson Doe"
          value={formData.assignedBde}
          onChange={handleChange}
        />
      </form>
    </Drawer>
  );
});

export default EditClientDrawer;
