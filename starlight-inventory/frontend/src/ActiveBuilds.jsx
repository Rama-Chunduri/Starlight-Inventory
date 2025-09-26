import { useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL;

function ActiveBuilds(){
    const [data, setData] = useState([])
    const [dropdownPos, setDropdownPos] = useState([])
    const [editValue, setEditValue] = useState("")
    const [editingCell, setEditingCell] = useState("")
    const navigate = useNavigate()
    const location = useLocation();
    const fileBase64 = location.state?.file;

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const response = await fetch(`${API_URL}/active-builds-view`)
                const result = await response.json()
                setData(result)
            }
            catch(error){
                console.error("Error fetching the active builds", error)
            }
        }
        fetchData()
    }, [])

    const handleCellClick = (e, rowIdx, colKey) => {
        e.stopPropagation()
        const rect = e.target.getBoundingClientRect()
        setDropdownPos({rowIdx, colKey, x:rect.right, y:rect.bottom})
    }

    const handleDeleteClick = async () => {
    if (!dropdownPos) return;
    const { rowIdx } = dropdownPos;
    const row = data[rowIdx];

    try {
      const res = await fetch(`${API_URL}/active-builds-delete-row`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unique_id: row.unique_id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setData(data.filter((_, idx) => idx !== rowIdx));
    } catch (err) {
      alert("Failed to delete row: " + err.message);
    }

    setDropdownPos(null);
  };


    const handleEditClick = () => {
    if (!dropdownPos) return;
    const { rowIdx, colKey } = dropdownPos;
    const cellValue = data[rowIdx][colKey];
    setEditingCell({ rowIdx, colKey });
    setEditValue(cellValue);
    setDropdownPos(null); 
};

    const handleOpenFile = () => {
  if (!dropdownPos) return;
  const { rowIdx, colKey } = dropdownPos;
  const row = data[rowIdx];
  const base64String = row[colKey]; // assumes cell contains base64 string

  if (!base64String) {
    alert("No file found in this cell.");
    return;
  }

  try {
    // Convert base64 → Blob → URL
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // You can change MIME type based on your files, e.g., "application/pdf"
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank"); // open in new tab
  } catch (err) {
    alert("Failed to open file: " + err.message);
  }

  setDropdownPos(null);
};


    const handleEditConfirm = async () => {
        if(!editingCell) return 
        const {rowIdx, colKey} = editingCell
        const row = data[rowIdx]
        const updatedRow = {...row, [colKey]: editValue}
        try {
            const res = await fetch(`${API_URL}/implant-inventory-update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRow),
            });

            if (!res.ok) throw new Error("Update failed");  
            const newData = [...data]
            newData[rowIdx] = updatedRow
            setData(newData)
        }
        catch(err){
            alert("Failed to update cell: " + err.message);
        }
        setEditingCell(null);
    }

    const handleEditCancel = () => setEditingCell(null)

    useEffect(()=>{
        const handleClickOutside = () => {
            setDropdownPos(null);
        };
        window.addEventListener("click", handleClickOutside)
        return () => window.removeEventListener("click", handleClickOutside)
    }, [])

    if (data.length === 0) return <div style={{marginLeft: "40rem", fontSize: "5vh"}}>Loading...</div>;
    const columns = Object.keys(data[0]);
    
    return (
        <div style={{padding:'2rem', color:'white', position:'relative'}}>
            <h1>Active Builds Table</h1>
            <table border="1" style={{ borderCollapse: "collapse", width: "100%", marginBottom: "4rem"}}>
                <thead>
                    <tr>
                        {columns.map((key, index)=>(
                            <th key={index} style={{ padding: "0.5rem" }}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row,idx)=>(
                        <tr key={row.unique_id}>
                            {columns.map((colKey)=>{
                                const isEditing = 
                                    editingCell && 
                                    editingCell.rowIdx === idx && 
                                    editingCell.colKey === colKey
                                    return(
                                        <td
                                            key={colKey}
                                            onClick={(e) => !isEditing && handleCellClick(e, idx, colKey)}
                                            style={{ cursor: isEditing ? "auto" : "pointer", padding: "0.5rem"}}
                                        >
                                            {isEditing ? (
                                                <>
                                                <input
                                                value={editValue}
                                                onChange={(e)=>setEditValue(e.target.value)}
                                                autoFocus
                                                onKeyDown={(e)=>{
                                                    if(e.key === "Enter") handleEditConfirm()
                                                    if(e.key === "Escape") handleEditCancel()
                                                }}/>
                                                <button onClick={handleEditConfirm}>
                                                    Confirm
                                                </button>
                                                <button onClick={handleEditCancel}>
                                                    Cancel
                                                </button>
                                                </>
                                            ):(
                                                row[colKey]
                                            )}
                                        </td>
                                    )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            {dropdownPos && (
                <div
                style={{
                    position: "fixed",
                    top: dropdownPos.y + 5,
                    left: dropdownPos.x + 5,
                    backgroundColor: "gray",
                    border: "1px solid #ccc",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                    padding: "5px",
                    borderRadius: "4px",
                    color: "white",
                    width: "120px",
                }}>
                    <div
                        style={{ padding: "8px", cursor: "pointer" }}
                        onClick={handleOpenFile}
                    >
                       Open File
                    </div>
                    <div
                        style={{ padding: "8px", cursor: "pointer", color: "red", backgroundColor: "lightblue" }}
                        onClick={handleDeleteClick}
                    >
                         Close Build
                    </div>
                </div>
            )}
        </div>
    )
}

export default ActiveBuilds