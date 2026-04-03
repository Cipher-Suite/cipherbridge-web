// src/dashboard/Positions.jsx
import { T } from '../theme';
import { Badge, StatCard, SectionTitle } from '../components';
import { usePositions } from '../hooks/useData';

export default function Positions() {
  const { positions, loading, error, refresh, close } = usePositions();

  const totalPL = positions.reduce((sum, p) => sum + (p.profit || 0), 0);

  return (
    <div>
      <SectionTitle sub="All open positions across your accounts">Positions</SectionTitle>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Open" value={loading ? '...' : positions.length} color={T.blue} />
        <StatCard label="Floating P/L" value={loading ? '...' : `$${totalPL.toFixed(2)}`} color={totalPL >= 0 ? T.green : T.red} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={refresh} style={{
          fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.textMuted,
          background: 'transparent', border: `1px solid ${T.border}`, padding: '8px 16px',
          borderRadius: T.radiusSm, cursor: 'pointer',
        }}>↻ Refresh</button>
      </div>

      {error && <div style={{ padding: '12px', borderRadius: T.radiusSm, background: T.redBg, border: `1px solid ${T.red}33`, fontFamily: T.font, fontSize: 13, color: T.red, marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ fontFamily: T.font, fontSize: 14, color: T.textDim, padding: 40, textAlign: 'center' }}>Loading positions...</div>
      ) : positions.length === 0 ? (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 48, textAlign: 'center' }}>
          <p style={{ fontFamily: T.font, fontSize: 15, color: T.textMuted }}>No open positions.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '90px 80px 55px 55px 90px 90px 90px 70px',
            gap: 8, padding: '8px 18px', fontFamily: T.font, fontSize: 11, color: T.textDim,
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span>Ticket</span><span>Symbol</span><span>Side</span><span>Vol</span>
            <span>Entry</span><span>Current</span><span>P/L</span><span></span>
          </div>
          {positions.map((p, i) => (
            <div key={p.ticket || i} style={{
              display: 'grid', gridTemplateColumns: '90px 80px 55px 55px 90px 90px 90px 70px',
              alignItems: 'center', gap: 8, padding: '14px 18px',
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
              fontFamily: T.mono, fontSize: 12,
            }}>
              <span style={{ color: T.textDim }}>{p.ticket}</span>
              <span style={{ color: T.text, fontWeight: 600, fontFamily: T.font }}>{p.symbol}</span>
              <Badge color={p.type === 0 ? T.green : T.red}>{p.type === 0 ? 'Buy' : 'Sell'}</Badge>
              <span style={{ color: T.textMuted }}>{p.volume}</span>
              <span style={{ color: T.textMuted }}>{p.price_open}</span>
              <span style={{ color: T.text }}>{p.price_current}</span>
              <span style={{ color: (p.profit || 0) >= 0 ? T.green : T.red, fontWeight: 600 }}>
                {(p.profit || 0) >= 0 ? '+' : ''}${(p.profit || 0).toFixed(2)}
              </span>
              <button onClick={() => close(p.ticket)} style={{
                background: T.redBg, border: `1px solid ${T.red}33`, color: T.red,
                borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontFamily: T.font,
                fontSize: 11, fontWeight: 700,
              }}>Close</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
