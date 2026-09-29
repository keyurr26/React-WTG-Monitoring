// // ElectricalDataTable.js
// import React,{useState} from "react";
// import axios from "axios";

// function ElectricalDataTable({ data, setMapData }) {

//   const [localData,setLocalData] = useState(data)


//     // Handle changes to electrical specific fields

//       // Handle changes to electrical specific fields
//   const handleFieldChange = (index, field, value) => {
//     const updated = [...localData];
//     updated[index] = { ...updated[index], [field]: value };
//     setLocalData(updated);
//     setMapData(updated); // Also update parent state
//   };


//    // Handle coordinate changes
//   const handleCoordinateChange = (rowIndex, pointIndex, coordIndex, value) => {
//     const updated = [...localData];
//     const item = updated[rowIndex];
//     const geo = { ...item.geometry };

//     if (geo.geometry_type === "LineString" && geo.coordinates?.length > pointIndex) {
//       const coords = geo.coordinates.map(p => [...p]);
//       coords[pointIndex][coordIndex] = parseFloat(value) || 0;
//       geo.coordinates = coords;

//       // Update start/end points
//       if (pointIndex === 0) {
//         geo.start_point = [coords[0][0], coords[0][1]];
//       }
//       if (pointIndex === coords.length - 1) {
//         geo.end_point = [coords[coords.length - 1][0], coords[coords.length - 1][1]];
//       }
//     }
//     else if (geo.geometry_type === "Point") {
//       if (coordIndex === 0) geo.lat = parseFloat(value) || 0;
//       if (coordIndex === 1) geo.lng = parseFloat(value) || 0;
//       geo.start_point = [geo.lat, geo.lng];
//       geo.end_point = [geo.lat, geo.lng];
//     }

//     updated[rowIndex] = { ...item, geometry: geo };
//     setLocalData(updated);
//     setMapData(updated);
//   };


//   // 🔴 Electrical के लिए API payload
//   const buildElectricalPayload = (item) => {
//     return {
//       cluster_id: Number(item.cluster_id),
//       type: item.type,
//       label: item.label,
//       name: item.name,
//       progress_level: item.progressLevel || null,
//       draw_type: item.drawType,
//       geometry_type: item.geometry.geometry_type,
//       layer_id: String(item._layerId),
//       group_id: item._groupId,
//       module: "electrical", // 🔴 Module identifier

//       start_lat: item.geometry.start_point
//         ? item.geometry.start_point[0]
//         : item.geometry.lat || null,

//       start_lng: item.geometry.start_point
//         ? item.geometry.start_point[1]
//         : item.geometry.lng || null,

//       end_lat: item.geometry.end_point
//         ? item.geometry.end_point[0]
//         : item.geometry.lat || null,

//       end_lng: item.geometry.end_point
//         ? item.geometry.end_point[1]
//         : item.geometry.lng || null,

//       distance_km: item.geometry.start_end_km || 0,
//       voltage_level: item.voltage_level || null, // 🔴 Electrical specific
//       capacity_mw: item.capacity_mw || null, // 🔴 Electrical specific
//        status: item.status || "planned"
//     };
//   };

//   const postElectricalCoordinates = async (electricalId, item) => {
//   // 🔴 YOUR ELECTRICAL COORDINATES API ENDPOINT HERE
//   const ELECTRICAL_COORDINATES_URL = "YOUR_ELECTRICAL_COORDINATES_API_URL";

//     if (item.drawType === "polyline") {
//       for (let i = 0; i < item.geometry.coordinates.length; i++) {
//         const [lat, lng] = item.geometry.coordinates[i];

//         await axios.post(`ELECTRICAL_COORDINATES_URL`, {
//           electrical_object: electricalId,
//           latitude: lat,
//           longitude: lng,
//           sequence: i + 1,
//           point_label:
//             i === 0
//               ? "start"
//               : i === item.geometry.coordinates.length - 1
//               ? "end"
//               : null
//         });
//       }
//     } else {
//       await axios.post(`ELECTRICAL_COORDINATES_URL`, {
//         electrical_object: electricalId,
//         latitude: item.geometry.lat,
//         longitude: item.geometry.lng,
//         sequence: 1
//       });
//     }
//   };

