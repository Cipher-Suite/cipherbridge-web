// src/dashboard/Trade.jsx
import { useState, useEffect } from 'react';
import { T } from '../theme';
import { SectionTitle, Alert, Btn } from '../components';
import { placeOrder, getAccountInfo } from '../api/endpoints';
import { useAccounts } from '../hooks/useData';

const SYMBOLS = ['EURUSD','GBPUSD','USDJPY','AUDUSD','USDCAD','XAUUSD','BTCUSD','US100','US500'];

export default function Trade() {
  const { accounts } = useAccounts();
  const activeAccounts = accounts.filter(a => a.status === 'active');

  const [accountId, setAccountId] = useState('');
  const [side,       setSide]      = useState('buy');
  const [orderType,  setOrderType] = useState('market');
  const [symbol,     setSymbol]    = useState('EURUSD');
  const [volume,     setVolume]    = useState('0.01');
  const [price,      setPrice]     = useState('');
  const [sl,         setSl]        = useState('');
  const [tp,         setTp]        = useState('');
  const [comment,    setComment]   = useState('');
  const [loading,    setLoading]   = useState(false);
  const [result,     setResult]    = useState(null);
  const [error,      setError]     = useState('');

  // Auto-select first active account
  useEffect(() => {
    if (!accountId && activeAccounts.length > 0) {
      setAccountId(activeAccounts[0].id || activeAccounts[0].account_id);
    }
  }, [activeAccounts, accountId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountId) { setError('Select an account first'); return; }
    const vol = parseFloat(volume);
    if (isNaN(vol) || vol <= 0) { setError('Volume must be a positive number'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await placeOrder({
        symbol: symbol.trim().toUpperCase(),
        side,
        orderType,
        volume: vol,
        price:   price   ? parseFloat(price)   : undefined,
        sl:      sl      ? parseFloat(sl)       : undefined,
        tp:      tp      ? parseFloat(tp)       : undefined,
        comment: comment.trim() || undefined,
      });
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const labelStyle = { fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' };
  const inputStyle = { width: '100%', padding: '11px 13px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.mono, fontSize: 13, outline: 'none' };

  return (
    <div>
      <SectionTitle sub="Place orders on your connected MT5 accounts">New Order</SectionTitle>

      {activeAccounts.length === 0 && (
        <Alert variant="warning">No active accounts. Connect and wait for an account to become active before placing orders.</Alert>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px,420px) 1fr', gap: 24, alignItems: 'start', flexWrap: 'wrap' }}>
        {/* Order form */}
        <form onSubmit={handleSubmit} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 24 }}>

          {/* Account selector */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Account</label>
            <select value={accountId} onChange={e => setAccountId(e.target.value)} style={{ ...inputStyle, fontFamily: T.font }}>
              <option value="">Select account…</option>
              {activeAccounts.map(a => {
                const aid = a.id || a.account_id;
                return <option key={aid} value={aid}>{a.mt5_login} — {a.mt5_server}</option>;
              })}
            </select>
          </div>

          {/* Symbol */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Symbol</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {SYMBOLS.slice(0, 5).map(s => (
                <button key={s} type="button" onClick={() => setSymbol(s)} style={{
                  padding: '5px 10px', borderRadius: T.radiusSm, fontFamily: T.mono, fontSize: 11, cursor: 'pointer',
                  background: symbol === s ? T.accentBg : T.bgInput,
                  border: `1px solid ${symbol === s ? T.accent + '55' : T.border}`,
                  color: symbol === s ? T.accent : T.textMuted,
                }}>{s}</button>
              ))}
            </div>
            <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="EURUSD" style={inputStyle} />
          </div>

          {/* Side */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Direction</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['buy', 'sell'].map(s => (
                <button key={s} type="button" onClick={() => setSide(s)} style={{
                  flex: 1, padding: '12px 0', borderRadius: T.radiusSm, fontFamily: T.font,
                  fontSize: 14, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase',
                  border: `1px solid ${side === s ? (s === 'buy' ? T.green : T.red) + '55' : T.border}`,
                  background: side === s ? (s === 'buy' ? T.greenBg : T.redBg) : T.bgInput,
                  color: side === s ? (s === 'buy' ? T.green : T.red) : T.textMuted,
                }}>{s === 'buy' ? '▲ Buy' : '▼ Sell'}</button>
              ))}
            </div>
          </div>

          {/* Type + Volume */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Order Type</label>
              <select value={orderType} onChange={e => setOrderType(e.target.value)} style={{ ...inputStyle, fontFamily: T.font }}>
                <option value="market">Market</option>
                <option value="limit">Limit</option>
                <option value="stop">Stop</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Volume (lots)</label>
              <input type="number" value={volume} onChange={e => setVolume(e.target.value)} step="0.01" min="0.01" style={inputStyle} />
            </div>
          </div>

          {/* Limit/stop price */}
          {orderType !== 'market' && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Price</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} step="0.00001" placeholder="0.00000" style={inputStyle} />
            </div>
          )}

          {/* SL / TP */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Stop Loss</label>
              <input type="number" value={sl} onChange={e => setSl(e.target.value)} step="0.00001" placeholder="0.00000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Take Profit</label>
              <input type="number" value={tp} onChange={e => setTp(e.target.value)} step="0.00001" placeholder="0.00000" style={inputStyle} />
            </div>
          </div>

          {/* Comment */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Comment (optional)</label>
            <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Order comment" maxLength={32} style={inputStyle} />
          </div>

          {error && <Alert>{error}</Alert>}

          {result && result.success && (
            <Alert variant="success">Order placed! Ticket #{result.ticket}</Alert>
          )}

          <Btn type="submit" loading={loading} disabled={!accountId || activeAccounts.length === 0} style={{ width: '100%', padding: '13px 0', fontSize: 14 }}>
            {loading ? 'Placing…' : `${side === 'buy' ? '▲ Buy' : '▼ Sell'} ${symbol}`}
          </Btn>
        </form>

        {/* Order summary / info panel */}
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 24 }}>
          <h3 style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>Order Summary</h3>
          {[
            ['Symbol',     symbol || '—'],
            ['Direction',  side.toUpperCase()],
            ['Type',       orderType.charAt(0).toUpperCase() + orderType.slice(1)],
            ['Volume',     `${volume || '0'} lots`],
            ['Stop Loss',  sl     ? sl     : 'None'],
            ['Take Profit', tp    ? tp     : 'None'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted }}>{label}</span>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text, fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: 14, background: T.bgInput, borderRadius: T.radiusSm }}>
            <p style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, lineHeight: 1.6 }}>
              Orders execute on the MT5 account via the bridge. Ensure the account is active and the bridge is connected before placing.
            </p>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:700px){.trade-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
