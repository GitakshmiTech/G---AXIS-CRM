//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, layout routing outlets, context provider, sidebar and common header component.
//==================================================================================================================
import React, { useMemo, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar } from '../components/common/sidebar/Sidebar';
import { TopHeader } from '../components/common/header/TopHeader';
import { MobilePageHeader } from '../components/common/header/MobilePageHeader';

//==================================================================================================================
//    ADMIN LAYOUT COMPONENT
//    Shell featuring the Super Admin sidebar, common top header with userRole="Super Admin", and page outlet.
//==================================================================================================================
export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  // Dynamic header content for sub-routes
  const headerContent = useMemo(() => {
    if (location.pathname.startsWith('/admin/leads') || location.pathname.startsWith('/leads')) {
      return {
        title: 'Lead Management',
        subtitle: 'Manage, qualify, and track high-value enterprise leads.',
      };
    }
    if (location.pathname.startsWith('/admin/clients') || location.pathname.startsWith('/clients')) {
      return {
        title: 'Account Management',
        subtitle: 'Manage CRM accounts, linked contacts, assigned ownership, and related sales opportunities.',
      };
    }
    if (location.pathname.startsWith('/admin/contacts') || location.pathname.startsWith('/contacts')) {
      return {
        title: 'Contact Management',
        subtitle: 'Stakeholder contacts linked to your converted accounts and active deals across assigned enterprise accounts.',
      };
    }
    if (location.pathname.startsWith('/admin/deals') || location.pathname.startsWith('/deals')) {
      return {
        title: 'Deal Management',
        subtitle: 'Manage sales opportunities, pipeline stages, AI-driven forecast probabilities, and deal contract milestones across your assigned...',
      };
    }
    if (location.pathname.startsWith('/admin/quotations') || location.pathname.startsWith('/quotations')) {
      return {
        title: 'Quotations',
        subtitle: 'Track quotation status, manage active commercial proposals, and audit lifecycle progression on related deal timelines.',
      };
    }
    if (location.pathname.startsWith('/admin/staff') || location.pathname.startsWith('/staff')) {
      return {
        title: 'Staff Management',
        subtitle: 'View and manage your BDE/Sales Executive team allocation and workloads.',
      };
    }
    if (location.pathname.startsWith('/admin/config') || location.pathname.startsWith('/admin/configuration') || location.pathname.startsWith('/configuration')) {
      return {
        title: 'CRM Configuration',
        subtitle: 'Centralized CRM taxonomies, stages, classifications, and commercial parameters.',
      };
    }
    if (location.pathname.startsWith('/admin/integrations') || location.pathname.startsWith('/integrations')) {
      return {
        title: 'Integration Management',
        subtitle: 'Manage third-party integrations, APIs, and webhooks.',
      };
    }
    if (location.pathname.startsWith('/admin/analytics') || location.pathname.startsWith('/analytics')) {
      return {
        title: 'Reports & Analytics',
        subtitle: 'Executive operational telemetry and enterprise analytics.',
      };
    }
    if (location.pathname.startsWith('/admin/notifications') || location.pathname.startsWith('/notifications')) {
      return {
        title: 'Notification Settings',
        subtitle: 'Manage system-wide alerts, push notifications, and emails.',
      };
    }
    if (location.pathname.startsWith('/admin/settings') || location.pathname.startsWith('/settings')) {
      return {
        title: 'Settings',
        subtitle: 'Manage super admin preferences and platform configurations.',
      };
    }
    if (location.pathname.startsWith('/profile')) {
      return {
        title: 'My Profile',
        subtitle: 'View your employee details and update permitted contact information.',
      };
    }
    return null;
  }, [location.pathname]);

  //==================================================================================================================
  //    DETERMINE SCROLLABLE VS FIXED WORKSPACE (STANDARDIZED ACROSS LAYOUTS)
  //==================================================================================================================
  const isScrollablePage = useMemo(() => {
    return (
      location.pathname.includes('/settings') ||
      location.pathname.includes('/profile') ||
      !headerContent
    );
  }, [location.pathname, headerContent]);
  const showPageScrollbar = location.pathname.startsWith('/leads/') || location.pathname.startsWith('/contacts/');

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white-100 p-0 overflow-hidden relative">
        
        {/* ==============================================================================================================
            SUPER ADMIN SIDEBAR COMPONENT
        ============================================================================================================== */}
        <Sidebar role="admin" />
        
        {/* ==============================================================================================================
            MAIN WORKSPACE AREA
        ============================================================================================================== */}
        <div className="flex-1 flex flex-col h-full min-w-0 relative z-20 transition-all duration-300 overflow-hidden select-text bg-white-100">
          
          <TopHeader 
            userRole="Super Admin"
            userName="Johnson Doe"
            onProfileClick={handleProfileClick}
            leftContent={
              headerContent ? (
                <div className="flex flex-col">
                  <h1 className="text-lg sm:text-xl font-bold text-primary leading-tight">
                    {headerContent.title}
                  </h1>
                  <p className="text-xs sm:text-[13px] text-black-90/50 font-medium leading-tight mt-0.5">
                    {headerContent.subtitle}
                  </p>
                </div>
              ) : null
            }
          />
          
          {/* ==============================================================================================================
              DYNAMIC PAGE CONTENT (OUTLET)
          ============================================================================================================== */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-gray rounded-tl-[15px]">
            {headerContent && (
              <MobilePageHeader
                title={headerContent.title}
                subtitle={headerContent.subtitle}
              />
            )}
            <main
              className={`flex-1 flex flex-col min-h-0 bg-gray rounded-tl-[15px] ${
                isScrollablePage
                  ? `overflow-y-auto overflow-x-hidden p-2 sm:p-2.5 md:p-3 ${showPageScrollbar ? 'overscroll-contain' : 'no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'}`
                  : 'overflow-hidden p-2 sm:p-2.5 md:p-3'
              }`}
            >
              <Outlet />
            </main>
          </div>

        </div>
      </div>
    </SidebarProvider>
  );
};

//==================================================================================================================
//    DEFAULT EXPORT
//==================================================================================================================
export default AdminLayout;
