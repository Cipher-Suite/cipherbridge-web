// src/admin/Admin.jsx
import { useState } from 'react';
import { T } from '../theme';
import { SectionTitle, Badge, Btn, Alert, Modal, Spinner, EmptyState, StatusDot } from '../components';
import { useAdminUsers } from '../hooks/useData';
import { ConfirmDialog } from '../components';
import { useToast } from '../hooks/useToast';

function RotateKeyModal({ open, onClose, userId, onRotate }) {
  const [loading, setLoading] = useState(false);
  const [newKey,  setNewKey]  = useState(null);
  const [error,   setError]   = useState('');
  const [copied,  setCopied]  = useState(false);
  
  const handleRotate = async () => {
    setLoading(true); setError('');
    try {
      const data = await onRotate(userId);
      setNewKey(data.api_key);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard?.writeText(newKey);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => { setNewKey(null); setError(''); setCopied(false); onClose(); };

  return (
    <Modal open={open} onClose={handleClose} title="Rotate API Key">
      {newKey ? (
        <>
          <Alert variant="success">New API key generated. Share it with the user securely.</Alert>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>New API Key</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <code style={{ flex: 1, fontFamily: T.mono, fontSize: 12, color: T.orange, background: T.bgInput, padding: '10px 14px', borderRadius: T.radiusSm, wordBreak: 'break-all', border: `1px solid ${T.border}` }}>
                {newKey}
              </code>
              <Btn size="sm" variant="ghost" onClick={copy}>{copied ? '✓' : 'Copy'}</Btn>
            </div>
          </div>
          <Alert variant="warning">The old key is now invalid. This key is shown once only.</Alert>
          <Btn onClick={handleClose} style={{ width: '100%', marginTop: 8 }}>Done</Btn>
        </>
      ) : (
        <>
          <p style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
            Generate a new API key for user <code style={{ color: T.accent, background: T.accentBg, padding: '1px 6px', borderRadius: 4 }}>{userId?.slice(0, 12)}…</code>. The current key will be invalidated immediately.
          </p>
          {error && <Alert>{error}</Alert>}
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="ghost" onClick={handleClose} style={{ flex: 1 }}>Cancel</Btn>
            <Btn loading={loading} onClick={handleRotate} style={{ flex: 1 }}>Rotate Key</Btn>
          </div>
        </>
      )}
    </Modal>
  );
}

export default function Admin() {
  const { users, loading, error, deactivate, rotateKey, setAdmin, refresh } = useAdminUsers();
  const [rotateModal, setRotateModal] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const { error: showError } = useToast();

  const act = async (id, fn) => {
    setActionLoading(p => ({ ...p, [id]: true }));
    try { await fn(id); refresh(); } catch (e) { showError(e.message || 'Action failed'); }
    setActionLoading(p => ({ ...p, [id]: false }));
  };

  return (
    <div>
      <SectionTitle
        sub="Manage gateway users, permissions, and API key recovery"
        action={<Btn size="sm" variant="ghost" onClick={refresh}>↻ Refresh</Btn>}
      >Admin — Users</SectionTitle>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><Spinner size={24} /></div>
      ) : users.length === 0 ? (
        <EmptyState icon="◉" title="No users found" />
      ) : (
        <>
          {/* Desktop table header */}
          <div className="admin-table" style={{
            display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 80px 180px',
            gap: 8, padding: '8px 18px', fontFamily: T.font, fontSize: 10, color: T.textDim,
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
          }}>
            {['User ID', 'Accounts', 'Admin', 'Status', '', 'Actions'].map(h => <span key={h}>{h}</span>)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {users.map(u => {
              const id   = u.id || u.user_id;
              const busy = !!actionLoading[id];
              return (
                <div key={id} className="admin-table" style={{
                  display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 80px 180px',
                  alignItems: 'center', gap: 8, padding: '13px 18px',
                  background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
                }}>
                  <code style={{ fontFamily: T.mono, fontSize: 12, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{id}</code>
                  <span style={{ fontFamily: T.font, fontSize: 13, color: T.textMuted }}>{u.account_count ?? 0}</span>
                  <span>{u.is_admin ? <Badge color={T.accent}>Yes</Badge> : <span style={{ fontFamily: T.font, fontSize: 12, color: T.textDim }}>No</span>}</span>
                  <Badge color={u.is_active !== false ? T.green : T.red}>{u.is_active !== false ? 'Active' : 'Deactivated'}</Badge>
                  <span />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn size="sm" variant="ghost" loading={busy} onClick={() => setRotateModal(id)} title="Recover lost API key">Key</Btn>
                    <Btn size="sm" variant={u.is_admin ? 'warning' : 'ghost'} loading={busy}
                      onClick={() => act(id, (id) => setAdmin(id, !u.is_admin))}
                      title={u.is_admin ? 'Remove admin' : 'Make admin'}
                    >{u.is_admin ? 'Demote' : 'Admin'}</Btn>
                    {u.is_active !== false && (
                      <Btn size="sm" variant="danger" loading={busy}
                        onClick={() => setConfirmDeactivate(id)}
                      >Deactivate</Btn>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile cards */}
          <div className="admin-cards" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
            {users.map(u => {
              const id   = u.id || u.user_id;
              const busy = !!actionLoading[id];
              return (
                <div key={id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <code style={{ fontFamily: T.mono, fontSize: 11, color: T.text }}>{id?.slice(0, 16)}…</code>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {u.is_admin && <Badge color={T.accent}>Admin</Badge>}
                      <Badge color={u.is_active !== false ? T.green : T.red}>{u.is_active !== false ? 'Active' : 'Off'}</Badge>
                    </div>
                  </div>
                  <div style={{ fontFamily: T.font, fontSize: 12, color: T.textDim, marginBottom: 12 }}>
                    {u.account_count ?? 0} accounts
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <Btn size="sm" variant="ghost" loading={busy} onClick={() => setRotateModal(id)}>Rotate Key</Btn>
                    <Btn size="sm" variant={u.is_admin ? 'warning' : 'ghost'} loading={busy} onClick={() => act(id, (id) => setAdmin(id, !u.is_admin))}>
                      {u.is_admin ? 'Demote' : 'Make Admin'}
                    </Btn>
                    {u.is_active !== false && (
                      <Btn size="sm" variant="danger" onClick={() => setConfirmDeactivate(id)}>
                        Deactivate
                      </Btn>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <RotateKeyModal
        open={!!rotateModal}
        userId={rotateModal}
        onClose={() => setRotateModal(null)}
        onRotate={rotateKey}
      />

      <style>{`
        @media(max-width:760px){
          .admin-table{display:none!important}
          .admin-cards{display:flex!important}
        }
      `}</style>
      <ConfirmDialog
        open={!!confirmDeactivate}
        title="Deactivate User?"
        message={`Deactivate user ${confirmDeactivate?.slice(0, 12)}...? They will not be able to access their account.`}
        dangerous={true}
        confirmText="Deactivate"
        loading={deactivateLoading}
        onConfirm={() => {
          setDeactivateLoading(true);
          act(confirmDeactivate, deactivate).finally(() => {
            setDeactivateLoading(false);
            setConfirmDeactivate(null);
          });
        }}
        onCancel={() => setConfirmDeactivate(null)}
      />      
    </div>
  );
}
