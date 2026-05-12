import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowBack, HourglassEmpty, LocalShipping, CheckCircle,
  Cancel, Replay, RotateLeft, CreditCard, Close,
  LocationOn, Person, Phone, Inventory2, ChevronRight,
} from '@mui/icons-material';
import API from '../../api/axios';
import { toast } from 'react-toastify';

/* ─── Fonts & Keyframes ──────────────────────────────────────── */
const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position: 700px 0; }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
    50%       { opacity: 0.75; }
  }
`;

/* ─── Design tokens ──────────────────────────────────────────── */
const T = {
  bg:      '#f4f6fb',
  surface: '#ffffff',
  border:  '#eaeff6',
  muted:   '#94a3b8',
  text:    '#0f172a',
  sub:     '#64748b',
};

/* ─── Config ─────────────────────────────────────────────────── */
const STATUS_CFG = {
  pending:   { label: 'Pending',   color: '#b45309', bg: '#fef3c7', dot: '#f59e0b', accent: '#f59e0b', Icon: HourglassEmpty, step: 0 },
  shipped:   { label: 'Shipped',   color: '#1d4ed8', bg: '#dbeafe', dot: '#3b82f6', accent: '#3b82f6', Icon: LocalShipping,  step: 1 },
  delivered: { label: 'Delivered', color: '#15803d', bg: '#dcfce7', dot: '#22c55e', accent: '#22c55e', Icon: CheckCircle,    step: 2 },
  returned:  { label: 'Returned',  color: '#6d28d9', bg: '#ede9fe', dot: '#8b5cf6', accent: '#8b5cf6', Icon: Replay,         step: 3 },
  cancelled: { label: 'Cancelled', color: '#b91c1c', bg: '#fee2e2', dot: '#ef4444', accent: '#ef4444', Icon: Cancel,         step: -1 },
};

const PAYMENT_CFG = {
  paid:     { label: 'Paid',     color: '#15803d', bg: '#dcfce7', dot: '#22c55e' },
  unpaid:   { label: 'Unpaid',   color: '#b45309', bg: '#fef3c7', dot: '#f59e0b' },
  refunded: { label: 'Refunded', color: '#6d28d9', bg: '#ede9fe', dot: '#8b5cf6' },
};

const TIMELINE_STEPS = [
  { key: 'pending',   label: 'Order Placed', Icon: Inventory2    },
  { key: 'shipped',   label: 'Shipped',      Icon: LocalShipping },
  { key: 'delivered', label: 'Delivered',    Icon: CheckCircle   },
];

/* ─── Pill ───────────────────────────────────────────────────── */
function Pill({ cfg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
      padding: '3px 10px', borderRadius: 99,
      color: cfg.color, background: cfg.bg,
      fontFamily: 'Sora, sans-serif',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot || cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

/* ─── Button ─────────────────────────────────────────────────── */
function Btn({ variant = 'primary', disabled, onClick, children }) {
  const styles = {
    primary: { background: '#1e40af', color: '#fff',    border: 'none',              boxShadow: '0 1px 6px rgba(30,64,175,.35)' },
    danger:  { background: '#fff5f5', color: '#dc2626', border: '1px solid #fca5a5', boxShadow: 'none' },
    ghost:   { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', boxShadow: 'none' },
  };
  const s = styles[variant];
  return (
    <button disabled={disabled} onClick={onClick} style={{
      padding: '9px 18px', borderRadius: 9, fontSize: 12.5, fontWeight: 600,
      fontFamily: 'Sora, sans-serif', letterSpacing: '0.01em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      opacity: disabled ? 0.5 : 1, transition: 'opacity 0.15s',
      ...s,
    }}>
      {children}
    </button>
  );
}

/* ─── Section card ───────────────────────────────────────────── */
function Card({ title, icon: Icon, children, delay = 0, accent }) {
  return (
    <div style={{
      background: T.surface, borderRadius: 16,
      border: `1px solid ${T.border}`,
      borderLeft: accent ? `4px solid ${accent}` : undefined,
      overflow: 'hidden',
      animation: `fadeUp 0.35s ease ${delay}s both`,
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 18px', borderBottom: `1px solid ${T.border}`,
          background: 'linear-gradient(to right, #f8fafc, #fff)',
        }}>
          {Icon && <Icon style={{ fontSize: 15, color: T.sub }} />}
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#334155',
            textTransform: 'uppercase', letterSpacing: '0.07em',
            fontFamily: 'Sora, sans-serif',
          }}>
            {title}
          </span>
        </div>
      )}
      <div style={{ padding: '18px' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Timeline ───────────────────────────────────────────────── */
function Timeline({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending;

  if (status === 'cancelled') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Cancel style={{ fontSize: 20, color: '#dc2626' }} />
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#dc2626', fontFamily: 'Sora, sans-serif' }}>Order Cancelled</div>
          <div style={{ fontSize: 12, color: T.muted, fontFamily: 'Sora, sans-serif', marginTop: 2 }}>This order has been cancelled</div>
        </div>
      </div>
    );
  }

  const currentStep = cfg.step;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {TIMELINE_STEPS.map((step, i) => {
        const done    = i < currentStep;
        const active  = i === currentStep;
        const StepIcon = step.Icon;

        return (
          <div key={step.key} style={{
            display: 'flex', alignItems: 'center',
            flex: i < TIMELINE_STEPS.length - 1 ? 1 : 'none',
          }}>
            {/* Step */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done
                  ? 'linear-gradient(135deg,#15803d,#22c55e)'
                  : active
                    ? `linear-gradient(135deg,${cfg.accent}bb,${cfg.accent})`
                    : '#f1f5f9',
                border: !done && !active ? `2px solid #e2e8f0` : 'none',
                boxShadow: active ? `0 4px 16px ${cfg.accent}40` : done ? '0 2px 8px rgba(34,197,94,.3)' : 'none',
                animation: active ? 'pulse 2s ease infinite' : 'none',
                transition: 'all 0.3s',
              }}>
                <StepIcon style={{
                  fontSize: 19,
                  color: done || active ? '#fff' : T.muted,
                }} />
              </div>
              <span style={{
                fontSize: 10.5, fontWeight: active ? 700 : done ? 600 : 400,
                color: done ? '#15803d' : active ? cfg.color : T.muted,
                fontFamily: 'Sora, sans-serif',
                whiteSpace: 'nowrap', textAlign: 'center',
              }}>
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < TIMELINE_STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: '0 8px', marginBottom: 26,
                background: i < currentStep
                  ? 'linear-gradient(to right,#22c55e,#22c55e)'
                  : '#e2e8f0',
                borderRadius: 2, transition: 'background 0.4s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────── */
