const express = require('express');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const { auth } = require('../middleware/auth');
const { uploadAvatar, handleUploadErrors } = require('../middleware/uploadSimple');

const router = express.Router();

// @route   POST /api/doctors/register
// @desc    Register new doctor
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
      specialization,
      qualifications,
      experience,
      licenseNumber,
      clinicalExpertise,
      practiceInfo,
      insuranceBilling
    } = req.body;

    // Check if doctor exists
    const existingDoctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email already exists'
      });
    }

    // Create new doctor
    const doctorData = {
      email: email.toLowerCase(),
      password,
      profile: {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        phone
      },
      clinicalExpertise: {
        specialization,
        areasOfFocus: clinicalExpertise?.areasOfFocus || [],
        procedures: clinicalExpertise?.procedures || [],
        treatmentPhilosophy: clinicalExpertise?.treatmentPhilosophy || '',
        researchInterests: clinicalExpertise?.researchInterests || '',
        languages: clinicalExpertise?.languages || ['English']
      },
      professionalBackground: {
        education: qualifications ? qualifications.split(',').map(q => ({
          degree: q.trim(),
          institution: 'To be updated',
          year: new Date().getFullYear()
        })) : [],
        yearsOfExperience: experience || 0
      },
      legalCompliance: {
        licenseInfo: [{
          type: 'Medical License',
          number: licenseNumber || 'To be updated',
          issuingAuthority: 'Medical Council',
          status: 'active'
        }]
      },
      practiceInfo: practiceInfo || {
        officeLocations: [{
          name: 'Main Office',
          address: 'To be updated',
          city: 'Mumbai',
          state: 'Maharashtra',
          isPrimary: true
        }],
        officeHours: [{
          location: 'Main Office',
          schedule: [
            { day: 'monday', openTime: '9:00 AM', closeTime: '5:00 PM' },
            { day: 'tuesday', openTime: '9:00 AM', closeTime: '5:00 PM' },
            { day: 'wednesday', openTime: '9:00 AM', closeTime: '5:00 PM' },
            { day: 'thursday', openTime: '9:00 AM', closeTime: '5:00 PM' },
            { day: 'friday', openTime: '9:00 AM', closeTime: '5:00 PM' },
            { day: 'saturday', openTime: '9:00 AM', closeTime: '2:00 PM' },
            { day: 'sunday', isClosed: true }
          ]
        }]
      },
      insuranceBilling: insuranceBilling || {
        governmentSchemes: ['CGHS', 'ESI'],
        privateInsurance: ['Star Health', 'ICICI Lombard'],
        paymentOptions: 'Cash, Card, UPI accepted'
      },
      patientExperience: {
        avgWaitTime: '20-30 minutes',
        bedsideManner: 90,
        newPatientAcceptance: true
      }
    };

    const doctor = new Doctor(doctorData);
    await doctor.save();

    // Generate JWT token
    const payload = {
      user: {
        id: doctor.id,
        role: 'doctor'
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '30d'
    });

    const doctorObject = doctor.getPublicProfile();

    res.status(201).json({
      success: true,
      token,
      user: doctorObject,
      message: 'Doctor registered successfully'
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during doctor registration'
    });
  }
});

// @route   POST /api/doctors/login
// @desc    Doctor login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for doctor existence
    const doctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    doctor.lastLogin = new Date();
    await doctor.save();

    // Generate JWT token
    const payload = {
      user: {
        id: doctor.id,
        role: 'doctor'
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '30d'
    });

    const doctorObject = doctor.getPublicProfile();

    res.json({
      success: true,
      token,
      user: doctorObject,
      message: 'Doctor logged in successfully'
    });

  } catch (error) {
    console.error('Doctor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during doctor login'
    });
  }
});

