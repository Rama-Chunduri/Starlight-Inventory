import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

function LotManagementxx() {
  const location = useLocation();
  const navigate = useNavigate();
  const components = location.state?.components || [];
  const partNumbersArray = location.state?.partNumbersArray || [];
  const quantity = location.state?.quantity || [];
  const [allLotData, setAllLotData] = useState({});
  const [componentIndex, setComponentIndex] = useState(0);
  const [lotData, setLotData] = useState([]);
  const [inputValue, setInputValue] = useState(""); // Raw user input
  const [selectedIds, setSelectedIds] = useState([]);

  const currentComponent = components[componentIndex];
  const isLastComponent = componentIndex === components.length - 1;
  const allLotDataRef = useRef({});

  // Fetch lots only for current component’s part number
  useEffect(() => {
    const currentPartNumber = partNumbersArray[componentIndex];
    if (!currentComponent?.part_number) return;

     const normalizedPartNumbersArray = Array.isArray(currentPartNumber)
    ? currentPartNumber
    : [currentPartNumber];

  const params = new URLSearchParams();
  normalizedPartNumbersArray.forEach((pn) => {
    params.append("part_numbers", pn);
  });
   fetch(`http://localhost:8000/lots?${params.toString()}`)
  .then(res => res.json())
  .then(data => {
    setLotData(data);

    // Use ref to avoid stale updates
    allLotDataRef.current = {
      ...allLotDataRef.current,
      [currentComponent.unique_id]: data
    };

    setAllLotData(prev => {
      return {
        ...prev,
        [currentComponent.unique_id]: data
      };
    });
  });

  }, [currentComponent]);


  console.log("allLotData")
  console.log(allLotData)

const addId = (id) => {
  setSelectedIds(prev => {
    if (prev.includes(id)) return prev; // avoid duplicates
    return [...prev, id];
  });
  setInputValue("");
};
;

const handleNext = () => {
  const num = Number(inputValue.trim());
  if (!isNaN(num) && inputValue.trim() !== "") {
    addId(num);
  }

  if (isLastComponent) {
    navigate("/preview-inventory", {
      state: {
        uniqueIds: selectedIds,
        selectedIds, // flat array of all input IDs
        components,
        allLotData,
        quantity
      }
    });
  } else {
    setComponentIndex(prevIndex => prevIndex + 1);
  }

  setInputValue(""); // clear the input
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
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Receiving Lot Number</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Receipt Date</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Part Number</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Rev</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Description</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Supplier Name</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Supplier Lot Number</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Quantity</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Expiration Date</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Human Use</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {lotData.map((lot, idx) => (
              <tr key={lot.unique_id || idx}>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.unique_id}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.receiving_lot_number}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.receipt_date}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.part_number}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.rev}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.description}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.supplier_name}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.supplier_lot_number}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.quantity}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.expiration_date}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.human_use}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ fontSize: "1.5rem" }}>Enter Unique ID of interested lot</h3>
      <input
        placeholder="Enter unique id and press Enter"
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            const num = Number(inputValue.trim());
              if (!isNaN(num) && inputValue.trim() !== "") {
                addId(num);
              }
          }
        }}
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

export default LotManagementxx;