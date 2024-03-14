import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent';
import { loadSessionState } from './components/client/Api';

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Load session state variables from local storage when component mounts
    setLoggedIn(loadSessionState());
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="App">
      <Header loggedIn={loggedIn} onLogin={() => setLoggedIn(true)} />
      <MainContent loggedIn={loggedIn} />
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default App;