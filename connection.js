const mysql = require('mysql2');
require('dotenv').config();


const connection = mysql.createConnection({
    host: process.env.HOST_NAME,
    user: process.env.USER_NAME,
    password: process.env.USER_KEY,
    database: process.env.DB_NAME

  });
  connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;