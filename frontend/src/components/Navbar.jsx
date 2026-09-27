import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/images/logo.png" alt="کافی‌نت مهر" />
        </Link>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="باز کردن منو"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={closeMenu}>خانه</Link>
          <Link to="/services" onClick={closeMenu}>خدمات</Link>
          <Link to="/request" onClick={closeMenu}>ثبت درخواست</Link>
          <Link to="/track" onClick={closeMenu}>پیگیری درخواست</Link>
          <Link to="/about" onClick={closeMenu}>درباره ما</Link>
          <Link to="/contact" onClick={closeMenu}>تماس با ما</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;