// src/docs/GettingStarted.jsx
import { T } from '../theme';
import { CodeBlock, SectionTitle } from '../components';
import { GATEWAY_URL } from '../theme';
const BASE = GATEWAY_URL;

export default function GettingStarted() {
  return (
    <div style={{ maxWidth: 720 }}>
      <SectionTitle sub="Get your Tonpo trading infrastructure running in minutes">Getting Started</SectionTitle>
      <div style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted, lineHeight: 1.85 }}>

        <h3 style={{ color: T.text, fontSize: 15, fontWeight: 700, marginBottom: 10, marginTop: 0 }}>1. Create a User</h3>
        <p style={{ marginBottom: 10 }}>Every interaction with Tonpo Gateway starts with an API key. One call creates your account:</p>
        <CodeBlock language="bash" title="Create User" code={`curl -X POST ${BASE}/api/users`} />
        <p style={{ marginBottom: 24 }}>The response contains your <code style={{ color: T.accent }}>api_key</code>. Save it — it is shown once.</p>

        <h3 style={{ color: T.text, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>2. Connect MT5 Account</h3>
        <p style={{ marginBottom: 10 }}>Credentials are encrypted with AES-256-GCM before storage. The node agent provisions an isolated MT5 instance automatically:</p>
        <CodeBlock language="bash" title="Create Account" code={`curl -X POST ${BASE}/api/accounts \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"mt5_login":"105745233","mt5_password":"secret","mt5_server":"FBS-Demo"}'`} />

        <h3 style={{ color: T.text, fontSize: 15, fontWeight: 700, marginBottom: 10, marginTop: 32 }}>3. Wait for Active Status</h3>
        <p style={{ marginBottom: 10 }}>The gateway dispatches the provision command to the Windows node agent, which launches an isolated MT5 instance. This takes 1–3 minutes on first run.</p>
        <CodeBlock language="bash" title="Poll Status" code={`curl ${BASE}/api/accounts/{id}/status -H "X-API-Key: YOUR_KEY"`} />

        <h3 style={{ color: T.text, fontSize: 15, fontWeight: 700, marginBottom: 10, marginTop: 32 }}>4. Place a Trade</h3>
        <CodeBlock language="bash" title="Place Order" code={`curl -X POST ${BASE}/api/orders \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"symbol":"EURUSD","side":"buy","orderType":"market","volume":0.01}'`} />

        <h3 style={{ color: T.text, fontSize: 15, fontWeight: 700, marginBottom: 10, marginTop: 32 }}>5. TradingView Webhooks</h3>
        <p style={{ marginBottom: 10 }}>Generate a webhook URL for automated signal execution:</p>
        <CodeBlock language="bash" title="Create Webhook" code={`curl -X POST ${BASE}/api/v1/webhooks \\
  -H "X-API-Key: YOUR_KEY" \\
  -d '{"account_id":"YOUR_ACCOUNT_ID","label":"EURUSD scalper"}'`} />
        <p style={{ marginBottom: 10 }}>Paste the returned <code style={{ color: T.accent }}>webhook_url</code> into TradingView → Alert → Webhook URL.</p>
        <CodeBlock language="json" title="TradingView Alert Message" code={`{
  "action":     "{{strategy.order.action}}",
  "symbol":     "{{ticker}}",
  "volume":     0.01,
  "order_type": "market",
  "sl_pips":    50,
  "tp_pips":    100
}`} />

        <h3 style={{ color: T.text, fontSize: 15, fontWeight: 700, marginBottom: 10, marginTop: 32 }}>Python SDK</h3>
        <CodeBlock language="python" title="tonpo-py" code={`pip install tonpo-py

from tonpo import Client

client = Client(api_key="YOUR_KEY")
accounts = client.list_accounts()

with client.for_account(accounts[0]["id"]) as conn:
    conn.place_order(symbol="EURUSD", side="buy", volume=0.01)`} />
      </div>
    </div>
  );
}
