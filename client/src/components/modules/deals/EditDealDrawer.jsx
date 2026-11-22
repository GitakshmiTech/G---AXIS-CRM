//==================================================================================================================
//    EDIT DEAL DRAWER COMPONENT (SUPER ADMIN WORKSPACE)
//    Slide-over drawer for updating sales opportunity, stage, dates, and forecast valuation
//==================================================================================================================

import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { Drawer } from '../../common/sidebar/Drawer';
import { TextInput } from '../../common/inputs/TextInput';
import { FieldError } from '../../common/inputs/FieldError';
import { DropdownInput } from '../../common/inputs/DropdownInput';
import { BackButton } from '../../common/buttons/BackButton';
import { editDealSchema } from '../../../utils/validationSchemas';
import { clearFieldError, focusFirstInvalidField, validateForm } from '../../../utils/validationUtils';

//==================================================================================================================
//    EDIT / VIEW DEAL DRAWER
//==================================================================================================================
export const EditDealDrawer = memo(({
  isOpen = false,
  onClose,
  onSave,
  initialData = null,
  mode = 'edit', // 'view' | 'edit'
}) => {
  const isView = mode === 'view';
  const [formData, setFormData] = useState({
    dealName: '',
    stage: '',
    dealAmount: '',
    productInterest: '',
    startDate: '',
    closeDate: '',
    assignedBde: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        dealName: initialData.title || initialData.dealName || '',
        stage: initialData.stage || '',
        dealAmount: initialData.value ? Number(initialData.value).toLocaleString('en-IN') : '',
        productInterest: initialData.productId || '',
        startDate: initialData.startDate || '',
        closeDate: initialData.closeDate || initialData.expectedCloseDate || '',
        assignedBde: initialData.assignedBde || '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const normalizedValue = ['startDate', 'closeDate'].includes(name) && /^\d{2}-\d{2}-\d{4}$/.test(value) ? value.replaceAll('-', '/') : value;
    setFormData((prev) => ({ ...prev, [name]: normalizedValue }));
    clearFieldError(setFieldErrors, name);
  }, []);

  const handleDropdownChange = useCallback((name, val) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
    clearFieldError(setFieldErrors, name);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    const validation = await validateForm(editDealSchema, formData);
    if (Object.keys(validation.errors).length) { setFieldErrors(validation.errors); focusFirstInvalidField(formRef.current, validation.errors); return; }
    setFieldErrors({});
    const saved = onSave ? await onSave(formData) : true;
    if (saved !== false && onClose) onClose();
  }, [formData, onSave, onClose]);

  return (
    //==================================================================================================================
    //    DRAWER CONTAINER
    //==================================================================================================================
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isView ? 'View Deal' : 'Edit Deal'}
      subtitle={isView ? 'View sales opportunity, assigned stage, account association, and forecast value.' : 'Edit a new sales opportunity, assign stage, account association, and forecast value.'}
      width="w-full sm:w-[700px]"
      headerClassName="px-6 py-2"
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
      <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Row 1: Deal Name & Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="Deal Name"
            name="dealName"
            placeholder="HyperScale Systems"
            value={formData.dealName}
            onChange={handleChange}
            disabled={isView}
            error={fieldErrors.dealName}
          />
          <TextInput
            label="Stage"
            name="stage"
            placeholder="2. Stage 2"
            value={formData.stage}
            onChange={handleChange}
            disabled={isView}
          />
        </div>

        {/* Row 2: Deal Amount & Product Interest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-black-90">
              Deal Amount
            </label>
            <div className={`w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] flex items-center gap-2 ${isView ? 'opacity-80' : ''} transition-all`}>
              <span className="text-xs font-bold text-primary ">
                ₹
              </span>
              <input
                type="text"
                name="dealAmount"
                value={formData.dealAmount}
                onChange={handleChange}
                placeholder="Enter Deal Amount"
                disabled={isView}
                aria-invalid={Boolean(fieldErrors.dealAmount)}
                aria-describedby={fieldErrors.dealAmount ? 'dealAmount-error' : undefined}
                className={`w-full h-full bg-transparent text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none ${isView ? 'cursor-not-allowed' : ''}`}
              />
            </div>
            <FieldError name="dealAmount" error={fieldErrors.dealAmount} />
          </div>

          <DropdownInput
            label="Product Interest"
            name="productInterest"
            placeholder="Select Product"
            options={initialData?.productOptions || []}
            value={formData.productInterest}
            onChange={(e) => handleDropdownChange('productInterest', e.target.value)}
            disabled={isView}
          />
        </div>

        {/* Row 3: Expected Start Date & Expected Close Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-black-90">
              Expected Start Date
            </label>
            <div className={`w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] flex items-center justify-between ${isView ? 'opacity-80' : ''} transition-all`}>
              <input
                type="text"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
                disabled={isView}
                aria-invalid={Boolean(fieldErrors.startDate)}
                aria-describedby={fieldErrors.startDate ? 'startDate-error' : undefined}
                className={`w-full h-full bg-transparent text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none ${isView ? 'cursor-not-allowed' : ''}`}
              />
              <Calendar size={16} className={`text-primary shrink-0 ${isView ? 'cursor-not-allowed' : 'cursor-pointer'}`} />
            </div>
            <FieldError name="startDate" error={fieldErrors.startDate} />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-black-90">
              Expected Close Date
            </label>
            <div className={`w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] flex items-center justify-between ${isView ? 'opacity-80' : ''} transition-all`}>
              <input
                type="text"
                name="closeDate"
                value={formData.closeDate}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
                disabled={isView}
                aria-invalid={Boolean(fieldErrors.closeDate)}
                aria-describedby={fieldErrors.closeDate ? 'closeDate-error' : undefined}
                className={`w-full h-full bg-transparent text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none ${isView ? 'cursor-not-allowed' : ''}`}
              />
              <Calendar size={16} className={`text-primary shrink-0 ${isView ? 'cursor-not-allowed' : 'cursor-pointer'}`} />
            </div>
            <FieldError name="closeDate" error={fieldErrors.closeDate} />
          </div>
        </div>

        {/* Row 4: Assigned BDE */}
        <TextInput
          label="Assigned BDE"
          name="assignedBde"
          placeholder="Johnson Doe"
          value={formData.assignedBde}
          onChange={handleChange}
          disabled
        />
      </form>
    </Drawer>
  );
});

EditDealDrawer.displayName = 'EditDealDrawer';
export default EditDealDrawer;
