import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-root {
    height: 100vh;
    display: flex;
    font-family: 'Sora', sans-serif;
    background: #06061a;
    position: relative;
    overflow: hidden;
  }

  /* ── Background ── */
  .reg-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .reg-bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
  }

  .reg-bg-orb-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, #6366f1, #4f46e5);
    top: -200px; left: -150px;
    animation: orb-float 12s ease-in-out infinite;
  }

  .reg-bg-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #8b5cf6, #7c3aed);
    bottom: -100px; right: -80px;
    animation: orb-float 15s ease-in-out infinite reverse;
  }

  .reg-bg-orb-3 {
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

  .reg-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── Left Panel ── */
  .reg-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 56px;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  @media (max-width: 900px) { .reg-left { display: none; } }

  .reg-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
    text-decoration: none;
  }

  .reg-brand-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(99,102,241,0.45);
    flex-shrink: 0;
  }

  .reg-brand-name {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.04em;
  }

  .reg-brand-name span { color: #818cf8; }

  .reg-headline {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(28px, 3vw, 44px);
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 14px;
  }

  .reg-headline .accent {
    background: linear-gradient(135deg, #818cf8, #c4b5fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .reg-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.45);
    line-height: 1.6;
    max-width: 360px;
    margin-bottom: 32px;
  }

  .reg-steps {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .reg-step {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 11px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(10px);
    transition: border-color 0.3s ease, background 0.3s ease;
    animation: step-in 0.6s ease both;
  }

  .reg-step:nth-child(1) { animation-delay: 0.1s; }
  .reg-step:nth-child(2) { animation-delay: 0.2s; }
  .reg-step:nth-child(3) { animation-delay: 0.3s; }

  @keyframes step-in {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .reg-step:hover {
    background: rgba(99,102,241,0.07);
    border-color: rgba(139,92,246,0.2);
  }

  .reg-step-num {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .reg-step-text {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.65);
  }

  .reg-stats {
    display: flex;
    gap: 28px;
    margin-top: 32px;
  }

  .reg-stat-num {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;
  }

  .reg-stat-label {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    margin-top: 2px;
    font-weight: 500;
  }

  /* ── Right Panel ── */
  .reg-right {
    width: 500px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 44px;
    position: relative;
    z-index: 1;
    background: rgba(8,8,28,0.6);
    border-left: 1px solid rgba(139,92,246,0.1);
    backdrop-filter: blur(20px);
    overflow: hidden;
  }

  @media (max-width: 900px) {
    .reg-right {
      width: 100%;
      border-left: none;
      background: transparent;
      padding: 32px 24px;
    }
  }

  .reg-card {
    width: 100%;
    max-width: 400px;
    animation: card-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .reg-mobile-brand {
    display: none;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
    text-decoration: none;
  }

  @media (max-width: 900px) { .reg-mobile-brand { display: flex; } }

  .reg-card-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 24px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;
    margin-bottom: 3px;
  }

  .reg-card-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.38);
    margin-bottom: 18px;
    line-height: 1.5;
  }

  /* Role Toggle */
  .reg-role-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  .reg-role-group {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .reg-role-btn {
    flex: 1;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.45);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
  }

  .reg-role-btn:hover {
    background: rgba(99,102,241,0.07);
    border-color: rgba(139,92,246,0.2);
    color: rgba(255,255,255,0.7);
  }

  .reg-role-btn.active {
    background: rgba(99,102,241,0.15);
    border-color: rgba(99,102,241,0.5);
    color: #818cf8;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  .reg-role-icon { font-size: 16px; }

  /* Error */
  .reg-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 13px;
    border-radius: 10px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    color: #fca5a5;
    font-size: 12.5px;
    margin-bottom: 14px;
    animation: shake 0.3s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  /* Grid fields */
  .reg-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 10px;
  }

  .reg-field {
    margin-bottom: 10px;
  }

  .reg-field-last {
    margin-bottom: 0;
  }

  .reg-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }

  .reg-input-wrap { position: relative; }

  .reg-input-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.22);
    width: 15px; height: 15px;
    pointer-events: none;
  }

  .reg-input {
    width: 100%;
    padding: 11px 14px 11px 38px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px;
    color: #f1f5f9;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }

  .reg-input.no-icon { padding-left: 14px; }

  .reg-input::placeholder { color: rgba(255,255,255,0.18); }

  .reg-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.05);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  .reg-input.has-toggle { padding-right: 40px; }

  .reg-input-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255,255,255,0.22);
    padding: 0;
    display: flex;
    transition: color 0.2s ease;
  }

  .reg-input-toggle:hover { color: rgba(255,255,255,0.55); }

  /* Select */
  .reg-select {
    width: 100%;
    padding: 11px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px;
    color: #f1f5f9;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    appearance: none;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }

  .reg-select:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.05);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  .reg-select option { background: #12122a; color: #f1f5f9; }

  /* Submit */
  .reg-btn {
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
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: 0.01em;
  }

  .reg-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.55);
  }

  .reg-btn:active:not(:disabled) { transform: translateY(0); }

  .reg-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .reg-spinner {
    width: 17px; height: 17px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Divider */
  .reg-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 16px 0;
  }

  .reg-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .reg-divider-text {
    font-size: 11px;
    color: rgba(255,255,255,0.22);
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* Footer */
  .reg-footer {
    text-align: center;
    font-size: 13px;
    color: rgba(255,255,255,0.32);
  }

  .reg-footer a {
    color: #818cf8;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .reg-footer a:hover {
    color: #c4b5fd;
    text-decoration: underline;
  }
`;

const IconUser = () => (
  <svg className="reg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconPhone = () => (
  <svg className="reg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>
  </svg>
);

const IconEmail = () => (
  <svg className="reg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconLock = () => (
  <svg className="reg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "", phone: "", email: "",
    gender: "", password: "", confirmPassword: "", role: "user",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.fullname || !form.phone || !form.email || !form.gender || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields."); return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const user = await register({
        fullname: form.fullname, phone: form.phone,
        email: form.email, gender: form.gender,
        password: form.password, role: form.role,
      });
      toast.success(`Welcome, ${user.fullname}!`);
      navigate(user.role === "seller" ? "/seller/dashboard" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">

        {/* Background */}
        <div className="reg-bg">
          <div className="reg-bg-grid" />
          <div className="reg-bg-orb reg-bg-orb-1" />
          <div className="reg-bg-orb reg-bg-orb-2" />
          <div className="reg-bg-orb reg-bg-orb-3" />
        </div>

        {/* ── Left Panel ── */}
        <div className="reg-left">
          <Link to="/" className="reg-brand">
            <div className="reg-brand-icon"><BookIcon /></div>
            <span className="reg-brand-name">Book<span>Store</span></span>
          </Link>

          <h1 className="reg-headline">
            Start your reading<br />
            journey <span className="accent">today</span>
          </h1>

          <p className="reg-sub">
            Create your account in seconds and unlock access
            to thousands of books curated just for you.
          </p>

          <div className="reg-steps">
            {[
              { num: "1", text: "Create your free account" },
              { num: "2", text: "Browse 10,000+ books" },
              { num: "3", text: "Get fast delivery across India" },
            ].map(({ num, text }) => (
              <div key={num} className="reg-step">
                <div className="reg-step-num">{num}</div>
                <span className="reg-step-text">{text}</span>
              </div>
            ))}
          </div>

          <div className="reg-stats">
            {[
              { num: "10K+", label: "Books" },
              { num: "50K+", label: "Readers" },
              { num: "4.9★", label: "Rating" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="reg-stat-num">{num}</div>
                <div className="reg-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="reg-right">
          <div className="reg-card">

            {/* Mobile brand */}
            <Link to="/" className="reg-mobile-brand">
              <div className="reg-brand-icon" style={{width:34,height:34,borderRadius:10}}>
                <BookIcon />
              </div>
              <span className="reg-brand-name">Book<span>Store</span></span>
            </Link>

            <h2 className="reg-card-title">Create Account</h2>
            <p className="reg-card-sub">Join us today — it's free!</p>

            {/* Role Toggle */}
            <div className="reg-role-label">I want to</div>
            <div className="reg-role-group">
              <button
                type="button"
                className={`reg-role-btn ${form.role === "user" ? "active" : ""}`}
                onClick={() => setForm({ ...form, role: "user" })}
              >
                <span className="reg-role-icon">🛍️</span>
                Buy Books
              </button>
              <button
                type="button"
                className={`reg-role-btn ${form.role === "seller" ? "active" : ""}`}
                onClick={() => setForm({ ...form, role: "seller" })}
              >
                <span className="reg-role-icon">🏪</span>
                Sell Books
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="reg-error">
                <IconAlert />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Row 1: Name + Phone */}
              <div className="reg-grid-2">
                <div>
                  <label className="reg-label">Full Name</label>
                  <div className="reg-input-wrap">
                    <IconUser />
                    <input className="reg-input" type="text" name="fullname"
                      placeholder="John Doe" value={form.fullname} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="reg-label">Phone</label>
                  <div className="reg-input-wrap">
                    <IconPhone />
                    <input className="reg-input" type="tel" name="phone"
                      placeholder="+91 98765..." value={form.phone} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Row 2: Email + Gender */}
              <div className="reg-grid-2">
                <div>
                  <label className="reg-label">Email</label>
                  <div className="reg-input-wrap">
                    <IconEmail />
                    <input className="reg-input" type="email" name="email"
                      placeholder="you@mail.com" value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="reg-label">Gender</label>
                  <select className="reg-select" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="reg-field">
                <label className="reg-label">Password</label>
                <div className="reg-input-wrap">
                  <IconLock />
                  <input className="reg-input has-toggle" type={showPass ? "text" : "password"}
                    name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
                  <button type="button" className="reg-input-toggle" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                    {showPass ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="reg-field reg-field-last">
                <label className="reg-label">Confirm Password</label>
                <div className="reg-input-wrap">
                  <IconLock />
                  <input className="reg-input has-toggle" type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
                  <button type="button" className="reg-input-toggle" onClick={() => setShowConfirmPass(!showConfirmPass)} tabIndex={-1}>
                    {showConfirmPass ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>

              <button className="reg-btn" type="submit" disabled={loading}>
                {loading
                  ? <div className="reg-spinner" />
                  : `Create ${form.role === "seller" ? "Seller" : "Buyer"} Account`
                }
              </button>
            </form>

            <div className="reg-divider">
              <div className="reg-divider-line" />
              <span className="reg-divider-text">or</span>
              <div className="reg-divider-line" />
            </div>

            <div className="reg-footer">
              Already have an account?{" "}
              <Link to="/login">Sign In</Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}