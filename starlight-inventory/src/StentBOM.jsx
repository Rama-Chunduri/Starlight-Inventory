import './ImplantInventory.css'
import { useNavigate } from 'react-router-dom'

function StentBOM() {
    const navigate = useNavigate()
    return(
        <div className="flex-box-implant">
            <button onClick={()=>navigate('/stent-bom-graph-view')} className="flex-item-implant">View Graph</button>
            <button onClick={()=>navigate('/stent-bom-table-view')} className="flex-item-implant">View Table</button>
            <button onClick={()=>navigate('/stent-bom-build')} className="flex-item-implant">Build</button>
        </div>
    )
}
export default StentBOM