//==================================================================================================================
//    ADD / EDIT / VIEW LEAD DRAWER & PAGE COMPONENT
//    Structured enterprise lead creation and qualification form with dynamic BDE assignment and section cards
//==================================================================================================================

import { useState, useEffect, useMemo, memo, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  ChevronRight,
  UserCheck,
  User,
  Building2,
  MapPin,
  FileText,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Drawer } from '../../common/sidebar/Drawer';
import { TextInput } from '../../common/inputs/TextInput';
import { DropdownInput } from '../../common/inputs/DropdownInput';
import { PhoneNumber } from '../../common/inputs/PhoneNumber';
import { TextAreaInput } from '../quotations/TextAreaInput';
import { BackButton } from '../../common/buttons/BackButton';
import { DocumentCard } from './DocumentCard';
import { UploadDropzone } from '../../common/inputs/UploadDropzone';
import { downloadLocalDocument, previewLocalDocument } from '../../../utils/documentUtils';
import { leadSchema } from '../../../utils/validationSchemas';
import { clearFieldError, focusFirstInvalidField, validateForm } from '../../../utils/validationUtils';
import { fetchTeamMembers } from '../../../services/teamService';
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
  //    AUTH ROLE DETERMINATION (BDE vs Sales Manager / Admin)
  //==================================================================================================================
  const auth = useSelector((state) => state.auth);
  const authRole = String(auth?.role || auth?.user?.role || '').toLowerCase();
  const isSalesManagerOrAdmin =
    authRole === 'sales' ||
    authRole === 'admin' ||
    authRole === 'super_admin' ||
    authRole.includes('manager') ||
    authRole.includes('admin');

  // Resolve authentic database user ID dynamically
  const currentUserId = useMemo(() => {
    let id = auth?.user?.id || auth?.user?.userId || '';
    if (!id || /^usr-/i.test(String(id))) {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const parts = token.split('.');
          if (parts.length >= 2) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            id = payload.userId || payload.id || id;
          }
        }
      } catch {
        // Ignore token decode error
      }
    }
    return String(id || '');
  }, [auth?.user?.id, auth?.user?.userId]);

  //==================================================================================================================
  //    DYNAMIC BDE OPTIONS FROM SALES TEAM SERVICE (Only queried for Sales Manager & Admin)
  //==================================================================================================================
  const [bdeOptions, setBdeOptions] = useState([]);
  const [bdeLoading, setBdeLoading] = useState(false);

  useEffect(() => {
    if (!isSalesManagerOrAdmin) return;
    let active = true;
    setBdeLoading(true);
    fetchTeamMembers({ limit: 100, status: 'Active' })
      .then((res) => {
        if (!active) return;
        const options = (res?.rows || []).map((m) => ({
          value: String(m.id),
          label: `${m.name} (${m.code || 'BDE'})`,
        }));
        setBdeOptions(options);
      })
      .catch((err) => {
        console.warn('Unable to load dynamic BDE list:', err);
      })
      .finally(() => {
        if (active) setBdeLoading(false);
      });
    return () => { active = false; };
  }, [isSalesManagerOrAdmin]);

  //==================================================================================================================
  //    FORM STATE
  //==================================================================================================================
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    designation: '',
    assignedTo: '',
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

  const resolvedBdeOptions = useMemo(() => {
    const list = [...bdeOptions];
    if (initialData?.assignedTo && !list.some((opt) => String(opt.value) === String(initialData.assignedTo))) {
      list.unshift({
        value: String(initialData.assignedTo),
        label: initialData.assignedUserName || `Assigned Executive (${initialData.assignedTo})`,
      });
    }
    return list;
  }, [bdeOptions, initialData]);

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
        code: initialData.code || '',
        name: initialData.leadName || initialData.name || '',
        designation: initialData.designation || '',
        assignedTo: String(initialData.assignedTo || initialData.lds_assigned_to || ''),
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
        assignedTo: isSalesManagerOrAdmin ? '' : (currentUserId ? String(currentUserId) : ''),
        productInterest: '',
        leadSource: '',
        email: '',
        phone: '',
        priority: '',
        stage: 'New',
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
  }, [initialData, isOpen, isSalesManagerOrAdmin, currentUserId]);

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

  /** Validate the user-selected files against size, type, and count limits. */
  const handleFileSelect = (fileList) => {
    const files = Array.from(fileList || []);
    const allowed = /\.(png|jpe?g|pdf)$/i;
    const invalid = files.find((file) => !allowed.test(file.name) || file.size > 5 * 1024 * 1024);
    if (invalid) {
      setUploadError(`${invalid.name}: use PNG, JPG, or PDF files up to 5 MB each.`);
      return;
    }
    if (documents.length + selectedFiles.length + files.length > 10) {
      setUploadError('A lead can have up to 10 documents.');
      return;
    }
    setUploadError('');
    setSelectedFiles((current) => [...current, ...files]);
  };

  const handleDownloadDocument = (docId) => {
    const doc = documents.find((item) => item.id === docId);
    if (doc && initialData?.onDownloadDocument) initialData.onDownloadDocument(docId, doc.name || doc.originalName);
  };

  const handleViewDocument = (docId) => {
    const doc = documents.find((item) => item.id === docId);
    if (doc && initialData?.onViewDocument) initialData.onViewDocument(docId, doc.name || doc.originalName);
  };

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
  //    RENDER COMPONENT
  //==================================================================================================================
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={drawerTitle}
      subtitle="Create and qualify a new enterprise prospect. Real-time deduplication verification is active across customer records."
      width={presentation === 'page' ? 'w-full' : 'w-full sm:w-[760px]'}
      presentation={presentation}
      bodyClassName={presentation === 'page' ? 'p-0' : 'px-6 py-4'}
      footer={
        <div className={`px-4 sm:px-6 py-3 bg-white-100 ${presentation === 'drawer' ? 'sticky bottom-0 z-20' : ''} flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 shrink-0 border-t border-stroke`}>
          <div className="flex items-center justify-between sm:justify-start">
            <BackButton onClick={onClose} label="Back to Leads" />
            {!isView && (
              <button
                type="button"
                onClick={handleSubmit}
                className="sm:hidden px-4 py-2 rounded-[7px] bg-primary hover:bg-primary/90 text-white-100 text-xs font-semibold border-b-2 border-black-90/20 transition-colors cursor-pointer"
              >
                Save Lead
              </button>
            )}
          </div>

          {/* Action Buttons: View mode has NO Save Lead; Edit mode has Deactivate, Convert, Save; Create mode has Save */}
          {mode === 'edit' ? (
            <div className="flex items-center justify-between sm:justify-end gap-2.5">
              <button
                type="button"
                onClick={onDeactivate}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-[7px] border-b-2 border-alert bg-alert-light text-alert hover:bg-alert-light/80 text-xs font-semibold transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                Deactivate Lead
              </button>

              <button
                type="button"
                onClick={onConvert}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-[7px] bg-success hover:bg-success/90 text-white-100 border-b-2 border-black-90/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Convert Lead</span>
                <ChevronRight size={14} />
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="hidden sm:inline-flex px-5 py-2 rounded-[7px] bg-primary hover:bg-primary/90 text-white-100 border-b-2 border-black-90/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          ) : isView ? (
            <div className="flex items-center justify-between sm:justify-end gap-2.5">
              <button
                type="button"
                onClick={onDeactivate}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-[7px] border-b-2 border-alert bg-alert-light text-alert hover:bg-alert-light/80 text-xs font-semibold transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                Deactivate Lead
              </button>

              <button
                type="button"
                onClick={onConvert}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-[7px] bg-success hover:bg-success/90 text-white-100 border-b-2 border-black-90/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Convert Lead</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-white-100 text-xs font-semibold px-6 py-2 rounded-[7px] border-b-2 border-black-90/20 transition-all cursor-pointer active:scale-95"
            >
              Save Lead
            </button>
          )}
        </div>
      }
    >
      <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-5 p-4 sm:p-6">
        {saveError && (
          <div role="alert" className="rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 p-3 text-xs text-alert">
            <p className="font-semibold">{saveError}</p>
            {duplicateLead && (
              <button
                type="button"
                onClick={() => onOpenDuplicate?.(duplicateLead)}
                className="mt-2 inline-flex items-center gap-1 font-semibold text-primary underline cursor-pointer"
              >
                <span>Open existing lead {duplicateLead.code}: {duplicateLead.name}</span>
                <ChevronRight size={13} />
              </button>
            )}
          </div>
        )}

        {/* ==============================================================================================================
            SECTION 1: PRIMARY CONTACT INFORMATION (Card 1)
        ============================================================================================================== */}
        <div className="rounded-[7px] border border-stroke bg-white-100 overflow-visible relative z-30">
          <div className="bg-gray/50 px-4 py-3 border-b border-stroke flex items-center gap-2 rounded-t-[7px]">
            <div className="w-7 h-7 rounded-[7px] bg-secondary/10 text-secondary border-b-2 border-stroke/80 flex items-center justify-center shrink-0">
              <User size={14} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-black-90 leading-tight">
                Primary Contact Information
              </h3>
              <p className="text-[11px] text-black-90/50 leading-tight mt-0.5">
                Key stakeholder name, organizational designation, email, and phone contact
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Full Name"
              name="name"
              placeholder="e.g. Vikram Mehta"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isView}
              error={fieldErrors.name || (!dismissedServerErrors.name && serverErrors.name)}
            />

            <TextInput
              label="Designation / Job Role"
              name="designation"
              placeholder="e.g. Chief Procurement Officer"
              value={formData.designation}
              onChange={handleChange}
              disabled={isView}
            />

            <TextInput
              label="Work Email Address"
              name="email"
              type="email"
              placeholder="e.g. vikram@acmeglobal.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isView}
              required
              error={fieldErrors.email || (!dismissedServerErrors.email && serverErrors.email)}
            />

            <PhoneNumber
              label="Contact Number"
              name="phone"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              disabled={isView}
              required
              error={fieldErrors.phone || (!dismissedServerErrors.phone && serverErrors.phone)}
            />
          </div>
        </div>

        {/* ==============================================================================================================
            SECTION 2: ORGANIZATION DETAILS & BUSINESS SCOPE (Card 2)
        ============================================================================================================== */}
        <div className="rounded-[7px] border border-stroke bg-white-100 overflow-visible relative z-25">
          <div className="bg-gray/50 px-4 py-3 border-b border-stroke flex items-center gap-2 rounded-t-[7px]">
            <div className="w-7 h-7 rounded-[7px] bg-[#8B5CF6]/10 text-[#8B5CF6] border-b-2 border-stroke/80 flex items-center justify-center shrink-0">
              <Building2 size={14} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-black-90 leading-tight">
                Organization Details &amp; Commercial Scope
              </h3>
              <p className="text-[11px] text-black-90/50 leading-tight mt-0.5">
                Corporate entity firmographics, employee headcount scale, web presence, and deal sizing
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput
                label="Organization / Company Name"
                name="companyName"
                placeholder="e.g. Acme Global Solutions"
                value={formData.companyName}
                onChange={handleChange}
                disabled={isView}
                required
                error={fieldErrors.companyName || (!dismissedServerErrors.companyName && serverErrors.companyName)}
              />

              <DropdownInput
                label="Industry Vertical"
                name="industry"
                placeholder="Select Industry Type"
                options={industryOptions}
                value={formData.industry}
                onChange={(e) => handleDropdownChange('industry', e.target.value)}
                disabled={isView}
              />

              <DropdownInput
                label="Employee Scale / Headcount"
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
                placeholder="https://www.example.com"
                value={formData.website}
                onChange={handleChange}
                disabled={isView}
                error={fieldErrors.website || (!dismissedServerErrors.website && serverErrors.website)}
              />

              <TextInput
                label="Expected Deal Value (₹)"
                name="expectedValue"
                type="number"
                placeholder="e.g. 500000"
                value={formData.expectedValue}
                onChange={handleChange}
                disabled={isView}
                error={fieldErrors.expectedValue || (!dismissedServerErrors.expectedValue && serverErrors.expectedValue)}
              />
            </div>

            {/* Business Requirement Textarea */}
            <TextAreaInput
              label="Business Requirement / Project Scope"
              name="requirement"
              rows={3}
              placeholder="Describe customer business goals, software integration expectations, and timeline requirements…"
              value={formData.requirement}
              onChange={handleChange}
              disabled={isView}
            />
          </div>
        </div>

        {/* ==============================================================================================================
            SECTION 3: LEAD CLASSIFICATION & BDE ASSIGNMENT (Card 3 - Placed After Organization Details)
        ============================================================================================================== */}
        <div className="rounded-[7px] border border-stroke bg-white-100 overflow-visible relative z-20">
          <div className="bg-gray/50 px-4 py-3 border-b border-stroke flex items-center justify-between rounded-t-[7px]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[7px] bg-primary/10 text-primary border-b-2 border-stroke/80 flex items-center justify-center shrink-0">
                <UserCheck size={14} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-black-90 leading-tight">
                  {isSalesManagerOrAdmin ? 'Lead Classification & BDE Assignment' : 'Lead Classification & Pipeline Routing'}
                </h3>
                <p className="text-[11px] text-black-90/50 leading-tight mt-0.5">
                  {isSalesManagerOrAdmin
                    ? 'Pipeline ownership, active sales executive routing, and qualification parameters'
                    : 'Pipeline qualification stage, priority rating, and commercial scope parameters'}
                </p>
              </div>
            </div>
            {mode !== 'create' && (
              <span className="bg-gray text-black-90/80 border border-stroke px-2 py-0.5 rounded-[4px] text-xs font-mono font-bold">
                {formData.code || 'LD-0001'}
              </span>
            )}
          </div>

          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Lead Code for Edit/View */}
            {mode !== 'create' && (
              <TextInput
                label="Lead Code"
                name="code"
                value={formData.code}
                disabled
                readOnly
              />
            )}

            {/* ASSIGN LEAD TO BDE - Visible ONLY to Sales Manager & Admin, NOT to regular BDEs */}
            {isSalesManagerOrAdmin && (
              <DropdownInput
                label="Assign to BDE / Sales Executive"
                name="assignedTo"
                placeholder={bdeLoading ? 'Loading BDE roster…' : 'Select Assigned BDE'}
                options={resolvedBdeOptions}
                value={formData.assignedTo}
                onChange={(e) => handleDropdownChange('assignedTo', e.target.value)}
                disabled={isView || bdeLoading}
              />
            )}

            {/* Lead Stage */}
            <DropdownInput
              label="Lead Stage"
              name="stage"
              placeholder="Select Lead Stage"
              options={LEAD_STAGES.filter((s) => s.value !== 'All')}
              value={formData.stage}
              onChange={(e) => handleDropdownChange('stage', e.target.value)}
              disabled={isView}
            />

            {/* Priority */}
            <DropdownInput
              label="Priority Level"
              name="priority"
              placeholder="Select Priority"
              options={LEAD_PRIORITIES.filter((p) => p.value !== 'All')}
              value={formData.priority}
              onChange={(e) => handleDropdownChange('priority', e.target.value)}
              disabled={isView}
            />

            {/* Lead Source */}
            <DropdownInput
              label="Origination Channel / Lead Source"
              name="leadSource"
              placeholder="Select Lead Source"
              options={LEAD_SOURCES.filter((s) => s.value !== 'All')}
              value={formData.leadSource}
              onChange={(e) => handleDropdownChange('leadSource', e.target.value)}
              disabled={isView}
            />

            {/* Product Interest */}
            <DropdownInput
              label="Primary Product Interest"
              name="productInterest"
              placeholder="Select Product"
              options={PRODUCT_INTEREST_OPTIONS}
              value={formData.productInterest}
              onChange={(e) => handleDropdownChange('productInterest', e.target.value)}
              disabled={isView}
            />
          </div>
        </div>

        {/* ==============================================================================================================
            SECTION 4: GEOGRAPHICAL & LOCATION DETAILS (Card 4)
        ============================================================================================================== */}
        <div className="rounded-[7px] border border-stroke bg-white-100 overflow-visible relative z-15">
          <div className="bg-gray/50 px-4 py-3 border-b border-stroke flex items-center gap-2 rounded-t-[7px]">
            <div className="w-7 h-7 rounded-[7px] bg-alert/10 text-alert border-b-2 border-stroke/80 flex items-center justify-center shrink-0">
              <MapPin size={14} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-black-90 leading-tight">
                Geographical &amp; Address Details
              </h3>
              <p className="text-[11px] text-black-90/50 leading-tight mt-0.5">
                Headquarters office location and regional jurisdiction
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex flex-col gap-4">
            <TextInput
              label="Street Address / Office Location"
              name="address"
              placeholder="Enter Street Address, Floor, Building Suite"
              value={formData.address}
              onChange={handleChange}
              disabled={isView}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                label="State / Province"
                name="state"
                placeholder="Select State"
                options={STATE_OPTIONS}
                value={formData.state}
                onChange={(e) => handleDropdownChange('state', e.target.value)}
                disabled={isView}
              />

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
                label="Postal Code / PIN"
                name="postalCode"
                placeholder="e.g. 380015"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={isView}
              />
            </div>
          </div>
        </div>

        {/* ==============================================================================================================
            SECTION 5: SUPPORTING DOCUMENTATION (Card 5)
        ============================================================================================================== */}
        <div className="rounded-[7px] border border-stroke bg-white-100 overflow-visible relative z-10">
          <div className="bg-gray/50 px-4 py-3 border-b border-stroke flex items-center gap-2 rounded-t-[7px]">
            <div className="w-7 h-7 rounded-[7px] bg-success/10 text-success border-b-2 border-stroke/80 flex items-center justify-center shrink-0">
              <FileText size={14} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-black-90 leading-tight">
                Supporting Documentation
              </h3>
              <p className="text-[11px] text-black-90/50 leading-tight mt-0.5">
                Proposals, requirement specs, NDAs, or commercial briefs (PNG, JPG, PDF up to 5MB each)
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex flex-col gap-3.5">
            {(isViewOrEdit && documents.length > 0) || selectedFiles.length > 0 ? (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-black-90">Attached Documents</h4>
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
                  {selectedFiles.map((file, index) => (
                    <DocumentCard
                      key={`${file.name}-${index}`}
                      id={`pending-${index}`}
                      name={file.name}
                      size={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      uploadDate="Ready to upload"
                      onView={() => handleSelectedFileAction(file, 'view')}
                      onDownload={() => handleSelectedFileAction(file, 'download')}
                      onDelete={() => setSelectedFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                      deleteTitle="Cancel Upload"
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {!isView && documents.length + selectedFiles.length < 10 && (
              <UploadDropzone
                label="Upload Document (PNG, JPG or PDF - Max 10 Docs & 5MB Each)"
                placeholder="Drag and drop or click to upload proposal/RFP files"
                size="medium"
                onFileSelect={handleFileSelect}
                multiple
              />
            )}
            {uploadError && <p role="alert" className="text-xs text-alert font-medium">{uploadError}</p>}
          </div>
        </div>
      </form>
    </Drawer>
  );
});

AddLeadDrawer.displayName = 'AddLeadDrawer';
export default AddLeadDrawer;
