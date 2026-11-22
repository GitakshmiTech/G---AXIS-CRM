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
//    SALES LAYOUT COMPONENT
//    Shell featuring the Sales-specific sidebar, common top header with dynamic title/subtitle, and page outlet.
//==================================================================================================================
export const SalesLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  //==================================================================================================================
  //    DYNAMIC TOP HEADER CONTENT (Identical pattern to BdeLayout)
  //    Displays Page Title & Subtitle inside TopHeader matching 1st & 3rd images
  //==================================================================================================================
  const headerContent = useMemo(() => {
    if (location.pathname.startsWith('/sales/team') || location.pathname.startsWith('/team')) {
      return {
        title: 'My Team',
        subtitle: 'View and manage your BDE/Sales Executive team allocation and workloads.',
      };
    }
    if (location.pathname.startsWith('/sales/leads') || location.pathname.startsWith('/leads')) {
      return {
        title: 'Lead Management',
        subtitle: 'Manage, qualify, and track high-value enterprise leads.',
      };
    }
    if (location.pathname.startsWith('/sales/clients') || location.pathname.startsWith('/clients')) {
      return {
        title: 'My Accounts',
        subtitle: 'Manage accounts from successful lead conversions, including linked contacts, account ownership, and related deals.',
      };
    }
    if (location.pathname.startsWith('/sales/contacts') || location.pathname.startsWith('/contacts')) {
      return {
        title: 'My Contacts',
        subtitle: 'Stakeholder contacts linked to your converted accounts and active deals across assigned enterprise accounts.',
      };
    }
    if (location.pathname.startsWith('/sales/deals') || location.pathname.startsWith('/deals')) {
      return {
        title: 'My Deals',
        subtitle:
          'Manage sales opportunities, pipeline stages, AI-driven forecast probabilities, and deal contract milestones across your assigned...',
      };
    }
    if (location.pathname.startsWith('/sales/quotations') || location.pathname.startsWith('/quotations')) {
      return {
        title: 'Quotations',
        subtitle:
          'Track quotation status, manage active commercial proposals, and audit lifecycle progression on related deal timelines.',
      };
    }
    if (location.pathname.startsWith('/sales/analytics') || location.pathname.startsWith('/sales/reports') || location.pathname.startsWith('/analytics')) {
      return {
        title: 'Report & Analytics',
        subtitle: 'In-depth team operational telemetry, pipeline conversion dynamics, and lead attribution analysis.',
      };
    }
    if (location.pathname.startsWith('/sales/settings') || location.pathname.startsWith('/settings')) {
      return {
        title: 'Settings',
        subtitle: 'Manage your personal account settings, security, and preferences',
      };
    }
    if (location.pathname.startsWith('/sales/profile') || location.pathname.startsWith('/profile')) {
      return {
        title: 'My Profile',
        subtitle: 'Manage your personal account settings, security, and preferences',
      };
    }
    return null;
  }, [location.pathname]);

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
            SALES SIDEBAR COMPONENT
        ============================================================================================================== */}
        <Sidebar role="sales" />
        
        {/* ==============================================================================================================
            MAIN WORKSPACE AREA
        ============================================================================================================== */}
        <div className="flex-1 flex flex-col h-full min-w-0 relative z-20 transition-all duration-300 overflow-hidden select-text bg-white-100">
          
          <TopHeader 
            userRole="Sales Manager"
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
export default SalesLayout;
