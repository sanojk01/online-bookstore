import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@600;700;800&display=swap');

  .bc-card {
    background: #ffffff;
    border-radius: 18px;
    border: 1px solid #ede9fe;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 280px;
    max-width: 100%;
    cursor: pointer;
    position: relative;
    font-family: 'Sora', sans-serif;
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.35s ease,
                border-color 0.3s ease;
  }

  .bc-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(99,102,241,0.15);
    border-color: #c4b5fd;
  }

  /* ── IMAGE ── */
  .bc-img-wrap {
    position: relative;
    height: 200px;
    overflow: hidden;
    background: #f5f3ff;
    flex-shrink: 0;
  }

  .bc-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
  }

  .bc-card:hover .bc-img {
    transform: scale(1.07);
  }

  .bc-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(6,6,26,0.85) 0%,
      rgba(6,6,26,0.2) 45%,
      transparent 70%
    );
  }

  /* Category badge */
  .bc-cat-badge {
    position: absolute;
    top: 11px; left: 11px;
    padding: 4px 11px;
    border-radius: 999px;
    background: rgba(99,102,241,0.75);
    backdrop-filter: blur(10px);
    color: #e0e7ff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: capitalize;
    border: 1px solid rgba(139,92,246,0.4);
  }

  /* Wishlist */
  .bc-wish-btn {
    position: absolute;
    top: 10px; right: 10px;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.25s ease;
    color: rgba(255,255,255,0.7);
    padding: 0;
  }

  .bc-wish-btn:hover {
    background: rgba(255,255,255,0.16);
    transform: scale(1.12);
  }

  .bc-wish-btn.wished {
    background: rgba(255,77,109,0.18);
    border-color: rgba(255,77,109,0.4);
    color: #ff4d6d;
  }

  /* Price on image */
  .bc-price-tag {
    position: absolute;
    bottom: 11px; left: 13px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
    line-height: 1;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }

  /* Low stock */
  .bc-stock-low {
    position: absolute;
    bottom: 13px; right: 12px;
    padding: 3px 9px;
    border-radius: 999px;
    background: rgba(239,68,68,0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(239,68,68,0.28);
    color: #fca5a5;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  /* ── BODY ── */
  .bc-body {
    padding: 14px 15px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  /* Stars */
  .bc-stars {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .bc-star { color: #fbbf24; font-size: 11px; line-height: 1; }
  .bc-star-empty { color: #e5e7eb; }

  .bc-rating-count {
    font-size: 10.5px;
    color: #b0b8c8;
    margin-left: 4px;
    font-weight: 400;
  }

  /* Title */
  .bc-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #0f0f1a;
    letter-spacing: -0.02em;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  }

  /* Description */
  .bc-desc {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.65;
    font-weight: 300;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  }

  /* ── FOOTER ── */
  .bc-footer {
    padding: 13px 15px 15px;
  }

  .bc-divider {
    height: 1px;
    background: #f1f5f9;
    margin-bottom: 12px;
  }

  .bc-btn {
    width: 100%;
    padding: 10px 0;
    border-radius: 11px;
    border: none;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    letter-spacing: 0.01em;
  }

  .bc-btn-primary {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    box-shadow: 0 4px 16px rgba(99,102,241,0.3);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .bc-btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(99,102,241,0.42);
  }

  .bc-btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .bc-btn-primary:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    box-shadow: none;
    cursor: not-allowed;
    border: 1px solid transparent;
  }

  .bc-btn-loading { opacity: 0.8; cursor: wait; }

  @keyframes bc-spin { to { transform: rotate(360deg); } }

  .bc-spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: bc-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
`;

function StarRating({ value = 4.5 }) {
  return (
    <div className="bc-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`bc-star${s > Math.round(value) ? " bc-star-empty" : ""}`}>★</span>
      ))}
      <span className="bc-rating-count">(4.5)</span>
    </div>
  );
}

export default function BookCard({ book }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [wished, setWished] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    try {
      setLoading(true);
      await addToCart(book._id, 1);
      toast.success("Book added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  const isSeller   = user?.role === "seller";
  const outOfStock = book?.stock === 0;
  const lowStock   = book?.stock > 0 && book?.stock <= 5;

  const btnLabel = loading ? null
    : isSeller    ? "Seller Account"
    : outOfStock  ? "Out of Stock"
    : "Add to Cart";

  return (
    <>
      <style>{styles}</style>
      <div className="bc-card" onClick={() => navigate(`/books/${book._id}`)}>

        {/* ── Image ── */}
        <div className="bc-img-wrap">
          <img
            className="bc-img"
            src={book?.images?.[0]?.url || `https://picsum.photos/seed/${book?._id}/500/700`}
            alt={book?.title}
          />
          <div className="bc-img-overlay" />

          {book?.category && (
            <span className="bc-cat-badge">{book.category}</span>
          )}

          {!isSeller && (
            <button
              className={`bc-wish-btn${wished ? " wished" : ""}`}
              onClick={e => { e.stopPropagation(); setWished(!wished); }}
              aria-label="Wishlist"
            >
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill={wished ? "currentColor" : "none"}
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          )}

          <span className="bc-price-tag">₹{book?.price}</span>

          {lowStock && (
            <span className="bc-stock-low">{book.stock} left</span>
          )}
        </div>

        {/* ── Body ── */}
        <div className="bc-body">
          <StarRating value={4.5} />
          <h3 className="bc-title">{book?.title}</h3>
          <p className="bc-desc">{book?.description}</p>
        </div>

        {/* ── Footer ── */}
        <div className="bc-footer">
          <div className="bc-divider" />
          <button
            className={`bc-btn bc-btn-primary${loading ? " bc-btn-loading" : ""}`}
            onClick={handleAddToCart}
            disabled={loading || outOfStock || isSeller}
          >
            {loading ? (
              <span className="bc-spinner" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            )}
            {btnLabel}
          </button>
        </div>

      </div>
    </>
  );
}