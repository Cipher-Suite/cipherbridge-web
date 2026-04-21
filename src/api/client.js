// src/api/client.js
import { GATEWAY_URL } from '../theme';

class ApiClient {
  constructor() {
    this.baseUrl = import.meta.env.PROD ? GATEWAY_URL : '';
    this.apiKey  = null;
  }

  setApiKey(key)   { this.apiKey = key; }
  clearApiKey()    { this.apiKey = null; }
  getApiKey()      { return this.apiKey; }

  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['X-API-Key'] = this.apiKey;

    const opts = { method, headers };
    if (body !== null) opts.body = JSON.stringify(body);

    let res;
    try {
      res = await fetch(`${this.baseUrl}${path}`, opts);
    } catch (e) {
      throw new ApiError('Network error — check your connection', 0, null);
    }

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!res.ok) {
      const msg = data?.error || data?.message || `HTTP ${res.status}`;
      throw new ApiError(msg, res.status, data);
    }
    return data;
  }

  get(path)              { return this.request('GET',    path); }
  post(path, body = {})  { return this.request('POST',   path, body); }
  put(path, body = {})   { return this.request('PUT',    path, body); }
  del(path)              { return this.request('DELETE', path); }
  patch(path, body = {}) { return this.request('PATCH',  path, body); }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data   = data;
  }
}

export const api = new ApiClient();
