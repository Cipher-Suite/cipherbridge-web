// src/theme.js — Tonpo design tokens
export const T = {
  // Backgrounds
  bg:          '#07070f',
  bgSurface:   '#0d0d1a',
  bgCard:      '#111124',
  bgCardHover: '#16162e',
  bgInput:     '#0a0a18',
  bgOverlay:   'rgba(7,7,15,0.85)',

  // Borders
  border:      '#1c1c38',
  borderFocus: '#2a2a52',

  // Brand
  accent:      '#00e5a0',
  accentDim:   '#00c488',
  accentBg:    'rgba(0,229,160,0.07)',
  accentGlow:  'rgba(0,229,160,0.15)',

  // Semantic
  red:    '#ff4466',  redBg:    'rgba(255,68,102,0.09)',
  green:  '#00e5a0',  greenBg:  'rgba(0,229,160,0.09)',
  blue:   '#4d8fff',  blueBg:   'rgba(77,143,255,0.09)',
  orange: '#ff8844',  orangeBg: 'rgba(255,136,68,0.09)',
  purple: '#7c5cfc',  purpleBg: 'rgba(124,92,252,0.09)',
  yellow: '#ffd644',  yellowBg: 'rgba(255,214,68,0.09)',

  // Text
  text:      '#e8e8f4',
  textMuted: '#8484a8',
  textDim:   '#44445a',

  // Fonts
  font: "'DM Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",

  // Radii
  radius:   12,
  radiusSm: 8,
  radiusLg: 16,
  radiusXl: 20,

  // Shadows
  shadow:   '0 4px 24px rgba(0,0,0,0.4)',
  shadowLg: '0 8px 40px rgba(0,0,0,0.6)',
  shadowAccent: '0 0 24px rgba(0,229,160,0.12)',

  // Transitions
  transition: 'all 0.15s ease',
  transitionSlow: 'all 0.25s ease',

  // Layout
  sidebarWidth: 240,
  topBarHeight: 56,
};

export const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'https://gateway.cipherbridge.cloud';

// CSS globals injected once in main.jsx
export const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; -webkit-font-smoothing: antialiased; }
  body { background: ${T.bg}; color: ${T.text}; font-family: ${T.font}; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: ${T.borderFocus}; }
  ::selection { background: ${T.accentBg}; color: ${T.accent}; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideIn { from { transform:translateX(-100%); } to { transform:translateX(0); } }
`;
