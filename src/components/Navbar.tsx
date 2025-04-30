import "./Navbar.css";
import Logo from "../assets/Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (
        menuOpen &&
        !target.closest(".navbar-right") &&
        !target.closest(".hamburger")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
        <Link to="/">
          <img src={Logo} alt="Logo" className="logo" />
        </Link>
        <span className="site-name">ThoughtfulBites</span>
      </div>

      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className={`hamburger-icon ${menuOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
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
