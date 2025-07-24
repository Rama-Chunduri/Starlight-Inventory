import { useNavigate } from "react-router-dom";
import {useState, useEffect} from "react"
import './Dashboard.css'

function StentBOMBuild(){
  const [selectedKitIds, setSelectedKitIds] = useState([]);
  const [kitsData, setKitsData] = useState([]);
  const [quantities, setQuantities] = useState({}); //filled with part numbers
  const [descriptionToQuantity, setDescriptionToQuantity] = useState({});
  const [componentQuantities, setComponentQuantities] = useState({});  // For quantities (numbers)
  const [kitQuantities, setKitQuantities] = useState({});
  const navigate = useNavigate()
  const availableKits = [
    { id: 0, name: "Sterilized Starlight Stent Systems DDPC32" },
    //{ id: 2, name: "Unsterilized Starlight Stent Systems DDPC32" },
    { id: 4, name: "Packaged Starlight Stent System DDPC32" },
    //{ id: 6, name: "Lifeline Stent Shelf Carton & Pouch Label" },
    { id: 13, name: "Starlight Stent System DDPC32" },
    //{ id: 16, name: "Stent DDPC32" },
    { id: 25, name: "Uncoated Pusher Tube DDPC32" },
    { id: 37, name: "Uncoated Catheter DDPC32" },
    { id: 44, name: "Distal Catheter DDPC32" },
    { id: 45, name: "Catheter Braid" },
  ];

  const allowedDescriptions = [
    "Catheter Extrusions DDPC32", "Starlight Stent System DDPC32", "Stent Assembly DDPC32", "Coated Pusher Tube DDPC32", "Distal LCT DDPC32"
  ]

  const calculateSubcomponentQuantities = () => {
  const result = {};
  kitsData.forEach(kit => {
    const kitId = kit.id;
    const qty = parseInt(kitQuantities[kitId]) || 0;

    kit.components.forEach(comp => {
      const key = `${comp.description}_${comp.part_number}`;
      result[key] = (result[key] || 0) + qty;
    });
  });
  return result;
};

const subcomponentQuantities = calculateSubcomponentQuantities();

useEffect(() => {
  const updated = { ...quantities };
  const allComponents = kitsData.flatMap(kit => kit.components);

  allComponents.forEach(comp => {
    const hasInput = allowedDescriptions.includes(comp.description);
    const key = hasInput ? comp.unique_id || `${comp.description}_${comp.part_number}` : comp.description;

    if (!(key in updated)) {
      updated[key] = hasInput ? "" : comp.part_number;
    }
  });

  setQuantities(updated);
}, [kitsData]);

useEffect(() => {
  const initialQuantities = {};
  const allComponents = kitsData.flatMap(kit => kit.components);

  allComponents.forEach(comp => {
    const key = comp.unique_id || `${comp.description}_${comp.part_number}`;
    if (!(key in componentQuantities)) {
      initialQuantities[key] = 0; // start with 0 quantity
    }
  });

  setComponentQuantities(prev => ({ ...initialQuantities, ...prev }));
}, [kitsData]);




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
    console.log("hello")
    console.log(kitsData);
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
            onChange={e => {
  const kitQty = parseInt(e.target.value) || 0;

  // Update kit quantities first
  setKitQuantities(prev => {
    const updatedKitQuantities = { ...prev, [kit.id]: kitQty };

    // Now recalc all component quantities based on updated kit quantities
    const updatedComponentQuantities = {};

    kitsData.forEach(kit => {
      const qty = updatedKitQuantities[kit.id] || 0;
      kit.components.forEach(comp => {
        const key = comp.unique_id || `${comp.description}_${comp.part_number}`;
        updatedComponentQuantities[key] = (updatedComponentQuantities[key] || 0) + qty;
      });
    });

    setComponentQuantities(updatedComponentQuantities);

    return updatedKitQuantities;
  });
}}

            value={kitQuantities[kit.id] || ""}
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
                  {allowedDescriptions.includes(comp.description) && (<input 
                    type="text"
                    placeholder="Enter part number"
                    style={{
                      marginLeft: "1rem",
                      backgroundColor: "#BDC1C3",
                      color: "#173D62",
                      borderRadius: "8px",
                      height: "1rem",
                      padding: "0.5rem",
                      fontSize: "1rem",
                    }}
                    onChange={e =>{
                        const value = e.target.value;
                        setQuantities(prev => ({
                        ...prev,
                        [comp.unique_id]: value
                      }));
                      setDescriptionToQuantity(prev => ({
                      ...prev,
                      [comp.description]: value,
                    }));
                    }}
                  />)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      <button onClick={() => {
                              const partNumbers = Object.values(quantities).filter(q => q !== "");
                              navigate("/lot-management", {
                                state: {
                                  partNumbers: Object.values(quantities).filter(q => q !== ""),
                                  quantities, componentQuantities,
                                  components: kitsData[0]?.components || []
                                }
                              });

                            }}
              style={{backgroundColor: "#BDC1C3", color: "#1736D2", fontSize: "1rem", margin: "1rem"}}>
              Next
      </button>
    </div>
  );

}

export default StentBOMBuild;