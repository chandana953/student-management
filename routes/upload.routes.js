const express = require('express');
const uploadController = require('../controllers/upload.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Upload Routes
 * 
 * All routes are protected (require authentication)
 * 
 * POST /api/upload/image       - Upload single image
 * POST /api/upload/images      - Upload multiple images
 * DELETE /api/upload/image     - Delete image from Cloudinary
 */

// Single image upload
router.post('/image', authMiddleware, ...uploadController.uploadImage);

// Multiple images upload (up to 5)
router.post('/images', authMiddleware, ...uploadController.uploadMultipleImages);

// Delete image
router.delete('/image', authMiddleware, uploadController.deleteImage);

module.exports = router;
