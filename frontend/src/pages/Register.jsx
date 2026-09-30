import { useState, useEffect, useRef } from "react";
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
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const strength = passwordStrength(formData.password);

  // Countdown for resend
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Send code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/send-code/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setCodeSent(true);
      setCountdown(60);
      setStep(2);
    } else {
      setError(data.error);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/verify-code/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStep(3);
    } else {
      setError(data.error);
    }
  };

  // Step 3: Complete registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    setLoading(true);
    const result = await register({ ...formData, email });
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  const stepTitles = {
    1: "ایمیل",
    2: "کد تایید",
    3: "مشخصات شما",
  };

  return (
    <main className="auth-page">
      <SEO
        title="ثبت‌نام | کافی‌نت مهر"
        description="ثبت‌نام در کافی‌نت مهر با ایمیل"
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
            <p>مرحله {step} از ۳ — {stepTitles[step]}</p>
          </div>

          {/* Progress bar */}
          <div className="auth-progress">
            <div
              className="auth-progress-fill"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === 1 && (
              <motion.form
                key="step1"
                onSubmit={handleSendCode}
                className="auth-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="form-group">
                  <label>ایمیل *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    autoComplete="email"
                    required
                    className="ltr-input"
                  />
                  <small className="form-hint">
                    کد تایید به این ایمیل ارسال می‌شود
                  </small>
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? "در حال ارسال..." : "ارسال کد تایید"}
                </button>
              </motion.form>
            )}

            {/* Step 2: Verification code */}
            {step === 2 && (
              <motion.form
                key="step2"
                onSubmit={handleVerifyCode}
                className="auth-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="form-group">
                  <label>کد تایید (۶ رقم) *</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="کد ۶ رقمی"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    className="ltr-input code-input"
                  />
                  <small className="form-hint">
                    کد به ایمیل <strong>{email}</strong> ارسال شد
                  </small>
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? "در حال بررسی..." : "تایید کد"}
                </button>

                <div className="resend-row">
                  {countdown > 0 ? (
                    <span className="resend-timer">
                      ارسال مجدد تا {countdown} ثانیه دیگر
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="resend-btn"
                      onClick={handleSendCode}
                    >
                      ارسال مجدد کد
                    </button>
                  )}
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={() => {
                      setStep(1);
                      setError("");
                      setCode("");
                    }}
                  >
                    تغییر ایمیل
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 3: Personal details */}
            {step === 3 && (
              <motion.form
                key="step3"
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
                  <label>شماره موبایل (اختیاری)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 11),
                      })
                    }
                    placeholder="09123456789"
                    inputMode="numeric"
                    className="ltr-input"
                  />
                </div>

                <div className="auth-step-actions">
                  <button
                    type="button"
                    className="auth-back"
                    onClick={() => {
                      setStep(2);
                      setError("");
                    }}
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