//   const handleElectricalSubmit = async () => {
//     if (data.length === 0) {
//       alert("⚠️ No electrical data to submit!");
//       return;
//     }

//     try {
//       for (const item of data) {
//         // 1️⃣ Electrical Object POST
//         const electricalPayload = buildElectricalPayload(item);
//                 // 🔴 YOUR ELECTRICAL OBJECT API ENDPOINT HERE
//                    const ELECTRICAL_OBJECT_URL = "YOUR_ELECTRICAL_OBJECT_API_URL";
//         const electricalRes = await axios.post(
//           `ELECTRICAL_OBJECT_URL`,
//           electricalPayload
//         );

//         const electricalId = electricalRes.data.id;

//         // 2️⃣ Electrical Coordinates POST
//         await postElectricalCoordinates(electricalId, item);
//       }

//       alert(`✅ ${localData.length} electrical item(s) saved successfully!`);
//       setMapData([]); // Clear electrical data
//        setLocalData([]);
//     } catch (error) {
//       alert("❌ Error saving electrical data: " + error.message);
//     }
//   };

//   // Render coordinates input

//   const renderCoordinates = (geometry, rowIndex) => {
//     if (!geometry) return "-";

//     const inputStyle = {
//       width: "100px",
//       padding: "4px",
//       fontSize: "12px",
//       border: "1px solid #ccc",
//       borderRadius: "3px",
//       margin: "2px"
//     };

//     if (geometry.geometry_type === "Point") {
//       return (
//         <div style={{ display: "flex", gap: "5px" }}>
//           <input
//             type="number"
//             step="0.000001"
//             value={geometry.lat || ""}
//             style={inputStyle}
//             onChange={(e) => handleCoordinateChange(rowIndex, 0, 0, e.target.value)}
//             placeholder="Lat"
//           />
//           <input
//             type="number"
//             step="0.000001"
//             value={geometry.lng || ""}
//             style={inputStyle}
//             onChange={(e) => handleCoordinateChange(rowIndex, 0, 1, e.target.value)}
//             placeholder="Lng"
//           />
//         </div>
//       );
//     }

//     if (geometry.geometry_type === "LineString") {
//       return (
//         <div style={{ fontSize: "11px", color: "#666" }}>
//           {geometry.coordinates?.length || 0} points
//           <div style={{ marginTop: "5px" }}>
//             {geometry.coordinates?.slice(0, 2).map((coord, idx) => (
//               <div key={idx} style={{ display: "flex", gap: "5px", marginBottom: "3px" }}>
//                 <input
//                   type="number"
//                   step="0.000001"
//                   value={coord[0]}
//                   style={inputStyle}
//                   onChange={(e) => handleCoordinateChange(rowIndex, idx, 0, e.target.value)}
//                 />
//                 <input
//                   type="number"
//                   step="0.000001"
//                   value={coord[1]}
//                   style={inputStyle}
//                   onChange={(e) => handleCoordinateChange(rowIndex, idx, 1, e.target.value)}
//                 />
//               </div>
//             ))}
//             {geometry.coordinates?.length > 2 && (
//               <span style={{ fontSize: "10px", color: "#999" }}>
//                 + {geometry.coordinates.length - 2} more points
//               </span>
//             )}
//           </div>
//         </div>
//       );
//     }

//     return JSON.stringify(geometry).substring(0, 50) + "...";
//   };



