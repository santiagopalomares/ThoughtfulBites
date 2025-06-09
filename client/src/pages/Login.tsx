import { FormEvent, useState } from "react";
import styles from "./Login.module.css";
import Show from "../assets/Show.png";
import Hide from "../assets/Hide.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function searchUserFromDatabase() {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(`${result.message}`);
        return { error: result.message };
      }

      return { success: true, userId: result.userId };
    } catch (error) {
      setErrorMessage("Cannot connect to server");
      return { error: "Cannot connect to server" };
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const result = await searchUserFromDatabase();

    if (result.error) {
      setErrorMessage(`ERROR: ${result.error}`);
      return;
    } else {
      localStorage.setItem("userId", result.userId);

      login();
      navigate("/");
    }
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
