import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import './PatientProfile.css';

const PatientProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modals, setModals] = useState({
    editPersonal: false,
    editMedical: false,
    editInsurance: false
  });

  // Form states
  const [personalForm, setPersonalForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    phone: '',
    address: {
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const [medicalForm, setMedicalForm] = useState({
    allergies: [],
    currentMedications: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  const [insuranceForm, setInsuranceForm] = useState({
    provider: '',
    policyNumber: '',
    coverageType: '',
    effectiveDate: '',
    expirationDate: ''
  });

  useEffect(() => {
    if (currentUser) {
      setUserProfile(currentUser);
      // Initialize forms with current user data
      if (currentUser.personalInfo) {
        setPersonalForm({
          firstName: currentUser.personalInfo.firstName || '',
          lastName: currentUser.personalInfo.lastName || '',
          dateOfBirth: currentUser.personalInfo.dateOfBirth ? new Date(currentUser.personalInfo.dateOfBirth).toISOString().split('T')[0] : '',
          gender: currentUser.personalInfo.gender || '',
          bloodType: currentUser.personalInfo.bloodType || '',
          phone: currentUser.personalInfo.phone || '',
          address: {
            street: currentUser.personalInfo.address?.street || '',
            area: currentUser.personalInfo.address?.area || '',
            city: currentUser.personalInfo.address?.city || '',
            state: currentUser.personalInfo.address?.state || '',
            pincode: currentUser.personalInfo.address?.pincode || ''
          }
        });
      }

      if (currentUser.medicalInfo) {
        setMedicalForm({
          allergies: currentUser.medicalInfo.allergies || [],
          currentMedications: currentUser.medicalInfo.currentMedications || [],
          emergencyContact: currentUser.medicalInfo.emergencyContact || {
            name: '',
            relationship: '',
            phone: ''
          }
        });
      }

      if (currentUser.insuranceInfo) {
        setInsuranceForm({
          provider: currentUser.insuranceInfo.provider || '',
          policyNumber: currentUser.insuranceInfo.policyNumber || '',
          coverageType: currentUser.insuranceInfo.coverageType || '',
          effectiveDate: currentUser.insuranceInfo.effectiveDate ? new Date(currentUser.insuranceInfo.effectiveDate).toISOString().split('T')[0] : '',
          expirationDate: currentUser.insuranceInfo.expirationDate ? new Date(currentUser.insuranceInfo.expirationDate).toISOString().split('T')[0] : ''
        });
      }

      setIsLoading(false);
    }
  }, [currentUser]);

  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  const handlePersonalChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPersonalForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setPersonalForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleMedicalChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setMedicalForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setMedicalForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleInsuranceChange = (field, value) => {
    setInsuranceForm(prev => ({ ...prev, [field]: value }));
  };

  const addAllergy = () => {
    const allergy = prompt('Enter allergy:');
    if (allergy && allergy.trim()) {
      setMedicalForm(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergy.trim()]
      }));
    }
  };

  const removeAllergy = (index) => {
    setMedicalForm(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const addMedication = () => {
    const name = prompt('Enter medication name:');
    const dosage = prompt('Enter dosage:');
    const frequency = prompt('Enter frequency:');
    
    if (name && name.trim()) {
      setMedicalForm(prev => ({
        ...prev,
        currentMedications: [...prev.currentMedications, {
          name: name.trim(),
          dosage: dosage || '',
          frequency: frequency || ''
        }]
      }));
    }
  };

  const removeMedication = (index) => {
    setMedicalForm(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.filter((_, i) => i !== index)
    }));
  };

  const handleSavePersonal = async () => {
    try {
      const result = await updateProfile({
        personalInfo: personalForm
      });

      if (result.success) {
        setUserProfile(result.user);
        closeModal('editPersonal');
        alert('Personal information updated successfully!');
      } else {
        alert('Failed to update personal information: ' + result.message);
      }
    } catch (error) {
      alert('Error updating personal information: ' + error.message);
    }
  };

  const handleSaveMedical = async () => {
    try {
      const result = await updateProfile({
        medicalInfo: medicalForm
      });

      if (result.success) {
        setUserProfile(result.user);
        closeModal('editMedical');
        alert('Medical information updated successfully!');
      } else {
        alert('Failed to update medical information: ' + result.message);
      }
    } catch (error) {
      alert('Error updating medical information: ' + error.message);
    }
  };

  const handleSaveInsurance = async () => {
    try {
      const result = await updateProfile({
        insuranceInfo: insuranceForm
      });

      if (result.success) {
        setUserProfile(result.user);
        closeModal('editInsurance');
        alert('Insurance information updated successfully!');
      } else {
        alert('Failed to update insurance information: ' + result.message);
      }
    } catch (error) {
      alert('Error updating insurance information: ' + error.message);
    }
  };

  if (isLoading) {
    return <div className="patient-loading">Loading profile...</div>;
  }

  if (!userProfile) {
    return <div className="patient-error">Profile not found</div>;
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  return (
    <div className="patient-profile-container">
      {/* Profile Header */}
      <div className="patient-profile-header">
        <div className="patient-profile-photo-container">
          <img 
            src={userProfile.personalInfo?.profilePicture || '/default-avatar.png'} 
            alt="Profile" 
            className="patient-profile-photo"
          />
          <button className="patient-edit-photo-btn">
            <Edit3 size={16} />
          </button>
        </div>
        <h1 className="patient-profile-name">
          {userProfile.personalInfo?.firstName} {userProfile.personalInfo?.lastName}
        </h1>
        <p className="patient-profile-id">Patient ID: {userProfile.patientId || 'PT-' + userProfile._id?.slice(-6).toUpperCase()}</p>
        <div className="patient-profile-actions">
          <button className="patient-btn patient-btn-primary">
            <i className="fas fa-calendar-plus"></i> Book Appointment
          </button>
          <button className="patient-btn patient-btn-secondary">
            <i className="fas fa-download"></i> Download Records
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="patient-profile-content">
        {/* Personal Information Card */}
        <div className="patient-profile-card">
          <div className="patient-card-header">
            <h2 className="patient-card-title">
              <i className="fas fa-user"></i> Personal Information
            </h2>
            <button className="patient-btn patient-btn-secondary" onClick={() => openModal('editPersonal')}>
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <div className="patient-card-content">
            <div className="patient-info-row">
              <span className="patient-info-label">Full Name</span>
              <span className="patient-info-value">
                {userProfile.personalInfo?.firstName} {userProfile.personalInfo?.lastName}
              </span>
            </div>
            <div className="patient-info-row">
              <span className="patient-info-label">Date of Birth</span>
              <span className="patient-info-value">
                {userProfile.personalInfo?.dateOfBirth ? new Date(userProfile.personalInfo.dateOfBirth).toLocaleDateString() : 'Not specified'}
              </span>
            </div>
            <div className="patient-info-row">
              <span className="patient-info-label">Age</span>
              <span className="patient-info-value">
                {calculateAge(userProfile.personalInfo?.dateOfBirth)}
              </span>
            </div>
            <div className="patient-info-row">
              <span className="patient-info-label">Gender</span>
              <span className="patient-info-value">{userProfile.personalInfo?.gender || 'Not specified'}</span>
            </div>
            <div className="patient-info-row">
              <span className="patient-info-label">Blood Type</span>
              <span className="patient-info-value">{userProfile.personalInfo?.bloodType || 'Not specified'}</span>
            </div>
            <div className="patient-info-row">
              <span className="patient-info-label">Phone Number</span>
              <span className="patient-info-value">{userProfile.personalInfo?.phone || 'Not specified'}</span>
            </div>
            <div className="patient-info-row">
              <span className="patient-info-label">Email Address</span>
              <span className="patient-info-value">{userProfile.email}</span>
            </div>
            <div className="patient-info-row">
              <span className="patient-info-label">Address</span>
              <span className="patient-info-value">
                {userProfile.personalInfo?.address?.street && `${userProfile.personalInfo.address.street}, `}
                {userProfile.personalInfo?.address?.area && `${userProfile.personalInfo.address.area}, `}
                {userProfile.personalInfo?.address?.city && `${userProfile.personalInfo.address.city}, `}
                {userProfile.personalInfo?.address?.state && `${userProfile.personalInfo.address.state} `}
                {userProfile.personalInfo?.address?.pincode && `- ${userProfile.personalInfo.address.pincode}`}
              </span>
            </div>
          </div>
        </div>

        {/* Medical Information Card */}
        <div className="patient-profile-card">
          <div className="patient-card-header">
            <h2 className="patient-card-title">
              <i className="fas fa-heartbeat"></i> Medical Information
            </h2>
            <button className="patient-btn patient-btn-secondary" onClick={() => openModal('editMedical')}>
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <div className="patient-card-content">
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Allergies</h3>
            <div className="patient-allergy-list">
              {userProfile.medicalInfo?.allergies?.length > 0 ? (
                userProfile.medicalInfo.allergies.map((allergy, i) => (
                  <div key={i} className="patient-allergy-item">
                    <AlertTriangle className="patient-allergy-icon" size={16} />
                    <span>{allergy}</span>
                  </div>
                ))
              ) : <p>No allergies listed.</p>}
            </div>
            
            <h3 style={{ margin: '1.5rem 0 1rem', color: '#333' }}>Current Medications</h3>
            <div className="patient-medication-list">
              {userProfile.medicalInfo?.currentMedications?.length > 0 ? (
                userProfile.medicalInfo.currentMedications.map((med, i) => (
                  <div key={i} className="patient-medication-item">
                    <div>
                      <div className="patient-medication-name">{med.name}</div>
                      <div className="patient-medication-dosage">
                        {med.dosage && `${med.dosage}`}
                        {med.frequency && `, ${med.frequency}`}
                      </div>
                    </div>
                  </div>
                ))
              ) : <p>No medications listed.</p>}
            </div>

            {userProfile.medicalInfo?.emergencyContact?.name && (
              <>
                <h3 style={{ margin: '1.5rem 0 1rem', color: '#333' }}>Emergency Contact</h3>
                <div className="patient-emergency-contact">
                  <p><strong>Name:</strong> {userProfile.medicalInfo.emergencyContact.name}</p>
                  <p><strong>Relationship:</strong> {userProfile.medicalInfo.emergencyContact.relationship}</p>
                  <p><strong>Phone:</strong> {userProfile.medicalInfo.emergencyContact.phone}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Appointments Card */}
        <div className="patient-profile-card">
          <div className="patient-card-header">
            <h2 className="patient-card-title">
              <i className="fas fa-calendar-check"></i> Upcoming Appointments
            </h2>
            <button className="patient-btn patient-btn-primary">
              <i className="fas fa-plus"></i> Book New
            </button>
          </div>
          <div className="patient-card-content">
            <div className="patient-appointment-list">
              {userProfile.appointments?.upcoming?.length > 0 ? (
                userProfile.appointments.upcoming.map((appointment, i) => (
                  <div key={i} className="patient-appointment-item">
                    <div className="patient-appointment-date">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </div>
                    <div className="patient-appointment-doctor">
                      {appointment.doctor} - {appointment.specialty}
                    </div>
                    <div className="patient-appointment-type">{appointment.type}</div>
                  </div>
                ))
              ) : (
                <p>No upcoming appointments.</p>
              )}
            </div>
          </div>
        </div>

        {/* Insurance Information Card */}
        <div className="patient-profile-card">
          <div className="patient-card-header">
            <h2 className="patient-card-title">
              <i className="fas fa-file-invoice-dollar"></i> Insurance Information
            </h2>
            <button className="patient-btn patient-btn-secondary" onClick={() => openModal('editInsurance')}>
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <div className="patient-card-content">
            {userProfile.insuranceInfo?.provider ? (
              <>
                <div className="patient-insurance-card">
                  <div className="patient-insurance-provider">{userProfile.insuranceInfo.provider}</div>
                  <div className="patient-insurance-number">
                    Policy Number: <span>{userProfile.insuranceInfo.policyNumber}</span>
                  </div>
                  <div className="patient-insurance-status">
                    {userProfile.insuranceInfo.status || 'Active'}
                  </div>
                </div>
                
                <div className="patient-info-row" style={{ marginTop: '1rem' }}>
                  <span className="patient-info-label">Coverage Type</span>
                  <span className="patient-info-value">{userProfile.insuranceInfo.coverageType}</span>
                </div>
                <div className="patient-info-row">
                  <span className="patient-info-label">Effective Date</span>
                  <span className="patient-info-value">
                    {userProfile.insuranceInfo.effectiveDate ? new Date(userProfile.insuranceInfo.effectiveDate).toLocaleDateString() : 'Not specified'}
                  </span>
                </div>
                <div className="patient-info-row">
                  <span className="patient-info-label">Expiration Date</span>
                  <span className="patient-info-value">
                    {userProfile.insuranceInfo.expirationDate ? new Date(userProfile.insuranceInfo.expirationDate).toLocaleDateString() : 'Not specified'}
                  </span>
                </div>
              </>
            ) : (
              <p>No insurance information available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information Edit Modal */}
      {modals.editPersonal && (
        <div className="patient-modal">
          <div className="patient-modal-content">
            <div className="patient-modal-header">
              <h3 className="patient-modal-title">Edit Personal Information</h3>
              <button className="patient-modal-close" onClick={() => closeModal('editPersonal')}>
                <X size={20} />
              </button>
            </div>
            <div className="patient-modal-body">
              <div className="patient-form-group">
                <label className="patient-form-label">First Name</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={personalForm.firstName}
                  onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Last Name</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={personalForm.lastName}
                  onChange={(e) => handlePersonalChange('lastName', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Date of Birth</label>
                <input
                  type="date"
                  className="patient-form-input"
                  value={personalForm.dateOfBirth}
                  onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Gender</label>
                <select
                  className="patient-form-input"
                  value={personalForm.gender}
                  onChange={(e) => handlePersonalChange('gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Blood Type</label>
                <select
                  className="patient-form-input"
                  value={personalForm.bloodType}
                  onChange={(e) => handlePersonalChange('bloodType', e.target.value)}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Phone</label>
                <input
                  type="tel"
                  className="patient-form-input"
                  value={personalForm.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Street Address</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={personalForm.address.street}
                  onChange={(e) => handlePersonalChange('address.street', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Area</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={personalForm.address.area}
                  onChange={(e) => handlePersonalChange('address.area', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">City</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={personalForm.address.city}
                  onChange={(e) => handlePersonalChange('address.city', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">State</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={personalForm.address.state}
                  onChange={(e) => handlePersonalChange('address.state', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Pincode</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={personalForm.address.pincode}
                  onChange={(e) => handlePersonalChange('address.pincode', e.target.value)}
                />
              </div>
            </div>
            <div className="patient-modal-footer">
              <button className="patient-btn patient-btn-secondary" onClick={() => closeModal('editPersonal')}>
                Cancel
              </button>
              <button className="patient-btn patient-btn-primary" onClick={handleSavePersonal}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medical Information Edit Modal */}
      {modals.editMedical && (
        <div className="patient-modal">
          <div className="patient-modal-content">
            <div className="patient-modal-header">
              <h3 className="patient-modal-title">Edit Medical Information</h3>
              <button className="patient-modal-close" onClick={() => closeModal('editMedical')}>
                <X size={20} />
              </button>
            </div>
            <div className="patient-modal-body">
              <div className="patient-form-group">
                <label className="patient-form-label">Allergies</label>
                <div className="patient-allergy-inputs">
                  {medicalForm.allergies.map((allergy, index) => (
                    <div key={index} className="patient-input-group">
                      <input
                        type="text"
                        className="patient-form-input"
                        value={allergy}
                        onChange={(e) => {
                          const newAllergies = [...medicalForm.allergies];
                          newAllergies[index] = e.target.value;
                          setMedicalForm(prev => ({ ...prev, allergies: newAllergies }));
                        }}
                      />
                      <button
                        type="button"
                        className="patient-remove-btn"
                        onClick={() => removeAllergy(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="patient-add-item-btn"
                    onClick={addAllergy}
                  >
                    <Plus size={16} /> Add Allergy
                  </button>
                </div>
              </div>

              <div className="patient-form-group">
                <label className="patient-form-label">Current Medications</label>
                <div className="patient-medication-inputs">
                  {medicalForm.currentMedications.map((med, index) => (
                    <div key={index} className="patient-medication-input-group">
                      <input
                        type="text"
                        className="patient-form-input"
                        placeholder="Medication name"
                        value={med.name}
                        onChange={(e) => {
                          const newMeds = [...medicalForm.currentMedications];
                          newMeds[index] = { ...newMeds[index], name: e.target.value };
                          setMedicalForm(prev => ({ ...prev, currentMedications: newMeds }));
                        }}
                      />
                      <input
                        type="text"
                        className="patient-form-input"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) => {
                          const newMeds = [...medicalForm.currentMedications];
                          newMeds[index] = { ...newMeds[index], dosage: e.target.value };
                          setMedicalForm(prev => ({ ...prev, currentMedications: newMeds }));
                        }}
                      />
                      <input
                        type="text"
                        className="patient-form-input"
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) => {
                          const newMeds = [...medicalForm.currentMedications];
                          newMeds[index] = { ...newMeds[index], frequency: e.target.value };
                          setMedicalForm(prev => ({ ...prev, currentMedications: newMeds }));
                        }}
                      />
                      <button
                        type="button"
                        className="patient-remove-btn"
                        onClick={() => removeMedication(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="patient-add-item-btn"
                    onClick={addMedication}
                  >
                    <Plus size={16} /> Add Medication
                  </button>
                </div>
              </div>

              <div className="patient-form-group">
                <label className="patient-form-label">Emergency Contact Name</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={medicalForm.emergencyContact.name}
                  onChange={(e) => handleMedicalChange('emergencyContact.name', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Relationship</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={medicalForm.emergencyContact.relationship}
                  onChange={(e) => handleMedicalChange('emergencyContact.relationship', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Emergency Contact Phone</label>
                <input
                  type="tel"
                  className="patient-form-input"
                  value={medicalForm.emergencyContact.phone}
                  onChange={(e) => handleMedicalChange('emergencyContact.phone', e.target.value)}
                />
              </div>
            </div>
            <div className="patient-modal-footer">
              <button className="patient-btn patient-btn-secondary" onClick={() => closeModal('editMedical')}>
                Cancel
              </button>
              <button className="patient-btn patient-btn-primary" onClick={handleSaveMedical}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insurance Information Edit Modal */}
      {modals.editInsurance && (
        <div className="patient-modal">
          <div className="patient-modal-content">
            <div className="patient-modal-header">
              <h3 className="patient-modal-title">Edit Insurance Information</h3>
              <button className="patient-modal-close" onClick={() => closeModal('editInsurance')}>
                <X size={20} />
              </button>
            </div>
            <div className="patient-modal-body">
              <div className="patient-form-group">
                <label className="patient-form-label">Insurance Provider</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={insuranceForm.provider}
                  onChange={(e) => handleInsuranceChange('provider', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Policy Number</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={insuranceForm.policyNumber}
                  onChange={(e) => handleInsuranceChange('policyNumber', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Coverage Type</label>
                <input
                  type="text"
                  className="patient-form-input"
                  value={insuranceForm.coverageType}
                  onChange={(e) => handleInsuranceChange('coverageType', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Effective Date</label>
                <input
                  type="date"
                  className="patient-form-input"
                  value={insuranceForm.effectiveDate}
                  onChange={(e) => handleInsuranceChange('effectiveDate', e.target.value)}
                />
              </div>
              <div className="patient-form-group">
                <label className="patient-form-label">Expiration Date</label>
                <input
                  type="date"
                  className="patient-form-input"
                  value={insuranceForm.expirationDate}
                  onChange={(e) => handleInsuranceChange('expirationDate', e.target.value)}
                />
              </div>
            </div>
            <div className="patient-modal-footer">
              <button className="patient-btn patient-btn-secondary" onClick={() => closeModal('editInsurance')}>
                Cancel
              </button>
              <button className="patient-btn patient-btn-primary" onClick={handleSaveInsurance}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;