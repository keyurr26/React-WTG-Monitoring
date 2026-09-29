import React, {
    useState,
    useEffect
} from "react";
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    CircularProgress,
    Button,
    Chip,
    Alert,
    Snackbar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
    useDispatch
} from "react-redux";
import {
    PatchElectricalMasterData
} from "../../../Redux/MasterData/masterAction";
import PoleDetailsDialog from "./PoleDetailsDialog";

// Level configuration
const LEVEL_CONFIG = {
    L1: {
        key: "l1",
        label: "L1",
        approvalField: "approved_l1_at",
        submitField: "submitted_l1_at",
    },
    L2: {
        key: "l2",
        label: "L2",
        approvalField: "approved_l2_at",
        submitField: "submitted_l2_at",
    },
    L3: {
        key: "l3",
        label: "L3",
        approvalField: "approved_l3_at",
        submitField: "submitted_l3_at",
    },
    FINAL: {
        key: "final",
        label: "FINAL",
        approvalField: "approved_at", // ✅ Yahan approved_at
        submitField: "submitted_at",
    },
};

// Column definitions for each level
const COLUMNS = {
    base: [{
            label: "Line Name",
            key: "line_name"
        },
        {
            label: "Line Type",
            key: "line_type"
        },
        {
            label: "KM",
            key: "km"
        },
        // { label: "No Of Line", key: "no_of_line" },
    ],
    final: [{
            label: "Total Circuit",
            key: "total_circuit"
        },
        {
            label: "Status",
            key: "status"
        },
        {
            label: "CC Line",
            key: "cc_line"
        },
        {
            label: "Commissioning Date",
            key: "start_date"
        },
        {
            label: "Turbine Locations",
            key: "turbine_locations"
        },
        {
            label: "Project",
            key: "project_name"
        },
        {
            label: "Windfarm",
            key: "windfarm_name"
        },
        {
            label: "Cluster",
            key: "cluster_name"
        },
    ],
    suffix: [{
            label: "Submission Date",
            key: "submitted_at"
        },
        {
            label: "Photo",
            key: "photo"
        },
        {
            label: "Joint Report",
            key: "joint_inspection_report"
        },
    ],
};

