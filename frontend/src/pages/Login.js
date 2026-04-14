import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/login", {
        email,
        password
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user_id", res.data.user_id);

      setUser({ token, role: res.data.role });
      
    } catch (err) {
      alert(err.response?.data?.message || "Invalid login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 20px"
    }}>
      <div className="glass-card neon-glow" style={{ 
        maxWidth: "420px", 
        width: "100%",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "40px" }}>
          <div className="holo-title" style={{ fontSize: "3rem", marginBottom: "10px" }}>🚀</div>
          <div style={{ fontSize: "1.8rem", color: "#ffffff", marginBottom: "8px" }}>ExpenseFlow AI</div>
          <div style={{ color: "#a0a0a0", fontSize: "1.1rem" }}>Smart OCR Auto-Approval</div>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-glow" style={{ marginBottom: "24px" }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              style={{ 
                background: "transparent", 
                border: "none", 
                outline: "none", 
                color: "inherit", 
                width: "100%", 
                fontSize: "16px",
                padding: "8px 0"
              }}
            />
          </div>

          <div className="input-glow" style={{ marginBottom: "32px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              style={{ 
                background: "transparent", 
                border: "none", 
                outline: "none", 
                color: "inherit", 
                width: "100%", 
                fontSize: "16px",
                padding: "8px 0"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-neon"
            style={{
              width: "100%",
              padding: "20px",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px"
            }}
          >
            {loading ? (
              <>
                <span style={{ marginRight: "10px" }}>🔄</span>
                Processing with AI...
              </>
            ) : (
              'Login → AI Dashboard'
            )}
          </button>

          <div style={{ color: "#a0a0a0", fontSize: "0.9rem" }}>
            OCR Auto-Approval • Zero Manual Review
          </div>
        </form>
      </div>
    </div>
  );
}
