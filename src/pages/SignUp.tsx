import { useState } from "react";
import "./SignUp.css";
import logo from "../assets/Logo.png";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    console.log("Email: ", email, "Password: ", password);
  };

  return (
    <div className="signup-container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <span className="site-name">ThoughtfulBites</span>
      </div>
      <div className="entries-container">
        <h1 className="step-1">Step 1: Sign Up</h1>
        <input
          type="text"
          className="email-entry"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          className="password-entry"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          className="confirm-password-entry"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="login-redirect">
          <p className="account-text">Already have an account?</p>
          <Link to="/login">Log In</Link>
        </div>
      </div>
      <div className="navigation">
        <div className="pagination-dots"></div>
        <button onClick={handleSignUp}>Next</button>
      </div>
    </div>
  );
}
