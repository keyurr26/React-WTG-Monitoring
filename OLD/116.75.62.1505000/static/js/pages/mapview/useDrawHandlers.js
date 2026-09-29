import {
    useEffect,
    useRef
} from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import {
    ROAD_CONFIG
} from "./roadConfig";
import {
    ELECTRICAL_CONFIG
} from "./electricalConfig";
import {
    normalizeGeometry
} from "./GeometryUtils";

import JunctionIcon from "../../assets/junction.png";
import TurbineIcon from "../../assets/turbine-removebg-preview.png";
import SubstationImage from "../../assets/substation.png";
import PoleImage from "../../assets/electric-pole.png";
import EleJunctionImage from "../../assets/elejunction.png";

/* ---------- START & END ICONS ---------- */
const startIcon = L.divIcon({
    className: "start-point",
    html: `<div style="background:green;color:white;padding:4px 6px;border-radius:4px;font-size:10px;font-weight:bold;">START</div>`,
    iconAnchor: [12, 12],
});

const endIcon = L.divIcon({
    className: "end-point",
    html: `<div style="background:red;color:white;padding:4px 6px;border-radius:4px;font-size:10px;font-weight:bold;">END</div>`,
    iconAnchor: [12, 12],
});

/* ---------- ELECTRICAL START & END ICONS ---------- */
const electricalStartIcon = L.divIcon({
    className: "electrical-start-point",
    html: `<div style="background:#4CAF50;color:white;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">START</div>`,
    iconAnchor: [12, 12],
});

const electricalEndIcon = L.divIcon({
    className: "electrical-end-point",
    html: `<div style="background:#F44336;color:white;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">END</div>`,
    iconAnchor: [12, 12],
});

/* ---------- TURBINE ICON ---------- */
const turbineIcon = L.icon({
    iconUrl: TurbineIcon,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
});


// electrical icon

// const substationIcon = L.icon({
//   iconUrl: SubstationImage,
//   iconSize: [25, 25],
//   iconAnchor: [12, 25],
// });


const substationIcon = L.icon({
    iconUrl: SubstationImage,
    iconSize: [40, 40],
    iconAnchor: [25, 50], // bottom center
    popupAnchor: [0, -45],
});

// const poleIcon = L.icon({
//   iconUrl: PoleImage,
//   // iconSize: [20, 30],
//     iconSize: [30, 30],
//   iconAnchor: [10, 30],
// });

const poleIcon = L.icon({
    iconUrl: PoleImage,
    iconSize: [45, 45],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
});


// const eleJunctionIcon = L.icon({
//   iconUrl: EleJunctionImage,
//   // iconSize: [20,20],

//     iconSize: [30,30],
//    iconAnchor: [12, 25],

// });


const eleJunctionIcon = L.icon({
    iconUrl: EleJunctionImage,
    iconSize: [45, 45],
    iconAnchor: [19, 38],
    popupAnchor: [0, -32],
});


