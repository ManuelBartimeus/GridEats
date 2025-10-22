// LoginModal.jsx
import React, { useState } from 'react';
import './LoginModal.css';
import { Link } from 'react-router-dom';

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');

  const handleLogin = () => {
    // Add logic for handling login with email, password, and role here.
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Login</h2>

        {/* Email input */}
        <div className="modal-input">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="modal-input-field"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="modal-input-field"
          />
        </div>

        {/* Role selection buttons */}
        <div className="role-buttons">
          <button 
            className={role === 'buyer' ? 'active-role' : 'inactive-role'} 
            onClick={() => setRole('buyer')}
          >
            Login as Buyer
          </button>
         </div>
        <div className='role-buttons'>
          <button 
            className={role === 'vendor' ? 'active-role' : 'inactive-role'} 
            onClick={() => setRole('vendor')}
          >
            Login as Vendor
          </button>
        </div>

        {/* Create Account link */}
        <Link to="/create-account" className="create-account-link">Create an Account</Link>

        
      </div>
    </div>
  );
};

export default LoginModal;
