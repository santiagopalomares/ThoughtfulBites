// src/components/Navbar.tsx
import "./Navbar.css";
import viteLogo from "../assets/react.svg";
import { Link } from "react-router-dom";

export default function Navbar() {
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
        <Link to="/" className="nav-link">
          Landing
        </Link>
      </div>
    </nav>
  );
}
