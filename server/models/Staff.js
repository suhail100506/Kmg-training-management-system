const mongoose = require('mongoose');
const { EMPLOYMENT_STATUS } = require('../config/constants');

const staffSchema = new mongoose.Schema({
  staffNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  staffName: {
    type: String,
    required: true
  },
  emailId: {
    type: String,
    lowercase: true
  },
  designation: {
    type: String
  },
  groupName: {
    type: String
  },
  productDivisionCategory: {
    type: String
  },
  reportingGLManagerName: {
    type: String
  },
  employmentStatus: {
    type: String,
    enum: [
      EMPLOYMENT_STATUS.CURRENTLY_SERVING,
      EMPLOYMENT_STATUS.RESIGNED,
      EMPLOYMENT_STATUS.RETIRED
    ],
    required: true,
    default: EMPLOYMENT_STATUS.CURRENTLY_SERVING,
    index: true
  },
  dateOfJoining: {
    type: Date
  },
  superannuationDate: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);
