//===========================================================================================
//    React, Redux & Router Imports
//===========================================================================================
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { USER_ROLES } from '../constants/authConstants';

//===========================================================================================
//    Lazy-Loaded Shell Layouts
//===========================================================================================
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const SalesLayout = lazy(() => import('../layouts/SalesLayout'));
const BdeLayout = lazy(() => import('../layouts/BdeLayout'));

//===========================================================================================
//    Lazy-Loaded Unified Authentication & Direct Page Components (100% Flat in pages/)
//===========================================================================================
const Login = lazy(() => import('../pages/Login'));

// Unified Domain Pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const LeadForm = lazy(() => import('../pages/LeadForm'));
const LeadConversion = lazy(() => import('../pages/LeadConversion'));
const Clients = lazy(() => import('../pages/Clients'));
const ClientForm = lazy(() => import('../pages/ClientForm'));
const Contacts = lazy(() => import('../pages/Contacts'));
const ContactForm = lazy(() => import('../pages/ContactForm'));
const Deals = lazy(() => import('../pages/Deals'));
const DealForm = lazy(() => import('../pages/DealForm'));
const Quotations = lazy(() => import('../pages/Quotations'));
const QuotationForm = lazy(() => import('../pages/QuotationForm'));
const Settings = lazy(() => import('../pages/Settings'));
const EditProfile = lazy(() => import('../pages/EditProfile'));

// Role-Exclusive Pages
const StaffManagement = lazy(() => import('../pages/StaffManagement'));
const CrmConfiguration = lazy(() => import('../pages/CrmConfiguration'));
const Integrations = lazy(() => import('../pages/Integrations'));
const Notifications = lazy(() => import('../pages/Notifications'));
const MyTeam = lazy(() => import('../pages/MyTeam'));
const ReportAnalytics = lazy(() => import('../pages/ReportAnalytics'));

//===========================================================================================
//    Spinners & Fallback Loaders
//===========================================================================================
const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-screen w-full bg-white-100">
    <div className="w-10 h-10 border-4 border-stroke border-t-primary rounded-full animate-spin" />
  </div>
);

const ViewLoader = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <div className="w-8 h-8 border-4 border-stroke border-t-primary rounded-full animate-spin" />
  </div>
);

