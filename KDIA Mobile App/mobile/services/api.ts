import { LoginCredentials, LoginResponse, DashboardData, UsageStats } from '../types';

/**
 * API Service for KDIA Mobile App
 * 
 * DEMO MODE: This service runs in demo-only mode.
 * All methods return mock data without making real API calls.
 * 
 * In production, you would replace these with real API calls to:
 * https://kdia-portal.vercel.app/api
 */

const API_BASE_URL = 'https://kdia-portal.vercel.app/api';

// Configuration flag to switch between mock and real backend
const USE_REAL_BACKEND = false; // Set to true to use the portal backend
const BACKEND_URL = API_BASE_URL; // Points to Vercel production backend

// Helper for real API calls
const callApi = async (endpoint: string, method = 'GET', body?: any, token?: string) => {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        let errorBody: any = {};
        try { errorBody = await response.json(); } catch (_) { }

        // 401: Token expired or invalid
        if (response.status === 401) {
            throw new Error('SESSION_EXPIRED: ' + (errorBody.error || 'Your session has expired. Please log in again.'));
        }

        // 403: Parked Mode or access denied
        if (response.status === 403) {
            throw new Error('PARKED_MODE: ' + (errorBody.message || 'This operation is currently disabled in demonstration mode.'));
        }

        throw new Error(errorBody.error || errorBody.message || 'API request failed');
    }

    return response.json();
};

