import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .co-root {
    min-height: 100vh;
    background: #06061a;
    font-family: 'Sora', sans-serif;
    position: relative;
  }

  /* ── Background ── */
  .co-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

  .co-bg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .co-bg-orb-1 {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    filter: blur(100px); background: radial-gradient(circle, #6366f1, #4f46e5);
    top: -150px; left: -100px; opacity: 0.12;
    animation: co-orb-drift 14s ease-in-out infinite;
  }

  .co-bg-orb-2 {
    position: absolute; width: 350px; height: 350px; border-radius: 50%;
    filter: blur(80px); background: radial-gradient(circle, #8b5cf6, #7c3aed);
    bottom: 10%; right: -80px; opacity: 0.1;
    animation: co-orb-drift 18s ease-in-out infinite reverse;
  }

  @keyframes co-orb-drift {
    0%, 100% { transform: translate(0,0) scale(1); }
    50%       { transform: translate(20px,-30px) scale(1.05); }
  }

  /* ── Topbar ── */
  .co-topbar {
    position: relative; z-index: 1; padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(6,6,26,0.7); backdrop-filter: blur(12px);
  }

  .co-topbar-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 32px;
    display: flex; align-items: center; gap: 16px;
  }

  .co-back-btn {
    width: 34px; height: 34px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.6);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  }
  .co-back-btn:hover { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }

  .co-page-title {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 18px;
    font-weight: 800; color: #f1f5f9; letter-spacing: -0.03em; margin: 0;
  }

  /* ── Stepper ── */
  .co-stepper { display: flex; align-items: center; margin-left: auto; }

  .co-step { display: flex; align-items: center; gap: 8px; }

  .co-step-dot {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 12px; font-weight: 800; transition: all 0.3s;
  }
  .co-step-dot.done   { background: rgba(99,102,241,0.2); border: 1.5px solid #6366f1; color: #a5b4fc; }
  .co-step-dot.active { background: linear-gradient(135deg,#6366f1,#4f46e5); color: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.4); }
  .co-step-dot.pending{ background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.25); }

  .co-step-label { font-size: 12px; font-weight: 600; }
  .co-step-label.done   { color: #818cf8; }
  .co-step-label.active { color: #f1f5f9; }
  .co-step-label.pending{ color: rgba(255,255,255,0.25); }

  .co-step-line { width: 32px; height: 1px; background: rgba(255,255,255,0.1); margin: 0 6px; }
  .co-step-line.done { background: rgba(99,102,241,0.4); }

  @media (max-width: 600px) {
    .co-step-label { display: none; }
    .co-topbar-inner { padding: 0 20px; }
    .co-step-line { width: 20px; }
  }

  /* ── Content ── */
  .co-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 36px 32px 80px; }
  @media (max-width: 768px) { .co-content { padding: 24px 20px 60px; } }

  .co-grid {
    display: grid;
    grid-template-columns: minmax(0,7fr) minmax(0,5fr);
    gap: 28px; align-items: start;
  }
  @media (max-width: 900px) { .co-grid { grid-template-columns: 1fr; } }

  /* ── Cards ── */
  .co-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 28px;
    animation: co-fade-up 0.45s ease both;
  }

  .co-card-summary {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 24px;
    position: sticky; top: 88px;
    animation: co-fade-up 0.45s 0.1s ease both;
  }

  @keyframes co-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Section header */
  .co-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }

  .co-section-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2);
    display: flex; align-items: center; justify-content: center; color: #a5b4fc; flex-shrink: 0;
  }

  .co-section-title {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px;
    font-weight: 800; color: #f1f5f9; letter-spacing: -0.025em; margin: 0; flex: 1;
  }

  /* ── Saved address cards ── */
  .co-addr-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }

  .co-addr-card {
    position: relative; padding: 14px 16px; border-radius: 14px;
    border: 1.5px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);
    cursor: pointer; transition: all 0.22s; display: flex; align-items: flex-start; gap: 12px;
  }
  .co-addr-card:hover { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.04); }
  .co-addr-card.selected { border-color: #6366f1; background: rgba(99,102,241,0.08); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

  .co-radio {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.2); flex-shrink: 0; margin-top: 2px;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .co-addr-card.selected .co-radio { border-color: #6366f1; background: #6366f1; }

  .co-radio-dot { width: 7px; height: 7px; border-radius: 50%; background: #fff; opacity: 0; transition: opacity 0.2s; }
  .co-addr-card.selected .co-radio-dot { opacity: 1; }

  .co-addr-info { flex: 1; min-width: 0; }

  .co-addr-name {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 14px; font-weight: 700;
    color: #f1f5f9; letter-spacing: -0.02em; margin-bottom: 4px;
    display: flex; align-items: center; gap: 8px;
  }

  .co-addr-default {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700;
    background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc;
    font-family: 'Sora', sans-serif; letter-spacing: 0.04em;
  }

  .co-addr-line { font-size: 12.5px; color: rgba(255,255,255,0.38); line-height: 1.6; }
  .co-addr-phone { font-size: 12px; color: rgba(255,255,255,0.28); margin-top: 3px; }

  /* Add new btn */
  .co-add-addr-btn {
    width: 100%; padding: 13px 16px; border-radius: 14px;
    border: 1.5px dashed rgba(99,102,241,0.3); background: rgba(99,102,241,0.04);
    color: #818cf8; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s;
  }
  .co-add-addr-btn:hover { border-color: rgba(99,102,241,0.55); background: rgba(99,102,241,0.09); color: #a5b4fc; }

  /* ── New address form panel ── */
  .co-new-form {
    margin-top: 16px; padding: 20px; border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);
    animation: co-fade-up 0.3s ease both;
  }

  .co-new-form-title {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 14px; font-weight: 800;
    color: #f1f5f9; letter-spacing: -0.02em; margin: 0 0 16px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .co-close-form-btn {
    width: 26px; height: 26px; border-radius: 8px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.45);
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; padding: 0;
  }
  .co-close-form-btn:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #fca5a5; }

  /* Form grid */
  .co-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .co-field-full { grid-column: 1 / -1; }
  .co-field { display: flex; flex-direction: column; gap: 5px; }
  .co-field label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.07em; }

  .co-input {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 11px; padding: 10px 13px; color: #f1f5f9;
    font-family: 'Sora', sans-serif; font-size: 13.5px; font-weight: 500;
    outline: none; transition: all 0.2s; width: 100%;
  }
  .co-input::placeholder { color: rgba(255,255,255,0.18); }
  .co-input:hover { border-color: rgba(99,102,241,0.3); background: rgba(255,255,255,0.055); }
  .co-input:focus { border-color: #6366f1; background: rgba(99,102,241,0.06); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .co-input.error { border-color: rgba(239,68,68,0.5); background: rgba(239,68,68,0.04); }
  .co-input.error:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
  .co-field-err { font-size: 11px; color: #fca5a5; margin: 0; }

  @media (max-width: 500px) { .co-fields { grid-template-columns: 1fr; } .co-field-full { grid-column: 1; } }

  /* Save toggle row */
  .co-save-row {
    display: flex; align-items: center; gap: 8px; margin-top: 14px;
    padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06);
  }
  .co-toggle { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
  .co-toggle input { opacity: 0; width: 0; height: 0; }
  .co-toggle-track {
    position: absolute; inset: 0; border-radius: 999px;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
    cursor: pointer; transition: all 0.25s;
  }
  .co-toggle-track::after {
    content:''; position: absolute; top: 2px; left: 2px;
    width: 14px; height: 14px; border-radius: 50%;
    background: rgba(255,255,255,0.35); transition: all 0.25s;
  }
  .co-toggle input:checked + .co-toggle-track { background: rgba(99,102,241,0.35); border-color: #6366f1; }
  .co-toggle input:checked + .co-toggle-track::after { transform: translateX(16px); background: #a5b4fc; }
  .co-toggle-label { font-size: 12.5px; color: rgba(255,255,255,0.4); font-weight: 500; }

  /* Save & select btn */
  .co-save-new-btn {
    width: 100%; margin-top: 14px; padding: 11px 0; border-radius: 12px;
    border: 1px solid rgba(99,102,241,0.35); background: rgba(99,102,241,0.1);
    color: #a5b4fc; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s;
  }
  .co-save-new-btn:hover:not(:disabled) { background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.6); }
  .co-save-new-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Divider ── */
  .co-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 16px 0; }

  /* ── Order summary ── */
  .co-sum-title {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 800;
    color: #f1f5f9; letter-spacing: -0.025em; margin: 0 0 18px;
  }

  .co-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .co-item:last-child { border-bottom: none; }

  .co-item-img {
    width: 46px; height: 58px; border-radius: 10px; object-fit: cover;
    flex-shrink: 0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
  }
  .co-item-title {
    font-family: 'Bricolage Grotesque', sans-serif; font-size: 13px; font-weight: 700;
    color: #f1f5f9; letter-spacing: -0.02em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; margin-bottom: 3px;
  }
  .co-item-qty { font-size: 11.5px; color: rgba(255,255,255,0.35); font-weight: 500; }
  .co-item-price { font-family: 'Bricolage Grotesque', sans-serif; font-size: 14px; font-weight: 800; color: #818cf8; margin-left: auto; flex-shrink: 0; }

  .co-sum-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .co-sum-label { font-size: 13px; color: rgba(255,255,255,0.38); }
  .co-sum-val   { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); }

  .co-free-badge {
    display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px;
    background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2);
    color: #86efac; font-size: 11px; font-weight: 700; letter-spacing: 0.03em;
  }

  .co-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; }
  .co-total-label { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.6); }
  .co-total-amount { font-family: 'Bricolage Grotesque', sans-serif; font-size: 30px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.04em; line-height: 1; }
  .co-total-amount span { font-size: 18px; color: #818cf8; margin-right: 2px; }

  /* ── Place order btn ── */
  .co-place-btn {
    width: 100%; padding: 14px 0; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff;
    font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 8px 24px rgba(99,102,241,0.3); letter-spacing: 0.01em;
  }
  .co-place-btn:hover:not(:disabled) { background: linear-gradient(135deg,#5254cc,#4338ca); transform: translateY(-2px); box-shadow: 0 14px 32px rgba(99,102,241,0.45); }
  .co-place-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  .co-trust { display: flex; justify-content: center; gap: 18px; margin-top: 16px; flex-wrap: wrap; }
  .co-trust-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 500; }

  /* Skeleton */
  .co-skel { background: rgba(255,255,255,0.05); border-radius: 10px; animation: skel-pulse 1.5s ease-in-out infinite; }
  @keyframes skel-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const STEPS       = ['Cart', 'Shipping', 'Payment'];
const EMPTY_FORM  = { name: '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India' };
const FIELDS      = [
  { name: 'name',    label: 'Full Name',      placeholder: 'Rahul Sharma',      full: false },
  { name: 'phone',   label: 'Phone Number',   placeholder: '9876543210',         full: false },
  { name: 'street',  label: 'Street Address', placeholder: 'Plot 12, MG Road…', full: true  },
  { name: 'city',    label: 'City',           placeholder: 'Bengaluru',          full: false },
  { name: 'state',   label: 'State',          placeholder: 'Karnataka',          full: false },
  { name: 'pincode', label: 'Pincode',        placeholder: '560001',             full: false },
  { name: 'country', label: 'Country',        placeholder: 'India',              full: false },
];

/* ── Stepper ── */
function StepperBar({ active }) {
  return (
    <div className="co-stepper">
      {STEPS.map((s, i) => {
        const st = i < active ? 'done' : i === active ? 'active' : 'pending';
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div className="co-step">
              <div className={`co-step-dot ${st}`}>
                {st === 'done'
                  ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : i + 1}
              </div>
              <span className={`co-step-label ${st}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`co-step-line${st === 'done' ? ' done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

/* ── Spinner SVG ── */
const Spin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════ */
export default function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [savedAddrs,   setSavedAddrs]   = useState([]);
  const [addrLoading,  setAddrLoading]  = useState(true);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [showNewForm,  setShowNewForm]  = useState(false);
  const [saveForLater, setSaveForLater] = useState(false);

  const [newAddr, setNewAddr] = useState(EMPTY_FORM);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [placing, setPlacing] = useState(false);

  /* ── Load saved addresses on mount ── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get('/users/me/addresses');
        const list = data.address || [];
        setSavedAddrs(list);
        const def = list.find(a => a.isDefault) || list[0];
        if (def) setSelectedAddr(def._id);
        if (list.length === 0) setShowNewForm(true);
      } catch {
        setShowNewForm(true);
      } finally {
        setAddrLoading(false);
      }
    })();
  }, []);

  /* ── Form helpers ── */
  const handleNewChange = (e) => {
    setNewAddr(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const validateNew = () => {
    const errs = {};
    if (!newAddr.name.trim())             errs.name    = 'Full name is required';
    if (!/^\d{10}$/.test(newAddr.phone))  errs.phone   = 'Valid 10-digit phone required';
    if (!newAddr.street.trim())           errs.street  = 'Street address is required';
    if (!newAddr.city.trim())             errs.city    = 'City is required';
    if (!newAddr.state.trim())            errs.state   = 'State is required';
    if (!/^\d{6}$/.test(newAddr.pincode)) errs.pincode = 'Valid 6-digit pincode required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Save new address → backend ── */
  const handleSaveNew = async () => {
    if (!validateNew()) return;
    try {
      setSaving(true);
      const { data } = await API.post('/users/me/addresses/addAddress', {
        ...newAddr,
        isDefault: savedAddrs.length === 0,
      });
      const list  = data.address || [];
      const added = list[list.length - 1];
      setSavedAddrs(list);
      setSelectedAddr(added._id);
      setShowNewForm(false);
      setNewAddr(EMPTY_FORM);
      toast.success('Address saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Place order ── */
  const handlePlaceOrder = async () => {
    let shippingAddress;

    if (showNewForm && savedAddrs.length === 0) {
      if (!validateNew()) return;
      shippingAddress = newAddr;
    } else {
      if (!selectedAddr) { toast.error('Please select a delivery address.'); return; }
      const addr = savedAddrs.find(a => a._id === selectedAddr);
      if (!addr) { toast.error('Address not found.'); return; }
      const { _id, isDefault, __v, ...rest } = addr;
      shippingAddress = rest;
    }

    try {
      setPlacing(true);
      const { data } = await API.post('/orders/from-cart', { shippingAddress });
      toast.success('Order placed successfully!');
      navigate(`/payment/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  const deliveryCharge = (cart?.totalAmount || 0) >= 499 ? 0 : 49;
  const finalAmount    = (cart?.totalAmount || 0) + deliveryCharge;

  /* ── Render ── */
  return (
    <>
      <style>{styles}</style>
      <div className="co-root">

        {/* BG */}
        <div className="co-bg">
          <div className="co-bg-grid" />
          <div className="co-bg-orb-1" />
          <div className="co-bg-orb-2" />
        </div>

        {/* Topbar */}
        <div className="co-topbar">
          <div className="co-topbar-inner">
            <button className="co-back-btn" onClick={() => navigate('/cart')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <h1 className="co-page-title">Checkout</h1>
            <StepperBar active={1} />
          </div>
        </div>

        <div className="co-content">
          <div className="co-grid">

            {/* ═══ LEFT — Shipping ═══ */}
            <div className="co-card">
              <div className="co-section-head">
                <div className="co-section-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h2 className="co-section-title">Shipping Address</h2>
              </div>

              {/* Skeleton */}
              {addrLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1, 2].map(i => (
                    <div key={i} className="co-skel" style={{ height: 76, borderRadius: 14 }} />
                  ))}
                </div>
              )}

              {/* ── Saved address cards ── */}
              {!addrLoading && savedAddrs.length > 0 && (
                <div className="co-addr-list">
                  {savedAddrs.map(addr => (
                    <div
                      key={addr._id}
                      className={`co-addr-card${selectedAddr === addr._id ? ' selected' : ''}`}
                      onClick={() => { setSelectedAddr(addr._id); setShowNewForm(false); }}
                    >
                      <div className="co-radio">
                        <div className="co-radio-dot" />
                      </div>
                      <div className="co-addr-info">
                        <div className="co-addr-name">
                          {addr.name}
                          {addr.isDefault && <span className="co-addr-default">★ Default</span>}
                        </div>
                        <div className="co-addr-line">
                          {addr.street}, {addr.city}, {addr.state} – {addr.pincode}
                        </div>
                        <div className="co-addr-phone">{addr.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Add new address btn ── */}
              {!addrLoading && savedAddrs.length > 0 && !showNewForm && (
                <button
                  className="co-add-addr-btn"
                  onClick={() => { setShowNewForm(true); setSelectedAddr(null); setErrors({}); }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5"  y1="12" x2="19" y2="12"/>
                  </svg>
                  Add New Address
                </button>
              )}

              {/* ── New address form ── */}
              {!addrLoading && showNewForm && (
                <div className="co-new-form">
                  <div className="co-new-form-title">
                    <span>New Address</span>
                    {savedAddrs.length > 0 && (
                      <button
                        className="co-close-form-btn"
                        onClick={() => { setShowNewForm(false); setErrors({}); setNewAddr(EMPTY_FORM); }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6"  y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="co-fields">
                    {FIELDS.map(f => (
                      <div key={f.name} className={`co-field${f.full ? ' co-field-full' : ''}`}>
                        <label htmlFor={`nf-${f.name}`}>{f.label}</label>
                        <input
                          id={`nf-${f.name}`}
                          name={f.name}
                          className={`co-input${errors[f.name] ? ' error' : ''}`}
                          placeholder={f.placeholder}
                          value={newAddr[f.name]}
                          onChange={handleNewChange}
                          autoComplete="off"
                        />
                        {errors[f.name] && <p className="co-field-err">{errors[f.name]}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Save for later toggle (only when no existing addresses) */}
                  {savedAddrs.length === 0 && (
                    <div className="co-save-row">
                      <label className="co-toggle">
                        <input type="checkbox" checked={saveForLater} onChange={e => setSaveForLater(e.target.checked)} />
                        <span className="co-toggle-track" />
                      </label>
                      <span className="co-toggle-label">Save this address for future orders</span>
                    </div>
                  )}

                  {/* Save & select btn (only when existing addresses present) */}
                  {savedAddrs.length > 0 && (
                    <button className="co-save-new-btn" onClick={handleSaveNew} disabled={saving}>
                      {saving
                        ? <><Spin /> Saving…</>
                        : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Save & Select</>
                      }
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ═══ RIGHT — Order Summary ═══ */}
            <div className="co-card-summary">
              <h2 className="co-sum-title">Order Summary</h2>

              <div style={{ marginBottom: 4 }}>
                {cart?.items?.map(item => (
                  <div key={item.book._id} className="co-item">
                    <img
                      className="co-item-img"
                      src={item.book.images?.[0]?.url || `https://picsum.photos/seed/${item.book._id}/46/58`}
                      alt={item.book.title}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="co-item-title">{item.book.title}</div>
                      <div className="co-item-qty">Qty: {item.quantity}</div>
                    </div>
                    <div className="co-item-price">₹{(item.book.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="co-divider" />

              <div className="co-sum-row">
                <span className="co-sum-label">Subtotal</span>
                <span className="co-sum-val">₹{cart?.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="co-sum-row">
                <span className="co-sum-label">Delivery</span>
                {deliveryCharge === 0
                  ? <span className="co-free-badge">FREE</span>
                  : <span className="co-sum-val">₹{deliveryCharge}</span>
                }
              </div>

              <div className="co-divider" />

              <div className="co-total-row">
                <span className="co-total-label">Total</span>
                <div className="co-total-amount"><span>₹</span>{finalAmount.toLocaleString()}</div>
              </div>

              <button
                className="co-place-btn"
                onClick={handlePlaceOrder}
                disabled={placing || !cart?.items?.length}
              >
                {placing
                  ? <><Spin /> Placing Order…</>
                  : <>Place Order <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                }
              </button>

              <div className="co-trust">
                {[
                  { icon: '🔒', text: 'Secure checkout' },
                  { icon: '↩️', text: '7-day returns'   },
                  { icon: '🚚', text: 'Fast delivery'   },
                ].map(t => (
                  <div key={t.text} className="co-trust-item">
                    <span style={{ fontSize: 13 }}>{t.icon}</span>{t.text}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}