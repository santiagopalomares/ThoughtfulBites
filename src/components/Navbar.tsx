import "./Navbar.css";
import viteLogo from "../assets/react.svg";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  if (location.pathname === "/sign-up") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={viteLogo} alt="Logo" className="logo" />
        <span className="site-name">ThoughtfulBites</span>
      </div>

      <div className="navbar-right">
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/contact-us" className="nav-link">
          Contact
        </Link>
        <Link to="/" className="nav-link">
          Landing
        </Link>
        <Link to="/sign-up" className="nav-link">
          Sign Up
        </Link>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </div>
    </nav>
  );
}
