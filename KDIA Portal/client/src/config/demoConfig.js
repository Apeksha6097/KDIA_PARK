// Demo Mode Application Configuration
// Use this file to toggle demo mode and configure mock data

export const DEMO_CONFIG = {
    // Master switch for demo mode
    ENABLED: true,

    // Mock user data for demo authentication
    MOCK_USERS: {
        CUSTOMER: {
            id: 4, // ID matching seeded 'customer@test.com'
            fullName: 'Test Customer',
            email: 'customer@test.com',
            role: 'customer',
            consumerId: 'KDIA-TEST-001',
            isActive: 1,
            approval_status: 'APPROVED',
            location: {
                line1: '123 Solar Heights',
                city: 'Clean City',
                state: 'Sustainable State'
            }
        },
        ADMIN: {
            id: 17, // ID matching seeded 'admin@test.com' (approx)
            fullName: 'Admin User',
            email: 'admin@test.com',
            role: 'admin',
            isActive: 1,
            approval_status: 'APPROVED'
        },
        VENDOR: {
            id: 19, // ID matching seeded 'vendor@test.com' (approx)
            fullName: 'GreenTech Solutions',
            email: 'vendor@test.com',
            role: 'vendor',
            isActive: 1,
            approval_status: 'APPROVED',
            consumerId: 'VEND-TEST-001'
        },
        SUPPORT: {
            id: 21,
            fullName: 'Support Agent Demo',
            email: 'support1@kdia.com',
            role: 'support_agent',
            isActive: 1,
            approval_status: 'APPROVED'
        }
    },

    // Demo token (won't work with backend validation, but enables frontend routing)
    MOCK_TOKEN: 'demo-mock-jwt-token-bypass-validation'
};
