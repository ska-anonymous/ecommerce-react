const express = require('express');
const router = express.Router();
const { expressjwt } = require('express-jwt');
const secretKey = require('../key');
// db object
const client = require('../db');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/products_images/');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
})

const uploads = multer({ storage });

// send a limit of random products from products table for browsing
router.get('/', async (req, res) => {

    try {
        const selectQuery = "SELECT * FROM products ORDER BY RANDOM() LIMIT 20";
        const result = await client.query(selectQuery, []);
        res.json({ error: false, products: result.rows });
    } catch (err) {
        console.log('Failed to fetch products from db ', err);
        res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
    }

})

// send a limit of products from products table based on search
router.get('/findproducts', async (req, res) => {
    let searchValue = (req.query.search).trim() || '';
    try {
        const selectQuery = `
        SELECT
            p.*
        FROM
            products p
        LEFT JOIN
            categories c
        ON
            p.categoryid = c.id
        WHERE
            p.name ILIKE $1 OR
            c.name ILIKE $1
        ORDER BY
            RANDOM()
        LIMIT 20;    
        `;

        const result = await client.query(selectQuery, [`%${searchValue}%`]);
        res.json({ error: false, products: result.rows });
    } catch (err) {
        console.log('Failed to fetch products ', err);
        res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
    }
})

// route for admin to get all products list
router.get('/all', expressjwt({ secret: secretKey, algorithms: ['HS256'] }), async (req, res) => {
    // check if the user is not admin
    if (req.auth.role != 'admin') {
        return res.status(403).json({ error: true, errorMessage: 'Admin privileges required' });
    }

    // now get data from admin
    try {
        const selectQuery = "SELECT * FROM products";
        const result = await client.query(selectQuery);
        res.json({ error: false, products: result.rows });
    } catch (err) {
        console.log('Failed to fetch products ', err);
        res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
    }

})

// route for admin for adding new product
router.post('/add-product', expressjwt({ secret: secretKey, algorithms: ['HS256'] }), (req, res) => {
    if (req.auth.role != 'admin')
        return res.status(403).json({ error: true, errorMessage: 'Admin Privileges required' });

    // handle file upload here after the user is verified to be admin
    uploads.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: true, errorMessage: 'Error Uploading file' });
        }

        // now insert data into database using an async function
        const { name, description, category, price } = req.body;
        const image = req.file.filename;

        try {
            const result = await client.query("INSERT INTO public.products(name, description, price, image, categoryid) VALUES ($1, $2, $3, $4, $5);", [name, description, price, image, category]);
            res.json({ error: false });
        } catch (err) {
            console.log('Failed to Add New product', err);
            res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
        }
    });
})

// route for deleting a product
router.get('/delete/:productId', expressjwt({ secret: secretKey, algorithms: ['HS256'] }), async (req, res) => {
    // check if the user is not admin
    if (req.auth.role != 'admin') {
        return res.status(403).json({ error: true, errorMessage: 'Admin privileges required' });
    }

    const productId = req.params.productId;

    let imagePath;
    // first get the product image path from database so to delete the image also
    try {
        const result = await client.query("SELECT image FROM products WHERE id = $1", [productId]);
        imagePath = result.rows[0].image;
    } catch (err) {
        return res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
    }

    fs.unlink('public/products_images/' + imagePath, async (err) => {
        if (err) {
            console.log('Failed to delete product ', err);
            return res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
        }

        // now delete the product using its id
        try {
            const deleteQuery = "DELETE FROM products WHERE id = $1";
            const result = await client.query(deleteQuery, [productId]);
            if (result.rowCount > 0) {
                res.json({ error: false });
            } else {
                res.json({ error: true, errorMessage: 'Failed to delete the product. Please try Again' });
            }
        } catch (err) {
            console.log('Failed to delete product ', err);
            res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
        }
    });

})

// route for product update
router.post('/update-product', expressjwt({ secret: secretKey, algorithms: ['HS256'] }), async (req, res) => {
    // check if the user is not admin
    if (req.auth.role != 'admin') {
        return res.status(403).json({ error: true, errorMessage: 'Admin privileges required' });
    }

    uploads.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: true, errorMessage: 'Error Uploading file' });
        }

        // now insert data into database using an async function
        const { name, description, category, price, productid, oldimage } = req.body;
        const image = req.file ? req.file.filename : oldimage;

        try {
            const result = await client.query("UPDATE products SET name=$1, description=$2, price=$3, image=$4, categoryid=$5 WHERE id=$6;", [name, description, price, image, category, productid]);
            res.json({ error: false });
        } catch (err) {
            res.status(500).json({ error: true, errorMessage: 'Internal Server Error' });
        }
    });


})

module.exports = router;