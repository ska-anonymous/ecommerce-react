const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'onlineshopping',
  password: 'postgre16',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Postgresql Successfully");
});

module.exports = client;