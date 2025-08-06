import { useNavigate } from "react-router-dom";

function DashboardButton(){
    const navigate = useNavigate();
    return(
        <button 
                styles={{
                    marginLeft: '85vh', 
                    marginTop: '4vh', 
                    backgroundColor: '#BDC1C3', 
                    color: '#173D62', 
                    marginBottom: '5vh'
                }}
                onClick={()=>navigate('/dashboard')}
        >
            Return to Dashboard
        </button>
    )
}

export default DashboardButton;