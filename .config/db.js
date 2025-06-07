const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config()

// Connections
const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASSWORD,
    database: process.env.DBNAME
})

conn.connect((err) => {
    if (err) throw err;
    console.log("DB Connected successfully")
})

function runDB(query) {
    return new Promise((resolve, reject) => {
        conn.query(query, (err, result) => {
            if (err) return reject(err)
            return resolve(result)
        })
    });
}

module.exports = { conn, runDB }