//==================================================================================================================
//    CONVERT LEAD DRAWER COMPONENT
//    Slide-over drawer for converting a qualified lead into a closed deal with deal details
//==================================================================================================================

import React, { useState, memo, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { Drawer } from '../../../components/common/Drawer';
import { LeadSummaryCard } from '../../../components/common/LeadSummaryCard';
import { DropdownInput } from '../../../components/common/input common/DropdownInput/DropdownInput';
import { BackButton } from '../../../components/common/buttons/BackButton';
import { PRODUCT_INTEREST_OPTIONS } from '../../../constants/leadsConstants';

//==================================================================================================================
//    CONVERT LEAD DRAWER
//==================================================================================================================
export const ConvertLeadDrawer = memo(({
  isOpen = false,
  onClose,
  onConfirm,
  lead = null,
}) => {
  const [dealData, setDealData] = useState({
    amount: '',
    stage: '2. Stage 2',
    startDate: '',
    closeDate: '',
    productInterest: lead?.productInterest || '',
    assignedBde: 'Johnson Doe',
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDealData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDropdownChange = useCallback((name, val) => {
    setDealData((prev) => ({ ...prev, [name]: val }));
  }, []);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    if (onConfirm) onConfirm(dealData);
    if (onClose) onClose();
  }, [dealData, onConfirm, onClose]);

  return (
    //==================================================================================================================
    //    DRAWER CONTAINER
    //==================================================================================================================
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Details"
      subtitle="Create and qualify a new enterprise prospect. Real-time deduplication verification is active across customer records."
      width="w-full sm:w-[560px]"
      bodyClassName="px-6 py-5"
      footer={
        <div className="px-6 py-4 bg-white-100 border-t border-stroke sticky bottom-0 z-20 flex justify-between items-center shrink-0">
          <BackButton onClick={onClose} label="Back" />
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white-100 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Confirm & Convert Lead
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* ================================================================================================================
            SECTION 1: Lead Profile Summary Card (Image 3)
        ================================================================================================================ */}
        <LeadSummaryCard
          avatar={lead?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
          title={lead?.name || 'Johnson Doe'}
          subtitle={lead?.code || '#001'}
          subline={`${lead?.designation || 'Senior Business Developer'} • ${lead?.email || 'johnson.doe@gmail.com'} • ${lead?.phone || '+91 98765 43210'}`}
          priority={lead?.priority || 'Low'}
          products={['Product 1', 'Product 2', 'Product 3']}
        />

        {/* ================================================================================================================
            SECTION 2: Company Profile Summary Card
        ================================================================================================================ */}
        <LeadSummaryCard
          avatar={lead?.companyLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&crop=faces'}
          avatarClassName="rounded-xl"
          title={lead?.companyName || 'Company Name'}
          subtitle={lead?.industry || 'Industry Type'}
          subline={lead?.employeeScale ? `${lead.employeeScale} Employees` : '0-50 Employees'}
          address={
            lead?.address
              ? `${lead.address} • ${lead.email || 'johnson.doe@gmail.com'} • ${lead.phone || '+91 98765 43210'}`
              : '62 Market Road, Panaji, Goa, India • johnson.doe@gmail.com • +91 98765 43210'
          }
        />

        {/* ================================================================================================================
            SECTION 3: Make a Deal Form Section
        ================================================================================================================ */}
        <div className="flex flex-col gap-3 pt-2">
          <div>
            <h3 className="text-sm font-bold text-black-90">Make a Deal</h3>
            <p className="text-xs text-black-90/60 mt-0.5">
              Add required deal details and mention amount of deal.
            </p>
          </div>

          {/* Row 1: Deal Amount & Deal Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Deal Amount */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-xs font-semibold text-black-90">
                Deal Amount
              </label>
              <div className="w-full h-[40px] px-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg flex items-center gap-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <span className="text-xs font-bold text-primary select-none">
                  ₹
                </span>
                <input
                  type="text"
                  name="amount"
                  value={dealData.amount}
                  onChange={handleChange}
                  placeholder="Enter Deal Amount"
                  className="w-full h-full bg-transparent text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none"
                />
              </div>
            </div>

            {/* Deal Stage */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-xs font-semibold text-black-90">
                Deal Stage
              </label>
              <input
                type="text"
                name="stage"
                value={dealData.stage}
                onChange={handleChange}
                placeholder="2. Stage 2"
                className="w-full h-[40px] px-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Expected Start Date & Expected Close Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Expected Start Date */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-xs font-semibold text-black-90">
                Expected Start Date
              </label>
              <div className="w-full h-[40px] px-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg flex items-center justify-between focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <input
                  type="text"
                  name="startDate"
                  value={dealData.startDate}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  className="w-full h-full bg-transparent text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none"
                />
                <Calendar size={16} className="text-primary shrink-0 select-none cursor-pointer" />
              </div>
            </div>

            {/* Expected Close Date */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-xs font-semibold text-black-90">
                Expected Close Date
              </label>
              <div className="w-full h-[40px] px-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg flex items-center justify-between focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <input
                  type="text"
                  name="closeDate"
                  value={dealData.closeDate}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  className="w-full h-full bg-transparent text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none"
                />
                <Calendar size={16} className="text-primary shrink-0 select-none cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Row 3: Product Interest & Assigned BDE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <DropdownInput
              label="Product Interest"
              name="productInterest"
              placeholder="Select Product"
              options={PRODUCT_INTEREST_OPTIONS}
              value={dealData.productInterest}
              onChange={(e) => handleDropdownChange('productInterest', e.target.value)}
            />

            <div className="flex flex-col gap-1 w-full">
              <label className="text-xs font-semibold text-black-90">
                Assigned BDE
              </label>
              <input
                type="text"
                name="assignedBde"
                value={dealData.assignedBde}
                onChange={handleChange}
                placeholder="Johnson Doe"
                className="w-full h-[40px] px-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>
      </form>
    </Drawer>
  );
});

ConvertLeadDrawer.displayName = 'ConvertLeadDrawer';
export default ConvertLeadDrawer;
