const API_URL = 'http://localhost:8000'

/**
 * @typedef {'security' | 'admin'} UserRole
 * @typedef {{ id: string, name: string, role: UserRole }} AuthUser
 * @typedef {{ access_token: string, user: AuthUser }} AuthResponse
 * @typedef {{ email: string, password: string, rememberDevice?: boolean }} LoginCredentials
 */

/**
 * @param {LoginCredentials} credentials
 * @returns {Promise<AuthResponse>}
 */
export async function login({ email, password, rememberDevice }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || 'Login failed')
  }

  const data = await res.json()
  const storage = rememberDevice ? localStorage : sessionStorage
  storage.setItem('token', data.access_token)
  storage.setItem('user', JSON.stringify(data.user))

  return data
}

export async function register({ name, email, password, role }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || 'Registration failed')
  }

  return res.json()
}

export function getCurrentUser() {
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
}

export function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
}