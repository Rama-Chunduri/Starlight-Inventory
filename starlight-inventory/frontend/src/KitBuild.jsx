import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function KitBuild(){
    const [selectedKits, setSelectedKits] = useState([])
    const [builds, setBuilds] = useState([])
    useEffect(()=>{
        const fetchBuilds = async () =>{
            try{
                const res = await fetch(`${API_URL}/kits`);
                const data = await res.json();
                setBuilds(data)
            }
            catch(err){
                console.error("Failed to fetch builds:", err);
            }
        };
        fetchBuilds();
    }, []);
    const getCombinedComponents = () => {
        const componentMap = {}
        selectedKits.forEach((kitId) => {
            const kit = builds.find((b) => b.id == kitId);
            kit?.components.forEach((comp) => {
                const key = comp.part_number;
                if(!componentMap[key]){
                    componentMap[key] = {...comp};
                }
                else{
                    componentMap[key].quantity += comp.quantity
                }
            })
        })
        return Object.values(componentMap)
    }
    return(
        <div>
            <h2>Select Kits to Build</h2>
              {builds.map((kit) => (
              <label key={kit.id} style={{ display: "block", marginBottom: "8px" }}>
                <input
                type="checkbox"
                checked={selectedKits.includes(kit.id)}
                onChange={() => handleCheckboxChange(kit.id)}
                style={{ marginRight: "8px" }}
              />
              {kit.name}
              </label>
              ))}

            <h3>Components by Selected Kit</h3>
              {selectedKits.map((kitId) => {
                const kit = builds.find((b) => b.id === kitId);
                return (
                <div key={kitId}>
                <strong>{kit.name}</strong>
                <ul>
                  {kit.components.map((comp, idx) => (
                    <li key={idx}>
                      {comp.description} ({comp.part_number}) — qty: {comp.quantity}
                    </li>
                  ))}
                </ul>
                </div>
                );
              })}
            <h3>Combined Component List</h3>
            <ul>
              {getCombinedComponents().map((comp, idx) => (
                <li key={idx}>
                {comp.description} ({comp.part_number}) — total qty: {comp.quantity}
                </li>
              ))}
            </ul>
        </div>
    )
}

export default KitBuild;