const shimStyle = {
  background: 'linear-gradient(90deg,#eef2f7 25%,#e2e8f0 50%,#eef2f7 75%)',
  backgroundSize: '700px 100%',
  animation: 'shimmer 1.3s infinite linear',
  borderRadius: 6,
};

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Hero */}
      <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.border}`, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ ...shimStyle, width: 60, height: 11 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ ...shimStyle, width: 120, height: 22, borderRadius: 8 }} />
              <div style={{ ...shimStyle, width: 90, height: 22, borderRadius: 8 }} />
            </div>
          </div>
          <div style={{ ...shimStyle, width: 62, height: 22, borderRadius: 99 }} />
        </div>
      </div>
      {/* Timeline */}
      <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.border}`, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ ...shimStyle, width: 15, height: 15, borderRadius: '50%' }} />
          <div style={{ ...shimStyle, width: 100, height: 11 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ ...shimStyle, width: 42, height: 42, borderRadius: '50%' }} />
              {i < 2 && <div style={{ flex: 1, height: 2, margin: '0 8px', ...shimStyle }} />}
            </div>
          ))}
        </div>
      </div>
      {/* Items */}
      <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: `1px solid ${T.border}`, background: '#f8fafc' }}>
          <div style={{ ...shimStyle, width: 100, height: 11 }} />
        </div>
        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[0,1].map(i => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ ...shimStyle, width: 56, height: 74, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ ...shimStyle, width: '55%', height: 13 }} />
                <div style={{ ...shimStyle, width: '35%', height: 11 }} />
                <div style={{ ...shimStyle, width: '25%', height: 11 }} />
              </div>
              <div style={{ ...shimStyle, width: 60, height: 16 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate    = useNavigate();

  const [order,      setOrder]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [returning,  setReturning]  = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [returnText, setReturnText] = useState('');

  useEffect(() => { fetchOrder(); }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/orders/${orderId}`);
      setOrder(data.order);
    } catch { toast.error('Failed to load order details.'); }
    finally   { setLoading(false); }
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await API.patch(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled.');
      fetchOrder();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel this order.'); }
    finally       { setCancelling(false); }
  };

  const handleReturn = async () => {
    if (returnText.trim().length < 10) { toast.error('Please enter a reason (min 10 characters).'); return; }
    try {
      setReturning(true);
      await API.post(`/orders/${orderId}/request-return`, { reason: returnText });
      toast.success('Return request submitted.');
      setShowReturn(false);
      fetchOrder();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot request return.'); }
    finally       { setReturning(false); }
  };

  const ss = order ? (STATUS_CFG[order.status]         || STATUS_CFG.pending) : null;
  const ps = order ? (PAYMENT_CFG[order.paymentStatus] || PAYMENT_CFG.unpaid) : null;

  return (
    <>
      <style>{FONT}</style>
      <div style={{
        minHeight: '100vh', background: T.bg,
        padding: '32px 0 60px', fontFamily: 'Sora, sans-serif',
        backgroundImage: 'radial-gradient(ellipse at 20% -5%,#dbeafe 0%,transparent 45%)',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 16px' }}>

          {/* ── Back nav ─────────────────────────────────────────── */}
          <button
            onClick={() => navigate('/my-orders')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginBottom: 24, background: 'none', border: 'none',
              cursor: 'pointer', color: T.sub, fontSize: 13, fontWeight: 600,
              fontFamily: 'Sora, sans-serif', padding: 0,
              animation: 'fadeUp 0.3s ease',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#1e40af'}
            onMouseLeave={e => e.currentTarget.style.color = T.sub}
          >
            <ArrowBack style={{ fontSize: 16 }} />
            Back to orders
          </button>

          {loading ? <Skeleton /> : !order ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontSize: 15, color: T.sub, fontFamily: 'Sora, sans-serif' }}>
              Order not found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* ── Hero ─────────────────────────────────────────── */}
              <div style={{
                background: T.surface, borderRadius: 16,
                border: `1px solid ${T.border}`,
                borderLeft: `4px solid ${ss.accent}`,
                overflow: 'hidden',
                animation: 'fadeUp 0.35s ease',
                boxShadow: `0 4px 20px ${ss.accent}12`,
              }}>
                {/* Tinted top strip */}
                <div style={{
                  padding: '14px 20px 12px',
                  borderBottom: `1px solid ${T.border}`,
                  background: `linear-gradient(to right,${ss.bg}77,#fff)`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ss.Icon style={{ fontSize: 14, color: ss.color }} />
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: ss.color, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'Sora, sans-serif' }}>
                      {ss.label}
                    </span>
                  </div>
                  <Pill cfg={ps} />
                </div>

                {/* Order meta */}
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'Sora, sans-serif', marginBottom: 6 }}>
                      Order ID
                    </div>
                    <code style={{
                      fontSize: 14, fontWeight: 600, color: '#334155',
                      background: '#f1f5f9', padding: '5px 12px', borderRadius: 8,
                      fontFamily: 'JetBrains Mono, monospace', border: `1px solid ${T.border}`,
                      display: 'inline-block',
                    }}>
                      #{order._id.slice(-10).toUpperCase()}
                    </code>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 8, fontFamily: 'Sora, sans-serif' }}>
                      Placed on{' '}
                      <strong style={{ color: T.sub }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'Sora, sans-serif', marginBottom: 4 }}>
                      Order Total
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: '-0.6px', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>
                      ₹{order.totalPrice?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Timeline ─────────────────────────────────────── */}
              {order.status !== 'returned' && (
                <Card title="Order Progress" icon={LocalShipping} delay={0.05}>
                  <Timeline status={order.status} />
                </Card>
              )}

              {/* ── Items ────────────────────────────────────────── */}
              <Card title="Items Ordered" icon={Inventory2} delay={0.1}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {order.items.map(item => (
                    <div
                      key={item._id}
                      onClick={() => navigate(`/books/${item.book?._id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        cursor: 'pointer', borderRadius: 12, padding: '6px 8px', margin: '-6px -8px',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Book cover */}
                      <div style={{
                        width: 52, height: 70, flexShrink: 0, borderRadius: 10,
                        overflow: 'hidden', background: '#f1f5f9', border: `1px solid ${T.border}`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}>
                        <img
                          src={item.book?.images?.[0]?.url || `https://picsum.photos/seed/${item.book?._id}/52/70`}
                          alt={item.book?.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.text, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Sora, sans-serif' }}>
                          {item.book?.title || 'Book'}
                        </div>
                        {item.book?.author && (
                          <div style={{ fontSize: 12, color: T.muted, marginTop: 2, fontFamily: 'Sora, sans-serif' }}>
                            by {item.book.author}
                          </div>
                        )}
                        <div style={{ fontSize: 12, color: T.sub, marginTop: 4, fontFamily: 'Sora, sans-serif' }}>
                          Qty {item.quantity}&nbsp;·&nbsp;₹{item.price.toLocaleString('en-IN')} each
                        </div>
                      </div>

                      {/* Line total */}
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: 'Sora, sans-serif' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                        <ChevronRight style={{ fontSize: 14, color: T.muted, marginTop: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1.5px dashed #e2e8f0' }}>
                  {order.shippingCharge > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: T.sub, fontFamily: 'Sora, sans-serif' }}>Shipping</span>
                      <span style={{ fontSize: 13, color: T.sub, fontFamily: 'Sora, sans-serif' }}>₹{order.shippingCharge?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: '#15803d', fontFamily: 'Sora, sans-serif' }}>Discount</span>
                      <span style={{ fontSize: 13, color: '#15803d', fontFamily: 'Sora, sans-serif' }}>−₹{order.discount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: T.text, fontFamily: 'Sora, sans-serif' }}>Total</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: '-0.4px', fontFamily: 'Sora, sans-serif' }}>
                      ₹{order.totalPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </Card>

              {/* ── Shipping address ──────────────────────────────── */}
              {order.shippingAddress && (
                <Card title="Delivery Address" icon={LocationOn} delay={0.15}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <LocationOn style={{ fontSize: 18, color: '#2563eb' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      {order.shippingAddress.name && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                          <Person style={{ fontSize: 13, color: T.muted }} />
                          <span style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: 'Sora, sans-serif' }}>
                            {order.shippingAddress.name}
                          </span>
                        </div>
                      )}
                      {order.shippingAddress.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <Phone style={{ fontSize: 13, color: T.muted }} />
                          <span style={{ fontSize: 13, color: T.sub, fontFamily: 'Sora, sans-serif' }}>
                            {order.shippingAddress.phone}
                          </span>
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.7, fontFamily: 'Sora, sans-serif' }}>
                        {[
                          order.shippingAddress.line1,
                          order.shippingAddress.line2,
                          order.shippingAddress.city,
                          order.shippingAddress.state,
                          order.shippingAddress.pincode,
                          order.shippingAddress.country,
                        ].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* ── Return pending notice ─────────────────────────── */}
              {order.returnRequested && !order.returnApproved && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: '#fef9ec', border: '1px solid #fde68a',
                  borderRadius: 14, padding: '14px 18px',
                  animation: 'fadeUp 0.35s ease 0.2s both',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <RotateLeft style={{ fontSize: 18, color: '#d97706' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e', fontFamily: 'Sora, sans-serif' }}>Return Requested</div>
                    <div style={{ fontSize: 12, color: '#b45309', marginTop: 2, fontFamily: 'Sora, sans-serif' }}>Awaiting seller approval</div>
                  </div>
                </div>
              )}

              {/* ── Return textarea ───────────────────────────────── */}
              {showReturn && order.status === 'delivered' && !order.returnRequested && (
                <div style={{
                  background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`,
                  padding: 18, animation: 'fadeUp 0.25s ease',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'Sora, sans-serif', marginBottom: 10 }}>
                    Reason for return
                  </div>
                  <textarea
                    placeholder="Please describe the reason (min 10 characters)..."
                    value={returnText}
                    onChange={e => setReturnText(e.target.value)}
                    style={{
                      width: '100%', borderRadius: 10, border: `1px solid ${T.border}`,
                      padding: '11px 14px', fontSize: 13, fontFamily: 'Sora, sans-serif',
                      color: '#334155', resize: 'vertical', minHeight: 88,
                      outline: 'none', background: '#f8fafc', lineHeight: 1.6,
                    }}
                  />
                </div>
              )}

              {/* ── Actions ──────────────────────────────────────── */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', animation: 'fadeUp 0.35s ease 0.2s both' }}>
                {order.paymentStatus === 'unpaid' && order.status !== 'cancelled' && (
                  <Btn onClick={() => navigate(`/payment/${order._id}`)}>
                    <CreditCard style={{ fontSize: 15 }} /> Pay Now
                  </Btn>
                )}

                {order.status === 'delivered' && !order.returnRequested && (
                  showReturn ? (
                    <>
                      <Btn variant="ghost" onClick={() => { setShowReturn(false); setReturnText(''); }}>
                        <Close style={{ fontSize: 14 }} /> Cancel
                      </Btn>
                      <Btn variant="ghost" disabled={returning} onClick={handleReturn}>
                        <RotateLeft style={{ fontSize: 14 }} />
                        {returning ? 'Submitting…' : 'Submit Return'}
                      </Btn>
                    </>
                  ) : (
                    <Btn variant="ghost" onClick={() => setShowReturn(true)}>
                      <RotateLeft style={{ fontSize: 14 }} /> Request Return
                    </Btn>
                  )
                )}

                {order.status === 'pending' && (
                  <Btn variant="danger" disabled={cancelling} onClick={handleCancel}>
                    <Close style={{ fontSize: 14 }} />
                    {cancelling ? 'Cancelling…' : 'Cancel Order'}
                  </Btn>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}