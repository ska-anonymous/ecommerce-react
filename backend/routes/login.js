const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secretKey = require('../key');
// db object
const client = require('../db.js');


router.post('/', async (req, res) => {
    const data = JSON.stringify(req.body);
    const parsedData = JSON.parse(data);

    try {
        const result = await client.query("SELECT * FROM users WHERE email= $1 AND password = $2", [parsedData.email, parsedData.password]);

        // if login credentials are incorrect
        if (result.rowCount == 0)
            return res.status(401).json({ error: true, errorMessage: 'Invalid Login Credentials' });

        // send user info to the client without password
        const user = result.rows[0];
        delete user.password;

        const token = jwt.sign({ ...user }, secretKey);

        res.json({ error: false, token, user });

    } catch (err) {
        console.log('Error getting user for login :', err)
        return res.status(500).json({ error: true, errorMessage: 'Internal Server Error' })
    }

})

module.exports = router;