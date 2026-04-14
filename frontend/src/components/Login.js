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
  };
  return (
      <img src={logo} alt="Kubesimplify" className="max-w-xs h-auto mx-auto rounded-lg shadow-md mb-6" />
      {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
        <div className="mb-5">
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
        <div className="mb-6">
          <input
