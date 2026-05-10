import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Card, Grid,
  Chip, Divider, Skeleton, Tabs, Tab
} from '@mui/material';
import { ShoppingBag, ArrowForward } from '@mui/icons-material';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@600;700;800&display=swap');

  .mo-page-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(1.6rem, 3vw, 2rem);
    font-weight: 800;
    color: #0a0a0a;
    letter-spacing: -0.03em;
    margin: 0;
  }

  .mo-order-id {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 400;
  }

  .mo-order-id span {
    font-family: 'monospace', sans-serif;
    color: #475569;
    font-weight: 700;
  }

  .mo-date {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 300;
  }

  .mo-book-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #0a0a0a;
    letter-spacing: -0.02em;
    margin: 0 0 2px;
  }

  .mo-book-meta {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 300;
    margin: 0;
  }

  .mo-item-price {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 14px;
    font-weight: 800;
    color: #6366f1;
    letter-spacing: -0.02em;
  }

  .mo-total {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    color: #6366f1;
    letter-spacing: -0.04em;
  }

  .mo-pay-btn {
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    transition: all 0.25s;
    box-shadow: 0 6px 16px rgba(99,102,241,0.25);
  }

  .mo-pay-btn:hover {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(99,102,241,0.35);
  }

  .mo-cancel-btn {
    padding: 10px 20px;
    border-radius: 10px;
    border: 2px solid #fecdd3;
    background: transparent;
    color: #ef4444;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.22s;
  }

  .mo-cancel-btn:hover {
    background: #fff1f2;
    border-color: #ef4444;
  }

  .mo-cancel-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .mo-browse-btn {
    padding: 13px 28px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 22px rgba(99,102,241,0.28);
    transition: all 0.25s;
  }

  .mo-browse-btn:hover {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(99,102,241,0.36);
  }
