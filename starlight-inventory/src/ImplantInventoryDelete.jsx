import { useState } from "react"
import CustomDropDown from "./CustomDropDown";
import { useNavigate } from "react-router-dom";

function ImplantInventoryDelete(){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        unique_id: '',
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

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDelete = async () => {
        const filteredData = Object.fromEntries(
            Object.entries(formData).filter(([key,value]) => value !== '')
        )
        const response = await fetch('http://localhost:8000/delete-data', {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(filteredData)
        })
    }


    return(
    <div style={{display:'flex', flexDirection: 'column'}}>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Unique Id</h1>
        <input style={{color: "#1736D2", marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="unique_id" placeholder="Enter Unique Id:" value={formData.unique_id} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Label</h1>
        <input style={{color: "#1736D2", marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="label" placeholder="Enter label:" value={formData.label} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Serial Number</h1>
        <input style={{color: "#1736D2", marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="serialNumber" placeholder="Enter serial number:" value={formData.serial_number} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Design</h1>
         <CustomDropDown
            name="design" 
            value={formData.design}
            onChange={(value)=>handleChange("design", value)}
            options={['8C8B', '10C10B']}
            allowCustomInput={true}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Size</h1>
         <CustomDropDown
            name="size"
            value={formData.size}
            onChange={(value)=>handleChange("size", value)}
            options={['5', '6', '7', '8', '9', '10', '11']}
            allowCustomInput={false}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Restriction Size</h1>
        <input style={{color: "#1736D2", marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="restriction_size" placeholder="Enter restriction size:" value={formData.restrictionSize} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Test Allocation</h1>
        <CustomDropDown
            name="test_allocation"
            value={formData.test_allocation}
            onChange={(value)=>handleChange("test_allocation", value)}
            options={['sterilize', 'corline testing', 'N/A']}
            allowCustomInput={true}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Coating Lot</h1>
        <input style={{color: "#1736D2", marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="coating_lot" placeholder="Enter coating lot:" value={formData.coatingLot} onChange={(e) => handleChange(e.target.name, e.target.value)}/> 
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter ePTFE Vendor/Lot</h1>
        <CustomDropDown
            name="ePTFE_Vendor_Lot"
            value={formData.ePTFE_Vendor_Lot}
            onChange={(value)=>handleChange("ePTFE_Vendor_Lot", value)}
            options={['sterilize', 'corline testing', 'N/A']}
            allowCustomInput={true}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Surface Area</h1>
        <input style={{color: "#1736D2", marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="surface_area" placeholder="Enter surface area:" value={formData.surface_area} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Revision</h1>
        <input style={{color: "#1736D2", marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="revision" placeholder="Enter revision:" value={formData.revision} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Lot Name</h1>
        <CustomDropDown
            name="lot_name"
            value={formData.lot_name}
            onChange={(value)=>handleChange("lot_name", value)}
            options={['Paradyne', 'Medical Murray']}
            allowCustomInput={false}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Flared</h1>
        {/* <input style={{margin: '2rem'}} type="text" name="flared" placeholder="Enter flared:" value={formData.flared} onChange={handleChange}/> */}

        <CustomDropDown
            name="flared"
            value={formData.flared}
            onChange={(value)=>handleChange("flared", value)}
            options={['Yes', 'No']}
            allowCustomInput={false}
        />
      
      <button style={{marginLeft: '2rem', marginTop: '2rem', backgroundColor: '#BDC1C3', color: '#173D62'}} onClick={handleDelete}>Submit</button>
    </div>
    )
}

export default ImplantInventoryDelete