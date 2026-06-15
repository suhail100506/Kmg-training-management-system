require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Staff = require('../models/Staff');
const TrainingRecord = require('../models/TrainingRecord');
const UploadBatch = require('../models/UploadBatch');
const AuditLog = require('../models/AuditLog');

const cleanDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully.');

    // 1. Delete all training records
    console.log('Deleting all training records...');
    const deletedTrainings = await TrainingRecord.deleteMany({});
    console.log(`Deleted ${deletedTrainings.deletedCount || 0} training records.`);

    // 2. Delete all upload batches
    console.log('Deleting all upload batches...');
    const deletedBatches = await UploadBatch.deleteMany({});
    console.log(`Deleted ${deletedBatches.deletedCount || 0} upload batches.`);

    // 3. Delete all staff records except Super Admin (S00001)
    console.log('Deleting mock staff records (except Super Admin S00001)...');
    const deletedStaff = await Staff.deleteMany({ staffNumber: { $ne: 'S00001' } });
    console.log(`Deleted ${deletedStaff.deletedCount || 0} staff records.`);

    // 4. Delete all users except Super Admin (S00001)
    console.log('Deleting non-admin users (except Super Admin S00001)...');
    const deletedUsers = await User.deleteMany({ staffNumber: { $ne: 'S00001' } });
    console.log(`Deleted ${deletedUsers.deletedCount || 0} user records.`);

    // 5. Delete all audit logs
    console.log('Deleting all audit logs...');
    const deletedAudits = await AuditLog.deleteMany({});
    console.log(`Deleted ${deletedAudits.deletedCount || 0} audit logs.`);

    console.log('Database clean action complete.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Cleaning error:', error);
    process.exit(1);
  }
};

cleanDatabase();
