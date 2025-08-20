import React, { useState, useEffect } from 'react';
import { Calendar, Users, Edit, Camera, Star, MapPin, Phone, Mail, Plus, Trash2, Save, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Tailwind CSS used for styling

const DoctorProfile = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const { userProfile, currentUser, updateProfile, apiCall } = useAuth();
  
  // Initialize profile data with backend data or defaults
  const [profileData, setProfileData] = useState({
    // Basic info from backend
    name: userProfile?.profile?.firstName && userProfile?.profile?.lastName 
      ? `Dr. ${userProfile.profile.firstName} ${userProfile.profile.lastName}` 
      : 'Dr. ',
    email: userProfile?.email || '',
    phone: userProfile?.profile?.phone || '',
    
    // Doctor-specific info from backend or defaults
    credentials: userProfile?.doctorInfo?.credentials || '',
    specialization: userProfile?.doctorInfo?.specialization || '',
    experience: userProfile?.doctorInfo?.experience || '',
    licenseNumber: userProfile?.doctorInfo?.licenseNumber || '',
    
    // Editable profile sections
    clinicalExpertise: {
      areasOfFocus: ['General Consultation', 'Preventive Medicine', 'Health Checkups'],
      procedures: ['Clinical Examination', 'Health Screening', 'Consultation'],
      treatmentPhilosophy: 'I believe in providing personalized, compassionate care to each patient.',
      researchInterests: 'Interested in preventive medicine and patient care quality improvement.'
    },
    
    patientExperience: {
      avgWaitTime: '15-20 minutes',
      bedsideManner: 92,
      newPatientAcceptance: true
    },
    
    insuranceBilling: {
      governmentSchemes: ['CGHS', 'ESI'],
      privateInsurance: ['Star Health', 'ICICI Lombard', 'HDFC Ergo'],
      paymentOptions: 'Cash, Card, UPI accepted'
    },
    
    practiceInfo: {
      primaryLocation: {
        name: 'Apollo Hospitals',
        address: 'Delhi - 110001',
        phone: '+91 11 1234 5678'
      },
      officeHours: {
        weekdays: '9:00 AM - 5:00 PM',
        saturday: '9:00 AM - 1:00 PM',
        sunday: 'Closed'
      },
      emergencyContact: 'Call hospital main number for emergencies'
    }
  });

  // Load profile data on component mount
  useEffect(() => {
    if (userProfile) {
      setProfileData(prevData => ({
        ...prevData,
        name: userProfile.profile?.firstName && userProfile.profile?.lastName 
          ? `Dr. ${userProfile.profile.firstName} ${userProfile.profile.lastName}` 
          : prevData.name,
        email: userProfile.email || prevData.email,
        phone: userProfile.profile?.phone || prevData.phone,
        credentials: userProfile.doctorInfo?.credentials || prevData.credentials,
        specialization: userProfile.doctorInfo?.specialization || prevData.specialization,
        experience: userProfile.doctorInfo?.experience || prevData.experience,
        licenseNumber: userProfile.doctorInfo?.licenseNumber || prevData.licenseNumber,
      }));
    }
  }, [userProfile]);

  // Handle editing functions
  const startEditing = (section) => {
    setEditingSection(section);
    setEditData(profileData[section] || {});
    setShowEditModal(true);
  };

  const handleEditInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const addArrayItem = (field) => {
    setEditData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || []
    }));
  };

  const saveEdit = async () => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const updatedData = {
        ...profileData,
        [editingSection]: editData
      };
      
      // Update local state
      setProfileData(updatedData);
      
      // Prepare data for backend update
      const backendUpdateData = {};
      
      if (editingSection === 'clinicalExpertise') {
        backendUpdateData.doctorInfo = {
          ...userProfile.doctorInfo,
          clinicalExpertise: editData
        };
      } else if (editingSection === 'practiceInfo') {
        backendUpdateData.doctorInfo = {
          ...userProfile.doctorInfo,
          practiceInfo: editData
        };
      } else {
        backendUpdateData.doctorInfo = {
          ...userProfile.doctorInfo,
          [editingSection]: editData
        };
      }
      
      // Update profile via API
      await updateProfile(backendUpdateData);
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      setTimeout(() => {
        setShowEditModal(false);
        setEditingSection(null);
        setMessage({ text: '', type: '' });
      }, 2000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingSection(null);
    setEditData({});
    setMessage({ text: '', type: '' });
  };

  // Tab rendering functions
  const renderOverview = () => (
    <div className="row">
      <div className="col-lg-8">
        {/* Clinical Expertise */}
        <div className="section-card">
          <h2 className="section-title">
            Clinical Expertise
            <button className="btn btn-sm btn-outline-primary edit-btn" onClick={() => startEditing('clinicalExpertise')}>
              <Edit size={16} />
            </button>
          </h2>
          <div className="row">
            <div className="col-md-6">
              <div className="info-item">
                <div className="info-label">Areas of Focus</div>
                <div className="info-value">
                  <ul className="mb-0">
                    {profileData.clinicalExpertise.areasOfFocus.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="info-item">
                <div className="info-label">Procedures Performed</div>
                <div className="info-value">
                  <ul className="mb-0">
                    {profileData.clinicalExpertise.procedures.map((procedure, index) => (
                      <li key={index}>{procedure}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="info-item mt-3">
            <div className="info-label">Treatment Philosophy</div>
            <div className="info-value">
              {profileData.clinicalExpertise.treatmentPhilosophy}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Research Interests</div>
            <div className="info-value">
              {profileData.clinicalExpertise.researchInterests}
            </div>
          </div>
        </div>

        {/* Patient Reviews */}
        <div className="section-card">
          <h2 className="section-title">Patient Reviews</h2>
          <div className="review-card">
            <div className="review-header">
              <div className="reviewer-name">Patient Review</div>
              <div className="review-date">Recent</div>
            </div>
            <div className="rating mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="filled" fill="#ffb900" />
              ))}
            </div>
            <p>Reviews will be displayed here once patients start rating your services.</p>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        {/* Patient Experience */}
        <div className="section-card">
          <h2 className="section-title">
            Patient Experience
            <button className="btn btn-sm btn-outline-primary edit-btn" onClick={() => startEditing('patientExperience')}>
              <Edit size={16} />
            </button>
          </h2>
          <div className="info-item">
            <div className="info-label">Average Wait Time</div>
            <div className="info-value">{profileData.patientExperience.avgWaitTime}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Bedside Manner</div>
            <div className="info-value">
              <div className="progress mb-2">
                <div className="progress-bar bg-success" style={{ width: `${profileData.patientExperience.bedsideManner}%` }}></div>
              </div>
              <small>{profileData.patientExperience.bedsideManner}% of patients rated excellent</small>
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">New Patient Acceptance</div>
            <div className="info-value">
              <span className={`badge ${profileData.patientExperience.newPatientAcceptance ? 'bg-success' : 'bg-warning'}`}>
                {profileData.patientExperience.newPatientAcceptance ? 'Accepting New Patients' : 'Not Accepting'}
              </span>
            </div>
          </div>
        </div>

        {/* Insurance & Billing */}
        <div className="section-card">
          <h2 className="section-title">
            Insurance & Billing
            <button className="btn btn-sm btn-outline-primary edit-btn" onClick={() => startEditing('insuranceBilling')}>
              <Edit size={16} />
            </button>
          </h2>
          <div className="info-item">
            <div className="info-label">Government Schemes</div>
            <div className="info-value">
              <span className="badge bg-success">Accepting {profileData.insuranceBilling.governmentSchemes.join(', ')}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Private Insurance</div>
            <div className="info-value">
              <ul className="mb-0">
                {profileData.insuranceBilling.privateInsurance.map((insurance, index) => (
                  <li key={index}>{insurance}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Payment Options</div>
            <div className="info-value">
              {profileData.insuranceBilling.paymentOptions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackground = () => (
    <div className="row">
      <div className="col-lg-12">
        <div className="section-card">
          <h2 className="section-title">Professional Background</h2>
          <div className="row">
            <div className="col-md-6">
              <div className="info-item">
                <div className="info-label">Credentials</div>
                <div className="info-value">{profileData.credentials}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Specialization</div>
                <div className="info-value">{profileData.specialization}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="info-item">
                <div className="info-label">Years of Experience</div>
                <div className="info-value">{profileData.experience}</div>
              </div>
              <div className="info-item">
                <div className="info-label">License Number</div>
                <div className="info-value">{profileData.licenseNumber}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPracticeInfo = () => (
    <div className="row">
      <div className="col-lg-6">
        <div className="section-card">
          <h2 className="section-title">
            Office Location
            <button className="btn btn-sm btn-outline-primary edit-btn" onClick={() => startEditing('practiceInfo')}>
              <Edit size={16} />
            </button>
          </h2>
          <div className="info-item">
            <div className="info-label">Primary Location</div>
            <div className="info-value">
              <strong>{profileData.practiceInfo.primaryLocation.name}</strong><br />
              {profileData.practiceInfo.primaryLocation.address}<br />
              Phone: {profileData.practiceInfo.primaryLocation.phone}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="section-card">
          <h2 className="section-title">Office Hours</h2>
          <div className="info-item">
            <div className="info-label">Weekdays</div>
            <div className="info-value">{profileData.practiceInfo.officeHours.weekdays}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Saturday</div>
            <div className="info-value">{profileData.practiceInfo.officeHours.saturday}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Sunday</div>
            <div className="info-value">{profileData.practiceInfo.officeHours.sunday}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="section-card">
      <h2 className="section-title">Appointment Management</h2>
      <p>Appointment management features will be available here. You can view upcoming appointments, manage schedules, and update availability.</p>
      <div className="text-center mt-4">
        <button className="btn btn-primary">
          <Calendar size={16} />
          <span className="ms-2">Manage Schedule</span>
        </button>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="section-card">
      <h2 className="section-title">Patient List</h2>
      <p>Patient management features will be available here. You can view patient histories, upcoming appointments, and manage patient communications.</p>
      <div className="text-center mt-4">
        <button className="btn btn-primary">
          <Users size={16} />
          <span className="ms-2">View Patients</span>
        </button>
      </div>
    </div>
  );

  const renderFAQs = () => (
    <div className="section-card">
      <h2 className="section-title">Frequently Asked Questions</h2>
      <div className="faq-item">
        <h5>How do I update my profile information?</h5>
        <p>Click the edit button next to any section to update your information. Changes are saved automatically.</p>
      </div>
      <div className="faq-item">
        <h5>How do patients book appointments with me?</h5>
        <p>Patients can book appointments through the platform by selecting your profile and choosing available time slots.</p>
      </div>
      <div className="faq-item">
        <h5>How do I manage my availability?</h5>
        <p>Use the Appointments tab to set your availability and manage your schedule.</p>
      </div>
    </div>
  );

  // Edit modal for different sections
  const renderEditModal = () => {
    if (!showEditModal || !editingSection) return null;

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit {editingSection}</h5>
              <button type="button" className="btn-close" onClick={cancelEdit}></button>
            </div>
            <div className="modal-body">
              {editingSection === 'clinicalExpertise' && (
                <div>
                  <div className="mb-3">
                    <label className="form-label">Treatment Philosophy</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      value={editData.treatmentPhilosophy || ''}
                      onChange={(e) => handleEditInputChange('treatmentPhilosophy', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Research Interests</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      value={editData.researchInterests || ''}
                      onChange={(e) => handleEditInputChange('researchInterests', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Areas of Focus</label>
                    {(editData.areasOfFocus || []).map((area, index) => (
                      <div key={index} className="input-group mb-2">
                        <input 
                          type="text" 
                          className="form-control"
                          value={area}
                          onChange={(e) => handleArrayInputChange('areasOfFocus', index, e.target.value)}
                        />
                        <button className="btn btn-outline-danger" onClick={() => removeArrayItem('areasOfFocus', index)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-outline-primary" onClick={() => addArrayItem('areasOfFocus')}>
                      <Plus size={16} /> Add Area
                    </button>
                  </div>
                </div>
              )}

              {editingSection === 'patientExperience' && (
                <div>
                  <div className="mb-3">
                    <label className="form-label">Average Wait Time</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={editData.avgWaitTime || ''}
                      onChange={(e) => handleEditInputChange('avgWaitTime', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bedside Manner Rating (%)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      min="0" 
                      max="100"
                      value={editData.bedsideManner || ''}
                      onChange={(e) => handleEditInputChange('bedsideManner', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={editData.newPatientAcceptance || false}
                      onChange={(e) => handleEditInputChange('newPatientAcceptance', e.target.checked)}
                    />
                    <label className="form-check-label">Accepting New Patients</label>
                  </div>
                </div>
              )}

              {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mt-3`}>
                  {message.text}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                <X size={16} /> Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={saveEdit} disabled={isLoading}>
                <Save size={16} /> {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return renderOverview();
      case 'background':
        return renderBackground();
      case 'practice':
        return renderPracticeInfo();
      case 'appointments':
        return renderAppointments();
      case 'patients':
        return renderPatients();
      case 'faqs':
        return renderFAQs();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="profile-container max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="profile-header bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="text-center">
            <div className="profile-picture inline-flex items-center justify-center h-24 w-24 rounded-full bg-indigo-50 text-indigo-600 relative">
              <User size={48} />
              <button className="absolute bottom-0 right-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white">
                <Camera size={16} />
              </button>
            </div>
          </div>
          <div className="md:col-span-3">
            <h1 className="text-2xl font-semibold text-gray-900">{profileData.name}</h1>
            <p className="text-gray-600">{profileData.credentials}</p>
            <p className="text-gray-700">{profileData.specialization}</p>
            <div className="mt-2 flex gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1"><Mail size={16} /> {profileData.email}</span>
              <span className="inline-flex items-center gap-1"><Phone size={16} /> {profileData.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-nav">
        <ul className="flex gap-2 border-b mb-4">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'background', label: 'Background' },
            { id: 'practice', label: 'Practice Info' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'patients', label: 'Patients' },
            { id: 'faqs', label: 'FAQs' }
          ].map((tab) => (
            <li key={tab.id} className="nav-item">
              <button 
                className={`nav-link px-3 py-2 rounded-t ${currentTab === tab.id ? 'bg-white border border-b-transparent' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setCurrentTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {renderTabContent()}
      </div>

      {/* Edit Modal */}
      {renderEditModal()}
    </div>
  );
};

export default DoctorProfile;