//===========================================================================================
//    PROTECTED ROUTE GUARD COMPONENT
//===========================================================================================
export const ProtectedRoute = ({ allowedRoles = null }) => {
  const location = useLocation();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // If not authenticated, redirect to unified login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is specified, ensure user has appropriate clearance
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

//===========================================================================================
//    DYNAMIC ROLE-BASED LAYOUT SHELL RESOLVER
//===========================================================================================
export const DynamicLayout = () => {
  const role = useSelector((state) => state.auth?.role);

  return (
    <Suspense fallback={<ViewLoader />}>
      {role === USER_ROLES.ADMIN && <AdminLayout />}
      {role === USER_ROLES.SALES && <SalesLayout />}
      {role !== USER_ROLES.ADMIN && role !== USER_ROLES.SALES && <BdeLayout />}
    </Suspense>
  );
};

//===========================================================================================
//    APPLICATION ROUTES COMPONENT (100% CLEAN URLS & UNIFIED ROUTER)
//===========================================================================================
export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* ============================================================================================================
            1. Unified Single Authentication Routes (All routed to Login)
        ============================================================================================================ */}
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/forgot-password" element={<Login mode="forgot" />} />
        <Route path="/new-password" element={<Login mode="new-password" />} />
        <Route path="/reset-password" element={<Login mode="new-password" />} />

        {/* ============================================================================================================
            2. Protected Main Application Routes (100% Clean URLs - No Role Prefixes)
        ============================================================================================================ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DynamicLayout />}>
            {/* Index / Root redirects to /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Common Unified Clean Routes (Role-aware conditional rendering) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/new" element={<LeadForm />} />
            <Route path="/leads/:id/edit" element={<LeadForm />} />
            <Route path="/leads/:id/view" element={<LeadForm />} />
            <Route path="/leads/:id/convert" element={<LeadConversion />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id/view" element={<ClientForm />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id/view" element={<ContactForm />} />
            <Route path="/contacts/:id/edit" element={<ContactForm />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:id/view" element={<DealForm />} />
            <Route path="/deals/:id/edit" element={<DealForm />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/quotations/new" element={<QuotationForm mode="create" />} />
            <Route path="/quotations/:id/view" element={<QuotationForm mode="view" />} />
            <Route path="/quotations/:id/edit" element={<QuotationForm mode="edit" />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<EditProfile />} />

            {/* Admin-Exclusive Clean Routes */}
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/configuration" element={<CrmConfiguration />} />
            <Route path="/config" element={<Navigate to="/configuration" replace />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Sales-Exclusive Clean Routes */}
            <Route path="/team" element={<MyTeam />} />
            <Route path="/analytics" element={<ReportAnalytics />} />
            <Route path="/reports" element={<Navigate to="/analytics" replace />} />
          </Route>
        </Route>

        {/* ============================================================================================================
            3. Backward-Compatibility Redirects (Legacy Role URLs redirect to Clean URLs)
        ============================================================================================================ */}
        {/* Legacy Login Redirects */}
        <Route path="/bde/login" element={<Navigate to="/login" replace />} />
        <Route path="/sales/login" element={<Navigate to="/login" replace />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/super-admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/bde-login" element={<Navigate to="/login" replace />} />
        <Route path="/sales-login" element={<Navigate to="/login" replace />} />
        <Route path="/admin-login" element={<Navigate to="/login" replace />} />
        <Route path="/superadmin-login" element={<Navigate to="/login" replace />} />

        {/* Legacy Dashboard & Module Redirects */}
        <Route path="/bde" element={<Navigate to="/dashboard" replace />} />
        <Route path="/bde/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/bde/leads" element={<Navigate to="/leads" replace />} />
        <Route path="/bde/clients" element={<Navigate to="/clients" replace />} />
        <Route path="/bde/contacts" element={<Navigate to="/contacts" replace />} />
        <Route path="/bde/deals" element={<Navigate to="/deals" replace />} />
        <Route path="/bde/quotations" element={<Navigate to="/quotations" replace />} />
        <Route path="/bde/settings" element={<Navigate to="/settings" replace />} />
        <Route path="/bde/profile" element={<Navigate to="/profile" replace />} />
        <Route path="/bde/forgot-password" element={<Navigate to="/forgot-password" replace />} />
        <Route path="/bde/new-password" element={<Navigate to="/new-password" replace />} />

        <Route path="/sales" element={<Navigate to="/dashboard" replace />} />
        <Route path="/sales/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/sales/team" element={<Navigate to="/team" replace />} />
        <Route path="/sales/leads" element={<Navigate to="/leads" replace />} />
        <Route path="/sales/clients" element={<Navigate to="/clients" replace />} />
        <Route path="/sales/contacts" element={<Navigate to="/contacts" replace />} />
        <Route path="/sales/deals" element={<Navigate to="/deals" replace />} />
        <Route path="/sales/quotations" element={<Navigate to="/quotations" replace />} />
        <Route path="/sales/settings" element={<Navigate to="/settings" replace />} />
        <Route path="/sales/profile" element={<Navigate to="/profile" replace />} />
        <Route path="/sales/forgot-password" element={<Navigate to="/forgot-password" replace />} />
        <Route path="/sales/new-password" element={<Navigate to="/new-password" replace />} />

        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin/leads" element={<Navigate to="/leads" replace />} />
        <Route path="/admin/clients" element={<Navigate to="/clients" replace />} />
        <Route path="/admin/contacts" element={<Navigate to="/contacts" replace />} />
        <Route path="/admin/deals" element={<Navigate to="/deals" replace />} />
        <Route path="/admin/quotations" element={<Navigate to="/quotations" replace />} />
        <Route path="/admin/staff" element={<Navigate to="/staff" replace />} />
        <Route path="/admin/configuration" element={<Navigate to="/configuration" replace />} />
        <Route path="/admin/settings" element={<Navigate to="/settings" replace />} />
        <Route path="/admin/profile" element={<Navigate to="/profile" replace />} />
        <Route path="/admin/forgot-password" element={<Navigate to="/forgot-password" replace />} />
        <Route path="/admin/new-password" element={<Navigate to="/new-password" replace />} />

        {/* Global Catch-All: Redirect any unknown path to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
