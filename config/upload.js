const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Local File Upload Configuration
 * 
 * WHY: Simple local file storage - no external services needed!
 * Files are stored in /public/uploads and served statically
 * 
 * Benefits:
 * - No Cloudinary signup needed
 * - Works immediately
 * - Free forever
 * - Full control over files
 */

// Create uploads directory
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

/**
 * Multer Storage - Save files locally
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'student-' + uniqueSuffix + ext);
  }
});

/**
 * Multer Upload Middleware
 * Handles file upload to local storage
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp)!'), false);
    }
  }
});

/**
 * Get public URL for uploaded file
 * @param {string} filename - Name of the file
 * @returns {string} - Public URL
 */
const getFileUrl = (filename) => {
  return `/uploads/${filename}`;
};

/**
 * Delete local file
 * @param {string} filename - Name of file to delete
 */
const deleteFile = async (filename) => {
  try {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log('Deleted file:', filename);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

module.exports = {
  upload,
  getFileUrl,
  deleteFile,
  uploadsDir
};
