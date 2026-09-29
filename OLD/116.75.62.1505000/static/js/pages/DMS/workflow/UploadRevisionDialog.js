import React, {
    useEffect,
    useState
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    IconButton,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Chip,
    Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import showSnackbar from "../../../components/comman/CustomSnackbar";
import {
    GetReviewCommentsData
} from "../../../Redux/DmsData/Document/DocumentAction";

const UploadRevisionDialog = ({
        open,
        onClose,
        onSubmit,
        doc
    }) => {
        const dispatch = useDispatch();
        const {
            reviewComments = []
        } = useSelector((state) => state.document || {});
        const [remarks, setRemarks] = useState("");
        const [vendorResponses, setVendorResponses] = useState({});
        const [revisionNumber, setRevisionNumber] = useState("");
        const [selectedFile, setSelectedFile] = useState(null);
        const [submitting, setSubmitting] = useState(false);
        const [loadingComments, setLoadingComments] = useState(false);

        //  LOAD COMMENTS
        // useEffect(() => {
        //   if (!open) return;
        //   if (doc?.id && doc?.current_version_id) {
        //     dispatch(GetReviewCommentsData(doc.id, doc.current_version_id));
        //   }
        // }, [open, doc?.id, doc?.current_version_id, dispatch]);

        useEffect(() => {
            if (!open) return;
            if (doc ? .id && doc ? .current_version_id) {
                const loadComments = async () => {
                    try {
                        setLoadingComments(true);
                        await dispatch(GetReviewCommentsData(doc.id, doc.current_version_id));
                    } finally {
                        setLoadingComments(false);
                    }
                };
                loadComments();
            }
        }, [open, doc ? .id, doc ? .current_version_id, dispatch]);

        //  LOAD REMARKS
        useEffect(() => {
            if (!open) return;
            setRemarks(
                doc ? .remarks || doc ? .review_remarks || doc ? .latest_remarks || "",
            );
            setRevisionNumber(doc ? .revision_number || "");
        }, [open, doc]);

        useEffect(() => {
            const mapped = {};
            (reviewComments || []).forEach((item) => {
                mapped[item.id] = item.vendor_response || "";
            });
            setVendorResponses(mapped);
        }, [reviewComments]);

        //  FILE SELECT
        const handleFileChange = (e) => {
            const file = e.target.files ? .[0];
            if (!file) return;
            setSelectedFile(file);
        };

        const resetForm = () => {
            setRemarks("");
            setVendorResponses({});
            setRevisionNumber("");
            setSelectedFile(null);
        };

        //  REMOVE FILE
        const handleRemoveFile = () => {
            setSelectedFile(null);
        };

        const handleVendorResponseChange = (commentId, value) => {
            setVendorResponses((prev) => ({
                ...prev,
                [commentId]: value,
            }));
        };

        //  TABLE ROWS
        const rows = (reviewComments || []).filter(
            (item) => item.status !== "closed",
        );

        //  SUBMIT
        const handleSubmit = async () => {
            if (submitting) return;

            if (!revisionNumber ? .trim()) {
                showSnackbar("Revision number required", "warning");
                return;
            }

            if (!selectedFile) {
                showSnackbar("Please attach revision file", "warning");
                return;
            }

            const missingResponses = rows.filter(
                (item) => !String(vendorResponses[item.id] || "").trim(),
            );

            if (missingResponses.length > 0) {
                showSnackbar(
                    "Please provide Vendor Response for all review comments",
                    "warning",
                );
                return;
            }

            try {
                setSubmitting(true);

                const formData = new FormData();
                formData.append("revision_number", revisionNumber);
                formData.append("remarks", remarks);
                formData.append("revision_file", selectedFile);
                formData.append(
                    "comments",
                    JSON.stringify(
                        rows.map((item) => ({
                            id: item.id,
                            vendor_response: vendorResponses[item.id] || "",
                            action_status: "incorporated",
                        })),
                    ),
                );

                const response = await onSubmit(doc.id, formData);
                if (response) {
                    resetForm();
                    onClose ? .();
                }
                //   await onSubmit?.(payload);
            } finally {
                setSubmitting(false);
            }
        };

        const headerCells = [{
                label: "#",
                width: 44
            },
            {
                label: "Page / Sheet",
                width: 100
            },
            {
                label: "Section / Grid",
                width: 110
            },
            {
                label: "Type",
                width: 120
            },
            {
                label: "Severity",
                width: 120
            },
            {
                label: "Reviewer Comment",
                width: 220,
                flex: true
            },
            {
                label: "Proposed Solution",
                width: 200,
                flex: true
            },
            {
                label: "PM Response",
                width: 220
            },
            {
                label: "Vendor Response",
                width: 220
            },
        ];

        const cellSx = {
            borderBottom: "0.5px solid #e2e8f0",
            borderRight: "0.5px solid #e2e8f0",
            py: "6px",
            px: "8px",
            verticalAlign: "top",
        };

        const inputSx = {
            "& .MuiOutlinedInput-root": {
                fontSize: "0.76rem",
                borderRadius: "6px",
                backgroundColor: "#fff",

                "& fieldset": {
                    borderColor: "#dbe3ef",
                },

                "&:hover fieldset": {
                    borderColor: "#93c5fd",
                },

                "&.Mui-focused fieldset": {
                    borderColor: "#2563eb",
                },
            },
        };

        const SEVERITY_COLORS = {
            critical: {
                bg: "#fef2f2",
                color: "#dc2626",
            },
            major: {
                bg: "#fff7ed",
                color: "#ea580c",
            },
            minor: {
                bg: "#fefce8",
                color: "#ca8a04",
            },
        };

        const renderReadOnlyText = (value) => ( <
            Typography sx = {
                {
                    fontSize: "0.74rem",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                }
            } >
            {
                value || "-"
            } <
            /Typography>
        );

        return ( <
            Dialog open = {
                open
            }
            onClose = {
                onClose
            }
            fullWidth maxWidth = {
                false
            }
            PaperProps = {
                {
                    sx: {
                        width: "96vw",
                        height: "94vh",
                        maxWidth: "96vw",
                        display: "flex",
                        flexDirection: "column",
                    },
                }
            } >
            { /* HEADER */ } <
            DialogTitle sx = {
                {
                    borderBottom: "1px solid #e5e7eb",
                    py: 1.5,
                    px: 2,
                    mb: 1.5,
                    paddingBottom: 0.5,
                }
            } >
            <
            Box display = "flex"
            justifyContent = "space-between"
            alignItems = "center" >
            <
            Box >
            <
            Typography variant = "h6"
            fontWeight = {
                700
            }
            sx = {
                {
                    fontSize: "1rem",
                    mb: -1,
                }
            } >
            Upload Revision <
            /Typography>

            <
            Typography variant = "caption"
            color = "text.secondary" >
            Review all comments, add vendor responses, and upload the corrected revision file. <
            /Typography> <
            /Box>

            <
            IconButton onClick = {
                onClose
            } >
            <
            CloseIcon / >
            <
            /IconButton> <
            /Box> <
            /DialogTitle>

            { /* CONTENT */ } <
            DialogContent sx = {
                {
                    p: 2,
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                }
            } >
            { /* DOCUMENT INFO */ } <
            Box sx = {
                {
                    mb: 2,
                    p: 1.5,
                    border: "1px solid #e5e7eb",
                    borderRadius: 1.5,
                    backgroundColor: "#f8fafc",
                }
            } >
            <
            Box display = "grid"
            gridTemplateColumns = {
                {
                    xs: "1fr",
                    md: "1fr 1fr 1fr",
                }
            }
            gap = {
                2
            }
            alignItems = "center" >
            { /* DOCUMENT NO */ } <
            Box >
            <
            Typography variant = "caption"
            sx = {
                {
                    color: "text.secondary",
                    display: "block",
                    fontWeight: 600,
                    mb: 0.5,
                }
            } >
            DOCUMENT NO <
            /Typography>

            <
            Typography variant = "body2"
            fontWeight = {
                700
            } > {
                doc ? .document_version_number || "-"
            } <
            /Typography> <
            /Box>

            { /* DOCUMENT NAME */ } <
            Box >
            <
            Typography variant = "caption"
            sx = {
                {
                    color: "text.secondary",
                    display: "block",
                    fontWeight: 600,
                    mb: 0.5,
                }
            } >
            DOCUMENT NAME <
            /Typography>

            <
            Typography variant = "body2"
            fontWeight = {
                700
            } > {
                doc ? .title || "-"
            } <
            /Typography> <
            /Box>

            { /* REVISION NUMBER */ } <
            Box >
            <
            Typography variant = "caption"
            sx = {
                {
                    color: "text.secondary",
                    display: "block",
                    fontWeight: 600,
                    mb: 0.5,
                }
            } >
            REVISION NUMBER <
            /Typography>

            <
            TextField fullWidth size = "small"
            placeholder = "Ex: R1 / Rev-02"
            value = {
                revisionNumber
            }
            onChange = {
                (e) => setRevisionNumber(e.target.value)
            }
            sx = {
                {
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                    },
                }
            }
            /> <
            /Box> <
            /Box> <
            /Box>

            { /* TABLE SECTION */ } <
            Box >
            <
            Box display = "flex"
            alignItems = "center"
            justifyContent = "space-between"
            mb = {
                1
            } >
            <
            Box display = "flex"
            alignItems = "center"
            gap = {
                1
            } >
            <
            Typography sx = {
                {
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#1e293b",
                }
            } >
            Review Comments / Action Comments <
            /Typography>

            <
            Chip label = {
                `${rows.length} Comment${rows.length !== 1 ? "s" : ""}`
            }
            size = "small"
            sx = {
                {
                    height: 20,
                    fontSize: "0.62rem",
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    fontWeight: 600,
                }
            }
            /> <
            /Box> <
            /Box>

            <
            TableContainer component = {
                Paper
            }
            elevation = {
                0
            }
            sx = {
                {
                    border: "0.5px solid #e2e8f0",
                    borderRadius: "8px",
                    overflow: "auto",
                    maxHeight: 320,
                }
            } >
            <
            Table stickyHeader size = "small"
            sx = {
                {
                    minWidth: 1400,
                    borderCollapse: "separate",
                    borderSpacing: 0,
                }
            } >
            <
            TableHead >
            <
            TableRow > {
                headerCells.map((h) => ( <
                    TableCell key = {
                        h.label
                    }
                    sx = {
                        {
                            ...cellSx,
                            backgroundColor: "#2563eb",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            whiteSpace: "nowrap",
                            py: "8px",
                            width: h.flex ? undefined : h.width,
                            minWidth: h.width,
                            position: "sticky",
                            top: 0,
                            zIndex: 5,
                            borderRight: "0.5px solid #2563eb",
                        }
                    } >
                    {
                        h.label
                    } <
                    /TableCell>
                ))
            } <
            /TableRow> <
            /TableHead>

            {
                /* <TableBody>
                                {rows.length > 0 ? ( */
            } { /* change made after deployment 24/08/26 */ }

            <
            TableBody > {
                loadingComments ? ( <
                    TableRow >
                    <
                    TableCell colSpan = {
                        headerCells.length
                    }
                    sx = {
                        {
                            height: 320,
                            textAlign: "center",
                            borderBottom: "none",
                        }
                    } >
                    <
                    Box sx = {
                        {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 320,
                            width: "100%",
                        }
                    } >
                    <
                    CircularProgress size = {
                        32
                    }
                    />

                    <
                    Typography sx = {
                        {
                            mt: 1,
                            fontSize: "0.75rem",
                            color: "#64748b",
                        }
                    } >
                    Loading comments...
                    <
                    /Typography> <
                    /Box> <
                    /TableCell> <
                    /TableRow>
                ) : rows.length > 0 ? (
                    rows.map((row, index) => {
                        const sev =
                            SEVERITY_COLORS[(row.severity || "").toLowerCase()] || {};

                        const rowBg = index % 2 === 0 ? "#ffffff" : "#fafbfc";

                        return ( <
                            TableRow key = {
                                row.id || index
                            }
                            sx = {
                                {
                                    bgcolor: rowBg,
                                    "&:hover": {
                                        bgcolor: "#f0f9ff",
                                    },
                                    transition: "background 0.1s",
                                }
                            } >
                            { /* COMMENT NO */ } <
                            TableCell sx = {
                                {
                                    ...cellSx,
                                    width: 44,
                                    textAlign: "center",
                                }
                            } >
                            <
                            Typography sx = {
                                {
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    color: "#94a3b8",
                                }
                            } >
                            {
                                row.comment_no || index + 1
                            } <
                            /Typography> <
                            /TableCell>

                            { /* PAGE */ } <
                            TableCell sx = {
                                {
                                    ...cellSx,
                                    width: 100,
                                }
                            } >
                            <
                            Typography sx = {
                                {
                                    fontSize: "0.76rem"
                                }
                            } > {
                                row.page_no || "-"
                            } <
                            /Typography> <
                            /TableCell>

                            { /* SECTION */ } <
                            TableCell sx = {
                                {
                                    ...cellSx,
                                    width: 110,
                                }
                            } >
                            <
                            Typography sx = {
                                {
                                    fontSize: "0.76rem"
                                }
                            } > {
                                row.section || "-"
                            } <
                            /Typography> <
                            /TableCell>

                            { /* TYPE */ } <
                            TableCell sx = {
                                {
                                    ...cellSx,
                                    width: 120,
                                }
                            } >
                            <
                            Typography sx = {
                                {
                                    fontSize: "0.76rem"
                                }
                            } > {
                                row.comment_type || row.type || "-"
                            } <
                            /Typography> <
                            /TableCell>

                            { /* SEVERITY */ } <
                            TableCell sx = {
                                {
                                    ...cellSx,
                                    width: 120,
                                }
                            } >
                            {
                                row.severity ? ( <
                                    Chip label = {
                                        row.severity
                                    }
                                    size = "small"
                                    sx = {
                                        {
                                            height: 18,
                                            fontSize: "0.62rem",
                                            fontWeight: 700,
                                            textTransform: "capitalize",
                                            bgcolor: sev.bg || "#eff6ff",
                                            color: sev.color || "#1d4ed8",
                                        }
                                    }
                                    />
                                ) : ( <
                                    Typography sx = {
                                        {
                                            fontSize: "0.72rem",
                                            color: "#cbd5e1",
                                        }
                                    } >
                                    —
                                    <
                                    /Typography>
                                )
                            } <
                            /TableCell>

                            { /* REVIEWER COMMENT */ } <
                            TableCell sx = {
                                {
                                    ...cellSx,
                                    minWidth: 220,
                                }
                            } >
                            <
                            Typography sx = {
                                {
                                    fontSize: "0.74rem",
                                    lineHeight: 1.5,
                                    whiteSpace: "pre-wrap",
                                }
                            } >
                            {
                                row.reviewer_comment || "-"
                            } <
                            /Typography> <
                            /TableCell>

                            { /* PROPOSED SOLUTION */ } <
                            TableCell sx = {
                                {
                                    ...cellSx,
                                    minWidth: 200,
                                }
                            } >
                            <
                            Typography sx = {
                                {
                                    fontSize: "0.74rem",
                                    lineHeight: 1.5,
                                    whiteSpace: "pre-wrap",
                                }
                            } >
                            {
                                row.proposed_solution || "-"
                            } <
                            /Typography> <
                            /TableCell>

                            { /* PM RESPONSE */ } <
                            TableCell sx = {
                                {
                                    ...cellSx,
                                    minWidth: 220,
                                }
                            } >
                            <
                            Typography sx = {
                                {
                                    fontSize: "0.74rem",
                                    color: "#7c3aed",
                                    lineHeight: 1.5,
                                    whiteSpace: "pre-wrap",
                                }
                            } >
                            {
                                row.pm_response || "-"
                            } <
                            /Typography> <
                            /TableCell>

                            { /* VENDOR RESPONSE */ } <
                            TableCell sx = {
                                {
                                    ...cellSx,
                                    minWidth: 220,
                                }
                            } >
                            {
                                row.can_edit_vendor_response ? ( <
                                    TextField fullWidth multiline minRows = {
                                        2
                                    }
                                    maxRows = {
                                        6
                                    }
                                    size = "small"
                                    placeholder = "Enter vendor response..."
                                    value = {
                                        vendorResponses[row.id] || ""
                                    }
                                    onChange = {
                                        (e) =>
                                        handleVendorResponseChange(
                                            row.id,
                                            e.target.value,
                                        )
                                    }
                                    sx = {
                                        {
                                            ...inputSx,
                                            "& textarea": {
                                                fontSize: "0.76rem",
                                                lineHeight: 1.5,
                                            },
                                        }
                                    }
                                    />
                                ) : (
                                    renderReadOnlyText(row.vendor_response)
                                )
                            } <
                            /TableCell> <
                            /TableRow>
                        );
                    })
                ) : ( <
                    TableRow >
                    <
                    TableCell colSpan = {
                        9
                    }
                    align = "center"
                    sx = {
                        {
                            py: 4
                        }
                    } >
                    <
                    Typography sx = {
                        {
                            color: "#94a3b8",
                            fontSize: "0.8rem",
                        }
                    } >
                    No review comments available <
                    /Typography> <
                    /TableCell> <
                    /TableRow>
                )
            } <
            /TableBody> <
            /Table> <
            /TableContainer> <
            /Box>

            { /* REMARKS */ } <
            Box sx = {
                {
                    mt: 2.5
                }
            } >
            <
            Typography variant = "subtitle2"
            sx = {
                {
                    mb: 1,
                    fontWeight: 600,
                    color: "#334155",
                }
            } >
            Overall Remarks <
            /Typography>

            <
            TextField fullWidth multiline minRows = {
                3
            }
            value = {
                remarks
            }
            onChange = {
                (e) => setRemarks(e.target.value)
            }
            placeholder = "Add revision remarks..."
            sx = {
                {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#fafafa",
                    },
                }
            }
            /> <
            /Box>

            { /* FILE ATTACHMENT */ } <
            Box sx = {
                {
                    mt: 3
                }
            } >
            <
            Typography variant = "subtitle2"
            sx = {
                {
                    mb: 1.2,
                    fontWeight: 600,
                    color: "#334155",
                }
            } >
            Attach Revised Document <
            /Typography>

            <
            Box sx = {
                {
                    border: "1px dashed #94a3b8",
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: "#f8fafc",
                }
            } >
            <
            Stack direction = "row"
            spacing = {
                1.5
            }
            alignItems = "center"
            flexWrap = "wrap" >
            <
            Button variant = "contained"
            component = "label"
            startIcon = { < UploadFileIcon / >
            } >
            Attach Document <
            input type = "file"
            hidden onChange = {
                handleFileChange
            }
            /> <
            /Button>

            {
                selectedFile && ( <
                    Chip icon = { < DescriptionOutlinedIcon / >
                    }
                    label = {
                        selectedFile.name
                    }
                    color = "success"
                    onDelete = {
                        handleRemoveFile
                    }
                    deleteIcon = { < DeleteOutlineIcon / >
                    }
                    />
                )
            } <
            /Stack>

            { /* FILE INFO */ } {
                selectedFile && ( <
                    Box sx = {
                        {
                            mt: 2
                        }
                    } >
                    <
                    Divider sx = {
                        {
                            mb: 2
                        }
                    }
                    />

                    <
                    Typography variant = "caption"
                    color = "text.secondary" >
                    Selected File Details <
                    /Typography>

                    <
                    Stack direction = "row"
                    spacing = {
                        2
                    }
                    sx = {
                        {
                            mt: 1
                        }
                    } >
                    <
                    Typography variant = "body2" >
                    <
                    b > Name: < /b> {selectedFile.name} <
                    /Typography>

                    <
                    Typography variant = "body2" >
                    <
                    b > Size: < /b> {(selectedFile.size /
                    1024 / 1024).toFixed(2)
            } {
                " "
            }
            MB <
            /Typography>

            <
            Typography variant = "body2" >
            <
            b > Type: < /b> {selectedFile.type || "-"} <
            /Typography> <
            /Stack> <
            /Box>
        )
    } <
    /Box> <
    /Box> <
    /DialogContent>

{ /* FOOTER */ } <
DialogActions
sx = {
        {
            borderTop: "1px solid #e5e7eb",
            px: 2,
            py: 1.5,
            justifyContent: "space-between",
        }
    } >
    <
    Button
onClick = {
    onClose
}
sx = {
        {
            textTransform: "none",
        }
    } >
    Cancel <
    /Button>

    <
    Button
variant = "contained"
onClick = {
    handleSubmit
}
disabled = {
        submitting || !selectedFile
    } >
    {
        submitting ? "Uploading..." : "Upload Revision"
    } <
    /Button> <
    /DialogActions> <
    /Dialog>
);
};

export default UploadRevisionDialog;