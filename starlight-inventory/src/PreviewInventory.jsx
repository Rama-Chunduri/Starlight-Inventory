import { useLocation, useNavigate } from "react-router-dom";

function PreviewInventory() {
  const location = useLocation();
  const selectedIdsPerComponent = location.state?.selectedIdsPerComponent || {};
  const components = location.state?.components || [];
  const allLotData = location.state?.allLotData || {};
  const navigate = useNavigate();

  function handleConfirm() {
  // Build payload with only selected unique_ids and their updated quantities
  const payload = [];

  Object.entries(selectedIdsPerComponent).forEach(([compId, selectedIds]) => {
    const lots = allLotData[compId] || [];
    selectedIds.forEach(id => {
      const lot = lots.find(l => l.unique_id === id);
      if (lot) {
        payload.push({
          unique_id: lot.unique_id,
          updated_quantity: Math.max(0, lot.quantity - 1)
        });
      }
    });
  });

  console.log("Payload to send:", payload);

  fetch("http://localhost:8000/update-lots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
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
}


  console.log("Selected IDs:", selectedIdsPerComponent);
  //console.log("Components:", components);
  console.log("All lot data:", allLotData);


  const componentMap = Object.fromEntries(
    components.map(c => [c.unique_id, c])
  );

  return (
    <div style={{ margin: "2rem" }}>
      <h2 style={{ fontSize: "2rem" }}>Preview Inventory</h2>

      {Object.entries(selectedIdsPerComponent).map(([compId, selectedIds]) => {
        const comp = componentMap[compId];
        const lots = allLotData[compId] || [];

        return (
          <div key={compId} style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem" }}>
              {comp?.description || "Unknown"} ({comp?.part_number}) — ID: {compId}
            </h3>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "0.5rem" }}>Unique ID</th>
                  <th style={{ border: "1px solid black", padding: "0.5rem" }}>Lot Name</th>
                  <th style={{ border: "1px solid black", padding: "0.5rem" }}>Original Quantity</th>
                  <th style={{ border: "1px solid black", padding: "0.5rem" }}>After Subtracting</th>
                </tr>
              </thead>
              <tbody>
                {lots.map(lot => {
                  const isSelected = selectedIds.includes(lot.unique_id);
                  const updatedQty = lot.quantity - (isSelected ? 1 : 0);
                  return (
                    <tr key={lot.unique_id}>
                      <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.unique_id}</td>
                      <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.lot_name}</td>
                      <td style={{ border: "1px solid black", padding: "0.5rem" }}>{lot.quantity}</td>
                      <td style={{ border: "1px solid black", padding: "0.5rem" }}>
                        {updatedQty < 0 ? 0 : updatedQty}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
                onClick={handleConfirm}
                style={{
                    marginTop: "2rem",
                    backgroundColor: "#BDC1C3",
                    color: "#173D62",
                    fontSize: "1.2rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px"
                }}
            >
            Confirm & Update Inventory
            </button>
            <button
                onClick={()=>navigate('/dashboard')}
                style={{
                    marginTop: "2rem",
                    backgroundColor: "#BDC1C3",
                    color: "#173D62",
                    fontSize: "1.2rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px"
                }}
            >
            Deny
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PreviewInventory;
