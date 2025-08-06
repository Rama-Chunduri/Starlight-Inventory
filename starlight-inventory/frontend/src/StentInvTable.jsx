import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"
import quantities from "./quantities"

const API_URL = import.meta.env.VITE_API_URL;

function StentInvTable(){
    const [data, setData] = useState([])
    const [dropdownPos, setDropdownPos] = useState([])
    const [editValue, setEditValue] = useState("")
    const [editingCell, setEditingCell] = useState("")
    
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const response = await fetch(`${API_URL}/stent-inventory-table-view`)
                const result = await response.json()
                setData(result)
            }
            catch(error){
                console.error("Error fetching the stent inventory", error)
            }
        }
        fetchData()
    }, [])

        const lowQuantityComponents = data
            .filter(row => {
            const q = quantities.find(q => q.name === row.description);
            return q && parseInt(row.quantity) < q.low_quantity})
            .map(row => row.description); 
        console.log(lowQuantityComponents)

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
      const res = await fetch(`h${API_URL}/stent-inventory-delete-row`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: row.id }),
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
            const res = await fetch(`${API_URL}/stent-inventory-update`, {
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

    if (data.length === 0) return <div style={{marginLeft: "50vh", fontSize: "5vh"}}>Loading...</div>;
    const columns = Object.keys(data[0]);

    
    return (
        <div style={{padding:'2rem', color:'white', position:'relative', marginBottom: '4rem'}}>
            <h1>Stent Inventory Table</h1>
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
                        <tr key={row.id}>
                            {columns.map((colKey)=>{
                                const isEditing = 
                                    editingCell && 
                                    editingCell.rowIdx === idx && 
                                    editingCell.colKey === colKey
                                    return(
                                       <td
                                            key={`${row.id}-${colKey}`}  
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
            <div style={{
                position: "fixed",
                top: "1rem",
                right: "1rem",
                backgroundColor: "pink",
                borderRadius: "8px",
                padding: "1rem"
            }}>
                <h1 style={{
                    color: "#173D62",
                    backgroundColor: "pink",
                    fontSize: "2rem",
                    marginTop: "2rem"
                }}>
                Low Inventory Components
                </h1>

                <ul style={{
                    backgroundColor: "pink",
                    padding: "1rem",
                    color: "#173D62",
                    borderRadius: "8px"
                }}>
                    {lowQuantityComponents.length === 0 ? (
                    <li style={{backgroundColor: "pink"}}>No low inventory components</li>
                ) : (
                    lowQuantityComponents.map((name) => (
                    <li key={name} style={{ backgroundColor: "pink" }}>{name}</li>
                    ))
                    )}
                </ul>
            </div>

        </div>
    )
}

export default StentInvTable