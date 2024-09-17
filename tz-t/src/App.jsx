import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VariablesList from './VariablesList';
import VariableDetail from './VariableDetail';
import './App.css';

function App() {
  const [vin, setVin] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(() => {
    const savedHistory = JSON.parse(localStorage.getItem('vinHistory'));
    return savedHistory || [];
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const vinPattern = /^[A-HJ-NPR-Z0-9]{1,17}$/i;
    if (!vin || vin.length !== 17 || !vinPattern.test(vin)) {
      setError('The VIN must be 17 characters long and must not contain invalid characters.');
      return;
    }

    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
      const result = await response.json();

      if (result.Message) {
        setError(result.Message);
        return;
      }

      if (result.Results) {
        setData(result.Results.filter(item => item.Value)); // Фильтрация по Value
        setError('');

        // Обновляем историю
        setHistory(prevHistory => {
          const newHistory = [vin, ...prevHistory];
          return newHistory.length > 3 ? newHistory.slice(0, 3) : newHistory;
        });
      } else {
        setError('Invalid VIN or no data found.');
      }
    } catch (err) {
      setError('Failed to fetch data.');
    }
  };

  // Сохранение истории в localStorage при обновлении истории
  useEffect(() => {
    localStorage.setItem('vinHistory', JSON.stringify(history));
  }, [history]);

  return (
    <Router>
      <div>
        <h1>VIN Decoder</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="Enter VIN"
            maxLength="17"
          />
          <button type="submit">Decode VIN</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <h2>Last 3 Decoded VINs</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2>Decoding Results</h2>
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {item.Variable}: {item.Value}
            </li>
          ))}
        </ul>

        <nav>
          <Link to="/variables">View All Variables</Link>
        </nav>

        <Routes>
          <Route path="/variables/:variableId" element={<VariableDetail />} />
          <Route path="/variables" element={<VariablesList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
