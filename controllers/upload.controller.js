const { upload, getFileUrl, deleteFile } = require('../config/upload');
const path = require('path');

/**
 * Upload Controller - Local File Storage
 * 
 * WHY: Simple local file storage - no external services!
 * Files saved to /public/uploads and served statically
 * 
 * Features:
 * - Single file upload endpoint
 * - Multiple file upload endpoint
 * - Local file storage
 * - Error handling
 */

/**
 * Upload single image
 * POST /api/upload/image
 * 
 * Saves file to local storage and returns URL
 */
exports.uploadImage = [
  // Multer middleware - handles file upload
  upload.single('image'),
  
  // Controller logic
  async (req, res, next) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          message: 'No image file provided',
          error: 'Please upload an image file (jpg, jpeg, png, gif, webp)'
        });
      }

      // File is already saved by multer - just get the URL
      const imageUrl = getFileUrl(req.file.filename);
      
      console.log('Image saved locally:', req.file.filename);
      console.log('URL:', imageUrl);

      // Return success response
      res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      if (error.message.includes('Only image files')) {
        return res.status(400).json({
          message: 'Invalid file type',
          error: error.message
        });
      }

      next(error);
    }
  }
];

/**
 * Upload multiple images
 * POST /api/upload/images
 * 
 * Allows uploading up to 5 images at once
 */
exports.uploadMultipleImages = [
  upload.array('images', 5), // Max 5 files
  
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: 'No image files provided',
          error: 'Please upload at least one image file'
        });
      }

      const uploadResults = req.files.map(file => ({
        imageUrl: getFileUrl(file.filename),
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
      }));

      console.log(`Uploaded ${uploadResults.length} images locally`);

      res.status(200).json({
        message: `Uploaded ${uploadResults.length} images successfully`,
        images: uploadResults
      });

    } catch (error) {
      next(error);
    }
  }
];

/**
 * Delete local image file
 * DELETE /api/upload/image
 * 
 * Requires filename or imageUrl in request body
 */
exports.deleteImage = async (req, res, next) => {
  try {
    const { imageUrl, filename } = req.body;

    // Get filename from URL if not provided directly
    let fileToDelete = filename;
    if (!fileToDelete && imageUrl) {
      // Extract filename from URL like "/uploads/student-123.jpg"
      const parts = imageUrl.split('/');
      fileToDelete = parts[parts.length - 1];
    }

    if (!fileToDelete) {
      return res.status(400).json({
        message: 'Missing required field',
        error: 'Please provide either filename or imageUrl'
      });
    }

    // Delete local file
    await deleteFile(fileToDelete);

    res.status(200).json({
      message: 'Image deleted successfully',
      filename: fileToDelete
    });

  } catch (error) {
    console.error('Delete image error:', error);
    next(error);
  }
};
