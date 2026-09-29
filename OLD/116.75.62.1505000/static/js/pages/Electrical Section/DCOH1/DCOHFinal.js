import React, {
    useState,
    useEffect,
    memo
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TableContainer,
    IconButton,
    CircularProgress,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    Button,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import {
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CancelIcon,
} from "@mui/icons-material";

import {
    GetElectricalMasterData,
    PatchElectricalMasterData,
} from "../../../Redux/MasterData/masterAction";

import {
    GetPoleLinesData
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";

const DCOHFinal = ({
    filters
}) => {
    const dispatch = useDispatch();
    const [selectedLine, setSelectedLine] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [editData, setEditData] = useState({
        cc_line: "",
        start_date: "",
        photo: null,
        joint_inspection_report: null, // ✅ NEW
    });
    const [lineData, setLineData] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [errors, setErrors] = useState({});

    // 9️⃣ helper function for report filename
    const getJIRDisplayName = () => {
        const file = editMode ?
            editData.joint_inspection_report :
            lineData ? .joint_inspection_report;

        if (!file) return null;

        if (typeof file === "string") {
            return file.split("/").pop();
        }

        if (file instanceof File) {
            return file.name;
        }

        return null;
    };

    const isFilterIncomplete = !filters.project || !filters.windfarm;

    const getHelperText = () => {
        if (!filters.project) return "Select Project first";
        if (!filters.windfarm) return "Select Windfarm to enable lines";

        return "Select a line";
    };

    const getToday = () => {
        return new Date().toISOString().split("T")[0];
    };

    const getMinDate = () => {
        const d = new Date();
        d.setDate(d.getDate() - 2);
        return d.toISOString().split("T")[0];
    };

    // useEffect(() => {
    //   dispatch(GetElectricalMasterData());
    //   dispatch(GetPoleLinesData());
    // }, [dispatch]);


    useEffect(() => {
        dispatch(GetElectricalMasterData());
    }, [dispatch]);

    const {
        getpoLineData = []
    } = useSelector((state) => state.electricalData);

    const {
        getElectricalMaster = [], loading: masterLoading
    } = useSelector(
        (state) => state.masterData,
    );

    // Line options based on filters
    const lineOptions = React.useMemo(() => {
        let filteredMaster = [...getElectricalMaster];

        if (filters ? .project) {
            filteredMaster = filteredMaster.filter(
                (item) => item.project === Number(filters.project),
            );
        }
        if (filters ? .windfarm) {
            filteredMaster = filteredMaster.filter(
                (item) => item.windfarm === Number(filters.windfarm),
            );
        }

        filteredMaster = filteredMaster.filter(
            (item) => item.line_type === "DCOH (Double Circuit Overhead Line)",
        );

        return filteredMaster.map((item) => ({
            id: item.id,
            name: item.line_name,
        }));
    }, [getElectricalMaster, filters ? .project, filters ? .windfarm]);

    // Reset selected line when filters change
    useEffect(() => {
        setSelectedLine("");
        setLineData(null);
        setEditMode(false);

        // dispatch(GetElectricalMasterData());
        // dispatch(GetPoleLinesData());
    }, [filters ? .project, filters ? .windfarm]);

    // When line is selected, properly bind data from API
    useEffect(() => {
        if (selectedLine && getElectricalMaster.length > 0) {
            const selectedLineMaster = getElectricalMaster.find(
                (item) => item.id === selectedLine,
            );

            if (selectedLineMaster) {
                setLineData({
                    line_name: selectedLineMaster.line_name,
                    cc_line: selectedLineMaster.cc_line || "",
                    start_date: selectedLineMaster.start_date || "",
                    photo: selectedLineMaster.photo || null,
                    joint_inspection_report: selectedLineMaster.joint_inspection_report || null, // ✅ NEW
                    id: selectedLineMaster.id,
                });

                setEditData({
                    cc_line: selectedLineMaster.cc_line || "",
                    start_date: selectedLineMaster.start_date || "",
                    photo: selectedLineMaster.photo || null,
                    joint_inspection_report: selectedLineMaster.joint_inspection_report || null, // ✅ NEW
                });
                setEditMode(false);
            }
        }
    }, [selectedLine, getElectricalMaster]);



    useEffect(() => {
        if (!selectedLine ||
            !filters ? .project ||
            !filters ? .windfarm

        ) {
            return;
        }

        dispatch(
            GetPoleLinesData({
                project: filters.project,
                windfarm: filters.windfarm,

                line_id: selectedLine,
            })
        );
    }, [
        dispatch,
        selectedLine,
        filters ? .project,
        filters ? .windfarm,

    ]);


    const showSnackbar = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev,
            open: false
        }));
    };

    const handleEditClick = () => {
        if (!canEditColdCommissioning) {
            showSnackbar(
                `Cold Commissioning cannot be initiated for "${lineData?.line_name}". Please ensure all poles are created, mandatory data is completed, and approvals are completed.`,
                "warning",
            );
            return;
        }
        setEditMode(true);
        setEditData({
            cc_line: lineData ? .cc_line || "",
            start_date: lineData ? .start_date || getToday(),
            photo: lineData ? .photo || null,
            joint_inspection_report: lineData ? .joint_inspection_report || null, // ✅ NEW
        });
    };

    const handleSaveClick = async () => {
        const validationErrors = {};

        if (!editData.cc_line) {
            validationErrors.cc_line = "Required";
        } else if (editData.cc_line !== "done") {
            validationErrors.cc_line =
                "Cold Commissioning must be marked as Done before saving.";
        }

        if (!editData.start_date) {
            validationErrors.start_date = "Required";
        }

        if (!(editData.photo instanceof File) && !lineData ? .photo) {
            validationErrors.photo = "Photo Required";
        }

        if (!(editData.joint_inspection_report instanceof File) &&
            !lineData ? .joint_inspection_report
        ) {
            validationErrors.joint_inspection_report = "Required";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            showSnackbar("Please fill all required fields", "error");
            return;
        }

        if (!lineData ? .id) {
            showSnackbar("❌ Line data not found", "error");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("cc_line", editData.cc_line);

            if (editData.start_date) {
                formData.append("start_date", editData.start_date);
            } else {
                formData.append("start_date", "");
            }

            if (editData.photo instanceof File) {
                formData.append("photo", editData.photo);
            }

            if (editData.joint_inspection_report instanceof File) {
                formData.append(
                    "joint_inspection_report",
                    editData.joint_inspection_report,
                );
            }

            await dispatch(PatchElectricalMasterData(lineData.id, formData));

            // await dispatch(GetElectricalMasterData()); // <-- ADD THIS

            setLineData({
                ...lineData,
                cc_line: editData.cc_line,
                start_date: editData.start_date,
                photo: editData.photo instanceof File ? editData.photo.name : editData.photo,

                joint_inspection_report: editData.joint_inspection_report instanceof File ?
                    editData.joint_inspection_report.name :
                    editData.joint_inspection_report,
            });

            setEditMode(false);
            showSnackbar(`Data Saved Successfully`, "success");

            dispatch(GetElectricalMasterData());
        } catch (err) {
            console.error("Save error:", err);
            showSnackbar(
                `❌ Save failed: ${err.message || "Unknown error"}`,
                "error",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setEditMode(false);
        setEditData({
            cc_line: lineData ? .cc_line || "",
            start_date: lineData ? .start_date || "",
            photo: lineData ? .photo || null,

            joint_inspection_report: lineData ? .joint_inspection_report || null, // ✅ NEW
        });
    };

    const handleInputChange = (field, value) => {
        setEditData((prev) => ({ ...prev,
            [field]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                showSnackbar("Please select an image file", "error");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showSnackbar("File size should be less than 5MB", "error");
                return;
            }
            handleInputChange("photo", file);
        }
    };

    // ✅ Function to get photo display name from lineData (for non-edit mode)
    const getPhotoDisplayName = () => {
        if (!lineData ? .photo) return "No photo uploaded";
        if (typeof lineData.photo === "string") {
            return lineData.photo.split("/").pop() || "Photo uploaded";
        }
        return lineData.photo.name;
    };

    // ✅ Function to get current photo name for edit mode display
    const getCurrentPhotoName = () => {
        if (!editData.photo) return null;
        if (typeof editData.photo === "string") {
            return editData.photo.split("/").pop();
        }
        if (editData.photo instanceof File) {
            return editData.photo.name;
        }
        return null;
    };

    const selectedLineId = selectedLine;

    const selectedLineData = getElectricalMaster.find(
        (item) => Number(item.id) === Number(selectedLine),
    );

    const selectedLinePoles = getpoLineData.filter(
        (item) => Number(item.electrical_line) === Number(selectedLine),
    );

    const expectedPoleCount = Number(selectedLineData ? .total_poles || 0);

    const actualPoleCount = selectedLinePoles.length;

    const isPoleCountMatched = expectedPoleCount === actualPoleCount;

    const areAllPolesApprovedL3 =
        selectedLinePoles.length > 0 &&
        selectedLinePoles.every((pole) => pole.approved_l3_at !== null);

    const isColdCommissioningSaved =
        selectedLineData ? .cc_line === "done" &&
        !!selectedLineData ? .start_date &&
        !!selectedLineData ? .photo &&
        !!selectedLineData ? .joint_inspection_report;

    const canEditColdCommissioning = isPoleCountMatched && areAllPolesApprovedL3;

    const isLineEligibleForFinalApproval =
        isPoleCountMatched && areAllPolesApprovedL3;

    const canSendForApproval =
        isPoleCountMatched && areAllPolesApprovedL3 && isColdCommissioningSaved;

    const isSubmitted = selectedLineData ? .submitted_at !== null;
    const isApproved = selectedLineData ? .approved_at !== null;

    const isLineLocked = isSubmitted;

    const handleSendForApproval = async () => {
        if (!selectedLineId) {
            alert("No line selected");
            return;
        }

        if (!canSendForApproval) {
            alert(
                "Please complete and save Cold Commissioning details before sending for approval.",
            );
            return;
        }

        if (!isLineEligibleForFinalApproval) {
            alert("All poles must be approved at L3 before sending for approval.");
            return;
        }

        try {
            const payload = {
                submitted_at: new Date().toISOString(),
            };

            await dispatch(PatchElectricalMasterData(selectedLineId, payload));

            alert("Line Sent For Approval Successfully");

            // setRefreshTrigger((prev) => prev + 1);

            dispatch(GetElectricalMasterData());
        } catch (error) {
            console.error(error);
            alert("Failed to send for approval");
        }
    };

    return ( <
        Box p = {
            3
        }
        sx = {
            {
                background: "#f4f6f8",
                minHeight: "100vh"
            }
        } >
        <
        Snackbar open = {
            snackbar.open
        }
        autoHideDuration = {
            4000
        }
        onClose = {
            handleCloseSnackbar
        }
        anchorOrigin = {
            {
                vertical: "top",
                horizontal: "right"
            }
        } >
        <
        Alert onClose = {
            handleCloseSnackbar
        }
        severity = {
            snackbar.severity
        } > {
            snackbar.message
        } <
        /Alert> <
        /Snackbar>

        <
        Typography variant = "h6"
        mb = {
            2
        } >
        Final Level - Cold Commissioning Details <
        /Typography>

        <
        Box mb = {
            2
        }
        width = {
            300
        } >
        <
        FormControl fullWidth size = "small" >
        <
        InputLabel > Line Name < /InputLabel> <
        Select value = {
            selectedLine || ""
        }
        label = "Line Name"
        onChange = {
            (e) => setSelectedLine(e.target.value)
        }
        //  disabled={lineOptions.length === 0 || masterLoading}

        disabled = {
            isFilterIncomplete
        } >
        {
            lineOptions.length > 0 ? (
                lineOptions.map((line) => ( <
                    MenuItem key = {
                        line.id
                    }
                    value = {
                        line.id
                    } > {
                        line.name
                    } <
                    /MenuItem>
                ))
            ) : ( <
                MenuItem disabled > {
                    filters ? .project || filters ? .windfarm ?
                    "No lines for selected filters" :
                    "Please select project/windfarm"
                } <
                /MenuItem>
            )
        } <
        /Select>

        <
        Typography > {
            getHelperText()
        } < /Typography> <
        /FormControl> <
        /Box>

        <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                borderRadius: "8px",
                border: "1px solid #ddd",
            }
        } >
        <
        style > {
            `
           .light-input { 
             padding: 4px 6px; 
             border: 1px solid #ccc; 
             border-radius: 4px; 
             font-size: 0.8rem;
             background-color: white;
             width: 140px;
             box-sizing: border-box;
           }
           .light-input:focus { 
             border-color: #1976d2; 
             outline: none; 
             box-shadow: 0 0 3px rgba(25,118,210,0.3); 
           }
         `
        } < /style>

        <
        Table size = "small"
        stickyHeader sx = {
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
        TableRow > {
            [
                "Line Name",
                "Cold Commissioning",
                "Commissioning Date",
                "Photo",
                "Joint Inspection Report",
                "Actions",
            ].map((h) => ( <
                TableCell key = {
                    h
                }
                sx = {
                    {
                        bgcolor: "#1976d2",
                        color: "white",
                        py: 1,
                        fontSize: "0.85rem",
                        textAlign: "center",
                        fontWeight: "bold",
                    }
                } >
                {
                    h
                } <
                /TableCell>
            ))
        } <
        /TableRow> <
        /TableHead> <
        TableBody > {
            masterLoading ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    5
                }
                align = "center" >
                <
                CircularProgress size = {
                    30
                }
                /> <
                /TableCell> <
                /TableRow>
            ) : !selectedLine ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    5
                }
                align = "center" >
                <
                Typography variant = "body2"
                color = "textSecondary"
                py = {
                    3
                } > ⚠️Please select a Line <
                /Typography> <
                /TableCell> <
                /TableRow>
            ) : !lineData ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    5
                }
                align = "center" >
                <
                CircularProgress size = {
                    24
                }
                /> <
                /TableCell> <
                /TableRow>
            ) : ( <
                TableRow sx = {
                    {
                        bgcolor: editMode ? "#fff3e0" : "inherit",
                        opacity: isLineLocked ? 0.6 : 1,
                    }
                } >
                <
                TableCell sx = {
                    {
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        textAlign: "center",
                    }
                } >
                {
                    lineData ? .line_name
                } <
                /TableCell>

                <
                TableCell sx = {
                    {
                        textAlign: "center"
                    }
                } >
                <
                select className = "light-input"
                value = {
                    editMode ? editData.cc_line : lineData ? .cc_line || ""
                }
                onChange = {
                    (e) =>
                    handleInputChange("cc_line", e.target.value)
                }
                disabled = {!editMode
                }
                style = {
                    {
                        textAlign: "center",
                        textAlignLast: "center",
                        border: errors.cc_line ? "1px solid red" : "",
                    }
                } >
                <
                option value = "" > Select < /option> <
                option value = "done" > Done < /option> <
                option value = "pending" > Pending < /option> <
                /select> <
                /TableCell>

                <
                TableCell sx = {
                    {
                        textAlign: "center"
                    }
                } >
                <
                input type = "date"
                className = "light-input"
                value = {
                    editMode ?
                    editData.start_date || getToday() :
                        lineData ? .start_date || ""
                }
                onChange = {
                    (e) =>
                    handleInputChange("start_date", e.target.value)
                }
                onFocus = {
                    (e) =>
                    e.target.showPicker && e.target.showPicker()
                }
                disabled = {!editMode
                }
                min = {
                    getMinDate()
                } // 🔥 last 2 days allowed
                max = {
                    getToday()
                } // 🔥 future disabled
                style = {
                    {
                        cursor: editMode ? "pointer" : "default",
                        textAlign: "center",
                        border: errors.start_date ? "1px solid red" : "",
                    }
                }
                /> <
                /TableCell>

                { /* ✅ FIXED: Photo Field - Show existing photo name in edit mode too */ } <
                TableCell sx = {
                    {
                        textAlign: "center"
                    }
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        alignItems: "center",
                    }
                } >
                {
                    editMode ? ( <
                        > { /* File input for new photo */ } <
                        input type = "file"
                        accept = "image/*"
                        onChange = {
                            handlePhotoChange
                        }
                        style = {
                            {
                                fontSize: "0.75rem",
                                width: "140px",
                                border: errors.photo ? "1px solid red" : "",
                            }
                        }
                        /> { /* ✅ Show existing photo name if present */ } {
                            getCurrentPhotoName() && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        fontSize: "0.7rem",
                                        color: "#666"
                                    }
                                } >
                                Current: {
                                    getCurrentPhotoName()
                                } <
                                /Typography>
                            )
                        } {
                            !getCurrentPhotoName() && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        fontSize: "0.7rem",
                                        color: "#999"
                                    }
                                } >
                                No photo uploaded <
                                /Typography>
                            )
                        } <
                        />
                    ) : ( <
                        >
                        <
                        input type = "file"
                        disabled style = {
                            {
                                width: "140px",
                                fontSize: "0.7rem",
                                cursor: "not-allowed",
                                opacity: 0.6,
                            }
                        }
                        /> {
                            lineData ? .photo && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        maxWidth: 140
                                    }
                                }
                                noWrap >
                                📷{
                                    getPhotoDisplayName()
                                } <
                                /Typography>
                            )
                        } {
                            !lineData ? .photo && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        maxWidth: 140,
                                        color: "gray"
                                    }
                                }
                                noWrap >
                                No photo uploaded <
                                /Typography>
                            )
                        } <
                        />
                    )
                } <
                /Box> <
                /TableCell>

                <
                TableCell sx = {
                    {
                        textAlign: "center"
                    }
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        alignItems: "center",
                    }
                } >
                {
                    editMode ? ( <
                        >
                        <
                        input type = "file"
                        accept = ".pdf,.jpg,.jpeg,.png"
                        onChange = {
                            (e) =>
                            handleInputChange(
                                "joint_inspection_report",
                                e.target.files[0],
                            )
                        }
                        style = {
                            {
                                fontSize: "0.75rem",
                                width: "160px",
                                border: errors.joint_inspection_report ?
                                    "1px solid red" :
                                    "",
                            }
                        }
                        />

                        {
                            getJIRDisplayName() ? ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        fontSize: "0.7rem",
                                        color: "#666"
                                    }
                                } >
                                Current: {
                                    getJIRDisplayName()
                                } <
                                /Typography>
                            ) : ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        fontSize: "0.7rem",
                                        color: "#999"
                                    }
                                } >
                                No file uploaded <
                                /Typography>
                            )
                        } <
                        />
                    ) : ( <
                        >
                        <
                        input type = "file"
                        disabled style = {
                            {
                                width: "160px",
                                fontSize: "0.7rem",
                                cursor: "not-allowed",
                                opacity: 0.6,
                            }
                        }
                        />

                        {
                            getJIRDisplayName() ? ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        maxWidth: 160
                                    }
                                }
                                noWrap >
                                📄{
                                    getJIRDisplayName()
                                } <
                                /Typography>
                            ) : ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        color: "gray"
                                    }
                                } >
                                No file uploaded <
                                /Typography>
                            )
                        } <
                        />
                    )
                } <
                /Box> <
                /TableCell>

                <
                TableCell sx = {
                    {
                        textAlign: "center"
                    }
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "center"
                    }
                } >
                {
                    editMode ? ( <
                        >
                        <
                        IconButton color = "success"
                        onClick = {
                            handleSaveClick
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
                        IconButton color = "default"
                        onClick = {
                            handleCancelClick
                        }
                        size = "small" >
                        <
                        CancelIcon fontSize = "small" / >
                        <
                        /IconButton> <
                        />
                    ) : ( <
                        IconButton color = "primary"
                        onClick = {
                            handleEditClick
                        }
                        size = "small"
                        disabled = {
                            isLineLocked
                        } >
                        <
                        EditIcon fontSize = "small" / >
                        <
                        /IconButton>
                    )
                } <
                /Box> <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        {
            selectedLineId && ( <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 2,
                        mb: 2,
                    }
                } >
                <
                Button variant = "contained"
                color = "primary"
                onClick = {
                    handleSendForApproval
                }
                endIcon = { < SendIcon / >
                }
                disabled = {!selectedLineId ||
                    !canSendForApproval ||
                    isSubmitted ||
                    isApproved
                }
                sx = {
                    isApproved ?
                    {
                        bgcolor: "success.main",
                        color: "#fff",
                        "&.Mui-disabled": {
                            bgcolor: "success.main",
                            color: "#fff",
                            opacity: 0.6,
                        },
                    } :
                    {}
                } >
                {
                    isApproved ?
                    "Approved" :
                        isSubmitted ?
                        "Submitted" :
                        "Send For Approval"
                } <
                /Button> <
                /Box>
            )
        } <
        /Box>
    );
};
export default DCOHFinal;