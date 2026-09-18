// Authentication client for NMSight.
//
// For now this is mocked. The eventual backend contract is:
//   POST /api/auth/login  { email, password }
//   -> { access_token, user: { id, name, role } }
// The `role` returned here (never chosen by the user) will decide which
// dashboard the authenticated account can access.

/**
 * @typedef {'security' | 'admin'} UserRole
 * @typedef {{ id: string, name: string, role: UserRole }} AuthUser
 * @typedef {{ access_token: string, user: AuthUser }} AuthResponse
 * @typedef {{ email: string, password: string, rememberDevice?: boolean }} LoginCredentials
 */

/**
 * Sign in a campus operator.
 *
 * Replace the mocked body with a real request when the FastAPI backend is
 * ready, e.g.:
 *
 *   const res = await fetch('/api/auth/login', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ email, password }),
 *   })
 *   if (!res.ok) throw new Error('Invalid credentials')
 *   return await res.json()
 *
 * @param {LoginCredentials} credentials
 * @returns {Promise<AuthResponse>}
 */
export async function login({ email }) {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  return {
    access_token: 'mock-access-token',
    user: {
      id: 'mock-user',
      name: email.split('@')[0] || 'Operator',
      role: 'security',
    },
  }
}
