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
    
    CARD_SYMBOLS.forEach((symbol, index) => {
        { id: index * 2, symbol, isFlipped: false, isMatched: false },
      );

    for (let i = gameCards.length - 1; i > 0; i--) {
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];

    setFlippedCards([]);
    setMoves(0);
    setGameStarted(true);

  const handleCardClick = (cardId) => {
    
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;
    const newFlippedCards = [...flippedCards, cardId];

    setCards(prevCards => 
        c.id === cardId ? { ...c, isFlipped: true } : c
    );

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setTimeout(() => checkForMatch(newFlippedCards), FLIP_DELAY);
    }
