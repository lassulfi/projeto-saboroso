const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'saboroso',
    password: 'root',
    port: 3390,
    multipleStatements: true
});

module.exports = connection;