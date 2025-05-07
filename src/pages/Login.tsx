import { FormEvent, useState } from "react";
import "./Login.css";
import Show from "../assets/Show.png";
import Hide from "../assets/Hide.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: Set Error Message if user not found.
    navigate("/");
  }

  const togglePasswordVisibility = () => {
    setshowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmit}>
        <div className="form-content">
          <h1 className="heading">Welcome Back!</h1>
          <div className="email-container">
            <input
              type="text"
              className="email-entry"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              className="password-entry"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye"
              onClick={togglePasswordVisibility}
            >
              {" "}
              <img
                src={showPassword ? Show : Hide}
                alt={showPassword ? "Show Password" : "Hide Password"}
              ></img>
            </button>
          </div>
          <p className="error-message">{errorMessage}</p>
          <button type="submit" className="login-button">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
