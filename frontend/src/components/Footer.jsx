import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src="/images/logo.png" alt="کافی‌نت مهر" />

          <h3>کافی‌نت مهر</h3>

          <p>
            خدمات اینترنتی و کامپیوتری با سرعت، دقت و اطمینان.
          </p>
        </div>

        <div className="footer-links">
          <h4>دسترسی سریع</h4>

          <Link to="/">خانه</Link>
          <Link to="/services">خدمات</Link>
          <Link to="/request">ثبت درخواست</Link>
          <Link to="/track">پیگیری درخواست</Link>
        </div>

        <div className="footer-contact">
          <h4>ارتباط با ما</h4>

          <p>📍 ورامین، بلوار شهید قدوسی، بعد از میدان ولیعصر، بلوار شهید سلیمانی، شهرک احمدیه</p>

<p>
  📞{" "}
  <a href="tel:09033827307">
    09033827307
  </a>
</p>

<p>
  📩{" "}
  <a
    href="https://instagram.com/mehrcoffenet"
    target="_blank"
    rel="noreferrer"
  >
    @mehrcoffenet
  </a>
</p>

<p>🕐 ۹ تا ۱۳ و ۱۶ تا ۲۱</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} کافی‌نت مهر — تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}

export default Footer;