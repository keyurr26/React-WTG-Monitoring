import {
    FaRoad,
    FaLocationArrow,
    FaTractor,
    FaWind,
    FaProjectDiagram,
    FaCircle
} from "react-icons/fa";
import {
    MdLocationPin
} from "react-icons/md";

export const ROAD_CONFIG = {
    // cluster: {
    //   label: "Cluster",
    //   color: "purple",
    //   icon: FaProjectDiagram,   // ✅ CLUSTER ICON
    //   drawType: "polyline"
    // },

    main: {
        label: "Main Road",
        color: "red",
        tooltip: "Draw the predefined main road",
        icon: FaRoad,
        drawType: "polyline",
        hasProgressLevel: true
    },

    approach: {
        label: "Approach Road",
        tooltip: "Draw the approach road.",
        color: "blue",
        icon: FaLocationArrow,
        drawType: "polyline",
        hasProgressLevel: true
    },

    access: {
        tooltip: "Draw the turbine access road.",
        label: "Access Road",
        color: "green",
        icon: FaRoad,
        drawType: "polyline",
        hasProgressLevel: true
    },

    cart: {
        label: "Cart Road",
        tooltip: "Draw the cart road.",
        color: "brown",
        icon: FaTractor,
        drawType: "polyline",
        hasProgressLevel: true
    },

    junction: {
        label: "Junction",
        tooltip: "Mark a road junction.",
        color: "black",
        icon: MdLocationPin,
        drawType: "marker",
        hasProgressLevel: false
    },

    turbine: {
        label: "Turbine",
        tooltip: "Place a turbine.",
        color: "orange",
        icon: FaWind,
        drawType: "circle",
        hasProgressLevel: false
    },

    pointcircle: {
        label: "point circle",
        tooltip: "Mark another important location.",
        color: "green",
        icon: FaCircle,
        drawType: "circle",
        hasProgressLevel: false
    },
};


// tool 
// main: {
//   tooltip: "Draw the predefined main road."
// },

// approach: {
//   tooltip: "Draw the approach road."
// },

// access: {
//   tooltip: "Draw the turbine access road."
// },

// cart: {
//   tooltip: "Draw the cart road."
// },

// junction: {
//   tooltip: "Mark a road junction."
// },

// turbine: {
//   tooltip: "Place a turbine."
// },

// pointcircle: {
//   tooltip: "Mark another important location."
// },