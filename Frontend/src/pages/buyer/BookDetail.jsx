import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Grid, Typography, Button, Chip,
  Rating, Divider, IconButton, Skeleton, Breadcrumbs,
  Link, Avatar, Paper, Tabs, Tab
} from '@mui/material';
import {
  Add, Remove, ArrowBack, Store,
  LocalShipping, Autorenew, Shield,
  ShoppingCart, Favorite, FavoriteBorder,
  Share, BookmarkAdd
} from '@mui/icons-material';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@600;700;800&display=swap');

  .bd-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(1.6rem, 3vw, 2.1rem);
    font-weight: 800;
    color: #0a0a0a;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin: 0 0 8px;
  }

  .bd-author {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    color: #64748b;
    font-weight: 400;
    margin: 0 0 16px;
  }

  .bd-price {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: #6366f1;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .bd-desc {
    font-family: 'Sora', sans-serif;
    font-size: 14.5px;
    color: #64748b;
    line-height: 1.85;
    font-weight: 300;
  }

  .bd-qty-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }

  .bd-qty-btn:hover:not(:disabled) {
    border-color: #6366f1;
    color: #6366f1;
    background: #eef2ff;
  }

  .bd-qty-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .bd-qty-val {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #0a0a0a;
    min-width: 44px;
    text-align: center;
  }

  .bd-btn-cart {
    flex: 1;
    padding: 14px 0;
    border-radius: 14px;
    border: 2px solid #6366f1;
    background: transparent;
    color: #6366f1;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 8px;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    letter-spacing: 0.01em;
  }

  .bd-btn-cart:hover:not(:disabled) {
    background: #eef2ff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99,102,241,0.15);
  }

  .bd-btn-buy {
    flex: 1;
    padding: 14px 0;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 8px;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 8px 22px rgba(99,102,241,0.28);
    letter-spacing: 0.01em;
  }

  .bd-btn-buy:hover:not(:disabled) {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-2px);
    box-shadow: 0 14px 32px rgba(99,102,241,0.38);
  }

  .bd-btn-buy:disabled,
  .bd-btn-cart:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .bd-badge-card {
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border: 1.5px solid #f1f5f9;
    background: #fff;
    transition: transform 0.2s ease;
  }

  .bd-badge-card:hover {
    transform: translateY(-2px);
  }

  .bd-badge-icon {
    font-size: 22px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .bd-badge-title {
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    font-weight: 700;
    color: #0a0a0a;
    margin-bottom: 2px;
  }

  .bd-badge-desc {
    font-family: 'Sora', sans-serif;
    font-size: 11.5px;
    color: #94a3b8;
    font-weight: 300;
    line-height: 1.5;
  }

  .bd-thumb {
    width: 72px; height: 90px;
    object-fit: cover;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.22s ease;
    border: 2.5px solid transparent;
  }

  .bd-thumb:hover {
    transform: scale(1.04);
  }

  .bd-thumb-active {
    border-color: #6366f1;
    box-shadow: 0 4px 14px rgba(99,102,241,0.25);
  }

  .bd-tab-content {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    color: #64748b;
    line-height: 1.85;
    font-weight: 300;
    padding: 24px 0;
  }
`;

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={5}>
          <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 4 }} />
          <Box display="flex" gap={1.5} mt={2}>
            {[1, 2, 3].map(i => (
              <Skeleton key={i} variant="rectangular" width={72} height={90} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
          <Skeleton width="90%" height={40} sx={{ mb: 1 }} />
          <Skeleton width="40%" height={24} sx={{ mb: 3 }} />
          <Skeleton width="30%" height={50} sx={{ mb: 3 }} />
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} width={`${85 - i * 5}%`} height={18} sx={{ mb: 1 }} />
          ))}
          <Box display="flex" gap={2} mt={4}>
            <Skeleton variant="rectangular" height={52} sx={{ flex: 1, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={52} sx={{ flex: 1, borderRadius: 2 }} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BookDetail() {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const { user }        = useAuth();
  const { addToCart }   = useCart();

  const [book,      setBook]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [quantity,  setQuantity]  = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding,    setAdding]    = useState(false);
  const [wished,    setWished]    = useState(false);
  const [tab,       setTab]       = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
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
  };

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      setAdding(true);
      await addToCart(book._id, quantity);
      toast.success(`${quantity} book(s) added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add.');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      setAdding(true);
      await addToCart(book._id, quantity);
      navigate('/cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!book)   return null;

  const images = book.images?.length
    ? book.images.map(img => img.url)
    : [`https://picsum.photos/seed/${book._id}/500/700`];

  const isSeller   = user?.role === 'seller';
  const outOfStock = book.stock === 0;
  const lowStock   = book.stock > 0 && book.stock <= 5;

  return (
    <>
      <style>{styles}</style>
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>

        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #f1f5f9', py: 1.5 }}>
          <Container maxWidth="lg">
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                size="small"
                onClick={() => navigate('/')}
                sx={{
                  bgcolor: '#f8fafc', border: '1px solid #e2e8f0',
                  width: 32, height: 32
                }}
              >
                <ArrowBack fontSize="small" />
              </IconButton>
              <Breadcrumbs sx={{ fontSize: 13 }}>
                <Link
                  underline="hover" color="inherit"
                  onClick={() => navigate('/')}
                  sx={{ cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                >
                  Home
                </Link>
                {book.category && (
                  <Link
                    underline="hover" color="inherit"
                    onClick={() => navigate('/')}
                    sx={{ cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                  >
                    {book.category}
                  </Link>
                )}
                <Typography
                  fontSize={13} color="text.primary" noWrap
                  sx={{ maxWidth: 200, fontFamily: 'Sora, sans-serif' }}
                >
                  {book.title}
                </Typography>
              </Breadcrumbs>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Grid container spacing={{ xs: 3, md: 6 }}>

            {/* ── Images ─────────────────────────────────────────────────── */}
            <Grid item xs={12} md={5}>

              {/* Main image */}
              <Box sx={{
                borderRadius: 4, overflow: 'hidden',
                bgcolor: '#fff',
                border: '1.5px solid #f1f5f9',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                mb: 2
              }}>
                <Box
                  component="img"
                  src={images[activeImg]}
                  alt={book.title}
                  sx={{
                    width: '100%',
                    height: { xs: 320, md: 420 },
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'opacity 0.25s ease'
                  }}
                />

                {/* Out of stock overlay */}
                {outOfStock && (
                  <Box sx={{
                    position: 'absolute', inset: 0,
                    bgcolor: 'rgba(0,0,0,0.42)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Chip
                      label="Out of Stock"
                      sx={{
                        bgcolor: '#ef4444', color: '#fff',
                        fontWeight: 700, fontSize: 16,
                        fontFamily: 'Sora, sans-serif',
                        py: 2.5, px: 1
                      }}
                    />
                  </Box>
                )}

                {/* Top action buttons */}
                <Box sx={{
                  position: 'absolute', top: 12, right: 12,
                  display: 'flex', flexDirection: 'column', gap: 1
                }}>
                  {[
                    {
                      icon: wished
                        ? <Favorite sx={{ fontSize: 17, color: '#ef4444' }} />
                        : <FavoriteBorder sx={{ fontSize: 17, color: '#64748b' }} />,
                      onClick: () => setWished(!wished)
                    },
                    {
                      icon: <Share sx={{ fontSize: 17, color: '#64748b' }} />,
                      onClick: () => {}
                    },
                    {
                      icon: <BookmarkAdd sx={{ fontSize: 17, color: '#64748b' }} />,
                      onClick: () => {}
                    },
                  ].map((btn, i) => (
                    <IconButton
                      key={i}
                      onClick={btn.onClick}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(8px)',
                        width: 36, height: 36,
                        border: '1px solid rgba(255,255,255,0.5)',
                        '&:hover': { bgcolor: '#fff', transform: 'scale(1.1)' },
                        transition: 'all 0.2s'
                      }}
                    >
                      {btn.icon}
                    </IconButton>
                  ))}
                </Box>
              </Box>

              {/* Thumbnails */}
              {images.length > 1 && (
                <Box display="flex" gap={1.5} flexWrap="wrap">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className={`bd-thumb ${activeImg === i ? 'bd-thumb-active' : ''}`}
                      onClick={() => setActiveImg(i)}
                    />
                  ))}
                </Box>
              )}
            </Grid>

            {/* ── Details ────────────────────────────────────────────────── */}
            <Grid item xs={12} md={7}>

              {/* Category + Stock */}
              <Box display="flex" alignItems="center" gap={1.5} mb={1.5} flexWrap="wrap">
                {book.category && (
                  <Chip
                    label={book.category}
                    size="small"
                    sx={{
                      bgcolor: '#eef2ff', color: '#6366f1',
                      fontWeight: 700, fontSize: 12,
                      fontFamily: 'Sora, sans-serif',
                      border: '1px solid #c7d2fe'
                    }}
                  />
                )}
                {outOfStock && (
                  <Chip label="Out of Stock" size="small"
                    sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 700, fontFamily: 'Sora, sans-serif' }} />
                )}
                {lowStock && (
                  <Chip label={`Only ${book.stock} left!`} size="small"
                    sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 700, fontFamily: 'Sora, sans-serif' }} />
                )}
                {!outOfStock && !lowStock && (
                  <Chip label="In Stock" size="small"
                    sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 700, fontFamily: 'Sora, sans-serif' }} />
                )}
              </Box>

              {/* Title */}
              <h1 className="bd-title">{book.title}</h1>

              {/* Author */}
              <p className="bd-author">
                by <strong style={{ color: '#0a0a0a', fontWeight: 600 }}>{book.author}</strong>
              </p>

              {/* Rating */}
              <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                <Rating
                  value={4.5} readOnly precision={0.5}
                  sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }}
                />
                <Typography
                  fontSize={13} color="text.secondary"
                  sx={{ fontFamily: 'Sora, sans-serif' }}
                >
                  4.5 (24 reviews)
                </Typography>
              </Box>

              <Divider sx={{ mb: 2.5, borderColor: '#f1f5f9' }} />

              {/* Price */}
              <div className="bd-price">₹{book.price}</div>

              {/* Description — short */}
              {book.description && (
                <p className="bd-desc" style={{ marginTop: 16, marginBottom: 20 }}>
                  {book.description.slice(0, 200)}
                  {book.description.length > 200 ? '...' : ''}
                </p>
              )}

              {/* Quantity selector */}
              {!outOfStock && !isSeller && (
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Typography
                    fontWeight={600} fontSize={14}
                    sx={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Quantity:
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <button
                      className="bd-qty-btn"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Remove fontSize="small" />
                    </button>
                    <span className="bd-qty-val">{quantity}</span>
                    <button
                      className="bd-qty-btn"
                      onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}
                      disabled={quantity >= book.stock}
                    >
                      <Add fontSize="small" />
                    </button>
                  </Box>
                </Box>
              )}

              {/* Action buttons */}
              {!isSeller && (
                <Box display="flex" gap={2} mb={4} flexWrap="wrap">
                  <button
                    className="bd-btn-cart"
                    onClick={handleAddToCart}
                    disabled={adding || outOfStock}
                  >
                    <ShoppingCart sx={{ fontSize: 17 }} />
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    className="bd-btn-buy"
                    onClick={handleBuyNow}
                    disabled={adding || outOfStock}
                  >
                    {outOfStock ? 'Out of Stock' : 'Buy Now'}
                  </button>
                </Box>
              )}

              {/* Feature badges */}
              <Grid container spacing={1.5} mb={3}>
                {[
                  { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
                  { icon: '↩️', title: 'Easy Returns',  desc: '7-day return policy' },
                  { icon: '🔒', title: 'Secure Payment', desc: '100% safe & encrypted' },
                ].map(b => (
                  <Grid item xs={12} sm={4} key={b.title}>
                    <div className="bd-badge-card">
                      <span className="bd-badge-icon">{b.icon}</span>
                      <div>
                        <div className="bd-badge-title">{b.title}</div>
                        <div className="bd-badge-desc">{b.desc}</div>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>

              {/* Seller info */}
              {book.seller && (
                <Box sx={{
                  p: 2, borderRadius: 3,
                  bgcolor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', gap: 2
                }}>
                  <Avatar sx={{
                    bgcolor: '#6366f1', width: 40, height: 40,
                    fontFamily: 'Bricolage Grotesque, sans-serif',
                    fontWeight: 800, fontSize: 16
                  }}>
                    {book.seller.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography
                      fontSize={12} color="text.secondary"
                      sx={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Sold by
                    </Typography>
                    <Typography
                      fontWeight={700} fontSize={15}
                      sx={{ fontFamily: 'Bricolage Grotesque, sans-serif', letterSpacing: '-0.02em' }}
                    >
                      {book.seller.name}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip
                      icon={<Store fontSize="small" />}
                      label="Verified Seller"
                      size="small"
                      sx={{
                        bgcolor: '#dcfce7', color: '#16a34a',
                        fontWeight: 700, fontSize: 11,
                        fontFamily: 'Sora, sans-serif',
                        border: '1px solid #bbf7d0'
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>

          {/* ── Tabs — Description / Details ─────────────────────────────── */}
          <Box
            sx={{
              mt: 6, bgcolor: '#fff',
              borderRadius: 4,
              border: '1.5px solid #f1f5f9',
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, val) => setTab(val)}
              sx={{
                borderBottom: '1.5px solid #f1f5f9',
                px: 2,
                '& .MuiTab-root': {
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: 'none',
                  color: '#64748b',
                  '&.Mui-selected': { color: '#6366f1' }
                },
                '& .MuiTabs-indicator': { bgcolor: '#6366f1', height: 3, borderRadius: 2 }
              }}
            >
              <Tab label="Description" />
              <Tab label="Book Details" />
              <Tab label="Reviews (24)" />
            </Tabs>

            <Box px={{ xs: 2, md: 4 }}>

              {/* Description tab */}
              {tab === 0 && (
                <div className="bd-tab-content">
                  {book.description || 'No description available for this book.'}
                </div>
              )}

              {/* Details tab */}
              {tab === 1 && (
                <Box py={3}>
                  {[
                    { label: 'Title',     value: book.title },
                    { label: 'Author',    value: book.author },
                    { label: 'Category',  value: book.category || '—' },
                    { label: 'Price',     value: `₹${book.price}` },
                    { label: 'Stock',     value: `${book.stock} units` },
                    { label: 'Added On',  value: new Date(book.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  ].map((row, i) => (
                    <Box
                      key={row.label}
                      display="flex"
                      sx={{
                        py: 1.5, px: 1,
                        bgcolor: i % 2 === 0 ? '#f8fafc' : '#fff',
                        borderRadius: 2
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: 13, fontWeight: 600,
                          color: '#64748b', width: 140, flexShrink: 0
                        }}
                      >
                        {row.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: 13, fontWeight: 500,
                          color: '#0a0a0a'
                        }}
                      >
                        {row.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Reviews tab */}
              {tab === 2 && (
                <div className="bd-tab-content" style={{ textAlign: 'center', padding: '48px 0' }}>
                  <Typography fontSize={40} mb={1}>⭐</Typography>
                  <Typography
                    fontWeight={700} fontSize={16}
                    sx={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                  >
                    Reviews coming soon
                  </Typography>
                  <Typography
                    color="text.secondary" fontSize={13} mt={0.5}
                    sx={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Be the first to review this book after purchase
                  </Typography>
                </div>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}