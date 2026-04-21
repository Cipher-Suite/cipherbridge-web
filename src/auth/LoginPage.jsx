// src/auth/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { T } from '../theme';

export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mode,   setMode]   = useState('login');
  const [apiKey, setApiKey] = useState('');
  const [error,  setError]  = useState('');
  const [loading, setLoading] = useState(false);
  const [regResult, setRegResult] = useState(null);
  const [keyCopied,  setKeyCopied]  = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmed = apiKey.trim();
    if (!trimmed) { setError('API key is required'); return; }
    // Basic sanity check — prevent accidental whitespace or truncated keys
    if (trimmed.length < 16) { setError('API key looks too short'); return; }
    setLoading(true); setError('');
    const res = await login(trimmed);
    setLoading(false);
    if (!res.success) setError(res.error || 'Invalid API key');
  };

  const handleRegister = async () => {
    setLoading(true); setError('');
    const res = await register();
    setLoading(false);
    if (res.success) setRegResult(res.data);
    else setError(res.error || 'Registration failed');
  };

  const copyKey = (key) => {
    navigator.clipboard?.writeText(key);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const switchMode = (m) => { setMode(m); setError(''); setRegResult(null); setApiKey(''); };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: T.bg, padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${T.accent}08 0%, transparent 65%)`,
        top: '10%', left: '50%', transform: 'translateX(-50%)',
      }} />
      <div style={{
        position: 'fixed', width: 300, height: 300, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${T.blue}06 0%, transparent 65%)`,
        bottom: '15%', right: '20%',
      }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', animation: 'fadeUp 0.5s ease both' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto 14px',
            background: `linear-gradient(135deg, ${T.accent} 0%, ${T.blue} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 900, color: T.bg, fontFamily: T.font,
            boxShadow: T.shadowAccent,
          }}>T</div>
          <h1 style={{ fontFamily: T.font, fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: '-0.03em', marginBottom: 6 }}>
            Tonpo Gateway
          </h1>
          <p style={{ fontFamily: T.font, fontSize: 13, color: T.textDim }}>
            Self-hosted MT5 trading infrastructure
          </p>
        </div>

        {/* Card */}
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 28, boxShadow: T.shadow }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', marginBottom: 24, background: T.bgInput, borderRadius: T.radiusSm, padding: 3, gap: 3 }}>
            {[['login', 'Sign In'], ['register', 'New Account']].map(([m, label]) => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: '9px 0', border: 'none', cursor: 'pointer', borderRadius: 6,
                fontFamily: T.font, fontSize: 12, fontWeight: 700, letterSpacing: '0.02em',
                background: mode === m ? T.bgCard : 'transparent',
                color: mode === m ? T.text : T.textDim,
                transition: T.transition,
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
              }}>{label}</button>
            ))}
          </div>

          {/* Login form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} style={{ animation: 'fadeIn 0.2s ease' }}>
              <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.07em' }}>API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => { setApiKey(e.target.value); setError(''); }}
                placeholder="Paste your API key"
                autoFocus
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '12px 14px', background: T.bgInput,
                  border: `1px solid ${error ? T.red + '55' : T.border}`,
                  borderRadius: T.radiusSm, color: T.text, fontFamily: T.mono, fontSize: 14,
                  outline: 'none', transition: T.transition, marginBottom: 8,
                }}
              />
              <p style={{ fontFamily: T.font, fontSize: 12, color: T.textDim, marginBottom: 20, lineHeight: 1.5 }}>
                Your key from <code style={{ color: T.accent, background: T.accentBg, padding: '1px 5px', borderRadius: 4 }}>POST /api/users</code> or your Telegram bot.
              </p>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: T.radiusSm, marginBottom: 16, background: T.redBg, border: `1px solid ${T.red}33`, fontFamily: T.font, fontSize: 13, color: T.red }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px 0', borderRadius: T.radiusSm, border: 'none',
                background: loading ? T.accentDim : T.accent, color: T.bg,
                fontFamily: T.font, fontSize: 14, fontWeight: 800,
                cursor: loading ? 'wait' : 'pointer', transition: T.transition,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {loading && <span style={{ width: 14, height: 14, border: `2px solid ${T.bg}44`, borderTopColor: T.bg, borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
                {loading ? 'Connecting…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Register */}
          {mode === 'register' && (
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              {regResult ? (
                <>
                  <div style={{ padding: '12px 14px', borderRadius: T.radiusSm, marginBottom: 20, background: T.greenBg, border: `1px solid ${T.green}33`, fontFamily: T.font, fontSize: 13, color: T.green }}>
                    Account created — you are now signed in.
                  </div>

                  {[['User ID', regResult.userId], ['API Key', regResult.apiKey]].map(([label, val]) => (
                    <div key={label} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</label>
                        {label === 'API Key' && (
                          <button onClick={() => copyKey(val)} style={{ background: 'none', border: 'none', color: keyCopied ? T.accent : T.textDim, cursor: 'pointer', fontFamily: T.mono, fontSize: 11 }}>
                            {keyCopied ? '✓ copied' : 'copy'}
                          </button>
                        )}
                      </div>
                      <div style={{ padding: '10px 12px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, fontFamily: T.mono, fontSize: 11, color: T.accent, wordBreak: 'break-all' }}>
                        {val}
                      </div>
                    </div>
                  ))}

                  <div style={{ padding: '11px 14px', borderRadius: T.radiusSm, background: T.orangeBg, border: `1px solid ${T.orange}33`, fontFamily: T.font, fontSize: 12, color: T.orange }}>
                    ⚠ Save your API key now — it will not be shown again.
                  </div>
                </>
              ) : (
                <>
                  <p style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
                    Generates a new gateway user with a fresh API key. No email or password needed — your key <strong style={{ color: T.text }}>is</strong> your identity.
                  </p>

                  {error && (
                    <div style={{ padding: '10px 14px', borderRadius: T.radiusSm, marginBottom: 16, background: T.redBg, border: `1px solid ${T.red}33`, fontFamily: T.font, fontSize: 13, color: T.red }}>
                      {error}
                    </div>
                  )}

                  <button onClick={handleRegister} disabled={loading} style={{
                    width: '100%', padding: '13px 0', borderRadius: T.radiusSm, border: 'none',
                    background: T.accent, color: T.bg, fontFamily: T.font, fontSize: 14, fontWeight: 800,
                    cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1, transition: T.transition,
                  }}>
                    {loading ? 'Generating…' : 'Generate API Key'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontFamily: T.font, fontSize: 11, color: T.textDim }}>
          Your credentials never leave your infrastructure.
        </p>
      </div>
    </div>
  );
}
