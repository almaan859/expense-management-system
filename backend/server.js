const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const auth = require('./src/middleware/auth');
const role = require('./src/middleware/role');
const pool = require('./src/db');

const app = express();

/* ============================
   MIDDLEWARE
============================ */

app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());

/* ============================
   TEST ROUTE
============================ */

app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1+1 AS result');
    res.send("DB Connected. Result: " + rows[0].result);
  } catch (err) {
    console.error(err);
    res.send("DB connection failed");
  }
});

/* ============================
   CREATE USER
============================ */

app.post('/users', async (req, res) => {

  try {

    const { name, email, password, role, department } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name,email,password,role,department)
       VALUES (?,?,?,?,?)`,
      [name,email,hashedPassword,role,department]
    );

    res.send("User created");

  } catch (err) {

    console.error(err);
    res.send("Error creating user");

  }

});

/* ============================
   LOGIN
============================ */

app.post('/login', async (req,res)=>{

  try{

    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if(rows.length===0){
      return res.send("User not found");
    }

    const user = rows[0];

    const match = await bcrypt.compare(password,user.password);

    if(!match){
      return res.send("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id:user.id,
        role:user.role,
        department:user.department
      },
      process.env.JWT_SECRET,
      { expiresIn:"1h" }
    );

    res.json({
      message:"Login successful",
      token
    });

  }
  catch(err){

    console.error(err);
    res.send("Login error");

  }

});

/* ============================
   SUBMIT EXPENSE
============================ */

app.post('/expenses', auth, async(req,res)=>{

  try{

    const { amount, category, description } = req.body;

    await pool.query(
      `INSERT INTO expenses
       (user_id,amount,category,description,department,status)
       VALUES (?,?,?,?,?,'pending')`,
      [
        req.user.id,
        amount,
        category,
        description,
        req.user.department
      ]
    );

    res.send("Expense submitted");

  }
  catch(err){

    console.error(err);
    res.send("Error submitting expense");

  }

});

/* ============================
   EMPLOYEE VIEW OWN EXPENSES
============================ */

app.get('/expenses/my', auth, async(req,res)=>{

  try{

    const [rows] = await pool.query(
      "SELECT * FROM expenses WHERE user_id=?",
      [req.user.id]
    );

    res.json(rows);

  }
  catch(err){

    console.error(err);
    res.send("Error fetching expenses");

  }

});

/* ============================
   MANAGER VIEW PENDING
============================ */

app.get('/expenses/pending', auth, role('manager'), async(req,res)=>{

  try{

    const [rows] = await pool.query(
      `SELECT * FROM expenses
       WHERE status='pending'
       AND department=?`,
      [req.user.department]
    );

    res.json(rows);

  }
  catch(err){

    console.error(err);
    res.send("Error fetching expenses");

  }

});

/* ============================
   MANAGER APPROVE
============================ */

app.put('/expenses/:id/approve', auth, role('manager'), async(req,res)=>{

  try{

    const expenseId = req.params.id;

    const [result] = await pool.query(
      `UPDATE expenses
       SET status='manager_approved',
       approved_by=?,
       approved_at=NOW()
       WHERE id=?`,
      [req.user.id,expenseId]
    );

    if(result.affectedRows===0){
      return res.send("Expense not found");
    }

    res.send("Expense approved by manager");

  }
  catch(err){

    console.error(err);
    res.send("Error approving expense");

  }

});

/* ============================
   ADMIN FINAL APPROVAL
============================ */

app.put('/expenses/:id/final-approve', auth, role('admin'), async(req,res)=>{

  try{

    const expenseId = req.params.id;

    await pool.query(
      `UPDATE expenses
       SET status='approved'
       WHERE id=?`,
      [expenseId]
    );

    res.send("Final approval done");

  }
  catch(err){

    console.error(err);
    res.send("Error approving expense");

  }

});

/* ============================
   ADMIN RULE UPDATE
============================ */

app.put('/admin/update-rules', auth, role('admin'), async(req,res)=>{

  try{

    const { auto_approve_limit, escalation_days } = req.body;

    await pool.query(
      `UPDATE system_rules
       SET auto_approve_limit=?,
       escalation_days=?
       WHERE id=1`,
      [auto_approve_limit,escalation_days]
    );

    res.send("Rules updated");

  }
  catch(err){

    console.error(err);
    res.send("Rule update failed");

  }

});

/* ============================
   START SERVER
============================ */

app.listen(4000, ()=>{

  console.log("Running on port 4000");

});