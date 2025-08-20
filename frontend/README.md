# MASSS Healthcare Portal - React Application

A comprehensive healthcare platform built with React, providing seamless access to medical services, appointment booking, and health information.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/signup with Firebase
- **Patient Dashboard**: Complete medical profile management
- **Doctor Dashboard**: Appointment scheduling and patient management
- **Provider Search**: Find healthcare providers by specialty and location
- **Health Articles**: Educational content and wellness tips
- **Appointment Booking**: Seamless scheduling system

### Patient Features
- Personal health profile management
- Medical records and history
- Appointment scheduling and tracking
- Insurance information management
- Allergy and medication tracking

### Doctor Features
- Professional profile management
- Appointment slot management
- Patient appointment list
- Clinical expertise documentation
- Patient reviews and ratings

## 🛠️ Tech Stack

- **Frontend**: React 18, JavaScript
- **Routing**: React Router DOM
- **Styling**: CSS3 with custom design system
- **Icons**: Lucide React
- **Authentication**: Firebase (to be integrated)
- **Backend**: Node.js + Express (to be implemented)
- **Database**: MongoDB (to be implemented)
- **File Storage**: Cloudinary (to be integrated)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation and search
│   └── Footer.js       # Site footer
├── pages/              # Main application pages
│   ├── Home.js         # Landing page
│   ├── Login.js        # Authentication
│   ├── PatientProfile.js # Patient dashboard
│   ├── DoctorProfile.js  # Doctor dashboard
│   ├── FindNear.js     # Provider search
│   └── HealthyLiving.js # Health articles
├── utils/              # Utility functions
├── App.js              # Main application component
├── App.css             # Global styles
└── components.css      # Component-specific styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd masss-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🎨 Design System

### Color Palette
- **Primary**: #146A5D (Healthcare Green)
- **Secondary**: #f8f9fa (Light Gray)
- **Accent**: #ffb900 (Warm Yellow)
- **Success**: #28a745 (Green)
- **Warning**: #ffc107 (Yellow)
- **Danger**: #dc3545 (Red)

### Typography
- **Font Family**: Poppins, system fonts
- **Headings**: Bold, healthcare-focused
- **Body Text**: Readable, accessible

### Components
- **Cards**: Elevated with subtle shadows
- **Buttons**: Rounded, with hover effects
- **Forms**: Clean, validation-focused
- **Navigation**: Sticky header with mobile support

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔐 Authentication (To be implemented)

### Firebase Integration
- Email/password authentication
- User role management (Patient/Doctor)
- Secure session handling

### User Types
- **Patients**: Access to personal health data
- **Doctors**: Professional dashboard access

## 🗄️ Database Schema (To be implemented)

### Collections
- **Users**: Patient and doctor profiles
- **Appointments**: Booking information
- **Medical Records**: Health documentation
- **Providers**: Healthcare facility data

## 📊 API Endpoints (To be implemented)

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### Appointments
- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/:id`

## 🚧 Future Enhancements

### Phase 2
- [ ] Backend API development
- [ ] MongoDB integration
- [ ] Firebase authentication
- [ ] Cloudinary file uploads
- [ ] Real-time notifications

### Phase 3
- [ ] Video consultations
- [ ] Prescription management
- [ ] Lab result integration
- [ ] Payment processing
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Frontend Development**: React Team
- **Backend Development**: Node.js Team
- **Design**: UI/UX Team
- **Testing**: QA Team

## 📞 Support

For support and questions:
- Email: support@masss-healthcare.com
- Documentation: [Wiki Link]
- Issues: [GitHub Issues]

---

**Note**: This is a React frontend application. Backend services, database, and third-party integrations are planned for future development phases.
