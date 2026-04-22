import { useAuth } from '../context/AuthContext'

/**
 * Navbar Component
 * 
 * Navigation header shared across all pages
 * WHY: Centralizes navigation logic and header UI, ensuring consistent
 * branding and navigation across the app. Now includes authentication controls.
 */
export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-main py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary-600">
            📚 StudentHub
          </h1>
          <p className="text-xs text-gray-500">Student Management System</p>
        </div>
        
        <ul className="flex gap-6 items-center">
          <li>
            <a href="/" className="text-gray-600 hover:text-primary-600 transition">
              Home
            </a>
          </li>
          
          {/* Show these only when authenticated */}
          {isAuthenticated && (
            <>
              <li>
                <a href="/dashboard" className="text-gray-600 hover:text-primary-600 transition">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/add" className="btn-primary text-sm">
                  + Add Student
                </a>
              </li>
              
              {/* User info and logout */}
              <li className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  👤 {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800 transition"
                  title="Logout"
                >
                  🚪 Logout
                </button>
              </li>
            </>
          )}
          
          {/* Show login when not authenticated */}
          {!isAuthenticated && (
            <li>
              <a href="/login" className="btn-primary text-sm">
                🔐 Login
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
