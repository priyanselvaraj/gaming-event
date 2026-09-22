import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

// Extract a readable message from a backend ApiError response
export function getErrorMessage(err) {
  return err?.response?.data?.message || err.message || 'Something went wrong'
}

// --- Simple localStorage-based session (see UserController for why) ---
export function saveSession(user) {
  localStorage.setItem('arenaPassUser', JSON.stringify(user))
}

export function getSession() {
  const raw = localStorage.getItem('arenaPassUser')
  return raw ? JSON.parse(raw) : null
}

export function clearSession() {
  localStorage.removeItem('arenaPassUser')
}
