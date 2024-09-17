import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function VariableDetail() {
  const { variableId } = useParams();
  const [variable, setVariable] = useState(null);

  useEffect(() => {
    async function fetchVariable() {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json`);
      const result = await response.json();
      const foundVariable = result.Results.find(v => v.ID.toString() === variableId);
      setVariable(foundVariable);
    }

    fetchVariable();
  }, [variableId]);

  if (!variable) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{variable.Name}</h2>
      <p dangerouslySetInnerHTML={{ __html: variable.Description }} />
    </div>
  );
}

export default VariableDetail;
