import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReconcilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const partNumberArray = location.state?.partNumberArray || [];

  const { unique_id, components } = state;

  const [adjustments, setAdjustments] = useState(
    Object.fromEntries(components.map(c => [c, 0]))
  );

  function updateAdjustment(part, value) {
    setAdjustments(prev => ({
      ...prev,
      [part]: Number(value)
    }));
  }

  async function submitAdjustments() {
    await fetch(`${API_URL}/reconcile-build`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unique_id,
        adjustments
      })
    });

    alert("Reconciliation complete.");
    navigate("/active-builds");
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Reconcile Components for Build {unique_id}</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid white" }}>Component</th>
            <th style={{ borderBottom: "1px solid white" }}>Adjustment (+/-)</th>
          </tr>
        </thead>

        <tbody>
          {components.map(part => (
            <tr key={part}>
              <td>{part}</td>
              <td>
                <input
                  type="number"
                  style={{ width: "80px" }}
                  onChange={(e) => updateAdjustment(part, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        style={{ marginTop: "20px", padding: "10px", width: "200px" }}
        onClick={submitAdjustments}
      >
        Submit Reconciliation
      </button>
    </div>
  );
}
