import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .ct-root {
    min-height: 100vh;
    background: #06061a;
    font-family: 'Sora', sans-serif;
    position: relative;
  }

  /* ── Background ── */
  .ct-bg {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0; overflow: hidden;
  }

  .ct-bg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .ct-bg-orb-1 {
    position: absolute; border-radius: 50%; filter: blur(100px);
    width: 480px; height: 480px;
    background: radial-gradient(circle, #6366f1, #4f46e5);
    top: -160px; left: -100px; opacity: 0.12;
    animation: ct-orb 14s ease-in-out infinite;
  }

  .ct-bg-orb-2 {
    position: absolute; border-radius: 50%; filter: blur(80px);
    width: 320px; height: 320px;
    background: radial-gradient(circle, #8b5cf6, #7c3aed);
    bottom: 5%; right: -80px; opacity: 0.1;
    animation: ct-orb 18s ease-in-out infinite reverse;
  }

  @keyframes ct-orb {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(20px,-30px) scale(1.05); }
  }

  /* ── Page wrapper ── */
  .ct-wrap {
    position: relative; z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 32px 80px;
  }

  @media (max-width: 768px) { .ct-wrap { padding: 24px 20px 60px; } }

  /* ── Header ── */
  .ct-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 12px;
    animation: ct-up 0.4s ease both;
  }

  @keyframes ct-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ct-header-left { display: flex; align-items: center; gap: 14px; }

  .ct-back-btn {
    width: 36px; height: 36px;
    border-radius: 11px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.6);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .ct-back-btn:hover {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.3);
    color: #a5b4fc;
  }

  .ct-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(22px, 3vw, 28px);
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ct-count-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px; height: 26px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-size: 12px;
    font-weight: 800;
    font-family: 'Bricolage Grotesque', sans-serif;
    box-shadow: 0 3px 10px rgba(99,102,241,0.4);
  }

  .ct-clear-btn {
    padding: 8px 16px;
    border-radius: 10px;
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.2);
    color: #fca5a5;
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ct-clear-btn:hover {
    background: rgba(239,68,68,0.14);
    border-color: rgba(239,68,68,0.38);
  }

  /* ── Layout ── */
  .ct-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    align-items: start;
  }

  @media (max-width: 900px) { .ct-layout { grid-template-columns: 1fr; } }

  /* ── Cart items ── */
  .ct-items { display: flex; flex-direction: column; gap: 14px; }

  .ct-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    padding: 18px;
    display: flex;
    gap: 18px;
    align-items: flex-start;
    transition: border-color 0.25s, background 0.25s;
    animation: ct-up 0.4s ease both;
  }

  .ct-item:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(99,102,241,0.2);
  }

  /* Book image */
  .ct-book-img {
    width: 80px; height: 108px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
    background: rgba(255,255,255,0.04);
    cursor: pointer;
    transition: transform 0.25s;
    border: 1px solid rgba(255,255,255,0.07);
  }

  .ct-book-img:hover { transform: scale(1.04); }

  .ct-book-img img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }

  /* Book info */
  .ct-book-info { flex: 1; min-width: 0; }

  .ct-book-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 15.5px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.02em;
    margin: 0 0 4px;
    cursor: pointer;
    transition: color 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ct-book-title:hover { color: #a5b4fc; }

  .ct-book-author {
    font-size: 12.5px;
    color: rgba(255,255,255,0.3);
    margin: 0 0 12px;
  }

  .ct-book-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  .ct-book-price {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 19px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;
  }

  .ct-book-price span { color: #818cf8; font-size: 14px; }

  /* Qty controls */
  .ct-qty {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    overflow: hidden;
  }

  .ct-qty-btn {
    width: 32px; height: 32px;
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.45);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
    padding: 0;
  }

  .ct-qty-btn:hover:not(:disabled) {
    background: rgba(99,102,241,0.15);
    color: #a5b4fc;
  }

  .ct-qty-btn:disabled { opacity: 0.22; cursor: not-allowed; }

  .ct-qty-val {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 14px;
    font-weight: 800;
    color: #f1f5f9;
    min-width: 34px;
    text-align: center;
    border-left: 1px solid rgba(255,255,255,0.07);
    border-right: 1px solid rgba(255,255,255,0.07);
    height: 32px;
    display: flex; align-items: center; justify-content: center;
  }

  /* Item total + remove */
  .ct-item-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }

  .ct-item-total {
    font-size: 12.5px;
    color: rgba(255,255,255,0.3);
  }

  .ct-item-total strong {
    color: rgba(255,255,255,0.6);
    font-weight: 600;
  }

  .ct-remove-btn {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.18);
    color: #fca5a5;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
  }

  .ct-remove-btn:hover {
    background: rgba(239,68,68,0.18);
    border-color: rgba(239,68,68,0.38);
    transform: scale(1.08);
  }

  /* ── Summary card ── */
  .ct-summary {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 24px;
    position: sticky;
    top: 24px;
    animation: ct-up 0.4s ease 0.1s both;
  }

  .ct-summary-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 17px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.02em;
    margin: 0 0 20px;
  }

  .ct-summary-rows { display: flex; flex-direction: column; gap: 13px; margin-bottom: 16px; }

  .ct-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ct-summary-label {
    font-size: 13px;
    color: rgba(255,255,255,0.38);
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ct-summary-val {
    font-size: 13.5px;
    font-weight: 600;
    color: rgba(255,255,255,0.7);
    font-family: 'Sora', sans-serif;
  }

  .ct-free-badge {
    padding: 3px 10px;
    border-radius: 999px;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.22);
    color: #86efac;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  /* Nudge */
  .ct-nudge {
    padding: 11px 14px;
    border-radius: 12px;
    background: rgba(251,191,36,0.07);
    border: 1px solid rgba(251,191,36,0.18);
    font-size: 12.5px;
    color: #fde68a;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .ct-nudge strong { font-weight: 700; }

  /* Divider */
  .ct-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 16px 0;
  }

  .ct-total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
  }

  .ct-total-label {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.6);
  }

  .ct-total-val {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.04em;
  }

  .ct-total-val span { color: #818cf8; font-size: 18px; }

  /* Checkout button */
  .ct-checkout-btn {
    width: 100%;
    padding: 14px 0;
    border-radius: 13px;
    border: 1px solid rgba(255,255,255,0.08);
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 9px;
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 6px 20px rgba(99,102,241,0.35);
    letter-spacing: 0.01em;
  }

  .ct-checkout-btn:hover {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(99,102,241,0.5);
  }

  /* Trust row */
  .ct-trust {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 16px;
    flex-wrap: wrap;
  }

  .ct-trust-item {
    font-size: 11px;
    color: rgba(255,255,255,0.25);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* ── Empty state ── */
  .ct-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 55vh;
    text-align: center;
    animation: ct-up 0.4s ease both;
  }

  .ct-empty-icon {
    width: 90px; height: 90px;
    border-radius: 24px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 40px;
    margin-bottom: 24px;
  }

  .ct-empty-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 24px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;
    margin: 0 0 8px;
  }

  .ct-empty-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    margin: 0 0 28px;
    font-weight: 300;
  }

  .ct-browse-btn {
    padding: 13px 32px;
    border-radius: 13px;
    border: 1px solid rgba(255,255,255,0.08);
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 6px 20px rgba(99,102,241,0.35);
  }

  .ct-browse-btn:hover {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(99,102,241,0.5);
  }

  /* ── Skeleton ── */
  .ct-skel {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    animation: ct-pulse 1.6s ease-in-out infinite;
  }

  @keyframes ct-pulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.35; }
  }
