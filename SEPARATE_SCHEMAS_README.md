# MASSS React - Separate Schemas Implementation

## Overview

This update implements completely separate schemas for patients and doctors based on the HTML components from the MASSS project. Each role now has its own dedicated model, routes, and API endpoints, ensuring proper data segregation and role-based functionality.

## 🆕 **Major Changes**

### 1. **Separate Database Models**

#### **Patient Model** (`backend/models/Patient.js`)
- **Complete patient-specific schema** based on HTML components
- **Personal Information**: Name, DOB, gender, blood type, contact details, address
- **Medical Information**: Allergies, current medications, medical history, emergency contacts
- **Insurance Information**: Provider, policy details, coverage information
- **Appointments**: Upcoming and past appointments
- **Medical Records**: Complete medical record management
- **Built-in methods**: Age calculation, appointment management, medical record handling

#### **Doctor Model** (`backend/models/Doctor.js`)
- **Complete doctor-specific schema** based on HTML components
- **Professional Background**: Education, certifications, experience, awards
- **Clinical Expertise**: Specialization, areas of focus, procedures, treatment philosophy
- **Practice Information**: Office locations, office hours, emergency contacts
- **Patient Experience**: Wait times, bedside manner ratings, patient acceptance
- **Insurance & Billing**: Government schemes, private insurance, payment options
- **Schedule Management**: Available slots, blocked dates, vacation management
- **Built-in methods**: Review management, schedule updates, patient management

### 2. **Separate API Routes**

#### **Patient Routes** (`/api/patients`)
- `POST /register` - Patient registration
- `POST /login` - Patient authentication
- `GET /profile` - Get patient profile
- `PUT /profile` - Update patient profile
- `POST /appointments` - Add appointments
- `GET /appointments` - Get appointments
- `POST /medical-records` - Add medical records
- `GET /medical-records` - Get medical records

#### **Doctor Routes** (`/api/doctors`)
- `POST /register` - Doctor registration
- `POST /login` - Doctor authentication
- `GET /profile` - Get doctor profile
- `PUT /profile` - Update doctor profile
- `GET /public` - Public doctor listings (for patient search)
- `GET /:id/public` - Public doctor profile
- `POST /schedule` - Update schedule
- `POST /reviews` - Add patient reviews

### 3. **Enhanced Frontend Components**

#### **Patient Profile** (`frontend/src/pages/PatientProfile.js`)
- **Complete HTML replication** matching MASSS patient profile
- **Editable sections**: Personal info, medical info, insurance info
- **Real-time updates** with backend integration
- **Responsive design** with proper CSS classes
- **Form validation** and error handling

#### **Doctor Profile** (`frontend/src/pages/DoctorProfile.js`)
- **Complete HTML replication** matching MASSS doctor profile
- **Tabbed interface**: Overview, Background, Practice Info, Appointments, Patients
- **Editable sections**: Clinical expertise, patient experience, practice info
- **Real-time updates** with backend integration
- **Professional medical interface** design

### 4. **Updated Authentication System**

#### **AuthContext** (`frontend/src/context/AuthContext.js`)
- **Role-based registration** using separate endpoints
- **Automatic role detection** during login
- **Role-specific profile updates**
- **Proper redirects** based on user role

#### **Login Component** (`frontend/src/pages/Login.js`)
- **Role-specific fields** during registration
- **Enhanced validation** for role-specific data
- **Proper redirects** after registration/login
- **Improved user experience** with step-by-step forms

## 🏗️ **Technical Architecture**

### **Database Schema Design**
```
Patient Collection:
├── Basic Auth (email, password, role)
├── Personal Info (name, DOB, gender, blood type, contact, address)
├── Medical Info (allergies, medications, medical history, emergency contacts)
├── Insurance Info (provider, policy, coverage, dates)
├── Appointments (upcoming, past)
├── Medical Records (titles, dates, doctors, summaries)
└── Preferences & Settings

Doctor Collection:
├── Basic Auth (email, password, role)
├── Profile (name, DOB, gender, contact)
├── Professional Background (education, certifications, experience, awards)
├── Clinical Expertise (specialization, focus areas, procedures, philosophy)
├── Practice Info (locations, hours, emergency contacts)
├── Patient Experience (wait times, ratings, acceptance)
├── Insurance & Billing (schemes, insurance, payment options)
├── Schedule (available slots, blocked dates, vacations)
├── Patient Management (current patients, notes)
└── Reviews & Ratings
```

### **API Endpoint Structure**
```
/api/patients/* - All patient operations
/api/doctors/* - All doctor operations
/api/users/* - Legacy user operations (maintained for compatibility)
```

### **Frontend-Backend Integration**
- **Real-time data sync** between frontend and backend
- **Role-based access control** for all operations
- **Proper error handling** and user feedback
- **Form validation** on both client and server sides

