//===========================================================================================
//    SETTINGS & PREFERENCES PAGE COMPONENT
//    Account Security, Appearance, Notification Preferences, Regional Localization, and Active Sessions
// ===========================================================================================

import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  ChevronRight,
  ShieldCheck,
  Palette,
  Bell,
  Globe,
  Laptop,
  Smartphone,
  Check,
  KeyRound,
  ShieldAlert,
  LogOut,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { DropdownInput } from '../components/common/inputs/DropdownInput';
import { useToast } from '../hooks/useToast';

//===========================================================================================
//    INITIAL SESSIONS MOCK DATA
// ===========================================================================================
const INITIAL_SESSIONS = [
  {
    id: 'chrome-windows',
    browser: 'Chrome 124 on Windows 11',
    deviceType: 'desktop',
    location: 'Mumbai, IN',
    ip: '103.21.124.89',
    lastActive: 'Active now',
    isCurrent: true,
  },
  {
    id: 'safari-iphone',
    browser: 'Safari on iPhone 15 Pro',
    deviceType: 'mobile',
    location: 'Bengaluru, IN',
    ip: '49.36.18.204',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: 'firefox-macos',
    browser: 'Firefox 125 on macOS Sonoma',
    deviceType: 'desktop',
    location: 'New Delhi, IN',
    ip: '182.72.65.11',
    lastActive: 'Yesterday at 18:40',
    isCurrent: false,
  },
];

