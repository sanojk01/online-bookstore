const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@500;700;800;900&display=swap');

  .hero-root {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(ellipse at 10% 0%, rgba(99,102,241,0.22) 0%, transparent 40%),
      radial-gradient(ellipse at 90% 100%, rgba(59,130,246,0.2) 0%, transparent 40%),
      linear-gradient(145deg, #04041a 0%, #0d0d2b 40%, #131347 70%, #1a1a5c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 96px 24px 88px;
    color: #fff;
    font-family: 'Sora', sans-serif;
  }

  /* grid overlay */
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* glow orbs */
  .hero-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
  }
  .hero-orb-1 {
    width: 380px; height: 380px;
    top: -120px; left: -100px;
    background: rgba(99,102,241,0.18);
  }
  .hero-orb-2 {
    width: 420px; height: 420px;
    bottom: -140px; right: -100px;
    background: rgba(59,130,246,0.16);
  }
  .hero-orb-3 {
    width: 200px; height: 200px;
    top: 40%; left: 55%;
    background: rgba(139,92,246,0.12);
    filter: blur(60px);
  }

  .hero-inner {
    position: relative;
    z-index: 2;
    max-width: 820px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0;
  }

  /* TRUST BADGE */
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 18px;
    border-radius: 999px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(12px);
    font-size: 12.5px;
    font-weight: 600;
    color: #c7d2fe;
    margin-bottom: 32px;
    letter-spacing: 0.02em;
  }

  .hero-badge-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #818cf8;
    box-shadow: 0 0 0 3px rgba(129,140,248,0.25);
    animation: hero-pulse 2s infinite;
    flex-shrink: 0;
  }

  @keyframes hero-pulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(129,140,248,0.25); }
    50% { box-shadow: 0 0 0 6px rgba(129,140,248,0.08); }
  }

  /* HEADING */
  .hero-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(2.6rem, 7vw, 5rem);
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -0.04em;
    color: #f1f5f9;
    margin: 0 0 20px;
    text-shadow: 0 4px 24px rgba(0,0,0,0.3);
  }

  .hero-title-accent {
    position: relative;
    display: inline-block;
    color: transparent;
    background: linear-gradient(135deg, #a5b4fc, #818cf8, #6366f1);
    -webkit-background-clip: text;
    background-clip: text;
  }

  .hero-title-accent::after {
    content: '';
    position: absolute;
    left: 0; bottom: 4px;
    width: 100%; height: 6px;
    background: rgba(129,140,248,0.2);
    border-radius: 4px;
    z-index: -1;
  }

  /* SUBTITLE */
  .hero-sub {
    font-size: clamp(14px, 2vw, 17px);
    color: rgba(255,255,255,0.55);
    line-height: 1.85;
    font-weight: 300;
    max-width: 620px;
    margin: 0 0 40px;
  }

  /* SEARCH */
  .hero-search-wrap {
    width: 100%;
    max-width: 680px;
    position: relative;
    margin-bottom: 40px;
  }

  .hero-search-glow {
    position: absolute;
    inset: -12px;
    background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(59,130,246,0.12));
    border-radius: 28px;
    filter: blur(24px);
    opacity: 0.7;
    pointer-events: none;
  }

  .hero-search-box {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(255,255,255,0.07);
    backdrop-filter: blur(24px);
    border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    padding: 6px 6px 6px 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .hero-search-box:focus-within {
    border-color: rgba(129,140,248,0.5);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15), 0 20px 60px rgba(0,0,0,0.35);
  }

  .hero-search-icon {
    color: rgba(255,255,255,0.4);
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .hero-search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #e2e8f0;
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 400;
    padding: 10px 14px;
    letter-spacing: 0.01em;
  }

  .hero-search-input::placeholder {
    color: rgba(203,213,225,0.45);
    font-weight: 300;
  }

  .hero-search-btn {
    flex-shrink: 0;
    padding: 12px 22px;
    border-radius: 11px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none;
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: all 0.25s ease;
    box-shadow: 0 8px 20px rgba(99,102,241,0.4);
    white-space: nowrap;
  }

  .hero-search-btn:hover {
    background: linear-gradient(135deg, #5254cc, #4338ca);
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(99,102,241,0.5);
  }

  /* PILLS */
  .hero-pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  .hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 999px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    backdrop-filter: blur(10px);
    font-size: 12.5px;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  }

  .hero-pill-icon {
    width: 18px; height: 18px;
    border-radius: 6px;
    background: rgba(129,140,248,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a5b4fc;
    flex-shrink: 0;
  }

  @media (max-width: 520px) {
    .hero-root { padding: 72px 20px 64px; }
    .hero-search-btn span { display: none; }
  }
`;

export default function HeroSection({ search, handleSearch }) {
  return (
    <>
      <style>{styles}</style>
      <section className="hero-root">
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-inner">

          {/* Badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Trusted by 50,000+ readers worldwide
          </div>

          {/* Heading */}
          <h1 className="hero-title">
            Discover your next<br />
            <span className="hero-title-accent">favorite book</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-sub">
            Explore thousands of books across every genre — fiction, technology,
            history, self-help and more. Fast delivery, secure checkout.
          </p>

          {/* Search */}
          <div className="hero-search-wrap">
            <div className="hero-search-glow" />
            <div className="hero-search-box">
              <span className="hero-search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
              <input
                className="hero-search-input"
                placeholder="Search books, authors, categories..."
                value={search}
                onChange={handleSearch}
              />
              <button className="hero-search-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Pills */}
          <div className="hero-pills">
            <span className="hero-pill">
              <span className="hero-pill-icon">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </span>
              10,000+ Premium Books
            </span>
            <span className="hero-pill">
              <span className="hero-pill-icon">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/>
                </svg>
              </span>
              Fast Delivery Across India
            </span>
            <span className="hero-pill">
              <span className="hero-pill-icon">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
                </svg>
              </span>
              100% Secure Payments
            </span>
          </div>

        </div>
      </section>
    </>
  );
}