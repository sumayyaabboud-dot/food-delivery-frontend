import React, { useState } from 'react';
import axios from 'axios';

function RestaurantTable({ restaurantsList, fetchRestaurants }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '', address: '', phone: '', type: 'all' });

  const handleEditRestaurant = (restaurant) => {
    setIsEditing(true);
    setEditId(restaurant._id);
    setEditData({ name: restaurant.name, description: restaurant.description, address: restaurant.address, phone: restaurant.phone, type: restaurant.type });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5005/api/restaurants/${editId}`, editData)
      .then(() => {
        alert("Restaurant updated successfully! 🏢");
        setIsEditing(false);
        fetchRestaurants();
      }).catch(err => console.error(err));
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        const res = await axios.delete(`http://localhost:5005/api/restaurants/${id}`);
        if (res.data.success) { alert('Restaurant deleted successfully'); fetchRestaurants(); }
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div>
      {isEditing && (
        <form onSubmit={handleUpdate} style={{ marginBottom: '20px', padding: '15px', background: '#efebe9' }}>
          <h3>📝 Edit Restaurant</h3>
          <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} style={{ padding: '5px', marginRight: '5px' }} />
          <button type="submit" style={{ backgroundColor: '#2e7d32', color: 'white', padding: '5px 10px', cursor: 'pointer' }}>Save</button>
          <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: '5px' }}>Cancel</button>
        </form>
      )}

      <h3 style={{ color: '#000000', marginBottom: '15px', textAlign: 'center' }}><strong>📊 Managed Restaurants</strong></h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f57105', color: 'white' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Specialty</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Phone</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Address</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurantsList.length === 0 ? (
            <tr><td colSpan="5" style={{ padding: '15px', textAlign: 'center' }}>No restaurants found.</td></tr>
          ) : (
            restaurantsList.map((restaurant) => (
              <tr key={restaurant._id} style={{ backgroundColor: '#fff' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{restaurant.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{restaurant.type}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{restaurant.phone}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{restaurant.address}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <button onClick={() => handleEditRestaurant(restaurant)} style={{ padding: '5px 10px', backgroundColor: '#e49724', border: 'none', cursor: 'pointer', marginRight: '5px', fontWeight: 'bold' }}>Edit</button>
                  <button onClick={() => handleDeleteRestaurant(restaurant._id)} style={{ padding: '5px 10px', backgroundColor: '#ec5858', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RestaurantTable;