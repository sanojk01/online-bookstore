import { useNavigate } from "react-router-dom";
import BookCard from "./BookCard";
import BookSkeleton from "./BookSkeleton";

const CATEGORIES = [
  "all", "programming", "finance", "motivation",
  "science", "history", "technology", "biography", "self-help",
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@500;700;800&display=swap');

  .eb-root {
    background: #ffffff;
    padding: 96px 40px;
    font-family: 'Sora', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .eb-root::before {
    content: '';
    position: absolute;
    top: -180px; right: -180px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .eb-inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  .eb-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .eb-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6366f1;
    margin-bottom: 16px;
  }

  .eb-eyebrow-line {
    width: 22px; height: 1.5px;
    background: #6366f1;
    border-radius: 2px;
  }

  .eb-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    color: #0a0a0a;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 0 0 14px;
  }

  .eb-title span {
    color: #6366f1;
  }

  .eb-subtitle {
    font-size: 15px;
    color: #9ca3af;
    line-height: 1.7;
    font-weight: 300;
    margin: 0;
  }

  /* CATEGORY TABS */
  .eb-cats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 56px;
  }

  .eb-cat {
    padding: 7px 18px;
    border-radius: 999px;
    border: 1px solid #ebebeb;
    background: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.22s ease;
    text-transform: capitalize;
  }

  .eb-cat:hover {
    border-color: #c7d2fe;
    color: #6366f1;
    background: #f5f3ff;
  }

  .eb-cat.active {
    background: #6366f1;
    border-color: #6366f1;
    color: #fff;
    box-shadow: 0 6px 18px rgba(99,102,241,0.28);
    font-weight: 600;
  }

  /* GRID */
  .eb-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 22px;
  }

  @media (max-width: 1024px) { .eb-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 720px)  { .eb-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  { .eb-grid { grid-template-columns: 1fr; } }

  /* EMPTY STATE */
  .eb-empty {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 320px;
    text-align: center;
    gap: 12px;
  }

  .eb-empty-icon {
    width: 72px; height: 72px;
    border-radius: 20px;
    background: #f5f3ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    color: #c4b5fd;
  }

  .eb-empty-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #0a0a0a;
    letter-spacing: -0.02em;
  }

  .eb-empty-sub {
    font-size: 14px;
    color: #b0b8c8;
    font-weight: 300;
  }

  /* MORE BUTTON */
  .eb-more-wrap {
    display: flex;
    justify-content: center;
    margin-top: 52px;
  }

  .eb-more-btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 13px 32px;
    border-radius: 999px;
    background: #6366f1;
    border: none;
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 10px 28px rgba(99,102,241,0.28);
    letter-spacing: 0.01em;
  }

  .eb-more-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 36px rgba(99,102,241,0.36);
    background: #5254cc;
  }

  .eb-more-btn svg {
    transition: transform 0.3s ease;
  }

  .eb-more-btn:hover svg {
    transform: translateX(3px);
  }
`;

export default function ExploreBooksSection({
  books = [],
  loading = false,
  category = "all",
  handleCategory = () => {},
}) {
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <section className="eb-root">
        <div className="eb-inner">

          {/* Header */}
          <div className="eb-header">
            <div className="eb-eyebrow">
              <span className="eb-eyebrow-line" />
              Our collection
            </div>
            <h2 className="eb-title">
              Explore <span>books</span>
            </h2>
            <p className="eb-subtitle">
              Browse across all categories and discover your next favorite read
            </p>
          </div>

          {/* Categories */}
          <div className="eb-cats">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`eb-cat${category === cat ? " active" : ""}`}
                onClick={() => handleCategory(cat)}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          <div className="eb-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <BookSkeleton key={i} />)
            ) : books?.length === 0 ? (
              <div className="eb-empty">
                <div className="eb-empty-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <div className="eb-empty-title">No books found</div>
                <div className="eb-empty-sub">No books available in this category yet</div>
              </div>
            ) : (
              books?.slice(0, 8)?.map((book) => <BookCard key={book._id} book={book} />)
            )}
          </div>

          {/* More Button */}
          {!loading && books?.length > 0 && (
            <div className="eb-more-wrap">
              <button className="eb-more-btn" onClick={() => navigate("/books")}>
                More Books
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
}