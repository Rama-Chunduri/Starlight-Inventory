import './Login.css'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'

const API_URL = import.meta.env.VITE_API_URL;

function Login(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isValid, setisValid] = useState(true)
    const navigate = useNavigate()
    const handleLogin = async () => {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Login failed:", data.detail);
      setisValid(false);
      return;
    }

  // Store JWT in localStorage or cookie
    localStorage.setItem("token", data.access_token);

    console.log("Login successful");
    setisValid(true);
    navigate('/dashboard', {
      state: {
        first_name: data.first_name,
        last_name: data.last_name
      },
    });
  }

  return (
    <>
      <div className='heading-container'>
        <h1 className='heading'>Database Management System</h1>
        <h2 className='heading sub-heading'>Starlight Cardiovascular</h2>
      </div>  
      <div className='authentication'>
        <h1 className='heading-auth'>User Login</h1>
        <div className='auth-form'> 
          <input style={{borderColor: isValid ? 'green' : 'red'}} type="text" placeholder="Enter Username" value={username} onChange={(e)=> setUsername(e.target.value)} className='sub-heading-auth flex-item'></input>
          <input style={{borderColor: isValid ? 'green' : 'red'}} type="password" placeholder="Enter Password:" value={password} onChange={(e) => setPassword(e.target.value)} className='sub-heading-auth flex-item'></input>
          <button onClick={handleLogin} className='flex-item'>Login</button>
          <button onClick={()=>navigate('/signup')} className='flex-item'>Sign Up</button>
        </div>
      </div>
    </>
  )
}

export default Login