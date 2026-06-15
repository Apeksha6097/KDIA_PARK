import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || '/api'
});

import { DEMO_CONFIG } from '../config/demoConfig';

// Add a request interceptor to include the auth token if available
api.interceptors.request.use(
    (config) => {
        // Log the outgoing request for debugging
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        
        // DEMO MODE: Mock Login Request
        if (DEMO_CONFIG.ENABLED && config.url === '/auth/login' && config.method === 'post') {
            return config;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor for Demo Mode Mocking
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Only intervene if Demo Mode is enabled
        if (DEMO_CONFIG.ENABLED) {
            const { config } = error;

            // MOCK LOGIN: Handle 403/404/500 on Login
            if (config && config.url === '/auth/login' && config.method === 'post') {
                console.log('🚧 API: Intercepting Login Failure for Demo Mode');

                let mockUser = DEMO_CONFIG.MOCK_USERS.CUSTOMER; // Default fallback

                try {
                    // Safe check if data is string (axios default) or object
                    const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
                    const email = (data?.loginId || '').toLowerCase();

                    // Simple logic to select role based on input or previously known emails
                    if (email.includes('admin')) {
                        mockUser = DEMO_CONFIG.MOCK_USERS.ADMIN;
                    } else if (email.includes('vendor')) {
                        mockUser = DEMO_CONFIG.MOCK_USERS.VENDOR;
                    } else if (email.includes('support')) {
                        mockUser = DEMO_CONFIG.MOCK_USERS.SUPPORT;
                    } else if (email === 'demo@kdia.com') {
                        mockUser = {
                            id: 1001,
                            fullName: 'Demo Customer',
                            email: 'demo@kdia.com',
                            role: 'customer',
                            consumerId: 'KDIA-DEMO-01',
                            isActive: 1,
                            approval_status: 'APPROVED'
                        };
                    }
                    // else stay default
                } catch (e) {
                    console.warn('🚧 API: Failed to parse login data, using default mock user', e);
                }

                // Return a successful mock response
                return {
                    data: {
                        success: true,
                        message: 'Demo Login Successful',
                        user: mockUser,
                        token: DEMO_CONFIG.MOCK_TOKEN
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config
                };
            }

            // MOCK DATA FETCHING: Intercept ALL errors for Dashboard content in demo mode
            // This catches 401, 403, 404, 500, and network errors
            if (config && config.method === 'get') {
                console.log('🚧 API: Intercepting error for Demo Mode (returning mock data)', config.url, error.message);

                // CUSTOMER DASHBOARD MOCKS
                if (config.url.includes('/dashboard/summary')) {
                    return {
                        data: {
                            allocationName: 'Solar Premium Tier 1',
                            totalSubscribed: 450,
                            allocationStatus: 'ACTIVE',
                            totalConsumed: 120
                        },
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config
                    };
                }

                // CUSTOMER PROJECT DETAILS MOCK
                if (config.url.includes('/customer/project-details')) {
                    // Logic to return correct park data based on user (For demo, returning Jodhpur's Solar Park Alpha)
                    return {
                        data: {
                            customer: {
                                discom: 'Jodhpur',
                                locationType: 'Park',
                                locationName: 'Solar Park Alpha',
                                allocatedCapacity: 1000,
                                allocationDate: '2025-01-15',
                                status: 'Active'
                            },
                            project: {
                                totalCapacity: 17000,
                                executedCapacity: 11500,
                                underExecutionCapacity: 2700,
                                balanceCapacity: 2800,
                                address: 'Phalodi Solar Zone, Jodhpur, Rajasthan',
                                commissioningStatus: 'Under Execution',
                                expectedCommissioningDate: '2025-12-31',
                                solarTechnology: 'Monocrystalline Perc',
                                discomZone: 'Jodhpur Zone 1'
                            },
                            documents: [
                                { name: 'PPA Document', type: 'PDF', url: '#' },
                                { name: 'Allocation Letter', type: 'PDF', url: '#' },
                                { name: 'Project Brochure', type: 'PDF', url: '#' }
                            ]
                        },
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config
                    };
                }

                // ADMIN DASHBOARD MOCKS
                if (config.url.includes('/admin/stats')) {
                    return {
                        data: {
                            totalCustomers: 124,
                            activeCustomers: 98,
                            totalAllocatedEnergy: 45000
                        },
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config
                    };
                }
                if (config.url.includes('/admin/alerts')) {
                    return { data: [], status: 200, headers: {}, config };
                }
                if (config.url.includes('/admin/audit-logs')) {
                    return {
                        data: [
                            {
                                id: 1,
                                actionType: 'CUSTOMER_APPROVED',
                                adminName: 'Admin User',
                                targetId: 'CUST-103',
                                details: 'Manual approval of customer application',
                                timestamp: new Date().toISOString()
                            },
                            {
                                id: 2,
                                actionType: 'ALLOCATION_ASSIGNED',
                                adminName: 'System',
                                targetId: 'ALL-055',
                                details: JSON.stringify({ energy: 450, tier: 'Premium' }),
                                timestamp: new Date(Date.now() - 86400000).toISOString()
                            },
                            {
                                id: 3,
                                actionType: 'LOGIN',
                                adminName: 'Admin User',
                                targetId: 'SYS',
                                details: 'System Login',
                                timestamp: new Date().toISOString()
                            }
                        ],
                        status: 200,
                        headers: {},
                        config
                    };
                }

                // VENDOR DASHBOARD MOCKS
                if (config.url.includes('/vendor-customers/stats')) {
                    return {
                        data: {
                            assignedLeads: 45,
                            customersOnboarded: 12,
                            pendingActions: 5,
                            pendingCustomers: 8
                        },
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config
                    };
                }

                // VENDOR CUSTOMERS LIST (Onboarded by Vendor)
                if (config.url.includes('/vendor-customers') && !config.url.includes('/stats')) {
                    return {
                        data: [
                            {
                                id: 201, fullName: 'Aditya Solar Parks', email: 'aditya@solar.in', consumerId: 'KDIA-C001',
                                approval_status: 'APPROVED', createdAt: '2025-01-10T10:00:00Z'
                            },
                            {
                                id: 202, fullName: 'Green Heights Apex', email: 'society@greenheights.com', consumerId: 'KDIA-C005',
                                approval_status: 'PENDING', createdAt: '2025-02-02T14:00:00Z'
                            },
                            {
                                id: 203, fullName: 'Ramesh Textiles', email: 'info@rameshtex.com', consumerId: 'KDIA-C012',
                                approval_status: 'DRAFT', createdAt: '2025-02-04T09:30:00Z'
                            },
                            {
                                id: 204, fullName: 'TechPark Bangalore', email: 'admin@techpark.bg', consumerId: 'KDIA-C008',
                                approval_status: 'APPROVED', createdAt: '2025-01-20T11:15:00Z'
                            },
                            {
                                id: 205, fullName: 'Jaipur Heritage Hotel', email: 'manager@heritagejaipur.com', consumerId: 'KDIA-C015',
                                approval_status: 'REJECTED', createdAt: '2025-01-05T16:45:00Z'
                            }
                        ],
                        status: 200, headers: {}, config
                    };
                }
                // ADMIN: Customer Approvals
                if (config.url.includes('/admin/pending-customers')) {
                    return {
                        data: [
                            { id: 101, fullName: 'Green Factory Ltd', email: 'contact@greenfactory.com', vendorName: 'Solar Solutions Inc', createdAt: new Date().toISOString() },
                            { id: 102, fullName: 'Eco Warehousing', email: 'manager@ecoware.com', vendorName: null, createdAt: new Date(Date.now() - 86400000).toISOString() }
                        ],
                        status: 200, headers: {}, config
                    };
                }

                // ADMIN: Customers
                if (config.url.includes('/admin/customers')) {
                    // Check if it's a PATCH for status update
                    if (config.method === 'patch' && config.url.includes('/status')) {
                        return { data: { success: true }, status: 200, headers: {}, config };
                    }

                    // Check if it's fetching a specific customer profile
                    // e.g. /admin/customers/101 or /admin/customers/102
                    const match = config.url.match(/\/admin\/customers\/(\d+)$/);
                    if (match) {
                        const custId = parseInt(match[1]);
                        // Return mock individual profile following existing list IDs
                        const name = custId === 1 ? 'Alpha Industries' : (custId === 2 ? 'Beta Corp' : (custId === 3 ? 'Gamma Tech' : 'New Customer'));
                        const email = custId === 1 ? 'admin@alpha.com' : (custId === 2 ? 'info@beta.com' : (custId === 3 ? 'contact@gamma.com' : 'new@example.com'));
                        
                        return {
                            data: {
                                profile: {
                                    id: custId, fullName: name,
                                    email: email,
                                    mobileNumber: '9988776655', consumerId: `KDIA-00${custId}`,
                                    allocationStatus: custId === 1 ? 'ACTIVE' : (custId === 2 ? 'PENDING' : 'INACTIVE'), 
                                    approval_status: custId === 3 ? 'PENDING' : 'APPROVED',
                                    vendorName: 'Solar Solutions Inc',
                                    address_line_1: 'Plot 45, Sector B', city: 'Noida', state: 'Uttar Pradesh', pin_code: '201301',
                                    location_type: 'Commercial',
                                    dob: '1985-06-15', gender: 'Other',
                                    isActive: custId !== 3,
                                    createdAt: new Date().toISOString()
                                },
                                subscription: {
                                    totalUnits: custId === 1 ? 450 : 0,
                                    startDate: '2025-01-01'
                                },
                                consumption: [
                                    { month: '2025-01', unitsConsumed: custId === 1 ? 120 : 0 },
                                    { month: '2025-02', unitsConsumed: custId === 1 ? 150 : 0 }
                                ]
                            },
                            status: 200, headers: {}, config
                        };
                    }

                    // For lists (all customers)
                    return {
                        data: [
                            {
                                id: 1, fullName: 'Alpha Industries', email: 'admin@alpha.com', consumerId: 'KDIA-001',
                                allocationStatus: 'ACTIVE', allocatedEnergy: 450, approval_status: 'APPROVED', isActive: true
                            },
                            {
                                id: 2, fullName: 'Beta Corp', email: 'info@beta.com', consumerId: 'KDIA-002',
                                allocationStatus: 'PENDING', allocatedEnergy: 0, approval_status: 'APPROVED', isActive: true
                            },
                            {
                                id: 3, fullName: 'Gamma Tech', email: 'contact@gamma.com', consumerId: 'KDIA-003',
                                allocationStatus: 'INACTIVE', allocatedEnergy: 0, approval_status: 'PENDING', isActive: false
                            }
                        ],
                        status: 200, headers: {}, config
                    };
                }

                // ADMIN: Allocations (POST)
                if (config.url.includes('/admin/allocations') && config.method === 'post') {
                    return { data: { success: true }, status: 200, headers: {}, config };
                }

                // ADMIN: Vendors
                if (config.url.includes('/admin/vendors')) {
                    return {
                        data: [
                            {
                                id: 1, fullName: 'Solar Solutions Inc', email: 'partners@solarsolutions.com', consumerId: 'V-001',
                                createdAt: '2025-01-15T10:00:00Z', approval_status: 'APPROVED', isActive: true
                            },
                            {
                                id: 2, fullName: 'Wind Power Co', email: 'biz@windpower.com', consumerId: 'V-002',
                                createdAt: '2025-02-01T14:30:00Z', approval_status: 'PENDING', isActive: false
                            }
                        ],
                        status: 200, headers: {}, config
                    };
                }

                // ADMIN: Tickets
                if (config.url.includes('/admin/tickets')) {
                    const match = config.url.match(/\/admin\/tickets\/(\d+)$/);
                    
                    // Handle actions (reply, status, etc)
                    if (match && (config.method === 'post' || config.method === 'patch')) {
                        return { data: { success: true }, status: 200, headers: {}, config };
                    }

                    // Handle individual ticket GET
                    if (match && config.method === 'get') {
                        const ticketId = parseInt(match[1]);
                        return {
                            data: {
                                ticket: {
                                    id: ticketId,
                                    subject: ticketId === 1 ? 'Requesting increase in load' : 'Clarification on billing cycle',
                                    description: ticketId === 1 ? 'I would like to request an increase in my monthly solar energy allocation due to expansion of my factory operations. Please let me know the process and if any additional documentation is required.' : 'I noticed some discrepancies in my latest bill compared to my meter readings. Can you please clarify how the billing cycle is calculated?',
                                    status: ticketId === 1 ? 'PENDING' : (ticketId === 2 ? 'RESOLVED' : 'IN_PROGRESS'),
                                    category: ticketId === 1 ? 'Allocation Related' : 'General Question',
                                    customerName: ticketId === 1 ? 'Alpha Industries' : 'Beta Corp',
                                    customerEmail: ticketId === 1 ? 'admin@alpha.com' : 'info@beta.com',
                                    customerConsumerId: ticketId === 1 ? 'KDIA-001' : 'KDIA-002',
                                    createdAt: '2025-03-10T10:00:00Z'
                                },
                                responses: [
                                    {
                                        id: 1,
                                        message: 'Hello, thank you for reaching out. We have received your request and it is currently under review by our technical team.',
                                        senderRole: 'admin',
                                        senderName: 'System Administrator',
                                        createdAt: '2025-03-10T14:30:00Z'
                                    }
                                ]
                            },
                            status: 200, headers: {}, config
                        };
                    }

                    // List view
                    return {
                        data: [
                            {
                                id: 1, customerName: 'Alpha Industries', customerConsumerId: 'KDIA-001',
                                category: 'Allocation Related', subject: 'Requesting increase in load',
                                status: 'PENDING', updatedAt: new Date().toISOString()
                            },
                            {
                                id: 2, customerName: 'Beta Corp', customerConsumerId: 'KDIA-002',
                                category: 'General Question', subject: 'Clarification on billing cycle',
                                status: 'RESOLVED', updatedAt: '2025-01-20T09:00:00Z'
                            }
                        ],
                        status: 200, headers: {}, config
                    };
                }

                // SUPPORT AGENT: Tickets
                if (config.url.includes('/support/agent/tickets')) {
                    const match = config.url.match(/\/support\/agent\/tickets\/(\d+)$/);
                    
                    // Handle actions (reply, status, note, etc)
                    if (match && (config.method === 'post' || config.method === 'patch')) {
                        return { data: { success: true }, status: 200, headers: {}, config };
                    }

                    // Handle individual ticket GET
                    if (match && config.method === 'get') {
                        const ticketId = parseInt(match[1]);
                        return {
                            data: {
                                id: ticketId,
                                subject: ticketId === 101 ? 'Increase Capacity Allocation' : (ticketId === 104 ? 'Grid Synchronization Failure' : 'General Support Request'),
                                description: ticketId === 101 ? 'Requesting an additional 500kW for our solar plant expansion.' : 'Our current grid link is unstable.',
                                status: ticketId === 101 ? 'PENDING' : (ticketId === 103 ? 'RESOLVED' : 'IN_PROGRESS'),
                                priority: ticketId === 104 ? 'CRITICAL' : 'HIGH',
                                customerName: ticketId === 101 ? 'Alpha Industries' : 'Beta Corp',
                                customerEmail: ticketId === 101 ? 'admin@alpha.com' : 'info@beta.com',
                                discom: 'PVVNL',
                                park_district: 'Noida Solar Park',
                                createdAt: new Date(Date.now() - 86400000).toISOString(),
                                messages: [
                                    {
                                        id: 1,
                                        message: 'Ticket created. We need more capacity for the upcoming quarter.',
                                        senderName: ticketId === 101 ? 'Alpha Industries' : 'Beta Corp',
                                        senderRole: 'customer',
                                        createdAt: new Date(Date.now() - 86400000).toISOString()
                                    }
                                ],
                                internalNotes: [
                                    {
                                        id: 1,
                                        note: 'Customer is a high-value priority partner. Please expedite.',
                                        agentName: 'Support Supervisor',
                                        createdAt: new Date(Date.now() - 43200000).toISOString()
                                    }
                                ]
                            },
                            status: 200, headers: {}, config
                        };
                    }

                    // List view
                    return {
                        data: [
                            {
                                id: 101, customerName: 'Alpha Industries', discom: 'PVVNL', park_district: 'Noida Solar Park',
                                category: 'Allocation', subject: 'Increase Capacity Allocation', description: 'Requesting an additional 500kW',
                                status: 'PENDING', priority: 'HIGH', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
                            },
                            {
                                id: 102, customerName: 'GreenTech Ltd', discom: 'MVVNL', park_district: 'Lucknow RE Hub',
                                category: 'Billing', subject: 'Discrepancy in Monthly Invoice', description: 'My invoice shows higher units than allocated.',
                                status: 'IN_PROGRESS', priority: 'MEDIUM', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString()
                            },
                            {
                                id: 103, customerName: 'Sunrise Textiles', discom: 'PuVVNL', park_district: 'Varanasi Zone',
                                category: 'Technical Issue', subject: 'Portal Access Denied', description: 'My sub-users cannot log in.',
                                status: 'RESOLVED', priority: 'LOW', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString()
                            },
                            {
                                id: 104, customerName: 'Beta Corp', discom: 'DVVNL', park_district: 'Agra RE Park',
                                category: 'Maintenance', subject: 'Grid Synchronization Failure', description: 'Our inverters are failing to sync with the main grid.',
                                status: 'ESCALATED', priority: 'CRITICAL', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
                            }
                        ],
                        status: 200, headers: {}, config
                    };
                }

                if (config.url.includes('/leads')) {
                    return {
                        data: [
                            {
                                id: 1, name: 'Rahul Sharma', status: 'New', contact: '9876543210 | rahul.sharma@example.com',
                                location: 'Mumbai, Maharashtra', assignedDate: '2025-02-05'
                            },
                            {
                                id: 2, name: 'Priya Patel', status: 'Contacted', contact: '8765432109 | priya.p@example.com',
                                location: 'Ahmedabad, Gujarat', assignedDate: '2025-02-04'
                            },
                            {
                                id: 3, name: 'Amit Singh', status: 'Meeting Scheduled', contact: '7654321098 | amit.singh@techsol.in',
                                location: 'Bangalore, Karnataka', assignedDate: '2025-02-03'
                            },
                            {
                                id: 4, name: 'Neha Gupta', status: 'Not Interested', contact: '6543210987 | neha.g@creative.com',
                                location: 'New Delhi, Delhi', assignedDate: '2025-02-01'
                            },
                            {
                                id: 5, name: 'Vikram Malhotra', status: 'Converted', contact: '9988776655 | vikram.m@infra.com',
                                location: 'Gurgaon, Haryana', assignedDate: '2025-01-28'
                            },
                            {
                                id: 6, name: 'Suresh Nair', status: 'New', contact: '8877665544 | suresh.n@kerala.com',
                                location: 'Kochi, Kerala', assignedDate: '2025-02-05'
                            },
                            {
                                id: 7, name: 'Kavita Iyer', status: 'Contacted', contact: '7766554433 | kavita.i@chennai.com',
                                location: 'Chennai, Tamil Nadu', assignedDate: '2025-02-02'
                            },
                            {
                                id: 8, name: 'Manoj Tiwari', status: 'Meeting Scheduled', contact: '9123456789 | manoj.t@up.com',
                                location: 'Lucknow, Uttar Pradesh', assignedDate: '2025-01-30'
                            },
                            {
                                id: 9, name: 'Rina Kapoor', status: 'New', contact: '9876501234 | rina.k@punjab.com',
                                location: 'Chandigarh, Punjab', assignedDate: '2025-02-05'
                            },
                            {
                                id: 10, name: 'Arjun Das', status: 'Converted', contact: '8899776655 | arjun.das@kolkata.com',
                                location: 'Kolkata, West Bengal', assignedDate: '2025-01-25'
                            }
                        ],
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config
                    };
                }

                if (config.url.includes('/profile')) {
                    return {
                        data: {
                            fullName: 'Test Customer',
                            email: 'customer@test.com',
                            mobileNumber: '9876543210',
                            dob: '1990-01-01',
                            gender: 'male',
                            addressLine1: '123 Solar Heights',
                            city: 'Clean City',
                            state: 'Sustainable State',
                            pinCode: '123456',
                            locationType: 'residential'
                        },
                        status: 200,
                        headers: {},
                        config
                    };
                }

                // GENERIC FALLBACK (Prevents crashes)
                return {
                    data: {},
                    status: 200,
                    headers: {},
                    config
                };
            }
        }

        return Promise.reject(error);
    }
);

export default api;
