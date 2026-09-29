import React, {
    useState
} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RouterIcon from "@mui/icons-material/Router";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {
    useDispatch
} from "react-redux";
import {
    PatchElectricalMasterData
} from "../../../Redux/MasterData/masterAction";
import {
    PatchPoleLineMaterialData
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";

// Column configurations
const COLUMN_CONFIGS = {
    L1: [
        "pole_number",
        "contractor_name", // ✅ Add contractor_name instead of contractor
        "easting",
        "northing",
        "turbine_location",
        "land_type",
        "survey_no",
        "village",
        "pole_type",
        "span",
        "crossing_type",
        "pole_height",
        "start_date",
        "line_crossing_details",
        "photo",
        "file", // ✅ NEW
    ],
    L2: [
        "pole_number",
        "pole_type",
        "materials",
        "fab_mounting_date",
        "fab_mounting_photo",
    ],
    L3: [
        "pole_number",
        "pole_type",
        "stringing",
        "stringing_date",
        "jumper_binding",
        "earthing",
        "conductor_make",
        "conductor_binding",
        "drum_serial_no",
        "stringing_photo",
        "earthing_photo",
        "jumper_binding_photo",
        "insulator_alignment_photo",
    ],
    FINAL: [
        "pole_number",
        "cold_commissioning",
        "start_date",
        "photo",
        "joint_inspection_report",
    ],
};

const MCOH_L1_COLUMNS = [
    "pole_number",
    "contractor_name", // ✅ Add contractor_name instead of contractor
    "easting",
    "northing",

    "land_type",
    "survey_no",
    "village",
    "tower_type", // ✅ pole_type ki jagah
    "extension", // ✅ New Column

    "span",
    "crossing_type",

    // "start_date",
    "foundation_date",
    "line_crossing_details",
    "photo",
    "file", // ✅ NEW
];

const MCOH_L2_COLUMNS = [
    "pole_number",
    "bottom",
    "top",
    "cross_arm",
    "start_date",
    "fab_mounting_photo",
];

const COLUMN_LABELS = {
    pole_number: "Pole No.",
    tower_type: "Tower Type",
    extension: "Extension",

    bottom: "Bottom",
    top: "Top",
    cross_arm: "Cross Arm",
    tower_erection_date: "Tower Erection Date",

    contractor_name: "Contractor", // ✅ Add contractor label
    easting: "Easting",
    northing: "Northing",
    turbine_location: "Turbine",
    land_type: "Land Type",
    survey_no: "Survey No.",
    village: "Village",
    pole_type: "Pole Type",
    span: "Span (m)",
    crossing_type: "Crossing",
    pole_height: "Pole Height",
    start_date: "Date",
    line_crossing_details: "Crossing Details",
    photo: "Photo",
    file: "Agreement / Document",
    materials: "Materials",
    fab_mounting_date: "FAB Date",
    fab_mounting_photo: "Fab Mounting Photo",
    stringing: "Stringing",
    stringing_date: "Stringing Date",
    jumper_binding: "Jumper Binding",
    earthing: "Earthing",
    conductor_make: "Conductor Make",
    conductor_binding: "Conductor Binding",
    drum_serial_no: "Drum Serial No.",
    stringing_photo: "Stringing Photo",
    earthing_photo: "Earthing Photo",
    jumper_binding_photo: "Jumper Binding Photo",
    insulator_alignment_photo: "Insulator Alignment Photo",
    cold_commissioning: "Cold Commissioning",
    joint_inspection_report: "Joint Inspection Report",
    issues: "Safety & Quality",

    action: "Action",
    status: "Status",
};

const PoleDetailsDialog = ({
    open,
    onClose,
    selectedLine,
    currentLevel,
    lineType,
    onApproveSuccess,
    sqlist,
}) => {
    const dispatch = useDispatch();
    // const [approving, setApproving] = useState(false);

    const [approvingPoleId, setApprovingPoleId] = useState(null);
    const [approvingAll, setApprovingAll] = useState(false);
    const [localPoles, setLocalPoles] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // helper function

    //   const getPoleIssues = (poleId) => {
    //     return sqlist.filter(
    //         (item) =>
    //             Number(item.pole) === Number(poleId)
    //     );
    // };

    const getPoleIssues = (poleId) => {
        return sqlist.filter(
            (item) =>
            Number(item.pole) === Number(poleId) &&
            (item.level || "-") === currentLevel,
        );
    };

    const hasOpenIssues = (poleId) => {
        return getPoleIssues(poleId).some(
            (item) => item.status ? .toLowerCase() !== "closed",
        );
    };

    // Filter poles based on current level - runs when dialog opens or data changes
    React.useEffect(() => {
        if (!selectedLine ? .pole_details) {
            setLocalPoles([]);
            return;
        }

        const submissionFieldMap = {
            L1: "submitted_l1_at",
            L2: "submitted_l2_at",
            L3: "submitted_l3_at",
            FINAL: "submitted_at",
        };

        const approvalFieldMap = {
            L1: "approved_l1_at",
            L2: "approved_l2_at",
            L3: "approved_l3_at",
            FINAL: "approved_at",
        };

        const submissionField = submissionFieldMap[currentLevel];
        const approvalField = approvalFieldMap[currentLevel];

        if (!submissionField) {
            setLocalPoles(selectedLine.pole_details);
            return;
        }

        // Filter poles that have submission and add approval status
        const filtered = selectedLine.pole_details
            .filter((pole) => !!pole[submissionField])
            .map((pole) => ({
                ...pole,
                _isApproved: !!pole[approvalField],
                _approvalField: approvalField,
            }));

        setLocalPoles(filtered);
    }, [selectedLine, currentLevel]);

    const getColumnLabel = (key) => {
        if (currentLevel === "L1" && lineType ? .toLowerCase().includes("mcoh")) {
            switch (key) {
                case "pole_number":
                    return "Tower No.";

                case "foundation_date":
                    return "Foundation Date";

                case "line_crossing_details":
                    return "Foundation Details";

                default:
                    return COLUMN_LABELS[key] || key;
            }
        }

        // ✅ MCOH L2
        if (currentLevel === "L2" && lineType ? .toLowerCase().includes("mcoh")) {
            switch (key) {
                case "pole_number":
                    return "Tower No.";

                case "fab_mounting_photo":
                    return "Photo";

                default:
                    return COLUMN_LABELS[key] || key;
            }
        }

        // ✅ MCOH L2
        if (currentLevel === "L3" && lineType ? .toLowerCase().includes("mcoh")) {
            switch (key) {
                case "pole_number":
                    return "Tower No.";

                default:
                    return COLUMN_LABELS[key] || key;
            }
        }

        return COLUMN_LABELS[key] || key;
    };

    // Check if all poles are already approved
    const allApproved =
        localPoles.length > 0 && localPoles.every((p) => p._isApproved);
    const hasPendingPoles = localPoles.some((p) => !p._isApproved);

    // const columns = COLUMN_CONFIGS[currentLevel] || COLUMN_CONFIGS.L1;

    let columns;

    if (lineType ? .toLowerCase().includes("mcoh")) {
        if (currentLevel === "L1") {
            columns = MCOH_L1_COLUMNS;
        } else if (currentLevel === "L2") {
            columns = MCOH_L2_COLUMNS;
        } else if (currentLevel === "L3") {
            // ✅ MCOH L3 -> remove Pole Type only
            columns = COLUMN_CONFIGS.L3.filter((col) => col !== "pole_type");
        } else {
            columns = COLUMN_CONFIGS[currentLevel] || COLUMN_CONFIGS.L1;
        }
    } else {
        columns = COLUMN_CONFIGS[currentLevel] || COLUMN_CONFIGS.L1;
    }
    const showSnackbar = (message, severity) => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const formatValue = (value) => {
        if (!value || value === "null" || value === "NULL" || value === "0")
            return "-";
        return value;
    };

    const isComplete = (value, type = "boolean") => {
        if (type === "commissioning")
            return value === "1" || value === 1 || value === true;
        return value === true || value === 1 || value === "1";
    };

    const renderImage = (src, alt) => {
        if (!src || src === "null" || src === "NULL") return "-";
        return ( <
            Box component = "img"
            src = {
                src
            }
            alt = {
                alt
            }
            onClick = {
                () => window.open(src, "_blank")
            }
            sx = {
                {
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": {
                        transform: "scale(1.05)"
                    },
                }
            }
            />
        );
    };

    const renderStatus = (value, label) => {
        const done = isComplete(
            value,
            label === "cold_commissioning" ? "commissioning" : "boolean",
        );
        return ( <
            Chip label = {
                done ? "Done" : "Pending"
            }
            size = "small"
            color = {
                done ? "success" : "warning"
            }
            variant = {
                done ? "filled" : "outlined"
            }
            sx = {
                {
                    minWidth: 70
                }
            }
            />
        );
    };

    const renderMaterials = (materials) => {
        if (!materials || !Array.isArray(materials) || materials.length === 0) {
            return "-";
        }

        const materialList = materials.map(
            (item) => `${item.name} (${item.quantity})`,
        );

        return materialList.join(", ");
    };

    const handleApprovePole = async (pole) => {
        if (pole._isApproved) {
            showSnackbar("Pole already approved", "warning");
            return;
        }

        const approvalFieldMap = {
            L1: "approved_l1_at",
            L2: "approved_l2_at",
            L3: "approved_l3_at",
        };

        const approvalField = approvalFieldMap[currentLevel];

        setApprovingPoleId(pole.id);

        try {
            // setApproving(true);

            await dispatch(
                PatchPoleLineMaterialData(pole.id, {
                    [approvalField]: new Date().toISOString(),
                }),
            );

            setLocalPoles((prev) =>
                prev.map((p) =>
                    p.id === pole.id ?
                    {
                        ...p,
                        _isApproved: true,
                        [approvalField]: new Date().toISOString(),
                    } :
                    p,
                ),
            );

            showSnackbar(`Pole ${pole.pole_number} approved successfully`, "success");

            await onApproveSuccess ? .();
        } catch (err) {
            showSnackbar("Approval failed", "error");
        } finally {
            // setApproving(false);
            setApprovingPoleId(null);
        }
    };

    // ✅ Handle Approve All Poles
    const handleApproveAll = async () => {
        // console.log("Pending Poles :", pendingPoles);
        if (allApproved) {
            showSnackbar("All poles are already approved!", "warning");
            return;
        }

        // setApproving(true);
        setApprovingAll(true);

        try {
            // For FINAL level - approve at LINE level
            if (currentLevel === "FINAL") {
                await dispatch(
                    PatchElectricalMasterData(selectedLine.id, {
                        approved_final_at: new Date().toISOString(),
                    }),
                );

                showSnackbar(
                    `✅ Final level approved successfully for ${selectedLine.line_name}`,
                    "success",
                );

                setTimeout(() => {
                    onClose();
                    if (onApproveSuccess) {
                        onApproveSuccess();
                    }
                }, 1500);
            } else {
                // For L1, L2, L3 - approve each pole individually
                const approvalFieldMap = {
                    L1: "approved_l1_at",
                    L2: "approved_l2_at",
                    L3: "approved_l3_at",
                };

                const approvalField = approvalFieldMap[currentLevel];
                // const pendingPoles = localPoles.filter((p) => !p._isApproved);

                const pendingPoles = localPoles.filter(
                    (p) => !p._isApproved && !hasOpenIssues(p.id),
                );

                const blockedPoles = localPoles.filter(
                    (p) => !p._isApproved && hasOpenIssues(p.id),
                );

                if (pendingPoles.length === 0) {
                    if (blockedPoles.length > 0) {
                        showSnackbar(
                            "Cannot approve. All pending poles have open Safety/Quality issues.",
                            "warning",
                        );
                    } else {
                        showSnackbar("No pending poles to approve!", "warning");
                    }

                    setApprovingAll(false);
                    return;
                }

                // Approve each pending pole
                const approvePromises = pendingPoles.map((pole) =>
                    dispatch(
                        PatchPoleLineMaterialData(pole.id, {
                            [approvalField]: new Date().toISOString(),
                        }),
                    ),
                );

                await Promise.all(approvePromises);

                if (blockedPoles.length > 0) {
                    showSnackbar(
                        `${pendingPoles.length} poles approved. ${blockedPoles.length} pole(s) skipped because Safety/Quality issues are still open.`,
                        "warning",
                    );
                } else {
                    showSnackbar(
                        `✅ ${pendingPoles.length} poles approved successfully.`,
                        "success",
                    );
                }

                // Update local state immediately
                const updatedPoles = localPoles.map((pole) => {
                    if (!pole._isApproved && !hasOpenIssues(pole.id)) {
                        return {
                            ...pole,
                            _isApproved: true,
                            [approvalField]: new Date().toISOString(),
                        };
                    }

                    return pole;
                });

                setLocalPoles(updatedPoles);

                // showSnackbar(
                //   `✅ ${pendingPoles.length} poles approved successfully for ${currentLevel}`,
                //   "success",
                // );

                await onApproveSuccess ? .();
            }
        } catch (error) {
            // console.error("Approval failed:", error);
            showSnackbar(
                error.message || "Approval failed. Please try again.",
                "error",
            );
            setApprovingAll(false);
        }
    };

    const getCellValue = (pole, columnKey) => {
        const value = pole[columnKey];

        if (columnKey === "turbine_location") {
            return pole ? .turbine_location ? .location_no || "-";
        }

        if (columnKey === "materials") {
            return renderMaterials(value);
        }

        if (columnKey === "pole_type") {
            if (!value) return "-";
            return value
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        }

        // Show approval status for each pole
        if (columnKey === "status") {
            return ( <
                Chip label = {
                    pole._isApproved ? "Approved" : "Pending"
                }
                size = "small"
                color = {
                    pole._isApproved ? "success" : "warning"
                }
                sx = {
                    {
                        fontWeight: 600,
                        minWidth: 80
                    }
                }
                />
            );
        }

        if (columnKey === "issues") {
            const issues = getPoleIssues(pole.id);

            if (!issues.length) {
                return <Chip label = "No Issues"
                color = "success"
                size = "small" / > ;
            }

            return ( <
                Box sx = {
                    {
                        minWidth: 250
                    }
                } > {
                    issues.map((issue) => ( <
                        Box key = {
                            issue.id
                        }
                        sx = {
                            {
                                border: "1px solid #ddd",
                                borderRadius: 1,
                                p: 1,
                                mb: 1,
                            }
                        } >
                        <
                        Typography fontSize = {
                            12
                        } >
                        <
                        b > {
                            issue.record_type
                        } < /b> <
                        /Typography>

                        <
                        Typography fontSize = {
                            12
                        } > Severity: {
                            issue.severity
                        } < /Typography>

                        <
                        Typography fontSize = {
                            12
                        } >
                        Raised By: {
                            issue.raised_name
                        } <
                        /Typography>

                        <
                        Typography fontSize = {
                            12
                        } > {
                            issue.note_details
                        } < /Typography>

                        <
                        Chip size = "small"
                        color = {
                            issue.status === "closed" ? "success" : "error"
                        }
                        label = {
                            issue.status
                        }
                        /> <
                        /Box>
                    ))
                } <
                /Box>
            );
        }

        if (columnKey === "action") {
            return pole._isApproved ? ( <
                Chip label = "Approved"
                color = "success"
                size = "small" / >
            ) : (
                // <Button
                //   variant="contained"
                //   size="small"
                //   color="success"
                //   disabled={approvingPoleId === pole.id || approvingAll}
                //   onClick={() => handleApprovePole(pole)}
                // >

                <
                Button variant = "contained"
                size = "small"
                color = "success"
                disabled = {
                    approvingPoleId === pole.id ||
                    approvingAll ||
                    hasOpenIssues(pole.id)
                }
                onClick = {
                    () => handleApprovePole(pole)
                } >
                {
                    approvingPoleId === pole.id ? ( <
                        CircularProgress size = {
                            18
                        }
                        color = "inherit" / >
                    ) : (
                        "Approve"
                    )
                } <
                /Button>
            );
        }

        if (columnKey === "file") {
            if (!value) return "-";

            return ( <
                Button size = "small"
                variant = "outlined"
                href = {
                    value
                }
                target = "_blank"
                rel = "noopener noreferrer" >
                View <
                /Button>
            );
        }

        if (
            [
                "photo",
                "fab_mounting_photo",
                "stringing_photo",
                "joint_inspection_report",
                "earthing_photo",
                "jumper_binding_photo",
                "insulator_alignment_photo",
            ].includes(columnKey)
        ) {
            return renderImage(value, columnKey);
        }

        // ✅ Fix: For L3 Jumper Binding - show '-' if no data, not 'Pending'
        if (columnKey === "jumper_binding") {
            if (!value ||
                value === "null" ||
                value === "NULL" ||
                value === "0" ||
                value === ""
            ) {
                return "-";
            }
            return renderStatus(value, columnKey);
        }

        if (columnKey === "stringing") {
            if (!value ||
                value === "null" ||
                value === "NULL" ||
                value === "0" ||
                value === ""
            ) {
                return "-";
            }
            return renderStatus(value, columnKey);
        }

        if (columnKey === "conductor_binding") {
            if (!value ||
                value === "null" ||
                value === "NULL" ||
                value === "0" ||
                value === ""
            ) {
                return "-";
            }
            return renderStatus(value, columnKey);
        }

        if (
            [
                "stringing",
                "earthing",
                "conductor_binding",
                "cold_commissioning",
                "bottom",
                "top",
                "cross_arm",
            ].includes(columnKey)
        ) {
            return renderStatus(value, columnKey);
        }

        return formatValue(value);
    };

    // Get columns for table (add Status column for L1, L2, L3)
    const getDisplayColumns = () => {
        const cols = [...columns];
        if (currentLevel !== "FINAL") {
            cols.push("status");
            cols.push("issues"); // <-- yaha add
            cols.push("action"); // <-- NEW
        }
        return cols;
    };

    const displayColumns = getDisplayColumns();

    return ( <
        Dialog open = {
            open
        }
        onClose = {
            onClose
        }
        fullWidth maxWidth = "xl"
        PaperProps = {
            {
                sx: {
                    borderRadius: 2,
                    maxHeight: "85vh"
                }
            }
        } >
        <
        DialogTitle sx = {
            {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #e0e0e0",
                py: 1.5,
                bgcolor: "primary.main",
                color: "white",
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
        RouterIcon color = "inherit" / >
        <
        Typography variant = "h6" > {
            selectedLine ? .line_name || "Pole Details"
        } - {
            currentLevel
        } <
        /Typography> <
        Chip label = {
            `${localPoles.filter((p) => p._isApproved).length} / ${localPoles.length} Approved`
        }
        size = "small"
        color = {
            allApproved ? "success" : "warning"
        }
        sx = {
            {
                ml: 1
            }
        }
        /> <
        /Box> <
        Box sx = {
            {
                display: "flex",
                gap: 1,
                alignItems: "center"
            }
        } > { /* Approve All Button */ } {
            hasPendingPoles && !allApproved && ( <
                Button variant = "contained"
                startIcon = { < DoneAllIcon / >
                }
                onClick = {
                    handleApproveAll
                }
                // disabled={approving}

                disabled = {
                    approvingAll
                }
                sx = {
                    {
                        bgcolor: "white",
                        color: "primary.main",
                        "&:hover": {
                            bgcolor: "#f0f0f0"
                        },
                        "&:disabled": {
                            bgcolor: "rgba(255,255,255,0.3)",
                            color: "white",
                        },
                    }
                } >
                {
                    approvingPoleId ? ( <
                        CircularProgress size = {
                            20
                        }
                        color = "primary" / >
                    ) : currentLevel === "FINAL" ? (
                        "Approve Final"
                    ) : (
                        `Approve All (${localPoles.filter((p) => !p._isApproved).length})`
                    )
                } <
                /Button>
            )
        } {
            allApproved && ( <
                Chip label = "✓ All Approved"
                color = "success"
                sx = {
                    {
                        bgcolor: "#4caf50",
                        color: "white",
                        fontWeight: 700
                    }
                }
                />
            )
        } <
        IconButton onClick = {
            onClose
        }
        sx = {
            {
                color: "white"
            }
        } >
        <
        CloseIcon / >
        <
        /IconButton> <
        /Box> <
        /DialogTitle>

        <
        DialogContent sx = {
            {
                p: 2
            }
        } > { /* Snackbar */ } <
        Snackbar open = {
            snackbar.open
        }
        autoHideDuration = {
            3000
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        }
        anchorOrigin = {
            {
                vertical: "top",
                horizontal: "center"
            }
        } >
        <
        Alert onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        }
        severity = {
            snackbar.severity
        }
        variant = "filled" >
        {
            snackbar.message
        } <
        /Alert> <
        /Snackbar>

        {
            localPoles.length === 0 ? ( <
                Box sx = {
                    {
                        textAlign: "center",
                        py: 5
                    }
                } >
                <
                Typography color = "text.secondary" >
                No {
                    currentLevel
                }
                submitted poles found
                for {
                    " "
                } {
                    selectedLine ? .line_name
                } <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                sx = {
                    {
                        mt: 1
                    }
                } >
                Only poles with {
                    currentLevel
                }
                submission status are shown here. <
                /Typography> <
                /Box>
            ) : ( <
                TableContainer component = {
                    Paper
                }
                variant = "outlined" >
                <
                Table size = "small"
                stickyHeader >
                <
                TableHead >
                <
                TableRow sx = {
                    {
                        backgroundColor: "#00416a"
                    }
                } > {
                    displayColumns.map((col) => ( <
                        TableCell key = {
                            col
                        }
                        sx = {
                            {
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                                color: "black",
                            }
                        } >
                        { /* {COLUMN_LABELS[col] || col} */ }

                        {
                            getColumnLabel(col)
                        } <
                        /TableCell>
                    ))
                } <
                /TableRow> <
                /TableHead> <
                TableBody > {
                    localPoles.map((pole, idx) => ( <
                        TableRow key = {
                            pole.id || idx
                        }
                        hover sx = {
                            {
                                backgroundColor: pole._isApproved ?
                                    "rgba(76, 175, 80, 0.05)" :
                                    "inherit",
                            }
                        } >
                        {
                            displayColumns.map((col) => ( <
                                TableCell key = {
                                    col
                                } > {
                                    getCellValue(pole, col)
                                } < /TableCell>
                            ))
                        } <
                        /TableRow>
                    ))
                } <
                /TableBody> <
                /Table> <
                /TableContainer>
            )
        }

        {
            currentLevel === "FINAL" && selectedLine ? .commissioning_photo && ( <
                Box sx = {
                    {
                        mt: 2,
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: 1
                    }
                } >
                <
                Typography variant = "subtitle2"
                gutterBottom >
                Commissioning Photo <
                /Typography> {
                    renderImage(selectedLine.commissioning_photo, "Commissioning")
                } <
                /Box>
            )
        } <
        /DialogContent> <
        /Dialog>
    );
};

export default PoleDetailsDialog;