//   return (
//     <>
//       <div style={{ overflowX: "auto", width: "100%" }}>
//         <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", fontSize: "13px" }}>
//           <thead style={{ background: "#f5f5f5" }}>
//             <tr>
//               <th>#</th>
//  <th>Cluster ID</th>
//               <th>Type</th>
//               <th>Label</th>
//               <th>Name</th>
//               <th>Progress Level</th>
//               <th>Draw Type</th>
//               <th>Voltage Level</th>
//               <th>Capacity (MW)</th>
//               <th>Status</th>
//               <th>Coordinates</th>
//             </tr>
//           </thead>
//           <tbody>
//             {localData.length === 0 ? (
//               <tr>
//                 <td colSpan="11" align="center" style={{ padding: "20px" }}>
//                   No Electrical Data Available
//                 </td>
//               </tr>
//             ) : (
//               localData.map((item, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{item.cluster_id}</td>
//                   <td>{item.type}</td>
//                   <td>{item.label}</td>
//                   <td>
//                     <input
//                       type="text"
//                       value={item.name || ""}
//                       onChange={(e) => handleFieldChange(index, "name", e.target.value)}
//                       style={{ width: "120px", padding: "4px" }}
//                     />
//                   </td>
//                   <td>{item.progressLevel || "-"}</td>
//                   <td>{item.drawType}</td>
//                   <td>
//                     <select
//                       value={item.voltage_level || ""}
//                       onChange={(e) => handleFieldChange(index, "voltage_level", e.target.value)}
//                       style={{ width: "100px", padding: "4px" }}
//                     >
//                       <option value="">Select</option>
//                       <option value="11kV">11kV</option>
//                       <option value="33kV">33kV</option>
//                       <option value="66kV">66kV</option>
//                       <option value="132kV">132kV</option>
//                       <option value="220kV">220kV</option>
//                       <option value="400kV">400kV</option>
//                     </select>
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       step="0.1"
//                       value={item.capacity_mw || ""}
//                       onChange={(e) => handleFieldChange(index, "capacity_mw", e.target.value)}
//                       style={{ width: "80px", padding: "4px" }}
//                       placeholder="MW"
//                     />
//                   </td>
//                   <td>
//                     <select
//                       value={item.status || "planned"}
//                       onChange={(e) => handleFieldChange(index, "status", e.target.value)}
//                       style={{ width: "100px", padding: "4px" }}
//                     >
//                       <option value="planned">Planned</option>
//                       <option value="under_construction">Under Construction</option>
//                       <option value="completed">Completed</option>
//                       <option value="operational">Operational</option>
//                     </select>
//                   </td>
//                   <td>
//                     {renderCoordinates(item.geometry, index)}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {localData.length > 0 && (
//         <div style={{ textAlign: "center", margin: "20px 0" }}>
//           <button
//             onClick={handleElectricalSubmit}
//             style={{
//               backgroundColor: "#9C27B0",
//               color: "white",
//               border: "none",
//               padding: "12px 40px",
//               fontSize: "16px",
//               borderRadius: "6px",
//               cursor: "pointer",
//               fontWeight: "bold",
//               transition: "background-color 0.3s"
//             }}
//             onMouseEnter={(e) => e.target.style.backgroundColor = "#7B1FA2"}
//             onMouseLeave={(e) => e.target.style.backgroundColor = "#9C27B0"}
//           >
//             Submit Electrical Data
//           </button>

//           <button
//             onClick={() => {
//               setMapData([]);
//               setLocalData([]);
//             }}
//             style={{
//               backgroundColor: "#f44336",
//               color: "white",
//               border: "none",
//               padding: "12px 30px",
//               fontSize: "16px",
//               borderRadius: "6px",
//               cursor: "pointer",
//               fontWeight: "bold",
//               marginLeft: "15px",
//               transition: "background-color 0.3s"
//             }}
//             onMouseEnter={(e) => e.target.style.backgroundColor = "#d32f2f"}
//             onMouseLeave={(e) => e.target.style.backgroundColor = "#f44336"}
//           >
//             Clear All Data
//           </button>
//         </div>
//       )}
//     </>
//   );
// }

// export default ElectricalDataTable;









