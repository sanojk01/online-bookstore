import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .pay-root {
    min-height: 100vh;
    background: #06061a;
    font-family: 'Sora', sans-serif;
    position: relative;
  }

  /* ── Background ── */
  .pay-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

  .pay-bg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .pay-bg-orb-1 {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    filter: blur(100px); background: radial-gradient(circle, #6366f1, #4f46e5);
    top: -150px; left: -100px; opacity: 0.12;
    animation: pay-orb 14s ease-in-out infinite;
  }

  .pay-bg-orb-2 {
    position: absolute; width: 350px; height: 350px; border-radius: 50%;
    filter: blur(80px); background: radial-gradient(circle, #8b5cf6, #7c3aed);
    bottom: 10%; right: -80px; opacity: 0.1;
    animation: pay-orb 18s ease-in-out infinite reverse;
  }

  @keyframes pay-orb {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(20px,-30px) scale(1.05); }
  }

  /* ── Topbar ── */
  .pay-topbar {
    position: relative; z-index: 1; padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(6,6,26,0.7); backdrop-filter: blur(12px);
  }

  .pay-topbar-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 32px;
    display: flex; align-items: center; gap: 16px;
  }

  .pay-back-btn {
    width: 34px; height: 34px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.6);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  }
  .pay-back-btn:hover { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }

  .pay-page-title {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 18px;
    font-weight: 800; color: #f1f5f9; letter-spacing: -0.03em; margin: 0;
  }

  /* Stepper */
  .pay-stepper { display: flex; align-items: center; margin-left: auto; }
  .pay-step    { display: flex; align-items: center; gap: 8px; }

  .pay-step-dot {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 12px; font-weight: 800; transition: all 0.3s;
  }
  .pay-step-dot.done   { background: rgba(99,102,241,0.2); border: 1.5px solid #6366f1; color: #a5b4fc; }
  .pay-step-dot.active { background: linear-gradient(135deg,#6366f1,#4f46e5); color: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.4); }
  .pay-step-dot.pending{ background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.25); }

  .pay-step-lbl { font-size: 12px; font-weight: 600; }
  .pay-step-lbl.done   { color: #818cf8; }
  .pay-step-lbl.active { color: #f1f5f9; }
  .pay-step-lbl.pending{ color: rgba(255,255,255,0.25); }

  .pay-step-line { width: 32px; height: 1px; background: rgba(255,255,255,0.1); margin: 0 6px; }
  .pay-step-line.done { background: rgba(99,102,241,0.4); }

  @media (max-width: 600px) {
    .pay-step-lbl { display: none; }
    .pay-topbar-inner { padding: 0 20px; }
    .pay-step-line { width: 20px; }
  }

  /* ── Content ── */
  .pay-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 36px 32px 80px; }
  @media (max-width: 768px) { .pay-content { padding: 24px 20px 60px; } }

  .pay-grid {
    display: grid;
    grid-template-columns: minmax(0,7fr) minmax(0,5fr);
    gap: 28px; align-items: start;
  }
  @media (max-width: 900px) { .pay-grid { grid-template-columns: 1fr; } }

  /* ── Cards ── */
  .pay-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 28px;
    animation: pay-fade-up 0.45s ease both;
  }

  .pay-card-right {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 24px;
    position: sticky; top: 88px;
    animation: pay-fade-up 0.45s 0.1s ease both;
  }

  @keyframes pay-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pay-section-title {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 800;
    color: #f1f5f9; letter-spacing: -0.025em; margin: 0 0 20px;
  }

  /* ── Method tabs ── */
  .pay-methods { display: flex; gap: 10px; margin-bottom: 24px; }

  .pay-method-btn {
    flex: 1; padding: 13px 10px; border-radius: 14px;
    border: 1.5px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.03);
    cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px;
    transition: all 0.22s; font-family: 'Sora', sans-serif; font-size: 12.5px; font-weight: 600;
    color: rgba(255,255,255,0.35);
  }
  .pay-method-btn:hover { border-color: rgba(99,102,241,0.4); color: #a5b4fc; background: rgba(99,102,241,0.06); }
  .pay-method-btn.active {
    border-color: #6366f1; background: rgba(99,102,241,0.12);
    color: #a5b4fc; box-shadow: 0 4px 14px rgba(99,102,241,0.15);
  }
  .pay-method-icon { font-size: 20px; }

  /* ── Test cards hint ── */
  .pay-hint-label {
    font-size: 11.5px; font-weight: 700; color: rgba(255,255,255,0.25);
    text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px;
  }

  .pay-test-card {
    width: 100%; padding: 10px 13px; border-radius: 11px; text-align: left;
    border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);
    font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500;
    color: rgba(255,255,255,0.45); cursor: pointer; transition: all 0.2s; margin-bottom: 6px;
    display: flex; align-items: center; gap: 10px;
  }
  .pay-test-card:hover { border-color: rgba(99,102,241,0.35); background: rgba(99,102,241,0.07); color: #a5b4fc; }
  .pay-test-card-num { font-family: monospace; font-size: 13px; color: rgba(255,255,255,0.6); }

  /* ── Form fields ── */
  .pay-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
  .pay-field label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.07em; }

  .pay-input {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 11px; padding: 11px 14px; color: #f1f5f9;
    font-family: 'Sora', sans-serif; font-size: 13.5px; font-weight: 500;
    outline: none; transition: all 0.2s; width: 100%;
  }
  .pay-input::placeholder { color: rgba(255,255,255,0.18); }
  .pay-input:hover { border-color: rgba(99,102,241,0.3); background: rgba(255,255,255,0.055); }
  .pay-input:focus { border-color: #6366f1; background: rgba(99,102,241,0.06); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

  .pay-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

  /* ── UPI hint ── */
  .pay-upi-hint {
    font-size: 12px; color: rgba(255,255,255,0.28); margin-bottom: 14px; font-weight: 400;
  }

  /* ── Bank buttons ── */
  .pay-banks { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }

  .pay-bank-btn {
    padding: 13px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03); font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 13px; font-weight: 800; color: rgba(255,255,255,0.4);
    cursor: pointer; transition: all 0.2s; letter-spacing: -0.01em;
  }
  .pay-bank-btn:hover { border-color: rgba(99,102,241,0.4); color: #a5b4fc; background: rgba(99,102,241,0.07); }
  .pay-bank-btn.active { border-color: #6366f1; background: rgba(99,102,241,0.12); color: #a5b4fc; box-shadow: 0 4px 12px rgba(99,102,241,0.15); }

  /* ── Pay button ── */
  .pay-btn {
    width: 100%; padding: 14px 0; border-radius: 14px; border: none; margin-top: 24px;
    background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff;
    font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 8px 24px rgba(99,102,241,0.3); letter-spacing: 0.01em;
  }
  .pay-btn:hover:not(:disabled) { background: linear-gradient(135deg,#5254cc,#4338ca); transform: translateY(-2px); box-shadow: 0 14px 32px rgba(99,102,241,0.45); }
  .pay-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  .pay-secure-note {
    text-align: center; margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.22); font-weight: 400;
  }

  /* ── Order summary (right) ── */
  .pay-sum-title {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 800;
    color: #f1f5f9; letter-spacing: -0.025em; margin: 0 0 18px;
  }

  .pay-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .pay-item:last-child { border-bottom: none; }

  .pay-item-img {
    width: 46px; height: 58px; border-radius: 10px; object-fit: cover; flex-shrink: 0;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
  }

  .pay-item-title {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 13px; font-weight: 700;
    color: #f1f5f9; letter-spacing: -0.02em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; margin-bottom: 3px;
  }
  .pay-item-qty { font-size: 11.5px; color: rgba(255,255,255,0.32); }
  .pay-item-price { font-family: 'Bricolage Grotesque', sans-serif; font-size: 14px; font-weight: 800; color: #818cf8; margin-left: auto; flex-shrink: 0; }

  .pay-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 16px 0; }

  .pay-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 18px; }
  .pay-total-lbl { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.6); }
  .pay-total-amt { font-family: 'Bricolage Grotesque', sans-serif; font-size: 30px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.04em; line-height: 1; }
  .pay-total-amt span { font-size: 18px; color: #818cf8; margin-right: 2px; }

  /* Order ID box */
  .pay-order-id-box {
    padding: 12px 14px; border-radius: 12px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
  }
  .pay-order-id-label { font-size: 11px; color: rgba(255,255,255,0.25); margin-bottom: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
  .pay-order-id-val   { font-family: monospace; font-size: 12px; color: rgba(255,255,255,0.5); word-break: break-all; }

  /* ── Loading screen ── */
  .pay-loading {
    position: relative; z-index: 1; display: flex; align-items: center; justify-content: center;
    min-height: 60vh;
  }
  .pay-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1;
    animation: spin 0.8s linear infinite;
  }

  /* ── Success screen ── */
  .pay-success {
    position: relative; z-index: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; min-height: 70vh;
    text-align: center; padding: 0 20px;
    animation: pay-fade-up 0.5s ease both;
  }

  .pay-success-ring {
    width: 100px; height: 100px; border-radius: 50%;
    background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 44px; margin-bottom: 28px;
    box-shadow: 0 0 0 16px rgba(34,197,94,0.06), 0 0 0 32px rgba(34,197,94,0.03);
    animation: success-pop 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes success-pop {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }

  .pay-success-title {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 2rem; font-weight: 800;
    color: #f1f5f9; letter-spacing: -0.03em; margin: 0 0 10px;
  }

  .pay-success-sub { font-size: 14px; color: rgba(255,255,255,0.35); font-weight: 300; margin: 0 0 24px; }

  .pay-success-amount {
    display: inline-flex; align-items: center; padding: 8px 22px; border-radius: 999px;
    background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 18px; font-weight: 800;
    color: #86efac; letter-spacing: -0.02em; margin-bottom: 36px;
  }

  .pay-success-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

  .pay-success-btn {
    padding: 12px 24px; border-radius: 12px; font-family: 'Sora', sans-serif;
    font-size: 13.5px; font-weight: 700; cursor: pointer; transition: all 0.25s; border: none; letter-spacing: 0.01em;
  }
  .pay-success-btn-outline {
    background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.12) !important;
    color: rgba(255,255,255,0.6);
  }
  .pay-success-btn-outline:hover { background: rgba(255,255,255,0.09); color: #f1f5f9; }
  .pay-success-btn-primary {
    background: linear-gradient(135deg,#6366f1,#4f46e5); color: #fff;
    box-shadow: 0 8px 22px rgba(99,102,241,0.3);
  }
  .pay-success-btn-primary:hover { background: linear-gradient(135deg,#5254cc,#4338ca); transform: translateY(-2px); box-shadow: 0 14px 30px rgba(99,102,241,0.4); }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

const STEPS      = ['Cart', 'Shipping', 'Payment'];
const BANKS      = ['SBI', 'HDFC', 'ICICI', 'AXIS', 'KOTAK'];
const TEST_CARDS = [
  { number: '4111111111111111', label: 'Visa — Always succeeds'  },
  { number: '5500000000000004', label: 'Mastercard — Succeeds'   },
  { number: '4000000000000002', label: 'Visa — Always declined'  },
];

/* ── Stepper ── */
function StepperBar({ active }) {
  return (
    <div className="pay-stepper">
      {STEPS.map((s, i) => {
        const st = i < active ? 'done' : i === active ? 'active' : 'pending';
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div className="pay-step">
              <div className={`pay-step-dot ${st}`}>
                {st === 'done'
                  ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : i + 1}
              </div>
              <span className={`pay-step-lbl ${st}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`pay-step-line${st === 'done' ? ' done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

/* ── Spinner ── */
const Spin = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

/* ── Success Screen ── */
function SuccessScreen({ order, navigate }) {
  return (
    <div className="pay-success">
      <div className="pay-success-ring">✓</div>
      <h2 className="pay-success-title">Payment Successful!</h2>
      <p className="pay-success-sub">Your order has been placed and payment received successfully.</p>
      <div className="pay-success-amount">₹{order?.totalPrice?.toLocaleString()} Paid</div>
      <div className="pay-success-btns">
        <button className="pay-success-btn pay-success-btn-outline" onClick={() => navigate('/my-orders')}>
          View My Orders
        </button>
        <button className="pay-success-btn pay-success-btn-primary" onClick={() => navigate('/books')}>
          Continue Shopping →
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function Payment() {
  const { orderId } = useParams();
  const navigate    = useNavigate();

  const [order,    setOrder]    = useState(null);
  const [fetching, setFetching] = useState(true);
  const [method,   setMethod]   = useState('card');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const [cardForm, setCardForm] = useState({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '' });
  const [upiId,    setUpiId]    = useState('');
  const [bankCode, setBankCode] = useState('');

  /* ── Fetch order ── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/orders/${orderId}`);
        setOrder(data.order);
        if (data.order.paymentStatus === 'paid') setSuccess(true);
      } catch {
        toast.error('Order not found.');
        navigate('/my-orders');
      } finally {
        setFetching(false);
      }
    })();
  }, [orderId]);

  /* ── Pay ── */
  const handlePay = async () => {
    const paymentDetails =
      method === 'card'       ? cardForm         :
      method === 'upi'        ? { vpa: upiId }   :
      method === 'netbanking' ? { bankCode }      : {};

    try {
      setLoading(true);
      await API.post(`/payments/${orderId}`, { paymentMethod: method, paymentDetails });
      setSuccess(true);
      toast.success('Payment successful! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.reason || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Shell ── */
  const Shell = ({ children }) => (
    <>
      <style>{styles}</style>
      <div className="pay-root">
        <div className="pay-bg">
          <div className="pay-bg-grid" />
          <div className="pay-bg-orb-1" />
          <div className="pay-bg-orb-2" />
        </div>
        <div className="pay-topbar">
          <div className="pay-topbar-inner">
            <button className="pay-back-btn" onClick={() => navigate('/my-orders')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <h1 className="pay-page-title">Complete Payment</h1>
            <StepperBar active={2} />
          </div>
        </div>
        {children}
      </div>
    </>
  );

  /* Loading */
  if (fetching) return (
    <Shell>
      <div className="pay-loading">
        <div className="pay-spinner" />
      </div>
    </Shell>
  );

  /* Success */
  if (success) return (
    <Shell>
      <SuccessScreen order={order} navigate={navigate} />
    </Shell>
  );

  /* ── Main ── */
  return (
    <Shell>
      <div className="pay-content">
        <div className="pay-grid">

          {/* ═══ LEFT — Payment form ═══ */}
          <div className="pay-card">
            <h2 className="pay-section-title">Payment Method</h2>

            {/* Method tabs */}
            <div className="pay-methods">
              {[
                { value: 'card',       icon: '💳', label: 'Card'        },
                { value: 'upi',        icon: '📱', label: 'UPI'         },
                { value: 'netbanking', icon: '🏦', label: 'Net Banking'  },
              ].map(m => (
                <button
                  key={m.value}
                  className={`pay-method-btn${method === m.value ? ' active' : ''}`}
                  onClick={() => setMethod(m.value)}
                >
                  <span className="pay-method-icon">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* ── Card ── */}
            {method === 'card' && (
              <div>
                <p className="pay-hint-label">🧪 Test cards — click to autofill</p>
                {TEST_CARDS.map(card => (
                  <button
                    key={card.number}
                    className="pay-test-card"
                    onClick={() => setCardForm({ cardNumber: card.number, expiryMonth: '12', expiryYear: '2027', cvv: '123' })}
                  >
                    <span className="pay-test-card-num">{card.number}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                    {card.label}
                  </button>
                ))}

                <div style={{ marginTop: 18 }}>
                  <div className="pay-field">
                    <label>Card Number</label>
                    <input
                      className="pay-input"
                      placeholder="4111 1111 1111 1111"
                      maxLength={16}
                      value={cardForm.cardNumber}
                      onChange={e => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                    />
                  </div>
                  <div className="pay-row">
                    <div className="pay-field">
                      <label>Month</label>
                      <input className="pay-input" placeholder="MM" maxLength={2}
                        value={cardForm.expiryMonth}
                        onChange={e => setCardForm({ ...cardForm, expiryMonth: e.target.value })}
                      />
                    </div>
                    <div className="pay-field">
                      <label>Year</label>
                      <input className="pay-input" placeholder="YYYY" maxLength={4}
                        value={cardForm.expiryYear}
                        onChange={e => setCardForm({ ...cardForm, expiryYear: e.target.value })}
                      />
                    </div>
                    <div className="pay-field">
                      <label>CVV</label>
                      <input className="pay-input" placeholder="•••" maxLength={3} type="password"
                        value={cardForm.cvv}
                        onChange={e => setCardForm({ ...cardForm, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── UPI ── */}
            {method === 'upi' && (
              <div>
                <p className="pay-upi-hint">💡 Enter any UPI ID — e.g. name@upi or name@okaxis</p>
                <div className="pay-field">
                  <label>UPI ID (VPA)</label>
                  <input
                    className="pay-input"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── Net Banking ── */}
            {method === 'netbanking' && (
              <div>
                <p className="pay-upi-hint">🏦 Select your bank</p>
                <div className="pay-banks">
                  {BANKS.map(bank => (
                    <button
                      key={bank}
                      className={`pay-bank-btn${bankCode === bank ? ' active' : ''}`}
                      onClick={() => setBankCode(bank)}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pay button */}
            <button className="pay-btn" onClick={handlePay} disabled={loading}>
              {loading
                ? <><Spin /> Processing…</>
                : <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Pay ₹{order?.totalPrice?.toLocaleString()}
                  </>
              }
            </button>

            <p className="pay-secure-note">🔒 Your payment is 100% secure and encrypted</p>
          </div>

          {/* ═══ RIGHT — Order summary ═══ */}
          <div className="pay-card-right">
            <h2 className="pay-sum-title">Order Summary</h2>

            <div style={{ marginBottom: 4 }}>
              {order?.items?.map(item => (
                <div key={item._id} className="pay-item">
                  <img
                    className="pay-item-img"
                    src={item.book?.images?.[0]?.url || `https://picsum.photos/seed/${item.book?._id}/46/58`}
                    alt={item.book?.title}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="pay-item-title">{item.book?.title}</div>
                    <div className="pay-item-qty">Qty: {item.quantity} × ₹{item.price}</div>
                  </div>
                  <div className="pay-item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="pay-divider" />

            <div className="pay-total-row">
              <span className="pay-total-lbl">Total</span>
              <div className="pay-total-amt"><span>₹</span>{order?.totalPrice?.toLocaleString()}</div>
            </div>

            {/* Order ID */}
            <div className="pay-order-id-box">
              <div className="pay-order-id-label">Order ID</div>
              <div className="pay-order-id-val">{orderId}</div>
            </div>
          </div>

        </div>
      </div>
    </Shell>
  );
}