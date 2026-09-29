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
    Card,
    CardContent,
    Button,
    Grid,
    Snackbar,
    Alert,
    Checkbox,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import {
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CancelIcon,
} from "@mui/icons-material";

import stringingIMG from "../../../assets/stringing.png";
import {
    GetPoleLinesData,
    PatchPoleLineMaterialData,
    BulkPatchPoleLineMaterialData,
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";
import {
    GetElectricalMasterData
} from "../../../Redux/MasterData/masterAction";


// ==================== MEMOIZED ROW COMPONENT ====================
const DCOHLevel3Row = ({
    pole,
    selectedLineId,
    bulkMode,
    bulkSendSelection,
    handleBulkSendToggle,
    onUpdated,
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const [sendingId, setSendingId] = useState(null);

    const {
        patchLoading
    } = useSelector((state) => state.electricalData);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        stringing: false,
        jumper_binding: false,
        conductor_binding: false, // ✅ NEW FIELD
        earthing: false,

        conductor_make: "",
        drum_serial_no: "",
        stringing_date: "",
        stringing_photo: null,
        earthing_photo: null,
        jumper_binding_photo: null,
        insulator_alignment_photo: null,
    });

    const [existingPhoto, setExistingPhoto] = useState(null);
    const [existingStringingPhoto, setExistingStringingPhoto] = useState(null);
    const [existingEarthingPhoto, setExistingEarthingPhoto] = useState(null);
    const [existingJumperPhoto, setExistingJumperPhoto] = useState(null);
    const [existingInsulatorPhoto, setExistingInsulatorPhoto] = useState(null);
    const [errors, setErrors] = useState({});

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const getToday = () => {
        return new Date().toISOString().split("T")[0];
    };

    const getMinDate = () => {
        const d = new Date();
        d.setDate(d.getDate() - 2);
        return d.toISOString().split("T")[0];
    };

    useEffect(() => {
        setEditData({
            stringing: !!pole.stringing,
            jumper_binding: !!pole.jumper_binding,
            conductor_binding: pole.conductor_binding || "", // ✅ NEW
            earthing: !!pole.earthing,
            conductor_make: pole.conductor_make || "",
            drum_serial_no: pole.drum_serial_no || "",

            stringing_date: pole.stringing_date || "",
            stringing_photo: pole.stringing_photo || null,
            earthing_photo: pole.earthing_photo || null,
            jumper_binding_photo: pole.jumper_binding_photo || null,
            insulator_alignment_photo: pole.insulator_alignment_photo || null,
        });
    }, [pole]);

    const handleEditClick = () => {
        setEditMode(true);

        setEditData({
            stringing: !!pole.stringing,
            jumper_binding: !!pole.jumper_binding,
            conductor_binding: pole.conductor_binding || "", // ✅ NEW
            earthing: !!pole.earthing,
            conductor_make: pole.conductor_make || "",
            drum_serial_no: pole.drum_serial_no || "",
            stringing_date: pole.stringing_date || getToday(),
            stringing_photo: null,
            earthing_photo: pole.earthing_photo || null,
            jumper_binding_photo: pole.jumper_binding_photo || null,
            insulator_alignment_photo: pole.insulator_alignment_photo || null,
        });

        setExistingPhoto(pole.stringing_photo); // ✅ store separately

        setExistingEarthingPhoto(pole.earthing_photo);
        setExistingJumperPhoto(pole.jumper_binding_photo);
        setExistingInsulatorPhoto(pole.insulator_alignment_photo);
    };

    const handleSaveClick = async () => {
        const validationErrors = {};

        // Conductor Make
        if (!editData.conductor_make ? .trim()) {
            validationErrors.conductor_make = "Required";
        }

        // Drum Serial No
        if (!editData.drum_serial_no ? .trim()) {
            validationErrors.drum_serial_no = "Required";
        }

        // Date
        if (!editData.stringing_date) {
            validationErrors.stringing_date = "Required";
        }

        // Stringing Photo
        if (!editData.stringing_photo && !existingPhoto) {
            validationErrors.stringing_photo = "Required";
        }

        // Earthing Photo
        if (!editData.earthing_photo && !existingEarthingPhoto) {
            validationErrors.earthing_photo = "Required";
        }

        // Cut Pole → Jumper Photo mandatory
        if (
            pole.pole_type === "cut_pole" &&
            !editData.jumper_binding_photo &&
            !existingJumperPhoto
        ) {
            validationErrors.jumper_binding_photo = "Required";
        }

        // Line Pole
        if (pole.pole_type === "line_pole") {
            if (!editData.stringing) {
                validationErrors.stringing = "Required";
            }

            if (!editData.conductor_binding) {
                validationErrors.conductor_binding = "Required";
            }

            if (!editData.earthing) {
                validationErrors.earthing = "Required";
            }
        }

        // Cut Pole
        if (pole.pole_type === "cut_pole") {
            if (!editData.stringing) {
                validationErrors.stringing = "Required";
            }

            if (!editData.jumper_binding) {
                validationErrors.jumper_binding = "Required";
            }

            if (!editData.earthing) {
                validationErrors.earthing = "Required";
            }
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

        const formData = new FormData();

        formData.append("stringing", editData.stringing ? "true" : "false");
        formData.append(
            "jumper_binding",
            editData.jumper_binding ? "true" : "false",
        );

        formData.append(
            "conductor_binding",
            editData.conductor_binding ? "true" : "false",
        );

        formData.append("earthing", editData.earthing ? "true" : "false");

        formData.append("conductor_make", editData.conductor_make || "");
        formData.append("drum_serial_no", editData.drum_serial_no || "");

        formData.append("stringing_date", editData.stringing_date || getToday());

        if (editData.stringing_photo instanceof File) {
            formData.append("stringing_photo", editData.stringing_photo);
        }

        if (editData.earthing_photo instanceof File)
            formData.append("earthing_photo", editData.earthing_photo);

        if (editData.jumper_binding_photo instanceof File)
            formData.append("jumper_binding_photo", editData.jumper_binding_photo);

        if (editData.insulator_alignment_photo instanceof File)
            formData.append(
                "insulator_alignment_photo",
                editData.insulator_alignment_photo,
            );

        formData.append("saved_l3_at", new Date().toISOString());

        try {
            await dispatch(PatchPoleLineMaterialData(pole.id, formData));
            setSnackbar({
                open: true,
                message: "Data Saved Successfully",
                severity: "success",
            });

            // await dispatch(GetPoleLinesData());

            await onUpdated();
            setEditMode(false);
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

    const handlePoleApproval = async (pole) => {
        try {
            setSendingId(pole.id);

            const formData = new FormData();

            formData.append("submitted_l3_at", new Date().toISOString());

            await dispatch(PatchPoleLineMaterialData(pole.id, formData));

            setSnackbar({
                open: true,
                message: "Pole submitted successfully",
                severity: "success",
            });

            // Refresh latest data
            // await dispatch(GetPoleLinesData());

            await onUpdated();
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Failed to submit pole",
                severity: "error",
            });
        } finally {
            setSendingId(null);
        }
    };

    const handleCancelClick = () => {
        setEditMode(false);
        setEditData({
            stringing: pole.stringing || "",
            jumper_binding: pole.jumper_binding || "",
            conductor_binding: pole.conductor_binding || "", // ✅ NEW
            earthing: pole.earthing || "",
            conductor_make: pole.conductor_make || "", // ✅
            drum_serial_no: pole.drum_serial_no || "", // ✅
            stringing_date: pole.stringing_date || "",
            stringing_photo: pole.stringing_photo || null,
            earthing_photo: pole.earthing_photo || null,
            jumper_binding_photo: pole.jumper_binding_photo || null,
            insulator_alignment_photo: pole.insulator_alignment_photo || null,
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

    const isPoleLocked = !!pole.submitted_l3_at;

    return ( <
        >
        <
        TableRow sx = {
            {
                height: 45,
                bgcolor: editMode ? "#fff3e0" : isPoleLocked ? "#f3f3f3" : "inherit",

                opacity: isPoleLocked ? 0.65 : 1,
                pointerEvents: isPoleLocked ? "none" : "auto",
            }
        } >
        { /* Action Column */ } <
        TableCell >
        <
        Box sx = {
            {
                display: "flex",
                gap: 0.5
            }
        } > {
            editMode ? ( <
                >
                <
                IconButton color = "success"
                onClick = {
                    handleSaveClick
                }
                size = "small"
                title = "Save"
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
                size = "small"
                title = "Cancel" >
                <
                CancelIcon fontSize = "small" / >
                <
                /IconButton> <
                />
            ) : ( <
                >
                <
                IconButton color = "primary"
                onClick = {
                    handleEditClick
                }
                size = "small"
                title = "Edit Row"
                disabled = {
                    isPoleLocked
                } >
                <
                EditIcon fontSize = "small" / >
                <
                /IconButton>

                {
                    bulkMode && ( <
                        Checkbox size = "small"
                        checked = {
                            bulkSendSelection.includes(pole.id)
                        }
                        onChange = {
                            () => handleBulkSendToggle(pole)
                        }
                        disabled = {!pole.id ||
                            !pole.saved_l3_at ||
                            pole.submitted_l3_at ||
                            pole.approved_l3_at ||
                            editMode ||
                            isPoleLocked
                        }
                        />
                    )
                }


                {
                    pole.approved_l3_at ? ( <
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
                    ) : pole.submitted_l3_at ? ( <
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
                        //     !pole.saved_l3_at ||
                        //     pole.submitted_l3_at ||
                        //     editMode
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
                            (patchLoading && sendingId === pole.id) ||
                            !pole.id ||
                            !pole.saved_l3_at ||
                            pole.submitted_l3_at ||
                            editMode
                        }
                        startIcon = {
                            patchLoading && sendingId === pole.id ? ( <
                                CircularProgress size = {
                                    16
                                }
                                color = "inherit" / >
                            ) : ( <
                                SendIcon / >
                            )
                        }
                        sx = {
                            {
                                ml: 1
                            }
                        } >
                        {
                            patchLoading && sendingId === pole.id ?
                            "Sending..." :
                                "Send"
                        } <
                        /Button>
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
                fontWeight: "bold",
                fontSize: "0.75rem",
                textAlign: "center",
            }
        } >
        {
            pole ? .pole_number ? ( <
                > { /* Pole Number */ } {
                    `P${pole.pole_number.toString().replace(/^p/i, "")} `
                }

                { /* Pole Type */ } <
                span style = {
                    {
                        fontSize: "0.7rem",
                        fontWeight: "normal",
                        color: "#666",
                    }
                } >
                ({
                    (pole.pole_type || "").replace(/_/g, " ").toLowerCase()
                }) <
                /span> <
                />
            ) : (
                "-"
            )
        } <
        /TableCell>

        { /* Stringing */ } <
        TableCell align = "center" >
        <
        Checkbox checked = {
            editMode ? !!editData.stringing : !!pole.stringing
        }
        disabled = {!editMode
        }
        onChange = {
            (e) => handleInputChange("stringing", e.target.checked)
        }
        size = "small"
        color = {
            editMode && errors.stringing ? "error" : "primary"
        }
        sx = {
            {
                p: 0,
                transform: "scale(0.9)",
                "& .MuiSvgIcon-root": {
                    color: editMode && errors.stringing ? "red" : undefined,
                },
            }
        }
        /> <
        /TableCell>

        <
        TableCell align = "center" > {
            pole.pole_type === "cut_pole" ? ( <
                Checkbox checked = {
                    editMode ? !!editData.jumper_binding : !!pole.jumper_binding
                }
                disabled = {!editMode
                }
                onChange = {
                    (e) =>
                    handleInputChange("jumper_binding", e.target.checked)
                }
                size = "small"
                color = {
                    editMode && errors.jumper_binding ? "error" : "primary"
                }
                sx = {
                    {
                        p: 0,
                        transform: "scale(0.9)",
                        "& .MuiSvgIcon-root": {
                            color: editMode && errors.jumper_binding ? "red" : undefined,
                        },
                    }
                }
                />
            ) : (
                "-"
            )
        } <
        /TableCell>

        <
        TableCell align = "center" > {
            pole.pole_type === "line_pole" ? ( <
                Checkbox checked = {
                    editMode ?
                    !!editData.conductor_binding :
                        !!pole.conductor_binding
                }
                disabled = {!editMode
                }
                onChange = {
                    (e) =>
                    handleInputChange("conductor_binding", e.target.checked)
                }
                size = "small"
                color = {
                    editMode && errors.conductor_binding ? "error" : "primary"
                }
                sx = {
                    {
                        p: 0,
                        transform: "scale(0.9)",
                        "& .MuiSvgIcon-root": {
                            color: editMode && errors.conductor_binding ? "red" : undefined,
                        },
                    }
                }
                />
            ) : (
                "-"
            )
        } <
        /TableCell>

        <
        TableCell align = "center" >
        <
        Checkbox checked = {
            editMode ? !!editData.earthing : !!pole.earthing
        }
        disabled = {!editMode
        }
        onChange = {
            (e) => handleInputChange("earthing", e.target.checked)
        }
        size = "small"
        color = {
            editMode && errors.earthing ? "error" : "primary"
        }
        sx = {
            {
                p: 0,
                transform: "scale(0.9)",
                "& .MuiSvgIcon-root": {
                    color: editMode && errors.earthing ? "red" : undefined,
                },
            }
        }
        /> <
        /TableCell>

        { /* Conductor Make */ } <
        TableCell >
        <
        input className = {
            `light-input ${!editMode ? "disabled-input" : ""}`
        }
        value = {
            editMode ? editData.conductor_make : pole.conductor_make
        }
        onChange = {
            (e) =>
            handleInputChange("conductor_make", e.target.value)
        }
        disabled = {!editMode
        }
        style = {
            {
                width: "110px",
                border: errors.conductor_make ? "1px solid red" : "",
            }
        }
        /> <
        /TableCell>

        { /* Drum Serial No */ } <
        TableCell >
        <
        input className = {
            `light-input ${!editMode ? "disabled-input" : ""}`
        }
        value = {
            editMode ? editData.drum_serial_no : pole.drum_serial_no
        }
        onChange = {
            (e) =>
            handleInputChange("drum_serial_no", e.target.value)
        }
        disabled = {!editMode
        }
        style = {
            {
                width: "120px",
                border: errors.drum_serial_no ? "1px solid red" : "",
            }
        }
        /> <
        /TableCell>

        { /* Date */ } <
        TableCell >
        <
        input type = "date"
        className = "light-input"
        value = {
            editMode ?
            editData.stringing_date || getToday() :
                pole.stringing_date || getToday()
        }
        min = {
            getMinDate()
        } // ✅ only last 2 days
        max = {
            getToday()
        } // ❌ future disable
        onChange = {
            (e) =>
            handleInputChange("stringing_date", e.target.value)
        }
        onFocus = {
            (e) => {
                if (e.target.showPicker) e.target.showPicker();
            }
        }
        disabled = {!editMode
        }
        style = {
            {
                width: "130px",
                cursor: editMode ? "pointer" : "default",
                border: errors.stringing_date ? "1px solid red" : "",
            }
        }
        /> <
        /TableCell>

        { /* Photo Upload */ } <
        TableCell > {
            editMode ? ( <
                Box >
                <
                input type = "file"
                accept = "image/*"
                onChange = {
                    (e) => {
                        const file = e.target.files[0];
                        if (file) handleInputChange("stringing_photo", file);
                    }
                }
                style = {
                    {
                        fontSize: "0.75rem",
                        border: errors.stringing_photo ? "1px solid red" : "",
                    }
                }
                />

                { /* 🔥 NEW FILE */ } {
                    editData.stringing_photo && ( <
                        Typography variant = "caption"
                        sx = {
                            {
                                color: "green"
                            }
                        } >
                        New: {
                            editData.stringing_photo.name
                        } <
                        /Typography>
                    )
                }

                { /* 🔥 EXISTING FILE */ } {
                    !editData.stringing_photo && existingPhoto && ( <
                        Typography variant = "caption"
                        sx = {
                            {
                                color: "blue"
                            }
                        } >
                        Current: {
                            existingPhoto.split("/").pop()
                        } <
                        /Typography>
                    )
                } <
                /Box>
            ) : ( <
                Box sx = {
                    {
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5
                    }
                } >
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
                    editData.stringing_photo && ( <
                        Typography variant = "caption"
                        sx = {
                            {
                                maxWidth: 140
                            }
                        }
                        noWrap > {
                            typeof editData.stringing_photo === "string" ?
                            editData.stringing_photo.split("/").pop() :
                                editData.stringing_photo.name
                        } <
                        /Typography>
                    )
                } <
                /Box>
            )
        } <
        /TableCell>

        <
        TableCell > {
            editMode ? ( <
                Box >
                <
                input type = "file"
                accept = "image/*"
                onChange = {
                    (e) => {
                        const file = e.target.files[0];
                        if (file) handleInputChange("earthing_photo", file);
                    }
                }
                style = {
                    {
                        border: errors.earthing_photo ? "1px solid red" : "",
                    }
                }
                />

                {
                    editData.earthing_photo instanceof File && ( <
                        Typography variant = "caption"
                        sx = {
                            {
                                color: "green"
                            }
                        } >
                        New: {
                            editData.earthing_photo.name
                        } <
                        /Typography>
                    )
                }

                {
                    !(editData.earthing_photo instanceof File) &&
                    pole.earthing_photo && ( <
                        Typography variant = "caption"
                        sx = {
                            {
                                color: "blue"
                            }
                        } >
                        Current: {
                            pole.earthing_photo.split("/").pop()
                        } <
                        /Typography>
                    )
                } <
                /Box>
            ) : ( <
                Box sx = {
                    {
                        display: "flex",
                        flexDirection: "column"
                    }
                } >
                <
                input type = "file"
                disabled / > {
                    pole.earthing_photo && ( <
                        Typography variant = "caption" > {
                            pole.earthing_photo.split("/").pop()
                        } <
                        /Typography>
                    )
                } <
                /Box>
            )
        } <
        /TableCell>

        <
        TableCell > {
            pole.pole_type === "cut_pole" ? (
                editMode ? ( <
                    Box >
                    <
                    input type = "file"
                    accept = "image/*"
                    onChange = {
                        (e) => {
                            const file = e.target.files[0];
                            if (file) handleInputChange("jumper_binding_photo", file);
                        }
                    }
                    style = {
                        {
                            border: errors.jumper_binding_photo ? "1px solid red" : "",
                        }
                    }
                    />

                    {
                        editData.jumper_binding_photo instanceof File && ( <
                            Typography variant = "caption"
                            sx = {
                                {
                                    color: "green"
                                }
                            } >
                            New: {
                                editData.jumper_binding_photo.name
                            } <
                            /Typography>
                        )
                    }

                    {
                        !(editData.jumper_binding_photo instanceof File) &&
                        pole.jumper_binding_photo && ( <
                            Typography variant = "caption"
                            sx = {
                                {
                                    color: "blue"
                                }
                            } >
                            Current: {
                                pole.jumper_binding_photo.split("/").pop()
                            } <
                            /Typography>
                        )
                    } <
                    /Box>
                ) : ( <
                    Box sx = {
                        {
                            display: "flex",
                            flexDirection: "column"
                        }
                    } >
                    <
                    input type = "file"
                    disabled / > {
                        pole.jumper_binding_photo && ( <
                            Typography variant = "caption" > {
                                pole.jumper_binding_photo.split("/").pop()
                            } <
                            /Typography>
                        )
                    } <
                    /Box>
                )
            ) : (
                "-"
            )
        } <
        /TableCell>

        <
        TableCell > {
            pole.pole_type === "line_pole" ? (
                editMode ? ( <
                    Box >
                    <
                    input type = "file"
                    accept = "image/*"
                    onChange = {
                        (e) => {
                            const file = e.target.files[0];
                            if (file)
                                handleInputChange("insulator_alignment_photo", file);
                        }
                    }
                    />

                    {
                        editData.insulator_alignment_photo instanceof File && ( <
                            Typography variant = "caption"
                            sx = {
                                {
                                    color: "green"
                                }
                            } >
                            New: {
                                editData.insulator_alignment_photo.name
                            } <
                            /Typography>
                        )
                    }

                    {
                        !(editData.insulator_alignment_photo instanceof File) &&
                        pole.insulator_alignment_photo && ( <
                            Typography variant = "caption"
                            sx = {
                                {
                                    color: "blue"
                                }
                            } >
                            Current: {
                                pole.insulator_alignment_photo.split("/").pop()
                            } <
                            /Typography>
                        )
                    } <
                    /Box>
                ) : ( <
                    Box sx = {
                        {
                            display: "flex",
                            flexDirection: "column"
                        }
                    } >
                    <
                    input type = "file"
                    disabled / > {
                        pole.insulator_alignment_photo && ( <
                            Typography variant = "caption" > {
                                pole.insulator_alignment_photo.split("/").pop()
                            } <
                            /Typography>
                        )
                    } <
                    /Box>
                )
            ) : (
                "-"
            )
        } <
        /TableCell> <
        /TableRow>

        <
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
                horizontal: "right",
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
        /Snackbar> <
        />
    );
};

const DCOHL3 = ({
        filters,
        selectedLineId
    }) => {
        const dispatch = useDispatch();
        const [selectedLine, setSelectedLine] = useState(null);
        const [limit, setLimit] = useState(50);

        // 🔥 ONLY for initial/line-change data fetch
        const [lineLoading, setLineLoading] = useState(false);


        const [bulkSendSelection, setBulkSendSelection] = useState([]);
        const [bulkMode, setBulkMode] = useState(false);
        const [bulkSending, setBulkSending] = useState(false);

        const [snackbar, setSnackbar] = useState({
            open: false,
            message: "",
            severity: "success",
        });

        const isFilterIncomplete = !filters.project || !filters.windfarm;

        const getHelperText = () => {
            if (!filters.project) return "Select Project first";
            if (!filters.windfarm) return "Select Windfarm to enable lines";
            // if (!filters.cluster) return "Select Cluster to enable lines";
            return "Select a line";
        };


        const handleBulkSend = async () => {
            try {
                setBulkSending(true);

                const payload = {
                    ids: bulkSendSelection,
                    submitted_l3_at: new Date().toISOString(),
                };

                const response = await dispatch(BulkPatchPoleLineMaterialData(payload));

                setSnackbar({
                    open: true,
                    severity: "success",
                    message: response ? .message ||
                        `${response?.updated_count || bulkSendSelection.length} poles submitted successfully.`,
                });

                setBulkSendSelection([]);
                setBulkMode(false);

                // await dispatch(GetPoleLinesData());

                await refreshSelectedLineData();
            } catch (err) {
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
        //   setSelectedLine(null); // ya ""
        //   setLimit(50);

        //   // Reset ke baad latest data fetch karo
        //   dispatch(GetPoleLinesData());
        // }, [filters.project, filters.windfarm, dispatch]);

        // useEffect(() => {
        //   dispatch(GetElectricalMasterData());
        // }, [dispatch]);

        // useEffect(() => {
        //   dispatch(GetPoleLinesData());
        // }, [dispatch]);


        useEffect(() => {
            setSelectedLine(null);
            setLimit(50);
            setBulkSendSelection([]);
            setBulkMode(false);

            // 🔥 No line selected after filter change
            setLineLoading(false);
        }, [filters.project, filters.windfarm]);


        useEffect(() => {
            dispatch(GetElectricalMasterData());
        }, [dispatch]);




        useEffect(() => {
            if (!filters.project ||
                !filters.windfarm ||

                !selectedLine
            ) {
                setLineLoading(false);
                return;
            }

            let isMounted = true;

            const fetchLineData = async () => {
                if (isMounted) {
                    setLineLoading(true);
                }

                try {
                    await dispatch(
                        GetPoleLinesData({
                            project: filters.project,
                            windfarm: filters.windfarm,

                            line_id: selectedLine,
                        })
                    );
                } finally {
                    if (isMounted) {
                        setLineLoading(false);
                    }
                }
            };

            fetchLineData();

            return () => {
                isMounted = false;
            };
        }, [
            dispatch,
            filters.project,
            filters.windfarm,

            selectedLine,
        ]);






        const {
            getElectricalMaster = []
        } = useSelector((state) => state.masterData);
        const {
            getpoLineData = []
        } = useSelector((state) => state.electricalData);

        const lineOptions = [
            ...new Map(
                getElectricalMaster
                .filter((item) => {
                    return (
                        (!filters ? .project || item.project === Number(filters.project)) &&
                        (!filters ? .windfarm ||
                            item.windfarm === Number(filters.windfarm)) &&
                        // (!filters?.cluster || item.cluster === Number(filters.cluster))&&

                        item.line_type === "DCOH (Double Circuit Overhead Line)"
                    );
                })
                .map((item) => [item.id, item]),
            ).values(),
        ];

        // const filteredPoles = getpoLineData.filter(
        //   (item) =>
        //     Number(item.electrical_line) === Number(selectedLine) &&
        //     !!item.approved_l2_at,
        // );


        const filteredPoles = getpoLineData.filter(
            (item) => !!item.approved_l2_at
        );

        const selectedLineData = getElectricalMaster.find(
            (item) => Number(item.id) === Number(selectedLine),
        );
        const isL3Submitted = selectedLineData ? .submitted_l3_at !== null;


        const refreshSelectedLineData = () => {
            if (!filters.project ||
                !filters.windfarm ||

                !selectedLine
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
        };


        const handleBulkSendToggle = (pole) => {
            // Only saved L3 data can be submitted
            if (pole.submitted_l3_at || pole.approved_l3_at || !pole.saved_l3_at) {
                return;
            }

            setBulkSendSelection((prev) => {
                if (prev.includes(pole.id)) {
                    return prev.filter((id) => id !== pole.id);
                }

                return [...prev, pole.id];
            });
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
            Card sx = {
                {
                    mb: 3,
                    textAlign: "center"
                }
            } >
            <
            CardContent >
            <
            img src = {
                stringingIMG
            }
            alt = "Stringing"
            style = {
                {
                    width: "100%",
                    maxHeight: 180,
                    objectFit: "contain"
                }
            }
            /> <
            Typography variant = "h6"
            mt = {
                2
            } >
            Level 3 <
            /Typography> <
            /CardContent> <
            /Card>

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
                selectedLine
            }
            label = "Line Name"
            onChange = {
                (e) => setSelectedLine(e.target.value)
            }
            disabled = {
                isFilterIncomplete
            } // 🔥 disable here
            >
            {
                lineOptions.length > 0 ? (
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
                ) : ( <
                    MenuItem disabled > No Line Available < /MenuItem>
                )
            } <
            /Select> <
            Typography > {
                getHelperText()
            } < /Typography> <
            /FormControl> <
            /Box>


            <
            Box sx = {
                {
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 1,
                    mt: -4,

                    mb: 1,
                }
            } >
            {!bulkMode ? ( <
                    Button variant = "outlined"
                    onClick = {
                        () => setBulkMode(true)
                    } >
                    Bulk Send For Approval <
                    /Button>
                ) : ( <
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
                                16
                            }
                            color = "inherit" / >
                        ) : ( <
                            SendIcon / >
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


            <
            TableContainer component = {
                Paper
            }
            sx = {
                {
                    maxHeight: "65vh",
                    overflow: "auto",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                }
            } >
            <
            style > {
                `
          .light-input { 
            width: 90px; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.8rem;
          }
          .light-input:focus { border-color: #1976d2; outline: none; box-shadow: 0 0 3px rgba(25,118,210,0.3); }
          .disabled-input {
            border-color: transparent !important;
            background-color: transparent !important;
            color: inherit !important;
            appearance: none;
            cursor: default;
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
                    "Actions",
                    "Pole No",
                    "Stringing",
                    "Jumper Binding",
                    "Conductor Binding", // ✅ NEW COLUMN
                    "Earthing",
                    "Conductor Make",
                    "Drum Serial No",
                    "Stringing Date",
                    "Stringing Photo",
                    "Earthing Photo",
                    "Jumper Photo",
                    "Insulator Photo",
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

                            ...(h === "Pole No" && {
                                minWidth: 80, // 👈 Pole No column width increased
                                width: 80,
                            }),
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
            TableBody > {!selectedLine ? ( <
                    TableRow >
                    <
                    TableCell colSpan = {
                        13
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

                ) : lineLoading ? (
                        // 🔥 ONLY LINE CHANGE LOADER
                        <
                        TableRow >
                        <
                        TableCell colSpan = {
                            13
                        }
                        align = "center" >
                        <
                        Box sx = {
                            {
                                py: 6,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                            }
                        } >
                        <
                        CircularProgress size = {
                            30
                        }
                        /> <
                        Typography variant = "body2"
                        color = "textSecondary" >
                        Loading poles...
                        <
                        /Typography> <
                        /Box> <
                        /TableCell> <
                        /TableRow>




                    ) : (
                        filteredPoles.slice(0, limit).map((pole) => (

                            <
                            DCOHLevel3Row key = {
                                pole.id
                            }
                            pole = {
                                pole
                            }
                            bulkMode = {
                                bulkMode
                            }
                            bulkSendSelection = {
                                bulkSendSelection
                            }
                            handleBulkSendToggle = {
                                handleBulkSendToggle
                            }
                            onUpdated = {
                                refreshSelectedLineData
                            }

                            />)
                        ))
                    } <
                    /TableBody> <
                    /Table>

                {
                    selectedLine && filteredPoles.length > 0 && ( <
                        Box sx = {
                            {
                                p: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                bgcolor: "#f9f9f9",
                                borderTop: "1px solid #eee",
                            }
                        } >
                        <
                        Typography variant = "caption"
                        color = "textSecondary" >
                        Showing {
                            Math.min(limit, filteredPoles.length)
                        } of {
                            " "
                        } {
                            filteredPoles.length
                        }
                        poles <
                        /Typography> {
                            filteredPoles.length > limit && ( <
                                Button size = "small"
                                variant = "outlined"
                                onClick = {
                                    () => setLimit((prev) => prev + 100)
                                } >
                                Load + 100 <
                                /Button>
                            )
                        } <
                        /Box>
                    )
                } <
                /TableContainer>

                <
                Snackbar
                open = {
                    snackbar.open
                }
                autoHideDuration = {
                    3000
                }
                onClose = {
                    () =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
                anchorOrigin = {
                    {
                        vertical: "top",
                        horizontal: "right",
                    }
                } >
                <
                Alert
                severity = {
                    snackbar.severity
                }
                onClose = {
                    () =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false,
                    }))
                } >
                {
                    snackbar.message
                } <
                /Alert> <
                /Snackbar>


                <
                /Box>
            );
        };

        export default DCOHL3;