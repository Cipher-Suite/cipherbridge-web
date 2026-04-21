// src/landing/LandingPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Design tokens ─────────────────────────────────────────────────────────────
const L = {
  black:    '#0A0A0A',
  white:    '#FFFFFF',
  gray50:   '#F9F9F9',
  gray100:  '#F0F0F0',
  gray200:  '#E0E0E0',
  gray400:  '#9A9A9A',
  gray600:  '#555555',
  accent:   '#00E5A0',
  accentDim:'#00C488',
  font:     "'DM Sans', system-ui, sans-serif",
  serif:    "'Instrument Serif', 'Georgia', serif",
  mono:     "'JetBrains Mono', 'Cascadia Code', monospace",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

  .lp-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .lp-root {
    background: ${L.white}; color: ${L.black};
    font-family: ${L.font}; overflow-x: hidden;
  }

  /* ── Nav ── */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 64px;
    background: rgba(255,255,255,0.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid ${L.gray200};
  }
  @media (max-width: 768px) { .lp-nav { padding: 0 20px; } }
  .lp-nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-weight: 800; font-size: 18px;
    color: ${L.black}; text-decoration: none; letter-spacing: -0.03em;
  }
  .lp-nav-logo-mark {
    width: 30px; height: 30px; border-radius: 8px; background: ${L.black};
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 900; color: ${L.accent};
  }
  .lp-nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  @media (max-width: 768px) { .lp-nav-links { display: none; } }
  .lp-nav-links a {
    font-size: 14px; font-weight: 500; color: ${L.gray600};
    text-decoration: none; transition: color 0.15s;
  }
  .lp-nav-links a:hover { color: ${L.black}; }
  .lp-nav-actions { display: flex; align-items: center; gap: 10px; }
  .lp-btn-ghost {
    padding: 8px 18px; border-radius: 8px; border: 1px solid ${L.gray200};
    background: transparent; color: ${L.black}; font-family: ${L.font};
    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s;
  }
  .lp-btn-ghost:hover { border-color: ${L.black}; }
  .lp-btn-primary {
    padding: 8px 18px; border-radius: 8px; border: none;
    background: ${L.black}; color: ${L.white}; font-family: ${L.font};
    font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .lp-btn-primary:hover { background: #222; }

  /* ── Hero ── */
  .lp-hero {
    padding: 160px 48px 96px; max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  }
  @media (max-width: 900px) {
    .lp-hero { grid-template-columns: 1fr; padding: 120px 20px 64px; gap: 48px; }
  }
  .lp-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 12px; border-radius: 100px;
    border: 1px solid ${L.gray200}; background: ${L.gray50};
    font-family: ${L.mono}; font-size: 11px; color: ${L.gray600};
    margin-bottom: 28px; letter-spacing: 0.05em;
  }
  .lp-hero-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: ${L.accent};
    animation: lp-pulse 2s ease-in-out infinite;
  }
  @keyframes lp-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .lp-hero-h1 {
    font-family: ${L.serif}; font-size: clamp(42px, 5vw, 68px);
    font-weight: 400; line-height: 1.05; letter-spacing: -0.02em;
    color: ${L.black}; margin-bottom: 24px;
  }
  .lp-hero-h1 em { font-style: italic; color: ${L.gray600}; }
  .lp-hero-sub {
    font-size: 17px; line-height: 1.6; color: ${L.gray600};
    max-width: 480px; margin-bottom: 40px;
  }
  .lp-hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
  .lp-hero-btn-primary {
    padding: 14px 28px; border-radius: 10px; border: none;
    background: ${L.black}; color: ${L.white}; font-family: ${L.font};
    font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; gap: 8px;
  }
  .lp-hero-btn-primary:hover { background: #111; transform: translateY(-1px); }
  .lp-hero-btn-secondary {
    padding: 14px 28px; border-radius: 10px;
    border: 1px solid ${L.gray200}; background: ${L.white};
    color: ${L.black}; font-family: ${L.font};
    font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s;
  }
  .lp-hero-btn-secondary:hover { border-color: ${L.black}; transform: translateY(-1px); }

  /* ── Terminal ── */
  .lp-terminal {
    background: ${L.black}; border-radius: 14px; overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.2); font-family: ${L.mono}; font-size: 13px;
  }
  .lp-terminal-bar {
    background: #1a1a1a; padding: 12px 16px;
    display: flex; align-items: center; gap: 8px;
    border-bottom: 1px solid #2a2a2a;
  }
  .lp-terminal-dot { width: 10px; height: 10px; border-radius: 50%; }
  .lp-terminal-title { flex: 1; text-align: center; font-size: 11px; color: #555; letter-spacing: 0.05em; }
  .lp-terminal-body { padding: 28px 24px; line-height: 1.9; }
  .lp-tc { color: #555; }
  .lp-tg { color: ${L.accent}; font-weight: 600; }
  .lp-tw { color: #e8e8f4; }
  .lp-tb { color: #4d8fff; }
  .lp-ty { color: #ffd644; }
  .lp-tp { color: #c792ea; }

  /* ── Shared section styles ── */
  .lp-section { padding: 96px 48px; max-width: 1200px; margin: 0 auto; }
  @media (max-width: 768px) { .lp-section { padding: 64px 20px; } }
  .lp-section-label {
    font-family: ${L.mono}; font-size: 11px; color: ${L.gray400};
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;
  }
  .lp-h2 {
    font-family: ${L.serif}; font-size: clamp(32px, 4vw, 52px);
    font-weight: 400; line-height: 1.1; color: ${L.black}; margin-bottom: 16px;
  }
  .lp-h2-sub {
    font-size: 16px; color: ${L.gray600}; line-height: 1.6;
    max-width: 560px; margin-bottom: 56px;
  }

  /* ── Stats ── */
  .lp-stats {
    display: flex; border: 1px solid ${L.gray200};
    border-radius: 14px; overflow: hidden; margin-top: 80px;
  }
  .lp-stat {
    flex: 1; padding: 32px 28px; text-align: center;
    border-right: 1px solid ${L.gray200};
  }
  .lp-stat:last-child { border-right: none; }
  @media (max-width: 768px) {
    .lp-stats { flex-direction: column; }
    .lp-stat { border-right: none; border-bottom: 1px solid ${L.gray200}; }
    .lp-stat:last-child { border-bottom: none; }
  }
  .lp-stat-num { font-family: ${L.serif}; font-size: 40px; color: ${L.black}; margin-bottom: 4px; }
  .lp-stat-label { font-size: 13px; color: ${L.gray600}; font-weight: 500; }

  /* ── About / Story ── */
  .lp-about-wrap {
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start;
  }
  @media (max-width: 900px) { .lp-about-wrap { grid-template-columns: 1fr; gap: 48px; } }

  .lp-about-left p {
    font-size: 16px; color: ${L.gray600}; line-height: 1.85;
    margin-bottom: 20px;
  }
  .lp-about-left p:last-child { margin-bottom: 0; }
  .lp-about-left strong { color: ${L.black}; font-weight: 700; }

  .lp-about-right {
    position: sticky; top: 96px;
  }
  .lp-about-quote {
    border-left: 3px solid ${L.accent};
    padding: 28px 32px; background: ${L.gray50};
    border-radius: 0 12px 12px 0;
  }
  .lp-about-quote-text {
    font-family: ${L.serif}; font-size: clamp(20px, 2.5vw, 26px);
    line-height: 1.4; color: ${L.black}; font-style: italic;
    margin-bottom: 20px;
  }
  .lp-about-quote-attr {
    font-family: ${L.mono}; font-size: 11px; color: ${L.gray400};
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .lp-about-tags {
    display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px;
  }
  .lp-about-tag {
    font-family: ${L.mono}; font-size: 11px;
    padding: 5px 12px; border-radius: 100px;
    border: 1px solid ${L.gray200}; color: ${L.gray600};
    background: ${L.white};
  }

  /* ── Why Tonpo ── */
  .lp-why-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
  @media (max-width: 768px) { .lp-why-grid { grid-template-columns: 1fr; } }
  .lp-why-item { padding: 40px 32px; background: ${L.gray50}; border-radius: 2px; }
  .lp-why-icon {
    width: 48px; height: 48px; background: ${L.black}; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 20px;
  }
  .lp-why-title { font-size: 17px; font-weight: 700; color: ${L.black}; margin-bottom: 10px; }
  .lp-why-desc { font-size: 14px; color: ${L.gray600}; line-height: 1.7; }

  /* ── How it works ── */
  .lp-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
  @media (max-width: 768px) { .lp-steps { grid-template-columns: 1fr; } }
  .lp-step { padding: 40px 32px; background: ${L.gray50}; border-radius: 2px; position: relative; }
  .lp-step-num {
    font-family: ${L.serif}; font-size: 72px; line-height: 1;
    color: ${L.gray200}; position: absolute; top: 24px; right: 28px;
  }
  .lp-step-title { font-size: 18px; font-weight: 700; color: ${L.black}; margin-bottom: 12px; line-height: 1.2; }
  .lp-step-desc { font-size: 14px; color: ${L.gray600}; line-height: 1.6; }
  .lp-step-tag {
    display: inline-block; margin-top: 20px; font-family: ${L.mono}; font-size: 11px;
    color: ${L.accent}; background: rgba(0,229,160,0.08);
    padding: 4px 10px; border-radius: 100px; border: 1px solid rgba(0,229,160,0.2);
  }

  /* ── Features ── */
  .lp-features { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; }
  @media (max-width: 900px) { .lp-features { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px)  { .lp-features { grid-template-columns: 1fr; } }
  .lp-feature {
    padding: 36px 32px; border: 1px solid ${L.gray200};
    transition: border-color 0.15s, background 0.15s;
  }
  .lp-feature:hover { border-color: ${L.black}; background: ${L.gray50}; }
  .lp-feature-icon {
    width: 44px; height: 44px; border-radius: 10px; background: ${L.black};
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 20px;
  }
  .lp-feature-title { font-size: 15px; font-weight: 700; color: ${L.black}; margin-bottom: 8px; }
  .lp-feature-desc { font-size: 13px; color: ${L.gray600}; line-height: 1.6; }

  /* ── Code ── */
  .lp-code-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
  @media (max-width: 900px) { .lp-code-wrap { grid-template-columns: 1fr; } }
  .lp-code-left h2 {
    font-family: ${L.serif}; font-size: clamp(32px, 3.5vw, 48px);
    font-weight: 400; line-height: 1.1; margin-bottom: 20px;
  }
  .lp-code-left p { font-size: 15px; color: ${L.gray600}; line-height: 1.7; margin-bottom: 16px; }
  .lp-code-block {
    background: ${L.black}; border-radius: 14px; overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  }
  .lp-code-bar {
    background: #161616; padding: 10px 16px;
    display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #2a2a2a;
  }
  .lp-code-filename { font-family: ${L.mono}; font-size: 11px; color: #666; flex: 1; text-align: center; }
  .lp-code-body { padding: 24px; font-family: ${L.mono}; font-size: 13px; line-height: 1.85; }
  .lp-ck { color: #c792ea; }
  .lp-cf { color: #82aaff; }
  .lp-cs { color: #c3e88d; }
  .lp-cc { color: #546e7a; }
  .lp-cn { color: #f78c6c; }
  .lp-cw { color: #e8e8f4; }
  .lp-cg { color: ${L.accent}; }

  /* ── Pricing ── */
  .lp-pricing-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  @media (max-width: 1000px) { .lp-pricing-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px)  { .lp-pricing-grid { grid-template-columns: 1fr; } }
  .lp-plan {
    border: 1px solid ${L.gray200}; border-radius: 14px; padding: 32px 28px;
    display: flex; flex-direction: column;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .lp-plan:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
  .lp-plan.featured { border-color: ${L.black}; background: ${L.black}; color: ${L.white}; }
  .lp-plan-badge {
    display: inline-block; font-family: ${L.mono}; font-size: 10px;
    text-transform: uppercase; letter-spacing: 0.08em;
    padding: 3px 8px; border-radius: 100px;
    background: ${L.accent}; color: ${L.black}; margin-bottom: 20px;
    align-self: flex-start; font-weight: 700;
  }
  .lp-plan-name { font-size: 18px; font-weight: 800; margin-bottom: 8px; }
  .lp-plan-price { font-family: ${L.serif}; font-size: 44px; line-height: 1; margin-bottom: 4px; }
  .lp-plan-period { font-size: 12px; color: ${L.gray400}; margin-bottom: 28px; }
  .lp-plan.featured .lp-plan-period { color: #777; }
  .lp-plan-divider { height: 1px; background: ${L.gray200}; margin-bottom: 24px; }
  .lp-plan.featured .lp-plan-divider { background: #2a2a2a; }
  .lp-plan-features { list-style: none; flex: 1; margin-bottom: 28px; }
  .lp-plan-features li {
    display: flex; gap: 10px; align-items: flex-start;
    font-size: 13px; line-height: 1.5; margin-bottom: 12px; color: ${L.gray600};
  }
  .lp-plan.featured .lp-plan-features li { color: #aaa; }
  .lp-plan-check { color: ${L.accent}; flex-shrink: 0; margin-top: 1px; }
  .lp-plan-cta {
    padding: 12px 0; border-radius: 8px; border: 1px solid ${L.gray200};
    background: transparent; color: ${L.black}; font-family: ${L.font};
    font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; text-align: center;
  }
  .lp-plan-cta:hover { border-color: ${L.black}; background: ${L.black}; color: ${L.white}; }
  .lp-plan.featured .lp-plan-cta { background: ${L.white}; color: ${L.black}; border-color: ${L.white}; }
  .lp-plan.featured .lp-plan-cta:hover { background: ${L.accent}; border-color: ${L.accent}; }
  .lp-pricing-note {
    text-align: center; margin-top: 24px; font-size: 13px; color: ${L.gray400};
  }
  .lp-pricing-note strong { color: ${L.gray600}; }

  /* ── Footer ── */
  .lp-footer {
    border-top: 1px solid ${L.gray200}; padding: 48px;
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 24px;
  }
  @media (max-width: 768px) { .lp-footer { padding: 32px 20px; } }
  .lp-footer-logo { font-weight: 800; font-size: 16px; color: ${L.black}; letter-spacing: -0.03em; }
  .lp-footer-links { display: flex; gap: 28px; list-style: none; }
  .lp-footer-links a { font-size: 13px; color: ${L.gray600}; text-decoration: none; transition: color 0.15s; }
  .lp-footer-links a:hover { color: ${L.black}; }
  .lp-footer-copy { font-size: 12px; color: ${L.gray400}; }

  /* ── Animations ── */
  .lp-fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .lp-fade-up.visible { opacity: 1; transform: translateY(0); }
`;

function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll('.lp-fade-up');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ onSignIn, onGetStarted }) {
  return (
    <nav className="lp-nav">
      <a className="lp-nav-logo" href="#">
        <div className="lp-nav-logo-mark">T</div>
        Tonpo
      </a>
      <ul className="lp-nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#how">How it works</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
      </ul>
      <div className="lp-nav-actions">
        <button className="lp-btn-ghost" onClick={onSignIn}>Sign in</button>
        <button className="lp-btn-primary" onClick={onGetStarted}>Start free trial</button>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ onGetStarted }) {
  return (
    <div className="lp-hero">
      <div>
        <div className="lp-hero-eyebrow">
          <div className="lp-hero-eyebrow-dot" />
          Now in public beta
        </div>
        <h1 className="lp-hero-h1">
          The MT5 API<br />
          <em>built for builders</em>
        </h1>
        <p className="lp-hero-sub">
          Tonpo is an API platform that connects MetaTrader 5 to any application.
          REST API, WebSocket streaming, Python SDK, and TradingView webhooks —
          everything you need to ship trading products, without touching a terminal.
        </p>
        <div className="lp-hero-cta">
          <button className="lp-hero-btn-primary" onClick={onGetStarted}>
            Start free trial <span>→</span>
          </button>
          <button className="lp-hero-btn-secondary">View docs</button>
        </div>
      </div>

      <div className="lp-terminal">
        <div className="lp-terminal-bar">
          <div className="lp-terminal-dot" style={{ background: '#ff5f57' }} />
          <div className="lp-terminal-dot" style={{ background: '#febc2e' }} />
          <div className="lp-terminal-dot" style={{ background: '#28c840' }} />
          <div className="lp-terminal-title">tonpo — live session</div>
        </div>
        <div className="lp-terminal-body">
          <div><span className="lp-tc"># 1. Create your account</span></div>
          <div><span className="lp-ty">POST</span> <span className="lp-tw">/api/users</span></div>
          <div><span className="lp-tc">→ </span><span className="lp-tg">api_key: "ruhC7YjQ..."</span></div>
          <div>&nbsp;</div>
          <div><span className="lp-tc"># 2. Connect your MT5</span></div>
          <div><span className="lp-ty">POST</span> <span className="lp-tw">/api/accounts</span></div>
          <div><span className="lp-tc">→ </span><span className="lp-tg">status: "active"</span></div>
          <div>&nbsp;</div>
          <div><span className="lp-tc"># 3. Place a trade</span></div>
          <div><span className="lp-ty">POST</span> <span className="lp-tw">/api/orders</span></div>
          <div><span className="lp-tw">  symbol: </span><span className="lp-tb">"EURUSD"</span></div>
          <div><span className="lp-tw">  side:   </span><span className="lp-tb">"buy"</span></div>
          <div><span className="lp-tw">  volume: </span><span className="lp-tp">0.1</span></div>
          <div><span className="lp-tc">→ </span><span className="lp-tg">ticket: 10483921</span></div>
        </div>
      </div>
    </div>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function Stats() {
  return (
    <div style={{ padding: '0 48px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="lp-stats lp-fade-up">
        {[
          { num: '3 min',  label: 'Average time to first trade' },
          { num: '< 2ms',  label: 'Order execution latency'     },
          { num: '14',     label: 'API endpoints'               },
          { num: '24 / 7', label: 'Uptime monitoring'           },
        ].map(s => (
          <div key={s.label} className="lp-stat">
            <div className="lp-stat-num">{s.num}</div>
            <div className="lp-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── About / Our Story ─────────────────────────────────────────────────────────
function About() {
  return (
    <div className="lp-section" id="about">
      <div className="lp-section-label lp-fade-up">Our story</div>
      <h2 className="lp-h2 lp-fade-up">Built out of necessity.<br />Opened to everyone.</h2>

      <div className="lp-about-wrap lp-fade-up">
        <div className="lp-about-left">
          <p>
            Tonpo started as an internal tool — not a product, not a startup idea.
            A team of developers were building a multi-exchange algorithmic trading system,
            routing strategies across crypto exchanges and traditional brokers
            from a single codebase.
          </p>
          <p>
            Every platform they connected had a clean, modern API.
            <strong> Except MetaTrader 5.</strong> MT5 had no REST interface,
            no WebSocket, no way to talk to it programmatically without deep native
            integration. The gap was real and it was blocking everything.
          </p>
          <p>
            So they built a gateway. Not to launch something — to unblock themselves.
            A layer that sat between their strategies and MT5, translating every
            operation into a clean HTTP call. Orders, positions, tick data, account
            info — all of it accessible the same way they accessed Binance.
          </p>
          <p>
            That internal tool worked. It worked well enough that others wanted it.
            <strong> That gateway became Tonpo.</strong>
          </p>
          <p>
            Today Tonpo gives every developer building on MT5 the same thing
            that team gave themselves — a clean API, a reliable connection, and
            the freedom to build without fighting the platform.
            No native terminals. No Windows dependencies. No compromises.
          </p>

          <div className="lp-about-tags">
            {['Built by developers', 'API-first', 'Proven in production', 'Made for builders'].map(t => (
              <span key={t} className="lp-about-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="lp-about-right">
          <div className="lp-about-quote">
            <div className="lp-about-quote-text">
              "Every platform had an API. MT5 didn't.
              So we built one."
            </div>
            <div className="lp-about-quote-attr">— The team behind Tonpo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <div style={{ background: L.gray50, padding: '96px 0' }} id="how">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <div className="lp-section-label lp-fade-up">How it works</div>
        <h2 className="lp-h2 lp-fade-up">From sign-up to live trading<br />in three steps</h2>
        <p className="lp-h2-sub lp-fade-up">
          No configuration files. No infrastructure to manage.
          Just an account, an API key, and your strategy.
        </p>

        <div className="lp-steps lp-fade-up">
          {[
            {
              n: '01', title: 'Create your account',
              desc: 'Sign up and get your API key instantly. No credit card, no waiting. Your 14-day trial starts the moment you connect your first MT5 account — full access from day one.',
              tag: 'POST /api/users → api_key',
            },
            {
              n: '02', title: 'Connect your MT5',
              desc: 'Enter your MT5 login, password, and broker server. Tonpo handles the connection, encrypts your credentials, and keeps the account online automatically. You never touch it again.',
              tag: 'POST /api/accounts → active',
            },
            {
              n: '03', title: 'Build and trade',
              desc: 'Call the REST API, stream real-time ticks via WebSocket, automate strategies with TradingView webhooks, or use the Python SDK. MT5 responds like any modern web API.',
              tag: 'pip install tonpo',
            },
          ].map(s => (
            <div key={s.n} className="lp-step">
              <div className="lp-step-num">{s.n}</div>
              <div className="lp-step-title">{s.title}</div>
              <div className="lp-step-desc">{s.desc}</div>
              <div className="lp-step-tag">{s.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  return (
    <div className="lp-section" id="features">
      <div className="lp-section-label lp-fade-up">Features</div>
      <h2 className="lp-h2 lp-fade-up">Everything a trading product needs</h2>
      <p className="lp-h2-sub lp-fade-up">
        A complete toolkit for developers building on MT5 —
        from single scripts to production trading systems.
      </p>

      <div className="lp-features lp-fade-up">
        {[
          { icon: '🌐', title: 'REST API',              desc: 'Full trading coverage — orders, positions, account info, symbol data, and OHLCV history. Stateless, authenticated, and documented.' },
          { icon: '📶', title: 'WebSocket streaming',   desc: 'Real-time ticks, candles, position updates, and order results. Subscribe to any symbol, any timeframe, with automatic reconnection.' },
          { icon: '🔁', title: 'TradingView webhooks',  desc: 'Turn any TradingView alert into a live trade instantly. Built-in IP whitelist, replay protection, and SHA-256 token authentication.' },
          { icon: '🐍', title: 'Python SDK',            desc: 'Typed async client — pip install tonpo and you are placing real trades in under 10 lines. Handles retries, reconnection, and auth.' },
          { icon: '🔐', title: 'Security built in',     desc: 'AES-256-GCM credential encryption, SHA-256 API keys, per-IP rate limiting — all on by default. Security is not a premium feature.' },
          { icon: '🔄', title: 'Auto-recovery',         desc: 'Heartbeat monitoring detects stale connections and restarts them automatically. Your account stays connected even when MT5 drops.' },
        ].map(f => (
          <div key={f.title} className="lp-feature">
            <div className="lp-feature-icon">{f.icon}</div>
            <div className="lp-feature-title">{f.title}</div>
            <div className="lp-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Code ──────────────────────────────────────────────────────────────────────
function CodeSection() {
  return (
    <div style={{ background: L.gray50, padding: '96px 0' }}>
      <div className="lp-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="lp-code-wrap">
          <div className="lp-code-left lp-fade-up">
            <div className="lp-section-label">Python SDK</div>
            <h2>Your strategy in<br /><em style={{ fontFamily: L.serif }}>minutes, not months</em></h2>
            <p>
              The tonpo-py SDK handles authentication, connection management,
              and WebSocket reconnection automatically.
              Write your logic, not boilerplate.
            </p>
            <p>
              Full type hints, async/await throughout, and a clean interface
              that mirrors the way you think about trading.
            </p>
            <div style={{ marginTop: 24 }}>
              <code style={{
                fontFamily: L.mono, fontSize: 13, background: L.black,
                color: L.accent, padding: '8px 14px', borderRadius: 8,
                display: 'inline-block',
              }}>pip install tonpo</code>
            </div>
          </div>

          <div className="lp-code-block lp-fade-up">
            <div className="lp-code-bar">
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              <div className="lp-code-filename">strategy.py</div>
            </div>
            <div className="lp-code-body">
              <div><span className="lp-ck">from</span> <span className="lp-cw">tonpo</span> <span className="lp-ck">import</span> <span className="lp-cw">TonpoClient, TonpoConfig</span></div>
              <div>&nbsp;</div>
              <div><span className="lp-cc"># Connect to the Tonpo API</span></div>
              <div><span className="lp-cw">config </span><span className="lp-cw">=</span> <span className="lp-cf">TonpoConfig</span><span className="lp-cw">(</span></div>
              <div><span className="lp-cw">    host</span><span className="lp-cw">=</span><span className="lp-cs">"api.tonpo.cloud"</span><span className="lp-cw">, use_ssl=</span><span className="lp-ck">True</span></div>
              <div><span className="lp-cw">)</span></div>
              <div>&nbsp;</div>
              <div><span className="lp-ck">async with</span> <span className="lp-cf">TonpoClient</span><span className="lp-cw">.</span><span className="lp-cf">for_user</span><span className="lp-cw">(config, api_key) </span><span className="lp-ck">as</span> <span className="lp-cw">c:</span></div>
              <div><span className="lp-cc">    # Live account snapshot</span></div>
              <div><span className="lp-cw">    info   </span><span className="lp-cw">=</span> <span className="lp-ck">await</span> <span className="lp-cw">c.</span><span className="lp-cf">get_account_info</span><span className="lp-cw">()</span></div>
              <div><span className="lp-cf">    print</span><span className="lp-cw">(</span><span className="lp-cs">f"Balance: </span><span className="lp-cg">{'{'}info.balance{'}'} {'{'}info.currency{'}'}</span><span className="lp-cs">"</span><span className="lp-cw">)</span></div>
              <div>&nbsp;</div>
              <div><span className="lp-cc">    # Execute a market order</span></div>
              <div><span className="lp-cw">    result </span><span className="lp-cw">=</span> <span className="lp-ck">await</span> <span className="lp-cw">c.</span><span className="lp-cf">place_market_buy</span><span className="lp-cw">(</span></div>
              <div><span className="lp-cs">        "EURUSD"</span><span className="lp-cw">, volume=</span><span className="lp-cn">0.1</span><span className="lp-cw">, sl=</span><span className="lp-cn">1.0800</span></div>
              <div><span className="lp-cw">    )</span></div>
              <div><span className="lp-cf">    print</span><span className="lp-cw">(</span><span className="lp-cs">f"Ticket: </span><span className="lp-cg">{'{'}result.ticket{'}'}</span><span className="lp-cs">"</span><span className="lp-cw">)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing({ onGetStarted }) {
  const plans = [
    {
      id: 'trial',
      name: 'Trial',
      price: 'Free',
      period: '14 days, no card needed',
      badge: null,
      features: [
        '1 MT5 account',
        'Full Pro access',
        '500 API calls / min',
        '10 TradingView webhooks',
        '1 year order history',
        'REST + WebSocket',
      ],
      cta: 'Start free trial',
      featured: false,
      note: 'Starts on first MT5 connection',
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.90',
      period: 'per month',
      badge: null,
      features: [
        '1 MT5 account',
        '100 API calls / min',
        '3 TradingView webhooks',
        '90 days order history',
        'REST + WebSocket',
        'Email support',
      ],
      cta: 'Start Basic',
      featured: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29.90',
      period: 'per month',
      badge: 'Most popular',
      features: [
        '1 MT5 account',
        '500 API calls / min',
        '10 TradingView webhooks',
        '1 year order history',
        'REST + WebSocket',
        'Email support',
      ],
      cta: 'Start Pro',
      featured: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: null,
      period: 'custom pricing',
      badge: null,
      features: [
        '1 MT5 account',
        'Custom rate limits',
        'Unlimited webhooks',
        'Full order history',
        'REST + WebSocket',
        'Priority support + SLA',
      ],
      cta: 'Contact sales',
      featured: false,
    },
  ];

  return (
    <div className="lp-section" id="pricing">
      <div className="lp-section-label lp-fade-up">Pricing</div>
      <h2 className="lp-h2 lp-fade-up">Try it free. Pay for performance.</h2>
      <p className="lp-h2-sub lp-fade-up">
        14 days of full access — no credit card, no commitment.
        After your trial, choose a plan based on the speed and limits you need.
        Every plan includes one MT5 account.
      </p>

      <div className="lp-pricing-grid lp-fade-up">
        {plans.map(plan => (
          <div key={plan.id} className={`lp-plan${plan.featured ? ' featured' : ''}`}>
            {plan.badge && <div className="lp-plan-badge">{plan.badge}</div>}
            <div className="lp-plan-name">{plan.name}</div>
            <div className="lp-plan-price">
              {plan.price === 'Free'
                ? <span style={{ fontFamily: L.serif }}>Free</span>
                : plan.price
                  ? plan.price
                  : <span style={{ fontSize: 22, fontFamily: L.font, fontWeight: 700, lineHeight: 1.2, display: 'block' }}>Contact<br />us</span>
              }
            </div>
            <div className="lp-plan-period">{plan.period}</div>
            <div className="lp-plan-divider" />
            <ul className="lp-plan-features">
              {plan.features.map(f => (
                <li key={f}><span className="lp-plan-check">✓</span><span>{f}</span></li>
              ))}
            </ul>
            <button className="lp-plan-cta" onClick={onGetStarted}>
              {plan.cta}
            </button>
            {plan.note && (
              <div style={{
                marginTop: 10, textAlign: 'center',
                fontFamily: L.mono, fontSize: 10,
                color: L.gray400, letterSpacing: '0.04em',
              }}>
                {plan.note}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="lp-pricing-note">
        <strong>All plans include 1 MT5 account.</strong> Plans differ in API rate limits,
        webhooks, and history depth — not account quantity.
      </p>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-logo">Tonpo</div>
      <ul className="lp-footer-links">
        <li><a href="#about">About</a></li>
        <li><a href="#">Docs</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#">Status</a></li>
        <li><a href="#">Privacy</a></li>
      </ul>
      <div className="lp-footer-copy">© 2026 Tonpo. All rights reserved.</div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  useFadeUp();

  useEffect(() => {
    const id = 'lp-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  const onGetStarted = () => navigate('/login', { state: { tab: 'register' } });
  const onSignIn     = () => navigate('/login');

  return (
    <div className="lp-root">
      <Nav onGetStarted={onGetStarted} onSignIn={onSignIn} />
      <Hero onGetStarted={onGetStarted} />
      <Stats />
      <About />
      <HowItWorks />
      <Features />
      <CodeSection />
      <Pricing onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}
