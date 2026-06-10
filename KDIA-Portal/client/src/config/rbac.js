/**
 * Shared RBAC configuration for all KDIA portals.
 * Single source of truth for roles, portal access, permissions, and route guards.
 */

export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    SUPPORT: 'support',
    VENDOR: 'vendor',
    CUSTOMER: 'customer',
};

/** Alias used in some legacy API responses */
export const SUPPORT_ALIASES = ['support', 'support_agent'];

export const DEMO_USERS = [
    {
        email: 'superadmin@kdia.com',
        password: 'Super@123',
        role: ROLES.SUPER_ADMIN,
        fullName: 'Super Admin User',
        id: 1,
    },
    {
        email: 'admin@kdia.com',
        password: 'Admin@123',
        role: ROLES.ADMIN,
        fullName: 'System Admin User',
        id: 2,
    },
    {
        email: 'support@kdia.com',
        password: 'Support@123',
        role: ROLES.SUPPORT,
        fullName: 'Support Representative',
        id: 3,
    },
    {
        email: 'vendor@kdia.com',
        password: 'Vendor@123',
        role: ROLES.VENDOR,
        fullName: 'Vendor Partner',
        id: 4,
        approvalStatus: 'APPROVED',
        approval_status: 'APPROVED',
        consumerId: 'VEND-MOCK-001',
    },
    {
        email: 'customer@kdia.com',
        password: 'Customer@123',
        role: ROLES.CUSTOMER,
        fullName: 'Customer Client',
        id: 5,
        consumerId: 'KDIA-MOCK-001',
        mobileNumber: '+91-9876543210',
        address_line_1: '123 Solar Heights',
        city: 'Clean City',
        state: 'Sustainable State',
        pin_code: '400001',
        location_type: 'Residential',
    },
];

/** Which roles can access each portal prefix */
export const PORTAL_ACCESS = {
    admin: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    super_admin_portal: [ROLES.SUPER_ADMIN],
    support: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SUPPORT, 'support_agent'],
    vendor: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VENDOR],
    customer: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER],
};

/** Fine-grained permissions by role */
export const PERMISSIONS = {
    manage_users: [ROLES.SUPER_ADMIN],
    manage_roles: [ROLES.SUPER_ADMIN],
    manage_rbac_settings: [ROLES.SUPER_ADMIN],
    manage_system_config: [ROLES.SUPER_ADMIN],
    create_super_admin: [ROLES.SUPER_ADMIN],
    manage_customers: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    manage_vendors: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    manage_support_users: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    manage_subscriptions: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    manage_documents: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    view_reports: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    manage_tickets_admin: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    manage_announcements: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    view_customer_vendor_details: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SUPPORT],
    manage_support_tickets: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SUPPORT],
    manage_faq: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SUPPORT],
    view_vendor_dashboard: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VENDOR],
    view_own_vendor_data: [ROLES.VENDOR],
    view_customer_portal: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER],
};

export const ROLE_LABELS = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN]: 'Admin',
    [ROLES.SUPPORT]: 'Support',
    [ROLES.VENDOR]: 'Vendor',
    [ROLES.CUSTOMER]: 'Customer',
};

export function normalizeRole(role) {
    if (role === 'support_agent') return ROLES.SUPPORT;
    return role;
}

export function rolesMatch(userRole, allowedRole) {
    const normalized = normalizeRole(userRole);
    if (allowedRole === ROLES.SUPPORT || allowedRole === 'support_agent') {
        return normalized === ROLES.SUPPORT || userRole === 'support_agent';
    }
    return normalized === allowedRole;
}

export function canAccessPortal(userRole, portal) {
    if (!userRole || !PORTAL_ACCESS[portal]) return false;
    if (userRole === ROLES.SUPER_ADMIN) return true;
    return PORTAL_ACCESS[portal].some((allowed) => rolesMatch(userRole, allowed));
}

export function hasPermission(userRole, permission) {
    if (!userRole) return false;
    if (userRole === ROLES.SUPER_ADMIN) return true;
    const allowed = PERMISSIONS[permission];
    if (!allowed) return false;
    return allowed.some((r) => rolesMatch(userRole, r));
}

export function getPortalFromPath(pathname) {
    if (pathname.startsWith('/super-admin')) return 'super_admin_portal';
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/support/') || pathname === '/support/login') return 'support';
    if (pathname.startsWith('/vendor')) return 'vendor';
    if (pathname.startsWith('/customer')) return 'customer';
    if (['/dashboard', '/profile', '/register'].includes(pathname) || pathname.startsWith('/customer/')) {
        return 'customer';
    }
    if (pathname === '/support') return 'customer';
    return null;
}

export function getLoginPathForPortal(portal) {
    switch (portal) {
        case 'admin':
            return '/admin/login';
        case 'support':
            return '/support/login';
        case 'vendor':
            return '/vendor/login';
        case 'customer':
        default:
            return '/login';
    }
}

export function getLoginRedirect(pathname) {
    const portal = getPortalFromPath(pathname);
    return portal ? getLoginPathForPortal(portal) : '/login';
}

export function getDashboardPath(role) {
    const normalized = normalizeRole(role);
    switch (normalized) {
        case ROLES.SUPER_ADMIN:
            return '/super-admin/dashboard';
        case ROLES.ADMIN:
            return '/admin/dashboard';
        case ROLES.SUPPORT:
            return '/support/dashboard';
        case ROLES.VENDOR:
            return '/vendor/dashboard';
        case ROLES.CUSTOMER:
        default:
            return '/customer/dashboard';
    }
}

export function authenticateDemoUser(loginId, password) {
    const email = (loginId || '').trim().toLowerCase();
    const match = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
    );
    if (!match) {
        return { success: false, error: 'Invalid email or password.' };
    }
    const { password: _pw, ...user } = match;
    const token = `demo-jwt-${user.role}-${Date.now()}`;
    return { success: true, user: { ...user, approvalStatus: user.approvalStatus || 'APPROVED', approval_status: user.approval_status || 'APPROVED', isActive: 1 }, token };
}

export function findDemoUserByRole(role) {
    return DEMO_USERS.find((u) => u.role === role || (role === 'support_agent' && u.role === ROLES.SUPPORT));
}

export function logAdminAction(action, target, role, status = 'Success') {
    try {
        const storedUser = localStorage.getItem('user');
        let performedBy = 'Admin User';
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            performedBy = parsed.email || parsed.fullName || 'Admin User';
        }
        const newLog = {
            id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            action,
            performedBy,
            target,
            role,
            status
        };
        const currentLogs = JSON.parse(localStorage.getItem('kdia_audit_logs') || '[]');
        currentLogs.unshift(newLog);
        localStorage.setItem('kdia_audit_logs', JSON.stringify(currentLogs));
    } catch (e) {
        console.error('Failed to log admin action', e);
    }
}
