require('dotenv').config();
const mongoose = require('mongoose');
const Staff = require('../models/Staff');
const { ensureMasterDataExists } = require('../utils/masterSync');

const syncDropdowns = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // 1. Get unique values from Staff collection
    const staffs = await Staff.find({ isDeleted: false }).lean();
    
    console.log(`Analyzing ${staffs.length} staff records...`);
    
    let designationCount = 0;
    let groupCount = 0;
    let divisionCount = 0;

    for (const staff of staffs) {
      if (await ensureMasterDataExists('designation', staff.designation)) {
        designationCount++;
      }
      if (await ensureMasterDataExists('groupName', staff.groupName)) {
        groupCount++;
      }
      if (await ensureMasterDataExists('productDivision', staff.productDivisionCategory)) {
        divisionCount++;
      }
    }

    console.log('Synchronization complete!');
    console.log(`Added ${designationCount} new designations.`);
    console.log(`Added ${groupCount} new group names.`);
    console.log(`Added ${divisionCount} new product divisions.`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Sync error:', error);
    process.exit(1);
  }
};

syncDropdowns();
