/**
 * API Configuration
 * 
 * Centralized API endpoint configuration
 * WHY: Easy to switch between development, staging, and production
 * Easy to find and update API endpoints
 * 
 * Environment Variables:
 * - VITE_API_BASE_URL: Backend URL (default: http://localhost:3000)
 * 
 * Access via: import.meta.env.VITE_API_BASE_URL
 */

// Use full URL to backend server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://student-management-eg5j.onrender.com'

export const API_ENDPOINTS = {
  students: {
    base: `${API_BASE_URL}/api/students`,
    getAll: `${API_BASE_URL}/api/students`,
    create: `${API_BASE_URL}/api/students`,
    getById: (id) => `${API_BASE_URL}/api/students/${id}`,
    update: (id) => `${API_BASE_URL}/api/students/${id}`,
    delete: (id) => `${API_BASE_URL}/api/students/${id}`,
    search: `${API_BASE_URL}/api/students/search`
  }
}

export const API_BASE = API_BASE_URL
