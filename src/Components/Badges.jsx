import React from 'react';

function Badges({ totalItems, totalPrice }) {
  return (
    <div className="dashboard-badges">
      <div className="blue-items-badge">🛒 Items: {totalItems}</div>
  <div className="green-total-badge">Total Price: ${(totalPrice || 0).toFixed(2)}</div>
    </div>
  );
}

export default Badges;