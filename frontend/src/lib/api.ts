export function apiFetch(path: string, init?: RequestInit) {
  if (typeof window === 'undefined') {
    const base =
      process.env.NODE_ENV === 'development'
        ? 'http://backend:8000'
        : 'http://ipaddress:8000';
      return fetch(`${base}${path}`, init);
  } else {
    return fetch(`/api${path}`, init);
  }
}