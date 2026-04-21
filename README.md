# Tonpo Web Dashboard

The official management dashboard for [Tonpo Gateway](https://github.com/your-org/tonpo-gateway) — a self-hosted MT5 trading infrastructure platform.

Built with **React 18 + Vite**. Connects to the Tonpo Gateway REST API and WebSocket endpoint.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Authentication](#authentication)
- [Pages & Routes](#pages--routes)
- [Admin Panel](#admin-panel)
- [TradingView Webhooks UI](#tradingview-webhooks-ui)
- [Real-Time Updates](#real-time-updates)
- [Component Library](#component-library)
- [API Client](#api-client)
- [Mobile & Responsive Layout](#mobile--responsive-layout)
- [Security Considerations](#security-considerations)
- [Build & Deploy](#build--deploy)
- [Environment Variables](#environment-variables)
- [Connecting to Tonpo Gateway](#connecting-to-tonpo-gateway)

---

## Features

| Feature | Detail |
|---|---|
| **Account management** | Create, pause, resume, delete MT5 accounts |
| **Per-account detail** | Status, node info, error history, instance uptime |
| **TradingView webhooks** | Generate URLs, revoke tokens, dry-run test payloads |
| **Live P&L** | Open positions with real-time profit display |
| **Order placement** | Market, limit, stop orders with account selector |
| **Real-time status** | WebSocket connection — account statuses update live |
| **Admin panel** | User management, key recovery, node registration |
| **API key rotation** | Self-service key rotation with one-time display |
| **Hamburger menu** | Fully responsive — works on mobile and desktop |
| **Docs** | Built-in API reference, getting started guide, WebSocket protocol |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set gateway URL
cp .env.example .env
# Edit .env → set VITE_GATEWAY_URL

# 3. Start dev server
npm run dev
```

Opens at **http://localhost:3000**

The Vite dev server proxies all `/api`, `/health`, `/bridge`, and `/node` requests to your gateway — no CORS issues in development.

---

## Project Structure

```
src/
├── main.jsx                       # Entry point — injects global CSS, mounts app
├── App.jsx                        # All routes, AuthGuard, AdminGuard, AppLayout
├── theme.js                       # Design tokens (colors, fonts, radii, shadows)
│
├── api/
│   ├── client.js                  # ApiClient — fetch wrapper with X-API-Key header
│   └── endpoints.js               # Every API call as a typed function
│
├── auth/
│   ├── AuthContext.jsx            # Auth state — login, register, logout, isAdmin
│   └── LoginPage.jsx              # Sign in / create account page
│
├── components/
│   ├── index.js                   # Barrel export for all components
│   ├── Badge.jsx                  # Status pill + StatusDot (glow for active state)
│   ├── StatCard.jsx               # Metric card
│   ├── SectionTitle.jsx           # Page header with optional inline action slot
│   ├── CodeBlock.jsx              # Syntax block with copy button
│   └── Shared.jsx                 # Btn, Modal, EmptyState, Alert, Input, Spinner
│
├── hooks/
│   ├── useData.js                 # useAccounts, usePositions, useHealth,
│   │                              #   useWebhooks, useAccountDetail, useAdminUsers
│   └── useWebSocket.js            # Real-time WS hook with exponential backoff
│
├── layouts/
│   └── Sidebar.jsx                # Fixed sidebar (desktop) / hamburger drawer (mobile)
│
├── dashboard/
│   ├── Overview.jsx               # Accounts list, stat cards, live WS indicator
│   ├── AccountDetail.jsx          # Per-account page — status, webhooks, alert format
│   ├── Positions.jsx              # Open positions — table (desktop) / cards (mobile)
│   ├── Trade.jsx                  # Order form with account selector
│   ├── Webhooks.jsx               # TradingView webhook token management
│   └── Settings.jsx               # API key, rotation, session info, sign out
│
├── admin/
│   ├── Admin.jsx                  # User list — deactivate, rotate key, set admin
│   └── AdminNodes.jsx             # Node list — register, capacity bars
│
└── docs/
    ├── GettingStarted.jsx         # 5-step quickstart with curl + Python examples
    ├── APIReference.jsx           # All 30+ endpoints grouped by category
    ├── WebSocket.jsx              # WS message format reference
    └── Security.jsx               # Security model documentation
```

---

## Configuration

### `.env`

```env
# Required — URL of your Tonpo Gateway instance
VITE_GATEWAY_URL=https://gateway.cipherbridge.cloud

# Optional — override in dev to hit a local gateway
# VITE_GATEWAY_URL=http://localhost:8080
```

### `.env.example`

```env
VITE_GATEWAY_URL=https://your-gateway-domain.com
```

### Dev proxy (`vite.config.js`)

In development, Vite proxies API traffic to your gateway automatically. In production builds (`vite build`), the browser calls the gateway directly using `VITE_GATEWAY_URL` as the base URL.

---

## Authentication

Tonpo Gateway uses **API key authentication** — no username/password, no OAuth. Your API key is your identity.

### Sign In

Paste an existing API key. The app calls `GET /api/users/me` to validate it and retrieve the `userId` and `isAdmin` flag.

### Create Account

Calls `POST /api/users` to generate a new key. The key is shown once — copy it and store it safely.

### Session persistence

The session (`apiKey`, `userId`, `isAdmin`) is stored in `localStorage` under the key `tonpo_session_v1`. On page load, the stored key is restored and `/api/users/me` is re-fetched in the background to refresh the `isAdmin` flag.

### Key rotation

Available in **Settings**. Calling `POST /api/users/me/rotate-key` generates a new key and immediately invalidates the old one. The new key is shown once in an orange alert. The session is automatically updated in memory and storage.

### Locked out?

If a user loses their API key, a gateway admin can rotate it via the **Admin** panel using the user's User ID, then deliver the new key out-of-band.

---

## Pages & Routes

| Route | Component | Auth | Description |
|---|---|---|---|
| `/login` | `LoginPage` | Public | Sign in or create account |
| `/` | `Overview` | ✓ | Accounts list, stat cards, live gateway status |
| `/accounts/:id` | `AccountDetail` | ✓ | Per-account detail, webhook management |
| `/positions` | `Positions` | ✓ | All open positions, close button |
| `/trade` | `Trade` | ✓ | Place orders with account selector |
| `/webhooks` | `Webhooks` | ✓ | TradingView webhook token management |
| `/settings` | `Settings` | ✓ | API key, rotation, session |
| `/admin` | `Admin` | Admin only | User management |
| `/admin/nodes` | `AdminNodes` | Admin only | Node agent management |
| `/docs` | `GettingStarted` | ✓ | Quickstart guide |
| `/docs/api` | `APIReference` | ✓ | Full endpoint reference |
| `/docs/websocket` | `WebSocketDoc` | ✓ | WS protocol |
| `/docs/security` | `Security` | ✓ | Security model |

### Route guards

- **`AuthGuard`** — redirects to `/login` if not authenticated
- **`AdminGuard`** — redirects to `/` if authenticated but `isAdmin` is false; enforced both client-side and at the gateway via `admin_middleware`

---

## Admin Panel

The admin section appears in the sidebar only when the logged-in user has `is_admin: true` on the gateway.

### Users (`/admin`)

- List all gateway users with account count and active/deactivated status
- **Rotate key** — generates a new API key for any user (for locked-out account recovery). The new key is shown once in a modal
- **Deactivate** — immediately revokes access for a user (confirmed with a dialog)
- **Promote / demote** — toggle the `is_admin` flag

### Nodes (`/admin/nodes`)

- List all registered Windows VPS node agents
- View status (`online` / `offline`), region, capacity, CPU/RAM specs, last heartbeat timestamp
- Capacity bar per node — turns red when at max accounts
- **Register new node** — generates a node ID and API key for a new Windows VPS instance

#### Registering a node

1. Fill in the node name, region (`eu` / `us` / `asia`), and max account capacity
2. Click **Register** — a Node ID and API key are displayed **once**
3. Set these environment variables on the Windows VPS before starting `node-agent.exe`:

```env
NODE_ID=<generated id>
NODE_API_KEY=<generated key>
GATEWAY_WS_URL=wss://gateway.cipherbridge.cloud/node/ws
GATEWAY_HTTP_URL=https://gateway.cipherbridge.cloud
DATA_DIR=D:\CipherBridge
```

---

## TradingView Webhooks UI

Tonpo supports native TradingView webhook alerts that automatically execute trades on your MT5 account without any intermediate server.

### Setup flow (in the dashboard)

1. Go to **Webhooks** or open an account's **Account Detail** page
2. Select the target account and an optional label, then click **Generate Webhook URL**
3. The full webhook URL is shown **once** — copy it immediately
4. In TradingView: right-click chart → **Add Alert** → **Notifications** tab
5. Enable **Webhook URL** and paste your URL
6. Set the alert **Message** field to the JSON format below

### Alert message format

```json
{
  "action":     "{{strategy.order.action}}",
  "symbol":     "{{ticker}}",
  "volume":     0.01,
  "order_type": "market",
  "sl_pips":    50,
  "tp_pips":    100,
  "comment":    "tv-signal"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `action` | string | ✓ | `"buy"` or `"sell"` (also accepts `"long"`, `"short"`, `"b"`, `"s"`) |
| `symbol` | string | ✓ | Symbol name, e.g. `"EURUSD"`. Use `{{ticker}}` for auto-fill |
| `volume` | number | ✓ | Lot size (positive float) |
| `order_type` | string | | `"market"` (default), `"limit"`, `"stop"` |
| `sl` | number | | Absolute stop loss price. Takes priority over `sl_pips` |
| `tp` | number | | Absolute take profit price. Takes priority over `tp_pips` |
| `sl_pips` | number | | SL in pips — converted to absolute price using current bid/ask |
| `tp_pips` | number | | TP in pips — converted to absolute price using current bid/ask |
| `price` | number | | Entry price for limit/stop orders |
| `comment` | string | | Order comment visible in MT5 (max 32 chars) |
| `magic` | number | | Magic number for EA identification |

### Webhook security layers

1. **IP whitelist** — only TradingView's published server IPs are accepted (bypass with `WEBHOOK_SKIP_IP_CHECK=true` in gateway `.env` for testing)
2. **Token hashing** — stored as SHA-256; plaintext never written to the database
3. **Replay protection** — sha256(request body) is deduplicated per token within a 5-minute window
4. **One token per account** — regenerating a URL revokes the previous one immediately
5. **Enable/disable** — tokens can be disabled without deletion

### Dry-run testing

In **Account Detail**, click **Test** next to any token to validate a payload without executing any trade. Returns what order would be sent to MT5.

---

## Real-Time Updates

The dashboard maintains a WebSocket connection to `GET /ws` on the gateway. The connection uses the API key as a query parameter (`?api_key=...`) because browser WebSocket cannot send custom headers during the HTTP upgrade.

- **Auto-reconnect** with exponential backoff: 1s → 2s → 4s → 8s → 16s → 30s (cap)
- **Live indicator** in the Overview page header — green glowing dot = connected
- **Account status updates** received over WS are applied immediately to the UI — no page refresh needed

The hook is exported as:

```js
import { useGatewayWS } from '../hooks/useWebSocket';

const { connected, send } = useGatewayWS({
  onMessage: (msg) => {
    if (msg.type === 'account_status') {
      updateStatus(msg.data.account_id, msg.data.status);
    }
  },
  enabled: true,
});
```

---

## Component Library

All shared components are exported from `src/components/index.js`.

### `Btn`

```jsx
<Btn variant="primary" size="md" loading={false} onClick={fn} type="button">
  Label
</Btn>
```

Variants: `primary` · `ghost` · `danger` · `success` · `warning`
Sizes: `sm` · `md` · `lg`

### `Modal`

```jsx
<Modal open={open} onClose={fn} title="Dialog Title" maxWidth={460}>
  {children}
</Modal>
```

Closes on overlay click and ESC key.

### `Alert`

```jsx
<Alert variant="error">Something went wrong</Alert>
<Alert variant="success">Operation completed</Alert>
<Alert variant="warning">Review before continuing</Alert>
<Alert variant="info">Informational message</Alert>
```

### `EmptyState`

```jsx
<EmptyState
  icon="⬡"
  title="No accounts yet"
  sub="Connect your first MT5 account to get started."
  action={<Btn onClick={fn}>Connect MT5</Btn>}
/>
```

### `StatusDot`

```jsx
<StatusDot status="active" />
<StatusDot status="paused" />
<StatusDot status="disconnected" />
```

Renders a colored dot + badge. The `active` status has a subtle CSS glow. Accepts any `AccountStatus` string from the gateway.

### `Input`

```jsx
<Input
  label="MT5 Login"
  value={val}
  onChange={setVal}
  placeholder="105745233"
  hint="Your MT5 account number"
  error={errorMessage}
  mono
/>
```

### `SectionTitle`

```jsx
<SectionTitle
  sub="Subtitle text"
  action={<Btn size="sm">Action</Btn>}
>
  Page Title
</SectionTitle>
```

The `action` prop renders a right-aligned button inline with the title — used throughout for Refresh and New buttons.

---

## API Client

`src/api/client.js` exports a singleton `api` instance of `ApiClient`.

```js
import { api } from './api/client';

// Called on login
api.setApiKey('your-api-key');

// Called on logout
api.clearApiKey();

// Used by WebSocket hook
api.getApiKey();

// HTTP methods
api.get('/api/accounts');
api.post('/api/orders', { symbol: 'EURUSD', side: 'buy', volume: 0.01 });
api.del('/api/accounts/abc-123');
api.put('/api/...', body);
```

All methods return parsed JSON. On a non-2xx response, they throw `ApiError(message, status, data)` which components catch to display `<Alert>` messages.

### All endpoints (`src/api/endpoints.js`)

```js
// Auth
createUser()                               // POST /api/users
getMe()                                    // GET  /api/users/me
rotateMyKey()                              // POST /api/users/me/rotate-key

// Accounts
listAccounts()                             // GET  /api/accounts
getAccount(id)                             // GET  /api/accounts/:id
getAccountStatus(id)                       // GET  /api/accounts/:id/status
createAccount(login, password, server)     // POST /api/accounts
pauseAccount(id)                           // POST /api/accounts/:id/pause
resumeAccount(id)                          // POST /api/accounts/:id/resume
deleteAccount(id)                          // DEL  /api/accounts/:id

// Trading
getPositions()                             // GET  /api/positions
getAccountInfo()                           // GET  /api/account
getOrders()                                // GET  /api/orders
placeOrder({ symbol, side, orderType, volume, sl, tp, price, comment })
closeOrder(ticket, volume)                 // POST /api/orders/close
modifyOrder(ticket, sl, tp)                // POST /api/orders/modify
getSymbolInfo(symbol)                      // GET  /api/symbols/:symbol
getHistory(symbol, timeframe, from, to)    // GET  /api/history

// Webhooks
listWebhooks()                             // GET  /api/v1/webhooks
createWebhook(accountId, label)            // POST /api/v1/webhooks
revokeWebhook(id)                          // DEL  /api/v1/webhooks/:id
testWebhook(id, payload)                   // POST /api/v1/webhooks/:id/test

// Admin
adminListUsers()                           // GET  /api/admin/users
adminGetUser(id)                           // GET  /api/admin/users/:id
adminDeactivate(id)                        // POST /api/admin/users/:id/deactivate
adminSetAdmin(id, bool)                    // POST /api/admin/users/:id/admin
adminRotateKey(id)                         // POST /api/admin/users/:id/rotate-key
adminRegisterNode(body)                    // POST /api/admin/nodes

// System
healthCheck()                              // GET  /health
apiInfo()                                  // GET  /api/info
bridgeStatus()                             // GET  /api/bridge/status
```

---

## Mobile & Responsive Layout

The sidebar collapses at `< 768px`. A top bar with a hamburger button appears instead.

- Hamburger icon **animates to an X** when the menu is open
- Tapping the dark overlay or pressing **ESC** closes the drawer
- Sidebar slides in from the left with a CSS `transform` transition (no layout shift)
- Positions page: **table** on desktop → **card list** on mobile (CSS class swap)
- Admin users page: **grid table** on desktop → **card list** on mobile
- All modals: centered, `max-height: 90vh`, `overflow-y: auto` — scrollable on small screens
- Flexbox wrap on stat cards and form grids — reflows to single column on narrow screens

The mobile top bar height (`56px`) is accounted for in `AppLayout` using a CSS media query that adds top padding to the main content area.

---

## Security Considerations

| Area | Implementation |
|---|---|
| **API key display** | Masked by default in Settings (`type="password"`), show/hide toggle available |
| **Key in transport** | Sent as `X-API-Key` header on every request. Query param only used for WebSocket upgrade (`/ws?api_key=...`) |
| **Session storage** | `localStorage` only — no cookies, no sessionStorage |
| **Key rotation UX** | New key shown once in an orange alert box. Session updated immediately in memory and storage |
| **Admin routes** | Client-side `AdminGuard` + server-side `admin_middleware` on the gateway. Compromising the client cannot bypass server-side checks |
| **Webhook tokens** | SHA-256 hashed in DB — plaintext shown once at creation, never retrievable again |
| **Destructive actions** | Delete account, deactivate user, revoke token — all require `window.confirm()` |
| **Input validation** | Client-side: API key length check on login, required fields on forms, `parseFloat` validation on volume |
| **No PII** | No email, name, or personal data is collected or stored anywhere in the system |

---

## Build & Deploy

### Production build

```bash
npm run build
# Output in dist/
```

### Nginx (recommended for self-hosted gateway)

```nginx
server {
    listen 443 ssl http2;
    server_name app.your-domain.com;

    ssl_certificate     /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;

    root /var/www/tonpo-web/dist;
    index index.html;

    # SPA routing — serve index.html for all client-side routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: proxy API to gateway on the same server
    # location /api/ {
    #     proxy_pass http://127.0.0.1:8080;
    # }
}
```

### Cloudflare Pages

1. Connect your repository in the Cloudflare Pages dashboard
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable: `VITE_GATEWAY_URL=https://your-gateway-domain.com`

### Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify

```
# public/_redirects
/*  /index.html  200
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_GATEWAY_URL` | Yes | `https://gateway.cipherbridge.cloud` | Base URL of your Tonpo Gateway instance. Must include `https://`. No trailing slash. |

---

## Connecting to Tonpo Gateway

This dashboard requires a running **Tonpo Gateway** instance. The full Tonpo stack:

| Component | Language | Role |
|---|---|---|
| **Tonpo Gateway** (CMG) | Rust / Axum | HTTP + WebSocket API server — deployed on Linux VPS |
| **Tonpo Bridge** (CMB) | C++ / MQL5 | DLL + Expert Advisor — runs inside the MT5 terminal |
| **Tonpo Node** (CNA) | Rust (Windows) | Agent on Windows VPS — manages isolated MT5 instances |
| **tonpo-py** | Python | SDK for programmatic API access |

### Minimum gateway environment for this dashboard

```env
# Required gateway (.env)
GATEWAY_PUBLIC_URL=https://gateway.cipherbridge.cloud
DATABASE_URL=postgres://user:pass@localhost/tonpo
JWT_SECRET=your-jwt-secret-min-32-chars
ENCRYPTION_KEY=your-32-char-encryption-key
API_KEY_HEADER=X-API-Key
```

The dashboard calls these gateway endpoints. All must be reachable from the user's browser:

- `GET /health` — health check (public)
- `POST /api/users` — register (public)
- `GET /api/users/me` — profile fetch (API key)
- All `/api/accounts/*`, `/api/orders`, `/api/positions` endpoints
- `GET /ws` — WebSocket (API key via query param)
- All `/api/v1/webhooks/*` endpoints
- All `/api/admin/*` endpoints (admin key)

---

## License

MIT — see [LICENSE](LICENSE)
