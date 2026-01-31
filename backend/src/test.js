const pool = require('./db');

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connected to PostgreSQL at:', res.rows[0].now);
    } catch (err) {
        console.error('Error connecting to database:', err);
    } finally {
        pool.end();
    }
}

testConnection();
