const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
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
    default: 'doctor',
    enum: ['doctor']
  },

  // Basic Profile Information
  profile: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: false },
    gender: { type: String, enum: ['male', 'female', 'other'], required: false },
    phone: { type: String, required: false },
    profilePicture: { type: String, required: false }
  },

  // Professional Background (from Background Tab)
  professionalBackground: {
    education: [{
      degree: { type: String, required: true },
      institution: { type: String, required: true },
      year: { type: Number, required: false },
      country: { type: String, required: false }
    }],
    boardCertifications: [{
      name: { type: String, required: true },
      issuingBody: { type: String, required: false },
      issueDate: { type: Date, required: false },
      expiryDate: { type: Date, required: false },
      status: { type: String, enum: ['active', 'expired', 'pending'], default: 'active' }
    }],
    professionalMemberships: [{
      organization: { type: String, required: true },
      membershipType: { type: String, required: false },
      memberSince: { type: Date, required: false },
      status: { type: String, enum: ['active', 'inactive'], default: 'active' }
    }],
    yearsOfExperience: { type: Number, required: false },
    awards: [{
      title: { type: String, required: true },
      issuingOrganization: { type: String, required: false },
      year: { type: Number, required: false },
      description: { type: String, required: false }
    }]
  },

  // Legal & Compliance (from Background Tab)
  legalCompliance: {
    licenseInfo: [{
      type: { type: String, required: true },
      number: { type: String, required: true },
      issuingAuthority: { type: String, required: false },
      issueDate: { type: Date, required: false },
      expiryDate: { type: Date, required: false },
      status: { type: String, enum: ['active', 'expired', 'suspended'], default: 'active' }
    }],
    disciplinaryHistory: {
      hasDisciplinaryActions: { type: Boolean, default: false },
      actions: [{
        date: { type: Date, required: true },
        description: { type: String, required: true },
        resolution: { type: String, required: false },
        status: { type: String, enum: ['open', 'resolved', 'appealed'], default: 'open' }
      }]
    },
    patientRights: { type: String, required: false },
    complaintProcedures: { type: String, required: false }
  },

  // Clinical Expertise (from Overview Tab)
  clinicalExpertise: {
    specialization: { type: String, required: false },
    areasOfFocus: [{ type: String, trim: true }],
    procedures: [{ type: String, trim: true }],
    treatmentPhilosophy: { type: String, required: false },
    researchInterests: { type: String, required: false },
    languages: [{ type: String, trim: true }]
  },

  // Patient Experience (from Overview Tab)
  patientExperience: {
    avgWaitTime: { type: String, required: false },
    bedsideManner: { type: Number, min: 0, max: 100, required: false },
    newPatientAcceptance: { type: Boolean, default: true },
    patientSatisfaction: { type: Number, min: 0, max: 5, default: 0 },
    totalPatients: { type: Number, default: 0 }
  },

  // Insurance & Billing (from Overview Tab)
  insuranceBilling: {
    governmentSchemes: [{ type: String, trim: true }],
    privateInsurance: [{ type: String, trim: true }],
    paymentOptions: { type: String, required: false },
    consultationFee: {
      newPatient: { type: Number, required: false },
      followUp: { type: Number, required: false },
      emergency: { type: Number, required: false }
    },
    acceptsCashless: { type: Boolean, default: false }
  },

  // Practice Information (from Practice Info Tab)
  practiceInfo: {
    officeLocations: [{
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: false },
      state: { type: String, required: false },
      pincode: { type: String, required: false },
      phone: { type: String, required: false },
      fax: { type: String, required: false },
      isPrimary: { type: Boolean, default: false }
    }],
    officeHours: [{
      location: { type: String, required: true },
      schedule: [{
        day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: true },
        openTime: { type: String, required: false },
        closeTime: { type: String, required: false },
        isClosed: { type: Boolean, default: false }
      }]
    }],
    emergencyContact: { type: String, required: false },
    afterHoursCoverage: { type: String, required: false },
    emergencyHospital: { type: String, required: false }
  },

  // Healthcare System Information (from Background Tab)
  healthcareSystem: {
    medicalCouncilId: { type: String, required: false },
    governmentSchemeParticipation: { type: String, required: false },
    preventiveServices: [{ type: String, trim: true }],
    chronicCareManagement: { type: String, required: false },
    telemedicineAvailable: { type: Boolean, default: false }
  },

  // Schedule & Availability (from Appointments Tab)
  schedule: {
    availableSlots: [{
      day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: true },
      timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
        appointmentType: { type: String, enum: ['consultation', 'follow-up', 'emergency'], default: 'consultation' }
      }]
    }],
    blockedDates: [{ type: Date }],
    vacationDates: [{
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      reason: { type: String, required: false }
    }]
  },

  // Patient Management (from Patients Tab)
  patientManagement: {
    currentPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
    patientNotes: [{
      patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
      note: { type: String, required: true },
      date: { type: Date, default: Date.now },
      type: { type: String, enum: ['general', 'medical', 'follow-up'], default: 'general' }
    }]
  },

  // Reviews & Ratings (from Overview Tab)
  reviews: [{
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: false },
    date: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false }
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
      showContactInfo: { type: Boolean, default: true },
      showSchedule: { type: Boolean, default: true },
      showReviews: { type: Boolean, default: true }
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
doctorSchema.index({ email: 1 });
doctorSchema.index({ 'clinicalExpertise.specialization': 1 });
doctorSchema.index({ 'practiceInfo.officeLocations.city': 1 });
doctorSchema.index({ 'practiceInfo.officeLocations.area': 1 });
doctorSchema.index({ 'schedule.availableSlots.day': 1 });

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
  return `Dr. ${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for doctor ID
doctorSchema.virtual('doctorId').get(function() {
  return `DOC-${this._id.toString().slice(-6).toUpperCase()}`;
});

// Virtual for average rating
doctorSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / this.reviews.length) * 10) / 10;
});

// Pre-save middleware to hash password
doctorSchema.pre('save', async function(next) {
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
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
doctorSchema.methods.getPublicProfile = function() {
  const doctorObject = this.toObject();
  delete doctorObject.password;
  delete doctorObject.__v;
  return doctorObject;
};

// Method to add review
doctorSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  this.patientExperience.totalPatients = this.currentPatients.length;
  return this.save();
};

// Method to update schedule
doctorSchema.methods.updateSchedule = function(scheduleData) {
  this.schedule = { ...this.schedule, ...scheduleData };
  return this.save();
};

// Method to add patient
doctorSchema.methods.addPatient = function(patientId) {
  if (!this.currentPatients.includes(patientId)) {
    this.currentPatients.push(patientId);
    this.patientExperience.totalPatients = this.currentPatients.length;
    return this.save();
  }
  return this;
};

module.exports = mongoose.model('Doctor', doctorSchema);
