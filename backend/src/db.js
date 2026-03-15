const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'expense_user',
  password: 'Expense@123',
  database: 'expense_mvp'
});

module.exports = pool;