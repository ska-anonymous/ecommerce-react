const express = require('express');
const router = express.Router();
// db object
const client = require('../db');

router.post('/', async (req, res) => {
    const data = req.body;

    // check if password is less than 5 chars
    if (data.password.length < 5) {
        res.send({ error: true, errorMessage: 'Password must be at least 5 characters' });
        return;
    }

    try {
        // first check if the user with the provided email already exists
        const result = await client.query('SELECT * FROM users WHERE email = $1', [data.email]);
        if (result.rowCount > 0)
            return res.json({ error: true, errorMessage: `A user with this email "${data.email}" already exists` });

        const insertQuery = "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)";
        await client.query(insertQuery, [data.name, data.email, data.password, 'customer']);
        res.json({ error: false });
    } catch (err) {
        console.log('Failed to register user', err);
        res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
    }

})

module.exports = router;