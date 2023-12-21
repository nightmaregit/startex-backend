const mysql = require('mysql2')
const db  =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_perpus',
    password: ''
})

module.exports = db