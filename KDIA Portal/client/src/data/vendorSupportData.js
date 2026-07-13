/**
 * Mock data for Vendor Support Requests (Complaints)
 * Designed for demo purposes with Indian context.
 */

export const ISSUE_TYPES = [
    "Billing Issue",
    "Installation Delay",
    "Meter Fault",
    "Grid Connectivity",
    "Panel Damage",
    "Documentation",
    "General Query"
];

export const TICKET_STATUSES = [
    { label: "Open", value: "Open", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { label: "In Progress", value: "In Progress", color: "bg-amber-50 text-amber-700 border-amber-100" },
    { label: "Escalated", value: "Escalated", color: "bg-red-50 text-red-700 border-red-100" },
    { label: "Resolved", value: "Resolved", color: "bg-emerald-50 text-emerald-700 border-emerald-100" }
];

export const PRIORITIES = [
    { label: "Low", value: "Low", color: "bg-slate-50 text-slate-700 border-slate-100" },
    { label: "Medium", value: "Medium", color: "bg-orange-50 text-orange-700 border-orange-100" },
    { label: "High", value: "High", color: "bg-rose-50 text-rose-700 border-rose-100" }
];

export const MOCK_TICKETS = [
    {
        id: "TKT-001",
        customerName: "Raj Sharma",
        customerEmail: "raj.sharma@example.com",
        customerPhone: "+91 98765 43210",
        issueType: "Billing Issue",
        priority: "High",
        status: "Open",
        description: "Mismatch in monthly savings report. The calculated savings don't match the actual bill deduction.",
        raisedOn: "2024-02-18",
        history: [
            { date: "2024-02-18 10:00 AM", event: "Ticket Created", note: "Auto-generated from customer portal." }
        ]
    },
    {
        id: "TKT-002",
        customerName: "Anita Verma",
        customerEmail: "anita.v@example.com",
        customerPhone: "+91 87654 32109",
        issueType: "Installation Delay",
        priority: "Medium",
        status: "In Progress",
        description: "Panel installation was scheduled for last Tuesday but team hasn't arrived yet.",
        raisedOn: "2024-02-15",
        history: [
            { date: "2024-02-15 02:30 PM", event: "Ticket Created", note: "" },
            { date: "2024-02-16 09:15 AM", event: "In Progress", note: "Vendor coordinating with installation team." }
        ]
    },
    {
        id: "TKT-003",
        customerName: "Bikram Singh",
        customerEmail: "bikram.s@infra.in",
        customerPhone: "+91 76543 21098",
        issueType: "Meter Fault",
        priority: "High",
        status: "Escalated",
        description: "Smart meter display is blank since morning. No transmission data showing in app.",
        raisedOn: "2024-02-19",
        history: [
            { date: "2024-02-19 11:45 AM", event: "Ticket Created", note: "" },
            { date: "2024-02-20 08:30 AM", event: "Escalated", note: "Requires technical specialist on-site. Handled by Internal Support Team." }
        ]
    },
    {
        id: "TKT-004",
        customerName: "Meera Iyer",
        customerEmail: "meera.i@chennai.com",
        customerPhone: "+91 65432 10987",
        issueType: "Documentation",
        priority: "Low",
        status: "Resolved",
        description: "Need digital copy of the warranty certificate for the solar panels.",
        raisedOn: "2024-02-10",
        history: [
            { date: "2024-02-10 04:00 PM", event: "Ticket Created", note: "" },
            { date: "2024-02-11 11:00 AM", event: "In Progress", note: "Fetching document from archives." },
            { date: "2024-02-12 02:00 PM", event: "Resolved", note: "Document emailed to customer. Resolution confirmed." }
        ]
    },
    {
        id: "TKT-005",
        customerName: "Siddharth Malhotra",
        customerEmail: "sid.m@startup.com",
        customerPhone: "+91 99887 76655",
        issueType: "Panel Damage",
        priority: "High",
        status: "Open",
        description: "Small crack noticed on one of the top panels after heavy rain yesterday.",
        raisedOn: "2024-02-20",
        history: [
            { date: "2024-02-20 09:12 AM", event: "Ticket Created", note: "Attached photo via mobile app." }
        ]
    },
    {
        id: "TKT-006",
        customerName: "Sunita Reddy",
        customerEmail: "sunita.r@hyderabad.in",
        customerPhone: "+91 88776 65544",
        issueType: "Grid Connectivity",
        priority: "Medium",
        status: "In Progress",
        description: "Net metering syncing issues. Exported units not reflecting correctly.",
        raisedOn: "2024-02-14",
        history: [
            { date: "2024-02-14 10:30 AM", event: "Ticket Created", note: "" }
        ]
    }
];
