import React, { useEffect } from 'react';
import axios from 'axios';

function OrderManagement({ orders, setOrders, loadingOrders, setLoadingOrders }) {
  
  useEffect(() => {
    axios.get('http://localhost:5005/api/orders/all')
      .then(res => {
        if (res.data.success) setOrders(res.data.orders);
        setLoadingOrders(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setLoadingOrders(false);
      });
  }, [setOrders, setLoadingOrders]);

  const handleUpdateStatus = (orderId, newStatus) => {
    axios.put(`http://localhost:5005/api/orders/${orderId}`, { status: newStatus })
      .then(() => {
        setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
        alert(`Order status updated to ${newStatus}! ✅`);
      })
      .catch(err => { console.error(err); alert("Failed to update status."); });
  };

  const handleDeleteOrder = (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order? ⚠️")) return;
    axios.delete(`http://localhost:5005/api/orders/${orderId}`)
      .then(() => {
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        alert("Order deleted successfully! 🗑️");
      })
      .catch(err => { console.error(err); alert("Failed to delete order."); });
  };

  return (
    <div>
      <h2 style={{ color: '#000000', marginBottom: '20px' }}><strong>Orders Management 📦</strong></h2>
      {loadingOrders ? <p>Loading Orders... ⏳</p> : orders.length === 0 ? <p>No orders found yet! 🛒</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f37a08', color: 'black', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderRight: '1px solid #000' }}>Order ID</th>
              <th style={{ padding: '12px', borderRight: '1px solid #000' }}>Items Ordered</th>
              <th style={{ padding: '12px', borderRight: '1px solid #000' }}>Total Price</th>
              <th style={{ padding: '12px', borderRight: '1px solid #000' }}>Status</th>
              <th style={{ padding: '12px', borderRight: '1px solid #000' }}>Date</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ padding: '12px', fontWeight: 'bold', borderBottom: '1px solid #000', borderRight: '1px solid #000' }}>{order._id.slice(-6)}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #000', borderRight: '1px solid #000' }}>
                  {order.items?.map((item, i) => (
                    <div key={i}>• {item.name} <span style={{ color: '#ff7a00' }}>({item.quantity}x)</span></div>
                  ))}
                </td>
                <td style={{ padding: '12px', color: '#2e7d32', fontWeight: 'bold', borderBottom: '1px solid #000', borderRight: '1px solid #000' }}>${order.totalPrice}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #000', borderRight: '1px solid #000' }}>
                  <select value={order.status} onChange={(e) => handleUpdateStatus(order._id, e.target.value)} style={{ padding: '6px', fontWeight: 'bold', width: '100%' }}>
                    <option value="Pending">Pending ⏳</option>
                    <option value="Preparing">Preparing 👨‍🍳</option>
                    <option value="Delivered">Delivered ✅</option>
                  </select>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #000', borderRight: '1px solid #000' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #000' }}>
                  <button onClick={() => handleDeleteOrder(order._id)} style={{ backgroundColor: '#e74646', color: 'black', border: 'none', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderManagement;