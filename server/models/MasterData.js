const mongoose = require('mongoose');
const { MASTER_DATA_TYPES } = require('../config/constants');

const masterDataSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      MASTER_DATA_TYPES.DESIGNATION,
      MASTER_DATA_TYPES.GROUP_NAME,
      MASTER_DATA_TYPES.PRODUCT_DIVISION,
      MASTER_DATA_TYPES.DEPARTMENT,
      MASTER_DATA_TYPES.TYPE_OF_TRAINING
    ],
    required: true,
    index: true
  },
  value: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MasterData', masterDataSchema);
