import React, {
    useState
} from "react";
import L from "leaflet";

import {
    useDispatch
} from "react-redux";



import {
    createMapObject,
    createMapCoordinates
} from "../../Redux/InstallationData/plannedmapData/mapActions";

function DataTable({
    data,
    setMapData,
    onClose
}) {
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();



    const buildMapObjectPayload = (item) => {
        return {
            cluster_id: Number(item.cluster_id),
            type: item.type,
            label: item.label,
            name: item.name,
            progress_level: item.progressLevel || null,
            draw_type: item.drawType,
            geometry_type: item.geometry.geometry_type,
            layer_id: String(item._layerId),
            group_id: item._groupId,

            start_lat: item.geometry.start_point ?
                item.geometry.start_point[0] :
                item.geometry.lat || null,

            start_lng: item.geometry.start_point ?
                item.geometry.start_point[1] :
                item.geometry.lng || null,

            end_lat: item.geometry.end_point ?
                item.geometry.end_point[0] :
                item.geometry.lat || null,

            end_lng: item.geometry.end_point ?
                item.geometry.end_point[1] :
                item.geometry.lng || null,

            distance_km: item.geometry.start_end_km || 0
        }
    }




    const postCoordinates = async (mapObjectId, item) => {
        // 🟢 POLYLINE → multiple points

        if (item.drawType === "polyline") {
            for (let i = 0; i < item.geometry.coordinates.length; i++) {
                const [lat, lng] = item.geometry.coordinates[i];

                await dispatch(
                    createMapCoordinates({
                        map_object: mapObjectId,
                        latitude: lat,
                        longitude: lng,
                        sequence: i + 1,
                        point_label: i === 0 ?
                            "start" :
                            i === item.geometry.coordinates.length - 1 ?
                            "end" :
                            null,
                    })
                );


            }
        }

        // marker/circle/turbine -> singlepoint
        else {
            await dispatch(
                createMapCoordinates({
                    map_object: mapObjectId,
                    latitude: item.geometry.lat,
                    longitude: item.geometry.lng,
                    sequence: 1,
                })
            );
        }

    };




    const handleSubmit = async () => {
        if (data.length === 0) {
            alert("⚠️ No data to submit!");
            return;
        }

        setLoading(true); // 🔥 start loader

        try {
            for (const item of data) {
                const payload = buildMapObjectPayload(item);

                const res = await dispatch(createMapObject(payload));

                if (!res.success) {
                    throw new Error("MapObject create failed");
                }

                const mapObjectId = res.data.id;

                await postCoordinates(mapObjectId, item);
            }

            alert(`✅ ${data.length} item(s) saved successfully!`);
            setMapData([]); // reset table

        } catch (error) {
            alert("❌ Error saving map data");
        } finally {
            setLoading(false); // 🔥 stop loader (success + error dono me)

        }
    };

    // ================= DELETE FUNCTION =================
    const handleDeleteRow = (rowIndex) => {
        const itemToDelete = data[rowIndex];

        // Show confirmation dialog
        if (window.confirm(`Are you sure you want to delete "${itemToDelete.name || 'item'}"?`)) {
            setMapData((prev) => {
                const updated = [...prev];
                updated.splice(rowIndex, 1);
                return updated;
            });
        }
    };

    // ================= DELETE ALL FUNCTION =================
    const handleDeleteAll = () => {
        if (data.length === 0) {
            alert("⚠️ No data to delete!");
            return;
        }

        if (window.confirm(`Are you sure you want to delete all ${data.length} items?`)) {
            setMapData([]);
        }
    };




    // Input field की width बढ़ाने के लिए
    const wideInputStyle = {
        width: "150px", // पहले 70px था, अब 140px
        padding: "6px 8px",
        fontSize: "12px",
        border: "1px solid #ccc",
        borderRadius: "3px",
        boxSizing: "border-box",
        margin: "2px",
    };


    const coordInputStyle = {
        width: "150px", // पहले 70px/80px था
        padding: "6px 8px",
        fontSize: "12px",
        border: "1px solid #ccc",
        borderRadius: "3px",
        boxSizing: "border-box",
        margin: "2px",
    };


    const handleCoordinateChange = (rowIndex, pointIndex, coordIndex, value) => {
        setMapData((prev) => {
            const updated = [...prev];
            const item = updated[rowIndex];
            const geo = { ...item.geometry
            };

            if (
                geo.geometry_type === "LineString" &&
                geo.coordinates ? .length > pointIndex
            ) {
                const coords = geo.coordinates.map((p) => [...p]);
                coords[pointIndex][coordIndex] = parseFloat(value) || 0;
                geo.coordinates = coords;


                if (pointIndex === 0) {
                    geo.start_point = [coords[0][0], coords[0][1]];
                }
                if (pointIndex === coords.length - 1) {
                    geo.end_point = [
                        coords[coords.length - 1][0],
                        coords[coords.length - 1][1],
                    ];
                }


                let totalMeters = 0;
                for (let i = 1; i < coords.length; i++) {
                    const point1 = coords[i - 1];
                    const point2 = coords[i];
                    totalMeters += L.latLng(point1[0], point1[1]).distanceTo(
                        L.latLng(point2[0], point2[1])
                    );
                }
                geo.start_end_km = +(totalMeters / 1000).toFixed(2);
            } else if (geo.geometry_type === "Point") {
                if (coordIndex === 0) geo.lat = parseFloat(value) || 0;
                if (coordIndex === 1) geo.lng = parseFloat(value) || 0;
                geo.start_point = [geo.lat, geo.lng];
                geo.end_point = [geo.lat, geo.lng];
                geo.start_end_km = 0;
            } else if (geo.geometry_type === "Circle") {
                if (coordIndex === 0) geo.lat = parseFloat(value) || 0;
                if (coordIndex === 1) geo.lng = parseFloat(value) || 0;
                geo.start_point = [geo.lat, geo.lng];
                geo.end_point = [geo.lat, geo.lng];
                geo.start_end_km = 0;
            }

            updated[rowIndex] = { ...item,
                geometry: geo
            };
            return updated;
        });
    };


    const handleGeoChange = (rowIndex, field, value, coordIndex) => {
        setMapData((prev) => {
            const updated = [...prev];
            const item = updated[rowIndex];
            const geo = { ...item.geometry
            };
            let shouldRecalculateDistance = false;

            if (geo.geometry_type === "LineString" && geo.coordinates ? .length >= 2) {
                const coords = geo.coordinates.map((p) => [...p]);

                if (field === "start_point") {
                    coords[0][coordIndex] = parseFloat(value) || 0;
                    shouldRecalculateDistance = true;
                }

                if (field === "end_point") {
                    coords[coords.length - 1][coordIndex] = parseFloat(value) || 0;
                    shouldRecalculateDistance = true;
                }

                geo.coordinates = coords;

                if (field === "start_point") {
                    geo.start_point = [coords[0][0], coords[0][1]];
                }
                if (field === "end_point") {
                    geo.end_point = [
                        coords[coords.length - 1][0],
                        coords[coords.length - 1][1],
                    ];
                }

                if (shouldRecalculateDistance && coords.length >= 2) {
                    let totalMeters = 0;


                    for (let i = 1; i < coords.length; i++) {
                        const point1 = coords[i - 1];
                        const point2 = coords[i];
                        totalMeters += L.latLng(point1[0], point1[1]).distanceTo(
                            L.latLng(point2[0], point2[1])
                        );
                    }

                    geo.start_end_km = +(totalMeters / 1000).toFixed(2);
                }
            }

            updated[rowIndex] = {
                ...item,
                geometry: geo,
            };

            return updated;
        });
    };


    const renderEditableCoordinates = (geometry, rowIndex) => {
        if (!geometry) return "-";

        if (geometry.geometry_type === "Point") {
            return ( <
                div style = {
                    {
                        display: "flex",
                        gap: "8px"
                    }
                } >
                <
                input type = "number"
                step = "0.0001"
                value = {
                    geometry.lat || 0
                }
                style = {
                    coordInputStyle
                }
                onChange = {
                    (e) =>
                    handleCoordinateChange(rowIndex, 0, 0, e.target.value)
                }
                placeholder = "Latitude" /
                >
                <
                input type = "number"
                step = "0.0001"
                value = {
                    geometry.lng || 0
                }
                style = {
                    coordInputStyle
                }
                onChange = {
                    (e) =>
                    handleCoordinateChange(rowIndex, 0, 1, e.target.value)
                }
                placeholder = "Longitude" /
                >
                <
                /div>
            );
        }

        if (geometry.geometry_type === "LineString") {
            return ( <
                div style = {
                    {
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        minWidth: "300px",
                    }
                } >
                {
                    geometry.coordinates ? .map((coord, pointIndex) => ( <
                        div key = {
                            pointIndex
                        }
                        style = {
                            {
                                display: "flex",
                                gap: "8px",
                                alignItems: "center"
                            }
                        } >
                        <
                        span style = {
                            {
                                fontSize: "11px",
                                color: "#666",
                                minWidth: "40px",
                                fontWeight: "bold",
                            }
                        } >
                        {
                            pointIndex === 0 ?
                            "Start" :
                                pointIndex === geometry.coordinates.length - 1 ?
                                "End" :
                                `Pt ${pointIndex}`
                        }:
                        <
                        /span> <
                        input type = "number"
                        step = "0.0001"
                        value = {
                            coord[0]
                        }
                        style = {
                            coordInputStyle
                        }
                        onChange = {
                            (e) =>
                            handleCoordinateChange(
                                rowIndex,
                                pointIndex,
                                0,
                                e.target.value
                            )
                        }
                        placeholder = "Lat" /
                        >
                        <
                        input type = "number"
                        step = "0.0001"
                        value = {
                            coord[1]
                        }
                        style = {
                            coordInputStyle
                        }
                        onChange = {
                            (e) =>
                            handleCoordinateChange(
                                rowIndex,
                                pointIndex,
                                1,
                                e.target.value
                            )
                        }
                        placeholder = "Lng" /
                        >
                        <
                        /div>
                    ))
                } <
                /div>
            );
        }

        if (geometry.geometry_type === "Circle") {
            return ( <
                div style = {
                    {
                        display: "flex",
                        gap: "8px"
                    }
                } >
                <
                input type = "number"
                step = "0.0001"
                value = {
                    geometry.lat || 0
                }
                style = {
                    coordInputStyle
                }
                onChange = {
                    (e) =>
                    handleCoordinateChange(rowIndex, 0, 0, e.target.value)
                }
                placeholder = "Center Lat" /
                >
                <
                input type = "number"
                step = "0.0001"
                value = {
                    geometry.lng || 0
                }
                style = {
                    coordInputStyle
                }
                onChange = {
                    (e) =>
                    handleCoordinateChange(rowIndex, 0, 1, e.target.value)
                }
                placeholder = "Center Lng" /
                >
                <
                /div>
            );
        }

        return "-";
    };



    return ( <
        >
        <
        div style = {
            {
                overflow: "auto",
                width: "100%",
                maxWidth: "100vw",
                maxHeight: "calc(100vh - 200px)",
                position: "relative"
            }
        } >
        <
        table border = "1"
        cellPadding = "8"
        cellSpacing = "0"
        style = {
            {
                width: "100%",
                marginTop: "12px",
                fontSize: "13px",
                tableLayout: "auto",
                minWidth: "1100px",
                borderCollapse: "collapse"
            }
        } >
        <
        thead style = {
            {
                background: "#f5f5f5",
                position: "sticky",
                top: 0,
                zIndex: 10,
                boxShadow: "0 2px 2px -1px rgba(0,0,0,0.1)"
            }
        } >
        <
        tr >
        <
        th style = {
            {
                minWidth: "40px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > # < /th> <
        th style = {
            {
                minWidth: "50px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Actions < /th> {/ * NEW * /} <
        th style = {
            {
                minWidth: "90px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Cluster Id < /th> <
        th style = {
            {
                minWidth: "60px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Type < /th> <
        th style = {
            {
                minWidth: "80px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Label < /th> <
        th style = {
            {
                minWidth: "100px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Name < /th> <
        th style = {
            {
                minWidth: "110px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Progress Level < /th> <
        th style = {
            {
                minWidth: "90px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Draw Type < /th> <
        th style = {
            {
                minWidth: "110px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Geometry Type < /th> <
        th style = {
            {
                minWidth: "80px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Layer ID < /th> <
        th style = {
            {
                minWidth: "80px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Group ID < /th> <
        th style = {
            {
                minWidth: "150px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Start Point < /th> <
        th style = {
            {
                minWidth: "150px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > End Point < /th> <
        th style = {
            {
                minWidth: "120px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Distance(km) < /th> <
        th style = {
            {
                minWidth: "350px",
                whiteSpace: "nowrap",
                background: "#f5f5f5"
            }
        } > Coordinates < /th> <
        /tr> <
        /thead>

        <
        tbody > {
            data.length === 0 && ( <
                tr >
                <
                td colSpan = "14"
                align = "center" >
                No Data Available <
                /td> <
                /tr>
            )
        }

        {
            data.map((item, index) => {
                const geo = item.geometry;

                return ( <
                    tr key = {
                        index
                    } >
                    <
                    td style = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        index + 1
                    } < /td> <
                    td style = {
                        {
                            whiteSpace: "nowrap",
                            textAlign: "center"
                        }
                    } >
                    <
                    button onClick = {
                        () => handleDeleteRow(index)
                    }
                    style = {
                        {
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "4px 10px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold",
                            transition: "background-color 0.2s",
                        }
                    }
                    onMouseEnter = {
                        (e) => {
                            e.target.style.backgroundColor = "#c82333";
                        }
                    }
                    onMouseLeave = {
                        (e) => {
                            e.target.style.backgroundColor = "#dc3545";
                        }
                    }
                    title = "Delete this row" >
                    ✕
                    <
                    /button> <
                    /td>

                    <
                    td style = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.cluster_id
                    } < /td> <
                    td style = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.type || "-"
                    } < /td> <
                    td style = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.label || "-"
                    } < /td> <
                    td style = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.name || "-"
                    } < /td> <
                    td style = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.progressLevel
                    } < /td> <
                    td style = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.drawType || "-"
                    } < /td> <
                    td style = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        geo ? .geometry_type || "-"
                    } < /td> <
                    td style = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item._layerId ? item._layerId.toString() : "-"
                    } < /td> <
                    td style = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item._groupId || "-"
                    } < /td>

                    <
                    td > {
                        geo ? .start_point ? ( <
                            div style = {
                                {
                                    display: "flex",
                                    gap: "2px",
                                    alignItems: "center",
                                    minWidth: "140px"
                                }
                            } >
                            <
                            input type = "number"
                            step = "0.0001"
                            value = {
                                geo.start_point[0]
                            }
                            style = {
                                {
                                    ...wideInputStyle,
                                    width: "65px",
                                    minWidth: "65px"
                                }
                            }
                            onChange = {
                                (e) =>
                                handleGeoChange(
                                    index,
                                    "start_point",
                                    e.target.value,
                                    0
                                )
                            }
                            placeholder = "Start Lat" /
                            >
                            <
                            span style = {
                                {
                                    fontSize: "12px"
                                }
                            } > , < /span> <
                            input type = "number"
                            step = "0.0001"
                            value = {
                                geo.start_point[1]
                            }
                            style = {
                                {
                                    ...wideInputStyle,
                                    width: "65px",
                                    minWidth: "65px"
                                }
                            }
                            onChange = {
                                (e) =>
                                handleGeoChange(
                                    index,
                                    "start_point",
                                    e.target.value,
                                    1
                                )
                            }
                            placeholder = "Start Lng" /
                            >
                            <
                            /div>
                        ) : (
                            "-"
                        )
                    } <
                    /td>

                    <
                    td > {
                        geo ? .end_point ? ( <
                            div style = {
                                {
                                    display: "flex",
                                    gap: "2px",
                                    alignItems: "center",
                                    minWidth: "140px"
                                }
                            } >
                            <
                            input type = "number"
                            step = "0.0001"
                            value = {
                                geo.end_point[0]
                            }
                            style = {
                                {
                                    ...wideInputStyle,
                                    width: "65px",
                                    minWidth: "65px"
                                }
                            }
                            onChange = {
                                (e) =>
                                handleGeoChange(
                                    index,
                                    "end_point",
                                    e.target.value,
                                    0
                                )
                            }
                            placeholder = "End Lat" /
                            >
                            <
                            span style = {
                                {
                                    fontSize: "12px"
                                }
                            } > , < /span> <
                            input type = "number"
                            step = "0.0001"
                            value = {
                                geo.end_point[1]
                            }
                            style = {
                                {
                                    ...wideInputStyle,
                                    width: "65px",
                                    minWidth: "65px"
                                }
                            }
                            onChange = {
                                (e) =>
                                handleGeoChange(
                                    index,
                                    "end_point",
                                    e.target.value,
                                    1
                                )
                            }
                            placeholder = "End Lng" /
                            >
                            <
                            /div>
                        ) : (
                            "-"
                        )
                    } <
                    /td>

                    <
                    td style = {
                        {
                            fontWeight: "bold",
                            color: "#0a7",
                            whiteSpace: "nowrap"
                        }
                    } > {
                        geo ? .start_end_km !== undefined &&
                        geo.start_end_km !== null ?
                        `${geo.start_end_km} km` :
                        item.start_to_end_km !== undefined &&
                        item.start_to_end_km !== null ?
                        `${item.start_to_end_km} km` :
                        "0 km"
                    } <
                    /td>

                    { /* Coordinates field - Now fully editable */ } <
                    td style = {
                        {
                            fontSize: "12px",
                            minWidth: "350px"
                        }
                    } > {
                        renderEditableCoordinates(geo, index)
                    } <
                    /td> <
                    /tr>
                );
            })
        } <
        /tbody> <
        /table> <
        /div>

        { /* SIMPLE BUTTON */ } <
        div style = {
            {
                textAlign: "center",
                margin: "20px 0",
                position: "sticky",
                bottom: 0,
                background: "#fff",
                padding: "10px 0",
                zIndex: 10,
                borderTop: "1px solid #e0e0e0",
            }
        } >
        <
        div style = {
            {
                display: "flex",
                justifyContent: "center",
                gap: "12px",
            }
        } >
        <
        button onClick = {
            handleDeleteAll
        }
        disabled = {
            data.length === 0
        }
        style = {
            {
                backgroundColor: data.length === 0 ? "#ccc" : "#dc3545",
                color: "#fff",
                border: "none",
                padding: "10px 30px",
                fontSize: "15px",
                borderRadius: "5px",
                cursor: data.length === 0 ? "not-allowed" : "pointer",
                fontWeight: "500",
                transition: "background-color 0.2s",
            }
        }
        onMouseEnter = {
            (e) => {
                if (data.length > 0) {
                    e.target.style.backgroundColor = "#c82333";
                }
            }
        }
        onMouseLeave = {
            (e) => {
                if (data.length > 0) {
                    e.target.style.backgroundColor = "#dc3545";
                }
            }
        } >
        🗑Delete All({
            data.length
        }) <
        /button>

        <
        button onClick = {
            onClose
        }
        style = {
            {
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                padding: "10px 30px",
                fontSize: "15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "500",
            }
        } >
        Close <
        /button>

        <
        button onClick = {
            handleSubmit
        }
        disabled = {
            loading
        }
        style = {
            {
                backgroundColor: loading ? "#999" : "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px 30px",
                fontSize: "15px",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
            }
        } >
        {
            loading ? ( <
                >
                <
                span style = {
                    {
                        width: "16px",
                        height: "16px",
                        border: "2px solid white",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }
                }
                />
                Saving...
                <
                />
            ) : (
                "Submit"
            )
        } <
        /button> <
        /div> <
        /div>

        { /* Add this style for the spin animation if not already present */ } <
        style > {
            `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
        } < /style> <
        />
    );
}
export default DataTable;