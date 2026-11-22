//===========================================================================================
//    AUTHENTICATED USER PROFILE PAGE — ROLE-AWARE SELF-SERVICE MANAGEMENT
//    Displays editable personal/contact fields + read-only employee & RBAC details.
//    Available to ALL roles (Admin, Sales Manager, BDE) via /profile route.
// ===========================================================================================
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Briefcase, Shield, Hash, Building2, UserCheck, Lock } from 'lucide-react';
import { BackButton } from '../components/common/buttons/BackButton';
import { TextInput } from '../components/common/inputs/TextInput';
import { PhoneNumber } from '../components/common/inputs/PhoneNumber';
import { PasswordInput } from '../components/common/inputs/PasswordInput';
import { fetchProfile, saveProfile, updatePassword } from '../services/profileService';
import { profileUpdated, logout } from '../store/slices/authSlice';
import { useToast } from '../hooks/useToast';

//===========================================================================================
//    ROLE BADGE — Visual role pill indicator
//===========================================================================================
const RoleBadge = ({ roleLabel }) => {
  const colorMap = {
    admin: 'bg-purple-50 text-purple-700 border border-purple-200',
    sales: 'bg-blue-50 text-blue-700 border border-blue-200',
    bde: 'bg-green-50 text-green-700 border border-green-200',
  };
  const key = (roleLabel || '').toLowerCase().includes('admin')
    ? 'admin'
    : (roleLabel || '').toLowerCase().includes('sales')
    ? 'sales'
    : 'bde';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${colorMap[key]}`}>
      <Shield size={11} />
      {roleLabel || 'User'}
    </span>
  );
};

//===========================================================================================
//    READ-ONLY FIELD — Styled non-editable info display block
//===========================================================================================
const ReadOnlyField = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs font-semibold text-black-90">{label}</label>
    <div className="flex items-center gap-2 w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90/55 font-normal cursor-not-allowed">
      {Icon && <Icon size={13} className="shrink-0 text-black-90/30" />}
      <span className="truncate">{value || '—'}</span>
    </div>
  </div>
);

//===========================================================================================
//    SECTION HEADER — Styled divider + section title
//===========================================================================================
const SectionHeader = ({ title, subtitle }) => (
  <div className="border-t border-stroke/60 pt-5">
    <h2 className="text-sm font-bold text-black-90">{title}</h2>
    {subtitle && <p className="text-xs text-black-90/50 font-medium mt-0.5">{subtitle}</p>}
  </div>
);

//===========================================================================================
//    PROFILE AVATAR — Circular profile image with role-coloured ring
//===========================================================================================
const ProfileAvatar = ({ name, avatar, role }) => {
  const ringColor = role === 'admin'
    ? 'ring-purple-300'
    : role === 'sales'
    ? 'ring-blue-300'
    : 'ring-green-300';

  const initials = (name || 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className={`w-16 h-16 rounded-full overflow-hidden ring-2 ring-offset-2 ${ringColor} shrink-0`}>
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
          {initials}
        </div>
      )}
    </div>
  );
};

//===========================================================================================
//    TAB BUTTON — Profile / Change Password tab switcher
//===========================================================================================
const TabButton = ({ label, active, onClick, icon: Icon }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-selected={active}
    className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
      active
        ? 'border-primary text-primary bg-primary/5'
        : 'border-transparent text-black-90/55 hover:text-black-90 hover:bg-gray'
    }`}
  >
    {Icon && <Icon size={13} />}
    {label}
  </button>
);

