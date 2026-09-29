import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "../components/ScrollReveal";
import SEO from "../components/SEO";
import "./Services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/services/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("خطا در دریافت خدمات");
        }
        return response.json();
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        setError("دریافت خدمات با مشکل مواجه شد.");
        setLoading(false);
      });
  }, []);

  return (
    <main className="services-page">
      <SEO
        title="خدمات | کافی‌نت مهر"
        description="مشاهده خدمات کافی‌نت مهر شامل پرینت، اسکن، تایپ، ثبت‌نام اینترنتی و خدمات آنلاین."
      />
      <section className="services-header">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          خدمات کافی‌نت مهر
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          خدمات ما
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          خدمات اینترنتی و کامپیوتری مورد نیاز شما، با دقت و سرعت مناسب.
        </motion.p>
      </section>

      {loading && (
        <div className="services-message">
          <div className="loading-spinner"></div>
          در حال دریافت خدمات...
        </div>
      )}

      {error && (
        <div className="services-message error">
          {error}
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <section className="services-grid">
          {services.map((service, index) => (
            <motion.article
              className="service-item"
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="service-item-icon">💻</div>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <div className="service-price">
                {Number(service.price).toLocaleString("fa-IR")} تومان
              </div>
              <Link
                to="/request"
                state={{ serviceId: service.id }}
                className="service-order-btn"
              >
                ثبت سفارش این خدمت
              </Link>
            </motion.article>
          ))}
        </section>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="services-message">
          هیچ خدمتی ثبت نشده است.
        </div>
      )}
    </main>
  );
}

export default Services;
