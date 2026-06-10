import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    ROLES,
    canAccessPortal,
    getLoginRedirect,
    getPortalFromPath,
    hasPermission,
    rolesMatch,
} from '../config/rbac';

/**
 * Requires authentication and an allowed role for the target portal or explicit allowedRoles list.
 */
const RoleProtectedRoute = ({ children, allowedRoles, portal, requiredPermission }) => {
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

    if (user.role === ROLES.SUPER_ADMIN) {
        return children;
    }

    if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
        return <Navigate to="/access-denied" replace />;
    }

    const targetPortal = portal || getPortalFromPath(location.pathname);
    if (targetPortal && !canAccessPortal(user.role, targetPortal)) {
        return <Navigate to="/access-denied" replace />;
    }

    if (allowedRoles?.length) {
        const isAllowed = allowedRoles.some((role) => rolesMatch(user.role, role));
        if (!isAllowed) {
            return <Navigate to="/access-denied" replace />;
        }
    }

    if (user.role === ROLES.VENDOR) {
        const isApproved =
            user.approvalStatus === 'APPROVED' || user.approval_status === 'APPROVED';
        if (!isApproved && !location.pathname.startsWith('/vendor/pending')) {
            return <Navigate to="/vendor/pending" replace />;
        }
    }

    return children;
};

export default RoleProtectedRoute;
