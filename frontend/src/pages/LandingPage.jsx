import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components'

/**
 * Landing Page
 * 
 * Hero section with app introduction and features
 * WHY: First impression of the app. Explains value proposition to users.
 * Now includes authentication-aware CTAs.
 * 
 * Demonstrates:
 * - Semantic HTML (header, section, main)
 * - Responsive design with Tailwind
 * - Component reusability (Button component)
 * - Authentication context integration
 */
export function LandingPage() {
  const { isAuthenticated } = useAuth()
  const features = [
    {
      id: 1,
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'JWT-based authentication with password hashing. Your data is protected.'
    },
    {
      id: 2,
      icon: '➕',
      title: 'Create Students',
      description: 'Add new students with essential information like name, age, and course.'
    },
    {
      id: 3,
      icon: '👁️',
      title: 'View Students',
      description: 'See all students in a clean, organized dashboard with card and table views.'
    },
    {
      id: 4,
      icon: '✏️',
      title: 'Edit Students',
      description: 'Update student information anytime with our easy-to-use form.'
    },
    {
      id: 5,
      icon: '🗑️',
      title: 'Delete Students',
      description: 'Remove students from the system with a single click.'
    }
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-main text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            📚 Welcome to StudentHub
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            A modern, intuitive Student Management System
          </p>
          <p className="text-lg mb-10 max-w-2xl mx-auto opacity-80">
            Manage your students efficiently with our clean, responsive dashboard. 
            Add, edit, delete, and view student information all in one place.
          </p>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="secondary" className="text-lg px-8 py-3">
                📊 Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button variant="secondary" className="text-lg px-8 py-3">
                  🚀 Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="text-lg px-8 py-3 bg-white/10 border-white text-white hover:bg-white/20">
                  🔐 Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <h2 className="text-4xl font-bold text-center mb-4">Key Features</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to manage students effectively. Built with modern web technologies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(feature => (
              <div key={feature.id} className="card text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16">
        <div className="container-main">
          <h2 className="text-4xl font-bold text-center mb-12">Built With Modern Tech</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* React */}
            <div className="card">
              <h3 className="text-xl font-bold mb-3">⚛️ React</h3>
              <p className="text-gray-600 mb-3">
                Component-based UI library for building interactive user interfaces with reusable components.
              </p>
              <p className="text-sm text-gray-500">Uses: useState, useEffect, Custom Hooks</p>
            </div>

            {/* Tailwind */}
            <div className="card">
              <h3 className="text-xl font-bold mb-3">🎨 Tailwind CSS</h3>
              <p className="text-gray-600 mb-3">
                Utility-first CSS framework for rapid UI development with responsive design built-in.
              </p>
              <p className="text-sm text-gray-500">Mobile-first, Flexbox & Grid, Dark mode ready</p>
            </div>

            {/* Vite */}
            <div className="card">
              <h3 className="text-xl font-bold mb-3">⚡ Vite</h3>
              <p className="text-gray-600 mb-3">
                Next-generation frontend build tool for faster development and optimized production builds.
              </p>
              <p className="text-sm text-gray-500">Fast HMR, ES modules, Lightning fast</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-main text-center">
          <h2 className="text-4xl font-bold mb-6">
            {isAuthenticated ? 'Welcome back!' : 'Ready to get started?'}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {isAuthenticated 
              ? 'Continue managing your students from the dashboard.'
              : 'Create an account or sign in to start managing students securely.'}
          </p>
          
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="secondary" className="text-lg px-8 py-3">
                📊 Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button variant="secondary" className="text-lg px-8 py-3">
                  📝 Sign Up Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="text-lg px-8 py-3 bg-white/10 border-white text-white hover:bg-white/20">
                  🔐 Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container-main text-center">
          <p>&copy; 2024 StudentHub. Built with React, Node.js, MongoDB, and Tailwind CSS.</p>
          <p className="text-sm mt-2">Secure authentication with JWT & bcrypt 🔒</p>
        </div>
      </footer>
    </main>
  )
}
