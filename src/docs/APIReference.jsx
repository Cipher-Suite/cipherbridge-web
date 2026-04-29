// src/docs/APIReference.jsx
import { T, GATEWAY_URL } from '../theme';
import { Badge, SectionTitle, CodeBlock } from '../components';

const ENDPOINTS = [
  // Public
  { method: 'POST', path: '/api/users',                  desc: 'Create user & API key',         auth: 'Public'     },
  { method: 'GET',  path: '/health',                     desc: 'Gateway health check',           auth: 'Public'     },
  { method: 'GET',  path: '/api/info',                   desc: 'API version & route list',       auth: 'Public'     },
  // Auth
  { method: 'GET',  path: '/api/users/me',               desc: 'My profile + admin flag',        auth: 'API Key'    },
  { method: 'GET',  path: '/api/users/me/sessions',      desc: 'Active sessions',                auth: 'API Key'    },
  { method: 'POST', path: '/api/users/me/rotate-key',    desc: 'Generate new API key',           auth: 'API Key'    },
  // Accounts
  { method: 'POST', path: '/api/accounts',               desc: 'Create & provision MT5 account', auth: 'API Key'    },
  { method: 'GET',  path: '/api/accounts',               desc: 'List accounts',                  auth: 'API Key'    },
  { method: 'GET',  path: '/api/accounts/:id',           desc: 'Account details',                auth: 'API Key'    },
  { method: 'GET',  path: '/api/accounts/:id/status',    desc: 'Instance running status',        auth: 'API Key'    },
  { method: 'POST', path: '/api/accounts/:id/pause',     desc: 'Pause account',                  auth: 'API Key'    },
  { method: 'POST', path: '/api/accounts/:id/resume',    desc: 'Resume account',                 auth: 'API Key'    },
  { method: 'DEL',  path: '/api/accounts/:id',           desc: 'Delete & deprovision',           auth: 'API Key'    },
  // Trading
  { method: 'POST', path: '/api/orders',                 desc: 'Place order',                    auth: 'API Key'    },
  { method: 'GET',  path: '/api/orders',                 desc: 'List open orders',               auth: 'API Key'    },
  { method: 'POST', path: '/api/orders/close',           desc: 'Close position',                 auth: 'API Key'    },
  { method: 'POST', path: '/api/orders/modify',          desc: 'Modify SL/TP',                   auth: 'API Key'    },
  { method: 'GET',  path: '/api/positions',              desc: 'Open positions',                 auth: 'API Key'    },
  { method: 'GET',  path: '/api/account',                desc: 'MT5 account info',               auth: 'API Key'    },
  { method: 'GET',  path: '/api/symbols/:sym',           desc: 'Symbol info',                    auth: 'API Key'    },
  { method: 'GET',  path: '/api/history',                desc: 'OHLCV historical bars',          auth: 'API Key'    },
  // Webhooks
  { method: 'POST', path: '/api/v1/webhook/tv',          desc: 'TradingView alert → MT5 trade', auth: 'Token (URL)'},
  { method: 'POST', path: '/api/v1/webhooks',            desc: 'Generate webhook token',         auth: 'API Key'    },
  { method: 'GET',  path: '/api/v1/webhooks',            desc: 'List webhook tokens',            auth: 'API Key'    },
  { method: 'DEL',  path: '/api/v1/webhooks/:id',        desc: 'Revoke token',                   auth: 'API Key'    },
  { method: 'POST', path: '/api/v1/webhooks/:id/test',   desc: 'Dry-run parse payload',          auth: 'API Key'    },
  // Admin
  { method: 'GET',  path: '/api/admin/users',            desc: 'List all users',                 auth: 'Admin Key'  },
  { method: 'POST', path: '/api/admin/users/:id/rotate-key', desc: 'Force-rotate user key',     auth: 'Admin Key'  },
  { method: 'POST', path: '/api/admin/users/:id/deactivate', desc: 'Deactivate user',           auth: 'Admin Key'  },
  { method: 'POST', path: '/api/admin/nodes',            desc: 'Register node agent',            auth: 'Admin Key'  },
  // Bridge / Node
  { method: 'POST', path: '/bridge/register',            desc: 'Bridge DLL registration',        auth: 'Auth Token' },
  { method: 'WS',   path: '/bridge/ws',                  desc: 'Bridge WebSocket',               auth: 'WS Token'   },
  { method: 'WS',   path: '/node/ws',                    desc: 'Node agent WebSocket',           auth: 'Node Key'   },
  { method: 'WS',   path: '/ws',                         desc: 'Market data stream',             auth: 'API Key'    },
];

