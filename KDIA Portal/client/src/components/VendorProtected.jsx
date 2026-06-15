import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VendorProtected = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // 1. Check if user is logged in
    if (!user) {
        return <Navigate to="/vendor/login" replace />;
    }

    // 2. Check if user is a vendor
    if (user.role !== 'vendor') {
        // If logged in as customer/admin, redirect them to their respective home
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }

    // 3. Check approval status
    if (user.approvalStatus !== 'APPROVED') {
        return <Navigate to="/vendor/pending" replace />;
    }

    return children;
};

export default VendorProtected;
