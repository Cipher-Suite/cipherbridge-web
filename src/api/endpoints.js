// src/api/endpoints.js — typed API calls
import { api } from './client';

// ── Auth ──────────────────────────────────────────────
export const createUser = () =>
  api.post('/api/users');

// ── Accounts ──────────────────────────────────────────
export const listAccounts = () =>
  api.get('/api/accounts');

export const getAccount = (id) =>
  api.get(`/api/accounts/${id}`);

export const createAccount = (mt5Login, mt5Password, mt5Server) =>
  api.post('/api/accounts', { mt5_login: mt5Login, mt5_password: mt5Password, mt5_server: mt5Server });

export const deleteAccount = (id) =>
  api.del(`/api/accounts/${id}`);

export const pauseAccount = (id) =>
  api.post(`/api/accounts/${id}/pause`);

export const resumeAccount = (id) =>
  api.post(`/api/accounts/${id}/resume`);

// ── Trading ───────────────────────────────────────────
export const getPositions = () =>
  api.get('/api/positions');

export const getAccountInfo = () =>
  api.get('/api/account');

export const placeOrder = ({ symbol, side, orderType, volume, sl, tp, price, comment }) =>
  api.post('/api/orders', { symbol, side, orderType, volume, sl, tp, price, comment });

export const closeOrder = (ticket) =>
  api.post('/api/orders/close', { ticket });

export const modifyOrder = (ticket, sl, tp) =>
  api.post('/api/orders/modify', { ticket, sl, tp });

// ── Market Data ───────────────────────────────────────
export const getSymbolInfo = (symbol) =>
  api.get(`/api/symbols/${symbol}`);

export const getHistory = (symbol, timeframe, from, to) =>
  api.get(`/api/history?symbol=${symbol}&timeframe=${timeframe}&from=${from}&to=${to}`);

// ── System ────────────────────────────────────────────
export const healthCheck = () =>
  api.get('/health');
