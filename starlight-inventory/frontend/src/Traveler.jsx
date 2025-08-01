import traveler from "./assets/Traveler.png";

const API_URL = import.meta.env.VITE_API_URL;

function Traveler(){
const generateDoc = async () => {
  const response = await fetch('http://localhost:3001/generate-doc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId: '1kDWd571zC1Vbtdxx2N-maKFf05_-xZvBMv6xluf9UkE',
      replacements: {
        '{{PATIENT}}': 'Alice',
        '{{AGE}}': '34',
        '{{SURGERY_DATE}}': '2025-08-01',
      }
    }),
  });

  const data = await response.json();
  window.open(data.docUrl, '_blank'); // Opens the editable Google Doc
};

        return(
            <div style={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "35rem",
                borderRadius: "8px",
                padding: "2rem",
                marginLeft: "45rem"
            }}>
                <h1 style={{color: "#173D62", backgroundColor: "white", fontSize: "3rem"}}>The Traveler</h1>
                <img style={{ width: "500px", height: "auto" }} src={traveler} alt="the traveler" />
                <button onClick={generateDoc} style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#173D62",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}>
                Generate Traveler
                </button>
            </div>
        )
}

export default Traveler;