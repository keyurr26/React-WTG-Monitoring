import React from "react";
import {
    useDispatch
} from "react-redux";
import {
    Box,
    Typography,
    Chip,
    Tooltip
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const STEP_TYPE_LABELS = {
    supplier_submission: "Supplier Submission",
    pm_review: "PM Review",
    consultant_review: "Consultant Review",
    pm_response: "PM Response",
    supplier_revision_upload: "Revision Upload",
    final_approval: "Final Approval",
};

const ROLE_STYLES = {
    supplier: {
        bg: "#f0f9ff",
        color: "#0369a1",
        border: "#7dd3fc"
    },
    project_manager: {
        bg: "#faf5ff",
        color: "#7c3aed",
        border: "#c4b5fd"
    },
    consultant: {
        bg: "#fff7ed",
        color: "#c2410c",
        border: "#fdba74"
    },
    admin: {
        bg: "#f0fdf4",
        color: "#15803d",
        border: "#86efac"
    },
};

const STATUS_CONFIG = {
    completed: {
        label: "Completed",
        bg: "#f0fdf4",
        color: "#15803d",
        border: "#86efac",
        Icon: CheckCircleOutlineIcon,
    },
    pending: {
        label: "Pending",
        bg: "#fefce8",
        color: "#a16207",
        border: "#fde047",
        Icon: HourglassEmptyIcon,
    },
    rejected: {
        label: "Rejected",
        bg: "#fef2f2",
        color: "#b91c1c",
        border: "#fca5a5",
        Icon: ErrorOutlineIcon,
    },
    in_review: {
        label: "In Review",
        bg: "#eff6ff",
        color: "#1d4ed8",
        border: "#93c5fd",
        Icon: PendingOutlinedIcon,
    },
};

const DOC_STATUS_CONFIG = {
    approved: {
        label: "Approved",
        bg: "#f0fdf4",
        color: "#15803d",
        border: "#86efac"
    },
    rejected: {
        label: "Rejected",
        bg: "#fef2f2",
        color: "#b91c1c",
        border: "#fca5a5"
    },
    in_review: {
        label: "In Review",
        bg: "#eff6ff",
        color: "#1d4ed8",
        border: "#93c5fd"
    },
    pending_review: {
        label: "Pending Review",
        bg: "#fefce8",
        color: "#a16207",
        border: "#fde047"
    },
    action_required: {
        label: "Action Required",
        bg: "#fff7ed",
        color: "#c2410c",
        border: "#fdba74"
    },
    submitted: {
        label: "Submitted",
        bg: "#f5f3ff",
        color: "#6d28d9",
        border: "#c4b5fd"
    },
};

const APPROVAL_TYPE_CONFIG = {
    approve_overall: {
        label: "Approved",
        bg: "#f0fdf4",
        color: "#15803d",
        border: "#86efac",
    },
    conditional_approval: {
        label: "Conditional",
        bg: "#fff7ed",
        color: "#c2410c",
        border: "#fdba74",
    },
    technical_approval: {
        label: "Technical",
        bg: "#eff6ff",
        color: "#1d4ed8",
        border: "#93c5fd",
    },
    approved_for_estimate: {
        label: "Estimate",
        bg: "#faf5ff",
        color: "#7c3aed",
        border: "#c4b5fd",
    },
    reject: {
        label: "Rejected",
        bg: "#fef2f2",
        color: "#b91c1c",
        border: "#fca5a5",
    },
};

// ─── GRID LAYOUT ─────────────────────────────────────────────────────────────

const GRID = "56px 100px 160px 180px 160px 160px 180px minmax(200px,1fr)";

const HEADERS = [{
        label: "Step",
        tip: "Sequence number in the workflow"
    },
    {
        label: "Version",
        tip: "Document version / revision number"
    },
    {
        label: "Step Type",
        tip: "Type of action performed at this step"
    },
    {
        label: "Performed By",
        tip: "User who performed this action"
    },
    {
        label: "Role",
        tip: "Role of the performer"
    },
    {
        label: "Approval Type",
        tip: "Approval decision taken at this step"
    },
    {
        label: "Date & Time",
        tip: "When this action was performed"
    },
    {
        label: "Remarks",
        tip: "Notes added during this step"
    },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const getRoleStyle = (role = "") =>
    ROLE_STYLES[role] || {
        bg: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1"
    };

const getStatusConfig = (status = "") =>
    STATUS_CONFIG[status] || {
        label: status || "—",
        bg: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1",
        Icon: PendingOutlinedIcon,
    };

const getApprovalTypeConfig = (type = "") =>
    APPROVAL_TYPE_CONFIG[type] || {
        label: type || "—",
        bg: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1",
    };

const formatDate = (iso) => {
    if (!iso) return {
        date: "—",
        time: ""
    };
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }),
        time: d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }),
    };
};

