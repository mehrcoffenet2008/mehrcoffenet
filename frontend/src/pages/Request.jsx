import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Request.css";

function Request() {
  const location = useLocation();

  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    service: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
   fetch("https://mehrcoffenet.onrender.com/api/services/")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((data) => {
        setServices(data);

        const selectedServiceId = location.state?.serviceId;

        if (selectedServiceId) {
          setForm((previous) => ({
            ...previous,
            service: String(selectedServiceId),
          }));
        }
      })
      .catch(() => {
        setMessage("دریافت خدمات با مشکل مواجه شد.");
      });
  }, [location.state]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const selectedService = services.find(
    (service) => String(service.id) === String(form.service)
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("https://mehrcoffenet.onrender.com/api/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name: form.customer_name,
        phone: form.phone,
        service: Number(form.service),
        description: form.description,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((data) => {
        setMessage(
          `درخواست شما ثبت شد. کد پیگیری: ${data.tracking_code}`
        );

        setForm({
          customer_name: "",
          phone: "",
          service: "",
          description: "",
        });
      })
      .catch(() => {
        setMessage("ثبت درخواست با مشکل مواجه شد.");
      });
  };

  return (
    <main className="request-page">
      <div className="request-container">

        <div className="request-header">
          <span>کافی‌نت مهر</span>

          <h1>ثبت سفارش</h1>

          <p>
            مشخصات خود را وارد کنید تا سفارش شما ثبت و بررسی شود.
          </p>
        </div>

        <div className="request-card">

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>نام و نام خانوادگی</label>

              <input
                type="text"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                placeholder="نام و نام خانوادگی"
                required
              />
            </div>

            <div className="form-group">
              <label>شماره تماس</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="مثلاً 09123456789"
                required
              />
            </div>

            <div className="form-group">
              <label>خدمت مورد نظر</label>

              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
              >
                <option value="">انتخاب خدمت</option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedService && (
              <div className="selected-service">
                <span>خدمت انتخاب‌شده</span>

                <strong>{selectedService.name}</strong>

                <b>
                  {Number(selectedService.price).toLocaleString("fa-IR")} تومان
                </b>
              </div>
            )}

            <div className="form-group">
              <label>توضیحات درخواست</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="اگر توضیح خاصی دارید اینجا بنویسید..."
              />
            </div>

            <button type="submit" className="request-submit">
              ثبت سفارش
            </button>

          </form>

          {message && (
            <div className="request-message">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Request;