import { useState } from "react";

const quantities = [
    	{name: "Sterilized Starlight Stent Systems DDPC32", low_quantity: 8, 
            lots: [
                {name: "lot1", quantity: 5},
                {name: "lot2", quantity: 3}
            ]
        },
        {name: "DA Stent System Sterilization Cycle Specification", low_quantity: 8, 
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Unsterilized Starlight Stent Systems DDPC32", low_quantity: 8,  lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]},
        {name: "Starlight Stent System Shipper Box", low_quantity: 50, 
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Packaged Starlight Stent System DDPC32", low_quantity: 8, 
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Shelf Carton", low_quantity: 100,  lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]},
        {name: "Lifeline Stent Shelf Carton & Pouch Label Printed Static Artwork", low_quantity: 8, 
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Lifeline Stent Instructions For Use", low_quantity: 10, 
              lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Tyvek Pouch" , low_quantity: 100,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Hoop Support Card" , low_quantity: 100,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name:"Starlight Stent System DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Stent Assembly DDPC32", low_quantity:8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Stent Radiopaque Markers DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Stent DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Nitinol Tubing, DDPC32", low_quantity: 50,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Rotating Hemostatic Valve", low_quantity: 100,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Hub Housing DDPC32" , low_quantity:100,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Hub Bushing DDPC32", low_quantity: 100,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Strain Relief DDPC32", low_quantity: 100,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Hub Adhesive", low_quantity: 5,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Coated Pusher Tube DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Uncoated Pusher Tube DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Proximal Lct DDPC32", low_quantity: 100,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Liner DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Distal Outer Extrusion DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Distal LCT DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Marker Band DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Distal LCT DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Tube Marker Band DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Retainer DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Pusher Masking Heat Shrink", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "PTFE Coated Pusher Coating Mandrel", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Assembly DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Uncoated Catheter DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Hub", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Strain Relief DDPC32", low_quantity: 100,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Taper Pebax 25D DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Taper Pebax 72D DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "PTFE Coated Catheter Coating Mandrel", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Distal Catheter DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Braid", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Braid Ribbon", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Fiber DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Pet Shrink DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Liner DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Marker DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        },
        {name: "Catheter Extrusions DDPC32", low_quantity: 8,
             lots: [
                {name: "lot1", quantity: 4},
                {name: "lot2", quantity: 4}
            ]
        }
]

export default quantities;