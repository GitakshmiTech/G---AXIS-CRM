//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, layout routing outlets, context provider, sidebar and common header component.
//==================================================================================================================
import React, { useMemo, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar } from '../components/common/Sidebar';
import { TopHeader } from '../components/common/TopHeader';
import { MobilePageHeader } from '../components/common/MobilePageHeader';

//==================================================================================================================
//    SALES LAYOUT COMPONENT
//    Shell featuring the Sales-specific sidebar, common top header with dynamic title/subtitle, and page outlet.
//==================================================================================================================
export const SalesLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileClick = useCallback(() => {
    navigate('/sales/profile');
  }, [navigate]);

  //==================================================================================================================
  //    DYNAMIC TOP HEADER CONTENT (Identical pattern to BdeLayout)
  //    Displays Page Title & Subtitle inside TopHeader matching 1st & 3rd images
  //==================================================================================================================
  const headerContent = useMemo(() => {
    if (location.pathname.startsWith('/sales/team')) {
      return {
        title: 'My Team',
        subtitle: 'View and manage your BDE/Sales Executive team allocation and workloads.',
      };
    }
    if (location.pathname.startsWith('/sales/leads')) {
      return {
        title: 'Lead Management',
        subtitle: 'Manage, qualify, and track high-value enterprise leads.',
      };
    }
    if (location.pathname.startsWith('/sales/clients')) {
      return {
        title: 'My Clients',
        subtitle: 'Enterprise accounts linked to your converted leads, active stakeholder contacts, and opportunity deals. Direct modifications...',
      };
    }
    if (location.pathname.startsWith('/sales/contacts')) {
      return {
        title: 'My Contacts',
        subtitle: 'Stakeholder contacts linked to your converted accounts and active deals across assigned enterprise accounts.',
      };
    }
    if (location.pathname.startsWith('/sales/deals')) {
      return {
        title: 'My Deals',
        subtitle:
          'Manage sales opportunities, pipeline stages, AI-driven forecast probabilities, and deal contract milestones across your assigned...',
      };
    }
    if (location.pathname.startsWith('/sales/quotations')) {
      return {
        title: 'Quotations',
        subtitle:
          'Track quotation status, manage active commercial proposals, and audit lifecycle progression on related deal timelines.',
      };
    }
    if (location.pathname.startsWith('/sales/analytics') || location.pathname.startsWith('/sales/reports')) {
      return {
        title: 'Report & Analytics',
        subtitle: 'In-depth team operational telemetry, pipeline conversion dynamics, and lead attribution analysis.',
      };
    }
    if (location.pathname.startsWith('/sales/settings')) {
      return {
        title: 'Settings',
        subtitle: 'Manage your personal account settings, security, and preferences',
      };
    }
    if (location.pathname.startsWith('/sales/profile')) {
      return {
        title: 'Edit Profile',
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

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray p-0 sm:p-2 lg:p-4 overflow-hidden relative gap-2 sm:gap-3 lg:gap-4 select-none">
        
        {/* ==============================================================================================================
            SALES SIDEBAR COMPONENT
        ============================================================================================================== */}
        <Sidebar role="sales" />
        
        {/* ==============================================================================================================
            MAIN WORKSPACE AREA
        ============================================================================================================== */}
        <div className="flex-1 flex flex-col h-full min-w-0 relative z-20 gap-3 sm:gap-3.5 transition-all duration-300 overflow-hidden select-text">
          
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
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {headerContent && (
              <MobilePageHeader
                title={headerContent.title}
                subtitle={headerContent.subtitle}
              />
            )}
            <main
              className={`flex-1 flex flex-col min-h-0 ${
                isScrollablePage
                  ? 'overflow-y-auto overflow-x-hidden px-3 sm:px-0 pb-3 sm:pb-0 pt-1 sm:pt-0 no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                  : 'overflow-hidden px-3 sm:px-0 pb-3 sm:pb-0 pt-1 sm:pt-0'
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
