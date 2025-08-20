import React, { useEffect, useState } from 'react';
import { User, Calendar, FileText, Edit, Share2, Camera, MapPin, Phone, Mail, Heart, Receipt } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Tailwind CSS used for styling

const PatientProfile = () => {
  const [currentSection, setCurrentSection] = useState('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const { userProfile, currentUser, updateProfile, apiCall } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editMessage, setEditMessage] = useState('');

  const [patientForm, setPatientForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: { street: '', city: '', pincode: '' }
  });

  useEffect(() => {
    if (userProfile) {
      setPatientForm({
        firstName: userProfile.profile?.firstName || '',
        lastName: userProfile.profile?.lastName || '',
        phone: userProfile.profile?.phone || '',
        gender: userProfile.profile?.gender || '',
        dateOfBirth: userProfile.profile?.dateOfBirth ? String(userProfile.profile.dateOfBirth).slice(0, 10) : '',
        address: {
          street: userProfile.profile?.address?.street || '',
          city: userProfile.profile?.address?.city || '',
          pincode: userProfile.profile?.address?.pincode || ''
        }
      });
    }
  }, [userProfile]);

  const handlePatientFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setPatientForm(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setPatientForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const savePatientProfile = async (e) => {
    e?.preventDefault();
    setEditSaving(true);
    setEditMessage('');
    try {
      const payload = {
        firstName: patientForm.firstName,
        lastName: patientForm.lastName,
        phone: patientForm.phone,
        dateOfBirth: patientForm.dateOfBirth,
        gender: patientForm.gender,
        address: {
          street: patientForm.address.street,
          city: patientForm.address.city,
          pincode: patientForm.address.pincode
        }
      };
      await updateProfile(payload);
      setEditMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setEditMessage(err.message || 'Failed to update profile');
    } finally {
      setEditSaving(false);
    }
  };

  // Booking state
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingMessage, setBookingMessage] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await apiCall('/users/doctors');
        if (res.success) setDoctors(res.doctors || []);
      } catch (e) {
        console.error('Failed to load doctors', e);
      }
    };
    loadDoctors();
  }, [apiCall]);

  const fetchSlots = async () => {
    setAvailableSlots([]);
    setBookingMessage('');
    if (!selectedDoctorId || !selectedDate) return;
    setLoadingSlots(true);
    try {
      const qs = `doctorId=${encodeURIComponent(selectedDoctorId)}&date=${encodeURIComponent(selectedDate)}`;
      const res = await apiCall(`/appointments/available-slots?${qs}`);
      if (res.success) setAvailableSlots(res.availableSlots || []);
    } catch (e) {
      setBookingMessage(e.message || 'Failed to fetch slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const bookSlot = async (time) => {
    setBooking(true);
    setBookingMessage('');
    try {
      const payload = {
        doctor: selectedDoctorId,
        appointmentType: 'consultation',
        scheduledDate: selectedDate,
        scheduledTime: time
      };
      const res = await apiCall('/appointments', { method: 'POST', body: JSON.stringify(payload) });
      if (res.success) {
        setBookingMessage('Appointment booked successfully');
        setAvailableSlots(prev => prev.filter(s => s !== time));
      }
    } catch (e) {
      setBookingMessage(e.message || 'Failed to book slot');
    } finally {
      setBooking(false);
    }
  };
  
  // Use real user data from authentication context or provide defaults
  const profileData = {
    name: userProfile?.profile ? `${userProfile.profile.firstName || ''} ${userProfile.profile.lastName || ''}`.trim() || 'Patient Name' : 'Patient Name',
    patientId: `PT-${new Date().getFullYear()}-${(currentUser?._id || currentUser?.id || userProfile?._id || '0000').toString().slice(-4).toUpperCase()}`,
    dateOfBirth: userProfile?.profile?.dateOfBirth ? new Date(userProfile.profile.dateOfBirth).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not provided',
    age: userProfile?.profile?.dateOfBirth ? `${new Date().getFullYear() - new Date(userProfile.profile.dateOfBirth).getFullYear()} years` : 'Not provided',
    gender: userProfile?.profile?.gender ? userProfile.profile.gender.charAt(0).toUpperCase() + userProfile.profile.gender.slice(1) : 'Not provided',
    bloodType: 'Not provided', // This would need to be added to the user profile later
    phone: userProfile?.profile?.phone || 'Not provided',
    email: userProfile?.email || 'Not provided',
    address: userProfile?.profile?.address ? `${userProfile.profile.address.street || ''}, ${userProfile.profile.address.city || ''}, ${userProfile.profile.address.pincode || ''}`.replace(/,\s*,/g, ',').replace(/^,|,$/g, '') : 'Not provided',
    // Default empty arrays for medical information that would be populated later
    allergies: [], // This would need to be added to user profile
    medications: [], // This would need to be added to user profile
    insurance: {
      provider: 'Not provided',
      policyNumber: 'Not provided',
      coverageType: 'Not provided',
      effectiveDate: 'Not provided',
      expirationDate: 'Not provided'
    }
  };

  const appointments = [
    {
      date: 'March 15, 2023 at 10:30 AM',
      doctor: 'Dr. Robert Smith - Cardiology',
      type: 'Follow-up Consultation'
    },
    {
      date: 'March 28, 2023 at 2:00 PM',
      doctor: 'Dr. Emily Johnson - Endocrinology',
      type: 'Annual Check-up'
    }
  ];

  const pastAppointments = [
    {
      date: 'February 10, 2023 at 11:00 AM',
      doctor: 'Dr. Sarah Williams - Dermatology',
      type: 'Skin Check'
    },
    {
      date: 'January 25, 2023 at 9:30 AM',
      doctor: 'Dr. Michael Brown - General Practice',
      type: 'Routine Check-up'
    }
  ];

  const medicalRecords = [
    {
      title: 'Blood Test Results',
      date: 'Feb 28, 2023',
      doctor: 'Dr. Emily Johnson',
      type: 'Laboratory Report',
      summary: 'Complete blood count and metabolic panel results. All values within normal range except slightly elevated cholesterol.'
    },
    {
      title: 'Cardiac Evaluation',
      date: 'Dec 15, 2022',
      doctor: 'Dr. Robert Smith',
      type: 'Cardiology Consultation',
      summary: 'ECG and stress test results. Mild hypertension detected. Medication adjusted and follow-up scheduled.'
    }
  ];

  const renderProfileSection = () => (
    <div className="profile-content">
      {/* Personal Information Card */}
      <div className="profile-card">
        <div className="card-header">
          <h2 className="card-title">
            <User size={20} />
            Personal Information
          </h2>
          <button className="btn btn-secondary" onClick={() => setShowEditModal(true)}>
            <Edit size={16} />
          </button>
        </div>
        <div className="card-content">
          <div className="info-row">
            <span className="info-label">Full Name</span>
            <span className="info-value">{profileData.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Date of Birth</span>
            <span className="info-value">{profileData.dateOfBirth}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Age</span>
            <span className="info-value">{profileData.age}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Gender</span>
            <span className="info-value">{profileData.gender}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Blood Type</span>
            <span className="info-value">{profileData.bloodType}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Phone Number</span>
            <span className="info-value">{profileData.phone}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email Address</span>
            <span className="info-value">{profileData.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Address</span>
            <span className="info-value">{profileData.address}</span>
          </div>

          {/* Inline edit form */}
          <div className="mt-4">
            {!isEditing ? (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <Edit size={16} /> Edit Details
              </button>
            ) : (
              <form onSubmit={savePatientProfile} className="space-y-2">
                <div className="row">
                  <div className="col-lg-6"><input className="form-input" name="firstName" placeholder="First Name" value={patientForm.firstName} onChange={handlePatientFormChange} /></div>
                  <div className="col-lg-6"><input className="form-input" name="lastName" placeholder="Last Name" value={patientForm.lastName} onChange={handlePatientFormChange} /></div>
                </div>
                <div className="row">
                  <div className="col-lg-6"><input className="form-input" name="phone" placeholder="Phone" value={patientForm.phone} onChange={handlePatientFormChange} /></div>
                  <div className="col-lg-6">
                    <select className="form-input" name="gender" value={patientForm.gender} onChange={handlePatientFormChange}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6"><input className="form-input" type="date" name="dateOfBirth" value={patientForm.dateOfBirth} onChange={handlePatientFormChange} /></div>
                </div>
                <div className="row">
                  <div className="col-lg-6"><input className="form-input" name="address.street" placeholder="Street" value={patientForm.address.street} onChange={handlePatientFormChange} /></div>
                  <div className="col-lg-3"><input className="form-input" name="address.city" placeholder="City" value={patientForm.address.city} onChange={handlePatientFormChange} /></div>
                  <div className="col-lg-3"><input className="form-input" name="address.pincode" placeholder="Pincode" value={patientForm.address.pincode} onChange={handlePatientFormChange} /></div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={editSaving}>{editSaving ? 'Saving...' : 'Save'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
                {editMessage && <div className="form-message success">{editMessage}</div>}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Medical Information Card */}
      <div className="profile-card">
        <div className="card-header">
          <h2 className="card-title">
            <Heart size={20} />
            Medical Information
          </h2>
          <button className="btn btn-secondary" onClick={() => setShowMedicalModal(true)}>
            <Edit size={16} />
          </button>
        </div>
        <div className="card-content">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Allergies</h3>
          <div className="allergy-list">
            {profileData.allergies.map((allergy, index) => (
              <div key={index} className="allergy-item">
                <span className="allergy-icon">⚠️</span>
                <span>{allergy}</span>
              </div>
            ))}
          </div>
          
          <h3 style={{ margin: '1.5rem 0 1rem', color: 'var(--text-dark)' }}>Current Medications</h3>
          <div className="medication-list">
            {profileData.medications.map((med, index) => (
              <div key={index} className="medication-item">
                <div>
                  <div className="medication-name">{med.name}</div>
                  <div className="medication-dosage">{med.dosage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Card */}
      <div className="profile-card">
        <div className="card-header">
          <h2 className="card-title"><Calendar size={20} /> Book Appointment</h2>
        </div>
        <div className="card-content">
          <div className="row">
            <div className="col-lg-6">
              <div className="input-group">
                <i className="fas fa-user-md" />
                <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)}>
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>{doc.profile?.firstName} {doc.profile?.lastName} - {doc.doctorInfo?.specialization}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="input-group">
                <i className="fas fa-calendar" />
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
            </div>
            <div className="col-lg-2">
              <button className="btn btn-primary" onClick={fetchSlots} disabled={!selectedDoctorId || !selectedDate || loadingSlots}>{loadingSlots ? 'Loading...' : 'Find Slots'}</button>
            </div>
          </div>
          {availableSlots.length > 0 && (
            <div className="mt-3">
              <div className="info-label">Available Slots</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSlots.map(slot => (
                  <button key={slot} className="nav-btn" onClick={() => bookSlot(slot)} disabled={booking}>{slot}</button>
                ))}
              </div>
            </div>
          )}
          {bookingMessage && <div className="form-message success">{bookingMessage}</div>}
        </div>
      </div>

      {/* Insurance Information Card */}
      <div className="profile-card">
        <div className="card-header">
          <h2 className="card-title">
                            <Receipt size={20} />
            Insurance Information
          </h2>
          <button className="btn btn-secondary" onClick={() => setShowInsuranceModal(true)}>
            <Edit size={16} />
          </button>
        </div>
        <div className="card-content">
          <div className="insurance-card">
            <div className="insurance-provider">{profileData.insurance.provider}</div>
            <div className="insurance-number">Policy Number: {profileData.insurance.policyNumber}</div>
            <div className="insurance-status">Active</div>
          </div>
          
          <div className="info-row" style={{ marginTop: '1rem' }}>
            <span className="info-label">Coverage Type</span>
            <span className="info-value">{profileData.insurance.coverageType}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Effective Date</span>
            <span className="info-value">{profileData.insurance.effectiveDate}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Expiration Date</span>
            <span className="info-value">{profileData.insurance.expirationDate}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointmentsSection = () => (
    <div className="profile-content">
      <div className="profile-card">
        <div className="card-header">
          <h2 className="card-title">
            <Calendar size={20} />
            Upcoming Appointments
          </h2>
        </div>
        <div className="card-content">
          <div className="appointment-list">
            {appointments.map((appointment, index) => (
              <div key={index} className="appointment-item">
                <div className="appointment-date">{appointment.date}</div>
                <div className="appointment-doctor">{appointment.doctor}</div>
                <div className="appointment-type">{appointment.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="profile-card">
        <div className="card-header">
          <h2 className="card-title">
            <Calendar size={20} />
            Past Appointments
          </h2>
        </div>
        <div className="card-content">
          <div className="appointment-list">
            {pastAppointments.map((appointment, index) => (
              <div key={index} className="appointment-item">
                <div className="appointment-date">{appointment.date}</div>
                <div className="appointment-doctor">{appointment.doctor}</div>
                <div className="appointment-type">{appointment.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalRecordsSection = () => (
    <div className="profile-content">
      <div className="profile-card">
        <div className="card-header">
          <h2 className="card-title">
            <FileText size={20} />
            Previous Medical Reports
          </h2>
        </div>
        <div className="card-content">
          <div className="records-container">
            {medicalRecords.map((record, index) => (
              <div key={index} className="record-card">
                <div className="record-header">
                  <div className="record-title">{record.title}</div>
                  <div className="record-date">{record.date}</div>
                </div>
                <div className="record-body">
                  <div className="record-doctor">{record.doctor}</div>
                  <div className="record-type">{record.type}</div>
                  <div className="record-summary">{record.summary}</div>
                  <div className="record-actions">
                    <div className="record-btn view-btn">View Report</div>
                    <div className="record-btn download-btn">Download</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
        <div className="relative inline-block">
          <img 
            src="https://randomuser.me/api/portraits/women/44.jpg" 
            alt="Profile Photo" 
            className="h-24 w-24 rounded-full object-cover"
          />
          <button className="absolute bottom-0 right-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white">
            <Camera size={16} />
          </button>
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">{profileData.name}</h1>
        <p className="text-gray-600">Patient ID: {profileData.patientId}</p>
        <div className="mt-3 flex justify-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded bg-indigo-600 text-white" onClick={() => setShowEditModal(true)}>
            <Edit size={16} /> Edit Profile
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-300 text-gray-700">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b mb-4">
        <button className={`px-3 py-2 rounded-t ${currentSection === 'profile' ? 'bg-white border border-b-transparent' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setCurrentSection('profile')}>
          <span className="inline-flex items-center gap-1"><User size={16} /> Profile</span>
        </button>
        <button className={`px-3 py-2 rounded-t ${currentSection === 'appointments' ? 'bg-white border border-b-transparent' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setCurrentSection('appointments')}>
          <span className="inline-flex items-center gap-1"><Calendar size={16} /> Appointments</span>
        </button>
        <button className={`px-3 py-2 rounded-t ${currentSection === 'medical-records' ? 'bg-white border border-b-transparent' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setCurrentSection('medical-records')}>
          <span className="inline-flex items-center gap-1"><FileText size={16} /> Medical Records</span>
        </button>
      </div>

      {/* Content Sections */}
      {currentSection === 'profile' && renderProfileSection()}
      {currentSection === 'appointments' && renderAppointmentsSection()}
      {currentSection === 'medical-records' && renderMedicalRecordsSection()}
    </div>
  );
};

export default PatientProfile;
