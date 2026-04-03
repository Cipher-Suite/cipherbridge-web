// src/auth/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { T } from '../theme';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerResult, setRegisterResult] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) { setError('API key required'); return; }
    setLoading(true); setError('');
    const res = await login(apiKey.trim());
    setLoading(false);
    if (!res.success) setError(res.error);
  };

  const handleRegister = async () => {
    setLoading(true); setError('');
    const res = await register();
    setLoading(false);
    if (res.success) {
      setRegisterResult(res.data);
    } else {
      setError(res.error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: T.bg, padding: 24,
    }}>
      {/* Glow */}
      <div style={{
        position: 'fixed', width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.accent}10 0%, transparent 70%)`,
        top: '20%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 420, position: 'relative',
        animation: 'fadeIn 0.6s ease both',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: '0 auto 16px',
            background: `linear-gradient(135deg, ${T.accent}, ${T.blue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 800, color: T.bg, fontFamily: T.font,
          }}>C</div>
          <h1 style={{ fontFamily: T.font, fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: T.text }}>
            CipherTrade
          </h1>
          <p style={{ fontFamily: T.font, fontSize: 14, color: T.textDim, marginTop: 6 }}>
            Self-hosted MT5 trading infrastructure
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 32,
        }}>
          {/* Tab toggle */}
          <div style={{
            display: 'flex', marginBottom: 28, borderRadius: T.radiusSm,
            border: `1px solid ${T.border}`, overflow: 'hidden',
          }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setRegisterResult(null); }} style={{
                flex: 1, padding: '11px 0', border: 'none', cursor: 'pointer',
                fontFamily: T.font, fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: mode === m ? T.accentBg : 'transparent',
                color: mode === m ? T.accent : T.textDim, transition: 'all 0.2s',
              }}>{m === 'login' ? 'Sign In' : 'Create Account'}</button>
            ))}
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <label style={{
                fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 600,
                display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>API Key</label>
              <input
                type="text" value={apiKey} onChange={e => setApiKey(e.target.value)}
                placeholder="Paste your API key"
                autoFocus
                style={{
                  width: '100%', padding: '14px 16px', background: T.bgInput,
                  border: `1px solid ${error ? T.red + '66' : T.border}`,
                  borderRadius: T.radiusSm, color: T.text, fontFamily: T.mono, fontSize: 14,
                  outline: 'none', transition: 'border 0.2s', marginBottom: 8,
                }}
              />
              <p style={{ fontFamily: T.font, fontSize: 12, color: T.textDim, marginBottom: 20 }}>
                Your API key from <code style={{ color: T.accent }}>POST /api/users</code> or the Telegram bot.
              </p>

              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: T.radiusSm, marginBottom: 16,
                  background: T.redBg, border: `1px solid ${T.red}33`,
                  fontFamily: T.font, fontSize: 13, color: T.red,
                }}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px 0', borderRadius: T.radiusSm, border: 'none',
                background: T.accent, color: T.bg, fontFamily: T.font, fontSize: 15, fontWeight: 800,
                cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.2s',
              }}>{loading ? 'Connecting...' : 'Sign In'}</button>
            </form>
          ) : (
            <div>
              {registerResult ? (
                <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                  <div style={{
                    padding: '14px 16px', borderRadius: T.radiusSm, marginBottom: 20,
                    background: T.greenBg, border: `1px solid ${T.green}33`,
                    fontFamily: T.font, fontSize: 13, color: T.green,
                  }}>Account created successfully!</div>

                  {[
                    ['User ID', registerResult.userId],
                    ['API Key', registerResult.apiKey],
                  ].map(([label, value]) => (
                    <div key={label} style={{ marginBottom: 16 }}>
                      <label style={{
                        fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 600,
                        display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>{label}</label>
                      <div style={{
                        padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`,
                        borderRadius: T.radiusSm, fontFamily: T.mono, fontSize: 12, color: T.accent,
                        wordBreak: 'break-all',
                      }}>{value}</div>
                    </div>
                  ))}

                  <div style={{
                    padding: '12px 14px', borderRadius: T.radiusSm, marginBottom: 20,
                    background: T.orangeBg, border: `1px solid ${T.orange}33`,
                    fontFamily: T.font, fontSize: 12, color: T.orange,
                  }}>Save your API key — it won't be shown again.</div>

                  <p style={{ fontFamily: T.font, fontSize: 13, color: T.textDim, textAlign: 'center' }}>
                    You're now signed in. Redirecting to dashboard...
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
                    Creates a new gateway user with a fresh API key. No email or password needed — your API key <span style={{ fontWeight: 700, color: T.text }}>is</span> your identity.
                  </p>

                  {error && (
                    <div style={{
                      padding: '10px 14px', borderRadius: T.radiusSm, marginBottom: 16,
                      background: T.redBg, border: `1px solid ${T.red}33`,
                      fontFamily: T.font, fontSize: 13, color: T.red,
                    }}>{error}</div>
                  )}

                  <button onClick={handleRegister} disabled={loading} style={{
                    width: '100%', padding: '14px 0', borderRadius: T.radiusSm, border: 'none',
                    background: T.accent, color: T.bg, fontFamily: T.font, fontSize: 15, fontWeight: 800,
                    cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1,
                  }}>{loading ? 'Creating...' : 'Generate API Key'}</button>
                </div>
              )}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontFamily: T.font, fontSize: 12, color: T.textDim }}>
          Your credentials never leave your infrastructure.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
