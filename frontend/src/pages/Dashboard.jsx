import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-card">
            <h1>لطفاً وارد شوید</h1>
            <p>برای دسترسی به داشبورد باید وارد حساب خود شوید</p>
            <Link to="/login" className="dashboard-btn">
              ورود به حساب
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <SEO
        title="داشبورد | کافی‌نت مهر"
        description="داشبورد کاربری کافی‌نت مهر"
      />
      <div className="dashboard-container">
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="dashboard-header">
            <div className="dashboard-avatar">
              {user.first_name
                ? user.first_name.charAt(0)
                : user.username.charAt(0).toUpperCase()}
            </div>
            <div className="dashboard-info">
              <h1>
                {user.first_name || user.username}{" "}
                {user.last_name}
              </h1>
              <p>@{user.username}</p>
            </div>
          </div>

          <div className="dashboard-details">
            <div className="dashboard-item">
              <span className="dashboard-label">نام کاربری</span>
              <span className="dashboard-value">{user.username}</span>
            </div>
            <div className="dashboard-item">
              <span className="dashboard-label">ایمیل</span>
              <span className="dashboard-value">{user.email || "—"}</span>
            </div>
            <div className="dashboard-item">
              <span className="dashboard-label">نام</span>
              <span className="dashboard-value">{user.first_name || "—"}</span>
            </div>
            <div className="dashboard-item">
              <span className="dashboard-label">نام خانوادگی</span>
              <span className="dashboard-value">{user.last_name || "—"}</span>
            </div>
            <div className="dashboard-item">
              <span className="dashboard-label">تاریخ عضویت</span>
              <span className="dashboard-value">
                {new Date(user.date_joined).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>

          <div className="dashboard-actions">
            <Link to="/request" className="dashboard-btn primary">
              ثبت سفارش جدید
            </Link>
            <Link to="/track" className="dashboard-btn">
              پیگیری سفارش
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