`;

const TABS = [
  { value: 'all',       label: 'All Orders' },
  { value: 'pending',   label: 'Pending' },
  { value: 'shipped',   label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_STYLE = {
  pending:   { bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
  shipped:   { bg: '#dbeafe', color: '#2563eb', border: '#bfdbfe' },
  delivered: { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
  cancelled: { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' },
};

const PAYMENT_STYLE = {
  paid:    { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
  unpaid:  { bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
  refunded:{ bg: '#ede9fe', color: '#7c3aed', border: '#ddd6fe' },
};

function OrderSkeleton() {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {[1, 2, 3].map(i => (
        <Card key={i} sx={{ borderRadius: 4, p: 3, border: '1.5px solid #f1f5f9', boxShadow: 'none' }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Skeleton width={200} height={18} />
            <Skeleton width={80} height={26} sx={{ borderRadius: 3 }} />
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <Skeleton variant="rectangular" width={60} height={78} sx={{ borderRadius: 2 }} />
            <Box flex={1}>
              <Skeleton width="70%" height={18} sx={{ mb: 0.5 }} />
              <Skeleton width="40%" height={14} />
            </Box>
          </Box>
          <Skeleton width="100%" height={1} sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Skeleton width={120} height={32} />
            <Skeleton width={100} height={40} sx={{ borderRadius: 2 }} />
          </Box>
        </Card>
      ))}
    </Box>
  );
}

export default function MyOrders() {
  const navigate         = useNavigate();
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState(0);
  const [cancelling,setCancelling]= useState(null);

  const status = TABS[tab].value;

  useEffect(() => {
    fetchOrders();
  }, [tab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = status !== 'all' ? { status } : {};
      const { data } = await API.get('/orders/my', { params });
      setOrders(data.orders);
    } catch {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      setCancelling(orderId);
      await API.patch(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully.');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order.');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">

          {/* Header */}
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Box sx={{
              width: 46, height: 46, borderRadius: 3,
              bgcolor: '#eef2ff', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <ShoppingBag sx={{ fontSize: 22, color: '#6366f1' }} />
            </Box>
            <Box>
              <h1 className="mo-page-title">My Orders</h1>
              <Typography fontSize={13} color="text.secondary" sx={{ fontFamily: 'Sora, sans-serif' }}>
                Track and manage your orders
              </Typography>
            </Box>
          </Box>

          {/* Tabs */}
          <Card sx={{ borderRadius: 4, mb: 3, border: '1.5px solid #f1f5f9', boxShadow: 'none', overflow: 'hidden' }}>
            <Tabs
              value={tab}
              onChange={(_, val) => setTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  fontSize: 13,
                  textTransform: 'none',
                  color: '#64748b',
                  minHeight: 52,
                  '&.Mui-selected': { color: '#6366f1' }
                },
                '& .MuiTabs-indicator': {
                  bgcolor: '#6366f1',
                  height: 3, borderRadius: 2
                }
              }}
            >
              {TABS.map(t => (
                <Tab key={t.value} label={t.label} />
              ))}
            </Tabs>
          </Card>

          {/* Orders */}
          {loading ? <OrderSkeleton /> :
           orders.length === 0 ? (

            /* Empty */
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="40vh" textAlign="center">
              <Box sx={{
                width: 90, height: 90, borderRadius: '50%',
                bgcolor: '#eef2ff', display: 'flex',
                alignItems: 'center', justifyContent: 'center', mb: 3
              }}>
                <ShoppingBag sx={{ fontSize: 40, color: '#6366f1' }} />
              </Box>
              <Typography
                fontWeight={800} fontSize={20} mb={0.5}
                sx={{ fontFamily: 'Bricolage Grotesque, sans-serif', letterSpacing: '-0.03em' }}
              >
                No {status !== 'all' ? status : ''} orders yet
              </Typography>
              <Typography fontSize={14} color="text.secondary" mb={3} sx={{ fontFamily: 'Sora, sans-serif' }}>
                Start shopping and your orders will appear here
              </Typography>
              <button className="mo-browse-btn" onClick={() => navigate('/books')}>
                Browse Books <ArrowForward sx={{ fontSize: 17 }} />
              </button>
            </Box>

          ) : (

            <Box display="flex" flexDirection="column" gap={2.5}>
              {orders.map(order => {
                const ss = STATUS_STYLE[order.status]  || STATUS_STYLE.pending;
                const ps = PAYMENT_STYLE[order.paymentStatus] || PAYMENT_STYLE.unpaid;

                return (
                  <Card key={order._id} sx={{
                    borderRadius: 4, p: { xs: 2.5, md: 3 },
                    border: '1.5px solid #f1f5f9', boxShadow: 'none',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }
                  }}>

                    {/* Order header */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1.5} mb={2}>
                      <Box>
                        <p className="mo-order-id">
                          Order ID: <span>{order._id.slice(-10).toUpperCase()}</span>
                        </p>
                        <p className="mo-date">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </Box>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          size="small"
                          sx={{
                            bgcolor: ss.bg, color: ss.color,
                            fontWeight: 700, fontSize: 12,
                            fontFamily: 'Sora, sans-serif',
                            border: `1px solid ${ss.border}`
                          }}
                        />
                        <Chip
                          label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          size="small"
                          sx={{
                            bgcolor: ps.bg, color: ps.color,
                            fontWeight: 700, fontSize: 12,
                            fontFamily: 'Sora, sans-serif',
                            border: `1px solid ${ps.border}`
                          }}
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ borderColor: '#f8fafc', mb: 2 }} />

                    {/* Items */}
                    <Box display="flex" flexDirection="column" gap={2} mb={2}>
                      {order.items.map(item => (
                        <Box key={item._id} display="flex" gap={2} alignItems="center">
                          <Box
                            onClick={() => navigate(`/books/${item.book?._id}`)}
                            sx={{
                              width: 60, height: 78, flexShrink: 0,
                              borderRadius: 2.5, overflow: 'hidden',
                              bgcolor: '#f1f5f9', cursor: 'pointer',
                              transition: 'transform 0.22s',
                              '&:hover': { transform: 'scale(1.05)' }
                            }}
                          >
                            <img
                              src={item.book?.images?.[0]?.url || `https://picsum.photos/seed/${item.book?._id}/60/78`}
                              alt={item.book?.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          </Box>
                          <Box flex={1} minWidth={0}>
                            <h3
                              className="mo-book-title"
                              onClick={() => navigate(`/books/${item.book?._id}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              {item.book?.title || 'Book'}
                            </h3>
                            <p className="mo-book-meta">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </Box>
                          <span className="mo-item-price">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ borderColor: '#f8fafc', mb: 2 }} />

                    {/* Footer */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                      <Box>
                        <Typography fontSize={12} color="text.secondary" sx={{ fontFamily: 'Sora, sans-serif', mb: 0.3 }}>
                          Order Total
                        </Typography>
                        <span className="mo-total">₹{order.totalPrice?.toLocaleString()}</span>
                      </Box>

                      <Box display="flex" gap={1.5} flexWrap="wrap">
                        {/* Pay Now */}
                        {order.paymentStatus === 'unpaid' && order.status !== 'cancelled' && (
                          <button
                            className="mo-pay-btn"
                            onClick={() => navigate(`/payment/${order._id}`)}
                          >
                            Pay Now
                            <ArrowForward sx={{ fontSize: 15 }} />
                          </button>
                        )}

                        {/* Cancel */}
                        {order.status === 'pending' && (
                          <button
                            className="mo-cancel-btn"
                            onClick={() => handleCancel(order._id)}
                            disabled={cancelling === order._id}
                          >
                            {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                      </Box>
                    </Box>

                  </Card>
                );
              })}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}