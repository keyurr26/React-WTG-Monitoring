import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    useDispatch
} from "react-redux";
import {
    Box,
    Typography,
    Chip,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    Button,
    Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import {
    exportCommentsToExcel
} from "./DownloadEx/DownloadCM";
// CONSTANTS

const SEVERITY_CONFIG = {
    critical: {
        bg: "#fef2f2",
        color: "#b91c1c",
        border: "#fca5a5"
    },
    major: {
        bg: "#fff7ed",
        color: "#c2410c",
        border: "#fdba74"
    },
    minor: {
        bg: "#fefce8",
        color: "#a16207",
        border: "#fde047"
    },
};

const STATUS_CONFIG = {
    open: {
        bg: "#eff6ff",
        color: "#1d4ed8",
        border: "#93c5fd"
    },
    closed: {
        bg: "#f0fdf4",
        color: "#15803d",
        border: "#86efac"
    },
};

const ROW_HEIGHT = 68;
// const OVERSCAN   = 8;

// HELPERS
const getSeverity = (s = "") => SEVERITY_CONFIG[s] || {
    bg: "#f8fafc",
    color: "#475569",
    border: "#cbd5e1"
};
const getStatusStyle = (s = "") => STATUS_CONFIG[s] || {
    bg: "#f8fafc",
    color: "#475569",
    border: "#cbd5e1"
};

const fmtDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

// GRID  — 13 columns, all visible, no overflow needed on normal screens
const GRID =
    "48px 60px 80px 100px 90px 90px " +
    "250px " + // Reviewer Comment
    "250px " + // Proposed Solution
    "250px " + // PM Response
    "250px " + // Vendor Response
    "90px 90px 130px 130px";

const HEADERS = [{
        label: "#",
        tip: "Comment number"
    },
    {
        label: "Rev",
        tip: "Revision when raised"
    },
    {
        label: "Page",
        tip: "Sheet / page number"
    },
    {
        label: "Section",
        tip: "Grid or section reference"
    },
    {
        label: "Type",
        tip: "Comment type"
    },
    {
        label: "Severity",
        tip: "Critical / Major / Minor"
    },
    {
        label: "Reviewer Comment",
        tip: "Issue raised by reviewer"
    },
    {
        label: "Proposed Solution",
        tip: "Fix proposed by reviewer"
    },
    {
        label: "PM Response",
        tip: "Response from Admin / PM"
    },
    {
        label: "Vendor Response",
        tip: "Supplier reply"
    },
    {
        label: "Action",
        tip: "Incorporated / Pending etc."
    },
    {
        label: "Status",
        tip: "Open or Closed"
    },
    {
        label: "Created By",
        tip: "User who raised comment"
    },
    {
        label: "Closed By",
        tip: "Who closed and when"
    },
];

// CELL  — shared cell wrapper

const Cell = ({
    children,
    sx = {}
}) => ( <
    Box sx = {
        {
            px: 1.2,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            minWidth: 0, // IMPORTANT
            maxWidth: "100%", // IMPORTANT
            borderRight: "0.5px solid #f1f5f9",
            ...sx,
        }
    } >
    {
        children
    } <
    /Box>
);

// Short text clamped to 2 lines with tooltip for full text
const CellText = ({
    text,
    fallback = "—",
    color = "#334155"
}) => ( <
    Tooltip title = {
        text || ""
    }
    placement = "top-start"
    disableHoverListener = {!text || text.length < 55
    } >
    <
    Typography sx = {
        {
            fontSize: "0.72rem",
            color: text ? color : "#cbd5e1",
            lineHeight: 1.4,

            maxHeight: "50px",
            overflowY: "auto",

            overflowWrap: "anywhere",
            wordBreak: "break-word",
        }
    } >
    {
        text || fallback
    } <
    /Typography> <
    /Tooltip>
);

// SINGLE ROW
const CommentRow = React.memo(({
    comment,
    isHovered,
    onEnter,
    onLeave,
    style
}) => {
    const sev = getSeverity(comment.severity);
    const status = getStatusStyle(comment.status);
    const isClosed = comment.status === "closed";

    return ( <
        Box style = {
            style
        }
        onMouseEnter = {
            onEnter
        }
        onMouseLeave = {
            onLeave
        }
        sx = {
            {
                // position: "absolute",
                // left: 0,
                // right: 0,
                position: style ? .position || "absolute",
                left: style ? .position === "relative" ? "unset" : 0,
                right: style ? .position === "relative" ? "unset" : 0,
                height: ROW_HEIGHT,
                display: "grid",
                gridTemplateColumns: GRID,
                minWidth: "fit-content",
                borderBottom: "0.5px solid",
                borderColor: "divider",
                bgcolor: isClosed ?
                    (isHovered ? "#f0fdf4" : "#fafffe") :
                    (isHovered ? "#f8fafc" : "background.paper"),
                transition: "background-color 0.1s",
                alignItems: "stretch",
            }
        } >
        { /* # */ } <
        Cell >
        <
        Typography sx = {
            {
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#64748b"
            }
        } > {
            comment.comment_no || "—"
        } <
        /Typography> <
        /Cell>

        { /* Revision */ } <
        Cell >
        <
        Chip label = {
            comment.document_version_number || (comment.revision_no ? `R${comment.revision_no}` : "—")
        }
        size = "small"
        sx = {
            {
                height: 18,
                fontSize: "0.62rem",
                fontWeight: 700,
                bgcolor: "#f5f3ff",
                color: "#6d28d9",
                border: "0.5px solid #c4b5fd",
            }
        }
        /> <
        /Cell>

        { /* Page */ } <
        Cell >
        <
        Typography sx = {
            {
                fontSize: "0.72rem",
                color: "#475569"
            }
        } > {
            comment.page_no || "—"
        } <
        /Typography> <
        /Cell>

        { /* Section */ } <
        Cell >
        <
        CellText text = {
            comment.section
        }
        /> <
        /Cell>

        { /* Type */ } <
        Cell >
        <
        Typography sx = {
            {
                fontSize: "0.68rem",
                fontWeight: 600,
                color: "#475569",
                textTransform: "capitalize",
            }
        } >
        {
            comment.comment_type || comment.type || "—"
        } <
        /Typography> <
        /Cell>

        { /* Severity */ } <
        Cell > {
            comment.severity ? ( <
                Chip label = {
                    comment.severity
                }
                size = "small"
                sx = {
                    {
                        height: 18,
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        bgcolor: sev.bg,
                        color: sev.color,
                        border: `0.5px solid ${sev.border}`,
                    }
                }
                />
            ) : ( <
                Typography sx = {
                    {
                        fontSize: "0.72rem",
                        color: "#cbd5e1"
                    }
                } > — < /Typography>
            )
        } <
        /Cell>

        { /* Reviewer Comment */ } <
        Cell >
        <
        CellText text = {
            comment.reviewer_comment
        }
        color = "#0f172a" / >
        <
        /Cell>

        { /* Proposed Solution */ } <
        Cell >
        <
        CellText text = {
            comment.proposed_solution
        }
        /> <
        /Cell>


        { /* PM Response */ } <
        Cell > {
            comment.pm_response ? ( <
                CellText text = {
                    comment.pm_response
                }
                color = "#7c3aed" /
                >
            ) : ( <
                Typography sx = {
                    {
                        fontSize: "0.69rem",
                        color: "#94a3b8",
                        fontStyle: "italic",
                    }
                } >
                No Response <
                /Typography>
            )
        } <
        /Cell>

        { /* Vendor Response */ } <
        Cell > {
            comment.vendor_response ? ( <
                CellText text = {
                    comment.vendor_response
                }
                color = "#0369a1" / >
            ) : ( <
                Typography sx = {
                    {
                        fontSize: "0.69rem",
                        color: "#94a3b8",
                        fontStyle: "italic"
                    }
                } >
                Awaiting <
                /Typography>
            )
        } <
        /Cell>

        { /* Action Status */ } <
        Cell >
        <
        Typography sx = {
            {
                fontSize: "0.68rem",
                fontWeight: 500,
                color: "#475569",
                textTransform: "capitalize",
            }
        } >
        {
            comment.action_status || "—"
        } <
        /Typography> <
        /Cell>

        { /* Status */ } <
        Cell >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                gap: 0.5
            }
        } > {
            isClosed ?
            < LockOutlinedIcon sx = {
                {
                    fontSize: 11,
                    color: "#15803d"
                }
            }
            /> :
                < LockOpenOutlinedIcon sx = {
                {
                    fontSize: 11,
                    color: "#1d4ed8"
                }
            }
            />
        } <
        Chip label = {
            comment.status || "—"
        }
        size = "small"
        sx = {
            {
                height: 18,
                fontSize: "0.62rem",
                fontWeight: 700,
                textTransform: "capitalize",
                bgcolor: status.bg,
                color: status.color,
                border: `0.5px solid ${status.border}`,
            }
        }
        /> <
        /Box> <
        /Cell>


        { /* Created By */ } <
        Cell sx = {
            {
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
            }
        } >
        <
        Typography sx = {
            {
                fontSize: "0.70rem",
                fontWeight: 600,
                color: "#0f172a",
                lineHeight: 1.3,
            }
        } >
        {
            comment.created_by_name ||
            comment.created_by_username ||
            comment.created_by ||
            "—"
        } <
        /Typography>

        <
        Typography sx = {
            {
                fontSize: "0.63rem",
                color: "#94a3b8",
            }
        } >
        {
            fmtDate(comment.created_at)
        } <
        /Typography> <
        /Cell>

        { /* Closed By */ } <
        Cell sx = {
            {
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 0
            }
        } > {
            isClosed ? ( <
                >
                <
                Typography sx = {
                    {
                        fontSize: "0.70rem",
                        fontWeight: 600,
                        color: "#15803d",
                        lineHeight: 1.3
                    }
                } > {
                    comment.closed_by_name || comment.closed_by || "—"
                } <
                /Typography> <
                Typography sx = {
                    {
                        fontSize: "0.63rem",
                        color: "#94a3b8"
                    }
                } > {
                    fmtDate(comment.closed_at)
                } <
                /Typography> <
                />
            ) : ( <
                Typography sx = {
                    {
                        fontSize: "0.68rem",
                        color: "#cbd5e1",
                        fontStyle: "italic"
                    }
                } > — < /Typography>
            )
        } <
        /Cell> <
        /Box>
    );
});


