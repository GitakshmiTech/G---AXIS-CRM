//==================================================================================================================
//    ADD / EDIT / VIEW LEAD DRAWER COMPONENT (ADMIN PANEL)
//    Slide-over drawer for inspecting, editing, and creating enterprise leads
//==================================================================================================================

import React, { useState, useEffect, memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Drawer } from '../../../components/common/Drawer';
import { TextInput } from '../../../components/common/input common/TextInput/TextInput';
import { DropdownInput } from '../../../components/common/input common/DropdownInput/DropdownInput';
import { PhoneNumber } from '../../../components/common/input common/PhoneNumber/PhoneNumber';
import { BackButton } from '../../../components/common/buttons/BackButton';
import { DocumentCard } from '../../../components/common/DocumentCard';
import { UploadDropzone } from '../../../components/common/UploadDropzone';
import {
  PRODUCT_INTEREST_OPTIONS,
  INDUSTRY_OPTIONS,
  EMPLOYEE_SCALE_OPTIONS,
  COUNTRY_OPTIONS,
  STATE_OPTIONS,
  CITY_OPTIONS,
  LEAD_STAGES,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  MOCK_DOCUMENTS,
} from '../../../constants/leadsConstants';

export const AddLeadDrawer = memo(({
  isOpen = false,
  onClose,
  onSave,
  onDeactivate,
  onConvert,
  initialData = null,
  mode = 'create', // 'create' | 'edit' | 'view'
}) => {
  //==================================================================================================================
  //    FORM STATE
  //==================================================================================================================
  const [formData, setFormData] = useState({
    code: '#001',
    name: '',
    designation: '',
    productInterest: '',
    leadSource: '',
    email: '',
    phone: '',
    priority: '',
    stage: 'New',
    companyName: '',
    industry: '',
    employeeScale: '0 - 50',
    website: '',
    address: 'Kaivanna Complex, 304 - 306 & 701, Chimanlal Girdharlal Rd, Panchavati Society, Ambawadi, Ahmedabad',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    postalCode: '380009',
  });

  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);

  // Populate data when editing or viewing
  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '#001',
        name: initialData.leadName || initialData.name || '',
        designation: initialData.designation || '',
        productInterest: initialData.productInterest || '',
        leadSource: initialData.leadSource || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        priority: initialData.priority || 'Low',
        stage: initialData.stage || 'Proposal',
        companyName: initialData.companyName || '',
        industry: initialData.industry || 'Information Technology',
        employeeScale: initialData.employeeScale || '0 - 50',
        website: initialData.website || '',
        address: initialData.address || 'Kaivanna Complex, 304 - 306 & 701, Chimanlal Girdharlal Rd, Panchavati Society, Ambawadi, Ahmedabad',
        country: initialData.country || 'India',
        state: initialData.state || 'Gujarat',
        city: initialData.city || 'Ahmedabad',
        postalCode: initialData.postalCode || '380009',
      });
      setDocuments(MOCK_DOCUMENTS);
    } else {
      setFormData({
        code: '#001',
        name: '',
        designation: '',
        productInterest: '',
        leadSource: '',
        email: '',
        phone: '',
        priority: '',
        stage: 'New',
        companyName: '',
        industry: '',
        employeeScale: '0 - 50',
        website: '',
        address: 'Kaivanna Complex, 304 - 306 & 701, Chimanlal Girdharlal Rd, Panchavati Society, Ambawadi, Ahmedabad',
        country: 'India',
        state: 'Gujarat',
        city: 'Ahmedabad',
        postalCode: '380009',
      });
      setDocuments([]);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, val) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleDeleteDocument = (docId) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSave) onSave(formData);
    if (onClose) onClose();
  };

  const isViewOrEdit = mode === 'view' || mode === 'edit';
  const drawerTitle = isViewOrEdit ? 'Lead Details' : 'Add New Lead';

  //==================================================================================================================
  //    RENDER DRAWER
  //==================================================================================================================
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={drawerTitle}
      subtitle="Create and qualify a new enterprise prospect. Real-time deduplication verification is active across customer records."
      width="w-full sm:w-[700px]"
      bodyClassName="px-6 py-4"
      footer={
        <div className="px-3 sm:px-6 py-2.5 sm:py-4 bg-white-100 border-t border-stroke sticky bottom-0 z-20 flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center justify-between sm:justify-start">
            <BackButton onClick={onClose} label="Back" />
            <button
              type="button"
              onClick={handleSubmit}
              className="sm:hidden px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              Save Lead
            </button>
          </div>

          {/* Action Buttons: 1st/2nd images show only Save Lead for Add New Lead; View/Edit shows Deactivate, Convert, Save */}
          {isViewOrEdit ? (
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <button
                type="button"
                onClick={onDeactivate}
                className="flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border border-alert bg-alert-light text-alert hover:bg-alert-light/80 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                Deactivate Lead
              </button>

              <button
                type="button"
                onClick={onConvert}
                className="flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-success hover:bg-success/90 text-white-100 text-[11px] sm:text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Convert Lead</span>
                <ChevronRight size={14} />
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                Save Lead
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-white-100 text-xs font-semibold px-6 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Save Lead
            </button>
          )}
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* ================================================================================================================
            ROW 1: Lead Code & Full Name
        ================================================================================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="Lead Code"
            name="code"
            value={formData.code}
            disabled={true}
            readOnly
          />
          <TextInput
            label="Full Name"
            name="name"
            placeholder="Enter Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* ================================================================================================================
            ROW 2: Designation (Full Width)
        ================================================================================================================ */}
        <TextInput
          label="Designation"
          name="designation"
          placeholder="Enter Designation"
          value={formData.designation}
          onChange={handleChange}
        />

        {/* ================================================================================================================
            ROW 3: Product Interest & Lead Source
        ================================================================================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DropdownInput
            label="Product Interest"
            name="productInterest"
            placeholder="Select Product"
            options={PRODUCT_INTEREST_OPTIONS}
            value={formData.productInterest}
            onChange={(e) => handleDropdownChange('productInterest', e.target.value)}
          />
          <DropdownInput
            label="Lead Source"
            name="leadSource"
            placeholder="Select Lead Source"
            options={LEAD_SOURCES.filter((s) => s.value !== 'All')}
            value={formData.leadSource}
            onChange={(e) => handleDropdownChange('leadSource', e.target.value)}
          />
        </div>

        {/* ================================================================================================================
            ROW 4: Email & Contact Number
        ================================================================================================================ */}
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
            required
          />
        </div>

        {/* ================================================================================================================
            ROW 5: Priority & Lead Stage
        ================================================================================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DropdownInput
            label="Priority"
            name="priority"
            placeholder="Select Priority"
            options={LEAD_PRIORITIES.filter((p) => p.value !== 'All')}
            value={formData.priority}
            onChange={(e) => handleDropdownChange('priority', e.target.value)}
          />
          <DropdownInput
            label="Lead Stage"
            name="stage"
            placeholder="New (Default)"
            options={LEAD_STAGES.filter((s) => s.value !== 'All')}
            value={formData.stage}
            onChange={(e) => handleDropdownChange('stage', e.target.value)}
          />
        </div>

        {/* ================================================================================================================
            SECTION: Organization Details
        ================================================================================================================ */}
        <div className="pt-2">
          <h3 className="text-[13px] font-bold text-[#101828] tracking-tight">
            Organization Details
          </h3>
        </div>

        {/* ================================================================================================================
            ROW 6: Organization Name & Industry Type
        ================================================================================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="Organization Name"
            name="companyName"
            placeholder="Enter Organization Name"
            value={formData.companyName}
            onChange={handleChange}
          />
          <DropdownInput
            label="Industry Type"
            name="industry"
            placeholder="Select Industry Type"
            options={INDUSTRY_OPTIONS}
            value={formData.industry}
            onChange={(e) => handleDropdownChange('industry', e.target.value)}
          />
        </div>

        {/* ================================================================================================================
            ROW 7: Employee Scale & Company Website
        ================================================================================================================ */}
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

        {/* ================================================================================================================
            ROW 8: Address (Full Width)
        ================================================================================================================ */}
        <TextInput
          label="Address"
          name="address"
          placeholder="Enter Address"
          value={formData.address}
          onChange={handleChange}
        />

        {/* ================================================================================================================
            ROW 9: Country & State
        ================================================================================================================ */}
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

        {/* ================================================================================================================
            ROW 10: City & Postal Code
        ================================================================================================================ */}
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

        {/* ================================================================================================================
            ROW 11: Document Upload / Uploaded Documents Section
        ================================================================================================================ */}
        {isViewOrEdit && documents.length > 0 ? (
          <div className="flex flex-col gap-2 pt-1">
            <h4 className="text-xs font-bold text-black-90">
              Uploaded Documents
            </h4>
            <div className="flex flex-col gap-2">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  size={doc.size}
                  uploadDate={doc.uploadDate}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          </div>
        ) : (
          <UploadDropzone
            label="Upload Document (PNG, JPG or PDF (Max 10 Docs & Max 5MB Each))"
            placeholder="Drag and drop or click to upload"
          />
        )}
      </form>
    </Drawer>
  );
});

AddLeadDrawer.displayName = 'AddLeadDrawer';
export default AddLeadDrawer;
