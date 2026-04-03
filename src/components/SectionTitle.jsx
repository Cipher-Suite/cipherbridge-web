// src/components/SectionTitle.jsx
import { T } from '../theme';

export function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', marginBottom: sub ? 6 : 0 }}>
        {children}
      </h2>
      {sub && <p style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted }}>{sub}</p>}
    </div>
  );
}