// @route   GET /api/doctors/profile
// @desc    Get doctor profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select('-password');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      user: doctor
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/doctors/profile
// @desc    Update doctor profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const {
      profile,
      clinicalExpertise,
      professionalBackground,
      legalCompliance,
      practiceInfo,
      insuranceBilling,
      patientExperience,
      schedule,
      preferences
    } = req.body;

    // Update profile information
    if (profile) {
      doctor.profile = { ...doctor.profile, ...profile };
    }

    // Update clinical expertise
    if (clinicalExpertise) {
      doctor.clinicalExpertise = { ...doctor.clinicalExpertise, ...clinicalExpertise };
    }

    // Update professional background
    if (professionalBackground) {
      doctor.professionalBackground = { ...doctor.professionalBackground, ...professionalBackground };
    }

    // Update legal compliance
    if (legalCompliance) {
      doctor.legalCompliance = { ...doctor.legalCompliance, ...legalCompliance };
    }

    // Update practice information
    if (practiceInfo) {
      doctor.practiceInfo = { ...doctor.practiceInfo, ...practiceInfo };
    }

    // Update insurance billing
    if (insuranceBilling) {
      doctor.insuranceBilling = { ...doctor.insuranceBilling, ...insuranceBilling };
    }

    // Update patient experience
    if (patientExperience) {
      doctor.patientExperience = { ...doctor.patientExperience, ...patientExperience };
    }

    // Update schedule
    if (schedule) {
      doctor.schedule = { ...doctor.schedule, ...schedule };
    }

    // Update preferences
    if (preferences) {
      doctor.preferences = { ...doctor.preferences, ...preferences };
    }

    await doctor.save();

    const doctorObject = doctor.getPublicProfile();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: doctorObject
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   GET /api/doctors/public
// @desc    Get public doctor profiles (for patient search)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const { specialization, city, area } = req.query;
    
    let query = { isActive: true };
    
    if (specialization) {
      query['clinicalExpertise.specialization'] = { $regex: specialization, $options: 'i' };
    }
    
    if (city) {
      query['practiceInfo.officeLocations.city'] = { $regex: city, $options: 'i' };
    }
    
    if (area) {
      query['practiceInfo.officeLocations.area'] = { $regex: area, $options: 'i' };
    }

    const doctors = await Doctor.find(query)
      .select('profile clinicalExpertise practiceInfo patientExperience reviews')
      .limit(20);

    res.json({
      success: true,
      doctors: doctors.map(doctor => ({
        id: doctor._id,
        name: doctor.fullName,
        specialization: doctor.clinicalExpertise.specialization,
        experience: doctor.professionalBackground.yearsOfExperience,
        locations: doctor.practiceInfo.officeLocations,
        rating: doctor.averageRating,
        totalReviews: doctor.reviews.length,
        avgWaitTime: doctor.patientExperience.avgWaitTime
      }))
    });

  } catch (error) {
    console.error('Public doctors fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctors'
    });
  }
});

// @route   GET /api/doctors/:id/public
// @desc    Get specific public doctor profile
// @access  Public
router.get('/:id/public', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('profile clinicalExpertise practiceInfo patientExperience reviews schedule')
      .populate('reviews.patientId', 'personalInfo.firstName personalInfo.lastName');

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor: {
        id: doctor._id,
        name: doctor.fullName,
        specialization: doctor.clinicalExpertise.specialization,
        areasOfFocus: doctor.clinicalExpertise.areasOfFocus,
        procedures: doctor.clinicalExpertise.procedures,
        experience: doctor.professionalBackground.yearsOfExperience,
        locations: doctor.practiceInfo.officeLocations,
        officeHours: doctor.practiceInfo.officeHours,
        rating: doctor.averageRating,
        totalReviews: doctor.reviews.length,
        avgWaitTime: doctor.patientExperience.avgWaitTime,
        schedule: doctor.schedule,
        reviews: doctor.reviews.slice(0, 5) // Limit to 5 recent reviews
      }
    });

  } catch (error) {
    console.error('Public doctor profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctor profile'
    });
  }
});

// @route   POST /api/doctors/schedule
// @desc    Update doctor schedule
// @access  Private
router.post('/schedule', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const scheduleData = req.body;
    await doctor.updateSchedule(scheduleData);

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      schedule: doctor.schedule
    });

  } catch (error) {
    console.error('Schedule update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating schedule'
    });
  }
});

// @route   POST /api/doctors/reviews
// @desc    Add patient review
// @access  Private
router.post('/reviews', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const reviewData = req.body;
    await doctor.addReview(reviewData);

    res.json({
      success: true,
      message: 'Review added successfully',
      reviews: doctor.reviews
    });

  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating review'
    });
  }
});

// @route   POST /api/doctors/upload-avatar
// @desc    Upload doctor avatar
// @access  Private
router.post('/upload-avatar', auth, uploadAvatar, handleUploadErrors, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // For now, just return success - will implement file upload later
    res.json({
      success: true,
      message: 'Avatar upload endpoint ready (file upload coming soon)',
      profilePicture: doctor.profile.profilePicture || '/default-avatar.png'
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
