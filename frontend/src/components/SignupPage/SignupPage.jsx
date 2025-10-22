import React, { useState } from 'react';
import './SignupPage.css';
import logo from '../../assets/logo.png';

const SignupPage = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [userType, setUserType] = useState('buyer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessLocation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (userType === 'vendor' && !formData.businessLocation.trim()) {
      newErrors.businessLocation = 'Business location is required for vendors';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save user data to localStorage
      const userData = {
        name: formData.name,
        email: formData.email,
        userType,
        businessLocation: userType === 'vendor' ? formData.businessLocation : null,
        signupTime: new Date().toISOString()
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      onSignupSuccess();
    }
  };

  const handleGoogleSignup = () => {
    // Simulate Google signup
    const userData = {
      name: 'Google User',
      email: 'google.user@gmail.com',
      userType,
      businessLocation: userType === 'vendor' ? 'Google Headquarters' : null,
      signupTime: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    onSignupSuccess();
  };

  return (
    <div className="signup-page">
      <div className="signup-form-section">
        <div className="signup-form-container">
          <div className="logo-section">
            <img src={logo} alt="GridEats Logo" className="logo" />
            <p className="tagline">The fusion of taste and technology</p>
          </div>

          <div className="user-type-toggle">
            <button
              className={`toggle-btn ${userType === 'buyer' ? 'active' : ''}`}
              onClick={() => setUserType('buyer')}
            >
              Buyer
            </button>
            <button
              className={`toggle-btn ${userType === 'vendor' ? 'active' : ''}`}
              onClick={() => setUserType('vendor')}
            >
              Vendor
            </button>
          </div>

          <button className="google-signin-btn" onClick={handleGoogleSignup}>
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="separator">
            <span className="separator-text">OR</span>
          </div>

          <form onSubmit={handleSignup} className="signup-form">
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="input-group">
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '🙈'}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            {userType === 'vendor' && (
              <div className="input-group">
                <input
                  type="text"
                  name="businessLocation"
                  placeholder="Enter your business location"
                  value={formData.businessLocation}
                  onChange={handleInputChange}
                  className={errors.businessLocation ? 'error' : ''}
                />
                {errors.businessLocation && <span className="error-message">{errors.businessLocation}</span>}
              </div>
            )}

            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </form>

          <div className="login-link">
            <span>Already have an account? </span>
            <a href="#" className="login-link-text" onClick={onSwitchToLogin}>
              Sign In
            </a>
          </div>
        </div>
      </div>

      <div className="signup-background-section">
        <div className="food-background"></div>
      </div>
    </div>
  );
};

export default SignupPage;
