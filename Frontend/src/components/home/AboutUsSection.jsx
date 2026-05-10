const stats = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    value: "10K+",
    label: "Books Available",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    value: "50K+",
    label: "Happy Readers",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    value: "100+",
    label: "Categories",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    value: "4.9★",
    label: "Customer Rating",
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@500;700;800&display=swap');

  .au-root {
    background: #f5f3ff;
    padding: 100px 40px;
    font-family: 'Sora', sans-serif;
    overflow: hidden;
  }

  .au-inner {
    max-width: 1160px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  @media (max-width: 860px) {
    .au-inner { grid-template-columns: 1fr; gap: 48px; }
    .au-root { padding: 64px 24px; }
    .au-img-wrap { width: 100% !important; }
  }

  /* LEFT */
  .au-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 13px;
    border-radius: 999px;
    border: 1px solid #e0e7ff;
    background: #f5f3ff;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: #6366f1;
    margin-bottom: 22px;
  }

  .au-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #6366f1;
    animation: au-pulse 2s infinite;
  }

  @keyframes au-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.4; transform:scale(0.65); }
  }

  .au-heading {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(1.9rem, 3.5vw, 2.9rem);
    font-weight: 800;
    color: #0a0a0a;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 0 0 18px;
  }

  .au-heading-accent {
    color: #6366f1;
  }

  .au-desc {
    font-size: 15px;
    color: #9ca3af;
    line-height: 1.8;
    font-weight: 300;
    margin: 0 0 40px;
    max-width: 460px;
  }

  .au-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .au-stat {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    border-radius: 16px;
    border: 1px solid #f3f4f6;
    background: #fff;
    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1);
  }

  .au-stat:hover {
    border-color: #e0e7ff;
    box-shadow: 0 8px 24px rgba(99,102,241,0.08);
    transform: translateY(-3px);
  }

  .au-stat-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: #f5f3ff;
    color: #6366f1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .au-stat-value {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #0a0a0a;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .au-stat-label {
    font-size: 11.5px;
    color: #b0b8c8;
    margin-top: 3px;
    font-weight: 400;
  }

  /* RIGHT */
  .au-img-side {
    position: relative;
  }

  .au-img-wrap {
    border-radius: 28px;
    overflow: hidden;
    aspect-ratio: 4/3;
    width: 90%;
    margin-left: auto;
    position: relative;
  }

  .au-img-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }

  .au-img-wrap:hover img {
    transform: scale(1.04);
  }

  .au-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,10,10,0.18) 0%, transparent 50%);
    border-radius: 28px;
  }

  .au-float-badge {
    position: absolute;
    bottom: -18px;
    left: 0;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    min-width: 200px;
  }

  .au-float-dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.18);
  }

  .au-float-title {
    font-size: 13px;
    font-weight: 600;
    color: #0a0a0a;
    line-height: 1.2;
  }

  .au-float-sub {
    font-size: 11px;
    color: #b0b8c8;
    margin-top: 2px;
  }

  .au-deco-ring {
    position: absolute;
    top: -24px;
    right: -24px;
    width: 120px; height: 120px;
    border-radius: 50%;
    border: 1.5px dashed #e0e7ff;
    pointer-events: none;
  }

  .au-deco-ring-inner {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 60px; height: 60px;
    border-radius: 50%;
    background: #f5f3ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
`;

export default function AboutUsSection() {
  return (
    <>
      <style>{styles}</style>
      <section className="au-root">
        <div className="au-inner">

          {/* LEFT */}
          <div>
            <div className="au-badge">
              <span className="au-badge-dot" />
              About Us
            </div>

            <h2 className="au-heading">
              Your trusted online<br />
              <span className="au-heading-accent">book store</span>
            </h2>

            <p className="au-desc">
              We help readers discover amazing books across fiction, technology,
              self-help, history and many more categories. Our mission is to make
              reading affordable, accessible and enjoyable for everyone.
            </p>

            <div className="au-stats">
              {stats.map((s) => (
                <div className="au-stat" key={s.label}>
                  <div className="au-stat-icon">{s.icon}</div>
                  <div>
                    <div className="au-stat-value">{s.value}</div>
                    <div className="au-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="au-img-side">
            <div className="au-deco-ring">
              <div className="au-deco-ring-inner">📖</div>
            </div>

            <div className="au-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1693917000971-b00956674129?w=600&auto=format&fit=crop&q=60"
                alt="Reader holding a book"
              />
              <div className="au-img-overlay" />
            </div>

            <div className="au-float-badge">
              <span className="au-float-dot" />
              <div>
                <div className="au-float-title">Trusted by readers</div>
                <div className="au-float-sub">Since 2018 · Worldwide</div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}