const db = require('./database');
const bcrypt = require('bcryptjs');

async function seed() {
    const passwordHash = await bcrypt.hash('password123', 10);

    db.serialize(() => {
        // Clear existing data
        db.run('DELETE FROM users');
        db.run('DELETE FROM invoices');
        db.run('DELETE FROM tickets');

        // Seed User
        db.run(
            'INSERT INTO users (fullName, email, password, role, consumerId) VALUES (?, ?, ?, ?, ?)',
            ['Rahul Sharma', 'demo@kdia.com', passwordHash, 'customer', 'KDIA-IN-001'],
            function (err) {
                if (err) return console.error(err.message);

                const userId = this.lastID;
                console.log(`Added demo user with ID: ${userId}`);

                // Seed Invoices
                const invoices = [
                    ['INV-2024-004', 'Apr 01, 2024', 8550.00, 'PENDING'],
                    ['INV-2024-003', 'Mar 01, 2024', 9220.00, 'PAID'],
                    ['INV-2024-002', 'Feb 01, 2024', 8800.00, 'PAID'],
                    ['INV-2024-001', 'Jan 01, 2024', 9550.00, 'PAID'],
                ];

                invoices.forEach(inv => {
                    db.run(
                        'INSERT INTO invoices (id, userId, date, amount, status) VALUES (?, ?, ?, ?, ?)',
                        [inv[0], userId, inv[1], inv[2], inv[3]]
                    );
                });

                // Seed Tickets
                const tickets = [
                    ['TKT-2024-001', userId, 'Billing Inquiry - March', 'CLOSED', '2024-03-15', 'Question about the surplus energy credit calculation on the March invoice.'],
                    ['TKT-2024-002', userId, 'Panel Efficiency Question', 'OPEN', '2024-04-02', 'I noticed a slight drop in generation during peak hours. Is this expected?'],
                ];

                tickets.forEach(tkt => {
                    db.run(
                        'INSERT INTO tickets (id, userId, subject, status, date, description) VALUES (?, ?, ?, ?, ?, ?)',
                        [tkt[0], tkt[1], tkt[2], tkt[3], tkt[4], tkt[5]]
                    );
                });

                console.log('Seeding complete.');
            }
        );
    });
}

seed();
