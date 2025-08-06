import { useState } from "react"
import CustomDropDown from "./CustomDropDown";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function ImplantInventoryInsert(){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        label: '',
        serial_number: '',
        design: '',
        size: '',
        restriction_size: '',
        test_allocation: '',
        coating_lot: '',
        ePTFE_Vendor_Lot: '',
        surface_area: '',
        revision: '',
        lot_name: '',
        flared: '',
        notes: ''
    });
    const [csvVal, setCsvVal] = useState('')

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCSV = async (csvText) => {
        console.log("Sending CSV text to backend:", csvVal);
        const response = await fetch(`${API_URL}/add-csv`, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({csv: csvText})
        })
        setCsvVal(csvText)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if(!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
            setCsvVal(event.target.result)
        }
        reader.readAsText(file)
    }
    console.log(formData);

    const handleSubmit = async () => {
        const response = await fetch(`${API_URL}/add-data`, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
    }

   

    return(
    <div style={{display:'flex', flexDirection: 'column'}}>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter a csv file</h1>
        <input style={{marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', color: "#173D62", borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="file" accept=".csv" name="csv" placeholder="Enter a csv file:" onChange={handleFileChange}/>
        <button style={{marginLeft: '2rem', marginTop: '2rem', backgroundColor: '#BDC1C3', color: '#173D62'}} onClick={()=>{handleCSV(csvVal); navigate('/implant-inventory-view')}}>Submit</button>

        <h1 style={{fontSize: '3rem', marginLeft: '2rem'}}>(OR)</h1>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Label</h1>
        <input style={{marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem',color: "#173D62", borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="label" placeholder="Enter label:" value={formData.label} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Serial Number</h1>
        <input style={{marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', color: "#173D62",borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="serial_number" placeholder="Enter serial number:" value={formData.serial_number} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Design</h1>
         <CustomDropDown
            name="design"
            value={formData.design}
            onChange={(value) => handleChange("design", value)}
            options={['8C8B', '10C10B']}
            allowCustomInput={true}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Size</h1>
         <CustomDropDown
            name="size"
            value={formData.size}
            onChange={(value) => handleChange("size", value)}
            options={['5', '6', '7', '8', '9', '10', '11']}
            allowCustomInput={false}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Restriction Size</h1>
        <input style={{marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', color: "#173D62",borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="restriction_size" placeholder="Enter restriction size:" value={formData.restriction_size} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Test Allocation</h1>
        <CustomDropDown
            name="test_allocation"
            value={formData.test_allocation}
            onChange={(value) => handleChange("test_allocation", value)}
            options={['sterilize', 'corline testing', 'N/A']}
            allowCustomInput={true}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Coating Lot</h1>
        <input style={{marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', color: "#173D62",borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="coating_lot" placeholder="Enter coating lot:" value={formData.coating_lot} onChange={(e) => handleChange(e.target.name, e.target.value)}/> 
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter ePTFE Vendor/Lot</h1>
        <CustomDropDown
            name="ePTFE_Vendor_Lot"
            value={formData.ePTFE_Vendor_Lot}
            onChange={(value) => handleChange("ePTFE_Vendor_Lot", value)}
            options={['sterilize', 'corline testing', 'N/A']}
            allowCustomInput={true}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Surface Area</h1>
        <input style={{marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', color: "#173D62",borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="surface_area" placeholder="Enter surface area:" value={formData.surface_area} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Revision</h1>
        <input style={{marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', color: "#173D62",borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="revision" placeholder="Enter revision:" value={formData.revision} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Lot Name</h1>
        <CustomDropDown
            name="lot_name"
            value={formData.lot_name}
            onChange={(value) => handleChange("lot_name", value)}
            options={['Paradyne', 'Medical Murray']}
            allowCustomInput={false}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Flared</h1>
        {/* <input style={{margin: '2rem'}} type="text" name="flared" placeholder="Enter flared:" value={formData.flared} onChange={handleChange}/> */}

        <CustomDropDown
            name="flared"
            value={formData.flared}
            onChange={(value) => handleChange("flared", value)}
            options={['Yes', 'No']}
            allowCustomInput={false}
        />

        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Notes</h1>
        <input style={{marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', color: "#173D62",borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="notes" placeholder="Enter notes:" value={formData.notes} onChange={(e) => handleChange(e.target.name, e.target.value)}/> 
      
      <button style={{marginLeft: '2rem', marginTop: '2rem', backgroundColor: '#BDC1C3', color: '#173D62', marginBottom: '5vh'}} onClick={()=> {handleSubmit(); navigate('/implant-inventory-view');}}>Submit</button>
    </div>
    )
}

export default ImplantInventoryInsert