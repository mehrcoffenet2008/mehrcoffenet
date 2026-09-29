import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero3D from "../components/Hero3D";
import ScrollReveal from "../components/ScrollReveal";
import GlassCard from "../components/GlassCard";
import AnimatedCounter from "../components/AnimatedCounter";
import SEO from "../components/SEO";
import "./Home.css";

const services = [
  {
    icon: "📝",
    title: "ثبت‌نام اینترنتی",
    description: "انجام انواع ثبت‌نام‌ها و فرم‌های اینترنتی با دقت و سرعت.",
  },
  {
    icon: "🖨️",
    title: "پرینت و اسکن",
    description: "چاپ و اسکن مدارک و فایل‌ها با کیفیت مناسب.",
  },
  {
    icon: "⌨️",
    title: "تایپ و ویرایش",
    description: "تایپ، ویرایش و آماده‌سازی انواع متن و فایل.",
  },
  {
    icon: "🌐",
    title: "خدمات اینترنتی",
    description: "انجام امور مختلف اینترنتی و خدمات آنلاین.",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "مشتری راضی" },
  { value: 1200, suffix: "+", label: "درخواست موفق" },
  { value: 5, suffix: "+", label: "سال تجربه" },
  { value: 24, suffix: "/7", label: "پشتیبانی" },
];

function Home() {
  return (
    <main className="home">
      <SEO
        title="کافی‌نت مهر | خدمات اینترنتی، پرینت، اسکن و تایپ در ورامین"
        description="کافی‌نت مهر ورامین؛ ارائه خدمات اینترنتی، ثبت‌نام آنلاین، پرینت، اسکن، تایپ و امور کامپیوتری با سرعت و دقت."
      />
      {/* Hero Section */}
      <section className="hero">
        <Hero3D />
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="hero-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              خدمات آنلاین و کامپیوتری
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              خدمات اینترنتی
              <br />
              <span className="hero-title-accent">کافی‌نت مهر</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              انجام سریع و مطمئن خدمات اینترنتی، ثبت‌نام‌ها،
              پرینت، اسکن، تایپ و امور کامپیوتری.
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/request" className="btn btn-primary">
                ثبت درخواست
              </Link>
              <Link to="/services" className="btn btn-secondary">
                مشاهده خدمات
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="logo-card">
              <img src="/images/logo.png" alt="لوگوی کافی‌نت مهر" />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="scroll-arrow"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="stat-item">
                <span className="stat-value">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-preview">
        <ScrollReveal>
          <div className="section-title">
            <span>خدمات ما</span>
            <h2>خدمات پرکاربرد کافی‌نت مهر</h2>
            <p>
              بخشی از خدماتی که می‌توانید به‌راحتی از کافی‌نت مهر دریافت کنید.
            </p>
          </div>
        </ScrollReveal>

        <div className="service-cards">
          {services.map((service, index) => (
            <GlassCard key={index} delay={index * 0.1}>
              <div className="service-card-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to="/services" className="service-card-link">
                مشاهده جزئیات
              </Link>
            </GlassCard>
          ))}
        </div>

        <ScrollReveal>
          <div className="services-more">
            <Link to="/services" className="btn btn-secondary">
              مشاهده همه خدمات
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Tracking CTA */}
      <section className="tracking-section">
        <ScrollReveal>
          <div>
            <span className="section-label">پیگیری آسان</span>
            <h2>درخواست خود را پیگیری کنید</h2>
            <p>
              با استفاده از کد پیگیری، وضعیت درخواست خود را مشاهده کنید.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <Link to="/track" className="btn btn-primary">
            پیگیری درخواست
          </Link>
        </ScrollReveal>
      </section>
    </main>
  );
}

export default Home;
