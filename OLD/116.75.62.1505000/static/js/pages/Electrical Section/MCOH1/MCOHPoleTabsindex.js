import React, {
    useState,
    useEffect
} from "react";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    Box,
    Table,
    Typography,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Container,
    TextField,
    IconButton,
    Button,
    CircularProgress,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    alpha,
    Alert,
    Snackbar,
    Checkbox,
} from "@mui/material";

import {
    SendIcon
} from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
    PatchPoleLineMaterialData,
    GetPoleLinesData,
    BulkPatchPoleLineMaterialData,
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";
import {
    GetElectricalMasterData,
    PatchElectricalMasterData,
} from "../../../Redux/MasterData/masterAction";

// Configuration for materials - Bottom, Top, Cross Arm (Now as checkboxes)
const MATERIALS_CONFIG = {
    Bottom: {
        key: "bottom",
        type: "checkbox"
    },
    Top: {
        key: "top",
        type: "checkbox"
    },
    "Cross Arm": {
        key: "cross_arm",
        type: "checkbox"
    },
};

const TABLE_HEADERS = [
    "Action",
    "Tower No",
    "Bottom",
    "Top",
    "Cross Arm",
    "Tower Erection Date",
    "Photo",

    // "Approval"
];

const DynamicPoleTable = ({
        filters
    }) => {
        const dispatch = useDispatch();

        // State declarations
        const [rows, setRows] = useState([]);
        const [selectedLine, setSelectedLine] = useState("");
        // const [refreshTrigger, setRefreshTrigger] = useState(0);
        const [loading, setLoading] = useState(false);
        const [editRowId, setEditRowId] = useState(null);
        const [editData, setEditData] = useState({});
        const [selectedFile, setSelectedFile] = useState(null);
        const [snackbar, setSnackbar] = useState({
            open: false,
            message: "",
            severity: "success",
        });

        const [errors, setErrors] = useState({});

        const [sendingId, setSendingId] = useState(null);
        const [bulkSendSelection, setBulkSendSelection] = useState([]);
        const [bulkMode, setBulkMode] = useState(false);
        const [bulkSending, setBulkSending] = useState(false);

        const {
            getElectricalMaster = []
        } = useSelector((state) => state.masterData);
        const {
            getpoLineData = [], loading: apiLoading
        } = useSelector(
            (state) => state.electricalData,
        );

        const isFilterIncomplete = !filters.project || !filters.windfarm;

        const getHelperText = () => {
            if (!filters.project) return "Select Project first";
            if (!filters.windfarm) return "Select Windfarm to enable lines";
            return "Select a line";
        };


        // =====================================================
        // BULK SEND FOR L2 APPROVAL
        // =====================================================

        const handleBulkSend = async () => {
            // if (bulkSendSelection.length === 0) return;

            try {
                setBulkSending(true);

                const payload = {
                    ids: bulkSendSelection,
                    submitted_l2_at: new Date().toISOString(),
                };

                const response = await dispatch(
                    BulkPatchPoleLineMaterialData(payload)
                );

                setSnackbar({
                    open: true,
                    severity: "success",
                    message: response ? .message ||
                        `${
          response?.updated_count || bulkSendSelection.length
        } towers submitted successfully.`,
                });

                // Clear selection
                setBulkSendSelection([]);
                setBulkMode(false);

                // Refresh latest data
                // await dispatch(GetPoleLinesData());

                // setRefreshTrigger((prev) => prev + 1);

                await dispatch(
                    GetPoleLinesData({
                        project: filters.project,
                        windfarm: filters.windfarm,
                        line_id: selectedLine,
                    })
                );

            } catch (err) {
                console.error("Bulk MCOH L2 submit error:", err);

                setSnackbar({
                    open: true,
                    severity: "error",
                    message: "Bulk submit failed.",
                });
            } finally {
                setBulkSending(false);
            }
        };


        // useEffect(() => {
        //   dispatch(GetElectricalMasterData());
        //   dispatch(GetPoleLinesData());
        // }, [dispatch, refreshTrigger]);


        useEffect(() => {
            dispatch(GetElectricalMasterData());
        }, [dispatch]);

        // Update local rows when Redux data changes
        useEffect(() => {
            if (getpoLineData && getpoLineData.length > 0) {
                setRows(getpoLineData.map((pole) => ({ ...pole,
                    isEdit: false
                })));
            }
        }, [getpoLineData]);

        // useEffect(() => {
        //   setSelectedLine("");
        //   setEditRowId(null);
        //   setEditData({});
        //   setSelectedFile(null);

        //   // Reset ke baad latest data fetch karo
        //   dispatch(GetPoleLinesData());
        // }, [filters.project, filters.windfarm, dispatch]);


        useEffect(() => {
            setSelectedLine("");
            setEditRowId(null);
            setEditData({});
            setSelectedFile(null);
            setRows([]);
            setBulkSendSelection([]);
            setBulkMode(false);
        }, [filters.project, filters.windfarm]);



        useEffect(() => {
            if (!selectedLine || !filters.project || !filters.windfarm) {
                return;
            }

            const fetchLineData = async () => {
                try {
                    await dispatch(
                        GetPoleLinesData({
                            project: filters.project,
                            windfarm: filters.windfarm,
                            line_id: selectedLine,
                        })
                    );
                } catch (error) {
                    console.error("MCOH line data fetch error:", error);
                }
            };

            fetchLineData();
        }, [selectedLine, filters.project, filters.windfarm, dispatch]);

        const getToday = () => new Date().toISOString().split("T")[0];
        const getMinDate = () => {
            const date = new Date();
            date.setDate(date.getDate() - 2);
            return date.toISOString().split("T")[0];
        };

        // Format pole type display
        const formatPoleType = (poleType) => {
            if (!poleType) return "";
            return poleType.replace(/_/g, " ").toUpperCase();
        };

        // Filter line options
        const lineOptions = getElectricalMaster.filter((item) => {
            return (
                (!filters.project || item.project === Number(filters.project)) &&
                (!filters.windfarm || item.windfarm === Number(filters.windfarm)) &&
                item.line_type === "MCOH (Multi Circuit Overhead Line)"
            );
        });

        // Filter poles by selected line
        const filteredPoles =
            selectedLine && rows.length > 0 ?
            rows.filter(
                (item) =>
                Number(item.electrical_line) === Number(selectedLine) &&
                item.approved_l1_at !== null,
            ) :
            [];

        // console.log("filtered poles from mcoh L2",filteredPoles)

        const handleEditClick = (pole) => {
            if (!pole || !pole.id) return;

            setEditRowId(pole.id);
            const initialData = {};

            Object.keys(MATERIALS_CONFIG).forEach((materialName) => {
                const backendKey = MATERIALS_CONFIG[materialName].key;
                // Convert to boolean for checkbox
                initialData[materialName] =
                    pole[backendKey] === true || pole[backendKey] === "true" ? true : false;
            });

            initialData["Tower Erection Date"] = pole.start_date || getToday();
            setEditData(initialData);
            setSelectedFile(null);
        };

        const handleSaveClick = async (pole) => {
            const validationErrors = {};

            const existingPhoto = pole.fab_mounting_photo;

            if (!selectedFile && (!existingPhoto || existingPhoto === "null")) {
                validationErrors.photo = "Photo is required";
            }

            if (!editData["Bottom"]) {
                validationErrors.Bottom = "Required";
            }

            if (!editData["Top"]) {
                validationErrors.Top = "Required";
            }

            if (!editData["Cross Arm"]) {
                validationErrors["Cross Arm"] = "Required";
            }

            if (!editData["Tower Erection Date"]) {
                validationErrors["Tower Erection Date"] = "Required";
            }

            setErrors(validationErrors);

            if (Object.keys(validationErrors).length > 0) {
                setSnackbar({
                    open: true,
                    message: "Please fill all required fields.",
                    severity: "error",
                });
                return;
            }

            setLoading(true);

            try {
                const formData = new FormData();
                let hasChanges = false;

                // Check for changes in checkbox fields
                Object.keys(MATERIALS_CONFIG).forEach((materialName) => {
                    const backendKey = MATERIALS_CONFIG[materialName].key;
                    const currentValue =
                        pole[backendKey] === true || pole[backendKey] === "true" ?
                        true :
                        false;
                    const newValue = editData[materialName] === true;

                    if (currentValue !== newValue) {
                        formData.append(backendKey, newValue ? "true" : "false");
                        hasChanges = true;
                    }
                });

                // Check date change
                if (editData["Tower Erection Date"] !== pole.start_date) {
                    formData.append(
                        "start_date",
                        editData["Tower Erection Date"] || getToday(),
                    );
                    hasChanges = true;
                }

                // Check photo change
                if (selectedFile) {
                    formData.append("fab_mounting_photo", selectedFile);
                    hasChanges = true;
                }

                if (hasChanges) {
                    formData.append("saved_l2_at", new Date().toISOString());
                }

                if (!hasChanges) {
                    setSnackbar({
                        open: true,
                        message: "No changes to save",
                        severity: "info",
                    });
                    setEditRowId(null);
                    setSelectedFile(null);
                    setEditData({});
                    setLoading(false);
                    return;
                }

                await dispatch(PatchPoleLineMaterialData(pole.id, formData));
                // await dispatch(GetPoleLinesData());
                // setRefreshTrigger((prev) => prev + 1);
                await dispatch(
                    GetPoleLinesData({
                        project: filters.project,
                        windfarm: filters.windfarm,
                        line_id: selectedLine,
                    })
                );


                setSnackbar({
                    open: true,
                    message: "Data Saved Successfully",
                    severity: "success",
                });
                setEditRowId(null);
                setSelectedFile(null);
                setEditData({});
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: "Failed to save data",
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        // const handlePoleApproval = async (pole) => {
        //   try {
        //     const formData = new FormData();

        //     formData.append("submitted_l2_at", new Date().toISOString());

        //     await dispatch(PatchPoleLineMaterialData(pole.id, formData));

        //     await dispatch(GetPoleLinesData());

        //     setSnackbar({
        //       open: true,
        //       message: "Pole submitted successfully",
        //       severity: "success",
        //     });
        //   } catch (err) {
        //     setSnackbar({
        //       open: true,
        //       message: "Failed to submit pole",
        //       severity: "error",
        //     });
        //   }
        // };



        const handlePoleApproval = async (pole) => {
            // if (!pole?.id) return;

            try {
                // Loader sirf clicked row par
                setSendingId(pole.id);

                const formData = new FormData();

                formData.append("submitted_l2_at", new Date().toISOString());

                await dispatch(PatchPoleLineMaterialData(pole.id, formData));

                // await dispatch(GetPoleLinesData());

                await dispatch(
                    GetPoleLinesData({
                        project: filters.project,
                        windfarm: filters.windfarm,
                        line_id: selectedLine,
                    })
                );

                setSnackbar({
                    open: true,
                    message: "Tower submitted successfully",
                    severity: "success",
                });
            } catch (err) {
                console.error("MCOH L2 submit error:", err);

                setSnackbar({
                    open: true,
                    message: "Failed to submit tower",
                    severity: "error",
                });
            } finally {
                setSendingId(null);
            }
        };

        const handleCancelClick = () => {
            setEditRowId(null);
            setSelectedFile(null);
            setEditData({});
        };

        const handleCheckboxChange = (materialName, checked) => {
            setEditData((prev) => ({ ...prev,
                [materialName]: checked
            }));

            setErrors((prev) => ({
                ...prev,
                [materialName]: "",
            }));
        };

        const handleDateChange = (value) => {
            setEditData((prev) => ({
                ...prev,
                ["Tower Erection Date"]: value,
            }));

            setErrors((prev) => ({
                ...prev,
                ["Tower Erection Date"]: "",
            }));
        };

        const handleFileChange = (file) => {
            setSelectedFile(file);

            setErrors((prev) => ({
                ...prev,
                photo: "",
            }));
        };




        const handleBulkSendToggle = (pole) => {
            if (!pole ? .id) return;

            // Sirf saved but not submitted/approved rows selectable
            if (
                pole.submitted_l2_at ||
                pole.approved_l2_at ||
                !pole.saved_l2_at
            ) {
                return;
            }

            setBulkSendSelection((prev) => {
                if (prev.includes(pole.id)) {
                    return prev.filter((id) => id !== pole.id);
                }

                return [...prev, pole.id];
            });
        };





        if (apiLoading && rows.length === 0) {
            return ( <
                Box display = "flex"
                justifyContent = "center"
                alignItems = "center"
                minHeight = "400px" >
                <
                CircularProgress / >
                <
                /Box>
            );
        }

        const selectedLineId = selectedLine;
        const selectedLineData = getElectricalMaster.find(
            (item) => Number(item.id) === Number(selectedLine),
        );

        // const isL2Submitted = selectedLineData?.submitted_l3_at !== null;

        // const handleSendForApproval = async () => {
        //   if (!selectedLineId) {
        //     alert("No line selected");
        //     return;
        //   }

        //   try {
        //     const payload = {
        //       submitted_l2_at: new Date().toISOString(),
        //       status: "L2",
        //     };

        //     await dispatch(PatchElectricalMasterData(selectedLineId, payload));
        //     alert("Sent for L2 Approval");
        //     dispatch(GetPoleLinesData());
        //     setRefreshTrigger((prev) => prev + 1);
        //   } catch (error) {
        //     console.error(error);
        //     alert("Failed to send for approval");
        //   }
        // };

        return ( <
            Container maxWidth = "xl"
            sx = {
                {
                    py: 3
                }
            } >
            <
            Snackbar open = {
                snackbar.open
            }
            autoHideDuration = {
                6000
            }
            onClose = {
                () => setSnackbar({ ...snackbar,
                    open: false
                })
            }
            anchorOrigin = {
                {
                    vertical: "top",
                    horizontal: "right"
                }
            } >
            <
            Alert severity = {
                snackbar.severity
            }
            onClose = {
                () => setSnackbar({ ...snackbar,
                    open: false
                })
            } >
            {
                snackbar.message
            } <
            /Alert> <
            /Snackbar>

            <
            Typography variant = "h6"
            mb = {
                2
            }
            fontWeight = {
                600
            } >
            Material Consumption Table <
            /Typography>

            { /* Line Selection Dropdown */ } <
            Box width = {
                300
            } >
            <
            FormControl fullWidth size = "small" >
            <
            InputLabel > Line Name < /InputLabel> <
            Select value = {
                selectedLine
            }
            label = "Line Name"
            onChange = {
                (e) => setSelectedLine(e.target.value)
            }
            disabled = {
                isFilterIncomplete
            } >
            <
            MenuItem value = "" > Select a line < /MenuItem> {
                lineOptions.map((line) => ( <
                    MenuItem key = {
                        line.id
                    }
                    value = {
                        line.id
                    } > {
                        line.line_name
                    } <
                    /MenuItem>
                ))
            } <
            /Select> <
            Typography variant = "caption"
            color = "textSecondary" > {
                getHelperText()
            } <
            /Typography> <
            /FormControl> <
            /Box>

            {
                /* =====================================================
                    BULK SEND FOR APPROVAL
                ===================================================== */
            }

            <
            Box sx = {
                {
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 1,
                    mt: -4


                }
            } >
            {!bulkMode ? ( <
                    Button variant = "outlined"
                    startIcon = { < SendIcon size = {
                            16
                        }
                        />}
                        onClick = {
                            () => setBulkMode(true)
                        } >
                        Bulk Send For Approval <
                        /Button>
                    ): ( <
                        >
                        <
                        Button variant = "contained"
                        color = "primary"
                        onClick = {
                            handleBulkSend
                        }
                        disabled = {
                            bulkSendSelection.length === 0 || bulkSending
                        }
                        startIcon = {
                            bulkSending ? ( <
                                CircularProgress size = {
                                    18
                                }
                                color = "inherit" / >
                            ) : ( <
                                SendIcon size = {
                                    16
                                }
                                />
                            )
                        } >
                        {
                            bulkSending ?
                            "Sending..." :
                                `Send Selected (${bulkSendSelection.length})`
                        } <
                        /Button>

                        <
                        Button variant = "text"
                        color = "inherit"
                        onClick = {
                            () => {
                                setBulkMode(false);
                                setBulkSendSelection([]);
                            }
                        }
                        disabled = {
                            bulkSending
                        } >
                        Cancel <
                        /Button> <
                        />
                    )
                } <
                /Box>

                { /* Table */ } <
                Paper
                sx = {
                    {
                        mt: 1.5,
                        overflowX: "auto",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                    }
                } >
                <
                Table
                size = "small"
                stickyHeader
                sx = {
                    {
                        borderCollapse: "separate",
                        borderSpacing: 0,

                        "& .MuiTableCell-root": {
                            borderRight: "1px solid rgba(224,224,224,0.8)",
                            borderBottom: "1px solid #e0e0e0",
                            textAlign: "center", // ✅ ALL TEXT CENTER
                            verticalAlign: "middle", // ✅ vertical center
                        },

                        "& thead .MuiTableCell-root": {
                            fontWeight: 600,
                            borderBottom: "2px solid #cfcfcf",
                            textAlign: "center", // header center fix
                        },

                        "& .MuiTableCell-root:last-child": {
                            borderRight: "none",
                        },

                        "& tbody tr:hover": {
                            backgroundColor: "#f5f9ff",
                        },
                    }
                } >
                <
                TableHead >
                <
                TableRow sx = {
                    {
                        bgcolor: "#f8fafc"
                    }
                } > {
                    TABLE_HEADERS.map((header) => ( <
                        TableCell key = {
                            header
                        }
                        sx = {
                            {
                                bgcolor: "#1976d2",
                                color: "white",
                                py: 1,
                                fontSize: "0.85rem",
                                minWidth: header === "Tower No" ? 100 : 120,
                                fontWeight: "bold",
                                textAlign: header !== "Tower No" && header !== "Action" ?
                                    "center" :
                                    "left",
                            }
                        } >
                        {
                            header
                        } <
                        /TableCell>
                    ))
                } <
                /TableRow> <
                /TableHead>

                <
                TableBody > {!selectedLine ? ( <
                        TableRow >
                        <
                        TableCell colSpan = {
                            TABLE_HEADERS.length
                        }
                        align = "center"
                        sx = {
                            {
                                py: 6
                            }
                        } >
                        <
                        Typography color = "textSecondary" >
                        Please select a line to view poles <
                        /Typography> <
                        /TableCell> <
                        /TableRow>
                    ) : filteredPoles.length === 0 ? ( <
                        TableRow >
                        <
                        TableCell colSpan = {
                            TABLE_HEADERS.length
                        }
                        align = "center"
                        sx = {
                            {
                                py: 6
                            }
                        } >
                        <
                        Typography color = "textSecondary" >
                        No poles found
                        for this line <
                        /Typography> <
                        /TableCell> <
                        /TableRow>
                    ) : (
                        filteredPoles.map((pole) => {
                            const isEditMode = editRowId === pole.id;
                            const isPoleLocked = !!pole.submitted_l2_at;

                            //  console.log("isPoleLocked mcoh L2",isPoleLocked)

                            // console.log("editRowId", editRowId);
                            // console.log("pole.id", pole.id);
                            // console.log("isEditMode", isEditMode);

                            return ( <
                                TableRow key = {
                                    pole.id
                                }
                                sx = {
                                    {
                                        height: 45,

                                        bgcolor: isEditMode ?
                                            "#fff3e0" :
                                            isPoleLocked ?
                                            "#f3f3f3" :
                                            "#fff",

                                        opacity: isPoleLocked ? 0.65 : 1,
                                        pointerEvents: isPoleLocked ? "none" : "auto",

                                        // "&:hover": {
                                        //   bgcolor: isPoleLocked
                                        //     ? "#f3f3f3"
                                        //     : isEditMode
                                        //     ? "#fff3e0"
                                        //     : "#f5f9ff",
                                        // },
                                    }
                                } >
                                {
                                    TABLE_HEADERS.map((header) => {
                                        // Action Column
                                        if (header === "Action") {
                                            return ( <
                                                TableCell key = {
                                                    header
                                                }
                                                align = "center"
                                                sx = {
                                                    {
                                                        py: 1
                                                    }
                                                } > {
                                                    isEditMode ? ( <
                                                        >
                                                        <
                                                        Tooltip title = "Save" >
                                                        <
                                                        IconButton color = "success"
                                                        onClick = {
                                                            () => handleSaveClick(pole)
                                                        }
                                                        size = "small"
                                                        disabled = {
                                                            loading
                                                        } >
                                                        {
                                                            loading ? ( <
                                                                CircularProgress size = {
                                                                    18
                                                                }
                                                                />
                                                            ) : ( <
                                                                SaveIcon fontSize = "small" / >
                                                            )
                                                        } <
                                                        /IconButton> <
                                                        /Tooltip> <
                                                        Tooltip title = "Cancel" >
                                                        <
                                                        IconButton color = "default"
                                                        onClick = {
                                                            handleCancelClick
                                                        }
                                                        size = "small"
                                                        disabled = {
                                                            loading
                                                        } >
                                                        <
                                                        CancelIcon fontSize = "small" / >
                                                        <
                                                        /IconButton> <
                                                        /Tooltip> <
                                                        />
                                                    ) : ( <
                                                        >
                                                        <
                                                        Tooltip title = "Edit" >
                                                        <
                                                        IconButton color = "primary"
                                                        onClick = {
                                                            () => handleEditClick(pole)
                                                        }
                                                        size = "small"
                                                        disabled = {
                                                            isPoleLocked
                                                        } >
                                                        <
                                                        EditIcon fontSize = "small" / >
                                                        <
                                                        /IconButton> <
                                                        /Tooltip>

                                                        {
                                                            /* =================================================
                                                                                                          BULK SELECTION CHECKBOX
                                                                                                      ================================================= */
                                                        } {
                                                            bulkMode && ( <
                                                                Checkbox size = "small"
                                                                checked = {
                                                                    bulkSendSelection.includes(pole.id)
                                                                }
                                                                onChange = {
                                                                    () => handleBulkSendToggle(pole)
                                                                }
                                                                disabled = {!pole.id ||
                                                                    !pole.saved_l2_at ||
                                                                    pole.submitted_l2_at ||
                                                                    pole.approved_l2_at ||
                                                                    editRowId === pole.id
                                                                }
                                                                />
                                                            )
                                                        }


                                                        {
                                                            pole.approved_l2_at ? ( <
                                                                Button size = "small"
                                                                color = "success"
                                                                variant = "contained"
                                                                disabled
                                                                // sx={{ ml: 1 }}
                                                                sx = {
                                                                    {
                                                                        bgcolor: "success.main",
                                                                        color: "#fff",
                                                                        "&.Mui-disabled": {
                                                                            bgcolor: "success.main", // Green background even when disabled
                                                                            color: "#fff", // White text
                                                                            opacity: 1, // Remove default faded look
                                                                        },
                                                                    }
                                                                } >
                                                                Approved <
                                                                /Button>
                                                            ) : pole.submitted_l2_at ? ( <
                                                                Button size = "small"
                                                                color = "info"
                                                                variant = "contained"
                                                                disabled sx = {
                                                                    {
                                                                        ml: 1
                                                                    }
                                                                } >
                                                                Submitted <
                                                                /Button>
                                                            ) : (
                                                                // <Button
                                                                //   size="small"
                                                                //   color="primary"
                                                                //   variant="contained"
                                                                //   endIcon={<SendIcon />}
                                                                //   onClick={() => handlePoleApproval(pole)}
                                                                //   disabled={
                                                                //     !pole.id ||
                                                                //     !pole.saved_l2_at ||
                                                                //     pole.submitted_l2_at ||
                                                                //     editRowId === pole.id
                                                                //   }
                                                                //   sx={{ ml: 1 }}
                                                                // >
                                                                //   Send
                                                                // </Button>


                                                                <
                                                                Button size = "small"
                                                                color = "primary"
                                                                variant = "contained"
                                                                onClick = {
                                                                    () => handlePoleApproval(pole)
                                                                }
                                                                disabled = {
                                                                    (sendingId === pole.id) ||
                                                                    !pole.id ||
                                                                    !pole.saved_l2_at ||
                                                                    pole.submitted_l2_at ||
                                                                    editRowId === pole.id
                                                                }
                                                                endIcon = {
                                                                    sendingId === pole.id ? ( <
                                                                        CircularProgress size = {
                                                                            16
                                                                        }
                                                                        color = "inherit" /
                                                                        >
                                                                    ) : ( <
                                                                        SendIcon size = {
                                                                            16
                                                                        }
                                                                        />
                                                                    )
                                                                }
                                                                sx = {
                                                                    {
                                                                        ml: 1
                                                                    }
                                                                } >
                                                                {
                                                                    sendingId === pole.id ?
                                                                    "Sending..." :
                                                                        "Send"
                                                                } <
                                                                /Button>
                                                            )
                                                        } <
                                                        />
                                                    )
                                                } <
                                                /TableCell>
                                            );
                                        }

                                        // if (header === "Approval") {
                                        //                     return (
                                        //                       <TableCell key={header} align="center">

                                        //                         {pole.approved_l2_at ? (

                                        //                     <Button
                                        //                       size="small"
                                        //                       color="success"
                                        //                       variant="contained"
                                        //                       disabled
                                        //                     >
                                        //                       Approved
                                        //                     </Button>

                                        //                   ) : pole.submitted_l2_at ? (

                                        //                     <Button
                                        //                       size="small"
                                        //                       color="success"
                                        //                       variant="contained"
                                        //                       disabled
                                        //                     >
                                        //                       Submitted
                                        //                     </Button>

                                        //                   ) : (

                                        //                     <Button
                                        //                       size="small"
                                        //                       color="primary"
                                        //                       variant="contained"
                                        //                       endIcon={<SendIcon />}
                                        //                       onClick={() => handlePoleApproval(pole)}
                                        //                       disabled={
                                        //                         !pole.id ||
                                        //                         !pole.saved_l2_at ||
                                        //                         pole.submitted_l2_at ||
                                        //                         editRowId === pole.id
                                        //                       }
                                        //                     >
                                        //                       Send
                                        //                     </Button>

                                        //                   )}

                                        //                       </TableCell>
                                        //                     );
                                        //                   }

                                        // Photo Column
                                        if (header === "Photo") {
                                            const existingPhoto = pole.fab_mounting_photo;

                                            return ( <
                                                TableCell key = {
                                                    header
                                                }
                                                sx = {
                                                    {
                                                        py: 1
                                                    }
                                                } > {
                                                    isEditMode ? ( <
                                                        Box >
                                                        <
                                                        Button component = "label"
                                                        size = "small"
                                                        variant = "outlined"
                                                        startIcon = { <
                                                            CloudUploadIcon sx = {
                                                                {
                                                                    fontSize: 16
                                                                }
                                                            }
                                                            />
                                                        }
                                                        sx = {
                                                            {
                                                                textTransform: "none",
                                                                fontSize: "0.7rem",
                                                                border: errors.photo ? "1px solid red" : "",
                                                                color: errors.photo ? "red" : "",
                                                            }
                                                        } >
                                                        Upload <
                                                        input type = "file"
                                                        hidden accept = "image/*"
                                                        onChange = {
                                                            (e) => {
                                                                const file = e.target.files[0];
                                                                if (file) handleFileChange(file);
                                                            }
                                                        }
                                                        /> <
                                                        /Button> {
                                                            selectedFile && ( <
                                                                Typography variant = "caption"
                                                                sx = {
                                                                    {
                                                                        display: "block",
                                                                        mt: 0.5,
                                                                        color: "green",
                                                                    }
                                                                } >
                                                                New: {
                                                                    selectedFile.name
                                                                } <
                                                                /Typography>
                                                            )
                                                        } {
                                                            !selectedFile &&
                                                                existingPhoto &&
                                                                existingPhoto !== "null" && ( <
                                                                    Typography variant = "caption"
                                                                    sx = {
                                                                        {
                                                                            display: "block",
                                                                            mt: 0.5,
                                                                            color: "blue",
                                                                        }
                                                                    } >
                                                                    Current: {
                                                                        " "
                                                                    } {
                                                                        typeof existingPhoto === "string" ?
                                                                            existingPhoto.split("/").pop() :
                                                                            "Photo exists"
                                                                    } <
                                                                    /Typography>
                                                                )
                                                        } <
                                                        /Box>
                                                    ) : existingPhoto && existingPhoto !== "null" ? ( <
                                                        Typography variant = "caption"
                                                        sx = {
                                                            {
                                                                color: "green",
                                                                fontWeight: 500,
                                                            }
                                                        } >
                                                        📷{
                                                            " "
                                                        } {
                                                            typeof existingPhoto === "string" ?
                                                                existingPhoto.split("/").pop() :
                                                                "Photo"
                                                        } <
                                                        /Typography>
                                                    ) : ( <
                                                        Typography variant = "caption"
                                                        color = "textSecondary" >
                                                        No photo <
                                                        /Typography>
                                                    )
                                                } <
                                                /TableCell>
                                            );
                                        }

                                        // Pole Number Column
                                        if (header === "Tower No") {
                                            return ( <
                                                TableCell key = {
                                                    header
                                                }
                                                sx = {
                                                    {
                                                        fontWeight: "bold",
                                                        fontSize: "0.8rem"
                                                    }
                                                } >
                                                {
                                                    pole ? .pole_number ? ( <
                                                        > {
                                                            `${pole.pole_number.toString().replace(/^p/i, "")} `
                                                        } <
                                                        span style = {
                                                            {
                                                                fontSize: "0.7rem",
                                                                fontWeight: "normal",
                                                            }
                                                        } >
                                                        (Type {
                                                            formatPoleType(pole.tower_type)
                                                        }) <
                                                        /span> <
                                                        />
                                                    ) : (
                                                        "-"
                                                    )
                                                } <
                                                /TableCell>
                                            );
                                        }

                                        // Checkbox Columns - Bottom, Top, Cross Arm
                                        const materialInfo = MATERIALS_CONFIG[header];
                                        if (materialInfo && materialInfo.type === "checkbox") {
                                            const checked = isEditMode ?
                                                editData[header] || false :
                                                pole[materialInfo.key] === true ||
                                                pole[materialInfo.key] === "true";

                                            return ( <
                                                TableCell key = {
                                                    header
                                                }
                                                align = "center"
                                                sx = {
                                                    {
                                                        py: 1
                                                    }
                                                } >
                                                <
                                                Checkbox checked = {
                                                    checked
                                                }
                                                disabled = {!isEditMode || loading
                                                }
                                                onChange = {
                                                    (e) =>
                                                    handleCheckboxChange(header, e.target.checked)
                                                }
                                                size = "small"
                                                color = {
                                                    isEditMode && errors[header] ?
                                                    "error" :
                                                        "primary"
                                                }
                                                sx = {
                                                    {
                                                        p: 0,
                                                        transform: "scale(0.9)",
                                                        "& .MuiSvgIcon-root": {
                                                            color: isEditMode && errors[header] ?
                                                                "red" :
                                                                undefined,
                                                        },
                                                    }
                                                }
                                                /> <
                                                /TableCell>
                                            );
                                        }

                                        // Date Column
                                        if (header === "Tower Erection Date") {
                                            const value = isEditMode ?
                                                editData[header] || getToday() :
                                                pole.start_date || getToday();

                                            return ( <
                                                TableCell key = {
                                                    header
                                                }
                                                sx = {
                                                    {
                                                        py: 1
                                                    }
                                                } >
                                                <
                                                TextField type = "date"
                                                variant = "standard"
                                                error = {!!errors["Tower Erection Date"]
                                                }
                                                size = "small"
                                                fullWidth disabled = {!isEditMode || loading
                                                }
                                                value = {
                                                    value
                                                }
                                                inputProps = {
                                                    {
                                                        min: getMinDate(),
                                                        max: getToday(),
                                                    }
                                                }
                                                onChange = {
                                                    (e) => handleDateChange(e.target.value)
                                                }
                                                InputProps = {
                                                    {
                                                        disableUnderline: !isEditMode,
                                                        sx: {
                                                            fontSize: "0.8rem"
                                                        },
                                                    }
                                                }
                                                /> <
                                                /TableCell>
                                            );
                                        }

                                        return null;
                                    })
                                } <
                                /TableRow>
                            );
                        })
                    )
                } <
                /TableBody> <
                /Table> <
                /Paper> {
                    /* <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              mt: 2,
                              mb: 2,
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleSendForApproval}
                              endIcon={<SendIcon />}
                              disabled={!selectedLineId || !!isL2Submitted}
                            >
                              {!!isL2Submitted
                                ? "Level-2 Submitted For Approval"
                                : "Send For Approval Level-2"}
                            </Button>
                          </Box> */
                } <
                /Container>
            );
        };

        export default DynamicPoleTable;