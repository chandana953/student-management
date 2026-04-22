/**
 * API Error Handling Utility
 * 
 * Provides consistent error handling and user-friendly error messages
 * WHY: Centralize error handling logic, avoid duplication
 */

export class APIError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

/**
 * Parse error response from API
 * Handles different error formats and provides user-friendly messages
 */
export async function handleAPIError(response) {
  let data
  try {
    data = await response.json()
  } catch {
    data = { message: response.statusText }
  }

  const message = data.message || data.error || `HTTP Error ${response.status}`

  // Handle 401 - clear auth data and redirect to login
  if (response.status === 401) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    // Let the component handle redirect
  }

  // User-friendly error messages
  const errorMessages = {
    400: 'Invalid data. Please check your input.',
    401: 'Session expired. Please log in again.',
    404: 'The requested resource was not found.',
    409: 'This resource already exists.',
    500: 'Server error. Please try again later.',
    503: 'Service unavailable. Please try again later.'
  }

  const userMessage = errorMessages[response.status] || message

  throw new APIError(userMessage, response.status, data)
}

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

/**
 * Fetch wrapper with error handling and auth support
 * Catches network errors, JSON parsing errors, and API errors
 * Automatically adds Authorization header if token exists
 */
export async function fetchAPI(url, options = {}) {
  try {
    const token = getAuthToken()
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(url, {
      headers,
      ...options
    })

    if (!response.ok) {
      await handleAPIError(response)
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError) {
      throw new APIError(
        'Network error. Please check your connection and try again.',
        0,
        { originalError: error }
      )
    }

    // Re-throw if already APIError
    if (error instanceof APIError) {
      throw error
    }

    // Generic error
    throw new APIError(
      error.message || 'An unexpected error occurred',
      0,
      { originalError: error }
    )
  }
}
