import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import logo from '../assets/kubesimplify-logo.png';

const Dashboard = () => {
  const [scores, setScores] = useState([]);
  const [username, setUsername] = useState('');
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUsername(decoded.username);
      } catch (e) {
        console.error('Invalid token:', e);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const fetchScores = async () => {
    try {
      const fullUrl = '/api/game/users/scores';
      console.log('Fetching scores from:', fullUrl); // Debug log
      const response = await axios.get(fullUrl, {
        params: { t: new Date().getTime() }, // Cache-busting
      });
      setScores(response.data);
    } catch (err) {
      console.error('Error fetching scores:', err.response ? err.response.data : err.message);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetchScores();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    history.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <img src={logo} alt="Kubesimplify" className="max-w-xs h-auto mx-auto rounded-lg shadow-md mb-6" />
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Dashboard</h2>
        
        {username && (
          <>
            <p className="text-center text-gray-700 mb-4">Logged in as: {username}</p>
            <button
              onClick={handleLogout}
              className="block mx-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 mb-6"
            >
              Logout
            </button>
          </>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-2 px-4">USERNAME</th>
                <th className="py-2 px-4">SNAKE HIGH SCORE</th>
                <th className="py-2 px-4">TIC-TAC-TOE WINS</th>
                <th className="py-2 px-4">TIC-TAC-TOE LOSSES</th>
