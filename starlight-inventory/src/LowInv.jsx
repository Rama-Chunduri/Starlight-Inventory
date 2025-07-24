import helloKitty from "./assets/hello_kitty_crying.png";

function LowInv(){

    return(
        <div style={{
            backgroundColor: "pink",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "35rem",
            borderRadius: "8px",
            padding: "2rem"
        }}>
            <h1 style={{color: "#173D62", backgroundColor: "pink", fontSize: "3rem"}}>Cannot build due to low inventory</h1>
            <img style={{ width: "300px", height: "auto" }} src={helloKitty} alt="crying hello kitty" />
        </div>
    )
}

export default LowInv;