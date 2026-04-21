// src/components/StatCard.jsx
import { T } from '../theme';
export function StatCard({ label, value, sub, color = T.accent, icon }) {
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg,
      padding: '22px 24px', flex: '1 1 180px', minWidth: 160,
      transition: T.transition,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontFamily: T.font, fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
        {icon && <span style={{ color: T.textDim, fontSize: 16 }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: T.font, fontSize: 26, fontWeight: 800, color, letterSpacing: '-0.03em', marginBottom: 4, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: T.font, fontSize: 12, color: T.textDim, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
