// src/hooks/useData.js
import { useState, useEffect, useCallback, useRef } from 'react';
import * as api from '../api/endpoints';

// Visibility-aware polling — stops when tab hidden, resumes + refreshes on focus
function useVisibilityInterval(callback, delay) {
  const cbRef = useRef(callback);
  const idRef = useRef(null);
  useEffect(() => { cbRef.current = callback; }, [callback]);

  useEffect(() => {
    if (!delay) return;

    const start = () => {
      if (idRef.current) return; // already running
      idRef.current = setInterval(() => cbRef.current(), delay);
    };
    const stop = () => {
      clearInterval(idRef.current);
      idRef.current = null;
    };
    const onVisibility = () => {
      if (document.hidden) { stop(); } 
      else { cbRef.current(); start(); } // immediate refresh + restart
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [delay]);
}

// Generic async hook
function useAsync(fn, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);
  return { data, loading, error, refresh: run };
}

//  Accounts
export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listAccounts();
      setAccounts(data.accounts || []);
      setError(null);
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (login, pw, server) => {
    const data = await api.createAccount(login, pw, server);
    await refresh();
    return data;
  };
  const remove  = async (id) => { await api.deleteAccount(id);  await refresh(); };
  const pause   = async (id) => { await api.pauseAccount(id);   await refresh(); };
  const resume  = async (id) => { await api.resumeAccount(id);  await refresh(); };

  // Live-update an account's status from WS messages
  const updateStatus = useCallback((accountId, status) => {
    setAccounts(prev => prev.map(a =>
      (a.id === accountId || a.account_id === accountId) ? { ...a, status } : a
    ));
  }, []);

  return { accounts, loading, error, refresh, create, remove, pause, resume, updateStatus };
}

// Account detail
export function useAccountDetail(id) {
  const [account,  setAccount]  = useState(null);
  const [status,   setStatus]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const refresh = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [acct, stat] = await Promise.allSettled([
        api.getAccount(id),
        api.getAccountStatus(id),
      ]);
      if (acct.status === 'fulfilled') setAccount(acct.value);
      if (stat.status === 'fulfilled') setStatus(stat.value);
      setError(null);
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  return { account, status, loading, error, refresh };
}

// Positions
export function usePositions() {
  const [positions, setPositions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPositions();
      setPositions(data.positions || []);
      setError(null);
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useVisibilityInterval(refresh, 10000);

  const close = async (ticket) => {
    await api.closeOrder(ticket);
    await refresh();
  };

  return { positions, loading, error, refresh, close };
}

//  Health
export function useHealth() {
  const [health, setHealth] = useState(null);
  const refresh = useCallback(async () => {
    try { setHealth(await api.healthCheck()); } catch {}
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  useVisibilityInterval(refresh, 30000);
  return health;
}

// Webhooks
export function useWebhooks() {
  const [tokens,  setTokens]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listWebhooks();
      setTokens(data.tokens || []);
      setError(null);
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (accountId, label = '') => {
    const data = await api.createWebhook(accountId, label);
    await refresh();
    return data; // contains plaintext token + webhook_url — show once
  };

  const revoke = async (id) => {
    await api.revokeWebhook(id);
    await refresh();
  };

  const test = async (id, payload) => api.testWebhook(id, payload);

  return { tokens, loading, error, refresh, create, revoke, test };
}

// ── Admin ─────────────────────────────────────────────────────────────────
export function useAdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.adminListUsers();
      setUsers(data.users || data || []);
      setError(null);
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const deactivate = async (id) => { await api.adminDeactivate(id); await refresh(); };
  const rotateKey  = async (id) => api.adminRotateKey(id);
  const setAdmin   = async (id, v) => { await api.adminSetAdmin(id, v); await refresh(); };

  return { users, loading, error, refresh, deactivate, rotateKey, setAdmin };
}
