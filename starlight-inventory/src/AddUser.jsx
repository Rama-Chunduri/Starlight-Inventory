import { useState } from "react"
import { useNavigate } from "react-router-dom";

function AddUser(){
    const [username, setUsername] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const navigate = useNavigate()

    const newUser = async () => {
        const response = await fetch('http://localhost:8000/add-user', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ firstname, lastname, username})
        })
    }

     return(
         <div style={{backgroundColor: '#BDC1C3', display: 'flex', flexDirection: 'column', maxWidth: '50rem', marginLeft: '30rem', padding: '4rem' }}>
            <h1 style={{backgroundColor: '#BDC1C3', color: '#173d62', alignSelf: 'center'}}>Add User</h1>
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter first name</h1>
            <input 
                placeholder="Enter first name" 
                style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem', color: "#173D62"}}
                value={firstname}
                onChange={(e)=>setFirstName(e.target.value)}
                />
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter last name</h1>
            <input 
                placeholder="Enter last name" 
                style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem', color: "#173D62"}}
                value={lastname}
                onChange={(e)=>setLastName(e.target.value)}
            />
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter username</h1>
            <input 
                placeholder="Enter username" 
                style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem', color: "#173D62"}}
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
            />
            <button 
                style={{backgroundColor:'#173D62', color: '#BDC1C3', marginTop: '4rem', width: '52rem', alignItems: 'center'}}
                onClick={ 
                    async () => {
                        await newUser();
                        navigate('/dashboard2');
                    }
                }
            >
                Add User
            </button>
        </div>
    )
}

export default AddUser;