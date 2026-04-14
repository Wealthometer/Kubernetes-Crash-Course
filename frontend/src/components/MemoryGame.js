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
  const FLIP_DELAY = 1000;

  // Initialize game with shuffled cards
  const initializeGame = () => {
    const gameCards = [];
    
    // Create pairs of cards
    CARD_SYMBOLS.forEach((symbol, index) => {
      gameCards.push(
        { id: index * 2, symbol, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, symbol, isFlipped: false, isMatched: false }
      );
    });

    // Fisher-Yates shuffle algorithm
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);
  };

  // Handle card click
  const handleCardClick = (cardId) => {
    if (!gameStarted || gameWon) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card flip state
    setCards(prevCards => 
      prevCards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setTimeout(() => checkForMatch(newFlippedCards), FLIP_DELAY);
    }
  };

  // Check if two flipped cards match
  const checkForMatch = (flippedCardIds) => {
    const [firstId, secondId] = flippedCardIds;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard.symbol === secondCard.symbol) {
      // Cards match
      setCards(prevCards =>
        prevCards.map(c =>
          flippedCardIds.includes(c.id) ? { ...c, isMatched: true } : c
        )
      );
      setMatchedPairs(prev => [...prev, firstCard.symbol]);
      
      // Check if game is won
      if (matchedPairs.length + 1 === CARD_SYMBOLS.length) {
        setGameWon(true);
        updateGameStats(true);
      }
    } else {
      // Cards don't match - flip them back
      setCards(prevCards =>
        prevCards.map(c =>
          flippedCardIds.includes(c.id) ? { ...c, isFlipped: false } : c
        )
      );
    }
    
    setFlippedCards([]);
  };

  // Update game statistics
  const updateGameStats = async (won) => {
    try {
      let token = localStorage.getItem('token');
      if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
      }

      const stats = {
        game_type: 'memory-game',
        wins: won ? 1 : 0,
        losses: won ? 0 : 1,
      };
