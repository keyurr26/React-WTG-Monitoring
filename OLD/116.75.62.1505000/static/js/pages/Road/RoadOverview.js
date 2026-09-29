import React, {
    useState,
    useMemo,
    useEffect,
    useRef
} from "react";
import AllMapView from "./AllMapView";
import SingleMapView from "./SingleMapView";
import RoadTable from "./RoadTable";
import {
    getNestedProjects
} from "../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    Map as MapIcon
} from "@mui/icons-material";
import {
    Box,
    Button,
    Typography
} from "@mui/material";

const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    let formattedDate = dateString.includes("T") ?
        dateString.split("T")[0] :
        dateString;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    return formattedDate > todayStr ? todayStr : formattedDate;
};

const dataURLToBlob = (dataURL) => {
    if (!dataURL) return null;
    try {
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    } catch (error) {
        return null;
    }
};

function RoadOverview({
    inspectors = [],
    onSubmit,
    filters,
    setFilters,
    dprLoading = false,
    dprData = [],
    // ✅ Receive from parent
    nestedprojects = [],
    nestedLoading = false,
    nestedError = null,
}) {
    const dispatch = useDispatch();

    const prevFiltersRef = useRef({
        project: filters.project,
        windfarm: filters.windfarm,
        cluster: filters.cluster,
    });
    const isInitialMount = useRef(true);
    const isUpdatingRef = useRef(false);

    const [openAllMap, setOpenAllMap] = useState(false);
    const [openSingleMap, setOpenSingleMap] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [rowProgress, setRowProgress] = useState({});

    // Get dropdown options
    const {
        projects,
        windfarms,
        clusters
    } = useMemo(() => {
        const p = [],
            w = [],
            c = [];
        const sp = new Set(),
            sw = new Set(),
            sc = new Set();

        nestedprojects.forEach((project) => {
            if (project.project_id && !sp.has(project.project_id)) {
                sp.add(project.project_id);
                p.push({
                    id: project.project_id,
                    name: project.project_name
                });
            }

            if (
                filters.project &&
                project.project_id === Number(filters.project) &&
                project.windfarms
            ) {
                project.windfarms.forEach((windfarm) => {
                    if (windfarm.windfarm_id && !sw.has(windfarm.windfarm_id)) {
                        sw.add(windfarm.windfarm_id);
                        w.push({
                            id: windfarm.windfarm_id,
                            name: windfarm.windfarm_name
                        });
                    }

                    if (
                        filters.windfarm &&
                        windfarm.windfarm_id === Number(filters.windfarm) &&
                        windfarm.clusters
                    ) {
                        windfarm.clusters.forEach((cluster) => {
                            if (cluster.cluster_id && !sc.has(cluster.cluster_id)) {
                                sc.add(cluster.cluster_id);
                                c.push({
                                    id: cluster.cluster_id,
                                    name: cluster.cluster_name
                                });
                            }
                        });
                    }
                });
            }
        });

        return {
            projects: p,
            windfarms: w,
            clusters: c
        };
    }, [nestedprojects, filters]);

    // Build table data
    const tableData = useMemo(() => {
        const rows = [];

        nestedprojects.forEach((p) =>
            p.windfarms ? .forEach((w) =>
                w.clusters ? .forEach((c) =>
                    c.map_objects ? .forEach((m) => {
                        const dailyUpdateObj = m.daily_updates || {};
                        const hasDailyUpdate =
                            dailyUpdateObj &&
                            Object.keys(dailyUpdateObj).length > 0 &&
                            dailyUpdateObj.id;

                        const latestUpdate = hasDailyUpdate ? dailyUpdateObj : null;
                        const coordinates = m.coordinates || [];
                        const levelUpdates = m.level_updates || {};

                        rows.push({
                            id: m.id,
                            project: p.project_name,
                            windfarm: w.windfarm_name,
                            cluster: c.cluster_name,
                            name: m.name || m.label,
                            progress_level: m.progress_level,
                            type: m.type,
                            distanceKm: m.distance_km,
                            latestUpdate,
                            levelUpdates,
                            mapObject: m,
                            coordinates: coordinates,
                            start_lat: coordinates.length > 0 ? coordinates[0] ? .latitude : null,
                            start_lng: coordinates.length > 0 ? coordinates[0] ? .longitude : null,
                            end_lat: coordinates.length > 0 ?
                                coordinates[coordinates.length - 1] ? .latitude :
                                null,
                            end_lng: coordinates.length > 0 ?
                                coordinates[coordinates.length - 1] ? .longitude :
                                null,
                        });
                    })
                )
            )
        );

        return rows;
    }, [nestedprojects]);

    const getCompleteMapObject = (row) => {
        if (!row) return null;

        if (row.mapObject) {
            return {
                ...row.mapObject,
                id: row.id,
                name: row.name,
                type: row.type,
                cluster: row.cluster,
                windfarm: row.windfarm,
                project: row.project,
                distanceKm: row.distanceKm,
                progress_level: row.progress_level,
                latestUpdate: row.latestUpdate,
                coordinates: row.mapObject.coordinates || [],
                start_lat: row.mapObject.coordinates ? .[0] ? .latitude || null,
                start_lng: row.mapObject.coordinates ? .[0] ? .longitude || null,
                end_lat: row.mapObject.coordinates ? .[row.mapObject.coordinates ? .length - 1] ?
                    .latitude || null,
                end_lng: row.mapObject.coordinates ? .[row.mapObject.coordinates ? .length - 1] ?
                    .longitude || null,
            };
        }

        return {
            ...row,
            coordinates: row.coordinates || [],
        };
    };

    const handleMapView = (row) => {
        const completeData = getCompleteMapObject(row);
        setSelectedRow(completeData);
        setOpenSingleMap(true);
    };

    // ============ rowProgress useEffect - ONLY ADD NEW ROWS ============
    useEffect(() => {
        if (tableData.length > 0) {
            const initialProgress = {};
            let hasChanges = false;

            tableData.forEach((row) => {
                if (!rowProgress[row.id]) {
                    hasChanges = true;
                    const levelUpdates = row.levelUpdates || {};

                    const rowData = {
                        level: "",
                        date: "",
                        completed_qty: "",
                        inspector: "",
                        remarks: "",
                        photo: null,
                        photoFile: null,
                        road_length: row.distanceKm || "0",
                        isExisting: false,
                        isEdited: false,
                    };

                    if (levelUpdates && Object.keys(levelUpdates).length > 0) {
                        const levels = ["L1", "L2", "L3", "Final"];
                        levels.forEach((level) => {
                            if (levelUpdates[level]) {
                                const update = levelUpdates[level];
                                rowData[level] = {
                                    level: level,
                                    date: formatDateForInput(update.date),
                                    completed_qty: update.completed_qty || "",
                                    inspector: update.inspector ? String(update.inspector) : "",
                                    remarks: update.remarks || "",
                                    photo: update.photo || null,
                                    photoFile: null,
                                    road_length: update.road_length || row.distanceKm || "0",
                                    isExisting: true,
                                    isEdited: false,
                                };
                            }
                        });
                    }

                    if (row.latestUpdate) {
                        rowData.level = row.latestUpdate.level || "";
                        rowData.date = formatDateForInput(row.latestUpdate.date);
                        rowData.completed_qty = row.latestUpdate.completed_qty || "";
                        rowData.inspector = row.latestUpdate.inspector ?
                            String(row.latestUpdate.inspector) :
                            "";
                        rowData.remarks = row.latestUpdate.remarks || "";
                        rowData.photo = row.latestUpdate.photo || null;
                        rowData.road_length =
                            row.latestUpdate.road_length || row.distanceKm || "0";
                        rowData.isExisting = true;
                    }

                    initialProgress[row.id] = rowData;
                }
            });

            if (hasChanges) {
                setRowProgress((prev) => ({ ...prev,
                    ...initialProgress
                }));
            }
        }
    }, [tableData]);
    // ============ END ============

    // ============ Filter useEffect - WITH UPDATING REF ============
    useEffect(() => {
        if (isUpdatingRef.current) return;

        const currentFilters = {
            projectId: filters.project || null,
            windfarmId: filters.windfarm || null,
            clusterId: filters.cluster || null,
        };

        const previousFilters = prevFiltersRef.current;

        const filtersChanged =
            currentFilters.projectId !== previousFilters.projectId ||
            currentFilters.windfarmId !== previousFilters.windfarmId ||
            currentFilters.clusterId !== previousFilters.clusterId;

        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevFiltersRef.current = {
                projectId: currentFilters.projectId,
                windfarmId: currentFilters.windfarmId,
                clusterId: currentFilters.clusterId,
            };
            // ✅ REMOVED: dispatch(getNestedProjects({}));
            // Parent already handles initial fetch
            return;
        }

        if (filtersChanged) {
            const cleanFilters = {};
            if (currentFilters.projectId)
                cleanFilters.projectId = currentFilters.projectId;
            if (currentFilters.windfarmId)
                cleanFilters.windfarmId = currentFilters.windfarmId;
            if (currentFilters.clusterId)
                cleanFilters.clusterId = currentFilters.clusterId;

            dispatch(getNestedProjects(cleanFilters));
            prevFiltersRef.current = {
                projectId: currentFilters.projectId,
                windfarmId: currentFilters.windfarmId,
                clusterId: currentFilters.clusterId,
            };
        }
    }, [filters.project, filters.windfarm, filters.cluster, dispatch]);
    // ============ END ============

    const handleFilterChange = (field, value) => {
        setFilters((prev) => {
            const newFilters = { ...prev
            };

            if (field === "project") {
                newFilters.project = value;
                newFilters.windfarm = "";
                newFilters.cluster = "";
            } else if (field === "windfarm") {
                newFilters.windfarm = value;
                newFilters.cluster = "";
            } else if (field === "cluster") {
                newFilters.cluster = value;
            }

            return newFilters;
        });
    };

    // ============ handleSubmit - NO EXTRA API CALL ============
    const handleSubmit = async (row, directData = null) => {
        let data = directData || rowProgress[row.id];

        if (!data) {
            alert("No progress data found for this row");
            return;
        }

        if (!data.level || data.level === "") {
            alert("Please select a Construction Level");
            return;
        }
        if (!data.date || data.date === "") {
            alert("Please select a Date");
            return;
        }
        if (!data.completed_qty || data.completed_qty === "") {
            alert("Please enter Completed Quantity");
            return;
        }
        if (!data.inspector || data.inspector === "") {
            alert("Please select an Inspector");
            return;
        }

        const hasPhoto = !!(data.photo || data.photoFile);
        if (!hasPhoto) {
            alert("Photo is mandatory. Please upload a photo.");
            return;
        }

        const totalDistance = parseFloat(
            row.distanceKm || data.road_length || 0
        );
        const completedQty = parseFloat(data.completed_qty) || 0;

        if (completedQty > totalDistance) {
            alert(
                `Quantity cannot exceed total distance of ${totalDistance.toFixed(2)} km`
            );
            return;
        }

        try {
            isUpdatingRef.current = true;
            setSubmitting(true);

            const formData = new FormData();

            formData.append("road", row.id);
            formData.append("date", data.date);
            formData.append("level", data.level);
            formData.append("completed_qty", data.completed_qty);
            formData.append("remarks", data.remarks || "");

            if (data.inspector) {
                formData.append("updated_by", data.inspector);
            }

            const photoToUpload = data.photoFile || data.photo;

            if (photoToUpload) {
                if (photoToUpload instanceof File) {
                    formData.append("photo", photoToUpload, photoToUpload.name);
                } else if (photoToUpload instanceof Blob) {
                    const fileName = photoToUpload.name || "photo.jpg";
                    const file = new File([photoToUpload], fileName, {
                        type: photoToUpload.type || "image/jpeg",
                    });
                    formData.append("photo", file, fileName);
                } else if (
                    typeof photoToUpload === "string" &&
                    photoToUpload.startsWith("data:image")
                ) {
                    const blob = dataURLToBlob(photoToUpload);
                    if (blob) {
                        const file = new File([blob], "photo.jpg", {
                            type: "image/jpeg",
                        });
                        formData.append("photo", file, "photo.jpg");
                    }
                } else if (
                    typeof photoToUpload === "string" &&
                    photoToUpload.startsWith("http")
                ) {
                    formData.append("photo_url", photoToUpload);
                }
            }

            formData.append("road_length", data.road_length || "0");

            if (data.isExisting && row.latestUpdate ? .id) {
                formData.append("id", row.latestUpdate.id);
            }

            if (onSubmit) {
                await onSubmit(formData);
                setEditingRow(null);

                setRowProgress((prev) => ({
                    ...prev,
                    [row.id]: {
                        ...prev[row.id],
                        isExisting: true,
                        isEdited: false,
                        photoFile: null,
                    },
                }));
            } else {
                alert("Submit function not available");
            }
        } catch (error) {
            alert(`Failed to submit DPR: ${error.message}`);
        } finally {
            setSubmitting(false);

            setTimeout(() => {
                isUpdatingRef.current = false;
            }, 500);
        }
    };
    // ============ END ============

    const isTableLoading = (nestedLoading || dprLoading) && !submitting;

    return ( <
        Box p = {
            2
        } >
        <
        Box sx = {
            {
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
            }
        } >
        <
        Typography variant = "h5"
        sx = {
            {
                fontWeight: "bold"
            }
        } >
        Update Daily Road <
        /Typography> <
        Button variant = "contained"
        color = "primary"
        startIcon = { < MapIcon / >
        }
        onClick = {
            () => setOpenAllMap(true)
        } >
        View All on Map <
        /Button> <
        /Box>

        <
        RoadTable tableData = {
            tableData
        }
        loading = {
            isTableLoading
        }
        error = {
            nestedError
        }
        inspectors = {
            inspectors
        }
        rowProgress = {
            rowProgress
        }
        editingRow = {
            editingRow
        }
        submitting = {
            submitting
        }
        setRowProgress = {
            setRowProgress
        }
        setEditingRow = {
            setEditingRow
        }
        handleSubmit = {
            handleSubmit
        }
        handleMapView = {
            handleMapView
        }
        filters = {
            filters
        }
        getNestedProjects = {
            getNestedProjects
        }
        dispatch = {
            dispatch
        }
        />

        <
        AllMapView open = {
            openAllMap
        }
        onClose = {
            () => setOpenAllMap(false)
        }
        data = {
            tableData
        }
        /> <
        SingleMapView open = {
            openSingleMap
        }
        onClose = {
            () => {
                setOpenSingleMap(false);
                setSelectedRow(null);
            }
        }
        data = {
            selectedRow
        }
        Turbinedata = {
            tableData.filter(
                (row) => row.type ? .toLowerCase() === "turbine"
            )
        }
        /> <
        /Box>
    );
}

export default RoadOverview;