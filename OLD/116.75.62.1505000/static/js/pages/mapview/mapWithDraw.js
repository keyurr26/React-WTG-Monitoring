import React, {
    useEffect,
    useRef,
    useState
} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

import {
    useDrawHandlers
} from "./useDrawHandlers";
import {
    ROAD_CONFIG
} from "./roadConfig";
import {
    ELECTRICAL_CONFIG
} from "./electricalConfig";

function MapWithDraw({
    selectedRoad,
    roadNames,
    setMapData,
    mapData,

    selectedCluster,
    inputName,
    moduleType = "civil",
}) {
    const markerGroupRef = useRef(null);
    const mapRef = useRef(null);
    const drawnItemsRef = useRef(null);
    const drawControlRef = useRef(null);
    const layersGroupRef = useRef(new Map());
    const [searchCoord, setSearchCoord] = useState("");
    const [rightClickCoord, setRightClickCoord] = useState(null);
    const [mapType, setMapType] = useState("street");

    // 🔴 Module के according config select करो
    const getConfig = () => {
        return moduleType === "civil" ? ROAD_CONFIG : ELECTRICAL_CONFIG;
    };

    /* ---------- LEVEL STYLE HELPER ---------- */
    const getLevelStyle = (level) => {
        switch (level) {
            case "Level0":
                return {
                    dashArray: "15,15",
                    opacity: 0.3
                };
            case "Level1":
                return {
                    dashArray: "10,10",
                    opacity: 0.5
                };
            case "Level2":
                return {
                    dashArray: "5,5",
                    opacity: 0.7
                };
            case "Level3":
                return {
                    dashArray: "2,8",
                    opacity: 0.9
                };
            case "Final":
                return {
                    dashArray: null,
                    opacity: 1.0
                };
            default:
                return {
                    dashArray: "15,15",
                    opacity: 0.3
                };
        }
    };

    // Helper function for level colors (for markers/labels only)
    const getLevelColor = (level) => {
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

    /* ---------- UPDATE TOOLTIP FUNCTION ---------- */
    const updateTooltip = (layer, item, config, moduleType) => {
        if (!layer || !layer.bindTooltip) return;

        // पहले existing tooltip को remove करें
        if (layer.getTooltip) {
            layer.unbindTooltip();
        }

        // Tooltip content बनाएं
        let tooltipContent = `<div style="font-weight: bold; font-size: 12px; margin-bottom: 4px;">${item.name || config.label}</div>`;

        const km = item.geometry ? .start_end_km || item.distance_km;

        if (moduleType === "civil") {
            if (km) tooltipContent += `<div style="font-size: 10px; color: #666;">${km} km</div>`;
            if (item.progressLevel) {
                const levelColor = getLevelColor(item.progressLevel);
                tooltipContent += `<div style="font-size: 10px; color: ${levelColor}; font-weight: bold;">${item.progressLevel}</div>`;
            }
        } else {
            if (item.voltage_level) tooltipContent += `<div style="font-size: 10px; color: #666;">${item.voltage_level}</div>`;
            if (km) tooltipContent += `<div style="font-size: 10px; color: #666;">${km} km</div>`;
            if (item.progressLevel) {
                const levelColor = getLevelColor(item.progressLevel);
                tooltipContent += `<div style="font-size: 10px; color: ${levelColor}; font-weight: bold;">${item.progressLevel}</div>`;
            }
        }

        // नया tooltip बनाएं
        layer.bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            offset: L.point(0, -10),
            className: moduleType === 'civil' ? 'road-tooltip' : 'electrical-tooltip',
            opacity: 1
        });

        // Tooltip styling apply करें
        setTimeout(() => {
            const tooltip = layer.getTooltip();
            if (tooltip && tooltip.getElement) {
                const tooltipElement = tooltip.getElement();
                if (tooltipElement) {
                    tooltipElement.style.background = 'white';
                    tooltipElement.style.border = '2px solid #333';
                    tooltipElement.style.borderRadius = '4px';
                    tooltipElement.style.padding = '6px 10px';
                    tooltipElement.style.fontSize = '12px';
                    tooltipElement.style.color = '#333';
                    tooltipElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
                }
            }
        }, 100);
    };

    /* ---------- ELECTRICAL LABEL ICON ---------- */
    const createElectricalLabelIcon = (
        name,
        distance = "",
        voltage = "",
        level = null
    ) => {
        const levelColor = level ?
            {
                Level0: "#9e9e9e",
                Level1: "#f44336",
                Level2: "#ff9800",
                Level3: "#ffeb3b",
                Final: "#4CAF50",
            }[level] :
            "#333";

        return L.divIcon({
            className: "electrical-label",
            html: `
        <div style="
          background: white;
          border: 2px solid ${levelColor};
          border-radius: 4px;
          padding: 4px 8px;
          font-weight: bold;
          font-size: 12px;
          color: #333;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          text-align: center;
          line-height: 1.2;
           display: none; /* 🔴 YEH LINE ADD KAREN */
        ">
          ${name}
          ${
            voltage
              ? `<div style="font-size:10px;color:#666;margin-top:2px;">${voltage}</div>`
              : ""
          }
          ${
            distance
              ? `<div style="font-size:10px;color:#666;margin-top:2px;">${distance} km</div>`
              : ""
          }
          ${
            level
              ? `<div style="font-size:10px;color:${levelColor};font-weight:bold;margin-top:2px;">${level}</div>`
              : ""
          }
        </div>
      `,
            iconSize: [120, 70],
            iconAnchor: [60, 35],
        });
    };

    /* ---------- ROAD LABEL ICON ---------- */
    const createRoadLabelIcon = (name, km, level = null) => {
        const levelColor = getLevelColor(level);
        return L.divIcon({
            className: "road-label",
            html: `
        <div style="
          background: white;
          border: 2px solid ${levelColor || "#333"};
          border-radius: 4px;
          padding: 4px 8px;
          font-weight: bold;
          font-size: 12px;
          color: #333;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
           display: none; /* 🔴 YEH LINE ADD KAREN */
        ">
          ${name}
          ${
            level
              ? `<br/><span style="font-size:10px;color:${levelColor};">${level}</span>`
              : ""
          }
          ${
            km
              ? `<br/><span style="font-size:9px;color:#666;">${km} km</span>`
              : ""
          }
        </div>
      `,
            iconSize: [100, 45],
            iconAnchor: [50, 22],
        });
    };

    /* ---------- SYNC MAP LAYERS WITH DATA CHANGES ---------- */
    useEffect(() => {
        const map = mapRef.current ? .leafletMap;
        if (!map || !drawnItemsRef.current) return;

        const syncMapLayer = (item) => {
            if (!item._layerId || !item.geometry) return;

            const group = layersGroupRef.current.get(item._layerId);
            if (!group) return;

            const {
                mainLayer,
                associatedLayers,
                config
            } = group;
            const geo = item.geometry;

            // ✅ FOR POLYLINES (ELECTRICAL & CIVIL BOTH)
            if (geo.geometry_type === "LineString" && mainLayer.setLatLngs) {
                // Update polyline coordinates if coordinates exist
                if (geo.coordinates && geo.coordinates.length > 0) {
                    const latlngs = geo.coordinates.map(([lat, lng]) => [lat, lng]);
                    mainLayer.setLatLngs(latlngs);

                    // ✅ Apply level style
                    if (item.progressLevel) {
                        const levelStyle = getLevelStyle(item.progressLevel);
                        mainLayer.setStyle({
                            dashArray: levelStyle.dashArray,
                            opacity: levelStyle.opacity,
                        });
                    }

                    // Update start and end markers
                    const start = latlngs[0];
                    const end = latlngs[latlngs.length - 1];

                    // Update START and END markers
                    associatedLayers.forEach((layer) => {
                        if (
                            layer.options ? .icon ? .options ? .className === "start-point" ||
                            layer.options ? .icon ? .options ? .className === "electrical-start-point"
                        ) {
                            layer.setLatLng(start);
                        }
                        if (
                            layer.options ? .icon ? .options ? .className === "end-point" ||
                            layer.options ? .icon ? .options ? .className === "electrical-end-point"
                        ) {
                            layer.setLatLng(end);
                        }
                    });

                    // Recalculate distance using all points
                    const calculatePolylineDistance = (latlngs) => {
                        let totalMeters = 0;
                        for (let i = 1; i < latlngs.length; i++) {
                            totalMeters += map.distance(latlngs[i - 1], latlngs[i]);
                        }
                        return (totalMeters / 1000).toFixed(2);
                    };

                    const km = geo.start_end_km || calculatePolylineDistance(latlngs);

                    // 🔴 UPDATE TOOLTIP
                    updateTooltip(mainLayer, item, config, moduleType);
                }
            }

            // ✅ FOR MARKERS (ELECTRICAL MARKERS)
            else if (geo.geometry_type === "Point" && mainLayer.setLatLng) {
                const newLatLng = L.latLng(geo.lat, geo.lng);
                mainLayer.setLatLng(newLatLng);

                // Update associated layers (labels, etc.)
                associatedLayers.forEach((layer) => {
                    if (layer.setLatLng) {
                        layer.setLatLng(newLatLng);
                    }
                });

                // 🔴 UPDATE TOOLTIP
                updateTooltip(mainLayer, item, config, moduleType);
            }
        };

        // Sync all items in the current data
        mapData.forEach(syncMapLayer);
    }, [mapData, moduleType]);

    /* ---------- MAP INIT ---------- */
    useEffect(() => {
        const map = L.map(mapRef.current).setView(
            [18.51222784981833, 73.87875671520952],
            10
        );

        const markerGroup = new L.FeatureGroup();
        markerGroupRef.current = markerGroup;
        map.addLayer(markerGroup);

        // Initialize the FeatureGroup FIRST - this is correct!
        const drawnItems = new L.FeatureGroup();
        drawnItemsRef.current = drawnItems;
        map.addLayer(drawnItems);

        // Street Map Layer
        const streetLayer = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors",
            }
        );

        // Satellite Layer
        const satelliteLayer = L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                attribution: "© Esri, Maxar, Earthstar Geographics",
            }
        );

        // Add default layer
        streetLayer.addTo(map);
        map.streetLayer = streetLayer;
        map.satelliteLayer = satelliteLayer;
        map.currentLayer = streetLayer;

        // Initialize search marker property
        map.searchMarker = null;

        // Right click to show coordinates
        map.on("contextmenu", (e) => {
            const {
                lat,
                lng
            } = e.latlng;
            setRightClickCoord({
                lat,
                lng
            });

            const marker = L.marker([lat, lng])
                .bindPopup(`Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
                .addTo(map)
                .openPopup();

            setTimeout(() => map.removeLayer(marker), 5000);
        });

        mapRef.current.leafletMap = map;

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, []);

    /* ---------- TOGGLE MAP TYPE ---------- */
    useEffect(() => {
        const map = mapRef.current ? .leafletMap;
        if (!map) return;

        if (mapType === "satellite") {
            map.removeLayer(map.currentLayer);
            map.satelliteLayer.addTo(map);
            map.currentLayer = map.satelliteLayer;
        } else {
            map.removeLayer(map.currentLayer);
            map.streetLayer.addTo(map);
            map.currentLayer = map.streetLayer;
        }
    }, [mapType]);

    /* ---------- HELPER FUNCTIONS ---------- */
    const getMidpoint = (layer) => {
        if (!layer) return null;
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

    /* ---------- SEARCH ---------- */
    const handleSearch = () => {
        if (!searchCoord.trim()) return;
        const map = mapRef.current ? .leafletMap;
        if (!map) return;

        const coords = searchCoord.split(/[, ]+/).map(Number);
        if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
            alert("Invalid format. Use: latitude, longitude");
            return;
        }

        const [lat, lng] = coords;
        map.flyTo([lat, lng], 15);

        if (map.searchMarker) map.removeLayer(map.searchMarker);

        const marker = L.marker([lat, lng])
            .bindPopup(`Searched: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
            .addTo(map)
            .openPopup();

        map.searchMarker = marker;
    };

    /* ---------- DRAW HANDLERS ---------- */
    useDrawHandlers({
        mapRef,
        drawnItemsRef,
        drawControlRef,
        layersGroupRef,
        selectedRoad,
        roadNames,
        setMapData,
        getMidpoint,
        selectedCluster,
        inputName,
        getLevelStyle,
        moduleType,
    });

    return ( <
        div style = {
            {
                display: "flex",
                height: "100vh"
            }
        } > { /* Map */ } <
        div style = {
            {
                flex: 1,
                position: "relative"
            }
        } > { /* Top Controls */ } <
        div style = {
            {
                position: "absolute",
                top: 10,
                left: 60,
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: 10,
            }
        } >
        { /* Map Type Toggle */ } <
        div style = {
            {
                background: "white",
                padding: 10,
                borderRadius: 8,
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                display: "flex",
                gap: 5,
            }
        } >
        <
        button onClick = {
            () => setMapType("street")
        }
        style = {
            {
                padding: "6px 12px",
                background: mapType === "street" ? "#4CAF50" : "#e0e0e0",
                color: mapType === "street" ? "white" : "black",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: mapType === "street" ? "bold" : "normal",
            }
        } >
        Street <
        /button> <
        button onClick = {
            () => setMapType("satellite")
        }
        style = {
            {
                padding: "6px 12px",
                background: mapType === "satellite" ? "#4CAF50" : "#e0e0e0",
                color: mapType === "satellite" ? "white" : "black",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: mapType === "satellite" ? "bold" : "normal",
            }
        } >
        Satellite <
        /button> <
        /div> <
        /div>

        { /* Search Bar */ } <
        div style = {
            {
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                background: "white",
                padding: 10,
                borderRadius: 8,
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                width: 400,
                maxWidth: "90%",
            }
        } >
        <
        div style = {
            {
                display: "flex",
                gap: 8
            }
        } >
        <
        input type = "text"
        placeholder = "Latitude, Longitude (e.g., 28.6139, 77.209)"
        value = {
            searchCoord
        }
        onChange = {
            (e) => setSearchCoord(e.target.value)
        }
        style = {
            {
                flex: 1,
                padding: 8,
                border: "1px solid #ddd",
                borderRadius: 4,
            }
        }
        onKeyPress = {
            (e) => e.key === "Enter" && handleSearch()
        }
        /> <
        button onClick = {
            handleSearch
        }
        style = {
            {
                padding: "8px 16px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 4,
            }
        } >
        Search <
        /button> <
        /div> <
        /div>

        { /* Right-Click Info */ } {
            rightClickCoord && ( <
                div style = {
                    {
                        position: "absolute",
                        bottom: 20,
                        right: 20,
                        zIndex: 1000,
                        background: "white",
                        padding: 15,
                        borderRadius: 8,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }
                } >
                <
                div style = {
                    {
                        marginBottom: 10
                    }
                } >
                <
                strong > Right - Click Coordinates: < /strong> <
                div > Lat: {
                    rightClickCoord.lat.toFixed(6)
                } < /div> <
                div > Lng: {
                    rightClickCoord.lng.toFixed(6)
                } < /div> <
                /div> <
                button onClick = {
                    () => {
                        setSearchCoord(
                            `${rightClickCoord.lat.toFixed(6)}, ${rightClickCoord.lng.toFixed(6)}`
                        );
                        handleSearch();
                        setRightClickCoord(null);
                    }
                }
                style = {
                    {
                        width: "100%",
                        padding: 8,
                        background: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                    }
                } >
                Search This Location <
                /button> <
                /div>
            )
        }

        <
        div ref = {
            mapRef
        }
        style = {
            {
                height: "100%",
                width: "100%"
            }
        }
        /> <
        /div>

        { /* Level Sidebar */ } <
        div style = {
            {
                width: 225,
                padding: 8,
                background: "#f5f5f5",
                borderLeft: "1px solid #ddd",
            }
        } >
        <
        h3 > {
            moduleType === "civil" ? "Road" : "Electrical"
        }
        Levels < /h3> {
            mapData.filter((item) => {
                const config = getConfig()[item.type];
                return config ? .hasProgressLevel;
            }).length === 0 ? ( <
                p style = {
                    {
                        color: "#666",
                        fontStyle: "italic"
                    }
                } >
                No {
                    moduleType === "civil" ? "roads" : "electrical features"
                }
                yet. <
                /p>
            ) : (
                mapData
                .filter((item) => {
                    const config = getConfig()[item.type];
                    return config ? .hasProgressLevel;
                })
                .map((item) => {
                    const group = layersGroupRef.current.get(item._layerId);
                    if (!group) return null;

                    const config = group.config;
                    const levelStyle = getLevelStyle(item.progressLevel);

                    return ( <
                        div key = {
                            item._layerId
                        }
                        style = {
                            {
                                marginBottom: 10,
                                padding: 10,
                                background: "white",
                                borderRadius: 4,
                                border: "1px solid #ddd",
                            }
                        } >
                        <
                        div style = {
                            {
                                fontWeight: "bold",
                                marginBottom: 8,
                                fontSize: "14px",
                            }
                        } >
                        {
                            config.label
                        } {
                            item.name && `: ${item.name}`
                        } <
                        /div>

                        { /* Level Selector */ } <
                        div style = {
                            {
                                marginBottom: "8px"
                            }
                        } >
                        <
                        label style = {
                            {
                                fontSize: "12px",
                                marginBottom: "6px",
                                display: "block",
                                fontWeight: "bold",
                            }
                        } >
                        Progress Level:
                        <
                        /label>

                        { /* Level preview दिखाएं */ } <
                        div style = {
                            {
                                height: "4px",
                                background: config.color,
                                marginBottom: "8px",
                                opacity: levelStyle.opacity,
                                border: levelStyle.dashArray ?
                                    `dashed ${config.color}` :
                                    `solid ${config.color}`,
                                borderWidth: "0 0 4px 0",
                                borderStyle: levelStyle.dashArray ? "dashed" : "solid",
                                borderColor: config.color,
                            }
                        } >
                        < /div>

                        <
                        select value = {
                            item.progressLevel || ""
                        }
                        onChange = {
                            (e) => {
                                const newLevel = e.target.value;
                                const newData = mapData.map((mapItem) =>
                                    mapItem._layerId === item._layerId ?
                                    { ...mapItem,
                                        progressLevel: newLevel
                                    } :
                                    mapItem
                                );
                                setMapData(newData);
                            }
                        }
                        style = {
                            {
                                width: "100%",
                                padding: "8px",
                                fontSize: "14px",
                                border: `2px solid ${config.color}`,
                                borderRadius: "4px",
                                backgroundColor: "#f9f9f9",
                                cursor: "pointer",
                            }
                        } >
                        <
                        option value = "" > --Select Level-- < /option> <
                        option value = "Level0" > Level 0(Most Dashed) < /option> <
                        option value = "Level1" > Level 1(Dashed) < /option> <
                        option value = "Level2" > Level 2(Medium) < /option> <
                        option value = "Level3" > Level 3(Less Dashed) < /option> <
                        option value = "Final" > Final(Solid Line) < /option> <
                        /select>

                        { /* Show current level if selected */ } {
                            item.progressLevel && ( <
                                div style = {
                                    {
                                        marginTop: "8px",
                                        padding: "8px",
                                        background: getLevelColor(item.progressLevel),
                                        borderRadius: "4px",
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        color: "white",
                                        textAlign: "center",
                                        textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                                    }
                                } >
                                Current Level: {
                                    item.progressLevel
                                } <
                                /div>
                            )
                        } <
                        /div> <
                        /div>
                    );
                })
            )
        } <
        /div> <
        /div>
    );
}

export default MapWithDraw;