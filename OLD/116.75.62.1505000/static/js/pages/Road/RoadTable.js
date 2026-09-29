import React, {
    useState
} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Chip,
    Stack,
    TextField,
    Avatar,
    MenuItem,
    CircularProgress,
    Alert,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    TablePagination,
    Grid
} from "@mui/material";
import {
    useMemo
} from "react";
import {
    PhotoCamera,
    Place
} from "@mui/icons-material";

const LEVELS = ["L1", "L2", "L3", "Final"];
const COLOR_MAP = {
    L1: {
        bg: "#00416A",
        hover: "#003355"
    },
    L2: {
        bg: "#1976d2",
        hover: "#1565c0"
    },
    L3: {
        bg: "#ed6c02",
        hover: "#e65100"
    },
    Final: {
        bg: "#2e7d32",
        hover: "#1b5e20"
    },
};

const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const formatted = dateString.includes("T") ? dateString.split("T")[0] : dateString;
    const todayStr = new Date().toISOString().split("T")[0];
    return formatted > todayStr ? todayStr : formatted;
};

const normalizeLevel = (level) => {
    if (!level) return "";
    const map = {
        "Level0": "L0",
        "Level1": "L1",
        "Level2": "L2",
        "Level3": "L3",
        "Final": "Final",
        "L0": "L0",
        "L1": "L1",
        "L2": "L2",
        "L3": "L3"
    };
    return map[level] || level;
};

// Get the starting level based on planned level
const getStartLevel = (plannedLevel) => {
    const normalized = normalizeLevel(plannedLevel);
    const levelMap = {
        "L0": "L1",
        "L1": "L2",
        "L2": "L3",
        "L3": "Final",
        "Final": "Final"
    };
    return levelMap[normalized] || "L1";
};

const getLevelCompletedQty = (rowProgress, rowId, level) => {
    const data = rowProgress[rowId] || {};

    if (data[level] && data[level].completed_qty) {
        return parseFloat(data[level].completed_qty) || 0;
    }

    if (data.level === level && data.completed_qty) {
        return parseFloat(data.completed_qty) || 0;
    }

    if (data._levelData && data._levelData[level] && data._levelData[level].completed_qty) {
        return parseFloat(data._levelData[level].completed_qty) || 0;
    }

    return 0;
};

const getAllLevelQuantities = (rowProgress, rowId) => {
    const data = rowProgress[rowId] || {};
    const quantities = {};

    LEVELS.forEach(level => {
        quantities[level] = getLevelCompletedQty(rowProgress, rowId, level);
    });

    return quantities;
};

// Computes input validation limits inside the popup
const getLevelValidationContext = (row, level, rowProgress) => {
    const totalDistance = parseFloat(row.distanceKm) || 0;
    const rowId = row.id;

    const plannedLevel = row.progress_level || "";
    const normalizedPlanned = normalizeLevel(plannedLevel);
    const startLevel = getStartLevel(normalizedPlanned);

    const quantities = getAllLevelQuantities(rowProgress, rowId);
    const qL1 = quantities.L1 || 0;
    const qL2 = quantities.L2 || 0;
    const qL3 = quantities.L3 || 0;
    const qFinal = quantities.Final || 0;

    const levelOrder = {
        L1: 1,
        L2: 2,
        L3: 3,
        Final: 4
    };
    const startLevelNum = levelOrder[startLevel] || 1;
    const currentLevelNum = levelOrder[level] || 0;

    if (currentLevelNum < startLevelNum) {
        return {
            enabled: false,
            maxQty: 0
        };
    }

    if (level === "L1") {
        return {
            enabled: startLevel === "L1" && qL1 < totalDistance,
            maxQty: totalDistance
        };
    }

    if (level === "L2") {
        if (startLevel === "L2") {
            return {
                enabled: qL2 < totalDistance,
                maxQty: totalDistance
            };
        }
        const hasL1Progress = qL1 > 0;
        const isL2Complete = qL2 >= totalDistance;
        return {
            enabled: hasL1Progress && !isL2Complete,
            maxQty: qL1
        };
    }

    if (level === "L3") {
        if (startLevel === "L3") {
            return {
                enabled: qL3 < totalDistance,
                maxQty: totalDistance
            };
        }
        const hasL2Progress = qL2 > 0;
        const isL3Complete = qL3 >= totalDistance;
        return {
            enabled: hasL2Progress && !isL3Complete,
            maxQty: qL2
        };
    }

    if (level === "Final") {
        if (startLevel === "Final") {
            return {
                enabled: qFinal < totalDistance,
                maxQty: totalDistance
            };
        }
        const hasL3Progress = qL3 > 0;
        const isFinalComplete = qFinal >= totalDistance;
        return {
            enabled: hasL3Progress && !isFinalComplete,
            maxQty: qL3
        };
    }

    return {
        enabled: true,
        maxQty: totalDistance
    };
};

