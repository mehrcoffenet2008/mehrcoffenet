import "./Contact.css";

function Contact() {
  return (
    <main className="contact-page">
      <div className="contact-container">

        <div className="contact-header">
          <span>کافی‌نت مهر</span>
          <h1>تماس با ما</h1>
          <p>
            برای ارتباط با کافی‌نت مهر می‌توانید از راه‌های زیر با ما در تماس باشید.
          </p>
        </div>

        <div className="contact-grid">

          <div className="contact-card">
            <div className="contact-icon">📍</div>
            <h2>آدرس</h2>
            <p>
             ورامین، بلوار شهید قدوسی، بعد از میدان ولیعصر،
             بلوار شهید سلیمانی، شهرک احمدیه
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h2>شماره تماس</h2>
           <a href="tel:09033827307" className="contact-phone">
            09033827307
           </a>
          </div>

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

          <div className="contact-card">
            <div className="contact-icon">🕐</div>
            <h2>ساعات کاری</h2>
           <p>
                    ۹ صبح تا ۱۳
                    <br />
                    ۱۶ تا ۲۱
            </p>

          </div>

        </div>

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

      </div>
    </main>
  );
}

export default Contact;