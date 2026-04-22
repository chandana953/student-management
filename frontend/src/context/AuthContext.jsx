import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginService, signup as signupService, logout as logoutService, getUser, getToken } from '../services/authService'

/**
 * AuthContext
 * 
 * WHY: Provides global authentication state to all components
 * Avoids prop drilling through component tree
 * Centralizes auth logic and state management
 */

const AuthContext = createContext(null)

/**
 * AuthProvider Component
 * Wraps the app and provides auth state to all children
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check auth status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  /**
   * Check if user is already authenticated (on page load)
   */
  const checkAuth = () => {
    const token = getToken()
    const userData = getUser()
    
    if (token && userData) {
      setUser(userData)
      setIsAuthenticated(true)
    }
    
    setLoading(false)
  }

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      const response = await loginService({ email, password })
      
      if (response.user && response.token) {
        setUser(response.user)
        setIsAuthenticated(true)
        return { success: true }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      }
    }
  }

  /**
   * Signup user
   */
  const signup = async (name, email, password) => {
    try {
      const response = await signupService({ name, email, password })
      
      if (response.user && response.token) {
        setUser(response.user)
        setIsAuthenticated(true)
        return { success: true }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Signup failed' 
      }
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await logoutService()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      navigate('/login')
    }
  }

  /**
   * Require auth - redirect to login if not authenticated
   */
  const requireAuth = () => {
    if (!isAuthenticated && !loading) {
      navigate('/login')
      return false
    }
    return true
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    requireAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth Hook
 * Easy way to access auth context in components
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}
