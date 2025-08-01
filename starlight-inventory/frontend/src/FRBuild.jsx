import { useNavigate } from "react-router-dom";
import {useState, useEffect} from "react"
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL;

function FRBuild(){
  const [selectedKitIds, setSelectedKitIds] = useState([]);
  const [kitsData, setKitsData] = useState([]);
  const availableKits = [
    { id: 1, name: "Final Product, Flow Restrictor (Diameter), Pusher Tube Delivery System, Sterilized Starlight Stent Systems DDPC32" },
    { id: 3, name: "Final Packaging, Flow Restrictor, Pusher Tube Delivery System Unsterilized" },
    { id: 4, name: "Packaging, Pusher Tube Delivery System, (Diameter)" },
    //{ id: 6, name: "Lifeline Stent Shelf Carton & Pouch Label" },
    { id: 9, name: "Final Assembly, Pusher Tube Flow Restrictor System, (Diameter)" },
    { id: 11, name: "Peel Away Transfer Sheath" },
    { id: 13, name: "Unflared Transfer Sheath" },
    { id: 15, name: "Tuba Complex" },
    { id: 21, name: "Assembly, Flow Restrictor, Covered (Diameter), Coated" },
    { id: 23, name: "Assembly, Flow Restrictor, Covered (Diameter)" },
    { id: 25, name: "Assembly, Flow Restrictor, Uncovered (Diameter)" },
    { id: 27, name: "Flow Restrictor, (Diameter)" },
    { id: 30, name: "Assembly Pusher Tube, Coated" },
    { id: 31, name: "Assembly Pusher Tube, Uncoated" },
    { id: 33, name: "End Effector" },
    { id: 35, name: "Retainment Adapter" },
    { id: 37, name: "Proximal LCT" },
    { id: 43, name: "Assembly, Mid-Shaft, Coated" },
    { id: 44, name: "Assembly, Mid-Shaft" },
    { id: 46, name: "Shaft Body Assembly" },
    { id: 52, name: "Final Packaging, Braided Catheter, Unsterilized" },
    { id: 54, name: "Catheter Packaging Hoop" },
    { id: 55, name: "Assembly, Braided Catheter, Coated" },
    { id: 57, name: "Assembly, Catheter, pre-Coated" },
    { id: 63, name: "Distal Catheter" },
    { id: 71, name: "Final Packaging, LCHT Catheter, Unsterilized" },
    { id: 72, name: "Catheter Packaging Serilization Bag" },
    { id: 73, name: "Catheter Packaging Hoop" },
    { id: 74, name: "Assembly, 055 LCHT Catheter, Coated" },
    { id: 76, name: "Assembly, 055 LCHT Catheter" },
    { id: 86, name: "Final Packaging, Dilator, unsterilized" },
    { id: 88, name: "Dilator Packaging Hoop" },
    { id: 89, name: "Assembly, Dilator" },
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
    fetch(`${API_URL}/frkits?ids=${query}`)
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

export default FRBuild;