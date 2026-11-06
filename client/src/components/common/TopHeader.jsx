//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, router navigation, and subcomponents
//==================================================================================================================
import { memo, useState, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, PenLine } from 'lucide-react';
import { SidebarTrigger } from '../sidebar/Sidebar';
import { NotificationBell } from '../inputs/NotificationBell';
import { GlobalSearch } from '../inputs/GlobalSearch';
import { LogoutIcon } from '../icons/LogoutIcon';
import { LogoutConfirmationModal } from './LogoutConfirmationModal';
import { useClickOutside } from '../../hooks/useClickOutside';

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
  const location = useLocation();

  // Close dropdown on outside click
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Determine destination paths dynamically from active route
  const profilePath = useMemo(() => {
    if (location.pathname.startsWith('/sales')) return '/sales/profile';
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin')) return '/admin/config';
    return '/bde/profile';
  }, [location.pathname]);

  const loginPath = useMemo(() => {
    if (location.pathname.startsWith('/sales')) return '/sales/login';
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin')) return '/admin/login';
    return '/bde/login';
  }, [location.pathname]);

  const handleEditProfile = () => {
    setIsOpen(false);
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate(profilePath);
    }
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    navigate(loginPath);
  };

  return (
    <>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 h-10 rounded-[7px] bg-gray border-b-2 border-stroke/80 hover:bg-gray/80 transition-colors cursor-pointer"
          aria-expanded={isOpen}
          aria-haspopup="true"
          title="User menu"
        >
          <img
            data-preserve-radius
            src={userAvatar}
            alt={userName}
            className="w-7.5 h-7.5 rounded-full object-cover shrink-0 select-none"
          />
          <span className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-black-90 leading-tight">
            {userName}
          </span>
          <ChevronDown
            size={15}
            className={`text-black-90/70 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu under Profile */}
        {isOpen && (
          <div
            className="absolute right-0 sm:left-0 sm:right-0 top-full mt-2 min-w-[150px] sm:min-w-full sm:w-full bg-white-100 rounded-[10px] border border-stroke p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button
              type="button"
              onClick={handleEditProfile}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-black-90 hover:bg-gray text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              title="Edit Profile"
            >
              <PenLine size={16} className="text-primary shrink-0" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-alert hover:bg-alert-light text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              title="Logout"
            >
              <LogoutIcon size={16} className="shrink-0 text-alert" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
});

//==================================================================================================================
//    TOP HEADER COMPONENT
//    Unified white card navigation bar housing global search, notifications, and user profile capsule.
//==================================================================================================================
export const TopHeader = ({
  leftContent = null,
  userName = 'Johnson Doe',
  userRole = 'BDE',
  userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  notificationCount = 3,
  onProfileClick,
  className = '',
}) => {
  return (
    <header
      className={`min-h-[64px] sm:min-h-[70px] bg-white-100 rounded-none flex items-center justify-between gap-4 px-3 sm:px-5 py-2.5 flex-shrink-0 z-30 ${className}`}
    >
      {/* Left Region: Sidebar Mobile Drawer Trigger + Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <SidebarTrigger className="lg:hidden" />
        {leftContent ? (
          <>
            <div className="hidden sm:flex items-center flex-1 min-w-0">
              {leftContent}
            </div>
            <div className="sm:hidden flex-1 flex justify-end">
              <GlobalSearch />
            </div>
          </>
        ) : (
          <GlobalSearch />
        )}
      </div>

      {/* Right Region: Separate Notification Bell and Profile Capsule Modules */}
      <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
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
};

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default TopHeader;
