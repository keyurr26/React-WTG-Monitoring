import React, {
    useState,
    memo
} from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TableContainer,
    IconButton,
    Box,
    Button,
    CircularProgress,
    Typography,
    Snackbar,
    Alert,
    Checkbox, // ✅ ADDED
    Tooltip
} from "@mui/material";
import {
    DeleteOutline as DeleteIcon,
    AddCircleOutline as AddIcon,
    CheckCircleOutline as SubmitIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CancelIcon,
} from "@mui/icons-material";

import SendIcon from "@mui/icons-material/Send";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {

    UPSERTPOLELINEDATA,
    PatchPoleLineMaterialData,
    BulkPatchPoleLineMaterialData,
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";



// ==================== MEMOIZED ROW COMPONENT ====================
const PoleRow = memo(
    ({
        row,
        rows,
        index,
        onUpdateRow,
        onRemoveRow,
        isFirst,
        isLast,
        turbines,
        selectedLineId,
        selectedLineData,
        onDataSaved,
        setSnackbar,
        // ✅ New props for checkbox selection
        selectedPoles,
        setSelectedPoles,
        electricalContractors,
        clearBulkCache,
        bulkSendSelection,
        setBulkSendSelection,
        bulkMode,
    }) => {
        const [loading, setLoading] = useState(false);
        const dispatch = useDispatch();
        const [editMode, setEditMode] = useState(false);
        const [editData, setEditData] = useState({ ...row
        });
        const [errors, setErrors] = useState({});
        const [selectedFile, setSelectedFile] = useState(null);
        const [existingPhoto, setExistingPhoto] = useState(row.photo);
        // Add new state with photo state
        const [existingAgreementAttachment, setExistingAgreementAttachment] =
        useState(row.agreementAttachment);

        const [sendingId, setSendingId] = useState(null);

        const isPoleLocked = !!row.submitted_l1_at;

        const {
            patchLoading
        } = useSelector(
            (state) => state.electricalData, // <-- apna reducer name
        );

        const getToday = () => {
            return new Date().toISOString().split("T")[0];
        };

        const getMinDate = () => {
            const d = new Date();
            d.setDate(d.getDate() - 2);
            return d.toISOString().split("T")[0];
        };

        const handleEditClick = () => {
            setEditMode(true);
            setEditData({
                ...row,
                type: row.type || "line_pole",
                material: row.material || "11m",

                date: row.date || getToday(),
            });
            setSelectedFile(null);
            setExistingPhoto(row.photo);
            setExistingAgreementAttachment(row.agreementAttachment); // Store existing agreement attachment
        };

        const handleSaveClick = async () => {
            const validationErrors = {};

            if (!editData.easting ? .toString().trim()) {
                validationErrors.easting = "Required";
            }

            if (!editData.northing ? .toString().trim()) {
                validationErrors.northing = "Required";
            }

            if (!editData.material) {
                validationErrors.material = "Required";
            }

            if (!editData.type) {
                validationErrors.type = "Required";
            }

            if (!editData.landType) {
                validationErrors.landType = "Required";
            }

            if (!editData.contractorId) {
                validationErrors.contractorId = "Required";
            }

            if (!editData.surveyNo ? .toString().trim()) {
                validationErrors.surveyNo = "Required";
            }

            if (!editData.agreementAttachment && !existingAgreementAttachment) {
                validationErrors.agreementAttachment = "Agreement required";
            }

            if (!isFirst && !editData.span) {
                validationErrors.span = "Required";
            }

            if (!editData.date) {
                validationErrors.date = "Required";
            }

            if (!selectedFile && (!existingPhoto || existingPhoto === "null")) {
                validationErrors.photo = "Photo is required";
            }

            if (
                editData.landType === "Private" &&
                !editData.agreementAttachment &&
                !existingAgreementAttachment
            ) {
                validationErrors.agreementAttachment = "Agreement required";
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

            // Check Duplicate Easting + Northing
            const isDuplicate = rows.some((r, i) => {
                if (i === index) return false; // Skip current row

                return (
                    String(r.easting).trim() === String(editData.easting).trim() &&
                    String(r.northing).trim() === String(editData.northing).trim()
                );
            });

            if (isDuplicate) {
                setSnackbar({
                    open: true,
                    message: "Duplicate Easting & Northing is not allowed.",
                    severity: "error",
                });
                return;
            }

            Object.keys(editData).forEach((key) => {
                if (editData[key] !== row[key]) {
                    onUpdateRow(index, key, editData[key]);
                }
            });

            setLoading(true);

            const formData = new FormData();

            if (row.id && typeof row.id === "number") {
                formData.append("id", row.id);
            }

            formData.append("electrical_line", selectedLineId);
            formData.append("pole_number", row.poleNo);
            formData.append("easting", Number(editData.easting) || 0);
            formData.append("northing", Number(editData.northing) || 0);
            formData.append("pole_type", editData.type || "line_pole");
            formData.append("pole_height", editData.material || null);
            formData.append("span", Number(editData.span) || 0);
            formData.append("crossing_type", editData.crossing || "");
            formData.append("start_date", editData.date || getToday());
            formData.append("line_crossing_details", editData.details || "");
            formData.append("turbine_interconnected", editData.turbineId || "");

            formData.append("land_type", editData.landType || "");
            formData.append("contractor", editData.contractorId || "");
            formData.append("survey_no", editData.surveyNo || "");
            formData.append("village", editData.village || "");
            formData.append("progress_percent", 0);
            formData.append("saved_l1_at", new Date().toISOString());

            if (selectedFile) {
                formData.append("photo", selectedFile);
            } else if (
                existingPhoto &&
                typeof existingPhoto === "string" &&
                existingPhoto !== "null"
            ) {
                formData.append("existing_photo", existingPhoto);
            }

            // 🔥 FIXED AGREEMENT ATTACHMENT HANDLING
            if (
                editData.agreementAttachment &&
                editData.agreementAttachment instanceof File
            ) {
                // New file selected
                formData.append("file", editData.agreementAttachment);
            } else if (
                existingAgreementAttachment &&
                typeof existingAgreementAttachment === "string" &&
                existingAgreementAttachment !== "null"
            ) {
                // Keep existing agreement attachment
                formData.append("existing_file", existingAgreementAttachment);
            }

            try {
                await dispatch(UPSERTPOLELINEDATA(formData));

                clearBulkCache(row.poleNo);

                setSnackbar({
                    open: true,
                    message: "Data Saved Successfully",
                    severity: "success",
                });

                setEditMode(false);
                setSelectedFile(null);

                if (onDataSaved) {
                    onDataSaved();
                }
            } catch (err) {
                const apiErrors = err.response ? .data;

                if (apiErrors ? .error_list ? .length > 0) {
                    const firstError = apiErrors.error_list[0].error;

                    const msg =
                        firstError ? .easting ? .[0] ||
                        firstError ? .northing ? .[0] ||
                        firstError ? .non_field_errors ? .[0] ||
                        "this easting and northing is already exists";

                    setSnackbar({
                        open: true,
                        message: msg,
                        severity: "error",
                    });

                    return;
                }

                setSnackbar({
                    open: true,
                    message: "Failed to save data",
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        const handleCancelClick = () => {
            setEditMode(false);
            setEditData({ ...row
            });
            setSelectedFile(null);
        };

        const handlePoleApproval = async () => {
            try {
                setSendingId(row.id); // ✅ loader kis row pe dikhana hai

                const payload = {
                    submitted_l1_at: new Date().toISOString(),
                };

                await dispatch(PatchPoleLineMaterialData(row.id, payload));

                setSnackbar({
                    open: true,
                    message: "Submitted Successfully",
                    severity: "success",
                });

                if (onDataSaved) {
                    onDataSaved();
                }
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: "Submission Failed",
                    severity: "error",
                });
            } finally {
                setSendingId(null); // ✅ loader hata do
            }
        };

        const handleFileChange = (file) => {
            setSelectedFile(file);
            handleInputChange("photo", file);
        };

        const handleInputChange = (field, value) => {
            setEditData((prev) => {
                const updated = {
                    ...prev,
                    [field]: value,
                };

                // Auto change pole height based on type
                if (field === "type") {
                    updated.material = value === "cut_pole" ? "13m" : "11m";
                }

                return updated;
            });

            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        };

        // ✅ Checkbox handler
        const handleCheckboxChange = (e) => {
            if (e.target.checked) {
                setSelectedPoles((prev) => [...prev, row.poleNo]);
            } else {
                setSelectedPoles((prev) => prev.filter((x) => x !== row.poleNo));
            }
        };

        const handleBulkSendToggle = () => {
            if (bulkSendSelection.includes(row.id)) {
                setBulkSendSelection((prev) => prev.filter((id) => id !== row.id));
            } else {
                setBulkSendSelection((prev) => [...prev, row.id]);
            }
        };

        return ( <
            TableRow sx = {
                {
                    "&:nth-of-type(odd)": {
                        bgcolor: isPoleLocked ? "#f3f3f3" : "#fafafa",
                    },
                    height: 45,
                    bgcolor: editMode ? "#fff3e0" : isPoleLocked ? "#f3f3f3" : "inherit",
                    opacity: isPoleLocked ? 0.65 : 1,
                    pointerEvents: isPoleLocked ? "none" : "auto",
                }
            } >
            { /* ✅ CHANGE 3: Checkbox Column */ } <
            TableCell sx = {
                {
                    textAlign: "center"
                }
            } >
            <
            Checkbox checked = {
                selectedPoles ? .includes(row.poleNo) || false
            }
            onChange = {
                handleCheckboxChange
            }
            size = "small"
            // disabled={editMode}
            disabled = {
                editMode || isPoleLocked
            }
            /> <
            /TableCell>

            <
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
                                bulkSendSelection.includes(row.id)
                            }
                            onChange = {
                                handleBulkSendToggle
                            }
                            disabled = {!row.id ||
                                !row.saved_l1_at ||
                                row.submitted_l1_at ||
                                row.approved_l1_at
                            }
                            />
                        )
                    }

                    {
                        isLast && ( <
                            Tooltip title = {
                                row.saved_l1_at ?
                                "Saved pole cannot be deleted" :
                                    "Delete Last Pole"
                            } >
                            <
                            span >
                            <
                            IconButton color = "error"
                            onClick = {
                                () => onRemoveRow(index)
                            }
                            size = "small"
                            disabled = {
                                isPoleLocked || !!row.saved_l1_at
                            } >
                            <
                            DeleteIcon fontSize = "small" / >
                            <
                            /IconButton> <
                            /span> <
                            /Tooltip>
                        )
                    }

                    {
                        row.approved_l1_at ? ( <
                            Button size = "small"
                            color = "success"
                            variant = "contained"
                            disabled sx = {
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
                        ) : row.submitted_l1_at ? ( <
                            Button size = "small"
                            color = "info"
                            variant = "contained"
                            disabled >
                            Submitted <
                            /Button>
                        ) : ( <
                            Button size = "small"
                            color = "primary"
                            variant = "contained"
                            onClick = {
                                handlePoleApproval
                            }
                            disabled = {
                                (patchLoading && sendingId === row.id) ||
                                !row.id ||
                                !row.saved_l1_at ||
                                row.submitted_l1_at
                            }
                            startIcon = {
                                patchLoading && sendingId === row.id ? ( <
                                    CircularProgress size = {
                                        16
                                    }
                                    color = "inherit" / >
                                ) : ( <
                                    SendIcon / >
                                )
                            } >
                            {
                                patchLoading && sendingId === row.id ?
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
                    fontSize: "0.75rem"
                }
            } > {
                row.poleNo
            } <
            /TableCell>

            <
            TableCell >
            <
            input className = {
                `light-input ${!editMode ? "disabled-input" : ""}${errors.easting ? "error-input" : ""} `
            }
            style = {
                {
                    border: errors.easting ? "1px solid red" : "",
                }
            }
            value = {
                editMode ? editData.easting : row.easting
            }
            onChange = {
                (e) => handleInputChange("easting", e.target.value)
            }
            disabled = {!editMode
            }
            placeholder = "Easting"
            required /
            >
            <
            /TableCell>

            <
            TableCell >
            <
            input className = {
                `light-input ${!editMode ? "disabled-input" : ""}`
            }
            style = {
                {
                    border: errors.northing ? "1px solid red" : "",
                }
            }
            value = {
                editMode ? editData.northing : row.northing
            }
            onChange = {
                (e) => handleInputChange("northing", e.target.value)
            }
            disabled = {!editMode
            }
            placeholder = "Northing" /
            >
            <
            /TableCell>

            <
            TableCell >
            <
            select className = {
                `light-select ${!editMode ? "disabled-input" : ""}`
            }
            value = {
                editMode ? editData.turbineId : row.turbineId || ""
            }
            onChange = {
                (e) => handleInputChange("turbineId", e.target.value)
            }
            disabled = {!editMode
            } >
            <
            option value = "" > None < /option> {
                turbines ? .map((t) => ( <
                    option key = {
                        t.id
                    }
                    value = {
                        t.id
                    } > {
                        t.name
                    } <
                    /option>
                ))
            } <
            /select> <
            /TableCell>

            <
            TableCell >
            <
            select className = {
                `light-select ${!editMode ? "disabled-input" : ""}`
            }
            value = {
                editMode ? editData.type || "line_pole" : row.type || "line_pole"
            }
            onChange = {
                (e) => handleInputChange("type", e.target.value)
            }
            disabled = {!editMode
            } >
            <
            option value = "line_pole" > Line Pole < /option> <
            option value = "cut_pole" > Cut Pole < /option> <
            /select> <
            /TableCell>

            <
            TableCell >
            <
            select className = {
                `light-select ${!editMode ? "disabled-input" : ""}`
            }
            value = {
                editMode ? editData.material : row.material
            }
            onChange = {
                (e) => handleInputChange("material", e.target.value)
            }
            disabled = {!editMode
            }
            style = {
                {
                    border: errors.material ? "1px solid red" : "",
                }
            } >
            <
            option value = "" > Pole Height < /option> <
            option value = "11m" > 11 m Pole < /option> <
            option value = "13m" > 13 m Pole < /option> <
            /select> <
            /TableCell>

            <
            TableCell >
            <
            input type = "number"
            className = {
                `light-input ${!editMode || isFirst ? "disabled-input" : ""}`
            }
            style = {
                {
                    width: "65px",
                    fontWeight: isFirst ? 400 : 700,
                    border: errors.span ? "1px solid red" : "",
                }
            }
            disabled = {!editMode || isFirst
            }
            value = {
                isFirst ? 0 : editMode ? editData.span : row.span
            }
            onChange = {
                (e) => handleInputChange("span", e.target.value)
            }
            /> <
            /TableCell>

            <
            TableCell >
            <
            select className = {
                `light-select ${!editMode ? "disabled-input" : ""}`
            }
            value = {
                editMode ? editData.crossing : row.crossing
            }
            onChange = {
                (e) => handleInputChange("crossing", e.target.value)
            }
            disabled = {!editMode
            } >
            <
            option value = "" > None < /option> <
            option value = "road" > Road < /option> <
            option value = "rail" > Rail < /option> <
            option value = "river" > River < /option> <
            option value = "canal" > Canal < /option> <
            option value = "building" > Building < /option> <
            option value = "line_cross" > Line Cross < /option> <
            /select> <
            /TableCell>

            { /* Land Type */ } <
            TableCell >
            <
            select className = {
                `light-select ${!editMode ? "disabled-input" : ""}`
            }
            value = {
                editMode ? editData.landType || "" : row.landType || ""
            }
            onChange = {
                (e) => handleInputChange("landType", e.target.value)
            }
            disabled = {!editMode
            }
            style = {
                {
                    border: errors.landType ? "1px solid red" : "",
                }
            } >
            <
            option value = "" > Select < /option> <
            option value = "Private" > Private < /option> <
            option value = "Government" > Government < /option> <
            option value = "Forest" > Forest < /option> <
            option value = "Leasehold" > Leasehold < /option> <
            option value = "Other" > Other < /option> <
            /select> <
            /TableCell>

            { /* contractor name */ }

            <
            TableCell >
            <
            select className = {
                `light-select ${!editMode ? "disabled-input" : ""}`
            }
            value = {
                editMode ? editData.contractorId || "" : row.contractorId || ""
            }
            style = {
                {
                    border: errors.contractorId ? "1px solid red" : "",
                }
            }
            onChange = {
                (e) => handleInputChange("contractorId", e.target.value)
            }
            disabled = {!editMode
            } >
            <
            option value = "" > Select < /option>

            {
                electricalContractors ? .map((c) => ( <
                    option key = {
                        c.id
                    }
                    value = {
                        c.id
                    } > {
                        c.firm_name
                    } <
                    /option>
                ))
            } <
            /select> <
            /TableCell>

            { /* Survey No */ } <
            TableCell >
            <
            input className = {
                `light-input ${!editMode ? "disabled-input" : ""}`
            }
            value = {
                editMode ? editData.surveyNo || "" : row.surveyNo || ""
            }
            style = {
                {
                    border: errors.surveyNo ? "1px solid red" : "",
                }
            }
            onChange = {
                (e) => handleInputChange("surveyNo", e.target.value)
            }
            disabled = {!editMode
            }
            placeholder = "Survey No" /
            >
            <
            /TableCell>

            { /* Village */ } <
            TableCell >
            <
            input className = {
                `light-input ${!editMode ? "disabled-input" : ""}`
            }
            value = {
                editMode ? editData.village || "" : row.village || ""
            }
            onChange = {
                (e) => handleInputChange("village", e.target.value)
            }
            disabled = {!editMode
            }
            placeholder = "Village" /
            >
            <
            /TableCell>

            { /* Agreement Attachment - SAME AS PHOTO UI */ } <
            TableCell > {
                editMode ? ( <
                    Box >
                    <
                    input type = "file"
                    accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange = {
                        (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                handleInputChange("agreementAttachment", file);
                            }
                        }
                    }
                    //  disabled={editData.landType !== "Private"}
                    required = {
                        editData.landType === "Private"
                    }
                    style = {
                        {
                            fontSize: "0.75rem",
                            border: errors.agreementAttachment ? "1px solid red" : "",
                        }
                    }
                    />

                    { /* Mandatory message */ } {
                        editData.landType === "Private" && ( <
                            Typography variant = "caption"
                            color = "error"
                            sx = {
                                {
                                    display: "block",
                                    mt: 0.5
                                }
                            } >
                            *
                            Mandatory
                            for Private land <
                            /Typography>
                        )
                    }

                    { /* New selected file */ } {
                        editData.agreementAttachment &&
                            editData.agreementAttachment instanceof File && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        display: "block",
                                        mt: 0.5,
                                        color: "green"
                                    }
                                } >
                                New: {
                                    editData.agreementAttachment.name
                                } <
                                /Typography>
                            )
                    }

                    { /* Existing attachment */ } {
                        !(
                            editData.agreementAttachment &&
                            editData.agreementAttachment instanceof File
                        ) &&
                        existingAgreementAttachment &&
                            existingAgreementAttachment !== "null" && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        display: "block",
                                        mt: 0.5,
                                        color: "blue"
                                    }
                                } >
                                Current: {
                                    " "
                                } {
                                    typeof existingAgreementAttachment === "string" ?
                                        existingAgreementAttachment.split("/").pop() :
                                        "Attachment exists"
                                } <
                                /Typography>
                            )
                    } <
                    /Box>
                ) : (
                    /* VIEW MODE */
                    <
                    Box sx = {
                        {
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5
                        }
                    } > {
                        row.agreementAttachment && row.agreementAttachment !== "null" ? ( <
                            Typography variant = "caption"
                            sx = {
                                {
                                    maxWidth: 150,
                                    color: "green"
                                }
                            }
                            noWrap >
                            📎{
                                " "
                            } {
                                row.agreementAttachment instanceof File ?
                                    row.agreementAttachment.name :
                                    typeof row.agreementAttachment === "string" ?
                                    row.agreementAttachment.split("/").pop() :
                                    "Attachment uploaded"
                            } <
                            /Typography>
                        ) : ( <
                            Typography variant = "caption"
                            color = "textSecondary" >
                            No attachment <
                            /Typography>
                        )
                    } <
                    /Box>
                )
            } <
            /TableCell>

            <
            TableCell >
            <
            input type = "date"
            className = "light-input"
            value = {
                editMode ? editData.date || getToday() : row.date || getToday()
            }
            min = {
                getMinDate()
            }
            max = {
                getToday()
            }
            onChange = {
                (e) => handleInputChange("date", e.target.value)
            }
            onFocus = {
                (e) => {
                    if (e.target.showPicker) {
                        e.target.showPicker();
                    }
                }
            }
            disabled = {!editMode
            }
            style = {
                {
                    width: "130px",
                    cursor: editMode ? "pointer" : "default",
                    border: errors.date ? "1px solid red" : "",
                }
            }
            /> <
            /TableCell>

            <
            TableCell >
            <
            input className = {
                `light-input ${!editMode ? "disabled-input" : ""}`
            }
            value = {
                editMode ? editData.details || "" : row.details || ""
            }
            onChange = {
                (e) => handleInputChange("details", e.target.value)
            }
            disabled = {!editMode
            }
            placeholder = "Details" /
            >
            <
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
                            if (file) {
                                handleFileChange(file);
                            }
                        }
                    }
                    style = {
                        {
                            fontSize: "0.75rem",
                            border: errors.photo ? "1px solid red" : "",
                        }
                    }
                    /> {
                        selectedFile && ( <
                            Typography variant = "caption"
                            sx = {
                                {
                                    display: "block",
                                    mt: 0.5,
                                    color: "green"
                                }
                            } >
                            New: {
                                selectedFile.name
                            } <
                            /Typography>
                        )
                    } {
                        !selectedFile && existingPhoto && existingPhoto !== "null" && ( <
                            Typography variant = "caption"
                            sx = {
                                {
                                    display: "block",
                                    mt: 0.5,
                                    color: "blue"
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
                ) : ( <
                    Box sx = {
                        {
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5
                        }
                    } > {
                        row.photo && row.photo !== "null" ? ( <
                            Typography variant = "caption"
                            sx = {
                                {
                                    maxWidth: 150,
                                    color: "green"
                                }
                            }
                            noWrap >
                            📷{
                                " "
                            } {
                                typeof row.photo === "string" ?
                                    row.photo.split("/").pop() :
                                    "Photo uploaded"
                            } <
                            /Typography>
                        ) : ( <
                            Typography variant = "caption"
                            color = "textSecondary" >
                            No photo <
                            /Typography>
                        )
                    } <
                    /Box>
                )
            } <
            /TableCell> <
            /TableRow>
        );
    },
);

