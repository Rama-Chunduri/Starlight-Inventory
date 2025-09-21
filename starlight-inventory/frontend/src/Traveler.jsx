import traveler from "./assets/Traveler.png";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const API_URL = import.meta.env.VITE_API_URL;

function Traveler(){

const generateDoc = async () => {
  // Create a new PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { height } = page.getSize();

  // Load a font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Add text
  page.drawText("Course Information", {
    x: 50,
    y: height - 50,
    size: 20,
    font,
    color: rgb(0.1, 0.2, 0.5),
  });

  page.drawText(`Course: Data Structures and Algorithms`, { x: 50, y: height - 100, size: 14, font });
  page.drawText(`Time: MW 2-3`, { x: 50, y: height - 130, size: 14, font });
  page.drawText(`Start Date: 2025-08-01`, { x: 50, y: height - 160, size: 14, font });

  // Serialize to bytes
  const pdfBytes = await pdfDoc.save();

  // Open PDF in new tab
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
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

