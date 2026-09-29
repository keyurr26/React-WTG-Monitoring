import React, {
    useState,
    useMemo,
    useEffect
} from "react";
import {
    Box,
    TextField,
    Grid,
    Typography,
    Button,
    IconButton,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Paper,
    Alert,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Visibility as ViewIcon,
    DeleteOutline as DeleteIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import {
    getDateLimits
} from "../../utils/dateLimits";
const DocumentAttachmentDialog = ({
    activityCode,
    attachmentMasterList,
    formData,
    onDataChange,
}) => {
    const [open, setOpen] = useState(false);
    const [jointOpen, setJointOpen] = useState(false);
    // Validation alert states
    const [errorMessage, setErrorMessage] = useState("");
    const [jointErrorMessage, setJointErrorMessage] = useState("");
    const limits = getDateLimits();
    const allRequirements = useMemo(() => {
        return attachmentMasterList.filter(
            (item) => item.activity === activityCode,
        );
    }, [attachmentMasterList, activityCode]);
    const jointSignatureRequirement = allRequirements.find(
        (item) => item.file_name === "Jointly Signed Approval Report",
    );
    const requirements = allRequirements.filter(
        (item) => item.file_name !== "Jointly Signed Approval Report",
    );
    const selectedItems = formData.selected_items || [];
    const normalSelectedItems = selectedItems.filter(
        (item) => item.masterId !== jointSignatureRequirement ? .id,
    );
    // Auto-load matching mandatory documents on mount/update
    useEffect(() => {
        if (!requirements.length) return;
        const existingIds = normalSelectedItems.map((item) => item.masterId);
        const missingMandatory = requirements.filter(
            (r) => r.is_mandatory && !existingIds.includes(r.id),
        );
        if (missingMandatory.length === 0) return;
        const mandatoryDocs = missingMandatory.map((r) => ({
            instanceId: `auto_${r.id}`,
            masterId: r.id,
            file_type_label: r.file_name,
            is_mandatory: true,
            custom_name: "",
            doc_no: r.default_doc_no || "",
            doc_date: r.default_doc_date || "",
            remarks: r.default_remarks || "",
            file: null,
        }));
        onDataChange("selected_items", [...selectedItems, ...mandatoryDocs]);
    }, [requirements, selectedItems]);
    const handleAddDocument = (masterId) => {
        if (!masterId) return;
        const masterTemplate = requirements.find((r) => r.id === masterId);
        const newItem = {
            instanceId: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            masterId: masterId,
            file_type_label: masterTemplate.file_name,
            is_mandatory: masterTemplate.is_mandatory,
            custom_name: "",
            doc_no: masterTemplate.default_doc_no || "",
            doc_date: masterTemplate.default_doc_date || "",
            remarks: masterTemplate.default_remarks || "",
            file: null,
        };
        onDataChange("selected_items", [...selectedItems, newItem]);
        setErrorMessage("");
    };
    const handleRemoveDocument = (instanceId) => {
        const updated = selectedItems.filter(
            (item) => item.instanceId !== instanceId,
        );
        onDataChange("selected_items", updated);
    };
    const handleFileChange = (instanceId, file) => {
        if (!file) return;
        const MAX_SIZE_MB = 2;
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "image/jpeg",
            "image/png",
        ];
        if (!allowedTypes.includes(file.type)) {
            alert("Invalid format! Please upload PDF, Word, Excel, or Image.");
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert("File too large! Max 2MB allowed.");
            return;
        }
        updateItemData(instanceId, "file", file instanceof File ? file : null);
        setErrorMessage("");
    };
    const updateItemData = (instanceId, field, value) => {
        const safeValue =
            field === "file" ?
            value instanceof File || value instanceof Blob ?
            value :
            null :
            value;
        const updated = selectedItems.map((item) =>
            item.instanceId === instanceId ? { ...item,
                [field]: safeValue
            } : item,
        );
        onDataChange("selected_items", updated);
    };
    // CLOSE & CLEANUP HANDLERS - Closes instantly, removes incomplete optional rows
    // const handleCloseAndCleanupMain = () => {
    //   // Keep mandatory rows, but filter out optional rows that are blank/incomplete
    //   const cleanedItems = selectedItems.filter((item) => {
    //     // Don't filter out the joint signature here
    //     if (item.masterId === jointSignatureRequirement?.id) return true;
    //     // Keep all mandatory items
    //     if (item.is_mandatory) return true;
    //     // Keep optional items only if they are fully filled out
    //     const isFilled =
    //       item.custom_name?.trim() &&
    //       item.doc_no?.trim() &&
    //       item.doc_date?.trim() &&
    //       item.file;
    //     return isFilled;
    //   });
    //   onDataChange("selected_items", cleanedItems);
    //   setErrorMessage("");
    //   setOpen(false);
    // };
    const handleCloseAndCleanupMain = () => {
        const cleanedItems = selectedItems.filter((item) => {
            // if (item.is_mandatory) return true;
            const isEmpty = !item.custom_name ? .trim() &&
                !item.doc_no ? .trim() &&
                !item.doc_date ? .trim() &&
                !item.file;
            // ❌ remove ONLY fully empty rows
            return !isEmpty;
        });
        onDataChange("selected_items", cleanedItems);
        setErrorMessage("");
        setOpen(false);
    };
    const handleCloseAndCleanupJoint = () => {
        const jointItem = selectedItems.find(
            (item) => item.masterId === jointSignatureRequirement ? .id,
        );
        // If the joint document was initialized but is completely empty, remove it on close
        if (
            jointItem &&
            !jointItem.custom_name ? .trim() &&
            !jointItem.doc_no ? .trim() &&
            !jointItem.file
        ) {
            const filtered = selectedItems.filter(
                (item) => item.masterId !== jointSignatureRequirement.id,
            );
            onDataChange("selected_items", filtered);
        }
        setJointErrorMessage("");
        setJointOpen(false);
    };
    // DONE BUTTON VALIDATION - Strict submission blocker
    const handleValidateAndCloseMain = () => {
        for (const item of normalSelectedItems) {
            if (!item.custom_name ? .trim() ||
                !item.doc_no ? .trim() ||
                !item.doc_date ? .trim() ||
                !item.file
            ) {
                setErrorMessage(
                    "Please fill out all required fields (Document Name, Doc No., Date, and File Upload) or delete the row before finishing.",
                );
                return;
            }
        }
        setErrorMessage("");
        setOpen(false);
    };
    const handleValidateAndCloseJoint = () => {
        const jointItem = selectedItems.find(
            (item) => item.masterId === jointSignatureRequirement ? .id,
        );
        if (jointItem) {
            if (!jointItem.custom_name ? .trim() ||
                !jointItem.doc_no ? .trim() ||
                !jointItem.doc_date ? .trim() ||
                !jointItem.file
            ) {
                setJointErrorMessage(
                    "Please fill out all required fields (Document Name, Doc No., Date, and File Upload) before finishing.",
                );
                return;
            }
        }
        setJointErrorMessage("");
        setJointOpen(false);
    };
    return ( <
        >
        <
        Box display = "flex"
        gap = {
            2
        } >
        <
        Box onClick = {
            () => setOpen(true)
        }
        sx = {
            {
                border: "1px dashed #90caf9",
                borderRadius: 2,
                px: 1.8,
                py: 1.5,
                minWidth: 340,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                    bgcolor: "#f5f9ff",
                    borderColor: "#1976d2",
                    transform: "translateY(-1px)",
                },
            }
        } >
        <
        UploadIcon sx = {
            {
                color: normalSelectedItems.length > 0 ?
                    "success.main" :
                    "primary.main",
                fontSize: 22,
            }
        }
        /> <
        Box >
        <
        Typography variant = "body2"
        fontWeight = {
            600
        }
        color = "primary"
        lineHeight = {
            1.2
        } >
        Technical & Quality Document({
            normalSelectedItems.length
        }) <
        /Typography> <
        Typography variant = "caption"
        color = "text.secondary" >
        Click to add Multiple Document <
        /Typography> <
        /Box> <
        /Box> {
            jointSignatureRequirement && ( <
                Box onClick = {
                    () => setJointOpen(true)
                }
                sx = {
                    {
                        border: "1px dashed #90caf9",
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        minWidth: 320,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        cursor: "pointer",
                        bgcolor: "#fafafa",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            bgcolor: "#f5f9ff",
                            borderColor: "#1976d2",
                            transform: "translateY(-1px)",
                        },
                    }
                } >
                <
                UploadIcon sx = {
                    {
                        color: "primary.main",
                        fontSize: 22
                    }
                }
                /> <
                Box >
                <
                Typography variant = "body2"
                fontWeight = {
                    600
                }
                color = "primary"
                lineHeight = {
                    1.2
                } >
                Jointly Signed Report <
                /Typography> <
                Typography variant = "caption"
                color = "text.secondary" >
                Click to upload <
                /Typography> <
                /Box> <
                /Box>
            )
        } <
        /Box> { /* MAIN DIALOG */ } <
        Dialog open = {
            open
        }
        onClose = {
            (e, reason) => {
                if (reason === "backdropClick") return;
                handleCloseAndCleanupMain();
            }
        }
        maxWidth = "lg"
        fullWidth >
        <
        DialogTitle sx = {
            {
                bgcolor: "#f8f9fa",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }
        } >
        Add {
            activityCode
        }
        Documents <
        IconButton onClick = {
            handleCloseAndCleanupMain
        }
        size = "small" >
        <
        CloseIcon / >
        <
        /IconButton> <
        /DialogTitle> <
        Divider / >
        <
        DialogContent sx = {
            {
                pb: 4
            }
        } > {
            errorMessage && ( <
                Alert severity = "error"
                sx = {
                    {
                        mb: 2
                    }
                } > {
                    errorMessage
                } <
                /Alert>
            )
        } <
        Box sx = {
            {
                mb: 4,
                mt: 1
            }
        } >
        <
        Typography variant = "subtitle2"
        color = "textSecondary"
        sx = {
            {
                mb: 1.5,
                fontWeight: "bold"
            }
        } >
        Select a Document Type to Add:
        <
        /Typography> <
        Box display = "flex"
        flexWrap = "wrap"
        gap = {
            1.5
        } > {
            requirements
            .filter((item) => !item.is_mandatory)
            .map((item) => ( <
                Button key = {
                    item.id
                }
                variant = "outlined"
                size = "small"
                startIcon = { < AddIcon / >
                }
                onClick = {
                    () => handleAddDocument(item.id)
                }
                sx = {
                    {
                        textTransform: "none",
                        borderRadius: "16px",
                        borderColor: "#b3e5fc",
                        color: "primary.main",
                        fontWeight: 500,
                        px: 2,
                        "&:hover": {
                            bgcolor: "#e1f5fe",
                            borderColor: "primary.main",
                        },
                    }
                } >
                {
                    item.file_name
                } <
                /Button>
            ))
        } <
        /Box> <
        /Box> <
        Stack spacing = {
            3
        } > {
            normalSelectedItems.map((item) => {
                const hasFile = !!item.file;
                const hasErrors =
                    errorMessage &&
                    (!item.custom_name ? .trim() ||
                        !item.doc_no ? .trim() ||
                        !item.doc_date ? .trim() ||
                        !hasFile);
                const handleViewFile = () => {
                    if (!item.file) return;
                    let url =
                        item.file instanceof File ?
                        URL.createObjectURL(item.file) :
                        item.file.url;
                    if (url) window.open(url, "_blank");
                };
                return ( <
                    Paper key = {
                        item.instanceId
                    }
                    variant = "outlined"
                    sx = {
                        {
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#fff",
                            borderColor: hasErrors ? "error.main" : "divider",
                            borderWidth: hasErrors ? 2 : 1,
                        }
                    } >
                    <
                    Box sx = {
                        {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }
                    } >
                    <
                    Box >
                    <
                    Typography variant = "subtitle1"
                    color = "primary"
                    fontWeight = "bold" >
                    {
                        item.file_type_label
                    }*
                    <
                    /Typography> {
                        item.is_mandatory && ( <
                            Typography variant = "caption"
                            sx = {
                                {
                                    color: "error.main",
                                    fontWeight: "bold",
                                    display: "block",
                                }
                            } >
                            *
                            Mandatory Document <
                            /Typography>
                        )
                    } <
                    /Box> <
                    Box sx = {
                        {
                            display: "flex",
                            gap: 1
                        }
                    } >
                    <
                    Button variant = {
                        hasFile ? "contained" : "outlined"
                    }
                    component = "label"
                    size = "small"
                    color = {
                        hasFile ?
                        "success" :
                            errorMessage && !hasFile ?
                            "error" :
                            "primary"
                    }
                    startIcon = { < UploadIcon / >
                    } >
                    {
                        hasFile ? "Change File" : "Upload File *"
                    } <
                    input type = "file"
                    accept = ".pdf, .doc, .docx, .xlsx, .xls, image/*"
                    hidden onChange = {
                        (e) =>
                        handleFileChange(item.instanceId, e.target.files[0])
                    }
                    /> <
                    /Button> {
                        hasFile && ( <
                            IconButton color = "info"
                            onClick = {
                                handleViewFile
                            }
                            size = "small"
                            title = "Preview" >
                            <
                            ViewIcon / >
                            <
                            /IconButton>
                        )
                    } <
                    IconButton color = "error"
                    disabled = {
                        item.is_mandatory
                    }
                    onClick = {
                        () => handleRemoveDocument(item.instanceId)
                    }
                    size = "small"
                    title = {
                        item.is_mandatory ?
                        "Mandatory document cannot be removed" :
                            "Remove"
                    } >
                    <
                    DeleteIcon / >
                    <
                    /IconButton> <
                    /Box> <
                    /Box> <
                    Grid container spacing = {
                        2
                    } >
                    <
                    Grid item xs = {
                        12
                    }
                    md = {
                        4
                    } >
                    <
                    TextField fullWidth size = "small"
                    label = "Document Name"
                    required value = {
                        item.custom_name || ""
                    }
                    error = {
                        errorMessage && !item.custom_name ? .trim()
                    }
                    helperText = {
                        errorMessage && !item.custom_name ? .trim() ?
                        "Required" :
                        ""
                    }
                    onChange = {
                        (e) =>
                        updateItemData(
                            item.instanceId,
                            "custom_name",
                            e.target.value,
                        )
                    }
                    /> <
                    /Grid> <
                    Grid item xs = {
                        12
                    }
                    sm = {
                        6
                    }
                    md = {
                        3
                    } >
                    <
                    TextField fullWidth size = "small"
                    label = "Doc No."
                    required value = {
                        item.doc_no || ""
                    }
                    error = {
                        errorMessage && !item.doc_no ? .trim()
                    }
                    helperText = {
                        errorMessage && !item.doc_no ? .trim() ? "Required" : ""
                    }
                    onChange = {
                        (e) =>
                        updateItemData(
                            item.instanceId,
                            "doc_no",
                            e.target.value,
                        )
                    }
                    /> <
                    /Grid> <
                    Grid item xs = {
                        12
                    }
                    sm = {
                        6
                    }
                    md = {
                        3
                    } >
                    <
                    TextField fullWidth required size = "small"
                    type = "date"
                    label = "Date"
                    InputLabelProps = {
                        {
                            shrink: true
                        }
                    }
                    inputProps = {
                        limits.date
                    }
                    value = {
                        item.doc_date || ""
                    }
                    error = {
                        errorMessage && !item.doc_date ? .trim()
                    }
                    helperText = {
                        errorMessage && !item.doc_date ? .trim() ?
                        "Required" :
                        ""
                    }
                    onChange = {
                        (e) =>
                        updateItemData(
                            item.instanceId,
                            "doc_date",
                            e.target.value,
                        )
                    }
                    /> <
                    /Grid> <
                    Grid item xs = {
                        12
                    }
                    md = {
                        2
                    } >
                    <
                    TextField fullWidth size = "small"
                    label = "Remarks"
                    value = {
                        item.remarks || ""
                    }
                    onChange = {
                        (e) =>
                        updateItemData(
                            item.instanceId,
                            "remarks",
                            e.target.value,
                        )
                    }
                    /> <
                    /Grid> <
                    /Grid> {
                        hasFile && ( <
                            Typography variant = "caption"
                            sx = {
                                {
                                    display: "block",
                                    mt: 1.5,
                                    color: "success.main",
                                    fontStyle: "italic",
                                }
                            } >
                            Selected: {
                                item.file.name || "Existing Document"
                            } <
                            /Typography>
                        )
                    } <
                    /Paper>
                );
            })
        } <
        /Stack> <
        /DialogContent> <
        Divider / >
        <
        DialogActions sx = {
            {
                p: 2,
                bgcolor: "#f8f9fa"
            }
        } >
        <
        Button onClick = {
            handleValidateAndCloseMain
        }
        variant = "contained"
        sx = {
            {
                px: 4
            }
        } >
        Done <
        /Button> <
        /DialogActions> <
        /Dialog> { /* JOINT SIGNATURE DIALOG */ } <
        Dialog open = {
            jointOpen
        }
        onClose = {
            (e, reason) => {
                if (reason === "backdropClick") return;
                handleCloseAndCleanupJoint();
            }
        }
        maxWidth = "lg"
        fullWidth >
        <
        DialogTitle sx = {
            {
                bgcolor: "#f8f9fa",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }
        } >
        Jointly Signed Approval Report <
        IconButton onClick = {
            handleCloseAndCleanupJoint
        }
        size = "small" >
        <
        CloseIcon / >
        <
        /IconButton> <
        /DialogTitle> <
        DialogContent >
        <
        Box mt = {
            2
        } > {
            jointErrorMessage && ( <
                Alert severity = "error"
                sx = {
                    {
                        mb: 2
                    }
                } > {
                    jointErrorMessage
                } <
                /Alert>
            )
        } {
            (() => {
                const jointItem = selectedItems.find(
                    (item) => item.masterId === jointSignatureRequirement ? .id,
                );
                const hasFile = !!jointItem ? .file;
                const handleJointUpdate = (field, value) => {
                    const updatedItem = {
                        instanceId: jointItem ? .instanceId || `joint_${Date.now()}`,
                        masterId: jointSignatureRequirement.id,
                        file_type_label: jointSignatureRequirement.file_name,
                        is_mandatory: true,
                        custom_name: jointItem ? jointItem.custom_name : "",
                        doc_no: jointItem ? .doc_no || "",
                        doc_date: jointItem ? .doc_date || "",
                        remarks: jointItem ? .remarks || "",
                        file: jointItem ? .file || null,
                        [field]: value,
                    };
                    const filtered = selectedItems.filter(
                        (item) => item.masterId !== jointSignatureRequirement.id,
                    );
                    onDataChange("selected_items", [...filtered, updatedItem]);
                    setJointErrorMessage("");
                };
                const handleViewFile = () => {
                    if (!jointItem ? .file) return;
                    const url =
                        jointItem.file instanceof File ?
                        URL.createObjectURL(jointItem.file) :
                        jointItem.file.url;
                    window.open(url, "_blank");
                };
                return ( <
                    Paper variant = "outlined"
                    sx = {
                        {
                            p: 3,
                            borderRadius: 2,
                            borderColor: jointErrorMessage ? "error.main" : "divider",
                        }
                    } >
                    <
                    Typography variant = "subtitle1"
                    color = "primary"
                    fontWeight = "bold"
                    mb = {
                        2
                    } >
                    Jointly Signed Approval Report *
                    <
                    /Typography> <
                    Grid container spacing = {
                        2
                    } >
                    <
                    Grid item xs = {
                        12
                    }
                    md = {
                        3
                    } >
                    <
                    TextField fullWidth size = "small"
                    label = "Document Name"
                    required value = {
                        jointItem ? .custom_name || ""
                    }
                    error = {
                        jointErrorMessage && !jointItem ? .custom_name ? .trim()
                    }
                    helperText = {
                        jointErrorMessage && !jointItem ? .custom_name ? .trim() ?
                        "Required" :
                        ""
                    }
                    onChange = {
                        (e) =>
                        handleJointUpdate("custom_name", e.target.value)
                    }
                    /> <
                    /Grid> <
                    Grid item xs = {
                        12
                    }
                    md = {
                        3
                    } >
                    <
                    TextField fullWidth size = "small"
                    label = "Doc No."
                    required value = {
                        jointItem ? .doc_no || ""
                    }
                    error = {
                        jointErrorMessage && !jointItem ? .doc_no ? .trim()
                    }
                    helperText = {
                        jointErrorMessage && !jointItem ? .doc_no ? .trim() ?
                        "Required" :
                        ""
                    }
                    onChange = {
                        (e) =>
                        handleJointUpdate("doc_no", e.target.value)
                    }
                    /> <
                    /Grid> <
                    Grid item xs = {
                        12
                    }
                    md = {
                        3
                    } >
                    <
                    TextField fullWidth required size = "small"
                    type = "date"
                    label = "Date"
                    InputLabelProps = {
                        {
                            shrink: true
                        }
                    }
                    inputProps = {
                        limits.date
                    }
                    value = {
                        jointItem ? .doc_date || ""
                    }
                    error = {
                        jointErrorMessage && !jointItem ? .doc_date ? .trim()
                    }
                    helperText = {
                        jointErrorMessage && !jointItem ? .doc_date ? .trim() ?
                        "Required" :
                        ""
                    }
                    onChange = {
                        (e) =>
                        handleJointUpdate("doc_date", e.target.value)
                    }
                    /> <
                    /Grid> <
                    Grid item xs = {
                        12
                    }
                    md = {
                        3
                    } >
                    <
                    TextField fullWidth size = "small"
                    label = "Remarks"
                    value = {
                        jointItem ? .remarks || ""
                    }
                    onChange = {
                        (e) =>
                        handleJointUpdate("remarks", e.target.value)
                    }
                    /> <
                    /Grid> <
                    /Grid> <
                    Box display = "flex"
                    gap = {
                        2
                    }
                    alignItems = "center"
                    mt = {
                        3
                    } >
                    <
                    Button variant = {
                        hasFile ? "contained" : "outlined"
                    }
                    component = "label"
                    color = {
                        hasFile ?
                        "success" :
                            jointErrorMessage && !hasFile ?
                            "error" :
                            "primary"
                    }
                    startIcon = { < UploadIcon / >
                    } >
                    {
                        hasFile ? "Change File" : "Upload File *"
                    } <
                    input hidden type = "file"
                    accept = ".pdf,.doc,.docx,image/*"
                    onChange = {
                        (e) =>
                        handleJointUpdate("file", e.target.files[0])
                    }
                    /> <
                    /Button> {
                        hasFile && ( <
                            IconButton color = "info"
                            onClick = {
                                handleViewFile
                            } >
                            <
                            ViewIcon / >
                            <
                            /IconButton>
                        )
                    } <
                    /Box> {
                        hasFile && ( <
                            Typography variant = "caption"
                            color = "success.main"
                            sx = {
                                {
                                    display: "block",
                                    mt: 2
                                }
                            } >
                            Selected: {
                                jointItem.file.name || "Existing Document"
                            } <
                            /Typography>
                        )
                    } <
                    /Paper>
                );
            })()
        } <
        /Box> <
        /DialogContent> <
        Divider / >
        <
        DialogActions sx = {
            {
                p: 2,
                bgcolor: "#f8f9fa"
            }
        } >
        <
        Button onClick = {
            handleValidateAndCloseJoint
        }
        variant = "contained"
        sx = {
            {
                px: 4
            }
        } >
        Done <
        /Button> <
        /DialogActions> <
        /Dialog> <
        />
    );
};
export default DocumentAttachmentDialog;