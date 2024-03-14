import React from 'react';
import Login from './Login';

const Header = ({ loggedIn, onLogin }) => {
  return (
    <header className="App-header">
      <h1>Welcome to My Rivian Charging History</h1>
      {!loggedIn && <Login onLogin={onLogin} />} {/* Render Login component only if not logged in */}
    </header>
  );
}

export default Header;