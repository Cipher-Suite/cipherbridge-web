// src/components/SectionTitle.jsx
import { T } from '../theme';
export function SectionTitle({ children, sub, action }) {
  return (
    <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div>
        <h2 style={{ fontFamily: T.font, fontSize: 21, fontWeight: 800, color: T.text, letterSpacing: '-0.025em', marginBottom: sub ? 5 : 0 }}>
          {children}
        </h2>
        {sub && <p style={{ fontFamily: T.font, fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>{sub}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}
