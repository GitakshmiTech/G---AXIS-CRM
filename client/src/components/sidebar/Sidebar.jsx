//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, router NavLink, navigation icons, assets, and context
//==================================================================================================================
import React, { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  ChevronDown,
} from 'lucide-react';

import closedSidebarLogo from '../../assets/LOGO/_2107164265360.png';
import openSidebarLogo from '../../assets/LOGO/Group 89.png';
import {
  SidebarContext,
  SidebarProvider,
  useSidebar,
} from '../../context/SidebarContext';
import {
  NAV_SECTIONS,
  BDE_NAV_SECTIONS,
  SALES_NAV_SECTIONS,
  ADMIN_NAV_SECTIONS,
} from './SidebarNavigation';

//==================================================================================================================
//    RE-EXPORTS
//==================================================================================================================
export {
  SidebarContext,
  SidebarProvider,
  useSidebar,
  NAV_SECTIONS,
  BDE_NAV_SECTIONS,
  SALES_NAV_SECTIONS,
  ADMIN_NAV_SECTIONS,
};

//==================================================================================================================
//    SIDEBAR TRIGGER COMPONENT
//==================================================================================================================
export const SidebarTrigger = ({ className = '' }) => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      className={`text-black-90 p-1.5 rounded-lg hover:bg-white-100/60 transition-colors cursor-pointer ${
        !isCollapsed ? 'lg:hidden' : 'block'
      } ${className}`}
      onClick={toggleSidebar}
      title={isCollapsed ? 'Expand Sidebar' : 'Open Navigation Menu'}
      aria-label="Toggle navigation menu"
    >
      <Menu size={24} />
    </button>
  );
};

