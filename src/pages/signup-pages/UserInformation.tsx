import { Link } from "react-router-dom";
import "../signup-pages/UserInformation.css";
import { useState } from "react";
import Show from "../../assets/Show.png";
import Hide from "../../assets/Hide.png";

type UserData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type UserInformationProps = UserData & {
  updateFields: (fields: Partial<UserData>) => void;
};

export function UserInformation({
  email,
  password,
  confirmPassword,
  updateFields,
}: UserInformationProps) {
  const [showPassword, setshowPassword] = useState(true);
  const [showConfirmPassword, setshowConfirmPassword] = useState(true);

  const togglePasswordVisibility = () => {
    setshowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setshowConfirmPassword((prev) => !prev);
  };

  return (
    <>
      <h1 className="step-heading">Step 1: Sign Up</h1>
      <input
        type="text"
        className="email-entry"
        placeholder="Email"
        value={email}
        onChange={(e) => updateFields({ email: e.target.value })}
        required
        autoFocus
      />
      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          className="password-entry"
          placeholder="Password"
          value={password}
          onChange={(e) => updateFields({ password: e.target.value })}
          required
        />
        <button
          type="button"
          className="eye"
          onClick={togglePasswordVisibility}
        >
          <img
            src={showPassword ? Show : Hide}
            alt={showPassword ? "Show Password" : "Hide Password"}
          ></img>
        </button>
      </div>
      <div className="password-container">
        <input
          type={showConfirmPassword ? "text" : "password"}
          className="confirm-password-entry"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => updateFields({ confirmPassword: e.target.value })}
          required
        />
        <button
          type="button"
          className="eye"
          onClick={toggleConfirmPasswordVisibility}
        >
          <img
            src={showConfirmPassword ? Show : Hide}
            alt={showConfirmPassword ? "Show Password" : "Hide Password"}
          ></img>
        </button>
      </div>
      <div className="login-redirect">
        <p className="account-text">Already have an account?</p>
        <Link to="/login" className="log-in">
          Log In
        </Link>
      </div>
    </>
  );
}