export const api = {
    /**
     * Login
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        if (USE_REAL_BACKEND) {
            // Backend expects `loginId` (email or mobile), not `email`
            return callApi('/auth/login', 'POST', { loginId: credentials.email, password: credentials.password });
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // DEMO MODE: Accept any credentials
        let role: 'customer' | 'admin' | 'vendor' = 'customer';
        if (credentials.email.includes('admin')) {
            role = 'admin';
        } else if (credentials.email.includes('vendor')) {
            role = 'vendor';
        }

        return {
            success: true,
            user: {
                id: 1,
                fullName: 'Rahul Sharma',
                email: credentials.email,
                role: role,
                consumerId: 'KDIA-IN-001',
            },
            token: 'demo-mobile-jwt-token',
            message: 'Login successful (Demo Mode)',
        };
    },

    /**
     * Get Dashboard Data
     */
    async getDashboard(): Promise<DashboardData> {
        if (USE_REAL_BACKEND) {
            // Correct endpoint path as per backend: /dashboard/summary
            return callApi('/dashboard/summary');
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            allocationName: 'Solar Premium Tier 1',
            totalSubscribed: 450,
            allocationStatus: 'ACTIVE',
            totalConsumed: 120,
        };
    },

    /**
     * Validate Token (Demo)
     */
    async validateToken(token: string): Promise<boolean> {
        if (USE_REAL_BACKEND) {
            // Simple validation check (could be refined)
            return !!token && token !== 'demo-mobile-jwt-token';
        }
        return token === 'demo-mobile-jwt-token';
    },

    /**
     * Get Customer Profile
     */
    async getProfile() {
        if (USE_REAL_BACKEND) {
            return callApi('/profile');
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            planName: 'Solar Premium Tier 1',
            memberSince: 'Jan 2024',
            status: 'Active',
            email: 'demo@kdia.com',
            phone: '+91 98765 43210',
            notificationPreferences: 'Email Alerts: Enabled',
            language: 'English',
            timeZone: 'IST (UTC+5:30)',
            consumerId: 'KDIA-IN-001',
            connectionLocation: 'KDIA RE Park – Unit A',
            meterType: 'Smart Meter (IoT Enabled)',
            lastLogin: 'Today, 10:45 AM',
            deviceType: 'Android (Mobile App)'
        };
    },

    /**
     * Get Support Tickets
     */
    async getSupportTickets() {
        if (USE_REAL_BACKEND) {
            // Correct endpoint path as per backend: /support/tickets
            return callApi('/support/tickets');
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        return [
            {
                id: 'TKT-2024-001',
                subject: 'Billing Inquiry - March',
                status: 'CLOSED',
                date: '2024-03-15',
                description: 'Question about the surplus energy credit calculation on the March invoice.'
            },
            {
                id: 'TKT-2024-002',
                subject: 'Panel Efficiency Question',
                status: 'OPEN',
                date: '2024-04-02',
                description: 'I noticed a slight drop in generation during peak hours. Is this expected?'
            }
        ];
    },

    /**
     * Get FAQs
     */
    async getFAQs() {
        // FAQs stay mock for now as per requirements (read-only info)
        await new Promise(resolve => setTimeout(resolve, 100));
        return [
            {
                id: '1',
                question: 'What is KDIA Re Park?',
                answer: 'KDIA Re Park is a state-of-the-art renewable energy aggregator that allows consumers to subscribe to solar energy allocations from India\'s leading green energy parks.'
            },
            {
                id: '2',
                question: 'How is energy allocation calculated?',
                answer: 'Your allocation is based on your specific subscription tier. We monitor real-time generation from the solar park and distribute it proportionally among all active subscribers.'
            },
            {
                id: '3',
                question: 'What happens on cloudy or rainy days?',
                answer: 'While solar generation may drop during overcast weather, our hybrid system automatically switches to the Grid Backup to ensure your energy supply is never interrupted.'
            },
            {
                id: '4',
                question: 'What is the "Clean Energy Percentage"?',
                answer: 'This represents the portion of your total energy consumption that came directly from renewable solar generation versus the traditional grid backup.'
            },
            {
                id: '5',
                question: 'How are my monthly cost savings calculated?',
                answer: 'Savings are calculated by subtracting the cost of your solar-allocated units (credited at a lower green-energy rate) from the standard utility grid tariff.'
            },
            {
                id: '6',
                question: 'Can I increase my solar allocation later?',
                answer: 'Yes, you can upgrade your subscription tier at any time through the Customer Portal. New allocations typically take effect from the next billing cycle.'
            },
            {
                id: '7',
                question: 'How often is the solar park maintained?',
                answer: 'The parks undergo automated cleaning daily and professional technical maintenance monthly to ensure maximum generation efficiency for all subscribers.'
            },
            {
                id: '8',
                question: 'Can I see the real-time status of the solar park?',
                answer: 'Yes! The Dashboard provides real-time insights into your current allocation, generation status, and overall system health.'
            },
            {
                id: '9',
                question: 'How do I raise a support request?',
                answer: 'You can quickly raise a ticket via the "Help & Support" tab. Our technical team typically responds to energy-related queries within 4-6 hours.'
            },
            {
                id: '10',
                question: 'Is there a minimum subscription period?',
                answer: 'Standard plans are monthly, giving you the flexibility to manage your renewable energy needs without long-term lock-in periods.'
            },
            {
                id: '11',
                question: 'Where are the KDIA solar parks located?',
                answer: 'We aggregate energy from multiple high-efficiency parks across Rajasthan, Gujarat, and Tamil Nadu to ensure reliable solar generation throughout the year.'
            }
        ];
    },

    /**
     * Get Invoices
     */
    async getInvoices() {
        if (USE_REAL_BACKEND) {
            return callApi('/invoices');
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        return [
            { id: 'INV-2024-004', date: 'Apr 01, 2024', amount: 8550.00, status: 'PENDING' },
            { id: 'INV-2024-003', date: 'Mar 01, 2024', amount: 9220.00, status: 'PAID' },
            { id: 'INV-2024-002', date: 'Feb 01, 2024', amount: 8800.00, status: 'PAID' },
            { id: 'INV-2024-001', date: 'Jan 01, 2024', amount: 9550.00, status: 'PAID' },
        ];
    },

    /**
     * Get Updates/Notifications
     */
    async getUpdates() {
        // Updates stay mock for now
        await new Promise(resolve => setTimeout(resolve, 300));
        return [
            {
                id: '1',
                title: 'Monsoon Maintenance Alert',
                date: '2 hours ago',
                content: 'Scheduled maintenance on the Rajasthan Solar Grid this weekend. Generation might be slightly lower due to cloud cover.'
            },
            {
                id: '2',
                title: 'New Efficiency Record',
                date: '2 days ago',
                content: 'Our park reached 98% efficiency yesterday! Thanks to clear skies across North India.'
            },
            {
                id: '3',
                title: 'April Billing Cycle',
                date: '1 week ago',
                content: 'Your invoice for the last month has been generated in INR and is ready for view.'
            }
        ];
    },

    /**
     * Get Usage Stats
     */
    async getUsageStats(): Promise<UsageStats> {
        // Usage stats stay mock (complex data)
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            totalConsumed: 5450,
            cleanEnergyPercentage: 86,
            monthlyUsage: [
                { month: 'Oct', solar: 4200, grid: 800 },
                { month: 'Nov', solar: 3800, grid: 1200 },
                { month: 'Dec', solar: 3500, grid: 1500 },
                { month: 'Jan', solar: 4500, grid: 900 },
                { month: 'Feb', solar: 5200, grid: 600 },
                { month: 'Mar', solar: 5800, grid: 400 },
            ],
            avgDailyConsumption: 182,
            peakUsageDay: 'March 12',
            co2Saved: 1240,
            estimatedSavings: 12500,
            insights: [
                {
                    id: '1',
                    text: 'You relied more on grid power during evening hours last month.',
                    type: 'info'
                },
                {
                    id: '2',
                    text: 'Shifting 10% usage to daytime could improve solar utilization by 5%.',
                    type: 'success'
                }
            ]
        };
    },
};

// Export config for reference
export { API_BASE_URL, USE_REAL_BACKEND, BACKEND_URL };