/* ---------- ELECTRICAL ICONS ---------- */
const createElectricalIcon = (color, text) => {
    return L.divIcon({
        className: "electrical-icon",
        html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
      ">${text}</div>
    `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

// Helper function for level colors
const getLevelColor = (level) => {
    if (!level) return "#333";
    switch (level) {
        case "Level0":
            return "#9e9e9e";
        case "Level1":
            return "#f44336";
        case "Level2":
            return "#ff9800";
        case "Level3":
            return "#ffeb3b";
        case "Final":
            return "#4CAF50";
        default:
            return "#e0e0e0";
    }
};

/* ---------- ADD LABEL (USING TOOLTIP) ---------- */
const addLabel = (
    layer,
    name,
    distance = "",
    voltage = "",
    level = null,
    moduleType = "civil",
) => {
    if (!layer || !name) return null;

    // Tooltip content बनाएं
    let tooltipContent = `<div style="font-weight: bold; font-size: 12px; margin-bottom: 4px;">${name}</div>`;

    if (moduleType === "civil") {
        if (distance)
            tooltipContent += `<div style="font-size: 10px; color: #666;">${distance} km</div>`;
        if (level) {
            const levelColor = getLevelColor(level);
            tooltipContent += `<div style="font-size: 10px; color: ${levelColor}; font-weight: bold;">${level}</div>`;
        }
    } else {
        if (voltage)
            tooltipContent += `<div style="font-size: 10px; color: #666;">${voltage}</div>`;
        if (distance)
            tooltipContent += `<div style="font-size: 10px; color: #666;">${distance} km</div>`;
        if (level) {
            const levelColor = getLevelColor(level);
            tooltipContent += `<div style="font-size: 10px; color: ${levelColor}; font-weight: bold;">${level}</div>`;
        }
    }

    // 🔴 USE LEAFLET'S BUILT-IN TOOLTIP
    layer.bindTooltip(tooltipContent, {
        permanent: false, // सिर्फ hover पर show होगा
        direction: "top",
        offset: L.point(0, -10),
        className: moduleType === "civil" ? "road-tooltip" : "electrical-tooltip",
        opacity: 1,
    });

    // Tooltip के style को customize करें (optional)
    setTimeout(() => {
        const tooltip = layer.getTooltip();
        if (tooltip && tooltip.getElement) {
            const tooltipElement = tooltip.getElement();
            if (tooltipElement) {
                tooltipElement.style.background = "white";
                tooltipElement.style.border = "2px solid #333";
                tooltipElement.style.borderRadius = "4px";
                tooltipElement.style.padding = "6px 10px";
                tooltipElement.style.fontSize = "12px";
                tooltipElement.style.color = "#333";
                tooltipElement.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
            }
        }
    }, 100);

    return null; // हमें marker की जरूरत नहीं
};

export function useDrawHandlers({
    mapRef,
    drawnItemsRef,
    drawControlRef,
    layersGroupRef,
    selectedRoad,
    roadNames,
    setMapData,
    roadProgress = {},
    updateRoadProgress,
    getMidpoint,
    createProgressIcon,
    selectedCluster = null,
    inputName = "",
    getLevelStyle,
    moduleType = "civil",
}) {
    const isInitializedRef = useRef(false);
    const eventHandlersRef = useRef({});

    // ✅ GET CONFIG BASED ON MODULE
    const getConfig = () => {
        return moduleType === "civil" ? ROAD_CONFIG : ELECTRICAL_CONFIG;
    };

    useEffect(() => {
        const map = mapRef.current ? .leafletMap;
        if (!map || !drawnItemsRef.current) return;

        // ✅ STRICT VALIDATION FUNCTION
        const canUserDraw = () => {
            if (!selectedRoad) {
                return false;
            }

            if (!selectedCluster) {
                return false;
            }

            const featureName = roadNames[selectedRoad];
            if (!featureName || featureName.trim() === "") {
                return false;
            }


            return true;
        };

        // ✅ CLEANUP FUNCTION
        const cleanupDrawControls = () => {
            if (drawControlRef.current) {
                map.removeControl(drawControlRef.current);
                drawControlRef.current = null;
            }

            if (eventHandlersRef.current.created) {
                map.off(L.Draw.Event.CREATED, eventHandlersRef.current.created);
            }
            if (eventHandlersRef.current.deleted) {
                map.off(L.Draw.Event.DELETED, eventHandlersRef.current.deleted);
            }
            if (eventHandlersRef.current.edited) {
                map.off(L.Draw.Event.EDITED, eventHandlersRef.current.edited);
            }
            eventHandlersRef.current = {};
        };

        // ✅ STEP 1: Always cleanup first
        cleanupDrawControls();

        // ✅ STEP 2: Check if user can draw
        const userCanDraw = canUserDraw();

        // ✅ STEP 3: Only setup if user can draw
        if (!userCanDraw) {
            return;
        }

        // Get config based on module
        const config = getConfig()[selectedRoad];
        if (!config) {

            return;
        }



        /* ---------- DRAW OPTIONS ---------- */
        const drawOptions = {
            polygon: false,
            rectangle: false,
            circlemarker: false,

            polyline: config.drawType === "polyline" ?
                {
                    shapeOptions: {
                        color: config.color,
                        weight: moduleType === "electrical" ? 3 : 4,
                        dashArray: config.hasProgressLevel ? "15,15" : null,
                        opacity: config.hasProgressLevel ? 0.3 : 1.0,
                    },
                } :
                false,

            marker: config.drawType === "marker",

            circle: config.drawType === "circle" ?
                {
                    shapeOptions: {
                        color: config.color,
                        fillOpacity: 0.3,
                        weight: 2,
                    },
                } :
                false,
        };

        // ✅ CREATE DRAW CONTROL ONLY IF USER CAN DRAW
        const drawControl = new L.Control.Draw({
            draw: drawOptions,
            edit: {
                featureGroup: drawnItemsRef.current,
                remove: true,
                edit: false,
            },
        });

        drawControlRef.current = drawControl;
        map.addControl(drawControl);

        /* ---------- CALCULATE TOTAL POLYLINE DISTANCE ---------- */
        const calculatePolylineDistance = (latlngs) => {
            if (!latlngs || latlngs.length < 2) return "0.00";

            let totalMeters = 0;
            for (let i = 1; i < latlngs.length; i++) {
                const point1 = latlngs[i - 1];
                const point2 = latlngs[i];
                totalMeters += map.distance(point1, point2);
            }

            return (totalMeters / 1000).toFixed(2);
        };

        /* ---------- GET LAYER CENTER POINT ---------- */
        const getLayerCenter = (layer) => {
            if (layer.getLatLng) return layer.getLatLng();
            if (layer.getLatLngs ? .().length > 0) {
                const latlngs = layer.getLatLngs();
                const flat =
                    Array.isArray(latlngs[0]) && Array.isArray(latlngs[0][0]) ?
                    latlngs[0] :
                    latlngs;
                return flat[Math.floor(flat.length / 2)];
            }
            if (layer.getBounds) return layer.getBounds().getCenter();
            return null;
        };

        /* ---------- HELPERS ---------- */
        const createLayerGroup = (mainLayer, associatedLayers = []) => {
            const id = `grp-${Date.now()}`;
            layersGroupRef.current.set(mainLayer._leaflet_id, {
                id,
                mainLayer,
                associatedLayers,
                type: selectedRoad,
                config,
                progressMarker: null,
                module: moduleType,
            });
            return id;
        };

        const removeLayerGroup = (layerId) => {
            const group = layersGroupRef.current.get(layerId);
            if (!group) return;

            group.associatedLayers.forEach((l) => {
                if (drawnItemsRef.current.hasLayer(l)) {
                    drawnItemsRef.current.removeLayer(l);
                }
            });

            if (group.progressMarker) {
                drawnItemsRef.current.removeLayer(group.progressMarker);
            }

            if (drawnItemsRef.current.hasLayer(group.mainLayer)) {
                drawnItemsRef.current.removeLayer(group.mainLayer);
            }

            layersGroupRef.current.delete(layerId);

            setMapData((prev) =>
                prev.filter((i) => i._layerId !== layerId && i._groupId !== group.id),
            );

            if (roadProgress[layerId]) {
                updateRoadProgress(layerId, undefined);
            }
        };

        /* ---------- ADD PROGRESS MARKER ---------- */
        const addProgressMarker = (layer, layerId) => {
            const progress = roadProgress[layerId] || 0;
            const center = getLayerCenter(layer);
            if (!center || !createProgressIcon) return null;

            const progressMarker = L.marker(center, {
                icon: createProgressIcon(progress),
                interactive: false,
                zIndexOffset: 1001,
            });
            progressMarker._isProgressMarker = true;

            return progressMarker;
        };

        /* ---------- CREATE ELECTRICAL FEATURE ---------- */
        const createElectricalFeature = (layer, name) => {
            const rawGeometry =
                config.drawType === "marker" ?
                layer.getLatLng() :
                config.drawType === "circle" ?
                {
                    lat: layer.getLatLng().lat,
                    lng: layer.getLatLng().lng,
                    radius: layer.getRadius(),
                } :
                layer.getLatLngs ?
                layer.getLatLngs() :
                layer.getLatLng();

            drawnItemsRef.current.addLayer(layer);
            const layerId = layer._leaflet_id;

            // ✅ Apply initial level style if hasProgressLevel
            if (config.hasProgressLevel) {
                const levelStyle = getLevelStyle ?
                    getLevelStyle("Level0") :
                    {
                        dashArray: "15,15",
                        opacity: 0.3
                    };
                layer.setStyle({
                    dashArray: levelStyle.dashArray,
                    opacity: levelStyle.opacity,
                });
            }

            // Set custom icon for electrical markers
            if (config.drawType === "marker") {

                if (selectedRoad === "substation") {
                    layer.setIcon(substationIcon);
                } else if (selectedRoad === "pole") {
                    layer.setIcon(poleIcon);
                } else if (selectedRoad === "junction") {
                    layer.setIcon(eleJunctionIcon);
                } else {
                    //for others electrical markers text icon



                    let iconText = "";

                    if (selectedRoad === "tower") iconText = "T";
                    else if (selectedRoad === "junction_box") iconText = "JB";

                    if (iconText) {
                        layer.setIcon(createElectricalIcon(config.color, iconText));
                    }
                }
            }

            // Special styling for electrical circles
            if (config.drawType === "circle") {
                if (selectedRoad === "switchyard") {
                    layer.setStyle({
                        dashArray: "5, 5",
                        fillOpacity: 0.2,
                        weight: 3,
                    });
                } else if (selectedRoad === "electrical_room") {
                    layer.setStyle({
                        fillOpacity: 0.4,
                        weight: 2,
                    });
                }
            }

            // Calculate distance for polylines
            let distance = "";
            let voltageInfo = "";

            if (config.drawType === "polyline") {
                distance = calculatePolylineDistance(layer.getLatLngs());
                if (selectedRoad === "transmission_line") {
                    voltageInfo = "HV Line";
                } else if (selectedRoad === "cable_trench") {
                    voltageInfo = "LV Cable";
                }
            } else if (selectedRoad === "substation") {
                voltageInfo = "33kV";
            }

            const initialLevel = config.hasProgressLevel ? "Level0" : null;

            // 🔴 TOOLTIP ADD करें (No marker needed)
            addLabel(layer, name, distance, voltageInfo, initialLevel, moduleType);

            const associatedLayers = [];

            // Add START and END markers for transmission lines and cable trenches
            if (
                // (selectedRoad === "transmission_line" ||
                //   selectedRoad === "cable_trench")

                ["feeder", "cable", "connection", "jumper", "tapping"].includes(selectedRoad) &&
                config.drawType === "polyline"
            ) {
                const latlngs = layer.getLatLngs();
                const start = latlngs[0];
                const end = latlngs[latlngs.length - 1];

                const startMarker = L.marker(start, {
                    icon: electricalStartIcon,
                    //  icon: startIcon  // ✅ Civil वाला icon
                });
                const endMarker = L.marker(end, {
                    icon: electricalEndIcon,
                    // icon: endIcon    // ✅ Civil वाला icon

                });

                drawnItemsRef.current.addLayer(startMarker);
                drawnItemsRef.current.addLayer(endMarker);

                associatedLayers.push(startMarker, endMarker);
            }

            // Create data record
            const record = {
                type: selectedRoad,
                label: config.label,
                name,
                geometry: normalizeGeometry(config.drawType, rawGeometry),
                _layerId: layerId,
                progress: 0,
                drawType: config.drawType,
                _groupId: createLayerGroup(layer, associatedLayers),
                cluster_id: selectedCluster,
                module: moduleType,
                progressLevel: config.hasProgressLevel ? "Level0" : null,
                // Electrical specific fields
                // voltage_level: voltageInfo,
                // capacity_mw: selectedRoad === "substation" ? 50 : null,
            };

            // For polylines, calculate and store distance
            if (config.drawType === "polyline") {
                const latlngs = layer.getLatLngs();
                const km = calculatePolylineDistance(latlngs);
                record.geometry.start_end_km = parseFloat(km);
                record.geometry.start_point = [latlngs[0].lat, latlngs[0].lng];
                record.geometry.end_point = [
                    latlngs[latlngs.length - 1].lat,
                    latlngs[latlngs.length - 1].lng,
                ];

                // Store distance in main record too
                record.distance_km = parseFloat(km);
            }

            return record;
        };

        /* ---------- CREATE CIVIL FEATURE ---------- */
        const createCivilFeature = (layer, name) => {
            const rawGeometry =
                config.drawType === "marker" ?
                layer.getLatLng() :
                layer.getLatLngs ?
                layer.getLatLngs() :
                layer.getLatLng();

            /* ----- JUNCTION ----- */
            if (selectedRoad === "junction") {
                const marker = L.marker(layer.getLatLng(), {
                    icon: L.icon({
                        iconUrl: JunctionIcon,
                        iconSize: [20, 20],
                        iconAnchor: [10, 20],
                    }),
                }).bindPopup(`<b>${name}</b><br/>Type: Junction`);

                drawnItemsRef.current.addLayer(marker);
                const layerId = marker._leaflet_id;

                // 🔴 TOOLTIP ADD करें
                addLabel(marker, name, "", "", null, moduleType);

                const record = {
                    type: selectedRoad,
                    label: config.label,
                    name,
                    geometry: normalizeGeometry(config.drawType, rawGeometry),
                    _layerId: layerId,
                    progress: 0,
                    drawType: config.drawType,
                    _groupId: createLayerGroup(marker),
                    cluster_id: selectedCluster,
                    progressLevel: config.hasProgressLevel ? "Level0" : null,
                };

                return record;
            }

            /* ----- TURBINE ----- */
            if (selectedRoad === "turbine") {
                const center = layer.getLatLng ?
                    layer.getLatLng() :
                    layer.getBounds().getCenter();
                const turbineMarker = L.marker(center, {
                    icon: turbineIcon,
                    draggable: false,
                }).bindPopup(`<b>${name}</b><br/>Type: Turbine`);

                const circle = L.circle(center, {
                    radius: 80,
                    color: config.color,
                    fillOpacity: 0.1,
                    weight: 1,
                });

                turbineMarker.on("move", (e) => {
                    circle.setLatLng(e.latlng);
                    const group = layersGroupRef.current.get(turbineMarker._leaflet_id);
                    if (group) {
                        group.associatedLayers.forEach((associatedLayer) => {
                            if (associatedLayer !== circle && associatedLayer.setLatLng) {
                                associatedLayer.setLatLng(e.latlng);
                            }
                        });
                    }
                });

                drawnItemsRef.current.addLayer(turbineMarker);
                drawnItemsRef.current.addLayer(circle);

                const initialLevel = config.hasProgressLevel ? "Level0" : null;

                // 🔴 TOOLTIP ADD करें
                addLabel(turbineMarker, name, "", "", initialLevel, moduleType);

                const associatedLayers = [circle];

                const layerId = turbineMarker._leaflet_id;
                const record = {
                    type: selectedRoad,
                    label: config.label,
                    name,
                    geometry: normalizeGeometry("marker", center),
                    _layerId: layerId,
                    progress: 0,
                    drawType: config.drawType,
                    _groupId: createLayerGroup(turbineMarker, associatedLayers),
                    cluster_id: selectedCluster,
                    progressLevel: config.hasProgressLevel ? "Level0" : null,
                };

                return record;
            }

            /* ----- ROAD / POLYLINE TYPES ----- */
            if (config.drawType === "polyline") {
                drawnItemsRef.current.addLayer(layer);

                const latlngs = layer.getLatLngs();
                const start = latlngs[0];
                const end = latlngs[latlngs.length - 1];

                const km = calculatePolylineDistance(latlngs);

                // ✅ Apply initial level style if hasProgressLevel
                if (config.hasProgressLevel) {
                    const levelStyle = getLevelStyle ?
                        getLevelStyle("Level0") :
                        {
                            dashArray: "15,15",
                            opacity: 0.3
                        };
                    layer.setStyle({
                        dashArray: levelStyle.dashArray,
                        opacity: levelStyle.opacity,
                    });
                }

                const sm = L.marker(start, {
                    icon: startIcon
                });
                const em = L.marker(end, {
                    icon: endIcon
                });

                drawnItemsRef.current.addLayer(sm);
                drawnItemsRef.current.addLayer(em);

                const initialLevel = config.hasProgressLevel ? "Level0" : null;

                // 🔴 TOOLTIP ADD करें
                addLabel(layer, name, km, "", initialLevel, moduleType);

                const associatedLayers = [sm, em];

                const layerId = layer._leaflet_id;
                const record = {
                    type: selectedRoad,
                    label: config.label,
                    name,
                    geometry: {
                        ...normalizeGeometry(config.drawType, rawGeometry),
                        start_end_km: parseFloat(km),
                    },
                    _layerId: layerId,
                    progress: 0,
                    drawType: config.drawType,
                    _groupId: createLayerGroup(layer, associatedLayers),
                    cluster_id: selectedCluster,
                    progressLevel: config.hasProgressLevel ? "Level0" : null,
                    distance_km: parseFloat(km),
                };

                return record;
            }

            /* ----- DEFAULT CIVIL FEATURE ----- */
            drawnItemsRef.current.addLayer(layer);
            const layerId = layer._leaflet_id;

            // 🔴 TOOLTIP ADD करें
            addLabel(layer, name, "", "", null, moduleType);

            const record = {
                type: selectedRoad,
                label: config.label,
                name,
                geometry: normalizeGeometry(config.drawType, rawGeometry),
                _layerId: layerId,
                progress: 0,
                drawType: config.drawType,
                _groupId: createLayerGroup(layer),
                cluster_id: selectedCluster,
                progressLevel: config.hasProgressLevel ? "Level0" : null,
            };

            return record;
        };

        /* ---------- CREATED ---------- */
        const handleCreated = (e) => {
            if (!selectedRoad || !selectedCluster || !roadNames[selectedRoad]) {
                alert(`⚠️ Please select cluster and enter name before drawing`);
                cleanupDrawControls();
                return;
            }

            const layer = e.layer;
            const name = roadNames[selectedRoad] || config.label;

            let record;

            if (moduleType === "electrical") {
                record = createElectricalFeature(layer, name);
            } else {
                record = createCivilFeature(layer, name);
            }

            if (record) {
                setMapData((p) => [...p, record]);

                if (updateRoadProgress && record._layerId) {
                    updateRoadProgress(record._layerId, 0);
                }

            }
        };

        /* ---------- EDITED ---------- */
        const handleEdited = (e) => {
            e.layers.eachLayer((layer) => {
                const layerId = layer._leaflet_id;
                const group = layersGroupRef.current.get(layerId);

                if (group) {
                    setMapData((prev) =>
                        prev.map((item) => {
                            if (item._layerId === layerId) {
                                let updatedGeometry = { ...item.geometry
                                };
                                let updatedRecord = { ...item
                                };

                                if (layer instanceof L.Polyline) {
                                    const latlngs = layer.getLatLngs();
                                    updatedGeometry.coordinates = latlngs.map((latlng) => [
                                        latlng.lat,
                                        latlng.lng,
                                    ]);

                                    // ✅ Recalculate distance for polylines (both civil and electrical)
                                    const km = calculatePolylineDistance(latlngs);
                                    updatedGeometry.start_end_km = parseFloat(km);
                                    updatedRecord.distance_km = parseFloat(km);

                                    // Update start/end points
                                    if (latlngs.length > 0) {
                                        updatedGeometry.start_point = [
                                            latlngs[0].lat,
                                            latlngs[0].lng,
                                        ];
                                        updatedGeometry.end_point = [
                                            latlngs[latlngs.length - 1].lat,
                                            latlngs[latlngs.length - 1].lng,
                                        ];
                                    }

                                    // Update tooltip with new distance
                                    if (layer.getTooltip()) {
                                        layer.unbindTooltip();
                                        addLabel(
                                            layer,
                                            item.name || group.config.label,
                                            km,
                                            item.voltage_level || "",
                                            item.progressLevel,
                                            moduleType,
                                        );
                                    }

                                    // Update START and END markers position (only civil icons)
                                    group.associatedLayers.forEach((associatedLayer) => {
                                        if (
                                            associatedLayer.options ? .icon ? .options ? .className ===
                                            "start-point" ||
                                            associatedLayer.options ? .icon ? .options ? .className ===
                                            "electrical-start-point"
                                        ) {
                                            associatedLayer.setLatLng(latlngs[0]);
                                        }
                                        if (
                                            associatedLayer.options ? .icon ? .options ? .className ===
                                            "end-point" ||
                                            associatedLayer.options ? .icon ? .options ? .className ===
                                            "electrical-end-point"
                                        ) {
                                            associatedLayer.setLatLng(latlngs[latlngs.length - 1]);
                                        }
                                    });
                                } else if (layer instanceof L.Circle) {
                                    const center = layer.getLatLng();
                                    const radius = layer.getRadius();
                                    updatedGeometry.lat = center.lat;
                                    updatedGeometry.lng = center.lng;
                                    updatedGeometry.radius = radius;
                                } else if (layer instanceof L.Marker) {
                                    const latlng = layer.getLatLng();
                                    updatedGeometry.lat = latlng.lat;
                                    updatedGeometry.lng = latlng.lng;
                                }

                                return { ...updatedRecord,
                                    geometry: updatedGeometry
                                };
                            }
                            return item;
                        }),
                    );
                }
            });
        };

        /* ---------- DELETED ---------- */
        const handleDeleted = (e) => {
            e.layers.eachLayer((layer) => {
                removeLayerGroup(layer._leaflet_id);
            });
        };

        // Store event handlers
        eventHandlersRef.current = {
            created: handleCreated,
            edited: handleEdited,
            deleted: handleDeleted,
        };

        // Attach event handlers
        map.on(L.Draw.Event.CREATED, handleCreated);
        map.on(L.Draw.Event.EDITED, handleEdited);
        map.on(L.Draw.Event.DELETED, handleDeleted);

        isInitializedRef.current = true;

        return () => {
            cleanupDrawControls();
            isInitializedRef.current = false;
        };
    }, [
        selectedRoad,
        roadNames,
        selectedCluster,
        inputName,
        setMapData,
        roadProgress,
        moduleType,
    ]);
}