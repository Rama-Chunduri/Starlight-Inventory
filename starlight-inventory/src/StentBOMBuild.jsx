import { useNavigate } from "react-router-dom";
import {useState, useEffect} from "react"
import './Dashboard.css'

function StentBOMBuild(){
  const [selectedKitIds, setSelectedKitIds] = useState([]);
  const [kitsData, setKitsData] = useState([]);
  const availableKits = [
    { id: 0, name: "Sterilized Starlight Stent Systems DDPC32" },
    { id: 2, name: "Unsterilized Starlight Stent Systems DDPC32" },
    { id: 4, name: "Packaged Starlight Stent System DDPC32" },
    { id: 6, name: "Lifeline Stent Shelf Carton & Pouch Label" },
    { id: 13, name: "Starlight Stent System DDPC32" },
    { id: 16, name: "Stent DDPC32" },
    { id: 25, name: "Uncoated Pusher Tube DDPC32" },
    { id: 37, name: "Uncoated Catheter DDPC32" },
    { id: 44, name: "Distal Catheter DDPC32" },
    { id: 45, name: "Catheter Braid" },
  ];

  const toggleKit = (kitId) => {
    setSelectedKitIds((prev) =>
      prev.includes(kitId) ? prev.filter((id) => id !== kitId) : [...prev, kitId]
    );
  };

  useEffect(() => {
    if (selectedKitIds.length === 0) {
      setKitsData([]);
      return;
    }

    const query = selectedKitIds.join(",");
    fetch(`http://localhost:8000/kits?ids=${query}`)
      .then((res) => res.json())
      .then((data) => setKitsData(data));
  }, [selectedKitIds]);

  return (
    <div style={{marginLeft: "2rem"}}>
      <h2 style={{fontSize: "3rem"}}>Pick Kits</h2>
      {availableKits.map((kit) => (
        <label key={kit.id} style={{ display: "block", marginBottom: "8px", fontSize: "2rem" }}>
          <input
            type="checkbox"
            checked={selectedKitIds.includes(kit.id)}
            onChange={() => {toggleKit(kit.id)}}
            style={{transform: "scale(3)", marginLeft: "5rem", marginRight: "1.5rem"}}
          />
          {kit.name}
          {selectedKitIds.includes(kit.id) && (
            <input 
            type="text"
            placeholder="Enter quantity"
            style={{
              marginLeft: "1rem",
              backgroundColor: "#BDC1C3",
              color: "#173D62",
              borderRadius: "8px",
              height: "1rem",
              padding: "0.5rem",
              fontSize: "1rem"
            }}
            />
          )}
        </label>
      ))}

      <h2 style={{fontSize: "3rem"}}>Selected Kit Subcomponents</h2>
      {kitsData.length === 0 ? (
        <p style={{fontSize: "3rem"}}>No kits selected</p>
      ) : (
        kitsData.map((kit) => (
          <div key={kit.id}>
            <h3 style={{fontSize: "2.5rem"}}>{kit.name}</h3>
            <ul>
              {kit.components.map((comp, idx) => (
                <li style={{fontSize: "2rem"}} key={idx}>
                  {comp.description} ({comp.part_number}) — units required: {comp.units}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      <button style={{backgroundColor: "#BDC1C3", color: "#1736D2", fontSize: "1rem"}}>Preview Inventory</button>
    </div>
  );

}

export default StentBOMBuild;