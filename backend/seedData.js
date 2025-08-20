const mongoose = require('mongoose');
const Provider = require('./models/Provider');
const mumbaiProviders = require('./data/mumbaiProviders');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/masss-healthcare';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Provider.deleteMany({});
    console.log('🗑️  Cleared existing provider data');

    // Insert Mumbai providers
    const providers = await Provider.insertMany(mumbaiProviders);
    console.log(`✅ Inserted ${providers.length} healthcare providers`);

    // Log some statistics
    const hospitalCount = await Provider.countDocuments({ type: 'hospital' });
    const clinicCount = await Provider.countDocuments({ type: 'clinic' });
    const pharmacyCount = await Provider.countDocuments({ type: 'pharmacy' });
    const dentalCount = await Provider.countDocuments({ type: 'dental' });
    const eyeCareCount = await Provider.countDocuments({ type: 'eye-care' });
    const mentalHealthCount = await Provider.countDocuments({ type: 'mental-health' });

    console.log('\n📊 Provider Statistics:');
    console.log(`🏥 Hospitals: ${hospitalCount}`);
    console.log(`🏥 Clinics: ${clinicCount}`);
    console.log(`💊 Pharmacies: ${pharmacyCount}`);
    console.log(`🦷 Dental Clinics: ${dentalCount}`);
    console.log(`👁️  Eye Care Centers: ${eyeCareCount}`);
    console.log(`🧠 Mental Health Centers: ${mentalHealthCount}`);

    // Get popular areas
    const areas = await Provider.aggregate([
      { $group: { _id: '$address.area', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    console.log('\n📍 Top Areas in Mumbai:');
    areas.forEach((area, index) => {
      console.log(`${index + 1}. ${area._id}: ${area.count} providers`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();


