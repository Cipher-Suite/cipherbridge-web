// src/components/Shared.jsx
import { T } from '../theme';

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, color }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: `2px solid ${color || T.border}`,
      borderTopColor: color || T.accent,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, loading, style: extraStyle, type = 'button' }) {
  const sizes  = { sm: '7px 14px', md: '10px 20px', lg: '13px 28px' };
  const fSizes = { sm: 12, md: 13, lg: 15 };
  const variants = {
    primary: { background: T.accent,       color: T.bg,       border: 'none' },
    ghost:   { background: 'transparent',  color: T.textMuted, border: `1px solid ${T.border}` },
    danger:  { background: T.redBg,        color: T.red,      border: `1px solid ${T.red}33` },
    success: { background: T.greenBg,      color: T.green,    border: `1px solid ${T.green}33` },
    warning: { background: T.orangeBg,     color: T.orange,   border: `1px solid ${T.orange}33` },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: sizes[size], borderRadius: T.radiusSm,
        fontFamily: T.font, fontSize: fSizes[size], fontWeight: 700,
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || loading) ? 0.55 : 1,
        transition: T.transition, whiteSpace: 'nowrap',
        ...v, ...extraStyle,
      }}
    >
      {loading && <Spinner size={12} />}
      {children}
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 460 }) {
  if (!open) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, background: 'rgba(7,7,15,0.8)', backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div style={{
        width: '100%', maxWidth, background: T.bgCard,
        border: `1px solid ${T.border}`, borderRadius: T.radiusLg,
        padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        animation: 'fadeUp 0.2s ease',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontFamily: T.font, fontSize: 17, fontWeight: 800, color: T.text }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.textDim, cursor: 'pointer', fontSize: 18, padding: 4, borderRadius: 6 }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon = '◻', title, sub, action }) {
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: '56px 32px', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.3 }}>{icon}</div>
      <p style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.textMuted, marginBottom: sub ? 8 : 0 }}>{title}</p>
      {sub && <p style={{ fontFamily: T.font, fontSize: 13, color: T.textDim, marginBottom: action ? 20 : 0 }}>{sub}</p>}
      {action}
    </div>
  );
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ children, variant = 'error' }) {
  const colors = { error: T.red, success: T.green, warning: T.orange, info: T.blue };
  const c = colors[variant] || T.red;
  return (
    <div style={{ padding: '12px 16px', borderRadius: T.radiusSm, background: c + '14', border: `1px solid ${c}33`, fontFamily: T.font, fontSize: 13, color: c, marginBottom: 16 }}>
      {children}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, placeholder, type = 'text', readOnly, mono, hint, error: err }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>}
      <input
        type={type} value={value} onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder} readOnly={readOnly}
        style={{
          width: '100%', padding: '11px 14px', background: T.bgInput,
          border: `1px solid ${err ? T.red + '66' : T.border}`,
          borderRadius: T.radiusSm, color: readOnly ? T.textMuted : T.text,
          fontFamily: mono ? T.mono : T.font, fontSize: 13, outline: 'none',
          transition: T.transition,
        }}
      />
      {hint && <p style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, marginTop: 5 }}>{hint}</p>}
      {err  && <p style={{ fontFamily: T.font, fontSize: 11, color: T.red,     marginTop: 5 }}>{err}</p>}
    </div>
  );
}
