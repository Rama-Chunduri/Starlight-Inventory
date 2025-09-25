import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDropDown from "./CustomDropDown"

function StentBOMBuild() {
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState(0);
  const [type, setType] = useState("")
  const navigate = useNavigate();

  const baseParts = [
    "STR-DA2-CA-10001",
    "MS-00-50002",
    "MS-DA2-50002",
    "MS-DA2-50003",
    "MS-00-50003",
    "STR-DA2-DS-30014",
    "MS-00-50014",
    "LBL-DA2-0001",
    "STR-DA2-PK-30007",
    "STR-DA2-PK-30006",
    "STR-DA2-PK-30004",
    "LBL-DA2-0005",
    "LBL-DA2-0004",
    "MS-00-50012",
    "MS-00-50013",
    "STR-DA2-PK-30003",
  ];

  function buildDynamicParts(size) {
    let result = [];

    // Stent Assembly
    let p6 = "STR-DA2-IM-10009";
    if (size === 10) {
      p6 = p6.concat(".10");
    } else {
      p6 = p6.concat(".0" + String(size));
    }
    result.push(p6);

    let p7 = "STR-DA2-PT-10012";
    if (size === 1 || size === 2) p7 = p7.concat(".01");
    else if (size === 3 || size === 4) p7 = p7.concat(".02");
    else if (size === 5) p7 = p7.concat(".03");
    else if (size === 6 || size === 7) p7 = p7.concat(".01");
    else if (size === 8 || size === 9) p7 = p7.concat(".02");
    else p7 = p7.concat(".03");

    result.push(p7);

    return result;
  }

  function handlePickLots() {
    const finalParts = [...baseParts, ...buildDynamicParts(Number(size))];
    navigate("/lot-management", {
      state: {
        type,
        size,
        quantity,
        partNumberArray: finalParts,
      },
    });
  }

  return (
    <div
      style={{
        color: "white",
        margin: "2rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Sterilized Starlight Stent System DDPC32</h1>
      <h2>Building Quantity</h2>
      <input
        type="number"
        placeholder="Enter quantity"
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{
          backgroundColor: "#BDC1C3",
          color: "#173D62",
          borderRadius: "8px",
          padding: "0.5rem",
          fontSize: "1rem",
          width: "50%",
        }}
      />
      <h2>Pick Size</h2>
      <input
        type="number"
        placeholder="Enter size (1-10)"
        onChange={(e) => setSize(Number(e.target.value))}
        style={{
          backgroundColor: "#BDC1C3",
          color: "#173D62",
          borderRadius: "8px",
          padding: "0.5rem",
          fontSize: "1rem",
          width: "50%",
        }}
      />
      <h2>Build Type</h2>
       <input
        type="text"
        placeholder="Enter E/M/P"
        onChange={(e) => setType(Number(e.target.value))}
        style={{
          backgroundColor: "#BDC1C3",
          color: "#173D62",
          borderRadius: "8px",
          padding: "0.5rem",
          fontSize: "1rem",
          width: "50%",
        }}
      />

      <h1>Subcomponents</h1>
      {baseParts.map((p) => (
        <h2 key={p}>{p}</h2>
      ))}

      {/* don’t hardcode .00, just show placeholders */}
      <h2>Stent Assembly (dynamic)</h2>
      <h2>Coated Pusher Tube DDPC32 (dynamic)</h2>

      <button
        style={{
          marginBottom: "2rem",
          marginTop: "2rem",
          marginLeft: "0.5rem",
          color: "#173D62",
          backgroundColor: "#BDC1C3",
          width: "30%",
        }}
        onClick={handlePickLots}
      >
        Pick Lots
      </button>
    </div>
  );
}

export default StentBOMBuild;
