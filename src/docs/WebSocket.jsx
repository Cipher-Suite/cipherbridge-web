// src/docs/WebSocket.jsx
import { T } from '../theme';
import { CodeBlock, SectionTitle } from '../components';

export default function WebSocket() {
  return (
    <div style={{ maxWidth: 720 }}>
      <SectionTitle sub="Real-time market data and order execution">WebSocket Protocol</SectionTitle>
      <div style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted, lineHeight: 1.8 }}>
        <p style={{ marginBottom: 16 }}>
          Connect to <code style={{ fontFamily: T.mono, color: T.accent, background: T.accentBg, padding: '2px 8px', borderRadius: 4 }}>wss://gateway.cipherbridge.cloud/ws</code> with your API key in headers.
        </p>

        <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 24 }}>Subscribe</h3>
        <CodeBlock title="Client → Server" code={`{
  "type": "subscribe",
  "symbols": ["EURUSD", "GBPUSD", "XAUUSD"],
  "timeframe": "M1",
  "requestId": "sub-001"
}`} />

        <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 24 }}>Tick Data</h3>
        <CodeBlock title="Server → Client" code={`{
  "type": "tick",
  "symbol": "EURUSD",
  "bid": 1.08234,
  "ask": 1.08240,
  "time": 1678900000
}`} />

        <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 24 }}>Candle Updates</h3>
        <CodeBlock title="Server → Client" code={`{
  "type": "candle",
  "symbol": "EURUSD",
  "timeframe": "M1",
  "open": 1.08200, "high": 1.08300,
  "low": 1.08180, "close": 1.08234,
  "volume": 234, "complete": false
}`} />

        <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 24 }}>Place Order</h3>
        <CodeBlock title="Client → Server" code={`{
  "type": "placeOrder",
  "symbol": "EURUSD",
  "side": "buy",
  "orderType": "market",
  "volume": 0.1
}`} />

        <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 24 }}>Unsubscribe</h3>
        <CodeBlock title="Client → Server" code={`{
  "type": "unsubscribe",
  "symbols": ["GBPUSD"],
  "requestId": "unsub-001"
}`} />
      </div>
    </div>
  );
}
