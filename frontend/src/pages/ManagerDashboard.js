import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManagerDashboard() {
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [assistant, setAssistant] = useState({ summary: "", suggestion: "" });
  const [searching, setSearching] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", password: "", department: "" });
  const [creating, setCreating] = useState(false);
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    fetchPending();
    fetchTeam();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchTeam = async () => {
    setTeamLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/users", getAuthHeaders());
      setTeam(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setTeamLoading(false);
    }
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/expenses/pending", getAuthHeaders());
      setPendingExpenses(res.data.expenses || []);
      setAssistant(res.data.assistant || { summary: "", suggestion: "" });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const searchExpenses = async () => {
    if (!searchQuery.trim()) {
      fetchPending();
      return;
    }

    setSearching(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/expenses/search?query=${encodeURIComponent(searchQuery)}`,
        getAuthHeaders()
      );
      setPendingExpenses(res.data.expenses || []);
      setAssistant(res.data.assistant || { summary: "", suggestion: "" });
    } catch (err) {
      console.log(err);
      setAssistant({ summary: "Search failed. Please try again.", suggestion: "" });
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  const approveExpense = async (id) => {
    try {
      await axios.post(`http://localhost:4000/expenses/${id}/approve`, {}, getAuthHeaders());
      searchQuery.trim() ? searchExpenses() : fetchPending();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectExpense = async (id) => {
    try {
      await axios.post(`http://localhost:4000/expenses/${id}/reject`, {}, getAuthHeaders());
      searchQuery.trim() ? searchExpenses() : fetchPending();
    } catch (err) {
      console.log(err);
    }
  };

  const createEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.password) {
      alert("Please fill in name, email, and password.");
      return;
    }

    setCreating(true);
    try {
      await axios.post("http://localhost:4000/users", { ...newEmployee, role: "employee" }, getAuthHeaders());
      alert("Employee created successfully");
      setNewEmployee({ name: "", email: "", password: "", department: "" });
      fetchTeam();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create employee");
    } finally {
      setCreating(false);
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
              {searchQuery.trim() ? `${pendingExpenses.length} result${pendingExpenses.length === 1 ? '' : 's'}` : `${pendingExpenses.length} pending`}
            </span>
          </div>
          <button onClick={logout} className="btn-neon" style={{ padding: '12px 24px' }}>
            Logout
          </button>
        </div>

        <div className="form-grid" style={{ marginBottom: '32px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Name</label>
            <div className="input-glow">
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Email</label>
            <div className="input-glow">
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Password</label>
            <div className="input-glow">
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '14px' }}>Department</label>
            <div className="input-glow">
              <input
                type="text"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={createEmployee}
          disabled={creating}
          className="btn-neon"
          style={{ width: '100%', padding: '20px', fontSize: '20px', fontWeight: '700', marginBottom: '40px' }}
        >
          {creating ? 'Creating employee...' : 'Create Employee'}
        </button>

        <div className="glass-card" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div className="holo-title" style={{ fontSize: '1.8rem' }}>👥 Team Members</div>
            <div style={{ color: '#a0a0a0' }}>{teamLoading ? 'Loading...' : `${team.length} employees`}</div>
          </div>

          {teamLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#a0a0a0' }}>Loading employees...</div>
          ) : (
            <div className="table-modern" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#ffffff' }}>Name</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#ffffff' }}>Email</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#ffffff' }}>Department</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#ffffff' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px', color: '#ffffff' }}>{user.name}</td>
                      <td style={{ padding: '16px', color: '#a0a0a0' }}>{user.email}</td>
                      <td style={{ padding: '16px', color: '#a0a0a0' }}>{user.department || '—'}</td>
                      <td style={{ padding: '16px', color: '#a0a0a0' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass-card" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div className="holo-title" style={{ fontSize: '1.8rem' }}>🤖 AI Review Assistant</div>
            <div style={{ color: '#a0a0a0' }}>{searching ? 'Searching…' : 'Smart expense insights'}</div>
          </div>

          <div className="form-grid" style={{ marginBottom: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="input-glow" style={{ width: '100%' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchExpenses()}
                  placeholder="Search by employee, category, description, status, amount..."
                  style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button
              onClick={searchExpenses}
              className="btn-neon"
              style={{ padding: '14px 24px', fontSize: '14px' }}
              disabled={searching}
            >
              🔍 {searching ? 'Searching...' : 'Search expenses'}
            </button>
            <button
              onClick={() => {
                setSearchQuery('');
                fetchPending();
              }}
              className="btn-neon"
              style={{ padding: '14px 24px', fontSize: '14px' }}
              disabled={searching}
            >
              ✨ Clear search
            </button>
          </div>

          <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '12px' }}>{assistant.summary || 'No assistant summary yet.'}</div>
            <div style={{ fontSize: '0.95rem', color: '#a0a0a0' }}>{assistant.suggestion || 'AI assistant will highlight important review items, large claims, and OCR issues.'}</div>
          </div>
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
                      <div style={{ fontWeight: '600', color: '#ffffff' }}>{exp.employee_name || `Employee ${exp.user_id}`}</div>
                      <div style={{ color: '#a0a0a0', fontSize: '14px' }}>{exp.description || 'No description'}</div>
                      <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '10px' }}>{exp.summary}</div>
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
                      <span className={`status-${exp.status || 'pending'}`} style={{ 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        fontSize: '14px' 
                      }}>
                        {(exp.status || 'pending').replace(/_/g, ' ').toUpperCase()}
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
