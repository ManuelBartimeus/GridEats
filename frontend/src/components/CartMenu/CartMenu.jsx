import React, { useContext } from 'react';
import './CartMenu.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const CartMenu = ({ onClose }) => {
  const { cartItems, addToCart, removeFromCart, food_list } = useContext(StoreContext);
  const navigate = useNavigate();

  // Calculate total items and total price
  const getTotalItems = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + (quantity > 0 ? quantity : 0), 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      if (quantity <= 0) return total;
      const item = food_list.find(food => food._id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const handlePlaceOrder = () => {
    onClose();
    navigate('/order');
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-menu" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-title">
            <img src={assets.basket_icon} alt="Cart" className="cart-icon" />
            <h3>Your Cart ({getTotalItems()} items)</h3>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-items">
          {Object.keys(cartItems).length === 0 || Object.values(cartItems).every(quantity => quantity === 0) ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p>Add some delicious items to get started!</p>
            </div>
          ) : (
            Object.entries(cartItems)
              .filter(([itemId, quantity]) => quantity > 0)
              .map(([itemId, quantity]) => {
              const item = food_list.find(food => food._id === itemId);
              if (!item) return null;

              return (
                <div key={itemId} className="cart-item">
                  <div className="item-info">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-price">₵{item.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn minus"
                        onClick={() => removeFromCart(itemId)}
                      >
                        -
                      </button>
                      <span className="quantity">{quantity}</span>
                      <button 
                        className="quantity-btn plus"
                        onClick={() => addToCart(itemId)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="item-total">
                      ₵{(item.price * quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {Object.keys(cartItems).length > 0 && Object.values(cartItems).some(quantity => quantity > 0) && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total: ₵{getTotalPrice().toFixed(2)}</span>
            </div>
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartMenu;
