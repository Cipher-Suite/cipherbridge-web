// src/landing/LandingPage.jsx
import { useState, useEffect, useRef } from 'react';
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
  accent:   '#00E5A0',   // teal — used sparingly
  accentDim:'#00C488',
  font:     "'DM Sans', system-ui, sans-serif",
  serif:    "'Instrument Serif', 'Georgia', serif",
  mono:     "'JetBrains Mono', 'Cascadia Code', monospace",
};

// ── Inject landing-page styles ─────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

  .lp-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    background: ${L.white};
    color: ${L.black};
    font-family: ${L.font};
    overflow-x: hidden;
  }

  /* Nav */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 64px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${L.gray200};
    transition: border-color 0.2s;
  }
  @media (max-width: 768px) { .lp-nav { padding: 0 20px; } }

  .lp-nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: ${L.font}; font-weight: 800; font-size: 18px;
    color: ${L.black}; text-decoration: none; letter-spacing: -0.03em;
  }
  .lp-nav-logo-mark {
    width: 30px; height: 30px; border-radius: 8px;
    background: ${L.black};
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 900; color: ${L.accent};
  }

  .lp-nav-links {
    display: flex; align-items: center; gap: 32px;
    list-style: none;
  }
  @media (max-width: 768px) { .lp-nav-links { display: none; } }
  .lp-nav-links a {
    font-family: ${L.font}; font-size: 14px; font-weight: 500;
    color: ${L.gray600}; text-decoration: none;
    transition: color 0.15s;
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

  /* Sections */
  .lp-section { padding: 96px 48px; max-width: 1200px; margin: 0 auto; }
  @media (max-width: 768px) { .lp-section { padding: 64px 20px; } }

  /* Hero */
  .lp-hero {
    padding: 160px 48px 96px;
    max-width: 1200px; margin: 0 auto;
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
    width: 6px; height: 6px; border-radius: 50%;
    background: ${L.accent}; animation: lp-pulse 2s ease-in-out infinite;
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

  /* Terminal diagram */
  .lp-terminal {
    background: ${L.black}; border-radius: 14px;
    overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.2);
    font-family: ${L.mono}; font-size: 13px;
  }
  .lp-terminal-bar {
    background: #1a1a1a; padding: 12px 16px;
    display: flex; align-items: center; gap: 8px;
    border-bottom: 1px solid #2a2a2a;
  }
  .lp-terminal-dot { width: 10px; height: 10px; border-radius: 50%; }
  .lp-terminal-title {
    flex: 1; text-align: center; font-family: ${L.mono};
    font-size: 11px; color: #555; letter-spacing: 0.05em;
  }
  .lp-terminal-body { padding: 28px 24px; line-height: 1.9; }
  .lp-tc  { color: #555; }   /* comment */
  .lp-tg  { color: ${L.accent}; font-weight: 600; }  /* green */
  .lp-tw  { color: #e8e8f4; }  /* white */
  .lp-tb  { color: #4d8fff; }  /* blue */
  .lp-ty  { color: #ffd644; }  /* yellow */

  /* Stats row */
  .lp-stats {
    display: flex; gap: 0; border: 1px solid ${L.gray200};
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
  .lp-stat-num {
    font-family: ${L.serif}; font-size: 40px;
    color: ${L.black}; margin-bottom: 4px;
  }
  .lp-stat-label { font-size: 13px; color: ${L.gray600}; font-weight: 500; }

  /* Problem / Solution */
  .lp-compare {
    display: grid; grid-template-columns: 1fr 1fr; gap: 3px;
    border-radius: 16px; overflow: hidden; border: 1px solid ${L.gray200};
  }
  @media (max-width: 768px) { .lp-compare { grid-template-columns: 1fr; } }
  .lp-compare-col { padding: 40px; }
  .lp-compare-col.bad  { background: ${L.gray50}; }
  .lp-compare-col.good { background: ${L.black}; color: ${L.white}; }
  .lp-compare-header {
    font-family: ${L.mono}; font-size: 11px; letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 28px;
    display: flex; align-items: center; gap: 8px;
  }
  .lp-compare-item {
    display: flex; gap: 14px; align-items: flex-start;
    margin-bottom: 20px; font-size: 14px; line-height: 1.5;
  }
  .lp-compare-item-icon { font-size: 16px; margin-top: 1px; flex-shrink: 0; }

  /* How it works */
  .lp-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
  @media (max-width: 768px) { .lp-steps { grid-template-columns: 1fr; } }
  .lp-step {
    padding: 40px 32px; background: ${L.gray50};
    border-radius: 2px; position: relative;
  }
  .lp-step-num {
    font-family: ${L.serif}; font-size: 72px; line-height: 1;
    color: ${L.gray200}; margin-bottom: 20px;
    position: absolute; top: 24px; right: 28px;
  }
  .lp-step-title {
    font-family: ${L.font}; font-size: 18px; font-weight: 700;
    color: ${L.black}; margin-bottom: 12px; line-height: 1.2;
  }
  .lp-step-desc { font-size: 14px; color: ${L.gray600}; line-height: 1.6; }
  .lp-step-tag {
    display: inline-block; margin-top: 20px;
    font-family: ${L.mono}; font-size: 11px;
    color: ${L.accent}; background: rgba(0,229,160,0.08);
    padding: 4px 10px; border-radius: 100px;
    border: 1px solid rgba(0,229,160,0.2);
  }

  /* Features */
  .lp-features { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; }
  @media (max-width: 900px) { .lp-features { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px) { .lp-features { grid-template-columns: 1fr; } }
  .lp-feature {
    padding: 36px 32px; border: 1px solid ${L.gray200};
    transition: border-color 0.15s, background 0.15s;
  }
  .lp-feature:hover { border-color: ${L.black}; background: ${L.gray50}; }
  .lp-feature-icon {
    width: 44px; height: 44px; border-radius: 10px;
    background: ${L.black}; display: flex; align-items: center;
    justify-content: center; font-size: 20px; margin-bottom: 20px;
  }
  .lp-feature-title {
    font-size: 15px; font-weight: 700; color: ${L.black};
    margin-bottom: 8px;
  }
  .lp-feature-desc { font-size: 13px; color: ${L.gray600}; line-height: 1.6; }

  /* Code block */
  .lp-code-wrap {
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px;
    align-items: center;
  }
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
    display: flex; align-items: center; gap: 8px;
    border-bottom: 1px solid #2a2a2a;
  }
  .lp-code-filename {
    font-family: ${L.mono}; font-size: 11px; color: #666;
    flex: 1; text-align: center;
  }
  .lp-code-body { padding: 24px; font-family: ${L.mono}; font-size: 13px; line-height: 1.85; }
  .lp-ck { color: #c792ea; }   /* keyword */
  .lp-cf { color: #82aaff; }   /* function */
  .lp-cs { color: #c3e88d; }   /* string */
  .lp-cc { color: #546e7a; }   /* comment */
  .lp-cn { color: #f78c6c; }   /* number */
  .lp-cw { color: #e8e8f4; }   /* default */
  .lp-cg { color: ${L.accent}; } /* accent */

  /* Pricing */
  .lp-pricing-grid {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 16px;
  }
  @media (max-width: 1000px) { .lp-pricing-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px)  { .lp-pricing-grid { grid-template-columns: 1fr; } }

  .lp-plan {
    border: 1px solid ${L.gray200}; border-radius: 14px;
    padding: 32px 28px; display: flex; flex-direction: column;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .lp-plan:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
  .lp-plan.featured {
    border-color: ${L.black}; background: ${L.black}; color: ${L.white};
  }
  .lp-plan-badge {
    display: inline-block; font-family: ${L.mono}; font-size: 10px;
    text-transform: uppercase; letter-spacing: 0.08em;
    padding: 3px 8px; border-radius: 100px;
    background: ${L.accent}; color: ${L.black};
    margin-bottom: 20px; align-self: flex-start; font-weight: 700;
  }
  .lp-plan-name {
    font-family: ${L.font}; font-size: 18px; font-weight: 800;
    margin-bottom: 8px;
  }
  .lp-plan-price {
    font-family: ${L.serif}; font-size: 44px; line-height: 1;
    margin-bottom: 4px;
  }
  .lp-plan-period { font-size: 12px; color: ${L.gray400}; margin-bottom: 28px; }
  .lp-plan.featured .lp-plan-period { color: #777; }
  .lp-plan-divider {
    height: 1px; background: ${L.gray200}; margin-bottom: 24px;
  }
  .lp-plan.featured .lp-plan-divider { background: #2a2a2a; }
  .lp-plan-features { list-style: none; flex: 1; margin-bottom: 28px; }
  .lp-plan-features li {
    display: flex; gap: 10px; align-items: flex-start;
    font-size: 13px; line-height: 1.5; margin-bottom: 12px;
    color: ${L.gray600};
  }
  .lp-plan.featured .lp-plan-features li { color: #aaa; }
  .lp-plan-check { color: ${L.accent}; flex-shrink: 0; margin-top: 1px; }
  .lp-plan-cta {
    padding: 12px 0; border-radius: 8px; border: 1px solid ${L.gray200};
    background: transparent; color: ${L.black}; font-family: ${L.font};
    font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s;
    text-align: center;
  }
  .lp-plan-cta:hover { border-color: ${L.black}; background: ${L.black}; color: ${L.white}; }
  .lp-plan.featured .lp-plan-cta {
    background: ${L.white}; color: ${L.black}; border-color: ${L.white};
  }
  .lp-plan.featured .lp-plan-cta:hover { background: ${L.accent}; border-color: ${L.accent}; }

  /* Section headings */
  .lp-section-label {
    font-family: ${L.mono}; font-size: 11px; color: ${L.gray400};
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;
  }
  .lp-h2 {
    font-family: ${L.serif}; font-size: clamp(32px, 4vw, 52px);
    font-weight: 400; line-height: 1.1; color: ${L.black};
    margin-bottom: 16px;
  }
  .lp-h2-sub {
    font-size: 16px; color: ${L.gray600}; line-height: 1.6;
    max-width: 560px; margin-bottom: 56px;
  }

  /* Footer */
  .lp-footer {
    border-top: 1px solid ${L.gray200};
    padding: 48px; display: flex;
    justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 24px;
  }
  @media (max-width: 768px) { .lp-footer { padding: 32px 20px; } }
  .lp-footer-logo {
    font-family: ${L.font}; font-weight: 800; font-size: 16px;
    color: ${L.black}; letter-spacing: -0.03em;
  }
  .lp-footer-links {
    display: flex; gap: 28px; list-style: none;
  }
  .lp-footer-links a {
    font-size: 13px; color: ${L.gray600}; text-decoration: none; transition: color 0.15s;
  }
  .lp-footer-links a:hover { color: ${L.black}; }
  .lp-footer-copy { font-size: 12px; color: ${L.gray400}; }

  /* Animations */
  .lp-fade-up {
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .lp-fade-up.visible { opacity: 1; transform: translateY(0); }
`;

// ── Intersection Observer hook ────────────────────────────────────────────────
function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll('.lp-fade-up');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Components ────────────────────────────────────────────────────────────────

function Nav({ onGetStarted, onSignIn }) {
  return (
    <nav className="lp-nav">
      <a className="lp-nav-logo" href="#">
        <div className="lp-nav-logo-mark">T</div>
        Tonpo
      </a>
      <ul className="lp-nav-links">
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="https://github.com/TonpoLabs" target="_blank" rel="noreferrer">GitHub</a></li>
      </ul>
      <div className="lp-nav-actions">
        <button className="lp-btn-ghost" onClick={onSignIn}>Sign in</button>
        <button className="lp-btn-primary" onClick={onGetStarted}>Get started</button>
      </div>
    </nav>
  );
}

function Hero({ onGetStarted }) {
  return (
    <div className="lp-hero">
      <div>
        <div className="lp-hero-eyebrow">
          <div className="lp-hero-eyebrow-dot" />
          Now in public beta
        </div>
        <h1 className="lp-hero-h1">
          Your MT5 infrastructure.<br />
          <em>No middlemen.</em>
        </h1>
        <p className="lp-hero-sub">
          Connect MetaTrader 5 to any application via REST and WebSocket.
          Your server, your credentials, your data — encrypted and never shared.
        </p>
        <div className="lp-hero-cta">
          <button className="lp-hero-btn-primary" onClick={onGetStarted}>
            Start for free
            <span>→</span>
          </button>
          <button className="lp-hero-btn-secondary">
            View docs
          </button>
        </div>
      </div>

      <div className="lp-terminal">
        <div className="lp-terminal-bar">
          <div className="lp-terminal-dot" style={{ background: '#ff5f57' }} />
          <div className="lp-terminal-dot" style={{ background: '#febc2e' }} />
          <div className="lp-terminal-dot" style={{ background: '#28c840' }} />
          <div className="lp-terminal-title">tonpo — architecture</div>
        </div>
        <div className="lp-terminal-body">
          <div><span className="lp-tc">┌─</span> <span className="lp-ty">Your App</span> <span className="lp-tc">(Python / Node / any)</span></div>
          <div><span className="lp-tc">│</span></div>
          <div><span className="lp-tc">│</span>  <span className="lp-tc">HTTPS / WSS</span></div>
          <div><span className="lp-tc">│</span></div>
          <div><span className="lp-tc">├─</span> <span className="lp-tg">Tonpo Gateway</span> <span className="lp-tc">(Rust)</span></div>
          <div><span className="lp-tc">│</span>  <span className="lp-tc">AES-256-GCM credentials</span></div>
          <div><span className="lp-tc">│</span>  <span className="lp-tc">REST + WebSocket API</span></div>
          <div><span className="lp-tc">│</span></div>
          <div><span className="lp-tc">│</span>  <span className="lp-tc">WSS outbound only</span></div>
          <div><span className="lp-tc">│</span></div>
          <div><span className="lp-tc">├─</span> <span className="lp-tb">Tonpo Bridge</span> <span className="lp-tc">(C++ DLL)</span></div>
          <div><span className="lp-tc">│</span>  <span className="lp-tc">inside MT5 terminal</span></div>
          <div><span className="lp-tc">│</span></div>
          <div><span className="lp-tc">└─</span> <span className="lp-tw">MT5 Terminal</span> <span className="lp-tc">→ Broker</span></div>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <div style={{ padding: '0 48px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="lp-stats lp-fade-up">
        {[
          { num: '< 2ms',  label: 'Tick delivery latency' },
          { num: '0',      label: 'Third-party APIs' },
          { num: '256-bit',label: 'AES-GCM encryption' },
          { num: '∞',      label: 'Connections per gateway' },
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

function Problem() {
  return (
    <div className="lp-section">
      <div className="lp-section-label lp-fade-up">The problem</div>
      <h2 className="lp-h2 lp-fade-up">Why not just use MetaAPI?</h2>
      <p className="lp-h2-sub lp-fade-up">
        Every third-party MT5 API introduces cost, latency, and a dependency
        you can't control. Tonpo removes all three.
      </p>

      <div className="lp-compare lp-fade-up">
        <div className="lp-compare-col bad">
          <div className="lp-compare-header" style={{ color: L.gray400 }}>
            <span>✗</span> Third-party APIs
          </div>
          {[
            ['💸', '$30–$100/mo per account, billed by provider'],
            ['🔒', 'Your MT5 credentials leave your server'],
            ['📡', 'Trade goes: you → their cloud → MT5 → broker'],
            ['🛑', 'Their downtime is your downtime'],
            ['📊', 'Rate limits you don\'t control'],
          ].map(([icon, text]) => (
            <div key={text} className="lp-compare-item" style={{ color: L.gray600 }}>
              <span className="lp-compare-item-icon">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="lp-compare-col good">
          <div className="lp-compare-header" style={{ color: L.accent }}>
            <span>✓</span> Tonpo
          </div>
          {[
            ['⚡', 'Flat monthly plan — unlimited accounts on your hardware'],
            ['🔐', 'Credentials encrypted with AES-256-GCM, stored on your server'],
            ['📡', 'Trade goes: you → your gateway → MT5 → broker'],
            ['🟢', 'You own the uptime — deploy anywhere'],
            ['🚀', 'Your server, your limits — scale as you need'],
          ].map(([icon, text]) => (
            <div key={text} className="lp-compare-item" style={{ color: '#bbb' }}>
              <span className="lp-compare-item-icon">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div className="lp-section" id="how-it-works" style={{ background: L.gray50, maxWidth: '100%', padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <div className="lp-section-label lp-fade-up">How it works</div>
        <h2 className="lp-h2 lp-fade-up">Three steps to live trading</h2>
        <p className="lp-h2-sub lp-fade-up">
          No complex setup. No reading docs for hours. Deploy once and trade from anywhere.
        </p>

        <div className="lp-steps lp-fade-up">
          {[
            {
              n: '01',
              title: 'Deploy the gateway',
              desc: 'Run a single binary on any Linux VPS. PostgreSQL, Nginx, and a domain are all you need. Migrations run automatically.',
              tag: 'cargo build --release',
            },
            {
              n: '02',
              title: 'Connect your MT5 accounts',
              desc: 'Enter your MT5 login, password, and broker server. The gateway encrypts them with AES-256-GCM and provisions the connection — you never handle credentials again.',
              tag: 'POST /api/accounts',
            },
            {
              n: '03',
              title: 'Trade from anywhere',
              desc: 'Use the Python SDK, call the REST API directly, or connect via WebSocket for real-time ticks. TradingView webhooks are built in.',
              tag: 'from tonpo import TonpoClient',
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

function Features() {
  return (
    <div className="lp-section" id="features">
      <div className="lp-section-label lp-fade-up">Features</div>
      <h2 className="lp-h2 lp-fade-up">Everything a trading system needs</h2>
      <p className="lp-h2-sub lp-fade-up">
        Built specifically for algorithmic traders and developers who need reliable, low-latency MT5 access.
      </p>

      <div className="lp-features lp-fade-up">
        {[
          { icon: '⚡', title: 'REST + WebSocket API',      desc: 'Full trading API — orders, positions, history, account info. WebSocket streaming for real-time ticks and candles.' },
          { icon: '🔐', title: 'AES-256-GCM Encryption',   desc: 'MT5 credentials encrypted at rest. Plaintext never stored anywhere — shown once at account creation.' },
          { icon: '📡', title: 'TradingView Webhooks',      desc: 'Native alert-to-trade execution. IP whitelist, SHA-256 token hashing, and 5-minute replay protection built in.' },
          { icon: '🐍', title: 'Python SDK',                desc: 'tonpo-py gives you a clean async API. pip install tonpo and you are placing trades in 10 lines of code.' },
          { icon: '🖥️', title: 'Windows + Docker',         desc: 'Provision MT5 on a Windows VPS via the Node Agent or run Wine+MT5 containers on Linux. Both fully automated.' },
          { icon: '🔄', title: 'Auto-recovery',             desc: 'Heartbeat monitoring detects stale connections and restarts them automatically. Your accounts stay connected.' },
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

function CodeSection() {
  return (
    <div style={{ background: L.gray50, padding: '96px 0' }}>
      <div className="lp-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="lp-code-wrap">
          <div className="lp-code-left lp-fade-up">
            <div className="lp-section-label">SDK</div>
            <h2>
              Trade in<br /><em style={{ fontFamily: L.serif }}>10 lines</em> of Python
            </h2>
            <p>
              The tonpo-py SDK handles authentication, retries, and WebSocket
              reconnection. You focus on your strategy.
            </p>
            <p>
              Available on PyPI — works with any Python 3.10+ project.
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
              <div className="lp-terminal-dot" style={{ background: '#ff5f57', width: 10, height: 10, borderRadius: '50%' }} />
              <div className="lp-terminal-dot" style={{ background: '#febc2e', width: 10, height: 10, borderRadius: '50%' }} />
              <div className="lp-terminal-dot" style={{ background: '#28c840', width: 10, height: 10, borderRadius: '50%' }} />
              <div className="lp-code-filename">strategy.py</div>
            </div>
            <div className="lp-code-body">
              <div><span className="lp-ck">from</span> <span className="lp-cw">tonpo</span> <span className="lp-ck">import</span> <span className="lp-cw">TonpoClient, TonpoConfig</span></div>
              <div>&nbsp;</div>
              <div><span className="lp-cc"># Connect to your gateway</span></div>
              <div><span className="lp-cw">config</span> <span className="lp-cw">=</span> <span className="lp-cf">TonpoConfig</span><span className="lp-cw">(</span></div>
              <div><span className="lp-cw">    host</span><span className="lp-cw">=</span><span className="lp-cs">"gateway.yourdomain.com"</span><span className="lp-cw">,</span></div>
              <div><span className="lp-cw">    use_ssl</span><span className="lp-cw">=</span><span className="lp-ck">True</span><span className="lp-cw">,</span></div>
              <div><span className="lp-cw">)</span></div>
              <div>&nbsp;</div>
              <div><span className="lp-ck">async with</span> <span className="lp-cf">TonpoClient</span><span className="lp-cw">.</span><span className="lp-cf">for_user</span><span className="lp-cw">(config, api_key) </span><span className="lp-ck">as</span> <span className="lp-cw">c:</span></div>
              <div><span className="lp-cc">    # Live account info</span></div>
              <div><span className="lp-cw">    info</span> <span className="lp-cw">=</span> <span className="lp-ck">await</span> <span className="lp-cw">c.</span><span className="lp-cf">get_account_info</span><span className="lp-cw">()</span></div>
              <div><span className="lp-cf">    print</span><span className="lp-cw">(</span><span className="lp-cs">f"Balance: </span><span className="lp-cg">{'{'}info.balance{'}'}</span><span className="lp-cs"> {'{'}info.currency{'}'}"</span><span className="lp-cw">)</span></div>
              <div>&nbsp;</div>
              <div><span className="lp-cc">    # Place a trade</span></div>
              <div><span className="lp-cw">    result</span> <span className="lp-cw">=</span> <span className="lp-ck">await</span> <span className="lp-cw">c.</span><span className="lp-cf">place_market_buy</span><span className="lp-cw">(</span></div>
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

function Pricing({ onGetStarted }) {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['1 MT5 account', '1 TradingView webhook', '60 req/min', 'REST + WebSocket API', 'Community support'],
      cta: 'Get started',
      featured: false,
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.90',
      period: 'per month',
      features: ['2 MT5 accounts', '3 TradingView webhooks', '150 req/min', 'REST + WebSocket API', 'Email support'],
      cta: 'Start Basic',
      featured: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29.90',
      period: 'per month',
      features: ['5 MT5 accounts', '10 TradingView webhooks', '300 req/min', 'REST + WebSocket API', 'Email support'],
      cta: 'Start Pro',
      featured: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Contact us',
      period: 'custom pricing',
      features: ['20 MT5 accounts', 'Unlimited webhooks', '1000 req/min', 'REST + WebSocket API', 'Priority support'],
      cta: 'Contact sales',
      featured: false,
    },
  ];

  return (
    <div className="lp-section" id="pricing">
      <div className="lp-section-label lp-fade-up">Pricing</div>
      <h2 className="lp-h2 lp-fade-up">Simple, flat pricing</h2>
      <p className="lp-h2-sub lp-fade-up">
        No per-account fees. No usage-based billing surprises. One plan, unlimited use within your limits.
      </p>

      <div className="lp-pricing-grid lp-fade-up">
        {plans.map(plan => (
          <div key={plan.id} className={`lp-plan${plan.featured ? ' featured' : ''}`}>
            {plan.featured && <div className="lp-plan-badge">Most popular</div>}
            <div className="lp-plan-name">{plan.name}</div>
            <div className="lp-plan-price">{plan.price === 'Contact us' ? <span style={{ fontSize: 28, fontFamily: L.font, fontWeight: 700 }}>Contact us</span> : plan.price}</div>
            <div className="lp-plan-period">{plan.period}</div>
            <div className="lp-plan-divider" />
            <ul className="lp-plan-features">
              {plan.features.map(f => (
                <li key={f}>
                  <span className="lp-plan-check">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className="lp-plan-cta" onClick={onGetStarted}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-logo">Tonpo</div>
      <ul className="lp-footer-links">
        <li><a href="#">Docs</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="https://github.com/TonpoLabs" target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href="#">Privacy</a></li>
      </ul>
      <div className="lp-footer-copy">© 2026 Tonpo. All rights reserved.</div>
    </footer>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  useFadeUp();

  // Inject styles once
  useEffect(() => {
    const id = 'lp-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
    return () => {}; // keep styles even if component unmounts
  }, []);

  const onGetStarted = () => navigate('/login', { state: { tab: 'register' } });
  const onSignIn     = () => navigate('/login');

  return (
    <div className="lp-root">
      <Nav onGetStarted={onGetStarted} onSignIn={onSignIn} />
      <Hero onGetStarted={onGetStarted} />
      <Stats />
      <Problem />
      <HowItWorks />
      <Features />
      <CodeSection />
      <Pricing onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}
