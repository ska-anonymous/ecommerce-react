const express = require('express');
const app = express();
const port = process.env.PORT_NO || 8081;
const cors = require('cors');


// allow cross origin resource sharing
app.use(cors());

// static files
app.use(express.static('public'));

// use body parser
app.use(express.json());

// available routes
app.use('/products', require('./routes/products'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/login'))
app.use('/getuser', require('./routes/getuser'));
app.use('/order', require('./routes/order'));
app.use('/categories', require('./routes/categories'));

// custom handle the experss jwt error
app.use(function (err, req, res, next) {
    res.json({ error: true, errorMessage: 'invalid token' });
});

app.get('/', (req, res) => {
    res.send('<h2>This is home route</h2>')
})

app.listen(port, () => {
    console.log('server is listening on http://localhost:' + port)
})
