//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, drawer container, and mock notification records.
// ==================================================================================================================

// cspell:words notif

import { useState, useRef, useCallback, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Drawer } from './Drawer';
import { NOTIFICATIONS } from '../../constants/notificationConstants';

//==================================================================================================================
//    NOTIFICATION TABS CONSTANTS
//==================================================================================================================
const NOTIFICATION_TABS = ['All', 'Unread', 'Mentions'];

//==================================================================================================================
//    NOTIFICATION BELL COMPONENT
//    Self-contained notification trigger with badge counter and dedicated flyout drawer panel.
// ==================================================================================================================
export const NotificationBell = ({
  initialNotifications = NOTIFICATIONS,
  onNotificationClick = null,
  count,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Unread' | 'Mentions'
  const [readIndices, setReadIndices] = useState(() => new Set());

  const containerRef = useRef(null);
  const tabRefs = useRef({});

  // Sliding indicator coordinates
  const [sliderStyle, setSliderStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  //==================================================================================================================
  //    SLIDER INDICATOR POSITION CALCULATOR
  //    Smoothly glides the active tab pill across notification categories matching Organization tabs animation.
  // ==================================================================================================================
  const updateSliderPosition = useCallback(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl) {
      setSliderStyle({
        left: activeEl.offsetLeft,
        top: activeEl.offsetTop,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
        opacity: 1,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isOpen) return;

    updateSliderPosition();
    const rafId = requestAnimationFrame(updateSliderPosition);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateSliderPosition();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSliderPosition);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateSliderPosition);
    };
  }, [isOpen, updateSliderPosition]);

  const [isCleared, setIsCleared] = useState(false);

  // Derive unread status from initialNotifications without cascading effect renders.
  const resolvedNotifications = isCleared
    ? []
    : initialNotifications.map((notif, idx) => ({
        ...notif,
        unread: readIndices.has(idx) ? false : notif.unread,
      }));

  // Filter notifications according to the active tab selection.
  const filteredNotifications = resolvedNotifications.filter((notif) => {
    if (activeTab === 'Unread') return notif.unread;
    if (activeTab === 'Mentions') return notif.desc.toLowerCase().includes('mention');
    return true; // All
  });

  const unreadCount =
    count !== undefined
      ? count
      : resolvedNotifications.filter((n) => n.unread).length;

  //==================================================================================================================
  // Mark all notifications as read in client state.
  //    Handle Mark All Read & Clear All
  //==================================================================================================================
  const handleMarkAllRead = () => {
    const all = new Set(initialNotifications.map((_, idx) => idx));
    setReadIndices(all);
  };

  const handleClearAll = () => {
    setIsCleared(true);
  };

  return (
    <>
      {/*==================================================================================================================
      //    NOTIFICATION BELL TRIGGER BUTTON
      // ==================================================================================================================*/}
      <button
        type="button"
        className="relative w-10 h-10 flex items-center justify-center text-black-90/70 hover:text-black-90 rounded-full bg-gray border border-stroke/60 hover:bg-gray/80 transition-colors cursor-pointer select-none flex-shrink-0"
        onClick={() => setIsOpen(true)}
        aria-label="View notifications"
      >
        <div className="relative flex items-center justify-center">
          <Bell size={19} className="text-black-90/80" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 bg-alert text-white-100 text-[9px] font-bold flex items-center justify-center rounded-full border border-white-100 shadow-2xs">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {/*==================================================================================================================
      //    NOTIFICATIONS FLYOUT DRAWER & CONTROLS
      // ==================================================================================================================*/}
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Notifications"
        seamlessHeader={false}
        bodyClassName="p-0"
      >
        {/* Category Filter Tabs & Header Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-6 sm:py-4 border-b border-stroke gap-2.5 sm:gap-3 flex-shrink-0 bg-white-100">
          <div
            ref={containerRef}
            className="relative flex w-full sm:w-auto bg-gray border border-stroke rounded-lg p-1 shadow-2xs"
          >
            {/* Animated Sliding Pill Indicator */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 rounded-md bg-white-100 border border-stroke/60 shadow-2xs transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none z-0"
              style={{
                transform: `translate3d(${sliderStyle.left}px, ${sliderStyle.top}px, 0)`,
                width: `${sliderStyle.width}px`,
                height: `${sliderStyle.height}px`,
                opacity: sliderStyle.opacity,
              }}
            />

            {NOTIFICATION_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  ref={(el) => {
                    tabRefs.current[tab] = el;
                  }}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative z-10 flex-1 sm:flex-none text-center px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-md transition-colors duration-200 whitespace-nowrap cursor-pointer select-none outline-none focus:outline-none ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-black-90/60 hover:text-black-90 font-medium'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex-1 sm:flex-none text-center bg-secondary text-white-100 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold hover:bg-secondary/90 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            >
              Mark as All Read
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="sm:flex-none text-center text-secondary hover:text-primary font-bold text-xs px-2 py-1.5 cursor-pointer whitespace-nowrap transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Scrollable Notifications Feed */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif, idx) => (
              <div
                key={`${notif.title}-${idx}`}
                onClick={() => onNotificationClick && onNotificationClick(notif)}
                className="group flex items-start gap-4 p-5 px-6 border-b border-stroke/50 hover:bg-gray transition-colors relative cursor-pointer"
              >
                <div
                  className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-colors group-hover:bg-transparent ${notif.bg}`}
                >
                  <notif.icon className={notif.color} size={20} />
                </div>
                <div className="flex-1 pr-2">
                  <p className="text-sm leading-snug">
                    <span className="font-bold text-black-90 mr-1.5">
                      {notif.title}
                    </span>
                    <span className="text-black-90/80 font-normal">
                      {notif.desc}
                    </span>
                  </p>
                  <p className="text-xs text-black-90/50 mt-1.5 font-medium">
                    {notif.time}
                  </p>
                </div>
                {notif.unread && (
                  <div className="w-2 h-2 rounded-full bg-alert flex-shrink-0 mt-2" />
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-black-90/60 p-8 text-center">
              <Bell size={48} className="mb-4 opacity-20" />
              <p className="text-sm">
                No {activeTab.toLowerCase()} notifications.
              </p>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

//==================================================================================================================
//    DEFAULT EXPORT
// ==================================================================================================================
export default NotificationBell;
