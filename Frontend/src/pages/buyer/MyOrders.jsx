import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import {
  ShoppingBag, CreditCard, Close, RotateLeft,
  ArrowForward, LocalShipping, CheckCircle,
  HourglassEmpty, Cancel, Replay, ChevronRight,
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

/* ─── Status / Payment config ────────────────────────────────── */
const STATUS_CFG = {
  pending:   { label: 'Pending',   color: '#b45309', bg: '#fef3c7', dot: '#f59e0b', accent: '#f59e0b', Icon: HourglassEmpty },
  shipped:   { label: 'Shipped',   color: '#1d4ed8', bg: '#dbeafe', dot: '#3b82f6', accent: '#3b82f6', Icon: LocalShipping  },
  delivered: { label: 'Delivered', color: '#15803d', bg: '#dcfce7', dot: '#22c55e', accent: '#22c55e', Icon: CheckCircle    },
  returned:  { label: 'Returned',  color: '#6d28d9', bg: '#ede9fe', dot: '#8b5cf6', accent: '#8b5cf6', Icon: Replay         },
  cancelled: { label: 'Cancelled', color: '#b91c1c', bg: '#fee2e2', dot: '#ef4444', accent: '#ef4444', Icon: Cancel         },
};

const PAYMENT_CFG = {
  paid:     { label: 'Paid',     color: '#15803d', bg: '#dcfce7', dot: '#22c55e' },
  unpaid:   { label: 'Unpaid',   color: '#b45309', bg: '#fef3c7', dot: '#f59e0b' },
  refunded: { label: 'Refunded', color: '#6d28d9', bg: '#ede9fe', dot: '#8b5cf6' },
};

const TABS = [
  { value: 'all',       label: 'All orders' },
  { value: 'pending',   label: 'Pending'    },
  { value: 'shipped',   label: 'Shipped'    },
  { value: 'delivered', label: 'Delivered'  },
  { value: 'cancelled', label: 'Cancelled'  },
];

/* ─── Pill badge ─────────────────────────────────────────────── */
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

/* ─── Action button ──────────────────────────────────────────── */
function Btn({ variant = 'primary', disabled, onClick, children, sm }) {
  const styles = {
    primary: { background: '#1e40af', color: '#fff',    border: 'none',              boxShadow: '0 1px 6px rgba(30,64,175,.35)' },
    danger:  { background: '#fff5f5', color: '#dc2626', border: '1px solid #fca5a5', boxShadow: 'none' },
    ghost:   { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', boxShadow: 'none' },
  };
  const s = styles[variant];
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: sm ? '6px 14px' : '8px 18px',
        borderRadius: 8, fontSize: sm ? 11.5 : 12.5,
        fontWeight: 600, fontFamily: 'Sora, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 5,
        opacity: disabled ? 0.5 : 1, transition: 'opacity 0.15s',
        ...s, letterSpacing: '0.01em',
      }}
    >
      {children}
    </button>
  );
}

/* ─── Shimmer skeleton ───────────────────────────────────────── */
const shimStyle = {
  background: 'linear-gradient(90deg,#eef2f7 25%,#e2e8f0 50%,#eef2f7 75%)',
  backgroundSize: '700px 100%',
  animation: 'shimmer 1.3s infinite linear',
};

function OrderSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          background: '#fff', borderRadius: 16,
          border: `1px solid ${T.border}`, borderLeft: '4px solid #e2e8f0',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ ...shimStyle, width: 70, height: 11, borderRadius: 5 }} />
              <div style={{ ...shimStyle, width: 100, height: 11, borderRadius: 5 }} />
            </div>
            <div style={{ ...shimStyle, width: 58, height: 22, borderRadius: 99 }} />
          </div>
          {/* Items */}
          <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0, 1].map(j => (
              <div key={j} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ ...shimStyle, width: 44, height: 58, borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ ...shimStyle, width: '55%', height: 12, borderRadius: 5 }} />
                  <div style={{ ...shimStyle, width: '30%', height: 10, borderRadius: 5 }} />
                </div>
                <div style={{ ...shimStyle, width: 52, height: 14, borderRadius: 5 }} />
              </div>
            ))}
          </div>
          {/* Footer */}
          <div style={{ padding: '12px 18px', borderTop: `1px solid ${T.border}`, background: '#fafbfd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ ...shimStyle, width: 80, height: 20, borderRadius: 5 }} />
            <div style={{ ...shimStyle, width: 96, height: 34, borderRadius: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Single order card ──────────────────────────────────────── */
function OrderCard({ order, index, onCancel, onReturn, cancelling, returning, returnText, setReturnText }) {
  const navigate = useNavigate();
  const ss = STATUS_CFG[order.status]         || STATUS_CFG.pending;
  const ps = PAYMENT_CFG[order.paymentStatus] || PAYMENT_CFG.unpaid;
  const showReturnInput = order.status === 'delivered' && !order.returnRequested && returnText[order._id] !== undefined;

  return (
    <div
      onClick={() => navigate(`/orders/${order._id}`)}
      style={{
        background: T.surface, borderRadius: 16,
        border: `1px solid ${T.border}`, borderLeft: `4px solid ${ss.accent}`,
        overflow: 'hidden', cursor: 'pointer',
        transition: 'transform 0.18s, box-shadow 0.18s',
        animation: `fadeUp 0.32s ease both`,
        animationDelay: `${index * 0.055}s`,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '13px 18px 11px',
        borderBottom: `1px solid ${T.border}`,
        background: `linear-gradient(to right,${ss.bg}66,#fff)`,
        flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ss.Icon style={{ fontSize: 13, color: ss.color }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: ss.color, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'Sora, sans-serif' }}>
              {ss.label}
            </span>
          </div>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#cbd5e1', flexShrink: 0 }} />
          <code style={{
            fontSize: 11, fontWeight: 600, color: '#334155',
            background: '#f1f5f9', padding: '2px 8px', borderRadius: 6,
            fontFamily: 'JetBrains Mono, monospace', border: `1px solid ${T.border}`,
          }}>
            #{order._id.slice(-8).toUpperCase()}
          </code>
          <span style={{ fontSize: 11, color: T.muted, fontFamily: 'Sora, sans-serif' }}>
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Pill cfg={ps} />
          <ChevronRight style={{ fontSize: 16, color: T.muted }} />
        </div>
      </div>

      {/* ── Items ──────────────────────────────────────────────── */}
      <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {order.items.slice(0, 2).map(item => (
          <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 58, flexShrink: 0, borderRadius: 8,
              overflow: 'hidden', background: '#f1f5f9', border: `1px solid ${T.border}`,
            }}>
              <img
                src={item.book?.images?.[0]?.url || `https://picsum.photos/seed/${item.book?._id}/44/58`}
                alt={item.book?.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Sora, sans-serif' }}>
                {item.book?.title || 'Book'}
              </div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2, fontFamily: 'Sora, sans-serif' }}>
                Qty {item.quantity}&nbsp;·&nbsp;₹{item.price.toLocaleString('en-IN')} each
              </div>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, flexShrink: 0, fontFamily: 'Sora, sans-serif' }}>
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
        {order.items.length > 2 && (
          <div style={{ fontSize: 11.5, color: T.muted, fontFamily: 'Sora, sans-serif' }}>
            +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* ── Return pending ──────────────────────────────────────── */}
      {order.returnRequested && !order.returnApproved && (
        <div style={{
          margin: '0 18px 12px', display: 'flex', alignItems: 'center', gap: 7,
          background: '#fef9ec', border: '1px solid #fde68a',
          borderRadius: 9, padding: '7px 11px',
          fontSize: 12, color: '#b45309', fontFamily: 'Sora, sans-serif',
        }}>
          <RotateLeft style={{ fontSize: 13 }} />
          Return request submitted — awaiting seller approval
        </div>
      )}

      {/* ── Return textarea ─────────────────────────────────────── */}
      {showReturnInput && (
        <div style={{ padding: '0 18px 12px' }} onClick={e => e.stopPropagation()}>
          <textarea
            placeholder="Reason for return (min 10 characters)..."
            value={returnText[order._id] || ''}
            onChange={e => setReturnText(prev => ({ ...prev, [order._id]: e.target.value }))}
            style={{
              width: '100%', borderRadius: 10, border: `1px solid ${T.border}`,
              padding: '9px 12px', fontSize: 12.5, fontFamily: 'Sora, sans-serif',
              color: '#334155', resize: 'vertical', minHeight: 70, outline: 'none', background: '#f8fafc',
            }}
          />
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '11px 18px 14px', borderTop: `1px solid ${T.border}`,
        background: '#fafbfd', flexWrap: 'wrap', gap: 10,
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Sora, sans-serif', marginBottom: 2 }}>
            Order Total
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: '-0.5px', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>
            ₹{order.totalPrice?.toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
          {order.paymentStatus === 'unpaid' && order.status !== 'cancelled' && (
            <Btn onClick={() => navigate(`/payment/${order._id}`)}>
              <CreditCard style={{ fontSize: 14 }} /> Pay Now
            </Btn>
          )}
          {order.status === 'delivered' && !order.returnRequested && (
            showReturnInput ? (
              <>
                <Btn sm variant="ghost" onClick={() => setReturnText(prev => { const n = { ...prev }; delete n[order._id]; return n; })}>
                  <Close style={{ fontSize: 12 }} /> Cancel
                </Btn>
                <Btn sm variant="ghost" disabled={returning === order._id} onClick={() => onReturn(order._id)}>
                  <RotateLeft style={{ fontSize: 13 }} />
                  {returning === order._id ? 'Submitting…' : 'Submit'}
                </Btn>
              </>
            ) : (
              <Btn sm variant="ghost" onClick={() => setReturnText(prev => ({ ...prev, [order._id]: '' }))}>
                <RotateLeft style={{ fontSize: 13 }} /> Return
              </Btn>
            )
          )}
          {order.status === 'pending' && (
            <Btn sm variant="danger" disabled={cancelling === order._id} onClick={() => onCancel(order._id)}>
              <Close style={{ fontSize: 12 }} />
              {cancelling === order._id ? 'Cancelling…' : 'Cancel order'}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function MyOrders() {
  const navigate = useNavigate();
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState(0);
  const [cancelling, setCancelling] = useState(null);
  const [returning,  setReturning]  = useState(null);
  const [returnText, setReturnText] = useState({});

  const currentStatus = TABS[tab].value;
  useEffect(() => { fetchOrders(); }, [tab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = currentStatus !== 'all' ? { status: currentStatus } : {};
      const { data } = await API.get('/orders/my-orders', { params });
      setOrders(data.orders);
    } catch { toast.error('Failed to load orders.'); }
    finally   { setLoading(false); }
  };

  const handleCancel = async (orderId) => {
    try {
      setCancelling(orderId);
      await API.patch(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled.');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel this order.'); }
    finally       { setCancelling(null); }
  };

  const handleReturn = async (orderId) => {
    const reason = returnText[orderId] || '';
    if (reason.trim().length < 10) { toast.error('Please enter a reason (min 10 characters).'); return; }
    try {
      setReturning(orderId);
      await API.post(`/orders/${orderId}/request-return`, { reason });
      toast.success('Return request submitted.');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot request return.'); }
    finally       { setReturning(null); }
  };

  return (
    <>
      <style>{FONT}</style>
      <div style={{
        minHeight: '100vh', background: T.bg,
        padding: '36px 0 60px', fontFamily: 'Sora, sans-serif',
        backgroundImage: 'radial-gradient(ellipse at 75% -5%,#dbeafe 0%,transparent 45%)',
      }}>
        <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 16px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, animation: 'fadeUp 0.35s ease' }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14, flexShrink: 0,
              background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(59,130,246,.35)',
            }}>
              <ShoppingBag style={{ fontSize: 22, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: '-0.5px' }}>My Orders</div>
              <div style={{ fontSize: 12.5, color: T.muted, marginTop: 1 }}>Track and manage your purchases</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 2, background: '#fff', border: `1px solid ${T.border}`,
            borderRadius: 12, padding: 5, marginBottom: 20, overflowX: 'auto',
            animation: 'fadeUp 0.35s ease 0.04s both',
          }}>
            {TABS.map((t, i) => (
              <button
                key={t.value}
                onClick={() => setTab(i)}
                style={{
                  padding: '7px 16px', borderRadius: 8, border: 'none',
                  fontSize: 12.5, fontWeight: tab === i ? 700 : 500,
                  color: tab === i ? '#1e40af' : T.sub,
                  background: tab === i ? 'linear-gradient(135deg,#eff6ff,#dbeafe)' : 'transparent',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: 'Sora, sans-serif', transition: 'all 0.15s',
                  boxShadow: tab === i ? '0 1px 4px rgba(59,130,246,.18)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? <OrderSkeleton /> : orders.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', textAlign: 'center', animation: 'fadeUp 0.35s ease' }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%',
                background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18, border: `1px solid ${T.border}`,
              }}>
                <ShoppingBag style={{ fontSize: 32, color: '#cbd5e1' }} />
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 6 }}>
                No {currentStatus !== 'all' ? currentStatus + ' ' : ''}orders yet
              </div>
              <div style={{ fontSize: 13, color: T.muted, marginBottom: 24, maxWidth: 240 }}>
                Start shopping and your orders will appear here
              </div>
              <Btn onClick={() => navigate('/books')}>
                Browse Books <ArrowForward style={{ fontSize: 14 }} />
              </Btn>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {orders.map((order, i) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  index={i}
                  onCancel={handleCancel}
                  onReturn={handleReturn}
                  cancelling={cancelling}
                  returning={returning}
                  returnText={returnText}
                  setReturnText={setReturnText}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}