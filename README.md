# CipherTrade Web

Dashboard + Documentation for the CipherTrade self-hosted MT5 trading platform.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Opens at http://localhost:3000

## Project Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Routes + auth guard
├── theme.js                 # Design tokens (colors, fonts, radii)
│
├── api/
│   ├── client.js            # HTTP client with auth header
│   └── endpoints.js         # All API functions
│
├── auth/
│   ├── AuthContext.jsx       # Auth state + localStorage persistence
│   └── LoginPage.jsx        # Sign in / register page
│
├── components/
│   ├── index.js             # Barrel export
│   ├── Badge.jsx            # Status pill
│   ├── StatCard.jsx         # Metric card
│   └── CodeBlock.jsx        # Code block with copy
│
├── hooks/
│   └── useData.js           # useAccounts, usePositions, useHealth
│
├── layouts/
│   └── Sidebar.jsx          # Sidebar with App/Docs toggle
│
├── dashboard/
│   ├── Overview.jsx          # Accounts list, stats, new account modal
│   ├── Positions.jsx         # Open positions with close button
│   ├── Trade.jsx             # Order form (market/limit/stop)
│   └── Settings.jsx          # API key, session, logout
│
└── docs/
    ├── GettingStarted.jsx    # 4-step quickstart
    ├── APIReference.jsx      # All 19 endpoints
    ├── WebSocket.jsx         # WS protocol + message formats
    └── Security.jsx          # 6 security pillars
```

## Configuration

Set `VITE_GATEWAY_URL` in `.env` to point to your gateway:

```
VITE_GATEWAY_URL=https://gateway.cipherbridge.cloud
```

## Build for Production

```bash
npm run build
```

Output in `dist/` — deploy to any static host (Nginx, Vercel, Cloudflare Pages).
