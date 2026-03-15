const pool = require('../db');

async function getRules() {
  const [rows] = await pool.query("SELECT * FROM approval_rules LIMIT 1");
  return rows[0];
}

async function shouldAutoApprove(amount) {
  const rules = await getRules();
  return amount < rules.auto_approve_limit;
}

async function shouldEscalate(createdAt) {
  const rules = await getRules();
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
  return diffDays >= rules.escalation_days;
}

module.exports = {
  shouldAutoApprove,
  shouldEscalate
};
