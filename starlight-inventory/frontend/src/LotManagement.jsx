import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function LotManagement(){
  const location = useLocation();
  const navigate = useNavigate();

  const partNumberArray = location.state?.partNumberArray || [];
  const quantity = location.state?.quantity || [];

  const [componentIndex, setComponentIndex] = useState(0);
  const [lotData, setLotData] = useState([]);
  const [inputValue, setInputValue] = useState(""); // Raw user input
  const [selectedIds, setSelectedIds] = useState([]);

  const currentComponent = partNumberArray[componentIndex];
  const isLastComponent = componentIndex === partNumberArray.length - 1;

  useEffect(() => {
    if (!currentComponent) return;
    fetch(`http://localhost:8000/lots?part_numbers=${currentComponent}`)
      .then((res) => res.json())
      .then((data) => {
        setLotData(data);
      })
      .catch((err) => console.error("Error fetching lots:", err));
  }, [currentComponent]);

  const addId = (id) => {
    setSelectedIds((prev) => [...prev, id]);
    setInputValue("");
  };

    const handleNext = () => {
    if (!isLastComponent) {
      setComponentIndex((prev) => prev + 1);
    } else {
      // Proceed to final screen
      navigate("/preview-inventory", {
        state: {
          quantity,
          selectedIds,
        },
      });
    }
  };

    return (
    <div style={{ margin: "2rem" }}>
      <h2 style={{ fontSize: "3rem" }}>Lot Management</h2>
      <h3 style={{ fontSize: "2rem" }}>
        Component {componentIndex + 1} of {partNumberArray.length}: {currentComponent}
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
                const selectedLot = lotData.find(lot => lot.unique_id === num);
                if (!selectedLot) {
                    alert("Invalid ID");
                    return;
                }

                if (selectedLot.quantity < quantity) {
                    navigate("/low-inv");
                    return;
                }
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

export default LotManagement;