import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";


const levelHeights = {
      Level1: -400,
      Level2: -300,
      Level3: -200,
      Level4: -100,
      Level5: 0,
      Level6: 100,
      Level7: 200,
      Level8: 300,
      Level9: 400,
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

const StentBOMGView = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        fetch("http://localhost:8000/stent-bom-graph-view")
          .then(res => res.json())
          .then(data => {
          const nodes = data.nodes.map(node => ({
            ...node,
            fx: undefined, // optional: let x float freely
            fy: levelHeights[node.label] ?? 0, // force y based on level
          }));
          setGraphData({
            nodes: nodes,
            links: data.links
          })
      });
        // const safeData = {
        //   nodes: Array.isArray(data.nodes) ? data.nodes : [],
        //   links: Array.isArray(data.links) ? data.links : [],
        // };

        // setGraphData(safeData);
      } catch (err) {
        console.error("Failed to fetch graph data:", err);
        // Optional: show fallback graph to prevent crash
        setGraphData({ nodes: [], links: [] });
      }
    };

    fetchData();
  }, []);

    const labelColors = {
        Level1: "#1f77b4",   // blue
        Level2: "#ff7f0e",   // orange
        Level3: "#2ca02c",   // green
        Level4: "#d62728",   // red
        Level5: "#9467bd",   // purple
        Level6: "#8c564b",   // brown
        Level7: "#e377c2",   // pink
        Level8: "#7f7f7f",   // gray
        Level9: "#bcbd22",   // yellow-green
    };

    


    const displayLabels = {
        id: "ID",
        label: "Level",
        description: "Description",
        part_number: "Part Number",
        units: "Units",
        quantity: "Quantity"
    }

  return (
    <div style={{ height: "100vh", margin: "2rem"}}>
        <h1>Stent BOM Graph View</h1>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node) => `${node.label}: ${node.description}`}
        nodeColor={(node) => {
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
        {["id", "label", "description", "part_number", "units", "quantity"].map((key)=>(
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

export default StentBOMGView;

