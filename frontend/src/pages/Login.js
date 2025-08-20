import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    role: '',
    address: '',
    city: '',
    zipCode: '',
    password: '',
    confirmPassword: ''
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // UI states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const navigate = useNavigate();
  const { currentUser, login, register } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  // --- Handlers ---
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // --- Validation ---
  const validateStep1 = () => {
    const newErrors = {};
    const { name, email, phone, gender, dateOfBirth, role } = signUpData;
    if (!name.trim()) newErrors.name = 'Full Name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone Number is required.';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }
    if (!gender) newErrors.gender = 'Please select a gender.';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required.';
    if (!role) newErrors.role = 'Please select a role.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const { address, city, zipCode, password, confirmPassword } = signUpData;
    if (!address.trim()) newErrors.address = 'Address is required.';
    if (!city.trim()) newErrors.city = 'City is required.';
    if (!zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required.';
    } else if (!/^\d{6}$/.test(zipCode)) {
      newErrors.zipCode = 'Zip must be 6 digits.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/.test(password)) {
      newErrors.password = 'Password must be 8+ chars with letters, numbers & symbols.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignIn = () => {
    const newErrors = {};
    const { email, password } = signInData;
    if (!email.trim()) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Navigation between steps ---
  const handleNextStep = () => {
    if (validateStep1()) setCurrentStep(2);
  };
  const handlePrevStep = () => setCurrentStep(1);

  // --- Submit: Sign Up ---
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const result = await register(signUpData);

      if (result.success) {
        setMessage({ text: "✅ Account created! Redirecting...", type: "success" });
        // navigate immediately and also let the currentUser effect catch it
        setTimeout(() => {
          setMessage({ text: '', type: '' });
          navigate("/", { replace: true });
        }, 900);
      } else {
        setMessage({ text: result.message || "Registration failed", type: "error" });
      }
    } catch (err) {
      setMessage({ text: err.message || "Server error", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Submit: Sign In ---
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignIn()) return;

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    const result = await login(signInData.email, signInData.password);

    if (result.success) {
      setMessage({ text: "Welcome back! Redirecting...", type: "success" });
      setTimeout(() => navigate("/", { replace: true }), 600);
    } else {
      setMessage({ text: result.message || "Invalid credentials", type: "error" });
      setIsLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="login-body">
      <Link to="/" className="back-to-home">
        <i className="fas fa-arrow-left"></i> Back to Home
      </Link>

      <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
        {/* SIGN UP */}
        <div className="form-container sign-up-container">
          <form className="multi-step-form" onSubmit={handleSignUpSubmit}>
            <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
              <h3>Step 1: Personal Info</h3>
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input type="text" name="name" placeholder="Full Name" value={signUpData.name} onChange={handleSignUpChange} />
                {errors.name && <span>{errors.name}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input type="email" name="email" placeholder="Email" value={signUpData.email} onChange={handleSignUpChange} />
                {errors.email && <span>{errors.email}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-phone"></i>
                <input type="tel" name="phone" placeholder="Phone" value={signUpData.phone} onChange={handleSignUpChange} />
                {errors.phone && <span>{errors.phone}</span>}
              </div>
              <div className="input-group select-wrapper">
                <i className="fas fa-venus-mars"></i>
                <select name="gender" value={signUpData.gender} onChange={handleSignUpChange}>
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span>{errors.gender}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-calendar"></i>
                <input type="date" name="dateOfBirth" value={signUpData.dateOfBirth} onChange={handleSignUpChange} />
                {errors.dateOfBirth && <span>{errors.dateOfBirth}</span>}
              </div>
              <div className="input-group select-wrapper">
                <i className="fas fa-user-md"></i>
                <select name="role" value={signUpData.role} onChange={handleSignUpChange}>
                  <option value="">Register as...</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
                {errors.role && <span>{errors.role}</span>}
              </div>
              <div className="button-row">
                <button type="button" onClick={handleNextStep}>Next</button>
              </div>
            </div>

            <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
              <h3>Step 2: Address & Credentials</h3>
              <div className="input-group">
                <i className="fas fa-address-book"></i>
                <input type="text" name="address" placeholder="Address" value={signUpData.address} onChange={handleSignUpChange} />
                {errors.address && <span>{errors.address}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-map-marker"></i>
                <input type="text" name="city" placeholder="City" value={signUpData.city} onChange={handleSignUpChange} />
                {errors.city && <span>{errors.city}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-building"></i>
                <input type="text" name="zipCode" placeholder="Zip Code" value={signUpData.zipCode} onChange={handleSignUpChange} />
                {errors.zipCode && <span>{errors.zipCode}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={signUpData.password} onChange={handleSignUpChange} />
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
                {errors.password && <span>{errors.password}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
                />
                <i
                  className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></i>
                {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
              </div>
              <div className="button-row">
                <button type="button" onClick={handlePrevStep}>Back</button>
                <button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Submit"}</button>
              </div>
            </div>

            {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
          </form>
        </div>

        {/* SIGN IN */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignInSubmit}>
            <h1>Welcome Back</h1>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" name="email" placeholder="Email" value={signInData.email} onChange={handleSignInChange} />
              {errors.email && <span>{errors.email}</span>}
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={signInData.password} onChange={handleSignInChange} />
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
              {errors.password && <span>{errors.password}</span>}
            </div>
            <a href="#" className="form-link">Forgot password?</a>
            <button type="submit" disabled={isLoading}>{isLoading ? "Signing In..." : "Sign In"}</button>
            {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
            <a
              className="form-link mobile-toggle"
              onClick={() => {
                setIsSignUp(true);
                setMessage({ text: '', type: '' });
              }}
            >
              Don’t have an account? Sign Up
            </a>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Already have an account?</h1>
              <p>Login with your personal info</p>
              <button
                className="ghost"
                onClick={() => {
                  setIsSignUp(false);
                  setMessage({ text: '', type: '' });
                  setCurrentStep(1);
                }}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your details & start your journey</p>
              <button
                className="ghost"
                onClick={() => {
                  setIsSignUp(true);
                  setMessage({ text: '', type: '' });
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
