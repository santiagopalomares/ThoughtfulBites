import "./Navbar.css";
import Logo from "../assets/Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  if (location.pathname === "/sign-up") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect to landing
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={Logo} alt="Logo" className="logo" />
        <span className="site-name">ThoughtfulBites</span>
      </div>

      <div className="navbar-right">
        <Link to="/about" className="nav-item">
          About
        </Link>
        <Link to="/contact" className="nav-item">
          Contact
        </Link>
        <Link to="/sign-up" className="nav-item">
          Login
        </Link>
        {!isLoggedIn ? (
          <Link to="/SignUp" className="nav-item nav-button">
            SignUp
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="nav-item nav-button button-link"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
