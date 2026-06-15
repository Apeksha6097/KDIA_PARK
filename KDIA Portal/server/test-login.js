const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function testLogin() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    const email = 'customer@test.com';
    const testPassword = 'Test@123';

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            console.log('❌ USER NOT FOUND');
            return;
        }

        console.log('✅ USER FOUND:');
        console.log('  Email:', user.email);
        console.log('  Role:', user.role);
        console.log('  Is Active:', user.isActive);
        console.log('  Approval Status:', user.approval_status);
        console.log('  Login Attempts:', user.loginAttempts);
        console.log('  Lock Until:', user.lockUntil);
        console.log('  Password Hash:', user.password.substring(0, 20) + '...');

        console.log('\n🔐 TESTING PASSWORD:');
        const isMatch = await bcrypt.compare(testPassword, user.password);
        console.log('  Password "Test@123" matches:', isMatch ? '✅ YES' : '❌ NO');

        console.log('\n📋 LOGIN ELIGIBILITY:');
        if (user.isActive === 0) {
            console.log('  ❌ Account is INACTIVE');
        } else {
            console.log('  ✅ Account is ACTIVE');
        }

        if (user.approval_status === 'APPROVED') {
            console.log('  ✅ Approval status is APPROVED');
        } else {
            console.log(`  ❌ Approval status is ${user.approval_status}`);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await db.close();
    }
}

testLogin();
