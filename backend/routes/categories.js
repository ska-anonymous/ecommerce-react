const express = require('express');
const router = express.Router();
const secretKey = require('../key');
const { expressjwt } = require('express-jwt');
// db object
const client = require('../db.js');

router.get('/', expressjwt({ secret: secretKey, algorithms: ['HS256'] }), async (req, res) => {
    // check if the user is not admin
    if (req.auth.role != 'admin') {
        return res.status(403).json({ error: true, errorMessage: 'Admin privileges required' });
    }

    // now fetch categories
    try {
        const selectQuery = "SELECT * FROM categories";
        const result = await client.query(selectQuery);
        res.json({ error: false, categories: result.rows });
    } catch (err) {
        console.log('failed to get categories ', err);
        res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
    }

})


module.exports = router;