const METHOD_COLORS = {
  POST: T.green, GET: T.blue, DEL: T.red, WS: T.purple, PUT: T.orange, PATCH: T.yellow,
};

const AUTH_COLORS = {
  'Public': T.textDim, 'API Key': T.accent, 'Admin Key': T.orange,
  'Auth Token': T.blue, 'WS Token': T.purple, 'Node Key': T.yellow, 'Token (URL)': T.green,
};

export default function APIReference() {
  return (
    <div style={{ maxWidth: 800 }}>
      <SectionTitle sub="Complete REST and WebSocket API reference for Tonpo Gateway">API Reference</SectionTitle>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24, fontFamily: T.font, fontSize: 13, color: T.textMuted }}>
        <div>Base URL: <code style={{ fontFamily: T.mono, color: T.accent, background: T.accentBg, padding: '2px 7px', borderRadius: 4 }}>{GATEWAY_URL}</code></div>
        <div>Auth header: <code style={{ fontFamily: T.mono, color: T.accent, background: T.accentBg, padding: '2px 7px', borderRadius: 4 }}>X-API-Key: your_key</code></div>
      </div>

      {/* Section groups */}
      {[
        { label: 'Public',     rows: ENDPOINTS.filter(e => e.auth === 'Public') },
        { label: 'User & Auth', rows: ENDPOINTS.filter(e => e.path.startsWith('/api/users')) },
        { label: 'Accounts',   rows: ENDPOINTS.filter(e => e.path.startsWith('/api/accounts')) },
        { label: 'Trading',    rows: ENDPOINTS.filter(e => ['/api/orders','/api/positions','/api/account','/api/symbols','/api/history'].some(p => e.path.startsWith(p))) },
        { label: 'Webhooks',   rows: ENDPOINTS.filter(e => e.path.includes('webhook')) },
        { label: 'Admin',      rows: ENDPOINTS.filter(e => e.path.startsWith('/api/admin')) },
        { label: 'Bridge & Node', rows: ENDPOINTS.filter(e => e.path.startsWith('/bridge') || e.path.startsWith('/node') || e.path === '/ws') },
      ].map(group => (
        <div key={group.label} style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, paddingLeft: 4 }}>
            {group.label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {group.rows.map((e, i) => (
              <div key={e.path + i} style={{
                display: 'grid', gridTemplateColumns: '58px 1fr 1fr 90px',
                alignItems: 'center', gap: 10, padding: '10px 14px',
                background: i % 2 === 0 ? T.bgCard : 'transparent', borderRadius: T.radiusSm,
              }}>
                <Badge color={METHOD_COLORS[e.method] || T.textDim}>{e.method}</Badge>
                <code style={{ fontFamily: T.mono, fontSize: 11, color: T.text }}>{e.path}</code>
                <span style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted }}>{e.desc}</span>
                <span style={{ fontFamily: T.font, fontSize: 10, color: AUTH_COLORS[e.auth] || T.textDim, fontWeight: 600 }}>{e.auth}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Webhook payload format */}
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 24, marginTop: 8 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 12 }}>TradingView Webhook Payload</h3>
        <CodeBlock language="json" title="POST /api/v1/webhook/tv?token=..." code={`{
  "action":     "buy",          // "buy" | "sell" | "long" | "short"
  "symbol":     "EURUSD",       // or {{ticker}} from TradingView
  "volume":     0.01,
  "order_type": "market",       // "market" | "limit" | "stop"
  "sl":         1.0800,         // absolute SL price (optional)
  "tp":         1.1000,         // absolute TP price (optional)
  "sl_pips":    50,             // SL in pips — overridden by "sl" if both present
  "tp_pips":    100,            // TP in pips — overridden by "tp" if both present
  "price":      0.0,            // for limit/stop orders
  "comment":    "tv-signal",
  "magic":      12345
}`} />
      </div>
    </div>
  );
}
