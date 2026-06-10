import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import { AuthProvider } from './context/AuthContext';
import Register from './pages/customer/Register';
import Login from './pages/customer/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/customer/Dashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import Support from './pages/customer/Support';
import KnowYourProject from './pages/customer/KnowYourProject';
import CustomerLayout from './components/CustomerLayout';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminVendorDetail from './pages/admin/AdminVendorDetail';
import AdminCustomerDetail from './pages/admin/AdminCustomerDetail';
import AdminAllocations from './pages/admin/AdminAllocations';
import AdminAudit from './pages/admin/AdminAudit';
import AdminTickets from './pages/admin/AdminTickets';
import AdminTicketDetail from './pages/admin/AdminTicketDetail';
import AdminCustomerApprovals from './pages/admin/AdminCustomerApprovals';
import AdminCustomerReview from './pages/admin/AdminCustomerReview';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSupportUsers from './pages/admin/AdminSupportUsers';
import AdminReports from './pages/admin/AdminReports';

import VendorLogin from './pages/vendor/VendorLogin';
import VendorRegister from './pages/vendor/VendorRegister';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorLeads from './pages/vendor/VendorLeads';
import VendorOnboarding from './pages/vendor/VendorOnboarding';
import VendorCustomers from './pages/vendor/VendorCustomers';
import VendorPending from './pages/vendor/VendorPending';
import VendorSupportRequests from './pages/vendor/VendorSupportRequests';
import VendorTicketDetail from './pages/vendor/VendorTicketDetail';
import VendorBilling from './pages/vendor/VendorBilling';
import VendorInvoiceDetail from './pages/vendor/VendorInvoiceDetail';
import VendorProfile from './pages/vendor/VendorProfile';
import VendorDocuments from './pages/vendor/VendorDocuments';
import VendorProtected from './components/VendorProtected';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import AccessDenied from './pages/AccessDenied';

import SupportLogin from './pages/support/SupportLogin';
import SupportLayout from './components/SupportLayout';
import SupportDashboard from './pages/support/SupportDashboard';
import SupportTickets from './pages/support/SupportTickets';
import SupportTicketDetail from './pages/support/SupportTicketDetail';
import SupportCustomerIssues from './pages/support/SupportCustomerIssues';
import SupportVendorIssues from './pages/support/SupportVendorIssues';
import SupportFaq from './pages/support/SupportFaq';
import SupportProfile from './pages/support/SupportProfile';
import SupportHelpCenter from './pages/support/SupportHelpCenter';

import SuperAdminLayout from './components/SuperAdminLayout';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import SuperAdminAdmins from './pages/admin/SuperAdminAdmins';
import SuperAdminRoles from './pages/admin/SuperAdminRoles';
import SuperAdminPermissions from './pages/admin/SuperAdminPermissions';
import SuperAdminCustomers from './pages/admin/SuperAdminCustomers';
import SuperAdminVendors from './pages/admin/SuperAdminVendors';
import SuperAdminSupportUsers from './pages/admin/SuperAdminSupportUsers';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminAuditLogs from './pages/admin/SuperAdminAuditLogs';

const AdminRoute = ({ children, requiredPermission }) => (
    <RoleProtectedRoute portal="admin" allowedRoles={['admin']} requiredPermission={requiredPermission}>
        {children}
    </RoleProtectedRoute>
);

/** Only super_admin can access these routes */
const SuperAdminRoute = ({ children }) => (
    <RoleProtectedRoute portal="super_admin_portal" allowedRoles={['super_admin']}>
        {children}
    </RoleProtectedRoute>
);

const SupportRoute = ({ children }) => (
    <RoleProtectedRoute portal="support" allowedRoles={['support', 'support_agent']}>
        {children}
    </RoleProtectedRoute>
);

const CustomerRoute = ({ children }) => (
    <RoleProtectedRoute portal="customer" allowedRoles={['customer']}>
        {children}
    </RoleProtectedRoute>
);

