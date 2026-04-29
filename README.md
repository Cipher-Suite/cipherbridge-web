# 🎯 Tonpo Web Dashboard

**The official management dashboard for Tonpo Gateway** — a self-hosted MetaTrader 5 trading infrastructure platform.

Built with **React 18 + Vite**. Connects to Tonpo Gateway via REST API and WebSocket for real-time updates.

---

## ✨ Features

- 🎛️ **Account Management** — Create, pause, resume, and delete MT5 accounts
- 📊 **Live Trading Dashboard** — Real-time positions, P&L, and account status
- 🪝 **TradingView Webhooks** — Generate URLs, test payloads, revoke tokens
- 📈 **Order Management** — Place market, limit, and stop orders
- ⚡ **Real-Time Updates** — WebSocket connection for live status changes
- 🔐 **API Key Management** — Self-service key rotation with one-time display
- 👥 **Admin Panel** — User management, key recovery, node registration
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 📚 **Built-In Docs** — API reference, getting started, WebSocket protocol
- 🎨 **Dark Theme** — Professional UI with smooth animations

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+** (or use `nvm`)
- **npm 8+**
- A running **Tonpo Gateway** instance

### Setup

```bash
# 1. Clone and install
git clone <repo>
cd tonpo-web
npm install

# 2. Configure
cp .env.example .env
# Edit .env → set VITE_GATEWAY_URL to your gateway URL
# Example: VITE_GATEWAY_URL=https://gateway.example.com

# 3. Start development server
npm run dev
```

Opens at **http://localhost:3000**

The dev server automatically proxies `/api`, `/health`, `/bridge`, `/node`, and `/ws` requests to your gateway — **no CORS issues**.

---

## 📦 Build & Deploy

### Production Build

```bash
npm run build
# Output: dist/ (ready to deploy)
```

### Deploy Options

#### **Nginx (Recommended)**
```nginx
server {
    listen 443 ssl http2;
    server_name app.example.com;
    
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    root /var/www/tonpo-web/dist;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### **Cloudflare Pages**
1. Connect repo in dashboard
2. Build: `npm run build`
3. Output: `dist`
4. Add env var: `VITE_GATEWAY_URL=https://your-gateway.com`

#### **Vercel**
1. Import repo
2. Framework: Vite
3. Output dir: `dist`
4. Add env var: `VITE_GATEWAY_URL=https://your-gateway.com`

#### **Netlify**
1. Import repo
2. Build: `npm run build`
3. Publish: `dist`
4. Create `_redirects` file with: `/*    /index.html  200`
5. Add env var: `VITE_GATEWAY_URL=https://your-gateway.com`

---

## ⚙️ Configuration

### Environment Variables

```env
# Required
VITE_GATEWAY_URL=https://your-gateway-domain.com

# Optional (overrides for development)
# VITE_GATEWAY_URL=http://localhost:8080
```

### Vite Config

Dev server proxies configured in `vite.config.js`:
- `/api` → gateway REST API
- `/health` → gateway health endpoint
- `/ws` → WebSocket connection
- `/bridge` → bridge integration
- `/node` → node agent connection

In production, the app calls the gateway directly using `VITE_GATEWAY_URL`.

---

## 🔐 Authentication

### How It Works

- **No passwords** — Uses API key authentication
- **No OAuth** — Direct API key validation
- **Session persistence** — Stored in localStorage, auto-restored on page reload

### Sign In
1. Go to `/login`
2. Paste your API key
3. App validates with gateway → fetches your profile
4. Redirected to dashboard

### Create Account
1. On login page, click "Create Account"
2. Calls `POST /api/users` to generate new key
3. Key shown once in alert → **copy and save it**

### Key Rotation (Settings)
1. Go to `/settings`
2. Click "Rotate API Key"
3. Confirms the action (old key invalidated immediately)
4. New key shown once → **copy and save it**
5. Session auto-updates in memory and localStorage

### Session Storage
- Stored in `localStorage` under `tonpo_session_v1`
- Contains: `apiKey`, `userId`, `isAdmin`
- Auto-restored on page reload
- Cleared on logout

---

## 📍 Routes & Pages

### Public
| Route | Purpose |
|-------|---------|
| `/login` | Sign in or create account |

### Protected (Requires authentication)
| Route | Purpose |
|-------|---------|
| `/dashboard` | Overview — accounts, stats, gateway health |
| `/positions` | Open positions with P&L |
| `/trade` | Place new orders |
| `/accounts/:id` | Single account details + webhooks |
| `/webhooks` | Webhook token management |
| `/settings` | API key, rotation, session |
| `/billing` | Subscription management |
| `/docs` | Getting started guide |
| `/docs/api` | API reference (47+ endpoints) |
| `/docs/websocket` | WebSocket documentation |
| `/docs/security` | Security guide |

### Admin Only (Requires `isAdmin: true`)
| Route | Purpose |
|-------|---------|
| `/admin` | User management (view, deactivate, rotate keys) |
| `/admin/nodes` | Node agent monitoring & registration |

---

## 🎮 Pages Overview

