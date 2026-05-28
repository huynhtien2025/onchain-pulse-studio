const withTimeout = async (promise, ms = 12000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await promise(controller.signal);
  } finally {
    clearTimeout(timer);
  }
};

async function requestJson(url, options = {}) {
  const startedAt = Date.now();
  try {
    const res = await withTimeout((signal) => fetch(url, { ...options, signal }), options.timeoutMs || 12000);
    const text = await res.text();
    let body = null;
    if (text) {
      try { body = JSON.parse(text); } catch { body = text; }
    }
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status} ${res.statusText}`);
      err.status = res.status;
      err.body = body;
      err.url = url;
      throw err;
    }
    return { ok: true, status: res.status, body, latencyMs: Date.now() - startedAt, url };
  } catch (error) {
    return {
      ok: false,
      status: error.status || 0,
      error: error.message || String(error),
      body: error.body || null,
      latencyMs: Date.now() - startedAt,
      url
    };
  }
}

function qs(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  });
  const out = search.toString();
  return out ? `?${out}` : '';
}

module.exports = { requestJson, qs };
