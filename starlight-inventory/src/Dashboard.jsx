import './Dashboard.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from "axios";
 

function Dashboard() {
    const navigate = useNavigate()
    const [name, setName] = useState({first_name: "", last_name: ""})
    const [username, setUsername] = useState("")
    useEffect(()=>{
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:8000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setName({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
        });
        setUsername(res.data.username)
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (error) {
        console.error("Failed to fetch user info", error);
      }
    };

    fetchUserInfo();
  }, []);
    return(
        <div>
            <h1 style={{marginLeft: '38rem', marginTop: '5rem'}}>Welcome, {name.first_name} {name.last_name}</h1>
            <div className="flex-box-dash">
                <button onClick={()=>navigate('/implant-inventory')} className="flex-item-dash">Implant Inventory</button>
                <button onClick={()=>navigate('/stent-bom')} className="flex-item-dash">Stent BOM</button>
                <button onClick={()=>navigate('/flow-restrictor-bom')} className="flex-item-dash">Flow Restrictor BOM</button>
                <button onClick={()=>navigate('/finished-goods')} className="flex-item-dash">Finished Goods</button>
                <button onClick={()=>navigate('/user-history')} className="flex-item-dash">User History</button>
            </div>
        </div>
    )
}

export default Dashboard