import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import logo from '../assets/kubesimplify-logo.png';

const Dashboard = () => {
  const [scores, setScores] = useState([]);
  const history = useHistory();
  const token = localStorage.getItem('token');
  let username = '';

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    username = decoded.username;
  } catch (e) {
    console.error('Error decoding token:', e);
    localStorage.removeItem('token');
    history.push('/login');
  }

  const fetchScores = async () => {
    try {
      const gameServiceUrl = process.env.REACT_APP_GAME_SERVICE_URL || 'http://localhost:8081';      
      const response = await axios.get(`${gameServiceUrl}/users/scores`, {
        params: { t: new Date().getTime() }, // Cache-busting parameter
      });
      console.log('Fetched scores:', response.data);
      setScores(response.data);
    } catch (err) {
      console.error('Error fetching scores:', err.response ? err.response.data : err.message);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []); // Initial fetch on mount

  // Refresh scores when the dashboard is focused (e.g., after navigating back)
  useEffect(() => {
    const handleFocus = () => {
      fetchScores();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <img src={logo} alt="Kubesimplify" className="max-w-xs h-auto mx-auto rounded-lg shadow-md mb-6" />
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Dashboard</h2>
        <p className="text-center text-gray-700 mb-4">Logged in as: {username}</p>
        <button
          onClick={handleLogout}
          className="block mx-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 mb-6"
        >
          Logout
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-2 px-4">USERNAME</th>
                <th className="py-2 px-4">SNAKE HIGH SCORE</th>
                <th className="py-2 px-4">TIC-TAC-TOE WINS</th>
                <th className="py-2 px-4">TIC-TAC-TOE LOSSES</th>
                <th className="py-2 px-4">RPS WINS</th>
                <th className="py-2 px-4">RPS LOSSES</th>
              </tr>
            </thead>
            <tbody>
