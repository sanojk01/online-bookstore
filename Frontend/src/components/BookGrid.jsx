import { Box, Grid } from '@mui/material';
import BookCard     from '../components/home/BookCard';
import BookSkeleton from '../components/home/BookSkeleton';

const styles = `
  .bg-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 72px 24px;
    text-align: center;
    animation: bg-fade-up 0.4s ease both;
  }

  @keyframes bg-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bg-empty-icon {
    width: 72px; height: 72px;
    border-radius: 20px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    font-size: 32px;
  }

  .bg-empty-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }

  .bg-empty-sub {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    color: rgba(255,255,255,0.38);
    margin: 0 0 24px;
    max-width: 300px;
    line-height: 1.6;
  }

  .bg-clear-btn {
    padding: 10px 24px;
    border-radius: 12px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.28);
    color: #a5b4fc;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .bg-clear-btn:hover {
    background: rgba(99,102,241,0.22);
    border-color: rgba(99,102,241,0.5);
    transform: translateY(-1px);
  }

  .bg-count {
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    color: rgba(255,255,255,0.3);
    margin-bottom: 20px;
  }

  .bg-count strong {
    color: rgba(255,255,255,0.6);
    font-weight: 600;
  }

  /* Pagination */
  .bg-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 48px;
    flex-wrap: wrap;
  }

  .bg-page-btn {
    min-width: 38px; height: 38px;
    padding: 0 10px;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.5);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
  }

  .bg-page-btn:hover:not(:disabled) {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.3);
    color: #a5b4fc;
  }

  .bg-page-btn.active {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 4px 14px rgba(99,102,241,0.4);
  }

  .bg-page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .bg-page-btn svg {
    width: 15px; height: 15px;
  }

  .bg-page-info {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    color: rgba(255,255,255,0.25);
    padding: 0 8px;
  }
`;

function CustomPagination({ pages, page, onPageChange }) {
  const getPages = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    if (page <= 4)  return [1, 2, 3, 4, 5, '...', pages];
    if (page >= pages - 3) return [1, '...', pages-4, pages-3, pages-2, pages-1, pages];
    return [1, '...', page-1, page, page+1, '...', pages];
  };

  return (
    <div className="bg-pagination">
      {/* Prev */}
      <button
        className="bg-page-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} className="bg-page-info">•••</span>
          : <button
              key={p}
              className={`bg-page-btn ${page === p ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
      )}

      {/* Next */}
      <button
        className="bg-page-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
  );
}

export default function BookGrid({
  books,
  loading,
  total         = 0,
  pages         = 1,
  page          = 1,
  onPageChange,
  emptyMessage  = 'No books found',
  emptySubtext  = 'Try a different search or category',
  onClearFilter,
  skeletonCount = 9,
}) {

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <Grid container spacing={2.5}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <BookSkeleton />
            </Grid>
          ))}
        </Grid>
      </>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!books || books.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="bg-empty">
          <div className="bg-empty-icon">📚</div>
          <h3 className="bg-empty-title">{emptyMessage}</h3>
          <p className="bg-empty-sub">{emptySubtext}</p>
          {onClearFilter && (
            <button className="bg-clear-btn" onClick={onClearFilter}>
              Clear Filters
            </button>
          )}
        </div>
      </>
    );
  }

  // ── Books grid ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>

      <p className="bg-count">
        Showing <strong>{books.length}</strong> of <strong>{total}</strong> books
      </p>

      {/* 3 per row — cards centered with fixed width */}
      <Grid container spacing={2.5} justifyContent="center">
        {books.map(book => (
          <Grid item key={book._id} sx={{ display: 'flex', justifyContent: 'center' }}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>

      {pages > 1 && onPageChange && (
        <CustomPagination
          pages={pages}
          page={page}
          onPageChange={(val) => {
            onPageChange(val);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </>
  );
}