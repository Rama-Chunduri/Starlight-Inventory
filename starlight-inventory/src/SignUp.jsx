import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SignUp(){
    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const  handleSignUp = async () => {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ firstname, lastname, username, password })
      });
    }

    return(
        <div style={{backgroundColor: '#BDC1C3', display: 'flex', flexDirection: 'column', maxWidth: '50rem', marginLeft: '30rem', padding: '4rem' }}>
            <h1 style={{backgroundColor: '#BDC1C3', color: '#173d62', alignSelf: 'center'}}>Sign Up</h1>
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter your first name</h1>
            <input placeholder="Enter your first name" 
                style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem', color: "#173D62"}}
                value={firstname}
                onChange={(e)=>setFirstName(e.target.value)}
            />
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter your last name</h1>
            <input placeholder="Enter your last name" 
                style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem', color: "#173D62"}}
                value={lastname}
                onChange={(e)=>setLastName(e.target.value)}
            />
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter your username</h1>
            <input placeholder="Enter your username" 
                style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem', color: "#173D62"}}
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
            />
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter your password</h1>
            <input placeholder="Enter your password" 
                style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem', color: "#173D62"}}
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <button 
                style={{backgroundColor:'#173D62', color: '#BDC1C3', marginTop: '4rem', width: '52rem', alignItems: 'center'}}
                onClick={async () => {
                    await handleSignUp();
                    navigate('/');
                }}
                >
                    Sign Up
                </button>
        </div>
    )
}

export default SignUp