import traveler from "./assets/Traveler.png";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import LHR_template from "../LHR_template.pdf";

const API_URL = import.meta.env.VITE_API_URL;

function Traveler(){

  const generateDoc = async () => {
    const existingPdfBytes = await fetch(LHR_template).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const fourthPage = pages[3];
    const fifthPage = pages[4];
    const seventhPage = pages[6];
    const { height } = firstPage.getSize();

    secondPage.drawText("filled", {
      x: 417,
      y: height - 349,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });

    secondPage.drawText("filled", {
      x: 590,
      y: height - 410,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });

    secondPage.drawText("filled", {
      x: 590,
      y: height - 449,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });

    fourthPage.drawText("filled", {
      x: 590,
      y: height - 300,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fourthPage.drawText("filled", {
      x: 590,
      y: height - 345,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fifthPage.drawText("filled", {
      x: 590,
      y: height - 420,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fifthPage.drawText("filled", {
      x: 590,
      y: height - 459,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fifthPage.drawText("filled", {
      x: 590,
      y: height - 500,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    seventhPage.drawText("filled", {
      x: 590,
      y: height - 400,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    seventhPage.drawText("filled", {
      x: 590,
      y: height - 450,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    // 6. Save the filled PDF
    const pdfBytes = await pdfDoc.save();
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

