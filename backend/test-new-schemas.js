const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/masss-healthcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const testNewSchemas = async () => {
  try {
    console.log('🧪 Testing New Separate Schemas...\n');

    // Test Patient Schema
    console.log('1️⃣ Testing Patient Schema...');
    
    const patientData = {
      email: 'testpatient@example.com',
      password: 'password123',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male',
        bloodType: 'O+',
        phone: '+91 98765 43210',
        address: {
          street: '123 Test Street',
          area: 'Andheri',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        }
      },
      medicalInfo: {
        allergies: ['Penicillin', 'Dust Mites'],
        currentMedications: [
          {
            name: 'Vitamin D',
            dosage: '1000 IU',
            frequency: 'Once daily'
          }
        ],
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+91 98765 43211'
        }
      },
      insuranceInfo: {
        provider: 'Test Insurance',
        policyNumber: 'TI-123456789',
        coverageType: 'Premium Plus',
        effectiveDate: new Date('2023-01-01'),
        expirationDate: new Date('2023-12-31'),
        status: 'active'
      }
    };

    const patient = new Patient(patientData);
    await patient.save();
    console.log('✅ Patient created successfully:', patient._id);
    console.log('   Patient ID:', patient.patientId);
    console.log('   Full Name:', patient.fullName);
    console.log('   Age:', patient.calculateAge());

    // Test Doctor Schema
    console.log('\n2️⃣ Testing Doctor Schema...');
    
    const doctorData = {
      email: 'testdoctor@example.com',
      password: 'password123',
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1985-05-15'),
        gender: 'female',
        phone: '+91 98765 43212'
      },
      clinicalExpertise: {
        specialization: 'Cardiology',
        areasOfFocus: ['Coronary Artery Disease', 'Heart Failure'],
        procedures: ['Angioplasty', 'ECG', 'Echocardiogram'],
        treatmentPhilosophy: 'Patient-centered care approach',
        researchInterests: 'Cardiac biomarkers research'
      },
      professionalBackground: {
        education: [
          {
            degree: 'MBBS',
            institution: 'AIIMS, New Delhi',
            year: 2005
          },
          {
            degree: 'MD Cardiology',
            institution: 'PGIMER, Chandigarh',
            year: 2010
          }
        ],
        yearsOfExperience: 15,
        awards: [
          {
            title: 'Best Cardiologist Award',
            issuingOrganization: 'Delhi Medical Association',
            year: 2022
          }
        ]
      },
      legalCompliance: {
        licenseInfo: [
          {
            type: 'Medical License',
            number: 'DMC-12345',
            issuingAuthority: 'Delhi Medical Council',
            status: 'active'
          }
        ]
      },
      practiceInfo: {
        officeLocations: [
          {
            name: 'City Heart Hospital',
            address: 'Bandra West, Mumbai',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
            phone: '+91 22 1234 5678',
            isPrimary: true
          }
        ],
        officeHours: [
          {
            location: 'City Heart Hospital',
            schedule: [
              { day: 'monday', openTime: '9:00 AM', closeTime: '5:00 PM' },
              { day: 'tuesday', openTime: '9:00 AM', closeTime: '5:00 PM' },
              { day: 'wednesday', openTime: '9:00 AM', closeTime: '5:00 PM' },
              { day: 'thursday', openTime: '9:00 AM', closeTime: '5:00 PM' },
              { day: 'friday', openTime: '9:00 AM', closeTime: '5:00 PM' },
              { day: 'saturday', openTime: '9:00 AM', closeTime: '2:00 PM' },
              { day: 'sunday', isClosed: true }
            ]
          }
        ]
      },
      insuranceBilling: {
        governmentSchemes: ['CGHS', 'ESI'],
        privateInsurance: ['Star Health', 'ICICI Lombard'],
        paymentOptions: 'Cash, Card, UPI accepted'
      },
      patientExperience: {
        avgWaitTime: '20-25 minutes',
        bedsideManner: 95,
        newPatientAcceptance: true
      }
    };

    const doctor = new Doctor(doctorData);
    await doctor.save();
    console.log('✅ Doctor created successfully:', doctor._id);
    console.log('   Doctor ID:', doctor.doctorId);
    console.log('   Full Name:', doctor.fullName);
    console.log('   Specialization:', doctor.clinicalExpertise.specialization);

    // Test Data Retrieval
    console.log('\n3️⃣ Testing Data Retrieval...');
    
    const retrievedPatient = await Patient.findOne({ email: 'testpatient@example.com' }).select('-password');
    console.log('✅ Patient data retrieved:', {
      name: retrievedPatient.fullName,
      patientId: retrievedPatient.patientId,
      bloodType: retrievedPatient.personalInfo.bloodType,
      allergies: retrievedPatient.medicalInfo.allergies,
      insuranceProvider: retrievedPatient.insuranceInfo.provider
    });

    const retrievedDoctor = await Doctor.findOne({ email: 'testdoctor@example.com' }).select('-password');
    console.log('✅ Doctor data retrieved:', {
      name: retrievedDoctor.fullName,
      doctorId: retrievedDoctor.doctorId,
      specialization: retrievedDoctor.clinicalExpertise.specialization,
      experience: retrievedDoctor.professionalBackground.yearsOfExperience,
      areasOfFocus: retrievedDoctor.clinicalExpertise.areasOfFocus
    });

    // Test Methods
    console.log('\n4️⃣ Testing Schema Methods...');
    
    // Test patient methods
    const appointmentData = {
      date: new Date('2024-01-15'),
      time: '10:00 AM',
      doctor: 'Dr. Jane Smith',
      specialty: 'Cardiology',
      type: 'Consultation'
    };
    await patient.addAppointment(appointmentData);
    console.log('✅ Patient appointment added');

    const medicalRecordData = {
      title: 'Annual Checkup',
      date: new Date(),
      doctor: 'Dr. Jane Smith',
      type: 'Checkup',
      summary: 'Patient is in good health'
    };
    await patient.addMedicalRecord(medicalRecordData);
    console.log('✅ Patient medical record added');

    // Test doctor methods
    await doctor.addPatient(patient._id);
    console.log('✅ Doctor patient added');

    const reviewData = {
      patientId: patient._id,
      rating: 5,
      comment: 'Excellent doctor, very caring and professional'
    };
    await doctor.addReview(reviewData);
    console.log('✅ Doctor review added');

    // Test Virtual Fields
    console.log('\n5️⃣ Testing Virtual Fields...');
    console.log('Patient Virtual Fields:');
    console.log('  - Full Name:', patient.fullName);
    console.log('  - Patient ID:', patient.patientId);
    console.log('  - Age:', patient.calculateAge());
    
    console.log('\nDoctor Virtual Fields:');
    console.log('  - Full Name:', doctor.fullName);
    console.log('  - Doctor ID:', doctor.doctorId);
    console.log('  - Average Rating:', doctor.averageRating);

    console.log('\n✅ All schema tests passed successfully!');
    
    // Clean up test data
    await Patient.deleteMany({ email: { $in: ['testpatient@example.com'] } });
    await Doctor.deleteMany({ email: { $in: ['testdoctor@example.com'] } });
    console.log('🧹 Test data cleaned up');

  } catch (error) {
    console.error('❌ Schema test failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the test
testNewSchemas();
