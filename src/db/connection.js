const mysql = require('mysql2');
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:  process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10, // Limit simultaneous connections
    queueLimit: 0,
});
// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Connection failed:', err.message);
//     } else {
//         console.log('Connected to the database with null password');
//         connection.release();
//     }
//     pool.end();
// });
// Promisify the connection for async/await usage
const promisePool = pool.promise();

module.exports = promisePool;
