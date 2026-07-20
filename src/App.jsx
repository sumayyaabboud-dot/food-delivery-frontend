import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import AuthBox from './Components/AuthBox';
import Badges from './Components/Badges';
import MealCard from './Components/MealCard';
import AdminDashboard from './Components/AdminDashboard';

function App() {
  const [meals, setMeals] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [orderStatus, setOrderStatus] = useState(null);
  const [ratings, setRatings] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [restaurants, setRestaurants] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:5005/api/restaurants');
        if (res.data.success) {
          setRestaurants(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuthForm(prev => ({ ...prev, [name]: value }));
  };

const handleAuth = (e) => {
    e.preventDefault();

    if (isLogin) {
      // 🔐 LOGIN MODE
      // Since your backend routes don't show a custom login route here, 
      // we will check against the initial data or implement custom local validation
      if (authForm.email === 'admin@food.com') {
       setUser({ _id: '6a55146ff84335ce5ffc23d8', name: 'Admin', email: authForm.email, role: 'admin' });
        alert('Welcome Admin! ⚙️');
      } else {
        // Fallback or customer check
        setUser({ name: authForm.name || 'User', email: authForm.email, role: 'customer' });
        alert('Logged in successfully! 🍕');
      }
    } else {
      // ➕ REGISTER MODE (Create User)
      const payload = { 
        name: authForm.name, 
        phone: authForm.phone, 
        email: authForm.email, 
        password_hash: authForm.password // Sending password to your DB schema
      };

      // Sending POST request directly to '/' as defined in your backend
      axios.post('http://localhost:5005/api/users/', payload)
        .then(response => {
          const userData = response.data?.user || response.data?.data || response.data;
          setUser(userData);
          alert('Account created successfully in MongoDB Atlas! 🎉');
        })
        .catch(err => {
          console.error("Registration Error:", err);
          alert(err.response?.data?.message || "Failed to create account. Check connection.");
        });
    }
  };
  useEffect(() => {
    const fallbackMeals = [
      { _id: "1", name: "Pizza Hutt", price: 6.5, description: "tasty meal" },
      { _id: "2", name: "Lebanese Burger", price: 3, description: "good quality good tast" }
    ];

  

    axios.get('http://localhost:5005/api/meals')
      .then(response => {
        let dataArray = Array.isArray(response.data) ? response.data 
                    : Array.isArray(response.data?.data) ? response.data.data 
                    : Array.isArray(response.data?.meals) ? response.data.meals : [];
        setMeals(dataArray.length > 0 ? dataArray : fallbackMeals);
      })
      .catch(err => {
        console.error("Backend server offline, loading fallback data:", err);
        setMeals(fallbackMeals);
      });
  }, []);

    // Security Guard: If user logs out or is not the admin, kick them out of Admin View automatically
useEffect(() => {
  const adminEmail = "admin@food.com"; // This is your designated Admin email
  if (!user || user.email !== adminEmail) {
    setShowAdmin(false);
  }
}, [user]);
  const updateQuantity = (id, change) => {
    setQuantities(prev => {
      const next = (prev[id] || 0) + change;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };
const handleRating = async (mealId, score) => {
    
    const newScore = ratings[mealId] === score ? 0 : score;
    
    setRatings(prev => ({ ...prev, [mealId]: newScore }));
    
    try {
        await axios.post('http://localhost:5005/api/ratings', { mealId, rating: newScore });
        console.log("Review saved:", newScore);
    } catch (error) {
        console.error("Error saving review:", error);
    }


  // 2. Find the restaurant ID for the meal, fallback to your valid Compass ID if not found
  const currentMeal = meals.find(m => m._id === mealId);
  const restaurantId = currentMeal?.restaurant_id || "6a4182a03aa3dbb8106a5fc7"; 

  // 3. Ensure a valid user_id is sent, fallback to your successful Postman User ID for testing
  const userId = user?.id || user?._id || "6a410eafcba60497331bd60c";

  // 4. Send the POST request matching the schema requirements exactly
  axios.post('http://localhost:5005/api/reviews', {
    user_id: userId,
    restaurant_id: restaurantId,
    rating: score,
    comment: "Delicious meal!" // Optional field based on your schema
  })
  .then(res => {
    console.log("Review saved to database successfully! ✅", res.data);
  })
  .catch(err => {
    console.error("Error saving review: ❌", err.response?.data || err.message);
  });
};
  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = meals.reduce((sum, meal) => sum + (quantities[meal._id] || 0) * meal.price, 0);

 const handleCheckout = () => {
  setHasCheckedOut(true);
  const orderItems = Object.keys(quantities)
  .filter(id => quantities[id] > 0) 
  .map(id => {
    
    const meal = meals.find(m => m._id === id || m.id === id);
    return {
      mealId: id, 
      name: meal ? meal.name : "Meal",
      price: meal ? Number(meal.price) : 0,
      quantity: Number(quantities[id])
    };
  });

axios.post('http://localhost:5005/api/orders/add', {
    user_id: user?._id || "6451012e22cc54f0fed13561",
    items: orderItems,
    totalPrice: Number(totalPrice)
})
  .then(() => {
    setOrderStatus("Success! Order placed successfully. ✅");
    setQuantities({}); 
  })
  .catch(err => {
    console.error(err);
    setOrderStatus("Failed to send order. Please try again. ❌");
  });
};

  const handleNavClick = (section) => {
  if (!user) {
    alert(`🔐 Please Login or Create an Account first to access ${section}!`);
  } else {
    
    if (section === 'Restaurants') {
      
      document.getElementById('our-restaurants-new')?.scrollIntoView({ behavior: 'smooth' });
    } else {
    
      document.querySelector('.meals-grid')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
return (
    <div 
      className={showAdmin && user && user.email === "admin@food.com" ? "" : "menu-container"} 
      style={{ backgroundColor: showAdmin && user && user.email === "admin@food.com" ? '#ffffff' : '#fff5eb', minHeight: '100vh' }}
    >
      
      
      {showAdmin && user && user.email === "admin@food.com" ? (
        <AdminDashboard meals={meals} setMeals={setMeals} />
      ) : (
        <>
          <Navbar user={user} handleNavClick={handleNavClick} />

          
          {user && user.email === "admin@food.com" && (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <button 
                onClick={() => setShowAdmin(!showAdmin)}
                style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#1f7913', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
              >
                {showAdmin ? 'Back to Menu' : 'Admin Dashboard'}
              </button>
            </div>
          )}

          
          {user && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              flexWrap: 'wrap', 
              gap: '30px',
              padding: '50px 60px', 
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1', minWidth: '300px', maxWidth: '500px' }}>
                
                <Hero />

                
                <div id="badges-section" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', paddingLeft: '10px', scrollMarginTop: '20px' }}>
                  <Badges totalItems={totalItems} totalPrice={totalPrice} />
                  
                  
                  {totalItems > 0 && (
                    <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout 🛒</button>
                  )}
                  {orderStatus && <div className="status-alert">{orderStatus}</div>}
                </div>

              </div>

              
              <header className="menu-header" style={{ 
                margin: 0,
                padding: '10px',
                marginTop: '15px'
              }}>
                
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#ff7a00',
                      color: 'white',
                      border: 'none',
                      borderRadius: '30px', 
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '15px',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.2)', 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e66e00'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff7a00'}
                  >
                    🍔 Select Menu {isDropdownOpen ? '▲' : '▼'}
                  </button>

                  
                  {isDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '55px',
                      right: '0', 
                      backgroundColor: '#ffffff',
                      minWidth: '260px', 
                      borderRadius: '14px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      padding: '12px',
                      zIndex: 1000,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      border: '1px solid #ffe3cb'
                    }}>
                      <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#2c3e50', padding: '5px 0', borderBottom: '2px solid #f8f9fa', fontSize: '15px' }}>
                        RESTO NAME
                      </div>
                      
                      <button 
                        onClick={() => { setSelectedRestaurant(''); setIsDropdownOpen(false); }} 
                        style={{ 
                          padding: '10px', 
                          backgroundColor: '#088a0f', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '8px', 
                          cursor: 'pointer', 
                          fontWeight: 'bold', 
                          textAlign: 'center',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#088a0f'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#088a0f'}
                      >
                        🔄 Refresh (Clear View)
                      </button>
                      
                      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '6px 0' }} />
                      
                      {[
                        { id: 'All', name: 'All Restaurants' },
                        { id: 'Al Barakah', name: 'Al Barakah' },
                        { id: 'Al Jawad', name: 'Al Jawad' },
                        { id: 'Al Najjar', name: 'Al Najjar' },
                        { id: 'Mankoushi', name: 'Mankoushi' }
                      ].map(res => (
                        <button 
                          key={res.id} 
                          onClick={() => { setSelectedRestaurant(res.id); }} 
                          style={{
                            padding: '11px 15px',
                            backgroundColor: selectedRestaurant === res.id ? '#ff7a00' : '#ffffff',
                            color: selectedRestaurant === res.id ? '#ffffff' : '#2c3e50',
                            border: '1px solid #ff7a00',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textAlign: 'left',
                            transition: 'all 0.2s'
                          }}
                        >
                          {res.name}
                        </button>
                      ))}

                      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '6px 0' }} />
                      <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        <input 
                          type="text" 
                          placeholder="Search meal..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            outline: 'none',
                            fontSize: '14px'
                          }}
                        />
                        <button 
                          style={{
                            padding: '10px 12px',
                            backgroundColor: '#1f7913',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          🔍
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              </header>

            </div>
          )}

          
         


{!user && (
  <div style={{ 
    display: 'flex', 
   
    paddingTop:'40px',
    alignItems: 'center', 
    padding: '60px 20px',    
    flexDirection: 'column',
    backgroundColor: 'transparent',
    minHeight: '100vh',      
    width: '100%',           
    boxSizing: 'border-box',
    minHeight: '1000px'
  }}>
    
  
    
<div style={{
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch', 
  justifyContent: 'center',
  backgroundColor: 'transparent', 
  borderRadius: '15px',
  boxShadow: 'none',             
  overflow: 'hidden', 
  maxWidth: '1000px',
  width: '100%',
  border: 'none', 
  textAlign:'left'              
}}>
      
      
      <div 
        className="login-side-wrapper"
        style={{ 
          flex: '1.2', 
          minWidth: '350px', 
          padding: '40px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent', 
          alignSelf: 'stretch'// 
        }}
      >
        
        <div style={{ width: '100%',height:'100%',  alignSelf: 'stretch',backgroundColor: 'transparent' }} className="force-transparent">
          <AuthBox 
            user={user} 
            isLogin={isLogin} 
            setIsLogin={setIsLogin} 
            authForm={authForm} 
            handleInputChange={handleInputChange} 
            handleAuth={handleAuth} 
          />
        </div>
      </div>

      <div style={{ 
  flex: '1', 
  minWidth: '600px', 
  backgroundImage: 'url("https://msgwords.com/wp-content/uploads/2025/01/Short-Welcome-Messages-for-Customers.jpg")', 
  backgroundSize: 'cover', 
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  
  alignSelf: 'stretch' 
}}>
</div>

    </div>

    
    <div style={{ textAlign: 'center', marginTop: '30px', color: '#7f8c8d', fontWeight: '500' }}>
      <h3>🔒 Please Login or Create an Account above to browse the menu</h3>
    </div>

  </div>
)}
          
          {user && selectedRestaurant && (
             <main id="meals" className="meals-grid" style={{ padding: '20px', scrollMarginTop: '40px' }}>
               {meals
                .filter(meal => {
                  if (selectedRestaurant === 'All') return true; 
                  return meal.category.trim().toLowerCase() === selectedRestaurant.trim().toLowerCase();
                })
                .filter(meal => meal.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(meal => (
                  <MealCard 
                    key={meal._id} 
                    meal={meal} 
                    quantity={quantities[meal._id] || 0} 
                    updateQuantity={updateQuantity} 
                    handleRating={handleRating} 
                    currentRating={ratings[meal._id] || 0}
                    hasCheckedOut={hasCheckedOut}
                  />
                ))
               }
             </main>
          )}

        
          {user && !selectedRestaurant && (
            <div id="meals" style={{ textAlign: 'center', padding: '60px 20px', color: '#7f8c8d' }}>
              <h2>🍽️ Please select a restaurant from the menu to discover their delicious meals!</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;