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

      const response = await axios.post('/api/game/game/stats', stats, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Memory game stats updated:', response.data);
    } catch (err) {
      console.error('Error updating memory game stats:', err.response ? err.response.data : err.message);
    }
  };

  // Reset game
  const resetGame = () => {
    initializeGame();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <img src={logo} alt="Kubesimplify" className="max-w-xs h-auto mx-auto rounded-lg shadow-md mb-6" />
      <h2 className="text-3xl font-bold text-blue-500 mb-4">Memory Card Game</h2>
      
      {!gameStarted && (
        <button
          onClick={initializeGame}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 mb-6 text-lg font-medium"
        >
          Start Game
        </button>
      )}

      {gameStarted && (
        <>
          <div className="mb-4 text-lg font-medium">
            Moves: {moves} | Pairs Found: {matchedPairs.length}/{CARD_SYMBOLS.length}
          </div>

          {gameWon && (
            <div className="text-center mb-4">
              <p className="text-green-500 text-2xl font-bold mb-2">🎉 Congratulations! 🎉</p>
              <p className="text-lg">You won in {moves} moves!</p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-3 mb-6 max-w-md">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${card.isFlipped || card.isMatched 
                    ? 'bg-white border-2 border-blue-500 shadow-md' 
                    : 'bg-blue-500 hover:bg-blue-600 shadow-lg'
                  }
                  ${card.isMatched ? 'opacity-75' : ''}
                `}
              >
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </div>
            ))}
          </div>

          <button
            onClick={resetGame}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 mb-6"
          >
            Reset Game
          </button>
        </>
      )}

      <a href="/dashboard" className="text-blue-500 hover:underline">Back to Dashboard</a>
    </div>
  );
};

export default MemoryGame;