// ─── STEP TYPE BADGE ─────────────────────────────────────────────────────────

const StepTypeBadge = ({
    stepType
}) => {
    const label = STEP_TYPE_LABELS[stepType] || stepType ? .replace(/_/g, " ") || "—";

    const colorMap = {
        supplier_submission: {
            bg: "#f0f9ff",
            color: "#0369a1"
        },
        pm_review: {
            bg: "#faf5ff",
            color: "#7c3aed"
        },
        consultant_review: {
            bg: "#fff7ed",
            color: "#c2410c"
        },
        supplier_response: {
            bg: "#fef9c3",
            color: "#854d0e"
        },
        supplier_revision_upload: {
            bg: "#f0fdf4",
            color: "#15803d"
        },
        final_approval: {
            bg: "#f0fdf4",
            color: "#15803d"
        },
    };

    const style = colorMap[stepType] || {
        bg: "#f8fafc",
        color: "#475569"
    };

    return ( <
        Box sx = {
            {
                display: "inline-flex",
                alignItems: "center",
                px: 1,
                py: 0.3,
                borderRadius: "4px",
                bgcolor: style.bg,
            }
        } >
        <
        Typography sx = {
            {
                fontSize: "0.68rem",
                fontWeight: 700,
                color: style.color,
                textTransform: "capitalize",
                letterSpacing: "0.2px",
            }
        } >
        {
            label
        } <
        /Typography> <
        /Box>
    );
};

// ─── DOCUMENT SUMMARY HEADER ─────────────────────────────────────────────────

const DocumentSummaryBar = ({
    doc
}) => {
    if (!doc) return null;

    const docStatus = DOC_STATUS_CONFIG[doc.status] || {
        label: doc.status || "—",
        bg: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1",
    };

    const fields = [{
            label: "Document",
            value: doc.title
        },
        {
            label: "Doc No.",
            value: doc.document_version_number
        },
        {
            label: "Version",
            value: `v${doc.version}`
        },
        {
            label: "Windfarm",
            value: doc.windfarm_name
        },
        {
            label: "Project",
            value: doc.project_name
        },
        {
            label: "Vendor",
            value: doc.vendor
        },
        {
            label: "Type",
            value: doc.document_type
        },
    ];

    return ( <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2.5,
                px: 2,
                py: 1.2,
                bgcolor: "#f8fafc",
                borderBottom: "0.5px solid",
                borderColor: "divider",
            }
        } >
        {
            fields.map(({
                    label,
                    value
                }) =>
                value ? ( <
                    Box key = {
                        label
                    } >
                    <
                    Typography sx = {
                        {
                            fontSize: "0.58rem",
                            fontWeight: 700,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }
                    } >
                    {
                        label
                    } <
                    /Typography> <
                    Typography sx = {
                        {
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#0f172a",
                            mt: 0.1
                        }
                    } > {
                        value
                    } <
                    /Typography> <
                    /Box>
                ) : null
            )
        }

        { /* Overall status */ } <
        Box sx = {
            {
                ml: "auto"
            }
        } >
        <
        Typography sx = {
            {
                fontSize: "0.58rem",
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 0.3
            }
        } >
        Status <
        /Typography> <
        Chip label = {
            docStatus.label
        }
        size = "small"
        sx = {
            {
                bgcolor: docStatus.bg,
                color: docStatus.color,
                border: `0.5px solid ${docStatus.border}`,
                fontSize: "0.68rem",
                fontWeight: 700,
                height: 20,
                textTransform: "capitalize",
            }
        }
        /> <
        /Box> <
        /Box>
    );
};

// ─── VERSION CHANGE INDICATOR ─────────────────────────────────────────────────

