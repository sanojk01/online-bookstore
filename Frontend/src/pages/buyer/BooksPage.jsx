import { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Slider,
  Drawer, useMediaQuery, useTheme, Pagination
} from '@mui/material';
import API from '../../api/axios';
import BookGrid from '../../components/BookGrid';
import { toast } from 'react-toastify';

const CATEGORIES = [
  { value: 'all',         label: 'All',          icon: '✦' },
  { value: 'programming', label: 'Programming',  icon: '💻' },
  { value: 'finance',     label: 'Finance',      icon: '💰' },
  { value: 'motivation',  label: 'Motivation',   icon: '🔥' },
  { value: 'science',     label: 'Science',      icon: '🔬' },
  { value: 'history',     label: 'History',      icon: '🏛️' },
  { value: 'technology',  label: 'Technology',   icon: '🚀' },
  { value: 'biography',   label: 'Biography',    icon: '👤' },
  { value: 'self-help',   label: 'Self-Help',    icon: '🌱' },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .bp-root {
    min-height: 100vh;
    background: #06061a;
    font-family: 'Sora', sans-serif;
    position: relative;
  }

  /* ── Background ── */
  .bp-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .bp-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .bp-bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
  }

  .bp-bg-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #6366f1, #4f46e5);
    top: -180px; left: -100px;
    opacity: 0.15;
    animation: orb-drift 14s ease-in-out infinite;
  }

  .bp-bg-orb-2 {
    width: 350px; height: 350px;
    background: radial-gradient(circle, #8b5cf6, #7c3aed);
    top: 40%; right: -80px;
    opacity: 0.12;
    animation: orb-drift 18s ease-in-out infinite reverse;
  }

  @keyframes orb-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, -30px) scale(1.06); }
  }

  /* ── Hero ── */
  .bp-hero {
    position: relative;
    z-index: 1;
    padding: 48px 0 80px;
    text-align: center;
  }

  .bp-hero-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bp-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.25);
    font-size: 12px;
    font-weight: 600;
    color: #a5b4fc;
    letter-spacing: 0.04em;
    margin-bottom: 20px;
    animation: fade-up 0.5s ease both;
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bp-hero-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 0 0 12px;
    animation: fade-up 0.5s ease 0.05s both;
  }

  .bp-hero-title .accent {
    background: linear-gradient(135deg, #818cf8, #c4b5fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .bp-hero-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.45);
    margin: 0 0 32px;
    animation: fade-up 0.5s ease 0.1s both;
  }

  /* Search */
  .bp-search-wrap {
    position: relative;
    width: 100%;
    max-width: 520px;
    animation: fade-up 0.5s ease 0.15s both;
  }

  .bp-search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.3);
    width: 18px; height: 18px;
    pointer-events: none;
  }

  .bp-search {
    width: 100%;
    padding: 14px 16px 14px 48px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    color: #f1f5f9;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    outline: none;
    backdrop-filter: blur(12px);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .bp-search::placeholder { color: rgba(255,255,255,0.28); }

  .bp-search:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .bp-search-clear {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.08);
    border: none;
    border-radius: 50%;
    width: 22px; height: 22px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: rgba(255,255,255,0.5);
    transition: background 0.2s;
    font-size: 13px;
    line-height: 1;
  }

  .bp-search-clear:hover { background: rgba(255,255,255,0.14); }

  /* Hero stats */
  .bp-hero-stats {
    display: flex;
    gap: 24px;
    margin-top: 28px;
    animation: fade-up 0.5s ease 0.2s both;
    justify-content: center;
  }

  .bp-hero-stat {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(255,255,255,0.45);
  }

  .bp-hero-stat-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #6366f1;
    opacity: 0.7;
  }

  /* ── Main layout ── */
  .bp-main {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px 64px;
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 28px;
    margin-top: -32px;
  }

  @media (max-width: 900px) {
    .bp-main { grid-template-columns: 1fr; }
    .bp-sidebar { display: none; }
    .bp-hero-inner, .bp-main { padding-left: 20px; padding-right: 20px; }
  }

  /* ── Sidebar ── */
  .bp-sidebar {
    position: sticky;
    top: 24px;
    height: fit-content;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 20px;
    backdrop-filter: blur(12px);
    animation: fade-up 0.5s ease 0.1s both;
  }

  .bp-sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .bp-sidebar-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 15px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.02em;
  }

  .bp-clear-btn {
    font-size: 11.5px;
    font-weight: 600;
    color: #818cf8;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    padding: 0;
    transition: color 0.2s;
  }

  .bp-clear-btn:hover { color: #c4b5fd; }

  .bp-section-label {
    font-size: 10.5px;
    font-weight: 700;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
    padding-left: 4px;
  }

  .bp-cat-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 12px;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.5);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .bp-cat-item:hover {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.85);
  }

  .bp-cat-item.active {
    background: rgba(99,102,241,0.15);
    color: #a5b4fc;
    font-weight: 600;
  }

  .bp-cat-icon { font-size: 14px; flex-shrink: 0; }

  .bp-cat-dot {
    margin-left: auto;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #6366f1;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .bp-cat-item.active .bp-cat-dot { opacity: 1; }

  .bp-sidebar-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 16px 0;
  }

  /* Price range */
  .bp-price-vals {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }

  .bp-price-val {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.45);
    background: rgba(255,255,255,0.06);
    padding: 3px 10px;
    border-radius: 999px;
  }

  /* ── Content area ── */
  .bp-content { min-width: 0; }

  /* Toolbar */
  .bp-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    animation: fade-up 0.5s ease 0.15s both;
    text-align: center;
  }

  .bp-result-label {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.02em;
  }

  .bp-result-sub {
    font-size: 12.5px;
    color: rgba(255,255,255,0.35);
    margin-top: 2px;
  }

  .bp-toolbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Mobile filter btn */
  .bp-filter-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 16px;
    border-radius: 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.7);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .bp-filter-btn:hover {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.3);
    color: #a5b4fc;
  }

  .bp-filter-badge {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #6366f1;
    color: #fff;
    font-size: 10px;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
  }

  /* Sort select */
  .bp-sort {
    padding: 9px 14px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: rgba(255,255,255,0.7);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    appearance: none;
    min-width: 170px;
    transition: border-color 0.2s, background 0.2s;
  }

  .bp-sort:focus {
    border-color: rgba(99,102,241,0.4);
    background: rgba(99,102,241,0.07);
  }

  .bp-sort option { background: #12122a; color: #f1f5f9; }

  /* Active filter chips */
  .bp-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
    animation: fade-up 0.3s ease both;
  }

  .bp-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.28);
    color: #a5b4fc;
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .bp-chip:hover {
    background: rgba(99,102,241,0.22);
    border-color: rgba(99,102,241,0.5);
  }

  .bp-chip-x { font-size: 14px; line-height: 1; opacity: 0.7; }

  .bp-chip.clear-all {
    background: rgba(225,29,72,0.08);
    border-color: rgba(225,29,72,0.2);
    color: #fda4af;
  }

  .bp-chip.clear-all:hover {
    background: rgba(225,29,72,0.15);
    border-color: rgba(225,29,72,0.4);
  }

  /* ── Mobile drawer ── */
  .bp-drawer {
    width: 300px;
    background: #0d0d24;
    height: 100%;
    padding: 24px 20px;
    overflow-y: auto;
  }

  .bp-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .bp-drawer-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #f1f5f9;
  }

  .bp-drawer-close {
    width: 32px; height: 32px;
    border-radius: 10px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.6);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s;
  }

  .bp-drawer-close:hover { background: rgba(255,255,255,0.12); }

  .bp-apply-btn {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 24px;
    transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
  }

  .bp-apply-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(99,102,241,0.5);
  }
