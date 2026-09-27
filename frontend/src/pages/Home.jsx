import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">💻 خدمات آنلاین و کامپیوتری</span>

            <h1>
              خدمات اینترنتی
              <br />
              <span>کافی‌نت مهر</span>
            </h1>

            <p>
              انجام سریع و مطمئن خدمات اینترنتی، ثبت‌نام‌ها،
              پرینت، اسکن، تایپ و امور کامپیوتری.
            </p>

            <div className="hero-buttons">
              <Link to="/request" className="btn btn-primary">
                ثبت درخواست
              </Link>

              <Link to="/services" className="btn btn-secondary">
                مشاهده خدمات
              </Link>
            </div>
          </div>

          <div className="hero-logo">
            <div className="logo-card">
              <img src="/images/logo.png" alt="لوگوی کافی‌نت مهر" />
            </div>
          </div>
        </div>
      </section>

      <section className="services-preview">
        <div className="section-title">
          <span>خدمات ما</span>
          <h2>خدمات پرکاربرد کافی‌نت مهر</h2>
          <p>
            بخشی از خدماتی که می‌توانید به‌راحتی از کافی‌نت مهر دریافت کنید.
          </p>
        </div>

        <div className="service-cards">
          <div className="service-card">
            <div className="service-icon">📝</div>
            <h3>ثبت‌نام اینترنتی</h3>
            <p>
              انجام انواع ثبت‌نام‌ها و فرم‌های اینترنتی با دقت و سرعت.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">🖨️</div>
            <h3>پرینت و اسکن</h3>
            <p>
              چاپ و اسکن مدارک و فایل‌ها با کیفیت مناسب.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">⌨️</div>
            <h3>تایپ و ویرایش</h3>
            <p>
              تایپ، ویرایش و آماده‌سازی انواع متن و فایل.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3>خدمات اینترنتی</h3>
            <p>
              انجام امور مختلف اینترنتی و خدمات آنلاین.
            </p>
          </div>
        </div>

        <div className="services-more">
          <Link to="/services" className="btn btn-secondary">
            مشاهده همه خدمات
          </Link>
        </div>
      </section>

      <section className="tracking-section">
        <div>
          <span className="section-label">پیگیری آسان</span>
          <h2>درخواست خود را پیگیری کنید</h2>
          <p>
            با استفاده از کد پیگیری، وضعیت درخواست خود را مشاهده کنید.
          </p>
        </div>

        <Link to="/track" className="btn btn-primary">
          پیگیری درخواست
        </Link>
      </section>
    </main>
  );
}

export default Home;