const initialFormState = {
    level: "",
    date: "",
    completed_qty: "",
    inspector: "",
    photo: null, // New photo being uploaded
    photoFile: null, // New photo file
    previousPhoto: null, // Store previous photo for display
    previousPhotoFile: null,
    remarks: ""
};

function RoadTable({
    tableData,
    loading,
    error,
    inspectors,
    rowProgress,
    submitting,
    setRowProgress,
    handleSubmit,
    handleMapView
}) {
    const [levelPopupOpen, setLevelPopupOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [levelFormData, setLevelFormData] = useState(initialFormState);
    const [maxInputAllowed, setMaxInputAllowed] = useState(0);
    const [currentQty, setCurrentQty] = useState(0);
    const [photoUploadRequired, setPhotoUploadRequired] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredData = useMemo(() => {
        return tableData.filter(row =>
            !["turbine", "junction", "pointcircle"].includes(String(row.type).toLowerCase())
        );
    }, [tableData]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const currentPageData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleOpenLevelPopup = (row, clickedLevel) => {
        setSelectedRow(row);

        const data = rowProgress[row.id] || {};
        const historicalUpdateState = row.latestUpdate || {};

        const levelData = data[clickedLevel] || {};
        const useFlatData = data.level === clickedLevel && !levelData.completed_qty;

        const existingQty = levelData.completed_qty ||
            (useFlatData ? data.completed_qty : "") ||
            "";

        // Get previous photo data (for display only)
        let previousPhoto = null;
        let previousPhotoFile = null;

        // Check if there's a photo in level-specific data
        if (levelData.photo) {
            previousPhoto = levelData.photo;
            previousPhotoFile = levelData.photoFile || null;
        }
        // Check if there's a photo in flat data
        else if (useFlatData && data.photo) {
            previousPhoto = data.photo;
            previousPhotoFile = data.photoFile || null;
        }
        // Check if there's a photo in historical update
        else if (clickedLevel === row.latestUpdate ? .level && historicalUpdateState.photo) {
            previousPhoto = historicalUpdateState.photo;
            previousPhotoFile = historicalUpdateState.photoFile || null;
        }

        const formData = {
            level: clickedLevel,
            date: formatDateForInput(
                levelData.date ||
                (useFlatData ? data.date : null) ||
                (clickedLevel === row.latestUpdate ? .level ? historicalUpdateState.date : null) ||
                new Date().toISOString()
            ),
            completed_qty: existingQty,
            inspector: levelData.inspector ||
                (useFlatData ? data.inspector : "") ||
                (clickedLevel === row.latestUpdate ? .level ? historicalUpdateState.inspector : "") ||
                "",
            photo: null, // Reset new photo
            photoFile: null, // Reset new photo file
            previousPhoto: previousPhoto, // Store previous photo
            previousPhotoFile: previousPhotoFile, // Store previous photo file
            remarks: levelData.remarks ||
                (useFlatData ? data.remarks : "") ||
                (clickedLevel === row.latestUpdate ? .level ? historicalUpdateState.remarks : "") ||
                "",
        };

        // Set current quantity for validation
        setCurrentQty(parseFloat(existingQty) || 0);

        const validation = getLevelValidationContext(row, clickedLevel, rowProgress);
        setMaxInputAllowed(validation.maxQty);

        setLevelFormData(formData);
        setPhotoUploadRequired(false);
        setLevelPopupOpen(true);
    };

    const handleCloseLevelPopup = () => {
        setLevelPopupOpen(false);
        setSelectedRow(null);
        setLevelFormData(initialFormState);
        setCurrentQty(0);
        setPhotoUploadRequired(false);
    };


    const handleImageUpload = (file, callback) => {
        if (!file) {
            alert("No file selected");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("File size should be less than 5MB");
            return;
        }
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
            alert("Please upload only image files (JPEG, PNG, GIF, WEBP)");
            return;
        }
        callback(file);
        setPhotoUploadRequired(true);
    };

    // Handle quantity change with increment-only validation
    const handleQuantityChange = (e) => {
        let value = e.target.value;

        if (value === "") {
            setLevelFormData(p => ({ ...p,
                completed_qty: ""
            }));
            return;
        }

        let numValue = parseFloat(value);

        if (isNaN(numValue)) {
            return;
        }

        // Only allow values GREATER THAN or EQUAL TO current quantity
        if (numValue < currentQty) {
            alert(`Value cannot be less than current quantity (${currentQty.toFixed(2)} km). Please enter a value greater than or equal to ${currentQty.toFixed(2)} km.`);
            return;
        }

        // Cap at max allowed
        numValue = Math.min(numValue, maxInputAllowed);

        // Round to 2 decimal places
        numValue = Math.round(numValue * 100) / 100;

        setLevelFormData(p => ({
            ...p,
            completed_qty: numValue.toString()
        }));
    };

    // Handle increment buttons
    const handleIncrement = (amount) => {
        const currentValue = parseFloat(levelFormData.completed_qty) || currentQty;
        let newValue = currentValue + amount;

        // Ensure we don't go below current quantity
        if (newValue < currentQty) {
            newValue = currentQty;
        }

        // Cap at max allowed
        newValue = Math.min(newValue, maxInputAllowed);
        newValue = Math.round(newValue * 100) / 100;

        setLevelFormData(p => ({
            ...p,
            completed_qty: newValue.toString()
        }));
    };

    const handleLevelSubmit = () => {
        if (!selectedRow) {
            alert("No row selected");
            return;
        }

        const {
            level,
            date,
            completed_qty,
            inspector,
            photo,
            photoFile,
            previousPhoto,
            remarks
        } = levelFormData;

        if (!level) {
            alert("Please select a Construction Level");
            return;
        }
        if (!date) {
            alert("Please select a Date");
            return;
        }
        if (!completed_qty || completed_qty === "") {
            alert("Please enter Completed Quantity");
            return;
        }

        // Validate quantity is not less than current
        const qtyValue = parseFloat(completed_qty);
        if (qtyValue < currentQty) {
            alert(`Quantity cannot be less than current value (${currentQty.toFixed(2)} km)`);
            return;
        }

        if (!inspector) {
            alert("Please select an Inspector");
            return;
        }

        // **CRITICAL CHANGE: Require a NEW photo for every submission**
        const hasNewPhoto = !!(photo || photoFile);
        if (!hasNewPhoto) {
            alert("Please upload a NEW photo for this update. A new photo is required for each submission.");
            return;
        }

        // Check if the new photo is actually different from the previous one
        const hasPreviousPhoto = !!(previousPhoto || levelFormData.previousPhotoFile);
        if (hasPreviousPhoto) {
            // Check if the new photo is the same as previous (compare file names or objects)
            const newPhotoObj = photo || photoFile;
            const prevPhotoObj = previousPhoto || levelFormData.previousPhotoFile;

            // If both are File objects, compare their names and sizes
            if (newPhotoObj instanceof File && prevPhotoObj instanceof File) {
                if (newPhotoObj.name === prevPhotoObj.name && newPhotoObj.size === prevPhotoObj.size) {
                    alert("Please upload a NEW photo. You cannot use the same photo again.");
                    return;
                }
            }
        }

        // Create a unique ID for this update
        const updateId = `${selectedRow.id}_${level}_${Date.now()}`;

        const newProgressData = {
            level: level,
            date: date,
            completed_qty: completed_qty,
            inspector: inspector,
            photo: photo || photoFile, // This is the NEW photo
            photoFile: photoFile || photo,
            previousPhoto: previousPhoto, // Store previous photo for reference
            previousPhotoFile: levelFormData.previousPhotoFile,
            remarks: remarks || "",
            road_length: selectedRow.distanceKm || "0",
            isExisting: false,
            isEdited: true,
            updateId: updateId,
            [level]: {
                level: level,
                date: date,
                completed_qty: completed_qty,
                inspector: inspector,
                photo: photo || photoFile, // This is the NEW photo
                photoFile: photoFile || photo,
                previousPhoto: previousPhoto, // Store previous photo for reference
                previousPhotoFile: levelFormData.previousPhotoFile,
                remarks: remarks || "",
                isExisting: false,
                isEdited: true,
                updateId: updateId
            }
        };

        setRowProgress(prev => {
            const existingData = prev[selectedRow.id] || {};
            const updated = {
                ...prev,
                [selectedRow.id]: {
                    ...existingData,
                    level: level,
                    date: date,
                    completed_qty: completed_qty,
                    inspector: inspector,
                    photo: photo || photoFile, // This is the NEW photo
                    photoFile: photoFile || photo,
                    previousPhoto: previousPhoto, // Store previous photo for reference
                    previousPhotoFile: levelFormData.previousPhotoFile,
                    remarks: remarks || "",
                    road_length: selectedRow.distanceKm || "0",
                    isExisting: false,
                    isEdited: true,
                    updateId: updateId,
                    [level]: {
                        level: level,
                        date: date,
                        completed_qty: completed_qty,
                        inspector: inspector,
                        photo: photo || photoFile, // This is the NEW photo
                        photoFile: photoFile || photo,
                        previousPhoto: previousPhoto, // Store previous photo for reference
                        previousPhotoFile: levelFormData.previousPhotoFile,
                        remarks: remarks || "",
                        isExisting: false,
                        isEdited: true,
                        updateId: updateId
                    }
                }
            };
            return updated;
        });

        handleCloseLevelPopup();

        setTimeout(() => {
            handleSubmit(selectedRow, newProgressData);
        }, 100);
    };

    const getRemainingLength = (row) => {
        if (row.progress_level ? .toLowerCase() === "final") return "Completed";

        const quantities = getAllLevelQuantities(rowProgress, row.id);
        const totalDistance = parseFloat(row.distanceKm) || 0;

        const allLevelsComplete = LEVELS.every(level => {
            const qty = quantities[level] || 0;
            return qty >= totalDistance;
        });

        if (allLevelsComplete) {
            return "Completed";
        }

        const data = rowProgress[row.id] || {};
        const remaining = totalDistance - (parseFloat(data.completed_qty) || 0);
        return remaining <= 0 ? "Completed" : remaining.toFixed(2);
    };

    const renderLevelButtons = (row, currentLevel, globalDisabled) => {
        const data = rowProgress[row.id] || {};
        const totalDistance = parseFloat(row.distanceKm) || 0;
        const plannedLevel = row.progress_level || "";
        const normalizedPlanned = normalizeLevel(plannedLevel);
        const startLevel = getStartLevel(normalizedPlanned);

        const levelOrder = {
            L1: 1,
            L2: 2,
            L3: 3,
            Final: 4
        };
        const startLevelNum = levelOrder[startLevel] || 1;

        return ( <
            Stack direction = "row"
            spacing = {
                0.5
            }
            flexWrap = "wrap" > {
                LEVELS.map((level) => {
                    const levelData = data[level] || {};
                    const qtyValue = levelData.completed_qty ||
                        (data.level === level ? data.completed_qty : "") ||
                        "";

                    const isActive = currentLevel === level;
                    const validation = getLevelValidationContext(row, level, rowProgress);
                    const currentLevelNum = levelOrder[level] || 0;
                    const isBeforeStart = currentLevelNum < startLevelNum;

                    const isLevelComplete = parseFloat(qtyValue) >= totalDistance && qtyValue !== "";

                    // NEW CONDITION: Disable Final level if planned level is Final
                    const isFinalAndPlannedFinal = level === "Final" && normalizedPlanned === "Final";

                    const buttonDisabled = globalDisabled ||
                        isBeforeStart ||
                        !validation.enabled ||
                        isLevelComplete ||
                        isFinalAndPlannedFinal; // Added this condition

                    return ( <
                        Button key = {
                            level
                        }
                        variant = {
                            isActive ? "contained" : "outlined"
                        }
                        size = "small"
                        onClick = {
                            () => handleOpenLevelPopup(row, level)
                        }
                        disabled = {
                            buttonDisabled
                        }
                        sx = {
                            {
                                minWidth: 55,
                                borderRadius: 1,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                bgcolor: isActive ? COLOR_MAP[level].bg : "#fff",
                                color: isActive ?
                                    "#fff" :
                                    isLevelComplete ?
                                    "#2e7d32" :
                                    COLOR_MAP[level].bg,
                                borderColor: isLevelComplete ?
                                    "#4caf50" :
                                    COLOR_MAP[level].bg,
                                opacity: buttonDisabled ? 0.5 : 1,
                                "&:hover": {
                                    bgcolor: isActive ?
                                        COLOR_MAP[level].hover :
                                        COLOR_MAP[level].bg,
                                    color: "#fff",
                                },
                                "&.Mui-disabled": {
                                    bgcolor: "#f5f5f5",
                                    color: "#9e9e9e",
                                    border: "1px dashed #cfcfcf",
                                    opacity: 1,
                                    cursor: "not-allowed",
                                },
                            }
                        } >
                        {
                            isActive && qtyValue ? `${level} - ${qtyValue}` : level
                        } {
                            isLevelComplete && " ✅"
                        } {
                            isBeforeStart && " 🔒"
                        } {
                            isFinalAndPlannedFinal && " 🔒"
                        } { /* Optional: Add lock icon for disabled Final */ } <
                        /Button>
                    );
                })
            } <
            /Stack>
        );
    };
    // Get photo for display - handle both File objects and string URLs
    const getDisplayPhoto = (photoData) => {
        if (!photoData) return null;

        // If it's a File or Blob, create object URL
        if (photoData instanceof File || photoData instanceof Blob) {
            return URL.createObjectURL(photoData);
        }

        // If it's a string (URL), return as is
        if (typeof photoData === 'string') {
            return photoData;
        }

        return null;
    };

    // Check if new photo is uploaded
    const hasNewPhoto = !!(levelFormData.photo || levelFormData.photoFile);
    const hasPreviousPhoto = !!(levelFormData.previousPhoto || levelFormData.previousPhotoFile);

    return ( <
        >
        <
        TableContainer component = {
            Paper
        } >
        <
        Table size = "small"
        sx = {
            {
                minWidth: 1450,
                tableLayout: "fixed"
            }
        } >
        <
        TableHead sx = {
            {
                "& th": {
                    bgcolor: "#00416A",
                    color: "#fff",
                    fontWeight: "bold",
                    whiteSpace: "nowrap"
                }
            }
        } >
        <
        TableRow >
        <
        TableCell sx = {
            {
                minWidth: 120
            }
        } > Project < /TableCell> <
        TableCell sx = {
            {
                minWidth: 120
            }
        } > Windfarm < /TableCell> <
        TableCell sx = {
            {
                minWidth: 120
            }
        } > Cluster < /TableCell> <
        TableCell sx = {
            {
                minWidth: 120
            }
        } > Road Plan < /TableCell> <
        TableCell sx = {
            {
                minWidth: 140
            }
        } > Planned Level < /TableCell> <
        TableCell sx = {
            {
                minWidth: 250,
                width: 250
            }
        } > Construction Level < /TableCell> <
        TableCell sx = {
            {
                minWidth: 120
            }
        } > Current Level < /TableCell> <
        TableCell sx = {
            {
                minWidth: 90
            }
        } > Type < /TableCell> <
        TableCell sx = {
            {
                minWidth: 90
            }
        } > Distance(km) < /TableCell> <
        TableCell sx = {
            {
                minWidth: 100
            }
        } > Action < /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > { /* ============ DEBUG LOADING SECTION ============ */ } { /* {console.log("🔵 [RoadTable] Rendering - loading:", loading, "submitting:", submitting, "tableData length:", tableData.length)} */ }

        { /* ============ FIX: Only show loading when NOT submitting ============ */ } {
            loading && !submitting && tableData.length === 0 && ( <
                TableRow >
                <
                TableCell colSpan = {
                    10
                }
                align = "center" >
                <
                CircularProgress size = {
                    24
                }
                /> <
                Box mt = {
                    1
                } > Loading roads data... < /Box> <
                /TableCell> <
                /TableRow>
            )
        }

        {
            error && ( <
                TableRow >
                <
                TableCell colSpan = {
                    10
                } >
                <
                Alert severity = "error" > {
                    error
                } < /Alert> <
                /TableCell> <
                /TableRow>
            )
        }

        {
            !loading && !error && filteredData.length === 0 && ( <
                TableRow >
                <
                TableCell colSpan = {
                    10
                }
                align = "center" >
                <
                Alert severity = "info" > No roads found < /Alert> <
                /TableCell> <
                /TableRow>
            )
        }

        {
            !loading && !error && currentPageData.map(row => {
                const remainingDisplay = getRemainingLength(row);
                const isFinalLevel = row.progress_level ? .toLowerCase() === "final";
                const isCompleted = remainingDisplay === "Completed" || remainingDisplay <= 0;

                const data = rowProgress[row.id] || {};
                const currentActiveLevel = data.level || row.latestUpdate ? .level;

                return ( <
                    TableRow key = {
                        row.id
                    }
                    hover sx = {
                        {
                            backgroundColor: isCompleted ? "#f0fff0" : "inherit"
                        }
                    } >
                    <
                    TableCell > {
                        row.project
                    } < /TableCell> <
                    TableCell > {
                        row.windfarm
                    } < /TableCell> <
                    TableCell > {
                        row.cluster
                    } < /TableCell> <
                    TableCell > < strong > {
                        row.name
                    } < /strong></TableCell >
                    <
                    TableCell >
                    <
                    Chip label = {
                        row.progress_level
                    }
                    size = "small"
                    sx = {
                        {
                            bgcolor: isFinalLevel ? "green" : "#00416A",
                            color: "#fff",
                            fontWeight: "bold"
                        }
                    }
                    /> <
                    /TableCell> <
                    TableCell sx = {
                        {
                            minWidth: 250,
                            width: 250
                        }
                    } > {
                        renderLevelButtons(row, currentActiveLevel, false)
                    } <
                    /TableCell> <
                    TableCell > {
                        currentActiveLevel || "Not set"
                    } < /TableCell> <
                    TableCell > {
                        row.type
                    } < /TableCell> <
                    TableCell > {
                        (Number(row.distanceKm) || 0).toFixed(2)
                    } < /TableCell> <
                    TableCell >
                    <
                    IconButton size = "small"
                    title = "View on Map"
                    onClick = {
                        () => handleMapView(row)
                    } >
                    <
                    Place / >
                    <
                    /IconButton> <
                    /TableCell> <
                    /TableRow>
                );
            })
        } <
        /TableBody> <
        /Table>

        <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25, 50, 100]
        }
        component = "div"
        count = {
            filteredData.length
        }
        rowsPerPage = {
            rowsPerPage
        }
        page = {
            page
        }
        onPageChange = {
            handleChangePage
        }
        onRowsPerPageChange = {
            handleChangeRowsPerPage
        }
        labelRowsPerPage = "Rows per page:"
        labelDisplayedRows = {
            ({
                from,
                to,
                count
            }) =>
            `${from}-${to} of ${count}`
        }
        showFirstButton showLastButton /
        >
        <
        /TableContainer>

        <
        Dialog open = {
            levelPopupOpen
        }
        onClose = {
            handleCloseLevelPopup
        }
        maxWidth = "md"
        fullWidth >
        <
        DialogTitle sx = {
            {
                bgcolor: "#00416A",
                color: "#fff"
            }
        } >
        Add Construction Level <
        Typography variant = "subtitle2"
        sx = {
            {
                color: "#e0e0e0"
            }
        } > {
            selectedRow ? .name
        } - {
            selectedRow ? .project
        } <
        /Typography> <
        /DialogTitle>

        <
        DialogContent > { /* 2x2 Grid Container wrapper */ } <
        Grid container spacing = {
            3
        }
        sx = {
            {
                pt: 2
            }
        } >

        { /* ROW 1 / COL 1: Level Selection */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        FormControl fullWidth required >
        <
        InputLabel > Construction Level < /InputLabel> <
        Select value = {
            levelFormData.level
        }
        onChange = {
            (e) => setLevelFormData(p => ({ ...p,
                level: e.target.value
            }))
        }
        label = "Construction Level"
        disabled = {
            true
        } >
        {
            LEVELS.map((level) => ( <
                MenuItem key = {
                    level
                }
                value = {
                    level
                } > {
                    level
                } < /MenuItem>
            ))
        } <
        /Select> <
        Typography variant = "caption"
        color = "textSecondary"
        sx = {
            {
                mt: 0.5
            }
        } >
        Level is automatically selected based on the button clicked <
        /Typography> <
        /FormControl> <
        /Grid>

        { /* ROW 1 / COL 2: Date Picker */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField type = "date"
        label = "Date"
        fullWidth value = {
            levelFormData.date
        }
        onChange = {
            (e) => setLevelFormData(p => ({ ...p,
                date: e.target.value
            }))
        }
        InputLabelProps = {
            {
                shrink: true
            }
        }
        inputProps = {
            {
                max: new Date().toISOString().split("T")[0]
            }
        }
        required /
        >
        <
        /Grid>

        { /* ROW 2 / COL 1: Quantity with Quick Increments */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >


        <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 1,
                flexWrap: 'wrap'
            }
        } > {
            [0.01, 0.05, 0.1, 0.5, 1].map((val) => ( <
                Button key = {
                    val
                }
                variant = "outlined"
                size = "small"
                onClick = {
                    () => handleIncrement(val)
                }
                sx = {
                    {
                        minWidth: '45px',
                        px: 0.5,
                        py: 0
                    }
                } >
                +{
                    val
                } <
                /Button>
            ))
        } <
        /Box>

        <
        TextField type = "number"
        fullWidth value = {
            levelFormData.completed_qty
        }
        onChange = {
            handleQuantityChange
        }
        inputProps = {
            {
                min: currentQty,
                max: maxInputAllowed,
                step: 0.01
            }
        }
        helperText = {
            `Range: ${currentQty.toFixed(2)} - ${maxInputAllowed.toFixed(2)} km`
        }
        required /
        >
        <
        Typography variant = "subtitle2"
        sx = {
            {
                mb: 1
            }
        } >
        Completed Qty(km) < span style = {
            {
                color: "red"
            }
        } > * < /span>{" "} <
        Typography component = "span"
        variant = "caption"
        color = "text.secondary" >
        (Current: < strong > {
            currentQty.toFixed(2)
        } < /strong> | Max: <strong>{maxInputAllowed.toFixed(2)}</strong > ) <
        /Typography> <
        /Typography> <
        /Grid>


        { /* ROW 2 / COL 2: Inspector Selection */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        FormControl fullWidth required sx = {
            {
                mt: {
                    xs: 0,
                    md: 3.5
                }
            }
        } >
        <
        InputLabel > Inspector < /InputLabel> <
        Select value = {
            levelFormData.inspector
        }
        onChange = {
            (e) => setLevelFormData(p => ({ ...p,
                inspector: e.target.value
            }))
        }
        label = "Inspector" >
        <
        MenuItem value = "" > Select Inspector < /MenuItem> {
            inspectors && inspectors.map(i => ( <
                MenuItem key = {
                    i.id
                }
                value = {
                    String(i.id)
                } > {
                    i.full_name
                } < /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        /Grid>

        { /* FOOTER ROWS: Photo and Remarks span full-width cleanly below the core grid */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        Typography variant = "subtitle2"
        gutterBottom > Previous Photo Reference < /Typography> {
            hasPreviousPhoto ? ( <
                Box sx = {
                    {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2
                    }
                } >
                <
                Avatar src = {
                    getDisplayPhoto(levelFormData.previousPhoto || levelFormData.previousPhotoFile)
                }
                sx = {
                    {
                        width: 60,
                        height: 60,
                        cursor: "pointer"
                    }
                }
                onClick = {
                    () => window.open(getDisplayPhoto(levelFormData.previousPhoto || levelFormData.previousPhotoFile), "_blank")
                }
                /> <
                Typography variant = "caption"
                color = "textSecondary" > Previous submission < /Typography> <
                /Box>
            ) : ( <
                Typography variant = "caption"
                color = "textSecondary"
                sx = {
                    {
                        display: 'block',
                        mb: 2
                    }
                } > None available < /Typography>
            )
        } <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        Typography variant = "subtitle2"
        sx = {
            {
                color: 'red',
                fontWeight: 'bold'
            }
        } > New Photo Required * < /Typography> {
            hasNewPhoto ? ( <
                Box sx = {
                    {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }
                } >
                <
                Avatar src = {
                    getDisplayPhoto(levelFormData.photo || levelFormData.photoFile)
                }
                sx = {
                    {
                        width: 60,
                        height: 60
                    }
                }
                /> <
                Button size = "small"
                color = "error"
                onClick = {
                    () => setLevelFormData(p => ({ ...p,
                        photo: null,
                        photoFile: null
                    }))
                } > Remove < /Button> <
                /Box>
            ) : ( <
                Box sx = {
                    {
                        p: 1,
                        border: '1px dashed #ff4444',
                        borderRadius: 1,
                        bgcolor: '#fff5f5',
                        textAlign: 'center'
                    }
                } >
                <
                Typography variant = "caption"
                color = "error"
                fontWeight = "bold" > ⚠️Upload a new image < /Typography> <
                /Box>
            )
        } <
        Button component = "label"
        variant = "contained"
        color = {
            hasNewPhoto ? "success" : "primary"
        }
        startIcon = { < PhotoCamera / >
        }
        fullWidth size = "small"
        sx = {
            {
                mt: 1
            }
        } > {
            hasNewPhoto ? "Change Photo" : "Upload New Photo"
        } <
        input hidden type = "file"
        accept = "image/*"
        onChange = {
            (e) => e.target.files[0] && handleImageUpload(e.target.files[0], (f) => setLevelFormData(p => ({ ...p,
                photo: f,
                photoFile: f
            })))
        }
        /> <
        /Button> <
        /Grid>

        <
        Grid item xs = {
            12
        } >
        <
        TextField label = "Remarks"
        fullWidth multiline rows = {
            2
        }
        value = {
            levelFormData.remarks
        }
        onChange = {
            (e) => setLevelFormData(p => ({ ...p,
                remarks: e.target.value
            }))
        }
        placeholder = "Enter any remarks" /
        >
        <
        /Grid> <
        /Grid> <
        /DialogContent>

        <
        DialogActions sx = {
            {
                p: 2,
                gap: 1
            }
        } >
        <
        Button onClick = {
            handleCloseLevelPopup
        }
        color = "inherit" > Cancel < /Button> <
        Button onClick = {
            handleLevelSubmit
        }
        variant = "contained"
        color = "primary"
        disabled = {
            submitting || !hasNewPhoto
        } > {
            submitting ? "Saving..." : "Save Level"
        } <
        /Button> <
        /DialogActions> <
        /Dialog> <
        />
    );
}

export default RoadTable;