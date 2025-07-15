import { useState, useEffect } from "react"

function InventoryPreview(){
    const [originalData, setOriginalData] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [IsPreviewMode, setIsPreviewMode] = useState(false);

    useEffect(()=>{
        fetch("http://localhost:8000/stent-bom-table-view")
            .then((res) => res.json())
            .then((data)=>{
                setOriginalData(data)
                setPreviewData(data)
            })
    }, []);
    const simulateChange = (targetItemName, removeQty) => {
        const newPreview = previewData.map(row=>{
            if(row.item_name === targetItemName){
                return {...row, quantity: row.quantity - removeQty}
            }
            return row
        })
        setPreviewData(newPreview)
        setIsPreviewMode(true);
    }

    const confirmChange = async () => {
        await fetch ("http://localhost:8000/update_inventory",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(previewData)
        });
        setOriginalData(previewData)
        setIsPreviewMode(false)
    }

    const cancelChange = () => {
        setPreviewData(originalData)
        setIsPreviewMode(false)
    }

    return (
        <div>
            <button onClick={simulateChange()}></button>
        </div>
    )
}

export default InventoryPreview;