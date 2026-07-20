import React from 'react';

const Navbar = () => {
  
  
  const scrollToBadges = (e) => {
    e.preventDefault();
    const badgesSection = document.getElementById('badges-section');
    if (badgesSection) {
      badgesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  
  const scrollToMeals = (e) => {
    e.preventDefault();
    const mealsSection = document.getElementById('meals');
    if (mealsSection) {
      mealsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  
  const Logo = () => (
    <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '22px', fontWeight: 'bold', color: 'white' }}>
      ⚡ <span style={{ color: '#ff7a00' }}>Craving</span> <span style={{ backgroundColor: '#ff7a00', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>Hub</span>
    </div>
  );

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#81c784' }}>
      
      
      <Logo />

      
      <div className="nav-links" style={{ display: 'flex', gap: '30px', fontWeight: 'bold', fontSize: '18px' }}>

        <a 
          href="#meals" 
          onClick={scrollToMeals}
          style={{ color: '#002f6c', textDecoration: 'none', borderBottom: '2px solid #ff7a00', paddingBottom: '3px', cursor: 'pointer' }}
        >
          Meals
        </a>
        
        <a 
          href="#badges-section" 
          onClick={scrollToBadges} 
          style={{ color: '#ff7a00', textDecoration: 'none', borderBottom: '2px solid #ffea00', paddingBottom: '3px', cursor: 'pointer' }}
        >
          Badges
        </a>
      </div>

  
      <Logo />
      
    </nav>
  );
};

export default Navbar;