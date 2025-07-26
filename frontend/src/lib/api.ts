export function apiFetch(path: string, init?: RequestInit) {
  if (typeof window === 'undefined') {
      return fetch(`http://backend:8000${path}`, init);
  }
  
  return fetch(`/api${path}`, init);
}