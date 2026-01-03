import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReconcilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Safely read route state
  const unique_id = location.state?.unique_id;
  const components = location.state?.components ?? [];

  // Initialize adjustments safely
  const [adjustments, setAdjustments] = useState(() =>
    Object.fromEntries(components.map(component => [component, 0]))
  );

  function updateAdjustment(part, value) {
    setAdjustments(prev => ({
      ...prev,
      [part]: Number(value)
    }));
  }

  async function submitAdjustments() {
    try {
      const response = await fetch(`${API_URL}/reconcile-build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unique_id,
          adjustments
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reconcile build");
      }

      alert("Reconciliation complete.");
      navigate("/active-builds");
    } catch (error) {
      console.error(error);
      alert("Error submitting reconciliation.");
    }
  }

  // Guard against missing state
  if (!unique_id || components.length === 0) {
    return (
      <div style={{ padding: "20px", color: "white" }}>
        <h2>Error</h2>
        <p>No build data found. Please return and try again.</p>
        <button
          style={{ marginTop: "20px", padding: "10px" }}
          onClick={() => navigate("/active-builds")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Reconcile Components for Build {unique_id}</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid white" }}>Component</th>
            <th style={{ borderBottom: "1px solid white" }}>
              Adjustment (+ / -)
            </th>
          </tr>
        </thead>

        <tbody>
          {components.map(part => (
            <tr key={part}>
              <td>{part}</td>
              <td>
                <input
                  type="number"
                  value={adjustments[part]}
                  style={{ width: "80px" }}
                  onChange={e => updateAdjustment(part, e.target.value)}
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
