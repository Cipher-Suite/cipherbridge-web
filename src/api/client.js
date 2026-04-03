// src/api/client.js — HTTP client with automatic auth header
import { GATEWAY_URL } from '../theme';

class ApiClient {
  constructor() {
    this.baseUrl = GATEWAY_URL;
    this.apiKey = null;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  clearApiKey() {
    this.apiKey = null;
  }

  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${this.baseUrl}${path}`, opts);
    const text = await res.text();

    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!res.ok) {
      const msg = data?.error || data?.message || `HTTP ${res.status}`;
      throw new ApiError(msg, res.status, data);
    }

    return data;
  }

  get(path)        { return this.request('GET', path); }
  post(path, body) { return this.request('POST', path, body); }
  del(path)        { return this.request('DELETE', path); }
  put(path, body)  { return this.request('PUT', path, body); }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Singleton
export const api = new ApiClient();
