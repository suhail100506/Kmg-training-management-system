require('dotenv').config();
const mongoose = require('mongoose');
const MasterData = require('../models/MasterData');

const seedTypes = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const trainingTypes = ['OT', 'ILT', 'Blended', 'Training for external members', 'Group specific', 'Others'];
    let count = 0;

    for (const val of trainingTypes) {
      const exists = await MasterData.findOne({ type: 'typeOfTraining', value: val });
      if (!exists) {
        const doc = new MasterData({
          type: 'typeOfTraining',
          value: val,
          isActive: true
        });
        await doc.save();
        console.log(`Added: ${val}`);
        count++;
      } else {
        console.log(`Already exists: ${val}`);
      }
    }

    console.log(`Done! Seeded ${count} new Type of Training parameter options.`);
    mongoose.connection.close();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

seedTypes();
