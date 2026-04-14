import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:4000/employee/expenses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const submitExpense = async () => {
    if (!amount || !category || !description) {
      alert("Please fill all fields");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("category", category);
      formData.append("description", description);
      if (receipt) formData.append("receipt", receipt);

      const res = await axios.post(
        "http://localhost:4000/employee/submit-expense",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert(`Success! Status: ${res.data.status || 'approved'} | AI OCR: ${res.data.receiptAmount || 'N/A'}`);
      
      setAmount("");
      setCategory("");
      setDescription("");
      setReceipt(null);
      fetchExpenses();

    } catch (err) {
      console.error(err);
      alert(`Failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container">
      <div className="glass-card" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div className="holo-title" style={{ fontSize: '2rem' }}>💳 Submit Expense</div>
          <button onClick={logout} className="btn-neon" style={{ padding: '12px 24px' }}>
            Logout
          </button>
        </div>

        <div className="form-grid">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Amount (₹)</label>
            <div className="input-glow">
              <input
                type="number"
                placeholder="180.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={uploading}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Category</label>
            <div className="input-glow">
              <input
                placeholder="Food, Travel, etc."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={uploading}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Description</label>
            <div className="input-glow">
              <input
                placeholder="Quick lunch at restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Receipt (AI OCR Auto-Approval)</label>
            <div className="input-glow" style={{ padding: '16px', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceipt(e.target.files[0])}
                disabled={uploading}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'inherit', 
                  width: '100%' 
                }}
              />
              {receipt && <span style={{ marginLeft: '16px', color: '#10b981' }}>✅ {receipt.name}</span>}
            </div>
          </div>
        </div>

        <button 
          onClick={submitExpense} 
          disabled={uploading || !amount || !category || !description}
          className="btn-neon"
          style={{ 
            width: '100%', 
            padding: '20px', 
            fontSize: '20px', 
            fontWeight: '700' 
          }}
        >
          {uploading ? (
            <>
              <span style={{ marginRight: '12px' }}>⚡</span>
              AI Processing OCR...
            </>
          ) : (
            <>
              <span style={{ marginRight: '12px' }}>🤖</span>
              Submit → AI Auto-Approve
            </>
          )}
        </button>

        <div style={{ marginTop: '24px', textAlign: 'center', color: '#a0a0a0', fontSize: '14px' }}>
          AI scans receipt and auto-approves under Rs1000 instantly!
        </div>
      </div>

      <div className="glass-card table-modern">
        <div className="holo-title" style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'left' }}>📊 Your Expenses</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '20px 16px', textAlign: 'left', color: '#ffffff' }}>Amount</th>
              <th style={{ padding: '20px 16px', textAlign: 'left', color: '#ffffff' }}>Status</th>
              <th style={{ padding: '20px 16px', textAlign: 'left', color: '#ffffff' }}>AI OCR</th>
              <th style={{ padding: '20px 16px', textAlign: 'left', color: '#ffffff' }}>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 16px' }}>
                  <strong>₹{exp.amount}</strong>
                </td>
                <td style={{ padding: '20px 16px' }}>
                  <span className={`status-${exp.status}`} style={{ 
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    fontSize: '14px', 
                    fontWeight: '600' 
                  }}>
                    {exp.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '20px 16px', color: '#a0a0a0' }}>
                  {exp.receipt_amount ? `₹${exp.receipt_amount}` : 'No OCR'}
                </td>
                <td style={{ padding: '20px 16px' }}>
                  {exp.receipt ? (
                    <img
                      src={`http://localhost:4000/uploads/${exp.receipt}`}
                      alt="receipt"
                      className="receipt-thumb"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  ) : (
                    <span style={{ color: '#a0a0a0' }}>No receipt</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a0a0a0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📈</div>
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No expenses yet</div>
            <div>Submit your first receipt → AI auto-approves instantly!</div>
          </div>
        )}
      </div>
    </div>
  );
}
