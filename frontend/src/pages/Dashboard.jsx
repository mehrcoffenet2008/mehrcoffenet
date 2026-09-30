import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import "./Dashboard.css";

const STATUS_LABELS = {
  pending: "در انتظار بررسی",
  processing: "در حال انجام",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

export default function Dashboard() {
  const { user, loading, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [profileMsg, setProfileMsg] = useState(null);

  // Password form
  const [pwForm, setPwForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === "orders") {
      setOrdersLoading(true);
      fetch("/api/orders/")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [user, activeTab]);

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
            <Link to="/login" className="dashboard-btn primary">
              ورود به حساب
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    const result = await updateProfile(profileForm);
    setProfileMsg(
      result.success
        ? { type: "success", text: "پروفایل با موفقیت ذخیره شد ✅" }
        : { type: "error", text: result.error }
    );
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMsg(null);

    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwMsg({ type: "error", text: "رمز عبور جدید و تکرار آن یکسان نیست" });
      return;
    }

    setPwSaving(true);
    const result = await changePassword(pwForm.old_password, pwForm.new_password);
    setPwSaving(false);

    if (result.success) {
      setPwMsg({ type: "success", text: "رمز عبور با موفقیت تغییر کرد ✅" });
      setPwForm({ old_password: "", new_password: "", confirm_password: "" });
    } else {
      setPwMsg({ type: "error", text: result.error });
    }
  };

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
          {/* Header */}
          <div className="dashboard-header">
            <div className="dashboard-avatar">
              {user.first_name
                ? user.first_name.charAt(0)
                : user.username.charAt(0).toUpperCase()}
            </div>
            <div className="dashboard-info">
              <h1>
                {user.first_name || user.username} {user.last_name}
              </h1>
              <p>@{user.username}</p>
            </div>
            <button className="dashboard-logout" onClick={logout}>
              خروج
            </button>
          </div>

          {/* Tabs */}
          <div className="dashboard-tabs">
            <button
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              👤 پروفایل
            </button>
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
              >
              📦 سفارشات من
            </button>
            <button
              className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              🔒 امنیت
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="dashboard-tab-content"
              >
                <div className="dashboard-details">
                  <div className="dashboard-item">
                    <span className="dashboard-label">نام کاربری</span>
                    <span className="dashboard-value">{user.username}</span>
                  </div>
                  <div className="dashboard-item">
                    <span className="dashboard-label">تاریخ عضویت</span>
                    <span className="dashboard-value">
                      {user.date_joined
                        ? new Date(user.date_joined).toLocaleDateString("fa-IR")
                        : "—"}
                    </span>
                  </div>
                  <div className="dashboard-item">
                    <span className="dashboard-label">آخرین ورود</span>
                    <span className="dashboard-value">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString("fa-IR")
                        : "—"}
                    </span>
                  </div>
                </div>

                <h3 className="section-title">ویرایش اطلاعات</h3>
                {profileMsg && (
                  <div className={`msg ${profileMsg.type}`}>
                    {profileMsg.text}
                  </div>
                )}
                <form onSubmit={handleProfileSubmit} className="dashboard-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>نام</label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            first_name: e.target.value,
                          })
                        }
                        placeholder="نام"
                      />
                    </div>
                    <div className="form-group">
                      <label>نام خانوادگی</label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            last_name: e.target.value,
                          })
                        }
                        placeholder="نام خانوادگی"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>ایمیل</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="example@email.com"
                    />
                  </div>
                  <button type="submit" className="dashboard-btn primary">
                    ذخیره تغییرات
                  </button>
                </form>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="dashboard-tab-content"
              >
                {ordersLoading ? (
                  <div className="orders-loading">
                    <div className="spinner" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="orders-empty">
                    <p>هنوز سفارشی ثبت نکرده‌اید</p>
                    <Link to="/request" className="dashboard-btn primary">
                      ثبت اولین سفارش
                    </Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-item">
                        <div className="order-top">
                          <strong>{order.service_name}</strong>
                          <span
                            className={`order-status ${order.status}`}
                          >
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </div>
                        <div className="order-bottom">
                          <span className="order-code">
                            کد: {order.tracking_code}
                          </span>
                          <span className="order-date">
                            {new Date(order.created_at).toLocaleDateString(
                              "fa-IR"
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="dashboard-tab-content"
              >
                <h3 className="section-title">تغییر رمز عبور</h3>
                {pwMsg && (
                  <div className={`msg ${pwMsg.type}`}>{pwMsg.text}</div>
                )}
                <form onSubmit={handlePasswordSubmit} className="dashboard-form">
                  <div className="form-group">
                    <label>رمز عبور فعلی</label>
                    <input
                      type="password"
                      value={pwForm.old_password}
                      onChange={(e) =>
                        setPwForm({
                          ...pwForm,
                          old_password: e.target.value,
                        })
                      }
                      placeholder="رمز عبور فعلی"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>رمز عبور جدید</label>
                    <input
                      type="password"
                      value={pwForm.new_password}
                      onChange={(e) =>
                        setPwForm({
                          ...pwForm,
                          new_password: e.target.value,
                        })
                      }
                      placeholder="حداقل ۶ کاراکتر"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>تکرار رمز عبور جدید</label>
                    <input
                      type="password"
                      value={pwForm.confirm_password}
                      onChange={(e) =>
                        setPwForm({
                          ...pwForm,
                          confirm_password: e.target.value,
                        })
                      }
                      placeholder="تکرار رمز عبور جدید"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="dashboard-btn primary"
                    disabled={pwSaving}
                  >
                    {pwSaving ? "در حال ذخیره..." : "تغییر رمز عبور"}
                  </button>
                </form>

                <div className="security-tips">
                  <h4>💡 نکات امنیتی</h4>
                  <ul>
                    <li>رمز عبور حداقل ۸ کاراکتر با ترکیب حروف و اعداد باشد</li>
                    <li>از رمز یکسان برای چند سایت استفاده نکنید</li>
                    <li>هر چند ماه یکبار رمز عبور را تغییر دهید</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick actions */}
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
