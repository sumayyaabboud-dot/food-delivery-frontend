import React, { useState } from 'react';
import axios from 'react';

function AddRestaurant({ fetchRestaurants }) {
  const [restaurantData, setRestaurantData] = useState({ name: '', description: '', address: '', phone: '', type: 'all' });

  const handleRestaurantInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData({ ...restaurantData, [name]: value });
  };

  const handleSubmitRestaurant = async (e) => {
    e.preventDefault();
    if (!restaurantData.name || !restaurantData.description || !restaurantData.address || !restaurantData.phone) {
      alert('Please fill in all fields');
      return;
    }

    const restaurantDataWithId = { ...restaurantData, owner_id: "65cb1a2b3c4d5e6f7a8b9c0d" };

    try {
      const response = await axios.post('http://localhost:5005/api/restaurants', restaurantDataWithId);
      if (response.data.success) {
        alert('Restaurant added successfully! 🎉');
        setRestaurantData({ name: '', description: '', address: '', phone: '', type: 'all' });
        fetchRestaurants(); // تحديث الجدول تلقائياً
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add restaurant.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#f14e1c', textAlign: 'center' }}>➕ Add New Restaurant</h2>
      <form onSubmit={handleSubmitRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Restaurant Name</label>
          <input type="text" name="name" value={restaurantData.name} onChange={handleRestaurantInputChange} style={{ padding: '10px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Description</label>
          <textarea name="description" value={restaurantData.description} onChange={handleRestaurantInputChange} rows="3" style={{ padding: '10px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Address</label>
          <input type="text" name="address" value={restaurantData.address} onChange={handleRestaurantInputChange} style={{ padding: '10px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Phone Number</label>
          <input type="text" name="phone" value={restaurantData.phone} onChange={handleRestaurantInputChange} style={{ padding: '10px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Specialty Type</label>
          <select name="type" value={restaurantData.type} onChange={handleRestaurantInputChange} style={{ padding: '10px', backgroundColor: 'white' }}>
            <option value="all">All / Generic</option>
            <option value="pizza">Pizza Only</option>
            <option value="burger">Burgers & Others</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '12px', backgroundColor: '#e2360b', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Save Restaurant</button>
      </form>
    </div>
  );
}

export default AddRestaurant;