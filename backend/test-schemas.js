const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/masss', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const testSchemas = async () => {
  try {
    console.log('Testing Patient Schema...');
    
    // Test creating a patient
    const patientData = {
      email: 'patient@test.com',
      password: 'password123',
      role: 'patient',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+91 98765 43210',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      address: {
        street: '123 Test Street',
        area: 'Andheri',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      bloodType: 'O+',
      allergies: ['Penicillin', 'Dust'],
      medications: [
        {
          name: 'Vitamin D',
          dosage: '1000 IU',
          frequency: 'Once daily'
        }
      ],
      insuranceInfo: {
        provider: 'Test Insurance',
        policyNumber: 'TI-123456',
        coverageType: 'Premium',
        effectiveDate: new Date('2023-01-01'),
        expirationDate: new Date('2023-12-31')
      }
    };

    const patient = new User(patientData);
    await patient.save();
    console.log('✅ Patient created successfully:', patient._id);

    console.log('\nTesting Doctor Schema...');
    
    // Test creating a doctor
    const doctorData = {
      email: 'doctor@test.com',
      password: 'password123',
      role: 'doctor',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      phone: '+91 98765 43211',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'female',
      address: {
        street: '456 Doctor Street',
        area: 'Bandra',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050'
      },
      specialization: 'Cardiology',
      qualifications: ['MBBS', 'MD Cardiology'],
      experience: 10,
      licenseNumber: 'DOC-12345',
      clinicalExpertise: {
        areasOfFocus: ['Coronary Artery Disease', 'Heart Failure'],
        procedures: ['Angioplasty', 'ECG'],
        treatmentPhilosophy: 'Patient-centered care approach',
        researchInterests: 'Cardiac biomarkers research'
      },
      patientExperience: {
        avgWaitTime: '20-25 minutes',
        bedsideManner: 95,
        newPatientAcceptance: true
      },
      insuranceBilling: {
        governmentSchemes: ['CGHS', 'ESI'],
        privateInsurance: ['Star Health', 'ICICI Lombard'],
        paymentOptions: 'Cash, Card, UPI accepted'
      },
      practiceInfo: {
        primaryLocation: {
          name: 'City Heart Hospital',
          address: 'Bandra West, Mumbai - 400050',
          phone: '+91 22 1234 5678'
        },
        officeHours: {
          weekdays: '9:00 AM - 6:00 PM',
          saturday: '9:00 AM - 2:00 PM',
          sunday: 'Closed'
        },
        emergencyContact: 'Emergency: +91 22 1234 9999'
      }
    };

    const doctor = new User(doctorData);
    await doctor.save();
    console.log('✅ Doctor created successfully:', doctor._id);

    console.log('\nTesting Data Retrieval...');
    
    // Test retrieving patient data
    const retrievedPatient = await User.findOne({ email: 'patient@test.com' }).select('-password');
    console.log('✅ Patient data retrieved:', {
      name: `${retrievedPatient.profile.firstName} ${retrievedPatient.profile.lastName}`,
      role: retrievedPatient.role,
      bloodType: retrievedPatient.patientInfo.bloodType,
      allergies: retrievedPatient.patientInfo.allergies,
      insuranceProvider: retrievedPatient.patientInfo.insuranceInfo.provider
    });

    // Test retrieving doctor data
    const retrievedDoctor = await User.findOne({ email: 'doctor@test.com' }).select('-password');
    console.log('✅ Doctor data retrieved:', {
      name: `${retrievedDoctor.profile.firstName} ${retrievedDoctor.profile.lastName}`,
      role: retrievedDoctor.role,
      specialization: retrievedDoctor.doctorInfo.specialization,
      experience: retrievedDoctor.doctorInfo.experience,
      areasOfFocus: retrievedDoctor.doctorInfo.clinicalExpertise.areasOfFocus
    });

    console.log('\n✅ All schema tests passed successfully!');
    
    // Clean up test data
    await User.deleteMany({ email: { $in: ['patient@test.com', 'doctor@test.com'] } });
    console.log('🧹 Test data cleaned up');

  } catch (error) {
    console.error('❌ Schema test failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the test
testSchemas();
