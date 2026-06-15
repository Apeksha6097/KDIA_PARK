const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function fixDB() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    console.log("Checking support_tickets table...");
    const ticketInfo = await db.all("PRAGMA table_info(support_tickets)");
    const ticketColumns = ticketInfo.map(c => c.name);
    console.log("Current columns:", ticketColumns);

    const newTicketCols = [
        { name: 'priority', type: 'TEXT DEFAULT "LOW"' },
        { name: 'discom', type: 'TEXT' },
        { name: 'park_district', type: 'TEXT' },
        { name: 'assigned_support_id', type: 'INTEGER' }
    ];

    for (const col of newTicketCols) {
        if (!ticketColumns.includes(col.name)) {
            console.log(`Adding column: ${col.name}`);
            await db.exec(`ALTER TABLE support_tickets ADD COLUMN ${col.name} ${col.type}`);
        } else {
            console.log(`Column ${col.name} already exists.`);
        }
    }

    console.log("Checking ticket_internal_notes table...");
    await db.exec(`
        CREATE TABLE IF NOT EXISTS ticket_internal_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticketId INTEGER NOT NULL,
            agentId INTEGER NOT NULL,
            note TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ticketId) REFERENCES support_tickets(id),
            FOREIGN KEY (agentId) REFERENCES users(id)
        );
    `);

    console.log("Database schema fix completed.");
    await db.close();
}

fixDB().catch(console.error);
