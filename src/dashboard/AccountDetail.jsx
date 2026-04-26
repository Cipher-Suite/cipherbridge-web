// src/dashboard/AccountDetail.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { SectionTitle, StatusDot, Btn, Modal, Alert, Input, Spinner, Badge, EmptyState, CodeBlock } from '../components';
import { useAccountDetail } from '../hooks/useData';
import { useWebhooks } from '../hooks/useData';
import { pauseAccount, resumeAccount, deleteAccount } from '../api/endpoints';
import { ConfirmDialog } from '../components';
import { useToast } from '../hooks/useToast';

// ── Webhook panel inside account detail ────────────────────────────────────
function WebhookPanel({ accountId }) {
  const { tokens, loading, error, create, revoke, test } = useWebhooks();
  // Filter to this account only
  const myTokens = tokens.filter(t => t.account_id === accountId);

  const [creating,  setCreating]  = useState(false);
  const [label,     setLabel]     = useState('');
  const [newToken,  setNewToken]  = useState(null); // shown once
  const [testOpen,  setTestOpen]  = useState(false);
  const [testId,    setTestId]    = useState(null);
  const [testPayload, setTestPayload] = useState('{"action":"buy","symbol":"EURUSD","volume":0.01}');
  const [testResult,  setTestResult]  = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [copyDone,  setCopyDone]  = useState({});
  const [confirmRevoke, setConfirmRevoke] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false); 
  const { error: showError } = useToast();

  const handleCreate = async () => {
    setCreating(true);
    try {
      const data = await create(accountId, label.trim());
      setNewToken(data);
      setLabel('');
    } catch (e) { showError(e.message || 'Failed to create webhook'); }
    setCreating(false);
  };

  const handleRevoke = (id) => setConfirmRevoke(id);

  const handleTest = async () => {
    setTestLoading(true); setTestResult(null);
    try {
      let payload;
      try { payload = JSON.parse(testPayload); } catch { setTestResult({ error: 'Invalid JSON' }); setTestLoading(false); return; }
      const res = await test(testId, payload);
      setTestResult(res);
    } catch (e) { setTestResult({ error: e.message }); }
    setTestLoading(false);
  };

  const copyURL = (url, id) => {
    navigator.clipboard?.writeText(url);
    setCopyDone(p => ({ ...p, [id]: true }));
    setTimeout(() => setCopyDone(p => ({ ...p, [id]: false })), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text }}>TradingView Webhooks</h3>
          <p style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted, marginTop: 3 }}>Paste the webhook URL into a TradingView alert to auto-execute trades.</p>
        </div>
      </div>

      {/* New token alert — shown once */}
      {newToken && (
        <div style={{ marginBottom: 20, padding: 18, background: T.greenBg, border: `1px solid ${T.green}33`, borderRadius: T.radiusSm }}>
          <p style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.green, marginBottom: 10 }}>
            ✓ Webhook created — copy the URL now, it won't be shown again.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <code style={{ flex: 1, fontFamily: T.mono, fontSize: 11, color: T.text, background: T.bgInput, padding: '8px 12px', borderRadius: T.radiusSm, wordBreak: 'break-all', display: 'block' }}>
              {newToken.webhook_url}
            </code>
            <Btn size="sm" onClick={() => copyURL(newToken.webhook_url, 'new')} variant="ghost">
              {copyDone['new'] ? '✓' : 'Copy'}
            </Btn>
          </div>
          <Btn size="sm" variant="ghost" onClick={() => setNewToken(null)} style={{ marginTop: 10 }}>Dismiss</Btn>
        </div>
      )}

      {/* Create new token */}
      <div style={{ background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Label (optional)</label>
            <input
              value={label} onChange={e => setLabel(e.target.value)}
              placeholder="e.g. EURUSD scalper"
              style={{ width: '100%', padding: '9px 12px', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: 13, outline: 'none' }}
            />
          </div>
          <Btn loading={creating} onClick={handleCreate}>Generate Webhook URL</Btn>
        </div>
      </div>

      {/* Token list */}
      {error && <Alert>{error}</Alert>}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spinner /></div>
      ) : myTokens.length === 0 ? (
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.textDim, padding: '16px 0' }}>No webhooks yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {myTokens.map(t => (
            <div key={t.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.text }}>{t.label || 'Untitled'}</span>
                    <Badge color={t.enabled ? T.green : T.textDim}>{t.enabled ? 'Active' : 'Disabled'}</Badge>
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>
                    ID: {t.id?.slice(0, 12)}… · Used {t.use_count} times
                    {t.last_used_at && ` · Last: ${new Date(t.last_used_at).toLocaleDateString()}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn size="sm" variant="ghost" onClick={() => { setTestId(t.id); setTestOpen(true); setTestResult(null); }}>Test</Btn>
                  <Btn size="sm" variant="danger" onClick={() => handleRevoke(t.id)}>Revoke</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dry-run test modal */}
      <Modal open={testOpen} onClose={() => setTestOpen(false)} title="Test Webhook (Dry Run)">
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
          Parse a sample payload without executing any trade. Use this to validate your alert message format.
        </p>
        <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Payload (JSON)</label>
        <textarea
          value={testPayload} onChange={e => setTestPayload(e.target.value)}
          rows={5}
          style={{ width: '100%', padding: '10px 14px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.mono, fontSize: 12, outline: 'none', resize: 'vertical', marginBottom: 16 }}
        />
        {testResult && (
          <div style={{ marginBottom: 16, padding: 14, background: testResult.valid ? T.greenBg : T.redBg, border: `1px solid ${testResult.valid ? T.green : T.red}33`, borderRadius: T.radiusSm }}>
            <p style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: testResult.valid ? T.green : T.red, marginBottom: testResult.parsed ? 10 : 0 }}>
              {testResult.valid ? '✓ Valid payload' : `✗ ${testResult.error || 'Invalid'}`}
            </p>
            {testResult.parsed && (
              <pre style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted, margin: 0 }}>{JSON.stringify(testResult.parsed, null, 2)}</pre>
            )}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="ghost" onClick={() => setTestOpen(false)} style={{ flex: 1 }}>Close</Btn>
          <Btn loading={testLoading} onClick={handleTest} style={{ flex: 1 }}>Run Test</Btn>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!confirmRevoke}
        title="Revoke Webhook?"
        message="The webhook URL will stop working immediately."
        dangerous={true}
        confirmText="Revoke"
        loading={revokeLoading}
        onConfirm={() => {
          setRevokeLoading(true);
          revoke(confirmRevoke).finally(() => {
            setRevokeLoading(false);
            setConfirmRevoke(null);
          });
        }}
        onCancel={() => setConfirmRevoke(null)}
      />
    </div>
  );
} 

// ── Account Detail page 
export default function AccountDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account, status, loading, error, refresh } = useAccountDetail(id);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { error: showError } = useToast();

  const act = async (fn) => {
    setActionLoading(true);
    try { await fn(id); await refresh(); } catch (e) { showError(e.message || 'Action failed'); }
    setActionLoading(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><Spinner size={28} /></div>
  );

  if (error) return (
    <div>
      <Btn variant="ghost" size="sm" onClick={() => navigate('/')} style={{ marginBottom: 20 }}>← Back</Btn>
      <Alert>{error}</Alert>
    </div>
  );

  const a = account || {};
  const accountId = id;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Btn variant="ghost" size="sm" onClick={() => navigate('/')}>← Back</Btn>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: T.font, fontSize: 20, fontWeight: 800, color: T.text }}>{a.mt5_login || accountId}</h2>
            <StatusDot status={a.status} />
          </div>
          <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginTop: 2 }}>{accountId}</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {a.status === 'active' && (
            <Btn size="sm" variant="warning" loading={actionLoading} onClick={() => act(pauseAccount)}>Pause</Btn>
          )}
          {(a.status === 'paused' || a.status === 'disconnected') && (
            <Btn size="sm" variant="success" loading={actionLoading} onClick={() => act(resumeAccount)}>Resume</Btn>
          )}
          <Btn size="sm" variant="danger" loading={actionLoading || deleteLoading} onClick={() => setConfirmDelete(true)}>Delete</Btn>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          ['MT5 Login',  a.mt5_login  || '—'],
          ['Server',     a.mt5_server || '—'],
          ['Node',       a.node_id    ? a.node_id.slice(0, 12) + '…' : 'Unassigned'],
          ['Created',    a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'],
          ['Errors',     a.error_count ?? 0],
          ['Reconnects', a.reconnect_count ?? 0],
        ].map(([label, value]) => (
          <div key={label} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: '14px 16px' }}>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: T.mono, fontSize: 13, color: T.text, fontWeight: 600 }}>{String(value)}</div>
          </div>
        ))}
      </div>

      {/* Instance status */}
      {status && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 12 }}>Instance Status</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              ['Running', status.is_running ? 'Yes' : 'No', status.is_running ? T.green : T.red],
              ['PID',     status.pid ?? '—', T.text],
              ['Uptime',  status.uptime_secs ? `${Math.round(status.uptime_secs / 60)}m` : '—', T.text],
            ].map(([l, v, c]) => (
              <div key={l}>
                <div style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, marginBottom: 3 }}>{l}</div>
                <div style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last error */}
      {a.last_error && (
        <Alert variant="warning" style={{ marginBottom: 24 }}>
          <strong>Last error:</strong> {a.last_error}
        </Alert>
      )}

      {/* Webhook management */}
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 24, marginBottom: 24 }}>
        <WebhookPanel accountId={accountId} />
      </div>

      {/* TradingView alert format reference */}
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 24 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>Alert Message Format</h3>
        <p style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
          Paste this into TradingView's alert message field. TradingView fills in <code style={{ color: T.accent }}>{'{{'}</code> variables at alert time.
        </p>
        <CodeBlock
          language="json"
          title="TradingView Alert Message"
          code={`{
  "action":     "{{strategy.order.action}}",
  "symbol":     "{{ticker}}",
  "volume":     0.01,
  "order_type": "market",
  "sl_pips":    50,
  "tp_pips":    100,
  "comment":    "tv-{{strategy.order.action}}"
}`}
        />
      </div>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Account?"
        message="This will deprovision the MT5 instance. All data will be lost permanently."
        dangerous={true}
        confirmText="Delete"
        loading={deleteLoading}
        onConfirm={() => {
          setDeleteLoading(true);
          act(deleteAccount)
            .then(() => navigate('/'))
            .finally(() => {
              setDeleteLoading(false);
              setConfirmDelete(false);
            });
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}