const VersionBadge = ({
    step,
    prevStep
}) => {
    const isNewVersion =
        prevStep && step.document_version_number !== prevStep.document_version_number;

    return ( <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                gap: 0.5
            }
        } >
        <
        Chip label = {
            `${step.document_version_number || "—"}`
        }
        size = "small"
        sx = {
            {
                bgcolor: isNewVersion ? "#faf5ff" : "#f1f5f9",
                color: isNewVersion ? "#7c3aed" : "#475569",
                border: `0.5px solid ${isNewVersion ? "#c4b5fd" : "#cbd5e1"}`,
                fontSize: "0.66rem",
                fontWeight: 700,
                height: 18,
            }
        }
        /> {
            isNewVersion && ( <
                Tooltip title = "New revision uploaded"
                placement = "top" >
                <
                Typography sx = {
                    {
                        fontSize: "0.6rem",
                        color: "#7c3aed",
                        fontWeight: 700
                    }
                } > ↑ < /Typography> <
                /Tooltip>
            )
        } <
        /Box>
    );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const ApprovalFlowTab = ({
    doc,
    fetchApprovalFlow
}) => {
    const [steps, setSteps] = React.useState([]);
    const [hovered, setHovered] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const dispatch = useDispatch();

    // ── Load steps ──

    /* eslint-disable react-hooks/exhaustive-deps */
    React.useEffect(() => {
        const load = async () => {
            try {
                if (!doc ? .id) {
                    // If no fetch function, use embedded approval_steps from doc object
                    if (doc ? .approval_steps ? .length) {
                        setSteps(doc.approval_steps);
                    } else {
                        setSteps([]);
                    }
                    return;
                }

                if (!fetchApprovalFlow) {
                    // Fallback: use approval_steps from the doc prop directly
                    setSteps(Array.isArray(doc ? .approval_steps) ? doc.approval_steps : []);
                    return;
                }

                setLoading(true);
                const response = await dispatch(fetchApprovalFlow(doc.id));

                const data =
                    response ? .data ? .results ||
                    response ? .data ||
                    response ? .results ||
                    response || [];

                setSteps(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Approval flow error:", err);
                // Graceful fallback to embedded steps
                setSteps(Array.isArray(doc ? .approval_steps) ? doc.approval_steps : []);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [doc ? .id, fetchApprovalFlow, dispatch]);
    /* eslint-enable react-hooks/exhaustive-deps */

    // ── Version groups: group steps by document_version_number ──
    const versionGroups = React.useMemo(() => {
        const groups = {};
        steps.forEach((step) => {
            const key = step.document_version_number || "—";
            if (!groups[key]) groups[key] = [];
            groups[key].push(step);
        });
        return groups;
    }, [steps]);

    const cellSx = {
        px: 1.5,
        py: 1,
        borderRight: "0.5px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
    };

    return ( <
        Box sx = {
            {
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: "8px",
                overflow: "hidden",
            }
        } >
        { /* ── Document summary bar ── */ } <
        DocumentSummaryBar doc = {
            doc
        }
        />

        <
        Box sx = {
            {
                overflow: "auto",
                maxHeight: 480,
                "&::-webkit-scrollbar": {
                    width: 6,
                    height: 6
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "#cbd5e1",
                    borderRadius: 10
                },
                "&::-webkit-scrollbar-track": {
                    background: "transparent"
                },
            }
        } >
        { /* ── Header ── */ } <
        Box sx = {
            {
                display: "grid",
                gridTemplateColumns: GRID,
                minWidth: "fit-content",
                bgcolor: "#f8fafc",
                borderBottom: "0.5px solid",
                borderColor: "divider",
                position: "sticky",
                top: 0,
                zIndex: 1,
            }
        } >
        {
            HEADERS.map((h) => ( <
                Tooltip key = {
                    h.label
                }
                title = {
                    h.tip
                }
                placement = "top" >
                <
                Box sx = {
                    {
                        px: 1.5,
                        py: 1
                    }
                } >
                <
                Typography sx = {
                    {
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        cursor: "default",
                    }
                } >
                {
                    h.label
                } <
                /Typography> <
                /Box> <
                /Tooltip>
            ))
        } <
        /Box>

        { /* ── Body ── */ } {
            loading ? ( <
                Box sx = {
                    {
                        py: 5,
                        textAlign: "center"
                    }
                } >
                <
                Typography sx = {
                    {
                        fontSize: "0.8rem",
                        color: "#94a3b8"
                    }
                } >
                Loading approval flow… <
                /Typography> <
                /Box>
            ) : steps.length === 0 ? ( <
                Box sx = {
                    {
                        py: 5,
                        textAlign: "center"
                    }
                } >
                <
                Typography sx = {
                    {
                        fontSize: "0.8rem",
                        color: "#94a3b8"
                    }
                } >
                No approval flow found <
                /Typography> <
                /Box>
            ) : ( <
                > {
                    Object.entries(versionGroups).map(([versionKey, versionSteps]) => ( <
                        React.Fragment key = {
                            versionKey
                        } > { /* Version group divider */ } <
                        Box sx = {
                            {
                                display: "grid",
                                gridTemplateColumns: GRID,
                                minWidth: "fit-content",
                                bgcolor: "#f1f5f9",
                                borderBottom: "0.5px solid",
                                borderTop: "0.5px solid",
                                borderColor: "divider",
                                // px: 1.5,
                                py: 0.5,
                            }
                        } >
                        <
                        Box sx = {
                            {
                                gridColumn: "1 / -1",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                px: 1.5,
                            }
                        } >
                        <
                        Box sx = {
                            {
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: "#7c3aed",
                                flexShrink: 0,
                            }
                        }
                        /> <
                        Typography sx = {
                            {
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: "#475569",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            }
                        } >
                        Revision {
                            versionKey
                        }— {
                            versionSteps.length
                        }
                        step {
                            versionSteps.length !== 1 ? "s" : ""
                        } <
                        /Typography> <
                        /Box> <
                        /Box>

                        { /* Steps within this version */ } {
                            versionSteps.map((step, i) => {
                                const globalIndex = steps.indexOf(step);
                                const prevStep = globalIndex > 0 ? steps[globalIndex - 1] : null;
                                const statusCfg = getStatusConfig(step.status);
                                const StatusIcon = statusCfg.Icon;
                                const roleStyle = getRoleStyle(step.role);
                                const approvalCfg = getApprovalTypeConfig(step.approval_type || step.document_approval_type);
                                const {
                                    date,
                                    time
                                } = formatDate(step.action_date || step.created_at);
                                const isLast = i === versionSteps.length - 1;

                                return ( <
                                    Box key = {
                                        step.id || i
                                    }
                                    onMouseEnter = {
                                        () => setHovered(step.id)
                                    }
                                    onMouseLeave = {
                                        () => setHovered(null)
                                    }
                                    sx = {
                                        {
                                            display: "grid",
                                            gridTemplateColumns: GRID,
                                            minWidth: "fit-content",
                                            minHeight: 56,
                                            borderBottom: !isLast ? "0.5px solid" : "none",
                                            borderColor: "divider",
                                            bgcolor: hovered === step.id ? "#f8fafc" : "background.paper",
                                            alignItems: "stretch",
                                            transition: "background-color 0.12s ease",
                                        }
                                    } >
                                    { /* STEP number */ } <
                                    Box sx = {
                                        cellSx
                                    } >
                                    <
                                    Box sx = {
                                        {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5
                                        }
                                    } >
                                    <
                                    Box sx = {
                                        {
                                            width: 22,
                                            height: 22,
                                            borderRadius: "50%",
                                            bgcolor: "#e2e8f0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }
                                    } >
                                    <
                                    Typography sx = {
                                        {
                                            fontSize: "0.62rem",
                                            fontWeight: 700,
                                            color: "#475569"
                                        }
                                    } > {
                                        step.sequence || globalIndex + 1
                                    } <
                                    /Typography> <
                                    /Box> <
                                    /Box> <
                                    /Box>

                                    { /* VERSION */ } <
                                    Box sx = {
                                        { ...cellSx
                                        }
                                    } >
                                    <
                                    VersionBadge step = {
                                        step
                                    }
                                    prevStep = {
                                        prevStep
                                    }
                                    /> <
                                    /Box>

                                    { /* STEP TYPE */ } <
                                    Box sx = {
                                        cellSx
                                    } >
                                    <
                                    StepTypeBadge stepType = {
                                        step.step_type
                                    }
                                    /> <
                                    /Box>

                                    { /* PERFORMED BY + STATUS inline */ } <
                                    Box sx = {
                                        { ...cellSx,
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            justifyContent: "center",
                                            gap: 0.4
                                        }
                                    } >
                                    <
                                    Typography sx = {
                                        {
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "#0f172a",
                                            lineHeight: 1.2
                                        }
                                    } > {
                                        step.performed_by_name || "—"
                                    } <
                                    /Typography> { /* Status shown under name for compact layout */ } <
                                    Box sx = {
                                        {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.4
                                        }
                                    } >
                                    <
                                    StatusIcon sx = {
                                        {
                                            fontSize: 11,
                                            color: statusCfg.color
                                        }
                                    }
                                    /> <
                                    Typography sx = {
                                        {
                                            fontSize: "0.62rem",
                                            fontWeight: 700,
                                            color: statusCfg.color,
                                            textTransform: "capitalize"
                                        }
                                    } > {
                                        statusCfg.label
                                    } <
                                    /Typography> <
                                    /Box> <
                                    /Box>

                                    { /* ROLE */ } <
                                    Box sx = {
                                        cellSx
                                    } >
                                    <
                                    Chip label = {
                                        step.role ? .replace(/_/g, " ") || "—"
                                    }
                                    size = "small"
                                    sx = {
                                        {
                                            bgcolor: roleStyle.bg,
                                            color: roleStyle.color,
                                            border: `0.5px solid ${roleStyle.border}`,
                                            fontSize: "0.64rem",
                                            fontWeight: 700,
                                            height: 18,
                                            textTransform: "capitalize",
                                        }
                                    }
                                    /> <
                                    /Box>


                                    { /* APPROVAL TYPE */ } <
                                    Box sx = {
                                        cellSx
                                    } > {
                                        step.approval_type ? ( <
                                            Chip label = {
                                                approvalCfg.label
                                            }
                                            size = "small"
                                            sx = {
                                                {
                                                    bgcolor: approvalCfg.bg,
                                                    color: approvalCfg.color,
                                                    border: `0.5px solid ${approvalCfg.border}`,
                                                    fontSize: "0.64rem",
                                                    fontWeight: 700,
                                                    height: 18,
                                                    textTransform: "capitalize",
                                                }
                                            }
                                            />
                                        ) : ( <
                                            Typography sx = {
                                                {
                                                    fontSize: "0.68rem",
                                                    color: "#cbd5e1",
                                                    fontStyle: "italic",
                                                }
                                            } >
                                            —
                                            <
                                            /Typography>
                                        )
                                    } <
                                    /Box>

                                    { /* DATE & TIME */ } <
                                    Box sx = {
                                        { ...cellSx,
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            justifyContent: "center"
                                        }
                                    } >
                                    <
                                    Typography sx = {
                                        {
                                            fontSize: "0.72rem",
                                            color: "#0f172a",
                                            fontWeight: 500,
                                            lineHeight: 1.3
                                        }
                                    } > {
                                        date
                                    } <
                                    /Typography> {
                                        time && ( <
                                            Typography sx = {
                                                {
                                                    fontSize: "0.65rem",
                                                    color: "#94a3b8",
                                                    mt: 0.2
                                                }
                                            } > {
                                                time
                                            } <
                                            /Typography>
                                        )
                                    } <
                                    /Box>

                                    { /* REMARKS */ } <
                                    Box sx = {
                                        { ...cellSx,
                                            minWidth: 0
                                        }
                                    } >
                                    <
                                    Tooltip title = {
                                        step.remarks || ""
                                    }
                                    placement = "top-start"
                                    disableHoverListener = {!step.remarks
                                    } >
                                    <
                                    Typography sx = {
                                        {
                                            fontSize: "0.72rem",
                                            color: step.remarks ? "#334155" : "#cbd5e1",
                                            lineHeight: 1.5,
                                            wordBreak: "break-word",
                                            overflowWrap: "anywhere",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            fontStyle: step.remarks ? "normal" : "italic",
                                        }
                                    } >
                                    {
                                        step.remarks || "No remarks"
                                    } <
                                    /Typography> <
                                    /Tooltip> <
                                    /Box> <
                                    /Box>
                                );
                            })
                        } <
                        /React.Fragment>
                    ))
                } <
                />
            )
        } <
        /Box>

        { /* ── Footer ── */ } {
            steps.length > 0 && ( <
                Box sx = {
                    {
                        px: 2,
                        py: 0.8,
                        borderTop: "0.5px solid",
                        borderColor: "divider",
                        bgcolor: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        minWidth: "fit-content",
                    }
                } >
                <
                Typography sx = {
                    {
                        fontSize: "0.65rem",
                        color: "#94a3b8"
                    }
                } > {
                    steps.length
                }
                step {
                    steps.length !== 1 ? "s" : ""
                } <
                /Typography>

                { /* Version summary pills */ } <
                Box sx = {
                    {
                        display: "flex",
                        gap: 0.5,
                        flexWrap: "wrap"
                    }
                } > {
                    Object.entries(versionGroups).map(([ver, vSteps]) => {
                        const allDone = vSteps.every((s) => s.status === "completed");
                        return ( <
                            Chip key = {
                                ver
                            }
                            label = {
                                `${ver} · ${vSteps.length}`
                            }
                            size = "small"
                            sx = {
                                {
                                    height: 16,
                                    fontSize: "0.58rem",
                                    fontWeight: 700,
                                    bgcolor: allDone ? "#f0fdf4" : "#fefce8",
                                    color: allDone ? "#15803d" : "#a16207",
                                    border: `0.5px solid ${allDone ? "#86efac" : "#fde047"}`,
                                }
                            }
                            />
                        );
                    })
                } <
                /Box> <
                /Box>
            )
        } <
        /Box>
    );
};

export default ApprovalFlowTab;