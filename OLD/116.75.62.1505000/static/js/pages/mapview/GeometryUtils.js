import L from "leaflet";

/* -------- START → END DISTANCE (KM) -------- */
export function calculateStartEndDistance(start, end) {
    if (!start || !end) return null;

    const meters = L.latLng(start[0], start[1]).distanceTo(
        L.latLng(end[0], end[1])
    );

    return +(meters / 1000).toFixed(2); // number
}

/* -------- NORMALIZE GEOMETRY -------- */
export function normalizeGeometry(drawType, geometry, progress = 0) {
    if (drawType === "marker") {
        return {
            geometry_type: "Point",
            lat: geometry.lat,
            lng: geometry.lng,
            start_point: [geometry.lat, geometry.lng],
            end_point: [geometry.lat, geometry.lng],
            start_end_km: 0,
            // progress: progress
        };
    }

    if (drawType === "circle") {
        return {
            geometry_type: "Circle",
            lat: geometry.lat,
            lng: geometry.lng,
            start_point: [geometry.lat, geometry.lng],
            end_point: [geometry.lat, geometry.lng],
            start_end_km: 0,
            // progress: progress
        };
    }

    if (Array.isArray(geometry)) {
        const latlngs = Array.isArray(geometry[0]) ? geometry[0] : geometry;
        if (!latlngs.length) return null;

        const start_point = [latlngs[0].lat, latlngs[0].lng];
        const end_point = [
            latlngs[latlngs.length - 1].lat,
            latlngs[latlngs.length - 1].lng,
        ];

        return {
            geometry_type: "LineString",
            coordinates: latlngs.map((p) => [p.lat, p.lng]),
            start_point,
            end_point,
            start_end_km: calculateStartEndDistance(start_point, end_point),
            // progress: progress
        };
    }

    return null;
}

/* -------- EXTRACT GEOMETRY INFO -------- */
export function extractGeometryInfo(geometry) {
    if (!geometry) return {};

    const info = {
        geometry_type: geometry.geometry_type || "-",
        start_point: geometry.start_point ?
            `${geometry.start_point[0].toFixed(4)}, ${geometry.start_point[1].toFixed(4)}` : "-",
        end_point: geometry.end_point ?
            `${geometry.end_point[0].toFixed(4)}, ${geometry.end_point[1].toFixed(4)}` : "-",
        distance_km: geometry.start_end_km ? `${geometry.start_end_km} km` : "-",
        // progress: geometry.progress !== undefined ? `${geometry.progress}%` : "-"
    };

    return info;
}