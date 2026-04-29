// src/api/billingClient.js
import { api } from './client';
import { GATEWAY_URL } from '../theme';

async function billingFetch(path, options = {}) {
  const res = await fetch(`${GATEWAY_URL}/api/billing${path}`, {  
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key':    api.getApiKey(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Billing API error: ${res.status}`);
  }

  return res.json();
}

// ── Plans ─────────────────────────────────────────────────────────────────────

/** GET /plans — public, no auth needed */
export async function getPlans() {
  const res = await fetch(`https://billing.tonpo.cloud/plans`);
  if (!res.ok) throw new Error('Failed to load plans');
  const data = await res.json();
  return data.plans;
}

// ── Subscription ──────────────────────────────────────────────────────────────

/** GET /subscription/:user_id */
export async function getSubscription(userId) {
  return billingFetch(`/subscription/${userId}`);
}

// ── Checkout ──────────────────────────────────────────────────────────────────

/**
 * POST /checkout/stripe
 * Returns { checkout_url, session_id }
 * Caller should redirect: window.location.href = checkout_url
 */
export async function createStripeCheckout(userId, planId) {
  return billingFetch('/checkout/stripe', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, plan_id: planId }),
  });
}

/**
 * POST /checkout/crypto
 * Returns { payment_id, address, amount, currency, expires_at, expires_minutes, instructions }
 */
export async function createCryptoCheckout(userId, planId, method) {
  return billingFetch('/checkout/crypto', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, plan_id: planId, method }),
  });
}

// ── Payment status ────────────────────────────────────────────────────────────

/** GET /payments/:id/status */
export async function getPaymentStatus(paymentId) {
  return billingFetch(`/payments/${paymentId}/status`);
}
