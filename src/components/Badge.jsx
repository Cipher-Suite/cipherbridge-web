// src/components/Badge.jsx
import { T } from '../theme';
export function Badge({ children, color = T.accent, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 9px',
      borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: T.font,
      color, background: bg || color + '18', letterSpacing: '0.03em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// Status dot badge
export function StatusDot({ status }) {
  const colors = {
    active: T.green, paused: T.orange, created: T.blue,
    reconnecting: T.yellow, disconnected: T.textDim,
    login_failed: T.red, deleted: T.red,
  };
  const color = colors[status] || T.textDim;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0,
        boxShadow: status === 'active' ? `0 0 6px ${color}` : 'none',
        animation: status === 'active' ? 'none' : undefined,
      }} />
      <Badge color={color}>{status?.replace('_', ' ') || 'unknown'}</Badge>
    </span>
  );
}
