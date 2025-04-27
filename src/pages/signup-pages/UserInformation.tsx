import { Link } from "react-router-dom";
import "../signup-pages/UserInformation.css";
import { useState } from "react";

type UserData = {
  email: string;
  password: string;
};

type UserInformationProps = UserData & {
  updateFields: (fields: Partial<UserData>) => void;
};

export function UserInformation({
  email,
  password,
  updateFields,
}: UserInformationProps) {
  const [confirmPassword, setConfirmPassword] = useState("");
  function checkPasswordMatch(confirmPassword: string) {
    if (confirmPassword !== password) {
      console.log("ERROR: Mismatch passwords");
    }
  }

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
      <input
        type="text"
        className="password-entry"
        placeholder="Password"
        value={password}
        onChange={(e) => updateFields({ password: e.target.value })}
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
    </>
  );
}
