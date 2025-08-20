// Simplified upload middleware - temporary solution
const path = require('path');
const fs = require('fs');

// Temporary upload middleware that just passes through
const uploadAvatar = (req, res, next) => {
  // For now, just proceed without file upload
  next();
};

// Handle upload errors
const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Upload error'
    });
  }
  next();
};

// Placeholder functions
const uploadDocuments = (req, res, next) => next();
const cleanupLocalFile = () => {};
const deleteFromCloudinary = async () => {};

module.exports = {
  uploadAvatar,
  uploadDocuments,
  handleUploadErrors,
  cleanupLocalFile,
  deleteFromCloudinary
};
