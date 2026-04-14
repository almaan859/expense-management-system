import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [rules, setRules] = useState({ autoApproveLimit: 1000, escalationDays: 2 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      // Mock for now - implement /rules GET endpoint later
      setRules({ autoApproveLimit: 1000, escalationDays: 2 });
    } catch (err) {
      console.log(err);
    }
  };

  const updateRules = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:4000/rules", rules);
      alert("Rules updated! Restart server if needed.");
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="container">
      <div className="glass-card" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div className="holo-title" style={{ fontSize: '2rem' }}>⚙️ Admin Control Center</div>
          <button onClick={logout} className="btn-neon" style={{ padding: '12px 24px' }}>
            Logout
          </button>
        </div>

        <div className="form-grid">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>
              AI Auto-Approval Limit (₹)
            </label>
            <div className="input-glow">
              <input
                type="number"
                value={rules.autoApproveLimit}
                onChange={(e) => setRules({ ...rules, autoApproveLimit: parseFloat(e.target.value) || 0 })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>
              Escalation Days
            </label>
            <div className="input-glow">
              <input
                type="number"
                value={rules.escalationDays}
                onChange={(e) => setRules({ ...rules, escalationDays: parseInt(e.target.value) || 0 })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={updateRules}
          disabled={loading}
          className="btn-neon"
          style={{ 
            width: '100%', 
            padding: '20px', 
            fontSize: '20px', 
            fontWeight: '700',
            background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'
          }}
        >
          {loading ? '⚙️ Updating...' : '⚙️ Update AI Rules'}
        </button>

        <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '1.4rem', color: '#10b981', marginBottom: '12px', fontWeight: '600' }}>
            🎯 Current AI Settings
          </div>
          <div style={{ display: 'flex', gap: '40px', fontSize: '1.1rem' }}>
            <div>
              <strong>Auto-Approve:</strong> <span style={{ color: '#10b981' }}>₹{rules.autoApproveLimit}</span>
            </div>
            <div>
              <strong>Escalation:</strong> <span style={{ color: '#f59e0b' }}>{rules.escalationDays} days</span>
            </div>
          </div>
          <div style={{ marginTop: '16px', color: '#a0a0a0', fontSize: '0.95rem' }}>
            Receipts under Rs{rules.autoApproveLimit} auto-approved by AI OCR. Pending over {rules.escalationDays} days auto-escalate
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="holo-title" style={{ fontSize: '1.8rem', marginBottom: '24px' }}>📈 System Stats</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', color: '#3b82f6' }}>🤖</div>
            <div style={{ fontSize: '1.6rem', marginBottom: '8px', color: '#ffffff' }}>AI OCR Active</div>
            <div style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: '600' }}>42.5 / 100 scans</div>
          </div>
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', color: '#10b981' }}>✅</div>
            <div style={{ fontSize: '1.6rem', marginBottom: '8px', color: '#ffffff' }}>Auto-Approved</div>
            <div style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: '600' }}>89%</div>
          </div>
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', color: '#f59e0b' }}>⏳</div>
            <div style={{ fontSize: '1.6rem', marginBottom: '8px', color: '#ffffff' }}>Manager Review</div>
            <div style={{ color: '#f59e0b', fontSize: '1.2rem', fontWeight: '600' }}>11%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
