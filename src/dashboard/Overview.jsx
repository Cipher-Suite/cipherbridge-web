// src/dashboard/Overview.jsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { StatCard, SectionTitle, StatusDot, Btn, Modal, Input, Alert, EmptyState } from '../components';
import { useAccounts, useHealth } from '../hooks/useData';
import { useGatewayWS } from '../hooks/useWebSocket';

function NewAccountModal({ open, onClose, onCreate }) {
  const [login,    setLogin]    = useState('');
  const [password, setPassword] = useState('');
  const [server,   setServer]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [result,   setResult]   = useState(null);

  const reset = () => { setLogin(''); setPassword(''); setServer(''); setError(''); setResult(null); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login.trim() || !password.trim() || !server.trim()) { setError('All fields are required'); return; }
    setLoading(true); setError('');
    try {
      const data = await onCreate(login.trim(), password, server.trim());
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Connect MT5 Account">
      {result ? (
        <>
          <Alert variant="success">Account connected successfully. Status: <strong>{result.status}</strong></Alert>
          {result.auth_token && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Auth Token (save once)</label>
              <div style={{ padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, fontFamily: T.mono, fontSize: 11, color: T.orange, wordBreak: 'break-all' }}>{result.auth_token}</div>
            </div>
          )}
          <Btn onClick={handleClose} style={{ width: '100%' }}>Done</Btn>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input label="MT5 Login" value={login} onChange={setLogin} placeholder="105745233" mono />
          <Input label="MT5 Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" />
          <Input label="MT5 Server" value={server} onChange={setServer} placeholder="FBS-Demo" mono />
          {error && <Alert>{error}</Alert>}
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn type="button" variant="ghost" onClick={handleClose} style={{ flex: 1 }}>Cancel</Btn>
            <Btn type="submit" loading={loading} style={{ flex: 1 }}>Connect</Btn>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default function Overview() {
  const navigate = useNavigate();
  const { accounts, loading, error, create, pause, resume, remove, updateStatus, refresh } = useAccounts();
  const health = useHealth();
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  // Live WS — update account statuses in real-time
  const handleWsMessage = useCallback((msg) => {
    if (msg?.type === 'account_status' && msg?.data?.account_id) {
      updateStatus(msg.data.account_id, msg.data.status);
    }
  }, [updateStatus]);
  const { connected: wsConnected } = useGatewayWS({ onMessage: handleWsMessage });

  const act = async (id, fn) => {
    setActionLoading(p => ({ ...p, [id]: true }));
    try { await fn(id); } catch {}
    setActionLoading(p => ({ ...p, [id]: false }));
  };

  const activeCount   = accounts.filter(a => a.status === 'active').length;
  const gatewayOnline = health?.status === 'healthy';

  return (
    <div>
      <SectionTitle
        sub="Real-time overview of your trading infrastructure"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: wsConnected ? T.green : T.textDim, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: wsConnected ? T.green : T.textDim, display: 'inline-block', boxShadow: wsConnected ? `0 0 6px ${T.green}` : 'none' }} />
              {wsConnected ? 'Live' : 'Offline'}
            </span>
            <Btn size="sm" onClick={() => setShowModal(true)}>+ New Account</Btn>
          </div>
        }
      >Dashboard</SectionTitle>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatCard label="Accounts" value={loading ? '—' : accounts.length} sub={`${activeCount} active`} color={T.accent} />
        <StatCard label="Gateway" value={gatewayOnline ? 'Online' : (health ? 'Degraded' : '…')} sub={health?.version ? `v${health.version}` : ''} color={gatewayOnline ? T.green : T.orange} />
        <StatCard label="Connections" value={health?.metrics?.active_connections ?? '—'} sub="WebSocket" color={T.blue} />
        <StatCard label="Bridge" value={health?.metrics?.bridge_connections ?? '—'} sub="MT5 bridges" color={T.purple} />
      </div>

      {/* Accounts list */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text }}>Accounts</h3>
        <Btn size="sm" variant="ghost" onClick={refresh}>↻ Refresh</Btn>
      </div>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <div style={{ width: 24, height: 24, border: `2px solid ${T.border}`, borderTopColor: T.accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState
          icon="⬡"
          title="No accounts yet"
          sub="Connect your first MT5 account to get started."
          action={<Btn onClick={() => setShowModal(true)}>Connect MT5</Btn>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {accounts.map(a => {
            const id = a.id || a.account_id;
            const busy = !!actionLoading[id];
            return (
              <div
                key={id}
                onClick={() => navigate(`/accounts/${id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 18px', background: T.bgCard,
                  border: `1px solid ${T.border}`, borderRadius: T.radius,
                  cursor: 'pointer', transition: T.transition,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.borderFocus}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
              >
                {/* Left: account info */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flexWrap: 'wrap' }}>
                  <code style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, flexShrink: 0 }}>
                    {id?.slice(0, 8)}…
                  </code>
                  <span style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.text }}>
                    {a.mt5_login}
                  </span>
                  <span style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted }}>
                    {a.mt5_server}
                  </span>
                  <StatusDot status={a.status} />
                </div>

                {/* Right: actions */}
                <div
                  onClick={e => e.stopPropagation()}
                  style={{ display: 'flex', gap: 6, flexShrink: 0 }}
                >
                  {a.status === 'active' && (
                    <Btn size="sm" variant="warning" loading={busy} onClick={() => act(id, pause)}>Pause</Btn>
                  )}
                  {(a.status === 'paused' || a.status === 'disconnected') && (
                    <Btn size="sm" variant="success" loading={busy} onClick={() => act(id, resume)}>Resume</Btn>
                  )}
                  <Btn
                    size="sm" variant="danger"
                    loading={busy}
                    onClick={() => { if (window.confirm('Delete this account? This will deprovision the MT5 instance.')) act(id, remove); }}
                  >Delete</Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NewAccountModal open={showModal} onClose={() => setShowModal(false)} onCreate={create} />
    </div>
  );
}
