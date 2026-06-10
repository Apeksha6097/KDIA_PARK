import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLoginRedirect } from '../config/rbac';

/**
 * Requires an authenticated session. Redirects to the portal-appropriate login page.
 */
const ProtectedRoute = ({ children }) => {
    const { user, token, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
            </div>
        );
    }

    if (!token || !user) {
        return <Navigate to={getLoginRedirect(location.pathname)} state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
