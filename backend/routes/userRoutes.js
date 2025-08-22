const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { uploadAvatar, handleUploadErrors } = require('../middleware/uploadSimple');

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      // Doctor-specific fields
      specialization,
      qualifications,
      experience,
      licenseNumber,
      // Patient-specific fields
      bloodType,
      allergies,
      medications,
      insuranceInfo
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user with role-specific data
    const userData = {
      email: email.toLowerCase(),
      password,
      role: role || 'patient',
      profile: {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        phone,
        address: address || {}
      }
    };

    // Add role-specific information
    if (role === 'doctor') {
      userData.doctorInfo = {
        specialization,
        qualifications: qualifications ? qualifications.split(',').map(q => q.trim()) : [],
        experience,
        licenseNumber,
        // Initialize with default values for new fields
        clinicalExpertise: {
          areasOfFocus: ['General Consultation', 'Preventive Medicine', 'Health Checkups'],
          procedures: ['Clinical Examination', 'Health Screening', 'Consultation'],
          treatmentPhilosophy: 'I believe in providing personalized, compassionate care to each patient.',
          researchInterests: 'Interested in preventive medicine and patient care quality improvement.'
        },
        patientExperience: {
          avgWaitTime: '15-20 minutes',
          bedsideManner: 95,
          newPatientAcceptance: true
        },
        insuranceBilling: {
          governmentSchemes: ['CGHS', 'ESI'],
          privateInsurance: ['Star Health', 'ICICI Lombard', 'HDFC Ergo'],
          paymentOptions: 'Cash, Card, UPI accepted'
        },
        practiceInfo: {
          primaryLocation: {
            name: 'Main Hospital',
            address: 'Mumbai - 400001',
            phone: '+91 22 1234 5678'
          },
          officeHours: {
            weekdays: '9:00 AM - 5:00 PM',
            saturday: '9:00 AM - 1:00 PM',
            sunday: 'Closed'
          },
          emergencyContact: 'Call hospital main number for emergencies'
        }
      };
    } else if (role === 'patient') {
      userData.patientInfo = {
        bloodType,
        allergies: allergies ? allergies.split(',').map(a => a.trim()) : [],
        medications: medications || [],
        insuranceInfo: insuranceInfo || {}
      };
    }

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '30d'
    });
    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({
      success: true,
      token,
      user: userObject
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user existence
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '30d'
    });
    const userObject = user.toObject();
    delete userObject.password;

    res.json({
      success: true,
      token,
      user: userObject
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile fields
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      patientInfo,
      doctorInfo,
      preferences
    } = req.body;

    if (firstName) user.profile.firstName = firstName;
    if (lastName) user.profile.lastName = lastName;
    if (phone) user.profile.phone = phone;
    if (dateOfBirth) user.profile.dateOfBirth = dateOfBirth;
    if (gender) user.profile.gender = gender;
    if (address) user.profile.address = { ...user.profile.address, ...address };

    // Update role-specific info
    if (patientInfo && user.role === 'patient') {
      user.patientInfo = { ...user.patientInfo, ...patientInfo };
    }

    if (doctorInfo && user.role === 'doctor') {
      user.doctorInfo = { ...user.doctorInfo, ...doctorInfo };
    }

    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userObject
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   POST /api/users/upload-avatar
// @desc    Upload user avatar
// @access  Private
router.post('/upload-avatar', auth, uploadAvatar, handleUploadErrors, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // For now, just return success - will implement file upload later
    res.json({
      success: true,
      message: 'Avatar upload endpoint ready (file upload coming soon)',
      profilePicture: user.profile.profilePicture || '/default-avatar.png'
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading avatar'
    });
  }
});

// @route   GET /api/users/doctors
// @desc    Get all doctors
// @access  Public
router.get('/doctors', async (req, res) => {
  try {
    const { page = 1, limit = 10, specialty, area } = req.query;
    
    let query = { role: 'doctor', isActive: true };
    
    if (specialty) {
      query['doctorInfo.specialization'] = new RegExp(specialty, 'i');
    }
    
    if (area) {
      query['profile.address.area'] = new RegExp(area, 'i');
    }

    const doctors = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      doctors,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Doctors fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctors'
    });
  }
});

// @route   GET /api/users/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await User.findOne({ 
      _id: req.params.id, 
      role: 'doctor', 
      isActive: true 
    }).select('-password');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor
    });

  } catch (error) {
    console.error('Doctor fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctor'
    });
  }
});

module.exports = router;
