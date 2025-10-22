import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import VendorDashboard from './pages/VendorDashboard/VendorDashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const navigate = useNavigate();

  // Check localStorage on component mount
  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userData');
    
    if (savedLoginState === 'true' && userData) {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to handle successful login/signup
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.userType === 'vendor') {
      navigate('/vendor');
    } else {
      navigate('/');
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setCurrentPage('login');
    navigate('/');
  };

  // Function to switch between login and signup pages
  const handleSwitchToSignup = (e) => {
    e.preventDefault();
    setCurrentPage('signup');
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    setCurrentPage('login');
  };

  return (
    <>
      {!isLoggedIn ? (
        currentPage === 'login' ? (
          <LoginPage 
            onLoginSuccess={handleAuthSuccess}
            onSwitchToSignup={handleSwitchToSignup}
          />
        ) : (
          <SignupPage 
            onSignupSuccess={handleAuthSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )
      ) : (
        <div className="app">
          <Navbar onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/orders" element={<VendorDashboard />} />
          </Routes>
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
