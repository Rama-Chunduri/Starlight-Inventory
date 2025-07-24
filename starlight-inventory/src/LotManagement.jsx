import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

function LotManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const components = location.state?.components || [];

  // Use useRef to accumulate allLotData without async state update problems
  const allLotDataRef = useRef({});

  const [componentIndex, setComponentIndex] = useState(0);
  const [lotData, setLotData] = useState([]);
  const [inputValue, setInputValue] = useState(""); // Raw user input
  const [selectedIdsPerComponent, setSelectedIdsPerComponent] = useState({});

  const currentComponent = components[componentIndex];
  const isLastComponent = componentIndex === components.length - 1;

  // Fetch lots only for current component’s part number
  useEffect(() => {
    if (!currentComponent?.part_number) return;

     const partNumbers = Array.isArray(currentComponent.part_number)
    ? currentComponent.part_number
    : [currentComponent.part_number];

  const params = new URLSearchParams();
  partNumbers.forEach((pn) => {
    params.append("part_numbers", pn);
  });
    console.log("Params string:", params.toString());

    //console.log("Fetching lots for", currentComponent.part_number);

    fetch(`http://localhost:8000/lots?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        console.log("Received lot data:", data);
        setLotData(data);

        // Accumulate lot data by component unique_id in ref
        allLotDataRef.current = {
          ...allLotDataRef.current,
          [currentComponent.unique_id]: data
        };
      });
  }, [currentComponent]);

  const handleNext = () => {
    const parsed = inputValue
      .split(",")
      .map(v => v.trim())
      .filter(v => v !== "")
      .map(Number)
      .filter(n => !isNaN(n));

    const updatedSelected = {
      ...selectedIdsPerComponent,
      [currentComponent.unique_id]: parsed
    };

    console.log("Parsed unique IDs:", parsed);
    console.log("Selected IDs per component:", updatedSelected);
    console.log("All lot data ref:", allLotDataRef.current);

    setSelectedIdsPerComponent(updatedSelected);
    setInputValue("");

    if (!isLastComponent) {
      setComponentIndex(prev => prev + 1);
    } else {
      // Flatten all selected unique IDs from all components
      const allUniqueIds = Object.values(updatedSelected).flat();

      navigate("/preview-inventory", {
        state: {
          uniqueIds: allUniqueIds,
          selectedIdsPerComponent: updatedSelected,
          components,
          allLotData: allLotDataRef.current
        }
      });
    }
  };

  return (
    <div style={{ margin: "2rem" }}>
      <h2 style={{ fontSize: "3rem" }}>Lot Management</h2>
      <h3 style={{ fontSize: "2rem" }}>
        Component {componentIndex + 1} of {components.length}:{" "}
        {currentComponent?.description || "Unknown"} ({currentComponent?.part_number || "N/A"})
      </h3>

      {lotData.length === 0 ? (
        <p style={{ fontSize: "2rem" }}>No lot data found</p>
      ) : (
        <table style={{ fontSize: "1.5rem", borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Unique Id</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Lot Name</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Quantity</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Part Number</th>
            </tr>
          </thead>
          <tbody>
            {lotData.map((lot, idx) => (
              <tr key={lot.unique_id || idx}>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.unique_id}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.lot_name}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.quantity}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.part_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ fontSize: "1.5rem" }}>Enter Unique IDs (comma-separated)</h3>
      <input
        placeholder="Enter unique ids"
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        style={{
          marginLeft: "2rem",
          fontSize: "1rem",
          backgroundColor: "#BDC1C3",
          padding: "0.5rem",
          color: "#173D62",
          borderRadius: "8px",
          width: "100%",
          maxHeight: "150px",
          overflowY: "auto",
          border: "1px solid #ccc"
        }}
      />

      <button
        style={{
          margin: "1rem",
          backgroundColor: "#BDC1C3",
          color: "#173D62",
          fontSize: "1.2rem",
          padding: "0.5rem 1rem",
          borderRadius: "8px"
        }}
        onClick={handleNext}
      >
        {isLastComponent ? "Preview Inventory" : "Next Component"}
      </button>
    </div>
  );
}

export default LotManagement;


