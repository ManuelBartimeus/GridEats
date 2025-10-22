import React, { useContext, useMemo, useState, useEffect } from 'react';
import './VendorDashboard.css';
import { StoreContext } from '../../context/StoreContext';
import { useLocation, useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
  const { vendorItems, toggleVendorItemStatus, deleteVendorItem, orders, markOrderReady } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState('menu');
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { addVendorItem, updateVendorItem } = useContext(StoreContext);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a,b) => a.ticket - b.ticket);
  }, [orders]);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  useEffect(() => {
    if (location.pathname.startsWith('/vendor/orders')) {
      setActiveTab('orders');
    } else {
      setActiveTab('menu');
    }
  }, [location.pathname]);

  return (
    <div className="vendor-dashboard">

      <div className="vd-hero">
        <div className="vd-hero-contents">
          <h2>Manage Your Restaurant</h2>
          <p>Take control of your menu, track incoming orders, and grow your business with our comprehensive vendor dashboard. Update your offerings, manage order status, and provide excellent service to your customers.</p>
          <div className="vd-hero-actions">
            <button className="primary" onClick={()=>navigate('/vendor')}>Manage Menu</button>
            <button className="secondary" onClick={()=>navigate('/vendor/orders')}>View Orders</button>
          </div>
        </div>
      </div>

      {activeTab === 'menu' && (
        <div className="vd-section">
          <div className="vd-section-head">
            <div>
              <h2>Menu Items</h2>
              <p className="vd-sub">Manage your food offerings.</p>
            </div>
          </div>

          <div className="vd-grid">
            {vendorItems.map(item => (
              <div key={item.id} className="food-card">
                <div className="food-image" style={{backgroundImage:`url(${item.image || ''})`}}></div>
                <div className="food-content">
                  <div className="food-header">
                    <h3>{item.name}</h3>
                    <span className={`badge ${item.status==='Available'?'available':'unavailable'}`}>{item.status}</span>
                  </div>
                  <p className="food-desc">{item.description}</p>
                  <div className="food-meta">
                    <span className="price">₵{Number(item.price || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="food-actions">
                  <button className="btn" onClick={()=>toggleVendorItemStatus(item.id)}>Toggle Status</button>
                  <button className="btn" onClick={()=>openEditModal(item)}>Edit</button>
                  <button className="btn danger" onClick={()=>deleteVendorItem(item.id)}>Delete</button>
                </div>
              </div>
            ))}
            <div className="add-food-card" onClick={openAddModal}>
              <div className="add-food-icon">+</div>
              <p>Add Food Item</p>
            </div>
            {vendorItems.length===0 && (
              <div className="empty">No items yet. Click the + button to create your first menu item.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="vd-section">
          <div className="vd-section-head">
            <div>
              <h2>Incoming Orders</h2>
              <p className="vd-sub">Serve customers First-Come, First-Served.</p>
            </div>
          </div>
          <div className="orders-list">
            {sortedOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-left">
                  <div className="ticket">#{order.ticket}</div>
                  <div className="order-info">
                    <div className="order-title">{order.itemName} x {order.quantity}</div>
                    <div className="order-sub">₵{Number(order.total || 0).toFixed(2)} • {order.status}</div>
                  </div>
                </div>
                <div className="order-actions">
                  <button className="btn" onClick={()=>markOrderReady(order.id)}>Mark Ready</button>
                </div>
              </div>
            ))}
            {sortedOrders.length===0 && <div className="empty">No orders yet.</div>}
          </div>
        </div>
      )}

      {isModalOpen && (
        <ItemModal onClose={closeModal} initialItem={editingItem} onSave={(data)=>{
          if (editingItem) {
            updateVendorItem(editingItem.id, data);
          } else {
            addVendorItem(data);
          }
          closeModal();
        }} />
      )}
    </div>
  );
};

const ItemModal = ({ onClose, onSave, initialItem }) => {
  const [form, setForm] = useState({
    name: initialItem?.name || '',
    description: initialItem?.description || '',
    price: initialItem?.price || '',
    image: initialItem?.image || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      image: form.image.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-head">
          <h3>{initialItem ? 'Edit Item' : 'Add Item'}</h3>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={submit} className="modal-form">
          <label>
            <span>Name *</span>
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            <span>Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>
          <label>
            <span>Price (₵) *</span>
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
          </label>
          <label>
            <span>Image URL</span>
            <input name="image" value={form.image} onChange={handleChange} />
          </label>
          <button type="submit" className="primary">{initialItem ? 'Save Changes' : 'Add Item'}</button>
        </form>
      </div>
    </div>
  );
};

export default VendorDashboard;




