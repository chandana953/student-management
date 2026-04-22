import { useState } from 'react'
import { Navbar, StudentCard, StudentTable, LoadingSpinner, EmptyState, SearchBar, Button } from '../components'
import { useStudents } from '../hooks'

/**
 * Dashboard Page
 * 
 * Main page displaying all students with CRUD operations
 * WHY: Central hub for data management. Demonstrates state management,
 * rendering lists, and handling user interactions.
 * 
 * Demonstrates:
 * - useState for UI state (view type, loading)
 * - Custom hook (useStudents) for data management
 * - Conditional rendering
 * - Event handling with callbacks
 * - Virtual DOM concept (React re-renders only changed parts)
 */
export function DashboardPage() {
  const { students, loading, error, deleteStudent, searchStudents, refetch } = useStudents()
  const [viewType, setViewType] = useState('card') // 'card' or 'table'
  const [searchOpen, setSearchOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle delete with confirmation
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setIsDeleting(true)
        await deleteStudent(id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  // Handle search
  const handleSearch = async (e) => {
    const query = e.target.value
    await searchStudents(query)
  }

  // Handle edit - navigate to edit page
  const handleEdit = (student) => {
    // Use _id (MongoDB) or id (fallback)
    const studentId = student._id || student.id
    window.location.href = `/edit/${studentId}`
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container-main">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">👥 Student Dashboard</h1>
            <p className="text-gray-600">Manage all your students in one place</p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={refetch}
                className="underline hover:no-underline font-bold"
              >
                Retry
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              {/* View Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewType('card')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    viewType === 'card'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                  }`}
                  aria-label="Card view"
                >
                  🃏 Cards
                </button>
                <button
                  onClick={() => setViewType('table')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    viewType === 'table'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                  }`}
                  aria-label="Table view"
                >
                  📋 Table
                </button>
              </div>

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 font-medium transition"
              >
                🔍 Search
              </button>
            </div>

            {/* Search Bar */}
            {searchOpen && (
              <SearchBar 
                onChange={handleSearch}
                placeholder="Search by name or course..."
              />
            )}

            {/* Stats */}
            <div className="flex gap-4 text-sm text-gray-600">
              <span>📊 Total Students: <strong>{students.length}</strong></span>
            </div>
          </div>

          {/* Loading State */}
          {loading && <LoadingSpinner message="Loading students..." />}

          {/* Empty State */}
          {!loading && students.length === 0 && !error && (
            <EmptyState
              icon="📭"
              title="No Students Found"
              message="Add your first student to get started!"
            />
          )}

          {/* Students Grid/Table */}
          {!loading && students.length > 0 && (
            <div>
              {viewType === 'card' ? (
                // Card Layout (Mobile-friendly, responsive grid)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students.map(student => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                // Table Layout (Desktop-optimized)
                <div className="card overflow-x-auto">
                  <StudentTable
                    students={students}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Button - Always visible */}
          <div className="mt-8 text-center">
            <a href="/add">
              <Button className="px-8 py-3 text-lg">
                ➕ Add New Student
              </Button>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
