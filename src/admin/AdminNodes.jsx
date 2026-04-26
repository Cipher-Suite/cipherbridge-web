// src/admin/AdminNodes.jsx
import { useState, useEffect, useCallback } from 'react';
import { T } from '../theme';
import { SectionTitle, Badge, Btn, Alert, EmptyState, Spinner } from '../components';
import { adminRegisterNode } from '../api/endpoints';
import { adminListNodes } from '../api/endpoints';

function useNodes() {
  const [nodes,   setNodes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Admin nodes endpoint — may return { nodes: [...] } or array directly
      const { nodes } = await adminListNodes();
      setNodes(nodes || []);
      setError(null);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { nodes, loading, error, refresh };
}

export default function AdminNodes() {
  const { nodes, loading, error, refresh } = useNodes();
  const [showReg,  setShowReg]  = useState(false);
  const [regData,  setRegData]  = useState({ name: '', region: 'eu', max_accounts: 20 });
  const [regLoading, setRegLoading] = useState(false);
  const [regError,   setRegError]   = useState('');
  const [regResult,  setRegResult]  = useState(null);

  const handleRegister = async () => {
    if (!regData.name.trim()) { setRegError('Node name is required'); return; }
    setRegLoading(true); setRegError('');
    try {
      const res = await adminRegisterNode(regData);
      setRegResult(res);
      refresh();
    } catch (e) { setRegError(e.message); }
    setRegLoading(false);
  };

  const statusColor = (s) => ({ online: T.green, offline: T.textDim, error: T.red }[s] || T.textDim);
  const inp = { width: '100%', padding: '10px 12px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: 13, outline: 'none' };
  const lbl = { fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' };

  return (
    <div>
      <SectionTitle
        sub="Windows VPS node agents connected to this gateway"
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn size="sm" variant="ghost" onClick={refresh}>↻ Refresh</Btn>
            <Btn size="sm" onClick={() => setShowReg(v => !v)}>+ Register Node</Btn>
          </div>
        }
      >Admin — Nodes</SectionTitle>

      {/* Register panel */}
      {showReg && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 24, marginBottom: 24, animation: 'fadeUp 0.2s ease' }}>
          <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 20 }}>Register New Node</h3>
          {regResult ? (
            <>
              <Alert variant="success">Node registered! Save the API key — it won't be shown again.</Alert>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl}>Node API Key</label>
                <code style={{ display: 'block', fontFamily: T.mono, fontSize: 12, color: T.orange, background: T.bgInput, padding: '10px 14px', borderRadius: T.radiusSm, wordBreak: 'break-all', border: `1px solid ${T.border}` }}>
                  {regResult.api_key || regResult.node_api_key}
                </code>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Node ID</label>
                <code style={{ fontFamily: T.mono, fontSize: 12, color: T.text }}>{regResult.node_id || regResult.id}</code>
              </div>
              <Alert variant="info" style={{ marginBottom: 16 }}>
                Set these env vars on the Windows VPS:<br />
                <code>NODE_ID={regResult.node_id || regResult.id}</code><br />
                <code>NODE_API_KEY={"<the key above>"}</code>
              </Alert>
              <Btn onClick={() => { setRegResult(null); setShowReg(false); }} style={{ width: '100%' }}>Done</Btn>
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <label style={lbl}>Node Name</label>
                <input value={regData.name} onChange={e => setRegData(p => ({ ...p, name: e.target.value }))} placeholder="win-eu-01" style={inp} />
              </div>
              <div>
                <label style={lbl}>Region</label>
                <select value={regData.region} onChange={e => setRegData(p => ({ ...p, region: e.target.value }))} style={inp}>
                  <option value="eu">Europe</option>
                  <option value="us">United States</option>
                  <option value="asia">Asia</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Max Accounts</label>
                <input type="number" value={regData.max_accounts} onChange={e => setRegData(p => ({ ...p, max_accounts: parseInt(e.target.value) || 20 }))} min={1} max={100} style={inp} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                {regError && <Alert style={{ marginBottom: 0 }}>{regError}</Alert>}
                {!regError && <Btn loading={regLoading} onClick={handleRegister} style={{ width: '100%' }}>Register</Btn>}
              </div>
            </div>
          )}
        </div>
      )}

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><Spinner size={24} /></div>
      ) : nodes.length === 0 ? (
        <EmptyState icon="◎" title="No nodes registered" sub="Register a Windows VPS node above to start provisioning MT5 accounts." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {nodes.map(n => (
            <div key={n.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.text }}>{n.name}</span>
                    <Badge color={statusColor(n.status)}>{n.status}</Badge>
                    <Badge color={T.blue}>{n.region}</Badge>
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>
                    {n.host}:{n.port} · ID: {n.id?.slice(0, 12)}…
                  </div>
                  <div style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted }}>
                    {n.current_accounts}/{n.max_accounts} accounts
                    · {n.cpu_cores} cores · {n.ram_mb} MB RAM
                    {n.last_heartbeat && ` · Heartbeat: ${new Date(n.last_heartbeat).toLocaleTimeString()}`}
                  </div>
                </div>
                {/* Capacity bar */}
                <div style={{ minWidth: 100 }}>
                  <div style={{ fontFamily: T.font, fontSize: 10, color: T.textDim, marginBottom: 5, textAlign: 'right' }}>
                    {Math.round((n.current_accounts / n.max_accounts) * 100)}% used
                  </div>
                  <div style={{ height: 4, background: T.border, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      width: `${Math.min(100, (n.current_accounts / n.max_accounts) * 100)}%`,
                      background: n.current_accounts >= n.max_accounts ? T.red : T.accent,
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
