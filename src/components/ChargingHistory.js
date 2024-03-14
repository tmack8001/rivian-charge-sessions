import React, { useState } from 'react';
import { getCompletedSessionSummaries } from './client/Api';

const RivianChargingHistory = () => {
  const [chargingSessions, setChargingSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchCompletedSessionSummaries = async () => {
    try {
      setLoading(true);
      setError(null);
  
      // TODO : dynamically fetch vehicles you have access to populate a dropdown
      // Call the API function to fetch charging sessions
      const response = await getCompletedSessionSummaries();
      const result = await response.json();
  
      if (response.ok) {
        setChargingSessions(result.data.getCompletedSessionSummaries);
      } else {
        setError(`Error: ${result.message}`);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Rivian Charging History</h1>
      <button onClick={handleFetchCompletedSessionSummaries}>Fetch Charging Sessions</button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <ul>
        {chargingSessions.map(session => (
          <li key={session.transactionId}>
            Transaction ID: {session.transactionId},
            Vehicle ID: {session.vehicleId},
            Charger ID: {session.chargerId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RivianChargingHistory;