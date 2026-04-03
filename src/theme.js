// src/theme.js — shared design tokens
export const T = {
  // Backgrounds
  bg:          '#08080d',
  // bg: '#ffffff',
  bgSurface:   '#0f0f18',
  bgCard:      '#14142a',
  bgCardHover: '#1a1a36',
  bgInput:     '#0c0c16',

  // Borders
  border:      '#1e1e3a',
  borderFocus: '#2e2e5a',

  // Brand
  accent:      '#00e5a0',
  accentDim:   '#00c488',
  accentBg:    'rgba(0,229,160,0.08)',

  // Semantic
  red:    '#ff4466',  redBg:    'rgba(255,68,102,0.1)',
  green:  '#00e5a0',  greenBg:  'rgba(0,229,160,0.1)',
  blue:   '#4488ff',  blueBg:   'rgba(68,136,255,0.1)',
  orange: '#ff8844',  orangeBg: 'rgba(255,136,68,0.1)',
  purple: '#8855ff',  purpleBg: 'rgba(136,85,255,0.1)',
  yellow: '#ffd644',

  // Text
  text:     '#e4e4f0',
 //  text: '#000000',
  textMuted:'#8888a8',
  textDim:  '#555570',

  // Fonts
  font: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",

  // Radii
  radius:   12,
  radiusSm: 8,
  radiusLg: 16,
};

// Gateway base URL — change for production
export const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'https://gateway.cipherbridge.cloud';
