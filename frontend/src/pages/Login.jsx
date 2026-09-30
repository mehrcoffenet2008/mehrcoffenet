import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import "./Auth.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("remembered_username");
    if (saved) {
      setUsername(saved);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password, remember);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <main className="auth-page">
      <SEO
        title="ورود | کافی‌نت مهر"
        description="ورود به حساب کاربری کافی‌نت مهر"
      />
      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <h1>ورود به حساب</h1>
            <p>خوش آمدید! لطفاً وارد حساب خود شوید</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>نام کاربری</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="نام کاربری خود را وارد کنید"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label>رمز عبور</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>مرا به خاطر بسپار</span>
              </label>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              حساب ندارید؟{" "}
              <Link to="/register" className="auth-link">
                ثبت‌نام کنید
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
