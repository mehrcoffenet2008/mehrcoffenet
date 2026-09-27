import "./About.css";

function About() {
  return (
    <main className="about-page">
      <div className="about-container">

        <section className="about-header">
          <span>کافی‌نت مهر</span>
          <h1>درباره ما</h1>
          <p>
            همراه شما در انجام خدمات اینترنتی و کامپیوتری
          </p>
        </section>

        <section className="about-card">
          <div className="about-logo">
            <img
              src="/images/logo.png"
              alt="لوگوی کافی‌نت مهر"
            />
          </div>

          <div className="about-content">
            <h2>کافی‌نت مهر</h2>

            <p>
              کافی‌نت مهر با هدف ارائه خدمات اینترنتی و کامپیوتری
              با سرعت، دقت و اطمینان فعالیت می‌کند.
            </p>

            <p>
              انجام ثبت‌نام‌های اینترنتی، خدمات آنلاین، پرینت،
              اسکن، تایپ و سایر امور کامپیوتری از جمله خدمات ماست.
            </p>

            <div className="about-features">
              <div>
                <span>⚡</span>
                <strong>سرعت</strong>
                <p>انجام سریع درخواست‌ها</p>
              </div>

              <div>
                <span>🎯</span>
                <strong>دقت</strong>
                <p>توجه به جزئیات درخواست شما</p>
              </div>

              <div>
                <span>🔒</span>
                <strong>اطمینان</strong>
                <p>پیگیری و مدیریت درخواست‌ها</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

export default About;