const mysql = require('mysql2');

// createConnection creates single connection and could be inefficient
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'max_node',
  password: 'mysql@888',
});

module.exports = pool.promise();