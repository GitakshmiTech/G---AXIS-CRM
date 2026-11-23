//==================================================================================================================
//    ADD / EDIT / VIEW LEAD DRAWER COMPONENT (ADMIN PANEL)
//    Slide-over drawer for inspecting, editing, and creating enterprise leads
//==================================================================================================================

import { useState, useEffect, useMemo, memo, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { Drawer } from '../../common/sidebar/Drawer';
import { TextInput } from '../../common/inputs/TextInput';
import { DropdownInput } from '../../common/inputs/DropdownInput';
import { PhoneNumber } from '../../common/inputs/PhoneNumber';
import { BackButton } from '../../common/buttons/BackButton';
import { DocumentCard } from './DocumentCard';
import { UploadDropzone } from '../../common/inputs/UploadDropzone';
import { downloadLocalDocument, previewLocalDocument } from '../../../utils/documentUtils';
import { leadSchema } from '../../../utils/validationSchemas';
import { clearFieldError, focusFirstInvalidField, validateForm } from '../../../utils/validationUtils';
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
} from '../../../constants/leadsConstants';

export const AddLeadDrawer = memo(({
  isOpen = false,
  onClose,
  onSave,
  saveError = '',
  serverErrors = {},
  duplicateLead = null,
  onOpenDuplicate,
  onDeactivate,
  onConvert,
  initialData = null,
  mode = 'create', // 'create' | 'edit' | 'view'
  presentation = 'drawer',
}) => {
  //==================================================================================================================
  //    FORM STATE
  //==================================================================================================================
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    designation: '',
    productInterest: '',
    leadSource: '',
    email: '',
    phone: '',
    priority: '',
    stage: '',
    companyName: '',
    industry: '',
    employeeScale: '',
    website: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    requirement: '',
    expectedValue: '',
  });

  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [dismissedServerErrors, setDismissedServerErrors] = useState({});
  const formRef = useRef(null);
  const industryOptions = useMemo(() => (
    initialData?.industry && !INDUSTRY_OPTIONS.some((option) => option.value === initialData.industry)
      ? [...INDUSTRY_OPTIONS, { value: initialData.industry, label: `Industry ID: ${initialData.industry}` }]
      : INDUSTRY_OPTIONS
  ), [initialData]);
  const cityOptions = useMemo(() => (
    initialData?.city && !CITY_OPTIONS.some((option) => option.value === initialData.city)
      ? [...CITY_OPTIONS, { value: initialData.city, label: `City ID: ${initialData.city}` }]
      : CITY_OPTIONS
  ), [initialData]);

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
        priority: initialData.priority || '',
        stage: initialData.stage || '',
        companyName: initialData.companyName || '',
        industry: initialData.industry || '',
        employeeScale: initialData.employeeScale || '',
        website: initialData.website || '',
        address: initialData.address || '',
        country: initialData.country || '',
        state: initialData.state || '',
        city: initialData.city || '',
        postalCode: initialData.postalCode || '',
        requirement: initialData.requirement || '',
        expectedValue: initialData.expectedValue || '',
      });
      setDocuments(initialData.documents || []);
      setSelectedFiles([]);
    } else {
      setFormData({
        code: '',
        name: '',
        designation: '',
        productInterest: '',
        leadSource: '',
        email: '',
        phone: '',
        priority: '',
        stage: '',
        companyName: '',
        industry: '',
        employeeScale: '',
        website: '',
        address: '',
        country: '',
        state: '',
        city: '',
        postalCode: '',
        requirement: '',
        expectedValue: '',
      });
      setDocuments([]);
      setSelectedFiles([]);
      setUploadError('');
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (Object.keys(serverErrors).length) focusFirstInvalidField(formRef.current, serverErrors);
  }, [serverErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(setFieldErrors, name);
    setDismissedServerErrors((current) => ({ ...current, [name]: true }));
  };

  const handleDropdownChange = (name, val) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
    clearFieldError(setFieldErrors, name);
    setDismissedServerErrors((current) => ({ ...current, [name]: true }));
  };

  const handleDeleteDocument = (docId) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  /** Validate the user-selected files against the API's size, type, and count limits. */
  const handleFileSelect = (fileList) => {
    const files = Array.from(fileList || []);
    const allowed = /\.(png|jpe?g|pdf)$/i;
    const invalid = files.find((file) => !allowed.test(file.name) || file.size > 5 * 1024 * 1024);
    if (invalid) { setUploadError(`${invalid.name}: use PNG, JPG, or PDF files up to 5 MB each.`); return; }
    if (documents.length + selectedFiles.length + files.length > 10) { setUploadError('A lead can have up to 10 documents.'); return; }
    setUploadError('');
    setSelectedFiles((current) => [...current, ...files]);
  };

  const handleDownloadDocument = (docId) => {
    const doc = documents.find((item) => item.id === docId);
    if (doc && initialData?.onDownloadDocument) initialData.onDownloadDocument(docId, doc.name || doc.originalName);
  };

  /** Open an uploaded document in a new browser tab for preview. */
  const handleViewDocument = (docId) => {
    const doc = documents.find((item) => item.id === docId);
    if (doc && initialData?.onViewDocument) initialData.onViewDocument(docId, doc.name || doc.originalName);
  };

  /** Preview or download a selected file before the lead is saved. */
  const handleSelectedFileAction = (file, action) => {
    try {
      if (action === 'view') previewLocalDocument(file);
      else downloadLocalDocument(file);
      setUploadError('');
    } catch (fileError) {
      setUploadError(fileError.message || 'Unable to open the selected document.');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const validation = await validateForm(leadSchema, formData);
    if (Object.keys(validation.errors).length) {
      setFieldErrors(validation.errors);
      focusFirstInvalidField(formRef.current, validation.errors);
      return;
    }
    setFieldErrors({});
    if (onSave) await onSave(formData, selectedFiles, documents);
  };

  const isView = mode === 'view';
  const isViewOrEdit = mode === 'view' || mode === 'edit';
  const drawerTitle = isView ? 'View Lead Details' : mode === 'edit' ? 'Edit Lead Details' : 'Add New Lead';

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
      presentation={presentation}
      bodyClassName="px-6 py-2"
      footer={
        <div className={`px-3 sm:px-6 py-2.5 sm:py-3 bg-white-100 ${presentation === 'drawer' ? 'sticky bottom-0 z-20' : ''} flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 sm:gap-4 shrink-0`}>
          <div className="flex items-center justify-between sm:justify-start">
            <BackButton onClick={onClose} label="Back" />
            {!isView && (
              <button
                type="button"
                onClick={handleSubmit}
                className="sm:hidden px-3.5 py-1.5 rounded-[7px] bg-primary hover:bg-primary/90 text-white-100 text-xs font-semibold border-b-2 border-black-90/20 transition-colors cursor-pointer"
              >
                Save Lead
              </button>
            )}
          </div>

          {/* Action Buttons: View mode has NO Save Lead; Edit mode has Deactivate, Convert, Save; Create mode has Save */}
          {mode === 'edit' ? (
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <button
                type="button"
                onClick={onDeactivate}
                className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[7px] border-b-2 border-alert bg-alert-light text-alert hover:bg-alert-light/80 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                Deactivate Lead
              </button>

              <button
                type="button"
                onClick={onConvert}
                className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[7px] bg-success hover:bg-success/90 text-white-100 border-b-2 border-black-90/20 text-[11px] sm:text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Convert Lead</span>
                <ChevronRight size={14} />
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="hidden sm:inline-flex px-4 py-1.5 sm:py-2 rounded-[7px] bg-primary hover:bg-primary/90 text-white-100 border-b-2 border-black-90/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                Save Lead
              </button>
            </div>
          ) : isView ? (
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <button
                type="button"
                onClick={onDeactivate}
                className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[7px] border-b-2 border-alert bg-alert-light text-alert hover:bg-alert-light/80 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                Deactivate Lead
              </button>

              <button
                type="button"
                onClick={onConvert}
                className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[7px] bg-success hover:bg-success/90 text-white-100 border-b-2 border-black-90/20 text-[11px] sm:text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Convert Lead</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-white-100 text-xs font-semibold px-5 py-1.5 sm:py-2 rounded-[7px] border-b-2 border-black-90/20 transition-all cursor-pointer active:scale-95"
            >
              Save Lead
            </button>
          )}
        </div>
      }
    >
      <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        {saveError && <div role="alert" className="rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 px-3 py-2 text-xs text-alert">
          <p>{saveError}</p>
          {duplicateLead && <button type="button" onClick={() => onOpenDuplicate?.(duplicateLead)} className="mt-2 font-semibold text-primary underline cursor-pointer">
            Open existing lead {duplicateLead.code}: {duplicateLead.name}
          </button>}
        </div>}
        {/* ================================================================================================================
            ROW 1: Lead Code for Existing Leads and Full Name
        ================================================================================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {mode !== 'create' && <TextInput label="Lead Code" name="code" value={formData.code} disabled readOnly />}
          <TextInput
            label="Full Name"
            name="name"
            placeholder="Enter Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isView}
            error={fieldErrors.name || (!dismissedServerErrors.name && serverErrors.name)}
          />
          {mode === 'create' && <TextInput
            label="Designation"
            name="designation"
            placeholder="Enter Designation"
            value={formData.designation}
            onChange={handleChange}
          />}
        </div>

        {/* ================================================================================================================
            ROW 2: Designation (Full Width)
        ================================================================================================================ */}
        {mode !== 'create' && <TextInput
          label="Designation"
          name="designation"
          placeholder="Enter Designation"
          value={formData.designation}
          onChange={handleChange}
          disabled={isView}
        />}

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
            disabled={isView}
          />
          <DropdownInput
            label="Lead Source"
            name="leadSource"
            placeholder="Select Lead Source"
            options={LEAD_SOURCES.filter((s) => s.value !== 'All')}
            value={formData.leadSource}
            onChange={(e) => handleDropdownChange('leadSource', e.target.value)}
            disabled={isView}
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
            disabled={isView}
            required
            error={fieldErrors.email || (!dismissedServerErrors.email && serverErrors.email)}
          />
          <PhoneNumber
            label="Contact Number"
            name="phone"
            placeholder="Enter Contact Number"
            value={formData.phone}
            onChange={handleChange}
            disabled={isView}
            required
            error={fieldErrors.phone || (!dismissedServerErrors.phone && serverErrors.phone)}
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
            disabled={isView}
          />
          <DropdownInput
            label="Lead Stage"
            name="stage"
            placeholder="Select Lead Stage"
            options={LEAD_STAGES.filter((s) => s.value !== 'All')}
            value={formData.stage}
            onChange={(e) => handleDropdownChange('stage', e.target.value)}
            disabled={isView}
          />
        </div>

        {/* ================================================================================================================
            SECTION: Organization Details
        ================================================================================================================ */}
        <div className="pt-2">
          <h3 className="text-[13px] font-bold text-black-90 tracking-tight">
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
            disabled={isView}
            required
            error={fieldErrors.companyName || (!dismissedServerErrors.companyName && serverErrors.companyName)}
          />
          <DropdownInput
            label="Industry Type"
            name="industry"
            placeholder="Select Industry Type"
            options={industryOptions}
            value={formData.industry}
            onChange={(e) => handleDropdownChange('industry', e.target.value)}
            disabled={isView}
          />
        </div>

        {/* ================================================================================================================
            ROW 7: Employee Scale & Company Website
        ================================================================================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DropdownInput
            label="Employee Scale"
            name="employeeScale"
            placeholder="Select Employee Scale"
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
            error={fieldErrors.website || (!dismissedServerErrors.website && serverErrors.website)}
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
          disabled={isView}
          error={fieldErrors.expectedValue || (!dismissedServerErrors.expectedValue && serverErrors.expectedValue)}
        />

        <TextInput
          label="Business Requirement"
          name="requirement"
          placeholder="Describe the lead requirement"
          value={formData.requirement}
          onChange={handleChange}
          disabled={isView}
        />

        {/* ================================================================================================================
            ROW 9: Country & State
        ================================================================================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DropdownInput
            label="Country"
            name="country"
            placeholder="Select Country"
            options={COUNTRY_OPTIONS}
            value={formData.country}
            onChange={(e) => handleDropdownChange('country', e.target.value)}
            disabled={isView}
          />
          <DropdownInput
            label="State"
            name="state"
            placeholder="Select State"
            options={STATE_OPTIONS}
            value={formData.state}
            onChange={(e) => handleDropdownChange('state', e.target.value)}
            disabled={isView}
          />
        </div>

        {/* ================================================================================================================
            ROW 10: City & Postal Code
        ================================================================================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DropdownInput
            label="City"
            name="city"
            placeholder="Select City"
            options={cityOptions}
            value={formData.city}
            onChange={(e) => handleDropdownChange('city', e.target.value)}
            disabled={isView}
          />
          <TextInput
            label="Postal Code"
            name="postalCode"
            placeholder="Enter Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        <TextInput
          label="Expected Value"
          name="expectedValue"
          type="number"
          placeholder="Enter expected value"
          value={formData.expectedValue}
          onChange={handleChange}
          disabled={isView}
        />

        {/* ================================================================================================================
            ROW 11: Document Upload / Uploaded Documents Section
        ================================================================================================================ */}
        {(isViewOrEdit && documents.length > 0) || selectedFiles.length > 0 ? (
          <div className="flex flex-col gap-2 pt-1">
            <h4 className="text-xs font-bold text-black-90">
              Uploaded Documents
            </h4>
            <div className="flex flex-col gap-2">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  id={doc.id}
                  name={doc.name || doc.originalName}
                  size={doc.sizeLabel || doc.size}
                  uploadDate={doc.uploadDate}
                  onDownload={handleDownloadDocument}
                  onView={handleViewDocument}
                  onDelete={isView ? undefined : handleDeleteDocument}
                />
              ))}
              {selectedFiles.map((file, index) => <DocumentCard
                key={`${file.name}-${index}`}
                id={`pending-${index}`}
                name={file.name}
                size={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                uploadDate="Ready to upload"
                onView={() => handleSelectedFileAction(file, 'view')}
                onDownload={() => handleSelectedFileAction(file, 'download')}
                onDelete={() => setSelectedFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                deleteTitle="Cancel Upload"
              />)}
            </div>
          </div>
        ) : null}
        {!isView && documents.length + selectedFiles.length < 10 && (
          <UploadDropzone
            label="Upload Document (PNG, JPG or PDF (Max 10 Docs & Max 5MB Each))"
            placeholder="Drag and drop or click to upload"
            size="medium"
            onFileSelect={handleFileSelect}
            multiple
          />
        )}
        {uploadError && <p role="alert" className="text-xs text-alert">{uploadError}</p>}
      </form>
    </Drawer>
  );
});

AddLeadDrawer.displayName = 'AddLeadDrawer';
export default AddLeadDrawer;
