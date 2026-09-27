import { useState } from "react";
import "./Track.css";

function Track() {
  const [trackingCode, setTrackingCode] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!trackingCode.trim()) {
      setError("لطفاً کد پیگیری را وارد کنید.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/track/${trackingCode.trim()}/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "درخواست پیدا نشد.");
      }

      setOrder(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statuses = {
      pending: "در انتظار بررسی",
      processing: "در حال انجام",
      completed: "تکمیل شده",
      cancelled: "لغو شده",
    };

    return statuses[status] || status;
  };

  return (
    <main className="track-page">
      <div className="track-container">

        <div className="track-header">
          <span>کافی‌نت مهر</span>
          <h1>پیگیری درخواست</h1>
          <p>
            کد پیگیری خود را وارد کنید تا وضعیت درخواستتان را مشاهده کنید.
          </p>
        </div>

        <div className="track-card">

          <form onSubmit={handleSubmit} className="track-form">
            <label>کد پیگیری</label>

            <input
              type="text"
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value)}
              placeholder="مثلاً D326F9F1A9"
            />

            <button type="submit">
              {loading ? "در حال بررسی..." : "پیگیری درخواست"}
            </button>
          </form>

          {error && (
            <div className="track-error">
              {error}
            </div>
          )}

          {order && (
            <div className="track-result">

             <div className="result-row">
                <span>خدمت</span>
                <strong>{order.service_name}</strong>
            </div>

              <div className="result-row">
                <span>نام مشتری</span>
                <strong>{order.customer_name}</strong>
              </div>

              <div className="result-row">
                <span>خدمت</span>
                <strong>خدمت شماره {order.service}</strong>
              </div>

              <div className="result-row">
                <span>وضعیت</span>
                <strong>{getStatusText(order.status)}</strong>
              </div>

              <div className="result-row">
                <span>توضیحات</span>
                <strong>{order.description || "بدون توضیحات"}</strong>
              </div>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default Track;