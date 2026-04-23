import { getToken } from './authService';

/**
 * Upload Service
 * 
 * WHY: Handles file uploads to backend for local storage
 * Provides clean interface for image upload operations
 * 
 * Features:
 * - Single file upload
 * - Progress tracking (can be extended)
 * - Error handling
 * - Authentication via JWT
 * 
 * NOTE: VITE_API_BASE_URL is set in .env for development
 * and in Render dashboard for production
 */

// Backend URL - uses environment variable for flexibility
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://student-management-eg5j.onrender.com';

/**
 * Upload single image file
 * 
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} - Upload result with imageUrl
 * @throws {Error} - If upload fails
 * 
 * Usage:
 * const result = await uploadImage(file);
 * console.log(result.imageUrl); // Cloudinary URL
 */
export const uploadImage = async (file) => {
  // Validate file
  if (!file) {
    throw new Error('No file provided');
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed (jpg, jpeg, png, gif, webp)');
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }

  // Create FormData for multipart upload
  const formData = new FormData();
  formData.append('image', file);

  // Get auth token
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required. Please login.');
  }

  try {
    console.log('Uploading file:', file.name);

    const response = await fetch(`${BACKEND_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Note: Don't set Content-Type, let browser set it with boundary
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `Upload failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert local URL to full URL for frontend display
    // Backend returns "/uploads/filename", we add backend URL prefix
    if (data.imageUrl && data.imageUrl.startsWith('/uploads/')) {
      data.fullImageUrl = `${BACKEND_URL}${data.imageUrl}`;
    } else {
      data.fullImageUrl = data.imageUrl;
    }
    
    console.log('Upload successful:', data.fullImageUrl);
    return data;

  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Upload multiple image files
 * 
 * @param {File[]} files - Array of image files
 * @returns {Promise<Object>} - Upload results
 * @throws {Error} - If upload fails
 * 
 * Usage:
 * const result = await uploadMultipleImages([file1, file2]);
 * console.log(result.images); // Array of image data
 */
export const uploadMultipleImages = async (files) => {
  // Validate files
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  if (files.length > 5) {
    throw new Error('Maximum 5 files allowed at once');
  }

  // Create FormData
  const formData = new FormData();
  files.forEach((file, index) => {
    // Validate each file
    if (!file.type.startsWith('image/')) {
      throw new Error(`File ${index + 1} is not an image`);
    }
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File ${index + 1} exceeds 5MB limit`);
    }

    formData.append('images', file);
  });

  // Get auth token
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required. Please login.');
  }

  try {
    console.log('Uploading', files.length, 'files');

    const response = await fetch(`${BACKEND_URL}/api/upload/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Multiple upload successful:', data.images?.length, 'files');
    return data;

  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * 
 * @param {string} imageUrl - Cloudinary image URL to delete
 * @returns {Promise<Object>} - Delete result
 * @throws {Error} - If deletion fails
 */
export const deleteImage = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error('Image URL is required');
  }

  const token = getToken();
  if (!token) {
    throw new Error('Authentication required. Please login.');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/upload/image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ imageUrl })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Delete failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Image deleted:', data);
    return data;

  } catch (error) {
    console.error('Delete image error:', error);
    throw error;
  }
};

/**
 * Get file size in human-readable format
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} - Human-readable size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate image file
 * 
 * @param {File} file - File to validate
 * @returns {Object} - Validation result { valid: boolean, error?: string }
 */
export const validateImageFile = (file) => {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Allowed: jpg, jpeg, png, gif, webp' 
    };
  }

  // Check file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File too large (${formatFileSize(file.size)}). Max: 5MB` 
    };
  }

  return { valid: true };
};

export default {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  formatFileSize,
  validateImageFile
};
