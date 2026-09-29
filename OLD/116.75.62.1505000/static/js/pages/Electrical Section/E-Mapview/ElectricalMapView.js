import React, {
    useEffect,
    useMemo,
    useState,
    useRef
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    Tooltip,
    useMap,
    ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import {
    GetElectricalLinesNestedData
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";
import {
    CLEAR_ELECTRICAL_LINES_NESTED
} from "../../../Redux/ActionTypes"
import "leaflet/dist/leaflet.css";

import LocationFilterBar from "../../../components/LocationFilterBar";

// Fix default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// ===================== CUSTOM ICONS - WITH STATUS COLORS =====================

// LINE POLE ICON - With status-based colors
const linePoleIcon = (isSelected = false, status = "pending") => {
    const statusColors = {
        approved: {
            main: "#27AE60",
            glow: "rgba(39, 174, 96, 0.3)"
        },
        submitted: {
            main: "#F39C12",
            glow: "rgba(243, 156, 18, 0.3)"
        },
        saved: {
            main: "#3498DB",
            glow: "rgba(52, 152, 219, 0.3)"
        },
        pending: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
        rejected: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
    };

    const color =
        status === "approved" ? statusColors.approved : statusColors.pending;

    return L.divIcon({
        className: "line-pole-icon",
        html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
        ${
          isSelected
            ? `<div style="
          position:absolute; 
          width:40px; height:40px; 
          border-radius:50%; 
          background:${color.glow};
          animation:pulse 1.5s ease-in-out infinite;
          top:50%; left:50%; transform:translate(-50%,-50%);
        "></div>`
            : ""
        }
        
        <!-- Status Indicator Ring -->
        <div style="
          position:absolute;
          top:12px; right:-4px;
          width:10px; height:10px;
          border-radius:50%;
          background:${color.main};
          border:2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
          z-index:5;
        "></div>
        
        <!-- Pole Structure -->
        <div style="
          display:flex; 
          flex-direction:column; 
          align-items:center;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        ">
          <!-- Cross Arms -->
          <div style="
            display:flex; 
            gap:4px; 
            margin-bottom:-2px;
            position:relative;
            z-index:2;
          ">
            <div style="width:16px; height:3px; background:#5D6D7E; border-radius:1px;"></div>
            <div style="width:16px; height:3px; background:#5D6D7E; border-radius:1px;"></div>
          </div>
          
          <!-- Main Pole -->
          <div style="
            width:4px; 
            height:22px; 
            background:linear-gradient(to bottom, #5D6D7E, #2C3E50);
            border-radius:2px;
            position:relative;
            z-index:1;
          ">
            <!-- Insulator dots -->
            <div style="position:absolute; top:-2px; left:-3px; width:10px; height:4px; background:#E74C3C; border-radius:2px;"></div>
            <div style="position:absolute; bottom:-2px; left:-3px; width:10px; height:4px; background:#E74C3C; border-radius:2px;"></div>
          </div>
          
          <!-- Base -->
          <div style="
            width:8px; 
            height:3px; 
            background:#34495E; 
            border-radius:1px;
            margin-top:-1px;
          "></div>
        </div>
      </div>
    `,
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40],
        tooltipAnchor: [0, -45],
    });
};

// CUT POLE ICON - With status colors
const cutPoleIcon = (isSelected = false, status = "pending") => {
    const statusColors = {
        approved: {
            main: "#27AE60",
            glow: "rgba(39, 174, 96, 0.3)"
        },
        submitted: {
            main: "#F39C12",
            glow: "rgba(243, 156, 18, 0.3)"
        },
        saved: {
            main: "#3498DB",
            glow: "rgba(52, 152, 219, 0.3)"
        },
        pending: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
        rejected: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
    };

    const color =
        status === "approved" ? statusColors.approved : statusColors.pending;

    return L.divIcon({
        className: "cut-pole-icon",
        html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
        ${
          isSelected
            ? `<div style="
          position:absolute; 
          width:40px; height:40px; 
          border-radius:50%; 
          background:${color.glow};
          animation:pulse 1.5s ease-in-out infinite;
          top:50%; left:50%; transform:translate(-50%,-50%);
        "></div>`
            : ""
        }
        
        <!-- Status Indicator Ring -->
        <div style="
          position:absolute;
          top:12px; right:-4px;
          width:10px; height:10px;
          border-radius:50%;
          background:${color.main};
          border:2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
          z-index:5;
        "></div>
        
        <!-- Cut Pole Structure -->
        <div style="
          display:flex; 
          flex-direction:column; 
          align-items:center;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        ">
          <!-- Cross Arms (zigzag/cut) -->
          <div style="
            display:flex; 
            gap:2px; 
            margin-bottom:-2px;
            position:relative;
            z-index:2;
          ">
            <div style="width:12px; height:2px; background:#E74C3C; transform:rotate(-15deg); border-radius:1px;"></div>
            <div style="width:12px; height:2px; background:#E74C3C; transform:rotate(15deg); border-radius:1px;"></div>
          </div>
          
          <!-- Cut Main Pole -->
          <div style="
            width:4px; 
            height:14px; 
            background:linear-gradient(to bottom, #5D6D7E, #2C3E50);
            border-radius:2px;
            position:relative;
            z-index:1;
          ">
            <!-- Break/Cut mark -->
            <div style="
              position:absolute; 
              top:50%; left:50%; 
              transform:translate(-50%,-50%);
              width:10px; 
              height:2px; 
              background:#E74C3C;
              border-radius:1px;
              box-shadow:0 -2px 0 #E74C3C, 0 2px 0 #E74C3C;
            "></div>
          </div>
          
          <!-- Broken Base -->
          <div style="
            width:8px; 
            height:3px; 
            background:#34495E; 
            border-radius:1px;
            margin-top:-1px;
            clip-path:polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
          "></div>
        </div>
      </div>
    `,
        iconSize: [28, 35],
        iconAnchor: [14, 35],
        popupAnchor: [0, -35],
        tooltipAnchor: [0, -40],
    });
};

// TURBINE ICON
const turbineIcon = (isSelected = false) => {
    return L.divIcon({
        className: "turbine-icon",
        html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
        ${
          isSelected
            ? `<div style="
          position:absolute; 
          width:50px; height:50px; 
          border-radius:50%; 
          background:rgba(46, 204, 113, 0.2);
          animation:pulse 1.5s ease-in-out infinite;
          top:50%; left:50%; transform:translate(-50%,-50%);
        "></div>`
            : ""
        }
        
        <div style="
          display:flex; 
          flex-direction:column; 
          align-items:center;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
        ">
          <!-- Rotating Blades -->
          <div style="
            position:relative;
            width:32px;
            height:32px;
            animation:spin 8s linear infinite;
          ">
            <div style="
              position:absolute;
              top:0; left:50%;
              transform:translateX(-50%);
              width:2px;
              height:14px;
              background:linear-gradient(to top, #BDC3C7, #95A5A6);
              border-radius:2px;
            "></div>
            <div style="
              position:absolute;
              top:50%; right:0;
              transform:translateY(-50%);
              width:14px;
              height:2px;
              background:linear-gradient(to right, #BDC3C7, #95A5A6);
              border-radius:2px;
            "></div>
            <div style="
              position:absolute;
              bottom:0; left:50%;
              transform:translateX(-50%);
              width:2px;
              height:14px;
              background:linear-gradient(to bottom, #BDC3C7, #95A5A6);
              border-radius:2px;
            "></div>
            <div style="
              position:absolute;
              top:50%; left:50%;
              transform:translate(-50%,-50%);
              width:6px;
              height:6px;
              background:#ECF0F1;
              border-radius:50%;
              border:1px solid #95A5A6;
            "></div>
          </div>
          
          <!-- Tower -->
          <div style="
            width:2px;
            height:18px;
            background:linear-gradient(to bottom, #95A5A6, #7F8C8D);
            border-radius:1px;
            margin-top:-10px;
          "></div>
          
          <!-- Base -->
          <div style="
            width:10px;
            height:3px;
            background:#7F8C8D;
            border-radius:2px;
            margin-top:-1px;
          "></div>
        </div>
      </div>
    `,
        iconSize: [38, 50],
        iconAnchor: [19, 50],
        popupAnchor: [0, -50],
        tooltipAnchor: [0, -55],
    });
};

// TOWER ICONS - With status colors
const towerTypeAIcon = (isSelected = false, status = "pending") => {
    const statusColors = {
        approved: {
            main: "#27AE60",
            glow: "rgba(39, 174, 96, 0.3)"
        },
        submitted: {
            main: "#F39C12",
            glow: "rgba(243, 156, 18, 0.3)"
        },
        saved: {
            main: "#3498DB",
            glow: "rgba(52, 152, 219, 0.3)"
        },
        pending: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
        rejected: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
    };

    const color =
        status === "approved" ? statusColors.approved : statusColors.pending;

    return L.divIcon({
        className: "tower-type-a-icon",
        html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
        ${
          isSelected
            ? `<div style="
          position:absolute; 
          width:44px; height:44px; 
          border-radius:50%; 
          background:${color.glow};
          animation:pulse 1.5s ease-in-out infinite;
          top:50%; left:50%; transform:translate(-50%,-50%);
        "></div>`
            : ""
        }
        
        <!-- Status Indicator Ring -->
        <div style="
          position:absolute;
          top:12px; right:-4px;
          width:10px; height:10px;
          border-radius:50%;
          background:${color.main};
          border:2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
          z-index:5;
        "></div>
        
        <div style="
          display:flex; 
          flex-direction:column; 
          align-items:center;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
        ">
          <div style="
            display:flex; 
            gap:6px; 
            margin-bottom:-2px;
            position:relative;
            z-index:2;
          ">
            <div style="width:20px; height:3px; background:#5D6D7E; border-radius:1px;"></div>
            <div style="width:20px; height:3px; background:#5D6D7E; border-radius:1px;"></div>
          </div>
          
          <div style="
            width:8px; 
            height:26px; 
            background:linear-gradient(to bottom, #5D6D7E, #2C3E50);
            border-radius:2px;
            position:relative;
            z-index:1;
            clip-path:polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
          ">
            <div style="position:absolute; top:4px; left:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(-15deg);"></div>
            <div style="position:absolute; top:8px; right:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(15deg);"></div>
            <div style="position:absolute; top:12px; left:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(-15deg);"></div>
            <div style="position:absolute; top:16px; right:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(15deg);"></div>
          </div>
          
          <div style="
            width:14px; 
            height:3px; 
            background:#34495E; 
            border-radius:1px;
            margin-top:-1px;
          "></div>
          
          <div style="
            position:absolute;
            top:-2px;
            right:-10px;
            font-size:8px;
            font-weight:bold;
            color:#2C3E50;
            background:#ECF0F1;
            padding:1px 3px;
            border-radius:2px;
            border:1px solid #BDC3C7;
          ">A</div>
        </div>
      </div>
    `,
        iconSize: [32, 44],
        iconAnchor: [16, 44],
        popupAnchor: [0, -44],
        tooltipAnchor: [0, -49],
    });
};

// Similar for B, C, D - simplified for brevity, but all will have status colors
const towerTypeBIcon = (isSelected = false, status = "pending") => {
    const statusColors = {
        approved: {
            main: "#27AE60",
            glow: "rgba(39, 174, 96, 0.3)"
        },
        submitted: {
            main: "#F39C12",
            glow: "rgba(243, 156, 18, 0.3)"
        },
        saved: {
            main: "#3498DB",
            glow: "rgba(52, 152, 219, 0.3)"
        },
        pending: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
        rejected: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
    };

    const color =
        status === "approved" ? statusColors.approved : statusColors.pending;

    return L.divIcon({
        className: "tower-type-b-icon",
        html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
        ${
          isSelected
            ? `<div style="
          position:absolute; 
          width:44px; height:44px; 
          border-radius:50%; 
          background:${color.glow};
          animation:pulse 1.5s ease-in-out infinite;
          top:50%; left:50%; transform:translate(-50%,-50%);
        "></div>`
            : ""
        }
        
        <div style="
          position:absolute;
        top:12px; right:-4px;
          width:10px; height:10px;
          border-radius:50%;
          background:${color.main};
          border:2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
          z-index:5;
        "></div>
        
        <div style="
          display:flex; 
          flex-direction:column; 
          align-items:center;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
        ">
          <div style="
            display:flex; 
            gap:6px; 
            margin-bottom:-2px;
            position:relative;
            z-index:3;
          ">
            <div style="width:22px; height:3px; background:#5D6D7E; border-radius:1px;"></div>
            <div style="width:22px; height:3px; background:#5D6D7E; border-radius:1px;"></div>
          </div>
          
          <div style="
            display:flex; 
            gap:4px; 
            margin-bottom:-2px;
            position:relative;
            z-index:2;
          ">
            <div style="width:16px; height:2px; background:#5D6D7E; border-radius:1px;"></div>
            <div style="width:16px; height:2px; background:#5D6D7E; border-radius:1px;"></div>
          </div>
          
          <div style="
            width:8px; 
            height:32px; 
            background:linear-gradient(to bottom, #5D6D7E, #2C3E50);
            border-radius:2px;
            position:relative;
            z-index:1;
            clip-path:polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
          ">
            <div style="position:absolute; top:4px; left:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(-15deg);"></div>
            <div style="position:absolute; top:9px; right:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(15deg);"></div>
            <div style="position:absolute; top:14px; left:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(-15deg);"></div>
            <div style="position:absolute; top:19px; right:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(15deg);"></div>
            <div style="position:absolute; top:24px; left:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(-15deg);"></div>
          </div>
          
          <div style="
            width:14px; 
            height:3px; 
            background:#34495E; 
            border-radius:1px;
            margin-top:-1px;
          "></div>
          
          <div style="
            position:absolute;
            top:-2px;
            right:-10px;
            font-size:8px;
            font-weight:bold;
            color:#2C3E50;
            background:#ECF0F1;
            padding:1px 3px;
            border-radius:2px;
            border:1px solid #BDC3C7;
          ">B</div>
        </div>
      </div>
    `,
        iconSize: [32, 50],
        iconAnchor: [16, 50],
        popupAnchor: [0, -50],
        tooltipAnchor: [0, -55],
    });
};

const towerTypeCIcon = (isSelected = false, status = "pending") => {
    const statusColors = {
        approved: {
            main: "#27AE60",
            glow: "rgba(39, 174, 96, 0.3)"
        },
        submitted: {
            main: "#F39C12",
            glow: "rgba(243, 156, 18, 0.3)"
        },
        saved: {
            main: "#3498DB",
            glow: "rgba(52, 152, 219, 0.3)"
        },
        pending: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
        rejected: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
    };

    const color =
        status === "approved" ? statusColors.approved : statusColors.pending;

    return L.divIcon({
        className: "tower-type-c-icon",
        html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
        ${
          isSelected
            ? `<div style="
          position:absolute; 
          width:44px; height:44px; 
          border-radius:50%; 
          background:${color.glow};
          animation:pulse 1.5s ease-in-out infinite;
          top:50%; left:50%; transform:translate(-50%,-50%);
        "></div>`
            : ""
        }
        
        <div style="
          position:absolute;
       top:12px; right:-4px;
          width:10px; height:10px;
          border-radius:50%;
          background:${color.main};
          border:2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
          z-index:5;
        "></div>
        
        <div style="
          display:flex; 
          flex-direction:column; 
          align-items:center;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
        ">
          <div style="
            display:flex; 
            gap:6px; 
            margin-bottom:-2px;
            position:relative;
            z-index:2;
          ">
            <div style="width:24px; height:4px; background:#5D6D7E; border-radius:1px;"></div>
            <div style="width:24px; height:4px; background:#5D6D7E; border-radius:1px;"></div>
          </div>
          
          <div style="
            width:10px; 
            height:28px; 
            background:linear-gradient(to bottom, #5D6D7E, #2C3E50);
            border-radius:2px;
            position:relative;
            z-index:1;
            clip-path:polygon(0% 0%, 100% 0%, 75% 100%, 25% 100%);
          ">
            <div style="position:absolute; top:4px; left:-5px; width:20px; height:2px; background:#7F8C8D; transform:rotate(-15deg);"></div>
            <div style="position:absolute; top:9px; right:-5px; width:20px; height:2px; background:#7F8C8D; transform:rotate(15deg);"></div>
            <div style="position:absolute; top:14px; left:-5px; width:20px; height:2px; background:#7F8C8D; transform:rotate(-15deg);"></div>
            <div style="position:absolute; top:19px; right:-5px; width:20px; height:2px; background:#7F8C8D; transform:rotate(15deg);"></div>
          </div>
          
          <div style="
            width:18px; 
            height:4px; 
            background:#34495E; 
            border-radius:1px;
            margin-top:-1px;
          "></div>
          
          <div style="
            position:absolute;
            top:-2px;
            right:-10px;
            font-size:8px;
            font-weight:bold;
            color:#2C3E50;
            background:#ECF0F1;
            padding:1px 3px;
            border-radius:2px;
            border:1px solid #BDC3C7;
          ">C</div>
        </div>
      </div>
    `,
        iconSize: [36, 46],
        iconAnchor: [18, 46],
        popupAnchor: [0, -46],
        tooltipAnchor: [0, -51],
    });
};

const towerTypeDIcon = (isSelected = false, status = "pending") => {
    const statusColors = {
        approved: {
            main: "#27AE60",
            glow: "rgba(39, 174, 96, 0.3)"
        },
        submitted: {
            main: "#F39C12",
            glow: "rgba(243, 156, 18, 0.3)"
        },
        saved: {
            main: "#3498DB",
            glow: "rgba(52, 152, 219, 0.3)"
        },
        pending: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
        rejected: {
            main: "#E74C3C",
            glow: "rgba(231, 76, 60, 0.3)"
        },
    };

    const color =
        status === "approved" ? statusColors.approved : statusColors.pending;

    return L.divIcon({
        className: "tower-type-d-icon",
        html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
        ${
          isSelected
            ? `<div style="
          position:absolute; 
          width:44px; height:44px; 
          border-radius:50%; 
          background:${color.glow};
          animation:pulse 1.5s ease-in-out infinite;
          top:50%; left:50%; transform:translate(-50%,-50%);
        "></div>`
            : ""
        }
        
        <div style="
          position:absolute;
          top:12px; right:-4px;
          width:10px; height:10px;
          border-radius:50%;
          background:${color.main};
          border:2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
          z-index:5;
        "></div>
        
        <div style="
          display:flex; 
          flex-direction:column; 
          align-items:center;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
        ">
          <div style="
            display:flex; 
            gap:6px; 
            margin-bottom:-2px;
            position:relative;
            z-index:4;
          ">
            <div style="width:20px; height:3px; background:#5D6D7E; border-radius:1px;"></div>
            <div style="width:20px; height:3px; background:#5D6D7E; border-radius:1px;"></div>
          </div>
          
          <div style="
            display:flex; 
            gap:4px; 
            margin-bottom:-2px;
            position:relative;
            z-index:3;
          ">
            <div style="width:16px; height:2px; background:#5D6D7E; border-radius:1px;"></div>
            <div style="width:16px; height:2px; background:#5D6D7E; border-radius:1px;"></div>
          </div>
          
          <div style="
            display:flex; 
            gap:4px; 
            margin-bottom:-2px;
            position:relative;
            z-index:2;
          ">
            <div style="width:14px; height:2px; background:#5D6D7E; border-radius:1px;"></div>
            <div style="width:14px; height:2px; background:#5D6D7E; border-radius:1px;"></div>
          </div>
          
          <div style="
            width:8px; 
            height:36px; 
            background:linear-gradient(to bottom, #5D6D7E, #2C3E50);
            border-radius:2px;
            position:relative;
            z-index:1;
            clip-path:polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
          ">
            <div style="position:absolute; top:4px; left:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(-15deg);"></div>
            <div style="position:absolute; top:8px; right:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(15deg);"></div>
            <div style="position:absolute; top:12px; left:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(-15deg);"></div>
            <div style="position:absolute; top:16px; right:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(15deg);"></div>
            <div style="position:absolute; top:20px; left:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(-15deg);"></div>
            <div style="position:absolute; top:24px; right:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(15deg);"></div>
            <div style="position:absolute; top:28px; left:-4px; width:16px; height:1px; background:#7F8C8D; transform:rotate(-15deg);"></div>
          </div>
          
          <div style="
            width:14px; 
            height:3px; 
            background:#34495E; 
            border-radius:1px;
            margin-top:-1px;
          "></div>
          
          <div style="
            position:absolute;
            top:-2px;
            right:-10px;
            font-size:8px;
            font-weight:bold;
            color:#2C3E50;
            background:#ECF0F1;
            padding:1px 3px;
            border-radius:2px;
            border:1px solid #BDC3C7;
          ">D</div>
        </div>
      </div>
    `,
        iconSize: [32, 54],
        iconAnchor: [16, 54],
        popupAnchor: [0, -54],
        tooltipAnchor: [0, -59],
    });
};

// ===================== MAIN TOWER ICON SELECTOR =====================
const getTowerIcon = (towerType, isSelected = false, status = "pending") => {
    if (!towerType) return towerTypeAIcon(isSelected, status);

    const type = towerType.toUpperCase().trim();
    switch (type) {
        case "A":
            return towerTypeAIcon(isSelected, status);
        case "B":
            return towerTypeBIcon(isSelected, status);
        case "C":
            return towerTypeCIcon(isSelected, status);
        case "D":
            return towerTypeDIcon(isSelected, status);
        default:
            return towerTypeAIcon(isSelected, status);
    }
};

// ===================== MAP CONTROLLER =====================
const MapController = ({
    bounds,
    center
}) => {
    const map = useMap();

    useEffect(() => {
        if (bounds && bounds.length > 0) {
            const latLngBounds = L.latLngBounds(bounds);
            map.fitBounds(latLngBounds, {
                padding: [50, 50],
                maxZoom: 16
            });
        } else if (center) {
            map.setView(center, 13);
        }
    }, [bounds, center, map]);

    return null;
};

// ===================== MAIN COMPONENT =====================
const ElectricalMapView = () => {
    const dispatch = useDispatch();
    const [selectedLine, setSelectedLine] = useState(null);
    const [selectedPole, setSelectedPole] = useState(null);
    const [selectedTurbine, setSelectedTurbine] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [baseMap, setBaseMap] = useState("street");
    const mapRef = useRef();

    const {
        getElectricalLinesNested = [], loading
    } = useSelector(
        (state) => state.electricalData,
    );



    const [filters, setFilters] = useState({
        project: "",
        windfarm: "",
        cluster: "",
    });

    useEffect(() => {
        if (filters ? .project && filters ? .windfarm) {
            dispatch(
                GetElectricalLinesNestedData({
                    project: filters.project,
                    windfarm: filters.windfarm,
                    cluster: filters.cluster,
                }),
            );
        } else {
            dispatch({
                type: CLEAR_ELECTRICAL_LINES_NESTED,
            });
        }


    }, [dispatch, filters ? .project, filters ? .windfarm, filters ? .cluster]);

    const hasFilters = filters.project && filters.windfarm;

    // Process data - NOW INCLUDES ALL LINES (approved + pending)
    const processedData = useMemo(() => {
        if (!hasFilters) {
            return {
                poles: [],
                lines: [],
                turbines: [],
                lineTurbines: [],
                poleTurbines: [],
                stats: {
                    totalLines: 0,
                    approvedLines: 0,
                    pendingLines: 0,
                    totalPoles: 0,
                    totalTurbines: 0,
                    lineTurbines: 0,
                    poleLinkedTurbines: 0,
                    approvedPoles: 0,
                    submittedPoles: 0,
                    pendingPoles: 0,
                    cutPoles: 0,
                    linePoles: 0,
                    towers: 0,
                    totalKm: 0,
                },
            };
        }

        if (!Array.isArray(getElectricalLinesNested)) {
            return {
                poles: [],
                lines: [],
                turbines: [],
                lineTurbines: [],
                stats: {},
            };
        }

        const poles = [];
        const lineTurbines = [];
        const poleTurbines = [];
        const lineDetails = [];

        getElectricalLinesNested.forEach((line) => {
            // Determine line status
            const lineStatus = line.approved_at ?
                "approved" :
                line.submitted_at ?
                "submitted" :
                line.saved_at ?
                "saved" :
                "pending";

            lineDetails.push({
                id: line.id,
                name: line.line_name,
                type: line.line_type,
                cluster: line.cluster_name,
                status: lineStatus,
                totalPoles: line.total_poles || 0,
                km: line.km || 0,
                approvedAt: line.approved_at,
                isApproved: !!line.approved_at,
            });

            // ============ PROCESS POLES - USING LATITUDE/LONGITUDE ============
            (line.pole_details || []).forEach((pole) => {
                // ✅ CHANGE 1: Use latitude/longitude instead of easting/northing
                if (pole.latitude && pole.longitude) {
                    let poleStatus = lineStatus;

                    if (pole.approved_l3_at) {
                        poleStatus = "approved";
                    } else if (
                        pole.submitted_l1_at ||
                        pole.submitted_l2_at ||
                        pole.submitted_l3_at
                    ) {
                        poleStatus = "submitted";
                    } else if (pole.saved_l1_at || pole.saved_l2_at || pole.saved_l3_at) {
                        poleStatus = "saved";
                    }

                    const isMCOH = line.line_type ? .includes("MCOH");

                    // ✅ CHANGE 2: Check pole.turbine_location for latitude/longitude
                    let turbineLocationData = null;
                    if (
                        pole.turbine_location &&
                        typeof pole.turbine_location === "object"
                    ) {
                        const tl = pole.turbine_location;
                        // Try latitude/longitude first
                        if (tl.latitude && tl.longitude) {
                            turbineLocationData = {
                                id: tl.id,
                                name: tl.location_no || `T-${tl.id}`,
                                lat: parseFloat(tl.latitude),
                                lng: parseFloat(tl.longitude),
                                lineId: line.id,
                                lineName: line.line_name,
                                cluster: line.cluster_name,
                                poleId: pole.id,
                                poleNumber: pole.pole_number,
                                isPoleLinked: true,
                            };
                        }
                        // Fallback to gps_coordinates if needed
                        else if (tl.gps_coordinates) {
                            const [lat, lng] = tl.gps_coordinates
                                .split(",")
                                .map((v) => parseFloat(v.trim()));
                            if (lat && lng) {
                                turbineLocationData = {
                                    id: tl.id,
                                    name: tl.location_no || `T-${tl.id}`,
                                    lat,
                                    lng,
                                    lineId: line.id,
                                    lineName: line.line_name,
                                    cluster: line.cluster_name,
                                    poleId: pole.id,
                                    poleNumber: pole.pole_number,
                                    isPoleLinked: true,
                                };
                            }
                        }
                    }

                    poles.push({
                        id: pole.id,
                        number: pole.pole_number || `P-${pole.id}`,
                        lat: parseFloat(pole.latitude), // ✅ Using latitude
                        lng: parseFloat(pole.longitude), // ✅ Using longitude
                        type: isMCOH ?
                            "tower" :
                            pole.pole_type &&
                            (pole.pole_type.toLowerCase() === "cut pole" ||
                                pole.pole_type.toLowerCase() === "cut_pole") ?
                            "cut_pole" :
                            "line_pole",
                        poleHeight: !isMCOH ? pole.pole_height : null,
                        poleType: !isMCOH ? pole.pole_type : null,
                        towerType: isMCOH ? pole.tower_type : null,
                        extension: isMCOH ? pole.extension : null,
                        span: pole.span || 0,
                        crossingType: pole.crossing_type || "none",
                        crossingDetails: pole.line_crossing_details || "",
                        lineName: line.line_name || `Line ${line.id}`,
                        electricalLineId: line.id,
                        status: poleStatus,
                        village: pole.village || "N/A",
                        contractor: pole.contractor_name || "N/A",
                        turbineInterconnected: pole.turbine_interconnected || null,
                        turbineLocation: turbineLocationData,
                        photo: pole.photo,
                        file: pole.file,
                        startDate: pole.start_date,
                        commissioningDate: pole.commissioning_date,
                        isLineApproved: !!line.approved_at,
                    });

                    if (turbineLocationData) {
                        poleTurbines.push(turbineLocationData);
                    }
                }
            });

            // ============ PROCESS TURBINE_LOCATIONS ARRAY - USING LATITUDE/LONGITUDE ============
            // ✅ CHANGE 3: Use turbine_locations array with latitude/longitude
            (line.turbine_locations || []).forEach((turbine) => {
                if (turbine.latitude && turbine.longitude) {
                    const alreadyLinked = poleTurbines.some((pt) => pt.id === turbine.id);
                    lineTurbines.push({
                        id: turbine.id,
                        name: turbine.location_no || `T-${turbine.id}`,
                        lat: parseFloat(turbine.latitude), // ✅ Using latitude
                        lng: parseFloat(turbine.longitude), // ✅ Using longitude
                        lineId: line.id,
                        lineName: line.line_name,
                        cluster: line.cluster_name,
                        isPoleLinked: alreadyLinked,
                        gpsCoordinates: turbine.gps_coordinates,
                    });
                }
            });
        });

        poles.sort((a, b) => a.id - b.id);

        // Combine all turbines
        const allTurbinesMap = new Map();
        [...lineTurbines, ...poleTurbines].forEach((t) => {
            if (!allTurbinesMap.has(t.id)) {
                allTurbinesMap.set(t.id, t);
            }
        });
        const allTurbines = Array.from(allTurbinesMap.values());

        const stats = {
            totalLines: lineDetails.length,
            approvedLines: lineDetails.filter((l) => l.isApproved).length,
            pendingLines: lineDetails.filter((l) => !l.isApproved).length,
            totalPoles: poles.length,
            totalTurbines: allTurbines.length,
            lineTurbines: lineTurbines.length,
            poleLinkedTurbines: poleTurbines.length,
            approvedPoles: poles.filter((p) => p.status === "approved").length,
            pendingPoles: poles.filter((p) => p.status !== "approved").length,
            cutPoles: poles.filter((p) => p.type === "cut_pole").length,
            linePoles: poles.filter((p) => p.type === "line_pole").length,
            towers: poles.filter((p) => p.type === "tower").length,
            totalKm: lineDetails.reduce((sum, l) => sum + (l.km || 0), 0),
        };

        return {
            poles,
            lines: lineDetails,
            turbines: allTurbines,
            lineTurbines,
            poleTurbines,
            stats,
        };
    }, [getElectricalLinesNested, filters.project, filters.windfarm]);

    // Group poles by line
    const linesWithPoles = useMemo(() => {
        const lineMap = new Map();
        processedData.poles.forEach((pole) => {
            if (!lineMap.has(pole.electricalLineId)) {
                const lineInfo = processedData.lines.find(
                    (l) => l.id === pole.electricalLineId,
                );
                lineMap.set(pole.electricalLineId, {
                    id: pole.electricalLineId,
                    name: pole.lineName,
                    poles: [],
                    status: lineInfo ? .status || "pending",
                    km: lineInfo ? .km || 0,
                    isApproved: lineInfo ? .isApproved || false,
                });
            }
            lineMap.get(pole.electricalLineId).poles.push(pole);
        });
        for (const [_, line] of lineMap) {
            line.poles.sort((a, b) => a.id - b.id);
        }
        return Array.from(lineMap.values());
    }, [processedData.poles, processedData.lines]);

    // ==================== LINE COLOR MAPPING - UPDATED FOR PENDING =====================
    const getLineColor = (lineType, isSelected = false, isApproved = false) => {
        if (isSelected) return "#E74C3C"; // Selected line - Red

        const type = lineType ? .toLowerCase() || "";

        // Pending lines - LIGHTER VERSION of their actual type colors
        if (!isApproved) {
            if (type.includes("mcoh")) return "#FF6B6B"; // MCOH ka pending color (light red)
            if (type.includes("dcoh")) return "#C39BD3"; // DCOH ka pending color (light purple)
            if (type.includes("scoh") && type.includes("dog")) return "#85C1E9"; // SCOH-Dog pending (light blue)
            if (type.includes("scoh")) return "#82E0AA"; // SCOH-Panther pending (light green)
            return "#F5B041"; // Default pending (light orange)
        }

        // Approved lines - ORIGINAL COLORS
        if (type.includes("mcoh")) return "#E74C3C"; // Red
        if (type.includes("dcoh")) return "#8E44AD"; // Purple
        if (type.includes("scoh") && type.includes("dog")) return "#3498DB"; // Blue
        if (type.includes("scoh")) return "#27AE60"; // Green

        return "#F39C12"; // Default Orange
    };

    // Create polylines - NOW INCLUDES ALL LINES
    const polylines = useMemo(() => {
        return linesWithPoles
            .filter((line) => line.poles.length > 1)
            .map((line) => {
                const isSelected = selectedLine === line.id;
                const lineData = processedData.lines.find((l) => l.id === line.id);
                const lineType = lineData ? .type || "";
                const isApproved = lineData ? .isApproved || false;

                return {
                    id: line.id,
                    name: line.name,
                    coordinates: line.poles.map((p) => [p.lat, p.lng]),
                    poles: line.poles,
                    km: line.km,
                    isSelected,
                    lineType: lineType,
                    isApproved: isApproved,
                    color: getLineColor(lineType, isSelected, isApproved),
                    weight: isSelected ? 6 : isApproved ? 4 : 3,
                    dashArray: isApproved ? null : "8,6", // Dashed for pending lines
                    opacity: isApproved ? 0.8 : 0.6, // Thoda transparent for pending
                };
            });
    }, [linesWithPoles, selectedLine, processedData.lines]);

    // Calculate center
    const {
        center,
        bounds
    } = useMemo(() => {
        const allPoints = [
            ...processedData.poles.map((p) => [p.lat, p.lng]),
            ...processedData.turbines.map((t) => [t.lat, t.lng]),
        ];
        if (allPoints.length === 0) {
            return {
                center: [18.5204, 73.8567],
                bounds: null
            };
        }
        const avgLat =
            allPoints.reduce((sum, p) => sum + p[0], 0) / allPoints.length;
        const avgLng =
            allPoints.reduce((sum, p) => sum + p[1], 0) / allPoints.length;
        return {
            center: [avgLat, avgLng],
            bounds: allPoints
        };
    }, [processedData.poles, processedData.turbines]);

    // Filter poles
    const filteredPoles = useMemo(() => {
        let filtered = processedData.poles;
        if (filterStatus === "approved") {
            filtered = filtered.filter((p) => p.status === "approved");
        }
        if (filterStatus === "pending") {
            filtered = filtered.filter((p) => p.status !== "approved");
        }
        if (filterType !== "all") {
            filtered = filtered.filter((p) => p.type === filterType);
        }
        return filtered;
    }, [processedData.poles, filterStatus, filterType]);

    // Get icon for pole - Now with status
    const getPoleIcon = (pole) => {
        const isSelected = selectedPole === pole.id;
        const status = pole.status || "pending";

        if (pole.type === "tower") {
            return getTowerIcon(pole.towerType, isSelected, status);
        }

        if (pole.type === "cut_pole") {
            return cutPoleIcon(isSelected, status);
        }

        return linePoleIcon(isSelected, status);
    };

    return ( <
        div style = {
            {
                width: "100%",
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }
        } >
        <
        LocationFilterBar filters = {
            filters
        }
        setFilters = {
            setFilters
        }
        showCluster = {
            true
        }
        />

        <
        style > {
            `
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0.1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .custom-pole-icon, .custom-turbine-icon {
          background: transparent !important;
          border: none !important;
        }
        /* Status indicator pulse for pending items */
        .status-pending {
          animation: statusPulse 2s ease-in-out infinite;
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `
        } < /style>

        <
        MapContainer ref = {
            mapRef
        }
        center = {
            center
        }
        zoom = {
            13
        }
        zoomControl = {
            false
        }
        scrollWheelZoom = {
            true
        }
        style = {
            {
                height: "600px",
                width: "100%"
            }
        } >
        <
        MapController bounds = {
            bounds
        }
        center = {
            center
        }
        /> <
        ZoomControl position = "bottomright" / >

        {
            /* <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    /> */
        }

        <
        TileLayer attribution = {
            baseMap === "satellite" ?
            "&copy; Esri" :
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        }
        url = {
            baseMap === "satellite" ?
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" :
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
        />


        { /* Render Lines */ } {
            polylines.map((line) => ( <
                Polyline key = {
                    `line-${line.id}`
                }
                positions = {
                    line.coordinates
                }
                color = {
                    line.color
                }
                weight = {
                    line.weight
                }
                opacity = {
                    line.opacity
                }
                dashArray = {
                    line.dashArray
                }
                smoothFactor = {
                    1.5
                }
                eventHandlers = {
                    {
                        mouseover: (e) => e.target.setStyle({
                            weight: 8,
                            opacity: 1
                        }),
                        mouseout: (e) =>
                            e.target.setStyle({
                                weight: line.isSelected ? 6 : line.isApproved ? 4 : 3,
                                opacity: line.isSelected ? 1 : line.opacity,
                            }),
                        click: () => {
                            setSelectedLine(line.id === selectedLine ? null : line.id);
                            setSelectedPole(null);
                            setSelectedTurbine(null);
                        },
                    }
                } >
                <
                Tooltip sticky >
                <
                div style = {
                    {
                        padding: "4px 8px"
                    }
                } >
                <
                strong > {
                    line.name
                } < /strong> <
                div style = {
                    {
                        fontSize: "11px",
                        color: "#666"
                    }
                } > {
                    (() => {
                        const lineInfo = processedData.lines.find(
                            (l) => l.id === line.id,
                        );
                        const totalPoles = lineInfo ? .totalPoles || 0;
                        const isMCOH =
                            lineInfo ? .type ? .toLowerCase().includes("mcoh") || false;
                        const label = isMCOH ? "towers" : "poles";
                        return ( <
                            span >
                            <
                            strong style = {
                                {
                                    color: "#2B6CB0"
                                }
                            } > {
                                totalPoles
                            } {
                                label
                            } <
                            /strong>{" "}• {
                                line.km
                            }
                            km <
                            /span>
                        );
                    })()
                } {
                    !line.isApproved && ( <
                        span style = {
                            {
                                marginLeft: "8px",
                                color: "#E74C3C",
                                fontWeight: "bold",
                            }
                        } >
                        ⚠️Pending <
                        /span>
                    )
                } {
                    line.isApproved && ( <
                        span style = {
                            {
                                marginLeft: "8px",
                                color: "#27AE60",
                                fontWeight: "bold",
                            }
                        } >
                        ✅Approved <
                        /span>
                    )
                } <
                /div> <
                /div> <
                /Tooltip>

                <
                Popup >
                <
                div style = {
                    {
                        padding: "4px 0",
                        minWidth: "220px"
                    }
                } >
                <
                h3 style = {
                    {
                        margin: "0 0 8px 0",
                        fontSize: "16px",
                        color: "#2D3748",
                    }
                } >
                🔌{
                    line.name
                } <
                /h3> <
                div style = {
                    {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "4px 12px",
                        fontSize: "13px",
                    }
                } >
                <
                div >
                <
                span style = {
                    {
                        color: "#718096"
                    }
                } > Status: < /span> <
                strong style = {
                    {
                        color: line.isApproved ? "#27AE60" : "#E74C3C",
                        marginLeft: "4px",
                    }
                } >
                {
                    line.isApproved ? "✅ Approved" : "⚠️ Pending"
                } <
                /strong> <
                /div> <
                div >
                <
                span style = {
                    {
                        color: "#718096"
                    }
                } > {
                    (() => {
                        const lineInfo = processedData.lines.find(
                            (l) => l.id === line.id,
                        );
                        const isMCOH =
                            lineInfo ? .type ? .toLowerCase().includes("mcoh") ||
                            false;
                        return isMCOH ? "Towers:" : "Poles:";
                    })()
                } <
                /span> <
                strong > {
                    (() => {
                        const lineInfo = processedData.lines.find(
                            (l) => l.id === line.id,
                        );
                        return lineInfo ? .totalPoles || 0;
                    })()
                } <
                /strong> <
                /div> <
                div >
                <
                span style = {
                    {
                        color: "#718096"
                    }
                } > Distance: < /span>{" "} <
                strong > {
                    line.km
                }
                km < /strong> <
                /div> <
                div >
                <
                span style = {
                    {
                        color: "#718096"
                    }
                } > Type: < /span>{" "} <
                strong > {
                    line.lineType || "Standard"
                } < /strong> <
                /div> <
                /div> {
                    !line.isApproved && ( <
                        div style = {
                            {
                                marginTop: "8px",
                                padding: "6px 10px",
                                backgroundColor: "#FFF5F5",
                                borderRadius: "4px",
                                fontSize: "12px",
                                color: "#E74C3C",
                                border: "1px solid #FED7D7",
                            }
                        } >
                        ⚠️This line is under construction / pending approval <
                        /div>
                    )
                } <
                button onClick = {
                    () => {
                        setSelectedLine(line.id);
                        if (mapRef.current) {
                            const bounds = L.latLngBounds(line.coordinates);
                            mapRef.current.fitBounds(bounds, {
                                padding: [50, 50]
                            });
                        }
                    }
                }
                style = {
                    {
                        marginTop: "10px",
                        width: "100%",
                        padding: "6px",
                        backgroundColor: "#3498DB",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                    }
                } >
                Focus Line <
                /button> <
                /div> <
                /Popup> <
                /Polyline>
            ))
        }

        { /* Render Poles with proper icons */ } {
            filteredPoles.map((pole) => ( <
                Marker key = {
                    `pole-${pole.id}`
                }
                position = {
                    [pole.lat, pole.lng]
                }
                icon = {
                    getPoleIcon(pole)
                }
                eventHandlers = {
                    {
                        click: () => {
                            setSelectedPole(pole.id === selectedPole ? null : pole.id);
                            setSelectedLine(null);
                            setSelectedTurbine(null);
                        },
                    }
                } >
                <
                Tooltip sticky >
                <
                div style = {
                    {
                        fontSize: "13px"
                    }
                } >
                <
                strong > {
                    pole.number
                } < /strong> <
                span style = {
                    {
                        marginLeft: "8px",
                        fontSize: "10px",
                        color: pole.status === "approved" ? "#27AE60" : "#E74C3C",
                    }
                } >
                {
                    pole.status === "approved" ? "✅" : "⏳"
                } <
                /span> {
                    pole.turbineLocation && ( <
                        span style = {
                            {
                                marginLeft: "4px",
                                fontSize: "11px",
                                color: "#2ECC71",
                            }
                        } >
                        ⚡
                        <
                        /span>
                    )
                } <
                /div> <
                /Tooltip>

                <
                Popup maxWidth = {
                    280
                } >
                <
                div style = {
                    {
                        padding: "2px 0"
                    }
                } >
                <
                div style = {
                    {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #E2E8F0",
                        paddingBottom: "4px",
                        marginBottom: "4px",
                    }
                } >
                <
                h3 style = {
                    {
                        margin: 0,
                        fontSize: "14px",
                        color: "#2D3748"
                    }
                } > 📍{
                    pole.number
                } <
                /h3> <
                div style = {
                    {
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                    }
                } >
                <
                span style = {
                    {
                        fontSize: "9px",
                        padding: "1px 8px",
                        borderRadius: "12px",
                        backgroundColor: pole.status === "approved" ? "#C6F6D5" : "#FED7D7",
                        color: pole.status === "approved" ? "#276749" : "#9B2C2C",
                    }
                } >
                {
                    pole.status === "approved" ? "APPROVED" : "PENDING"
                } <
                /span> <
                span style = {
                    {
                        fontSize: "9px",
                        backgroundColor: pole.type === "cut_pole" ?
                            "#E74C3C" :
                            pole.type === "tower" ?
                            "#8E44AD" :
                            "#3498DB",
                        color: "white",
                        padding: "1px 8px",
                        borderRadius: "12px",
                    }
                } >
                {
                    pole.type ? .replace("_", " ")
                } {
                    pole.type === "tower" && pole.towerType ?
                        ` ${pole.towerType}` :
                        ""
                } <
                /span> <
                /div> <
                /div>

                {
                    !pole.isLineApproved && ( <
                        div style = {
                            {
                                marginBottom: "4px",
                                padding: "2px 6px",
                                backgroundColor: "#FFF5F5",
                                borderRadius: "3px",
                                fontSize: "10px",
                                color: "#E74C3C",
                                border: "1px solid #FED7D7",
                            }
                        } >
                        ⚠️Line under construction <
                        /div>
                    )
                }

                <
                div style = {
                    {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "2px 8px",
                        fontSize: "11px",
                    }
                } >
                {
                    pole.type === "tower" ? ( <
                        >
                        <
                        div >
                        <
                        span style = {
                            {
                                color: "#718096"
                            }
                        } > Tower Type: < /span> <
                        strong > {
                            pole.towerType || "-"
                        } < /strong> <
                        /div> <
                        div >
                        <
                        span style = {
                            {
                                color: "#718096"
                            }
                        } > Extension: < /span> <
                        strong > {
                            pole.extension || "0"
                        } < /strong> <
                        /div> <
                        />
                    ) : ( <
                        >
                        <
                        div >
                        <
                        span style = {
                            {
                                color: "#718096"
                            }
                        } > Pole Type: < /span> <
                        strong > {
                            pole.poleType || "-"
                        } < /strong> <
                        /div> <
                        div >
                        <
                        span style = {
                            {
                                color: "#718096"
                            }
                        } > Pole Height: < /span> <
                        strong > {
                            pole.poleHeight || "-"
                        } < /strong> <
                        /div> <
                        />
                    )
                }

                <
                div >
                <
                span style = {
                    {
                        color: "#718096"
                    }
                } > Span: < /span>{" "} <
                strong > {
                    pole.span
                }
                m < /strong> <
                /div> <
                div >
                <
                span style = {
                    {
                        color: "#718096"
                    }
                } > Village: < /span>{" "} <
                strong > {
                    pole.village
                } < /strong> <
                /div> <
                div >
                <
                span style = {
                    {
                        color: "#718096"
                    }
                } > Contractor: < /span>{" "} <
                strong > {
                    pole.contractor
                } < /strong> <
                /div> <
                div style = {
                    {
                        gridColumn: "span 2"
                    }
                } >
                <
                span style = {
                    {
                        color: "#718096"
                    }
                } > Crossing: < /span> <
                strong style = {
                    {
                        color: pole.crossingType !== "none" ? "#E53E3E" : "#27AE60",
                        marginLeft: "2px",
                    }
                } >
                {
                    pole.crossingType !== "none" ?
                    `⚠️ ${pole.crossingType}` :
                        "✅ None"
                } <
                /strong> <
                /div> {
                    pole.turbineLocation && ( <
                        div style = {
                            {
                                gridColumn: "span 2",
                                backgroundColor: "#F0FFF4",
                                padding: "2px 6px",
                                borderRadius: "3px",
                            }
                        } >
                        <
                        span style = {
                            {
                                color: "#718096"
                            }
                        } > Linked Turbine: < /span> <
                        strong style = {
                            {
                                color: "#2ECC71",
                                marginLeft: "2px"
                            }
                        } > ⚡{
                            pole.turbineLocation.name
                        } <
                        /strong> <
                        /div>
                    )
                } <
                /div> <
                /div> <
                /Popup> <
                /Marker>
            ))
        }

        { /* Pole -> Turbine Connection - Using turbineLocation from pole */ } {
            processedData.poles
                .filter(
                    (pole) =>
                    pole.turbineLocation &&
                    pole.turbineLocation.lat &&
                    pole.turbineLocation.lng,
                )
                .map((pole) => ( <
                    Polyline key = {
                        `pole-turbine-${pole.id}`
                    }
                    positions = {
                        [
                            [pole.lat, pole.lng],
                            [pole.turbineLocation.lat, pole.turbineLocation.lng],
                        ]
                    }
                    color = "#00BCD4"
                    weight = {
                        3
                    }
                    opacity = {
                        1
                    }
                    eventHandlers = {
                        {
                            mouseover: (e) =>
                                e.target.setStyle({
                                    weight: 5,
                                    opacity: 1,
                                    color: "#0097A7",
                                }),
                            mouseout: (e) =>
                                e.target.setStyle({
                                    weight: 3,
                                    opacity: 1,
                                    color: "#00BCD4",
                                }),
                        }
                    } >
                    <
                    Tooltip sticky >
                    <
                    div style = {
                        {
                            padding: "4px 10px",
                            fontSize: "12px"
                        }
                    } >
                    <
                    strong > {
                        pole.number
                    } < /strong> <
                    span style = {
                        {
                            color: "#2ECC71",
                            margin: "0 6px"
                        }
                    } > ⟷ < /span> <
                    strong style = {
                        {
                            color: "#27AE60"
                        }
                    } > ⚡{
                        pole.turbineLocation.name
                    } <
                    /strong> <
                    /div> <
                    /Tooltip>

                    <
                    Popup >
                    <
                    div style = {
                        {
                            padding: "4px",
                            minWidth: "180px"
                        }
                    } >
                    <
                    div style = {
                        {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px",
                            background: "#F7FAFC",
                            borderRadius: "6px",
                            marginBottom: "6px",
                        }
                    } >
                    <
                    div style = {
                        {
                            textAlign: "center",
                            flex: 1
                        }
                    } >
                    <
                    div > 📍 < /div> <
                    strong > {
                        pole.number
                    } < /strong> <
                    div style = {
                        {
                            fontSize: "10px",
                            color: "#718096"
                        }
                    } >
                    Pole <
                    /div> <
                    /div> <
                    div style = {
                        {
                            color: "#2ECC71",
                            fontSize: "20px"
                        }
                    } > → < /div> <
                    div style = {
                        {
                            textAlign: "center",
                            flex: 1,
                            background: "#F0FFF4",
                            borderRadius: "4px",
                            padding: "4px",
                        }
                    } >
                    <
                    div > ⚡ < /div> <
                    strong style = {
                        {
                            color: "#27AE60"
                        }
                    } > {
                        pole.turbineLocation.name
                    } <
                    /strong> <
                    div style = {
                        {
                            fontSize: "10px",
                            color: "#718096"
                        }
                    } >
                    Turbine <
                    /div> <
                    /div> <
                    /div> <
                    div style = {
                        {
                            fontSize: "11px",
                            color: "#718096",
                            textAlign: "center",
                        }
                    } >
                    {
                        pole.lineName
                    }•
                    Connected <
                    /div> <
                    /div> <
                    /Popup> <
                    /Polyline>
                ))
        }

        { /* Render ALL Turbines from turbine_locations */ } {
            processedData.turbines.map((turbine) => ( <
                Marker key = {
                    `turbine-${turbine.id}`
                }
                position = {
                    [turbine.lat, turbine.lng]
                }
                icon = {
                    turbineIcon(selectedTurbine === turbine.id)
                }
                eventHandlers = {
                    {
                        click: () => {
                            setSelectedTurbine(
                                turbine.id === selectedTurbine ? null : turbine.id,
                            );
                            setSelectedPole(null);
                            setSelectedLine(null);
                        },
                    }
                } >
                <
                Tooltip sticky >
                <
                div style = {
                    {
                        fontSize: "13px"
                    }
                } >
                <
                strong > ⚡{
                    turbine.name
                } < /strong> {
                    turbine.isPoleLinked && ( <
                        span style = {
                            {
                                marginLeft: "8px",
                                fontSize: "11px",
                                color: "#2ECC71",
                            }
                        } >
                        🔗Linked <
                        /span>
                    )
                } <
                /div> <
                /Tooltip>

                <
                Popup >
                <
                div style = {
                    {
                        padding: "4px 0"
                    }
                } >
                <
                div style = {
                    {
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        borderBottom: "2px solid #E2E8F0",
                        paddingBottom: "8px",
                        marginBottom: "10px",
                    }
                } >
                <
                span style = {
                    {
                        fontSize: "28px"
                    }
                } > ⚡ < /span> <
                div >
                <
                h3 style = {
                    {
                        margin: 0,
                        fontSize: "16px",
                        color: "#2D3748"
                    }
                } >
                {
                    turbine.name
                } <
                /h3> <
                /div> <
                /div>

                <
                div style = {
                    {
                        fontSize: "13px"
                    }
                } >
                <
                div >
                <
                span style = {
                    {
                        color: "#718096"
                    }
                } > Line: < /span>{" "} <
                strong > {
                    turbine.lineName
                } < /strong> <
                /div> <
                div >
                <
                span style = {
                    {
                        color: "#718096"
                    }
                } > Cluster: < /span>{" "} <
                strong > {
                    turbine.cluster
                } < /strong> <
                /div> {
                    turbine.isPoleLinked && ( <
                        div style = {
                            {
                                marginTop: "6px",
                                backgroundColor: "#F0FFF4",
                                padding: "4px 8px",
                                borderRadius: "4px",
                            }
                        } >
                        <
                        span style = {
                            {
                                color: "#2ECC71"
                            }
                        } > 🔗Linked to Pole <
                        /span> <
                        /div>
                    )
                } {
                    turbine.gpsCoordinates && ( <
                        div style = {
                            {
                                marginTop: "6px",
                                fontSize: "12px",
                                color: "#718096",
                            }
                        } >
                        📍{
                            turbine.gpsCoordinates
                        } <
                        /div>
                    )
                } <
                div style = {
                    {
                        marginTop: "6px",
                        fontSize: "12px",
                        color: "#718096",
                    }
                } >
                📍{
                    turbine.lat.toFixed(6)
                }, {
                    turbine.lng.toFixed(6)
                } <
                /div> <
                /div> <
                /div> <
                /Popup> <
                /Marker>
            ))
        }

        { /* ==================== LEGEND ==================== */ } <
        div style = {
            {
                position: "absolute",
                bottom: 14,
                right: 20,
                backgroundColor: "rgba(255,255,255,0.95)",
                padding: "14px 18px",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                zIndex: 1000,
                backdropFilter: "blur(10px)",
                minWidth: "200px",
                maxHeight: "400px",
                overflowY: "auto",
            }
        } >
        <
        strong style = {
            {
                fontSize: "14px",
                color: "#2D3748",
                display: "block",
                marginBottom: "8px",
            }
        } >
        📋Legend <
        /strong>

        <
        div style = {
            {
                display: "flex",
                flexDirection: "column",
                gap: "6px"
            }
        } > { /* ===== LINE TYPE & STATUS ===== */ } <
        div style = {
            {
                borderBottom: "1px solid #E2E8F0",
                paddingBottom: "8px",
                marginBottom: "4px",
            }
        } >
        <
        div style = {
            {
                fontSize: "11px",
                color: "#718096",
                marginBottom: "4px",
            }
        } >
        <
        strong > Line Status < /strong> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                width: "30px",
                height: "4px",
                background: "#27AE60",
                borderRadius: "2px",
            }
        }
        /> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        <
        strong style = {
            {
                color: "#27AE60"
            }
        } > ━━ < /strong> Solid Line ={" "} <
        strong > Approved < /strong> <
        /span> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                width: "30px",
                height: "0px",
                borderTop: "3px dashed #E74C3C",
            }
        }
        /> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        <
        strong style = {
            {
                color: "#E74C3C"
            }
        } > ┅┅ < /strong> Dashed Line ={" "} <
        strong > Pending < /strong> <
        /span> <
        /div> <
        /div>

        { /* ===== LINE TYPES WITH COLORS ===== */ } <
        div style = {
            {
                borderBottom: "1px solid #E2E8F0",
                paddingBottom: "8px",
                marginBottom: "4px",
            }
        } >
        <
        div style = {
            {
                fontSize: "11px",
                color: "#718096",
                marginBottom: "4px",
            }
        } >
        <
        strong > Line Types < /strong> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                display: "flex",
                flexDirection: "column",
                gap: "2px",
            }
        } >
        <
        div style = {
            {
                width: "30px",
                height: "4px",
                background: "#3498DB",
                borderRadius: "2px",
            }
        }
        /> <
        div style = {
            {
                width: "30px",
                height: "0px",
                borderTop: "3px dashed #85C1E9",
            }
        }
        /> <
        /div> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        SCOH - Dog <
        /span> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                display: "flex",
                flexDirection: "column",
                gap: "2px",
            }
        } >
        <
        div style = {
            {
                width: "30px",
                height: "4px",
                background: "#27AE60",
                borderRadius: "2px",
            }
        }
        /> <
        div style = {
            {
                width: "30px",
                height: "0px",
                borderTop: "3px dashed #82E0AA",
            }
        }
        /> <
        /div> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        SCOH - Panther <
        /span> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                display: "flex",
                flexDirection: "column",
                gap: "2px",
            }
        } >
        <
        div style = {
            {
                width: "30px",
                height: "4px",
                background: "#8E44AD",
                borderRadius: "2px",
            }
        }
        /> <
        div style = {
            {
                width: "30px",
                height: "0px",
                borderTop: "3px dashed #C39BD3",
            }
        }
        /> <
        /div> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } > DCOH < /span> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                display: "flex",
                flexDirection: "column",
                gap: "2px",
            }
        } >
        <
        div style = {
            {
                width: "30px",
                height: "4px",
                background: "#E74C3C",
                borderRadius: "2px",
            }
        }
        /> <
        div style = {
            {
                width: "30px",
                height: "0px",
                borderTop: "3px dashed #FF6B6B",
            }
        }
        /> <
        /div> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } > MCOH < /span> <
        /div> <
        /div>

        { /* ===== POLE TYPES ===== */ } <
        div style = {
            {
                borderBottom: "1px solid #E2E8F0",
                paddingBottom: "8px",
                marginBottom: "4px",
            }
        } >
        <
        div style = {
            {
                fontSize: "11px",
                color: "#718096",
                marginBottom: "4px",
            }
        } >
        <
        strong > Pole Types < /strong> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                width: "4px",
                height: "18px",
                background: "#5D6D7E",
                borderRadius: "2px",
                position: "relative",
            }
        } >
        <
        div style = {
            {
                position: "absolute",
                top: "-2px",
                left: "-6px",
                width: "16px",
                height: "2px",
                background: "#5D6D7E",
            }
        }
        /> <
        div style = {
            {
                position: "absolute",
                bottom: "-2px",
                left: "-6px",
                width: "16px",
                height: "2px",
                background: "#5D6D7E",
            }
        }
        /> <
        /div> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        Line Pole <
        /span> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                width: "4px",
                height: "14px",
                background: "#5D6D7E",
                borderRadius: "2px",
                position: "relative",
            }
        } >
        <
        div style = {
            {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: "10px",
                height: "2px",
                background: "#E74C3C",
            }
        }
        /> <
        /div> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        Cut Pole <
        /span> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "2px",
            }
        } >
        <
        div style = {
            {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
            }
        } >
        <
        div style = {
            {
                width: "4px",
                height: "14px",
                background: "#5D6D7E",
                borderRadius: "1px",
                clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)",
                position: "relative",
            }
        } >
        <
        div style = {
            {
                position: "absolute",
                top: "2px",
                left: "-4px",
                width: "12px",
                height: "1px",
                background: "#7F8C8D",
                transform: "rotate(-15deg)",
            }
        }
        /> <
        div style = {
            {
                position: "absolute",
                top: "6px",
                right: "-4px",
                width: "12px",
                height: "1px",
                background: "#7F8C8D",
                transform: "rotate(15deg)",
            }
        }
        /> <
        /div> <
        div style = {
            {
                fontSize: "7px",
                fontWeight: "bold",
                color: "#2C3E50",
                marginTop: "-1px",
            }
        } >
        A - D <
        /div> <
        /div> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        Tower Types <
        /span> <
        /div> <
        /div>

        { /* ===== POLE STATUS ===== */ } <
        div style = {
            {
                borderBottom: "1px solid #E2E8F0",
                paddingBottom: "8px",
                marginBottom: "4px",
            }
        } >
        <
        div style = {
            {
                fontSize: "11px",
                color: "#718096",
                marginBottom: "4px",
            }
        } >
        <
        strong > Pole Status < /strong> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#27AE60",
                border: "2px solid white",
                boxShadow: "0 0 4px rgba(0,0,0,0.3)",
            }
        }
        /> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        <
        strong style = {
            {
                color: "#27AE60"
            }
        } > ● < /strong> Approved <
        /span> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#E74C3C",
                border: "2px solid white",
                boxShadow: "0 0 4px rgba(0,0,0,0.3)",
            }
        }
        /> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        <
        strong style = {
            {
                color: "#E74C3C"
            }
        } > ● < /strong> Pending <
        /span> <
        /div> <
        /div>

        { /* ===== OTHER ===== */ } <
        div >
        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        div style = {
            {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }
        } >
        <
        div style = {
            {
                width: "16px",
                height: "16px",
                border: "1px solid #95A5A6",
                borderRadius: "50%",
                position: "relative",
            }
        } >
        <
        div style = {
            {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: "4px",
                height: "4px",
                background: "#95A5A6",
                borderRadius: "50%",
            }
        }
        /> <
        /div> <
        /div> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        Turbine <
        /span> <
        /div>

        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "2px",
            }
        } >
        <
        div style = {
            {
                width: "30px",
                height: "3px",
                background: "#00BCD4",
                borderRadius: "2px",
            }
        }
        /> <
        span style = {
            {
                fontSize: "12px",
                color: "#4A5568"
            }
        } >
        Pole - Turbine Link <
        /span> <
        /div> <
        /div> <
        /div> <
        /div>

        { /* ==================== STATS ==================== */ } <
        div style = {
            {
                position: "absolute",
                top: 4,
                right: 10,
                backgroundColor: "rgba(255,255,255,0.95)",
                padding: "10px 14px",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                zIndex: 1000,
                backdropFilter: "blur(10px)",
                fontSize: "12px",
                minWidth: "180px",
            }
        } >
        <
        strong style = {
            {
                fontSize: "13px",
                color: "#2D3748",
                display: "block",
                marginBottom: "4px",
            }
        } >
        📊Stats <
        /strong>

        <
        div style = {
            {
                backgroundColor: "#EBF8FF",
                padding: "4px 8px",
                borderRadius: "4px",
                marginBottom: "6px",
                border: "1px solid #90CDF4",
            }
        } >
        <
        div style = {
            {
                display: "flex",
                justifyContent: "space-between"
            }
        } >
        <
        span style = {
            {
                color: "#2B6CB0",
                fontWeight: "bold"
            }
        } > 📊Total Planned Poles / Towers:
        <
        /span> <
        span style = {
            {
                color: "#2B6CB0",
                fontWeight: "bold"
            }
        } > {
            processedData.lines.reduce(
                (sum, l) => sum + (l.totalPoles || 0),
                0,
            )
        } <
        /span> <
        /div> <
        div style = {
            {
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
            }
        } >
        <
        span style = {
            {
                color: "#27AE60"
            }
        } > ✅Filled: {
            processedData.stats.totalPoles
        } <
        /span> <
        span style = {
            {
                color: "#E74C3C"
            }
        } > ⏳Remaining: {
            " "
        } {
            processedData.lines.reduce(
                (sum, l) => sum + (l.totalPoles || 0),
                0,
            ) - processedData.stats.totalPoles
        } <
        /span> <
        /div> <
        /div>

        <
        div style = {
            {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 12px",
            }
        } >
        <
        div >
        <
        span style = {
            {
                color: "#718096"
            }
        } > Lines: < /span>{" "} <
        strong > {
            processedData.stats.totalLines
        } < /strong> <
        /div> <
        div >
        <
        span style = {
            {
                color: "#27AE60"
            }
        } > Approved: < /span>{" "} <
        strong > {
            processedData.stats.approvedLines
        } < /strong> <
        /div> <
        div >
        <
        span style = {
            {
                color: "#E74C3C"
            }
        } > Pending: < /span>{" "} <
        strong > {
            processedData.stats.pendingLines
        } < /strong> <
        /div> <
        div >
        <
        span style = {
            {
                color: "#718096"
            }
        } > Filled Poles / Towers: < /span>{" "} <
        strong > {
            processedData.stats.totalPoles
        } < /strong> <
        /div> <
        div >
        <
        span style = {
            {
                color: "#718096"
            }
        } > Turbines: < /span>{" "} <
        strong > {
            processedData.stats.totalTurbines
        } < /strong> <
        /div> <
        div >
        <
        span style = {
            {
                color: "#718096"
            }
        } > Distance: < /span>{" "} <
        strong > {
            processedData.stats.totalKm.toFixed(1)
        }
        km < /strong> <
        /div> <
        /div> <
        /div>

        { /* ==================== FILTERS ==================== */ } <
        div style = {
            {
                position: "absolute",
                top: 10,
                left: 10,
                backgroundColor: "rgba(255,255,255,0.95)",
                padding: "8px 12px",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                zIndex: 1000,
                backdropFilter: "blur(10px)",
                display: "flex",
                gap: "8px",
                fontSize: "12px",
                flexWrap: "wrap",
            }
        } >
        <
        select value = {
            filterStatus
        }
        onChange = {
            (e) => setFilterStatus(e.target.value)
        }
        style = {
            {
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid #CBD5E0",
                fontSize: "12px",
                background: "white",
                cursor: "pointer",
            }
        } >
        <
        option value = "all" > All Status < /option> <
        option value = "approved" > ✅Approved < /option> <
        option value = "pending" > ⏳Pending < /option> <
        /select>

        <
        select value = {
            filterType
        }
        onChange = {
            (e) => setFilterType(e.target.value)
        }
        style = {
            {
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid #CBD5E0",
                fontSize: "12px",
                background: "white",
                cursor: "pointer",
            }
        } >
        <
        option value = "all" > All Types < /option> <
        option value = "line_pole" > Line Poles < /option> <
        option value = "cut_pole" > Cut Poles < /option> <
        option value = "tower" > Towers < /option> <
        /select>

        <
        button onClick = {
            () => {
                setSelectedLine(null);
                setSelectedPole(null);
                setSelectedTurbine(null);
                setFilterStatus("all");
                setFilterType("all");
            }
        }
        style = {
            {
                padding: "4px 12px",
                backgroundColor: "#EDF2F7",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#4A5568",
            }
        } >
        Reset <
        /button>

        <
        div style = {
            {
                display: "flex",
                gap: "6px",
                alignItems: "center",
            }
        } >
        <
        span style = {
            {
                fontSize: "11px",
                color: "#718096",
                fontWeight: "500",
                marginRight: "4px",
            }
        } >
        Map:
        <
        /span> <
        button onClick = {
            () => setBaseMap("street")
        }
        style = {
            {
                padding: "4px 10px",
                borderRadius: "6px",
                border: baseMap === "street" ?
                    "2px solid #3498DB" :
                    "1px solid #E2E8F0",
                background: baseMap === "street" ? "#EBF8FF" : "#fff",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: baseMap === "street" ? "600" : "normal",
                color: baseMap === "street" ? "#2B6CB0" : "#4A5568",
                transition: "all 0.2s ease",
                flex: 1,
            }
        }
        onMouseEnter = {
            (e) => {
                if (baseMap !== "street") {
                    e.target.style.background = "#F7FAFC";
                }
            }
        }
        onMouseLeave = {
            (e) => {
                if (baseMap !== "street") {
                    e.target.style.background = "#fff";
                }
            }
        } >
        🗺️Standard <
        /button> <
        button onClick = {
            () => setBaseMap("satellite")
        }
        style = {
            {
                padding: "4px 10px",
                borderRadius: "6px",
                border: baseMap === "satellite" ?
                    "2px solid #3498DB" :
                    "1px solid #E2E8F0",
                background: baseMap === "satellite" ? "#EBF8FF" : "#fff",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: baseMap === "satellite" ? "600" : "normal",
                color: baseMap === "satellite" ? "#2B6CB0" : "#4A5568",
                transition: "all 0.2s ease",
                flex: 1,
            }
        }
        onMouseEnter = {
            (e) => {
                if (baseMap !== "satellite") {
                    e.target.style.background = "#F7FAFC";
                }
            }
        }
        onMouseLeave = {
            (e) => {
                if (baseMap !== "satellite") {
                    e.target.style.background = "#fff";
                }
            }
        } >
        🛰️Satellite <
        /button> <
        /div> <
        /div> <
        /MapContainer> <
        /div>
    );
};

export default ElectricalMapView;