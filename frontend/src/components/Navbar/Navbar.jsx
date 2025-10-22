// Navbar.jsx
import React, { useState, useContext } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import UserProfile from '../UserProfile/UserProfile';
import CartMenu from '../CartMenu/CartMenu';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ onLogout }) => {
  const [menu, setMenu] = useState("home");
  const { cartItems, isCartOpen, setIsCartOpen, isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useContext(StoreContext);
  const location = useLocation();
  const isVendorRoute = location.pathname.startsWith('/vendor');

  // Calculate total items in cart
  const getTotalItems = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className='navbar'>
      <img src={assets.logo} alt="Logo" className="logo" />
      {!isSearchOpen && !isVendorRoute && (
        <ul className="navbar-menu">
          <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
          <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
          <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
          <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</a>
        </ul>
      )}
      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search" onClick={toggleSearch} style={{cursor:'pointer'}} />
        {isSearchOpen && (
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        )}
        {!isVendorRoute && (
          <div className="navbar-search-icon" onClick={toggleCart}>
            <img src={assets.basket_icon} alt="Basket" />
            {getTotalItems() > 0 && <div className="dot">{getTotalItems()}</div>}
          </div>
        )}
        <UserProfile onLogout={onLogout} />
      </div>
      
      {!isVendorRoute && isCartOpen && <CartMenu onClose={() => setIsCartOpen(false)} />}
    </div>
  );
}

export default Navbar;