const ElectricalBase = ({
    nestedData = {},
    level,
    loading,
    onApproveSuccess,
    sqlist = [],

}) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedLine, setSelectedLine] = useState(null);
    const [approveLoading, setApproveLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        if (!open || !selectedLine) return;

        if (nestedData ? .id === selectedLine.id) {
            setSelectedLine(nestedData);
        }
    }, [nestedData, open, selectedLine]);

    const config = LEVEL_CONFIG[level];
    const status = {
        isSubmitted: !!nestedData ? .[config ? .submitField],
        isApproved: !!nestedData ? .[config ? .approvalField],
        submittedDate: nestedData ? .[config ? .submitField],
        approvedDate: nestedData ? .[config ? .approvalField],
    };

    const approvalFieldMap = {
        L1: "approved_l1_at",
        L2: "approved_l2_at",
        L3: "approved_l3_at",
    };

    const totalPoleCount =
        level !== "FINAL" ? nestedData ? .pole_details ? .length || 0 : 0;

    const approvedPoleCount =
        level !== "FINAL" ?
        nestedData ? .pole_details ? .filter(
            (pole) => !!pole[approvalFieldMap[level]],
        ).length || 0 :
        0;

    const handleView = (row) => {
        setSelectedLine(row);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    // ✅ FINAL level approval - patches approved_at
    const handleApproveFinal = async () => {
        if (status.isApproved) {
            showSnackbar("Final is already approved!", "warning");
            return;
        }

        setApproveLoading(true);
        try {
            // ✅ Patch approved_at (jaise aap chahte hain)
            await dispatch(
                PatchElectricalMasterData(nestedData.id, {
                    approved_at: new Date().toISOString(), // ✅ Yahan approved_at
                }),
            );

            showSnackbar(
                `✅ Final approved successfully for ${nestedData.line_name}`,
                "success",
            );

            await onApproveSuccess ? .();
        } catch (error) {
            showSnackbar(
                error.message || "Approval failed. Please try again.",
                "error",
            );
        } finally {
            setApproveLoading(false);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const renderTurbineLocations = (locations) => {
        if (!locations ? .length) return "-";
        return ( <
            Box sx = {
                {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    maxWidth: 250
                }
            } > {
                locations.map((location, idx) => ( <
                    Chip key = {
                        location.id
                    }
                    label = {
                        location.location_no
                    }
                    size = "small"
                    variant = "outlined"
                    sx = {
                        {
                            fontSize: 11,
                            height: 24
                        }
                    }
                    />
                ))
            } <
            /Box>
        );
    };

    const renderImage = (src) => {
        if (!src) return "-";
        return ( <
            Box component = "img"
            src = {
                src
            }
            onClick = {
                () => window.open(src, "_blank")
            }
            sx = {
                {
                    width: 80,
                    height: 60,
                    objectFit: "contain",
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

    const renderPDF = (url) => {
        if (!url) return "-";
        return ( <
            Button size = "small"
            startIcon = { < PictureAsPdfIcon / >
            }
            href = {
                url
            }
            target = "_blank"
            sx = {
                {
                    textTransform: "none",
                    fontSize: 12
                }
            } >
            View <
            /Button>
        );
    };

    const getCellValue = (item, columnKey) => {
        const value = item[columnKey];

        switch (columnKey) {
            case "km":
                return value ? `${value} km` : "-";
            case "turbine_locations":
                return renderTurbineLocations(value);
            case "photo":
                return renderImage(value);
            case "joint_inspection_report":
                return renderPDF(value);
            case "submitted_at":
                return value ? new Date(value).toLocaleDateString() : "-";
            case "view":
                return ( <
                    IconButton onClick = {
                        () => handleView(item)
                    }
                    size = "small"
                    title = "View Details" >
                    <
                    VisibilityIcon fontSize = "small" / >
                    <
                    /IconButton>
                );
            default:
                return value || "-";
        }
    };

    const getColumns = () => {
        const columns = [...COLUMNS.base];

        if (level === "FINAL") {
            let finalColumns = [...COLUMNS.final];

            const lineType = (nestedData ? .line_type || "").toUpperCase();

            const isDCOH = lineType.startsWith("DCOH");
            const isMCOH = lineType.startsWith("MCOH");

            // Total Circuit only for MCOH
            if (!isMCOH) {
                finalColumns = finalColumns.filter(
                    (col) => col.key !== "total_circuit",
                );
            }

            // DCOH
            if (isDCOH) {
                finalColumns = finalColumns.filter(
                    (col) =>
                    !["status", "turbine_locations", "cluster_name"].includes(col.key),
                );
            }

            // MCOH
            if (isMCOH) {
                finalColumns = finalColumns.filter(
                    (col) => !["turbine_locations", "cluster_name"].includes(col.key),
                );
            }

            columns.push(...finalColumns);
            columns.push(...COLUMNS.suffix);
        } else {
            columns.push(...COLUMNS.suffix);
            columns.push({
                label: "View",
                key: "view"
            });
        }

        return columns;
    };
    // ✅ Check if all poles are approved
    const allPolesApproved =
        nestedData ? .pole_details ? .length > 0 &&
        nestedData.pole_details.every((pole) => {
            const approvalFieldMap = {
                L1: "approved_l1_at",
                L2: "approved_l2_at",
                L3: "approved_l3_at",
                FINAL: "approved_at",
            };
            const field = approvalFieldMap[level];
            return !!pole[field];
        });

    return ( <
        >
        <
        Paper sx = {
            {
                p: 2,
                borderRadius: 2,
                border: status.isApproved ? "2px solid #4caf50" : "1px solid #e0e0e0",
            }
        } >
        { /* Header */ } <
        Box display = "flex"
        justifyContent = "space-between"
        alignItems = "center"
        mb = {
            2
        }
        flexWrap = "wrap"
        gap = {
            1
        } >
        <
        Box >
        <
        Typography variant = "h6"
        fontWeight = "bold" > {
            nestedData ? .line_name || "-"
        } <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        Level: {
            level
        } | Electrical Approval Process <
        /Typography> <
        /Box> <
        Box display = "flex"
        gap = {
            1
        }
        alignItems = "center" > {
            level === "FINAL" ? ( <
                Chip label = {
                    status.isApproved ? "Final Approved" : "Final Pending"
                }
                color = {
                    status.isApproved ? "success" : "warning"
                }
                size = "small" /
                >
            ) : ( <
                Chip label = {
                    `${approvedPoleCount}/${totalPoleCount} Approved`
                }
                color = {
                    totalPoleCount > 0 && approvedPoleCount === totalPoleCount ?
                    "success" :
                        "warning"
                }
                size = "small" /
                >
            )
        }

        {
            allPolesApproved && nestedData.pole_details ? .length > 0 && ( <
                Chip label = "✅ All Poles Approved"
                color = "success"
                size = "small"
                sx = {
                    {
                        fontWeight: 700
                    }
                }
                />
            )
        } <
        /Box> <
        /Box>

        { /* Table */ } <
        TableContainer sx = {
            {
                overflowX: "auto"
            }
        } >
        <
        Table size = "small"
        sx = {
            {
                minWidth: level === "FINAL" ? 1600 : 1000
            }
        } >
        <
        TableHead >
        <
        TableRow sx = {
            {
                backgroundColor: "#00416a"
            }
        } > {
            getColumns().map((col, idx) => ( <
                TableCell key = {
                    idx
                }
                sx = {
                    {
                        color: "white",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                    }
                } >
                {
                    col.label
                } <
                /TableCell>
            ))
        } <
        /TableRow> <
        /TableHead> <
        TableBody > {
            loading ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    getColumns().length
                }
                align = "center"
                sx = {
                    {
                        py: 4
                    }
                } >
                <
                CircularProgress size = {
                    40
                }
                /> <
                /TableCell> <
                /TableRow>
            ) : ( <
                TableRow hover > {
                    getColumns().map((col, idx) => ( <
                        TableCell key = {
                            idx
                        } > {
                            getCellValue(nestedData, col.key)
                        } <
                        /TableCell>
                    ))
                } <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer> <
        /Paper>

        { /* ✅ APPROVAL BUTTON - ONLY FOR FINAL LEVEL */ } {
            level === "FINAL" && ( <
                Box display = "flex"
                justifyContent = "center"
                mt = {
                    2
                }
                mb = {
                    3
                } > {
                    status.isApproved ? ( <
                        Button variant = "contained"
                        disabled sx = {
                            {
                                bgcolor: "#4caf50",
                                color: "white",
                                minWidth: 200,
                                py: 1.5,
                                fontWeight: "bold",
                                fontSize: "1rem",
                            }
                        } >
                        <
                        CheckCircleIcon sx = {
                            {
                                mr: 1
                            }
                        }
                        /> Final Approved <
                        /Button>
                    ) : !status.isSubmitted ? ( <
                        Button variant = "contained"
                        disabled sx = {
                            {
                                bgcolor: "#9e9e9e",
                                minWidth: 200,
                                py: 1.5,
                                fontWeight: "bold",
                                fontSize: "1rem",
                            }
                        } >
                        <
                        PendingIcon sx = {
                            {
                                mr: 1
                            }
                        }
                        /> Awaiting Final Submission <
                        /Button>
                    ) : ( <
                        Button variant = "contained"
                        onClick = {
                            handleApproveFinal
                        }
                        disabled = {
                            approveLoading
                        }
                        sx = {
                            {
                                bgcolor: "#ff9800",
                                "&:hover": {
                                    bgcolor: "#f57c00"
                                },
                                minWidth: 200,
                                py: 1.5,
                                fontWeight: "bold",
                                fontSize: "1rem",
                            }
                        } >
                        {
                            approveLoading ? ( <
                                CircularProgress size = {
                                    24
                                }
                                color = "inherit" / >
                            ) : ( <
                                >
                                <
                                CheckCircleIcon sx = {
                                    {
                                        mr: 1
                                    }
                                }
                                /> Approve Final <
                                />
                            )
                        } <
                        /Button>
                    )
                } <
                /Box>
            )
        }

        { /* Snackbar */ } <
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

        { /* Pole Details Dialog */ } <
        PoleDetailsDialog open = {
            open
        }
        onClose = {
            handleClose
        }
        selectedLine = {
            selectedLine
        }
        currentLevel = {
            level
        }
        lineType = {
            nestedData.line_type
        }
        onApproveSuccess = {
            onApproveSuccess
        }
        sqlist = {
            sqlist
        }
        /> <
        />
    );
};

export default ElectricalBase;