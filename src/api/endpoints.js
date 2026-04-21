// src/api/endpoints.js
import { api } from './client';

// ── Auth ──────────────────────────────────────────────────────────────────
export const createUser    = ()          => api.post('/api/users');
export const getMe         = ()          => api.get('/api/users/me');
export const getMySessions = ()          => api.get('/api/users/me/sessions');
export const rotateMyKey   = ()          => api.post('/api/users/me/rotate-key');

// ── Accounts ──────────────────────────────────────────────────────────────
export const listAccounts  = ()          => api.get('/api/accounts');
export const getAccount    = (id)        => api.get(`/api/accounts/${id}`);
export const getAccountStatus = (id)     => api.get(`/api/accounts/${id}/status`);
export const createAccount = (login, pw, srv) =>
  api.post('/api/accounts', { mt5_login: login, mt5_password: pw, mt5_server: srv });
export const deleteAccount = (id)        => api.del(`/api/accounts/${id}`);
export const pauseAccount  = (id)        => api.post(`/api/accounts/${id}/pause`);
export const resumeAccount = (id)        => api.post(`/api/accounts/${id}/resume`);

// ── Trading ───────────────────────────────────────────────────────────────
export const getPositions  = ()          => api.get('/api/positions');
export const getAccountInfo = ()         => api.get('/api/account');
export const getOrders     = ()          => api.get('/api/orders');
export const placeOrder    = (body)      => api.post('/api/orders', body);
export const closeOrder    = (ticket, volume) =>
  api.post('/api/orders/close', { ticket, volume });
export const modifyOrder   = (ticket, sl, tp) =>
  api.post('/api/orders/modify', { ticket, sl, tp });

// ── Market Data ───────────────────────────────────────────────────────────
export const getSymbolInfo = (symbol)    => api.get(`/api/symbols/${symbol}`);
export const getHistory    = (symbol, timeframe, from, to) =>
  api.get(`/api/history?symbol=${symbol}&timeframe=${timeframe}&from=${from}&to=${to}`);

// ── Webhooks ──────────────────────────────────────────────────────────────
export const listWebhooks  = ()          => api.get('/api/v1/webhooks');
export const createWebhook = (account_id, label = '') =>
  api.post('/api/v1/webhooks', { account_id, label });
export const revokeWebhook = (id)        => api.del(`/api/v1/webhooks/${id}`);
export const testWebhook   = (id, body)  => api.post(`/api/v1/webhooks/${id}/test`, body);

// ── Admin ─────────────────────────────────────────────────────────────────
export const adminListUsers    = ()      => api.get('/api/admin/users');
export const adminGetUser      = (id)    => api.get(`/api/admin/users/${id}`);
export const adminDeactivate   = (id)    => api.post(`/api/admin/users/${id}/deactivate`);
export const adminSetAdmin     = (id, v) => api.post(`/api/admin/users/${id}/admin`, { is_admin: v });
export const adminRotateKey    = (id)    => api.post(`/api/admin/users/${id}/rotate-key`);
export const adminRegisterNode = (body)  => api.post('/api/admin/nodes', body);

// ── System ────────────────────────────────────────────────────────────────
export const healthCheck   = ()          => api.get('/health');
export const apiInfo       = ()          => api.get('/api/info');
export const bridgeStatus  = ()          => api.get('/api/bridge/status');
