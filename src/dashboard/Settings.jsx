// src/dashboard/Settings.jsx
import { useState } from 'react';
import { T } from '../theme';
import { SectionTitle, Alert, Btn, Input } from '../components';
import { rotateMyKey } from '../api/endpoints';
import { useAuth } from '../auth/AuthContext';
import { GATEWAY_URL } from '../theme';

export default function Settings() {
  const { user, logout, login } = useAuth();
  const [rotating, setRotating] = useState(false);
  const [newKey,   setNewKey]   = useState(null);
  const [copied,   setCopied]   = useState(false);
  const [showKey,  setShowKey]  = useState(false);

  const handleRotate = async () => {
    if (!window.confirm('This will invalidate your current key immediately. Any running bots using the old key will disconnect. Continue?')) return;
    setRotating(true); setNewKey(null);
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

  const copyKey = (k) => {
    navigator.clipboard?.writeText(k);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const card = { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 24, marginBottom: 16 };
  const sectionHead = { fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 18 };

  return (
    <div style={{ maxWidth: 580 }}>
      <SectionTitle sub="API key, gateway configuration, and session">Settings</SectionTitle>

      {/* API Key */}
      <div style={card}>
        <h3 style={sectionHead}>API Key</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Key</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={user?.apiKey || '••••••••••••••••'}
              readOnly
              style={{ flex: 1, padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.textMuted, fontFamily: T.mono, fontSize: 13, outline: 'none' }}
            />
            <Btn size="sm" variant="ghost" onClick={() => setShowKey(v => !v)}>{showKey ? 'Hide' : 'Show'}</Btn>
            {user?.apiKey && <Btn size="sm" variant="ghost" onClick={() => copyKey(user.apiKey)}>{copied ? '✓' : 'Copy'}</Btn>}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gateway URL</label>
          <input value={GATEWAY_URL} readOnly style={{ width: '100%', padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.accent, fontFamily: T.mono, fontSize: 13, outline: 'none' }} />
        </div>

        {newKey && (
          <div style={{ marginBottom: 16, padding: 16, background: T.orangeBg, border: `1px solid ${T.orange}44`, borderRadius: T.radiusSm, animation: 'fadeUp 0.2s ease' }}>
            <p style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.orange, marginBottom: 8 }}>
              ⚠ New key generated — copy it now, it will not be shown again.
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <code style={{ flex: 1, fontFamily: T.mono, fontSize: 12, color: T.text, wordBreak: 'break-all' }}>{newKey}</code>
              <Btn size="sm" variant="ghost" onClick={() => copyKey(newKey)}>{copied ? '✓' : 'Copy'}</Btn>
            </div>
          </div>
        )}

        <Btn variant="ghost" loading={rotating} onClick={handleRotate}>
          ↺ Rotate API Key
        </Btn>
        <p style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, marginTop: 8 }}>
          Generates a new key and immediately invalidates the old one. If locked out, ask your gateway admin to rotate using your User ID.
        </p>
      </div>

      {/* Session */}
      <div style={card}>
        <h3 style={sectionHead}>Session</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            ['User ID',   user?.userId || '—'],
            ['Signed In', user?.loggedInAt ? new Date(user.loggedInAt).toLocaleDateString() : '—'],
          ].map(([l, v]) => (
            <div key={l} style={{ background: T.bgInput, borderRadius: T.radiusSm, padding: '12px 14px' }}>
              <div style={{ fontFamily: T.font, fontSize: 10, color: T.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{l}</div>
              <code style={{ fontFamily: T.mono, fontSize: 12, color: T.text, wordBreak: 'break-all' }}>{v}</code>
            </div>
          ))}
        </div>
        <Btn variant="danger" onClick={logout}>Sign Out</Btn>
      </div>

      {/* About */}
      <div style={card}>
        <h3 style={sectionHead}>About</h3>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `linear-gradient(135deg, ${T.accent}, ${T.blue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900, color: T.bg, flexShrink: 0,
          }}>T</div>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Tonpo Gateway</div>
            <div style={{ fontFamily: T.font, fontSize: 12, color: T.textDim }}>Self-hosted MT5 trading infrastructure</div>
          </div>
        </div>
      </div>
    </div>
  );
}
