// AllMapView.jsx - With icons for point types
import React, {
    useState,
    useMemo
} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    IconButton,
    Typography,
    Chip,
    Button,
    Paper,
    Stack,
    Divider,
    Tooltip
} from "@mui/material";
import {
    Close,
    CalendarToday,
    LegendToggle,
    FilterAlt,
    Info,
    Bolt,
    CallMerge,
    Circle
} from "@mui/icons-material";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CurrencyYuanIcon from '@mui/icons-material/CurrencyYuan';

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// Custom icons for different point types
const createCustomIcon = (type) => {
    const config = {
        turbine: {
            html: `<div style="
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
</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
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
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28]
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
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        }
    };

    const iconConfig = config[type] || {
        html: `<div style="
      background: #666;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
        popupAnchor: [0, -20]
    };

    return L.divIcon({
        html: iconConfig.html,
        className: 'custom-div-icon',
        iconSize: iconConfig.iconSize,
        iconAnchor: iconConfig.iconAnchor,
        popupAnchor: iconConfig.popupAnchor
    });
};

// Type-wise color configuration for roads
const TYPE_CONFIG = {
    main: {
        color: "#FF0000",
        label: "Main Road",
        weight: 5,
        icon: "🛣️"
    },
    access: {
        color: "#00FF00",
        label: "Access Road",
        weight: 4,
        icon: "🛤️"
    },
    approach: {
        color: "#0000FF",
        label: "Approach Road",
        weight: 4,
        icon: "🛣️"
    },
    cart: {
        color: "#D2691E",
        label: "Cart Road",
        weight: 3,
        icon: "🚜"
    },
    default: {
        color: "#666666",
        label: "Other",
        weight: 3,
        icon: "📍"
    }
};

// Point type configuration
const POINT_TYPE_CONFIG = {
    turbine: {
        color: "#007400ff",
        label: "Turbine",
        icon: < Bolt / >
    },
    junction: {
        color: "#C2185B",
        label: "Junction",
        icon: < CurrencyYuanIcon / >
    },
    pointcircle: {
        color: "#4ECDC4",
        label: "Point",
        icon: < Circle / >
    }
};

// Progress level styling for roads
const PROGRESS_STYLE = {
    Level0: {
        color: "#9E9E9E",
        dashArray: "10, 10",
        weight: 3
    },
    Level1: {
        color: "#2196F3",
        dashArray: "5, 5",
        weight: 3
    },
    Level2: {
        color: "#4CAF50",
        dashArray: null,
        weight: 4
    },
    Level3: {
        color: "#FF9800",
        dashArray: null,
        weight: 4
    },
    Final: {
        color: "#F44336",
        dashArray: null,
        weight: 5
    },
    default: {
        color: "#666666",
        dashArray: "5, 5",
        weight: 3
    }
};

function AllMapView({
    open,
    onClose,
    data = []
}) {
    const [selectedType, setSelectedType] = useState("all");
    const [showTypeColors, setShowTypeColors] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showPoints, setShowPoints] = useState(true);
    const [showRoads, setShowRoads] = useState(true);


    // console.log("mapview data",data)
    // console.log("All Map Data:", data);

    /* ================= HELPER FUNCTIONS ================= */
    const getPolylineCoords = (coordinates) => {
        if (!Array.isArray(coordinates) || coordinates.length === 0) return [];

        return [...coordinates]
            .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
            .map((coord) => [coord.latitude, coord.longitude]);
    };

    const getPointPosition = (item) => {
        // For point types, use first coordinate or startCoords
        if (item.coordinates && item.coordinates.length > 0) {
            const coord = item.coordinates[0];
            return [coord.latitude, coord.longitude];
        }

        if (item.startCoords) {
            return [item.startCoords.lat, item.startCoords.lng];
        }

        return null;
    };

    const getCenter = () => {
        const firstItem = data.find(item =>
            item.coordinates && item.coordinates.length > 0
        );

        if (firstItem ? .coordinates ? .[0]) {
            return [
                firstItem.coordinates[0].latitude,
                firstItem.coordinates[0].longitude
            ];
        }

        return [18.6, 73.8];
    };

    const getPolylineStyle = (item) => {
        if (showTypeColors) {
            const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.default;
            const progressStyle = PROGRESS_STYLE[item.progress_level] || PROGRESS_STYLE.default;

            return {
                color: typeConfig.color,
                weight: typeConfig.weight,
                dashArray: progressStyle.dashArray,
                opacity: 0.9
            };
        }

        const progressStyle = PROGRESS_STYLE[item.progress_level] || PROGRESS_STYLE.default;
        return {
            color: progressStyle.color,
            weight: progressStyle.weight,
            dashArray: progressStyle.dashArray,
            opacity: 0.9
        };
    };

    /* ================= SEPARATE DATA ================= */
    const {
        roads,
        points
    } = useMemo(() => {
        const roads = [];
        const points = [];

        data.forEach(item => {
            const isPointType = ['turbine', 'junction', 'pointcircle'].includes(item.type);
            const isSinglePoint = item.coordinates && item.coordinates.length === 1;
            const isPointByName = item.type && item.type.toLowerCase().includes('point');
            const shouldBePoint = isPointType || isSinglePoint || isPointByName;

            if (shouldBePoint) {
                const position = getPointPosition(item);
                if (position) {
                    points.push({ ...item,
                        position
                    });
                }
            } else {

                roads.push(item);
            }
        });

        return {
            roads,
            points
        };
    }, [data]);

    /* ================= FILTER DATA ================= */
    const filteredRoads = useMemo(() => {
        if (selectedType === "all") return roads;
        if (POINT_TYPE_CONFIG[selectedType]) return []; // Hide roads when point type selected
        return roads.filter(item => item.type === selectedType);
    }, [roads, selectedType]);

    const filteredPoints = useMemo(() => {
        if (selectedType === "all") return points;
        if (TYPE_CONFIG[selectedType]) return []; // Hide points when road type selected
        return points.filter(item => item.type === selectedType);
    }, [points, selectedType]);

    const allTypes = useMemo(() => {
        const roadTypes = Object.keys(TYPE_CONFIG).filter(type => type !== 'default');
        const pointTypes = Object.keys(POINT_TYPE_CONFIG);
        return ["all", ...roadTypes, ...pointTypes];
    }, []);

    /* ================= STATS ================= */
    const stats = useMemo(() => {
        const total = data.length;
        const roadsCount = roads.length;
        const pointsCount = points.length;

        return {
            total,
            roadsCount,
            pointsCount
        };
    }, [data, roads, points]);

    /* ================= RENDER LEGEND ================= */
    const renderLegend = () => ( <
        Stack spacing = {
            1
        } > { /* Road Legend */ } <
        Box >
        <
        Typography variant = "caption"
        fontWeight = "bold"
        display = "block"
        gutterBottom >
        Roads:
        <
        /Typography> {
            showTypeColors ? (
                Object.entries(TYPE_CONFIG).map(([type, config]) => ( <
                    Stack key = {
                        type
                    }
                    direction = "row"
                    alignItems = "center"
                    spacing = {
                        1
                    }
                    sx = {
                        {
                            mb: 0.5
                        }
                    } >
                    <
                    Box sx = {
                        {
                            width: 20,
                            height: 6,
                            bgcolor: config.color,
                            borderRadius: '2px'
                        }
                    }
                    /> <
                    Typography variant = "caption" > {
                        config.label
                    } < /Typography> <
                    /Stack>
                ))
            ) : (
                Object.entries(PROGRESS_STYLE).map(([level, style]) => ( <
                    Stack key = {
                        level
                    }
                    direction = "row"
                    alignItems = "center"
                    spacing = {
                        1
                    }
                    sx = {
                        {
                            mb: 0.5
                        }
                    } >
                    <
                    Box sx = {
                        {
                            width: 20,
                            height: 6,
                            bgcolor: style.color,
                            borderRadius: '2px',
                            borderStyle: style.dashArray ? 'dashed' : 'solid',
                            borderWidth: '1px',
                            borderColor: style.color
                        }
                    }
                    /> <
                    Typography variant = "caption" > {
                        level
                    } < /Typography> <
                    /Stack>
                ))
            )
        } <
        /Box>

        { /* Point Legend */ } <
        Divider / >
        <
        Box >
        <
        Typography variant = "caption"
        fontWeight = "bold"
        display = "block"
        gutterBottom >
        Points:
        <
        /Typography> {
            Object.entries(POINT_TYPE_CONFIG).map(([type, config]) => ( <
                Stack key = {
                    type
                }
                direction = "row"
                alignItems = "center"
                spacing = {
                    1
                }
                sx = {
                    {
                        mb: 0.5
                    }
                } >
                <
                Box sx = {
                    {
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: config.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                } >
                {
                    React.cloneElement(config.icon, {
                        sx: {
                            fontSize: 10,
                            color: 'white'
                        }
                    })
                } <
                /Box> <
                Typography variant = "caption" > {
                    config.label
                } < /Typography> <
                /Stack>
            ))
        } <
        /Box> <
        /Stack>
    );

    return ( <
        Dialog open = {
            open
        }
        onClose = {
            onClose
        }
        maxWidth = "xl"
        fullWidth PaperProps = {
            {
                sx: {
                    height: '90vh'
                }
            }
        } >
        <
        DialogTitle sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: 'primary.main',
                color: 'white'
            }
        } >
        <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }
        } >
        <
        Typography variant = "h6" > Road Network Map < /Typography> <
        Chip label = {
            `${roads.length} roads, ${points.length} points`
        }
        size = "small"
        sx = {
            {
                bgcolor: 'white',
                color: 'primary.main'
            }
        }
        /> <
        /Box> <
        IconButton onClick = {
            onClose
        }
        sx = {
            {
                color: 'white'
            }
        } >
        <
        Close / >
        <
        /IconButton> <
        /DialogTitle>

        <
        DialogContent sx = {
            {
                p: 0,
                display: 'flex'
            }
        } > { /* ================= SIDEBAR ================= */ } <
        Paper sx = {
            {
                width: 300,
                p: 2,
                borderRight: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflow: 'auto'
            }
        }
        elevation = {
            0
        } >
        { /* Toggle Controls */ } <
        Box >
        <
        Typography variant = "subtitle2"
        fontWeight = "bold"
        gutterBottom >
        Display Controls <
        /Typography> <
        Stack spacing = {
            1
        } >
        <
        Button fullWidth size = "small"
        variant = {
            showRoads ? "contained" : "outlined"
        }
        onClick = {
            () => setShowRoads(!showRoads)
        } >
        {
            showRoads ? "✓ Roads" : "☐ Roads"
        } <
        /Button> <
        Button fullWidth size = "small"
        variant = {
            showPoints ? "contained" : "outlined"
        }
        onClick = {
            () => setShowPoints(!showPoints)
        } >
        {
            showPoints ? "✓ Points" : "☐ Points"
        } <
        /Button> <
        Divider / >
        <
        Button fullWidth size = "small"
        variant = {
            showTypeColors ? "contained" : "outlined"
        }
        onClick = {
            () => setShowTypeColors(true)
        } >
        Type Colors <
        /Button> <
        Button fullWidth size = "small"
        variant = {!showTypeColors ? "contained" : "outlined"
        }
        onClick = {
            () => setShowTypeColors(false)
        } >
        Progress Colors <
        /Button> <
        /Stack> <
        /Box>

        { /* Filter Section */ } <
        Box >
        <
        Typography variant = "subtitle2"
        fontWeight = "bold"
        gutterBottom >
        Filter by Type <
        /Typography> <
        Stack direction = "row"
        flexWrap = "wrap"
        gap = {
            0.5
        } > {
            allTypes.map((type) => ( <
                Chip key = {
                    type
                }
                label = {
                    type
                }
                size = "small"
                color = {
                    selectedType === type ? "primary" : "default"
                }
                onClick = {
                    () => setSelectedType(type)
                }
                sx = {
                    {
                        mb: 0.5,
                        bgcolor: selectedType === type ?
                            (TYPE_CONFIG[type] ? .color || POINT_TYPE_CONFIG[type] ? .color || undefined) : undefined
                    }
                }
                />
            ))
        } <
        /Stack> <
        /Box>

        { /* Stats */ } <
        Box >
        <
        Typography variant = "subtitle2"
        fontWeight = "bold"
        gutterBottom >
        Statistics <
        /Typography> <
        Stack spacing = {
            0.5
        } >
        <
        Typography variant = "body2" >
        Total Items: {
            stats.total
        } <
        /Typography> <
        Typography variant = "body2" >
        Roads: {
            stats.roadsCount
        } <
        /Typography> <
        Typography variant = "body2" >
        Points: {
            stats.pointsCount
        } <
        /Typography> <
        /Stack> <
        /Box>

        { /* Legend */ } <
        Box >
        <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1
            }
        } >
        <
        LegendToggle fontSize = "small" / >
        <
        Typography variant = "subtitle2"
        fontWeight = "bold" >
        Legend <
        /Typography> <
        /Box> {
            renderLegend()
        } <
        /Box>

        { /* Selected Item Info */ } {
            selectedItem && ( <
                Box sx = {
                    {
                        mt: 2,
                        p: 1.5,
                        bgcolor: 'grey.50',
                        borderRadius: 1
                    }
                } >
                <
                Typography variant = "subtitle2"
                fontWeight = "bold"
                gutterBottom >
                Selected {
                    POINT_TYPE_CONFIG[selectedItem.type] ? 'Point' : 'Road'
                } <
                /Typography> <
                Stack spacing = {
                    0.5
                } >
                <
                Typography variant = "body2" > {
                    selectedItem.name
                } < /Typography> <
                Stack direction = "row"
                spacing = {
                    1
                } >
                <
                Chip label = {
                    selectedItem.type
                }
                size = "small"
                sx = {
                    {
                        bgcolor: TYPE_CONFIG[selectedItem.type] ? .color ||
                            POINT_TYPE_CONFIG[selectedItem.type] ? .color ||
                            TYPE_CONFIG.default.color,
                        color: 'white'
                    }
                }
                /> {
                    selectedItem.progress_level && ( <
                        Chip label = {
                            selectedItem.progress_level
                        }
                        size = "small" / >
                    )
                } <
                /Stack> {
                    selectedItem.distanceKm && ( <
                        Typography variant = "body2" >
                        Distance: {
                            selectedItem.distanceKm
                        }
                        km <
                        /Typography>
                    )
                } <
                Typography variant = "body2" >
                Points: {
                    selectedItem.coordinates ? .length || 1
                } <
                /Typography> {
                    selectedItem.latestUpdate && ( <
                        >
                        <
                        Divider sx = {
                            {
                                my: 0.5
                            }
                        }
                        /> <
                        Typography variant = "caption"
                        fontWeight = "bold" >
                        Latest Update <
                        /Typography> <
                        Typography variant = "caption"
                        display = "block" >
                        Completed: {
                            selectedItem.latestUpdate.completed_qty
                        }
                        km <
                        /Typography> <
                        Typography variant = "caption"
                        display = "block" >
                        Date: {
                            selectedItem.latestUpdate.date
                        } <
                        /Typography> <
                        />
                    )
                } <
                /Stack> <
                /Box>
            )
        } <
        /Paper>

        { /* ================= MAP AREA ================= */ } <
        Box sx = {
            {
                flex: 1,
                position: 'relative'
            }
        } > { /* Map Controls */ } <
        Paper sx = {
            {
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 1000,
                p: 1,
                display: 'flex',
                gap: 1
            }
        }
        elevation = {
            3
        } >
        <
        Tooltip title = "Filter" >
        <
        IconButton size = "small" >
        <
        FilterAlt fontSize = "small" / >
        <
        /IconButton> <
        /Tooltip> <
        Tooltip title = "Info" >
        <
        IconButton size = "small" >
        <
        Info fontSize = "small" / >
        <
        /IconButton> <
        /Tooltip> <
        /Paper>

        { /* Map Container */ } <
        MapContainer center = {
            getCenter()
        }
        zoom = {
            11
        }
        style = {
            {
                height: "100%",
                width: "100%"
            }
        } >
        <
        TileLayer url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' /
        >

        { /* Render Roads */ } {
            showRoads && filteredRoads.map((item) => {
                const positions = getPolylineCoords(item.coordinates);
                if (positions.length < 2) return null;

                const style = getPolylineStyle(item);

                return ( <
                    Polyline key = {
                        `road-${item.id}`
                    }
                    positions = {
                        positions
                    }
                    pathOptions = {
                        style
                    }
                    eventHandlers = {
                        {
                            click: () => setSelectedItem(item),
                            mouseover: (e) => {
                                e.target.setStyle({
                                    ...style,
                                    weight: style.weight + 2,
                                    opacity: 1
                                });
                            },
                            mouseout: (e) => {
                                e.target.setStyle({
                                    ...style,
                                    weight: style.weight,
                                    opacity: 0.9
                                });
                            }
                        }
                    } >
                    <
                    Popup >
                    <
                    Box sx = {
                        {
                            minWidth: 200
                        }
                    } >
                    <
                    Typography variant = "subtitle1"
                    fontWeight = "bold"
                    gutterBottom > {
                        item.name
                    } <
                    /Typography> <
                    Stack spacing = {
                        0.5
                    } >
                    <
                    Typography variant = "body2" > Type: {
                        item.type
                    } < /Typography> <
                    Typography variant = "body2" > Progress: {
                        item.progress_level
                    } < /Typography> <
                    Typography variant = "body2" > Distance: {
                        item.distanceKm
                    }
                    km < /Typography> <
                    Typography variant = "body2" > Cluster: {
                        item.cluster
                    } < /Typography> <
                    Typography variant = "body2" > Points: {
                        positions.length
                    } < /Typography> <
                    /Stack> <
                    /Box> <
                    /Popup> <
                    /Polyline>
                );
            })
        }

        { /* Render Points */ } {
            showPoints && filteredPoints.map((item) => {
                if (!item.position) return null;

                const icon = createCustomIcon(item.type);

                return ( <
                    Marker key = {
                        `point-${item.id}`
                    }
                    position = {
                        item.position
                    }
                    icon = {
                        icon
                    }
                    eventHandlers = {
                        {
                            click: () => setSelectedItem(item),
                            mouseover: (e) => {
                                e.target.setZIndexOffset(1000);
                            },
                            mouseout: (e) => {
                                e.target.setZIndexOffset(0);
                            }
                        }
                    } >
                    <
                    Popup >
                    <
                    Box sx = {
                        {
                            minWidth: 180
                        }
                    } >
                    <
                    Typography variant = "subtitle1"
                    fontWeight = "bold"
                    gutterBottom > {
                        item.name || item.type
                    } <
                    /Typography> <
                    Stack spacing = {
                        0.5
                    } >
                    <
                    Typography variant = "body2" > Type: {
                        item.type
                    } < /Typography> {
                        item.project && ( <
                            Typography variant = "body2" > Project: {
                                item.project
                            } < /Typography>
                        )
                    } {
                        item.cluster && ( <
                            Typography variant = "body2" > Cluster: {
                                item.cluster
                            } < /Typography>
                        )
                    } {
                        item.coordinates && ( <
                            Typography variant = "body2" >
                            Location: {
                                item.coordinates[0] ? .latitude ? .toFixed(6)
                            }, {
                                item.coordinates[0] ? .longitude ? .toFixed(6)
                            } <
                            /Typography>
                        )
                    } <
                    /Stack> <
                    /Box> <
                    /Popup> <
                    /Marker>
                );
            })
        } <
        /MapContainer> <
        /Box> <
        /DialogContent>


        <
        /Dialog>
    );
}

export default AllMapView;