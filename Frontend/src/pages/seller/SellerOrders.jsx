import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Skeleton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Pagination
} from '@mui/material';
import { ArrowForward, ReceiptLong } from '@mui/icons-material';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const TABS = [
  { value: 'all',       label: 'All Orders' },
  { value: 'pending',   label: 'Pending' },
  { value: 'shipped',   label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned',  label: 'Returned' },
  { value: 'refunded',  label: 'Refunded', filterBy: 'paymentStatus' },
];

const STATUS_STYLE = {
  pending:   { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b' },
  shipped:   { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' },
  delivered: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
  cancelled: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
  returned:  { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa', dot: '#f97316' },
};

const PAYMENT_STYLE = {
  paid:     { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
  unpaid:   { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b' },
  refunded: { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff', dot: '#a855f7' },
};

const NEXT_STATUS = {
  pending: ['shipped',   'cancelled'],
  shipped: ['delivered', 'cancelled'],
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  .so-root {
    font-family: 'DM Sans', sans-serif;
    background: #f5f5f3;
    min-height: 100vh;
    padding: 40px 20px 60px;
  }
  .so-container { max-width: 860px; margin: 0 auto; }

  /* Header */
  .so-header { margin-bottom: 36px; }
  .so-header-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    background: #1a1a1a;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
  }
  .so-page-title {
    font-family: 'Instrument Serif', serif;
    font-size: 36px; font-weight: 400;
    color: #1a1a1a; letter-spacing: -0.03em;
    margin: 0 0 6px; line-height: 1.1;
  }
  .so-page-sub {
    font-size: 14px; color: #888;
    font-weight: 400; margin: 0;
  }

  /* Tabs */
  .so-tabs {
    display: flex; gap: 4px;
    background: #ebebea;
    border-radius: 14px;
    padding: 5px;
    margin-bottom: 28px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .so-tabs::-webkit-scrollbar { display: none; }
  .so-tab {
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    color: #666; cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .so-tab:hover { color: #1a1a1a; background: rgba(255,255,255,0.5); }
  .so-tab.active {
    background: #fff;
    color: #1a1a1a;
    font-weight: 600;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }

  /* Order card */
  .so-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 18px;
    margin-bottom: 16px;
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .so-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.07);
    transform: translateY(-1px);
  }

  /* Card top bar */
  .so-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #f3f3f3;
    flex-wrap: wrap;
    gap: 12px;
  }
  .so-order-id {
    font-size: 13px; font-weight: 700;
    color: #1a1a1a; letter-spacing: 0.04em;
    font-variant-numeric: tabular-nums;
  }
  .so-order-meta {
    font-size: 12px; color: #999; margin-top: 2px;
    font-weight: 400;
  }
  .so-badges { display: flex; gap: 8px; flex-wrap: wrap; }

  /* Status badge */
  .so-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px;
    border-radius: 100px;
    font-size: 12px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    border: 1px solid;
  }
  .so-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Items section */
  .so-items { padding: 20px 24px; }
  .so-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;
  }
  .so-item:last-child { border-bottom: none; }
  .so-book-thumb {
    width: 48px; height: 60px;
    border-radius: 8px; overflow: hidden;
    flex-shrink: 0;
    background: #f3f3f3;
    cursor: pointer;
    transition: transform 0.2s;
    border: 1px solid #eee;
  }
  .so-book-thumb:hover { transform: scale(1.06); }
  .so-book-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .so-item-title {
    font-size: 14px; font-weight: 600;
    color: #1a1a1a; flex: 1; min-width: 0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .so-item-qty { font-size: 12.5px; color: #888; margin-top: 3px; }
  .so-item-price {
    font-size: 14px; font-weight: 700;
    color: #1a1a1a; flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }

  /* Card footer */
  .so-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-top: 1px solid #f3f3f3;
    background: #fafafa;
    flex-wrap: wrap;
    gap: 12px;
  }
  .so-total-label { font-size: 12px; color: #888; margin-bottom: 2px; }
  .so-total-amount {
    font-family: 'Instrument Serif', serif;
    font-size: 26px; font-weight: 400;
    color: #1a1a1a; letter-spacing: -0.03em;
    line-height: 1;
  }
  .so-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  /* Action buttons */
  .so-action-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px;
    border-radius: 100px;
    border: 1.5px solid;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 600;
    cursor: pointer; transition: all 0.18s;
  }
  .so-action-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .so-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Empty state */
  .so-empty {
    text-align: center;
    padding: 80px 20px;
  }
  .so-empty-icon {
    width: 72px; height: 72px;
    border-radius: 20px;
    background: #f3f3f3;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  .so-empty-title {
    font-family: 'Instrument Serif', serif;
    font-size: 22px; font-weight: 400;
    color: #1a1a1a; margin: 0 0 8px;
  }
  .so-empty-sub { font-size: 14px; color: #999; margin: 0; }

  /* Pagination */
  .so-pagination {
    display: flex; justify-content: center;
    margin-top: 32px;
  }

  @media (max-width: 600px) {
    .so-root { padding: 24px 16px 48px; }
    .so-card-top, .so-card-footer { padding: 14px 16px; }
    .so-items { padding: 16px; }
    .so-total-amount { font-size: 22px; }
  }
`;

function OrderSkeleton() {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {[1, 2, 3].map(i => (
        <Box key={i} sx={{ background: '#fff', borderRadius: '18px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
          <Box sx={{ p: '16px 24px', borderBottom: '1px solid #f3f3f3', display: 'flex', justifyContent: 'space-between' }}>
            <Box><Skeleton width={140} height={16} /><Skeleton width={100} height={13} sx={{ mt: 0.5 }} /></Box>
            <Box display="flex" gap={1}><Skeleton width={70} height={26} sx={{ borderRadius: 10 }} /><Skeleton width={60} height={26} sx={{ borderRadius: 10 }} /></Box>
          </Box>
          <Box sx={{ p: '20px 24px' }}>
            {[1, 2].map(j => (
              <Box key={j} display="flex" gap={2} alignItems="center" py={1.2}>
                <Skeleton variant="rectangular" width={48} height={60} sx={{ borderRadius: 2, flexShrink: 0 }} />
                <Box flex={1}><Skeleton width="55%" height={16} /><Skeleton width="30%" height={13} sx={{ mt: 0.5 }} /></Box>
                <Skeleton width={60} height={16} />
              </Box>
            ))}
          </Box>
          <Box sx={{ p: '16px 24px', borderTop: '1px solid #f3f3f3', bgcolor: '#fafafa', display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width={90} height={36} />
            <Skeleton width={140} height={36} sx={{ borderRadius: 10 }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default function SellerOrders() {
  const navigate = useNavigate();
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [tab,           setTab]           = useState(0);
  const [total,         setTotal]         = useState(0);
  const [pages,         setPages]         = useState(1);
  const [page,          setPage]          = useState(1);
  const [updating,      setUpdating]      = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const currentTab = TABS[tab];
  const status = currentTab.value;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };

      if (currentTab.filterBy === 'paymentStatus') {
        params.paymentStatus = currentTab.value;
      } else if (currentTab.value !== 'all') {
        params.status = currentTab.value;
      }

      const { data } = await API.get('/orders/seller/all-orders', { params });
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Backend handles stock restore + auto-refund on cancel atomically
  const handleStatusUpdate = async () => {
    if (!confirmDialog) return;
    const { orderId, newStatus } = confirmDialog;
    try {
      setUpdating(orderId);
      await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as "${newStatus}".`);
      setConfirmDialog(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update.');
    } finally {
      setUpdating(null);
    }
  };

  // For the "Refunded" tab: server filters by paymentStatus via params,
  // but since the backend may return all orders, filter client-side as fallback
  const displayOrders = currentTab.filterBy === 'paymentStatus'
    ? orders.filter(o => o.paymentStatus === currentTab.value)
    : orders;

  const dialogOrder = confirmDialog
    ? orders.find(o => o._id === confirmDialog.orderId)
    : null;

  return (
    <>
      <style>{styles}</style>
      <div className="so-root">
        <div className="so-container">

          {/* Header */}
          <div className="so-header">
            <div className="so-header-icon">
              <ReceiptLong sx={{ fontSize: 22, color: '#fff' }} />
            </div>
            <h1 className="so-page-title">Seller Orders</h1>
            <p className="so-page-sub">
              {loading ? 'Loading orders…' : `${total} order${total !== 1 ? 's' : ''} total`}
            </p>
          </div>

          {/* Tabs */}
          <div className="so-tabs">
            {TABS.map((t, i) => (
              <button
                key={t.value}
                className={`so-tab${tab === i ? ' active' : ''}`}
                onClick={() => { setTab(i); setPage(1); }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Orders */}
          {loading ? <OrderSkeleton /> : displayOrders.length === 0 ? (
            <div className="so-empty">
              <div className="so-empty-icon">
                <ReceiptLong sx={{ fontSize: 30, color: '#bbb' }} />
              </div>
              <h2 className="so-empty-title">
                No {status !== 'all' ? status : ''} orders yet
              </h2>
              <p className="so-empty-sub">Orders for your books will appear here</p>
            </div>
          ) : (
            <div>
              {displayOrders.map(order => {
                const ss = STATUS_STYLE[order.status]         || STATUS_STYLE.pending;
                const ps = PAYMENT_STYLE[order.paymentStatus] || PAYMENT_STYLE.unpaid;
                const nextStatuses = NEXT_STATUS[order.status] || [];

                return (
                  <div key={order._id} className="so-card">

                    {/* Top bar */}
                    <div className="so-card-top">
                      <div>
                        <div className="so-order-id">#{order._id.slice(-10).toUpperCase()}</div>
                        <div className="so-order-meta">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {order.buyer?.name && ` · ${order.buyer.name}`}
                        </div>
                      </div>
                      <div className="so-badges">
                        <span className="so-badge" style={{ background: ss.bg, color: ss.color, borderColor: ss.border }}>
                          <span className="so-badge-dot" style={{ background: ss.dot }} />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="so-badge" style={{ background: ps.bg, color: ps.color, borderColor: ps.border }}>
                          <span className="so-badge-dot" style={{ background: ps.dot }} />
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="so-items">
                      {order.items.map(item => (
                        <div key={item._id} className="so-item">
                          <div
                            className="so-book-thumb"
                            onClick={() => navigate(`/books/${item.book?._id}`)}
                          >
                            <img
                              src={item.book?.images?.[0]?.url || `https://picsum.photos/seed/${item.book?._id}/48/60`}
                              alt={item.book?.title}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="so-item-title">{item.book?.title || 'Book'}</div>
                            <div className="so-item-qty">Qty: {item.quantity} × ₹{item.price}</div>
                          </div>
                          <div className="so-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="so-card-footer">
                      <div>
                        <div className="so-total-label">Order Total</div>
                        <div className="so-total-amount">₹{order.totalPrice?.toLocaleString('en-IN')}</div>
                      </div>

                      {nextStatuses.length > 0 && (
                        <div className="so-actions">
                          {nextStatuses.map(ns => {
                            const nss = STATUS_STYLE[ns] || STATUS_STYLE.pending;
                            const isCancelled = ns === 'cancelled';
                            return (
                              <button
                                key={ns}
                                className="so-action-btn"
                                onClick={() => setConfirmDialog({ orderId: order._id, newStatus: ns })}
                                disabled={updating === order._id}
                                style={{
                                  background:  isCancelled ? '#fff' : '#1a1a1a',
                                  color:       isCancelled ? nss.color : '#fff',
                                  borderColor: isCancelled ? nss.border : '#1a1a1a',
                                }}
                              >
                                {updating === order._id ? 'Updating…' : `Mark ${ns.charAt(0).toUpperCase() + ns.slice(1)}`}
                                <ArrowForward sx={{ fontSize: 13 }} />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="so-pagination">
              <Pagination
                count={pages} page={page}
                onChange={(_, val) => { setPage(val); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                    borderRadius: 2,
                    '&.Mui-selected': { bgcolor: '#1a1a1a', color: '#fff', '&:hover': { bgcolor: '#333' } }
                  }
                }}
              />
            </div>
          )}

        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={!!confirmDialog}
        onClose={() => setConfirmDialog(null)}
        PaperProps={{
          sx: {
            borderRadius: '20px', p: 1, maxWidth: 400,
            fontFamily: 'DM Sans, sans-serif',
            boxShadow: '0 24px 64px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{
          fontFamily: 'Instrument Serif, serif',
          fontWeight: 400, fontSize: 22,
          letterSpacing: '-0.02em', pb: 1
        }}>
          Update Order Status?
        </DialogTitle>
        <DialogContent>
          <Box sx={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#555', lineHeight: 1.6 }}>
            Mark this order as{' '}
            <Box component="span" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
              "{confirmDialog?.newStatus}"
            </Box>?

            {confirmDialog?.newStatus === 'cancelled' && (
              <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', fontSize: 13 }}>
                ⚠️ Stock will be restored automatically.
                {dialogOrder?.paymentStatus === 'paid' && (
                  <> Payment will also be marked as <strong>Refunded</strong> automatically.</>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button
            type="button"
            onClick={() => setConfirmDialog(null)}
            sx={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
              borderRadius: '100px', color: '#666', border: '1.5px solid #e0e0e0',
              px: 2.5, textTransform: 'none',
              '&:hover': { borderColor: '#1a1a1a', color: '#1a1a1a', background: 'transparent' }
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleStatusUpdate}
            variant="contained"
            sx={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
              borderRadius: '100px',
              background: '#1a1a1a',
              boxShadow: 'none',
              px: 3, textTransform: 'none',
              '&:hover': {
                background: '#333',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}