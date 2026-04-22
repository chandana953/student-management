import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LandingPage, DashboardPage, FormPage, LoginPage, SignupPage } from './pages'

/**
 * Protected Route Component
 * WHY: Redirects unauthenticated users to login
 * Guards protected routes from unauthorized access
 */
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

/**
 * Public Route Component
 * WHY: Redirects authenticated users to dashboard
 * Prevents logged-in users from accessing login/signup pages
 */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

/**
 * App Component
 * 
 * Root component that sets up routing for the entire application
 * WHY: Centralized routing logic. Easy to add/remove pages.
 * Includes authentication state management via AuthProvider
 * 
 * Demonstrates:
 * - React Router for client-side routing
 * - Component composition
 * - Route structure
 * - Protected routes with authentication
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Landing Page - Public */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes - Public only (redirect if logged in) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes - Require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/add" element={<FormPage />} />
            <Route path="/edit/:id" element={<FormPage />} />
          </Route>
          
          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
