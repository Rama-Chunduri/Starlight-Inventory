import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

const levelHeights = {
      Level1: -200,
      Level2: -100,
      Level3: 0,
      Level4: 100,
      Level5: 200,
      Level6: 300,
      Level7: 400
};

function buildTree(nodes, links) {
    const nodeMap = {};
    nodes.forEach(node => {
        node.children = [];
        nodeMap[node.id] = node;
    });

    links.forEach(link => {
        const child = nodeMap[link.source];
        const parent = nodeMap[link.target];
        if (parent && child) {
            parent.children.push(child);
        }
    });

    const root = nodes.find(n => Array.isArray(n.labels) && n.labels.includes("Level1"));
    return root;
}

const FRGView = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/fr-bom-graph-view`);
      const data = await res.json();
      console.log("Fetched data:", data);


      // Defensive checks before mapping
      const nodes = Array.isArray(data.nodes)
        ? data.nodes.map(node => ({
            ...node,
            fx: undefined, 
            fy: levelHeights[node.label] ?? 0,
          }))
        : [];

      const links = Array.isArray(data.links) ? data.links : [];

      setGraphData({ nodes, links });
    } catch (err) {
      console.error("Failed to fetch graph data:", err);
      setGraphData({ nodes: [], links: [] });
    }
  };

  fetchData();
}, []);


    const labelColors = {
        Level1: "#bcbd22",   // yellowgreen
        Level2: "#ff7f0e",   // orange
        Level3: "#2ca02c",   // green
        Level4: "#d62728",   // red
        Level5: "#9467bd",   // purple
        Level6: "#8c564b",   // brown
        Level7: "#e377c2",   // pink
    };
    
    const displayLabels = {
        id: "ID",
        label: "Level",
        description: "Description",
        number: "Number",
        owner: "Owner",
        inspection_instructions: "Inspection Instructions",
        notes: "notes",
        part_number: "Part Number",
        units: "Units",
        quantity: "Quantity"
    }

  return (
    <div style={{ height: "100vh", margin: "2rem"}}>
        <h1>Flow Restrictor BOM Graph View</h1>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node) => `${node.label}: ${node.description}`}
        nodeColor={(node) => {
        console.log("Node label:", node.label);
        return labelColors[node.label] || "#888888";
    }}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkColor={() => "#aaa"}
        onNodeClick={(node) => setSelectedNode(node)}
      />
      {selectedNode &&(
        <div
        style={{
            position: "absolute",
            top: 40,
            right: 40,
            backgroundColor: "#35F1E3",
            color: "#fff",
            padding: "1rem",
            borderRadius: "8px",
            maxWidth: "400px",
        }}
        >
        <h3 style={{backgroundColor: "#35F1E3", color:"#173D62"}}>Component Details</h3>
        {["id", "label", "description", "number", "owner", "inspection_instructions", "notes", "part_number","units", "quantity"].map((key)=>(
             selectedNode[key] !== undefined && (
                <div key={key} style={{backgroundColor: "#35F1E3", color: "#173D62"}}>
                    <strong style={{backgroundColor: "#35F1E3", color: "#173d62"}}>{displayLabels[key]}:</strong> {String(selectedNode[key])}
                </div>
  )
        ))}
        </div>
      )
      }
    </div>
  );
};

export default FRGView;

