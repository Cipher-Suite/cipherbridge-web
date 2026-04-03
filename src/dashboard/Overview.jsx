// src/dashboard/Overview.jsx
import { useState } from 'react';
import { T } from '../theme';
import { Badge, StatCard, SectionTitle } from '../components';
import { useAccounts, useHealth } from '../hooks/useData';

function NewAccountModal({ onClose, onCreate }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login || !password || !server) { setError('All fields required'); return; }
    setLoading(true); setError('');
    try {
      const data = await onCreate(login, password, server);
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 440,
        background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 32,
      }}>
        <h3 style={{ fontFamily: T.font, fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 24 }}>
          Connect MT5 Account
        </h3>

        {result ? (
          <div>
            <div style={{ padding: '14px', borderRadius: T.radiusSm, background: T.greenBg, border: `1px solid ${T.green}33`, fontFamily: T.font, fontSize: 13, color: T.green, marginBottom: 16 }}>
              Account created! Status: {result.status}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Auth Token (save this!)</label>
              <div style={{ padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, fontFamily: T.mono, fontSize: 11, color: T.orange, wordBreak: 'break-all' }}>
                {result.auth_token}
              </div>
            </div>
            <button onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: T.radiusSm, border: 'none', background: T.accent, color: T.bg, fontFamily: T.font, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[
              { label: 'MT5 Login', value: login, set: setLogin, placeholder: '105745233' },
              { label: 'MT5 Password', value: password, set: setPassword, placeholder: '••••••••', type: 'password' },
              { label: 'MT5 Server', value: server, set: setServer, placeholder: 'FBS-Demo' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                <input type={f.type || 'text'} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                  style={{ width: '100%', padding: '12px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.mono, fontSize: 14, outline: 'none' }} />
              </div>
            ))}
            {error && <div style={{ padding: '10px', borderRadius: T.radiusSm, background: T.redBg, border: `1px solid ${T.red}33`, fontFamily: T.font, fontSize: 13, color: T.red, marginBottom: 16 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMuted, fontFamily: T.font, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', borderRadius: T.radiusSm, border: 'none', background: T.accent, color: T.bg, fontFamily: T.font, fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Creating...' : 'Connect'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Overview() {
  const { accounts, loading, error, create, pause, resume, remove } = useAccounts();
  const health = useHealth();
  const [showModal, setShowModal] = useState(false);

  const activeCount = accounts.filter(a => a.status === 'active').length;
  const gatewayStatus = health?.status === 'healthy' ? 'Online' : health?.status || 'Checking...';

  return (
    <div>
      <SectionTitle sub="Real-time overview of your trading infrastructure">Dashboard</SectionTitle>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Total Accounts" value={loading ? '...' : accounts.length} sub={`${activeCount} active`} color={T.accent} />
        <StatCard label="Gateway" value={gatewayStatus} sub={health?.version ? `v${health.version}` : ''} color={gatewayStatus === 'Online' ? T.green : T.orange} />
        <StatCard label="Active Users" value={health?.metrics?.active_users ?? '...'} color={T.blue} />
        <StatCard label="WS Connections" value={health?.metrics?.active_connections ?? '...'} color={T.purple} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text }}>Accounts</h3>
        <button onClick={() => setShowModal(true)} style={{
          fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.bg, background: T.accent,
          border: 'none', padding: '8px 20px', borderRadius: T.radiusSm, cursor: 'pointer',
        }}>+ New Account</button>
      </div>

      {error && <div style={{ padding: '12px 16px', borderRadius: T.radiusSm, background: T.redBg, border: `1px solid ${T.red}33`, fontFamily: T.font, fontSize: 13, color: T.red, marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ fontFamily: T.font, fontSize: 14, color: T.textDim, padding: 40, textAlign: 'center' }}>Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 48, textAlign: 'center' }}>
          <p style={{ fontFamily: T.font, fontSize: 15, color: T.textMuted, marginBottom: 16 }}>No accounts yet. Connect your first MT5 account to get started.</p>
          <button onClick={() => setShowModal(true)} style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.bg, background: T.accent, border: 'none', padding: '12px 28px', borderRadius: T.radiusSm, cursor: 'pointer' }}>Connect MT5</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {accounts.map((a, i) => (
            <div key={a.account_id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '16px 20px', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius,
              fontFamily: T.font, fontSize: 13,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <span style={{ color: T.textDim, fontFamily: T.mono, fontSize: 11 }}>{a.account_id?.slice(0, 8)}...</span>
                <span style={{ color: T.text, fontWeight: 600 }}>{a.mt5_login}</span>
                <span style={{ color: T.textMuted }}>{a.mt5_server}</span>
                <Badge color={a.status === 'active' ? T.green : a.status === 'paused' ? T.orange : T.textDim}>{a.status}</Badge>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {a.status === 'active' && (
                  <button onClick={() => pause(a.account_id)} style={{ background: T.orangeBg, border: `1px solid ${T.orange}33`, color: T.orange, borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontFamily: T.font, fontSize: 11, fontWeight: 600 }}>Pause</button>
                )}
                {a.status === 'paused' && (
                  <button onClick={() => resume(a.account_id)} style={{ background: T.greenBg, border: `1px solid ${T.green}33`, color: T.green, borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontFamily: T.font, fontSize: 11, fontWeight: 600 }}>Resume</button>
                )}
                <button onClick={() => { if (confirm('Delete this account?')) remove(a.account_id); }} style={{ background: T.redBg, border: `1px solid ${T.red}33`, color: T.red, borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontFamily: T.font, fontSize: 11, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <NewAccountModal onClose={() => setShowModal(false)} onCreate={create} />}
    </div>
  );
}
