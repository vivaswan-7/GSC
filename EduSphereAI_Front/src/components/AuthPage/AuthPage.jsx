import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css"; 

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">
          Join <span className="brand-name">EduSphere</span>
        </h2>
        <p className="auth-subtitle">Sign up to access AI-powered learning!</p>

        <input type="text" placeholder="Full Name" className="auth-input" />
        <input type="email" placeholder="Email Address" className="auth-input" />
        <input type="password" placeholder="Password" className="auth-input" />

        <button className="register-btn">Register</button>

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
