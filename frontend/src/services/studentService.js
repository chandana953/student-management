import { fetchAPI, handleAPIError, getAuthHeaders } from '../utils';

/**
 * Student API Service
 * 
 * Handles all API calls for student CRUD operations
 * WHY: Centralizes API logic, making it reusable and maintainable
 * Provides clean interface for components to interact with backend
 * 
 * NOTE: VITE_API_BASE_URL is set in .env for development
 * and in Render dashboard for production
 */

// Backend URL - uses environment variable for flexibility
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://student-management-eg5j.onrender.com';

/**
 * Student Service Layer - Real API Integration
 * 
 * Handles all API communication with the backend
 * WHY: Separates data logic from UI components. Makes it easy to change
 * API implementation without touching component code.
 * 
 * Features:
 * - Uses fetch API with async/await
 * - Centralized error handling
 * - Request validation
 * - Consistent response handling
 */

export const studentService = {
  /**
   * Fetch all students
   * GET /api/students
   * 
   * Returns: Array of students
   * Throws: APIError on network or server error
   */
  async getStudents() {
    const response = await fetchAPI(`${BACKEND_URL}/api/students`)
    // Backend returns { total, page, data: [...students] }
    return response.data || []
  },

  /**
   * Fetch single student by ID
   * GET /api/students/:id
   * 
   * Args: id - Student ID
   * Returns: Student object
   * Throws: APIError if not found or on error
   */
  async getStudentById(id) {
    if (!id) {
      throw new Error('Student ID is required')
    }
    const student = await fetchAPI(`${BACKEND_URL}/api/students/${id}`)
    return student
  },

  /**
   * Create new student
   * POST /api/students
   * 
   * Args: studentData - { name, age, course }
   * Returns: Created student object with ID
   * Throws: APIError on validation error or network error
   */
  async createStudent(studentData) {
    // Validate required fields
    if (!studentData.name || !studentData.age || !studentData.course) {
      throw new Error('Name, age, and course are required')
    }

    const data = await fetchAPI(`${BACKEND_URL}/api/students`, {
      method: 'POST',
      body: JSON.stringify(studentData)
    })

    return data
  },

  /**
   * Update existing student
   * PUT /api/students/:id
   * 
   * Args: 
   *   id - Student ID to update
   *   studentData - { name, age, course } - partial or full update
   * Returns: Updated student object
   * Throws: APIError if not found or on error
   */
  async updateStudent(id, studentData) {
    if (!id) {
      throw new Error('Student ID is required')
    }

    // Validate at least one field is provided
    if (!studentData.name && !studentData.age && !studentData.course) {
      throw new Error('At least one field (name, age, or course) is required')
    }

    const data = await fetchAPI(`${BACKEND_URL}/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    })

    return data
  },

  /**
   * Delete student
   * DELETE /api/students/:id
   * 
   * Args: id - Student ID to delete
   * Returns: Deleted student object (or null)
   * Throws: APIError if not found or on error
   */
  async deleteStudent(id) {
    if (!id) {
      throw new Error('Student ID is required')
    }

    const data = await fetchAPI(`${BACKEND_URL}/api/students/${id}`, {
      method: 'DELETE'
    })

    return data
  },

  /**
   * Search students
   * This is a client-side search for now
   * If backend has search endpoint, can be adapted:
   * GET /api/students/search?q=query
   * 
   * Args: query - Search string
   * Returns: Array of matching students
   */
  async searchStudents(query) {
    if (!query.trim()) {
      return this.getStudents()
    }

    // Get all students and filter client-side
    // In production, use backend search endpoint for large datasets
    const students = await this.getStudents()
    const lowerQuery = query.toLowerCase()

    return students.filter(
      s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.course.toLowerCase().includes(lowerQuery)
    )
  }
}


