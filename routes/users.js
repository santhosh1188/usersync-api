const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all users (already working)
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// POST a new user
router.post('/', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, name, email });
    });
});

router.post('/', (req, res) => {
    console.log('POST Request Body:', req.body); // Debug input
    const { name, email } = req.body;
    if (!name || !email) {
        console.log('Validation failed: Missing fields');
        return res.status(400).json({ error: 'Name and email are required' });
    }
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) {
            console.log('MySQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, name, email });
    });
});
module.exports = router;