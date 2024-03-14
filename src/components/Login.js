import React, { useState } from 'react';
import { login } from './client/Api';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
        await login(username, password);
        // Handle successful login, e.g., redirect to another page
        console.log('Login successful');
      } catch (error) {
        console.error('Login failed:', error.message);
        // Handle login failure, e.g., display error message to user
      }
  };

  return (
    <div id="login-form">
      <h2>Login</h2>
      <input
        type="text"
        id="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;