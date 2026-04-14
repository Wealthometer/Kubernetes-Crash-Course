import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/kubesimplify-logo.png';

const MemoryGame = () => {
  // Game state management
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration
  const CARD_SYMBOLS = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];
  const GRID_SIZE = 16; // 4x4 grid

  const initializeGame = () => {