// ElectricalDataTable.js
import React, {
    useState,
    useEffect
} from "react";
import L from "leaflet";
import axios from "axios";

function ElectricalDataTable({
    data,
    setMapData
}) {

    const [localData, setLocalData] = useState(data);


    // ✅ Sync with parent data changes
    useEffect(() => {
        setLocalData(data);
    }, [data]);

    // ✅ Handle changes to electrical specific fields
    const handleFieldChange = (index, field, value) => {
        const updated = [...localData];
        updated[index] = { ...updated[index],
            [field]: value
        };
        setLocalData(updated);
        setMapData(updated);
    };

    // ✅ Handle progress level change
    const handleProgressLevelChange = (index, value) => {
        const updated = [...localData];
        updated[index] = { ...updated[index],
            progressLevel: value
        };
        setLocalData(updated);
        setMapData(updated);
    };

    // ✅ Handle coordinate changes (civil ki tarah)
    const handleCoordinateChange = (rowIndex, pointIndex, coordIndex, value) => {
        const updated = [...localData];
        const item = updated[rowIndex];
        const geo = { ...item.geometry
        };

        if (geo.geometry_type === "LineString" && geo.coordinates ? .length > pointIndex) {
            const coords = geo.coordinates.map(p => [...p]);
            coords[pointIndex][coordIndex] = parseFloat(value) || 0;
            geo.coordinates = coords;

            // Update start/end points
            if (pointIndex === 0) {
                geo.start_point = [coords[0][0], coords[0][1]];
            }
            if (pointIndex === coords.length - 1) {
                geo.end_point = [coords[coords.length - 1][0], coords[coords.length - 1][1]];
            }

            // ✅ Recalculate distance for polyline (civil ki tarah)
            if (coords.length >= 2) {
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
        setLocalData(updated);
        setMapData(updated);
    };

    // ✅ Handle start/end point changes (civil ki tarah)
    const handleGeoChange = (rowIndex, field, value, coordIndex) => {
        const updated = [...localData];
        const item = updated[rowIndex];
        const geo = { ...item.geometry
        };
        let shouldRecalculateDistance = false;

        if (geo.geometry_type === "LineString" && geo.coordinates ? .length >= 2) {
            const coords = geo.coordinates.map(p => [...p]);

            if (field === "start_point") {
                coords[0][coordIndex] = parseFloat(value) || 0;
                shouldRecalculateDistance = true;
            }

            if (field === "end_point") {
                coords[coords.length - 1][coordIndex] = parseFloat(value) || 0;
                shouldRecalculateDistance = true;
            }

            geo.coordinates = coords;

            // Update start/end points in geometry
            if (field === "start_point") {
                geo.start_point = [coords[0][0], coords[0][1]];
            }
            if (field === "end_point") {
                geo.end_point = [coords[coords.length - 1][0], coords[coords.length - 1][1]];
            }

            // 🔥 RECALCULATE TOTAL POLYLINE DISTANCE (civil ki tarah)
            if (shouldRecalculateDistance && coords.length >= 2) {
                let totalMeters = 0;

                // Calculate cumulative distance of all segments
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

        updated[rowIndex] = { ...item,
            geometry: geo
        };
        setLocalData(updated);
        setMapData(updated);
    };

    // ✅ Input styles (civil ki tarah)
    const wideInputStyle = {
        width: "150px",
        padding: "6px 8px",
        fontSize: "12px",
        border: "1px solid #ccc",
        borderRadius: "3px",
        boxSizing: "border-box",
        margin: "2px",
    };

    const coordInputStyle = {
        width: "150px",
        padding: "6px 8px",
        fontSize: "12px",
        border: "1px solid #ccc",
        borderRadius: "3px",
        boxSizing: "border-box",
        margin: "2px",
    };

    // ✅ Render editable coordinates (civil ki tarah)
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
                    (e) => handleCoordinateChange(rowIndex, 0, 0, e.target.value)
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
                    (e) => handleCoordinateChange(rowIndex, 0, 1, e.target.value)
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
                        minWidth: "300px"
                    }
                } > {
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
                                fontWeight: "bold"
                            }
                        } > {
                            pointIndex === 0 ? "Start" : pointIndex === geometry.coordinates.length - 1 ? "End" : `Pt ${pointIndex}`
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
                            (e) => handleCoordinateChange(rowIndex, pointIndex, 0, e.target.value)
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
                            (e) => handleCoordinateChange(rowIndex, pointIndex, 1, e.target.value)
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
                    (e) => handleCoordinateChange(rowIndex, 0, 0, e.target.value)
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
                    (e) => handleCoordinateChange(rowIndex, 0, 1, e.target.value)
                }
                placeholder = "Center Lng" /
                >
                <
                /div>
            );
        }

        return "-";
    };

    // ✅ Electrical API payload
    const buildElectricalPayload = (item) => {
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
            module: "electrical",

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

            distance_km: item.geometry.start_end_km || 0, // ✅ Distance field
            voltage_level: item.voltage_level || null,
            capacity_mw: item.capacity_mw || null,
            status: item.status || null,
        };
    };

    const postElectricalCoordinates = async (electricalId, item) => {
        // 🔴 Replace with your API endpoint
        const ELECTRICAL_COORDINATES_URL = "YOUR_ELECTRICAL_COORDINATES_API_URL";

        if (item.drawType === "polyline") {
            for (let i = 0; i < item.geometry.coordinates.length; i++) {
                const [lat, lng] = item.geometry.coordinates[i];

                await axios.post(ELECTRICAL_COORDINATES_URL, {
                    electrical_object: electricalId,
                    latitude: lat,
                    longitude: lng,
                    sequence: i + 1,
                    point_label: i === 0 ? "start" : i === item.geometry.coordinates.length - 1 ? "end" : null
                });
            }
        } else {
            await axios.post(ELECTRICAL_COORDINATES_URL, {
                electrical_object: electricalId,
                latitude: item.geometry.lat,
                longitude: item.geometry.lng,
                sequence: 1
            });
        }
    };

    const handleElectricalSubmit = async () => {
        if (localData.length === 0) {
            alert("⚠️ No electrical data to submit!");
            return;
        }

        try {
            for (const item of localData) {
                const electricalPayload = buildElectricalPayload(item);
                // 🔴 Replace with your API endpoint
                const ELECTRICAL_OBJECT_URL = "YOUR_ELECTRICAL_OBJECT_API_URL";

                const electricalRes = await axios.post(ELECTRICAL_OBJECT_URL, electricalPayload);
                const electricalId = electricalRes.data.id;

                await postElectricalCoordinates(electricalId, item);
            }

            alert(`✅ ${localData.length} electrical item(s) saved successfully!`);
            setMapData([]);
            setLocalData([]);
        } catch (error) {
            alert("❌ Error saving electrical data: " + error.message);
        }
    };

    return ( <
        >
        <
        div style = {
            {
                overflowX: "auto",
                width: "100%"
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
            }
        } >
        <
        thead style = {
            {
                background: "#f5f5f5"
            }
        } >
        <
        tr >
        <
        th > # < /th> <
        th > Cluster ID < /th> <
        th > Type < /th> <
        th > Label < /th> <
        th > Name < /th> <
        th > Progress Level < /th> <
        th > Draw Type < /th> <
        th > Geometry Type < /th> <
        th > Layer ID < /th> <
        th > Group ID < /th> <
        th style = {
            {
                minWidth: "150px"
            }
        } > Start Point < /th> <
        th style = {
            {
                minWidth: "150px"
            }
        } > End Point < /th> <
        th > Distance(km) < /th> {
            /* <th>Voltage Level</th>
                          <th>Capacity (MW)</th>
                          <th>Status</th> */
        } <
        th style = {
            {
                minWidth: "350px"
            }
        } > Coordinates < /th> <
        /tr> <
        /thead>

        <
        tbody > {
            localData.length === 0 && ( <
                tr >
                <
                td colSpan = "17"
                align = "center" >
                No Electrical Data Available <
                /td> <
                /tr>
            )
        }

        {
            localData.map((item, index) => {
                const geo = item.geometry;


                return ( <
                    tr key = {
                        index
                    } >
                    <
                    td > {
                        index + 1
                    } < /td> <
                    td > {
                        item.cluster_id
                    } < /td> <
                    td > {
                        item.type || "-"
                    } < /td> <
                    td > {
                        item.label || "-"
                    } < /td> <
                    td > {
                        item.name || "-"
                    } < /td> <
                    td > {
                        item.progressLevel
                    } < /td> <
                    td > {
                        item.drawType || "-"
                    } < /td> <
                    td > {
                        geo ? .geometry_type || "-"
                    } < /td> <
                    td > {
                        item._layerId ? item._layerId.toString() : "-"
                    } < /td> <
                    td > {
                        item._groupId || "-"
                    } < /td>

                    <
                    td > {
                        geo ? .start_point ? ( <
                            div style = {
                                {
                                    display: "flex",
                                    gap: "2px",
                                    alignItems: "center"
                                }
                            } >
                            <
                            input type = "number"
                            step = "0.0001"
                            value = {
                                geo.start_point[0]
                            }
                            style = {
                                wideInputStyle
                            }
                            onChange = {
                                (e) => handleGeoChange(index, "start_point", e.target.value, 0)
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
                                wideInputStyle
                            }
                            onChange = {
                                (e) => handleGeoChange(index, "start_point", e.target.value, 1)
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
                                    alignItems: "center"
                                }
                            } >
                            <
                            input type = "number"
                            step = "0.0001"
                            value = {
                                geo.end_point[0]
                            }
                            style = {
                                wideInputStyle
                            }
                            onChange = {
                                (e) => handleGeoChange(index, "end_point", e.target.value, 0)
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
                                wideInputStyle
                            }
                            onChange = {
                                (e) => handleGeoChange(index, "end_point", e.target.value, 1)
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
                            color: "#0a7"
                        }
                    } > {
                        geo ? .start_end_km !== undefined && geo.start_end_km !== null ?
                        `${geo.start_end_km} km` :
                        "0 km"
                    } <
                    /td>

                    {
                        /* <td>
                        {item.voltage_level || ""}
                                          </td> */
                    }

                    {
                        /* <td>
                                          {item.capacity_mw || ""}
                                          </td> */
                    }

                    {
                        /* <td>
                                           {item.status}
                                          </td> */
                    }

                    <
                    td style = {
                        {
                            fontSize: "12px"
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

        {
            localData.length > 0 && ( <
                div style = {
                    {
                        textAlign: "center",
                        margin: "20px 0"
                    }
                } >
                <
                button onClick = {
                    handleElectricalSubmit
                }
                style = {
                    {
                        backgroundColor: "#9C27B0",
                        color: "white",
                        border: "none",
                        padding: "12px 40px",
                        fontSize: "16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "background-color 0.3s"
                    }
                }
                onMouseEnter = {
                    (e) => e.target.style.backgroundColor = "#7B1FA2"
                }
                onMouseLeave = {
                    (e) => e.target.style.backgroundColor = "#9C27B0"
                } >
                Submit Electrical Data <
                /button>

                <
                button onClick = {
                    () => {
                        setMapData([]);
                        setLocalData([]);
                    }
                }
                style = {
                    {
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "12px 30px",
                        fontSize: "16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        marginLeft: "15px",
                        transition: "background-color 0.3s"
                    }
                }
                onMouseEnter = {
                    (e) => e.target.style.backgroundColor = "#d32f2f"
                }
                onMouseLeave = {
                    (e) => e.target.style.backgroundColor = "#f44336"
                } >
                Clear All Data <
                /button> <
                /div>
            )
        } <
        />
    );
}

export default ElectricalDataTable;