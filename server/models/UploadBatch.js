const mongoose = require('mongoose');

const uploadBatchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  batchType: {
    type: String,
    enum: ['training', 'staff'],
    default: 'training',
    index: true
  },
  totalRows: {
    type: Number,
    default: 0
  },
  successCount: {
    type: Number,
    default: 0
  },
  errorCount: {
    type: Number,
    default: 0
  },
  duplicateCount: {
    type: Number,
    default: 0
  },
  errors: [{
    row: Number,
    reason: String,
    data: mongoose.Schema.Types.Mixed
  }],
  duplicates: [{
    row: Number,
    reason: String,
    data: mongoose.Schema.Types.Mixed
  }],
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing',
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UploadBatch', uploadBatchSchema);
