import React, { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
     const response = await fetch('http://localhost:8080/api/auth/signin', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ username, password }),
     });

     console.log('API Response:', response);

     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.message || 'Login failed');
     }

   const data = await response.json();

   if (!data.accessToken) {
     throw new Error('Token not found in the response');
   }
   console.log('JWT Token:', data.accessToken);

   console.log('User Details:', data);

   localStorage.setItem('token', data.accessToken);

      setUsername('');
      setPassword('');
      setError('');

    } catch (error) {
      console.error('Login error:', error.message);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
