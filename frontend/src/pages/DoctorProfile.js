import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit3, Save, X, Plus, Trash2, Star } from 'lucide-react';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingSection, setEditingSection] = useState(null);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (currentUser) {
      setUserProfile(currentUser);
      // Initialize profile data with current user data
      setProfileData({
        clinicalExpertise: currentUser.clinicalExpertise || {},
        patientExperience: currentUser.patientExperience || {},
        insuranceBilling: currentUser.insuranceBilling || {},
        practiceInfo: currentUser.practiceInfo || {},
        professionalBackground: currentUser.professionalBackground || {},
        legalCompliance: currentUser.legalCompliance || {},
        healthcareSystem: currentUser.healthcareSystem || {}
      });
      setIsLoading(false);
    }
  }, [currentUser]);

  const openEditModal = (section) => {
    setEditingSection(section);
  };

  const closeEditModal = () => {
    setEditingSection(null);
  };

  const handleInputChange = (section, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [parent]: {
            ...prev[section]?.[parent],
            [child]: value
          }
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleArrayChange = (section, field, value, index = null) => {
    if (index !== null) {
      // Update specific index
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: prev[section]?.[field]?.map((item, i) => 
            i === index ? value : item
          ) || []
        }
      }));
    } else {
      // Add new item
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...(prev[section]?.[field] || []), value]
        }
      }));
    }
  };

  const removeArrayItem = (section, field, index) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section]?.[field]?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const saveEdit = async () => {
    try {
      const result = await updateProfile({
        [editingSection]: profileData[editingSection]
      });

      if (result.success) {
        setUserProfile(result.user);
        closeEditModal();
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + result.message);
      }
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  if (isLoading) {
    return <div className="doctor-loading">Loading profile...</div>;
  }

  if (!userProfile) {
    return <div className="doctor-error">Profile not found</div>;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i <= rating ? "#ffb900" : "none"}
          color="#ffb900"
        />
      );
    }
    return stars;
  };

  return (
    <div className="doctor-profile-container">
      {/* Profile Header */}
      <div className="doctor-profile-header">
        <div className="doctor-profile-photo-container">
          <img 
            src={userProfile.profile?.profilePicture || '/default-avatar.png'} 
            alt="Profile" 
            className="doctor-profile-photo"
          />
          <button className="doctor-edit-photo-btn">
            <Edit3 size={16} />
          </button>
        </div>
        <h1 className="doctor-profile-name">
          Dr. {userProfile.profile?.firstName} {userProfile.profile?.lastName}
        </h1>
        <p className="doctor-profile-credentials">
          {userProfile.professionalBackground?.education?.map(edu => edu.degree).join(', ')}
        </p>
        <p className="doctor-profile-specialization">
          {userProfile.clinicalExpertise?.specialization}
        </p>
        <div className="doctor-profile-contact">
          <span><i className="fas fa-phone"></i> {userProfile.profile?.phone || 'Not specified'}</span>
          <span><i className="fas fa-envelope"></i> {userProfile.email}</span>
        </div>
        <div className="doctor-profile-actions">
          <button className="doctor-btn doctor-btn-primary">
            <i className="fas fa-calendar-plus"></i> Manage Schedule
          </button>
          <button className="doctor-btn doctor-btn-secondary">
            <i className="fas fa-user-plus"></i> Add Patient
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="doctor-tab-navigation">
        <button 
          className={`doctor-tab-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`doctor-tab-item ${activeTab === 'background' ? 'active' : ''}`}
          onClick={() => setActiveTab('background')}
        >
          Background
        </button>
        <button 
          className={`doctor-tab-item ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          Practice Info
        </button>
        <button 
          className={`doctor-tab-item ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={`doctor-tab-item ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          Patients
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="doctor-tab-content">
          <div className="doctor-section-card">
            <h2 className="doctor-section-title">
              Clinical Expertise
              <button className="doctor-edit-btn" onClick={() => openEditModal('clinicalExpertise')}>
                <Edit3 size={16} />
              </button>
            </h2>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Areas of Focus</div>
              <div className="doctor-info-value">
                {userProfile.clinicalExpertise?.areasOfFocus?.length > 0 ? (
                  <ul>
                    {userProfile.clinicalExpertise.areasOfFocus.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                ) : 'Not specified'}
              </div>
            </div>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Procedures</div>
              <div className="doctor-info-value">
                {userProfile.clinicalExpertise?.procedures?.length > 0 ? (
                  <ul>
                    {userProfile.clinicalExpertise.procedures.map((procedure, index) => (
                      <li key={index}>{procedure}</li>
                    ))}
                  </ul>
                ) : 'Not specified'}
              </div>
            </div>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Treatment Philosophy</div>
              <div className="doctor-info-value">
                {userProfile.clinicalExpertise?.treatmentPhilosophy || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="doctor-section-card">
            <h2 className="doctor-section-title">
              Patient Experience
              <button className="doctor-edit-btn" onClick={() => openEditModal('patientExperience')}>
                <Edit3 size={16} />
              </button>
            </h2>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Average Wait Time</div>
              <div className="doctor-info-value">
                {userProfile.patientExperience?.avgWaitTime || 'Not specified'}
              </div>
            </div>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Bedside Manner Rating</div>
              <div className="doctor-info-value">
                <div className="doctor-progress">
                  <div 
                    className="doctor-progress-bar" 
                    style={{ width: `${userProfile.patientExperience?.bedsideManner || 0}%` }}
                  ></div>
                </div>
                {userProfile.patientExperience?.bedsideManner || 0}%
              </div>
            </div>
            <div className="doctor-info-item">
              <div className="doctor-info-label">New Patient Acceptance</div>
              <div className="doctor-info-value">
                <span className={`doctor-badge ${userProfile.patientExperience?.newPatientAcceptance ? 'doctor-badge-success' : 'doctor-badge-warning'}`}>
                  {userProfile.patientExperience?.newPatientAcceptance ? 'Accepting' : 'Not Accepting'}
                </span>
              </div>
            </div>
          </div>

          <div className="doctor-section-card">
            <h2 className="doctor-section-title">
              Insurance & Billing
              <button className="doctor-edit-btn" onClick={() => openEditModal('insuranceBilling')}>
                <Edit3 size={16} />
              </button>
            </h2>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Government Schemes</div>
              <div className="doctor-info-value">
                {userProfile.insuranceBilling?.governmentSchemes?.length > 0 ? (
                  <ul>
                    {userProfile.insuranceBilling.governmentSchemes.map((scheme, index) => (
                      <li key={index}>{scheme}</li>
                    ))}
                  </ul>
                ) : 'Not specified'}
              </div>
            </div>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Private Insurance</div>
              <div className="doctor-info-value">
                {userProfile.insuranceBilling?.privateInsurance?.length > 0 ? (
                  <ul>
                    {userProfile.insuranceBilling.privateInsurance.map((insurance, index) => (
                      <li key={index}>{insurance}</li>
                    ))}
                  </ul>
                ) : 'Not specified'}
              </div>
            </div>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Payment Options</div>
              <div className="doctor-info-value">
                {userProfile.insuranceBilling?.paymentOptions || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="doctor-section-card">
            <h2 className="doctor-section-title">Reviews & Ratings</h2>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Overall Rating</div>
              <div className="doctor-info-value">
                <div className="doctor-rating">
                  {renderStars(userProfile.averageRating || 0)}
                  <span>{userProfile.averageRating || 0}/5</span>
                </div>
                <p>Based on {userProfile.reviews?.length || 0} reviews</p>
              </div>
            </div>
            {userProfile.reviews?.slice(0, 3).map((review, index) => (
              <div key={index} className="doctor-review-card">
                <div className="doctor-review-header">
                  <span className="doctor-reviewer-name">
                    {review.patientId?.personalInfo?.firstName || 'Anonymous'}
                  </span>
                  <span className="doctor-review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="doctor-rating">
                  {renderStars(review.rating)}
                </div>
                {review.comment && <p>{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Background Tab */}
      {activeTab === 'background' && (
        <div className="doctor-tab-content">
          <div className="doctor-section-card">
            <h2 className="doctor-section-title">
              Professional Background
              <button className="doctor-edit-btn" onClick={() => openEditModal('professionalBackground')}>
                <Edit3 size={16} />
              </button>
            </h2>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Education</div>
              <div className="doctor-info-value">
                {userProfile.professionalBackground?.education?.length > 0 ? (
                  <ul>
                    {userProfile.professionalBackground.education.map((edu, index) => (
                      <li key={index}>
                        <strong>{edu.degree}:</strong> {edu.institution} ({edu.year})
                      </li>
                    ))}
                  </ul>
                ) : 'Not specified'}
              </div>
            </div>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Years of Experience</div>
              <div className="doctor-info-value">
                {userProfile.professionalBackground?.yearsOfExperience || 0} years
              </div>
            </div>
            <div className="doctor-info-item">
              <div className="doctor-info-label">Awards & Recognitions</div>
              <div className="doctor-info-value">
                {userProfile.professionalBackground?.awards?.length > 0 ? (
                  <ul>
                    {userProfile.professionalBackground.awards.map((award, index) => (
                      <li key={index}>
                        <strong>{award.title}</strong> - {award.issuingOrganization} ({award.year})
                      </li>
                    ))}
                  </ul>
                ) : 'Not specified'}
              </div>
            </div>
          </div>

          <div className="doctor-section-card">
            <h2 className="doctor-section-title">
              Legal & Compliance
              <button className="doctor-edit-btn" onClick={() => openEditModal('legalCompliance')}>
                <Edit3 size={16} />
              </button>
            </h2>
            <div className="doctor-info-item">
              <div className="doctor-info-label">License Information</div>
              <div className="doctor-info-value">
                {userProfile.legalCompliance?.licenseInfo?.length > 0 ? (
                  userProfile.legalCompliance.licenseInfo.map((license, index) => (
                    <div key={index}>
                      {license.type}: {license.number} ({license.status})
                    </div>
                  ))
                ) : 'Not specified'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Practice Info Tab */}
      {activeTab === 'practice' && (
        <div className="doctor-tab-content">
          <div className="doctor-section-card">
            <h2 className="doctor-section-title">
              Office Locations
              <button className="doctor-edit-btn" onClick={() => openEditModal('practiceInfo')}>
                <Edit3 size={16} />
              </button>
            </h2>
            {userProfile.practiceInfo?.officeLocations?.map((location, index) => (
              <div key={index} className="doctor-info-item">
                <div className="doctor-info-label">{location.name}</div>
                <div className="doctor-info-value">
                  {location.address}<br />
                  {location.city}, {location.state} - {location.pincode}<br />
                  Phone: {location.phone}
                </div>
              </div>
            ))}
          </div>

          <div className="doctor-section-card">
            <h2 className="doctor-section-title">Office Hours</h2>
            {userProfile.practiceInfo?.officeHours?.map((schedule, index) => (
              <div key={index} className="doctor-info-item">
                <div className="doctor-info-label">{schedule.location}</div>
                <div className="doctor-info-value">
                  <table className="doctor-schedule-table">
                    <tbody>
                      {schedule.schedule.map((day, dayIndex) => (
                        <tr key={dayIndex}>
                          <td>{day.day.charAt(0).toUpperCase() + day.day.slice(1)}</td>
                          <td>
                            {day.isClosed ? 'Closed' : `${day.openTime} - ${day.closeTime}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="doctor-tab-content">
          <div className="doctor-section-card">
            <h2 className="doctor-section-title">Today's Schedule</h2>
            <div className="doctor-info-item">
              <div className="doctor-info-value">
                <p>Schedule management coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <div className="doctor-tab-content">
          <div className="doctor-section-card">
            <h2 className="doctor-section-title">Current Patients</h2>
            <div className="doctor-info-item">
              <div className="doctor-info-value">
                <p>Patient management coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modals */}
      {editingSection && (
        <div className="doctor-modal">
          <div className="doctor-modal-content">
            <div className="doctor-modal-header">
              <h3 className="doctor-modal-title">Edit {editingSection.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <button className="doctor-modal-close" onClick={closeEditModal}>
                <X size={20} />
              </button>
            </div>
            <div className="doctor-modal-body">
              {editingSection === 'clinicalExpertise' && (
                <>
                  <div className="doctor-form-group">
                    <label className="doctor-form-label">Specialization</label>
                    <input
                      type="text"
                      className="doctor-form-input"
                      value={profileData.clinicalExpertise?.specialization || ''}
                      onChange={(e) => handleInputChange('clinicalExpertise', 'specialization', e.target.value)}
                    />
                  </div>
                  <div className="doctor-form-group">
                    <label className="doctor-form-label">Areas of Focus</label>
                    {profileData.clinicalExpertise?.areasOfFocus?.map((area, index) => (
                      <div key={index} className="doctor-input-group">
                        <input
                          type="text"
                          className="doctor-form-input"
                          value={area}
                          onChange={(e) => handleArrayChange('clinicalExpertise', 'areasOfFocus', e.target.value, index)}
                        />
                        <button
                          type="button"
                          className="doctor-remove-btn"
                          onClick={() => removeArrayItem('clinicalExpertise', 'areasOfFocus', index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="doctor-add-item-btn"
                      onClick={() => handleArrayChange('clinicalExpertise', 'areasOfFocus', '')}
                    >
                      <Plus size={16} /> Add Area
                    </button>
                  </div>
                  <div className="doctor-form-group">
                    <label className="doctor-form-label">Treatment Philosophy</label>
                    <textarea
                      className="doctor-form-textarea"
                      value={profileData.clinicalExpertise?.treatmentPhilosophy || ''}
                      onChange={(e) => handleInputChange('clinicalExpertise', 'treatmentPhilosophy', e.target.value)}
                    />
                  </div>
                </>
              )}

              {editingSection === 'patientExperience' && (
                <>
                  <div className="doctor-form-group">
                    <label className="doctor-form-label">Average Wait Time</label>
                    <input
                      type="text"
                      className="doctor-form-input"
                      value={profileData.patientExperience?.avgWaitTime || ''}
                      onChange={(e) => handleInputChange('patientExperience', 'avgWaitTime', e.target.value)}
                      placeholder="e.g., 20-30 minutes"
                    />
                  </div>
                  <div className="doctor-form-group">
                    <label className="doctor-form-label">Bedside Manner Rating (0-100)</label>
                    <input
                      type="number"
                      className="doctor-form-input"
                      min="0"
                      max="100"
                      value={profileData.patientExperience?.bedsideManner || ''}
                      onChange={(e) => handleInputChange('patientExperience', 'bedsideManner', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="doctor-form-group">
                    <label className="doctor-form-label">Accept New Patients</label>
                    <select
                      className="doctor-form-input"
                      value={profileData.patientExperience?.newPatientAcceptance || false}
                      onChange={(e) => handleInputChange('patientExperience', 'newPatientAcceptance', e.target.value === 'true')}
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  </div>
                </>
              )}

              {editingSection === 'insuranceBilling' && (
                <>
                  <div className="doctor-form-group">
                    <label className="doctor-form-label">Government Schemes</label>
                    {profileData.insuranceBilling?.governmentSchemes?.map((scheme, index) => (
                      <div key={index} className="doctor-input-group">
                        <input
                          type="text"
                          className="doctor-form-input"
                          value={scheme}
                          onChange={(e) => handleArrayChange('insuranceBilling', 'governmentSchemes', e.target.value, index)}
                        />
                        <button
                          type="button"
                          className="doctor-remove-btn"
                          onClick={() => removeArrayItem('insuranceBilling', 'governmentSchemes', index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="doctor-add-item-btn"
                      onClick={() => handleArrayChange('insuranceBilling', 'governmentSchemes', '')}
                    >
                      <Plus size={16} /> Add Scheme
                    </button>
                  </div>
                  <div className="doctor-form-group">
                    <label className="doctor-form-label">Payment Options</label>
                    <input
                      type="text"
                      className="doctor-form-input"
                      value={profileData.insuranceBilling?.paymentOptions || ''}
                      onChange={(e) => handleInputChange('insuranceBilling', 'paymentOptions', e.target.value)}
                      placeholder="e.g., Cash, Card, UPI accepted"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="doctor-modal-footer">
              <button className="doctor-btn doctor-btn-secondary" onClick={closeEditModal}>
                Cancel
              </button>
              <button className="doctor-btn doctor-btn-primary" onClick={saveEdit}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
