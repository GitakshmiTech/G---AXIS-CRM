//==================================================================================================================
//    CREATE QUOTATION DRAWER COMPONENT
//    Slide-over drawer for configuring commercial package, plan allocation, pricing and approvals
//==================================================================================================================

import React, { useState, useEffect, memo, useCallback } from 'react';
import { Calendar, Layers } from 'lucide-react';
import { Drawer } from '../../../components/common/Drawer';
import { TextInput } from '../../../components/common/input common/TextInput/TextInput';
import { TextAreaInput } from '../../../components/common/input common/TextAreaInput/TextAreaInput';
import { DropdownInput } from '../../../components/common/input common/DropdownInput/DropdownInput';
import { BackButton } from '../../../components/common/buttons/BackButton';
import {
  DEAL_DROPDOWN_OPTIONS,
  QUOTATION_PRODUCT_OPTIONS,
} from '../../../constants/quotationsConstants';

//==================================================================================================================
//    CREATE QUOTATION DRAWER
//==================================================================================================================
export const CreateQuotationDrawer = memo(({
  isOpen = false,
  onClose,
  onSave,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    selectDeal: 'HyperScale Systems',
    closeDate: '',
    linkedCompany: 'HyperScale Systems',
    assignedBde: 'Johnson Doe',
    dealAmount: '483,500',
    productInterest: '',
    bdeNotes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        selectDeal: initialData.companyName || 'HyperScale Systems',
        closeDate: initialData.expectedCloseDate || '',
        linkedCompany: initialData.linkedCompany || initialData.companyName || 'HyperScale Systems',
        assignedBde: initialData.assignedBde || 'Johnson Doe',
        dealAmount: initialData.dealAmount || '483,500',
        productInterest: initialData.productInterestName || '',
        bdeNotes: '',
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

  const handleSubmit = useCallback((status = 'Pending Approval') => {
    if (onSave) onSave({ ...formData, status });
    if (onClose) onClose();
  }, [formData, onSave, onClose]);

  return (
    //==================================================================================================================
    //    DRAWER CONTAINER
    //==================================================================================================================
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create Quotation"
      subtitle="Configuring high-velocity commercial package & revenue allocation for fiscal closing Q4."
      width="w-full sm:w-[560px]"
      bodyClassName="px-6 py-5"
      footer={
        <div className="px-6 py-4 bg-white-100 border-t border-stroke sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <BackButton onClick={onClose} label="Back" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('Draft')}
              className="px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] bg-white-100 text-[#344054] text-xs font-semibold hover:bg-gray transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => alert('Exporting Quotation PDF...')}
              className="px-3.5 py-2.5 rounded-lg bg-secondary hover:bg-secondary/90 text-white-100 text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              Export PDF
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('Pending Approval')}
              className="px-3.5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white-100 text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              Send for VP Approval
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-4">
        {/* Row 1: Select Deal & Expected Close Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DropdownInput
            label="Select Deal"
            name="selectDeal"
            placeholder="Select Deal"
            options={DEAL_DROPDOWN_OPTIONS}
            value={formData.selectDeal}
            onChange={(e) => handleDropdownChange('selectDeal', e.target.value)}
          />

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

        {/* Row 2: Linked Company & Assigned BDE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextInput
            label="Linked Company"
            name="linkedCompany"
            placeholder="HyperScale Systems"
            value={formData.linkedCompany}
            onChange={handleChange}
          />
          <TextInput
            label="Assigned BDE"
            name="assignedBde"
            placeholder="Johnson Doe"
            value={formData.assignedBde}
            disabled
            inputClassName="w-full h-[40px] px-3 bg-[#F2F4F8] border border-[#D0D5DD] rounded-lg text-xs text-[#101828] font-normal cursor-not-allowed"
          />
        </div>

        {/* Row 3: Deal Amount & Product Interest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
            options={QUOTATION_PRODUCT_OPTIONS.filter((o) => o.value !== 'All')}
            value={formData.productInterest}
            onChange={(e) => handleDropdownChange('productInterest', e.target.value)}
          />
        </div>

        {/* Row 4: BDE Notes (Full Width) */}
        <TextAreaInput
          label="BDE Notes"
          name="bdeNotes"
          placeholder="Mention note here"
          rows={3}
          value={formData.bdeNotes}
          onChange={handleChange}
        />

        {/* Section: Products & Plan Allocation */}
        <div className="flex flex-col gap-2.5 mt-2">
          <h3 className="text-sm font-bold text-black-90">
            Products & Plan Allocation
          </h3>

          {/* Product Card 1 */}
          <div className="flex items-center justify-between p-3.5 bg-white-100 border border-[#D0D5DD] rounded-xl hover:border-primary/40 transition-colors shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#EBF3FF] flex items-center justify-center text-secondary shrink-0">
                <Layers size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-black-90">
                    Enterprise Cloud Data Mesh Suite v4.2
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray text-black-90/70 rounded font-medium border border-stroke">
                    SKU-CLD-998
                  </span>
                </div>
                <p className="text-[11px] text-black-90/60 truncate mt-0.5">
                  Dedicated Distributed Pipeline Infrastructure & Data Governance Mesh
                </p>
                <span className="text-[11px] text-black-90/50 mt-0.5">
                  250 Users • $650.00/User
                </span>
              </div>
            </div>
            <span className="text-sm font-bold text-secondary shrink-0 ml-3">
              $149,865.63
            </span>
          </div>

          {/* Product Card 2 */}
          <div className="flex items-center justify-between p-3.5 bg-white-100 border border-[#D0D5DD] rounded-xl hover:border-primary/40 transition-colors shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#EBF3FF] flex items-center justify-center text-secondary shrink-0">
                <Layers size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-black-90">
                    Enterprise Cloud Data Mesh Suite v4.2
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray text-black-90/70 rounded font-medium border border-stroke">
                    SKU-CLD-998
                  </span>
                </div>
                <p className="text-[11px] text-black-90/60 truncate mt-0.5">
                  Dedicated Distributed Pipeline Infrastructure & Data Governance Mesh
                </p>
                <span className="text-[11px] text-black-90/50 mt-0.5">
                  250 Users • $650.00/User
                </span>
              </div>
            </div>
            <span className="text-sm font-bold text-secondary shrink-0 ml-3">
              $149,865.63
            </span>
          </div>
        </div>

        {/* Section: Price Breakdown */}
        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-sm font-bold text-black-90">
            Price Breakdown
          </h3>

          <div className="flex flex-col gap-1.5 text-xs text-black-90/80">
            <div className="flex items-center justify-between">
              <span>Gross List Price (Subtotal)</span>
              <span className="font-semibold text-black-90">$207,500.00</span>
            </div>
            <div className="flex items-center justify-between text-[#019F68]">
              <span>Total Commercial Discount (15%)</span>
              <span className="font-semibold">-$24,375.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Net Taxable Amount</span>
              <span className="font-semibold text-black-90">$183,125.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated Taxes & Levies (8.5%)</span>
              <span className="font-semibold text-black-90">$15,565.63</span>
            </div>
          </div>

          {/* Grand Total Bar */}
          <div className="mt-2 p-3 bg-[#F0F4FA] rounded-lg flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-black-90">
              GRAND TOTAL
            </span>
            <span className="text-lg font-bold text-primary">
              $198,690.63
            </span>
          </div>
        </div>
      </form>
    </Drawer>
  );
});

export default CreateQuotationDrawer;
