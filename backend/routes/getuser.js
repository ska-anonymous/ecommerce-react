const express = require('express');
const router = express.Router();
const { expressjwt } = require('express-jwt');
const secretKey = require('../key');
// db object
const client = require('../db');

router.get('/', expressjwt({ secret: secretKey, algorithms: ['HS256'] }), async (req, res) => {
    const userId = req.auth.id;
    const result = await client.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (result.rowCount == 0)
        return res.status(498).json({ error: true, errorMessage: 'Token Expired or is Invalid Please Login again to get token' });

    const user = result.rows[0];
    delete user.password;

    res.json({ error: false, user });

})


// route for admin to get all users info
router.get('/all', expressjwt({ secret: secretKey, algorithms: ['HS256'] }), async (req, res) => {
    if (req.auth.role != 'admin')
        return res.status(403).json({ error: true, errorMessage: 'Admin Privileges Required' });

    try {
        const result = await client.query('SELECT name, email, role, createdat FROM users');
        res.json({ error: false, users: result.rows });
    } catch (err) {
        res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
    }
})

module.exports = router;