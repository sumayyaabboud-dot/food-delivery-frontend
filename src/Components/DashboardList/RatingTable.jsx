import React, { useEffect } from 'react';
import axios from 'axios';

function RatingTable({ reviews, setReviews, loadingReviews, setLoadingReviews }) {
  
  useEffect(() => {
    axios.get('http://localhost:5005/api/reviews')
      .then(res => {
        if (res.data && Array.isArray(res.data.data)) setReviews(res.data.data);
        else if (Array.isArray(res.data)) setReviews(res.data);
        setLoadingReviews(false);
      })
      .catch(err => { console.error(err); setLoadingReviews(false); });
  }, [setReviews, setLoadingReviews]);

  const handleDeleteReview = async (reviewId) => { 
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`http://localhost:5005/api/reviews/${reviewId}`);
        alert("Review deleted successfully! ⭐");
        setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div>
      <h2 style={{ color: '#030303', marginBottom: '20px' }}><strong>Customer Reviews & Feedback 🌟</strong></h2>
      {loadingReviews ? <p>Loading Reviews... ⏳</p> : reviews.length === 0 ? <p>No reviews submitted yet! ⭐️</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#ec710c', color: 'black' }}>
              <th style={{ padding: '12px', borderRight: '1px solid #050505' }}>Review_ID</th>
              <th style={{ padding: '12px', borderRight: '1px solid #000' }}>Rating</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => {
              const currentRating = Math.round(Number(review.rating)) || 5;
              return (
                <tr key={review._id} style={{ borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', borderRight: '1px solid #050505' }}>{review._id?.slice(-6)}</td>
                  <td style={{ padding: '12px', borderRight: '1px solid #000' }}>
                    <div style={{ color: '#ffc107', fontSize: '16px' }}>
                      {"⭐".repeat(currentRating)} <span>({currentRating})</span>
                    </div>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteReview(review._id)} style={{ backgroundColor: '#e9735f', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RatingTable;