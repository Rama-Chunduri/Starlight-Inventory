import { useNavigate } from "react-router-dom";

function DashboardButton(){
    const navigate = useNavigate();
    return(
        <button onClick={()=>navigate('/dashboard')}
                styles={{
                    marginLeft: '2rem', 
                    marginTop: '2rem', 
                    backgroundColor: '#BDC1C3', 
                    color: '#173D62', 
                    marginBottom: '5vh'
                }}
        >
            Return to Dashboard
        </button>
    )
}

export default DashboardButton;