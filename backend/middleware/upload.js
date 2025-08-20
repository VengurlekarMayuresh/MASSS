// Temporarily simplified upload middleware
const path = require('path');
const fs = require('fs');

// Cloudinary configuration - will be enabled when packages are installed
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

// Temporary placeholder for cloudinary storage
const cloudinaryStorage = null;

// Placeholder for local storage
const localStorage = null;

// Temporary disabled file filter
const fileFilter = () => true;

// Choose storage based on environment
const storage = process.env.NODE_ENV === 'production' && 
                process.env.CLOUDINARY_CLOUD_NAME ? 
                cloudinaryStorage : localStorage;

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  },
  fileFilter: fileFilter
});

// Avatar upload middleware
const uploadAvatar = upload.single('avatar');

// Handle multer errors
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Use "avatar" as field name'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};

// Multiple file upload for documents (if needed in future)
const uploadDocuments = upload.array('documents', 5);

// Clean up function for local storage
const cleanupLocalFile = (filePath) => {
  if (filePath && !filePath.includes('cloudinary')) {
    const fs = require('fs');
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

module.exports = {
  uploadAvatar,
  uploadDocuments,
  handleUploadErrors,
  cleanupLocalFile,
  deleteFromCloudinary,
  cloudinary
};
