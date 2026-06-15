/**
 * Mock data for Vendor Billing & Payments
 */

export const INVOICE_TYPES = [
    "Booking",
    "Allocation",
    "Installation",
    "Final"
];

export const INVOICE_STATUSES = [
    { label: "Paid", value: "Paid", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { label: "Pending", value: "Pending", color: "bg-amber-50 text-amber-700 border-amber-100" },
    { label: "Overdue", value: "Overdue", color: "bg-rose-50 text-rose-700 border-rose-100" },
    { label: "Partially Paid", value: "Partially Paid", color: "bg-blue-50 text-blue-700 border-blue-100" }
];

export const MOCK_INVOICES = [
    {
        invoiceId: "INV-001",
        customerName: "Raj Sharma",
        customerEmail: "raj.sharma@example.com",
        customerPhone: "+91 98765 43210",
        type: "Allocation",
        amount: 150000,
        amountPaid: 0,
        dueDate: "2024-02-15",
        status: "Pending",
        raisedOn: "2024-02-01",
        history: [
            { date: "2024-02-01 10:00 AM", event: "Invoice Generated", note: "Allocation phase invoice." }
        ],
        breakdown: [
            { item: "Energy Allocation Fee", price: 120000 },
            { item: "Processing Charges", price: 30000 }
        ]
    },
    {
        invoiceId: "INV-002",
        customerName: "Anita Verma",
        customerEmail: "anita.v@example.com",
        customerPhone: "+91 87654 32109",
        type: "Installation",
        amount: 95000,
        amountPaid: 0,
        dueDate: "2024-02-01",
        status: "Overdue",
        raisedOn: "2024-01-15",
        history: [
            { date: "2024-01-15 02:30 PM", event: "Invoice Generated", note: "" },
            { date: "2024-02-05 09:15 AM", event: "Payment Reminder Sent", note: "System auto-reminder." }
        ],
        breakdown: [
            { item: "Installation Labor", price: 45000 },
            { item: "Wiring & Accessories", price: 50000 }
        ]
    },
    {
        invoiceId: "INV-003",
        customerName: "Bikram Singh",
        customerEmail: "bikram.s@infra.in",
        customerPhone: "+91 76543 21098",
        type: "Booking",
        amount: 50000,
        amountPaid: 50000,
        dueDate: "2024-01-20",
        status: "Paid",
        raisedOn: "2024-01-05",
        history: [
            { date: "2024-01-05 11:45 AM", event: "Invoice Generated", note: "" },
            { date: "2024-01-15 10:30 AM", event: "Payment Received", note: "Online Bank Transfer Ref: TXN9988." }
        ],
        breakdown: [
            { item: "Initial Booking Deposit", price: 50000 }
        ]
    },
    {
        invoiceId: "INV-004",
        customerName: "Meera Iyer",
        customerEmail: "meera.i@chennai.com",
        customerPhone: "+91 65432 10987",
        type: "Final",
        amount: 250000,
        amountPaid: 100000,
        dueDate: "2024-03-10",
        status: "Partially Paid",
        raisedOn: "2024-02-10",
        history: [
            { date: "2024-02-10 04:00 PM", event: "Invoice Generated", note: "" },
            { date: "2024-02-15 02:00 PM", event: "Payment Received", note: "Interim payment of ₹1,00,000." }
        ],
        breakdown: [
            { item: "Solar Component Balance", price: 200000 },
            { item: "Service Warranty (5yr)", price: 50000 }
        ]
    },
    {
        invoiceId: "INV-005",
        customerName: "Siddharth Malhotra",
        customerEmail: "sid.m@startup.com",
        customerPhone: "+91 99887 76655",
        type: "Allocation",
        amount: 185000,
        amountPaid: 0,
        dueDate: "2024-02-28",
        status: "Pending",
        raisedOn: "2024-02-12",
        history: [
            { date: "2024-02-12 09:12 AM", event: "Invoice Generated", note: "" }
        ],
        breakdown: [
            { item: "Tier 1 Solar Allocation", price: 185000 }
        ]
    }
];

// Calculation Helpers
export const getBillingStats = (invoices) => {
    const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.amount, 0);
    const totalCollected = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
    const pendingAmount = invoices
        .filter(inv => inv.status !== 'Paid' && inv.status !== 'Overdue')
        .reduce((acc, inv) => acc + (inv.amount - inv.amountPaid), 0);
    const overdueAmount = invoices
        .filter(inv => inv.status === 'Overdue')
        .reduce((acc, inv) => acc + (inv.amount - inv.amountPaid), 0);

    return { totalInvoiced, totalCollected, pendingAmount, overdueAmount };
};
