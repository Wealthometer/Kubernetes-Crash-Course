import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import Snake from './components/SnakeGame';
import TicTacToe from './components/TicTacToe';
import RockPaperScissors from './components/RockPaperScissors';
import MemoryGame from './components/MemoryGame';
import PrivateRoute from './components/PrivateRoute'; // NEW

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    history.push('/login');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">GameHub</h1>
          </div>
          <nav>
            <a href="/dashboard" className="text-white hover:underline mx-2">Dashboard</a>
            {!isLoggedIn ? (
              <>
                <a href="/signup" className="text-white hover:underline mx-2">Sign Up</a>
                <a href="/login" className="text-white hover:underline mx-2">Login</a>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-white hover:underline mx-2 bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            )}
          </nav>
        </header>

        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/dashboard" component={Dashboard} />

          {/* 👇 Games are now protected */}
          <PrivateRoute path="/snake" component={Snake} />
          <PrivateRoute path="/tic-tac-toe" component={TicTacToe} />
          <PrivateRoute path="/rock-paper-scissors" component={RockPaperScissors} />
          <PrivateRoute path="/memory-game" component={MemoryGame} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;

