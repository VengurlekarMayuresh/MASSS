import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './header.css'; // Import the new header stylesheet

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  const isLoggedIn = !!currentUser;
  const userType = userProfile?.role || '';

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img
            src="https://res.cloudinary.com/ds20dwlrs/image/upload/v1753886991/logo_M-Photoroom_p1rofe.png"
            alt="MASSS Logo"
            className="header-logo-img"
          />
          <span className="header-logo-text">MASSS</span>
        </Link>

        <nav className="header-nav">
          <div className="header-search">
            <input 
              type="text" 
              className="header-search-input" 
              placeholder="Search for doctors, services..." 
            />
            <button className="header-search-btn">
              <i className="fas fa-search " />
            </button>
          </div>

          <div className="nav-buttons">
            {/* <Link to="/healthy-living" className="nav-btn">
              <i className="fas fa-file-alt" /> Healthy Living
            </Link> */}

            {!isLoggedIn ? (
              <Link to="/login" className="nav-btn"><i className="fas fa-user" /> Login</Link>
            ) : (
              <div className="user-avatar" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                {userType === 'doctor' ? 'DR' : 'PT'}
                <div className={`dropdown ${showUserDropdown ? 'show' : ''}`}>
                  {userType === 'doctor' ? (
                    <>
                      <Link to="/doctor-profile" className="dropdown-item"><i className="fas fa-calendar" /> Appointments</Link>
                      <Link to="/doctor-profile" className="dropdown-item"><i className="fas fa-users" /> Patient List</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/patient-profile" className="dropdown-item"><i className="fas fa-user" /> My Profile</Link>
                      <Link to="/patient-profile" className="dropdown-item"><i className="fas fa-calendar" /> My Appointments</Link>
                      <Link to="/patient-profile" className="dropdown-item"><i className="fas fa-file-alt" /> Medical Records</Link>
                    </>
                  )}
                  <Link to="/" className="dropdown-item"><i className="fas fa-home" /> Back to Home</Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt" /> Logout</button>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="md-hidden">
          <button className={`hamburger ${showMobileMenu ? 'open' : ''}`} onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <span className="hamburger-top"></span>
            <span className="hamburger-middle"></span>
            <span className="hamburger-bottom"></span>
          </button>
        </div>
      </div>

      <div className={`search-dropdown ${showSearchDropdown ? '' : 'hidden'}`}>
        <div className="header-search">
          <input 
            type="text" 
            className="header-search-input" 
            placeholder="Search for doctors, services..." 
          />
          <button className="header-search-btn">
            <i className="fas fa-search" />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${showMobileMenu ? '' : 'hidden'}`}>
        <div className="mobile-search">
          <input 
            type="text" 
            className="mobile-search-input" 
            placeholder="Search for doctors, services..." 
          />
          <button className="mobile-search-btn">
            <i className="fas fa-search" />
          </button>
        </div>

        <div className="mobile-menu-nav">
          <div className="mobile-menu-buttons">
            {/* <Link to="/healthy-living" className="nav-btn"><i className="fas fa-file-alt" /> Healthy Living</Link> */}
            {!isLoggedIn ? (
              <Link to="/login" className="nav-btn"><i className="fas fa-user" /> Login</Link>
            ) : (
              <div className="user-avatar mx-auto" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                {userType === 'doctor' ? 'DR' : 'PT'}
                <div className={`dropdown ${showUserDropdown ? 'show' : ''}`}>
                  {userType === 'doctor' ? (
                    <>
                      <Link to="/doctor-profile" className="dropdown-item"><i className="fas fa-calendar" /> Appointments</Link>
                      <Link to="/doctor-profile" className="dropdown-item"><i className="fas fa-users" /> Patient List</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/patient-profile" className="dropdown-item"><i className="fas fa-user" /> My Profile</Link>
                      <Link to="/patient-profile" className="dropdown-item"><i className="fas fa-calendar" /> My Appointments</Link>
                      <Link to="/patient-profile" className="dropdown-item"><i className="fas fa-file-alt" /> Medical Records</Link>
                    </>
                  )}
                  <Link to="/" className="dropdown-item"><i className="fas fa-home" /> Back to Home</Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt" /> Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
