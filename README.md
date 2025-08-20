# MASSS Healthcare Portal

A full-stack healthcare provider search and management system for Mumbai, built with React frontend and Node.js backend.

## 🏗️ Project Structure

```
masss-react/
├── frontend/          # React application
│   ├── src/          # React source code
│   ├── public/       # Public assets
│   └── package.json  # Frontend dependencies
├── backend/           # Node.js/Express API
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── controllers/  # Business logic
│   └── server.js     # Main server file
└── README.md         # This file
```

## 🚀 Quick Start

### Frontend (React)
```bash
cd frontend
npm install
npm start
```
Frontend will run on: http://localhost:3000

### Backend (Node.js/Express)
```bash
cd backend
npm install
npm run dev
```
Backend will run on: http://localhost:5001

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- Lucide React (Icons)
- Custom CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Firebase Authentication
- Cloudinary (File Storage)

## 📱 Features

- Healthcare provider search in Mumbai
- User authentication (Patients/Doctors)
- Appointment booking system
- Provider reviews and ratings
- Health articles and tips
- Responsive design

## 🔧 Environment Setup

1. Create `.env` file in `backend/` directory
2. Configure MongoDB connection string
3. Set up Firebase credentials
4. Configure Cloudinary (optional)

## 📁 Directory Details

- **`frontend/`**: Complete React application with all components and pages
- **`backend/`**: Node.js API server with MongoDB models and Firebase integration
