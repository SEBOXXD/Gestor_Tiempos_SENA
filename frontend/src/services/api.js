const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiGet(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function apiPost(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function apiPut(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function apiDelete(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
