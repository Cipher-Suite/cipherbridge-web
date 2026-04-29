// src/docs/Security.jsx
import { T } from '../theme';
import { SectionTitle } from '../components';

const items = [
  { icon: '🔐', title: 'Credential Encryption', color: T.accent, desc: 'MT5 passwords encrypted with AES-256-GCM before storage. Decrypted only in-memory when delivering to the bridge DLL over WebSocket.' },
  { icon: '🔑', title: 'API Key Hashing', color: T.blue, desc: 'API keys are SHA-256 hashed. The raw key is shown only once at creation. Stored hashes cannot be reversed.' },
  { icon: '⏱️', title: 'WebSocket Tokens', color: T.orange, desc: 'One-time use, 60-second expiry. Generated per bridge registration. Cannot be reused or guessed.' },
  { icon: '🛡️', title: 'Zero Inbound Ports', color: T.purple, desc: 'Bridge DLLs and node agents connect outbound to the gateway. No ports open on your trading servers.' },
  { icon: '🌐', title: 'TLS Everywhere', color: T.green, desc: 'All connections use TLS 1.3 via Nginx + Let\'s Encrypt. No plaintext traffic between any component.' },
  { icon: '📝', title: 'Audit Log', color: T.yellow, desc: 'Every account lifecycle event is recorded: creation, connection, disconnection, pause, resume, deletion.' },
];

export default function Security() {
  return (
    <div style={{ maxWidth: 720 }}>
      <SectionTitle sub="How Tonpo protects your credentials and data">Security Model</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <h4 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: item.color }}>{item.title}</h4>
            </div>
            <p style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
