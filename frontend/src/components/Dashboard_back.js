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
