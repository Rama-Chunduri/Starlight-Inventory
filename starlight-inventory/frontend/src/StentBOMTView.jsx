import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL;

function StentBOMTView(){
    const [data, setData] = useState([])
    const [dropdownPos, setDropdownPos] = useState([])
    const [editValue, setEditValue] = useState("")
    const [editingCell, setEditingCell] = useState("")
    const [rowInfo, setRowInfo] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null);
    const [editingLotIndex, setEditingLotIndex] = useState(null);
    const [editingLotValue, setEditingLotValue] = useState("");
    const [editableLots, setEditableLots] = useState([]);
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const response = await fetch(`${API_URL}/stent-bom-table-view`)
                const result = await response.json()
                setData(result)
            }
            catch(error){
                console.error("Error fetching the stent bom", error)
            }
        }
        fetchData()
    }, [])

    const handleCellClick = (e, rowIdx, colKey) => {
        //if(colKey === "quantity") return;     remove comment later
        e.stopPropagation()
        const rect = e.target.getBoundingClientRect()
        setDropdownPos({rowIdx, colKey, x:rect.right, y:rect.bottom})
    }


    const handleDeleteClick = async () => {
    if (!dropdownPos) return;
    const { rowIdx } = dropdownPos;
    const row = data[rowIdx];

    try {
      const res = await fetch(`${API_URL}/stent-bom-delete-row`, {
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

    const handleLotQuantityChange = (lotIndex, newQuantity) => {
        const updatedLots = [...editableLots];
        updatedLots[lotIndex].quantity = newQuantity;
        setEditableLots(updatedLots);
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
            const res = await fetch(`${API_URL}/stent-bom-update`, {
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

    if (data.length === 0) return <div style={{marginLeft: "30rem", size: "3rem"}}>Loading...</div>;
    const columns = Object.keys(data[0]);
    
    return (
        <div style={{padding:'2rem', color:'white', position:'relative'}}>
            <h1>Stent BOM Table View</h1>
            <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
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
                        style={{ padding: "8px", cursor: "pointer", backgroundColor: "#173D62" }}
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
            {rowInfo && selectedRow &&(
                        <div
                            style={{
                                backgroundColor: "pink",
                                position: "absolute", 
                                top: 40, 
                                right: -700, 
                                padding: "1rem", 
                                color: "#173D62",
                                borderRadius: "8px"

                            }}
                        >
                            <h1 style={{backgroundColor: "pink", fontSize: "2rem"}}>Lot Information:</h1>
                            <h2 style={{backgroundColor: "pink", fontSize: "1.2rem"}}>Quantity</h2>
                            <ul style={{ backgroundColor: "pink", fontSize: "1.2rem" }}>
                                {editableLots.map((lot, i) => (
                                    <li key={i} style={{ backgroundColor: "pink", fontSize: "1.2rem" }}>
                                        {lot.name}:{' '}
                                        {editingLotIndex === i ? (
                                        <input
                                            style={{ backgroundColor: "pink", fontSize: "1.2rem", width: "60px" }}
                                            type="text"
                                            value={editingLotValue}
                                            onChange={(e) => setEditingLotValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    const num = parseInt(editingLotValue, 10);
                                                    if (!isNaN(num)) {
                                                        handleLotQuantityChange(i, num);
                                                        setQuantity(prev =>
                                                        prev.map(component => {
                                                        if (component.name === selectedRow.description) {
                                                            const updatedLots = [...component.lots];
                                                            updatedLots[i].quantity = num;
                                                            return { ...component, lots: updatedLots };
                                                        }
                                                        return component;
                                                        })
                                                        );
                                                    }
                                                setEditingLotIndex(null);
                                                setEditingLotValue("");
                                            }

                                                if (e.key === "Escape") {
                                                    setEditingLotIndex(null);
                                                    setEditingLotValue(""); // optional
                                                }
                                            }}
                                            autoFocus
                                        />
                                        ) : (
                                        <span
                                            style={{ backgroundColor: "pink", fontSize: "1.2rem", cursor: "pointer" }}
                                            onClick={() => {
                                                setEditingLotIndex(i);
                                                setEditingLotValue(String(lot.quantity)); // preload the input with current quantity
                                            }}
                                        >
                                            {lot.quantity}
                                        </span>
                                    )}
                                </li>
                            ))}
                            </ul>
                        </div>
            )}
        </div>
    )
}

export default StentBOMTView