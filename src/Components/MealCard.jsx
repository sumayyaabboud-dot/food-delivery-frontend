import React from 'react';

const MealCard = ({ meal, quantity, updateQuantity, handleRating, currentRating, hasCheckedOut }) => {
  return (
    <div className="meal-card" style={{
      /* التنسيقات الحالية للكرت الأصفر الخاص بكِ */
      backgroundColor: '#fcd68a', // اللون الظاهر في الصورة تقريباً
      borderRadius: '20px',
      padding: '20px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      
      {/* 1. صورة الوجبة الدائرية */}
      <img src={meal.image} alt={meal.name} style={{ width: '120px', height: '120px', borderRadius: '15px', objectFit: 'cover' }} />
      
      {/* 2. اسم الوجبة والوصف */}
      <h2 style={{ margin: '5px 0 0 0', color: '#2c3e50' }}>{meal.name}</h2>
      <p style={{ color: '#7f8c8d', margin: '0', fontSize: '15px' }}>{meal.description}</p>
      
      {/* 3. السعر بالخلفية البيضاء الممتدة */}
      <div style={{ backgroundColor: 'white', width: '90%', padding: '8px 0', borderRadius: '10px', fontWeight: 'bold', color: '#ff7a00', fontSize: '18px' }}>
        {meal.price}$
      </div>

      {/* 🌟 4. قسم نجوم التقييم: تم لفه بشرط الاختفاء والظهور الذكي 🌟 */}
      {hasCheckedOut && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '5px 0' }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRating(meal._id, star)}
                style={{
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: star <= currentRating ? '#ffcc00' : '#e4e5e9', // تلوين النجوم الصفراء
                  transition: 'color 0.2s'
                }}
              >
                ★
              </span>
            ))}
          </div>
          {/* نص التقييم التوضيحي بجانب النجوم */}
          <span style={{ fontSize: '12px', color: '#555' }}>
            {currentRating > 0 ? `(${currentRating}/5)` : '(No rate yet)'}
          </span>
        </div>
      )}

      {/* 5. أزرار الزائد والناقص بالأسفل */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: 'auto' }}>
        <button 
          onClick={() => updateQuantity(meal._id, quantity - 1)} 
          disabled={quantity <= 0}
          style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', backgroundColor: '#4caf50', color: 'white', fontSize: '18px', cursor: 'pointer' }}
        >
          -
        </button>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{quantity}</span>
        <button 
          onClick={() => updateQuantity(meal._id, quantity + 1)} 
          style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', backgroundColor: '#4caf50', color: 'white', fontSize: '18px', cursor: 'pointer' }}
        >
          +
        </button>
      </div>

    </div>
  );
};

export default MealCard;