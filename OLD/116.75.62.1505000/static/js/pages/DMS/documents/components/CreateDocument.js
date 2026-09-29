import React, {
    useState,
    useEffect
} from "react";
import {
    useDispatch
} from "react-redux";
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    IconButton,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import {
    CreateDocumentData,
    UpdateDocumentData,
} from "../../../../Redux/DmsData/Document/DocumentAction";

const CreateDocument = ({
    open,
    onClose,
    editData = null,
    projects = [],
    filterProject = "All",
    filterWindfarm = "All",
    onAdd,
    onUpdate,
    showSnackbar,
}) => {
    const dispatch = useDispatch();
    const isEdit = Boolean(editData);

    // Form state
    const [formData, setFormData] = useState({
        project: "",
        windfarm: "",
        document_type: "",
        title: "",
        document_version_number: "",
        vendor: "",
        description: "",
        file: null,
    });

    const [filteredWindfarms, setFilteredWindfarms] = useState([]);
    const [isCustomType, setIsCustomType] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const safeProjects = Array.isArray(projects) ? projects : [];

    // Validation
    const isValid =
        formData.project &&
        formData.document_type &&
        formData.title &&
        formData.vendor &&
        formData.document_version_number;

    // Populate form when editing
    useEffect(() => {
        if (!editData) return;

        const selectedProject = safeProjects.find(
            (p) => Number(p.id) === Number(editData.project)
        );

        const assignedWindfarms = Array.isArray(selectedProject ? .windfarms) ?
            selectedProject.windfarms :
            [];

        setFormData({
            project: editData.project || "",
            windfarm: editData.windfarm || "",
            document_type: editData.document_type || "",
            title: editData.title || "",
            document_version_number: editData.document_version_number || "",
            vendor: editData.vendor || "",
            description: editData.description || "",
            file: null,
        });

        setFilteredWindfarms(assignedWindfarms);

        const predefinedTypes = ["drawing", "invoice", "contract", "report"];
        setIsCustomType(
            editData.document_type &&
            !predefinedTypes.includes(editData.document_type.toLowerCase())
        );
    }, [editData, safeProjects]);

    // Pre-fill project and windfarm when creating
    useEffect(() => {
        if (!open || isEdit) return;

        const selectedProject =
            filterProject !== "All" ?
            safeProjects.find((p) => Number(p.id) === Number(filterProject)) :
            null;

        const assignedWindfarms = Array.isArray(selectedProject ? .windfarms) ?
            selectedProject.windfarms :
            [];

        const selectedWindfarm =
            filterWindfarm !== "All" ?
            assignedWindfarms.find(
                (wf) => Number(wf.id) === Number(filterWindfarm)
            ) :
            null;

        setFilteredWindfarms(assignedWindfarms);

        setFormData((prev) => ({
            ...prev,
            project: selectedProject ? .id || "",
            windfarm: selectedWindfarm ? .id || "",
        }));
    }, [open, isEdit, filterProject, filterWindfarm, safeProjects]);

    // Reset form when dialog closes
    useEffect(() => {
        if (open) return;
        if (isEdit) return;

        setFormData({
            project: "",
            windfarm: "",
            document_type: "",
            title: "",
            document_version_number: "",
            vendor: "",
            description: "",
            file: null,
        });

        setFilteredWindfarms([]);
        setFilePreview(null);
        setIsCustomType(false);
    }, [open, isEdit]);

    const handleChange = async (e) => {
        const {
            name,
            value,
            files
        } = e.target;

        if (name === "file") {
            const file = files ? .[0] || null;

            if (filePreview) {
                URL.revokeObjectURL(filePreview);
            }

            setFormData((prev) => ({
                ...prev,
                file,
            }));

            setFilePreview(file ? URL.createObjectURL(file) : null);
            return;
        }

        if (name === "project") {
            const projectId = value ? Number(value) : "";

            const selectedProject = safeProjects.find(
                (p) => Number(p.id) === Number(projectId)
            );

            const assignedWindfarms = Array.isArray(selectedProject ? .windfarms) ?
                selectedProject.windfarms :
                [];

            setFormData((prev) => ({
                ...prev,
                project: projectId,
                windfarm: "",
            }));

            setFilteredWindfarms(assignedWindfarms);
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClose = () => {
        setFormData({
            project: "",
            windfarm: "",
            document_type: "",
            title: "",
            document_version_number: "",
            vendor: "",
            description: "",
            file: null,
        });

        setFilteredWindfarms([]);
        setIsCustomType(false);

        if (filePreview) {
            URL.revokeObjectURL(filePreview);
        }

        setFilePreview(null);
        onClose();
    };

    const handleSubmit = async () => {
        try {
            if (!formData.project ||
                !formData.document_type ||
                !formData.title ||
                !formData.vendor ||
                !formData.document_version_number
            ) {
                showSnackbar("Please fill all required fields", "warning");
                return;
            }

            if (!formData.file && !isEdit) {
                showSnackbar("Please attach a file", "warning");
                return;
            }

            setLoading(true);

            const payload = new FormData();
            payload.append("project", formData.project);

            if (formData.windfarm) {
                payload.append("windfarm", formData.windfarm);
            }

            payload.append("document_type", formData.document_type);
            payload.append("title", formData.title);
            payload.append(
                "document_version_number",
                formData.document_version_number || ""
            );
            payload.append("vendor", formData.vendor || "");
            payload.append("description", formData.description || "");

            if (formData.file) {
                payload.append("file", formData.file);
            }

            let response;

            if (!isEdit) {
                response = await dispatch(CreateDocumentData(payload));

                if (!response ? .id) {
                    throw new Error("Document creation failed.");
                }

                showSnackbar("Document created and inwarded successfully!", "success");
                handleClose();

                if (onAdd) {
                    await onAdd();
                }
            } else {
                response = await dispatch(
                    UpdateDocumentData(editData.id, payload)
                );

                if (!response ? .id) {
                    throw new Error("Document update failed.");
                }

                showSnackbar("Document updated successfully!", "success");
                handleClose();

                if (onUpdate) {
                    await onUpdate();
                }
            }
        } catch (error) {
            console.error("Error saving document:", error);

            const data = error ? .response ? .data;

            let errorMessage = "Error saving document.";

            if (data) {
                if (typeof data === "string") {
                    errorMessage = data;
                } else if (data.detail) {
                    errorMessage = Array.isArray(data.detail) ?
                        data.detail[0] :
                        data.detail;
                } else if (data.non_field_errors) {
                    errorMessage = Array.isArray(data.non_field_errors) ?
                        data.non_field_errors[0] :
                        data.non_field_errors;
                } else if (data.title) {
                    errorMessage = Array.isArray(data.title) ?
                        data.title[0] :
                        data.title;
                } else if (data.file) {
                    errorMessage = Array.isArray(data.file) ?
                        data.file[0] :
                        data.file;
                } else {
                    // Handle any other DRF field error
                    const firstKey = Object.keys(data)[0];

                    if (firstKey) {
                        const value = data[firstKey];

                        errorMessage = Array.isArray(value) ?
                            value[0] :
                            typeof value === "object" ?
                            JSON.stringify(value) :
                            String(value);
                    }
                }
            } else if (error ? .message) {
                errorMessage = error.message;
            }

            showSnackbar(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return ( <
        Dialog open = {
            open
        }
        onClose = {
            handleClose
        }
        maxWidth = "lg"
        fullWidth > { /* DIALOG HEADER */ } <
        DialogTitle sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: 1,
                mt: -1,
            }
        } >
        <
        Box display = "flex"
        alignItems = "center"
        gap = {
            1
        } >
        <
        DescriptionIcon color = "primary" / >
        <
        Typography variant = "h6"
        fontWeight = {
            600
        } > {
            isEdit ? "Edit Document" : "Create Document"
        } <
        /Typography> <
        /Box>

        <
        IconButton onClick = {
            handleClose
        } >
        <
        CloseIcon / >
        <
        /IconButton> <
        /DialogTitle>

        { /* DIALOG CONTENT */ } <
        DialogContent dividers >
        <
        Grid container spacing = {
            3
        } > { /* PROJECT */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField select fullWidth size = "small"
        label = "Select Project *"
        name = "project"
        value = {
            formData.project || ""
        }
        onChange = {
            handleChange
        } >
        {
            safeProjects.length > 0 ? (
                safeProjects.map((project) => ( <
                    MenuItem key = {
                        project.id
                    }
                    value = {
                        project.id
                    } > {
                        project.project_name || project.name
                    } <
                    /MenuItem>
                ))
            ) : ( <
                MenuItem disabled > No Projects Found < /MenuItem>
            )
        } <
        /TextField> <
        /Grid>

        { /* WINDFARM */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField select fullWidth size = "small"
        label = "Select Windfarm"
        name = "windfarm"
        value = {
            formData.windfarm || ""
        }
        onChange = {
            handleChange
        }
        disabled = {!formData.project
        } >
        {
            filteredWindfarms.length > 0 ? (
                filteredWindfarms.map((wf) => ( <
                    MenuItem key = {
                        wf.id
                    }
                    value = {
                        wf.id
                    } > {
                        wf.windfarm_name || wf.name
                    } <
                    /MenuItem>
                ))
            ) : ( <
                MenuItem disabled > {
                    formData.project ?
                    "No Windfarms Found" :
                        "Select Project First"
                } <
                /MenuItem>
            )
        } <
        /TextField> <
        /Grid>

        { /* DOCUMENT TYPE */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField select fullWidth size = "small"
        label = "Document Type *"
        value = {
            isCustomType ? "others" : formData.document_type
        }
        onChange = {
            (e) => {
                const value = e.target.value;

                if (value === "others") {
                    setIsCustomType(true);
                    setFormData((prev) => ({
                        ...prev,
                        document_type: "",
                    }));
                } else {
                    setIsCustomType(false);
                    setFormData((prev) => ({
                        ...prev,
                        document_type: value,
                    }));
                }
            }
        } >
        <
        MenuItem value = "drawing" > Drawing < /MenuItem> <
        MenuItem value = "invoice" > Invoice < /MenuItem> <
        MenuItem value = "contract" > Contract < /MenuItem> <
        MenuItem value = "report" > Report < /MenuItem> <
        MenuItem value = "others" > Others < /MenuItem> <
        /TextField> <
        /Grid>

        { /* CUSTOM DOCUMENT TYPE */ } {
            isCustomType && ( <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth size = "small"
                label = "Enter Document Type"
                value = {
                    formData.document_type
                }
                onChange = {
                    (e) =>
                    setFormData((prev) => ({
                        ...prev,
                        document_type: e.target.value,
                    }))
                }
                /> <
                /Grid>
            )
        }

        { /* TITLE */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth size = "small"
        label = "Document Title *"
        name = "title"
        value = {
            formData.title
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        { /* VENDOR */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth size = "small"
        label = "Vendor Name *"
        name = "vendor"
        value = {
            formData.vendor
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        { /* VERSION */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth size = "small"
        label = "document_version_number"
        name = "document_version_number"
        value = {
            formData.document_version_number
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /Grid>

        { /* DESCRIPTION */ } <
        Grid item xs = {
            12
        }
        md = {
            8
        } >
        <
        TextField fullWidth multiline rows = {
            2
        }
        size = "small"
        label = "Description"
        name = "description"
        value = {
            formData.description
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        { /* FILE UPLOAD */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        Box sx = {
            {
                position: "relative"
            }
        } >
        <
        Button variant = "outlined"
        component = "label"
        fullWidth sx = {
            {
                height: "40px",
                borderRadius: "10px",
                textTransform: "none",
            }
        } >
        Attach Document <
        input hidden type = "file"
        name = "file"
        onChange = {
            handleChange
        }
        /> <
        /Button>

        {
            formData.file && ( <
                Box sx = {
                    {
                        mt: 1,
                        p: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        maxHeight: 120,
                        overflowY: "auto",
                        position: "relative",
                    }
                } >
                <
                IconButton size = "small"
                onClick = {
                    () => {
                        setFormData((prev) => ({
                            ...prev,
                            file: null,
                        }));

                        if (filePreview) {
                            URL.revokeObjectURL(filePreview);
                        }

                        setFilePreview(null);
                    }
                }
                sx = {
                    {
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "#fff",
                    }
                } >
                <
                CloseIcon fontSize = "xsmall" / >
                <
                /IconButton>

                {
                    formData.file ? .type ? .startsWith("image/") ? ( <
                        img src = {
                            filePreview
                        }
                        alt = "preview"
                        style = {
                            {
                                width: "100%",
                                maxHeight: 80,
                                objectFit: "cover",
                                borderRadius: 6,
                            }
                        }
                        />
                    ) : ( <
                        Typography variant = "body2" > {
                            formData.file.name
                        } < /Typography>
                    )
                } <
                /Box>
            )
        } <
        /Box> <
        /Grid>

        { /* SUBMIT BUTTON */ } <
        Grid item xs = {
            12
        } >
        <
        Box display = "flex"
        justifyContent = "center"
        mt = {
            1
        } >
        <
        Button variant = "contained"
        onClick = {
            handleSubmit
        }
        disabled = {!isValid || loading
        }
        startIcon = {!loading && < DescriptionIcon / >
        }
        sx = {
            {
                px: 4,
                py: 1,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                minWidth: 220,
            }
        } >
        {
            loading ? ( <
                CircularProgress size = {
                    22
                }
                color = "inherit" / >
            ) : isEdit ? (
                "Update Document"
            ) : (
                "Create Document"
            )
        } <
        /Button> <
        /Box> <
        /Grid> <
        /Grid> <
        /DialogContent> <
        /Dialog>
    );
};

export default CreateDocument;