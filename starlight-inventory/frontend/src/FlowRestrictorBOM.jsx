import './ImplantInventory.css'
import { useNavigate } from 'react-router-dom'

function FlowRestrictorBOM() {
    const navigate = useNavigate()
    return(
        <div className="flex-box-implant">
            <button onClick={()=>navigate('/fr-bom-graph-view')} className="flex-item-implant">View Graph</button>
            <button onClick={()=>navigate('/fr-bom-table-view')} className="flex-item-implant">View Table</button>
            <button onClick={()=>navigate('/fr-bom-build')} className="flex-item-implant">Build</button>
        </div>
    )
}
export default FlowRestrictorBOM