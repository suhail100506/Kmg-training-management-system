const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadController = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { ROLES } = require('../config/constants');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_TEMP_DIR || './uploads/temp';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${uuidFilename(file.originalname)}`);
  }
});

// Helper to sanitize filename
function uuidFilename(originalName) {
  return originalName.replace(/[^a-zA-Z0-9.]/g, '_');
}

// File extension filter (.csv, .xlsx, .xls only)
const fileFilter = (req, file, cb) => {
  const filetypes = /csv|xlsx|xls/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  }
  cb(new Error('Only CSV and Excel files (.csv, .xlsx, .xls) are allowed.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10) * 1024 * 1024 // Max 10MB
  }
});

router.use(protect);
router.use(roleCheck(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.post('/training', upload.single('file'), uploadController.uploadTrainingFile);
router.post('/staff', roleCheck(ROLES.SUPER_ADMIN, ROLES.ADMIN), upload.single('file'), uploadController.uploadStaffFile);
router.get('/template', uploadController.downloadTemplate);
router.get('/batches', uploadController.getUploadBatches);
router.get('/batches/:batchId', uploadController.getUploadBatchById);
router.get('/batches/:batchId/error-report', uploadController.downloadErrorReport);

module.exports = router;
