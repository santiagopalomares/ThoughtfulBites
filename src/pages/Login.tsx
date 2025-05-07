import { FormEvent, useState } from "react";
import styles from "./Login.module.css";
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
    <div className={styles["login-container"]}>
      <form onSubmit={onSubmit}>
        <div className={styles["login-form-content"]}>
          <h1 className={styles["login-heading"]}>Welcome Back!</h1>
          <div className={styles["login-email-container"]}>
            <input
              type="text"
              className={styles["login-email-entry"]}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className={styles["login-password-container"]}>
            <input
              type={showPassword ? "text" : "password"}
              className={styles["login-password-entry"]}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles["login-eye"]}
              onClick={togglePasswordVisibility}
            >
              {" "}
              <img
                src={showPassword ? Show : Hide}
                alt={showPassword ? "Show Password" : "Hide Password"}
              ></img>
            </button>
          </div>
          <p className={styles["login-error-message"]}>{errorMessage}</p>
          <button type="submit" className={styles["login-button"]}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