// ==================== MAIN TABLE COMPONENT ====================
const SCOHPoleDataTable_Dog = ({
    rows,
    onUpdateRow,
    onAddRow,
    onRemoveRow,
    onSubmit,
    turbines,
    loading,
    selectedLineId,
    onRefreshData,
    selectedLineData,

    // ✅ New props
    selectedPoles,
    setSelectedPoles,
    electricalContractors,
    clearBulkCache,
    isLineLocked,
}) => {
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(50);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [bulkSendSelection, setBulkSendSelection] = useState([]);
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkSending, setBulkSending] = useState(false);

    const handleBulkSend = async () => {
        try {
            setBulkSending(true);

            const payload = {
                ids: bulkSendSelection,
                submitted_l1_at: new Date().toISOString(),
            };

            const response = await dispatch(BulkPatchPoleLineMaterialData(payload));

            setSnackbar({
                open: true,
                severity: "success",
                message: response ? .message ||
                    `${response?.updated_count || bulkSendSelection.length} poles submitted successfully.`,
            });

            setBulkSendSelection([]);

            onRefreshData();
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


    // Yeh function banao component ke andar (bulkMode ke neeche)
    const handleAddNewPole = () => {
        onAddRow(); // Pehle row add karo

        // Phir scroll karo bottom pe
        setTimeout(() => {
            const table = document.querySelector('.MuiTableContainer-root');
            if (table) table.scrollTop = table.scrollHeight;
        }, 100);
    };

    if (loading)
        return ( <
            Paper sx = {
                {
                    p: 4,
                    textAlign: "center"
                }
            } >
            <
            CircularProgress size = {
                30
            }
            /> <
            Typography variant = "body2"
            sx = {
                {
                    mt: 1
                }
            } >
            Syncing Poles...
            <
            /Typography> <
            /Paper>
        );

    return ( <
        >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 1,
                mb: 2,
            }
        } >
        {!bulkMode ? ( <
                Button variant = "outlined"
                startIcon = { < SendIcon / >
                }
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
                            18
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
                position: "relative",
            }
        } >
        <
        style > {
            `
          .light-input { 
               width: auto; 
           min-width: 80px;
           

           padding: 4px 6px; 
           border: 1px solid #ccc; 
           border-radius: 4px; 
           font-size: 0.8rem;
          }
          .light-select { 
          width: auto;  
          min-width: 90px;
           padding: 4px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.8rem; background: white;
        }

           .light-input:focus, .light-select:focus { border-color: #1976d2; outline: none; box-shadow: 0 0 3px rgba(25,118,210,0.3); }
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
                "Select", // ✅ New Select Column
                "Actions",
                "Pole No",
                "Easting",
                "Northing",
                "Turbine",
                "Type",
                "Pole Height",
                "Span(m)",
                "Crossing",

                "Land Type", // ✅ NEW
                "Contractor Name", // NEW
                "Survey No", // ✅ NEW
                "Village", // ✅ NEW
                "Agreement / Document",

                "Erection Date",
                "Details",
                "Photo",
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
            rows.slice(0, limit).map((row, idx) => (

                // {rows.map((row, idx) => (
                <
                PoleRow key = {
                    row.id
                }
                index = {
                    idx
                }
                row = {
                    row
                }
                rows = {
                    rows
                }
                isFirst = {
                    idx === 0
                }
                isLast = {
                    idx === rows.length - 1
                } // ✅ add this
                turbines = {
                    turbines
                }
                onUpdateRow = {
                    onUpdateRow
                }
                onRemoveRow = {
                    onRemoveRow
                }
                selectedLineId = {
                    selectedLineId
                }
                selectedLineData = {
                    selectedLineData
                }
                onDataSaved = {
                    onRefreshData
                }
                setSnackbar = {
                    setSnackbar
                }
                // ✅ Pass checkbox props
                selectedPoles = {
                    selectedPoles
                }
                setSelectedPoles = {
                    setSelectedPoles
                }
                electricalContractors = {
                    electricalContractors
                }
                clearBulkCache = {
                    clearBulkCache
                }
                bulkSendSelection = {
                    bulkSendSelection
                }
                setBulkSendSelection = {
                    setBulkSendSelection
                }
                bulkMode = {
                    bulkMode
                }
                />
            ))
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        { /* ================= FIXED BOTTOM BAR - OUTSIDE TABLE CONTAINER ================= */ } <
        Box sx = {
            {
                mt: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "8px",
                flexWrap: "wrap",
                gap: 1,
            }
        } >
        { /* Left side - Showing count */ } <
        Typography variant = "caption"
        color = "textSecondary" >
        Showing {
            Math.min(limit, rows.length)
        } of {
            rows.length
        }
        poles <
        /Typography>

        { /* Right side - Both buttons */ } <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                gap: 1,
            }
        } >
        { /* Add New Pole Button - ONLY SHOW WHEN ALL ROWS ARE VISIBLE */ } {
            limit >= rows.length && ( <
                Button variant = "outlined"
                color = "success"
                size = "small"
                startIcon = { < AddIcon / >
                }
                // onClick={onAddRow}
                onClick = {
                    handleAddNewPole
                } // ✅ onAddRow ki jagah yeh
                disabled = {
                    isLineLocked
                }
                sx = {
                    {
                        fontWeight: 600,
                        borderStyle: "dashed",
                    }
                } >
                Add New Pole <
                /Button>
            )
        }

        { /* Load More Button */ } {
            limit < rows.length && ( <
                Button variant = "outlined"
                size = "small"
                onClick = {
                    () => setLimit((prev) => prev + 50)
                } >
                Load More({
                        rows.length - limit
                    }
                    remaining) <
                /Button>
            )
        } <
        /Box> <
        /Box>



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

export default SCOHPoleDataTable_Dog;