function AppContent() {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/support/login" element={<SupportLogin />} />

            {/* Customer portal — legacy paths redirect to prefixed paths */}
            <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="/profile" element={<Navigate to="/customer/profile" replace />} />
            <Route path="/subscription" element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="/support" element={<Navigate to="/customer/support" replace />} />

            {/* Customer portal — /customer/* paths */}
            <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="/customer/dashboard" element={
                <CustomerRoute>
                    <CustomerLayout><Dashboard /></CustomerLayout>
                </CustomerRoute>
            } />
            <Route path="/customer/profile" element={
                <CustomerRoute>
                    <CustomerLayout><CustomerProfile /></CustomerLayout>
                </CustomerRoute>
            } />
            <Route path="/customer/support" element={
                <CustomerRoute>
                    <CustomerLayout><Support /></CustomerLayout>
                </CustomerRoute>
            } />
            <Route path="/customer/know-your-project" element={
                <CustomerRoute>
                    <CustomerLayout><KnowYourProject /></CustomerLayout>
                </CustomerRoute>
            } />

            {/* Support portal */}
            <Route path="/support/dashboard" element={
                <SupportRoute>
                    <SupportLayout><SupportDashboard /></SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/tickets" element={
                <SupportRoute>
                    <SupportLayout><SupportTickets mode="all" /></SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/assigned" element={
                <SupportRoute>
                    <SupportLayout><SupportTickets mode="assigned" /></SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/escalated" element={
                <SupportRoute>
                    <SupportLayout><SupportTickets mode="escalated" /></SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/tickets/:id" element={
                <SupportRoute>
                    <SupportLayout><SupportTicketDetail /></SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/customer-issues" element={
                <SupportRoute>
                    <SupportLayout><SupportCustomerIssues /></SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/vendor-issues" element={
                <SupportRoute>
                    <SupportLayout><SupportVendorIssues /></SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/faq" element={<Navigate to="/support/faq-management" replace />} />
            <Route path="/support/faq-management" element={
                <SupportRoute>
                    <SupportLayout><SupportFaq /></SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/help-center" element={
                <SupportRoute>
                    <SupportLayout><SupportHelpCenter /></SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/profile" element={
                <SupportRoute>
                    <SupportLayout><SupportProfile /></SupportLayout>
                </SupportRoute>
            } />

            {/* Vendor portal */}
            <Route path="/vendor" element={<Navigate to="/vendor/dashboard" replace />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/register" element={<VendorRegister />} />
            <Route path="/vendor/pending" element={<VendorPending />} />
            <Route path="/vendor/dashboard" element={<VendorProtected><VendorDashboard /></VendorProtected>} />
            <Route path="/vendor/leads" element={<VendorProtected><VendorLeads /></VendorProtected>} />
            <Route path="/vendor/onboarding" element={<VendorProtected><VendorOnboarding /></VendorProtected>} />
            <Route path="/vendor/customers" element={<VendorProtected><VendorCustomers /></VendorProtected>} />
            <Route path="/vendor/support" element={<VendorProtected><VendorSupportRequests /></VendorProtected>} />
            <Route path="/vendor/support/:ticketId" element={<VendorProtected><VendorTicketDetail /></VendorProtected>} />
            <Route path="/vendor/billing" element={<VendorProtected><VendorBilling /></VendorProtected>} />
            <Route path="/vendor/billing/:invoiceId" element={<VendorProtected><VendorInvoiceDetail /></VendorProtected>} />
            <Route path="/vendor/documents" element={<VendorProtected><VendorDocuments /></VendorProtected>} />
            <Route path="/vendor/profile" element={<VendorProtected><VendorProfile /></VendorProtected>} />

            {/* Admin portal */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={
                <AdminRoute>
                    <AdminLayout><AdminDashboard /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/customers" element={
                <AdminRoute>
                    <AdminLayout><AdminCustomers /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/approvals" element={
                <AdminRoute>
                    <AdminLayout><AdminCustomerApprovals /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/customers/:id/review" element={
                <AdminRoute>
                    <AdminLayout><AdminCustomerReview /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/customers/:id" element={
                <AdminRoute>
                    <AdminLayout><AdminCustomerDetail /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/vendors" element={
                <AdminRoute>
                    <AdminLayout><AdminVendors /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/vendors/:id" element={
                <AdminRoute>
                    <AdminLayout><AdminVendorDetail /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/allocations" element={
                <AdminRoute>
                    <AdminLayout><AdminAllocations /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/tickets" element={
                <AdminRoute>
                    <AdminLayout><AdminTickets /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/tickets/:id" element={
                <AdminRoute>
                    <AdminLayout><AdminTicketDetail /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/audit" element={
                <AdminRoute>
                    <AdminLayout><AdminAudit /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/settings" element={
                <AdminRoute>
                    <AdminLayout><AdminSettings /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/support-users" element={
                <AdminRoute>
                    <AdminLayout><AdminSupportUsers /></AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/subscriptions" element={<Navigate to="/admin/allocations" replace />} />

            {/* Super Admin exclusive routes */}
            <Route path="/super-admin/login" element={<SuperAdminLogin />} />
            <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
            <Route path="/super-admin/dashboard" element={
                <SuperAdminRoute>
                    <SuperAdminDashboard />
                </SuperAdminRoute>
            } />
            <Route path="/super-admin/admins" element={
                <SuperAdminRoute>
                    <SuperAdminAdmins />
                </SuperAdminRoute>
            } />
            <Route path="/super-admin/roles" element={
                <SuperAdminRoute>
                    <SuperAdminRoles />
                </SuperAdminRoute>
            } />
            <Route path="/super-admin/permissions" element={
                <SuperAdminRoute>
                    <SuperAdminPermissions />
                </SuperAdminRoute>
            } />
            <Route path="/super-admin/customers" element={
                <SuperAdminRoute>
                    <SuperAdminCustomers />
                </SuperAdminRoute>
            } />
            <Route path="/super-admin/vendors" element={
                <SuperAdminRoute>
                    <SuperAdminVendors />
                </SuperAdminRoute>
            } />
            <Route path="/super-admin/support-users" element={
                <SuperAdminRoute>
                    <SuperAdminSupportUsers />
                </SuperAdminRoute>
            } />
            <Route path="/super-admin/reports" element={
                <SuperAdminRoute>
                    <SuperAdminLayout><AdminReports /></SuperAdminLayout>
                </SuperAdminRoute>
            } />
            <Route path="/super-admin/settings" element={
                <SuperAdminRoute>
                    <SuperAdminLayout><AdminSettings /></SuperAdminLayout>
                </SuperAdminRoute>
            } />
            <Route path="/super-admin/audit-logs" element={
                <SuperAdminRoute>
                    <SuperAdminAuditLogs />
                </SuperAdminRoute>
            } />

            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Sentry.ErrorBoundary fallback={<div>An unexpected error has occurred.</div>}>
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </Sentry.ErrorBoundary>
    );
}

export default App;
