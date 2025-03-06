import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import "./AuthPage.css"; 

const AuthPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await register(fullName, email, password);
      console.log(res);
      alert(res.message);
      if (res.message === "User registered successfully") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">
          Join <span className="brand-name">EduSphere</span>
        </h2>
        <p className="auth-subtitle">Sign up to access AI-powered learning!</p>

        <input 
          type="text" 
          placeholder="Full Name" 
          className="auth-input"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="register-btn" onClick={handleRegister}>Register</button>

        <p className="or-text">OR</p>

        <button className="google-signin">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="google-icon" />
          Sign in with Google
        </button>

        <p className="login-text">
          Already have an account? <span className="login-link" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
