import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Footer.css";

function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/images/logo.png" alt="لوگوی کافی‌نت مهر" />
            </div>
            <p>
              کافی‌نت مهر با هدف ارائه خدمات اینترنتی و کامپیوتری
              با سرعت، دقت و اطمینان فعالیت می‌کند.
            </p>
          </div>

          <div className="footer-section">
            <h3>دسترسی سریع</h3>
            <ul>
              <li><Link to="/">خانه</Link></li>
              <li><Link to="/services">خدمات</Link></li>
              <li><Link to="/request">ثبت درخواست</Link></li>
              <li><Link to="/track">پیگیری درخواست</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>ارتباط با ما</h3>
            <ul>
              <li><a href="tel:09033827307">09033827307</a></li>
              <li><a href="https://instagram.com/mehrcoffenet" target="_blank" rel="noreferrer">@mehrcoffenet</a></li>
              <li><Link to="/contact">تماس با ما</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} کافی‌نت مهر. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
