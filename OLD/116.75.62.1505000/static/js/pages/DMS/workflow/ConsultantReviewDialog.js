import React, {
    useState,
    useEffect,
    useCallback
} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    MenuItem,
    IconButton,
    Typography,
    Box,
    Chip,
    Tooltip,
    CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetReviewCommentsData,
    CloseComment,
} from "../../../Redux/DmsData/Document/DocumentAction";

const createRow = (index) => ({
    page_no: "",
    section: "",
    type: "",
    severity: "",
    reviewer_comment: "",
    proposed_solution: "",
});

const ConsultantReviewDialog = ({
    open,
    onClose,
    onSubmit,
    doc,
    type = "approve",
}) => {
    const dispatch = useDispatch();
    const {
        reviewComments = []
    } = useSelector((state) => state.document || {});
    const [rows, setRows] = useState([createRow(0)]);
    const [remarks, setRemarks] = useState("");
    const [approvalType, setApprovalType] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [closingComment, setClosingComment] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = useCallback((message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    }, []);

    useEffect(() => {
        if (!open || !doc ? .id || !doc ? .current_version_id) return;
        const loadComments = async () => {
            setLoadingComments(true);
            await dispatch(GetReviewCommentsData(doc.id, doc.current_version_id));
            setLoadingComments(false);
        };
        loadComments();
    }, [open, doc ? .id, doc ? .current_version_id]);


    useEffect(() => {
        if (!open) return;
        if (reviewComments ? .length > 0) {
            const mapped = reviewComments.map((c) => ({
                id: c.id,
                parent_comment_id: c.parent_comment,
                comment_no: c.comment_no,
                page_no: c.page_no || "",
                section: c.section || "",
                type: c.comment_type || "",
                severity: c.severity || "",
                reviewer_comment: c.reviewer_comment || "",
                proposed_solution: c.proposed_solution || "",
                pm_response: c.pm_response || "",
                vendor_response: c.vendor_response || "",
                action_status: c.action_status || "",
                status: c.status || "",
                is_submitted: c.is_submitted || false,
                resolved: c.resolved || false,
            }));

            setRows(mapped);
        } else {
            setRows([createRow()]);
        }
    }, [reviewComments, open]);


    const handleChange = (index, field, value) => {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
    };

    const addRow = () => {
        setRows((prev) => [...prev, createRow(prev.length)]);
    };

    const hasAnyComment = () => {
        return rows.some(
            (row) =>
            row.reviewer_comment ? .trim() ||
            row.pm_response ? .trim() ||
            row.vendor_response ? .trim(),
        );
    };

    const handleSubmit = async () => {
        if (submitting) return;
        try {
            if (approvalType === "reject" && !hasAnyComment()) {
                showSnackbar(
                    "At least one Reviewer, PM or Vendor comment is required before rejecting the document",
                    "error",
                );
                return;
            }
            setSubmitting(true);
            const payload = {
                approval_type: approvalType,
                comments: rows,
                remarks,
            };
            await onSubmit ? .(payload);
        } finally {
            setSubmitting(false);
        }
    };

    const addFollowUpRow = (parentRow, index) => {
        const newRow = {
            parent_comment_id: parentRow.id,
            page_no: parentRow.page_no,
            section: parentRow.section,
            type: parentRow.type,
            severity: parentRow.severity,
            reviewer_comment: "",
            proposed_solution: "",
            pm_response: "",
            vendor_response: "",
            is_followup: true,
        };
        const updated = [...rows];
        updated.splice(index + 1, 0, newRow);
        setRows(updated);
    };

    const confirmCloseComment = async () => {
        try {
            setClosingComment(true);
            await dispatch(CloseComment(doc.id, selectedComment.id));
            await dispatch(GetReviewCommentsData(doc.id, doc.current_version_id));
            showSnackbar("Comment closed successfully", "success");
            setConfirmOpen(false);
            setSelectedComment(null);
        } catch (err) {
            showSnackbar("Failed to close comment", "error");
        } finally {
            setClosingComment(false);
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
            width: 160
        },
        {
            label: "Status",
            width: 80
        },
        {
            label: "Action",
            width: 80
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
        >
        <
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
                    m: 1,
                },
            }
        } >
        <
        DialogTitle sx = {
            {
                borderBottom: "1px solid #e5e7eb",
                py: 1.25,
                mb: 1.25,
                px: 2,
            }
        } >
        <
        Box display = "flex"
        justifyContent = "space-between"
        alignItems = "flex-start" >
        <
        Box >
        <
        Typography variant = "h6"
        fontWeight = {
            600
        }
        sx = {
            {
                mt: 0.7,
            }
        } >
        Reviewer Comments <
        /Typography> <
        /Box>

        <
        Box display = "flex"
        alignItems = "center"
        gap = {
            2
        } >
        <
        IconButton onClick = {
            onClose
        } >
        <
        CloseIcon / >
        <
        /IconButton> <
        /Box> <
        /Box> <
        /DialogTitle>

        <
        DialogContent sx = {
            {
                p: 2,
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
            }
        } >
        <
        Box sx = {
            {
                mb: 2,
                p: 1.5,
                border: "1px solid #e5e7eb",
                borderRadius: 1,
                backgroundColor: "#f8fafc",
            }
        } >
        <
        Box display = "flex"
        justifyContent = "space-between"
        alignItems = "center" >
        <
        Box >
        <
        Typography variant = "caption"
        sx = {
            {
                color: "text.secondary",
                display: "block",
            }
        } >
        DOCUMENT NO <
        /Typography>

        <
        Typography variant = "body2"
        fontWeight = {
            600
        } > {
            doc ? .document_version_number || "-"
        } <
        /Typography> <
        /Box>

        <
        Box textAlign = "right" >
        <
        Typography variant = "caption"
        sx = {
            {
                color: "text.secondary",
                display: "block",
            }
        } >
        DOCUMENT NAME <
        /Typography> <
        Typography variant = "body2"
        fontWeight = {
            600
        } > {
            doc ? .title || "-"
        } <
        /Typography> <
        /Box> <
        /Box> <
        /Box>

        <
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
                color: "#1e293b"
            }
        } >
        Review Observation Matrix <
        /Typography> <
        Chip label = {
            `${rows.length} row${rows.length !== 1 ? "s" : ""}`
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
        /Box>

        <
        Button size = "small"
        variant = "contained"
        startIcon = { < AddIcon / >
        }
        onClick = {
            addRow
        }
        sx = {
            {
                textTransform: "none",
            }
        } >
        Add Row <
        /Button> <
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
                // maxHeight: "calc(92vh - 380px)",
                maxHeight: 320,
            }
        } >
        <
        Table stickyHeader size = "small"
        sx = {
            {
                minWidth: 1300,
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
                        // bgcolor: "#1e293b",
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
            loadingComments ? ( <
                TableBody >
                <
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
                /> <
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
                /TableRow> <
                /TableBody>
            ) : ( <
                TableBody > {
                    rows.map((row, i) => {
                        const sev = SEVERITY_COLORS[row.severity] || {};
                        const isClosed = row.status === "closed";
                        const isReadOnly = row.is_submitted;
                        const rowBg = isClosed ?
                            "#f0fdf4" :
                            i % 2 === 0 ?
                            "#ffffff" :
                            "#fafbfc";

                        return ( <
                            TableRow key = {
                                i
                            }
                            sx = {
                                {
                                    bgcolor: row.is_followup ? "#fff7ed" : rowBg,
                                    "&:hover": {
                                        bgcolor: isClosed ? "#dcfce7" : "#f0f9ff",
                                    },
                                    transition: "background 0.1s",
                                }
                            } >
                            { /* # */ } <
                            TableCell sx = {
                                { ...cellSx,
                                    width: 44,
                                    textAlign: "center"
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
                            { /* {row.comment_no || i + 1} */ } {
                                row.is_followup ?
                                    "↳ Follow-up" :
                                    row.comment_no || i + 1
                            } <
                            /Typography> <
                            /TableCell>

                            { /* Page */ } <
                            TableCell sx = {
                                { ...cellSx,
                                    width: 100
                                }
                            } > {
                                isReadOnly ? (
                                    renderReadOnlyText(row.page_no)
                                ) : ( <
                                    TextField fullWidth size = "small"
                                    placeholder = "e.g. Page 12"
                                    value = {
                                        row.page_no
                                    }
                                    onChange = {
                                        (e) =>
                                        handleChange(i, "page_no", e.target.value)
                                    }
                                    sx = {
                                        inputSx
                                    }
                                    inputProps = {
                                        {
                                            style: {
                                                fontSize: "0.76rem",
                                                padding: "5px 8px",
                                            },
                                        }
                                    }
                                    />
                                )
                            } <
                            /TableCell>

                            { /* Section */ } <
                            TableCell sx = {
                                { ...cellSx,
                                    width: 110
                                }
                            } > {
                                isReadOnly ? (
                                    renderReadOnlyText(row.section)
                                ) : ( <
                                    TextField fullWidth size = "small"
                                    placeholder = "e.g. A-3, Grid 5"
                                    value = {
                                        row.section
                                    }
                                    onChange = {
                                        (e) =>
                                        handleChange(i, "section", e.target.value)
                                    }
                                    sx = {
                                        inputSx
                                    }
                                    inputProps = {
                                        {
                                            style: {
                                                fontSize: "0.76rem",
                                                padding: "5px 8px",
                                            },
                                        }
                                    }
                                    />
                                )
                            } <
                            /TableCell>

                            { /* Type */ } <
                            TableCell sx = {
                                { ...cellSx,
                                    width: 120
                                }
                            } > {
                                isReadOnly ? (
                                    renderReadOnlyText(row.type)
                                ) : ( <
                                    TextField fullWidth size = "small"
                                    placeholder = "e.g. Design, Safety"
                                    value = {
                                        row.type
                                    }
                                    onChange = {
                                        (e) =>
                                        handleChange(i, "type", e.target.value)
                                    }
                                    sx = {
                                        inputSx
                                    }
                                    inputProps = {
                                        {
                                            style: {
                                                fontSize: "0.76rem",
                                                padding: "5px 8px",
                                            },
                                        }
                                    }
                                    />
                                )
                            } <
                            /TableCell>

                            { /* Severity */ } <
                            TableCell sx = {
                                { ...cellSx,
                                    width: 120
                                }
                            } > {
                                isReadOnly ? (
                                    renderReadOnlyText(row.severity)
                                ) : ( <
                                    TextField select fullWidth size = "small"
                                    value = {
                                        row.severity
                                    }
                                    onChange = {
                                        (e) =>
                                        handleChange(i, "severity", e.target.value)
                                    }
                                    SelectProps = {
                                        {
                                            native: true
                                        }
                                    }
                                    sx = {
                                        {
                                            ...inputSx,
                                            "& select": {
                                                fontSize: "0.76rem",
                                                padding: "5px 8px",
                                                color: sev.color || "#475569",
                                                bgcolor: sev.bg || "#fff",
                                            },
                                        }
                                    } >
                                    <
                                    option value = "" > Select severity < /option> <
                                    option value = "critical" > 🔴Critical < /option> <
                                    option value = "major" > 🟠Major < /option> <
                                    option value = "minor" > 🟡Minor < /option> <
                                    /TextField>
                                )
                            } <
                            /TableCell>

                            { /* Reviewer Comment */ } <
                            TableCell sx = {
                                { ...cellSx,
                                    minWidth: 220
                                }
                            } > {
                                isReadOnly ? (
                                    renderReadOnlyText(row.reviewer_comment)
                                ) : ( <
                                    TextField fullWidth multiline minRows = {
                                        row.reviewer_comment ? 2 : 1
                                    }
                                    maxRows = {
                                        6
                                    }
                                    size = "small"
                                    placeholder = "Describe the issue clearly — what was found, and why it's a concern"
                                    value = {
                                        row.reviewer_comment
                                    }
                                    onChange = {
                                        (e) =>
                                        handleChange(
                                            i,
                                            "reviewer_comment",
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
                                )
                            } <
                            /TableCell>

                            { /* Proposed Solution */ } <
                            TableCell sx = {
                                { ...cellSx,
                                    minWidth: 200
                                }
                            } > {
                                isReadOnly ? (
                                    renderReadOnlyText(row.proposed_solution)
                                ) : ( <
                                    TextField fullWidth multiline minRows = {
                                        row.proposed_solution ? 2 : 1
                                    }
                                    maxRows = {
                                        6
                                    }
                                    size = "small"
                                    placeholder = "Suggest how to fix or address this issue"
                                    value = {
                                        row.proposed_solution
                                    }
                                    onChange = {
                                        (e) =>
                                        handleChange(
                                            i,
                                            "proposed_solution",
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
                                )
                            } <
                            /TableCell>

                            { /* PM RESPONSE */ }

                            <
                            TableCell sx = {
                                { ...cellSx,
                                    minWidth: 160
                                }
                            } > {
                                renderReadOnlyText(row.pm_response)
                            } <
                            /TableCell>

                            { /* Vendor Response */ } <
                            TableCell sx = {
                                { ...cellSx,
                                    minWidth: 160
                                }
                            } > {
                                row.vendor_response ? ( <
                                    Typography sx = {
                                        {
                                            fontSize: "0.74rem",
                                            color: "#0369a1",
                                            lineHeight: 1.5,
                                        }
                                    } >
                                    {
                                        row.vendor_response
                                    } <
                                    /Typography>
                                ) : ( <
                                    Typography sx = {
                                        {
                                            fontSize: "0.72rem",
                                            color: "#cbd5e1",
                                            fontStyle: "italic",
                                        }
                                    } >
                                    Awaiting response <
                                    /Typography>
                                )
                            } <
                            /TableCell>

                            { /* Status */ } <
                            TableCell sx = {
                                { ...cellSx,
                                    width: 80
                                }
                            } > {
                                row.status ? ( <
                                    Chip label = {
                                        row.status
                                    }
                                    size = "small"
                                    sx = {
                                        {
                                            height: 18,
                                            fontSize: "0.62rem",
                                            fontWeight: 700,
                                            textTransform: "capitalize",
                                            bgcolor: isClosed ? "#dcfce7" : "#eff6ff",
                                            color: isClosed ? "#15803d" : "#1d4ed8",
                                        }
                                    }
                                    />
                                ) : ( <
                                    Typography sx = {
                                        {
                                            fontSize: "0.72rem",
                                            color: "#cbd5e1"
                                        }
                                    } >
                                    —
                                    <
                                    /Typography>
                                )
                            } <
                            /TableCell>

                            { /* Action */ } <
                            TableCell sx = {
                                { ...cellSx,
                                    width: 80,
                                    textAlign: "center"
                                }
                            } >
                            {
                                row.is_submitted ? ( <
                                    Box sx = {
                                        {
                                            display: "flex",
                                            gap: 0.5,
                                            justifyContent: "center",
                                        }
                                    } >
                                    { /* FOLLOW UP BUTTON */ } <
                                    Tooltip title = "Add Follow-up" >
                                    <
                                    span >
                                    <
                                    IconButton size = "small"
                                    disabled = {
                                        isClosed
                                    }
                                    onClick = {
                                        () => addFollowUpRow(row, i)
                                    }
                                    sx = {
                                        {
                                            color: "#2563eb",
                                            border: "0.5px solid #93c5fd",
                                            borderRadius: "6px",
                                            p: "3px",
                                        }
                                    } >
                                    <
                                    AddIcon sx = {
                                        {
                                            fontSize: 13
                                        }
                                    }
                                    /> <
                                    /IconButton> <
                                    /span> <
                                    /Tooltip>

                                    { /* CLOSE COMMENT BUTTON */ } <
                                    Tooltip title = {
                                        isClosed ?
                                        "Already closed" :
                                            "Close this comment"
                                    } >
                                    <
                                    span >
                                    <
                                    IconButton size = "small"
                                    disabled = {
                                        isClosed
                                    }
                                    onClick = {
                                        () => {
                                            setSelectedComment(row);
                                            setConfirmOpen(true);
                                        }
                                    }
                                    sx = {
                                        {
                                            color: isClosed ? "#15803d" : "#2563eb",
                                            border: "0.5px solid",
                                            borderColor: isClosed ?
                                                "#86efac" :
                                                "#93c5fd",
                                            borderRadius: "6px",
                                            p: "3px",
                                            opacity: isClosed ? 0.6 : 1,
                                        }
                                    } >
                                    <
                                    LockIcon sx = {
                                        {
                                            fontSize: 13
                                        }
                                    }
                                    /> <
                                    /IconButton> <
                                    /span> <
                                    /Tooltip> <
                                    /Box>
                                ) : ( <
                                    Tooltip title = "Remove row" >
                                    <
                                    span >
                                    <
                                    IconButton size = "small"
                                    disabled = {
                                        rows.length === 1
                                    }
                                    onClick = {
                                        () =>
                                        setRows((p) =>
                                            p.filter((_, idx) => idx !== i),
                                        )
                                    }
                                    sx = {
                                        {
                                            color: "#ef4444",
                                            border: "0.5px solid #fecaca",
                                            borderRadius: "6px",
                                            p: "3px",
                                            "&.Mui-disabled": {
                                                opacity: 0.3
                                            },
                                        }
                                    } >
                                    <
                                    DeleteOutlineIcon sx = {
                                        {
                                            fontSize: 13
                                        }
                                    }
                                    /> <
                                    /IconButton> <
                                    /span> <
                                    /Tooltip>
                                )
                            } <
                            /TableCell> <
                            /TableRow>
                        );
                    })
                } <
                /TableBody>
            )
        } <
        /Table> <
        /TableContainer> <
        /Box>

        { /* REMARKS */ } <
        Box sx = {
            {
                mt: 2,
                mb: 2
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
        Remarks <
        /Typography>

        <
        TextField fullWidth multiline minRows = {
            3
        }
        placeholder = "Add overall remarks"
        value = {
            remarks
        }
        onChange = {
            (e) => setRemarks(e.target.value)
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                },
            }
        }
        /> <
        /Box> <
        /DialogContent>

        <
        DialogActions sx = {
            {
                borderTop: "1px solid #e5e7eb",
                px: 2,
                py: 1.5,
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
            }
        } >
        <
        Box >
        <
        Button onClick = {
            onClose
        } > Cancel < /Button> <
        /Box> <
        Box display = "flex"
        gap = {
            1
        } >
        <
        Box sx = {
            {
                minWidth: 280
            }
        } >
        <
        TextField select fullWidth size = "small"
        label = "Approval Type"
        value = {
            approvalType
        }
        onChange = {
            (e) => setApprovalType(e.target.value)
        } >
        <
        MenuItem value = "" >
        <
        em > Select Approval Type < /em> <
        /MenuItem>

        <
        MenuItem value = "conditional_approval" >
        Conditional Approval <
        /MenuItem>

        <
        MenuItem value = "technical_approval" > Technical Approval < /MenuItem>

        <
        MenuItem value = "approved_for_estimate" >
        Approved For Estimate <
        /MenuItem>

        <
        MenuItem value = "approve_overall" > Approve Overall < /MenuItem>

        <
        MenuItem value = "reject" > Reject < /MenuItem> <
        /TextField> <
        /Box>

        <
        Button variant = "contained"
        onClick = {
            handleSubmit
        }
        disabled = {!approvalType || submitting
        }
        startIcon = {
            submitting ? ( <
                CircularProgress size = {
                    16
                }
                sx = {
                    {
                        color: "inherit"
                    }
                }
                />
            ) : null
        } >
        {
            submitting ? "Submitting..." : "Submit"
        } <
        /Button> <
        /Box> <
        /DialogActions>

        <
        Dialog open = {
            confirmOpen
        }
        onClose = {
            () => setConfirmOpen(false)
        } >
        <
        DialogTitle > Close Comment < /DialogTitle>

        <
        DialogContent >
        <
        Typography > Are you sure you want to close this comment ? < /Typography> <
        /DialogContent>

        <
        DialogActions >
        <
        Button onClick = {
            () => setConfirmOpen(false)
        } > No < /Button>

        <
        Button variant = "contained"
        color = "primary"
        onClick = {
            confirmCloseComment
        }
        disabled = {
            closingComment
        } >
        {
            closingComment ? "Closing..." : "Yes"
        } <
        /Button> <
        /DialogActions> <
        /Dialog> <
        /Dialog> <
        CustomSnackbar open = {
            snackbar.open
        }
        message = {
            snackbar.message
        }
        severity = {
            snackbar.severity
        }
        onClose = {
            () =>
            setSnackbar((prev) => ({
                ...prev,
                open: false,
            }))
        }
        /> <
        />
    );
};

export default ConsultantReviewDialog;