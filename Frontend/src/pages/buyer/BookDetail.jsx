import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .bd-root {
    min-height: 100vh;
    background: #06061a;
    font-family: 'Sora', sans-serif;
    position: relative;
  }

  /* ── Background ── */
  .bd-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .bd-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .bd-bg-orb-1 {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    filter: blur(100px);
    background: radial-gradient(circle, #6366f1, #4f46e5);
    top: -150px; left: -100px;
    opacity: 0.12;
    animation: orb-drift 14s ease-in-out infinite;
  }

  .bd-bg-orb-2 {
    position: absolute;
    width: 350px; height: 350px;
    border-radius: 50%;
    filter: blur(80px);
    background: radial-gradient(circle, #8b5cf6, #7c3aed);
    bottom: 10%; right: -80px;
    opacity: 0.1;
    animation: orb-drift 18s ease-in-out infinite reverse;
  }

  @keyframes orb-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, -30px) scale(1.05); }
  }

  /* ── Breadcrumb ── */
  .bd-breadcrumb {
    position: relative;
    z-index: 1;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(6,6,26,0.7);
    backdrop-filter: blur(12px);
  }

  .bd-breadcrumb-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .bd-back-btn {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.6);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .bd-back-btn:hover {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.3);
    color: #a5b4fc;
  }

  .bd-crumbs {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: rgba(255,255,255,0.3);
    flex-wrap: wrap;
  }

  .bd-crumb-link {
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    transition: color 0.2s;
    background: none;
    border: none;
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    padding: 0;
  }

  .bd-crumb-link:hover { color: #a5b4fc; }

  .bd-crumb-sep { color: rgba(255,255,255,0.2); }

  .bd-crumb-current {
    color: rgba(255,255,255,0.6);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }

  /* ── Main content ── */
  .bd-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 32px 80px;
  }

  @media (max-width: 768px) {
    .bd-content { padding: 24px 20px 60px; }
    .bd-breadcrumb-inner { padding: 0 20px; }
  }

  /* ── Image section ── */
  .bd-img-main {
    border-radius: 20px;
    overflow: hidden;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    position: relative;
    aspect-ratio: 3/4;
    max-height: 460px;
  }

  .bd-img-main img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
  }

  .bd-img-main:hover img { transform: scale(1.04); }

  .bd-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(6,6,26,0.7) 0%,
      transparent 50%
    );
    pointer-events: none;
  }

  .bd-img-actions {
    position: absolute;
    top: 12px; right: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bd-img-action-btn {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.7);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
  }

  .bd-img-action-btn:hover {
    background: rgba(255,255,255,0.16);
    transform: scale(1.08);
  }

  .bd-img-action-btn.wished {
    background: rgba(239,68,68,0.15);
    border-color: rgba(239,68,68,0.3);
    color: #fca5a5;
  }

  .bd-oos-overlay {
    position: absolute;
    inset: 0;
    background: rgba(6,6,26,0.65);
    display: flex; align-items: center; justify-content: center;
  }

  .bd-oos-badge {
    padding: 10px 24px;
    border-radius: 999px;
    background: rgba(239,68,68,0.15);
    border: 1px solid rgba(239,68,68,0.35);
    color: #fca5a5;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  /* Thumbnails */
  .bd-thumbs {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  .bd-thumb {
    width: 68px; height: 80px;
    object-fit: cover;
    border-radius: 12px;
    cursor: pointer;
    border: 2px solid rgba(255,255,255,0.08);
    transition: all 0.2s;
    opacity: 0.65;
  }

  .bd-thumb:hover { opacity: 0.9; transform: scale(1.04); }

  .bd-thumb.active {
    border-color: #6366f1;
    opacity: 1;
    box-shadow: 0 4px 14px rgba(99,102,241,0.3);
  }

  /* ── Detail section ── */
  .bd-badges {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .bd-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 999px;
    font-family: 'Sora', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .bd-badge-cat {
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.28);
    color: #a5b4fc;
  }

  .bd-badge-stock {
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.25);
    color: #86efac;
  }

  .bd-badge-low {
    background: rgba(251,191,36,0.1);
    border: 1px solid rgba(251,191,36,0.25);
    color: #fde68a;
  }

  .bd-badge-oos {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    color: #fca5a5;
  }

  /* Title */
  .bd-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(22px, 3vw, 32px);
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;
    line-height: 1.15;
    margin: 0 0 8px;
  }

  .bd-author {
    font-size: 14px;
    color: rgba(255,255,255,0.4);
    margin: 0 0 16px;
  }

  .bd-author strong {
    color: rgba(255,255,255,0.65);
    font-weight: 600;
  }

  /* Stars */
  .bd-stars {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 20px;
  }

  .bd-star { color: #fbbf24; font-size: 15px; }
  .bd-star-empty { color: rgba(255,255,255,0.15); }
  .bd-rating-txt { font-size: 12.5px; color: rgba(255,255,255,0.35); margin-left: 6px; }

  /* Divider */
  .bd-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 20px 0;
  }

  /* Price */
  .bd-price {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 6px;
  }

  .bd-price span {
    font-size: 20px;
    color: #818cf8;
    margin-right: 2px;
  }

  .bd-price-note {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    margin-bottom: 16px;
  }

  /* Description */
  .bd-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.42);
    line-height: 1.8;
    font-weight: 300;
    margin: 0 0 20px;
  }

  /* Quantity */
  .bd-qty-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .bd-qty-label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .bd-qty-controls {
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    overflow: hidden;
  }

  .bd-qty-btn {
    width: 38px; height: 38px;
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.5);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 18px;
    padding: 0;
  }

  .bd-qty-btn:hover:not(:disabled) {
    background: rgba(99,102,241,0.15);
    color: #a5b4fc;
  }

  .bd-qty-btn:disabled { opacity: 0.25; cursor: not-allowed; }

  .bd-qty-val {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: #f1f5f9;
    min-width: 40px;
    text-align: center;
    border-left: 1px solid rgba(255,255,255,0.07);
    border-right: 1px solid rgba(255,255,255,0.07);
    height: 38px;
    display: flex; align-items: center; justify-content: center;
  }

  /* Buttons */
  .bd-btn-row {
    display: flex;
    gap: 12px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .bd-btn-cart {
    flex: 1;
    min-width: 140px;
    padding: 13px 0;
    border-radius: 13px;
    border: 1px solid rgba(99,102,241,0.4);
    background: rgba(99,102,241,0.08);
    color: #a5b4fc;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 8px;
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    letter-spacing: 0.01em;
  }

  .bd-btn-cart:hover:not(:disabled) {
    background: rgba(99,102,241,0.18);
    border-color: rgba(99,102,241,0.6);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99,102,241,0.2);
  }

  .bd-btn-buy {
    flex: 1;
    min-width: 140px;
    padding: 13px 0;
    border-radius: 13px;
    border: 1px solid rgba(255,255,255,0.08);
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 8px;
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 6px 20px rgba(99,102,241,0.35);
    letter-spacing: 0.01em;
  }

  .bd-btn-buy:hover:not(:disabled) {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(99,102,241,0.5);
  }

  .bd-btn-cart:disabled,
  .bd-btn-buy:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* Feature badges */
  .bd-features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 24px;
  }

  @media (max-width: 500px) { .bd-features { grid-template-columns: 1fr; } }

  .bd-feature {
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: flex-start;
    gap: 10px;
    transition: border-color 0.2s, background 0.2s;
  }

  .bd-feature:hover {
    background: rgba(99,102,241,0.06);
    border-color: rgba(99,102,241,0.2);
  }

  .bd-feature-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }

  .bd-feature-title {
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    margin-bottom: 2px;
  }

  .bd-feature-desc {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    line-height: 1.4;
  }

  /* Seller card */
  .bd-seller {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .bd-seller-avatar {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 17px;
    font-weight: 800;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  }

  .bd-seller-by {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    margin-bottom: 2px;
  }

  .bd-seller-name {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.02em;
  }

  .bd-seller-verified {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.2);
    color: #86efac;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }

  /* ── Tabs ── */
  .bd-tabs-wrap {
    margin-top: 48px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    overflow: hidden;
  }

  .bd-tabs {
    display: flex;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    padding: 0 8px;
    overflow-x: auto;
  }

  .bd-tab {
    padding: 16px 20px;
    background: none;
    border: none;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    color: rgba(255,255,255,0.35);
    cursor: pointer;
    border-bottom: 2.5px solid transparent;
    margin-bottom: -1px;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .bd-tab:hover { color: rgba(255,255,255,0.6); }

  .bd-tab.active {
    color: #a5b4fc;
    border-bottom-color: #6366f1;
  }

  .bd-tab-body {
    padding: 28px 32px;
  }

  @media (max-width: 768px) { .bd-tab-body { padding: 24px 20px; } }

  .bd-tab-text {
    font-size: 14px;
    color: rgba(255,255,255,0.45);
    line-height: 1.85;
    font-weight: 300;
  }

  /* Details table */
  .bd-detail-row {
    display: flex;
    padding: 12px 14px;
    border-radius: 10px;
    margin-bottom: 4px;
  }

  .bd-detail-row:nth-child(odd) {
    background: rgba(255,255,255,0.03);
  }

  .bd-detail-key {
    font-size: 12.5px;
    font-weight: 600;
    color: rgba(255,255,255,0.35);
    width: 130px;
    flex-shrink: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .bd-detail-val {
    font-size: 13.5px;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
  }

  /* Reviews empty */
  .bd-reviews-empty {
    text-align: center;
    padding: 48px 0;
  }

  .bd-reviews-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .bd-reviews-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #f1f5f9;
    margin: 0 0 6px;
  }

  .bd-reviews-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.3);
  }

  /* Skeleton */
  .bd-skel {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    animation: skel-pulse 1.5s ease-in-out infinite;
  }

  @keyframes skel-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bd-animate { animation: fade-up 0.5s ease both; }
