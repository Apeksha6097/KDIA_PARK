const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.all('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 5', (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Recent Audit Logs:');
    console.table(rows);
    db.close();
});
