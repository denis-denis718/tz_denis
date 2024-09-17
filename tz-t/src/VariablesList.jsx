import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function VariablesList() {
  const [variables, setVariables] = useState([]);

  useEffect(() => {
    async function fetchVariables() {
      const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json');
      const result = await response.json();
      setVariables(result.Results);
    }

    fetchVariables();
  }, []);

  const stripHTMLTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  return (
    <div>
      <h2>Variables List</h2>
      <ul>
        {variables.map((variable) => (
          <li key={variable.ID}>
            <Link to={`/variables/${variable.ID}`}>{variable.Name}</Link>: {stripHTMLTags(variable.Description)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VariablesList;
