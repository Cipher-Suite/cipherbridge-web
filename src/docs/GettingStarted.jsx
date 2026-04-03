// src/docs/GettingStarted.jsx
import { T } from '../theme';
import { CodeBlock, SectionTitle } from '../components';

export default function GettingStarted() {
  return (
    <div style={{ maxWidth: 720 }}>
      <SectionTitle sub="Get your trading infrastructure running in 5 minutes">Getting Started</SectionTitle>
      <div style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted, lineHeight: 1.8 }}>
        <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 8 }}>1. Create a User</h3>
        <p style={{ marginBottom: 12 }}>Every interaction starts with an API key. Create one with a single call:</p>
        <CodeBlock title="Create User" code={`curl -X POST https://gateway.cipherbridge.cloud/api/users`} />

        <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 32 }}>2. Connect MT5 Account</h3>
        <p style={{ marginBottom: 12 }}>Your MT5 credentials are encrypted with AES-256-GCM before storage:</p>
        <CodeBlock title="Create Account" code={`curl -X POST https://gateway.cipherbridge.cloud/api/accounts \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"mt5_login":"105745233","mt5_password":"secret","mt5_server":"FBS-Demo"}'`} />

        <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 32 }}>3. Start Trading</h3>
        <p style={{ marginBottom: 12 }}>MT5 is provisioned automatically. Place your first trade:</p>
        <CodeBlock title="Place Order" code={`curl -X POST https://gateway.cipherbridge.cloud/api/orders \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"symbol":"EURUSD","side":"buy","orderType":"market","volume":0.1}'`} />

        <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 32 }}>4. Monitor</h3>
        <p style={{ marginBottom: 12 }}>Check positions, account info, and manage lifecycle:</p>
        <CodeBlock title="List Accounts" code={`curl https://gateway.cipherbridge.cloud/api/accounts -H "X-API-Key: YOUR_KEY"`} />
        <CodeBlock title="Pause / Resume / Delete" code={`curl -X POST /api/accounts/{id}/pause -H "X-API-Key: YOUR_KEY"
curl -X POST /api/accounts/{id}/resume -H "X-API-Key: YOUR_KEY"
curl -X DELETE /api/accounts/{id} -H "X-API-Key: YOUR_KEY"`} />
      </div>
    </div>
  );
}
