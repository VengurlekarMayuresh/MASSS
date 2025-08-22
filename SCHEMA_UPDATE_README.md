# MASSS React - Schema and Profile Updates

## Overview

This update implements separate schemas for patient and doctor roles, with fully functional and editable profile pages that match the exact HTML structure from the MASSS project.

## Changes Made

### 1. Backend Schema Updates

#### User Model (`backend/models/User.js`)
- **Enhanced Patient Schema**: Added comprehensive patient-specific fields including medical information, allergies, medications, and insurance details
- **Enhanced Doctor Schema**: Added doctor-specific fields including clinical expertise, patient experience, insurance billing, and practice information
- **Role-based Data Storage**: Data is now properly segregated based on user role

#### Key Schema Fields

**Patient Information:**
```javascript
patientInfo: {
  bloodType: String,
  allergies: [String],
  medications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    coverageType: String,
    effectiveDate: Date,
    expirationDate: Date
  }
}
```

**Doctor Information:**
```javascript
doctorInfo: {
  specialization: String,
  qualifications: [String],
  experience: Number,
  licenseNumber: String,
  clinicalExpertise: {
    areasOfFocus: [String],
    procedures: [String],
    treatmentPhilosophy: String,
    researchInterests: String
  },
  patientExperience: {
    avgWaitTime: String,
    bedsideManner: Number,
    newPatientAcceptance: Boolean
  },
  insuranceBilling: {
    governmentSchemes: [String],
    privateInsurance: [String],
    paymentOptions: String
  },
  practiceInfo: {
    primaryLocation: Object,
    officeHours: Object,
    emergencyContact: String
  }
}
```

### 2. Frontend Profile Pages

#### Patient Profile (`frontend/src/pages/PatientProfile.js`)
- **Exact HTML Match**: Completely matches the MASSS patient profile HTML structure
- **Editable Sections**: Personal information, medical information, and insurance information
- **Responsive Design**: Mobile-friendly with proper CSS classes
- **CSS Naming Convention**: All classes use `patient-` prefix

#### Doctor Profile (`frontend/src/pages/DoctorProfile.js`)
- **Exact HTML Match**: Completely matches the MASSS doctor profile HTML structure
- **Tabbed Interface**: Overview, Background, Practice Info, Appointments, Patients, FAQs
- **Editable Sections**: Clinical expertise, patient experience, insurance billing, practice info
- **CSS Naming Convention**: All classes use `doctor-` prefix

### 3. CSS Files

#### PatientProfile.css
- All classes prefixed with `patient-`
- Responsive design for mobile and desktop
- Matches MASSS design exactly

#### DoctorProfile.css
- All classes prefixed with `doctor-`
- Professional medical interface design
- Responsive design for all screen sizes

### 4. Backend Routes

#### User Registration (`POST /api/users/register`)
- **Role-based Registration**: Automatically creates appropriate schema based on role
- **Default Values**: Doctors get pre-populated with default professional information
- **Data Validation**: Ensures required fields are provided

#### Profile Updates (`PUT /api/users/profile`)
- **Role-specific Updates**: Updates only relevant fields based on user role
- **Data Integrity**: Maintains schema structure during updates

## Usage Instructions

### 1. Testing the Backend

Run the schema test script to verify everything works:

```bash
cd backend
node test-schemas.js
```

This will:
- Create test patient and doctor accounts
- Verify data storage and retrieval
- Clean up test data

### 2. Frontend Development

#### Patient Profile
- Navigate to `/patient-profile` route
- Edit personal information, medical details, and insurance
- All changes are saved to the backend

#### Doctor Profile
- Navigate to `/doctor-profile` route
- Use tabbed interface to navigate different sections
- Edit clinical expertise, patient experience, and practice information
- All changes are saved to the backend

### 3. Registration

#### Patient Registration
```javascript
{
  "email": "patient@example.com",
  "password": "password123",
  "role": "patient",
  "firstName": "John",
  "lastName": "Doe",
  "bloodType": "O+",
  "allergies": "Penicillin, Dust",
  "medications": [
    {
      "name": "Vitamin D",
      "dosage": "1000 IU",
      "frequency": "Once daily"
    }
  ]
}
```

#### Doctor Registration
```javascript
{
  "email": "doctor@example.com",
  "password": "password123",
  "role": "doctor",
  "firstName": "Dr. Jane",
  "lastName": "Smith",
  "specialization": "Cardiology",
  "qualifications": "MBBS, MD Cardiology",
  "experience": 10,
  "licenseNumber": "DOC-12345"
}
```

## Technical Details

### Database Indexes
- Email uniqueness enforced
- Role-based queries optimized
- Area-based search for location services

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control

### API Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/doctors` - List all doctors
- `GET /api/users/doctors/:id` - Get specific doctor

## File Structure

```
masss-react/
├── backend/
│   ├── models/
│   │   └── User.js (Updated schema)
│   ├── routes/
│   │   └── userRoutes.js (Updated routes)
│   └── test-schemas.js (New test file)
├── frontend/
│   └── src/
│       └── pages/
│           ├── PatientProfile.js (Updated)
│           ├── PatientProfile.css (Updated)
│           ├── DoctorProfile.js (Updated)
│           └── DoctorProfile.css (New)
└── SCHEMA_UPDATE_README.md (This file)
```

## Future Enhancements

1. **File Upload**: Profile picture and document uploads
2. **Appointment System**: Integration with profile data
3. **Search and Filter**: Advanced doctor/patient search
4. **Notifications**: Real-time updates and alerts
5. **Analytics**: Usage statistics and insights

## Troubleshooting

### Common Issues

1. **Schema Validation Errors**: Ensure all required fields are provided during registration
2. **CSS Not Loading**: Check that CSS files are properly imported
3. **Data Not Saving**: Verify backend connection and authentication
4. **Role-based Access**: Ensure users can only edit their own profiles

### Debug Mode

Enable debug logging in the backend:
```javascript
// In server.js
process.env.DEBUG = 'masss:*';
```

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify database connection
3. Test individual API endpoints
4. Review schema validation rules

---

**Note**: This update maintains backward compatibility while adding new functionality. Existing users will continue to work, and new users will benefit from the enhanced schema structure.
