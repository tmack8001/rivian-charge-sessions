import React from 'react';
import ChargingHistory from './ChargingHistory';

const MainContent = ({ loggedIn }) => {
    console.log('loggedIn:', loggedIn); // Add this line to log the value of loggedIn

  return (
    <main>
      {loggedIn && <ChargingHistory />}
    </main>
  );
}

export default MainContent;