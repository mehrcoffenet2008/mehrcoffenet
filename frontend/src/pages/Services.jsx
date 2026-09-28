import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://mehrcoffenet.onrender.com/api/services/")
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
      <section className="services-header">
        <span>خدمات کافی‌نت مهر</span>

        <h1>خدمات ما</h1>

        <p>
          خدمات اینترنتی و کامپیوتری مورد نیاز شما، با دقت و سرعت مناسب.
        </p>
      </section>

      {loading && (
        <div className="services-message">
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
          {services.map((service) => (
            <article className="service-item" key={service.id}>
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
            </article>
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