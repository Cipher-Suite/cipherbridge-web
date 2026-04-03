// src/hooks/useAccounts.js
import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/endpoints';

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listAccounts();
      setAccounts(data.accounts || []);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (login, password, server) => {
    const data = await api.createAccount(login, password, server);
    await refresh();
    return data;
  };

  const remove = async (id) => {
    await api.deleteAccount(id);
    await refresh();
  };

  const pause = async (id) => {
    await api.pauseAccount(id);
    await refresh();
  };

  const resume = async (id) => {
    await api.resumeAccount(id);
    await refresh();
  };

  return { accounts, loading, error, refresh, create, remove, pause, resume };
}

// src/hooks/usePositions.js
export function usePositions() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPositions();
      setPositions(data.positions || []);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const close = async (ticket) => {
    await api.closeOrder(ticket);
    await refresh();
  };

  return { positions, loading, error, refresh, close };
}

// src/hooks/useHealth.js
export function useHealth() {
  const [health, setHealth] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.healthCheck();
      setHealth(data);
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 30000);
    return () => clearInterval(iv);
  }, [refresh]);

  return health;
}
