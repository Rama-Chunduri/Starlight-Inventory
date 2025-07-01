import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='heading-container'>
        <h1 className='heading'>Database Management System</h1>
        <h2 className='heading sub-heading'>Starlight Cardiovascular</h2>
      </div>  
      <div className='authentication'>
        <h1 className='heading-auth'>User Login</h1>
        <input type="text" placeholder="Enter Username" value={username} onChange={(e)=> setUsername(e.target.value)} className='sub-heading-auth'>Username</input>
        <input className='sub-heading-auth'>Password</input>
      </div>
    </>
  )
}

export default App
