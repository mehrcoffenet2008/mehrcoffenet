import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import "./Auth.css";

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^\w\s]/.test(pw)) score++;

  if (score <= 1) return { score: 20, label: "ضعیف", color: "#ef4444" };
  if (score === 2) return { score: 45, label: "متوسط", color: "#f59e0b" };
  if (score === 3) return { score: 70, label: "خوب", color: "#3b82f6" };
  if (score === 4) return { score: 88, label: "قوی", color: "#22c55e" };
  return { score: 100, label: "عالی", color: "#16a34a" };
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = passwordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneStep = (e) => {
    e.preventDefault();
    setError("");
    if (!/^09\d{9}$/.test(phone)) {
      setError("شماره موبایل معتبر نیست (مثال: 09123456789)");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    setLoading(true);
    const result = await register({ ...formData, phone });
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
        title="ثبت‌نام | کافی‌نت مهر"
        description="ثبت‌نام در کافی‌نت مهر با شماره موبایل"
      />
      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <h1>ثبت‌نام</h1>
            <p>مرحله {step} از ۲ — {step === 1 ? "شماره موبایل" : "مشخصات شما"}</p>
          </div>

          {/* Progress bar */}
          <div className="auth-progress">
            <div
              className="auth-progress-fill"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                onSubmit={handlePhoneStep}
                className="auth-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="form-group">
                  <label>شماره موبایل *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                    }
                    placeholder="09123456789"
                    inputMode="numeric"
                    autoFocus
                    required
                    className="ltr-input"
                  />
                  <small className="form-hint">
                    شماره موبایل فقط برای شناسایی یکتای حساب استفاده می‌شود
                    (اطلاع‌رسانی‌ها از طریق ایمیل ارسال می‌شود)
                  </small>
                </div>

                <button type="submit" className="auth-submit">
                  ادامه
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                onSubmit={handleSubmit}
                className="auth-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label>نام *</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="نام"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>نام خانوادگی *</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="نام خانوادگی"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>نام کاربری *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="حداقل ۳ کاراکتر"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>رمز عبور *</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="حداقل ۸ کاراکتر"
                      required
                      autoComplete="new-password"
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
                  {formData.password && (
                    <div className="strength-meter">
                      <div className="strength-bar">
                        <div
                          className="strength-fill"
                          style={{
                            width: `${strength.score}%`,
                            background: strength.color,
                          }}
                        />
                      </div>
                      <span
                        className="strength-label"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>ایمیل (اختیاری)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                  />
                </div>

                <div className="auth-step-actions">
                  <button
                    type="button"
                    className="auth-back"
                    onClick={() => setStep(1)}
                  >
                    بازگشت
                  </button>
                  <button
                    type="submit"
                    className="auth-submit"
                    disabled={loading}
                  >
                    {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="auth-footer">
            <p>
              حساب دارید؟{" "}
              <Link to="/login" className="auth-link">
                وارد شوید
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
