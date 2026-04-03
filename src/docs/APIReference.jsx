// src/docs/APIReference.jsx
import { T } from '../theme';
import { Badge, SectionTitle } from '../components';

const endpoints = [
  ["POST", "/api/users", "Create user + API key", "Public"],
  ["GET", "/health", "Gateway health check", "Public"],
  ["POST", "/api/accounts", "Create MT5 account", "API Key"],
  ["GET", "/api/accounts", "List all accounts", "API Key"],
  ["GET", "/api/accounts/:id", "Account details", "API Key"],
  ["DELETE", "/api/accounts/:id", "Delete account", "API Key"],
  ["POST", "/api/accounts/:id/pause", "Pause account", "API Key"],
  ["POST", "/api/accounts/:id/resume", "Resume account", "API Key"],
  ["POST", "/api/orders", "Place order", "API Key"],
  ["POST", "/api/orders/close", "Close position", "API Key"],
  ["POST", "/api/orders/modify", "Modify SL/TP", "API Key"],
  ["GET", "/api/positions", "Open positions", "API Key"],
  ["GET", "/api/account", "Account info", "API Key"],
  ["GET", "/api/symbols/:sym", "Symbol info", "API Key"],
  ["GET", "/api/history", "Historical bars", "API Key"],
  ["POST", "/bridge/register", "Bridge DLL registration", "Auth Token"],
  ["WS", "/bridge/ws", "Bridge WebSocket", "WS Token"],
  ["WS", "/node/ws", "Node agent WebSocket", "Node Key"],
  ["WS", "/ws", "Market data stream", "API Key"],
];

const METHOD_COLORS = { POST: T.green, GET: T.blue, DELETE: T.red, WS: T.purple, PUT: T.orange };

export default function APIReference() {
  return (
    <div style={{ maxWidth: 800 }}>
      <SectionTitle sub="Complete REST and WebSocket API reference">API Reference</SectionTitle>

      <div style={{ marginBottom: 24, fontFamily: T.font, fontSize: 14, color: T.textMuted }}>
        <p style={{ marginBottom: 8 }}>
          Base URL: <code style={{ fontFamily: T.mono, color: T.accent, background: T.accentBg, padding: '2px 8px', borderRadius: 4 }}>https://gateway.cipherbridge.cloud</code>
        </p>
        <p>
          Auth header: <code style={{ fontFamily: T.mono, color: T.accent, background: T.accentBg, padding: '2px 8px', borderRadius: 4 }}>X-API-Key: your_key</code>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {endpoints.map(([method, path, desc, auth], i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '70px 1fr 1fr 80px', alignItems: 'center', gap: 8,
            padding: '12px 16px', background: i % 2 === 0 ? T.bgCard : 'transparent',
            borderRadius: T.radiusSm,
          }}>
            <Badge color={METHOD_COLORS[method] || T.textMuted}>{method}</Badge>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text }}>{path}</span>
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted }}>{desc}</span>
            <span style={{ fontFamily: T.font, fontSize: 11, color: T.textDim }}>{auth}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
