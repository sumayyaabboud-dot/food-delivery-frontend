import React, { useState } from 'react';
import axios from 'axios';

function AddMeal({ setMeals }) {
  const [newMeal, setNewMeal] = useState({ name: '', price: '', description: '', image: '', category: '' });

  const handleSubmitMeal = async (e) => {
    e.preventDefault();
    if (!newMeal.name || !newMeal.price) return alert('Please add a name and price!');

    const mealToSubmit = { 
        ...newMeal, 
        restaurant_id: "65cb1a2b3c4d5e6f7a8b9c0d"
    };

    axios.post('http://localhost:5005/api/meals', mealToSubmit)
        .then(response => {
            alert('Meal Added SUCCESSFULLY ✅');
            
            const addedMeal = response.data?.meal || response.data?.data || response.data;
            if(addedMeal) setMeals(prev => [...prev, addedMeal]);
            setNewMeal({ name: '', price: '', description: '', image: '', category: '' }); 
        })
        .catch(err => {
            console.error(err);
            alert('Error connection');
        });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 style={{ color: '#d35400' }}><strong>➕ Add New Meal</strong></h3>
      <form onSubmit={handleSubmitMeal} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Meal Name</label>
          <input type="text" value={newMeal.name} onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} style={{ padding: '8px' }} />
          
          <label style={{ fontWeight: 'bold' }}>Category</label>
          <input type="text" value={newMeal.category || ''} onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })} style={{ padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Price</label>
          <input type="number" value={newMeal.price} onChange={(e) => setNewMeal({ ...newMeal, price: e.target.value })} style={{ padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Description</label>
          <textarea value={newMeal.description} onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })} style={{ padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Meal Image</label>
          <input type="file" accept="image/*" style={{ padding: '6px', border: '1px dashed #8b0f58', cursor: 'pointer' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => { setNewMeal({ ...newMeal, image: reader.result }); };
                reader.readAsDataURL(file);
              }
            }}
          />
          <span style={{ fontSize: '12px', color: '#666', textAlign: 'center', fontWeight: 'bold' }}>- OR -</span>
          <input type="text" placeholder="Paste image URL here..." value={newMeal.image && !newMeal.image.startsWith('data:') ? newMeal.image : ''} onChange={(e) => setNewMeal({ ...newMeal, image: e.target.value })} style={{ padding: '8px' }} />
        </div>

        <button type="submit" style={{ background: '#d35400', color: 'white', padding: '10px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>Save & Add Item</button>
      </form>
    </div>
  );
}

export default AddMeal;