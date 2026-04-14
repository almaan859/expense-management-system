import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManagerDashboard() {
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get("http://localhost:4000/expenses/pending");
      setPendingExpenses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const approveExpense = async (id) => {
    try {
      await axios.post(`http://localhost:4000/expenses/${id}/approve`);
      fetchPending();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectExpense = async (id) => {
    try {
      await axios.post(`http://localhost:4000/expenses/${id}/reject`);
      fetchPending();
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div className="holo-title" style={{ fontSize: '3rem' }}>📊</div>
          <div>Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="glass-card" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div className="holo-title" style={{ fontSize: '2rem' }}>
            👨‍💼 Manager Dashboard
            <span style={{ fontSize: '1rem', color: '#a0a0a0', marginLeft: '16px' }}>
              {pendingExpenses.length} pending
            </span>
          </div>
          <button onClick={logout} className="btn-neon" style={{ padding: '12px 24px' }}>
            Logout
          </button>
        </div>

        {pendingExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', color: '#10b981' }}>
            <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🎉</div>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>No Pending Expenses!</div>
            <div style={{ color: '#a0a0a0', fontSize: '1.2rem' }}>
              AI OCR auto-approved all small receipts
              <br />
              <span style={{ color: '#10b981' }}>Zero manual review needed! 🚀</span>
            </div>
          </div>
        ) : (
          <div className="table-modern" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '20px 16px', textAlign: 'left', color: '#ffffff' }}>Employee</th>
                  <th style={{ padding: '20px 16px', textAlign: 'left', color: '#ffffff' }}>Amount</th>
                  <th style={{ padding: '20px 16px', textAlign: 'left', color: '#ffffff' }}>AI OCR</th>
                  <th style={{ padding: '20px 16px', textAlign: 'left', color: '#ffffff' }}>Status</th>
                  <th style={{ padding: '20px 16px', textAlign: 'left', color: '#ffffff' }}>Receipt</th>
                  <th style={{ padding: '20px 16px', textAlign: 'center', color: '#ffffff' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingExpenses.map((exp) => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ fontWeight: '600', color: '#ffffff' }}>{exp.description || 'N/A'}</div>
                      <div style={{ color: '#a0a0a0', fontSize: '14px' }}>ID: {exp.user_id}</div>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <strong style={{ color: '#3b82f6', fontSize: '1.3rem' }}>₹{exp.amount}</strong>
                    </td>
                    <td style={{ padding: '20px 16px', color: exp.receipt_amount ? '#10b981' : '#a0a0a0' }}>
                      {exp.receipt_amount ? `₹${exp.receipt_amount}` : 'No OCR'}
                      {exp.verification_status && (
                        <div style={{ fontSize: '12px', color: '#a0a0a0' }}>
                          {exp.verification_status}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <span className="status-pending" style={{ 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        fontSize: '14px' 
                      }}>
                        AI Flagged
                      </span>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      {exp.receipt ? (
                        <img
                          src={`http://localhost:4000/uploads/${exp.receipt}`}
                          alt="receipt"
                          className="receipt-thumb"
                          style={{ cursor: 'pointer' }}
                          onClick={() => window.open(`http://localhost:4000/uploads/${exp.receipt}`, '_blank')}
                          onError={(e) => e.target.src = '/placeholder-receipt.jpg'}
                        />
                      ) : (
                        <span style={{ color: '#a0a0a0' }}>No receipt</span>
                      )}
                    </td>
                    <td style={{ padding: '20px 8px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => approveExpense(exp.id)}
                          className="btn-neon"
                          style={{ 
                            padding: '10px 20px', 
                            fontSize: '14px',
                            background: 'linear-gradient(45deg, #10b981, #059669)'
                          }}
                        >
                          ✅ Approve
                        </button>
                        <button 
                          onClick={() => rejectExpense(exp.id)}
                          className="btn-neon"
                          style={{ 
                            padding: '10px 20px', 
                            fontSize: '14px',
                            background: 'linear-gradient(45deg, #ef4444, #dc2626)'
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