`;

// ── Skeleton ──────────────────────────────────────────────────────────────────
function CartSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, padding: 18,
          display: 'flex', gap: 18
        }}>
          <div className="ct-skel" style={{ width: 80, height: 108, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="ct-skel" style={{ width: '65%', height: 18 }} />
            <div className="ct-skel" style={{ width: '35%', height: 14 }} />
            <div className="ct-skel" style={{ width: '25%', height: 22, marginTop: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Cart ─────────────────────────────────────────────────────────────────
export default function Cart() {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [updating, setUpdating] = useState({});

  const handleQuantity = async (bookId, newQty) => {
    if (newQty < 1) return;
    try {
      setUpdating(p => ({ ...p, [bookId]: true }));
      await updateQuantity(bookId, newQty);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update.');
    } finally {
      setUpdating(p => ({ ...p, [bookId]: false }));
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeFromCart(bookId);
      toast.success('Item removed.');
    } catch {
      toast.error('Failed to remove item.');
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared.');
    } catch {
      toast.error('Failed to clear cart.');
    }
  };

  const deliveryCharge = (cart?.totalAmount || 0) >= 499 ? 0 : 49;
  const finalAmount    = (cart?.totalAmount || 0) + deliveryCharge;

  return (
    <>
      <style>{styles}</style>
      <div className="ct-root">
        <div className="ct-bg">
          <div className="ct-bg-grid" />
          <div className="ct-bg-orb-1" />
          <div className="ct-bg-orb-2" />
        </div>

        <div className="ct-wrap">

          {/* ── Header ── */}
          <div className="ct-header">
            <div className="ct-header-left">
              <button className="ct-back-btn" onClick={() => navigate('/books')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <h1 className="ct-title">
                My Cart
                {cart?.items?.length > 0 && (
                  <span className="ct-count-pill">{cart.totalItems}</span>
                )}
              </h1>
            </div>

            {cart?.items?.length > 0 && (
              <button className="ct-clear-btn" onClick={handleClear}>Clear All</button>
            )}
          </div>

          {/* ── Loading ── */}
          {loading ? (
            <div className="ct-layout">
              <CartSkeleton />
              <div className="ct-skel" style={{ height: 320, borderRadius: 20 }} />
            </div>

          ) : !cart?.items?.length ? (

            /* ── Empty state ── */
            <div className="ct-empty">
              <div className="ct-empty-icon">🛒</div>
              <h2 className="ct-empty-title">Your cart is empty</h2>
              <p className="ct-empty-sub">Looks like you haven't added any books yet</p>
              <button className="ct-browse-btn" onClick={() => navigate('/books')}>
                Browse Books
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>

          ) : (

            /* ── Cart layout ── */
            <div className="ct-layout">

              {/* Items */}
              <div className="ct-items">
                {cart.items.map((item, idx) => (
                  <div className="ct-item" key={item.book._id} style={{ animationDelay: `${idx * 0.06}s` }}>

                    {/* Image */}
                    <div className="ct-book-img" onClick={() => navigate(`/books/${item.book._id}`)}>
                      <img
                        src={item.book.images?.[0]?.url || `https://picsum.photos/seed/${item.book._id}/80/108`}
                        alt={item.book.title}
                      />
                    </div>

                    {/* Info */}
                    <div className="ct-book-info">
                      <h3 className="ct-book-title" onClick={() => navigate(`/books/${item.book._id}`)}>
                        {item.book.title}
                      </h3>
                      <p className="ct-book-author">{item.book.author || 'Unknown Author'}</p>

                      <div className="ct-book-bottom">
                        <div className="ct-book-price">
                          <span>₹</span>{item.book.price}
                        </div>

                        {/* Qty */}
                        <div className="ct-qty">
                          <button
                            className="ct-qty-btn"
                            onClick={() => handleQuantity(item.book._id, item.quantity - 1)}
                            disabled={updating[item.book._id] || item.quantity <= 1}
                          >−</button>
                          <div className="ct-qty-val">{item.quantity}</div>
                          <button
                            className="ct-qty-btn"
                            onClick={() => handleQuantity(item.book._id, item.quantity + 1)}
                            disabled={updating[item.book._id]}
                          >+</button>
                        </div>
                      </div>

                      <div className="ct-item-footer">
                        <span className="ct-item-total">
                          Total: <strong>₹{(item.book.price * item.quantity).toLocaleString()}</strong>
                        </span>
                        <button className="ct-remove-btn" onClick={() => handleRemove(item.book._id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Summary ── */}
              <div className="ct-summary">
                <h2 className="ct-summary-title">Order Summary</h2>

                <div className="ct-summary-rows">
                  <div className="ct-summary-row">
                    <span className="ct-summary-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      Subtotal ({cart.totalItems} items)
                    </span>
                    <span className="ct-summary-val">₹{cart.totalAmount?.toLocaleString()}</span>
                  </div>

                  <div className="ct-summary-row">
                    <span className="ct-summary-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" rx="1"/>
                        <path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                      Delivery
                    </span>
                    {deliveryCharge === 0
                      ? <span className="ct-free-badge">FREE</span>
                      : <span className="ct-summary-val">₹{deliveryCharge}</span>
                    }
                  </div>
                </div>

                {/* Nudge */}
                {deliveryCharge > 0 && (
                  <div className="ct-nudge">
                    🎁 Add <strong>₹{499 - cart.totalAmount}</strong> more for <strong>FREE delivery</strong>
                  </div>
                )}

                <div className="ct-divider" />

                <div className="ct-total-row">
                  <span className="ct-total-label">Total Amount</span>
                  <div className="ct-total-val"><span>₹</span>{finalAmount.toLocaleString()}</div>
                </div>

                <button className="ct-checkout-btn" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>

                <div className="ct-trust">
                  {['🔒 Secure', '↩️ Easy Returns', '🚚 Fast Delivery'].map(t => (
                    <span key={t} className="ct-trust-item">{t}</span>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}