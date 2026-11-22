//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, router navigation, and subcomponents
//==================================================================================================================
import { memo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronDown, PenLine } from 'lucide-react';
import { SidebarTrigger } from '../sidebar/Sidebar';
import { NotificationBell } from './NotificationBell';
import { GlobalSearch } from '../inputs/GlobalSearch';
import { LogoutIcon } from '../icons/LogoutIcon';
import { LogoutConfirmationModal } from '../modals/LogoutConfirmationModal';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { logout } from '../../../store/slices/authSlice';

// Re-export common components for consumers
export { NotificationBell, GlobalSearch };

//==================================================================================================================
//    PROFILE CAPSULE COMPONENT
//    Header profile pill with dropdown menu featuring Edit Profile and Logout actions.
//==================================================================================================================
export const ProfileCapsule = memo(({
  userName = 'Johnson Doe',
  userRole = 'BDE',
  userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  onProfileClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Close dropdown on outside click
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const resolvedName = auth?.user?.name || userName;
  const resolvedRole = auth?.user?.roleLabel || auth?.user?.designation || userRole;
  const resolvedAvatar = auth?.user?.avatar || userAvatar;

  // Determine destination paths dynamically from active route & role
  const handleProfileNavigation = () => {
    setIsOpen(false);
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate('/profile');
    }
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <div className="relative z-50" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-3 h-10 rounded-[10px] bg-gray border-b-2 border-stroke/80 hover:bg-gray/80 transition-colors cursor-pointer select-none"
          title="Account profile"
          aria-label="Account profile menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* Circular avatar without borders */}
          <img
            data-preserve-radius
            src={resolvedAvatar}
            alt={resolvedName}
            className="w-7.5 h-7.5 rounded-full object-cover shrink-0 select-none pointer-events-none"
          />

          {/* User Name on tablet/desktop (clean single-line matching Figma) */}
          <span className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-black-90 leading-tight whitespace-nowrap">
            {resolvedName}
          </span>

          <ChevronDown
            size={14}
            className={`text-black-90/70 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu directly under Profile (Matching Figma 100%) */}
        {isOpen && (
          <div
            className="absolute left-0 right-0 top-full mt-1.5 w-full bg-white-100 rounded-[10px] border border-stroke overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Edit Profile Action */}
            <button
              type="button"
              onClick={handleProfileNavigation}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black-90 hover:bg-gray transition-colors cursor-pointer text-left border-b border-stroke"
              title="Edit Profile"
            >
              <PenLine size={16} className="text-primary shrink-0" />
              <span>Edit Profile</span>
            </button>

            {/* Logout Action */}
            <button
              type="button"
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-alert hover:bg-alert/10 transition-colors cursor-pointer text-left"
              title="Logout"
            >
              <LogoutIcon size={16} className="text-alert shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Reusable Logout Confirmation Dialog */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
});

//==================================================================================================================
//    MAIN TOP HEADER COMPONENT
//    Universal top navigation bar across all role dashboards with responsive triggers and dynamic page telemetry
//==================================================================================================================
export const TopHeader = memo(({
  leftContent = null,
  title,
  subtitle,
  searchPlaceholder = 'Search Tenants or Employees...',
  onSearch,
  userName = 'Johnson Doe',
  userRole = 'BDE',
  userAvatar,
  notificationCount = 3,
  onProfileClick,
  className = '',
}) => {
  // Determine left display: either explicit leftContent from layouts, or title/subtitle fallback
  const resolvedLeftContent = leftContent || (title ? (
    <div className="flex flex-col">
      <h1 className="text-lg sm:text-xl font-bold text-primary leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs sm:text-[13px] text-black-90/50 font-medium leading-tight mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  ) : null);

  return (
    <header
      className={`relative min-h-[64px] sm:min-h-[70px] bg-white-100 flex items-center justify-between gap-4 px-3 sm:px-6 2xl:px-8 py-2.5 flex-shrink-0 z-40 ${className}`.trim()}
    >
      {/* Left Region: Sidebar Mobile Drawer Trigger + Search Bar OR Page-wise Title */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <SidebarTrigger className="lg:hidden" />
        {resolvedLeftContent ? (
          <>
            <div className="hidden sm:flex items-center flex-1 min-w-0">
              {resolvedLeftContent}
            </div>
            <div className="sm:hidden flex-1 flex justify-end">
              <GlobalSearch placeholder={searchPlaceholder} onChange={onSearch} />
            </div>
          </>
        ) : (
          <div className="flex-1 max-w-xl">
            <GlobalSearch placeholder={searchPlaceholder} onChange={onSearch} />
          </div>
        )}
      </div>

      {/* Right Region: Separate Notification Bell and Profile Capsule Modules */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <NotificationBell count={notificationCount !== 3 ? notificationCount : undefined} />
        <ProfileCapsule
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
          onProfileClick={onProfileClick}
        />
      </div>
    </header>
  );
});

export default TopHeader;
