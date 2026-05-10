import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    height: 100vh;
    display: flex;
    font-family: 'Sora', sans-serif;
    background: #06061a;
    position: relative;
    overflow: hidden;
  }

  /* ── Ambient background orbs ── */
  .login-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .login-bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
  }

  .login-bg-orb-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, #6366f1, #4f46e5);
    top: -200px; left: -150px;
    animation: orb-float 12s ease-in-out infinite;
  }

  .login-bg-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #8b5cf6, #7c3aed);
    bottom: -100px; right: -80px;
    animation: orb-float 15s ease-in-out infinite reverse;
  }

  .login-bg-orb-3 {
    width: 250px; height: 250px;
    background: radial-gradient(circle, #06b6d4, #0891b2);
    top: 50%; left: 55%;
    animation: orb-float 10s ease-in-out infinite 3s;
    opacity: 0.08;
  }

  @keyframes orb-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 15px) scale(0.97); }
  }

  /* Grid texture */
  .login-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── Left panel ── */
  .login-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 56px;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  @media (max-width: 900px) {
    .login-left { display: none; }
  }

  .login-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
    text-decoration: none;
  }

  .login-brand-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(99,102,241,0.45);
    flex-shrink: 0;
  }

  .login-brand-name {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.04em;
  }

  .login-brand-name span { color: #818cf8; }

  .login-headline {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(28px, 3vw, 44px);
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 14px;
  }

  .login-headline .accent {
    background: linear-gradient(135deg, #818cf8, #c4b5fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .login-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.45);
    line-height: 1.6;
    max-width: 360px;
    margin-bottom: 32px;
  }

  .login-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .login-feature {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(10px);
    transition: border-color 0.3s ease, background 0.3s ease;
    animation: feature-in 0.6s ease both;
  }

  .login-feature:nth-child(1) { animation-delay: 0.1s; }
  .login-feature:nth-child(2) { animation-delay: 0.2s; }
  .login-feature:nth-child(3) { animation-delay: 0.3s; }

  @keyframes feature-in {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .login-feature:hover {
    background: rgba(99,102,241,0.07);
    border-color: rgba(139,92,246,0.2);
  }

  .login-feature-icon {
    font-size: 18px;
    flex-shrink: 0;
    width: 32px;
    text-align: center;
  }

  .login-feature-text {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.65);
  }

  /* Stats row */
  .login-stats {
    display: flex;
    gap: 28px;
    margin-top: 32px;
  }

  .login-stat-num {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;
  }

  .login-stat-label {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    margin-top: 2px;
    font-weight: 500;
  }

  /* ── Right panel ── */
  .login-right {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 44px;
    position: relative;
    z-index: 1;
    background: rgba(8,8,28,0.6);
    border-left: 1px solid rgba(139,92,246,0.1);
    backdrop-filter: blur(20px);
    overflow: hidden;
  }

  @media (max-width: 900px) {
    .login-right {
      width: 100%;
      border-left: none;
      background: transparent;
      padding: 32px 24px;
    }
  }

  .login-card {
    width: 100%;
    max-width: 380px;
    animation: card-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Mobile brand */
  .login-mobile-brand {
    display: none;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
    text-decoration: none;
  }

  @media (max-width: 900px) {
    .login-mobile-brand { display: flex; }
  }

  .login-card-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;
    margin-bottom: 4px;
  }

  .login-card-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.38);
    margin-bottom: 24px;
    line-height: 1.5;
  }

  /* Error */
  .login-error {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    color: #fca5a5;
    font-size: 13px;
    margin-bottom: 16px;
    animation: shake 0.3s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  /* Field group */
  .login-field {
    margin-bottom: 14px;
  }

  .login-label {
    display: block;
    font-size: 11.5px;
    font-weight: 600;
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 7px;
  }

  .login-input-wrap {
    position: relative;
  }

  .login-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.25);
    width: 16px; height: 16px;
    pointer-events: none;
    flex-shrink: 0;
  }

  .login-input {
    width: 100%;
    padding: 12px 16px 12px 42px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #f1f5f9;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }

  .login-input::placeholder { color: rgba(255,255,255,0.2); }

  .login-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.05);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .login-input-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255,255,255,0.25);
    padding: 0;
    display: flex;
    transition: color 0.2s ease;
  }

  .login-input-toggle:hover { color: rgba(255,255,255,0.6); }

  .login-input.has-toggle { padding-right: 42px; }

  /* Submit button */
  .login-btn {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1 0%, #5b5be8 50%, #4f46e5 100%);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 20px rgba(99,102,241,0.4), 0 1px 0 rgba(255,255,255,0.1) inset;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: 0.01em;
  }

  .login-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.55);
  }

  .login-btn:active:not(:disabled) { transform: translateY(0); }

  .login-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* Spinner */
  .login-spinner {
    width: 17px; height: 17px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Divider */
  .login-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 20px 0;
  }

  .login-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .login-divider-text {
    font-size: 11px;
    color: rgba(255,255,255,0.25);
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* Footer */
  .login-footer {
    text-align: center;
    font-size: 13.5px;
    color: rgba(255,255,255,0.35);
  }

  .login-footer a {
    color: #818cf8;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .login-footer a:hover {
    color: #c4b5fd;
    text-decoration: underline;
  }
`;

const IconEmail = () => (
  <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconLock = () => (
  <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const payload = { password: form.password };
      if (form.identifier.includes("@")) {
        payload.email = form.identifier;
      } else {
        payload.phone = form.identifier;
      }
      const user = await login(payload);
      toast.success(`Welcome back, ${user.fullname}!`);
      navigate(user.role === "seller" ? "/seller/dashboard" : "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">

        {/* Background */}
        <div className="login-bg">
          <div className="login-bg-grid" />
          <div className="login-bg-orb login-bg-orb-1" />
          <div className="login-bg-orb login-bg-orb-2" />
          <div className="login-bg-orb login-bg-orb-3" />
        </div>

        {/* ── Left Panel ── */}
        <div className="login-left">
          <Link to="/" className="login-brand">
            <div className="login-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span className="login-brand-name">Book<span>Store</span></span>
          </Link>

          <h1 className="login-headline">
            Your next great<br />
            read is <span className="accent">waiting</span>
          </h1>

          <p className="login-sub">
            Sign in to access your library, track orders,
            and discover thousands of books curated just for you.
          </p>

          <div className="login-features">
            {[
              { icon: "📚", text: "10,000+ Books Available" },
              { icon: "🚀", text: "Fast Delivery Across India" },
              { icon: "🔒", text: "100% Secure Payments" },
            ].map(({ icon, text }) => (
              <div key={text} className="login-feature">
                <span className="login-feature-icon">{icon}</span>
                <span className="login-feature-text">{text}</span>
              </div>
            ))}
          </div>

          <div className="login-stats">
            {[
              { num: "10K+", label: "Books" },
              { num: "50K+", label: "Readers" },
              { num: "4.9★", label: "Rating" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="login-stat-num">{num}</div>
                <div className="login-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="login-right">
          <div className="login-card">

            {/* Mobile brand */}
            <Link to="/" className="login-mobile-brand">
              <div className="login-brand-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <span className="login-brand-name">Book<span>Store</span></span>
            </Link>

            <h2 className="login-card-title">Sign in</h2>
            <p className="login-card-sub">Enter your credentials to continue</p>

            {error && (
              <div className="login-error">
                <IconAlert />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">Email or Phone</label>
                <div className="login-input-wrap">
                  <IconEmail />
                  <input
                    className="login-input"
                    type="text"
                    name="identifier"
                    placeholder="you@example.com"
                    value={form.identifier}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">Password</label>
                <div className="login-input-wrap">
                  <IconLock />
                  <input
                    className="login-input has-toggle"
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-input-toggle"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>

              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? <div className="login-spinner" /> : "Sign In"}
              </button>
            </form>

            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">or</span>
              <div className="login-divider-line" />
            </div>

            <div className="login-footer">
              Don't have an account?{" "}
              <Link to="/register">Create Account</Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}