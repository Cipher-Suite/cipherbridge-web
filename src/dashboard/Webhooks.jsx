// src/dashboard/Webhooks.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { SectionTitle, Badge, Btn, Alert, EmptyState, Spinner, CodeBlock } from '../components';
import { useWebhooks } from '../hooks/useData';
import { useAccounts } from '../hooks/useData';
import { ConfirmDialog } from '../components';

export default function Webhooks() {
  const navigate = useNavigate();
  const { tokens, loading, error, create, revoke } = useWebhooks();
  const { accounts } = useAccounts();
  const [creating, setCreating] = useState(false);
  const [selAccount, setSelAccount] = useState('');
  const [label, setLabel]     = useState('');
  const [newToken, setNewToken] = useState(null);
  const [copied, setCopied]   = useState({});
  const [createErr, setCreateErr] = useState('');
  const [confirmRevoke, setConfirmRevoke] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  const handleCreate = async () => {
    if (!selAccount) { setCreateErr('Select an account first'); return; }
    setCreating(true); setCreateErr('');
    try {
      const data = await create(selAccount, label.trim());
      setNewToken(data);
      setLabel(''); setSelAccount('');
    } catch (e) { setCreateErr(e.message); }
    setCreating(false);
  };

  const copyURL = (url, key) => {
    navigator.clipboard?.writeText(url);
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
  };

  return (
    <div>
      <SectionTitle sub="Generate TradingView webhook URLs that fire trades automatically">Webhooks</SectionTitle>

      {/* New URL alert — shown once */}
      {newToken && (
        <div style={{ marginBottom: 24, padding: 20, background: T.greenBg, border: `1px solid ${T.green}33`, borderRadius: T.radiusSm, animation: 'fadeUp 0.2s ease' }}>
          <p style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.green, marginBottom: 12 }}>
            ✓ Webhook created — save the URL now, it won't be shown again.
          </p>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Webhook URL</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <code style={{ flex: 1, fontFamily: T.mono, fontSize: 11, color: T.text, background: T.bgCard, padding: '10px 14px', borderRadius: T.radiusSm, wordBreak: 'break-all', border: `1px solid ${T.border}`, display: 'block' }}>
                {newToken.webhook_url}
              </code>
              <Btn size="sm" variant="ghost" onClick={() => copyURL(newToken.webhook_url, 'new')}>
                {copied['new'] ? '✓' : 'Copy'}
              </Btn>
            </div>
          </div>
          <Btn size="sm" variant="ghost" onClick={() => setNewToken(null)}>Dismiss</Btn>
        </div>
      )}

      {/* Create panel */}
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>Generate Webhook URL</h3>
        <p style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
          One URL per account. Generating a new URL immediately revokes the previous one.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 180px', minWidth: 160 }}>
            <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Account</label>
            <select
              value={selAccount} onChange={e => setSelAccount(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: 13, outline: 'none' }}
            >
              <option value="">Select account…</option>
              {accounts.map(a => {
                const aid = a.id || a.account_id;
                return <option key={aid} value={aid}>{a.mt5_login} ({a.mt5_server})</option>;
              })}
            </select>
          </div>
          <div style={{ flex: '1 1 160px', minWidth: 140 }}>
            <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Label (optional)</label>
            <input
              value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. EURUSD strategy"
              style={{ width: '100%', padding: '10px 12px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: 13, outline: 'none' }}
            />
          </div>
          <Btn loading={creating} onClick={handleCreate}>Generate</Btn>
        </div>
        {createErr && <Alert style={{ marginTop: 12 }}>{createErr}</Alert>}
      </div>

      {/* Token list */}
      {error && <Alert>{error}</Alert>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner size={24} /></div>
      ) : tokens.length === 0 ? (
        <EmptyState icon="⟳" title="No webhooks yet" sub="Generate a webhook URL above and paste it into a TradingView alert." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tokens.map(t => {
            const acct = accounts.find(a => (a.id || a.account_id) === t.account_id);
            return (
              <div key={t.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.text }}>{t.label || 'Untitled'}</span>
                      <Badge color={t.enabled ? T.green : T.textDim}>{t.enabled ? 'Active' : 'Disabled'}</Badge>
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>
                      Account: {acct ? `${acct.mt5_login} (${acct.mt5_server})` : t.account_id?.slice(0, 12) + '…'}
                    </div>
                    <div style={{ fontFamily: T.font, fontSize: 11, color: T.textDim }}>
                      Used {t.use_count}×
                      {t.last_used_at && ` · Last: ${new Date(t.last_used_at).toLocaleString()}`}
                      {' · '}Created {new Date(t.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <Btn size="sm" variant="ghost" onClick={() => navigate(`/accounts/${t.account_id}`)}>Details</Btn>
                    <Btn size="sm" variant="danger" onClick={() => setConfirmRevoke(t.id)}>Revoke</Btn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Docs */}
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 24, marginTop: 24 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>How It Works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
          {[
            ['1. Generate URL', 'Create a webhook URL for your MT5 account above.'],
            ['2. Create Alert', 'In TradingView: right-click chart → Add Alert → set conditions.'],
            ['3. Set Webhook', 'In Notifications tab, enable Webhook URL and paste your URL.'],
            ['4. Set Message', 'Copy the JSON format below into the Message field.'],
          ].map(([title, desc]) => (
            <div key={title} style={{ background: T.bgInput, borderRadius: T.radiusSm, padding: '14px 16px' }}>
              <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.accent, marginBottom: 6 }}>{title}</div>
              <div style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
        <CodeBlock language="json" title="TradingView Alert Message" code={`{
  "action":     "{{strategy.order.action}}",
  "symbol":     "{{ticker}}",
  "volume":     0.01,
  "order_type": "market",
  "sl_pips":    50,
  "tp_pips":    100,
  "comment":    "tv-signal"
}`} />
      </div>
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
