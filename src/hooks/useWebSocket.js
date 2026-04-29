// src/hooks/useWebSocket.js
// Real-time connection to Tonpo Gateway /ws endpoint.
// Connects using the API key as a query param (browser WS cannot set headers).
import { useEffect, useRef, useCallback, useState } from 'react';
import { api } from '../api/client';
import { GATEWAY_URL } from '../theme';

const WS_RECONNECT_DELAY_MS = [1000, 2000, 4000, 8000, 16000, 30000];
const WS_MAX_ATTEMPTS = 10;

export function useGatewayWS({ onMessage, enabled = true } = {}) {
  const [connected, setConnected] = useState(false);
  const wsRef     = useRef(null);
  const timerRef  = useRef(null);
  const attempt   = useRef(0);
  const onMsgRef  = useRef(onMessage);
  onMsgRef.current = onMessage;

  const connect = useCallback(() => {
    const key = api.getApiKey();
    if (!key || !enabled) return;

    // Build wss:// URL from GATEWAY_URL
    const base = GATEWAY_URL.replace(/^http/, 'ws');
    const url  = `${base}/ws?api_key=${encodeURIComponent(key)}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      attempt.current = 0;
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        onMsgRef.current?.(msg);
      } catch {}
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
      if (!enabled) return;
      if (attempt.current >= WS_MAX_ATTEMPTS) {
        console.warn('WS: max reconnect attempts reached, giving up');
        return;
      }
      const delay = WS_RECONNECT_DELAY_MS[
        Math.min(attempt.current, WS_RECONNECT_DELAY_MS.length - 1)
      ];
      attempt.current++;
      timerRef.current = setTimeout(connect, delay);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [enabled]);

  useEffect(() => {
    if (enabled) connect();
    return () => {
      clearTimeout(timerRef.current);
      wsRef.current?.close();
    };
  }, [enabled, connect]);

  const send = useCallback((msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  return { connected, send };
}
