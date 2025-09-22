import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function PreviewInventory(lot) {
  const location = useLocation();
  const selectedIds = location.state?.selectedIds || [];
  const quantity = location.state?.quantity || 0;
  const navigate = useNavigate();

  const [lotPreviewData, setLotPreviewData] = useState([]);

  // Fetch data for selected IDs
  useEffect(() => {
    if (selectedIds.length === 0) return;

    const params = new URLSearchParams();
    selectedIds.forEach(id => params.append("unique_ids", id));

    fetch(`${API_URL}/lots-preview?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setLotPreviewData(data);
      })
      .catch(err => {
        console.error("Error fetching preview inventory", err);
        alert("Failed to fetch lot data.");
      });
  }, [selectedIds]);

    useEffect(() => {
    if (lot.quantity - quantity < 0) {
      navigate('/low-inv');
    }
  }, [lot, quantity, navigate]);

  const handleConfirm = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;

    const payload = [];

    lotPreviewData.forEach(lot => {
      const updated_quantity = lot.quantity - quantity;
      if (updated_quantity < 0) {
        navigate("/low-inv");
      } else {
        payload.push({
          unique_id: lot.unique_id,
          updated_quantity
        });
      }
    });

    fetch(`${API_URL}/update-lots?user_id=${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(result => {
        console.log("Update result:", result);
        alert("Inventory updated successfully!");
      })
      .catch(err => {
        console.error("Update failed:", err);
        alert("Failed to update inventory.");
      });
  };
  console.log(lotPreviewData)
  return (
    <div style={{ margin: "2rem" }}>
      <h2 style={{ fontSize: "2rem" }}>Preview Inventory</h2>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={cellStyle}>Unique ID</th>
            <th style={cellStyle}>Part Number</th>
            <th style={cellStyle}>Receiving Lot Number</th>
            <th style={cellStyle}>Supplier Lot Number</th>
            <th style={cellStyle}>Original Quantity</th>
            <th style={cellStyle}>After Subtracting</th>
          </tr>
        </thead>
        <tbody>
          {lotPreviewData.map(lot => (
            <tr key={lot.unique_id}>
              <td style={cellStyle}>{lot.unique_id}</td>
              <td style={cellStyle}>{lot.part_number}</td>
              <td style={cellStyle}>{lot.receiving_lot_number}</td>
              <td style={cellStyle}>{lot.supplier_lot_number}</td>
              <td style={cellStyle}>{lot.quantity}</td>
              <td style={cellStyle}>
                {lot.quantity - quantity < 0
                  ? `need ${-(lot.quantity - quantity)} more`
                  : lot.quantity - quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={()=>{handleConfirm(); navigate('/traveler', {
        state: {
          lotPreviewData
        }
      })}} style={buttonStyle}>
        Confirm & Update Inventory
      </button>
      <button onClick={() => navigate("/dashboard")} style={{ ...buttonStyle, marginLeft: "1rem" }}>
        Deny
      </button>
    </div>
  );
}

const cellStyle = {
  border: "1px solid black",
  padding: "0.5rem",
  color: "white",
};

const buttonStyle = {
  marginTop: "2rem",
  backgroundColor: "#BDC1C3",
  color: "#173D62",
  fontSize: "1.2rem",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
};

export default PreviewInventory;
