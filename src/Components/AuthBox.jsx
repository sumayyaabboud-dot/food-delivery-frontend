import React from 'react';

function AuthBox({ user, isLogin, setIsLogin, authForm, handleInputChange, handleAuth }) {
  const inputStyle = {
    width: '90%',
  padding: '12px',
  margin: '10px auto',
  borderRadius: '10px',
  border: '1px solid #ddd',
  display: 'block',
  fontSize: '16px'
};

const labelStyle = { 
  display: 'block',
  width: '90%',
  margin: '10px auto 2px auto',
  fontWeight: '600',
  color: '#070505',
  fontSize: '20px',
  textAlign:'left'
};


  if (user) {
    return (
      <div style={{ color: 'green', fontWeight: 'bold', padding: '20px', background: 'force-transparent', borderRadius: '10px' }}>
        Welcome, {user.name}! Account Active. You can place your order now.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0px auto',height:'100%',boxSizing:'border-box', padding: '30px', background: '#f8ad4af3', borderRadius: '15px' ,boxShadow:'0 10px 25px rgba(0,0,0,0.3'}}>
      <form onSubmit={handleAuth}>
        <h2 style={{ color: '#131010', marginBottom: '15px' }}>
          {isLogin ? 'Sign In / Login' : 'Create Account (User)'}
        </h2>

        {!isLogin && (
          <>
          <label style={labelStyle}>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              style={inputStyle}
              required
              value={authForm.name || ''}
              onChange={handleInputChange}
            />
            <label style={labelStyle}>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              style={inputStyle}
              required
              value={authForm.phone || ''}
              onChange={handleInputChange}
            />
          </>
        )}
        <label style={labelStyle}>Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          style={inputStyle}
          autoComplete="off"
          required
          value={authForm.email || ''}
          onChange={handleInputChange}
        />
       <label style={labelStyle}>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          style={inputStyle}
          autoComplete="new-password"
          required
          value={authForm.password || ''}
          onChange={handleInputChange}
        />

       <button style={{
  width: '94%',
  padding: '12px',
  background: 'linear-gradient(135deg, #f09309, #3bf30ce8)', 
  color: '#0a0909',
  border: 'none',
  borderRadius: '25px', 
  cursor: 'pointer',
  margin: '15px auto',
  display: 'block',
  fontWeight: 'bold',
  fontSize: '16px',
  transition: '0.3s'
}}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#1f1c1c' }}>
  {isLogin ? "Don't have an account? " : "Already have an account? "}
  <span 
    onClick={() => setIsLogin(!isLogin)}
    style={{ color: '#064621', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
  >
    {isLogin ? 'Register' : 'Login'}
  </span>
</p>
    </div>
  );
}

export default AuthBox;