const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');
        createTables();
    }
});

function createTables() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('customer', 'admin', 'vendor')) DEFAULT 'customer',
      consumerId TEXT
    )`);

        // Invoices Table
        db.run(`CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      userId INTEGER,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT CHECK(status IN ('PAID', 'PENDING', 'OVERDUE')),
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);

        // Support Tickets Table
        db.run(`CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      userId INTEGER,
      subject TEXT NOT NULL,
      status TEXT CHECK(status IN ('OPEN', 'CLOSED')),
      date TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);

        // Password Reset Tokens Table
        db.run(`CREATE TABLE IF NOT EXISTS password_resets (
      email TEXT PRIMARY KEY,
      token TEXT NOT NULL,
      expiresAt INTEGER NOT NULL
    )`);
    });
}

module.exports = db;
