const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    required: true,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  profile: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: false },
    gender: { type: String, enum: ['male', 'female', 'other'], required: false },
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
  // Patient-specific fields
  patientInfo: {
    bloodType: { type: String, required: false },
    allergies: [{ type: String, trim: true }],
    medications: [{
      name: { type: String, required: true },
      dosage: { type: String, required: false },
      frequency: { type: String, required: false }
    }],
    emergencyContact: {
      name: { type: String, required: false },
      relationship: { type: String, required: false },
      phone: { type: String, required: false }
    },
     insuranceInfo: {
    provider: { type: String, required: false },
    policyNumber: { type: String, required: false },
    coverageType: { type: String, required: false },
    effectiveDate: { type: Date, required: false },
    expirationDate: { type: Date, required: false }
  },
  },
  // Doctor-specific fields
  doctorInfo: {
    specialization: { type: String, required: false },
    qualifications: [{ type: String, trim: true }],
    experience: { type: Number, required: false }, // years of experience
    licenseNumber: { type: String, required: false },
    hospitalAffiliation: [{ type: String, trim: true }],
    consultationFee: { type: Number, required: false },
    availableSlots: [{
      day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      startTime: { type: String, required: false },
      endTime: { type: String, required: false }
    }]
  },
  // Common fields
  preferences: {
    language: { type: String, default: 'English' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
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

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'profile.area': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
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
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);


