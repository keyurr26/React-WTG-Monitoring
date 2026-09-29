import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ConstructionIcon from "@mui/icons-material/Engineering";
import SafetyIcon from "@mui/icons-material/HealthAndSafety";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import {
    FiFolder,
    FiBarChart2,
    FiMap,
    FiCheckSquare
} from "react-icons/fi";
export const NAV_MENUS = [{
        key: "dashboard",
        text: "Dashboard",
        path: "/dash-board",
        icon: < DashboardIcon / > ,
        color: "#4F46E5"
    },
    {
        key: "masters",
        text: "Projects Master",
        path: "/master-project-index",
        icon: < FiFolder / > ,
        color: "#059669"
    },

    {
        key: "inventoryDashboard",
        text: "Inventory Dashboard",
        path: "/inventory-dashboard",
        icon: < InventoryIcon / > ,
        color: "#0891B2"
    },
    {
        key: "approvedReports",
        text: "Reports For Approval",
        path: "/approved-reports",
        icon: < FiBarChart2 / > ,
        color: "#2563EB"
    },
    {
        key: "map",
        text: "Plan Road",
        path: "/road-map-master",
        icon: < FiMap / > ,
        color: "#DB2777"
    },
    {
        key: "elemap",
        text: "Electrical Map",
        path: "/electrical-map-master",
        icon: < ElectricBoltIcon / > ,
        color: "#DB2777"
    },

    {
        key: "sqAdmin",
        text: "Safety & Quality",
        path: "/safety-quality-admin",
        icon: < FiCheckSquare / > ,
        color: "#7C3AED"
    },
    {
        key: "sqInspector",
        text: "Safety & Quality",
        path: "/safety-quality-record-update",
        icon: < FiCheckSquare / > ,
        color: "#7C3AED"
    },
    {
        key: "inventoryManagement",
        text: "Inventory Management",
        path: "/inventory-management",
        icon: < InventoryIcon / > ,
        color: "#2563EB"
    },
    {
        key: "construction",
        text: "Construction Stages",
        path: "/construction-stages",
        icon: < ConstructionIcon / > ,
        color: "#DC2626"
    },

    {
        key: "safetyQuality",
        text: "Safety & Quality",
        path: "/safety-quality-form",
        icon: < FiCheckSquare / > ,
        color: "#0891B2"
    },

    {
        key: "dms",
        text: "DMS",
        path: "/dms-tab",
        icon: < FiCheckSquare / > ,
        color: "#DC2626"
    },


];