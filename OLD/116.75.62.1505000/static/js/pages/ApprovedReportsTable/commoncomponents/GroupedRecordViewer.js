import React, {
    useState,
    useEffect
} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Paper,
    Button,
    LinearProgress,
    Alert,
    Grid,
    Card,
    Chip,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import {
    EditIcon,
    SaveIcon
} from "lucide-react";
import TableChartIcon from "@mui/icons-material/TableChart";

const TABLE_TO_ACTIVITY_MAP = {
    soil: "SOIL",
    excavation: "EXC",
    pcc: "PCC",
    "Conduit laying": "CONDUIT",
    "anchor cage": "ANCHOR",
    reinforcement: "REINF",
    "foundation & casting": "CAST",
    "pouring card": "POUR",
    deshuttering: "DESHUTTER",
    "cube test results": "CUBE_RESULT",
    backfilling: "BACKFILL",
    platform: "PLATFORM",
};

function GroupedRecordViewer({
    open,
    onClose,
    records,
    tableId,
    onApprove,
    columns,
    isAdmin = true,
    onUpdate,
    sqlist = [],
    delayList = [],
}) {
    const [editingId, setEditingId] = useState(null);
    const [tempData, setTempData] = useState({});
    const [approving, setApproving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        setApproving(false);
        setEditingId(null);
    }, [records, tableId, open]);

    const currentActivity =
        TABLE_TO_ACTIVITY_MAP[tableId] ||
        TABLE_TO_ACTIVITY_MAP[tableId ? .toLowerCase()];
    const currentTurbineName = records[0] ? .turbine_sr_no;

    const relevantDelays = (delayList || []).filter((delay) => {
        return (
            delay.activity_name === currentActivity &&
            delay.turbine_name === currentTurbineName
        );
    });

    // Track issues specifically related to this turbine and activity
    const activityIssues = (sqlist || []).filter((sq) => {
        const activityMatch = sq.turbine_activity === currentActivity;
        const turbineMatch = sq.turbine_name === currentTurbineName;
        return activityMatch && turbineMatch;
    });


    // --- UPDATED LOGIC FOR SQ STATUSES ---
    // Count how many issues exist
    const totalIssuesCount = activityIssues.length;

    // Filter strictly for open issues (anything not closed or approved)
    const openIssues = activityIssues.filter((sq) => {
        const statusLower = sq.status ? .toLowerCase();
        return statusLower !== "approved";
    });
    // Block approval if there are ANY open issues
    const isBlockedBySQ = openIssues.length > 0;

    // Conditions for visual feedback:
    // 1. Blocked / Open: Any open issues exist -> RED
    // 2. Resolved / Closed: Issues exist AND zero open issues -> GREEN
    const hasResolvedIssues = totalIssuesCount > 0 && !isBlockedBySQ;
    const showSqBanner = totalIssuesCount > 0;

    const pendingRecords = records.filter((r) => r.status !== "Approved");
    const approvedRecords = records.filter((r) => r.status === "Approved");

    // --- 1. EXTRACT UNIQUE ATTACHMENTS (Certificates/Sheets) ---
    const uniqueAttachments = [];
    const seenUrls = new Set();
    records.forEach((r) => {
        if (Array.isArray(r.attachments)) {
            r.attachments.forEach((attr) => {
                const url = typeof attr === "string" ? attr : attr.file;
                if (url && !seenUrls.has(url) && url !== r.evidence_photo) {
                    uniqueAttachments.push(attr);
                    seenUrls.add(url);
                }
            });
        }
    });

    const handleClose = () => {
        setError(null);
        onClose();
    };

    const getTitle = () => {
        if (records.length === 0) return "No Records";
        const first = records[0];
        return `Turbine: ${first.turbine_sr_no || "Details"}`;
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        setTempData(record);
    };

    const handleSave = async (id) => {
        const result = await onUpdate(tableId, id, tempData);
        if (result.success) {
            setEditingId(null);
        } else {
            const errorData = result.error ? .response ? .data;
            alert(`Update failed: ${JSON.stringify(errorData)}`);
        }
    };

    const renderFiles = (input) => {
        let filesToRender = [];
        if (Array.isArray(input)) {
            filesToRender = input.map((attr) => {
                const url = typeof attr === "string" ? attr : attr.file;
                const ext = url ? .split(".").pop().toLowerCase().split(/[?#]/)[0];
                return {
                    file: url,
                    label: attr.name || attr.file_name || `FILE.${ext?.toUpperCase()}`,
                    ext: ext,
                    isImg: ["jpg", "jpeg", "png", "gif", "webp"].includes(ext),
                    isExcel: ["xls", "xlsx", "csv"].includes(ext),
                    isPdf: ext === "pdf",
                };
            });
        } else {
            if (input.evidence_photo) {
                filesToRender.push({
                    file: input.evidence_photo,
                    label: "Evidence Photo",
                    isImg: true,
                });
            }
        }
        if (filesToRender.length === 0) return null;
        return ( <
            Box sx = {
                {
                    display: "flex",
                    gap: 1.5,
                    flexWrap: "wrap",
                    mt: 1
                }
            } > {
                filesToRender.map((f, idx) => ( <
                    Card key = {
                        idx
                    }
                    sx = {
                        {
                            width: 110,
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            position: "relative",
                        }
                    } >
                    <
                    Box sx = {
                        {
                            height: 65,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#fcfcfc",
                            cursor: "pointer",
                        }
                    }
                    onClick = {
                        () => window.open(f.file, "_blank")
                    } >
                    {
                        f.isImg ? ( <
                            img src = {
                                f.file
                            }
                            alt = "Preview"
                            style = {
                                {
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }
                            }
                            />
                        ) : f.isPdf ? ( <
                            PictureAsPdfIcon color = "error" / >
                        ) : f.isExcel ? ( <
                            TableChartIcon color = "success" / >
                        ) : ( <
                            DescriptionIcon sx = {
                                {
                                    color: "#757575"
                                }
                            }
                            />
                        )
                    } <
                    /Box> <
                    Box sx = {
                        {
                            p: 0.5,
                            bgcolor: "white",
                            textAlign: "center"
                        }
                    } >
                    <
                    Typography variant = "caption"
                    sx = {
                        {
                            fontSize: "9px",
                            fontWeight: 600,
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }
                    } >
                    {
                        f.label
                    } <
                    /Typography> <
                    /Box> <
                    /Card>
                ))
            } <
            /Box>
        );
    };

    const handleApproveAll = async () => {
        setError(null);
        const firstEligible = records.find(
            (r) =>
            (r.soil_status ? .toLowerCase() === "completed" ||
                r.excavation_status ? .toLowerCase() === "completed" ||
                r.pcc_status ? .toLowerCase() === "completed" ||
                r.conduct_status ? .toLowerCase() === "completed" ||
                r.anchor_status ? .toLowerCase() === "completed" ||
                r.reinforcement_status ? .toLowerCase() === "completed" ||
                r.foundation_status ? .toLowerCase() === "completed" ||
                r.pouring_status ? .toLowerCase() === "completed" ||
                r.desh_status ? .toLowerCase() === "completed" ||
                r.cr_status ? .toLowerCase() === "completed" ||
                r.backfill_status ? .toLowerCase() === "completed" ||
                r.activity_status ? .toLowerCase() === "completed" ||
                r.t1_status ? .toLowerCase() === "completed" ||
                r.tower_status ? .toLowerCase() === "completed" ||
                r.nacelle_status ? .toLowerCase() === "completed" ||
                r.rotor_status ? .toLowerCase() === "completed" ||
                r.blade_status ? .toLowerCase() === "completed") &&
            r.status !== "Approved",
        );
        if (!firstEligible) {
            setError("No completed records found to approve.");
            return;
        }
        setApproving(true);
        setError(null);
        try {
            await onApprove(tableId, firstEligible.id, {
                status: "approved"
            });
            setTimeout(() => {
                handleClose();
            }, 1000);
        } catch (error) {
            setError(error.response ? .data ? .detail || "Approval failed.");
        } finally {
            setApproving(false);
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
        fullWidth >
        <
        DialogTitle sx = {
            {
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
            }
        } >
        <
        Box >
        <
        Typography variant = "h6" > {
            getTitle()
        } < /Typography> {
            showSqBanner && ( <
                Typography variant = "caption"
                sx = {
                    {
                        color: hasResolvedIssues ? "#00e676" : "#ffeb3b",
                        fontWeight: "bold",
                    }
                } >
                {
                    hasResolvedIssues ?
                    "✓ SAFETY & QUALITY ISSUES RESOLVED (CLOSED & APPROVED)" :
                        `⚠️ ${openIssues.length} SAFETY & QUALITY ISSUES OPEN`
                } <
                /Typography>
            )
        } <
        Box sx = {
            {
                display: "flex",
                gap: 2,
                mt: 0.5
            }
        } >
        <
        Typography variant = "caption" >
        Total Records: {
            records.length
        } <
        /Typography> <
        Typography variant = "caption" >
        Approved: {
            approvedRecords.length
        } <
        /Typography> <
        /Box> <
        /Box> <
        Box sx = {
            {
                display: "flex",
                gap: 1
            }
        } > {
            isAdmin && pendingRecords.length > 0 && ( <
                Button variant = "contained"
                startIcon = { < DoneAllIcon / >
                }
                onClick = {
                    handleApproveAll
                }
                disabled = {
                    approving || isBlockedBySQ
                }
                sx = {
                    {
                        bgcolor: isBlockedBySQ ? "rgba(255,255,255,0.3)" : "white",
                        color: "primary.main",
                        "&:hover": {
                            bgcolor: "#f0f0f0"
                        },
                    }
                } >
                {
                    isBlockedBySQ ?
                    "Issues Pending" :
                        approving ?
                        "Approving..." :
                        `Approve All`
                } <
                /Button>
            )
        } <
        IconButton onClick = {
            onClose
        }
        sx = {
            {
                color: "white"
            }
        } >
        <
        CloseIcon / >
        <
        /IconButton> <
        /Box> <
        /DialogTitle> {
            /* <DialogContent sx={{ p: 0, bgcolor: "#f5f5f5" }}>
                    {error && (
                      <Alert severity="error" sx={{ m: 2 }}>
                        {error}
                      </Alert>
                    )}
                    {approving && (
                      <Box sx={{ p: 2 }}>
                        <LinearProgress />
                      </Box>
                    )} */
        }

        <
        DialogContent sx = {
            {
                p: 0,
                bgcolor: "#f5f5f5",
                position: "relative"
            }
        } > { /* Sticky Container for Alerts & Progress */ } <
        Box sx = {
            {
                position: "sticky",
                top: 0,
                zIndex: 10,
                bgcolor: "#f5f5f5", // Match background to prevent transparency overlap
                boxShadow: error ? "0px 4px 6px -2px rgba(0,0,0,0.05)" : "none",
            }
        } >
        {
            error && ( <
                Alert severity = "error"
                sx = {
                    {
                        m: 2,
                        mb: approving ? 1 : 2
                    }
                } > {
                    error
                } <
                /Alert>
            )
        } {
            approving && ( <
                Box sx = {
                    {
                        px: 2,
                        pb: 2
                    }
                } >
                <
                LinearProgress / >
                <
                /Box>
            )
        } <
        /Box> <
        Box sx = {
            {
                p: 3
            }
        } > { /* --- SECTION: BLOCKER / RESOLVED ISSUES --- */ } {
            showSqBanner && ( <
                Box sx = {
                    {
                        mb: 3
                    }
                } >
                <
                Alert severity = {
                    hasResolvedIssues ? "success" : "error"
                }
                sx = {
                    {
                        borderRadius: 2,
                        boxShadow: hasResolvedIssues ?
                            "0 4px 12px rgba(46, 125, 50, 0.2)" :
                            "0 4px 12px rgba(211, 47, 47, 0.2)",
                    }
                } >
                <
                Typography variant = "subtitle2"
                sx = {
                    {
                        fontWeight: 700
                    }
                } > {
                    hasResolvedIssues ?
                    "✓ SAFETY & QUALITY ISSUES RESOLVED / CLOSED" :
                        "⚠️ BLOCKER: OPEN QUALITY/SAFETY ISSUES"
                } <
                /Typography> <
                Box component = "ul"
                sx = {
                    {
                        mt: 1,
                        pl: 2
                    }
                } > {
                    activityIssues.map((issue) => ( <
                        li key = {
                            issue.id
                        } >
                        <
                        Typography variant = "body2"
                        sx = {
                            {
                                fontWeight: 500,
                                mb: 0.5
                            }
                        } >
                        <
                        strong > {
                            issue.record_type ? .toUpperCase()
                        }: < /strong>{" "} {
                            issue.note_details ? .replace(/[\\"]/g, "") ||
                                "No details provided"
                        } {
                            issue.severity &&
                                ` | Severity: ${issue.severity.toUpperCase()}`
                        } {
                            issue.status &&
                                ` | Status: ${issue.status.toUpperCase()}`
                        } {
                            issue.quality_defect && ( <
                                Box component = "span"
                                sx = {
                                    {
                                        display: "block",
                                        fontWeight: 600,
                                        mt: 0.5,
                                    }
                                } >
                                ⚠️Defect Type: {
                                    " "
                                } <
                                span style = {
                                    {
                                        fontWeight: 400
                                    }
                                } > {
                                    issue.quality_defect.replace(/[\\"]/g, "")
                                } <
                                /span> <
                                /Box>
                            )
                        } {
                            issue.corrective_action && ( <
                                Box component = "span"
                                sx = {
                                    {
                                        display: "block",
                                        fontStyle: "italic",
                                        mt: 0.5,
                                    }
                                } >
                                Action: {
                                    " "
                                } {
                                    issue.corrective_action.replace(/[\\"]/g, "")
                                } <
                                /Box>
                            )
                        } <
                        /Typography> <
                        /li>
                    ))
                } <
                /Box> <
                /Alert> <
                /Box>
            )
        }

        { /* --- SECTION: DELAY LOGS --- */ } {
            relevantDelays.length > 0 && ( <
                Box sx = {
                    {
                        mb: 4
                    }
                } >
                <
                Typography variant = "subtitle2"
                sx = {
                    {
                        mb: 1.5,
                        color: "warning.dark",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }
                } >
                <
                TableChartIcon fontSize = "small" / >
                Recorded Activity Delays <
                /Typography> <
                Grid container spacing = {
                    2
                } > {
                    relevantDelays.map((delay) => {
                        const causeText =
                            delay.cause_name ||
                            delay.delay_cause_display ||
                            delay.delay_cause ||
                            "Unspecified Delay";
                        const descText = delay.description || "";
                        const impactDays =
                            delay.delay_days ||
                            delay.working_delay_days ||
                            delay.starting_delay_days ||
                            0;

                        return ( <
                            Grid item xs = {
                                12
                            }
                            key = {
                                delay.id || Math.random()
                            } >
                            <
                            Paper variant = "outlined"
                            sx = {
                                {
                                    p: 2,
                                    borderLeft: "4px solid",
                                    borderColor: "warning.main",
                                    bgcolor: "#fffef2",
                                }
                            } >
                            <
                            Box sx = {
                                {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                }
                            } >
                            <
                            Box >
                            <
                            Typography variant = "body2"
                            sx = {
                                {
                                    fontWeight: 700,
                                    color: "warning.dark"
                                }
                            } >
                            {
                                causeText
                            } <
                            /Typography> <
                            Typography variant = "caption"
                            color = "text.secondary" >
                            Impact: < strong > {
                                impactDays
                            }
                            days < /strong> | Log
                            Date: {
                                " "
                            } {
                                delay.delay_log_date ?
                                    new Date(
                                        delay.delay_log_date,
                                    ).toLocaleDateString() :
                                    "-"
                            } <
                            /Typography> {
                                descText && ( <
                                    Typography variant = "body2"
                                    sx = {
                                        {
                                            mt: 1,
                                            fontStyle: "italic",
                                            color: "text.primary",
                                        }
                                    } >
                                    "{descText}" <
                                    /Typography>
                                )
                            } <
                            /Box> <
                            Chip label = {
                                `${impactDays}d Delay`
                            }
                            size = "small"
                            color = "warning"
                            variant = "outlined"
                            sx = {
                                {
                                    fontWeight: "bold"
                                }
                            }
                            /> <
                            /Box> <
                            /Paper> <
                            /Grid>
                        );
                    })
                } <
                /Grid> <
                /Box>
            )
        }

        { /* --- SECTION 1: GLOBAL DOCUMENTS --- */ } {
            uniqueAttachments.length > 0 && ( <
                Paper sx = {
                    {
                        p: 2,
                        mb: 4,
                        borderLeft: "5px solid #1976d2",
                        bgcolor: "#fff",
                    }
                } >
                <
                Typography variant = "subtitle2"
                sx = {
                    {
                        fontWeight: 700,
                        mb: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }
                } >
                <
                DescriptionIcon fontSize = "small"
                color = "primary" / >
                Master Activity Documents & Certificates <
                /Typography> {
                    renderFiles(uniqueAttachments)
                } <
                /Paper>
            )
        } { /* --- SECTION 2: DAILY RECORDS --- */ } <
        Typography variant = "subtitle2"
        sx = {
            {
                mb: 2,
                color: "text.secondary",
                fontWeight: 600
            }
        } >
        Daily Progress History <
        /Typography>

        {
            records.map((record, index) => ( <
                Paper key = {
                    record.id || index
                }
                sx = {
                    {
                        mb: 3,
                        p: 3,
                        position: "relative",
                        border: "1px solid",
                        borderColor: record.status === "Approved" ? "success.light" : "divider",
                    }
                } >
                <
                Box sx = {
                    {
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "flex",
                        gap: 1,
                    }
                } >
                {
                    record.status === "Approved" ? ( <
                        Chip label = "APPROVED"
                        size = "small"
                        icon = { < DoneAllIcon / >
                        }
                        color = "success" /
                        >
                    ) : editingId === record.id ? ( <
                        >
                        <
                        Button variant = "contained"
                        size = "small"
                        color = "success"
                        onClick = {
                            () => handleSave(record.id)
                        }
                        startIcon = { < SaveIcon / >
                        } >
                        Save <
                        /Button> <
                        Button variant = "outlined"
                        size = "small"
                        onClick = {
                            () => setEditingId(null)
                        } >
                        Cancel <
                        /Button> <
                        />
                    ) : ( <
                        IconButton size = "small"
                        onClick = {
                            () => handleEdit(record)
                        }
                        color = "primary"
                        sx = {
                            {
                                border: "1px solid"
                            }
                        } >
                        <
                        EditIcon size = {
                            16
                        }
                        /> <
                        /IconButton>
                    )
                } <
                /Box> <
                Grid container spacing = {
                    3
                } > {
                    columns
                    .filter((col) => col.type !== "view" && col.type !== "status")
                    .map((col) => ( <
                        Grid item xs = {
                            12
                        }
                        sm = {
                            1.5
                        }
                        md = {
                            3
                        }
                        key = {
                            col.key
                        } >
                        <
                        Typography variant = "caption"
                        color = "textSecondary"
                        sx = {
                            {
                                display: "block",
                                mb: 0.5
                            }
                        } >
                        {
                            col.label
                        } <
                        /Typography> {
                            editingId === record.id ? ( <
                                TextField fullWidth size = "small"
                                value = {
                                    tempData[col.key] || ""
                                }
                                disabled = {
                                    col.editable === false
                                }
                                onChange = {
                                    (e) =>
                                    setTempData({
                                        ...tempData,
                                        [col.key]: e.target.value,
                                    })
                                }
                                />
                            ) : ( <
                                Typography variant = "body2"
                                sx = {
                                    {
                                        fontWeight: 500
                                    }
                                } > {
                                    typeof record[col.key] === "boolean" ?
                                    record[col.key] ?
                                    "Yes" :
                                    "No" :
                                        (record[col.key] ? ? "-")
                                } <
                                /Typography>
                            )
                        } <
                        /Grid>
                    ))
                } <
                /Grid> {
                    record.evidence_photo && ( <
                        Box sx = {
                            {
                                mt: 3,
                                pt: 2,
                                borderTop: "1px dashed #ddd"
                            }
                        } >
                        <
                        Typography variant = "caption"
                        sx = {
                            {
                                fontWeight: 700,
                                color: "text.secondary",
                                display: "block",
                                mb: 1,
                            }
                        } >
                        Daily Evidence Photo:
                        <
                        /Typography> {
                            renderFiles(record)
                        } <
                        /Box>
                    )
                } <
                /Paper>
            ))
        } <
        /Box> <
        /DialogContent> <
        /Dialog>
    );
}
export default GroupedRecordViewer;