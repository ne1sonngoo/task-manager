const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// Create user
router.post('/', async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    const userId = req.params.id; 
    try {
        const check = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        await pool.query('DELETE FROM tasks WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.status(200).json({ message: 'User and their tasks deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Database error' });
    }
});
module.exports = router;