//===========================================================================================
//    MAIN SETTINGS COMPONENT
// ===========================================================================================
export const Settings = memo(() => {
  const navigate = useNavigate();
  const toast = useToast();

  // Notification Preferences State
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [dealMilestones, setDealMilestones] = useState(true);
  const [leadAssignments, setLeadAssignments] = useState(true);

  // Appearance State
  const [themeMode, setThemeMode] = useState('System Default');
  const [compactDensity, setCompactDensity] = useState(false);

  // Regional Preferences State
  const [timeZone, setTimeZone] = useState('(UTC+05:30) Asia/Kolkata (IST)');
  const [language, setLanguage] = useState('English (US)');
  const [currency, setCurrency] = useState('INR (₹) - Indian Rupee');

  // Active Sessions State
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  // Toggle Handlers with Toasts
  const handleToggleInApp = useCallback(() => {
    setInAppAlerts((prev) => {
      const next = !prev;
      toast(next ? 'In-app notifications enabled.' : 'In-app notifications muted.');
      return next;
    });
  }, [toast]);

  const handleToggleEmailDigest = useCallback(() => {
    setEmailDigest((prev) => {
      const next = !prev;
      toast(next ? 'Daily email digest enabled.' : 'Daily email digest disabled.');
      return next;
    });
  }, [toast]);

  const handleToggleMilestones = useCallback(() => {
    setDealMilestones((prev) => {
      const next = !prev;
      toast(next ? 'Deal milestone alerts activated.' : 'Deal milestone alerts paused.');
      return next;
    });
  }, [toast]);

  const handleToggleLeadAssignments = useCallback(() => {
    setLeadAssignments((prev) => {
      const next = !prev;
      toast(next ? 'Lead assignment notifications active.' : 'Lead assignment notifications muted.');
      return next;
    });
  }, [toast]);

  const handleThemeChange = useCallback((value) => {
    setThemeMode(value);
    toast(`Appearance preference set to ${value}.`);
  }, [toast]);

  const handleCompactToggle = useCallback(() => {
    setCompactDensity((prev) => {
      const next = !prev;
      toast(next ? 'Compact table density enabled.' : 'Standard table density restored.');
      return next;
    });
  }, [toast]);

  // Session Termination Handler
  const handleTerminateSession = useCallback((sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast('Session terminated successfully.', 'success');
  }, [toast]);

  const handleTerminateAllOtherSessions = useCallback(() => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast('All other remote device sessions have been logged out.', 'success');
  }, [toast]);

  return (
    <div className="w-full max-w-[920px] mx-auto py-2 sm:py-3 flex flex-col gap-4 select-text">

      {/* ===========================================================================================
          CARD 1: ACCOUNT & SECURITY (PROFILE & PASSWORD NAVIGATION)
      =========================================================================================== */}
      <div className="bg-white-100 rounded-[7px] border-b-2 border-stroke/80 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-stroke/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[7px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-black-90">Account Management & Security</h2>
              <p className="text-xs text-black-90/55 font-medium mt-0.5">
                Manage your authenticated identity, personal contact details, and account credentials.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-[7px] text-[11px] font-semibold bg-success/10 text-success whitespace-nowrap">
            SSO Protected
          </span>
        </div>

        {/* Update Profile Row */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          title="Update your personal details and contact numbers"
          className="cursor-pointer w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-3.5 border-b border-stroke/40 hover:bg-gray transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:scale-105 transition-transform">
              <User size={15} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-black-90 group-hover:text-primary transition-colors">Personal Profile Details</p>
              <p className="text-[11px] text-black-90/50 font-medium mt-0.5">Edit your display name, corporate phone number, and avatar.</p>
            </div>
          </div>
          <ChevronRight size={15} className="text-black-90/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* Change Password Row */}
        <button
          type="button"
          onClick={() => navigate('/profile', { state: { tab: 'password' } })}
          title="Change your account login password"
          className="cursor-pointer w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-3.5 border-b border-stroke/40 hover:bg-gray transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-warning/10 flex items-center justify-center shrink-0 text-warning group-hover:scale-105 transition-transform">
              <Lock size={15} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-black-90 group-hover:text-warning transition-colors">Change Password & Credentials</p>
              <p className="text-[11px] text-black-90/50 font-medium mt-0.5">Update your password securely with enterprise complexity rules.</p>
            </div>
          </div>
          <ChevronRight size={15} className="text-black-90/40 group-hover:text-warning group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* Two-Factor Authentication Status Row */}
        <div className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-3.5 bg-white-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-success/10 flex items-center justify-center shrink-0 text-success">
              <KeyRound size={15} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-black-90">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-black-90/50 font-medium mt-0.5">Mandatory security verification managed via your organization workspace.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[7px] text-[11px] font-semibold bg-success/10 text-success border border-success/20 shrink-0">
            <Check size={11} strokeWidth={2.5} /> Active
          </span>
        </div>
      </div>

      {/* ===========================================================================================
          CARD 2: APPEARANCE & DISPLAY PREFERENCES
      =========================================================================================== */}
      <div className="bg-white-100 rounded-[7px] border-b-2 border-stroke/80 p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2.5 border-b border-stroke/40 pb-3">
          <div className="w-8 h-8 rounded-[7px] bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <Palette size={16} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-black-90">Appearance & Theme</h2>
            <p className="text-xs text-black-90/55 font-medium mt-0.5">
              Customize visual contrast, color theme, and layout density for your workspace.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Theme Dropdown */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-black-90">Interface Color Theme</label>
            <DropdownInput
              name="themeMode"
              options={['System Default', 'Light Mode', 'Dark Mode']}
              value={themeMode}
              onChange={(e) => handleThemeChange(e.target.value)}
              placeholder="Select Theme"
              containerClassName="w-full"
              selectClassName="w-full h-[40px] px-3.5 pr-8 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 font-normal focus:outline-none cursor-pointer flex items-center justify-between"
            />
          </div>

          {/* Table Density Switch */}
          <div className="flex flex-col gap-1 w-full justify-between">
            <div>
              <label className="text-xs font-semibold text-black-90">Compact Table Density</label>
              <p className="text-[11px] text-black-90/50 font-medium mt-0.5">
                Reduces row height on CRM tables to display more records simultaneously.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-black-90/80">
                {compactDensity ? 'Compact layout enabled' : 'Standard spacious layout'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={compactDensity}
                onClick={handleCompactToggle}
                title="Toggle compact table density"
                className={`cursor-pointer relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  compactDensity ? 'bg-primary' : 'bg-[#D0D5DD]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white-100 transition duration-200 ease-in-out ${
                    compactDensity ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===========================================================================================
          CARD 3: NOTIFICATION CHANNELS & PREFERENCES
      =========================================================================================== */}
      <div className="bg-white-100 rounded-[7px] border-b-2 border-stroke/80 p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2.5 border-b border-stroke/40 pb-3">
          <div className="w-8 h-8 rounded-[7px] bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Bell size={16} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-black-90">Notification Preferences</h2>
            <p className="text-xs text-black-90/55 font-medium mt-0.5">
              Control where and how you receive alerts, customer updates, and pipeline telemetry.
            </p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-stroke/40">
          {/* Row 1: In-App Alerts */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-black-90">In-App Banner & Top Bell Alerts</p>
              <p className="text-[11px] text-black-90/50 font-medium mt-0.5">
                Real-time badges in the top navigation bell for team comments and assigned records.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={inAppAlerts}
              onClick={handleToggleInApp}
              title="Toggle in-app notifications"
              className={`cursor-pointer relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                inAppAlerts ? 'bg-primary' : 'bg-[#D0D5DD]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white-100 transition duration-200 ease-in-out ${
                  inAppAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Row 2: Lead Assignment */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-black-90">Lead Assignment Notifications</p>
              <p className="text-[11px] text-black-90/50 font-medium mt-0.5">
                Instant alert whenever a sales manager allocates a new enterprise lead to your pipeline.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={leadAssignments}
              onClick={handleToggleLeadAssignments}
              title="Toggle lead assignment notifications"
              className={`cursor-pointer relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                leadAssignments ? 'bg-primary' : 'bg-[#D0D5DD]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white-100 transition duration-200 ease-in-out ${
                  leadAssignments ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Row 3: Deal Milestones */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-black-90">Deal Stage & Quotation Milestones</p>
              <p className="text-[11px] text-black-90/50 font-medium mt-0.5">
                Receive notifications when quotations are approved or deals advance toward Closed Won.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={dealMilestones}
              onClick={handleToggleMilestones}
              title="Toggle deal milestone alerts"
              className={`cursor-pointer relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                dealMilestones ? 'bg-primary' : 'bg-[#D0D5DD]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white-100 transition duration-200 ease-in-out ${
                  dealMilestones ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Row 4: Daily Email Digest */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-black-90">Daily Summary Digest Email</p>
              <p className="text-[11px] text-black-90/50 font-medium mt-0.5">
                Morning briefing delivered to your registered email with pending tasks and scheduled follow-ups.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailDigest}
              onClick={handleToggleEmailDigest}
              title="Toggle daily email digest"
              className={`cursor-pointer relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                emailDigest ? 'bg-primary' : 'bg-[#D0D5DD]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white-100 transition duration-200 ease-in-out ${
                  emailDigest ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ===========================================================================================
          CARD 4: SYSTEM REGIONAL & LOCALIZATION SETTINGS
      =========================================================================================== */}
      <div className="bg-white-100 rounded-[7px] border-b-2 border-stroke/80 p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2.5 border-b border-stroke/40 pb-3">
          <div className="w-8 h-8 rounded-[7px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Globe size={16} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-black-90">System Regional Settings</h2>
            <p className="text-xs text-black-90/55 font-medium mt-0.5">
              Localization standards for date formatting, time zone calculations, and currency displays.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Time Zone */}
          <DropdownInput
            label="Time Zone"
            options={[
              '(UTC+05:30) Asia/Kolkata (IST)',
              '(UTC+00:00) UTC (Universal Coordinated)',
              '(UTC-05:00) America/New_York (EST)',
              '(UTC-08:00) America/Los_Angeles (PST)',
              '(UTC+04:00) Asia/Dubai (GST)',
              '(UTC+08:00) Asia/Singapore (SGT)',
            ]}
            value={timeZone}
            onChange={(e) => {
              setTimeZone(e.target.value);
              toast(`Time zone updated to ${e.target.value}`);
            }}
          />

          {/* Language */}
          <DropdownInput
            label="Language"
            options={['English (US)', 'English (UK)', 'Hindi', 'Gujarati', 'Spanish', 'French']}
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              toast(`Display language set to ${e.target.value}`);
            }}
          />

          {/* Date Format (Strict Rule #22: DD/MM/YYYY) */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-black-90">Date Display Standard</label>
              <span className="text-[10px] font-semibold text-primary">System Standard</span>
            </div>
            <div className="flex items-center gap-2 w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 font-medium">
              <Calendar size={14} className="text-black-90/40 shrink-0" />
              <span>DD/MM/YYYY (Day/Month/Year)</span>
            </div>
          </div>

          {/* Default Currency */}
          <DropdownInput
            label="Default Currency Display"
            options={[
              'INR (₹) - Indian Rupee',
              'USD ($) - US Dollar',
              'EUR (€) - Euro',
              'GBP (£) - British Pound',
              'AED (د.إ) - UAE Dirham',
            ]}
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              toast(`Currency format updated to ${e.target.value}`);
            }}
          />
        </div>
      </div>

      {/* ===========================================================================================
          CARD 5: ACTIVE SESSIONS & SECURITY AUDIT
      =========================================================================================== */}
      <div className="bg-white-100 rounded-[7px] border-b-2 border-stroke/80 p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 border-b border-stroke/40 pb-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[7px] bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Laptop size={16} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-black-90">Active Device Sessions</h2>
              <p className="text-xs text-black-90/55 font-medium mt-0.5">
                Review and revoke access for devices and browsers currently signed into your account.
              </p>
            </div>
          </div>
          {sessions.length > 1 && (
            <button
              type="button"
              onClick={handleTerminateAllOtherSessions}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border-b-2 border-alert/30 bg-alert/10 hover:bg-alert/15 text-xs font-semibold text-alert transition-colors"
              title="Log out of all devices except this one"
            >
              <LogOut size={12} /> Log out all other devices
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-[7px] border-b-2 border-stroke/80 p-3.5 sm:p-4 flex items-center justify-between gap-4 bg-gray/40 hover:bg-gray transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-[7px] flex items-center justify-center shrink-0 ${
                    session.isCurrent
                      ? 'bg-success/10 text-success'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {session.deviceType === 'mobile' ? (
                    <Smartphone size={17} />
                  ) : (
                    <Laptop size={17} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-black-90">
                      {session.browser}
                    </span>
                    {session.isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[7px] text-[10px] font-bold bg-success/15 text-success">
                        <Check size={10} strokeWidth={3} /> This Device
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-black-90/55 font-medium mt-0.5">
                    {session.location} • IP: <span className="font-mono text-[11px]">{session.ip}</span> • {session.lastActive}
                  </p>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleTerminateSession(session.id)}
                  title={`Revoke access for ${session.browser}`}
                  className="cursor-pointer px-3.5 py-1.5 rounded-[7px] border-b-2 border-alert/30 bg-white-100 hover:bg-alert/10 text-xs font-semibold text-alert transition-colors shrink-0"
                >
                  Terminate
                </button>
              )}
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="py-6 text-center text-xs text-black-90/50">
              No active remote sessions recorded.
            </div>
          )}
        </div>
      </div>

    </div>
  );
});

//===========================================================================================
//    DEFAULT EXPORT
// ===========================================================================================
Settings.displayName = 'Settings';
export { Settings as BdeSettings, Settings as SalesSettings };
export default Settings;
