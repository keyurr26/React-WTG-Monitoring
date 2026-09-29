import React, {
    useMemo,
    useEffect
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Divider,
    LinearProgress,
    Chip,
    Grid,
} from "@mui/material";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Popup
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ================= FIX LEAFLET ICON ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================= CUSTOM TURBINE ICON ================= */
const turbineIcon = L.divIcon({
    html: `<div style="
    background: linear-gradient(135deg, #FFD700, #FF9800);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    border: 2px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    font-weight: bold;
  ">⚡</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: 'turbine-icon'
});

function SingleMapView({
    open,
    onClose,
    data,
    Turbinedata
}) {
    /* ================= ROAD TYPE COLORS ================= */
    const getRoadTypeColor = (type) => {
        switch (type ? .toLowerCase()) {
            case 'main':
                return '#f44336'; // Red
            case 'approach':
                return '#2196f3'; // Blue
            case 'access':
                return '#4caf50'; // Light Green
            case 'cart':
                return '#D2691E'; // Light Green
            default:
                return '#9e9e9e'; // Gray for unknown types
        }
    };

    // console.log("Single Map View Data",data)

    const roadColor = getRoadTypeColor(data ? .type);

    /* ================= PROGRESS CALCULATIONS ================= */
    const progress = useMemo(() => {
        if (data ? .progress_level ? .toLowerCase() === "final") {
            const total = parseFloat(data ? .distanceKm || 0);

            return {
                percentage: 100,
                completed: total,
                remaining: 0,
                total,
            };
        }

        if (!data ? .latestUpdate ? .completed_qty || !data ? .distanceKm) {
            return {
                percentage: 0,
                completed: 0,
                remaining: 0,
                total: 0
            };
        }

        const completed = parseFloat(data.latestUpdate.completed_qty);
        const total = parseFloat(data.distanceKm);

        return {
            percentage: Math.min((completed / total) * 100, 100),
            completed,
            remaining: Math.max(total - completed, 0),
            total,
        };
    }, [data]);

    /* ================= PROGRESS COLOR ================= */
    const progressColor = progress.percentage >= 100 ? "#4caf50" :
        progress.percentage >= 50 ? "#ff9800" : "#f44336";

    /* ================= SIMPLIFIED PROGRESS VISUALIZATION ================= */
    const isCompleted = data ? .progress_level ? .toLowerCase() === "final";

    const simpleVisualization = useMemo(() => {
        if (!data ? .coordinates || data.coordinates.length < 2) return null;

        const sortedCoords = [...data.coordinates].sort(
            (a, b) => a.sequence - b.sequence
        );

        // If Final → show complete road
        if (isCompleted) {
            return ( <
                Polyline positions = {
                    sortedCoords.map(pt => [pt.latitude, pt.longitude])
                }
                color = {
                    roadColor
                }
                weight = {
                    6
                }
                opacity = {
                    0.9
                }
                />
            );
        }

        const completedIndex = Math.floor(
            (progress.percentage / 100) * sortedCoords.length
        );

        const completedPath = sortedCoords.slice(0, completedIndex + 1);
        const remainingPath = sortedCoords.slice(completedIndex);

        return ( <
            > { /* Completed */ } {
                completedPath.length > 1 && ( <
                    Polyline positions = {
                        completedPath.map(pt => [pt.latitude, pt.longitude])
                    }
                    color = {
                        roadColor
                    }
                    weight = {
                        6
                    }
                    opacity = {
                        0.9
                    }
                    />
                )
            }

            { /* Remaining */ } {
                remainingPath.length > 1 && ( <
                    Polyline positions = {
                        remainingPath.map(pt => [pt.latitude, pt.longitude])
                    }
                    color = {
                        roadColor
                    }
                    weight = {
                        4
                    }
                    opacity = {
                        0.4
                    }
                    dashArray = "10,10" /
                    >
                )
            } <
            />
        );
    }, [data ? .coordinates, progress.percentage, roadColor, isCompleted]);

    /* ================= TURBINE MARKERS ================= */
    const turbineMarkers = useMemo(() => {
        if (!Array.isArray(Turbinedata)) return [];
        return Turbinedata
            .filter(t => t.type === "turbine" && t.startCoords ? .lat && t.startCoords ? .lng)
            .map(t => ({
                id: t.id,
                name: t.name,
                position: [t.startCoords.lat, t.startCoords.lng],
                cluster: t.cluster,
                project: t.project,
                windfarm: t.windfarm
            }));
    }, [Turbinedata]);

    /* ================= MAP CENTER ================= */
    const center = useMemo(() => {
        if (turbineMarkers.length > 0) {
            const lats = turbineMarkers.map(t => t.position[0]);
            const lngs = turbineMarkers.map(t => t.position[1]);
            return [
                lats.reduce((a, b) => a + b, 0) / lats.length,
                lngs.reduce((a, b) => a + b, 0) / lngs.length
            ];
        }
        return data ? .coordinates ? .[0] ? [data.coordinates[0].latitude, data.coordinates[0].longitude] : [18.6, 73.8];
    }, [turbineMarkers, data ? .coordinates]);

    //   useEffect(() => {
    //   console.log("========== MAP DATA ==========");
    //   console.log(JSON.stringify(data, null, 2));
    //   console.log("Coordinates:", data?.coordinates);
    //   console.log("Latest Update:", data?.latestUpdate);
    //   console.log("==============================");
    // }, [data]);


    /* ================= RENDER TURBINES ================= */
    const renderTurbines = () => {
        if (turbineMarkers.length === 0) return null;

        return turbineMarkers.map(turbine => ( <
            Marker key = {
                turbine.id
            }
            position = {
                turbine.position
            }
            icon = {
                turbineIcon
            } >
            <
            Popup >
            <
            strong > ⚡{
                turbine.name
            } < /strong><br / > {
                turbine.windfarm && `Windfarm: ${turbine.windfarm}`
            } < br / > {
                turbine.project && `Project: ${turbine.project}`
            } < br / >
            <
            small > Type: Turbine < /small> <
            /Popup> <
            /Marker>
        ));
    };

    /* ================= EARLY RETURN ================= */
    if (!data) {
        return ( <
            Dialog open = {
                open
            }
            onClose = {
                onClose
            }
            maxWidth = "md"
            fullWidth >
            <
            DialogTitle > Road Details < /DialogTitle> <
            DialogContent >
            <
            Typography color = "text.secondary" > No road selected < /Typography> <
            /DialogContent> <
            DialogActions >
            <
            Button onClick = {
                onClose
            } > Close < /Button> <
            /DialogActions> <
            /Dialog>
        );
    }

    /* ================= RENDER ================= */
    return ( <
        Dialog open = {
            open
        }
        onClose = {
            onClose
        }
        maxWidth = "xl"
        fullWidth >
        <
        DialogTitle >
        <
        Box sx = {
            {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }
        } >
        <
        span > {
            data.name
        } < /span> <
        Box sx = {
            {
                display: 'flex',
                gap: 1,
                alignItems: 'center'
            }
        } > {
            turbineMarkers.length > 0 && ( <
                Chip icon = { < span > ⚡ < /span>}
                    label = {
                        `${turbineMarkers.length} Turbines`
                    }
                    color = "warning"
                    size = "small"
                    variant = "outlined" /
                    >
                )
            } <
            Chip
            label = {
                `${progress.percentage.toFixed(1)}% Complete`
            }
            sx = {
                {
                    bgcolor: progressColor,
                    color: 'white',
                    fontWeight: 'bold'
                }
            }
            /> <
            /Box> <
            /Box> <
            /DialogTitle>

            <
            DialogContent sx = {
                {
                    p: 0
                }
            } >
            <
            Grid container sx = {
                {
                    height: 500
                }
            } > { /* LEFT SIDE - INFORMATION */ } <
            Grid item xs = {
                12
            }
            md = {
                4
            }
            sx = {
                {
                    p: 2,
                    overflowY: 'auto',
                    height: '100%'
                }
            } > { /* Road Type Badge */ } <
            Box sx = {
                {
                    mb: 2,
                    display: 'flex',
                    gap: 1
                }
            } >
            <
            Chip
            label = {
                data.type || "Unknown"
            }
            sx = {
                {
                    bgcolor: roadColor,
                    color: 'white',
                    fontWeight: 'bold'
                }
            }
            /> {
                data.drawType && ( <
                    Chip label = {
                        data.drawType
                    }
                    variant = "outlined"
                    size = "small" /
                    >
                )
            } <
            /Box>

            { /* Progress Bar */ } <
            Box sx = {
                {
                    mb: 3
                }
            } >
            <
            Box sx = {
                {
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1
                }
            } >
            <
            Typography variant = "body2"
            color = "text.secondary" > {
                progress.completed.toFixed(1)
            }
            km completed <
            /Typography> <
            Typography variant = "body2"
            color = "text.secondary" > {
                progress.remaining.toFixed(1)
            }
            km remaining <
            /Typography> <
            /Box> <
            LinearProgress
            variant = "determinate"
            value = {
                progress.percentage
            }
            sx = {
                {
                    height: 10,
                    borderRadius: 5,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                        bgcolor: progressColor,
                        borderRadius: 5
                    }
                }
            }
            /> <
            Typography variant = "caption"
            color = "text.secondary"
            sx = {
                {
                    mt: 0.5,
                    display: 'block'
                }
            } >
            Total: {
                progress.total
            }
            km <
            /Typography> <
            /Box>

            { /* Road Information */ } <
            Typography variant = "h6"
            gutterBottom > Road Information < /Typography> <
            Divider sx = {
                {
                    mb: 2
                }
            }
            />

            <
            Box sx = {
                {
                    mb: 3
                }
            } >
            <
            Typography >
            <
            strong > Name: < /strong> <
                span style = {
                    {
                        color: roadColor,
                        fontWeight: 'bold',
                        marginLeft: '4px'
                    }
                } > {
                    data.name
                } <
                /span> <
                /Typography> <
                Typography > < strong > Cluster: < /strong> {data.cluster}</Typography >
                <
                Typography >
                <
                strong > Type: < /strong> <
                span style = {
                    {
                        color: roadColor,
                        fontWeight: 'bold',
                        marginLeft: '4px',
                        textTransform: 'capitalize'
                    }
                } > {
                    data.type
                } <
                /span> <
                /Typography> <
                Typography > < strong > Windfarm: < /strong> {data.windfarm}</Typography >
                <
                Typography > < strong > Project: < /strong> {data.project}</Typography >
                <
                Typography > < strong > Total Distance: < /strong> {data.distanceKm} km</Typography >
                <
                /Box>

            { /* Road Type Legend */ } <
            Box sx = {
                {
                    mb: 3,
                    p: 2,
                    bgcolor: '#fafafa',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                }
            } >
            <
            Typography variant = "subtitle2"
            gutterBottom sx = {
                {
                    fontWeight: 'bold'
                }
            } > 🛣️Road Type Colors <
            /Typography> <
            Box sx = {
                {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mt: 1
                }
            } >
            <
            Box sx = {
                {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }
            } >
            <
            Box sx = {
                {
                    width: 20,
                    height: 8,
                    bgcolor: '#f44336',
                    borderRadius: '2px'
                }
            }
            /> <
            Typography variant = "body2" > Main Road < /Typography> <
            /Box> <
            Box sx = {
                {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }
            } >
            <
            Box sx = {
                {
                    width: 20,
                    height: 8,
                    bgcolor: '#2196f3',
                    borderRadius: '2px'
                }
            }
            /> <
            Typography variant = "body2" > Approach Road < /Typography> <
            /Box> <
            Box sx = {
                {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }
            } >
            <
            Box sx = {
                {
                    width: 20,
                    height: 8,
                    bgcolor: '#4caf50',
                    borderRadius: '2px'
                }
            }
            /> <
            Typography variant = "body2" > Access Road < /Typography> <
            /Box> <
            Box sx = {
                {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }
            } >
            <
            Box sx = {
                {
                    width: 20,
                    height: 8,
                    bgcolor: '#D2691E',
                    borderRadius: '2px'
                }
            }
            /> <
            Typography variant = "body2" > Cart Road < /Typography> <
            /Box> <
            /Box> <
            /Box>

            { /* Progress Summary */ } <
            Box sx = {
                {
                    mb: 3,
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    borderLeft: `4px solid ${progressColor}`
                }
            } >
            <
            Typography variant = "subtitle1"
            gutterBottom > 📊Progress Summary <
            /Typography> <
            Box sx = {
                {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 2
                }
            } >
            <
            Box >
            <
            Typography variant = "body2" >
            <
            strong > Completed: < /strong> {progress.completed.toFixed(1)} km <
                /Typography> <
                Typography variant = "body2" >
                <
                strong > Remaining: < /strong> {progress.remaining.toFixed(1)} km <
                /Typography> <
                /Box> <
                Box >
                <
                Typography variant = "body2" >
                <
                strong > Percentage: < /strong> {progress.percentage.toFixed(1)}% <
                /Typography> <
                Typography variant = "body2" >
                <
                strong > Status: < /strong> {
            progress.percentage >= 100 ? 'Completed' : progress.percentage >= 50 ? 'In Progress' : 'Just Started'
        } <
        /Typography> <
        /Box> <
        /Box> <
        /Box>

        { /* Turbine Information */ } {
            turbineMarkers.length > 0 && ( <
                Box sx = {
                    {
                        p: 2,
                        bgcolor: '#fff8e1',
                        borderRadius: 1,
                        border: '1px solid #ffecb3'
                    }
                } >
                <
                Typography variant = "subtitle1"
                gutterBottom sx = {
                    {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }
                } >
                <
                span style = {
                    {
                        background: 'linear-gradient(135deg, #FFD700, #FF9800)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px'
                    }
                } > ⚡ < /span> <
                span > Turbines({
                    turbineMarkers.length
                }) < /span> <
                /Typography> <
                Box sx = {
                    {
                        maxHeight: 150,
                        overflowY: 'auto',
                        mt: 1
                    }
                } > {
                    turbineMarkers.map(turbine => ( <
                        Box key = {
                            turbine.id
                        }
                        sx = {
                            {
                                p: 1,
                                mb: 1,
                                bgcolor: 'white',
                                borderRadius: 1,
                                border: '1px solid #ffecb3',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }
                        } >
                        <
                        span style = {
                            {
                                background: 'linear-gradient(135deg, #FFD700, #FF9800)',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px'
                            }
                        } > ⚡ < /span> <
                        Box >
                        <
                        Typography variant = "body2"
                        fontWeight = "medium" > {
                            turbine.name
                        } <
                        /Typography> <
                        Typography variant = "caption"
                        color = "text.secondary"
                        display = "block" > {
                            turbine.cluster
                        } <
                        /Typography> <
                        /Box> <
                        /Box>
                    ))
                } <
                /Box> <
                /Box>
            )
        }

        { /* Latest Update */ } {
            data.latestUpdate && ( <
                Box sx = {
                    {
                        mt: 3,
                        p: 2,
                        bgcolor: '#fff3e0',
                        borderRadius: 1
                    }
                } >
                <
                Typography variant = "subtitle1"
                gutterBottom > 📝Latest Update < /Typography> <
                Typography variant = "body2" > < strong > Date: < /strong> {data.latestUpdate.date}</Typography >
                <
                Typography variant = "body2" > < strong > Completed: < /strong> {data.latestUpdate.completed_qty} km</Typography > {
                    data.latestUpdate.remarks && ( <
                        Typography variant = "body2"
                        sx = {
                            {
                                mt: 1,
                                fontStyle: 'italic'
                            }
                        } >
                        <
                        strong > Remarks: < /strong> {data.latestUpdate.remarks} <
                        /Typography>
                    )
                } <
                /Box>
            )
        } <
        /Grid>

        { /* RIGHT SIDE - MAP */ } <
        Grid item xs = {
            12
        }
        md = {
            8
        }
        sx = {
            {
                height: '100%'
            }
        } >
        <
        Box sx = {
            {
                height: '100%',
                width: '100%',
                borderLeft: {
                    md: '1px solid #e0e0e0'
                }
            }
        } >
        <
        MapContainer center = {
            center
        }
        zoom = {
            13
        }
        style = {
            {
                height: "100%",
                width: "100%"
            }
        } >
        <
        TileLayer url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" / >

        { /* Road Progress with Type Colors */ } {
            simpleVisualization
        }

        { /* Start Marker */ } {
            data.coordinates ? .[0] && ( <
                Marker position = {
                    [data.coordinates[0].latitude, data.coordinates[0].longitude]
                } >
                <
                Popup >
                <
                strong > 🚩Start Point < /strong><br / >
                Type: {
                    data.type
                } < br / > {
                    data.windfarm
                } <
                /Popup> <
                /Marker>
            )
        }

        { /* End Marker */ } {
            data.coordinates ? .length > 0 && ( <
                Marker position = {
                    [data.coordinates[data.coordinates.length - 1].latitude,
                        data.coordinates[data.coordinates.length - 1].longitude
                    ]
                } >
                <
                Popup >
                <
                strong > 🏁End Point < /strong><br / >
                Type: {
                    data.type
                } < br / >
                Distance: {
                    data.distanceKm
                }
                km <
                /Popup> <
                /Marker>
            )
        }

        { /* Turbine Markers with Custom Icon */ } {
            renderTurbines()
        } <
        /MapContainer> <
        /Box> <
        /Grid> <
        /Grid> <
        /DialogContent>

        <
        DialogActions sx = {
            {
                p: 2
            }
        } >
        <
        Button onClick = {
            onClose
        }
        variant = "contained" > Close < /Button> <
        /DialogActions> <
        /Dialog>
    );
}

export default SingleMapView;