`;

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <>
      <style>{styles}</style>
      <div className="bd-root">
        <div className="bd-bg">
          <div className="bd-bg-grid" />
          <div className="bd-bg-orb-1" />
          <div className="bd-bg-orb-2" />
        </div>
        <div className="bd-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
              <div className="bd-skel" style={{ aspectRatio: '3/4', maxHeight: 460, borderRadius: 20 }} />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {[1,2,3].map(i => <div key={i} className="bd-skel" style={{ width: 68, height: 80, borderRadius: 12 }} />)}
              </div>
            </div>
            <div>
              {[{ w: '40%', h: 20 }, { w: '80%', h: 36 }, { w: '30%', h: 16 }, { w: '25%', h: 48 }, { w: '100%', h: 14 }, { w: '90%', h: 14 }, { w: '95%', h: 14 }].map((s, i) => (
                <div key={i} className="bd-skel" style={{ width: s.w, height: s.h, borderRadius: 8, marginBottom: 14 }} />
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <div className="bd-skel" style={{ flex: 1, height: 48, borderRadius: 13 }} />
                <div className="bd-skel" style={{ flex: 1, height: 48, borderRadius: 13 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── StarRating ─────────────────────────────────────────────────────────────────
function StarRating({ value = 4.5 }) {
  return (
    <div className="bd-stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`bd-star${s > Math.round(value) ? ' bd-star-empty' : ''}`}>★</span>
      ))}
      <span className="bd-rating-txt">4.5 (24 reviews)</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BookDetail() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const { addToCart } = useCart();

  const [book,      setBook]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [quantity,  setQuantity]  = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding,    setAdding]    = useState(false);
  const [wished,    setWished]    = useState(false);
  const [tab,       setTab]       = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    (async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/books/${id}`);
        setBook(data.book);
      } catch {
        toast.error('Book not found.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      setAdding(true);
      await addToCart(book._id, quantity);
      toast.success(`${quantity} book(s) added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add.');
    } finally { setAdding(false); }
  };

  const handleBuyNow = async () => {
  if (!user) { navigate('/login'); return; }
  try {
    setAdding(true);
    await addToCart(book._id, quantity);
    navigate('/checkout');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed.');
  } finally { setAdding(false); }
};

  if (loading) return <DetailSkeleton />;
  if (!book)   return null;

  const images     = book.images?.length ? book.images.map(i => i.url) : [`https://picsum.photos/seed/${book._id}/500/700`];
  const isSeller   = user?.role === 'seller';
  const outOfStock = book.stock === 0;
  const lowStock   = book.stock > 0 && book.stock <= 5;

  return (
    <>
      <style>{styles}</style>
      <div className="bd-root">

        {/* Background */}
        <div className="bd-bg">
          <div className="bd-bg-grid" />
          <div className="bd-bg-orb-1" />
          <div className="bd-bg-orb-2" />
        </div>

        {/* Breadcrumb */}
        <div className="bd-breadcrumb">
          <div className="bd-breadcrumb-inner">
            <button className="bd-back-btn" onClick={() => navigate(-1)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <div className="bd-crumbs">
              <button className="bd-crumb-link" onClick={() => navigate('/')}>Home</button>
              <span className="bd-crumb-sep">›</span>
              <button className="bd-crumb-link" onClick={() => navigate('/books')}>Books</button>
              {book.category && <>
                <span className="bd-crumb-sep">›</span>
                <button className="bd-crumb-link" onClick={() => navigate('/books')}>{book.category}</button>
              </>}
              <span className="bd-crumb-sep">›</span>
              <span className="bd-crumb-current">{book.title}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bd-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 40, alignItems: 'start' }}
            className="bd-animate">

            {/* ── Left: Images ── */}
            <div>
              <div className="bd-img-main">
                <img src={images[activeImg]} alt={book.title} />
                <div className="bd-img-overlay" />

                {/* Action buttons */}
                <div className="bd-img-actions">
                  <button
                    className={`bd-img-action-btn${wished ? ' wished' : ''}`}
                    onClick={() => setWished(!wished)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  <button className="bd-img-action-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </button>
                </div>

                {outOfStock && (
                  <div className="bd-oos-overlay">
                    <div className="bd-oos-badge">Out of Stock</div>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="bd-thumbs">
                  {images.map((img, i) => (
                    <img key={i} src={img} alt="" className={`bd-thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Details ── */}
            <div>
              {/* Badges */}
              <div className="bd-badges">
                {book.category && <span className="bd-badge bd-badge-cat">{book.category}</span>}
                {outOfStock  && <span className="bd-badge bd-badge-oos">Out of Stock</span>}
                {lowStock    && <span className="bd-badge bd-badge-low">Only {book.stock} left</span>}
                {!outOfStock && !lowStock && <span className="bd-badge bd-badge-stock">✓ In Stock</span>}
              </div>

              <h1 className="bd-title">{book.title}</h1>
              <p className="bd-author">by <strong>{book.author || 'Unknown Author'}</strong></p>

              <StarRating value={4.5} />

              <div className="bd-divider" />

              {/* Price */}
              <div className="bd-price"><span>₹</span>{book.price}</div>
              <p className="bd-price-note">Inclusive of all taxes · Free shipping above ₹499</p>

              {/* Description */}
              {book.description && (
                <p className="bd-desc">
                  {book.description.slice(0, 220)}{book.description.length > 220 ? '…' : ''}
                </p>
              )}

              {/* Quantity */}
              {!outOfStock && !isSeller && (
                <div className="bd-qty-row">
                  <span className="bd-qty-label">Qty</span>
                  <div className="bd-qty-controls">
                    <button className="bd-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                    <div className="bd-qty-val">{quantity}</div>
                    <button className="bd-qty-btn" onClick={() => setQuantity(q => Math.min(book.stock, q + 1))} disabled={quantity >= book.stock}>+</button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {!isSeller && (
                <div className="bd-btn-row">
                  <button className="bd-btn-cart" onClick={handleAddToCart} disabled={adding || outOfStock}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    {adding ? 'Adding…' : 'Add to Cart'}
                  </button>
                  <button className="bd-btn-buy" onClick={handleBuyNow} disabled={adding || outOfStock}>
                    {outOfStock ? 'Out of Stock' : 'Buy Now →'}
                  </button>
                </div>
              )}

              {/* Features */}
              <div className="bd-features">
                {[
                  { icon: '🚚', title: 'Free Delivery',   desc: 'Orders above ₹499' },
                  { icon: '↩️', title: 'Easy Returns',    desc: '7-day return policy' },
                  { icon: '🔒', title: 'Secure Payment',  desc: '100% encrypted' },
                ].map(f => (
                  <div key={f.title} className="bd-feature">
                    <span className="bd-feature-icon">{f.icon}</span>
                    <div>
                      <div className="bd-feature-title">{f.title}</div>
                      <div className="bd-feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Seller */}
              {book.seller && (
                <div className="bd-seller">
                  <div className="bd-seller-avatar">
                    {(book.seller.name || book.seller.fullname || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="bd-seller-by">Sold by</div>
                    <div className="bd-seller-name">{book.seller.name || book.seller.fullname || 'BookStore Seller'}</div>
                  </div>
                  <div className="bd-seller-verified">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Verified
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="bd-tabs-wrap">
            <div className="bd-tabs">
              {['Description', 'Book Details', 'Reviews (24)'].map((t, i) => (
                <button key={t} className={`bd-tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
              ))}
            </div>

            <div className="bd-tab-body">
              {tab === 0 && (
                <p className="bd-tab-text">{book.description || 'No description available.'}</p>
              )}

              {tab === 1 && (
                <div>
                  {[
                    { key: 'Title',    val: book.title },
                    { key: 'Author',   val: book.author || '—' },
                    { key: 'Category', val: book.category || '—' },
                    { key: 'Price',    val: `₹${book.price}` },
                    { key: 'Stock',    val: `${book.stock} units` },
                    { key: 'Added On', val: new Date(book.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  ].map((row, i) => (
                    <div key={row.key} className="bd-detail-row">
                      <span className="bd-detail-key">{row.key}</span>
                      <span className="bd-detail-val">{row.val}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 2 && (
                <div className="bd-reviews-empty">
                  <div className="bd-reviews-icon">⭐</div>
                  <h3 className="bd-reviews-title">Reviews coming soon</h3>
                  <p className="bd-reviews-sub">Be the first to review this book after purchase</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}