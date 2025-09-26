import traveler from "./assets/Traveler.png";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import LHR_template from "../LHR_template.pdf";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Traveler(){
  const location = useLocation();
  const lotPreviewData = location.state?.lotPreviewData || [];
  const quantity = location.state?.quantity || "";
  const type = location.state?.type || "";
  const size = location.state?.size || "";
  function getLotNumber(partNumber, lotPreviewData) {
  const lot = lotPreviewData.find(l => l.part_number === partNumber);
  return lot ? lot.receiving_lot_number : "N/A";
}

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
    const tenthPage = pages[9];
    const thirteenthPage = pages[12];
    const { height } = firstPage.getSize();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

   /*secondPage.drawText("filled", {
      x: 417,
      y: height - 349,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
*/
    let left = ""
    let right = ""
    if(size == "1" || size == "2" || size == "3" || size == "4" || size == "5"){
      left = "3.5"
    }
    else{
      left = "4.0"
    }
    if(size == "1" || size == "6"){
      right = "16"
    }
    else if(size == "2" || size == "7"){
      right = "18"
    }
    else if(size == "3" || size == "8"){
      right = "22"
    }
    else if(size == "4" || size == "9"){
      right = "25"
    }
    else if(size == "5" || size == "10"){
      right = "28"
    }

    pages.forEach((page) => {
    const { height, width } = page.getSize();
    if(size == '10'){
      page.drawText('1', {
      x: 422,
      y: height - 68,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    page.drawText('0', {
      x: 422,
      y: height - 68,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    }
    else{
     page.drawText('0', {
      x: 422,
      y: height - 68,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(size, {
      x: 440,
      y: height - 70,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    }
    page.drawText(left, {
      x: 340,
      y: height - 90,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    page.drawText(right, {
      x: 440,
      y: height - 90,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
  });

    const lot_no_1 = getLotNumber("MS-00-50002", lotPreviewData)
    const lot_no_2 = getLotNumber("STR-DA2-CA-10001", lotPreviewData)
    const lot_no_3 = getLotNumber("MS-DA2-50002", lotPreviewData)
    const lot_no_4 = getLotNumber("MS-DA2-50003", lotPreviewData)
    const lot_no_5 = getLotNumber("MS-00-50003", lotPreviewData)
    const lot_no_6 = getLotNumber("MS-00-50014", lotPreviewData)
    const lot_no_7 = getLotNumber("LBL-DA2-0001", lotPreviewData)
    const lot_no_8 = getLotNumber("STR-DA2-PK-30007", lotPreviewData)
    const lot_no_9 = getLotNumber("STR-DA2-PK-30006", lotPreviewData)
    const lot_no_10 = getLotNumber("STR-DA2-PK-30004", lotPreviewData)
    const lot_no_11 = getLotNumber("LBL-DA2-0005", lotPreviewData)
    const lot_no_12 = getLotNumber("LBL-DA2-0004", lotPreviewData)
    const lot_no_13 = getLotNumber("MS-00-50012", lotPreviewData)
    const lot_no_14 = getLotNumber("MS-00-50013", lotPreviewData)
    const lot_no_15 = getLotNumber("STR-DA2-PK-30003", lotPreviewData)

    if(type == 'E'){
      firstPage.drawText('X', {
      x: 510,
      y: height - 189,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    }
    else if (type == 'M'){
      firstPage.drawText('X', {
      x: 510,
      y: height - 200,
      size: 10,
      font,
      color: rgb(0, 0, 0),
      });
    }
    else if (type == 'P'){
      firstPage.drawText('X', {
      x: 510,
      y: height - 220,
      size: 10,
      font,
      color: rgb(0, 0, 0),
      });
    }

    firstPage.drawText(quantity, {
      x: 300,
      y: height - 170,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });

    if(size == "10"){
      secondPage.drawText("10", {
      x: 150,
      y: height - 440,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    }
    else{
      secondPage.drawText("0", {
      x: 150,
      y: height - 449,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    secondPage.drawText(size, {
      x: 152,
      y: height - 449,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    }

    if(size == "1" || size == "2" || size == "6" || size == "7"){
      secondPage.drawText("01", {
      x: 150,
      y: height - 440,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    }
    else if(size == "3" || size == "4" || size == "8" || size == "9"){
      secondPage.drawText("02", {
      x: 150,
      y: height - 440,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    }
    else if(size == "5" || size == "10"){
      secondPage.drawText("03", {
      x: 150,
      y: height - 440,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    }

    secondPage.drawText("filled", {
      x: 590,
      y: height - 410,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });

    secondPage.drawText(quantity, {
      x: 690,
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

    secondPage.drawText(quantity, {
      x: 690,
      y: height - 449,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });

    fourthPage.drawText(lot_no_2, {
      x: 590,
      y: height - 300,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

     fourthPage.drawText(quantity, {
      x: 690,
      y: height - 300,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fourthPage.drawText(lot_no_1, {
      x: 590,
      y: height - 345,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fourthPage.drawText(quantity, {
      x: 690,
      y: height - 345,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fifthPage.drawText(lot_no_3, {
      x: 590,
      y: height - 422,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fifthPage.drawText(quantity, {
      x: 690,
      y: height - 422,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fifthPage.drawText(lot_no_4, {
      x: 590,
      y: height - 455,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fifthPage.drawText(quantity, {
      x: 690,
      y: height - 455,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    fifthPage.drawText(lot_no_5, {
      x: 590,
      y: height - 502,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    seventhPage.drawText(lot_no_6, {
      x: 590,
      y: height - 400,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    seventhPage.drawText(lot_no_7, {
      x: 590,
      y: height - 447,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    seventhPage.drawText(quantity, {
      x: 690,
      y: height - 447,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(lot_no_8, {
      x: 590,
      y: height - 410,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(quantity, {
      x: 690,
      y: height - 410,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(lot_no_9, {
      x: 590,
      y: height - 430,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(quantity, {
      x: 690,
      y: height - 430,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(lot_no_10, {
      x: 590,
      y: height - 450,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(quantity, {
      x: 690,
      y: height - 450,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(lot_no_11, {
      x: 590,
      y: height - 470,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(quantity, {
      x: 690,
      y: height - 470,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(lot_no_12, {
      x: 590,
      y: height - 490,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(quantity, {
      x: 690,
      y: height - 490,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(lot_no_13, {
      x: 590,
      y: height - 510,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(quantity, {
      x: 690,
      y: height - 510,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(lot_no_14, {
      x: 590,
      y: height - 530,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    tenthPage.drawText(String(2*Number(quantity)), {
      x: 690,
      y: height - 530,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })

    /*thirteenthPage.drawText("filled", {
      x: 590,
      y: height - 303,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })*/

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

