import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar, StudentForm, LoadingSpinner } from '../components'
import { useStudents } from '../hooks'
import { studentService } from '../services/studentService'

/**
 * Form Page (Add/Edit Student)
 * 
 * Handles both creating new students and editing existing ones
 * WHY: Single component reduces code duplication. Reusability through props/state.
 * 
 * Demonstrates:
 * - useState for managing form submission state
 * - useParams hook for getting URL parameters
 * - useEffect for loading specific student data from API
 * - Conditional rendering based on route params
 * - Real API integration
 */
export function FormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addStudent, updateStudent } = useStudents()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingStudent, setIsLoadingStudent] = useState(!!id) // Load if editing
  const [error, setError] = useState(null)
  const [studentToEdit, setStudentToEdit] = useState(null)

  const isEditMode = !!id

  // Fetch specific student if editing
  useEffect(() => {
    if (id) {
      fetchStudent(id)
    }
  }, [id])

  const fetchStudent = async (studentId) => {
    try {
      setIsLoadingStudent(true)
      setError(null)
      const student = await studentService.getStudentById(studentId)
      setStudentToEdit(student)
    } catch (err) {
      const errorMessage =
        err.message || 'Failed to load student. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoadingStudent(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (isEditMode) {
        await updateStudent(id, formData)
        alert('✅ Student updated successfully!')
      } else {
        await addStudent(formData)
        alert('✅ Student added successfully!')
      }

      // Navigate back to dashboard
      navigate('/dashboard')
    } catch (err) {
      const errorMessage =
        err.message || 'An error occurred. Please try again.'
      setError(errorMessage)
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container-main">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {isEditMode ? '✏️ Edit Student' : '➕ Add New Student'}
            </h1>
            <p className="text-gray-600">
              {isEditMode
                ? 'Update student information'
                : 'Add a new student to the system'}
            </p>
          </div>

          {/* Loading State */}
          {isLoadingStudent && (
            <LoadingSpinner message="Loading student data..." />
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              {isEditMode && (
                <button
                  onClick={() => fetchStudent(id)}
                  className="underline hover:no-underline font-bold"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Form Section */}
          {!isLoadingStudent && (
            <div className="max-w-2xl mx-auto">
              <div className="card">
                <StudentForm
                  initialStudent={studentToEdit || undefined}
                  onSubmit={handleSubmit}
                  isLoading={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">💡 Tip</h3>
            <p className="text-blue-800 text-sm">
              All fields are required. Name must be at least 2 characters,
              age should be between 15-80 years, and you need to select a
              course.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

