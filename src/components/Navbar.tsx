import "./Navbar.css";
import Logo from "../assets/Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (location.pathname === "/sign-up") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={Logo} alt="Logo" className="logo" />
        <span className="site-name">ThoughtfulBites</span>
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
        <Link
          to="/about"
          className="nav-item"
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>
        <Link
          to="/contact"
          className="nav-item"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>
        {!isLoggedIn ? (
          <>
            <Link
              to="/sign-up"
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/SignUp"
              className="nav-item nav-button-signup"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/account"
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              Account
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="nav-item nav-button-logout"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
