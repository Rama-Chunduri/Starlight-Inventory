import { useState } from "react"
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function StentBOMBuild(){
    const [quantity, setQuantity] = useState(0);
    const [size, setSize] = useState(0);
    const [partNumber, setPartNumber] = useState("");
    const navigate = useNavigate();
    const subcomponents = [
        "Coated Pushertube DDPC32", 
        "Stent Assembly",
        "Catheter Assembly DDPC32",
        "Rotating Hemostatic Valve",
        "Pushertube Hub Bushing DDPC32",
        "Pushertube Hub Housing DDPC32",
        "Hub Adhesive",
        "Strain Relief, DDPC32",
        "Thermal Transfer Ribbon",
        "Lifeline Stent Shelf Carton and Pouch Label Printed Static Artwork",
        "Hoop Support Card",
        "Tyvek Pouch",
        "Shelf Carton",
        "Patient Card",
        "Instructions for Use",
        "Tamper Seal",
        "Sterilization Indicator",
    ]

    const [partNumberArray, setPartNumberArray] = useState(["STR-DA2-CA-10001", "MS-00-50002", "MS-DA2-50002", "MS-DA2-50003", "MS-00-50003", "STR-DA2-DS-30014", "MS-00-50014",
        "LBL-DA2-0001", "STR-DA2-PK-30007", "STR-DA2-PK-30006", "STR-DA2-PK-30004", "LBL-DA2-0005", "LBL-DA2-0004", "MS-00-50012", "MS-00-50013",
        "STR-DA2-PK-30003", 
     ]);

     let p6 = "STR-DA2-IM-10009";
    if (Number(size) === 10) {
        p6 = p6.concat(".10");
    } 
    else {
        p6 = p6.concat(".0" + String(size));
    }
    partNumberArray.push(p6);


     let p7 = "STR-DA2-PT-10012"
     if(size == 1 || size == 2){
        p7 = p7.concat(".01")
     }
     else if(size == 3 || size == 4){
        p7 = p7.concat(".02")
     }
     else if(size == 5){
        p7 = p7.concat(".03")
     }
     else if(size == 6 || size == 7 ){
        p7 = p7.concat(".01")
     }
     else if(size == 8 || size == 9 ){
        p7 = p7.concat(".02")
     }
     else{
        p7 = p7.concat(".03")
     }
     partNumberArray.push(p7);

    function handleInput(){
        if(partNumber){
            setPartNumberArray(prev => [...prev,partNumber])
            setPartNumber("")
        }
    }
    return(
        <div style={{color: "white", margin: "2rem", display: "flex", flexDirection: "column"}}>
            <h1>Sterilized Starlight Stent System DDPC32</h1>
            <h2>Building Quantity</h2>
            <input
            type="text"
            placeholder="Enter quantity"
            onChange={(e)=>setQuantity(e.target.value)}
            style={{
                backgroundColor: "#BDC1C3",
                color: "#173D62",
                borderRadius: "8px",
                padding: "0.5rem",
                fontSize: "1rem",
                width: "50%"
            }}
            />
            <h2>Pick Size</h2>
            <input
            type="text"
            placeholder="Enter size (1-10)"
            onChange={(e)=>setSize(e.target.value)}
            style={{
                backgroundColor: "#BDC1C3",
                color: "#173D62",
                borderRadius: "8px",
                padding: "0.5rem",
                fontSize: "1rem",
                width: "50%"
            }}
            />
            <h1>Subcomponents</h1>
            <h2>Catheter Assembly DDPC32 (STR-DA2-CA-10001)</h2>
            <h2>Rotating Hemostatic Valve (MS-00-50002)</h2>
            <h2>Pushertube Hub Bushing DDPC32 (MS-DA2-50002)</h2>
            <h2>Pushertube Hub Housing DDPC32 (MS-DA2-50003)</h2>
            <h2>Hub Adhesive (MS-00-50003)</h2>
            <h2>Strain Relief, DDPC32 (STR-DA2-DS-30014)</h2>
            <h2>Thermal Transfer Ribbon (MS-00-50014)</h2>
            <h2>Lifeline Stent Shelf Carton and Pouch Label (LBL-DA2-0001)</h2>
            <h2>Hoop Support Card (STR-DA2-PK-30007)</h2>
            <h2>Tyvek Pouch (STR-DA2-PK-30006)</h2>
            <h2>Shelf Carton (STR-DA2-PK-30004)</h2>
            <h2>Patient Card (LBL-DA2-0005)</h2>
            <h2>Instructions for Use (LBL-DA2-0004)</h2>
            <h2>Tamper Seal (MS-00-50012)</h2>
            <h2>Sterilization Indicator (MS-00-50013)</h2>
            <h2>Starlight Stent System Shipper Box (STR-DA2-PK-30003)</h2>
            <h2>Coated Pusher Tube DDPC32 (STR-DA2-PT-10012.00)</h2>

            {/*<div style={{display: "flex", flexDirection: "row"}}>
                <input
                type="text"
                placeholder="Enter Part Number"
                onChange={(e)=>{setPartNumber(e.target.value); }}
                style={{
                    color: "#173D62",
                    backgroundColor: "#BDC1C3",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    width: "30%"
                }}
                />
                <button
                    style={{color: "#173D62", backgroundColor: "#BDC1C3", marginLeft: "1rem"}}
                    onClick={handleInput}
                >
                    Submit
                </button>
            </div>*/}

            <h2>Stent Assembly (STR-DA2-IM-10009.00)</h2>
            {/*<div>
                <input
                    type="text"
                    placeholder="Enter Part Number"
                    onChange={(e)=>setPartNumber(e.target.value)}
                    style={{
                        color: "#173D62",
                        backgroundColor: "#BDC1C3",
                        padding: "0.5rem",
                        borderRadius: "8px",
                        width: "30%"
                    }}
                />
                <button
                    onClick={handleInput}
                    style={{color: "#173D62", backgroundColor: "#BDC1C3", marginLeft: "1rem"}}
                >
                    Submit
                </button>
            </div>*/}
            <button style={{marginBottom: "2rem", marginTop: "2rem", marginLeft: "0.5rem", color: "#173D62", backgroundColor: "#BDC1C3", width: "30%"}}
            onClick={()=>navigate('/lot-management', {
                state: {
                    size,
                    quantity,
                    partNumberArray
                }
            })}
            >
                Pick Lots
            </button>
        </div>
    )
}

export default StentBOMBuild;