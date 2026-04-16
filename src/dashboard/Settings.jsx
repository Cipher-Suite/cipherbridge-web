// src/dashboard/Settings.jsx
import { useState } from 'react';
import { T } from '../theme';
import { SectionTitle } from '../components';
import { rotateMyKey } from '../api/endpoints';
import { useAuth } from '../auth/AuthContext';

export default function Settings() {
  const { user, logout, login } = useAuth();
  const [rotating, setRotating] = useState(false);
  const [newKey, setNewKey]     = useState(null);

  const handleRotate = async () => {
    if (!confirm('This will invalidate your current key immediately. Continue?')) return;
    setRotating(true);
    setNewKey(null);
    try {
      const data = await rotateMyKey();
      setNewKey(data.api_key);
      await login(data.api_key);
    } catch (e) {
      alert(`Rotation failed: ${e.message}`);
    } finally {
      setRotating(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <SectionTitle sub="API keys, gateway configuration, and preferences">Settings</SectionTitle>

      {/* ── API Key card ─────────────────────────────────────────────────── */}
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 20 }}>API Key</h3>

        {/* Current key (read-only display) */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Key</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={user?.apiKey || '••••••••••••••••'}
              readOnly
              style={{ flex: 1, padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.textMuted, fontFamily: T.mono, fontSize: 13, outline: 'none' }}
            />
          </div>
        </div>

        {/* Gateway URL */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gateway</label>
          <input
            value="https://gateway.cipherbridge.cloud"
            readOnly
            style={{ width: '100%', padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.accent, fontFamily: T.mono, fontSize: 13, outline: 'none' }}
          />
        </div>

        {/* New key alert — shown once after rotation */}
        {newKey && (
          <div style={{ marginBottom: 16, padding: 16, background: T.orangeBg, border: `1px solid ${T.orange}44`, borderRadius: T.radiusSm }}>
            <p style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.orange, margin: '0 0 8px 0' }}>
              ⚠ New key — copy it now, it will not be shown again
            </p>
            <code style={{ fontFamily: T.mono, fontSize: 13, color: T.text, wordBreak: 'break-all' }}>
              {newKey}
            </code>
          </div>
        )}

        {/* Rotate button */}
        <button
          onClick={handleRotate}
          disabled={rotating}
          style={{
            padding: '10px 20px', borderRadius: T.radiusSm,
            border: `1px solid ${T.border}`, background: T.bgInput,
            color: rotating ? T.textDim : T.text, fontFamily: T.font,
            fontSize: 13, fontWeight: 600, cursor: rotating ? 'not-allowed' : 'pointer',
          }}
        >
          {rotating ? 'Rotating…' : 'Rotate API Key'}
        </button>
        <p style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, marginTop: 8, marginBottom: 0 }}>
          Generates a new key and immediately invalidates the old one.
          If you are locked out, ask your admin to rotate using your User ID.
        </p>
      </div>

      {/* ── Session card ─────────────────────────────────────────────────── */}
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 20 }}>Session</h3>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.textMuted, marginBottom: 16 }}>
          User ID: <code style={{ fontFamily: T.mono, color: T.accent }}>{user?.userId || 'unknown'}</code>
        </p>
        <button
          onClick={logout}
          style={{
            padding: '12px 24px', borderRadius: T.radiusSm, border: `1px solid ${T.red}44`,
            background: T.redBg, color: T.red, fontFamily: T.font, fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
