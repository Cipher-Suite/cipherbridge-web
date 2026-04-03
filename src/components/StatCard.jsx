// src/components/StatCard.jsx
import { T } from '../theme';

export function StatCard({ label, value, sub, color = T.accent, icon }) {
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg,
      padding: '24px 22px', flex: '1 1 200px', minWidth: 180,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <span style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        {icon && <span style={{ color: T.textDim }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: T.font, fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.03em', marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontFamily: T.font, fontSize: 12, color: T.textDim }}>{sub}</div>}
    </div>
  );
}
