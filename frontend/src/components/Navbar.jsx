import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/images/logo.png" alt="کافی‌نت مهر" />
        </Link>

        <div className="navbar-actions">
          <ThemeToggle />
          {user ? (
            <div className="navbar-user">
              <Link to="/dashboard" className="navbar-user-link">
                {user.first_name || user.username}
              </Link>
              <button className="navbar-logout" onClick={handleLogout}>
                خروج
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar-login">
              ورود
            </Link>
          )}
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="باز کردن منو"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={closeMenu}>خانه</Link>
          <Link to="/services" onClick={closeMenu}>خدمات</Link>
          <Link to="/request" onClick={closeMenu}>ثبت درخواست</Link>
          <Link to="/track" onClick={closeMenu}>پیگیری درخواست</Link>
          <Link to="/about" onClick={closeMenu}>درباره ما</Link>
          <Link to="/contact" onClick={closeMenu}>تماس با ما</Link>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
