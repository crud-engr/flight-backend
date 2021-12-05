const mysql = require('mysql');
require('dotenv').config();

let connection = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    }
)
   
module.exports = connection;
