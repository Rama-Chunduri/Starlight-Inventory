function AddUser(){
    return(
         <div style={{backgroundColor: '#BDC1C3', display: 'flex', flexDirection: 'column', maxWidth: '50rem', marginLeft: '30rem', padding: '4rem' }}>
            <h1 style={{backgroundColor: '#BDC1C3', color: '#173d62', alignSelf: 'center'}}>Add User</h1>
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter first name</h1>
            <input placeholder="Enter your first name" style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem'}}></input>
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter last name</h1>
            <input placeholder="Enter your last name" style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem'}}></input>
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter username</h1>
            <input placeholder="Enter your username" style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem'}}></input>
            <h1 style={{backgroundColor: '#BDC1C3', fontSize: '2rem', color: '#173D62'}}>Enter phone number</h1>
            <input placeholder="Enter your phone number" style={{borderRadius: '8px', backgroundColor: '#BDC1C3', fontSize: '1.5rem', padding: '0.7rem', width: '50rem'}}></input>
            <button style={{backgroundColor:'#173D62', color: '#BDC1C3', marginTop: '4rem', width: '52rem', alignItems: 'center'}}>Add User</button>
        </div>
    )
}

export default AddUser;