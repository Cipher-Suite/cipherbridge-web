// src/dashboard/Billing.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { SectionTitle, Btn, Modal, Spinner, Alert } from '../components';
import { useAuth } from '../auth/AuthContext';
import {
  getPlans,
  getSubscription,
  createStripeCheckout,
  createCryptoCheckout,
  getPaymentStatus,
} from '../api/endpoints'; 

// ── Helpers 
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function timeLeft(isoExpiry) {
  if (!isoExpiry) return null;
  const diff = new Date(isoExpiry) - Date.now();
  if (diff <= 0) return 'Expired';
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (m > 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return `${m}m ${s}s`;
}

const STATUS_LABEL = {
  trial:        { label: 'Trial',         color: T.blue,   bg: T.blueBg   },
  trial_frozen: { label: 'Trial Expired', color: T.red,    bg: T.redBg    },
  active:       { label: 'Active',        color: T.accent, bg: T.accentBg },
  grace_period: { label: 'Grace Period',  color: T.orange, bg: T.orangeBg },
  cancelled:    { label: 'Cancelled',     color: T.red,    bg: T.redBg    },
  expired:      { label: 'Expired',       color: T.red,    bg: T.redBg    },
};

// ── StatusBanner ──────────────────────────────────────────────────────────────

function StatusBanner({ sub }) {
  if (!sub) return null;
  const s  = STATUS_LABEL[sub.status] || STATUS_LABEL.active;
  const navigate = useNavigate();

  // Frozen trial — prominent call to action
  if (sub.status === 'trial_frozen') {
    return (
      <div style={{
        background: `linear-gradient(135deg, ${T.red}18 0%, ${T.bgCard} 100%)`,
        border: `1px solid ${T.red}44`,
        borderRadius: T.radiusLg, padding: '24px 28px',
        marginBottom: 24, display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>🔒</span>
            <span style={{ fontFamily: T.font, fontWeight: 800, fontSize: 17, color: T.red }}>
              Your trial has ended
            </span>
          </div>
          <p style={{ fontFamily: T.font, fontSize: 13, color: T.textMuted, maxWidth: 480 }}>
            Trading is paused but all your data is preserved. Upgrade to any plan to resume immediately.
          </p>
        </div>
        <Btn onClick={() => document.getElementById('billing-plans')?.scrollIntoView({ behavior: 'smooth' })}>
          Upgrade now →
        </Btn>
      </div>
    );
  }

  // Grace period warning
  if (sub.status === 'grace_period') {
    return (
      <div style={{
        background: T.orangeBg, border: `1px solid ${T.orange}44`,
        borderRadius: T.radiusLg, padding: '16px 24px',
        marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <div>
          <span style={{ fontFamily: T.font, fontWeight: 700, color: T.orange, fontSize: 14 }}>
            Grace period — renew by {formatDate(sub.grace_until)}
          </span>
          <p style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted, marginTop: 2 }}>
            Your subscription has lapsed. Trading continues for now — renew to avoid interruption.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// ── Current Plan Card ─────────────────────────────────────────────────────────

function CurrentPlanCard({ sub, plan }) {
  if (!sub || !plan) return null;
  const s = STATUS_LABEL[sub.status] || STATUS_LABEL.active;

  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: T.radiusLg, padding: 24, marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Current plan
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: T.font, fontWeight: 800, fontSize: 22, color: T.text }}>
              {plan.name}
            </span>
            <span style={{
              fontFamily: T.mono, fontSize: 10, fontWeight: 700,
              padding: '3px 9px', borderRadius: 100,
              background: s.bg, color: s.color,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {s.label}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {plan.price_usd != null && (
            <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 22, color: T.accent }}>
              ${plan.price_usd}<span style={{ fontSize: 13, color: T.textMuted, fontWeight: 500 }}>/mo</span>
            </div>
          )}
          {sub.status === 'trial' && sub.trial_started_at && (
            <div style={{ fontFamily: T.mono, fontSize: 12, color: T.blue, marginTop: 4 }}>
              {sub.trial_days_remaining ?? '—'} days remaining
            </div>
          )}
          {sub.status === 'trial' && !sub.trial_started_at && (
            <div style={{ fontFamily: T.mono, fontSize: 12, color: T.textMuted, marginTop: 4 }}>
              Connect MT5 to start trial
            </div>
          )}
          {sub.current_period_end && sub.status === 'active' && (
            <div style={{ fontFamily: T.mono, fontSize: 12, color: T.textMuted, marginTop: 4 }}>
              Renews {formatDate(sub.current_period_end)}
            </div>
          )}
        </div>
      </div>

      {/* Quota row */}
      <div style={{
        display: 'flex', gap: 0, marginTop: 20,
        background: T.bgSurface, borderRadius: T.radiusSm,
        border: `1px solid ${T.border}`, overflow: 'hidden',
      }}>
        {[
          { label: 'MT5 Accounts',  val: plan.max_accounts },
          { label: 'Webhooks',      val: plan.max_webhooks === -1 ? '∞' : plan.max_webhooks },
          { label: 'API Rate',      val: `${plan.api_rate_limit_rpm}/min` },
          { label: 'Support',       val: plan.support_level.charAt(0).toUpperCase() + plan.support_level.slice(1) },
        ].map((item, i, arr) => (
          <div key={item.label} style={{
            flex: 1, padding: '14px 0', textAlign: 'center',
            borderRight: i < arr.length - 1 ? `1px solid ${T.border}` : 'none',
          }}>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.text }}>{item.val}</div>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, marginTop: 3 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Plan Cards ────────────────────────────────────────────────────────────────

function PlanCards({ plans, currentPlanId, status, onStripe, onCrypto, loading }) {
  const ORDER = ['basic', 'pro', 'enterprise'];

  return (
    <div id="billing-plans">
      <div style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
        Upgrade plan
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {ORDER.map(pid => {
          const plan   = plans.find(p => p.id === pid);
          if (!plan) return null;
          const isCurrent = pid === currentPlanId && (status === 'active' || status === 'grace_period');
          const isPro     = pid === 'pro';

          return (
            <div key={pid} style={{
              background:    isPro ? T.bgCard : T.bgSurface,
              border:        `1px solid ${isCurrent ? T.accent + '66' : isPro ? T.borderFocus : T.border}`,
              borderRadius:  T.radiusLg, padding: 22,
              display:       'flex', flexDirection: 'column',
              transition:    T.transition, position: 'relative',
            }}>
              {isPro && (
                <div style={{
                  position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                  background: T.accent, color: T.bg,
                  fontFamily: T.mono, fontSize: 9, fontWeight: 800,
                  padding: '3px 10px', borderRadius: '0 0 8px 8px',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  Most popular
                </div>
              )}

              <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 6, marginTop: isPro ? 10 : 0 }}>
                {plan.name}
              </div>

              <div style={{ marginBottom: 16 }}>
                {plan.contact_us ? (
                  <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: T.text }}>Contact us</span>
                ) : (
                  <>
                    <span style={{ fontFamily: T.font, fontWeight: 800, fontSize: 26, color: T.text }}>${plan.price_usd}</span>
                    <span style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted }}>/mo</span>
                  </>
                )}
              </div>

              <div style={{ flex: 1 }}>
                {[
                  `${plan.max_accounts} MT5 account`,
                  `${plan.max_webhooks === -1 ? 'Unlimited' : plan.max_webhooks} webhooks`,
                  `${plan.api_rate_limit_rpm} req/min`,
                  `${plan.support_level === 'priority' ? 'Priority support' : plan.support_level === 'email' ? 'Email support' : 'Community support'}`,
                ].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 9 }}>
                    <span style={{ color: T.accent, fontSize: 13, flexShrink: 0 }}>✓</span>
                    <span style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted }}>{f}</span>
                  </div>
                ))}
              </div>

              {isCurrent ? (
                <div style={{
                  marginTop: 16, padding: '9px 0', borderRadius: T.radiusSm,
                  border: `1px solid ${T.accent}44`, textAlign: 'center',
                  fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.accent,
                }}>
                  Current plan
                </div>
              ) : plan.contact_us ? (
                <a
                  href="mailto:hello@tonpo.cloud"
                  style={{
                    marginTop: 16, padding: '9px 0', borderRadius: T.radiusSm,
                    border: `1px solid ${T.border}`,
                    textAlign: 'center', fontFamily: T.font, fontSize: 12,
                    fontWeight: 700, color: T.textMuted, textDecoration: 'none',
                    display: 'block', transition: T.transition,
                  }}
                >
                  Contact sales
                </a>
              ) : (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <Btn
                    style={{ width: '100%' }}
                    loading={loading === `stripe-${pid}`}
                    onClick={() => onStripe(pid)}
                  >
                    Pay with card
                  </Btn>
                  <Btn
                    variant="ghost"
                    style={{ width: '100%' }}
                    loading={loading === `crypto-${pid}`}
                    onClick={() => onCrypto(pid)}
                  >
                    Pay with crypto
                  </Btn>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Crypto Checkout Modal ─────────────────────────────────────────────────────

function CryptoModal({ open, onClose, payment, onConfirmed }) {
  const [method,    setMethod]    = useState('usdt_erc20');
  const [details,   setDetails]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [timer,     setTimer]     = useState('');
  const [copied,    setCopied]    = useState(false);
  const [polling,   setPolling]   = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const pollRef  = useRef(null);
  const timerRef = useRef(null);
  const { user }   = useAuth();

  // Clean up on close
  const reset = () => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
    setDetails(null); setLoading(false); setError('');
    setTimer(''); setCopied(false); setPolling(false); setConfirmed(false);
  };
  const handleClose = () => { reset(); onClose(); };

  // Initiate checkout when payment prop arrives and modal opens
  useEffect(() => {
    if (!open || !payment || details) return;
    (async () => {
      setLoading(true); setError('');
      try {
        const d = await createCryptoCheckout(user.id, payment.planId, method);
        setDetails(d);
        // Countdown timer
        timerRef.current = setInterval(() => setTimer(timeLeft(d.expires_at)), 1000);
        // Poll payment status every 30s
        setPolling(true);
        pollRef.current = setInterval(async () => {
          try {
            const s = await getPaymentStatus(d.payment_id);
            if (s.status === 'confirmed') {
              clearInterval(pollRef.current);
              clearInterval(timerRef.current);
              setConfirmed(true);
              onConfirmed?.();
            }
          } catch {}
        }, 30000);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();

    return () => { clearInterval(pollRef.current); clearInterval(timerRef.current); };
  }, [open, payment]);

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const qrData = details
    ? `${details.currency === 'BTC' ? 'bitcoin' : 'ethereum'}:${details.address}?amount=${details.amount}`
    : '';
  const qrUrl  = qrData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}&bgcolor=111124&color=e8e8f4&margin=12`
    : '';

  return (
    <Modal open={open} onClose={handleClose} title="Pay with Crypto" maxWidth={480}>
      {confirmed ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: T.accent, marginBottom: 8 }}>
            Payment confirmed
          </div>
          <p style={{ fontFamily: T.font, fontSize: 13, color: T.textMuted, marginBottom: 24 }}>
            Your plan has been upgraded. Trading resumes immediately.
          </p>
          <Btn style={{ width: '100%' }} onClick={handleClose}>Done</Btn>
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Spinner size={28} />
        </div>
      ) : error ? (
        <>
          <Alert>{error}</Alert>
          <Btn variant="ghost" style={{ width: '100%' }} onClick={handleClose}>Close</Btn>
        </>
      ) : details ? (
        <>
          {/* Currency toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[
              { id: 'usdt_erc20', label: 'USDT (ERC-20)' },
              { id: 'btc',        label: 'Bitcoin' },
            ].map(opt => (
              <div
                key={opt.id}
                style={{
                  flex: 1, padding: '8px 0', textAlign: 'center',
                  borderRadius: T.radiusSm, cursor: 'pointer',
                  fontFamily: T.font, fontSize: 12, fontWeight: 700,
                  border: `1px solid ${method === opt.id ? T.accent : T.border}`,
                  color:  method === opt.id ? T.accent : T.textMuted,
                  background: method === opt.id ? T.accentBg : T.bgInput,
                  transition: T.transition,
                }}
                onClick={() => { if (method !== opt.id) { reset(); setMethod(opt.id); }}}
              >
                {opt.label}
              </div>
            ))}
          </div>

          {/* Expiry */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 20, padding: '10px 14px',
            background: T.bgSurface, borderRadius: T.radiusSm, border: `1px solid ${T.border}`,
          }}>
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.textMuted }}>
              ⏱ Time remaining
            </span>
            <span style={{
              fontFamily: T.mono, fontSize: 13, fontWeight: 700,
              color: timer === 'Expired' ? T.red : T.yellow,
            }}>
              {timer || '—'}
            </span>
          </div>

          {/* QR code */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{
              background: T.bgCard, border: `1px solid ${T.border}`,
              borderRadius: T.radiusSm, padding: 12,
              display: 'inline-block',
            }}>
              <img
                src={qrUrl} alt="Payment QR" width={180} height={180}
                style={{ display: 'block', borderRadius: 4 }}
              />
            </div>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontFamily: T.font, fontSize: 10, color: T.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
              Send exactly
            </label>
            <div style={{
              display: 'flex', gap: 8, alignItems: 'center',
              padding: '11px 14px', background: T.bgInput,
              border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
            }}>
              <span style={{ fontFamily: T.mono, fontSize: 15, fontWeight: 700, color: T.yellow, flex: 1 }}>
                {details.amount} {details.currency}
              </span>
              <Btn size="sm" variant="ghost" onClick={() => copy(`${details.amount}`)}>
                Copy
              </Btn>
            </div>
            <p style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, marginTop: 6 }}>
              The exact amount identifies your payment. Do not round.
            </p>
          </div>

          {/* Address */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: T.font, fontSize: 10, color: T.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
              To address
            </label>
            <div style={{
              display: 'flex', gap: 8, alignItems: 'center',
              padding: '11px 14px', background: T.bgInput,
              border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
            }}>
              <span style={{
                fontFamily: T.mono, fontSize: 12, color: T.textMuted,
                wordBreak: 'break-all', flex: 1, lineHeight: 1.4,
              }}>
                {details.address}
              </span>
              <Btn size="sm" variant="ghost" onClick={() => copy(details.address)}>
                {copied ? '✓' : 'Copy'}
              </Btn>
            </div>
          </div>

          {/* Polling indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', background: T.accentBg,
            border: `1px solid ${T.accent}33`, borderRadius: T.radiusSm,
            marginBottom: 16,
          }}>
            <Spinner size={12} color={T.accent} />
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.accent }}>
              Watching for your payment — updates every 30 seconds
            </span>
          </div>

          <Btn variant="ghost" style={{ width: '100%' }} onClick={handleClose}>
            Close (payment will still be processed)
          </Btn>
        </>
      ) : null}
    </Modal>
  );
}

// ── Payment History ───────────────────────────────────────────────────────────

function PaymentHistory({ userId }) {
  // Payment history would require GET /admin/payments filtered by user.
  // For now shows a placeholder — wire up when admin endpoint exposes
  // a user-scoped /payments endpoint.
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ fontFamily: T.font, fontSize: 11, color: T.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
        Payment history
      </div>
      <div style={{
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderRadius: T.radiusLg, padding: '56px 32px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.25 }}>🧾</div>
        <p style={{ fontFamily: T.font, fontSize: 14, color: T.textMuted }}>
          No payments yet
        </p>
        <p style={{ fontFamily: T.font, fontSize: 12, color: T.textDim, marginTop: 6 }}>
          Your payment history will appear here after your first transaction.
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Billing() {
  const { user }                      = useAuth();
  const [sub,       setSub]           = useState(null);
  const [plans,     setPlans]         = useState([]);
  const [loading,   setLoading]       = useState(true);
  const [error,     setError]         = useState('');
  const [btnLoading, setBtnLoading]   = useState('');
  const [cryptoPay,  setCryptoPay]    = useState(null); // { planId }
  const [showCrypto, setShowCrypto]   = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true); setError('');
    try {
      const [s, p] = await Promise.all([
        getSubscription(user.id),
        getPlans(),
      ]);
      setSub(s);
      setPlans(p);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const handleStripe = async (planId) => {
    setBtnLoading(`stripe-${planId}`);
    try {
      const { checkout_url } = await createStripeCheckout(user.id, planId);
      window.location.href = checkout_url; // same tab
    } catch (e) {
      alert(`Checkout failed: ${e.message}`);
    } finally {
      setBtnLoading('');
    }
  };

  const handleCrypto = (planId) => {
    setCryptoPay({ planId });
    setShowCrypto(true);
  };

  const handleCryptoConfirmed = () => {
    setTimeout(() => load(), 1500); // reload subscription after upgrade
  };

  const currentPlan = sub ? plans.find(p => p.id === sub.plan_id) : null;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <SectionTitle sub="Manage your plan, upgrade, and view payment history">
        Billing
      </SectionTitle>

      {error && <Alert>{error}</Alert>}

      {/* Frozen / grace period banners */}
      <StatusBanner sub={sub} />

      {/* Current plan */}
      <CurrentPlanCard sub={sub} plan={currentPlan} />

      {/* Upgrade plans */}
      <div style={{ marginTop: 32 }}>
        <PlanCards
          plans={plans}
          currentPlanId={sub?.plan_id}
          status={sub?.status}
          onStripe={handleStripe}
          onCrypto={handleCrypto}
          loading={btnLoading}
        />
      </div>

      {/* Payment history */}
      <PaymentHistory userId={user?.id} />

      {/* Crypto checkout modal */}
      <CryptoModal
        open={showCrypto}
        payment={cryptoPay}
        onClose={() => { setShowCrypto(false); setCryptoPay(null); }}
        onConfirmed={handleCryptoConfirmed}
      />
    </div>
  );
}
