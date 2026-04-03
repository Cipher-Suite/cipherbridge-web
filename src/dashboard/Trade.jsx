// src/dashboard/Trade.jsx
import { useState } from 'react';
import { T } from '../theme';
import { SectionTitle } from '../components';
import { placeOrder, getSymbolInfo } from '../api/endpoints';

export default function Trade() {
  const [side, setSide] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [symbol, setSymbol] = useState('EURUSD');
  const [volume, setVolume] = useState('0.10');
  const [price, setPrice] = useState('');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await placeOrder({
        symbol, side, orderType,
        volume: parseFloat(volume),
        sl: sl ? parseFloat(sl) : undefined,
        tp: tp ? parseFloat(tp) : undefined,
        price: price ? parseFloat(price) : undefined,
      });
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <SectionTitle sub="Place orders on your connected accounts">New Order</SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 720 }}>
        {/* Order form */}
        <form onSubmit={handleSubmit} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Symbol</label>
            <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())}
              style={{ width: '100%', padding: '12px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.mono, fontSize: 14, outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {['buy', 'sell'].map(s => (
              <button key={s} type="button" onClick={() => setSide(s)} style={{
                flex: 1, padding: '12px 0', borderRadius: T.radiusSm, border: 'none', cursor: 'pointer',
                fontFamily: T.font, fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
                background: side === s ? (s === 'buy' ? T.green : T.red) : T.bgInput,
                color: side === s ? T.bg : T.textMuted, transition: 'all 0.15s',
              }}>{s}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {['market', 'limit', 'stop'].map(t => (
              <button key={t} type="button" onClick={() => setOrderType(t)} style={{
                flex: 1, padding: '10px 0', borderRadius: T.radiusSm, cursor: 'pointer',
                fontFamily: T.font, fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
                background: orderType === t ? T.accentBg : 'transparent',
                border: `1px solid ${orderType === t ? T.accent + '44' : T.border}`,
                color: orderType === t ? T.accent : T.textDim,
              }}>{t}</button>
            ))}
          </div>

          {[
            { label: 'Volume', val: volume, set: setVolume, show: true },
            { label: 'Price', val: price, set: setPrice, show: orderType !== 'market' },
            { label: 'Stop Loss', val: sl, set: setSl, show: true },
            { label: 'Take Profit', val: tp, set: setTp, show: true },
          ].filter(f => f.show).map(f => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 600, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
              <input value={f.val} onChange={e => f.set(e.target.value)} placeholder="0.00"
                style={{ width: '100%', padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.mono, fontSize: 13, outline: 'none' }} />
            </div>
          ))}

          {error && <div style={{ padding: '10px', borderRadius: T.radiusSm, background: T.redBg, border: `1px solid ${T.red}33`, fontFamily: T.font, fontSize: 13, color: T.red, marginBottom: 12 }}>{error}</div>}
          {result && <div style={{ padding: '10px', borderRadius: T.radiusSm, background: T.greenBg, border: `1px solid ${T.green}33`, fontFamily: T.font, fontSize: 13, color: T.green, marginBottom: 12 }}>
            Order placed! Ticket: {result.ticket}
          </div>}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px 0', borderRadius: T.radiusSm, border: 'none', cursor: loading ? 'wait' : 'pointer',
            fontFamily: T.font, fontSize: 15, fontWeight: 800,
            background: side === 'buy' ? T.green : T.red, color: T.bg,
            marginTop: 8, opacity: loading ? 0.6 : 1,
          }}>{loading ? 'Sending...' : `${side.toUpperCase()} ${symbol}`}</button>
        </form>

        {/* Info panel */}
        <div>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 24, marginBottom: 16 }}>
            <h4 style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 16 }}>{symbol}</h4>
            <p style={{ fontFamily: T.font, fontSize: 12, color: T.textDim }}>
              Price data streams when bridge is connected. Place a market order to execute at current price.
            </p>
          </div>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 20 }}>
            <h4 style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12 }}>Order Types</h4>
            {[
              ['Market', 'Execute at current price'],
              ['Limit', 'Execute at specified price or better'],
              ['Stop', 'Execute when price reaches level'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '8px 0', borderBottom: `1px solid ${T.border}`, fontFamily: T.font, fontSize: 12 }}>
                <span style={{ color: T.accent, fontWeight: 600 }}>{k}</span>
                <span style={{ color: T.textDim }}> — {v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
