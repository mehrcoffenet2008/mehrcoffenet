import { motion } from "framer-motion";
import ScrollReveal from "../components/ScrollReveal";
import SEO from "../components/SEO";
import "./About.css";

function About() {
  return (
    <main className="about-page">
      <SEO
        title="درباره ما | کافی‌نت مهر"
        description="آشنایی با کافی‌نت مهر؛ ارائه‌دهنده خدمات اینترنتی و کامپیوتری در ورامین."
      />
      <div className="about-container">
        <motion.section
          className="about-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>کافی‌نت مهر</span>
          <h1>درباره ما</h1>
          <p>همراه شما در انجام خدمات اینترنتی و کامپیوتری</p>
        </motion.section>

        <ScrollReveal>
          <section className="about-card">
            <motion.div
              className="about-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img src="/images/logo.png" alt="لوگوی کافی‌نت مهر" />
            </motion.div>

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
                <ScrollReveal delay={0.1}>
                  <div className="about-feature">
                    <span>⚡</span>
                    <strong>سرعت</strong>
                    <p>انجام سریع درخواست‌ها</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <div className="about-feature">
                    <span>🎯</span>
                    <strong>دقت</strong>
                    <p>توجه به جزئیات درخواست شما</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                  <div className="about-feature">
                    <span>🔒</span>
                    <strong>اطمینان</strong>
                    <p>پیگیری و مدیریت درخواست‌ها</p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}

export default About;