## 🚀 **Getting Started**

### **1. Backend Setup**
```bash
cd backend
npm install
# Start MongoDB service
npm start
```

### **2. Test New Schemas**
```bash
cd backend
node test-new-schemas.js
```

### **3. Frontend Setup**
```bash
cd frontend
npm install
npm start
```

## 📱 **Usage Examples**

### **Patient Registration**
```javascript
const patientData = {
  email: 'patient@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+91 98765 43210',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  bloodType: 'O+',
  allergies: 'Penicillin, Dust',
  address: '123 Main St, Mumbai, Maharashtra - 400001'
};

const response = await fetch('/api/patients/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(patientData)
});
```

### **Doctor Registration**
```javascript
const doctorData = {
  email: 'doctor@example.com',
  password: 'password123',
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+91 98765 43211',
  specialization: 'Cardiology',
  qualifications: 'MBBS, MD Cardiology',
  experience: 10,
  licenseNumber: 'DOC-12345'
};

const response = await fetch('/api/doctors/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(doctorData)
});
```

### **Profile Updates**
```javascript
// Update patient medical info
const updateData = {
  medicalInfo: {
    allergies: ['Penicillin', 'Dust', 'Shellfish'],
    currentMedications: [
      { name: 'Vitamin D', dosage: '1000 IU', frequency: 'Daily' }
    ]
  }
};

const response = await fetch('/api/patients/profile', {
  method: 'PUT',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(updateData)
});
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/masss-healthcare
JWT_SECRET=your_jwt_secret_here
PORT=5002

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5002/api
```

### **Database Indexes**
- **Patient indexes**: Email, area, city, allergies, appointments
- **Doctor indexes**: Email, specialization, city, area, schedule

## 🧪 **Testing**

### **Backend Testing**
```bash
# Test new schemas
node test-new-schemas.js

# Test individual routes
curl -X POST http://localhost:5002/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

### **Frontend Testing**
- Navigate to `/login` for registration/login
- Test patient profile at `/patient-profile`
- Test doctor profile at `/doctor-profile`
- Verify all forms save data correctly
- Check responsive design on different screen sizes

## 🐛 **Troubleshooting**

### **Common Issues**

1. **MongoDB Connection Error**
   ```bash
   # Ensure MongoDB is running
   sudo systemctl start mongod
   # Check connection string in server.js
   ```

2. **Schema Validation Errors**
   - Check required fields in registration forms
   - Verify data types match schema definitions
   - Review console logs for specific validation errors

3. **Frontend-Backend Connection Issues**
   - Verify backend server is running on port 5002
   - Check CORS configuration in backend
   - Ensure API endpoints match frontend calls

4. **Role-based Access Issues**
   - Verify user role is set correctly during registration
   - Check JWT token contains proper role information
   - Ensure routes are protected with appropriate middleware

### **Debug Mode**
```javascript
// Enable debug logging in backend
process.env.DEBUG = 'masss:*';

// Check browser console for frontend errors
// Check terminal for backend logs
```

## 🔮 **Future Enhancements**

1. **File Upload System**
   - Profile picture uploads
   - Medical document attachments
   - Certificate and license document storage

2. **Advanced Search & Filtering**
   - Doctor search by specialization, location, availability
   - Patient search by medical conditions, insurance

3. **Real-time Features**
   - Live appointment updates
   - Instant messaging between patients and doctors
   - Push notifications for appointments and updates

4. **Analytics Dashboard**
   - Patient statistics for doctors
   - Appointment analytics
   - Revenue tracking for doctors

## 📚 **API Documentation**

### **Patient Endpoints**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/patients/register` | Register new patient | No |
| POST | `/api/patients/login` | Patient login | No |
| GET | `/api/patients/profile` | Get patient profile | Yes |
| PUT | `/api/patients/profile` | Update patient profile | Yes |
| POST | `/api/patients/appointments` | Add appointment | Yes |
| GET | `/api/patients/appointments` | Get appointments | Yes |

### **Doctor Endpoints**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/doctors/register` | Register new doctor | No |
| POST | `/api/doctors/login` | Doctor login | No |
| GET | `/api/doctors/profile` | Get doctor profile | Yes |
| PUT | `/api/doctors/profile` | Update doctor profile | Yes |
| GET | `/api/doctors/public` | Public doctor listings | No |
| GET | `/api/doctors/:id/public` | Public doctor profile | No |

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
1. Check the troubleshooting section above
2. Review console logs and error messages
3. Test individual API endpoints
4. Create an issue with detailed error information

---

**Note**: This implementation maintains backward compatibility while providing enhanced functionality through separate schemas. Existing users will continue to work, and new users will benefit from the improved role-based system.
