// Demo Mode Application Configuration
// Use this file to toggle demo mode and configure mock data

export const DEMO_CONFIG = {
    // Master switch for demo mode
    ENABLED: true,

    // Mock user data for demo authentication
    MOCK_USERS: {
        SUPER_ADMIN: {
            id: 1,
            fullName: 'Super Admin User',
            email: 'superadmin@kdia.com',
            role: 'super_admin',
            isActive: 1,
            approval_status: 'APPROVED'
        },
        ADMIN: {
            id: 2,
            fullName: 'System Admin User',
            email: 'admin@kdia.com',
            role: 'admin',
            isActive: 1,
            approval_status: 'APPROVED'
        },
        SUPPORT: {
            id: 3,
            fullName: 'Support Representative',
            email: 'support@kdia.com',
            role: 'support',
            isActive: 1,
            approval_status: 'APPROVED'
        },
        VENDOR: {
            id: 4,
            fullName: 'Vendor Partner',
            email: 'vendor@kdia.com',
            role: 'vendor',
            isActive: 1,
            approval_status: 'APPROVED',
            consumerId: 'VEND-MOCK-001'
        },
        CUSTOMER: {
            id: 5,
            fullName: 'Customer Client',
            email: 'customer@kdia.com',
            role: 'customer',
            consumerId: 'KDIA-MOCK-001',
            isActive: 1,
            approval_status: 'APPROVED',
            location: {
                line1: '123 Solar Heights',
                city: 'Clean City',
                state: 'Sustainable State'
            }
        }
    },

    // Demo token (won't work with backend validation, but enables frontend routing)
    MOCK_TOKEN: 'demo-mock-jwt-token-bypass-validation'
};
