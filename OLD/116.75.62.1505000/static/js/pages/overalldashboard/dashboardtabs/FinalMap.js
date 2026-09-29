import React, {
    useState,
    useMemo,
    useEffect
} from "react";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import {
    Box,
    Switch,
    Typography,
    Card,
    CardContent,
    Chip,
    Divider,
    capitalize,
    Stack,
} from "@mui/material";
import CurrencyYuanIcon from "@mui/icons-material/CurrencyYuan";

import {
    CalendarToday,
    LegendToggle,
    FilterAlt,
    Info,
    WindPower,
    CallMerge,
    Circle,
    Warning,
    CheckCircle,
    Error,
    RemoveRoad,
    Construction,
    CheckCircle as ApprovedIcon,
    Terrain,
    Directions,
    ForkRight,
    Schedule,
} from "@mui/icons-material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import L from "leaflet";
import MapFilters from "./MapFilters";
import {
    getNestedProjects
} from "../../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    GetTurbineFilterData
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";

/* Leaflet icon fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Custom DivIcon Generator */
const createCustomIcon = (type) => {
    const config = {
        turbine: {
            html: `
    <div style="
      width: 36px;
      height: 36px;
      background: #2E7D32;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
    ">
  <svg xmlns="http://www.w3.org/2000/svg" 
       width="30" height="30" viewBox="0 0 24 24" 
       fill="none" stroke="white" stroke-width="2" 
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 12v9" />
    <path d="M12 12L12 5" />
    <path d="M12 12l6.06 3.5" />
    <path d="M12 12L5.94 15.5" />
    <circle cx="12" cy="12" r="1.5" fill="white" />
  </svg>
</div>
  `,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -36],
        },
        junction: {
            html: `<div style="
    width:40px;
    height:40px;
    border-radius:50%;
    background:linear-gradient(135deg, #FF6B6B, #C2185B);
    display:flex;
    justify-content:center;
    align-items:center;
    border:2px solid #fff;
">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
         stroke="white" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 21V10"/>
        <path d="M12 10L5 3"/>
        <path d="M12 10L19 3"/>
    </svg>
</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
        },
        pointcircle: {
            html: `<div style="
        background: linear-gradient(135deg, #4ECDC4, #26A69A);
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-weight: bold;
      "><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/></svg></div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 26],
            popupAnchor: [0, -26],
        },
    };

    const iconConfig = config[type] || {
        html: `<div style="
      background: #666;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
    };

    return L.divIcon({
        html: iconConfig.html,
        className: "custom-div-icon",
        iconSize: iconConfig.iconSize,
        iconAnchor: iconConfig.iconAnchor,
        popupAnchor: iconConfig.popupAnchor,
    });
};

/* Type-wise color configuration for roads */
const TYPE_CONFIG = {
    dotted: {
        color: "#660000",
        label: "Under Construction",
        weight: 5,
        dashArray: "10, 10", // 👈 makes it dotted/dashed
    },
    main: {
        color: "#FF0000",
        label: "Main Road",
        weight: 5,
        icon: < RemoveRoad sx = {
            {
                color: "#FF0000"
            }
        }
        />,
        gradient: "linear-gradient(90deg, #FF0000, #FF6666)",
    },
    access: {
        color: "#00FF00",
        label: "Access Road",
        weight: 4,
        icon: < Directions sx = {
            {
                color: "#00FF00"
            }
        }
        />,
        gradient: "linear-gradient(90deg, #00FF00, #66FF66)",
    },
    approach: {
        color: "#0000FF",
        label: "Approach Road",
        weight: 4,
        icon: < Terrain sx = {
            {
                color: "#0000FF"
            }
        }
        />,
        gradient: "linear-gradient(90deg, #0000FF, #6666FF)",
    },
    cartroad: {
        color: "#D2691E",
        label: "Cart Road",
        weight: 3,
        icon: < ForkRight sx = {
            {
                color: "#D2691E"
            }
        }
        />,
        gradient: "linear-gradient(90deg, #D2691E, #E69C69)",
    },
    default: {
        color: "#666666",
        label: "Other",
        weight: 3,
        icon: < Warning sx = {
            {
                color: "#666666"
            }
        }
        />,
        gradient: "linear-gradient(90deg, #666666, #999999)",
    },
};

/* Progress level styling for roads */
const PROGRESS_STYLE = {
    Level0: {
        color: "#9E9E9E",
        dashArray: "10, 10",
        weight: 3,
        icon: < Error sx = {
            {
                color: "#9E9E9E"
            }
        }
        />,
    },
    Level1: {
        color: "#2196F3",
        dashArray: "5, 5",
        weight: 3,
        icon: < Warning sx = {
            {
                color: "#2196F3"
            }
        }
        />,
    },
    Level2: {
        color: "#4CAF50",
        dashArray: null,
        weight: 4,
        icon: < CheckCircle sx = {
            {
                color: "#4CAF50"
            }
        }
        />,
    },
    Level3: {
        color: "#FF9800",
        dashArray: null,
        weight: 4,
        icon: < CheckCircle sx = {
            {
                color: "#FF9800"
            }
        }
        />,
    },
    Final: {
        color: "#F44336",
        dashArray: null,
        weight: 5,
        icon: < CheckCircle sx = {
            {
                color: "#F44336"
            }
        }
        />,
    },
    default: {
        color: "#666666",
        dashArray: "5, 5",
        weight: 3,
        icon: < Error sx = {
            {
                color: "#666666"
            }
        }
        />,
    },
};

/* Fit bounds helper */
const FitBounds = ({
    layers
}) => {
    const map = useMap();
    useEffect(() => {
        if (!layers || !layers.length) return;

        const allPoints = [];
        layers.forEach((layer) => {
            if (layer.coordinates && Array.isArray(layer.coordinates)) {
                if (layer.draw_type === "point" && layer.coordinates[0]) {
                    allPoints.push(layer.coordinates[0]);
                } else if (layer.draw_type === "polyline") {
                    layer.coordinates.forEach((point) => allPoints.push(point));
                }
            }
        });

        if (allPoints.length > 0) {
            const bounds = L.latLngBounds(allPoints);
            if (bounds.isValid()) {
                map.fitBounds(bounds, {
                    padding: [50, 50]
                });
            }
        }
    }, [layers, map]);
    return null;
};

/* Legend Component */
const MapLegend = () => ( <
    Box sx = {
        {
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 1000,
            background: "rgba(255, 255, 255, 0.95)",
            padding: 1.5, // was 2 — thoda kam
            borderRadius: 2,
            boxShadow: 3,
            width: 240, // was maxWidth 320 → fixed 240
            maxHeight: "calc(60vh - 40px)", // map ke height se kam
            overflowY: "auto", // scroll if content overflows
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            // 🔽 Custom thin scrollbar
            "&::-webkit-scrollbar": {
                width: 4
            },
            "&::-webkit-scrollbar-thumb": {
                background: "#bbb",
                borderRadius: 2,
            },
        }
    } >
    <
    Box sx = {
        {
            display: "flex",
            alignItems: "center",
            mb: 1
        }
    } >
    <
    LegendToggle sx = {
        {
            mr: 1,
            color: "primary.main",
            fontSize: 10
        }
    }
    /> <
    Typography variant = "subtitle1"
    fontWeight = "bold"
    sx = {
        {
            fontSize: "10px"
        }
    } >
    Map Legend <
    /Typography> <
    /Box> <
    Divider sx = {
        {
            my: 1
        }
    }
    />

    { /* Roads/Lines */ } <
    Typography variant = "caption"
    fontWeight = "bold"
    sx = {
        {
            display: "block",
            mb: 1
        }
    } >
    <
    Directions sx = {
        {
            fontSize: 16,
            mr: 0.5,
            verticalAlign: "middle"
        }
    }
    />
    Roads:
    <
    /Typography> {
        Object.entries(TYPE_CONFIG).map(([key, config]) => {
            if (key === "default") return null;
            return ( <
                Box key = {
                    key
                }
                sx = {
                    {
                        display: "flex",
                        alignItems: "center",
                        mb: 1
                    }
                } >
                <
                Box sx = {
                    {
                        width: 24,
                        height: key === "dotted" ? 0 : 4,
                        mr: 1.5,
                        borderRadius: key === "dotted" ? 0 : 1,
                        borderTop: key === "dotted" ? `4px dashed ${config.color}` : "none",
                        background: key === "dotted" ? "transparent" : config.gradient,
                    }
                }
                /> <
                Typography variant = "caption" > {
                    config.label
                } < /Typography> <
                /Box>
            );
        })
    }

    { /* Points/Icons (2x2 Grid) */ } <
    Typography variant = "caption"
    fontWeight = "bold"
    sx = {
        {
            display: "block",
            mt: 2,
            mb: 1
        }
    } >
    Points:
    <
    /Typography> <
    Box sx = {
        {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1,
            mb: 1,
        }
    } >
    <
    Box sx = {
        {
            display: "flex",
            alignItems: "center"
        }
    } >
    <
    Box sx = {
        {
            width: 20,
            height: 20,
            mr: 1,
            background: "linear-gradient(135deg, #00770aff, #028a0dff)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
        }
    } >
    <
    WindPower sx = {
        {
            fontSize: 12,
            color: "white"
        }
    }
    /> <
    /Box> <
    Typography variant = "caption"
    noWrap >
    Turbine <
    /Typography> <
    /Box>

    <
    Box sx = {
        {
            display: "flex",
            alignItems: "center"
        }
    } >
    <
    Box sx = {
        {
            width: 20,
            height: 20,
            mr: 1,
            background: "linear-gradient(135deg, #FF6B6B, #C2185B)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
        }
    } >
    <
    CurrencyYuanIcon sx = {
        {
            fontSize: 12,
            color: "white"
        }
    }
    /> <
    /Box> <
    Typography variant = "caption"
    noWrap >
    Junction <
    /Typography> <
    /Box>

    <
    Box sx = {
        {
            display: "flex",
            alignItems: "center"
        }
    } >
    <
    Box sx = {
        {
            width: 20,
            height: 20,
            mr: 1,
            background: "linear-gradient(135deg, #4ECDC4, #26A69A)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
        }
    } >
    <
    Circle sx = {
        {
            fontSize: 12,
            color: "white"
        }
    }
    /> <
    /Box> <
    Typography variant = "caption"
    noWrap >
    Point Circle <
    /Typography> <
    /Box> <
    /Box>

    { /* Progress Levels (2x2 Grid) */ } <
    Typography variant = "caption"
    fontWeight = "bold"
    sx = {
        {
            display: "block",
            mt: 2,
            mb: 1
        }
    } >
    <
    Info sx = {
        {
            fontSize: 16,
            mr: 0.5,
            verticalAlign: "middle"
        }
    }
    />
    Progress:
    <
    /Typography> <
    Box sx = {
        {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1,
            mb: 1,
        }
    } >
    {
        Object.entries(PROGRESS_STYLE).map(([key, style]) => {
            if (key === "default") return null;
            return ( <
                Box key = {
                    key
                }
                sx = {
                    {
                        display: "flex",
                        alignItems: "center"
                    }
                } >
                <
                Box sx = {
                    {
                        width: 20,
                        height: 20,
                        mr: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }
                } >
                {
                    style.icon
                } <
                /Box> <
                Typography variant = "caption"
                noWrap > {
                    key
                } <
                /Typography> <
                /Box>
            );
        })
    } <
    /Box> <
    /Box>
);

/* Project Info Card */

const ProjectInfoCard = ({
    selectedProject,
    selectedWindfarm,
    selectedCluster,
}) => {
    if (!selectedProject && !selectedWindfarm && !selectedCluster) return null;

    return ( <
        Card sx = {
            {
                position: "absolute",
                top: 70,
                left: 16,
                zIndex: 1000,
                maxWidth: 320,
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
            }
        } >
        <
        Box sx = {
            {
                background: "linear-gradient(135deg, #1976d2, #2196f3)",
                p: 2,
                color: "white",
            }
        } >
        <
        Typography variant = "h6"
        fontWeight = "bold" >
        Project Details <
        /Typography> <
        /Box> <
        CardContent > {
            selectedProject && ( <
                >
                <
                Typography variant = "subtitle1"
                color = "primary"
                fontWeight = "bold"
                gutterBottom >
                {
                    selectedProject.project_name || "N/A"
                } <
                /Typography> <
                Stack spacing = {
                    0.5
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        alignItems: "center"
                    }
                } >
                <
                Info sx = {
                    {
                        fontSize: 16,
                        mr: 1,
                        color: "text.secondary"
                    }
                }
                /> <
                Typography variant = "body2" >
                <
                strong > Contact: < /strong>{" "} {
                    selectedProject.contact_person || "N/A"
                } <
                /Typography> <
                /Box> <
                Box sx = {
                    {
                        display: "flex",
                        alignItems: "center"
                    }
                } >
                <
                Info sx = {
                    {
                        fontSize: 16,
                        mr: 1,
                        color: "text.secondary"
                    }
                }
                /> <
                Typography variant = "body2" >
                <
                strong > Phone: < /strong>{" "} {
                    selectedProject.contact_phone || "N/A"
                } <
                /Typography> <
                /Box> <
                /Stack> <
                Divider sx = {
                    {
                        my: 1.5
                    }
                }
                /> <
                />
            )
        }

        {
            selectedWindfarm && ( <
                >
                <
                Typography variant = "subtitle1"
                color = "secondary"
                fontWeight = "bold"
                gutterBottom >
                {
                    selectedWindfarm.windfarm_name || "N/A"
                } <
                /Typography> <
                Stack spacing = {
                    0.5
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        alignItems: "center"
                    }
                } >
                <
                Info sx = {
                    {
                        fontSize: 16,
                        mr: 1,
                        color: "text.secondary"
                    }
                }
                /> <
                Typography variant = "body2" >
                <
                strong > Location: < /strong> {selectedWindfarm.village || "N/A
                "}, {
                    selectedWindfarm.district || "N/A"
                } <
                /Typography> <
                /Box> <
                Box sx = {
                    {
                        display: "flex",
                        alignItems: "center"
                    }
                } >
                <
                WindPower sx = {
                    {
                        fontSize: 16,
                        mr: 1,
                        color: "text.secondary"
                    }
                }
                /> <
                Typography variant = "body2" >
                <
                strong > Capacity: < /strong>{" "} {
                    selectedWindfarm.capacity_mw || "N/A"
                }
                MW <
                /Typography> <
                /Box> {
                    selectedWindfarm.status && ( <
                        Chip label = {
                            selectedWindfarm.status
                            .replace(/_/g, " ")
                            .toUpperCase()
                        }
                        size = "small"
                        color = {
                            selectedWindfarm.status === "under_construction" ?
                            "warning" :
                                "success"
                        }
                        sx = {
                            {
                                mt: 1,
                                alignSelf: "flex-start"
                            }
                        }
                        />
                    )
                } <
                /Stack> <
                Divider sx = {
                    {
                        my: 1.5
                    }
                }
                /> <
                />
            )
        }

        {
            selectedCluster && ( <
                >
                <
                Typography variant = "subtitle1"
                color = "success.main"
                fontWeight = "bold"
                gutterBottom >
                {
                    selectedCluster.cluster_name || "N/A"
                } <
                /Typography> <
                Box sx = {
                    {
                        display: "flex",
                        alignItems: "center"
                    }
                } >
                <
                Info sx = {
                    {
                        fontSize: 16,
                        mr: 1,
                        color: "text.secondary"
                    }
                }
                /> <
                Typography variant = "body2" >
                <
                strong > Code: < /strong> {selectedCluster.cluster_code || "N/A
                "} <
                /Typography> <
                /Box> <
                />
            )
        } <
        /CardContent> <
        /Card>
    );
};
const ROAD_STATUS = {
    APPROVED: {
        label: "Approved",
        dashArray: null, // Solid line
        weight: 4,
        icon: < ApprovedIcon sx = {
            {
                color: "#2ECC71"
            }
        }
        />,
    },
    UNDER_CONSTRUCTION: {
        label: "Under Construction",
        dashArray: "8, 6", // Dotted line
        weight: 4,
        icon: < Construction sx = {
            {
                color: "#F39C12"
            }
        }
        />,
    },
    SUBMITTED: {
        label: "Submitted - Pending Approval",
        dashArray: "5, 5", // Dashed line
        weight: 3,
        icon: < Schedule sx = {
            {
                color: "#3498DB"
            }
        }
        />,
    },
    PLANNED: {
        label: "Planned",
        dashArray: "4, 4",
        weight: 2,
        icon: < Info sx = {
            {
                color: "#95A5A6"
            }
        }
        />,
    },
};
const MapView = () => {
    const dispatch = useDispatch();
    const {
        nestedprojects = []
    } = useSelector((state) => state.cardRoad);
    const {
        getturbinefilter = []
    } = useSelector(
        (state) => state.electricalData,
    );

    const [project, setProject] = useState(null);
    const [windfarm, setWindfarm] = useState(null);
    const [cluster, setCluster] = useState(null);
    const [isSatellite, setIsSatellite] = useState(false);
    const [selectedProjectData, setSelectedProjectData] = useState(null);
    const [selectedWindfarmData, setSelectedWindfarmData] = useState(null);
    const [selectedClusterData, setSelectedClusterData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await dispatch(GetTurbineFilterData());
            setIsLoading(false);
        };
        loadData();
    }, [dispatch]);

    const filterOptions = useMemo(() => {
        if (!getturbinefilter || !getturbinefilter.length) {
            return {
                projects: [],
                windfarms: [],
                clusters: []
            };
        }

        const projectsMap = new Map();
        const windfarmsMap = new Map();
        const clustersMap = new Map();

        getturbinefilter.forEach((item) => {
            if (item.project_id && !projectsMap.has(item.project_id)) {
                projectsMap.set(item.project_id, {
                    id: item.project_id,
                    name: item.project_name,
                });
            }

            if (item.windfarm_id && !windfarmsMap.has(item.windfarm_id)) {
                windfarmsMap.set(item.windfarm_id, {
                    id: item.windfarm_id,
                    name: item.windfarm_name,
                    project_id: item.project_id,
                });
            }

            if (item.cluster_id && !clustersMap.has(item.cluster_id)) {
                clustersMap.set(item.cluster_id, {
                    id: item.cluster_id,
                    name: item.cluster_name,
                    windfarm_id: item.windfarm_id,
                    project_id: item.project_id,
                });
            }
        });

        return {
            projects: Array.from(projectsMap.values()),
            windfarms: Array.from(windfarmsMap.values()),
            clusters: Array.from(clustersMap.values()),
        };
    }, [getturbinefilter]);

    useEffect(() => {
        if (!isLoading) {
            const params = {};
            if (project) params.projectId = project;
            if (windfarm) params.windfarmId = windfarm;
            if (cluster) params.clusterId = cluster;

            dispatch(getNestedProjects(params));
        }
    }, [dispatch, project, windfarm, cluster, isLoading]);

    useEffect(() => {
        if (!nestedprojects || !nestedprojects.length) {
            setSelectedProjectData(null);
            setSelectedWindfarmData(null);
            setSelectedClusterData(null);
            return;
        }

        if (project) {
            const proj = nestedprojects.find((p) => p.id === project);
            setSelectedProjectData(proj || null);
        } else {
            setSelectedProjectData(null);
        }

        if (project && windfarm) {
            const proj = nestedprojects.find((p) => p.id === project);
            const wf = proj ? .windfarms ? .find((w) => w.id === windfarm);
            setSelectedWindfarmData(wf || null);
        } else {
            setSelectedWindfarmData(null);
        }

        if (project && windfarm && cluster) {
            const proj = nestedprojects.find((p) => p.id === project);
            const wf = proj ? .windfarms ? .find((w) => w.id === windfarm);
            const cl = wf ? .clusters ? .find((c) => c.id === cluster);
            setSelectedClusterData(cl || null);
        } else {
            setSelectedClusterData(null);
        }
    }, [nestedprojects, project, windfarm, cluster]);

    // Update the getRoadStatus function to handle the new logic
    const getRoadStatus = (mapObject) => {
        // NEW LOGIC: If type is "main", return APPROVED status (solid line)
        if (mapObject.type === "main") {
            return ROAD_STATUS.APPROVED; // Solid line
        }

        // For other types, get data from all_updates
        let allUpdates = mapObject.all_updates || [];

        // Ensure all_updates is an array
        if (!Array.isArray(allUpdates) && typeof allUpdates === "object") {
            allUpdates = Object.values(allUpdates);
        }

        const validUpdates = Array.isArray(allUpdates) ?
            allUpdates.filter(
                (update) => update !== null && typeof update === "object",
            ) :
            [];

        // Check for approved updates in all_updates
        const approvedUpdate =
            validUpdates.length > 0 ?
            validUpdates.find(
                (update) => update.approve_date && update.approve_date !== null,
            ) :
            null;

        // Check for submitted updates in all_updates
        const submittedUpdate =
            validUpdates.length > 0 ?
            validUpdates.find(
                (update) =>
                update.submitted_at &&
                update.submitted_at !== null &&
                !update.approve_date,
            ) :
            null;

        // Check map object level submitted/approved status
        const isSubmitted =
            mapObject.submitted_at && mapObject.submitted_at !== null;
        const hasApproveDate =
            mapObject.approve_date && mapObject.approve_date !== null;

        if (hasApproveDate || approvedUpdate) {
            return ROAD_STATUS.APPROVED;
        } else if (isSubmitted || submittedUpdate) {
            return ROAD_STATUS.SUBMITTED;
        } else {
            return ROAD_STATUS.UNDER_CONSTRUCTION;
        }
    };

    // Update mapLayers useMemo to handle the new data structure
    const mapLayers = useMemo(() => {
        if (!nestedprojects || !Array.isArray(nestedprojects)) return [];

        let layers = [];

        nestedprojects.forEach((p) => {
            if (!p.windfarms || !Array.isArray(p.windfarms)) return;

            p.windfarms.forEach((w) => {
                if (!w.clusters || !Array.isArray(w.clusters)) return;

                w.clusters.forEach((c) => {
                    if (!c.map_objects || !Array.isArray(c.map_objects)) return;

                    c.map_objects.forEach((obj) => {
                        if (!obj.coordinates || !Array.isArray(obj.coordinates)) return;

                        const sortedCoords = obj.coordinates
                            .sort((a, b) => a.sequence - b.sequence)
                            .map((p) => [p.latitude, p.longitude]);

                        const isPointType = ["turbine", "junction", "pointcircle"].includes(
                            obj.type,
                        );
                        const drawType = isPointType ? "point" : obj.draw_type;

                        // NEW: Get road status with the updated logic
                        const roadStatus = getRoadStatus(obj);

                        // NEW: Get updates based on type
                        let updates = [];
                        if (obj.type === "main") {
                            // For main roads, use progress_level as Final
                            updates = [{
                                level: "Final",
                                completed_qty: obj.progress_level === "Final" ? "100" : "0",
                                remaining_length: 0,
                                date: obj.created_at,
                                remarks: "Main Road - Final",
                                // Mark as main road for solid line
                                isMain: true,
                            }, ];
                        } else {
                            // For other types, use all_updates
                            updates = obj.all_updates || [];
                            if (!Array.isArray(updates) && typeof updates === "object") {
                                updates = Object.values(updates);
                            }
                        }

                        // Get latest update from the updates array
                        const latestUpdate =
                            Array.isArray(updates) && updates.length > 0 ?
                            updates[updates.length - 1] :
                            null;

                        // NEW: Determine if this is a main road (for solid line)
                        const isMainRoad = obj.type === "main";

                        layers.push({
                            id: obj.id,
                            clusterName: c.cluster_name,
                            clusterCode: c.cluster_code,
                            type: obj.type,
                            label: obj.label,
                            progress: obj.progress_level,
                            distance: obj.distance_km,
                            coordinates: sortedCoords,
                            draw_type: drawType,
                            daily_updates: updates, // Use the processed updates
                            all_updates: obj.all_updates || [], // Keep original for reference
                            name: obj.name,
                            startPoint: obj.coordinates[0],
                            endPoint: obj.coordinates[obj.coordinates.length - 1],
                            submitted_at: obj.submitted_at,
                            approve_date: obj.approve_date || latestUpdate ? .approve_date,
                            roadStatus: roadStatus,
                            latestUpdate: latestUpdate,
                            progress_level: obj.progress_level,
                            isMainRoad: isMainRoad, // Flag for main road
                        });
                    });
                });
            });
        });

        return layers;
    }, [nestedprojects]);

    const handleProjectChange = (projectId) => {
        setProject(projectId);
        setWindfarm(null);
        setCluster(null);
    };

    const handleWindfarmChange = (windfarmId) => {
        setWindfarm(windfarmId);
        setCluster(null);
    };

    const handleClusterChange = (clusterId) => {
        setCluster(clusterId);
    };

    const handleClear = () => {
        setProject(null);
        setWindfarm(null);
        setCluster(null);
    };

    // Loading state
    if (isLoading) {
        return ( <
            Box sx = {
                {
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }
            } >
            <
            Typography variant = "h6" > Loading filter data... < /Typography> <
            /Box>
        );
    }

    return ( <
        >
        <
        MapFilters filterOptions = {
            filterOptions
        }
        project = {
            project
        }
        windfarm = {
            windfarm
        }
        cluster = {
            cluster
        }
        onProjectChange = {
            handleProjectChange
        }
        onWindfarmChange = {
            handleWindfarmChange
        }
        onClusterChange = {
            handleClusterChange
        }
        onClear = {
            handleClear
        }
        />

        <
        Box sx = {
            {
                height: "60vh",
                width: "100%",
                position: "relative"
            }
        } >
        <
        Box sx = {
            {
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 1200
            }
        } >
        < /Box> { /* Satellite toggle */ } <
        Card sx = {
            {
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)", // Centers it perfectly
                zIndex: 1200,
                borderRadius: 2,
                boxShadow: 3,
            }
        } >
        <
        CardContent sx = {
            {
                py: 1,
                px: 2
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                gap: 1
            }
        } >
        <
        FilterAlt sx = {
            {
                color: "primary.main"
            }
        }
        /> <
        Typography variant = "body2" > {
            isSatellite ? "Satellite" : "Street"
        } <
        /Typography> <
        Switch checked = {
            isSatellite
        }
        onChange = {
            () => setIsSatellite((p) => !p)
        }
        size = "small" /
        >
        <
        /Box> <
        /CardContent> <
        /Card>

        { /* Project Info Card */ } <
        ProjectInfoCard selectedProject = {
            selectedProjectData
        }
        selectedWindfarm = {
            selectedWindfarmData
        }
        selectedCluster = {
            selectedClusterData
        }
        />

        { /* Map Legend */ } <
        MapLegend legendItems = {
            [{
                    color: ROAD_STATUS.APPROVED.color,
                    label: "Approved Road",
                    dashArray: null,
                },
                {
                    color: ROAD_STATUS.SUBMITTED.color,
                    label: "Submitted (Pending Approval)",
                    dashArray: "5, 5",
                },
                {
                    color: ROAD_STATUS.UNDER_CONSTRUCTION.color,
                    label: "Under Construction",
                    dashArray: "8, 6",
                },
            ]
        }
        />

        { /* Map */ } <
        MapContainer center = {
            [20.5937, 78.9629]
        }
        zoom = {
            7
        }
        style = {
            {
                height: "100%",
                width: "100%"
            }
        }
        scrollWheelZoom = {
            true
        }
        zoomControl = {
            true
        } >
        {!isSatellite && ( <
                TileLayer url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' /
                >
            )
        } {
            isSatellite && ( <
                TileLayer url = "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                subdomains = {
                    ["mt0", "mt1", "mt2", "mt3"]
                }
                attribution = "&copy; Google Satellite" /
                >
            )
        } <
        FitBounds layers = {
            mapLayers
        }
        />
        // Render Polylines (Roads) - Updated version
        {
            mapLayers.map((layer) => {
                if (layer.draw_type === "polyline") {
                    const typeConfig = TYPE_CONFIG[layer.type] || TYPE_CONFIG.default;
                    const statusConfig =
                        layer.roadStatus || ROAD_STATUS.UNDER_CONSTRUCTION;

                    // Get color from road type
                    const lineColor = typeConfig.color;

                    // NEW: Determine if this is a main road (solid line)
                    const isMainRoad = layer.isMainRoad || layer.type === "main";
                    const progressLevel = layer.progress_level;

                    // NEW: Line styling logic
                    let dashArray = null; // Default solid
                    let lineWeight = statusConfig.weight;

                    if (isMainRoad) {
                        // Main roads are always solid
                        dashArray = null;
                        lineWeight = 5; // Thicker for main roads
                    } else if (progressLevel === "Final") {
                        // Final progress is solid
                        dashArray = null;
                    } else {
                        // Other progress levels use dash pattern from status
                        dashArray = statusConfig.dashArray;
                    }

                    return ( <
                        Polyline key = {
                            `road-${layer.id}`
                        }
                        positions = {
                            layer.coordinates
                        }
                        pathOptions = {
                            {
                                color: lineColor,
                                weight: lineWeight,
                                opacity: 0.9,
                                dashArray: dashArray,
                                lineCap: "round",
                            }
                        } >
                        <
                        Popup mui - layout = "dense" >
                        <
                        Box sx = {
                            {
                                width: 240,
                                p: 0.5
                            }
                        } > { /* Header Section */ } <
                        Box sx = {
                            {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 1,
                            }
                        } >
                        <
                        Typography variant = "subtitle1"
                        sx = {
                            {
                                fontWeight: 600,
                                lineHeight: 0.1,
                                pr: 1
                            }
                        } >
                        {
                            layer.label || layer.name
                        } <
                        /Typography> <
                        Chip size = "small"
                        label = {
                            isMainRoad || progressLevel === "Final" ?
                            "Solid" :
                                "Dashed"
                        }
                        variant = "outlined"
                        sx = {
                            {
                                height: 20,
                                fontSize: "0.65rem",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }
                        }
                        /> <
                        /Box>

                        { /* Primary Status Banner */ } <
                        Box sx = {
                            {
                                mb: 1.5
                            }
                        } > {
                            isMainRoad ? ( <
                                Chip label = "MAIN ROAD"
                                size = "small"
                                sx = {
                                    {
                                        bgcolor: "error.main",
                                        color: "white",
                                        fontWeight: "bold",
                                        width: "100%",
                                        height: 24,
                                        borderRadius: 1,
                                    }
                                }
                                />
                            ) : ( <
                                Chip icon = {
                                    statusConfig.icon ?
                                    React.cloneElement(statusConfig.icon, {
                                        style: {
                                            fontSize: 14,
                                            color: lineColor
                                        },
                                    }) :
                                        undefined
                                }
                                label = {
                                    progressLevel || "Under Construction"
                                }
                                size = "small"
                                sx = {
                                    {
                                        bgcolor: `${lineColor}15`,
                                        color: lineColor,
                                        fontWeight: "bold",
                                        border: `1px solid ${lineColor}40`,
                                        width: "100%",
                                        height: 24,
                                        borderRadius: 1,
                                        "& .MuiChip-label": {
                                            px: 1
                                        },
                                    }
                                }
                                />
                            )
                        } <
                        /Box>

                        { /* Core Metadata Specifications */ } <
                        Stack spacing = {
                            0.75
                        }
                        sx = {
                            {
                                mb: isMainRoad ? 0 : 1.5
                            }
                        } >
                        <
                        Box sx = {
                            {
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "0.8rem",
                            }
                        } >
                        <
                        Typography variant = "body2"
                        color = "text.secondary" >
                        Type <
                        /Typography> <
                        Typography variant = "body2"
                        sx = {
                            {
                                fontWeight: 500
                            }
                        } > {
                            typeConfig.label
                        } <
                        /Typography> <
                        /Box> <
                        Box sx = {
                            {
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "0.8rem",
                            }
                        } >
                        <
                        Typography variant = "body2"
                        color = "text.secondary" >
                        Cluster <
                        /Typography> <
                        Typography variant = "body2"
                        sx = {
                            {
                                fontWeight: 500
                            }
                        } > {
                            layer.clusterName
                        } <
                        /Typography> <
                        /Box> {
                            layer.distance && ( <
                                Box sx = {
                                    {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: "0.8rem",
                                    }
                                } >
                                <
                                Typography variant = "body2"
                                color = "text.secondary" >
                                Length <
                                /Typography> <
                                Typography variant = "body2"
                                sx = {
                                    {
                                        fontWeight: 500
                                    }
                                } >
                                {
                                    layer.distance
                                }
                                km <
                                /Typography> <
                                /Box>
                            )
                        } <
                        /Stack>

                        { /* Compressed Activity Feed */ } {
                            !isMainRoad &&
                                layer.daily_updates &&
                                layer.daily_updates.length > 0 && ( <
                                    Box sx = {
                                        {
                                            borderTop: "1px dashed",
                                            borderColor: "divider",
                                            pt: 1,
                                        }
                                    } >
                                    <
                                    Box sx = {
                                        {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 0.5,
                                        }
                                    } >
                                    <
                                    Typography variant = "caption"
                                    sx = {
                                        {
                                            fontWeight: 600
                                        }
                                    }
                                    color = "text.secondary" >
                                    Latest Progress <
                                    /Typography> <
                                    Typography variant = "caption"
                                    color = "text.disabled" >
                                    {
                                        layer.daily_updates.length
                                    }
                                    total <
                                    /Typography> <
                                    /Box>

                                    {
                                        layer.daily_updates
                                            .slice(-2)
                                            .map((update, index) => ( <
                                                Box key = {
                                                    index
                                                }
                                                sx = {
                                                    {
                                                        bgcolor: "action.hover",
                                                        p: 0.75,
                                                        borderRadius: 1,
                                                        mb: 0.5,
                                                        borderLeft: "2px solid",
                                                        borderColor: "primary.main",
                                                    }
                                                } >
                                                <
                                                Box sx = {
                                                    {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }
                                                } >
                                                <
                                                Typography variant = "caption"
                                                sx = {
                                                    {
                                                        fontWeight: 600,
                                                        color: "text.primary",
                                                    }
                                                } >
                                                {
                                                    update.level || "N/A"
                                                } <
                                                /Typography> <
                                                Typography variant = "caption"
                                                color = "text.secondary"
                                                sx = {
                                                    {
                                                        fontSize: "0.7rem"
                                                    }
                                                } >
                                                {
                                                    update.date || "N/A"
                                                } <
                                                /Typography> <
                                                /Box> <
                                                Typography variant = "caption"
                                                component = "p"
                                                color = "text.secondary"
                                                sx = {
                                                    {
                                                        display: "block",
                                                        mt: 0.25
                                                    }
                                                } >
                                                Completed: {
                                                    " "
                                                } <
                                                strong > {
                                                    update.completed_qty || "0"
                                                }
                                                km <
                                                /strong> <
                                                /Typography> {
                                                    update.remarks && ( <
                                                        Typography variant = "caption"
                                                        component = "p"
                                                        sx = {
                                                            {
                                                                fontStyle: "italic",
                                                                color: "text.secondary",
                                                                mt: 0.25,
                                                                display: "block",
                                                            }
                                                        } >
                                                        "{update.remarks}" <
                                                        /Typography>
                                                    )
                                                } <
                                                /Box>
                                            ))
                                    } <
                                    /Box>
                                )
                        } <
                        /Box> <
                        /Popup> <
                        /Polyline>
                    );
                }
                return null;
            })
        } { /* Render Points */ } {
            mapLayers.map((layer) => {
                if (
                    layer.draw_type === "point" &&
                    layer.coordinates &&
                    layer.coordinates[0]
                ) {
                    const position = layer.coordinates[0];

                    return ( <
                        Marker key = {
                            `point-${layer.id}`
                        }
                        position = {
                            position
                        }
                        icon = {
                            createCustomIcon(layer.type)
                        } >
                        <
                        Popup >
                        <
                        Box sx = {
                            {
                                minWidth: 260,
                                maxWidth: 300,
                                borderRadius: 2,
                                overflow: "hidden",
                            }
                        } >
                        <
                        Box sx = {
                            {
                                bgcolor: "primary.light",
                                p: 2,
                                pb: 1.5,
                                color: "primary.contrastText",
                            }
                        } >
                        <
                        Typography variant = "subtitle1"
                        fontWeight = "bold" > {
                            layer.label
                        } <
                        /Typography> <
                        Typography variant = "caption"
                        sx = {
                            {
                                opacity: 0.9
                            }
                        } >
                        ID: {
                            layer.id || "N/A"
                        } <
                        /Typography> <
                        /Box> <
                        Box sx = {
                            {
                                p: 2
                            }
                        } >
                        <
                        Stack spacing = {
                            2
                        } >
                        <
                        Box sx = {
                            {
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }
                        } >
                        <
                        Box sx = {
                            {
                                p: 1,
                                borderRadius: "50%",
                                bgcolor: "action.hover",
                            }
                        } >
                        {
                            layer.type === "turbine" && ( <
                                WindPower sx = {
                                    {
                                        color: "#FF9800"
                                    }
                                }
                                />
                            )
                        } {
                            layer.type === "junction" && ( <
                                CurrencyYuanIcon sx = {
                                    {
                                        color: "#C2185B"
                                    }
                                }
                                />
                            )
                        } {
                            layer.type === "pointcircle" && ( <
                                Circle sx = {
                                    {
                                        color: "#26A69A"
                                    }
                                }
                                />
                            )
                        } <
                        /Box> <
                        Box >
                        <
                        Typography variant = "caption"
                        color = "text.secondary" >
                        Entity Type <
                        /Typography> <
                        Typography variant = "body2"
                        fontWeight = "medium" > {
                            capitalize(layer ? .type)
                        } <
                        /Typography> <
                        /Box> <
                        /Box> <
                        Divider / >
                        <
                        Box sx = {
                            {
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 1.5,
                            }
                        } >
                        <
                        Box >
                        <
                        Typography variant = "caption"
                        color = "text.secondary" >
                        Name <
                        /Typography> <
                        Typography variant = "body2" > {
                            capitalize(layer ? .name)
                        } <
                        /Typography> <
                        /Box> <
                        Box >
                        <
                        Typography variant = "caption"
                        color = "text.secondary" >
                        Cluster <
                        /Typography> <
                        Typography variant = "body2" > {
                            layer.clusterName
                        } <
                        /Typography> <
                        /Box> <
                        /Box> {
                            layer.progress && ( <
                                Box sx = {
                                    {
                                        mt: 1,
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor: "#e8f5e9",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }
                                } >
                                <
                                Box sx = {
                                    {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }
                                } >
                                <
                                CheckCircle sx = {
                                    {
                                        fontSize: 16,
                                        color: "success.main"
                                    }
                                }
                                /> <
                                Typography variant = "caption"
                                fontWeight = "bold"
                                color = "success.dark" >
                                PROGRESS <
                                /Typography> <
                                /Box> <
                                Typography variant = "caption"
                                fontWeight = "bold" > {
                                    layer.progress
                                } %
                                <
                                /Typography> <
                                /Box>
                            )
                        } <
                        /Stack> <
                        /Box> <
                        /Box> <
                        /Popup> <
                        /Marker>
                    );
                }
                return null;
            })
        } { /* Start and End point markers */ } { /* Render Polylines (Roads) */ } {
            mapLayers.map((layer) => {
                if (layer.draw_type === "polyline") {
                    const typeConfig = TYPE_CONFIG[layer.type] || TYPE_CONFIG.default;
                    const statusConfig =
                        layer.roadStatus || ROAD_STATUS.UNDER_CONSTRUCTION;

                    // Get color from road type
                    const lineColor = typeConfig.color;

                    // Get dash pattern from status
                    const lineWeight = statusConfig.weight;
                    const dashArray = statusConfig.dashArray;

                    return ( <
                        Polyline key = {
                            `road-${layer.id}`
                        }
                        positions = {
                            layer.coordinates
                        }
                        pathOptions = {
                            {
                                color: lineColor, // Use type-based color
                                weight: lineWeight,
                                opacity: 0.9,
                                dashArray: dashArray, // Use status-based dash pattern
                                lineCap: "round",
                            }
                        } >
                        <
                        Popup >
                        <
                        Box sx = {
                            {
                                minWidth: 300,
                                maxWidth: 300,
                                Height: 10
                            }
                        } >
                        <
                        Typography variant = "h6"
                        color = "primary"
                        gutterBottom > {
                            layer.label || layer.name
                        } <
                        /Typography> <
                        Divider sx = {
                            {
                                my: 1
                            }
                        }
                        />

                        { /* Status Chip with type color */ } <
                        Box sx = {
                            {
                                mb: 2
                            }
                        } >
                        <
                        Chip icon = {
                            statusConfig.icon
                        }
                        label = {
                            statusConfig.label
                        }
                        sx = {
                            {
                                backgroundColor: lineColor + "20",
                                color: lineColor,
                                fontWeight: "bold",
                                border: `1px solid ${lineColor}`,
                            }
                        }
                        size = "small" /
                        >
                        <
                        /Box>

                        <
                        Stack spacing = {
                            1
                        } >
                        <
                        Box sx = {
                            {
                                display: "flex",
                                alignItems: "center"
                            }
                        } > {
                            typeConfig.icon
                        } <
                        Typography variant = "body2"
                        sx = {
                            {
                                ml: 1
                            }
                        } >
                        <
                        strong > Type: < /strong> {typeConfig.label} <
                        /Typography> <
                        /Box> <
                        Box sx = {
                            {
                                display: "flex",
                                alignItems: "center"
                            }
                        } >
                        <
                        Info sx = {
                            {
                                fontSize: 16,
                                color: "text.secondary"
                            }
                        }
                        /> <
                        Typography variant = "body2"
                        sx = {
                            {
                                ml: 1
                            }
                        } >
                        <
                        strong > Cluster: < /strong> {layer.clusterName} <
                        /Typography> <
                        /Box> {
                            layer.distance && ( <
                                Box sx = {
                                    {
                                        display: "flex",
                                        alignItems: "center"
                                    }
                                } >
                                <
                                Directions sx = {
                                    {
                                        fontSize: 16,
                                        color: "text.secondary"
                                    }
                                }
                                /> <
                                Typography variant = "body2"
                                sx = {
                                    {
                                        ml: 1
                                    }
                                } >
                                <
                                strong > Length: < /strong> {layer.distance} km <
                                /Typography> <
                                /Box>
                            )
                        } <
                        Box sx = {
                            {
                                display: "flex",
                                alignItems: "center"
                            }
                        } >
                        <
                        CheckCircle sx = {
                            {
                                fontSize: 16,
                                color: "text.secondary"
                            }
                        }
                        /> <
                        Typography variant = "body2"
                        sx = {
                            {
                                ml: 1
                            }
                        } >
                        <
                        strong > Progress: < /strong>{" "} {
                            layer.progress || "Not set"
                        } <
                        /Typography> <
                        /Box>

                        { /* Status details */ } {
                            layer.submitted_at && ( <
                                Box sx = {
                                    {
                                        display: "flex",
                                        alignItems: "center"
                                    }
                                } >
                                <
                                Schedule sx = {
                                    {
                                        fontSize: 16,
                                        color: "text.secondary"
                                    }
                                }
                                /> <
                                Typography variant = "body2"
                                sx = {
                                    {
                                        ml: 1
                                    }
                                } >
                                <
                                strong > Submitted: < /strong>{" "} {
                                    new Date(
                                        layer.submitted_at,
                                    ).toLocaleDateString()
                                } <
                                /Typography> <
                                /Box>
                            )
                        } {
                            layer.approve_date && ( <
                                Box sx = {
                                    {
                                        display: "flex",
                                        alignItems: "center"
                                    }
                                } >
                                <
                                ApprovedIcon sx = {
                                    {
                                        fontSize: 16,
                                        color: "success.main"
                                    }
                                }
                                /> <
                                Typography variant = "body2"
                                sx = {
                                    {
                                        ml: 1
                                    }
                                } >
                                <
                                strong > Approved: < /strong>{" "} {
                                    new Date(
                                        layer.approve_date,
                                    ).toLocaleDateString()
                                } <
                                /Typography> <
                                /Box>
                            )
                        }

                        {
                            layer.latestUpdate && ( <
                                >
                                <
                                Divider / >
                                <
                                Typography variant = "subtitle2"
                                color = "text.secondary" >
                                Latest Update:
                                <
                                /Typography> <
                                Box sx = {
                                    {
                                        p: 1,
                                        bgcolor: "action.hover",
                                        borderRadius: 1,
                                        fontSize: "0.875rem",
                                    }
                                } >
                                <
                                Typography variant = "body2" >
                                <
                                CalendarToday sx = {
                                    {
                                        fontSize: 14,
                                        mr: 0.5,
                                        verticalAlign: "middle",
                                    }
                                }
                                /> {
                                    new Date(
                                        layer.latestUpdate.date,
                                    ).toLocaleDateString()
                                } <
                                /Typography> <
                                Typography variant = "body2" >
                                Completed: {
                                    layer.latestUpdate.completed_qty
                                }
                                km <
                                /Typography> {
                                    layer.latestUpdate.remarks && ( <
                                        Typography variant = "body2"
                                        sx = {
                                            {
                                                fontStyle: "italic"
                                            }
                                        } >
                                        "{layer.latestUpdate.remarks}" <
                                        /Typography>
                                    )
                                } <
                                /Box> <
                                />
                            )
                        } <
                        /Stack> <
                        /Box> <
                        /Popup> <
                        /Polyline>
                    );
                }
                return null;
            })
        } <
        /MapContainer> <
        /Box> <
        />
    );
};

export default MapView;