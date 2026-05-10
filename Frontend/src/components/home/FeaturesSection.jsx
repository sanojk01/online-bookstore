import { useState } from "react";

const features = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: "Huge Collection",
    desc: "Thousands of titles across fiction, technology, history and more — curated for every kind of reader.",
    accent: "#6366f1",
    tag: "10,000+ books",
    tagIcon: "📚",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
        <rect x="9" y="11" width="14" height="10" rx="2"/>
        <path d="M12 16h.01M16 14h.01M20 16h.01M16 18h.01"/>
      </svg>
    ),
    title: "Fast Delivery",
    desc: "Quick and secure delivery across India — your next read arrives before the week is out.",
    accent: "#0ea5e9",
    tag: "Pan-India",
    tagIcon: "🚀",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3"/>
        <path d="M2 10h20"/>
        <path d="M7 15h2M12 15h4"/>
      </svg>
    ),
    title: "Secure Payment",
    desc: "Trusted gateway with fully encrypted checkout — your data and money are always protected.",
    accent: "#10b981",
    tag: "256-bit SSL",
    tagIcon: "🔒",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <path d="M8 10h.01M12 10h.01M16 10h.01"/>
      </svg>
    ),
    title: "24/7 Support",
    desc: "A friendly team always ready — reach us any time via chat, email, or phone.",
    accent: "#f59e0b",
    tag: "Always online",
    tagIcon: "💬",
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');

  .fs-root {
    background: #ffffff;
    padding: 100px 32px;
    font-family: 'Sora', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .fs-inner {
    max-width: 1180px;
    margin: 0 auto;
  }

  .fs-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    margin-bottom: 64px;
  }

  .fs-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6366f1;
    margin-bottom: 18px;
    justify-content: center;
  }

  .fs-eyebrow-line {
    width: 24px;
    height: 1.5px;
    background: #6366f1;
    border-radius: 2px;
  }

  .fs-heading {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(2rem, 4vw, 3.1rem);
    font-weight: 800;
    color: #0a0a0a;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 0;
  }

  .fs-heading-muted {
    color: #d1d5db;
    font-weight: 500;
  }

  .fs-tagline {
    font-size: 15px;
    color: #9ca3af;
    line-height: 1.7;
    max-width: 480px;
    font-weight: 300;
    margin: 0;
  }

  .fs-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  @media (max-width: 900px) {
    .fs-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 520px) {
    .fs-grid { grid-template-columns: 1fr; }
  }

  .fs-card {
    border-radius: 20px;
    padding: 32px 28px 28px;
    border: 1px solid #f0f0f0;
    background: #fff;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .fs-card:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 32px 64px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.04);
  }

  .fs-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .fs-icon-box {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
    flex-shrink: 0;
  }

  .fs-card:hover .fs-icon-box {
    transform: rotate(-8deg) scale(1.08);
  }

  .fs-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10.5px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .fs-card-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #0a0a0a;
    margin: 0 0 10px;
    letter-spacing: -0.02em;
  }

  .fs-card-desc {
    font-size: 13.5px;
    color: #9ca3af;
    line-height: 1.75;
    margin: 0;
    font-weight: 300;
    flex: 1;
  }

  .fs-card-footer {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .fs-arrow {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    color: #9ca3af;
  }

  .fs-card:hover .fs-arrow {
    transform: translate(2px, -2px);
  }

  .fs-learn {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #d1d5db;
    transition: color 0.3s ease;
  }

  .fs-card:hover .fs-learn {
    color: #6b7280;
  }
`;

export default function FeaturesSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <style>{styles}</style>
      <section className="fs-root">
        <div className="fs-inner">

          <div className="fs-top">
            <div>
              <div className="fs-eyebrow">
                <span className="fs-eyebrow-line" />
                Why readers choose us
              </div>
              <h2 className="fs-heading">
                Built for<br />
                <span className="fs-heading-muted">every reader.</span>
              </h2>
            </div>
            <p className="fs-tagline">
              A seamless bookstore experience with premium collections, secure checkout, and lightning-fast delivery across India.
            </p>
          </div>

          <div className="fs-grid">
            {features.map((item) => (
              <div
                key={item.title}
                className="fs-card"
                onMouseEnter={() => setHovered(item.title)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderColor: hovered === item.title ? item.accent + "28" : undefined,
                }}
              >
                <div className="fs-card-top">
                  <div
                    className="fs-icon-box"
                    style={{ background: item.accent + "12", color: item.accent }}
                  >
                    {item.icon}
                  </div>
                  <span
                    className="fs-pill"
                    style={{ background: item.accent + "10", color: item.accent }}
                  >
                    {item.tagIcon} {item.tag}
                  </span>
                </div>

                <h3 className="fs-card-title">{item.title}</h3>
                <p className="fs-card-desc">{item.desc}</p>

                <div className="fs-card-footer">
                  <span className="fs-learn">Learn more</span>
                  <span
                    className="fs-arrow"
                    style={{
                      borderColor: hovered === item.title ? item.accent + "55" : undefined,
                      color: hovered === item.title ? item.accent : undefined,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M7 7h10v10"/>
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}