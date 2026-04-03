// src/dashboard/Settings.jsx
import { T } from '../theme';
import { SectionTitle } from '../components';
import { useAuth } from '../auth/AuthContext';

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: 600 }}>
      <SectionTitle sub="API keys, gateway configuration, and preferences">Settings</SectionTitle>

      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 20 }}>API Key</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Key</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={user?.apiKey || '••••••••••••••••'} readOnly
              style={{ flex: 1, padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.textMuted, fontFamily: T.mono, fontSize: 13, outline: 'none' }} />
          </div>
        </div>
        <div>
          <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gateway</label>
          <input value="https://gateway.cipherbridge.cloud" readOnly
            style={{ width: '100%', padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.accent, fontFamily: T.mono, fontSize: 13, outline: 'none' }} />
        </div>
      </div>

      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 20 }}>Session</h3>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.textMuted, marginBottom: 16 }}>
          User ID: <code style={{ fontFamily: T.mono, color: T.accent }}>{user?.userId || 'unknown'}</code>
        </p>
        <button onClick={logout} style={{
          padding: '12px 24px', borderRadius: T.radiusSm, border: `1px solid ${T.red}44`,
          background: T.redBg, color: T.red, fontFamily: T.font, fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>Sign Out</button>
      </div>
    </div>
  );
}
