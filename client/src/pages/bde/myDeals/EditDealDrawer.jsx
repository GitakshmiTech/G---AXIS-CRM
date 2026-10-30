//==================================================================================================================
//    EDIT DEAL DRAWER COMPONENT
//    Slide-over drawer for updating sales opportunity, stage, dates, and forecast valuation
//==================================================================================================================

import React, { useState, useEffect, memo, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { Drawer } from '../../../components/common/Drawer';
import { TextInput } from '../../../components/common/input common/TextInput/TextInput';
import { DropdownInput } from '../../../components/common/input common/DropdownInput/DropdownInput';
import { BackButton } from '../../../components/common/buttons/BackButton';
import { DEAL_PRODUCT_OPTIONS } from '../../../constants/dealsConstants';

//==================================================================================================================
//    EDIT DEAL DRAWER
//==================================================================================================================
export const EditDealDrawer = memo(({
  isOpen = false,
  onClose,
  onSave,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    dealName: 'HyperScale Systems',
    stage: '2. Stage 2',
    dealAmount: '483,500',
    productInterest: '',
    startDate: '',
    closeDate: '',
    assignedBde: 'Johnson Doe',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        dealName: initialData.companyName || initialData.dealName || 'HyperScale Systems',
        stage: initialData.stage || '2. Stage 2',
        dealAmount: initialData.dealAmount || (initialData.expectedValue ? initialData.expectedValue.replace(/[^0-9]/g, '') : '483,500'),
        productInterest: initialData.productInterestName || '',
        startDate: initialData.startDate || '',
        closeDate: initialData.closeDate || initialData.expectedCloseDate || '',
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
      title="Edit Deal"
      subtitle="Edit a new sales opportunity, assign stage, account association, and forecast value."
      width="w-full sm:w-[700px]"
      bodyClassName="px-6 py-5"
      footer={
        <div className="px-6 py-4 bg-white-100 border-t border-stroke sticky bottom-0 z-20 flex justify-between items-center shrink-0">
          <BackButton onClick={onClose} label="Back" />
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white-100 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Save Details
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Row 1: Deal Name & Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="Deal Name"
            name="dealName"
            placeholder="HyperScale Systems"
            value={formData.dealName}
            onChange={handleChange}
          />
          <TextInput
            label="Stage"
            name="stage"
            placeholder="2. Stage 2"
            value={formData.stage}
            onChange={handleChange}
          />
        </div>

        {/* Row 2: Deal Amount & Product Interest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Deal Amount with ₹ prefix */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-[#101828]">
              Deal Amount
            </label>
            <div className="w-full h-[40px] px-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg flex items-center gap-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <span className="text-xs font-semibold text-primary select-none">₹</span>
              <input
                type="text"
                name="dealAmount"
                value={formData.dealAmount}
                onChange={handleChange}
                placeholder="Enter Deal Amount"
                className="w-full h-full bg-transparent text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none"
              />
            </div>
          </div>

          <DropdownInput
            label="Product Interest"
            name="productInterest"
            placeholder="Select Product"
            options={DEAL_PRODUCT_OPTIONS.filter((o) => o.value !== 'All')}
            value={formData.productInterest}
            onChange={(e) => handleDropdownChange('productInterest', e.target.value)}
          />
        </div>

        {/* Row 3: Expected Start Date & Expected Close Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Expected Start Date */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-[#101828]">
              Expected Start Date
            </label>
            <div className="w-full h-[40px] px-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg flex items-center justify-between focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <input
                type="text"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
                className="w-full h-full bg-transparent text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none"
              />
              <Calendar size={16} className="text-primary shrink-0 select-none cursor-pointer" />
            </div>
          </div>

          {/* Expected Close Date */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-[#101828]">
              Expected Close Date
            </label>
            <div className="w-full h-[40px] px-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg flex items-center justify-between focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <input
                type="text"
                name="closeDate"
                value={formData.closeDate}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
                className="w-full h-full bg-transparent text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none"
              />
              <Calendar size={16} className="text-primary shrink-0 select-none cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Row 4: Assigned BDE */}
        <TextInput
          label="Assigned BDE"
          name="assignedBde"
          placeholder="Johnson Doe"
          value={formData.assignedBde}
          disabled
          inputClassName="w-full h-[40px] px-3 bg-[#F2F4F8] border border-[#D0D5DD] rounded-lg text-xs text-[#101828] font-normal cursor-not-allowed"
        />
      </form>
    </Drawer>
  );
});

export default EditDealDrawer;
