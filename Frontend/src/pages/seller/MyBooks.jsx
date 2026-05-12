import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Add, Edit, Delete, Search, BookOutlined } from '@mui/icons-material';
import API from '../../api/axios';
import { toast } from 'react-toastify';

/* ─── Styles ─────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  .mb-root { font-family: 'DM Sans', sans-serif; }

  .mb-page-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(26px, 3vw, 34px);
    font-weight: 400;
    color: #0f0f0f;
    letter-spacing: -0.02em;
    margin: 0 0 3px;
    line-height: 1.1;
  }
  .mb-page-sub {
    font-size: 13px;
    color: #9ca3af;
    font-weight: 500;
    margin: 0;
  }

  .mb-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #0f0f0f;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 11px 22px;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    letter-spacing: 0.01em;
    flex-shrink: 0;
  }
  .mb-add-btn:hover {
    background: #2a2a2a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.18);
  }

  .mb-search-wrap {
    position: relative;
    width: 260px;
  }
  .mb-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #d1d5db;
    pointer-events: none;
    display: flex;
  }
  .mb-search {
    width: 100%;
    padding: 10px 16px 10px 40px;
    border: 1.5px solid #e5e7eb;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #111;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .mb-search:focus {
    border-color: #0f0f0f;
    box-shadow: 0 0 0 3px rgba(15,15,15,0.06);
  }
  .mb-search::placeholder { color: #c4c9d4; }

  /* Card */
  .mb-card {
    border-radius: 18px;
    border: 1.5px solid #efefef;
    overflow: hidden;
    background: #fff;
    transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .mb-card:hover {
    box-shadow: 0 16px 48px rgba(0,0,0,0.09);
    transform: translateY(-4px);
    border-color: #e2e8f0;
  }

  /* Fixed 2-line title */
  .mb-book-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #0f0f0f;
    margin: 0 0 5px;
    cursor: pointer;
    letter-spacing: -0.01em;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: calc(14px * 1.45 * 2);
  }
  .mb-book-title:hover { color: #4f46e5; }

  .mb-book-author {
    font-size: 12px;
    color: #9ca3af;
    margin: 0 0 10px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 16px;
  }

  .mb-btn-edit {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: #f9fafb;
    color: #374151;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 9px 0;
    cursor: pointer;
    transition: all 0.18s;
  }
  .mb-btn-edit:hover {
    background: #0f0f0f;
    color: #fff;
    border-color: #0f0f0f;
  }

  .mb-btn-delete {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: #fff;
    color: #ef4444;
    border: 1.5px solid #fca5a5;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 9px 0;
    cursor: pointer;
    transition: all 0.18s;
  }
  .mb-btn-delete:hover:not(:disabled) {
    background: #ef4444;
    color: #fff;
    border-color: #ef4444;
  }
  .mb-btn-delete:disabled { opacity: 0.45; cursor: not-allowed; }

  .mb-empty-wrap { text-align: center; padding: 80px 0; }
  .mb-empty-icon {
    width: 68px; height: 68px;
    border-radius: 18px; background: #f3f4f6;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }
`;

/* ─── BookCard ───────────────────────────────────────────── */
function BookCardSeller({ book, onEdit, onDelete, deleting }) {
  const navigate = useNavigate();

  return (
    <div className="mb-card">
      {/* Image */}
      <Box sx={{ position: 'relative', height: 180, bgcolor: '#f3f4f6', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={book.images?.[0]?.url || `https://picsum.photos/seed/${book._id}/300/200`}
          alt={book.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.05) 50%, transparent 75%)'
        }} />

        {/* Price */}
        <Typography sx={{
          position: 'absolute', bottom: 10, left: 12,
          fontFamily: 'Instrument Serif, serif',
          fontSize: 22, fontWeight: 400, color: '#fff', lineHeight: 1
        }}>
          ₹{book.price}
        </Typography>

        {/* Stock */}
        <Box sx={{
          position: 'absolute', top: 10, right: 10,
          px: 1.2, py: 0.35, borderRadius: '100px',
          bgcolor: book.stock === 0 ? 'rgba(220,38,38,0.9)' : 'rgba(22,163,74,0.9)',
          backdropFilter: 'blur(8px)',
        }}>
          <Typography sx={{
            color: '#fff', fontSize: 10, fontWeight: 700,
            fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.03em'
          }}>
            {book.stock === 0 ? 'Out of Stock' : `${book.stock} in stock`}
          </Typography>
        </Box>
      </Box>

      {/* Content — flex grow so actions always at bottom */}
      <Box sx={{ p: 2, pb: 1.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p className="mb-book-title" onClick={() => navigate(`/books/${book._id}`)}>
          {book.title}
        </p>
        <p className="mb-book-author">{book.author || '\u00A0'}</p>

        {/* Category — mt auto pushes it down, placeholder keeps height uniform */}
        <Box sx={{ mt: 'auto' }}>
          {book.category ? (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center',
              px: 1.25, py: 0.3, borderRadius: '100px',
              bgcolor: '#eef2ff', border: '1px solid #e0e7ff'
            }}>
              <Typography sx={{
                fontSize: 10.5, fontWeight: 600, color: '#4f46e5',
                fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.01em'
              }}>
                {book.category}
              </Typography>
            </Box>
          ) : <Box sx={{ height: 22 }} />}
        </Box>
      </Box>

      <Box sx={{ height: '1px', bgcolor: '#f3f4f6' }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, p: 1.5 }}>
        <button className="mb-btn-edit" onClick={() => onEdit(book._id)}>
          <Edit sx={{ fontSize: 13 }} /> Edit
        </button>
        <button className="mb-btn-delete" onClick={() => onDelete(book)} disabled={deleting === book._id}>
          <Delete sx={{ fontSize: 13 }} />
          {deleting === book._id ? 'Deleting…' : 'Delete'}
        </button>
      </Box>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function MyBooks() {
  const navigate = useNavigate();
  const [books,       setBooks]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [deleting,    setDeleting]    = useState(null);
  const [confirmBook, setConfirmBook] = useState(null);

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/books/seller/my-books');
      setBooks(data.books || []);
    } catch {
      toast.error('Failed to load books.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmBook) return;
    try {
      setDeleting(confirmBook._id);
      await API.delete(`/books/${confirmBook._id}`);
      toast.success('Book deleted successfully.');
      setBooks(prev => prev.filter(b => b._id !== confirmBook._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setDeleting(null);
      setConfirmBook(null);
    }
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <Box className="mb-root" sx={{ bgcolor: '#f7f8fa', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth={false} disableGutters>
          <Box sx={{ maxWidth: '80%', mx: 'auto' }}>

          {/* ── Header ── */}
          <Box sx={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3.5,
          }}>
            <Box>
              <h1 className="mb-page-title">My Books</h1>
              <p className="mb-page-sub">
                {loading ? 'Loading…' : `${books.length} book${books.length !== 1 ? 's' : ''} listed`}
              </p>
            </Box>
            {/* Search + Button grouped on right */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <div className="mb-search-wrap">
                <span className="mb-search-icon"><Search sx={{ fontSize: 16 }} /></span>
                <input
                  className="mb-search"
                  placeholder="Search books…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button className="mb-add-btn" onClick={() => navigate('/seller/books/add')}>
                <Add sx={{ fontSize: 17 }} /> Add New Book
              </button>
            </Box>
          </Box>

          {/* ── Grid ── */}
          {loading ? (
            <Grid container spacing={2}>
              {[...Array(8)].map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Box sx={{ borderRadius: '18px', overflow: 'hidden', border: '1.5px solid #efefef', bgcolor: '#fff' }}>
                    <Skeleton variant="rectangular" height={180} />
                    <Box p={2}>
                      <Skeleton width="85%" height={16} sx={{ mb: 0.5 }} />
                      <Skeleton width="85%" height={16} sx={{ mb: 1 }} />
                      <Skeleton width="40%" height={13} sx={{ mb: 1.5 }} />
                      <Skeleton width="32%" height={22} sx={{ borderRadius: 3 }} />
                    </Box>
                    <Box display="flex" gap={1} p={1.5}>
                      <Skeleton variant="rectangular" sx={{ flex: 1, height: 36, borderRadius: '10px' }} />
                      <Skeleton variant="rectangular" sx={{ flex: 1, height: 36, borderRadius: '10px' }} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : filtered.length === 0 ? (
            <div className="mb-empty-wrap">
              <div className="mb-empty-icon">
                <BookOutlined sx={{ fontSize: 30, color: '#9ca3af' }} />
              </div>
              <Typography sx={{
                fontFamily: 'Instrument Serif, serif', fontSize: 20,
                fontWeight: 400, color: '#0f0f0f', letterSpacing: '-0.02em', mb: 0.75
              }}>
                {search ? 'No books found' : 'No books yet'}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#9ca3af', fontFamily: 'DM Sans, sans-serif', mb: 3 }}>
                {search ? 'Try a different keyword' : 'Start by adding your first book'}
              </Typography>
              {!search && (
                <button className="mb-add-btn" onClick={() => navigate('/seller/books/add')}>
                  <Add sx={{ fontSize: 17 }} /> Add First Book
                </button>
              )}
            </div>
          ) : (
            <Grid container spacing={2}>
              {filtered.map(book => (
                <Grid item xs={12} sm={6} md={3} key={book._id} sx={{ display: 'flex' }}>
                  <BookCardSeller
                    book={book}
                    onEdit={id => navigate(`/seller/books/edit/${id}`)}
                    onDelete={book => setConfirmBook(book)}
                    deleting={deleting}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          </Box>
        </Container>
      </Box>

      {/* ── Delete Dialog ── */}
      <Dialog
        open={!!confirmBook}
        onClose={() => setConfirmBook(null)}
        PaperProps={{ sx: { borderRadius: '20px', p: 0.5, maxWidth: 370, boxShadow: '0 24px 64px rgba(0,0,0,0.13)' } }}
      >
        <DialogTitle sx={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 21, letterSpacing: '-0.02em', pb: 0.75 }}>
          Delete this book?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13.5, fontFamily: 'DM Sans, sans-serif', color: '#6b7280', lineHeight: 1.65 }}>
            You're about to permanently delete{' '}
            <Box component="span" fontWeight={700} color="#0f0f0f">"{confirmBook?.title}"</Box>.
            {' '}This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmBook(null)} sx={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
            borderRadius: '100px', color: '#6b7280', fontSize: 13, px: 2.5,
            '&:hover': { bgcolor: '#f3f4f6' }
          }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={!!deleting} variant="contained" sx={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
            borderRadius: '100px', bgcolor: '#ef4444', fontSize: 13, px: 2.5,
            '&:hover': { bgcolor: '#dc2626' }, boxShadow: 'none',
          }}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}