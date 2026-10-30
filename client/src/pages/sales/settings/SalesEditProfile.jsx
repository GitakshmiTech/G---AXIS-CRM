//==================================================================================================================
//    EDIT PROFILE PAGE COMPONENT (SALES WORKSPACE)
//    Full fidelity implementation matching Image 4
//    Personal Information, Avatar upload, Employee Code, First/Last Name, Mobile, Work Email, Dept/Designation
//==================================================================================================================

import React, { memo, useState, useCallback } from 'react';
import { ContactAvatarPlaceholder } from '../../../components/common/ContactAvatarPlaceholder';
import { TextInput } from '../../../components/common/input common/TextInput/TextInput';
import { PhoneNumber } from '../../../components/common/input common/PhoneNumber/PhoneNumber';
import { DropdownInput } from '../../../components/common/input common/DropdownInput/DropdownInput';

//==================================================================================================================
//    SALES EDIT PROFILE COMPONENT
//==================================================================================================================
export const SalesEditProfile = memo(() => {
  const [mobileNumber, setMobileNumber] = useState('98765 43210');

  const handleMobileChange = useCallback((e) => {
    setMobileNumber(e.target.value);
  }, []);

  const handleSave = useCallback((e) => {
    e.preventDefault();
    alert('Profile details saved successfully!');
  }, []);

  return (
    <div className="w-full max-w-[860px] mx-auto pt-0 pb-0 select-text">
      
      {/* ==============================================================================================================
          MAIN CARD: PERSONAL INFORMATION
      ============================================================================================================== */}
      <form
        onSubmit={handleSave}
        className="bg-white-100 rounded-2xl border border-stroke p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 shadow-2xs"
      >
        <h2 className="text-base sm:text-lg font-bold text-black-90">Personal Information</h2>

        {/* ==============================================================================================================
            PROFILE PICTURE SECTION
        ============================================================================================================== */}
        <div className="flex items-center gap-4">
          <ContactAvatarPlaceholder size="w-20 h-20" />
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="px-4 py-2 bg-primary hover:bg-primary/95 text-white-100 text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-all active:scale-[0.98]"
            >
              Upload Profile
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA]/70 text-xs font-semibold rounded-lg cursor-pointer transition-all active:scale-[0.98]"
            >
              Remove
            </button>
          </div>
        </div>

        {/* ==============================================================================================================
            ROW 1: EMPLOYEE CODE
        ============================================================================================================== */}
        <div className="w-full">
          <TextInput
            label="Employee Code"
            defaultValue="EMP-ADM-001"
            disabled
          />
        </div>

        {/* ==============================================================================================================
            ROW 2: FIRST NAME & LAST NAME
        ============================================================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <TextInput
            label="First Name"
            defaultValue="Johnson"
          />
          <TextInput
            label="Last Name"
            defaultValue="Doe"
          />
        </div>

        {/* ==============================================================================================================
            ROW 3: MOBILE NUMBER & WORK EMAIL
        ============================================================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <PhoneNumber
            label="Mobile Number"
            value={mobileNumber}
            onChange={handleMobileChange}
          />
          <TextInput
            label="Work Email"
            type="email"
            defaultValue="johnson.doe@gmail.com"
          />
        </div>

        {/* ==============================================================================================================
            ROW 4: DEPARTMENT & DESIGNATION
        ============================================================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <DropdownInput
            label="Department"
            placeholder="Choose Department"
            options={['Sales & Growth', 'Operations', 'Marketing', 'Executive']}
            defaultValue="Sales & Growth"
          />
          <DropdownInput
            label="Designation"
            placeholder="Choose Designation"
            options={['Sales Manager', 'VP of Sales', 'Lead BDE', 'Senior Account Executive']}
            defaultValue="Sales Manager"
          />
        </div>

        {/* ==============================================================================================================
            FORM SUBMISSION BUTTON
        ============================================================================================================== */}
        <div className="flex justify-end pt-3 sm:pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white-100 font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            Save Details
          </button>
        </div>

      </form>

    </div>
  );
});

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default SalesEditProfile;
