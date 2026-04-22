import { API_BASE } from '../utils/api.config'
import { APIError } from '../utils/apiError'

// TEMPORARY: Hardcoded backend URL for testing
const BACKEND_URL = 'http://localhost:3000'

/**
 * Authentication Service
 * 
 * WHY: Handles all authentication API calls
 * Manages JWT token storage and retrieval
 * Provides clean interface for auth operations
 * 
 * Token Storage: localStorage (simple approach)
 * Token Format: JWT (JSON Web Token)
 */

const AUTH_TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'

/**
 * Store authentication data
 */
const setAuthData = (token, user) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * Clear authentication data (logout)
 */
const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Get stored token
 */
export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

/**
 * Get stored user data
 */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken()
}

/**
 * Fetch wrapper with auth header
 */
const fetchWithAuth = async (url, options = {}) => {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      // Handle specific auth errors
      if (response.status === 401) {
        // Token expired or invalid - clear auth data
        clearAuthData()
        throw new APIError('Session expired. Please login again.', 401)
      }
      
      const data = await response.json().catch(() => ({}))
      throw new APIError(
        data.message || `HTTP Error ${response.status}`,
        response.status,
        data
      )
    }
    
    // Handle empty responses
    if (response.status === 204) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    // Network error
    throw new APIError(
      'Network error. Please check your connection.',
      0,
      { originalError: error }
    )
  }
}

/**
 * User Signup
 * POST /api/auth/signup
 */
export const signup = async (userData) => {
  const url = `${BACKEND_URL}/api/auth/signup`
  console.log('Signup URL:', url) // Debug
  
  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(userData)
  })
  
  // Store auth data
  if (response.token && response.user) {
    setAuthData(response.token, response.user)
  }
  
  return response
}

/**
 * User Login
 * POST /api/auth/login
 */
export const login = async (credentials) => {
  const response = await fetchWithAuth(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
  
  // Store auth data
  if (response.token && response.user) {
    setAuthData(response.token, response.user)
  }
  
  return response
}

/**
 * Get Current User
 * GET /api/auth/me
 */
export const getCurrentUser = async () => {
  return fetchWithAuth(`${BACKEND_URL}/api/auth/me`)
}

/**
 * Logout
 * POST /api/auth/logout
 */
export const logout = async () => {
  try {
    await fetchWithAuth(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST'
    })
  } finally {
    // Always clear local auth data
    clearAuthData()
  }
}

/**
 * Update auth token (for token refresh if implemented)
 */
export const updateToken = (newToken) => {
  localStorage.setItem(AUTH_TOKEN_KEY, newToken)
}

// Export clearAuthData for direct use
export { clearAuthData }
