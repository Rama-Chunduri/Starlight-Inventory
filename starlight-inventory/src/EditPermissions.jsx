import './Dashboard.css'
import { useNavigate, useLocation } from 'react-router-dom'

function EditPermissions(){
    const navigate = useNavigate()
    const location = useLocation()
    return(
        <div>
            <div className="flex-box-dash">
                <button onClick={()=>navigate('/add-user')} className="flex-item-dash">Add User</button>
                <button onClick={()=>navigate('/update-permissions')} className="flex-item-dash">Update Permissions</button>
            </div>
        </div>
    )
}

export default EditPermissions