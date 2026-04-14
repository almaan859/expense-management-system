const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const pool = require("./src/db");

const {
  extractReceiptText,
  extractAmount
} = require("./src/services/ocrService");
const ruleEngine = require("./src/services/ruleEngine");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const SECRET = "secret123";


/*
=====================
GLOBAL RULES ENGINE
=====================
*/

let rules = {
  autoApproveLimit: 0,
  escalationDays: 0
};


/*
=====================
FILE UPLOAD CONFIG
=====================
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


/*
=====================
JWT VERIFY FUNCTION
=====================
*/

function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, SECRET);

    req.user = decoded;

    next();

  } catch {

    res.status(401).json({ message: "Invalid token" });

  }
}


/*
=====================
CREATE USER
=====================
*/

app.post("/users", async (req, res) => {

  try {

    const { name, email, password, role, department } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name,email,password,role,department) VALUES (?,?,?,?,?)",
      [name, email, hashedPassword, role, department]
    );

    res.json({ message: "User created successfully" });

  } catch (err) {

    console.log(err);

    res.status(500).json({ message: "User creation failed" });

  }

});


/*
=====================
LOGIN
=====================
*/

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET
    );

    res.json({
      token,
      role: user.role,
      user_id: user.id
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({ message: "Login failed" });

  }

});


/*
=====================
ADMIN UPDATE RULES - NOW PERSISTS TO DB
=====================
*/

app.post("/rules", async (req, res) => {
  try {
    const autoApproveLimit = Number(req.body.autoApproveLimit);
    const escalationDays = Number(req.body.escalationDays);

    await pool.query(
      `INSERT INTO approval_rules (auto_approve_limit, escalation_days) 
       VALUES (?, ?) ON DUPLICATE KEY UPDATE 
       auto_approve_limit=VALUES(auto_approve_limit), 
       escalation_days=VALUES(escalation_days)`,
      [autoApproveLimit, escalationDays]
    );

    console.log(`Rules updated in DB: limit=${autoApproveLimit}, days=${escalationDays}`);

    res.json({
      message: "Rules updated successfully",
      rules: { auto_approve_limit: autoApproveLimit, escalation_days: escalationDays }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Rules update failed" });
  }
});


/*
=====================
EMPLOYEE SUBMIT EXPENSE
WITH OCR VALIDATION
=====================
*/

app.post(
  "/employee/submit-expense",
  verifyToken,
  upload.single("receipt"),
  async (req, res) => {

    try {

      const { amount, category, description } = req.body;

      const submittedAmount = Number(amount);

      const receiptFile = req.file ? req.file.filename : null;

      let status = "pending";
      let verification_status = "manual-review";
      let receiptAmount = null;



/*
=====================
OCR PROCESSING START
=====================
*/

      if (receiptFile) {

        const imagePath = `uploads/${receiptFile}`;

        const extractedText =
          await extractReceiptText(imagePath);

        receiptAmount =
          extractAmount(extractedText);


/*
=====================
OCR MATCH CHECK
=====================
*/

        console.log(`OCR Debug: submitted=${submittedAmount}, receiptAmount=${receiptAmount}, receiptFile=${receiptFile}`);

const [dbRules] = await pool.query("SELECT auto_approve_limit FROM approval_rules LIMIT 1");
        const adminLimit = Number(dbRules[0]?.auto_approve_limit || 0);
        console.log(`Admin limit: ${adminLimit}`);

        if (receiptAmount !== null && receiptAmount < adminLimit) {
          status = "approved";
          verification_status = "auto-ai-verified";
          console.log('AI AUTO-APPROVED (OCR total < limit)');
        } else {
          status = "pending";
          verification_status = "ai-flagged";
          console.log('AI flagged for manager review');
        }

      }


/*
=====================
SAVE TO DATABASE
=====================
*/

      await pool.query(
        `INSERT INTO expenses
        (amount,category,description,user_id,receipt,status,receipt_amount,verification_status)
        VALUES (?,?,?,?,?,?,?,?)`,
        [
          submittedAmount,
          category,
          description,
          req.user.id,
          receiptFile,
          status,
          receiptAmount,
          verification_status
        ]
      );


/*
=====================
RESPONSE TO FRONTEND
=====================
*/

      res.json({
        message: "Expense submitted successfully",
        status,
        verification_status,
        receiptAmount
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Submission failed"
      });

    }

  }
);


/*
=====================
EMPLOYEE VIEW EXPENSES
=====================
*/

app.get(
  "/employee/expenses",
  verifyToken,
  async (req, res) => {

    try {

      const [rows] = await pool.query(
        "SELECT * FROM expenses WHERE user_id=?",
        [req.user.id]
      );

      res.json(rows);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Fetch failed"
      });

    }

  }
);


/*
=====================
MANAGER VIEW PENDING
=====================
*/

app.get("/expenses/pending", async (req, res) => {

  const [rows] = await pool.query(
    "SELECT * FROM expenses WHERE status='pending'"
  );

  res.json(rows);

});


/*
=====================
MANAGER APPROVE
=====================
*/

app.post("/expenses/:id/approve", async (req, res) => {

  await pool.query(
    "UPDATE expenses SET status='approved' WHERE id=?",
    [req.params.id]
  );

  res.json({ message: "Expense approved" });

});


/*
=====================
MANAGER REJECT
=====================
*/

app.post("/expenses/:id/reject", async (req, res) => {

  await pool.query(
    "UPDATE expenses SET status='rejected' WHERE id=?",
    [req.params.id]
  );

  res.json({ message: "Expense rejected" });

});


/*
=====================
SERVER START
=====================
*/

app.listen(4000, () => {
  console.log("Server running on port 4000");
});