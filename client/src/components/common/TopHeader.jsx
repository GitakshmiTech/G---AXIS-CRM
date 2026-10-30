//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, and sidebar trigger
//==================================================================================================================
import { memo } from 'react';
import { SidebarTrigger } from './Sidebar';
import { NotificationBell } from './NotificationBell';
import { GlobalSearch } from './GlobalSearch';

// Re-export common components for consumers
export { NotificationBell, GlobalSearch };

//==================================================================================================================
//    PROFILE CAPSULE COMPONENT
//==================================================================================================================
export const ProfileCapsule = memo(({
  userName = 'Johnson Doe',
  userRole = 'BDE',
  userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2.5 sm:gap-3 pl-1 sm:pl-2 select-none cursor-pointer"
    >
      <img
        src={userAvatar}
        alt={userName}
        className="w-10 h-10 rounded-full object-cover border border-stroke"
      />
      <div className="hidden sm:flex flex-col text-left">
        <span className="text-xs sm:text-sm font-semibold text-black-90 leading-tight">
          {userName}
        </span>
        <span className="text-[10px] sm:text-[11px] font-medium text-black-90/60 leading-tight mt-0.5">
          {userRole}
        </span>
      </div>
    </div>
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
      className={`min-h-[64px] sm:min-h-[70px] bg-white-100 rounded-2xl border border-stroke flex items-center justify-between gap-4 px-3 sm:px-5 py-2.5 flex-shrink-0 z-30 shadow-2xs ${className}`}
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
          onClick={onProfileClick}
        />
      </div>
    </header>
  );
};

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default TopHeader;
