import { useState, useEffect } from 'react'
import { Button } from './Button'
import { uploadImage, validateImageFile } from '../services/uploadService'

/**
 * StudentForm Component with Image Upload
 * 
 * Reusable form for adding/editing students with local image storage
 * Features:
 * - File upload with preview
 * - Image validation (type, size)
 * - Upload progress indication
 * - Local file storage (saved to /public/uploads)
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
    course: 'Computer Science',
    imageUrl: ''
  })

  const [errors, setErrors] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Load initial student data including imageUrl
  useEffect(() => {
    if (initialStudent) {
      setFormData({
        name: initialStudent.name,
        age: initialStudent.age,
        course: initialStudent.course,
        imageUrl: initialStudent.imageUrl || ''
      })
      // Set existing image preview if editing
      if (initialStudent.imageUrl) {
        setImagePreview(initialStudent.imageUrl)
      }
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

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    
    if (!file) return

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, image: validation.error }))
      return
    }

    // Clear previous errors
    setErrors(prev => ({ ...prev, image: '' }))
    setSelectedFile(file)

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  // Upload image to server
  const handleImageUpload = async () => {
    if (!selectedFile) return

    setUploadingImage(true)
    try {
      const result = await uploadImage(selectedFile)
      
      // Save image URL to form data (use fullImageUrl for display)
      setFormData(prev => ({ ...prev, imageUrl: result.fullImageUrl || result.imageUrl }))
      setErrors(prev => ({ ...prev, image: '' }))
      
      // Clear file selection after successful upload
      setSelectedFile(null)
      
      console.log('Image uploaded successfully:', result.fullImageUrl || result.imageUrl)
    } catch (error) {
      console.error('Image upload failed:', error)
      setErrors(prev => ({ ...prev, image: error.message || 'Failed to upload image' }))
    } finally {
      setUploadingImage(false)
    }
  }

  // Clear selected image
  const handleClearImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, imageUrl: '' }))
    if (imagePreview && !formData.imageUrl) {
      URL.revokeObjectURL(imagePreview)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // If there's a selected file not yet uploaded, upload it first
    if (selectedFile && !formData.imageUrl) {
      await handleImageUpload()
    }
    
    if (validateForm()) {
      // Convert age to number before sending to backend
      const dataToSubmit = {
        ...formData,
        age: parseInt(formData.age, 10)
      }
      onSubmit(dataToSubmit)
    }
  }

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && !formData.imageUrl) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [])

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

      {/* Image Upload Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Student Photo
        </label>
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4 relative inline-block">
            <img
              src={imagePreview}
              alt="Student preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={handleClearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition"
              title="Remove image"
            >
              ×
            </button>
          </div>
        )}

        {/* File Input */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="image"
            className={`px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer transition ${
              errors.image
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-primary-500 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm text-gray-600">
              {selectedFile ? selectedFile.name : '📷 Choose Photo'}
            </span>
          </label>
          
          {/* Upload Button (only if file selected but not uploaded) */}
          {selectedFile && !formData.imageUrl && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleImageUpload}
              disabled={uploadingImage}
              className="text-sm"
            >
              {uploadingImage ? '⏳ Uploading...' : '☁️ Upload'}
            </Button>
          )}
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-2">
          Accepted: JPG, PNG, GIF, WebP (Max 5MB)
        </p>

        {/* Error Message */}
        {errors.image && (
          <p className="text-red-600 text-sm mt-1" role="alert">
            {errors.image}
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
