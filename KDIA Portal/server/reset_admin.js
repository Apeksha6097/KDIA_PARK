const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./database.sqlite');

const newPassword = 'AdminPassword123!';

bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) throw err;
    db.run(
        'UPDATE users SET password = ?, loginAttempts = 0, lockUntil = 0 WHERE email = "final@example.com"',
        [hash],
        (err) => {
            if (err) console.error(err);
            else console.log('Admin password reset successfully to: ' + newPassword);
            db.close();
        }
    );
});
