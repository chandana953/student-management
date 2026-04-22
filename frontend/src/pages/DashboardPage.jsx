import { useState, useEffect } from 'react'
import { Navbar, StudentCard, StudentTable, LoadingSpinner, EmptyState, SearchBar, Button } from '../components'
import { useStudents } from '../hooks'
import { useSocket } from '../context/SocketContext'

/**
 * Dashboard Page with Real-Time Updates
 * 
 * Main page displaying all students with CRUD operations
 * WHY: Central hub for data management with WebSocket real-time updates
 * 
 * Features:
 * - Real-time updates via WebSocket (Socket.IO)
 * - Instant UI updates when other users add/edit/delete students
 * - Connection status indicator
 * 
 * WebSocket Events:
 * - student:created - Add new student to list
 * - student:updated - Update student in list
 * - student:deleted - Remove student from list
 */
export function DashboardPage() {
  const { students, loading, error, deleteStudent, searchStudents, refetch } = useStudents()
  const { connected, lastEvent, clearLastEvent } = useSocket()
  const [viewType, setViewType] = useState('card') // 'card' or 'table'
  const [searchOpen, setSearchOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [realtimeNotification, setRealtimeNotification] = useState(null)

  // Handle real-time WebSocket events
  useEffect(() => {
    if (!lastEvent) return

    const { type, data } = lastEvent
    
    switch (type) {
      case 'created':
        setRealtimeNotification(`New student added: ${data.student.name}`)
        break
      case 'updated':
        setRealtimeNotification(`Student updated: ${data.student.name}`)
        break
      case 'deleted':
        setRealtimeNotification('Student deleted')
        break
    }

    // Clear notification after 3 seconds
    const timer = setTimeout(() => {
      setRealtimeNotification(null)
    }, 3000)

    // Refetch to get latest data
    refetch()
    clearLastEvent()

    return () => clearTimeout(timer)
  }, [lastEvent, refetch, clearLastEvent])

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
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">👥 Student Dashboard</h1>
                <p className="text-gray-600">Manage all your students in one place</p>
              </div>
              {/* WebSocket Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                connected 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                {connected ? '🔴 Live' : '⏳ Connecting...'}
              </div>
            </div>
          </div>

          {/* Real-time Notification */}
          {realtimeNotification && (
            <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg animate-pulse">
              <span className="font-bold">⚡ Real-time Update:</span> {realtimeNotification}
            </div>
          )}

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
