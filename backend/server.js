require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const pool = require('./src/db');
const auth = require('./src/middleware/auth');
const role = require('./src/middleware/role');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// ================= TEST ROUTE =================
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.send("DB Connected. Result: " + rows[0].result);
  } catch (err) {
    console.error(err);
    res.send("DB connection failed");
  }
});


// ================= CREATE USER =================
app.post('/users', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, department]
    );

    res.send("User created");
  } catch (err) {
    console.error(err);
    res.send("Error creating user");
  }
});


// ================= LOGIN =================
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.send("User not found");
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, department: user.department },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1h' }
    );

    res.json({ message: "Login successful", token });

  } catch (err) {
    console.error(err);
    res.send("Login error");
  }
});


// ================= SUBMIT EXPENSE =================
app.post('/expenses', auth, async (req, res) => {
  try {
    const { amount, category, description } = req.body;

    await pool.query(
      'INSERT INTO expenses (user_id, amount, category, description, status, department) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, amount, category, description, 'pending', req.user.department]
    );

    res.send("Expense submitted");
  } catch (err) {
    console.error(err);
    res.send("Error submitting expense");
  }
});


// ================= GET USER EXPENSES =================
app.get('/expenses', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM expenses WHERE user_id = ?',
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.send("Error fetching expenses");
  }
});


// ================= MANAGER: VIEW PENDING =================
app.get('/expenses/pending', auth, role('manager'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM expenses WHERE status = 'pending'"
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.send("Error fetching pending expenses");
  }
});


// ================= MANAGER: APPROVE =================
app.put('/expenses/:id/approve', auth, role('manager'), async (req, res) => {
  try {
    const expenseId = req.params.id;

    await pool.query(
      "UPDATE expenses SET status = 'manager_approved', approved_by = ?, approved_at = NOW() WHERE id = ?",
      [req.user.id, expenseId]
    );

    res.send("Approved");
  } catch (err) {
    console.error(err);
    res.send("Error approving");
  }
});


// ================= MANAGER: REJECT =================
app.put('/expenses/:id/reject', auth, role('manager'), async (req, res) => {
  try {
    const expenseId = req.params.id;

    await pool.query(
      "UPDATE expenses SET status = 'rejected' WHERE id = ?",
      [expenseId]
    );

    res.send("Rejected");
  } catch (err) {
    console.error(err);
    res.send("Error rejecting");
  }
});


// ================= ADMIN RULES =================
app.put('/admin/update-rules', auth, role('admin'), async (req, res) => {
  try {
    const { auto_approve_limit, escalation_days } = req.body;

    await pool.query(
      "UPDATE rules SET auto_approve_limit = ?, escalation_days = ? WHERE id = 1",
      [auto_approve_limit, escalation_days]
    );

    res.send("Rules updated");
  } catch (err) {
    console.error(err);
    res.send("Rule update failed");
  }
});


// ================= START SERVER =================
app.listen(4000, () => {
  console.log("🚀 Running on port 4000");
});