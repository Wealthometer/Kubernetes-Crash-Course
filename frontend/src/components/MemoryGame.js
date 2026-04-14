import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/kubesimplify-logo.png';

const MemoryGame = () => {
  // Game state management
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
