const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: false
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentType: {
    type: String,
    required: true,
    enum: ['consultation', 'follow-up', 'emergency', 'routine-checkup', 'specialist-consultation', 'laboratory-test', 'imaging', 'procedure']
  },
  status: {
    type: String,
    required: true,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true // Format: "HH:MM"
  },
  duration: {
    type: Number,
    default: 30, // Duration in minutes
    min: 15,
    max: 240
  },
  symptoms: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  // For follow-up appointments
  followUpReason: {
    type: String,
    required: false
  },
  previousAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false
  },
  // Payment and insurance
  consultationFee: {
    type: Number,
    required: false
  },
  insuranceCovered: {
    type: Boolean,
    default: false
  },
  insuranceProvider: {
    type: String,
    required: false
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'waived'],
    default: 'pending'
  },
  // Reminders and notifications
  reminders: [{
    type: { type: String, enum: ['sms', 'email', 'push'], required: true },
    sentAt: { type: Date, required: true },
    status: { type: String, enum: ['sent', 'delivered', 'failed'], required: true }
  }],
  // Cancellation details
  cancellation: {
    cancelledBy: { type: String, enum: ['patient', 'doctor', 'provider', 'system'], required: false },
    cancelledAt: { type: Date, required: false },
    reason: { type: String, required: false }
  },
  // Post-appointment details
  diagnosis: {
    type: String,
    required: false
  },
  prescription: {
    type: String,
    required: false
  },
  recommendations: {
    type: String,
    required: false
  },
  nextAppointment: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
appointmentSchema.index({ patient: 1, scheduledDate: 1 });
appointmentSchema.index({ provider: 1, scheduledDate: 1 });
appointmentSchema.index({ doctor: 1, scheduledDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ scheduledDate: 1, scheduledTime: 1 });

// Virtual for appointment date and time
appointmentSchema.virtual('appointmentDateTime').get(function() {
  const date = new Date(this.scheduledDate);
  const [hours, minutes] = this.scheduledTime.split(':');
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date;
});

// Virtual for end time
appointmentSchema.virtual('endTime').get(function() {
  const startTime = new Date(this.appointmentDateTime);
  startTime.setMinutes(startTime.getMinutes() + this.duration);
  return startTime.toTimeString().slice(0, 5);
});

// Method to check if appointment is in the past
appointmentSchema.methods.isPast = function() {
  return this.appointmentDateTime < new Date();
};

// Method to check if appointment is today
appointmentSchema.methods.isToday = function() {
  const today = new Date();
  const appointmentDate = new Date(this.scheduledDate);
  return today.toDateString() === appointmentDate.toDateString();
};

// Method to check if appointment is upcoming (within next 24 hours)
appointmentSchema.methods.isUpcoming = function() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return this.appointmentDateTime > now && this.appointmentDateTime < tomorrow;
};

// Pre-save middleware to validate appointment time
appointmentSchema.pre('save', function(next) {
  // Check if appointment is not in the past
  if (this.isPast() && this.isNew) {
    return next(new Error('Cannot schedule appointment in the past'));
  }
  
  // Check if appointment time is within operating hours (basic validation)
  const appointmentHour = parseInt(this.scheduledTime.split(':')[0]);
  if (appointmentHour < 6 || appointmentHour > 22) {
    return next(new Error('Appointment time must be between 6 AM and 10 PM'));
  }
  
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);


