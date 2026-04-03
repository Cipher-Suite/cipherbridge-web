// src/components/Badge.jsx
import { T } from '../theme';

export function Badge({ children, color = T.accent, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
      borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: T.font,
      color, background: bg || color + '18', letterSpacing: '0.02em',
      textTransform: 'uppercase',
    }}>{children}</span>
  );
}
