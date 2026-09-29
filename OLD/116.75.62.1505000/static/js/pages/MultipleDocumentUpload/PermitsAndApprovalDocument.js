import React, {
    useState,
    useEffect,
    useMemo
} from "react";

import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    TextField,
    MenuItem,
    Stack,
    Divider,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Alert,
    TableContainer,
    TablePagination,
} from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import VisibilityIcon from "@mui/icons-material/Visibility";

import DeleteIcon from "@mui/icons-material/Delete";

import {
    useDispatch,
    useSelector
} from "react-redux";

// Actions

import {
    GetAttachmentMasterData,
    CreateDocumentUpload,
    GetDocumentUploadList,
} from "../../Redux/MasterData/masterAction";

export default function PermitsAndApprovalDocument({
    filters,
    setFilters
}) {
    const dispatch = useDispatch();

    /* ---------------- REDUX SELECTORS ---------------- */

    const {
        attachmentList = [],

            documentList = [],

            loading: uploadLoading,
    } = useSelector((state) => state.masterData);

    const activity = "PERMIT";

    /* ---------------- STATE ---------------- */

    const [otherDoc, setOtherDoc] = useState({
        name: "",

        doc_no: "",

        file: null,
    });

    const [selectedFileType, setSelectedFileType] = useState("");

    const [fileAssignments, setFileAssignments] = useState({});

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Guard checking if both parent filters are valid
    const isFilterSelected = useMemo(() => {
        return !!(filters ? .project && filters ? .windfarm);
    }, [filters ? .project, filters ? .windfarm]);

    /* ---------------- EFFECTS ---------------- */

    useEffect(() => {
        dispatch(GetAttachmentMasterData({
            activity
        }));

        if (isFilterSelected && selectedFileType) {
            dispatch(
                GetDocumentUploadList({
                    project: filters.project,
                    windfarm: filters.windfarm,
                    activity: activity,
                    file_type: selectedFileType,
                }),
            );
        }
    }, [
        dispatch,
        isFilterSelected,
        filters ? .project,
        filters ? .windfarm,
        selectedFileType,
    ]);

    useEffect(() => {
        setOtherDoc((prev) => ({ ...prev,
            doc_no: selectedFileType
        }));
    }, [selectedFileType]);

    // Reset selection state if filters change or clear

    useEffect(() => {
        if (!isFilterSelected) {
            setSelectedFileType("");
            setFileAssignments({});
        }
    }, [isFilterSelected]);

    /* ---------------- PERMIT SPECIFIC LOGIC ---------------- */

    // Get Unique File Types for the PERMIT activity
    const uniqueFileTypes = useMemo(() => {
        const permitItems = attachmentList.filter(
            (item) => item.activity === activity,
        );

        return [...new Set(permitItems.map((item) => item.file_type))];
    }, [attachmentList, activity]);

    // Filter requirements based on selected category (file_type)
    const activeRequirements = useMemo(() => {
        if (!selectedFileType || !isFilterSelected) return [];

        return attachmentList.filter(
            (item) =>
            item.activity === activity &&
            item.file_type === selectedFileType &&
            item.is_active,
        );
    }, [attachmentList, selectedFileType, isFilterSelected, activity]);

    /* ---------------- HANDLERS ---------------- */

    const handleFileChange = (masterId, file) => {
        if (!file) {
            const newAssign = { ...fileAssignments
            };

            delete newAssign[masterId];

            setFileAssignments(newAssign);
        } else {
            setFileAssignments((prev) => ({ ...prev,
                [masterId]: file
            }));
        }
    };

    const handleUpload = async () => {
        if (!isFilterSelected) {
            return alert(
                "Please select a Project and Windfarm before uploading documents.",
            );
        }

        const assignedIds = Object.keys(fileAssignments);

        if (assignedIds.length === 0 && !otherDoc.file) {
            return alert("Please attach at least one document.");
        }

        // 1. Loop through standard required documents

        for (const masterId of assignedIds) {
            const masterRecord = attachmentList.find(
                (item) => item.id === Number(masterId),
            );

            const data = new FormData();

            data.append("project", filters.project);

            data.append("windfarm", filters.windfarm);

            data.append("attachment_master", masterId);

            data.append("file", fileAssignments[masterId]);

            data.append("is_active", "true");

            data.append("name", masterRecord ? masterRecord.file_name : "");

            const prefixDocNo = masterRecord ? `P - ${masterRecord.file_type}` : "";

            data.append("doc_no", prefixDocNo);

            await dispatch(CreateDocumentUpload(data));
        }

        // 2. Handle "Other Document"

        if (otherDoc.file) {
            const firstReqInSection =
                activeRequirements.length > 0 ? activeRequirements[0] : null;

            if (!firstReqInSection) {
                return alert("No reference ID found for this category.");
            }

            const data = new FormData();

            data.append("project", filters.project);

            data.append("windfarm", filters.windfarm);

            data.append("attachment_master", firstReqInSection.id);

            data.append("file", otherDoc.file);

            data.append("is_active", "true");

            data.append(
                "name",

                otherDoc.name ||
                (firstReqInSection ? firstReqInSection.file_name : "Other Document"),
            );

            const prefixOtherDocNo = firstReqInSection ?
                `P - ${firstReqInSection.file_type}` :
                "";
            data.append("doc_no", prefixOtherDocNo);

            await dispatch(CreateDocumentUpload(data));
        }

        alert("Uploads completed successfully!");
        setFileAssignments({});
        setOtherDoc({
            name: "",
            doc_no: selectedFileType,
            file: null
        });

        // Refresh history list matching current global and activity parameters
        dispatch(
            GetDocumentUploadList({
                project: filters.project,
                windfarm: filters.windfarm,
                activity: activity,
            }),
        );
    };

    const filteredHistory = useMemo(() => {
        if (!isFilterSelected) return [];

        return documentList.filter((doc) => {
            const matchesActivity = doc.activity === activity;
            const matchesProject = doc.project === Number(filters.project);

            const matchesWindfarm = doc.windfarm === Number(filters.windfarm);

            const matchesCategory = selectedFileType ?
                doc.f_type === selectedFileType :
                true;

            return (
                matchesActivity && matchesProject && matchesWindfarm && matchesCategory
            );
        });
    }, [
        documentList,
        filters.project,
        filters.windfarm,
        selectedFileType,
        isFilterSelected,
        activity,
    ]);

    const paginatedDocs = filteredHistory.slice(
        page * rowsPerPage,

        page * rowsPerPage + rowsPerPage,
    );

    return ( <
        Box p = {
            2
        } > { /* 1. CONFIGURATION / DROPDOWN SECTION */ } <
        Paper elevation = {
            0
        }
        sx = {
            {
                p: 2,

                mb: 2,

                bgcolor: "#f8fafc",

                border: "1px solid #e2e8f0",

                borderRadius: 2,
            }
        } >
        <
        Grid container spacing = {
            3
        } >
        <
        Grid item xs = {
            4
        } >
        <
        TextField select fullWidth size = "small"
        label = "Select Permit Section"
        disabled = {!isFilterSelected
        } // Disable until parent filter requirements are met
        value = {
            selectedFileType
        }
        onChange = {
            (e) => {
                setSelectedFileType(e.target.value);

                setFileAssignments({});
            }
        } >
        {
            uniqueFileTypes.map((type) => ( <
                MenuItem key = {
                    type
                }
                value = {
                    type
                } > {
                    type
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid> <
        /Grid> <
        /Paper>

        { /* 2. MAIN WORKSPACE / REQUIREMENTS SECTION */ }

        {
            !isFilterSelected ? ( <
                Alert severity = "info"
                sx = {
                    {
                        borderRadius: 2,
                        mb: 3
                    }
                } >
                Please select a Project and Windfarm globally to manage and view Permit Documents. <
                /Alert>
            ) : ( <
                Paper elevation = {
                    0
                }
                sx = {
                    {
                        textAlign: "center",

                        p: 3,

                        border: "2px dashed #e2e8f0",

                        borderRadius: 2,

                        bgcolor: "#fcfcfc",
                    }
                } >
                <
                Box display = "flex"
                justifyContent = "space-between"
                alignItems = "center"
                mb = {
                    2
                } >
                <
                Typography variant = "subtitle1"
                color = "primary.main"
                fontWeight = "700" >
                Required Documents {
                    selectedFileType && `— ${selectedFileType}`
                } <
                /Typography>

                {
                    Object.keys(fileAssignments).length > 0 && ( <
                        Typography variant = "caption"
                        sx = {
                            {
                                bgcolor: "#e8f5e9",

                                color: "#2e7d32",

                                px: 1.5,

                                py: 0.5,

                                borderRadius: 10,

                                fontWeight: 600,
                            }
                        } >
                        {
                            Object.keys(fileAssignments).length
                        }
                        File(s) attached <
                        /Typography>
                    )
                } <
                /Box> <
                Divider sx = {
                    {
                        mb: 3
                    }
                }
                />

                <
                Grid container spacing = {
                    2
                } > {
                    activeRequirements.length > 0 ? (
                        activeRequirements.map((req) => ( <
                            Grid item xs = {
                                12
                            }
                            md = {
                                6
                            }
                            key = {
                                req.id
                            } >
                            <
                            Box sx = {
                                {
                                    p: 2,

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent: "space-between",

                                    border: "1px solid #f0f0f0",

                                    borderRadius: 1.5,

                                    transition: "0.3s",

                                    bgcolor: fileAssignments[req.id] ? "#fafffa" : "#fff",

                                    "&:hover": {
                                        bgcolor: "#f5f8fa"
                                    },
                                }
                            } >
                            <
                            Box textAlign = "left" >
                            <
                            Typography variant = "body2"
                            fontWeight = "600" > {
                                req.file_name
                            } <
                            /Typography> <
                            Typography variant = "caption"
                            color = "textSecondary" > {
                                req.file_type
                            } <
                            /Typography> <
                            /Box> <
                            Box > {
                                fileAssignments[req.id] ? ( <
                                    Stack direction = "row"
                                    spacing = {
                                        1
                                    }
                                    alignItems = "center" >
                                    <
                                    Typography variant = "caption"
                                    fontWeight = "500"
                                    sx = {
                                        {
                                            maxWidth: 100,

                                            overflow: "hidden",

                                            textOverflow: "ellipsis",

                                            whiteSpace: "nowrap",
                                        }
                                    } >
                                    {
                                        fileAssignments[req.id].name
                                    } <
                                    /Typography> <
                                    CheckCircleIcon fontSize = "small"
                                    sx = {
                                        {
                                            color: "#4caf50"
                                        }
                                    }
                                    /> <
                                    IconButton size = "small"
                                    onClick = {
                                        () => handleFileChange(req.id, null)
                                    } >
                                    <
                                    DeleteIcon fontSize = "small"
                                    sx = {
                                        {
                                            color: "#d32f2f"
                                        }
                                    }
                                    /> <
                                    /IconButton> <
                                    /Stack>
                                ) : ( <
                                    Button variant = "outlined"
                                    size = "small"
                                    component = "label"
                                    startIcon = { < AttachFileIcon / >
                                    }
                                    sx = {
                                        {
                                            textTransform: "none",
                                            borderRadius: 1.5
                                        }
                                    } >
                                    Attach {
                                        " "
                                    } <
                                    input hidden type = "file"
                                    onChange = {
                                        (e) =>
                                        handleFileChange(req.id, e.target.files[0])
                                    }
                                    /> <
                                    /Button>
                                )
                            } <
                            /Box> <
                            /Box> <
                            /Grid>
                        ))
                    ) : ( <
                        Grid item xs = {
                            12
                        } >
                        <
                        Alert severity = "info"
                        sx = {
                            {
                                borderRadius: 2
                            }
                        } >
                        Please select a Permit Category to view requirements. <
                        /Alert> <
                        /Grid>
                    )
                }

                { /* 3. ADD OTHER SECTION */ }

                {
                    selectedFileType && ( <
                        Grid item xs = {
                            12
                        } >
                        <
                        Box sx = {
                            {
                                mt: 2,

                                p: 2,

                                border: "1px dashed #ccc",

                                borderRadius: 2,

                                bgcolor: "#fff",
                            }
                        } >
                        <
                        Typography variant = "subtitle2"
                        fontWeight = "700"
                        color = "text.secondary"
                        mb = {
                            2
                        }
                        display = "flex"
                        alignItems = "center"
                        gap = {
                            1
                        } >
                        Other Document <
                        /Typography> <
                        Grid container spacing = {
                            2
                        }
                        alignItems = "center" >
                        <
                        Grid item xs = {
                            3
                        } >
                        <
                        TextField fullWidth size = "small"
                        label = "Document Type"
                        value = {
                            otherDoc.doc_no
                        }
                        disabled /
                        >
                        <
                        /Grid> <
                        Grid item xs = {
                            4
                        } >
                        <
                        TextField fullWidth size = "small"
                        label = "Document Name"
                        placeholder = "Enter name..."
                        value = {
                            otherDoc.name
                        }
                        onChange = {
                            (e) =>
                            setOtherDoc({ ...otherDoc,
                                name: e.target.value
                            })
                        }
                        /> <
                        /Grid> <
                        Grid item xs = {
                            3
                        } >
                        <
                        Button variant = "outlined"
                        component = "label"
                        startIcon = { < AttachFileIcon / >
                        }
                        size = "small"
                        sx = {
                            {
                                bgcolor: "#fff",
                                textTransform: "none"
                            }
                        } >
                        {
                            otherDoc.file ? otherDoc.file.name : "Attach File"
                        } <
                        input hidden type = "file"
                        onChange = {
                            (e) =>
                            setOtherDoc({
                                ...otherDoc,

                                file: e.target.files[0],
                            })
                        }
                        /> <
                        /Button> <
                        /Grid> <
                        /Grid> <
                        /Box> <
                        /Grid>
                    )
                } <
                /Grid>

                { /* 4. SUBMIT ACTION */ } <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        mt: 4
                    }
                } >
                <
                Button variant = "contained"
                size = "large"
                sx = {
                    {
                        px: 6,

                        py: 1.2,

                        fontWeight: "bold",

                        textTransform: "none",

                        borderRadius: 2,
                    }
                }
                onClick = {
                    handleUpload
                }
                disabled = {
                    uploadLoading
                } >
                {
                    uploadLoading ?
                    "Processing Uploads..." :
                        "Submit Permit Documents"
                } <
                /Button> <
                /Box> <
                /Paper>
            )
        }

        { /* 3. HISTORY TABLE SECTION */ } <
        Paper elevation = {
            3
        }
        sx = {
            {
                p: 3,
                mt: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 2
            }
        } >
        <
        TableContainer >
        <
        Box sx = {
            {
                p: 2,

                bgcolor: "#f8fafd",

                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",
            }
        } >
        <
        Typography variant = "subtitle1"
        fontWeight = "700"
        color = "primary.main" >
        Permit Upload History <
        /Typography> <
        Typography variant = "caption"
        color = "textSecondary" >
        Found {
            filteredHistory.length
        }
        records <
        /Typography> <
        /Box> <
        Table size = "small" >
        <
        TableHead >
        <
        TableRow sx = {
            {
                bgcolor: "primary.main"
            }
        } >
        <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        } > #
        <
        /TableCell> <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        } >
        Project <
        /TableCell> <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        } >
        Windfarm <
        /TableCell> <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        } >
        Permit Section <
        /TableCell> <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        } >
        File Name <
        /TableCell> <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        }
        align = "center" >
        Action <
        /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            paginatedDocs.length > 0 ? (
                paginatedDocs.map((doc, index) => ( <
                    TableRow key = {
                        doc.id
                    }
                    hover >
                    <
                    TableCell > {
                        page * rowsPerPage + index + 1
                    } < /TableCell> <
                    TableCell > {
                        doc.project_name
                    } < /TableCell> <
                    TableCell > {
                        doc.windfarm_name
                    } < /TableCell> <
                    TableCell > {
                        doc.f_type
                    } < /TableCell> <
                    TableCell > {
                        doc.name
                    } < /TableCell> <
                    TableCell align = "center" >
                    <
                    Button size = "small"
                    startIcon = { < VisibilityIcon / >
                    }
                    href = {
                        doc.file
                    }
                    target = "_blank"
                    sx = {
                        {
                            textTransform: "none",
                            fontWeight: "600"
                        }
                    } >
                    View <
                    /Button> <
                    /TableCell> <
                    /TableRow>
                ))
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    6
                }
                align = "center"
                sx = {
                    {
                        py: 3
                    }
                } > {!isFilterSelected ?
                    "Select Project and Windfarm to fetch upload history." :
                        "No history matches the current filters."
                } <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25]
        }
        component = "div"
        count = {
            filteredHistory.length
        }
        rowsPerPage = {
            rowsPerPage
        }
        page = {
            page
        }
        onPageChange = {
            (e, newPage) => setPage(newPage)
        }
        onRowsPerPageChange = {
            (e) => {
                setRowsPerPage(parseInt(e.target.value, 10));

                setPage(0);
            }
        }
        /> <
        /Paper> <
        /Box>
    );
}