`;

// ── Filter Panel ──────────────────────────────────────────────────────────────
function FilterPanel({ category, setCategory, setPage, priceRange, setPriceRange, onClose, isMobile, activeFilters, clearAll }) {
  return (
    <div>
      {isMobile && (
        <div className="bp-drawer-header">
          <span className="bp-drawer-title">Filters</span>
          <button className="bp-drawer-close" onClick={onClose}>✕</button>
        </div>
      )}

      {!isMobile && (
        <div className="bp-sidebar-header">
          <span className="bp-sidebar-title">Filters</span>
          {activeFilters.length > 0 && (
            <button className="bp-clear-btn" onClick={clearAll}>Clear all</button>
          )}
        </div>
      )}

      {/* Categories */}
      <p className="bp-section-label">Category</p>
      {CATEGORIES.map(cat => (
        <button
          key={cat.value}
          className={`bp-cat-item ${category === cat.value ? 'active' : ''}`}
          onClick={() => { setCategory(cat.value); setPage(1); if (onClose) onClose(); }}
        >
          <span className="bp-cat-icon">{cat.icon}</span>
          <span>{cat.label}</span>
          <span className="bp-cat-dot" />
        </button>
      ))}

      <div className="bp-sidebar-divider" />

      {/* Price Range */}
      <p className="bp-section-label">Price Range</p>
      <Box px={0.5}>
        <Slider
          value={priceRange}
          onChange={(_, val) => setPriceRange(val)}
          valueLabelDisplay="auto"
          min={0} max={2000} step={50}
          valueLabelFormat={v => `₹${v}`}
          sx={{
            color: '#6366f1',
            '& .MuiSlider-thumb': {
              width: 16, height: 16,
              background: 'linear-gradient(135deg, #818cf8, #4f46e5)',
              border: '2px solid #06061a',
              '&:hover': { boxShadow: '0 0 0 8px rgba(99,102,241,0.15)' }
            },
            '& .MuiSlider-rail': { bgcolor: 'rgba(255,255,255,0.1)', opacity: 1 },
            '& .MuiSlider-track': { background: 'linear-gradient(90deg, #6366f1, #a78bfa)' },
          }}
        />
        <div className="bp-price-vals">
          <span className="bp-price-val">₹{priceRange[0]}</span>
          <span className="bp-price-val">₹{priceRange[1]}</span>
        </div>
      </Box>

      <div className="bp-sidebar-divider" />

      {/* Availability */}
      <p className="bp-section-label">Availability</p>
      {['All Books', 'In Stock Only'].map(opt => (
        <button key={opt} className="bp-cat-item">
          <span className="bp-cat-icon">{opt === 'All Books' ? '📚' : '✅'}</span>
          <span>{opt}</span>
        </button>
      ))}

      {isMobile && (
        <button className="bp-apply-btn" onClick={onClose}>Apply Filters</button>
      )}
    </div>
  );
}

// ── Main BooksPage ─────────────────────────────────────────────────────────────
export default function BooksPage() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [books,      setBooks]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category,   setCategory]   = useState('all');
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(0);
  const [pages,      setPages]      = useState(1);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const limit = 12;

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch books whenever filters change
  useEffect(() => {
    let cancelled = false;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const params = { page, limit };
        if (debouncedSearch.trim()) params.search   = debouncedSearch.trim();
        if (category !== 'all')     params.category = category;
        if (priceRange[0] > 0)      params.minPrice = priceRange[0];
        if (priceRange[1] < 2000)   params.maxPrice = priceRange[1];

        const { data } = await API.get('/books', { params });
        if (!cancelled) {
          setBooks(data.books || []);
          setTotal(data.total || 0);
          setPages(data.pages || 1);
        }
      } catch {
        if (!cancelled) toast.error('Failed to load books.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBooks();
    return () => { cancelled = true; };
  }, [debouncedSearch, category, page, priceRange[0], priceRange[1]]);

  const activeFilters = [];
  if (category !== 'all') activeFilters.push({ label: CATEGORIES.find(c => c.value === category)?.label, key: 'category' });
  if (debouncedSearch)    activeFilters.push({ label: `"${debouncedSearch}"`, key: 'search' });
  if (priceRange[0] > 0 || priceRange[1] < 2000)
    activeFilters.push({ label: `₹${priceRange[0]}–₹${priceRange[1]}`, key: 'price' });

  const clearFilter = (key) => {
    if (key === 'category') { setCategory('all'); setPage(1); }
    if (key === 'search')   { setSearch(''); setDebouncedSearch(''); setPage(1); }
    if (key === 'price')    { setPriceRange([0, 2000]); }
  };

  const clearAll = () => {
    setCategory('all');
    setSearch('');
    setDebouncedSearch('');
    setPriceRange([0, 2000]);
    setPage(1);
  };

  const currentCatLabel = category !== 'all'
    ? CATEGORIES.find(c => c.value === category)?.label
    : 'All Books';

  return (
    <>
      <style>{styles}</style>
      <div className="bp-root">

        {/* Background */}
        <div className="bp-bg">
          <div className="bp-bg-grid" />
          <div className="bp-bg-orb bp-bg-orb-1" />
          <div className="bp-bg-orb bp-bg-orb-2" />
        </div>

        {/* ── Hero ── */}
        <div className="bp-hero">
          <div className="bp-hero-inner">
            <div className="bp-hero-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              BOOKSTORE COLLECTION
            </div>

            <h1 className="bp-hero-title">
              Discover your<br />
              next <span className="accent">favourite read</span>
            </h1>

            <p className="bp-hero-sub">
              {loading ? 'Loading...' : `${total} books available — find your perfect match`}
            </p>

            {/* Search */}
            <div className="bp-search-wrap">
              <svg className="bp-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="bp-search"
                type="text"
                placeholder="Search by title, author, category..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              {search && (
                <button className="bp-search-clear" onClick={() => { setSearch(''); setPage(1); }}>✕</button>
              )}
            </div>

            <div className="bp-hero-stats">
              {[
                { label: '10K+ Books' },
                { label: '8 Categories' },
                { label: 'Fast Delivery' },
              ].map(({ label }) => (
                <div key={label} className="bp-hero-stat">
                  <div className="bp-hero-stat-dot" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="bp-main">

          {/* Sidebar — Desktop */}
          {!isMobile && (
            <div className="bp-sidebar">
              <FilterPanel
                category={category} setCategory={setCategory} setPage={setPage}
                priceRange={priceRange} setPriceRange={setPriceRange}
                isMobile={false} activeFilters={activeFilters} clearAll={clearAll}
              />
            </div>
          )}

          {/* Content */}
          <div className="bp-content">

            {/* Toolbar */}
            <div className="bp-toolbar">
              <div>
                <div className="bp-result-label">{currentCatLabel}</div>
                <div className="bp-result-sub">
                  {loading ? 'Loading...' : `${total} results`}
                  {search && ` for "${search}"`}
                </div>
              </div>

              <div className="bp-toolbar-right">
                {isMobile && (
                  <button className="bp-filter-btn" onClick={() => setDrawerOpen(true)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                    </svg>
                    Filters
                    {activeFilters.length > 0 && (
                      <span className="bp-filter-badge">{activeFilters.length}</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <div className="bp-chips">
                {activeFilters.map(f => (
                  <button key={f.key} className="bp-chip" onClick={() => clearFilter(f.key)}>
                    {f.label} <span className="bp-chip-x">✕</span>
                  </button>
                ))}
                <button className="bp-chip clear-all" onClick={clearAll}>
                  Clear All <span className="bp-chip-x">✕</span>
                </button>
              </div>
            )}

            {/* Books Grid */}
            <BookGrid
              books={books}
              loading={loading}
              total={total}
              pages={pages}
              page={page}
              onPageChange={val => { setPage(val); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              emptyMessage="No books found"
              emptySubtext="Try adjusting your search or filters"
              onClearFilter={clearAll}
              skeletonCount={9}
              columns={{ xs: 12, sm: 6, md: 6, lg: 4 }}
            />
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
        >
          <div className="bp-drawer">
            <FilterPanel
              category={category} setCategory={setCategory} setPage={setPage}
              priceRange={priceRange} setPriceRange={setPriceRange}
              onClose={() => setDrawerOpen(false)}
              isMobile={true} activeFilters={activeFilters} clearAll={clearAll}
            />
          </div>
        </Drawer>

      </div>
    </>
  );
}