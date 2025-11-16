import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function ActiveBuilds() {
  const location = useLocation();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dropdownPos, setDropdownPos] = useState(null); // fixed: was []

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/active-builds`);
        if (!res.ok) throw new Error("Failed to fetch builds");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRows(data);
          setColumns(Object.keys(data[0]));
        }
      } catch (err) {
        console.error("Error loading builds:", err);
      }
    };
    fetchData();
  }, []);

  const handleContextMenu = (e, rowIdx, colKey) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ rowIdx, colKey, x: rect.right, y: rect.bottom });
  };

  const closeDropdown = () => setDropdownPos(null);

const handleOpenFile = () => {
  if (!dropdownPos) return;

  const { rowIdx, colKey } = dropdownPos;
  if (colKey !== "file") return;

  const row = rows[rowIdx];
  let base64String = row[colKey];

  if (!base64String) {
    alert("No file found in this cell.");
    return;
  }

  try {
    // 1. Remove data URL prefix if present
    if (base64String.startsWith("data:")) {
      base64String = base64String.split(",")[1];
    }

    // 2. Remove whitespace/newlines (common error)
    base64String = base64String.replace(/\s/g, "");

    // 3. Decode base64 → binary
    const byteCharacters = window.atob(base64String);
    const byteArray = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    // 4. Create PDF blob
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // 5. Open new tab
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    console.error("Failed to decode file:", err);
    alert("Invalid file format.");
  }

  closeDropdown();
};


  const handleCloseBuild = async () => {
    if (!dropdownPos) return;
    const { rowIdx } = dropdownPos;
    const row = rows[rowIdx];

    try {
      const res = await fetch(`${API_URL}/close-build/${row.unique_id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to close build");

      setRows((prev) => prev.filter((r) => r.unique_id !== row.unique_id));
    } catch (err) {
      console.error("Error closing build:", err);
    }

    closeDropdown();
  };

  const handleEditClick = () => {
    if (!dropdownPos) return;
    const { rowIdx, colKey } = dropdownPos;
    const row = rows[rowIdx];

    const newValue = prompt(`Edit value for ${colKey}:`, row[colKey]);
    if (newValue !== null) {
      setRows((prev) => {
        const updated = [...prev];
        updated[rowIdx] = { ...row, [colKey]: newValue };
        return updated;
      });
    }

    closeDropdown();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Active Builds</h2>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", color: "white"  }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={row.unique_id}>
              {columns.map((colKey) => (
                <td
                  key={colKey}
                  onContextMenu={(e) => handleContextMenu(e, rowIdx, colKey)}
                  style={{ cursor: "context-menu" }}
                >
                  {colKey === "file"
                    ? "[PDF]"
                    : String(row[colKey] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {}
      {dropdownPos && (
        <div
          style={{
            position: "absolute",
            top: dropdownPos.y,
            left: dropdownPos.x,
            background: "white",
            border: "1px solid black",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
            zIndex: 1000,
            color: "white" 
          }}
        >
          {/* Only show Open File on file column */}
          {dropdownPos.colKey === "file" && (
            <div
              style={{ padding: "8px", cursor: "pointer", color: "white"  }}
              onClick={handleOpenFile}
            >
              Open File
            </div>
          )}

          {/* Generic edit for all other columns */}
          {dropdownPos.colKey !== "file" && (
            <div
              style={{ padding: "8px", cursor: "pointer", color: "white"  }}
              onClick={handleEditClick}
            >
              Edit Cell
            </div>
          )}

          <div
            style={{ padding: "8px", cursor: "pointer", color: "red" }}
            onClick={handleCloseBuild}
          >
            Close Build
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveBuilds;
