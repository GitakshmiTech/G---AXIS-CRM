//==================================================================================================================
//    SIDEBAR CONTEXT & HOOKS
//    Manages responsive expanded and collapsed state across desktop and mobile viewports
//==================================================================================================================
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

export const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = useCallback(() => setIsCollapsed((prev) => !prev), []);
  const toggleSidebar = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);
  const openMobile = useCallback(() => setIsMobileOpen(true), []);

  const value = useMemo(() => ({
    isCollapsed,
    isMobileOpen,
    setIsCollapsed,
    setIsMobileOpen,
    toggleCollapse,
    toggleSidebar,
    closeMobile,
    openMobile,
  }), [isCollapsed, isMobileOpen, toggleCollapse, toggleSidebar, closeMobile, openMobile]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default SidebarContext;
