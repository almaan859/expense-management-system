import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [rules, setRules] = useState({ autoApproveLimit: 1000, escalationDays: 2 });
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "employee", department: "" });
  const [creating, setCreating] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    fetchRules();
    fetchUsers();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchRules = async () => {
    try {
      const res = await axios.get("http://localhost:4000/rules", getAuthHeaders());
      setRules({
        autoApproveLimit: Number(res.data.auto_approve_limit) || 1000,
        escalationDays: Number(res.data.escalation_days) || 2
      });
    } catch (err) {
      console.log(err);
      setRules({ autoApproveLimit: 1000, escalationDays: 2 });
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/users", getAuthHeaders());
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const updateRules = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/rules", rules, getAuthHeaders());
      if (res.data?.rules) {
        setRules({
          autoApproveLimit: Number(res.data.rules.auto_approve_limit) || rules.autoApproveLimit,
          escalationDays: Number(res.data.rules.escalation_days) || rules.escalationDays
        });
      }
      alert("Rules updated!");
      fetchRules();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill in name, email, and password.");
      return;
    }

    setCreating(true);
    try {
      await axios.post("http://localhost:4000/users", newUser, getAuthHeaders());
      alert(`Created ${newUser.role} successfully`);
      setNewUser({ name: "", email: "", password: "", role: "employee", department: "" });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "User creation failed");
    } finally {
      setCreating(false);
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

      <div className="glass-card" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div className="holo-title" style={{ fontSize: '2rem' }}>👤 Create New Team Member</div>
        </div>

        <div className="form-grid">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Name</label>
            <div className="input-glow">
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Email</label>
            <div className="input-glow">
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Password</label>
            <div className="input-glow">
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Role</label>
            <div className="input-glow">
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Department</label>
            <div className="input-glow">
              <input
                type="text"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={createUser}
          disabled={creating}
          className="btn-neon"
          style={{ width: '100%', padding: '20px', fontSize: '20px', fontWeight: '700', marginTop: '20px' }}
        >
          {creating ? 'Creating user...' : 'Create User'}
        </button>
      </div>

      <div className="glass-card" style={{ marginBottom: '40px' }}>
        <div className="holo-title" style={{ fontSize: '2rem', marginBottom: '24px' }}>👥 Team Members</div>
        {usersLoading ? (
          <div style={{ padding: '40px', color: '#a0a0a0' }}>Loading users...</div>
        ) : (
          <div className="table-modern" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#ffffff' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#ffffff' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#ffffff' }}>Role</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#ffffff' }}>Department</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#ffffff' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px', color: '#ffffff' }}>{user.name}</td>
                    <td style={{ padding: '16px', color: '#a0a0a0' }}>{user.email}</td>
                    <td style={{ padding: '16px', color: '#ffffff' }}>{user.role}</td>
                    <td style={{ padding: '16px', color: '#a0a0a0' }}>{user.department || '—'}</td>
                    <td style={{ padding: '16px', color: '#a0a0a0' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
