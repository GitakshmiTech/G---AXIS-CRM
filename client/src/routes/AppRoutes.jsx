//==================================================================================================================
//    React & Router Imports
//==================================================================================================================
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//==================================================================================================================
//    Lazy-Loaded Route Components (Code Splitting)
//==================================================================================================================
const BdeLogin = lazy(() => import('../pages/auth/BdeLogin'));
const SalesLogin = lazy(() => import('../pages/auth/SalesLogin'));
const AdminLogin = lazy(() => import('../pages/auth/AdminLogin'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const NewPassword = lazy(() => import('../pages/auth/NewPassword'));
const BdeLayout = lazy(() => import('../layouts/BdeLayout'));
const SalesLayout = lazy(() => import('../layouts/SalesLayout'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/dashboard/AdminDashboard'));
const AdminLeadManagement = lazy(() => import('../pages/admin/leadManagement/LeadManagement'));
const AdminClientManagement = lazy(() => import('../pages/admin/clientManagement/ClientManagement'));
const AdminContactManagement = lazy(() => import('../pages/admin/contactManagement/ContactManagement'));
const AdminDealManagement = lazy(() => import('../pages/admin/dealManagement/DealManagement'));
const AdminQuotations = lazy(() => import('../pages/admin/quotations/Quotations'));
const AdminStaffManagement = lazy(() => import('../pages/admin/staffManagement/StaffManagement'));
const AdminCrmConfiguration = lazy(() => import('../pages/admin/crmConfiguration/CrmConfiguration'));
const SalesDashboard = lazy(() => import('../pages/sales/dashboard/SalesDashboard'));
const MyTeam = lazy(() => import('../pages/sales/myTeam/MyTeam'));
const LeadManagement = lazy(() => import('../pages/sales/leadManagement/LeadManagement'));
const SalesMyClients = lazy(() => import('../pages/sales/myClients/MyClients'));
const SalesMyContacts = lazy(() => import('../pages/sales/myContacts/MyContacts'));
const SalesMyDeals = lazy(() => import('../pages/sales/myDeals/MyDeals'));
const SalesQuotations = lazy(() => import('../pages/sales/quotations/Quotations'));
const ReportAnalytics = lazy(() => import('../pages/sales/analytics/ReportAnalytics'));
const SalesSettings = lazy(() => import('../pages/sales/settings/SalesSettings'));
const SalesEditProfile = lazy(() => import('../pages/sales/settings/SalesEditProfile'));
const BdeDashboard = lazy(() => import('../pages/bde/dashboard/BdeDashboard'));
const MyLeads = lazy(() => import('../pages/bde/myLeads/MyLeads'));
const MyClients = lazy(() => import('../pages/bde/myClients/MyClients'));
const MyContacts = lazy(() => import('../pages/bde/myContacts/MyContacts'));
const MyDeals = lazy(() => import('../pages/bde/myDeals/MyDeals'));
const Quotations = lazy(() => import('../pages/bde/quotations/Quotations'));
const BdeSettings = lazy(() => import('../pages/bde/settings/BdeSettings'));
const EditProfile = lazy(() => import('../pages/bde/settings/EditProfile'));

//==================================================================================================================
//    Route Loading Spinner
//==================================================================================================================
const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-screen w-full bg-white-100">
    <div className="w-10 h-10 border-4 border-stroke border-t-primary rounded-full animate-spin" />
  </div>
);

//==================================================================================================================
//    Application Routes
//==================================================================================================================
export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public BDE Authentication Routes */}
        <Route path="/bde/login" element={<BdeLogin />} />
        <Route path="/bde/forgot-password" element={<ForgotPassword role="bde" />} />
        <Route path="/bde/new-password" element={<NewPassword role="bde" />} />
        <Route path="/bde/reset-password" element={<NewPassword role="bde" />} />

        {/* Public Sales Authentication Routes */}
        <Route path="/sales/login" element={<SalesLogin />} />
        <Route path="/sales/forgot-password" element={<ForgotPassword role="sales" />} />
        <Route path="/sales/new-password" element={<NewPassword role="sales" />} />
        <Route path="/sales/reset-password" element={<NewPassword role="sales" />} />

        {/* Public Super Admin Authentication Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword role="admin" />} />
        <Route path="/admin/new-password" element={<NewPassword role="admin" />} />
        <Route path="/admin/reset-password" element={<NewPassword role="admin" />} />

        {/* Super Admin Direct Aliases */}
        <Route path="/super-admin/login" element={<AdminLogin />} />
        <Route path="/super-admin/forgot-password" element={<ForgotPassword role="admin" />} />
        <Route path="/super-admin/new-password" element={<NewPassword role="admin" />} />
        {/* Protected Super Admin Dashboard & Layout Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeadManagement />} />
          <Route path="clients" element={<AdminClientManagement />} />
          <Route path="contacts" element={<AdminContactManagement />} />
          <Route path="deals" element={<AdminDealManagement />} />
          <Route path="quotations" element={<AdminQuotations />} />
          <Route path="staff" element={<AdminStaffManagement />} />
          <Route path="config" element={<AdminCrmConfiguration />} />
          <Route path="configuration" element={<AdminCrmConfiguration />} />
        </Route>

        {/* Protected Sales Dashboard & Layout Routes */}
        <Route path="/sales" element={<SalesLayout />}>
          <Route path="dashboard" element={<SalesDashboard />} />
          <Route path="team" element={<MyTeam />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="clients" element={<SalesMyClients />} />
          <Route path="contacts" element={<SalesMyContacts />} />
          <Route path="deals" element={<SalesMyDeals />} />
          <Route path="quotations" element={<SalesQuotations />} />
          <Route path="analytics" element={<ReportAnalytics />} />
          <Route path="settings" element={<SalesSettings />} />
          <Route path="profile" element={<SalesEditProfile />} />
        </Route>

        {/* Protected BDE Dashboard & Layout Routes */}
        <Route path="/bde" element={<BdeLayout />}>
          <Route path="dashboard" element={<BdeDashboard />} />
          <Route path="leads" element={<MyLeads />} />
          <Route path="clients" element={<MyClients />} />
          <Route path="contacts" element={<MyContacts />} />
          <Route path="deals" element={<MyDeals />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="settings" element={<BdeSettings />} />
          <Route path="profile" element={<EditProfile />} />
        </Route>

        {/* Direct Navigation & Aliases */}
        <Route path="/" element={<Navigate to="/bde/login" replace />} />
        <Route path="/login" element={<Navigate to="/bde/login" replace />} />
        <Route path="/bde-login" element={<Navigate to="/bde/login" replace />} />
        <Route path="/sales-login" element={<Navigate to="/sales/login" replace />} />
        <Route path="/super-admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/super-admin/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/superadmin-login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/dashboard" element={<Navigate to="/bde/dashboard" replace />} />
        <Route path="/leads" element={<Navigate to="/bde/leads" replace />} />
        <Route path="/clients" element={<Navigate to="/bde/clients" replace />} />
        <Route path="/contacts" element={<Navigate to="/bde/contacts" replace />} />
        <Route path="/deals" element={<Navigate to="/bde/deals" replace />} />
        <Route path="/quotations" element={<Navigate to="/bde/quotations" replace />} />
        <Route path="/settings" element={<Navigate to="/bde/settings" replace />} />
        <Route path="/profile" element={<Navigate to="/bde/profile" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/bde/forgot-password" replace />} />
        <Route path="/new-password" element={<Navigate to="/bde/new-password" replace />} />
        <Route path="/reset-password" element={<Navigate to="/bde/new-password" replace />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/bde/login" replace />} />
      </Routes>
    </Suspense>
  );
};

//==================================================================================================================
//    Default Export
//==================================================================================================================
export default AppRoutes;