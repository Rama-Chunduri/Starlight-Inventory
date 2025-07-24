import { useState } from "react"
import CustomDropDown from "./CustomDropDown";
import { useNavigate } from "react-router-dom";

function AddLots(){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        lot_name: '',
        quantity: '',
        part_number: '',
        part_name: ''
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
        const response = await fetch('http://localhost:8000/add-csv-lots', {
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
        const response = await fetch('http://localhost:8000/add-data-lots', {
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
        <button style={{marginLeft: '2rem', marginTop: '2rem', backgroundColor: '#BDC1C3', color: '#173D62'}} onClick={()=>{handleCSV(csvVal); navigate('/stent-bom-lots')}}>Submit</button>

        <h1 style={{fontSize: '3rem', marginLeft: '2rem'}}>(OR)</h1>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Lot Name</h1>
        <input style={{marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem',color: "#173D62", borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="lot_name" placeholder="Enter label:" value={formData.lot_name} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Quantity</h1>
        <input style={{marginLeft: '2rem', fontSize: '1rem', backgroundColor: '#BDC1C3', padding: '0.5rem', color: "#173D62",borderRadius: '8px', width: '100%', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc'}} type="text" name="quantity" placeholder="Enter quantity:" value={formData.quantity} onChange={(e) => handleChange(e.target.name, e.target.value)}/>
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Part Number</h1>
         <CustomDropDown
            name="part_number"
            value={formData.part_number}
            onChange={(value) => handleChange("part_number", value)}
            options={['STR-DA2-PK-30003', 'STR-DA2-FS-00000.01', 'STR-DA2-FS-00000.02', 'STR-DA2-FS-00000.03', 'STR-DA2-FS-00000.04', 'STR-DA2-FS-00000.05', 'STR-DA2-FS-00000.06', 'STR-DA2-FS-00000.07', 'STR-DA2-FS-00000.08', 'STR-DA2-FS-00000.09', 'STR-DA2-FS-00000.10', 'STR-DA2-PK-30004', 'LBL-DA2-0004', 'STR-DA2-PK-30006', 'STR-DA2-PK-30007', 'STR-DA2-FS-10008.01','STR-DA2-FS-10008.02', 'STR-DA2-FS-10008.03',
                'STR-DA2-FS-10008.04', 'STR-DA2-FS-10008.05', 'STR-DA2-FS-10008.06', 'STR-DA2-FS-10008.07', 'STR-DA2-FS-10008.08', 'STR-DA2-FS-10008.09', 'STR-DA2-FS-10008.10', 'MS-DA2-00001', 'MS-00-50002', 'MS-DA2-50002', 'MS-DA2-50003', 'STR-DA2-DS-30014', 'MS-00-50003', 'STR-DA2-PT-10012.01', 'STR-DA2-PT-10012.02', 'STR-DA2-PT-10012.03', 'MS-00-50001', 'STR-DA2-PT-30017', 'MS-DA2-40006', 'MS-DA2-40005', 'MS-DA2-40004', 
                'STR-DA2-PT-30015.01', 'STR-DA2-PT-30015.02', 'STR-DA2-PT-30015.03', 'MS-DA2-20007', 'STR-DA2-PT-30016', '121-06624', '121-06900', 'STR-DA2-CA-10018', 'MS-DA2-50009', 'STR-DA2-DS-30014', 'MS-DA2-40008.02', 'MS-DA2-40008.01', '121-06901', 'STR-DA2-CA-10020', 'MS-00-10008', 'MS-DA2-40012', 'MS-DA2-50015', 'MS-DA2-40011', 'MS-DA2-20010', 'MS-DA2-40014.01', 'MS-DA2-40014.02', 'MS-DA2-40014.03', 'MS-DA2-40014.04', 
                'MS-DA2-40014.05', 'MS-DA2-40014.06', 'MS-DA2-40014.07', 'MS-DA2-40014.08', 'MS-DA2-40014.09', 'MS-DA2-40014.10', 'MS-00-50004'
            ]}
            allowCustomInput={true}
        />
        <h1 style={{fontSize: '2rem', marginLeft: '2rem'}}>Enter Part Name</h1>
         <CustomDropDown
            name="part_name"
            value={formData.part_name}
            onChange={(value) => handleChange("part_name", value)}
            options={['Starlight Stent System Shipper Box', 'Packaged Starlight Stent System DDPC32', 'Shelf Carton', 'Lifeline Stent Instructions For Use', 'Tyvek Pouch', 'Hoop Support Card', 'Starlight Stent System DDPC32', 'Nitinol Tubing, DDPC32', 'Rotating Hemostatic Valve', 'Pusher Tube Hub Housing DDPC32', 'Pusher Tube Hub Bushing DDPC32', 'Strain Relief DDPC32', 'Hub Adhesive', 'Coated Pusher Tube DDPC32', 
                'Catheter Hydrophilic Coating', 'Proximal Lct DDPC32', 'Pusher Tube Liner DDPC32', 'Pusher Tube Distal Outer Extrusion DDPC32', 'Pusher Tube Proximal Outer Extrusion DDPC32', 'Distal LCT DDPC32', 'Pusher Tube Marker Band DDPC32', 'Retainer Dppc32','Pusher Masking Heat Shrink', 'PTFE Coated Pusher Coating Mandrel', 'Catheter Assembly DDPC32', 'Catheter Hub', 'Strain Relief DDPC32', 'Catheter Taper Pebax 25D DDPC32',
                'Catheter Taper Pebax 72D DDPC32', 'PTFE Coated Catheter Coating Mandrel', 'Distal Catheter DDPC32', 'Catheter Braid', 'Catheter Braid Ribbon', 'Catheter Fiber DDPC32', 'Catheter Pet Shrink DDPC32', 'Catheter Liner DDPC32', 'Catheter Marker DDPC32', 'Catheter Extrusions DDPC32', 'Catheter Marker Adhesive'
            ]}
            allowCustomInput={false}
        />
       
      <button style={{marginLeft: '2rem', marginTop: '2rem', backgroundColor: '#BDC1C3', color: '#173D62'}} onClick={()=>{handleSubmit(); navigate('/stent-bom-lots')}}>Submit</button>
    </div>
    )
}

export default AddLots;