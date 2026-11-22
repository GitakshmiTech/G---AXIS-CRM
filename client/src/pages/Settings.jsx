//==================================================================================================================
//    SETTINGS PAGE COMPONENT
//    Appearance, Notification Settings, Account Security, System Regional Settings, Active Sessions
//    Profile Management & Change Password are handled via /profile page (tab-based).
//==================================================================================================================

import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ChevronRight } from 'lucide-react';
import { DropdownInput } from '../components/common/inputs/DropdownInput';

//==================================================================================================================
//    MAIN SETTINGS COMPONENT
//==================================================================================================================
export const Settings = memo(() => {
  const navigate = useNavigate();
  // Notification Toggle State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Terminate Session Handler
  const handleTerminateSession = useCallback((sessionId) => {
    // Session termination hook/handler
  }, []);

  return (
    <div className="w-full max-w-[860px] mx-auto pt-0 pb-0 flex flex-col gap-3.5 select-text">

      {/* ==============================================================================================================
          ACCOUNT MANAGEMENT — Update Profile & Change Password (both navigate to /profile with tabs)
      ============================================================================================================== */}
      <div className="bg-white-100 rounded-[7px] border-b-2 border-stroke/80 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-stroke/40">
          <h2 className="text-sm sm:text-base font-bold text-black-90">Account Management</h2>
          <p className="text-xs text-black-90/55 font-medium mt-0.5">Manage your profile information and account security.</p>
        </div>

        {/* Update Profile Row */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          title="Update your personal and contact information"
          className="cursor-pointer w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-stroke/40 hover:bg-gray transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-primary/10 flex items-center justify-center shrink-0">
              <User size={15} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-black-90">Update Profile</p>
              <p className="text-[11px] text-black-90/50 font-medium mt-0.5">Edit your name, phone, and personal details.</p>
            </div>
          </div>
          <ChevronRight size={15} className="text-black-90/35 shrink-0" />
        </button>

        {/* Change Password Row */}
        <button
          type="button"
          onClick={() => navigate('/profile', { state: { tab: 'password' } })}
          title="Change your account password"
          className="cursor-pointer w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 hover:bg-gray transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-orange-50 flex items-center justify-center shrink-0">
              <Lock size={15} className="text-orange-500" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-black-90">Change Password</p>
              <p className="text-[11px] text-black-90/50 font-medium mt-0.5">Update your login password securely.</p>
            </div>
          </div>
          <ChevronRight size={15} className="text-black-90/35 shrink-0" />
        </button>
      </div>
      
      {/* ==============================================================================================================
          CARD 1: APPEARANCE
      ============================================================================================================== */}
      <div className="bg-white-100 rounded-2xl border-b-2 border-stroke/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
        <div className="flex flex-col">
          <h2 className="text-sm sm:text-base font-bold text-black-90">Appearance</h2>
          <p className="text-xs text-black-90/55 font-medium mt-1">
            Lorem Ipsum is simply dummy text of the printing and typesetting.
          </p>
        </div>
        <div className="w-full sm:w-[170px] shrink-0">
          <DropdownInput
            options={['System Default', 'Light Mode', 'Dark Mode']}
            defaultValue="System Default"
            containerClassName="w-full"
            selectClassName="w-full h-[40px] px-3.5 pr-8 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 font-normal focus:outline-none cursor-pointer flex items-center justify-between"
          />
        </div>
      </div>

      {/* ==============================================================================================================
          CARD 2: NOTIFICATION SETTINGS
      ============================================================================================================== */}
      <div className="bg-white-100 rounded-2xl border-b-2 border-stroke/80 p-5 sm:p-6 flex items-center justify-between gap-4 ">
        <div className="flex flex-col">
          <h2 className="text-sm sm:text-base font-bold text-black-90">Notification Settings</h2>
          <p className="text-xs text-black-90/55 font-medium mt-1">
            Stay updated with important alerts, messages, and activities.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={notificationsEnabled}
          onClick={() => setNotificationsEnabled((prev) => !prev)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            notificationsEnabled ? 'bg-primary' : 'bg-[#D0D5DD]'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white-100  ring-0 transition duration-200 ease-in-out ${
              notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* ==============================================================================================================
          CARD 3: SYSTEM REGIONAL SETTINGS
      ============================================================================================================== */}
      <div className="bg-white-100 rounded-2xl border-b-2 border-stroke/80 p-5 sm:p-6 flex flex-col gap-4 ">
        <h2 className="text-sm sm:text-base font-bold text-black-90">System Regional Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DropdownInput
            label="Time Zone"
            options={['(UTC+05:30) IST', '(UTC+00:00) UTC', '(UTC-05:00) EST', '(UTC-08:00) PST']}
            defaultValue="(UTC+05:30) IST"
          />
          <DropdownInput
            label="Language"
            options={['English (US)', 'English (UK)', 'Hindi', 'Gujarati', 'Spanish', 'French']}
            defaultValue="English (US)"
          />
        </div>
      </div>

      {/* ==============================================================================================================
          CARD 5: ACTIVE SESSIONS
      ============================================================================================================== */}
      <div className="bg-white-100 rounded-2xl border-b-2 border-stroke/80 p-5 sm:p-6 flex flex-col gap-4 ">
        <h2 className="text-sm sm:text-base font-bold text-black-90">Active Sessions</h2>
        <div className="flex flex-col gap-3">
          
          {/* Chrome Session */}
          <div className="rounded-[7px] border-b-2 border-stroke/80 p-3.5 sm:p-4 flex items-center justify-between gap-4 bg-white-100">
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-black-90">
                  Chrome 124 on Current
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#ECFDF3] text-[#027A48]">
                  Current Session
                </span>
              </div>
              <p className="text-xs text-black-90/55 font-medium mt-1">
                Mumbai, IN • Active now
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTerminateSession('chrome-current')}
              className="px-5 py-2 rounded-lg border border-[#FDA29B] text-[#D92D20] text-xs font-semibold hover:bg-[#FEF3F2] transition-colors cursor-pointer shrink-0"
            >
              Terminate
            </button>
          </div>

          {/* Firefox Session */}
          <div className="rounded-[7px] border-b-2 border-stroke/80 p-3.5 sm:p-4 flex items-center justify-between gap-4 bg-white-100">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-black-90">
                Firefox on Delhi, IN
              </span>
              <p className="text-xs text-black-90/55 font-medium mt-1">
                Delhi, IN • Last active: 2 hours ago
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTerminateSession('firefox-delhi')}
              className="px-5 py-2 rounded-lg border border-[#FDA29B] text-[#D92D20] text-xs font-semibold hover:bg-[#FEF3F2] transition-colors cursor-pointer shrink-0"
            >
              Terminate
            </button>
          </div>

        </div>
      </div>

    </div>
  );
});

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
Settings.displayName = 'Settings';
export { Settings as BdeSettings, Settings as SalesSettings };
export default Settings;
