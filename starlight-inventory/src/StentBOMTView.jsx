import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"

const quantities = [
    	{name: "Sterilized Starlight Stent Systems DDPC32", low_quantity: 8, 
            lots: [
                {name: "lot1", quantity: 5},
                {name: "lot2", quantity: 3}
            ]
        },
        {name: "DA Stent System Sterilization Cycle Specification", low_quantity: 8, 
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Unsterilized Starlight Stent Systems DDPC32", low_quantity: 8,  lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]},
        {name: "Starlight Stent System Shipper Box", low_quantity: 8, 
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Packaged Starlight Stent System DDPC32", low_quantity: 8, 
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Shelf Carton", low_quantity: 8,  lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]},
        {name: "Lifeline Stent Shelf Carton & Pouch Label Printed Static Artwork", low_quantity: 8, 
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Lifeline Stent Instructions For Use", low_quantity: 8, 
              lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Tyvek Pouch" , low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Hoop Support Card" , low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name:"Starlight Stent System DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Stent Assembly DDPC32", low_quantity:8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Stent Radiopaque Markers DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Stent DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Rotating Hemostatic Valve", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Hub Housing DDPC32" , low_quantity:8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Hub Bushing DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Strain Relief DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Coated Pusher Tube DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Uncoated Pusher Tube DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Proximal Lct DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Liner DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Distal Outer Extrusion DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Distal LCT DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Marker Band DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Distal LCT DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Marker Band DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Retainer DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Masking Heat Shrink", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "PTFE Coated Pusher Coating Mandrel", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Assembly DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Uncoated Catheter DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Hub", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Strain Relief DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Taper Pebax 25D DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Taper Pebax 72D DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "PTFE Coated Catheter Coating Mandrel", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Distal Catheter DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Braid", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Braid Ribbon", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Fiber DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Pet Shrink DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Liner DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Marker DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Extrusions DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        }
]



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
                const response = await fetch("http://localhost:8000/stent-bom-table-view")
                const result = await response.json()
                setData(result)
            }
            catch(error){
                console.error("Error fetching the implant inventory", error)
            }
        }
        fetchData()
    }, [])

    const handleCellClick = (e, rowIdx, colKey) => {
        //if(colKey === "quantity") return;
        e.stopPropagation()
        const rect = e.target.getBoundingClientRect()
        setDropdownPos({rowIdx, colKey, x:rect.right, y:rect.bottom})
    }


    const handleDeleteClick = async () => {
    if (!dropdownPos) return;
    const { rowIdx } = dropdownPos;
    const row = data[rowIdx];

    try {
      const res = await fetch(`http://localhost:8000/stent-bom-delete-row`, {
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

    const lowQuantityComponents = data
        .filter(row => parseInt(row.quantity) < quantities[row.description])
        .map(row => row.description); 

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
            const res = await fetch("http://localhost:8000/stent-bom-update", {
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

    if (data.length === 0) return <div>Loading...</div>;
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
                        style={{ padding: "8px", cursor: "pointer", backgroundColor: "lightblue" }}
                        onClick={handleEditClick}
                    >
                        Edit Cell
                    </div>
                    <div
                        style={{ padding: "8px", cursor: "pointer" }}
                        onClick={() => {
                            const { rowIdx } = dropdownPos;
                            setSelectedRow(data[rowIdx]);
                            const component = quantities.find(q => q.name === data[rowIdx].description);
                            if (component) {
                                setEditableLots(JSON.parse(JSON.stringify(component.lots))); // deep copy to avoid mutation
                            }
                            setRowInfo(true);
                        }}

                    >
                        Row Info
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
                                {quantities
                                .filter(component => component.name === selectedRow.description)
                                .flatMap(component =>
                                component.lots.map((lot, i) => (
                                <li key={i} style={{ backgroundColor: "pink", fontSize: "1.2rem" }}>
                                    {lot.name}:{' '}
                                    {editingLotIndex === i ? (
                                    <>
                                        <input
                                            type="number"
                                            value={editingLotValue}
                                            onChange={(e) => setEditingLotValue(e.target.value)}
                                            onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const updatedLots = [...editableLots];
                                                updatedLots[i].quantity = parseInt(editingLotValue) || 0;
                                                setEditableLots(updatedLots);
                                                setEditingLotIndex(null);
                                            }
                                            if (e.key === "Escape") {
                                                setEditingLotIndex(null);
                                            }
                                            }}
                                            autoFocus
                                            style={{ width: "60px" }}
                                        />
                                    </>
                                    ) : (
                                        <span
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setEditingLotIndex(i);
                                                setEditingLotValue(lot.quantity.toString());
                                            }}
                                        >
                                            {lot.quantity}
                                        </span>
                                        )}
                                </li>

                            ))
                            )}
                            </ul>
                            <button style={{margin: "0.2rem"}}>Add Lot</button>
                            <button style={{margin: "0.2rem"}}>Delete Lot</button>

                        </div>
            )}
            {!rowInfo && (<div
                style={{
                        backgroundColor: "pink",
                        position: "absolute", 
                        top: 40, 
                        right: -700, 
                        padding: "1rem", 
                        color: "#173D62",
                        borderRadius: "8px"

            }}>
                <h1 style={{color: "#173D62", backgroundColor: "pink", fontSize: "2rem"}}>Low Inventory Components</h1>
                {
                    <ul style={{backgroundColor: "pink"}}>
                    {lowQuantityComponents.map((name, index) => (
                        <li key={index} style={{backgroundColor: "pink"}}>{name}</li>
                    ))}
                    </ul>
                }
            </div>)}
        </div>
    )
}

export default StentBOMTView