### Dashboard (`/dashboard`)
- **Stat cards** — Total accounts, active accounts, gateway status
- **Accounts list** — Live status with pause/resume/delete buttons
- **Status indicator** — Real-time WebSocket connection status
- **Auto-refresh** — Updates every 10s, only when page is visible

### Positions (`/positions`)
- **Desktop** — Table view (symbol, volume, entry, current price, P&L)
- **Mobile** — Card view (responsive)
- **Live P&L** — Color-coded (green for profit, red for loss)
- **Close button** — Executes market close with confirmation

### Trade (`/trade`)
- **Account selector** — Choose which MT5 account to trade with
- **Order type** — Market, Limit, or Stop
- **Symbol selector** — Dynamically loaded from gateway
- **Price inputs** — Entry price (for limit/stop orders)
- **Risk inputs** — Stop loss and take profit levels
- **Preview** — Shows order details before submission
- **Confirmation** — Dialog before executing

### Settings (`/settings`)
- **Display API key** — Masked by default, show/hide toggle
- **Gateway URL** — Read-only display of connected gateway
- **Key rotation** — Generate new API key (invalidates old one)
- **Session info** — View when logged in and from which IP

### Billing (`/billing`)
- **Current plan** — Display active subscription or trial status
- **Plan options** — Free, Basic, Pro, Enterprise
- **Payment methods** — Stripe (card) or Crypto (USDT/BTC)
- **Payment history** — List of past transactions
- **Subscription status** — Active, expired, grace period, etc.

### Webhooks (`/webhooks`)
- **Per-account webhooks** — Select account, generate unique URL
- **Copy button** — Quick copy to clipboard
- **Revoke token** — Disable webhook with confirmation
- **Test payload** — Dry-run a webhook with custom JSON payload
- **Format examples** — Shows TradingView alert format

### Account Detail (`/accounts/:id`)
- **Status** — Current state (active, paused, reconnecting, etc.)
- **Node info** — Which Windows VPS is running this account
- **MT5 login** — Broker login number (read-only)
- **Server** — Broker server name (read-only)
- **Webhook management** — Same as Webhooks page, but filtered to this account
- **Created at** — Account creation timestamp

### Admin — Users (`/admin`)
- **User list** — All gateway users with account count
- **Status badge** — Active, deactivated, or admin indicators
- **Rotate key** — Generate new API key for a user (for locked-out recovery)
- **Deactivate user** — Immediately revoke access
- **Promote/demote** — Toggle admin role

### Admin — Nodes (`/admin/nodes`)
- **Node list** — All Windows VPS agents connected to gateway
- **Status** — Online, offline, or error state
- **Capacity** — Bar showing account count vs max capacity
- **Details** — Region, CPU, RAM, last heartbeat timestamp
- **Register node** — Generate node ID & API key for new Windows VPS
- **Node config** — Instructions for setting up Windows VPS with env vars

### Docs — Getting Started (`/docs`)
1. Create a user (POST /api/users)
2. Connect MT5 account (POST /api/accounts)
3. Wait for active status (poll /api/accounts/:id/status)
4. Place a trade (POST /api/orders)
5. TradingView webhooks (generate URL, paste into alert)

### Docs — API Reference (`/docs/api`)
- **47+ endpoints** — All organized by category
- **Color-coded** — GET (blue), POST (green), DELETE (red)
- **Auth type** — Shows required authentication (API Key, Admin, Public)
- **Descriptions** — What each endpoint does
- **Example payloads** — JSON format for requests

### Docs — WebSocket (`/docs/websocket`)
- **Connection** — How to connect (URL, headers, auth)
- **Message format** — JSON structure of incoming messages
- **Event types** — Account status, trade execution, error events
- **Auto-reconnect** — Exponential backoff on disconnect
- **Example** — Connect, send, receive messages

### Docs — Security (`/docs/security`)
- **Credential encryption** — How MT5 passwords are stored
- **API key safety** — Never stored in plaintext
- **TLS/HTTPS** — All communication encrypted
- **Session persistence** — localStorage security considerations
- **Rate limiting** — Per-user, per-IP throttling
- **Input validation** — All user input sanitized

---

## 🎨 Components

### UI Primitives
- **Button** — Variants: primary, ghost, danger, success, warning; sizes: sm, md, lg; loading state
- **Modal** — Centered dialog with backdrop, title, scrollable content
- **Input** — Text input with label, hint, error state, password toggle, monospace mode
- **Alert** — Banner with variants: error, success, warning, info
- **Spinner** — Animated loading indicator (no GIF)
- **EmptyState** — Icon, title, subtitle, optional action button

### Composite Components
- **Badge** — Colored label pill (used for status tags)
- **StatCard** — Metric display with label, value, subtitle, optional icon
- **SectionTitle** — Page header with optional subtitle and right-aligned action slot
- **CodeBlock** — Syntax highlighting with copy button (shows "✓ Copied" feedback)
- **ConfirmDialog** — Confirmation modal for dangerous actions (delete, deactivate)
- **Toast** — Auto-dismiss notification (success, error, warning, info)
- **ErrorBoundary** — Catches render errors and shows fallback UI

---

## 🔌 API Integration

### Authentication
All requests include `X-API-Key` header with the user's API key.

