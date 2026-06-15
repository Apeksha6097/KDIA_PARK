import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import CustomerProfile from './pages/CustomerProfile';
import Subscription from './pages/Subscription';
import Support from './pages/Support';
import KnowYourProject from './pages/KnowYourProject';
import CustomerLayout from './components/CustomerLayout';

// Admin Pages
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

// Vendor Pages
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
import VendorProtected from './components/VendorProtected';

// Support Pages
import SupportLogin from './pages/support/SupportLogin';
import SupportLayout from './components/SupportLayout';
import SupportDashboard from './pages/support/SupportDashboard';
import SupportTickets from './pages/support/SupportTickets';
import SupportTicketDetail from './pages/support/SupportTicketDetail';

const ProtectedRoute = ({ children }) => {
    const { user, token, loading } = useAuth();

    // DEMO AUTH CHECK - ONLY ENABLED IN DEMO MODE
    if (import.meta.env?.VITE_DEMO_ENABLED === 'true' || localStorage.getItem('kdia_demo_mode') === 'true') {
        const demoAuth = localStorage.getItem('kdia_auth');
        if (demoAuth) {
            try {
                const parsed = JSON.parse(demoAuth);
                if (parsed.authenticated) return children;
            } catch (e) { }
        }
    }

    if (loading) return <div>Loading...</div>;
    if (!token) return <Navigate to="/login" />;

    return children;
};

const AdminRoute = ({ children }) => {
    const { user, token, loading } = useAuth();

    // DEMO AUTH CHECK - ONLY ENABLED IN DEMO MODE
    if (import.meta.env?.VITE_DEMO_ENABLED === 'true' || localStorage.getItem('kdia_demo_mode') === 'true') {
        const demoAuth = localStorage.getItem('kdia_auth');
        if (demoAuth) {
            try {
                const parsed = JSON.parse(demoAuth);
                if (parsed.authenticated && parsed.role === 'admin') return children;
            } catch (e) { }
        }
    }

    if (loading) return <div>Loading...</div>;
    if (!token) return <Navigate to="/admin/login" />;
    if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
    return children;
};

const SupportRoute = ({ children }) => {
    const { user, token, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!token) return <Navigate to="/support/login" />;
    if (user?.role !== 'support_agent' && user?.role !== 'admin') return <Navigate to="/dashboard" />;
    return children;
};

function AppContent() {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/support/login" element={<SupportLogin />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <CustomerLayout>
                        <Dashboard />
                    </CustomerLayout>
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <CustomerLayout>
                        <CustomerProfile />
                    </CustomerLayout>
                </ProtectedRoute>
            } />
            {/* [DEPRECATED] Vendor-Led Allocation Model: Customer selection disabled. Redirecting to Dashboard. */}
            <Route path="/subscription" element={<Navigate to="/dashboard" replace />} />
            <Route path="/support" element={
                <ProtectedRoute>
                    <CustomerLayout>
                        <Support />
                    </CustomerLayout>
                </ProtectedRoute>
            } />
            <Route path="/customer/know-your-project" element={
                <ProtectedRoute>
                    <CustomerLayout>
                        <KnowYourProject />
                    </CustomerLayout>
                </ProtectedRoute>
            } />

            {/* Support Portal Routes */}
            <Route path="/support/dashboard" element={
                <SupportRoute>
                    <SupportLayout>
                        <SupportDashboard />
                    </SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/tickets" element={
                <SupportRoute>
                    <SupportLayout>
                        <SupportTickets mode="all" />
                    </SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/assigned" element={
                <SupportRoute>
                    <SupportLayout>
                        <SupportTickets mode="assigned" />
                    </SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/escalated" element={
                <SupportRoute>
                    <SupportLayout>
                        <SupportTickets mode="escalated" />
                    </SupportLayout>
                </SupportRoute>
            } />
            <Route path="/support/tickets/:id" element={
                <SupportRoute>
                    <SupportLayout>
                        <SupportTicketDetail />
                    </SupportLayout>
                </SupportRoute>
            } />

            {/* Vendor Routes */}
            <Route path="/vendor" element={<Navigate to="/vendor/dashboard" replace />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/register" element={<VendorRegister />} />
            <Route path="/vendor/pending" element={<VendorPending />} />
            <Route path="/vendor/dashboard" element={
                <VendorProtected>
                    <VendorDashboard />
                </VendorProtected>
            } />
            <Route path="/vendor/leads" element={
                <VendorProtected>
                    <VendorLeads />
                </VendorProtected>
            } />
            <Route path="/vendor/onboarding" element={
                <VendorProtected>
                    <VendorOnboarding />
                </VendorProtected>
            } />
            <Route path="/vendor/customers" element={
                <VendorProtected>
                    <VendorCustomers />
                </VendorProtected>
            } />
            <Route path="/vendor/support" element={
                <VendorProtected>
                    <VendorSupportRequests />
                </VendorProtected>
            } />
            <Route path="/vendor/support/:ticketId" element={
                <VendorProtected>
                    <VendorTicketDetail />
                </VendorProtected>
            } />
            <Route path="/vendor/billing" element={
                <VendorProtected>
                    <VendorBilling />
                </VendorProtected>
            } />
            <Route path="/vendor/billing/:invoiceId" element={
                <VendorProtected>
                    <VendorInvoiceDetail />
                </VendorProtected>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminDashboard />
                    </AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/dashboard" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminDashboard />
                    </AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/customers" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminCustomers />
                    </AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/approvals" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminCustomerApprovals />
                    </AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/customers/:id/review" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminCustomerReview />
                    </AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/customers/:id" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminCustomerDetail />
                    </AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/vendors" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminVendors />
                    </AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/vendors/:id" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminVendorDetail />
                    </AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/allocations" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminAllocations />
                    </AdminLayout>
                </AdminRoute>
            } />

            <Route path="/admin/tickets" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminTickets />
                    </AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/tickets/:id" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminTicketDetail />
                    </AdminLayout>
                </AdminRoute>
            } />
            <Route path="/admin/audit" element={
                <AdminRoute>
                    <AdminLayout>
                        <AdminAudit />
                    </AdminLayout>
                </AdminRoute>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
}

// Demo Banner Removed for Visual Cleanliness
// import { DEMO_CONFIG } from './config/demoConfig';

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
