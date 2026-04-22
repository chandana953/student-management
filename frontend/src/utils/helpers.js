/**
 * Utility Functions
 * 
 * Helper functions for the application
 * WHY: Centralized, reusable utility logic. Makes code DRY and testable.
 */

/**
 * Format date string
 * Example: "2024-01-15" -> "Jan 15, 2024"
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Generate unique ID
 * Used for temporary client-side IDs
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Validate email (simple check)
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate age
 */
export const isValidAge = (age) => {
  const ageNum = parseInt(age)
  return ageNum >= 15 && ageNum <= 80
}
