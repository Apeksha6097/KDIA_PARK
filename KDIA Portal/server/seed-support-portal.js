const { initDB } = require('./database');
const bcrypt = require('bcrypt');

async function seedSupport() {
    console.log("Initializing database for seeding...");
    const db = await initDB();

    console.log("Seeding Support Portal data...");

    const hashedPassword = await bcrypt.hash('Password@123', 10);

    // 1. Create Support Agents
    const agents = [
        { fullName: 'Support Agent One', email: 'support1@kdia.com' },
        { fullName: 'Support Agent Two', email: 'support2@kdia.com' }
    ];

    for (const agent of agents) {
        const existing = await db.get('SELECT id FROM users WHERE email = ?', [agent.email]);
        if (!existing) {
            await db.run(
                'INSERT INTO users (fullName, email, password, role, approval_status) VALUES (?, ?, ?, ?, ?)',
                [agent.fullName, agent.email, hashedPassword, 'support_agent', 'APPROVED']
            );
            console.log(`Created support agent: ${agent.email}`);
        }
    }

    const support1 = await db.get("SELECT id FROM users WHERE email = 'support1@kdia.com'");
    const customer = await db.get("SELECT id FROM users WHERE role = 'customer' LIMIT 1");

    if (!customer) {
        console.error("No customer found to associate tickets with. Please run core seeds first.");
        return;
    }

    // 2. Create Demo Tickets
    const tickets = [
        { subject: 'Solar Panel Maintenance', category: 'Maintenance', description: 'Requesting cleaning service for panels.', status: 'PENDING', priority: 'MEDIUM', discom: 'PVVNL', park: 'Noida Solar Park' },
        { subject: 'Billing Discrepancy', category: 'Billing', description: 'The units allocated do not match my meter reading.', status: 'IN_PROGRESS', priority: 'HIGH', discom: 'MVVNL', park: 'Lucknow RE Park' },
        { subject: 'Capacity Upgrade', category: 'Request', description: 'I want to increase my solar capacity allocation.', status: 'ESCALATED', priority: 'HIGH', discom: 'PuVVNL', park: 'Varanasi Green Zone' },
        { subject: 'Login Issue', category: 'Technical', description: 'Unable to login to the customer portal.', status: 'RESOLVED', priority: 'LOW', discom: 'DVVNL', park: 'Agra Park' },
        { subject: 'New Connection Inquiry', category: 'Inquiry', description: 'Interest in getting a new industrial connection.', status: 'PENDING', priority: 'LOW', discom: 'PVVNL', park: 'Ghaziabad Industrial' },
        { subject: 'Inverter Not Working', category: 'Maintenance', description: 'The inverter keeps showing a red light.', status: 'IN_PROGRESS', priority: 'CRITICAL', discom: 'PVVNL', park: 'Meerut Park' },
        { subject: 'Document Verification', category: 'General', description: 'Checking status of my uploaded KYC.', status: 'Awaiting Customer Response', priority: 'LOW', discom: 'MVVNL', park: 'Kanpur Hub' },
        { subject: 'Solar Grid Connectivity', category: 'Technical', description: 'Grid connection is flapping.', status: 'ESCALATED', priority: 'HIGH', discom: 'PVVNL', park: 'Noida Solar Park' },
        { subject: 'Payment Proof Upload', category: 'Billing', description: 'I uploaded proof but balance is same.', status: 'RESOLVED', priority: 'MEDIUM', discom: 'PuVVNL', park: 'Prayagraj Park' },
        { subject: 'Site Survey Request', category: 'Inquiry', description: 'Request for site survey for my roof.', status: 'PENDING', priority: 'MEDIUM', discom: 'DVVNL', park: 'Mathura Solar' }
    ];

    for (const t of tickets) {
        const result = await db.run(
            `INSERT INTO support_tickets (customerId, subject, category, description, status, priority, discom, park_district, assigned_support_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [customer.id, t.subject, t.category, t.description, t.status, t.priority, t.discom, t.park, t.status !== 'PENDING' ? support1.id : null]
        );

        // Add a demo message for non-pending tickets
        if (t.status !== 'PENDING') {
            await db.run(
                'INSERT INTO ticket_responses (ticketId, senderId, message) VALUES (?, ?, ?)',
                [result.lastID, customer.id, t.description]
            );
            if (t.status === 'IN_PROGRESS' || t.status === 'RESOLVED' || t.status === 'Awaiting Customer Response') {
                await db.run(
                    'INSERT INTO ticket_responses (ticketId, senderId, message) VALUES (?, ?, ?)',
                    [result.lastID, support1.id, "We are looking into this case. Please provide more details if possible."]
                );
            }
        }
    }

    console.log("Seeded 10 demo tickets for testing.");
    await db.close();
}

seedSupport().catch(console.error);
