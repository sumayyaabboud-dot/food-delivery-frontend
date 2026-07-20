import React from 'react';

function Hero({ searchQuery, setSearchQuery }) {
  const handleFormSubmit = (e) => {
    e.preventDefault(); 
  };

  return (
    <div  style={{
      textAlign: 'center',
      padding: '50px 20px',
      background: 'linear-gradient(135deg, #f36f32 0%, #eff166 100%)',
      borderRadius: '24px',
      maxWidth: '1000px',
      margin: '20px auto 30px auto',
      boxShadow: '0 10px 30px rgba(240, 138, 5, 0.99)'
    }}>
  
<h1 style={{
  fontSize: '2.8rem',
  fontWeight: '900',
  color: '#1b5e20',
  margin: '0 0 20px 0', 
  letterSpacing: '-0.5px',
  lineHeight: '1.2'
}}>
  Faster Delivery is just here
</h1>



<p style={{
  fontSize: '1.25rem',
  fontWeight: '800',
  color: '#000000',
  margin: '0 0 30px 0', 
  lineHeight: '1.6'
}}>
  The Tasty Food is here, request now and don't be late!
</p></div>
  );
}


     


export default Hero;