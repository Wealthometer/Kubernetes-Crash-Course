import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import logo from '../assets/kubesimplify-logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

    e.preventDefault();
    try {
      console.log('Logging in at:', fullUrl); // Debug log
      localStorage.setItem('token', res.data.token);
    } catch (err) {
