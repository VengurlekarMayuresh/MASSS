const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Provider = require('../models/Provider');
const { auth, doctorOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      provider,
      doctor,
      appointmentType,
      scheduledDate,
      scheduledTime,
      duration,
      symptoms,
      notes,
      followUpReason,
      previousAppointment
    } = req.body;

    // Check if provider exists (optional)
    let providerExists = null;
    if (provider) {
      providerExists = await Provider.findById(provider);
      if (!providerExists) {
        return res.status(404).json({ success: false, message: 'Provider not found' });
      }
    }

    // Check if doctor exists (if specified)
    if (doctor) {
      const doctorExists = await User.findOne({ _id: doctor, role: 'doctor' });
      if (!doctorExists) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }
    }

    // Check for conflicting appointments (doctor or patient at same time)
    const conflictQuery = {
      $or: [
        { doctor, scheduledDate, scheduledTime },
        { patient: req.user.id, scheduledDate, scheduledTime }
      ],
      status: { $in: ['scheduled', 'confirmed'] }
    };
    const conflictingAppointment = await Appointment.findOne(conflictQuery);

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    const appointment = new Appointment({
      patient: req.user.id,
      provider: provider || undefined,
      doctor,
      appointmentType,
      scheduledDate,
      scheduledTime,
      duration: duration || 30,
      symptoms,
      notes,
      followUpReason,
      previousAppointment,
      consultationFee: providerExists?.consultationFee || 0
    });

    await appointment.save();

    // Populate the appointment with related data
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'profile.firstName profile.lastName email')
      .populate('provider', 'name type address contact')
      .populate('doctor', 'profile.firstName profile.lastName doctorInfo.specialization');

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment: populatedAppointment
    });

  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating appointment'
    });
  }
});

// @route   GET /api/appointments
// @desc    Get user appointments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user.id;
    }
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'profile.firstName profile.lastName profile.phone email')
      .populate('provider', 'name type address contact')
      .populate('doctor', 'profile.firstName profile.lastName doctorInfo.specialization')
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Appointments fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching appointments'
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'profile.firstName profile.lastName profile.phone email')
      .populate('provider', 'name type address contact')
      .populate('doctor', 'profile.firstName profile.lastName doctorInfo.specialization');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    const hasAccess = 
      appointment.patient._id.toString() === req.user.id ||
      (appointment.doctor && appointment.doctor._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error('Appointment fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching appointment'
    });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has permission to update this appointment
    const hasPermission = 
      appointment.patient.toString() === req.user.id ||
      (appointment.doctor && appointment.doctor.toString() === req.user.id);

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    appointment.status = status;

    // Handle cancellation
    if (status === 'cancelled') {
      appointment.cancellation = {
        cancelledBy: req.user.role,
        cancelledAt: new Date(),
        reason: cancellationReason
      };
    }

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Appointment update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating appointment'
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment details (for doctors)
// @access  Private (Doctor only)
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      diagnosis,
      prescription,
      recommendations,
      nextAppointment
    } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Only doctors can update appointment details
    if (req.user.role !== 'doctor' || appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (diagnosis) appointment.diagnosis = diagnosis;
    if (prescription) appointment.prescription = prescription;
    if (recommendations) appointment.recommendations = recommendations;
    if (nextAppointment) appointment.nextAppointment = nextAppointment;

    // If appointment is being completed, update status
    if (diagnosis || prescription) {
      appointment.status = 'completed';
    }

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Appointment update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating appointment'
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has permission to delete this appointment
    const hasPermission = 
      appointment.patient.toString() === req.user.id ||
      (appointment.doctor && appointment.doctor.toString() === req.user.id);

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only allow deletion of scheduled appointments
    if (appointment.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete appointment that is not scheduled'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Appointment deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting appointment'
    });
  }
});

// @route   GET /api/appointments/available-slots
// @desc    Get available slots for a doctor
// @access  Public
router.get('/available-slots', async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required'
      });
    }

    // Get doctor's available slots
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get booked appointments for the date
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      scheduledDate: new Date(date),
      status: { $in: ['scheduled', 'confirmed'] }
    }).select('scheduledTime duration');

    // Calculate available slots based on doctor's schedule
    const dayOfWeek = new Date(date)
      .toLocaleString('en-US', { weekday: 'long' })
      .toLowerCase();
    const doctorSchedule = doctor.doctorInfo.availableSlots || [];
    
    const availableSlots = [];
    
    // Generate time slots for the day
    const daySchedule = doctorSchedule.find(slot => slot.day === dayOfWeek);
    
    if (daySchedule) {
      const startTime = daySchedule.startTime;
      const endTime = daySchedule.endTime;
      
      // Generate slots every 30 minutes
      let currentTime = startTime;
      while (currentTime < endTime) {
        // Check if slot is not booked
        const isBooked = bookedAppointments.some(appointment => 
          appointment.scheduledTime === currentTime
        );
        
        if (!isBooked) {
          availableSlots.push(currentTime);
        }
        
        // Increment by 30 minutes
        const [hours, minutes] = currentTime.split(':');
        const nextMinutes = parseInt(minutes) + 30;
        if (nextMinutes >= 60) {
          currentTime = `${String(parseInt(hours) + 1).padStart(2, '0')}:${String(nextMinutes - 60).padStart(2, '0')}`;
        } else {
          currentTime = `${hours}:${String(nextMinutes).padStart(2, '0')}`;
        }
      }
    }

    res.json({
      success: true,
      availableSlots,
      doctorName: `${doctor.profile.firstName} ${doctor.profile.lastName}`
    });

  } catch (error) {
    console.error('Available slots fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching available slots'
    });
  }
});

module.exports = router;
