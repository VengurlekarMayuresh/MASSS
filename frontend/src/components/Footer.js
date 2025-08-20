import React from 'react';
import './footer.css'; // Import the dedicated stylesheet for the footer

/**
 * The application's footer component.
 * It uses the imported CSS for a dark theme that matches the header.
 */
const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2025 MASSS HealthCare Portal. All rights reserved.</p>
      <p>Providing quality healthcare services with compassion and expertise.</p>
    </footer>
  );
};

export default Footer;
