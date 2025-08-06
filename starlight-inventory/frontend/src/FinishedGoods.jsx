import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL;

function FinishedGoods(){
    const [data, setData] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const response = await fetch(`${API_URL}/finished-goods-table`)
                const result = await response.json()
                setData(result)
            }
            catch(error){
                console.error("Error fetching the finished goods table", error)
            }
        }
        fetchData()
    }, [])

    if (data.length === 0) return <div style={{marginLeft: "40rem", fontSize: "5vh"}}>Loading...</div>;
    const columns = Object.keys(data[0]);
    
    return (
        <div style={{padding:'2rem', color:'white', position:'relative'}}>
            <h1>Finished Goods Table</h1>
            <table border="1" style={{ borderCollapse: "collapse", width: "100%", marginBottom: "4rem"}}>
                <thead>
                    <tr>
                        {columns.map((key, index)=>(
                            <th key={index} style={{ padding: "0.5rem" }}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row)=>(
                        <tr key={row.unique_id}>
                            {columns.map((colKey)=>{
                                    return(
                                        <td
                                            key={colKey}
                                        >
                                                {row[colKey]}
                                        </td>
                                    )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default FinishedGoods;