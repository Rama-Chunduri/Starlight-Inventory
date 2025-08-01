import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function KitDetailPage() {
  const [searchParams] = useSearchParams();
  const [kits, setKits] = useState([]);

  useEffect(() => {
    const idsParam = searchParams.get("ids"); // "1,2,3"
    if (idsParam) {
      const query = idsParam.split(',').map(id => parseInt(id.trim())).join(',');
      fetch(`${API_URL}/kits?ids=${query}`)
        .then((res) => res.json())
        .then((data) => setKits(data));
    }
  }, [searchParams]);

  return (
    <div>
      {kits.map((kit) => (
        <div key={kit.id}>
          <h2>{kit.name}</h2>
          <ul>
            {kit.components.map((comp, idx) => (
              <li key={idx}>
                {comp.description} ({comp.part_number}) — units required: {comp.units}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default KitDetailPage;
