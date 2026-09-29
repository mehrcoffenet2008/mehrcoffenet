import { motion } from "framer-motion";
import ScrollReveal from "../components/ScrollReveal";
import SEO from "../components/SEO";
import "./Contact.css";

function Contact() {
  return (
    <main className="contact-page">
      <SEO
        title="تماس با ما | کافی‌نت مهر"
        description="راه‌های ارتباطی با کافی‌نت مهر ورامین؛ تلفن، اینستاگرام و آدرس."
      />
      <div className="contact-container">
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>کافی‌نت مهر</span>
          <h1>تماس با ما</h1>
          <p>برای ارتباط با کافی‌نت مهر می‌توانید از راه‌های زیر با ما در تماس باشید.</p>
        </motion.div>

        <div className="contact-grid">
          <ScrollReveal delay={0}>
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h2>آدرس</h2>
              <p>
                ورامین، بلوار شهید قدوسی، بعد از میدان ولیعصر،
                بلوار شهید سلیمانی، شهرک احمدیه
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h2>شماره تماس</h2>
              <a href="tel:09033827307" className="contact-phone">
                09033827307
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="contact-card">
              <div className="contact-icon">📩</div>
              <h2>اینستاگرام</h2>
              <a
                href="https://instagram.com/mehrcoffenet"
                target="_blank"
                rel="noreferrer"
                className="contact-instagram"
              >
                @mehrcoffenet
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="contact-card">
              <div className="contact-icon">🕐</div>
              <h2>ساعات کاری</h2>
              <p>
                ۹ صبح تا ۱۳
                <br />
                ۱۶ تا ۲۱
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.4}>
          <section className="contact-message">
            <h2>نیاز به راهنمایی دارید؟</h2>
            <p>
              اگر درباره خدمات، ثبت درخواست یا پیگیری سفارش خود سوالی دارید،
              می‌توانید با ما تماس بگیرید.
            </p>
            <a href="/request" className="contact-button">
              ثبت درخواست
            </a>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}

export default Contact;
