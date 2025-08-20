import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Component & Page Imports ---
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import DoctorProfile from './pages/DoctorProfile';
import PatientProfile from './pages/PatientProfile';
import FindNear from './pages/FindNear';
import HealthyLiving from './pages/HealthyLiving';
import ProtectedRoute from './components/ProtectedRoute';

// --- Context & Styling ---
import { AuthProvider } from './context/AuthContext';
import './index.css'; // Import the single, global stylesheet

/**
 * The main application component.
 * It sets up the router, authentication provider, and overall page structure.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/find-near" element={<FindNear />} />
              <Route path="/healthy-living" element={<HealthyLiving />} />

              {/* --- Protected Routes (Require Login) --- */}
              <Route 
                path="/doctor-profile" 
                element={
                  <ProtectedRoute>
                    <DoctorProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient-profile" 
                element={
                  <ProtectedRoute>
                    <PatientProfile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
