import { useState, useEffect } from 'react'
import { studentService } from '../services/studentService'

/**
 * useStudents Hook - Real API Integration
 * 
 * Custom hook to manage student data from real backend API
 * 
 * WHY: Extracts data-fetching logic from components, making them reusable
 * and testable. Components stay focused on UI rendering.
 * 
 * Features:
 * - Handles API calls with error handling
 * - Manages loading and error states
 * - Provides CRUD operations
 * - Handles network errors gracefully
 */
export function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents()
  }, [])

  /**
   * Fetch all students from API
   * Shows loading state and handles errors
   */
  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await studentService.getStudents()
      setStudents(data)
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch students. Please try again.'
      setError(errorMessage)
      console.error('Fetch students error:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Add new student
   * Creates student on backend and updates local state
   */
  const addStudent = async (studentData) => {
    try {
      setError(null)
      const newStudent = await studentService.createStudent(studentData)
      setStudents(prev => [...prev, newStudent])
      return newStudent
    } catch (err) {
      const errorMessage = err.message || 'Failed to add student. Please try again.'
      setError(errorMessage)
      throw err
    }
  }

  /**
   * Update existing student
   * Updates student on backend and updates local state
   */
  const updateStudent = async (id, studentData) => {
    try {
      setError(null)
      const updated = await studentService.updateStudent(id, studentData)
      setStudents(prev =>
        prev.map(s => (s._id === id || s.id === id ? updated : s))
      )
      return updated
    } catch (err) {
      const errorMessage = err.message || 'Failed to update student. Please try again.'
      setError(errorMessage)
      throw err
    }
  }

  /**
   * Delete student
   * Removes student from backend and updates local state
   * Handles both _id and id fields for flexibility
   */
  const deleteStudent = async (id) => {
    try {
      setError(null)
      await studentService.deleteStudent(id)
      setStudents(prev => prev.filter(s => s._id !== id && s.id !== id))
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete student. Please try again.'
      setError(errorMessage)
      throw err
    }
  }

  /**
   * Search students
   * Filters students based on query
   */
  const searchStudents = async (query) => {
    try {
      setError(null)
      if (!query.trim()) {
        await fetchStudents()
        return
      }
      const results = await studentService.searchStudents(query)
      setStudents(results)
    } catch (err) {
      const errorMessage = err.message || 'Failed to search students. Please try again.'
      setError(errorMessage)
    }
  }

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    refetch: fetchStudents,
    setError // Allow clearing errors manually
  }
}
