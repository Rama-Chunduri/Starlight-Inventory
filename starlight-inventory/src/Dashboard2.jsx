import './Dashboard.css'
import { useNavigate, useLocation } from 'react-router-dom'

function Dashboard2() {
    const navigate = useNavigate()
    const location = useLocation()
    const {first_name, last_name} = location.state || {}
    return(
        <div>
            <h1 style={{marginLeft: '38rem'}}>Welcome, {first_name} {last_name}</h1>
            <div className="flex-box-dash">
                <button onClick={()=>navigate('/implant-inventory')} className="flex-item-dash">Implant Inventory</button>
                <button onClick={()=>navigate('/stent-bom')} className="flex-item-dash">Stent BOM</button>
                <button onClick={()=>navigate('/flow-restrictor-bom')} className="flex-item-dash">Flow Restrictor BOM</button>
                <button onClick={()=>navigate('/edit-permissions')} className="flex-item-dash">Edit Permissions</button>
            </div>
        </div>
    )
}

export default Dashboard2