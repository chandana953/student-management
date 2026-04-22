import { useState, useEffect } from 'react'
import { Button } from './Button'

/**
 * StudentForm Component
 * 
 * Reusable form for adding/editing students
 * WHY: Single component handles both CREATE and UPDATE operations,
 * reducing code duplication. Props determine initial values and behavior.
 * 
 * Props:
 * - initialStudent: pre-filled data (null for new student)
 * - onSubmit: callback when form is submitted
 * - isLoading: loading state
 */
export function StudentForm({ initialStudent = null, onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    course: 'Computer Science'
  })

  const [errors, setErrors] = useState({})

  // useEffect: Simulate data loading when component mounts or initialStudent changes
  // WHY: Demonstrates lifecycle management. In future, could fetch data from API here.
  useEffect(() => {
    if (initialStudent) {
      setFormData({
        name: initialStudent.name,
        age: initialStudent.age,
        course: initialStudent.course
      })
    }
  }, [initialStudent])

  // Basic frontend validation
  // WHY: Provides immediate user feedback without server call
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.age || formData.age < 15 || formData.age > 80) {
      newErrors.age = 'Age must be between 15 and 80'
    }
    if (!formData.course.trim()) {
      newErrors.course = 'Course is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change using closure
  // WHY: Closure captures 'field' in scope, allowing reusable handler.
  // Demonstrates how closures work in React event handlers.
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Convert age to number before sending to backend
      const dataToSubmit = {
        ...formData,
        age: parseInt(formData.age, 10)
      }
      onSubmit(dataToSubmit)
    }
  }

  const courses = ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'Web Development']

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Student Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., John Doe"
          className={`input-field ${errors.name ? 'ring-2 ring-red-500' : ''}`}
          aria-label="Student Name"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Age Field */}
      <div>
        <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
          Age * (15-80 years)
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="e.g., 20"
          min="15"
          max="80"
          className={`input-field ${errors.age ? 'ring-2 ring-red-500' : ''}`}
          aria-label="Student Age"
          aria-invalid={!!errors.age}
        />
        {errors.age && (
          <p className="text-red-600 text-sm mt-1" role="alert">
            {errors.age}
          </p>
        )}
      </div>

      {/* Course Field */}
      <div>
        <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">
          Course *
        </label>
        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          className={`input-field ${errors.course ? 'ring-2 ring-red-500' : ''}`}
          aria-label="Student Course"
          aria-invalid={!!errors.course}
        >
          {courses.map(course => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
        {errors.course && (
          <p className="text-red-600 text-sm mt-1" role="alert">
            {errors.course}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? '⏳ Processing...' : initialStudent ? '💾 Update Student' : '➕ Add Student'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
