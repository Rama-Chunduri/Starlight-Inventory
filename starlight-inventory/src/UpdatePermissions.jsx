import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"

function UpdatePermissions(){
    const [data, setData] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const response = await fetch("http://localhost:8000/update-permissions")
                const result = await response.json()
                setData(result)
            }
            catch(error){
                console.error("Error fetching the user table", error)
            }
        }
        fetchData()
    }, [])
    return (
        <div style={{padding:'2rem', color:'white'}}>
            <h1>User Table</h1>
            <table border="1">
                <thead>
                    <tr>
                        {data[0] && 
                        Object.keys(data[0]).map((key,index)=>(
                            <th key={index}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row,idx)=>(
                        <tr key={idx}>
                            {Object.values(row).map((value, idy)=>(
                                <td key={idy}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UpdatePermissions;