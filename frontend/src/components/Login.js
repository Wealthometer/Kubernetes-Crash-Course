import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import logo from '../assets/kubesimplify-logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const fullUrl = '/api/auth/login';
      console.log('Logging in at:', fullUrl); // Debug log
      const res = await axios.post(fullUrl, { username, password });
      localStorage.setItem('token', res.data.token);
      history.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      <img src={logo} alt="Kubesimplify" className="max-w-xs h-auto mx-auto rounded-lg shadow-md mb-6" />
      <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Login</h2>
      {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-5">
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-5 text-gray-600">
        Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;