//==================================================================================================================
//    EXPANDED SIDEBAR SECTION COMPONENT
//==================================================================================================================
const ExpandedSidebarSection = ({ title, items, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <div
        className={`flex items-center justify-between px-6 mb-2  ${
          title !== 'MAIN' ? 'cursor-pointer group' : ''
        }`}
        onClick={() => title !== 'MAIN' && setIsOpen(!isOpen)}
      >
        <h3
          className={`text-xs font-semibold text-black-90/50 uppercase tracking-wider transition-colors`}
        >
          {title}
        </h3>
        {title !== 'MAIN' && (
          <ChevronDown
            size={14}
            className={`text-black-90/50 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="space-y-1 px-4">
          {items.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end={item.path === '/bde/dashboard' || item.path === '/sales/dashboard' || item.path === '/admin/dashboard'}
                onClick={(e) => {
                  if (item.disabled || item.path === '#') {
                    e.preventDefault();
                    return;
                  }
                  onItemClick?.();
                }}
                className={({ isActive }) => {
                  const isCurrent = isActive && !item.disabled && item.path !== '#';
                  return `flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors border-r-[3px] cursor-pointer ${
                    isCurrent
                      ? 'bg-primary text-white-100 border-secondary font-semibold'
                      : 'border-transparent text-black-90/80 font-medium hover:bg-gray hover:text-black-90'
                  } ${item.disabled || item.path === '#' ? 'opacity-50 cursor-not-allowed' : ''}`;
                }}
              >
                {({ isActive }) => {
                  const isCurrent = isActive && !item.disabled && item.path !== '#';
                  return (
                    <>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <item.icon
                          size={18}
                          className={`shrink-0 ${isCurrent ? 'text-white-100' : 'text-primary'}`}
                        />
                        <span className="truncate whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>

                      {isCurrent && (
                        <ChevronLeft
                          size={16}
                          className="rotate-180 shrink-0 text-white-100"
                        />
                      )}
                    </>
                  );
                }}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

//==================================================================================================================
//    COLLAPSED SIDEBAR VIEW COMPONENT
//==================================================================================================================
const CollapsedSidebarView = ({
  onToggleCollapse,
  onItemClick,
  sections = BDE_NAV_SECTIONS,
}) => (
  <div className="w-20 h-full flex flex-col items-center py-5 justify-between bg-white-100">
    {/* Brand Logo & Expand Button */}
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onToggleCollapse}
        title="Click to expand sidebar"
        className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-all cursor-pointer group relative"
        aria-label="Expand sidebar"
      >
        <div className="w-8 h-8 flex items-center justify-center shrink-0 transition-opacity duration-200 group-hover:opacity-0">
          <img
            src={closedSidebarLogo}
            alt="CRM Logo"
            className="h-7 w-auto object-contain"
          />
        </div>

        <div
          data-preserve-radius
          className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-gray border border-stroke flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <ChevronsRight size={18} className="text-black-90" />
        </div>
      </button>
    </div>

    {/* Navigation Icons */}
    <nav className="flex-1 w-full flex flex-col items-center overflow-y-auto overflow-x-hidden mt-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {sections.map((section, sectionIndex) => (
        <React.Fragment key={section.title}>
          {sectionIndex > 0 && (
            <div className="w-10 h-px bg-gradient-to-r from-transparent via-stroke to-transparent my-2.5 shrink-0" />
          )}

          <div className="flex flex-col items-center gap-2">
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/bde/dashboard' || item.path === '/sales/dashboard' || item.path === '/admin/dashboard'}
                onClick={(e) => {
                  if (item.disabled || item.path === '#') {
                    e.preventDefault();
                    return;
                  }
                  onItemClick?.();
                }}
                title={item.label}
                className={({ isActive }) => {
                  const isCurrent = isActive && !item.disabled && item.path !== '#';
                  return `w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-primary text-white-100'
                      : 'text-primary hover:bg-gray'
                  }`;
                }}
              >
                {({ isActive }) => {
                  const isCurrent = isActive && !item.disabled && item.path !== '#';
                  return (
                    <item.icon
                      size={20}
                      className={`shrink-0 ${isCurrent ? 'text-white-100' : 'text-primary'}`}
                    />
                  );
                }}
              </NavLink>
            ))}
          </div>
        </React.Fragment>
      ))}
    </nav>
  </div>
);

//==================================================================================================================
//    SIDEBAR INNER COMPONENT
//==================================================================================================================
const SidebarInner = ({ role }) => {
  const {
    isCollapsed,
    isMobileOpen,
    toggleCollapse,
    closeMobile,
  } = useSidebar();

  const location = useLocation();

  // Dynamically resolve role: explicit prop > route path (/admin/* vs /sales/* vs /bde/*) > session fallback
  const currentRole = React.useMemo(() => {
    if (role === 'admin' || role === 'super-admin') return 'admin';
    if (role === 'sales') return 'sales';
    if (role === 'bde') return 'bde';
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin')) return 'admin';
    if (location.pathname.startsWith('/sales')) return 'sales';
    if (location.pathname.startsWith('/bde')) return 'bde';
    const lastLogin = sessionStorage.getItem('last_login_type');
    if (lastLogin === 'admin' || lastLogin === 'super-admin') return 'admin';
    if (lastLogin === 'sales') return 'sales';
    return 'bde';
  }, [role, location.pathname]);

  const sections = React.useMemo(() => {
    if (currentRole === 'admin') return ADMIN_NAV_SECTIONS;
    if (currentRole === 'sales') return SALES_NAV_SECTIONS;
    return BDE_NAV_SECTIONS;
  }, [currentRole]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity backdrop-blur-xs"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-full flex flex-col shrink-0 z-50 lg:z-10 transition-all duration-300 ease-in-out
          bg-white-100
          w-80 ${
            isMobileOpen
              ? 'translate-x-0 '
              : '-translate-x-full lg:translate-x-0'
          }
          ${isCollapsed ? 'lg:w-20' : 'lg:w-65'}
          rounded-none overflow-hidden
        `}
      >
        {/* Desktop-only collapsed icon view */}
        {isCollapsed && (
          <div className="hidden lg:flex w-full h-full">
            <CollapsedSidebarView
              onToggleCollapse={toggleCollapse}
              onItemClick={closeMobile}
              sections={sections}
            />
          </div>
        )}

        {/* Full sidebar view for mobile drawer and expanded desktop */}
        <div
          className={`${
            isCollapsed ? 'flex lg:hidden' : 'flex'
          } w-full h-full flex-col justify-between overflow-hidden bg-white-100`}
        >
          {/* Header Brand */}
          <div className="flex-none flex items-center justify-between px-5 h-17.5">
            <div className="flex items-center min-w-0">
              <img
                src={openSidebarLogo}
                alt="CRM Logo"
                className="h-7.5 w-auto object-contain shrink-0"
              />
            </div>

            <button
              type="button"
              data-preserve-radius
              className="w-8 h-8 shrink-0 rounded-full border border-stroke bg-gray flex items-center justify-center text-black-90 hover:bg-stroke/40 transition-all cursor-pointer"
              onClick={() => {
                if (isMobileOpen) {
                  closeMobile();
                } else {
                  toggleCollapse();
                }
              }}
              title={isMobileOpen ? 'Close Navigation' : 'Collapse Sidebar'}
              aria-label="Close or collapse sidebar"
            >
              <ChevronsLeft size={16} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden pt-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {sections.map((section, index) => (
              <React.Fragment key={section.title}>
                {index > 0 && (
                  <div className="w-55 mx-auto h-[1px] bg-gradient-to-r from-transparent via-stroke to-transparent my-3" />
                )}

                <ExpandedSidebarSection
                  title={section.title}
                  items={section.items}
                  onItemClick={closeMobile}
                />
              </React.Fragment>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

//==================================================================================================================
//    MAIN SIDEBAR EXPORT
//==================================================================================================================
export const Sidebar = ({ role }) => {
  const context = useContext(SidebarContext);

  if (context) {
    return <SidebarInner role={role} />;
  }

  return (
    <SidebarProvider>
      <SidebarInner role={role} />
    </SidebarProvider>
  );
};

export default Sidebar;
