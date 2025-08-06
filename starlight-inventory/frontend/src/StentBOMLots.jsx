import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL;

function StentBOMLots(){
    const [data, setData] = useState([])
    const [dropdownPos, setDropdownPos] = useState([])
    const [editValue, setEditValue] = useState("")
    const [editingCell, setEditingCell] = useState("")
    const [rejectState, setRejectState] = useState("all");
    
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const response = await fetch(`${API_URL}/stent-lots-table-view?rejectState=${rejectState}`)
                const result = await response.json()
                setData(result)
            }
            catch(error){
                console.error("Error fetching the stent inventory", error)
            }
        }
        fetchData()
    }, [rejectState])


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
      const res = await fetch(`${API_URL}/stent-lots-delete-row`, {
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


    const handleEditConfirm = async () => {
        if(!editingCell) return 
        const {rowIdx, colKey} = editingCell
        const row = data[rowIdx]
        const updatedRow = {...row, [colKey]: editValue}
        try {
            const res = await fetch(`${API_URL}/stent-lots-update`, {
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
    //console.log(data)
    if (data.length === 0) return <div style={{marginLeft: "40rem", fontSize: "5vh"}}>Loading...</div>;
    const columns = Object.keys(data[0]);

    
    return (
        <div style={{padding:'2rem', color:'white', position:'relative'}}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <button style={{backgroundColor: "#BDC1C3", color: "#173D62", margin: "1rem"}} onClick={()=>setRejectState("reject")}>See Rejects</button>
                <button style={{backgroundColor: "#BDC1C3", color: "#173D62", margin: "1rem"}} onClick={()=>setRejectState("accept")}>See Accepts</button>
                <button style={{backgroundColor: "#BDC1C3", color: "#173D62", margin: "1rem"}} onClick={()=>setRejectState("all")}>See All</button>
            </div>
            <h1>Stent Lots Table</h1>
            <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        {columns.map((key) => (
                            <th key={key} style={{ padding: "0.5rem" }}>{key}</th>
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
                                            key={`${row.unique_id}-${colKey}`}  
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
                        onClick={handleEditClick}
                    >
                        Edit Cell
                    </div>
                    <div
                        style={{ padding: "8px", cursor: "pointer", color: "red", backgroundColor: "lightblue" }}
                        onClick={handleDeleteClick}
                    >
                        Delete Row
                    </div>
                </div>
            )}

        </div>
    )
}

export default StentBOMLots