//===========================================================================================
//    CHANGE PASSWORD TAB — Inline password change form
//===========================================================================================
const ChangePasswordTab = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Password strength indicator
  const strength = useMemo(() => {
    const p = form.newPassword;
    if (!p) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { level: 0, label: '', color: '' },
      { level: 1, label: 'Weak', color: 'bg-red-400' },
      { level: 2, label: 'Fair', color: 'bg-yellow-400' },
      { level: 3, label: 'Good', color: 'bg-blue-400' },
      { level: 4, label: 'Strong', color: 'bg-green-500' },
    ];
    return levels[score] || levels[0];
  }, [form.newPassword]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!form.currentPassword) {
      toast('Current password is required.', 'error');
      return;
    }
    if (form.newPassword.length < 8) {
      toast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast('New password and confirmation do not match.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await updatePassword(form);
      // Trigger top toast notification (upside)
      toast('Password changed successfully. Please log in with your new password.', 'success');
      // Revoke current session & credentials
      dispatch(logout());
      // Smoothly redirect to login page
      navigate('/login', { replace: true });
    } catch (err) {
      const fieldMsg = err.data?.errors?.map((item) => item.message).filter(Boolean).join(' ');
      const msg = fieldMsg || err.message || 'Unable to update password. Please check your current password and try again.';
      toast(msg, 'error');
      setIsSaving(false);
    }
  }, [dispatch, form, navigate, toast]);

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 py-5">
      <div className="grid grid-cols-1 gap-4">
        {/* Current Password */}
        <PasswordInput
          label="Current Password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
          required
        />

        {/* New Password + Strength Meter */}
        <div className="flex flex-col gap-1.5">
          <PasswordInput
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password (min. 8 characters)"
            required
          />
          {/* Strength bar */}
          {form.newPassword && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= strength.level ? strength.color : 'bg-stroke/60'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[10px] font-semibold shrink-0 ${
                strength.level === 4 ? 'text-green-600'
                : strength.level === 3 ? 'text-blue-600'
                : strength.level === 2 ? 'text-yellow-600'
                : 'text-red-500'
              }`}>
                {strength.label}
              </span>
            </div>
          )}
          <p className="text-[10px] text-black-90/40 font-medium">
            Use 8+ chars with uppercase, lowercase, number & symbol for strong password.
          </p>
        </div>

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm New Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter new password"
          required
        />
      </div>

      <div className="flex justify-end pt-1 border-t border-stroke/60">
        <button
          type="submit"
          disabled={isSaving}
          className="cursor-pointer rounded-[7px] border-b-2 border-black-90/20 bg-primary px-6 py-2.5 text-xs font-semibold text-white-100 transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
        >
          {isSaving ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </form>
  );
};

//===========================================================================================
//    UPDATE PROFILE TAB — Personal & contact info editable form
//===========================================================================================
const UpdateProfileTab = ({ profile, form, onChange, onSave, isSaving, role }) => {
  // Role-specific editable field visibility
  const isAdmin = role === 'admin';
  const isSales = role === 'sales';

  return (
    <form noValidate onSubmit={onSave} className="flex flex-col gap-5 py-5">
      {/* ---- Core Editable Fields ---- */}
      <div>
        <h3 className="text-xs font-bold text-black-90/60 uppercase tracking-wider mb-3">
          Editable Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Name — editable by all roles */}
          <TextInput
            label="Full Name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Enter your full name"
            required
            maxLength={150}
          />
          {/* Phone — editable by all roles */}
          <PhoneNumber
            label="Direct Business Phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
          />
        </div>
      </div>

      {/* ---- Read-Only Employee Fields ---- */}
      <SectionHeader
        title="Employee Details"
        subtitle="These fields are managed by your administrator."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ReadOnlyField label="Employee Code" value={profile?.employeeCode} icon={Hash} />
        <ReadOnlyField label="Corporate Email" value={profile?.email} icon={Mail} />
        <ReadOnlyField label="Role / Access Level" value={profile?.roleName || profile?.designation} icon={Shield} />
        <ReadOnlyField label="Department" value={profile?.department} icon={Building2} />
        {/* Account Status — visible only to admin & sales for context */}
        {(isAdmin || isSales) && (
          <ReadOnlyField label="Account Status" value={profile?.status} icon={UserCheck} />
        )}
        {isAdmin && (
          <ReadOnlyField label="Joined Date" value={profile?.joinedDate} icon={Briefcase} />
        )}
      </div>

      {/* ---- Reporting Manager ---- */}
      {profile?.manager && (
        <>
          <SectionHeader title="Reporting Manager" />
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-[7px] border-b-2 border-stroke/80 bg-gray p-3">
            <div>
              <p className="text-xs font-semibold text-black-90">{profile.manager.name}</p>
              <p className="mt-0.5 break-all text-[11px] text-black-90/55">{profile.manager.email}</p>
            </div>
            <a
              href={`mailto:${encodeURIComponent(profile.manager.email)}`}
              title="Contact reporting manager"
              className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-white-100 px-3 py-2 text-xs font-semibold text-primary hover:bg-gray transition-colors"
            >
              Contact
            </a>
          </div>
        </>
      )}

      {/* ---- Save Footer ---- */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-stroke/60 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="cursor-pointer rounded-[7px] border-b-2 border-black-90/20 bg-primary px-6 py-2.5 text-xs font-semibold text-white-100 transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
};

//===========================================================================================
//    SKELETON LOADER
//===========================================================================================
const ProfileSkeleton = () => (
  <div className="flex flex-col gap-4 p-6 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-40 rounded bg-gray" />
        <div className="h-3 w-24 rounded bg-gray" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 mt-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-10 rounded-[7px] bg-gray" />)}
    </div>
  </div>
);

//===========================================================================================
//    MAIN EDIT PROFILE PAGE
//===========================================================================================
const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Pull authenticated user from Redux (used as fallback if API fails)
  const authUser = useSelector((state) => state.auth.user);
  const authRole = useSelector((state) => state.auth.role);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  // If navigated from Settings with tab state, open that tab directly
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  //===========================================================================================
  //    LOAD PROFILE — API first, Redux fallback
  //===========================================================================================
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchProfile()
      .then((result) => {
        if (!active) return;
        setProfile(result);
        setForm({ name: result.name || '', phone: result.phone || '' });
      })
      .catch(() => {
        // Gracefully fall back to Redux store data when API is unavailable
        if (!active) return;
        const fallback = {
          name: authUser?.name || '',
          email: authUser?.email || '',
          phone: authUser?.phone || '',
          roleName: authUser?.roleLabel || authUser?.designation || '',
          designation: authUser?.designation || '',
          employeeCode: authUser?.employeeCode || '',
          department: '',
          status: 'Active',
          manager: null,
        };
        setProfile(fallback);
        setForm({ name: fallback.name, phone: fallback.phone });
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [authUser]);

  //===========================================================================================
  //    HANDLE FORM FIELD CHANGE
  //===========================================================================================
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  //===========================================================================================
  //    SAVE PROFILE
  //===========================================================================================
  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      toast('Please enter your full name (at least 2 characters).', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const updated = await saveProfile({ name: form.name.trim(), phone: form.phone.trim() });
      setProfile(updated);
      setForm({ name: updated.name || '', phone: updated.phone || '' });
      dispatch(profileUpdated({ name: updated.name, phone: updated.phone }));
      toast('Profile updated successfully.', 'success');
    } catch (saveError) {
      // Optimistic Redux update even if API fails (for mock/offline mode)
      dispatch(profileUpdated({ name: form.name.trim(), phone: form.phone.trim() }));
      toast('Profile updated locally.', 'success');
    } finally {
      setIsSaving(false);
    }
  }, [dispatch, form, toast]);

  //===========================================================================================
  //    DISPLAY NAME (from profile or redux)
  //===========================================================================================
  const displayName = profile?.name || authUser?.name || 'User';
  const displayRole = profile?.roleName || authUser?.roleLabel || 'User';
  const displayAvatar = authUser?.avatar || '';

  return (
    <div className="min-h-full w-full bg-gray p-4 sm:p-6">
      <div className="mx-auto w-full max-w-3xl">

        {/* Back Button */}
        <div className="mb-4">
          <BackButton onClick={() => navigate('/settings')} label="Back to Settings" />
        </div>

        {/* Profile Card */}
        <div className="rounded-[7px] border-b-2 border-stroke/80 bg-white-100 overflow-hidden">

          {/* ---- Profile Header ---- */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-5 sm:px-8 border-b border-stroke/40">
            {isLoading ? (
              <div className="w-16 h-16 rounded-full bg-gray animate-pulse shrink-0" />
            ) : (
              <ProfileAvatar name={displayName} avatar={displayAvatar} role={authRole} />
            )}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-black-90 leading-tight truncate">
                  {displayName}
                </h1>
                <RoleBadge roleLabel={displayRole} />
              </div>
              <p className="text-xs text-black-90/55 font-medium">
                {profile?.email || authUser?.email || ''}
              </p>
              <p className="text-[11px] text-black-90/40 font-medium">
                Manage your personal information and account security.
              </p>
            </div>
          </div>

          {/* ---- Tab Switcher ---- */}
          <div className="flex border-b border-stroke/40">
            <TabButton
              label="Update Profile"
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              icon={User}
            />
            <TabButton
              label="Change Password"
              active={activeTab === 'password'}
              onClick={() => setActiveTab('password')}
              icon={Lock}
            />
          </div>

          {/* ---- Tab Content ---- */}
          <div className="px-5 sm:px-8 pb-6">
            {isLoading ? (
              <ProfileSkeleton />
            ) : (
              <>
                {activeTab === 'profile' && (
                  <UpdateProfileTab
                    profile={profile}
                    form={form}
                    onChange={handleChange}
                    onSave={handleSave}
                    isSaving={isSaving}
                    role={authRole}
                  />
                )}
                {activeTab === 'password' && <ChangePasswordTab />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

//===========================================================================================
//    DEFAULT EXPORT
//===========================================================================================
export default EditProfile;
