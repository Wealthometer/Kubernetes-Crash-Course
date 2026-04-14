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

