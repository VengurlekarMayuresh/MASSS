import React, { useState } from 'react';
import { Search, MapPin, Phone, Mail, Star, Calendar, Filter } from 'lucide-react';

const FindNear = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const specialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Psychiatry'
  ];

  const locations = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'
  ];

  const providers = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      hospital: 'Apollo Hospitals',
      location: 'Delhi',
      rating: 4.7,
      reviews: 128,
      experience: '18 years',
      phone: '+91 11 1234 5678',
      email: 'dr.priya@apollo.com',
      address: 'Sarita Vihar, Delhi - 110076',
      availableSlots: 5,
      consultationFee: '₹1500'
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Dermatology',
      hospital: 'Fortis Hospital',
      location: 'Mumbai',
      rating: 4.5,
      reviews: 89,
      experience: '15 years',
      phone: '+91 22 9876 5432',
      email: 'dr.rajesh@fortis.com',
      address: 'Mulund West, Mumbai - 400080',
      availableSlots: 3,
      consultationFee: '₹1200'
    },
    {
      id: 3,
      name: 'Dr. Sunita Devi',
      specialty: 'Endocrinology',
      hospital: 'Max Super Specialty Hospital',
      location: 'Delhi',
      rating: 4.8,
      reviews: 156,
      experience: '20 years',
      phone: '+91 11 4567 8901',
      email: 'dr.sunita@max.com',
      address: 'Saket, Delhi - 110017',
      availableSlots: 7,
      consultationFee: '₹1800'
    }
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || provider.specialty === selectedSpecialty;
    const matchesLocation = !selectedLocation || provider.location === selectedLocation;
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  return (
    <div className="find-near-container">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Find Healthcare Providers</h1>
          <p>Compare hospitals, nursing homes, and healthcare professionals near you</p>
        </div>

        {/* Search and Filters */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search for doctors, hospitals, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Specialty</label>
                <select 
                  value={selectedSpecialty} 
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Location</label>
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="results-section">
          <div className="results-header">
            <h3>Found {filteredProviders.length} providers</h3>
            <div className="sort-options">
              <select className="sort-select">
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="fee">Sort by Fee</option>
                <option value="availability">Sort by Availability</option>
              </select>
            </div>
          </div>

          <div className="providers-grid">
            {filteredProviders.map(provider => (
              <div key={provider.id} className="provider-card">
                <div className="provider-header">
                  <div className="provider-info">
                    <h4 className="provider-name">{provider.name}</h4>
                    <p className="provider-specialty">{provider.specialty}</p>
                    <p className="provider-hospital">{provider.hospital}</p>
                  </div>
                  <div className="provider-rating">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < Math.floor(provider.rating) ? 'filled' : ''} 
                        />
                      ))}
                    </div>
                    <span className="rating-value">{provider.rating}</span>
                    <span className="reviews-count">({provider.reviews} reviews)</span>
                  </div>
                </div>

                <div className="provider-details">
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{provider.address}</span>
                  </div>
                  <div className="detail-item">
                    <Phone size={16} />
                    <span>{provider.phone}</span>
                  </div>
                  <div className="detail-item">
                    <Mail size={16} />
                    <span>{provider.email}</span>
                  </div>
                </div>

                <div className="provider-stats">
                  <div className="stat-item">
                    <span className="stat-label">Experience</span>
                    <span className="stat-value">{provider.experience}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Available Slots</span>
                    <span className="stat-value">{provider.availableSlots}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Consultation Fee</span>
                    <span className="stat-value">{provider.consultationFee}</span>
                  </div>
                </div>

                <div className="provider-actions">
                  <button className="btn btn-primary">
                    <Calendar size={16} />
                    Book Appointment
                  </button>
                  <button className="btn btn-secondary">
                    <Phone size={16} />
                    Call Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <div className="no-results">
              <p>No providers found matching your criteria.</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindNear;

