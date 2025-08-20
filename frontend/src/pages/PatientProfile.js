import React, { useState, useEffect, useRef } from 'react';
import {
    User, Calendar, FileText, Edit, Share2, Camera, Heart, Receipt, Plus, ArrowLeft, CheckCircle, AlertTriangle, Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './PatientProfile.css';

const PatientProfile = () => {
    // Use 'currentUser' as it is named in your AuthContext
    const { currentUser: userProfile, logout, updateProfile } = useAuth();

    // UI State
    const [currentSection, setCurrentSection] = useState('profile');
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [isSaving, setIsSaving] = useState(false);
    const [modals, setModals] = useState({
        editProfile: false,
        editMedical: false,
    });

    // Form State
    const [profileForm, setProfileForm] = useState({ address: {} });
    const [medicalForm, setMedicalForm] = useState({});

    // --- 1. DATA MAPPING: Read data from the correct fields of your User model ---
    useEffect(() => {
        if (userProfile) {
            // Populate Personal Info form from `userProfile.profile`
            setProfileForm({
                firstName: userProfile.profile?.firstName || '',
                lastName: userProfile.profile?.lastName || '',
                dateOfBirth: userProfile.profile?.dateOfBirth ? new Date(userProfile.profile.dateOfBirth).toISOString().split('T')[0] : '',
                gender: userProfile.profile?.gender || 'other',
                phone: userProfile.profile?.phone || '',
                address: userProfile.profile?.address || {},
            });

            // Populate Medical Info form from `userProfile.patientInfo`
            setMedicalForm({
                bloodType: userProfile.patientInfo?.bloodType || '',
                allergies: (userProfile.patientInfo?.allergies || []).join(', '),
            });
        }
    }, [userProfile]);

    // --- 2. SAVE HANDLERS: Implement logic to save data to the backend ---
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // This payload matches what your PUT /api/users/profile route expects
        const payload = {
            // The route updates fields inside the 'profile' object
            ...profileForm
        };
        const result = await updateProfile(payload);
        
        showNotification(result.message, result.success ? 'success' : 'error');
        if (result.success) {
            handleModal('editProfile', 'close');
        }
        setIsSaving(false);
    };

    const handleSaveMedical = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Construct the payload to match the `patientInfo` structure in your schema
        const payload = {
            patientInfo: {
                bloodType: medicalForm.bloodType,
                // Convert the comma-separated string back to an array
                allergies: medicalForm.allergies.split(',').map(s => s.trim()).filter(Boolean),
            }
        };
        const result = await updateProfile(payload);

        showNotification(result.message, result.success ? 'success' : 'error');
        if (result.success) {
            handleModal('editMedical', 'close');
        }
        setIsSaving(false);
    };

    // Helper Functions
    const handleModal = (modalName, action) => setModals(prev => ({ ...prev, [modalName]: action === 'open' }));
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };
    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const age = new Date().getFullYear() - new Date(dob).getFullYear();
        // This is a simplified calculation
        return `${age} years`;
    };
    const fullName = `${userProfile?.profile?.firstName || ''} ${userProfile?.profile?.lastName || ''}`.trim();

    return (
        <>
            {/* The Header and Footer are included here as per your original file structure. */}
            {/* It is recommended to move these into a central App.js layout later. */}
            <header className="header">{/* Your Header JSX */}</header>

            <div id="notification" className={`notification ${notification.type} ${notification.show ? 'show' : ''}`}>
                {notification.type === 'success' ? <CheckCircle /> : <AlertTriangle />}
                <span>{notification.message}</span>
            </div>

            <main>
                <div id="profile-section" className={`profile-container ${currentSection !== 'profile' ? 'hidden' : ''}`}>
                    <div className="profile-header">
                        <div className="profile-photo-container">
                            <img src={userProfile?.profile?.profilePicture || "https://i.pravatar.cc/150"} alt="Profile" className="profile-photo" />
                            <button className="edit-photo-btn"><Camera /></button>
                        </div>
                        <h1 className="profile-name">{fullName || 'Patient Name'}</h1>
                        <p className="profile-id">Patient ID: {userProfile?._id || 'N/A'}</p>
                        <div className="profile-actions">
                            <button className="btn btn-primary" onClick={() => handleModal('editProfile', 'open')}><Edit size={16}/> Edit Profile</button>
                            <button className="btn btn-secondary"><Share2 size={16}/> Share</button>
                        </div>
                    </div>

                    <div className="profile-content">
                        {/* Personal Information Card - Reads from `userProfile.profile` */}
                        <InfoCard title="Personal Information" icon={<User />} onEdit={() => handleModal('editProfile', 'open')}>
                            <InfoRow label="Full Name" value={fullName} />
                            <InfoRow label="Date of Birth" value={userProfile?.profile?.dateOfBirth ? new Date(userProfile.profile.dateOfBirth).toLocaleDateString('en-GB') : 'N/A'} />
                            <InfoRow label="Age" value={calculateAge(userProfile?.profile?.dateOfBirth)} />
                            <InfoRow label="Gender" value={userProfile?.profile?.gender} />
                            <InfoRow label="Phone Number" value={userProfile?.profile?.phone} />
                            <InfoRow label="Email Address" value={userProfile?.email} />
                            <InfoRow label="Address" value={userProfile?.profile?.address?.street} />
                        </InfoCard>

                        {/* Medical Information Card - Reads from `userProfile.patientInfo` */}
                        <InfoCard title="Medical Information" icon={<Heart />} onEdit={() => handleModal('editMedical', 'open')}>
                             <InfoRow label="Blood Type" value={userProfile?.patientInfo?.bloodType} />
                            <h3 style={{ margin: '1rem 0', color: 'var(--text-dark)' }}>Allergies</h3>
                            <div className="allergy-list">
                                {userProfile?.patientInfo?.allergies?.length > 0 ? (
                                    userProfile.patientInfo.allergies.map((allergy, i) => (
                                        <div key={i} className="allergy-item"><AlertTriangle className="allergy-icon" size={16} /><span>{allergy}</span></div>
                                    ))
                                ) : <p>No allergies listed.</p>}
                            </div>
                        </InfoCard>

                        {/* Insurance Card - No data in schema, so it shows a message */}
                        <InfoCard title="Insurance Information" icon={<Receipt />}>
                            <p>Insurance information is not available.</p>
                            <small>To enable this, add `insuranceInfo` to the User schema in the backend.</small>
                        </InfoCard>

                        {/* Appointments Card is static for now */}
                        <InfoCard title="Upcoming Appointments" icon={<Calendar />} button={<button className="btn btn-primary"><Plus size={16}/> Book New</button>}>
                            <p>No upcoming appointments.</p>
                        </InfoCard>
                    </div>
                </div>
            </main>

            <footer className="footer">{/* Your Footer JSX */}</footer>

            {/* --- MODALS --- */}
            <Modal show={modals.editProfile} handleClose={() => handleModal('editProfile', 'close')}>
                <form onSubmit={handleSaveProfile}>
                    <ModalHeader title="Edit Profile" />
                    <ModalBody>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-input" value={profileForm.firstName || ''} onChange={e => setProfileForm({...profileForm, firstName: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-input" value={profileForm.lastName || ''} onChange={e => setProfileForm({...profileForm, lastName: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input type="tel" className="form-input" value={profileForm.phone || ''} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                        </div>
                         <div className="form-group">
                            <label className="form-label">Street Address</label>
                            <input type="text" className="form-input" value={profileForm.address?.street || ''} onChange={e => setProfileForm({...profileForm, address: {...profileForm.address, street: e.target.value }})} />
                        </div>
                    </ModalBody>
                    <ModalFooter onCancel={() => handleModal('editProfile', 'close')} isSaving={isSaving} />
                </form>
            </Modal>

            <Modal show={modals.editMedical} handleClose={() => handleModal('editMedical', 'close')}>
                <form onSubmit={handleSaveMedical}>
                    <ModalHeader title="Edit Medical Information" />
                    <ModalBody>
                         <div className="form-group">
                            <label className="form-label">Blood Type</label>
                            <input type="text" className="form-input" value={medicalForm.bloodType || ''} onChange={e => setMedicalForm({...medicalForm, bloodType: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Allergies (comma-separated)</label>
                            <textarea className="form-textarea" value={medicalForm.allergies || ''} onChange={e => setMedicalForm({...medicalForm, allergies: e.target.value})}></textarea>
                        </div>
                    </ModalBody>
                    <ModalFooter onCancel={() => handleModal('editMedical', 'close')} isSaving={isSaving} />
                </form>
            </Modal>
        </>
    );
};

// Re-usable Sub-components
const InfoCard = ({ title, icon, onEdit, button, children }) => (
    <div className="profile-card">
        <div className="card-header">
            <h2 className="card-title">{icon} {title}</h2>
            {onEdit && <button className="btn btn-secondary" onClick={onEdit}><Edit size={16}/></button>}
            {button}
        </div>
        <div className="card-content">{children}</div>
    </div>
);
const InfoRow = ({ label, value }) => (
    <div className="info-row">
        <span className="info-label">{label}</span>
        <span className="info-value">{value || 'N/A'}</span>
    </div>
);
const Modal = ({ show, handleClose, children }) => {
    if (!show) return null;
    return <div className="modal show" onClick={handleClose}><div className="modal-content" onClick={e => e.stopPropagation()}>{children}</div></div>;
};
const ModalHeader = ({ title }) => <div className="modal-header"><h3>{title}</h3></div>;
const ModalBody = ({ children }) => <div className="modal-body">{children}</div>;
const ModalFooter = ({ onCancel, isSaving }) => (
    <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
    </div>
);

export default PatientProfile;