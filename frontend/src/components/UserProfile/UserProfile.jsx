import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { assets } from '../../assets/assets';

const UserProfile = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.user-profile')) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (!userData) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="profile-trigger" onClick={handleProfileClick}>
        <img src={assets.profile_icon} alt="Profile" className="profile-icon" />
        <span className="user-name">{userData.name}</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <img src={assets.profile_icon} alt="Profile" className="dropdown-profile-icon" />
            <div className="user-info">
              <div className="user-name-dropdown">{userData.name}</div>
              <div className="user-type">{userData.userType}</div>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <div className="dropdown-item" onClick={handleLogout}>
            <img src={assets.logout_icon} alt="Logout" className="logout-icon" />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
