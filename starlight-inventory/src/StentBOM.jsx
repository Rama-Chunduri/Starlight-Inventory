import './ImplantInventory.css'
import { useNavigate } from 'react-router-dom'

function StentBOM() {
    const navigate = useNavigate()
    return(
        <div className="flex-box-implant">
            <button onClick={()=>navigate('/stent-bom-graph-view')} className="flex-item-implant">View Graph</button>
            <button onClick={()=>navigate('/stent-bom-table-view')} className="flex-item-implant">View BOM Table</button>
            <button onClick={()=>navigate('/stent-inventory-table-view')} className="flex-item-implant">View Inventory Table</button>
            <button onClick={()=>navigate('/stent-bom-lots')} className="flex-item-implant">View Lot Table</button>
            <button onClick={()=>navigate('/add-lots')} className="flex-item-implant">Add Lots</button>
            <button onClick={()=>navigate('/stent-bom-build')} className="flex-item-implant">Build</button>
        </div>
    )
}
export default StentBOM