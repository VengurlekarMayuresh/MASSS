import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Make sure this CSS file is in the same directory

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: For production, use environment variables to store your Firebase config.
const firebaseConfig = {
  apiKey: "AIzaSyBDqtCjaXf_2XUqebhS2K0CeVXEktUDHMQ",
  authDomain: "masss-6dbc3.firebaseapp.com",
  projectId: "masss-6dbc3",
  storageBucket: "masss-6dbc3.firebasestorage.app",
  messagingSenderId: "638199930794",
  appId: "1:638199930794:web:d469cafda02e6df44095d3",
  measurementId: "G-LT6JSJ2RWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data states
  const [signUpData, setSignUpData] = useState({
    signUpName: '',
    signUpEmail: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    role: '', // Added role field
    address: '',
    city: '',
    zipCode: '',
    signUpPassword: '',
    confirmPassword: ''
  });
  const [signInData, setSignInData] = useState({
    signInEmail: '',
    signInPassword: ''
  });

  // UI states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const navigate = useNavigate();

  // Handlers for input changes
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({ ...prev, [name]: value }));
    if(errors[name]) {
        setErrors(prev => ({...prev, [name]: null}));
    }
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData(prev => ({ ...prev, [name]: value }));
    if(errors[name]) {
        setErrors(prev => ({...prev, [name]: null}));
    }
  };

  // --- VALIDATION LOGIC ---
  const validateStep1 = () => {
    const newErrors = {};
    const { signUpName, signUpEmail, phone, gender, dateOfBirth, role } = signUpData;
    if (!signUpName.trim()) newErrors.signUpName = 'Full Name is required.';
    if (!signUpEmail.trim()) {
        newErrors.signUpEmail = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpEmail)) {
        newErrors.signUpEmail = 'Please enter a valid email address.';
    }
    if (!phone.trim()) {
        newErrors.phone = 'Phone Number is required.';
    } else if (!/^\d{10}$/.test(phone)) {
        newErrors.phone = 'Phone number must be 10 digits.';
    }
    if (!gender) newErrors.gender = 'Please select a gender.';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required.';
    if (!role) newErrors.role = 'Please select a role.'; // Added role validation
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const { address, city, zipCode, signUpPassword, confirmPassword } = signUpData;
    if (!address.trim()) newErrors.address = 'Address is required.';
    if (!city.trim()) newErrors.city = 'City is required.';
    if (!zipCode.trim()) {
        newErrors.zipCode = 'Zip code is required.';
    } else if (!/^\d{6}$/.test(zipCode)) {
        newErrors.zipCode = 'Zip code must be 6 digits.';
    }
    if (!signUpPassword) {
        newErrors.signUpPassword = 'Password is required.';
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]|\\:;"'<,>.?/~`]).{8,}$/.test(signUpPassword)) {
        newErrors.signUpPassword = 'Password must be at least 8 characters with letters, numbers, and symbols.';
    }
    if (signUpPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignIn = () => {
    const newErrors = {};
    const { signInEmail, signInPassword } = signInData;
    if (!signInEmail.trim()) {
        newErrors.signInEmail = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInEmail)) {
        newErrors.signInEmail = 'Please enter a valid email address.';
    }
    if (!signInPassword) newErrors.signInPassword = 'Password is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- FORM NAVIGATION ---
  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  // --- FIREBASE SUBMISSIONS ---
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpData.signUpEmail, signUpData.signUpPassword);
      const user = userCredential.user;

      await setDoc(doc(db, `users/${user.uid}`), {
        name: signUpData.signUpName,
        email: signUpData.signUpEmail,
        phone: signUpData.phone,
        gender: signUpData.gender,
        dob: signUpData.dateOfBirth,
        role: signUpData.role, // Saving role to Firestore
        address: signUpData.address,
        city: signUpData.city,
        zipCode: signUpData.zipCode,
        createdAt: new Date()
      });

      setMessage({ text: `Account created successfully! Please sign in.`, type: 'success' });
      setTimeout(() => {
        setIsSignUp(false);
        setCurrentStep(1);
        setMessage({ text: '', type: '' });
      }, 2000);

    } catch (error) {
      let friendlyMessage = "Failed to create account. Please try again.";
      if (error.code === 'auth/email-already-in-use') friendlyMessage = "This email address is already in use.";
      if (error.code === 'auth/weak-password') friendlyMessage = "Password is too weak.";
      setMessage({ text: friendlyMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const userCredential = await signInWithEmailAndPassword(auth, signInData.signInEmail, signInData.signInPassword);
      const user = userCredential.user;
      
      const docSnap = await getDoc(doc(db, `users/${user.uid}`));

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setMessage({ text: `Welcome back, ${userData.name}! Redirecting...`, type: 'success' });
        setTimeout(() => navigate('/'), 2000); 
      } else {
        throw new Error("User data not found.");
      }

    } catch (error) {
      setMessage({ text: "Invalid email or password. Please try again.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER METHOD ---
  return (
    <div className="login-body">
      <Link to="/" className="back-to-home">
        <i className="fas fa-arrow-left"></i>
        Back to Home
      </Link>

      <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
        {/* --- SIGN UP FORM --- */}
        <div className="form-container sign-up-container">
          <form id="signUpForm" className="multi-step-form" onSubmit={handleSignUpSubmit} noValidate>
            <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
              <h3>Step 1: Personal Information</h3>
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input type="text" name="signUpName" placeholder="Full Name" value={signUpData.signUpName} onChange={handleSignUpChange} required />
                {errors.signUpName && <span className="validation-message">{errors.signUpName}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input type="email" name="signUpEmail" placeholder="Email Address" value={signUpData.signUpEmail} onChange={handleSignUpChange} required />
                {errors.signUpEmail && <span className="validation-message">{errors.signUpEmail}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-phone"></i>
                <input type="tel" name="phone" placeholder="Phone Number" value={signUpData.phone} onChange={handleSignUpChange} required />
                {errors.phone && <span className="validation-message">{errors.phone}</span>}
              </div>
              <div className="input-group select-wrapper">
                <i className="fas fa-venus-mars"></i>
                <select name="gender" value={signUpData.gender} onChange={handleSignUpChange} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className="validation-message">{errors.gender}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-calendar"></i>
                <input type="date" name="dateOfBirth" value={signUpData.dateOfBirth} onChange={handleSignUpChange} required />
                {errors.dateOfBirth && <span className="validation-message">{errors.dateOfBirth}</span>}
              </div>
              {/* Added Role Selection */}
              <div className="input-group select-wrapper">
                  <i className="fas fa-user-md"></i>
                  <select name="role" value={signUpData.role} onChange={handleSignUpChange} required>
                      <option value="">Register as a...</option>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                  </select>
                  {errors.role && <span className="validation-message">{errors.role}</span>}
              </div>
              <div className="button-row">
                <button type="button" onClick={handleNextStep}>Next</button>
              </div>
            </div>

            <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
              <h3>Step 2: Address & Credentials</h3>
              <div className="input-group">
                <i className="fas fa-address-book"></i>
                <input type="text" name="address" placeholder="Full Address" value={signUpData.address} onChange={handleSignUpChange} required />
                {errors.address && <span className="validation-message">{errors.address}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-map-marker"></i>
                <input type="text" name="city" placeholder="City" value={signUpData.city} onChange={handleSignUpChange} required />
                {errors.city && <span className="validation-message">{errors.city}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-building"></i>
                <input type="text" name="zipCode" placeholder="Zip Code" value={signUpData.zipCode} onChange={handleSignUpChange} required />
                {errors.zipCode && <span className="validation-message">{errors.zipCode}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input type={showPassword ? "text" : "password"} name="signUpPassword" placeholder="Password" value={signUpData.signUpPassword} onChange={handleSignUpChange} required />
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`} onClick={() => setShowPassword(!showPassword)}></i>
                {errors.signUpPassword && <span className="validation-message">{errors.signUpPassword}</span>}
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={signUpData.confirmPassword} onChange={handleSignUpChange} required />
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                {errors.confirmPassword && <span className="validation-message">{errors.confirmPassword}</span>}
              </div>
              <div className="button-row">
                <button type="button" onClick={handlePrevStep}>Back</button>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Submit'}</button>
              </div>
            </div>
            <div className={`form-message ${message.type}`}>
                {isLoading && !message.text && <div className="loader"></div>}
                {message.text}
            </div>
          </form>
        </div>

        {/* --- SIGN IN FORM --- */}
        <div className="form-container sign-in-container">
          <form id="signInForm" onSubmit={handleSignInSubmit} noValidate>
            <h1>Welcome Back</h1>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" name="signInEmail" placeholder="Email Address" value={signInData.signInEmail} onChange={handleSignInChange} required />
              {errors.signInEmail && <span className="validation-message">{errors.signInEmail}</span>}
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type={showPassword ? "text" : "password"} name="signInPassword" placeholder="Password" value={signInData.signInPassword} onChange={handleSignInChange} required />
              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`} onClick={() => setShowPassword(!showPassword)}></i>
              {errors.signInPassword && <span className="validation-message">{errors.signInPassword}</span>}
            </div>
            <a href="#" className="form-link">Forgot your password?</a>
            <button type="submit" disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</button>
            <div className={`form-message ${message.type}`}>
                {isLoading && !message.text && <div className="loader"></div>}
                {message.text}
            </div>
            <a className="form-link mobile-toggle" onClick={() => { setIsSignUp(true); setMessage({text: '', type: ''}); }}>Don't have an account? Sign Up</a>
          </form>
        </div>

        {/* --- OVERLAY --- */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Already have an account?</h1>
              <p>Please login with your personal info to stay connected with us</p>
              <button className="ghost" onClick={() => { setIsSignUp(false); setMessage({text: '', type: ''}); setCurrentStep(1); }}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" onClick={() => { setIsSignUp(true); setMessage({text: '', type: ''}); }}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
