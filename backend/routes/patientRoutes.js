const express = require('express');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const { auth } = require('../middleware/auth');
const { uploadAvatar, handleUploadErrors } = require('../middleware/uploadSimple');

const router = express.Router();

// @route   POST /api/patients/register
// @desc    Register new patient
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      bloodType,
      allergies,
      medications,
      insuranceInfo
    } = req.body;

    // Check if patient exists
    const existingPatient = await Patient.findOne({ email: email.toLowerCase() });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient with this email already exists'
      });
    }

    // Create new patient
    const patientData = {
      email: email.toLowerCase(),
      password,
      personalInfo: {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        phone,
        address: address || {},
        bloodType
      },
      medicalInfo: {
        allergies: allergies ? allergies.split(',').map(a => a.trim()) : [],
        currentMedications: medications || []
      },
      insuranceInfo: insuranceInfo || {}
    };

    const patient = new Patient(patientData);
    await patient.save();

    // Calculate age and update
    if (patient.personalInfo.dateOfBirth) {
      patient.personalInfo.age = patient.calculateAge();
      await patient.save();
    }

    // Generate JWT token
    const payload = {
      user: {
        id: patient.id,
        role: 'patient'
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '30d'
    });

    const patientObject = patient.getPublicProfile();

    res.status(201).json({
      success: true,
      token,
      user: patientObject,
      message: 'Patient registered successfully'
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during patient registration'
    });
  }
});

// @route   POST /api/patients/login
// @desc    Patient login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for patient existence
    const patient = await Patient.findOne({ email: email.toLowerCase() });
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    patient.lastLogin = new Date();
    await patient.save();

    // Generate JWT token
    const payload = {
      user: {
        id: patient.id,
        role: 'patient'
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '30d'
    });

    const patientObject = patient.getPublicProfile();

    res.json({
      success: true,
      token,
      user: patientObject,
      message: 'Patient logged in successfully'
    });

  } catch (error) {
    console.error('Patient login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during patient login'
    });
  }
});

// @route   GET /api/patients/profile
// @desc    Get patient profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select('-password');
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      user: patient
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/patients/profile
// @desc    Update patient profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const {
      personalInfo,
      medicalInfo,
      insuranceInfo,
      preferences
    } = req.body;

    // Update personal information
    if (personalInfo) {
      patient.personalInfo = { ...patient.personalInfo, ...personalInfo };
      // Recalculate age if date of birth changed
      if (personalInfo.dateOfBirth) {
        patient.personalInfo.age = patient.calculateAge();
      }
    }

    // Update medical information
    if (medicalInfo) {
      patient.medicalInfo = { ...patient.medicalInfo, ...medicalInfo };
    }

    // Update insurance information
    if (insuranceInfo) {
      patient.insuranceInfo = { ...patient.insuranceInfo, ...insuranceInfo };
    }

    // Update preferences
    if (preferences) {
      patient.preferences = { ...patient.preferences, ...preferences };
    }

    await patient.save();

    const patientObject = patient.getPublicProfile();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: patientObject
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   POST /api/patients/appointments
// @desc    Add new appointment
// @access  Private
router.post('/appointments', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const appointmentData = req.body;
    await patient.addAppointment(appointmentData);

    res.json({
      success: true,
      message: 'Appointment added successfully',
      appointments: patient.appointments
    });

  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating appointment'
    });
  }
});

// @route   GET /api/patients/appointments
// @desc    Get patient appointments
// @access  Private
router.get('/appointments', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select('appointments');
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      appointments: patient.appointments
    });

  } catch (error) {
    console.error('Appointments fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching appointments'
    });
  }
});

// @route   POST /api/patients/medical-records
// @desc    Add medical record
// @access  Private
router.post('/medical-records', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const recordData = req.body;
    await patient.addMedicalRecord(recordData);

    res.json({
      success: true,
      message: 'Medical record added successfully',
      medicalRecords: patient.medicalRecords
    });

  } catch (error) {
    console.error('Medical record creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating medical record'
    });
  }
});

// @route   GET /api/patients/medical-records
// @desc    Get patient medical records
// @access  Private
router.get('/medical-records', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select('medicalRecords');
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      medicalRecords: patient.medicalRecords
    });

  } catch (error) {
    console.error('Medical records fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching medical records'
    });
  }
});

// @route   POST /api/patients/upload-avatar
// @desc    Upload patient avatar
// @access  Private
router.post('/upload-avatar', auth, uploadAvatar, handleUploadErrors, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // For now, just return success - will implement file upload later
    res.json({
      success: true,
      message: 'Avatar upload endpoint ready (file upload coming soon)',
      profilePicture: patient.personalInfo.profilePicture || '/default-avatar.png'
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading avatar'
    });
  }
});

module.exports = router;
