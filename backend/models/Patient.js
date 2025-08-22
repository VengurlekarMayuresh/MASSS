const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  // Basic Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    default: 'patient',
    enum: ['patient']
  },

  // Personal Information (from Personal Information Card)
  personalInfo: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: false },
    age: { type: Number, required: false },
    gender: { type: String, enum: ['male', 'female', 'other'], required: false },
    bloodType: { type: String, required: false },
    phone: { type: String, required: false },
    address: {
      street: { type: String, required: false },
      area: { type: String, required: false },
      city: { type: String, default: 'Mumbai' },
      state: { type: String, default: 'Maharashtra' },
      pincode: { type: String, required: false }
    },
    profilePicture: { type: String, required: false }
  },

  // Medical Information (from Medical Information Card)
  medicalInfo: {
    allergies: [{ type: String, trim: true }],
    currentMedications: [{
      name: { type: String, required: true },
      dosage: { type: String, required: false },
      frequency: { type: String, required: false },
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false },
      prescribedBy: { type: String, required: false }
    }],
    medicalHistory: [{
      condition: { type: String, required: true },
      diagnosisDate: { type: Date, required: false },
      status: { type: String, enum: ['active', 'resolved', 'chronic'], default: 'active' },
      notes: { type: String, required: false }
    }],
    emergencyContact: {
      name: { type: String, required: false },
      relationship: { type: String, required: false },
      phone: { type: String, required: false },
      address: { type: String, required: false }
    }
  },

  // Insurance Information (from Insurance Information Card)
  insuranceInfo: {
    provider: { type: String, required: false },
    policyNumber: { type: String, required: false },
    coverageType: { type: String, required: false },
    effectiveDate: { type: Date, required: false },
    expirationDate: { type: Date, required: false },
    status: { type: String, enum: ['active', 'expired', 'pending'], default: 'active' },
    coverageDetails: {
      inpatient: { type: Boolean, default: false },
      outpatient: { type: Boolean, default: false },
      prescription: { type: Boolean, default: false },
      dental: { type: Boolean, default: false },
      vision: { type: Boolean, default: false }
    }
  },

  // Appointments (from Appointments Card)
  appointments: {
    upcoming: [{
      date: { type: Date, required: true },
      time: { type: String, required: true },
      doctor: { type: String, required: true },
      specialty: { type: String, required: false },
      type: { type: String, required: false },
      notes: { type: String, required: false },
      status: { type: String, enum: ['scheduled', 'confirmed', 'cancelled'], default: 'scheduled' }
    }],
    past: [{
      date: { type: Date, required: true },
      time: { type: String, required: true },
      doctor: { type: String, required: true },
      specialty: { type: String, required: false },
      type: { type: String, required: false },
      diagnosis: { type: String, required: false },
      treatment: { type: String, required: false },
      followUpDate: { type: Date, required: false }
    }]
  },

  // Medical Records (from Medical Records Section)
  medicalRecords: [{
    title: { type: String, required: true },
    date: { type: Date, required: true },
    doctor: { type: String, required: true },
    type: { type: String, required: false },
    summary: { type: String, required: false },
    attachments: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      type: { type: String, enum: ['pdf', 'image', 'document'], required: false }
    }],
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' }
  }],

  // Preferences and Settings
  preferences: {
    language: { type: String, default: 'English' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      shareMedicalInfo: { type: Boolean, default: false },
      shareContactInfo: { type: Boolean, default: false }
    }
  },

  // System Fields
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better search performance
patientSchema.index({ email: 1 });
patientSchema.index({ 'personalInfo.area': 1 });
patientSchema.index({ 'personalInfo.city': 1 });
patientSchema.index({ 'medicalInfo.allergies': 1 });
patientSchema.index({ 'appointments.upcoming.date': 1 });

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for patient ID
patientSchema.virtual('patientId').get(function() {
  return `PT-${this._id.toString().slice(-6).toUpperCase()}`;
});

// Pre-save middleware to hash password
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
patientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
patientSchema.methods.getPublicProfile = function() {
  const patientObject = this.toObject();
  delete patientObject.password;
  delete patientObject.__v;
  return patientObject;
};

// Method to calculate age
patientSchema.methods.calculateAge = function() {
  if (!this.personalInfo.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Method to add appointment
patientSchema.methods.addAppointment = function(appointmentData) {
  this.appointments.upcoming.push(appointmentData);
  return this.save();
};

// Method to add medical record
patientSchema.methods.addMedicalRecord = function(recordData) {
  this.medicalRecords.push(recordData);
  return this.save();
};

module.exports = mongoose.model('Patient', patientSchema);
