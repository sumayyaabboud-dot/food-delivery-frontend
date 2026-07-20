import React, { useState, useEffect } from 'react';
import axios from 'axios';

// استيراد المكونات الفرعية من المجلد الجديد
import AddMeal from './DashboardList/AddMeal';
import AddRestaurant from './DashboardList/AddRestaurant';
import OrderManagement from './DashboardList/OrderManagement';
import MenuOfMeals from './DashboardList/MenuOfMeals';
import RestaurantTable from './DashboardList/RestaurantTable';
import RatingTable from './DashboardList/RatingTable';

function AdminDashboard({ meals, setMeals }) {
  const [activeTab, setActiveTab] = useState('');

  // تعريف متغيرات الـ States المشتركة التي تحتاجها الجداول
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // دالة جلب المطاعم لتحديثها تلقائياً
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:5005/api/restaurants');
      if (res.data.success) {
        setRestaurantsList(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // دالة اختيار المحتوى بناءً على التبويب النشط
  const renderTabContent = () => {
    switch (activeTab) {
      case 'add-meal':
        return <AddMeal meals={meals} setMeals={setMeals} />;
      case 'add-restaurant':
        return <AddRestaurant fetchRestaurants={fetchRestaurants} />;
      case 'order-management':
        return <OrderManagement orders={orders} setOrders={setOrders} loadingOrders={loadingOrders} setLoadingOrders={setLoadingOrders} />;
      case 'menu-meals':
        return <MenuOfMeals meals={meals} setMeals={setMeals} />;
      case 'restaurant-table':
        return <RestaurantTable restaurantsList={restaurantsList} fetchRestaurants={fetchRestaurants} />;
      case 'rating-table':
        return <RatingTable reviews={reviews} setReviews={setReviews} loadingReviews={loadingReviews} setLoadingReviews={setLoadingReviews} />;
    default:
        return (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#7f8c8d', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h2>Welcome to Admin Dashboard 🚀</h2>
            <p>Please select an option from the sidebar to manage your content.</p>
            
            {/* إضافة الصورة هنا */}
            <img 
              src="https://i.ytimg.com/vi/ycKekxBGZAs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC6mU-7A_CR93RAQGTRDF7bdxFMwQ"
              style={{ width: '600px', height: 'auto', borderRadius: '10px', marginTop: '10px', boxShadow: '40px 4px 10px rgba(0,0,0,0.1)' }} 
            />
          </div>
        );
    }
  };

  // تصميم القائمة الجانبية وتنسيق الواجهة
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* القائمة الجانبية (Sidebar) */}
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* جعل العنوان كزر يعيدك للصفحة الرئيسية عند الضغط عليه */}
        <h2 
          onClick={() => setActiveTab('')} 
          style={{ 
            textAlign: 'center', 
            marginBottom: '5px', 
            fontSize: '20px', 
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          <strong>Admin Dashboard</strong>
        </h2>

        {/* زر Refresh مخصص للعودة للواجهة الترحيبية */}
        <button 
          onClick={() => setActiveTab('')} 
          style={{
            background: activeTab === '' ? '#16a085' : '#34495e',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '15px',
            transition: 'background 0.3s'
          }}
        >
          🔄 Refresh Dashboard
        </button>
        
        <button onClick={() => setActiveTab('add-meal')} style={btnStyle(activeTab === 'add-meal')}>➕ Add Meal</button>
        <button onClick={() => setActiveTab('add-restaurant')} style={btnStyle(activeTab === 'add-restaurant')}>🏢 Add Restaurant</button>
        <button onClick={() => setActiveTab('order-management')} style={btnStyle(activeTab === 'order-management')}>📦 ORDER Management</button>
        <button onClick={() => setActiveTab('menu-meals')} style={btnStyle(activeTab === 'menu-meals')}>📋 Menue of Meals</button>
        <button onClick={() => setActiveTab('restaurant-table')} style={btnStyle(activeTab === 'restaurant-table')}>📊 Restaurant Table</button>
        <button onClick={() => setActiveTab('rating-table')} style={btnStyle(activeTab === 'rating-table')}>⭐ Rating Table</button>
      </div>

      {/* منطقة المحتوى المتغير */}
      <div style={{ flex: 1, padding: '40px', backgroundColor: '#f8f9fa', overflowY: 'auto' }}>
        {renderTabContent()}
      </div>
    </div>
  );
}

// دالة لتنسيق الأزرار وجعل الزر النشط مميزاً
const btnStyle = (isActive) => ({
  background: isActive ? '#3498db' : 'transparent',
  color: 'white',
  border: 'none',
  padding: '12px 15px',
  textAlign: 'left',
  cursor: 'pointer',
  borderRadius: '4px',
  fontSize: '15px',
  fontWeight: 'bold',
  transition: 'background 0.3s'
});

export default AdminDashboard;