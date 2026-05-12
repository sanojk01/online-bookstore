import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Skeleton } from '@mui/material';
import {
  Add, Inventory, ListAlt, AttachMoney,
  PendingActions, BookOnline, TrendingUp, ArrowForward,
} from '@mui/icons-material';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

/* ─── Styles ─────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@1,400;1,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.db-root {
  background: #f5f5f0;
  min-height: 100vh;
  width: 100%;
  font-family: 'DM Sans', sans-serif;
  padding: 36px 40px;
}

@media (max-width: 768px) {
  .db-root { padding: 20px 16px; }
}

/* header */
.db-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
  width: 100%;
}
.db-header-left { display: flex; align-items: center; gap: 14px; }
.db-avatar {
  width: 50px; height: 50px; border-radius: 50%;
  background: #1c1c1c; color: #ffffff;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Lora', serif; font-style: italic; font-size: 24px;
  font-weight: 600; flex-shrink: 0;
  line-height: 1; user-select: none;
  letter-spacing: 0;
}
.db-greeting {
  font-family: 'Lora', serif; font-style: italic;
  font-size: clamp(1.4rem, 2vw, 1.85rem);
  color: #1c1c1c; line-height: 1.2;
}
.db-sub { font-size: 13px; color: #888; margin-top: 4px; }
.db-add-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px; border-radius: 100px;
  background: #1c1c1c; color: #f5f5f0;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
  border: none; cursor: pointer; white-space: nowrap;
  transition: background 0.18s, transform 0.18s;
}
.db-add-btn:hover { background: #333; transform: translateY(-1px); }

/* stats grid — always 6 columns on desktop */
.db-stats {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  width: 100%;
  margin-bottom: 28px;
}
@media (max-width: 1024px) { .db-stats { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px)  { .db-stats { grid-template-columns: repeat(2, 1fr); } }

.db-stat {
  background: #fff; border: 1px solid #e8e8e4;
  border-radius: 18px; padding: 22px 18px;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.db-stat:hover {
  border-color: #c0c0b8; transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.06);
}
.db-stat-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.db-stat-val {
  font-family: 'Lora', serif; font-size: 1.85rem;
  color: #1c1c1c; line-height: 1; margin-bottom: 6px;
}
.db-stat-lbl {
  font-size: 10.5px; font-weight: 600; color: #aaa;
  text-transform: uppercase; letter-spacing: 0.06em;
}

/* two-panel row */
.db-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
  margin-bottom: 24px;
}
@media (max-width: 768px) { .db-panels { grid-template-columns: 1fr; } }

.db-panel {
  background: #fff; border: 1px solid #e8e8e4;
  border-radius: 20px; padding: 24px;
  min-width: 0;
}
.db-panel-header {
  display: flex; justify-content: space-between;
  align-items: center; margin-bottom: 20px;
}
.db-panel-title {
  font-family: 'Lora', serif; font-style: italic;
  font-size: 1.1rem; color: #1c1c1c;
}
.db-view-all {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 500; color: #aaa;
  background: none; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: color 0.15s; white-space: nowrap;
}
.db-view-all:hover { color: #1c1c1c; }

/* book row */
.db-book-row {
  display: flex; align-items: center; gap: 14px; padding: 14px 0;
}
.db-book-img {
  width: 46px; height: 60px; border-radius: 8px;
  overflow: hidden; background: #f0f0eb; flex-shrink: 0;
}
.db-book-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.db-book-name {
  font-size: 13px; font-weight: 500; color: #1c1c1c;
  cursor: pointer; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
  transition: opacity 0.15s; display: block;
}
.db-book-name:hover { opacity: 0.55; }
.db-book-author { font-size: 12px; color: #bbb; margin-top: 2px; }
.db-book-right { text-align: right; flex-shrink: 0; }
.db-price { font-family: 'Lora', serif; font-size: 14px; color: #1c1c1c; }
.db-stock-pill {
  display: inline-block; font-size: 10px; font-weight: 600;
  padding: 2px 8px; border-radius: 20px; margin-top: 4px;
}

/* order row */
.db-order-row {
  display: flex; align-items: center;
  justify-content: space-between; padding: 14px 0;
  gap: 12px; flex-wrap: nowrap;
}
.db-order-id { font-size: 13px; font-weight: 600; color: #1c1c1c; }
.db-order-meta { font-size: 12px; color: #bbb; margin-top: 2px; }
.db-badge {
  font-size: 11px; font-weight: 600; padding: 4px 12px;
  border-radius: 100px; border: 1px solid; white-space: nowrap;
  flex-shrink: 0;
}

/* divider */
.db-hr { border: none; border-top: 1px solid #f0f0eb; }

/* quick actions */
.db-qa-panel {
  background: #fff; border: 1px solid #e8e8e4;
  border-radius: 20px; padding: 24px; width: 100%;
}
.db-qa-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
.db-qa {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px; border-radius: 14px;
  border: 1px solid #e8e8e4; background: #fff;
  cursor: pointer; flex: 1; min-width: 160px;
  transition: border-color 0.18s, transform 0.18s, box-shadow 0.18s;
}
.db-qa:hover {
  border-color: #1c1c1c; transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.07);
}
.db-qa-label { font-size: 13px; font-weight: 500; color: #1c1c1c; }
`;

const STATUS_CFG = {
  pending:   { bg: '#fef9ec', color: '#92400e', border: '#fde68a' },
  shipped:   { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  delivered: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  returned:  { bg: '#fdf4ff', color: '#6b21a8', border: '#e9d5ff' },
  cancelled: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats,   setStats]   = useState(null);
  const [books,   setBooks]   = useState([]);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [booksRes, ordersRes] = await Promise.all([
        API.get('/books/seller/my-books'),
        API.get('/orders/seller/all-orders', { params: { limit: 5 } }),
      ]);
      const myBooks  = booksRes.data.books   || [];
      const myOrders = ordersRes.data.orders  || [];
      setBooks(myBooks.slice(0, 5));
      setOrders(myOrders);
      const totalRevenue = myOrders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.totalPrice, 0);
      setStats({
        totalBooks:    myBooks.length,
        totalOrders:   ordersRes.data.total || 0,
        totalRevenue,
        pendingOrders: myOrders.filter(o => o.status === 'pending').length,
        outOfStock:    myBooks.filter(b => b.stock === 0).length,
        totalViews:    '2.4K',
      });
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const STATS = [
    { icon: <Inventory      sx={{ fontSize: 19, color: '#6366f1' }} />, bg: '#eef2ff', label: 'Total Books',    value: stats?.totalBooks    ?? 0 },
    { icon: <ListAlt        sx={{ fontSize: 19, color: '#0d9488' }} />, bg: '#f0fdfa', label: 'Total Orders',   value: stats?.totalOrders   ?? 0 },
    { icon: <AttachMoney    sx={{ fontSize: 19, color: '#d97706' }} />, bg: '#fffbeb', label: 'Revenue (paid)', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}` },
    { icon: <PendingActions sx={{ fontSize: 19, color: '#7c3aed' }} />, bg: '#f5f3ff', label: 'Pending',        value: stats?.pendingOrders  ?? 0 },
    { icon: <BookOnline     sx={{ fontSize: 19, color: '#ef4444' }} />, bg: '#fff1f2', label: 'Out of Stock',   value: stats?.outOfStock    ?? 0 },
    { icon: <TrendingUp     sx={{ fontSize: 19, color: '#059669' }} />, bg: '#f0fdf4', label: 'Total Views',    value: stats?.totalViews    ?? '—' },
  ];

  return (
    <>
      <style>{G}</style>
      <div className="db-root">

        {/* Header */}
        <div className="db-header">
          <div className="db-header-left">
            <div className="db-avatar">
              {(user?.fullname || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="db-greeting">Welcome back, {user?.fullname?.split(' ')[0]} 👋</div>
              <div className="db-sub">Here's what's happening with your store today</div>
            </div>
          </div>
          <button className="db-add-btn" onClick={() => navigate('/seller/books/add')}>
            <Add sx={{ fontSize: 16 }} /> Add new book
          </button>
        </div>

        {/* Stats */}
        <div className="db-stats">
          {STATS.map((s, i) => (
            <div className="db-stat" key={i}>
              <div className="db-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              {loading ? (
                <>
                  <Skeleton width={60} height={34} sx={{ mb: 0.5 }} />
                  <Skeleton width={80} height={12} />
                </>
              ) : (
                <>
                  <div className="db-stat-val">{s.value}</div>
                  <div className="db-stat-lbl">{s.label}</div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Two panels */}
        <div className="db-panels">

          {/* Recent Books */}
          <div className="db-panel">
            <div className="db-panel-header">
              <span className="db-panel-title">Recent Books</span>
              <button className="db-view-all" onClick={() => navigate('/seller/books')}>
                View all <ArrowForward sx={{ fontSize: 13 }} />
              </button>
            </div>

            {loading ? [...Array(4)].map((_, i) => (
              <Box key={i} display="flex" gap={2} alignItems="center" py={1.5}>
                <Skeleton variant="rectangular" width={46} height={60} sx={{ borderRadius: 1.5, flexShrink: 0 }} />
                <Box flex={1} minWidth={0}>
                  <Skeleton width="70%" height={14} />
                  <Skeleton width="40%" height={12} sx={{ mt: 0.5 }} />
                </Box>
                <Skeleton width={45} height={14} />
              </Box>
            )) : books.length === 0 ? (
              <p style={{ fontSize: 13, color: '#bbb' }}>No books listed yet.</p>
            ) : books.map((book, idx) => (
              <div key={book._id}>
                <div className="db-book-row">
                  <div className="db-book-img">
                    <img src={book.images?.[0]?.url || `https://picsum.photos/seed/${book._id}/46/60`} alt={book.title} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className="db-book-name" onClick={() => navigate(`/books/${book._id}`)}>
                      {book.title}
                    </span>
                    <div className="db-book-author">{book.author}</div>
                  </div>
                  <div className="db-book-right">
                    <div className="db-price">₹{book.price.toLocaleString('en-IN')}</div>
                    <div
                      className="db-stock-pill"
                      style={{
                        background: book.stock === 0 ? '#fef2f2' : '#f0fdf4',
                        color:      book.stock === 0 ? '#991b1b' : '#166534',
                      }}
                    >
                      {book.stock === 0 ? 'Out of stock' : `${book.stock} left`}
                    </div>
                  </div>
                </div>
                {idx < books.length - 1 && <hr className="db-hr" />}
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="db-panel">
            <div className="db-panel-header">
              <span className="db-panel-title">Recent Orders</span>
              <button className="db-view-all" onClick={() => navigate('/seller/orders')}>
                View all <ArrowForward sx={{ fontSize: 13 }} />
              </button>
            </div>

            {loading ? [...Array(5)].map((_, i) => (
              <Box key={i} display="flex" justifyContent="space-between" alignItems="center" py={1.5}>
                <Box>
                  <Skeleton width={110} height={14} />
                  <Skeleton width={75} height={12} sx={{ mt: 0.5 }} />
                </Box>
                <Skeleton width={70} height={26} sx={{ borderRadius: 3 }} />
              </Box>
            )) : orders.length === 0 ? (
              <p style={{ fontSize: 13, color: '#bbb' }}>No orders yet.</p>
            ) : orders.map((order, idx) => {
              const ss = STATUS_CFG[order.status] || STATUS_CFG.pending;
              return (
                <div key={order._id}>
                  <div className="db-order-row">
                    <div>
                      <div className="db-order-id">#{order._id.slice(-8).toUpperCase()}</div>
                      <div className="db-order-meta">
                        {order.buyer?.name ? `${order.buyer.name} · ` : ''}₹{order.totalPrice?.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="db-badge" style={{ background: ss.bg, color: ss.color, borderColor: ss.border }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                  {idx < orders.length - 1 && <hr className="db-hr" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="db-qa-panel">
          <span className="db-panel-title">Quick actions</span>
          <div className="db-qa-row">
            {[
              { label: 'Add new book', emoji: '📚', path: '/seller/books/add' },
              { label: 'My books',     emoji: '📖', path: '/seller/books'     },
              { label: 'View orders',  emoji: '📦', path: '/seller/orders'    },
            ].map(a => (
              <div key={a.label} className="db-qa" onClick={() => navigate(a.path)}>
                <span style={{ fontSize: 20 }}>{a.emoji}</span>
                <span className="db-qa-label">{a.label}</span>
                <ArrowForward sx={{ fontSize: 14, color: '#ccc', marginLeft: 'auto' }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}