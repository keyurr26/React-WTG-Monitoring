// // electricalConfig.js
// import {
//   FaBolt,
//   FaSubway,
//   FaDharmachakra,
//   FaMapMarkerAlt,
//   FaDrawPolygon,
//   FaSquare,
//   FaCircle,
//   FaBox,
// } from "react-icons/fa";

// export const ELECTRICAL_CONFIG = {
//   substation: {
//     label: "Substation",
//     color: "red",
//     icon: FaBolt,
//     drawType: "marker",
//     hasProgressLevel: false,
//   },

//   transmission_line: {
//     label: "Transmission Line",
//     color: "orange",
//     icon: FaSubway,
//     drawType: "polyline",
//     hasProgressLevel: true,
//   },

//   switchyard: {
//     label: "Switchyard",
//     color: "blue",
//     icon: FaDharmachakra,
//     drawType: "circle",
//     hasProgressLevel: false,
//   },

//   tower: {
//     label: "Tower",
//     color: "green",
//     icon: FaMapMarkerAlt,
//     drawType: "marker",
//     hasProgressLevel: false,
//   },

//   cable_trench: {
//     label: "Cable Trench",
//     color: "purple",
//     icon: FaDrawPolygon,
//     drawType: "polyline",
//     hasProgressLevel: true,
//   },

//   electrical_room: {
//     label: "Electrical Room",
//     color: "brown",
//     icon: FaSquare,
//     drawType: "circle",
//     hasProgressLevel: false,
//   },

//   junction_box: {
//     label: "Junction Box",
//     color: "pink",
//     icon: FaCircle,
//     drawType: "marker",
//     hasProgressLevel: false,
//   },
// };








// electricalConfig.js
import {
    FaBolt,
    FaSubway,
    FaDharmachakra,
    FaMapMarkerAlt,
    FaDrawPolygon,
    FaSquare,
    FaCircle,
    FaBox,
    FaPlug,
    FaNetworkWired,
    FaLink,
    FaCodeBranch,
    FaSitemap
} from "react-icons/fa";

export const ELECTRICAL_CONFIG = {

    // Optional: Keep existing ones if needed
    substation: {
        label: "Substation",
        color: "red",
        icon: FaBolt,
        drawType: "marker",
        hasProgressLevel: false,
        // voltage_level: "33kV"
    },

    feeder: {
        label: "Feeder",
        color: "#FF5733", // Orange Red
        icon: FaBolt,
        drawType: "polyline",
        hasProgressLevel: true,
        // voltage_level: "33kV/11kV"
    },

    pole: {
        label: "Pole",
        color: "#28B463", // Green
        icon: FaMapMarkerAlt,
        drawType: "marker",
        hasProgressLevel: false,
        // type: "Electrical Pole"
    },

    cable: {
        label: "Cable",
        color: "#8E44AD", // Purple
        icon: FaNetworkWired,
        drawType: "polyline",
        hasProgressLevel: true,
        // voltage_level: "LV Cable"
    },

    connection: {
        label: "Connection",
        color: "#3498DB", // Blue
        icon: FaPlug,
        drawType: "polyline",
        hasProgressLevel: true,
        // type: "Electrical Connection"
    },

    jumper: {
        label: "Jumper",
        color: "#F1C40F", // Yellow
        icon: FaLink,
        drawType: "polyline",
        hasProgressLevel: true,
        // type: "Short Connection"
    },

    tapping: {
        label: "Tapping",
        // color: "#E74C3C", // Red
        color: "#16A085", // Teal
        icon: FaCodeBranch,
        drawType: "polyline",
        hasProgressLevel: true,
        // type: "Tapping Point"
    },

    junction: {
        label: "Junction",
        color: "#2C3E50", // Dark Blue
        icon: FaSitemap,
        drawType: "marker",
        hasProgressLevel: false,
        // type: "Electrical Junction"
    },


};