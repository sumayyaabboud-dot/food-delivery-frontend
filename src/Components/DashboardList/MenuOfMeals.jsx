import React, { useState } from 'react';
import axios from 'axios';

function MenuOfMeals({ meals, setMeals }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMealId, setEditMealId] = useState(null);
  const [editData, setEditData] = useState({ name: '', price: '', description: '' });

  const handleEditClick = (meal) => {
    setIsEditing(true);
    setEditMealId(meal._id);
    setEditData({ name: meal.name, price: meal.price, description: meal.description || '' });
  };

  const handleUpdateMeal = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5005/api/meals/${editMealId}`, editData)
      .then(response => {
        const updatedMeal = response.data?.meal || response.data?.data || response.data;
        setMeals(prev => prev.map(meal => meal._id === editMealId ? updatedMeal : meal));
        setIsEditing(false);
        alert('Meal updated successfully! 🔄');
      })
      .catch(err => console.error(err));
  };

  const handleDeleteMeal = (mealId) => {
    if (!window.confirm("Are you sure you want to delete this meal? 🗑️")) return;
    axios.delete(`http://localhost:5005/api/meals/${mealId}`)
      .then(() => {
        setMeals(prev => prev.filter(meal => meal._id !== mealId));
        alert("Meal deleted successfully! ❌");
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      {isEditing && (
        <form onSubmit={handleUpdateMeal} style={{ marginBottom: '30px', padding: '20px', background: '#e3f2fd', borderRadius: '5px' }}>
          <h3>📝 Edit Meal Details</h3>
          <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} placeholder="Name" style={{ marginRight: '10px', padding: '5px' }} />
          <input type="number" value={editData.price} onChange={(e) => setEditData({...editData, price: e.target.value})} placeholder="Price" style={{ marginRight: '10px', padding: '5px' }} />
          <input type="text" value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} placeholder="Description" style={{ marginRight: '10px', padding: '5px' }} />
          <button type="submit" style={{ backgroundColor: '#1e88e5', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer' }}>Update</button>
          <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: '5px', padding: '6px' }}>Cancel</button>
        </form>
      )}

      <h3 style={{ color: 'black' }}><strong>📋 Current Menu Items</strong> ({meals.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} border="1" cellPadding="10">
        <thead>
          <tr style={{ background: '#f59300', color: 'black' }}>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal._id} style={{ backgroundColor: '#fff' }}>
              <td><strong>{meal.name}</strong></td>
              <td><strong>${meal.price}</strong></td>
              <td>{meal.description}</td>
              <td>
                <button onClick={() => handleEditClick(meal)} style={{ background: '#f37a08', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDeleteMeal(meal._id)} style={{ background: '#f75a46', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MenuOfMeals;