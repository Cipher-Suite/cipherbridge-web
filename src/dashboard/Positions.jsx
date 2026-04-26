// src/dashboard/Positions.jsx
import { T } from '../theme';
import { useState } from 'react';
import { Badge, StatCard, SectionTitle, Alert, EmptyState, Btn, Spinner } from '../components';
import { usePositions } from '../hooks/useData';
import { ConfirmDialog } from '../components';

export default function Positions() {
  const { positions, loading, error, refresh, close } = usePositions();
  const [confirmClose, setConfirmClose] = useState(null);
  const [closeLoading, setCloseLoading] = useState(false);
  const totalPL = positions.reduce((s, p) => s + (p.profit || 0), 0);
  const wins    = positions.filter(p => (p.profit || 0) >= 0).length;
  
  return (
    <div>
      <SectionTitle
        sub="Open positions across all connected accounts"
        action={<Btn size="sm" variant="ghost" onClick={refresh}>↻ Refresh</Btn>}
      >Positions</SectionTitle>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatCard label="Open"       value={loading ? '—' : positions.length} color={T.blue} />
        <StatCard label="Floating P/L" value={loading ? '—' : `$${totalPL.toFixed(2)}`} color={totalPL >= 0 ? T.green : T.red} />
        <StatCard label="Winning"    value={loading ? '—' : wins} sub={positions.length > 0 ? `${Math.round(wins/positions.length*100)}%` : ''} color={T.green} />
      </div>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><Spinner size={24} /></div>
      ) : positions.length === 0 ? (
        <EmptyState icon="◈" title="No open positions" sub="Positions will appear here once you place trades." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="pos-table" style={{ overflowX: 'auto' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '100px 90px 55px 65px 110px 110px 100px 80px',
              gap: 8, padding: '7px 18px', fontFamily: T.font, fontSize: 10, color: T.textDim,
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 680,
            }}>
              {['Ticket','Symbol','Side','Volume','Entry','Current','P/L',''].map(h => <span key={h}>{h}</span>)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {positions.map((p, i) => {
                const pl = p.profit || 0;
                const side = p.side?.toLowerCase() || (p.type === 0 ? 'buy' : 'sell');
                return (
                  <div key={p.ticket || i} style={{
                    display: 'grid', gridTemplateColumns: '100px 90px 55px 65px 110px 110px 100px 80px',
                    alignItems: 'center', gap: 8, padding: '13px 18px', minWidth: 680,
                    background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
                  }}>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{p.ticket}</span>
                    <span style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.text }}>{p.symbol}</span>
                    <Badge color={side === 'buy' ? T.green : T.red}>{side}</Badge>
                    <span style={{ fontFamily: T.mono, fontSize: 12, color: T.textMuted }}>{p.volume}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 12, color: T.textMuted }}>{p.price_open || p.open_price}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text }}>{p.price_current || p.current_price}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: pl >= 0 ? T.green : T.red }}>
                      {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                    </span>
                    <Btn size="sm" variant="danger" onClick={() => setConfirmClose(p.ticket)}>
                      Close
                    </Btn>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile cards */}
          <div className="pos-cards" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
            {positions.map((p, i) => {
              const pl   = p.profit || 0;
              const side = p.side?.toLowerCase() || (p.type === 0 ? 'buy' : 'sell');
              return (
                <div key={p.ticket || i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: T.font, fontSize: 15, fontWeight: 800, color: T.text }}>{p.symbol}</span>
                      <Badge color={side === 'buy' ? T.green : T.red}>{side}</Badge>
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 15, fontWeight: 800, color: pl >= 0 ? T.green : T.red }}>
                      {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[['Vol', p.volume], ['Entry', p.price_open || p.open_price], ['Current', p.price_current || p.current_price]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontFamily: T.font, fontSize: 10, color: T.textDim, marginBottom: 2 }}>{l}</div>
                        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.text }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <Btn size="sm" variant="danger" style={{ width: '100%' }} onClick={() => setConfirmClose(p.ticket)}>
                    Close #{p.ticket}
                  </Btn>
                </div>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        @media(max-width:720px){
          .pos-table{display:none!important}
          .pos-cards{display:flex!important}
        }
      `}</style>
      
      <ConfirmDialog
        open={!!confirmClose}
        title={`Close Position #${confirmClose}?`}
        message="This will close your position at market price."
        dangerous={true}
        confirmText="Close"
        loading={closeLoading}
        onConfirm={() => {
          setCloseLoading(true);
          close(confirmClose).finally(() => {
            setCloseLoading(false);
            setConfirmClose(null);
          });
        }}
        onCancel={() => setConfirmClose(null)}
      />      
    </div>
  );
}
