const express = require('express');
const router = express.Router();
const { expressjwt } = require('express-jwt');
const secretKey = require('../key');
// db object
const client = require('../db');

const format = require('pg-format');

router.post('/', expressjwt({ secret: secretKey, algorithms: ['HS256'] }), async (req, res) => {
    const data = req.body;
    const userId = req.auth.id;

    const dataArray = data.map((doc) => {
        return [userId, doc.productid, doc.quantity, doc.price, 'ORDERED'];
    });

    try {
        await client.query(format("INSERT INTO orders (userid, productid, quantity, totalprice, status) VALUES %L", dataArray), []);
        res.json({ error: false });
    } catch (err) {
        console.log('Failed to insert orders ', err);
        res.status(500).json({ error: true, errorMessage: 'Internal Server Error' })
    }



})

router.get('/getorders', expressjwt({ secret: secretKey, algorithms: ['HS256'] }), async (req, res) => {
    const userId = req.auth.id;

    try {
        let selectQuery;
        let queryData = [];
        if (req.auth.role != 'admin') {
            selectQuery = `
            SELECT
                o.quantity,
                o.totalprice,
                o.status,
                o.createdat,
                p.image,
                p.name
            FROM
                orders o
            INNER JOIN
                products p
            ON
                o.productid = p.id
            WHERE o.userid = $1
            `;
            queryData = [userId]
        } else {
            selectQuery = `
            SELECT
                o.*,
                u.name AS username,
                p.name AS productname,
                p.image AS productimage
            FROM
                orders o
            INNER JOIN
                users u
            ON
                o.userid = u.id
            INNER JOIN
                products p
            ON
                o.productid = p.id;
            `;
        }

        const result = await client.query(selectQuery, queryData);
        res.json({ error: false, orders: result.rows });
    } catch (err) {
        console.log('Failed to fetch orders from db ', err);
        res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
    }
})

module.exports = router;