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

  const initializeGame = () => {
    const gameCards = [];
    
    CARD_SYMBOLS.forEach((symbol, index) => {
      gameCards.push(
        { id: index * 2, symbol, isFlipped: false, isMatched: false },
      );
    });

    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];

    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);

  // Handle card click
  const handleCardClick = (cardId) => {
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards => 
      prevCards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
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
