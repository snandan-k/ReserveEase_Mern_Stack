import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp 
      ? "http://localhost:4000/api/v1/reservation/admin/signup"
      : "http://localhost:4000/api/v1/reservation/admin/login";

    const payload = isSignUp 
      ? { email, password, secretCode } 
      : { email, password };

    try {
      const { data } = await axios.post(endpoint, payload);
      toast.success(data.message);
      
      // Save Token and Redirect
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication Failed!");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#0f0f0f" }}>
      <form onSubmit={handleSubmit} style={{ background: "#1e1e1e", padding: "40px", borderRadius: "10px", width: "350px", color: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.5)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isSignUp ? "Admin Sign Up" : "Admin Login"}
        </h2>
        
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #333", backgroundColor: "#2b2b2b", color: "#fff", boxSizing: "border-box" }}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #333", backgroundColor: "#2b2b2b", color: "#fff", boxSizing: "border-box" }}
        />

        {isSignUp && (
          <input
            type="password"
            placeholder="Admin Secret Security Code"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #333", backgroundColor: "#2b2b2b", color: "#fff", boxSizing: "border-box" }}
          />
        )}

        <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#e63946", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
          {isSignUp ? "CREATE ADMIN ACCOUNT" : "LOGIN"}
        </button>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#aaa" }}>
            {isSignUp ? "Already have an admin account?" : "Need a new admin account?"}{" "}
            <span 
              onClick={() => setIsSignUp(!isSignUp)} 
              style={{ color: "#e63946", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;