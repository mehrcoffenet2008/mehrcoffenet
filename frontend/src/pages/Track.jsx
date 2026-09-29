import { useState } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
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
        `/api/orders/track/${trackingCode.trim()}/`
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

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      completed: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  return (
    <main className="track-page">
      <SEO
        title="پیگیری درخواست | کافی‌نت مهر"
        description="پیگیری آنلاین وضعیت درخواست خود با کد پیگیری در کافی‌نت مهر."
      />
      <div className="track-container">
        <motion.div
          className="track-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>کافی‌نت مهر</span>
          <h1>پیگیری درخواست</h1>
          <p>کد پیگیری خود را وارد کنید تا وضعیت درخواستتان را مشاهده کنید.</p>
        </motion.div>

        <motion.div
          className="track-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="track-form">
            <label>کد پیگیری</label>
            <input
              type="text"
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value)}
              placeholder="مثلاً D326F9F1A9"
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? "در حال بررسی..." : "پیگیری درخواست"}
            </motion.button>
          </form>

          {error && (
            <motion.div
              className="track-error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          {order && (
            <motion.div
              className="track-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="result-row">
                <span>خدمت</span>
                <strong>{order.service_name}</strong>
              </div>
              <div className="result-row">
                <span>نام مشتری</span>
                <strong>{order.customer_name}</strong>
              </div>
              <div className="result-row">
                <span>وضعیت</span>
                <strong style={{ color: getStatusColor(order.status) }}>
                  {getStatusText(order.status)}
                </strong>
              </div>
              <div className="result-row">
                <span>توضیحات</span>
                <strong>{order.description || "بدون توضیحات"}</strong>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default Track;
