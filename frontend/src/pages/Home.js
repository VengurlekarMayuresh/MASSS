import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Assuming you have this context for user auth
import "./home.css";

const Home = () => {
  // --- State Management ---
  // Determines if a user is logged in. Replace with your actual auth logic.
  const { currentUser } = useAuth() || {}; // Fallback for when context is not present
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);

  useEffect(() => {
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);


  // --- Data for Hero Options ---
  // Options shown to users who are not logged in
  const beforeLoginOptions = [
    {
      icon: '<i class="fas fa-user-circle"></i>',
      title: "Log in or create an account",
      desc: "Access your information anytime, anywhere",
      button: "Log in/Create Account",
      action: "login",
      href: "/login", // Link to your login page
    },
    {
      icon: '<i class="fas fa-calendar-check"></i>',
      title: "Book Appointment",
      desc: "Schedule or manage your appointments",
      button: "Book Now",
      action: "appointment",
      href: "#appointment",
    },
    {
      icon: '<i class="fas fa-hospital-user"></i>',
      title: "Find care providers",
      desc: "Compare hospitals, nursing homes, & more",
      button: "Find Providers Near Me",
      action: "provider",
      href: "#provider",
    },
    {
      icon: '<i class="fas fa-seedling"></i>',
      title: "Healthy Living Secrets",
      desc: "Discover tips and articles for a healthier lifestyle.",
      button: "Explore Secrets",
      action: "secrets",
      href: "/healthy-living", // Link to your healthy living page
    },
  ];

  // Options shown to users who are logged in
  const afterLoginOptions = [
    {
      icon: '<i class="fas fa-calendar-check"></i>',
      title: "Book Appointment",
      desc: "Schedule or manage your appointments",
      button: "Book Now",
      action: "appointment",
      href: "#appointment",
    },
    {
      icon: '<i class="fas fa-file-medical-alt"></i>',
      title: "Find health & drug plans",
      desc: "Find & compare plans in your area",
      button: "Find Plans Now",
      action: "plans",
      href: "#plans",
    },
    {
      icon: '<i class="fas fa-hospital-user"></i>',
      title: "Find care providers",
      desc: "Compare hospitals, nursing homes, & more",
      button: "Find Providers Near Me",
      action: "provider",
      href: "#provider",
    },
    {
      icon: '<i class="fas fa-seedling"></i>',
      title: "Healthy Living Secrets",
      desc: "Discover tips and articles for a healthier lifestyle.",
      button: "Explore Secrets",
      action: "secrets",
      href: "/healthy-living", // Link to your healthy living page
    },
  ];

  // Select which set of options to display
  const options = isLoggedIn ? afterLoginOptions : beforeLoginOptions;

  // --- Event Handlers ---
  // const handleOptionClick = (e, action) => {
  //   // For the login button, let the default link behavior happen
  //   if (action === "login") return;

  //   // For all other buttons, prevent default and show an alert
  //   e.preventDefault();
  //   alert(
  //     `${
  //       action.charAt(0).toUpperCase() + action.slice(1)
  //     } feature coming soon!`
  //   );
  // };

  // --- Render Method ---
  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-container">
          <div className="hero-top-content">
            <div className="hero-left">
              <h1>Welcome to MASSS HealthCare</h1>
              <p className="hero-subtitle">
                Your trusted partner in health and wellness. Get expert medical
                advice, book appointments, and access quality healthcare services.
              </p>
              <a href="#features" className="hero-cta">
                Explore Our Services
              </a>
            </div>
            <div className="hero-right">
              <div className="hero-image-container"></div>
            </div>
          </div>
          <div className="hero-options">
            {options.map((option, i) => (
              <a
                key={i}
                href={option.href}
                className="hero-option"
                data-action={option.action}
              >
                <div
                  className="option-icon"
                  dangerouslySetInnerHTML={{ __html: option.icon }}
                ></div>
                <div className="option-title">{option.title}</div>
                <div className="option-desc">{option.desc}</div>
                <button className="option-button">{option.button}</button>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="features-container">
          <h2>Why Choose Our Healthcare Platform</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-doctor"></i>
              </div>
              <h3>Expert Doctors</h3>
              <p>
                Connect with certified healthcare professionals and specialists
                who provide personalized care tailored to your needs.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>24/7 Digital Care</h3>
              <p>
                Access healthcare services anytime, anywhere with our digital
                platform and AI-powered health assistant.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3>Comprehensive Services</h3>
              <p>
                From routine checkups to specialized treatments, we offer a full
                range of medical services under one roof.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
