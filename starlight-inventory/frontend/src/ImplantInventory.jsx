import './ImplantInventory.css'
import { useNavigate } from 'react-router-dom'

function ImplantInventory() {
    const navigate = useNavigate()
    return(
        <div className="flex-box-implant">
            <button onClick={()=>navigate('/implant-inventory-view')} className="flex-item-implant">View Data</button>
            <button onClick={()=>navigate('/implant-inventory-insert')} className="flex-item-implant">Insert Data</button>
            <button onClick={()=>navigate('/implant-inventory-delete')} className="flex-item-implant">Delete Data</button>
        </div>
    )
}

export default ImplantInventory