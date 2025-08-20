const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['hospital', 'clinic', 'pharmacy', 'laboratory', 'specialist', 'general-practitioner', 'urgent-care', 'dental', 'eye-care', 'mental-health', 'medical-equipment']
  },
  specialty: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  address: {
    street: { type: String, required: true },
    area: { type: String, required: true }, // e.g., Bandra, Andheri, Colaba
    city: { type: String, default: 'Mumbai' },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false }
    }
  },
  contact: {
    phone: [{ type: String, required: true }],
    email: { type: String, required: false },
    website: { type: String, required: false }
  },
  services: [{
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: false }
  }],
  operatingHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  },
  emergencyServices: {
    type: Boolean,
    default: false
  },
  insuranceAccepted: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  facilities: [{
    type: String,
    trim: true
  }],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
    date: { type: Date, default: Date.now }
  }],
  images: [{
    url: { type: String, required: true },
    caption: { type: String, required: false }
  }],
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better search performance
providerSchema.index({ name: 'text', description: 'text', specialty: 'text' });
providerSchema.index({ 'address.area': 1 });
providerSchema.index({ type: 1 });
providerSchema.index({ specialty: 1 });
providerSchema.index({ 'address.coordinates': '2dsphere' });

// Virtual for full address
providerSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.area}, ${this.address.city} - ${this.address.pincode}`;
});

// Method to calculate average rating
providerSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / this.reviews.length) * 10) / 10;
};

// Pre-save middleware to update average rating
providerSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.ratings.average = this.calculateAverageRating();
    this.ratings.count = this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Provider', providerSchema);