const CommentGroupedList = ({
    revisionGroups
}) => {
    const [hovered, setHovered] = useState(null);

    return ( <
        Box sx = {
            {
                flex: 1,
                overflowX: "auto",
                overflowY: "auto",
                maxWidth: "100%",
            }
        } >
        { /* Sticky Header */ } <
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
                } >
                <
                Box sx = {
                    {
                        px: 1.2,
                        py: 1
                    }
                } >
                <
                Typography sx = {
                    {
                        fontSize: "0.59rem",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
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

        {
            Object.entries(revisionGroups).map(
                ([revisionKey, revisionComments]) => ( <
                    React.Fragment key = {
                        revisionKey
                    } > { /* Revision Divider */ } <
                    Box sx = {
                        {
                            display: "grid",
                            gridTemplateColumns: GRID,
                            minWidth: "fit-content",
                            bgcolor: "#f1f5f9",
                            borderBottom: "0.5px solid",
                            borderTop: "0.5px solid",
                            borderColor: "divider",
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
                    />

                    <
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
                        revisionKey
                    }— {
                        " "
                    } {
                        revisionComments.length
                    }
                    Comment {
                        revisionComments.length !== 1 ? "s" : ""
                    } <
                    /Typography> <
                    /Box> <
                    /Box>

                    { /* Comments */ } {
                        revisionComments.map((comment, index) => ( <
                            CommentRow key = {
                                comment.id || index
                            }
                            comment = {
                                comment
                            }
                            isHovered = {
                                hovered === comment.id
                            }
                            onEnter = {
                                () => setHovered(comment.id)
                            }
                            onLeave = {
                                () => setHovered(null)
                            }
                            style = {
                                {
                                    position: "relative",
                                    top: "unset",
                                }
                            }
                            />
                        ))
                    } <
                    /React.Fragment>
                )
            )
        }

        {
            Object.keys(revisionGroups).length === 0 && ( <
                Box sx = {
                    {
                        py: 7,
                        textAlign: "center"
                    }
                } >
                <
                Typography sx = {
                    {
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                    }
                } >
                No comments found <
                /Typography> <
                /Box>
            )
        } <
        /Box>
    );
};


// MAIN COMPONENT
const CommentSheet = ({
    doc,
    fetchComments, // optional redux thunk(docId, versionId) → array
}) => {

    // console.log("fetchComments",fetchComments)

    const dispatch = useDispatch();

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [severity, setSeverity] = useState("");
    const [status, setStatus] = useState("");
    const [revision, setRevision] = useState("");

    // ── Load ──

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (!doc ? .id) {
            setComments(Array.isArray(doc ? .comments) ? doc.comments : []);
            return;
        }

        const load = async () => {
            try {
                setLoading(true);
                if (fetchComments) {
                    const res = await dispatch(fetchComments(doc.id, doc.current_version_id));

                    const data = Array.isArray(res) ?
                        res :
                        res ? .results || res ? .data ? .results || res ? .data || [];

                    setComments(Array.isArray(data) ? data : []);
                } else {
                    setComments(Array.isArray(doc ? .comments) ? doc.comments : []);
                }
            } catch {
                setComments([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [doc ? .id, doc ? .current_version_id, fetchComments]); // ← add current_version_id to deps
    /* eslint-enable react-hooks/exhaustive-deps */


    // ── Revision options ──
    const revisionOptions = useMemo(() => [...new Set(
        comments
        .map((c) => c.document_version_number || (c.revision_no ? `R${c.revision_no}` : null))
        .filter(Boolean)
    )], [comments]);

    // ── Filtered list ──
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return comments.filter((c) => {
            if (severity && c.severity !== severity) return false;
            if (status && c.status !== status) return false;
            if (revision) {
                const rev = c.document_version_number || (c.revision_no ? `R${c.revision_no}` : "");
                if (rev !== revision) return false;
            }
            if (q) {
                const hay = [
                    c.reviewer_comment,
                    c.proposed_solution,
                    c.pm_response,
                    c.vendor_response,
                    c.section,
                    c.comment_type,
                    c.page_no,
                ].join(" ").toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [comments, search, severity, status, revision]);


    const revisionGroups = useMemo(() => {
        return filtered.reduce((acc, comment) => {
            const revision =
                comment.document_version_number ||
                (comment.revision_no ? `R${comment.revision_no}` : "Unknown");

            if (!acc[revision]) {
                acc[revision] = [];
            }

            acc[revision].push(comment);

            return acc;
        }, {});
    }, [filtered]);

    // ── Stats ──
    const stats = useMemo(() => ({
        total: comments.length,
        open: comments.filter((c) => c.status === "open").length,
        closed: comments.filter((c) => c.status === "closed").length,
        critical: comments.filter((c) => c.severity === "critical").length,
        major: comments.filter((c) => c.severity === "major").length,
        minor: comments.filter((c) => c.severity === "minor").length,
    }), [comments]);

    const activeFilters = [search, severity, status, revision].some(Boolean);

    return ( <
        Box sx = {
            {
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 520,
            }
        } >
        { /* ── Header ── */ } <
        Box sx = {
            {
                px: 2,
                py: 1.2,
                borderBottom: "0.5px solid",
                borderColor: "divider",
                bgcolor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
            }
        } >
        <
        Box >
        <
        Typography sx = {
            {
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#0f172a"
            }
        } >
        Review Comments <
        /Typography> {
            doc ? .title && ( <
                Typography sx = {
                    {
                        fontSize: "0.68rem",
                        color: "#94a3b8",
                        mt: 0.2
                    }
                } > {
                    doc.title
                } {
                    doc.document_version_number ? ` · ${doc.document_version_number}` : ""
                } <
                /Typography>
            )
        } <
        /Box>

        { /* Stats pills */ } <
        Box sx = {
            {
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center"
            }
        } > {
            [{
                    label: `${stats.total} Total`,
                    bg: "#f1f5f9",
                    color: "#475569"
                },
                {
                    label: `${stats.open} Open`,
                    bg: "#eff6ff",
                    color: "#1d4ed8"
                },
                {
                    label: `${stats.closed} Closed`,
                    bg: "#f0fdf4",
                    color: "#15803d"
                },
                {
                    label: `${stats.critical} Critical`,
                    bg: "#fef2f2",
                    color: "#b91c1c"
                },
                {
                    label: `${stats.major} Major`,
                    bg: "#fff7ed",
                    color: "#c2410c"
                },
                {
                    label: `${stats.minor} Minor`,
                    bg: "#fefce8",
                    color: "#a16207"
                },
            ].map(({
                label,
                bg,
                color
            }) => ( <
                Chip key = {
                    label
                }
                label = {
                    label
                }
                size = "small"
                sx = {
                    {
                        height: 20,
                        fontSize: "0.63rem",
                        fontWeight: 700,
                        bgcolor: bg,
                        color
                    }
                }
                />
            ))
        } <
        /Box> <
        /Box>

        { /* ── Filters ── */ } <
        Box sx = {
            {
                px: 1.5,
                py: 1,
                borderBottom: "0.5px solid",
                borderColor: "divider",
                bgcolor: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                flexWrap: "wrap",
            }
        } >
        { /* Search */ } <
        TextField size = "small"
        placeholder = "Search comments, sections, responses…"
        value = {
            search
        }
        onChange = {
            (e) => setSearch(e.target.value)
        }
        InputProps = {
            {
                startAdornment: ( <
                    InputAdornment position = "start" >
                    <
                    SearchIcon sx = {
                        {
                            fontSize: 14,
                            color: "#94a3b8"
                        }
                    }
                    /> <
                    /InputAdornment>
                ),
                sx: {
                    fontSize: "0.74rem",
                    height: 32
                },
            }
        }
        sx = {
            {
                width: 260
            }
        }
        />

        { /* Revision */ } <
        FormControl size = "small"
        sx = {
            {
                minWidth: 110
            }
        } >
        <
        Select value = {
            revision
        }
        onChange = {
            (e) => setRevision(e.target.value)
        }
        displayEmpty sx = {
            {
                fontSize: "0.72rem",
                height: 32
            }
        } >
        <
        MenuItem value = "" > < em > All Revisions < /em></MenuItem > {
            revisionOptions.map((r) => ( <
                MenuItem key = {
                    r
                }
                value = {
                    r
                }
                sx = {
                    {
                        fontSize: "0.72rem"
                    }
                } > {
                    r
                } < /MenuItem>
            ))
        } <
        /Select> <
        /FormControl>

        { /* Severity */ } <
        FormControl size = "small"
        sx = {
            {
                minWidth: 110
            }
        } >
        <
        Select value = {
            severity
        }
        onChange = {
            (e) => setSeverity(e.target.value)
        }
        displayEmpty sx = {
            {
                fontSize: "0.72rem",
                height: 32
            }
        } >
        <
        MenuItem value = "" > < em > All Severities < /em></MenuItem > {
            ["critical", "major", "minor"].map((s) => ( <
                MenuItem key = {
                    s
                }
                value = {
                    s
                }
                sx = {
                    {
                        fontSize: "0.72rem",
                        textTransform: "capitalize"
                    }
                } > {
                    s
                } < /MenuItem>
            ))
        } <
        /Select> <
        /FormControl>

        { /* Status */ } <
        FormControl size = "small"
        sx = {
            {
                minWidth: 100
            }
        } >
        <
        Select value = {
            status
        }
        onChange = {
            (e) => setStatus(e.target.value)
        }
        displayEmpty sx = {
            {
                fontSize: "0.72rem",
                height: 32
            }
        } >
        <
        MenuItem value = "" > < em > All Statuses < /em></MenuItem > {
            ["open", "closed"].map((s) => ( <
                MenuItem key = {
                    s
                }
                value = {
                    s
                }
                sx = {
                    {
                        fontSize: "0.72rem",
                        textTransform: "capitalize"
                    }
                } > {
                    s
                } < /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        Button variant = "contained"
        size = "small"
        onClick = {
            () => exportCommentsToExcel(comments)
        }
        sx = {
            {
                height: 32,
                fontSize: "0.72rem",
                textTransform: "none",
                ml: "auto",
            }
        } >
        Download Excel <
        /Button>

        { /* Clear filters */ } {
            activeFilters && ( <
                Typography onClick = {
                    () => {
                        setSearch("");
                        setSeverity("");
                        setStatus("");
                        setRevision("");
                    }
                }
                sx = {
                    {
                        fontSize: "0.69rem",
                        color: "#3b82f6",
                        cursor: "pointer",
                        fontWeight: 600,
                        "&:hover": {
                            textDecoration: "underline"
                        },
                        ml: 0.5,
                    }
                } >
                Clear filters <
                /Typography>
            )
        }

        { /* Filtered count */ } {
            activeFilters && ( <
                Typography sx = {
                    {
                        fontSize: "0.65rem",
                        color: "#94a3b8",
                        ml: "auto"
                    }
                } > {
                    filtered.length
                } of {
                    stats.total
                }
                comments <
                /Typography>
            )
        } <
        /Box>

        { /* ── Table ── */ } {
            loading ? ( <
                Box sx = {
                    {
                        py: 7,
                        textAlign: "center"
                    }
                } >
                <
                Typography sx = {
                    {
                        fontSize: "0.8rem",
                        color: "#94a3b8"
                    }
                } > Loading comments… < /Typography> <
                /Box>
            ) : ( <
                CommentGroupedList revisionGroups = {
                    revisionGroups
                }
                />

            )
        }

        { /* ── Footer ── */ } <
        Box sx = {
            {
                px: 2,
                py: 0.8,
                borderTop: "0.5px solid",
                borderColor: "divider",
                bgcolor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                gap: 1,
            }
        } >
        <
        Typography sx = {
            {
                fontSize: "0.63rem",
                color: "#94a3b8"
            }
        } > {
            filtered.length
        }
        comment {
            filtered.length !== 1 ? "s" : ""
        } {
            activeFilters ? ` shown (${stats.total} total)` : " total"
        } <
        /Typography>

        { /* Open vs closed bar */ } {
            stats.total > 0 && ( <
                Box sx = {
                    {
                        ml: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8
                    }
                } >
                <
                Typography sx = {
                    {
                        fontSize: "0.62rem",
                        color: "#94a3b8"
                    }
                } > {
                    Math.round((stats.closed / stats.total) * 100)
                } % resolved <
                /Typography> <
                Box sx = {
                    {
                        width: 80,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: "#e2e8f0",
                        overflow: "hidden",
                    }
                } >
                <
                Box sx = {
                    {
                        width: `${(stats.closed / stats.total) * 100}%`,
                        height: "100%",
                        bgcolor: "#15803d",
                        borderRadius: 2,
                        transition: "width 0.4s ease",
                    }
                }
                /> <
                /Box> <
                /Box>
            )
        } <
        /Box> <
        /Box>
    );
};

export default CommentSheet;