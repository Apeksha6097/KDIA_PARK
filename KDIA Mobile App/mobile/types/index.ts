export interface User {
    id: number;
    fullName: string;
    email: string;
    role: 'customer' | 'admin' | 'vendor';
    consumerId?: string;
}

export interface DashboardData {
    allocationName: string;
    totalSubscribed: number;
    allocationStatus: string;
    totalConsumed?: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    user: User;
    token: string;
    message?: string;
}

export interface SupportTicket {
    id: string;
    subject: string;
    status: 'OPEN' | 'CLOSED';
    date: string;
    description: string;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
}

export interface SystemUpdate {
    id: string;
    title: string;
    date: string;
    content: string;
}

export interface MonthlyUsage {
    month: string;
    solar: number;
    grid: number;
}

export interface UsageStats {
    totalConsumed: number;
    cleanEnergyPercentage: number;
    monthlyUsage: MonthlyUsage[];
    avgDailyConsumption: number;
    peakUsageDay: string;
    co2Saved: number;
    estimatedSavings: number;
    insights: {
        id: string;
        text: string;
        type: 'info' | 'success' | 'warning';
    }[];
}

export type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
    MainRoot: undefined;
    TicketDetails: { ticketId: string };
    SupportTickets: undefined;
    FAQ: undefined;
    Billing: undefined;
    AllocationDetails: undefined;
    Updates: undefined;
    About: undefined;
    ForgotPassword: undefined;
    ResetPassword: { email?: string; token?: string };
    EnergyUsageHelp: undefined;
    GettingStarted: undefined;
    TermsOfService: undefined;
    ContactSupport: undefined;
};