```javascript
// Example
GET /api/accounts
X-API-Key: sk_live_abc123...
```

### Error Handling
- **Network errors** → Toast error notification
- **Non-2xx responses** → Error message from gateway
- **Render crashes** → ErrorBoundary fallback UI

### Real-Time Updates
WebSocket connection at `/ws` subscribes to:
- Account status changes
- Trade execution confirmations
- Error notifications

Auto-reconnects with exponential backoff (1s → 2s → 4s → ... → 30s max).

### Polling
- Dashboard health check: every 30s
- Positions: every 10s (only when page is visible)
- Account status: on-demand

---

## 📱 Responsive Design

- **Desktop (≥768px)** — Full sidebar, tables, multi-column layouts
- **Mobile (<768px)** — Hamburger menu, card layouts, single-column forms
- **All modals** — Centered, scrollable, touch-friendly
- **Flexbox layouts** — Wrap and reflow on smaller screens

Hamburger menu animates from ☰ to ✕ when open.

---

## 🔒 Security

| Area | Implementation |
|------|-----------------|
| **API key** | Sent in `X-API-Key` header only. Masked in UI with show/hide toggle |
| **Session** | localStorage only (no cookies). Auto-cleared on logout |
| **Key rotation** | Invalidates old key immediately. New key shown once |
| **Webhooks** | SHA-256 hashed in DB. Plaintext shown once at creation |
| **Destructive actions** | Require user confirmation (delete, deactivate, revoke) |
| **Input validation** | Client-side checks. Server-side validation on gateway |
| **No PII** | No emails, names, or personal data collected |
| **HTTPS only** | All traffic encrypted in production |

---

## 📚 Project Structure

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Routes, guards, layout
├── theme.js                    # Design tokens
│
├── api/
│   ├── client.js              # HTTP client singleton
│   └── endpoints.js           # REST endpoint functions
│
├── auth/
│   ├── AuthContext.jsx        # Auth state & login logic
│   └── LoginPage.jsx          # Sign in / create account UI
│
├── components/
│   ├── Shared.jsx             # Btn, Modal, Input, Alert, Spinner, EmptyState
│   ├── Badge.jsx              # Badge, StatusDot
│   ├── StatCard.jsx           # Metric card
│   ├── SectionTitle.jsx       # Page header
│   ├── CodeBlock.jsx          # Code display
│   ├── ConfirmDialog.jsx      # Confirmation dialog
│   ├── Toast.jsx              # Toast notifications
│   ├── ErrorBoundary.jsx      # Error fallback
│   └── index.js               # Component exports
│
├── hooks/
│   ├── useData.js             # Data fetching hooks
│   ├── useWebSocket.js        # Real-time connection
│   └── useToast.js            # Toast notifications
│
├── layouts/
│   └── Sidebar.jsx            # Navigation sidebar
│
├── dashboard/
│   ├── Overview.jsx           # Main dashboard
│   ├── Positions.jsx          # Open positions
│   ├── Trade.jsx              # Order placement
│   ├── Settings.jsx           # User settings
│   ├── AccountDetail.jsx      # Account detail
│   ├── Webhooks.jsx           # Webhook management
│   └── Billing.jsx            # Subscription management
│
├── admin/
│   ├── Admin.jsx              # User management
│   └── AdminNodes.jsx         # Node management
│
└── docs/
    ├── GettingStarted.jsx     # Getting started guide
    ├── APIReference.jsx       # API reference
    ├── WebSocket.jsx          # WebSocket docs
    └── Security.jsx           # Security guide
```

---

## 🛠️ Development

### Tech Stack
- **React 18** — UI framework
- **Vite 5** — Build tool & dev server
- **React Router 6** — Client-side routing
- **JavaScript** — No TypeScript (yet)

### Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0"
}
```

### Scripts
```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build (dist/)
npm run preview   # Preview production build locally
```

### Code Style
- **Inline CSS** — All styles in JSX via theme tokens
- **No CSS libraries** — Everything custom
- **No TypeScript** — Pure JavaScript (ES2020+)
- **Functional components** — Hooks only, no classes

---

## 🚦 Connecting to Tonpo Gateway

This dashboard requires a running **Tonpo Gateway** instance.

### Minimum Gateway Setup

Your gateway must have:
- REST API at `GET /health` (public)
- Auth endpoints: `POST /api/users`, `GET /api/users/me`
- Account endpoints: `GET/POST /api/accounts`, etc.
- Trading endpoints: `GET/POST /api/orders`, `GET /api/positions`
- WebSocket at `GET /ws` (with API key in query param)
- Admin endpoints: `GET/POST /api/admin/users`, `/api/admin/nodes`

### Environment
Gateway must be reachable from user's browser (public HTTPS).

```
VITE_GATEWAY_URL=https://gateway.example.com
```

---

## 📖 License

MIT — See LICENSE file

---

## 🤝 Support

- **Documentation** — Built-in at `/docs`
- **Issues** — Report on GitHub
- **Discussions** — GitHub Discussions
- **Email** — support@tonpo.cloud

---

**Ready to trade? Start at `/login`** 🚀
