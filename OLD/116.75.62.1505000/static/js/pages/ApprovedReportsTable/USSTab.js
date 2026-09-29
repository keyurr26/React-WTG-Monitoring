import React, {
    useEffect,
    useState,
    useMemo
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetUSSMasterData,
    PatchUssMasterData,
} from "../../Redux/MasterData/masterAction";

import {
    GetSQRecords
} from "../../Redux/SafetyQualityData/SafetyQualityAction";
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    Chip,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    LinearProgress,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    useTheme,
    alpha,
    TableSortLabel,
    TablePagination,
} from "@mui/material";
import {
    Pending as PendingIcon,
    Close as CloseIcon,
    Visibility as VisibilityIcon,
    CalendarToday as CalendarIcon,
    Verified as VerifiedIcon,
    AssignmentTurnedIn as AssignmentIcon,
    Refresh as RefreshIcon,
    Info as InfoIcon,
    Schedule as ScheduleIcon,
    OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import {
    refreshNotifications
} from "../../Redux/DashboardData/dashboardAction";

// ─── Helper Functions ─────────────────────────────────────────────────────────
const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getUSSStatus = (uss) => {
    if (uss.approved_at)
        return {
            label: "Approved",
            color: "success",
            icon: < VerifiedIcon / >
        };
    if (uss.submitted_at)
        return {
            label: "Pending",
            color: "warning",
            icon: < PendingIcon / >
        };
    return {
        label: "Draft",
        color: "default",
        icon: < AssignmentIcon / >
    };
};

// ─── Photo Preview in New Tab ───────────────────────────────────────────────
const openPhotoInNewTab = (photoUrl, title) => {
    const newWindow = window.open();
    newWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #000; }
          img { max-width: 100%; max-height: 100vh; object-fit: contain; }
          .close-btn { position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.7); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 16px; font-family: Arial, sans-serif; z-index: 1000; }
          .close-btn:hover { background: rgba(0,0,0,0.9); }
        </style>
      </head>
      <body>
        <button class="close-btn" onclick="window.close()">Close ✕</button>
        <img src="${photoUrl}" alt="${title}" />
      </body>
    </html>
  `);
    newWindow.document.close();
};

// ─── Activity Details Dialog with Approve Button ─────────────────────────────
const ActivityDetailsDialog = ({
        open,
        onClose,
        activities,
        ussInfo,
        sqlist,

        onApproveUSS,
        actionLoading,
    }) => {
        const theme = useTheme();
        const [confirmOpen, setConfirmOpen] = useState(false);

        const totalActivities = activities.length;
        const isAlreadyApproved = ussInfo ? .approved_at;

        //filter sqrecord

        const sqRecords = useMemo(() => {
            return (sqlist || []).filter(
                (item) =>
                item.category === "uss" && Number(item.uss) === Number(ussInfo ? .id),
            );
        }, [sqlist, ussInfo]);

        const allSQClosed =
            sqRecords.length === 0 ?
            true :
            sqRecords.every((item) => item.status === "closed");

        const handleApprove = () => {
            setConfirmOpen(true);
        };

        // const handleConfirmApprove = () => {
        //   onApproveUSS(ussInfo?.id);
        //   setConfirmOpen(false);
        //   onClose();
        // };

        const handleConfirmApprove = async () => {
            await onApproveUSS(ussInfo ? .id);
            setConfirmOpen(false);
        };

        return ( <
            >
            <
            Dialog open = {
                open
            }
            onClose = {
                onClose
            }
            maxWidth = "lg"
            fullWidth PaperProps = {
                {
                    sx: {
                        borderRadius: 2,
                        height: "90vh",
                        maxHeight: "90vh",
                    },
                }
            } >
            { /* Header */ } <
            Box sx = {
                {
                    px: 3,
                    py: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                }
            } >
            <
            Stack direction = "row"
            justifyContent = "space-between"
            alignItems = "center" >
            <
            Stack direction = "row"
            alignItems = "baseline"
            spacing = {
                2
            }
            flexWrap = "wrap" >
            <
            Typography variant = "h6"
            fontWeight = {
                600
            } >
            Activities Details <
            /Typography> <
            Typography variant = "body2"
            sx = {
                {
                    opacity: 0.85
                }
            } > {
                ussInfo ? .uss_name
            }• {
                ussInfo ? .turbine_name
            }• {
                " "
            } {
                ussInfo ? .cluster_name
            } <
            /Typography> <
            Typography variant = "subtitle2"
            fontWeight = {
                600
            }
            sx = {
                {
                    mt: 2
                }
            } >
            Referred Diagram <
            /Typography>

            {
                ussInfo ? .referred_diagram ? ( <
                    Button variant = "contained"
                    color = "inherit"
                    startIcon = { < OpenInNewIcon / >
                    }
                    href = {
                        ussInfo.referred_diagram
                    }
                    target = "_blank"
                    sx = {
                        {
                            bgcolor: "#fff",
                            color: "#1976d2",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                                bgcolor: "#f5f5f5",
                                color: "#1976d2",
                            },
                        }
                    } >
                    View Referred Diagram <
                    /Button>
                ) : ( <
                    Typography variant = "body2"
                    color = "text.secondary" >
                    No Referred Diagram Uploaded <
                    /Typography>
                )
            } <
            Chip size = "small"
            label = {
                `${totalActivities} Activities`
            }
            sx = {
                {
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white"
                }
            }
            /> <
            /Stack> <
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
            /Stack> <
            /Box>

            { /* Content - All activities in one list */ } <
            DialogContent sx = {
                {
                    p: 2,
                    overflowY: "auto"
                }
            } > {
                activities.length === 0 ? ( <
                    Box sx = {
                        {
                            textAlign: "center",
                            py: 4
                        }
                    } >
                    <
                    InfoIcon sx = {
                        {
                            fontSize: 48,
                            color: "text.disabled",
                            mb: 1
                        }
                    }
                    /> <
                    Typography variant = "body2"
                    color = "text.secondary" >
                    No activities found <
                    /Typography> <
                    /Box>
                ) : ( <
                        Stack spacing = {
                            2
                        } > {
                            activities.map((activity) => {
                                    const normalize = (str = "") =>
                                        str.trim().toUpperCase().replace(/\s+/g, "_");

                                    const activitySQ = sqRecords.filter(
                                        (item) =>
                                        item.turbine_activity === normalize(activity.activity_name),
                                    );

                                    return ( <
                                        Card key = {
                                            activity.id
                                        }
                                        variant = "outlined"
                                        sx = {
                                            {
                                                borderRadius: 2
                                            }
                                        } >
                                        <
                                        CardContent sx = {
                                            {
                                                p: 2
                                            }
                                        } > { /* Activity Header - Row 1 */ } <
                                        Stack direction = "row"
                                        justifyContent = "space-between"
                                        alignItems = "center"
                                        sx = {
                                            {
                                                mb: 1.5
                                            }
                                        } >
                                        <
                                        Stack direction = "row"
                                        alignItems = "center"
                                        spacing = {
                                            1.5
                                        }
                                        flexWrap = "wrap" >
                                        <
                                        Typography variant = "subtitle1"
                                        fontWeight = {
                                            700
                                        } > {
                                            activity.activity_name
                                        } <
                                        /Typography> <
                                        Chip size = "small"
                                        label = {
                                            `${activity.no_of_days} days`
                                        }
                                        variant = "outlined"
                                        icon = { < ScheduleIcon sx = {
                                                {
                                                    fontSize: 16
                                                }
                                            }
                                            />} /
                                            >
                                            <
                                            /Stack> {
                                                activity.approved_at && ( <
                                                    Typography variant = "caption"
                                                    color = "success.main" > {
                                                        formatDateTime(activity.approved_at)
                                                    } <
                                                    /Typography>
                                                )
                                            } <
                                            /Stack>

                                            {
                                                activitySQ.length > 0 && ( <
                                                    Box sx = {
                                                        {
                                                            mt: 2,
                                                            mb: 2,
                                                            border: "1px solid #dcdcdc",
                                                            borderRadius: 2,
                                                            overflow: "hidden",
                                                            bgcolor: "#fff",
                                                        }
                                                    } >
                                                    { /* Header */ } <
                                                    Box sx = {
                                                        {
                                                            px: 2,
                                                            py: 1,
                                                            bgcolor: "#f5f7fa",
                                                            borderBottom: "1px solid #e0e0e0",
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }
                                                    } >
                                                    <
                                                    Typography fontWeight = {
                                                        700
                                                    }
                                                    fontSize = {
                                                        14
                                                    } >
                                                    Safety & Quality Issues <
                                                    /Typography>

                                                    <
                                                    Chip size = "small"
                                                    label = {
                                                        activitySQ.length
                                                    }
                                                    color = "primary" /
                                                    >
                                                    <
                                                    /Box>

                                                    {
                                                        activitySQ.map((item, index) => ( <
                                                            Box key = {
                                                                item.id
                                                            }
                                                            sx = {
                                                                {
                                                                    px: 2,
                                                                    py: 1.2,
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                    alignItems: "center",
                                                                    borderBottom: index !== activitySQ.length - 1 ?
                                                                        "1px solid #f0f0f0" :
                                                                        "none",
                                                                    "&:hover": {
                                                                        bgcolor: "#fafafa",
                                                                    },
                                                                }
                                                            } >
                                                            { /* Left */ } <
                                                            Box sx = {
                                                                {
                                                                    flex: 1
                                                                }
                                                            } >
                                                            <
                                                            Box sx = {
                                                                {
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: 1,
                                                                    mb: 0.5,
                                                                    flexWrap: "wrap",
                                                                }
                                                            } >
                                                            <
                                                            Chip size = "small"
                                                            label = {
                                                                item.record_type.toUpperCase()
                                                            }
                                                            color = {
                                                                item.record_type === "safety" ?
                                                                "error" :
                                                                    "primary"
                                                            }
                                                            sx = {
                                                                {
                                                                    height: 22,
                                                                    fontSize: 11,
                                                                    fontWeight: 600,
                                                                }
                                                            }
                                                            />

                                                            <
                                                            Typography variant = "caption"
                                                            color = "text.secondary" >
                                                            <
                                                            strong > {
                                                                item.raised_name
                                                            } < /strong> <
                                                            /Typography>

                                                            <
                                                            Typography variant = "caption"
                                                            color = "text.secondary" >
                                                            •
                                                            <
                                                            /Typography>

                                                            <
                                                            Typography variant = "caption"
                                                            color = "text.secondary" >
                                                            Severity:
                                                            <
                                                            strong style = {
                                                                {
                                                                    marginLeft: 4
                                                                }
                                                            } > {
                                                                item.severity
                                                            } <
                                                            /strong> <
                                                            /Typography> <
                                                            /Box>

                                                            <
                                                            Typography variant = "body2"
                                                            sx = {
                                                                {
                                                                    color: "text.primary",
                                                                }
                                                            } >
                                                            {
                                                                item.note_details
                                                            } <
                                                            /Typography> <
                                                            /Box>

                                                            { /* Right */ } <
                                                            Chip size = "small"
                                                            label = {
                                                                item.status
                                                            }
                                                            color = {
                                                                item.status === "closed" ?
                                                                "success" :
                                                                    item.status === "open" ?
                                                                    "error" :
                                                                    "warning"
                                                            }
                                                            sx = {
                                                                {
                                                                    ml: 2,
                                                                    minWidth: 80,
                                                                    textTransform: "capitalize",
                                                                }
                                                            }
                                                            /> <
                                                            /Box>
                                                        ))
                                                    } <
                                                    /Box>
                                                )
                                            } { /* Dates - Row 2 */ } <
                                            Grid container spacing = {
                                                2
                                            }
                                            sx = {
                                                {
                                                    mb: 1.5
                                                }
                                            } >
                                            <
                                            Grid item xs = {
                                                12
                                            }
                                            sm = {
                                                6
                                            } >
                                            <
                                            Typography variant = "body2"
                                            color = "text.secondary" >
                                            <
                                            CalendarIcon
                                            sx = {
                                                {
                                                    fontSize: 14,
                                                    mr: 0.5,
                                                    verticalAlign: "middle",
                                                }
                                            }
                                            /> <
                                            strong > Start Date: < /strong>{" "} {
                                                    formatDate(activity.start_date)
                                                } <
                                                /Typography> <
                                                /Grid> <
                                                Grid item xs = {
                                                    12
                                                }
                                            sm = {
                                                6
                                            } >
                                            <
                                            Typography variant = "body2"
                                            color = "text.secondary" >
                                            <
                                            CalendarIcon
                                            sx = {
                                                {
                                                    fontSize: 14,
                                                    mr: 0.5,
                                                    verticalAlign: "middle",
                                                }
                                            }
                                            /> <
                                            strong > End Date: < /strong>{" "} {
                                                    formatDate(activity.end_date)
                                                } <
                                                /Typography> <
                                                /Grid> <
                                                /Grid>

                                            { /* Photos - Row 3 */ } {
                                                (activity.start_photo || activity.end_photo) && ( <
                                                    Grid container spacing = {
                                                        2
                                                    }
                                                    sx = {
                                                        {
                                                            mb: 1.5
                                                        }
                                                    } > {
                                                        activity.start_photo && ( <
                                                            Grid item xs = {
                                                                12
                                                            }
                                                            sm = {
                                                                6
                                                            } >
                                                            <
                                                            Typography variant = "caption"
                                                            color = "text.secondary"
                                                            sx = {
                                                                {
                                                                    mb: 0.5,
                                                                    display: "block"
                                                                }
                                                            } >
                                                            Start Photo <
                                                            /Typography> <
                                                            Box sx = {
                                                                {
                                                                    position: "relative",
                                                                    borderRadius: 1,
                                                                    overflow: "hidden",
                                                                    cursor: "pointer",
                                                                    height: 120,
                                                                    border: `1px solid ${theme.palette.divider}`,
                                                                }
                                                            }
                                                            onClick = {
                                                                () =>
                                                                openPhotoInNewTab(
                                                                    activity.start_photo,
                                                                    `Start Photo - ${activity.activity_name}`,
                                                                )
                                                            } >
                                                            <
                                                            Box component = "img"
                                                            src = {
                                                                activity.start_photo
                                                            }
                                                            alt = "Start"
                                                            sx = {
                                                                {
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                }
                                                            }
                                                            /> <
                                                            Box sx = {
                                                                {
                                                                    position: "absolute",
                                                                    top: 0,
                                                                    left: 0,
                                                                    right: 0,
                                                                    bottom: 0,
                                                                    bgcolor: "rgba(0,0,0,0.5)",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    opacity: 0,
                                                                    transition: "opacity 0.2s",
                                                                    "&:hover": {
                                                                        opacity: 1
                                                                    },
                                                                }
                                                            } >
                                                            <
                                                            OpenInNewIcon sx = {
                                                                {
                                                                    color: "white",
                                                                    fontSize: 28
                                                                }
                                                            }
                                                            /> <
                                                            /Box> <
                                                            /Box> <
                                                            /Grid>
                                                        )
                                                    } {
                                                        activity.end_photo && ( <
                                                            Grid item xs = {
                                                                12
                                                            }
                                                            sm = {
                                                                6
                                                            } >
                                                            <
                                                            Typography variant = "caption"
                                                            color = "text.secondary"
                                                            sx = {
                                                                {
                                                                    mb: 0.5,
                                                                    display: "block"
                                                                }
                                                            } >
                                                            End Photo <
                                                            /Typography> <
                                                            Box sx = {
                                                                {
                                                                    position: "relative",
                                                                    borderRadius: 1,
                                                                    overflow: "hidden",
                                                                    cursor: "pointer",
                                                                    height: 120,
                                                                    border: `1px solid ${theme.palette.divider}`,
                                                                }
                                                            }
                                                            onClick = {
                                                                () =>
                                                                openPhotoInNewTab(
                                                                    activity.end_photo,
                                                                    `End Photo - ${activity.activity_name}`,
                                                                )
                                                            } >
                                                            <
                                                            Box component = "img"
                                                            src = {
                                                                activity.end_photo
                                                            }
                                                            alt = "End"
                                                            sx = {
                                                                {
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                }
                                                            }
                                                            /> <
                                                            Box sx = {
                                                                {
                                                                    position: "absolute",
                                                                    top: 0,
                                                                    left: 0,
                                                                    right: 0,
                                                                    bottom: 0,
                                                                    bgcolor: "rgba(0,0,0,0.5)",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    opacity: 0,
                                                                    transition: "opacity 0.2s",
                                                                    "&:hover": {
                                                                        opacity: 1
                                                                    },
                                                                }
                                                            } >
                                                            <
                                                            OpenInNewIcon sx = {
                                                                {
                                                                    color: "white",
                                                                    fontSize: 28
                                                                }
                                                            }
                                                            /> <
                                                            /Box> <
                                                            /Box> <
                                                            /Grid>
                                                        )
                                                    } <
                                                    /Grid>
                                                )
                                            }

                                            { /* Remarks - Row 4 */ } {
                                                activity.remarks && ( <
                                                    Box sx = {
                                                        {
                                                            p: 1.5,
                                                            bgcolor: alpha(theme.palette.info.main, 0.05),
                                                            borderRadius: 1,
                                                        }
                                                    } >
                                                    <
                                                    Typography variant = "caption"
                                                    color = "text.secondary"
                                                    fontWeight = {
                                                        600
                                                    } >
                                                    Remarks:
                                                    <
                                                    /Typography> <
                                                    Typography variant = "body2" > {
                                                        activity.remarks
                                                    } <
                                                    /Typography> <
                                                    /Box>
                                                )
                                            } <
                                            /CardContent> <
                                            /Card>
                                        );
                                    })
                            } <
                            /Stack>
                        )
                    } <
                    /DialogContent>

                { /* Footer with Approve Button */ } <
                DialogActions
                sx = {
                    {
                        p: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        justifyContent: "space-between",
                    }
                } >
                <
                Typography variant = "body2"
                color = "text.secondary" > {
                    ussInfo ? .submitted_at ?
                    `Submitted: ${formatDateTime(ussInfo.submitted_at)}` :
                    "Not submitted"
                } <
                /Typography> <
                Stack direction = "row"
                spacing = {
                    1
                } >
                <
                Button onClick = {
                    onClose
                }
                variant = "outlined" >
                Close <
                /Button> <
                Button
                onClick = {
                    handleApprove
                }
                variant = "contained"
                color = {
                    isAlreadyApproved ? "success" : "primary"
                }
                startIcon = { < VerifiedIcon / >
                }
                disabled = {
                    isAlreadyApproved ||
                    actionLoading === `uss-${ussInfo?.id}` ||
                    !allSQClosed
                } >
                {
                    actionLoading === `uss-${ussInfo?.id}` ? ( <
                        CircularProgress size = {
                            20
                        }
                        />
                    ) : isAlreadyApproved ? (
                        "Approved"
                    ) : (
                        "Approve USS"
                    )
                } <
                /Button> <
                /Stack> <
                /DialogActions> <
                /Dialog>

                { /* Confirm Approval Dialog */ } <
                Dialog
                open = {
                    confirmOpen
                }
                onClose = {
                    () => setConfirmOpen(false)
                }
                maxWidth = "xs"
                fullWidth >
                <
                DialogTitle >
                <
                Stack direction = "row"
                alignItems = "center"
                spacing = {
                    1
                } >
                <
                VerifiedIcon color = "success" / >
                <
                Typography variant = "h6" > Confirm Approval < /Typography> <
                /Stack> <
                /DialogTitle> <
                DialogContent >
                <
                Typography >
                Are you sure you want to approve {
                    " "
                } <
                strong > {
                    ussInfo ? .uss_name
                } < /strong>? <
                /Typography> <
                Typography
                variant = "caption"
                color = "text.secondary"
                sx = {
                    {
                        display: "block",
                        mt: 1
                    }
                } >
                This action cannot be undone. <
                /Typography> <
                /DialogContent> <
                DialogActions >
                <
                Button onClick = {
                    () => setConfirmOpen(false)
                } > Cancel < /Button> <
                Button
                onClick = {
                    handleConfirmApprove
                }
                variant = "contained"
                color = "success" >
                Yes,
                Approve <
                /Button> <
                /DialogActions> <
                /Dialog> <
                />
            );
        };

        // ─── Main USSTab Component ────────────────────────────────────────────────────
        const USSTab = ({
            filters,
            notificationState
        }) => {
            const theme = useTheme();
            const dispatch = useDispatch();
            const {
                getUssMaster = [], loading
            } = useSelector(
                (state) => state.masterData,
            );

            const {
                sqlist = []
            } = useSelector((state) => state.sqData || {});

            const [page, setPage] = useState(0);
            const [rowsPerPage, setRowsPerPage] = useState(10);
            const [orderBy, setOrderBy] = useState("uss_name");
            const [order, setOrder] = useState("asc");
            const [selectedUSS, setSelectedUSS] = useState(null);
            const [dialogOpen, setDialogOpen] = useState(false);
            const [actionLoading, setActionLoading] = useState(null);
            const [snackbar, setSnackbar] = useState({
                open: false,
                message: "",
                severity: "success",
            });

            useEffect(() => {
                dispatch(GetUSSMasterData());
                dispatch(GetSQRecords());
            }, [dispatch]);

            const processedUSSList = useMemo(() => {
                return getUssMaster
                    .filter((uss) => uss.submitted_at)
                    .map((uss) => ({
                        ...uss,

                        activities: (uss.activities || []).map((act) => ({
                            ...act,

                            _rejected: act._rejected || false,
                        })),
                    }));
            }, [getUssMaster]);

            const filteredData = useMemo(() => {
                let data = [...processedUSSList];

                if (
                    filters ? .project &&
                    filters.project !== "all" &&
                    filters.project !== ""
                ) {
                    data = data.filter(
                        (item) => String(item.project) === String(filters.project),
                    );
                }

                if (
                    filters ? .windfarm &&
                    filters.windfarm !== "all" &&
                    filters.windfarm !== ""
                ) {
                    data = data.filter(
                        (item) => String(item.windfarm) === String(filters.windfarm),
                    );
                }

                if (
                    filters ? .cluster &&
                    filters.cluster !== "all" &&
                    filters.cluster !== ""
                ) {
                    data = data.filter(
                        (item) => String(item.cluster) === String(filters.cluster),
                    );
                }

                data.sort((a, b) => {
                    let aVal = a[orderBy];
                    let bVal = b[orderBy];

                    if (aVal < bVal) return order === "asc" ? -1 : 1;
                    if (aVal > bVal) return order === "asc" ? 1 : -1;
                    return 0;
                });

                return data;
            }, [processedUSSList, filters, orderBy, order]);

            const paginatedData = filteredData.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            );

            const notify = (message, severity = "success") => {
                setSnackbar({
                    open: true,
                    message,
                    severity
                });
            };

            const handleApproveUSS = async (ussId) => {
                setActionLoading(`uss-${ussId}`);
                try {
                    const payload = {
                        approved_at: new Date().toISOString(),
                    };

                    const response = await dispatch(PatchUssMasterData(ussId, payload));

                    notify("USS approved successfully!", "success");

                    // Dialog ke data ko bhi update karo
                    setSelectedUSS((prev) => ({
                        ...prev,
                        approved_at: new Date().toISOString(),
                    }));

                    await dispatch(GetUSSMasterData());

                    dispatch(refreshNotifications());
                } catch (error) {
                    console.error("Approval Error", error);

                    notify(
                        error ? .response ? .data ? .message || "Failed to approve USS",
                        "error",
                    );
                } finally {
                    setActionLoading(null);
                }
            };

            const handleViewActivities = (uss) => {
                setSelectedUSS(uss);
                setDialogOpen(true);
            };

            const handleSort = (property) => {
                const isAsc = orderBy === property && order === "asc";
                setOrder(isAsc ? "desc" : "asc");
                setOrderBy(property);
            };

            if (loading && getUssMaster.length === 0) {
                return ( <
                    Box sx = {
                        {
                            p: 3
                        }
                    } >
                    <
                    Skeleton variant = "rectangular"
                    height = {
                        400
                    }
                    /> <
                    /Box>
                );
            }

            return ( <
                Box sx = {
                    {
                        p: 3,
                        bgcolor: "#f5f7fa",
                        minHeight: "100vh"
                    }
                } > { /* Header */ } <
                Paper sx = {
                    {
                        p: 2.5,
                        mb: 2.5,
                        borderRadius: 2
                    }
                } >
                <
                Stack direction = "row"
                justifyContent = "space-between"
                alignItems = "center"
                flexWrap = "wrap"
                gap = {
                    2
                } >
                <
                Box >
                <
                Typography variant = "h5"
                fontWeight = {
                    700
                } >
                USS Approval Dashboard <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mt = {
                    0.5
                } >
                Review activities and approve USS submissions <
                /Typography> <
                /Box> <
                Button variant = "outlined"
                startIcon = { < RefreshIcon / >
                }
                onClick = {
                    () => dispatch(GetUSSMasterData())
                } >
                Refresh <
                /Button> <
                /Stack> <
                /Paper>

                { /* Data Table with Professional Header */ } <
                Paper sx = {
                    {
                        borderRadius: 2,
                        overflow: "hidden"
                    }
                } > {
                    loading && < LinearProgress / >
                } <
                TableContainer sx = {
                    {
                        overflowX: "auto"
                    }
                } >
                <
                Table stickyHeader >
                <
                TableHead sx = {
                    {
                        "& .MuiTableCell-root": {
                            backgroundColor: "#0d47a1",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            borderBottom: "none",
                            py: 1.5,
                        },
                        "& .MuiTableSortLabel-root": {
                            color: "#fff !important",
                            fontWeight: 700,
                        },
                        "& .MuiTableSortLabel-icon": {
                            color: "#fff !important",
                        },
                    }
                } >
                <
                TableRow sx = {
                    {
                        background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
                        "& .MuiTableCell-root": {
                            color: "#111010",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            borderBottom: "none",
                            py: 1.5,
                            "&:first-of-type": {
                                borderTopLeftRadius: 8,
                                borderBottomLeftRadius: 8,
                            },
                            "&:last-of-type": {
                                borderTopRightRadius: 8,
                                borderBottomRightRadius: 8,
                            },
                        },
                    }
                } >
                <
                TableCell >
                <
                TableSortLabel active = {
                    orderBy === "project_name"
                }
                direction = {
                    orderBy === "project_name" ? order : "asc"
                }
                onClick = {
                    () => handleSort("project_name")
                } >
                Project <
                /TableSortLabel> <
                /TableCell>

                <
                TableCell >
                <
                TableSortLabel active = {
                    orderBy === "windfarm_name"
                }
                direction = {
                    orderBy === "windfarm_name" ? order : "asc"
                }
                onClick = {
                    () => handleSort("windfarm_name")
                } >
                Windfarm <
                /TableSortLabel> <
                /TableCell>

                <
                TableCell >
                <
                TableSortLabel active = {
                    orderBy === "cluster_name"
                }
                direction = {
                    orderBy === "cluster_name" ? order : "asc"
                }
                onClick = {
                    () => handleSort("cluster_name")
                } >
                Cluster <
                /TableSortLabel> <
                /TableCell>

                <
                TableCell >
                <
                TableSortLabel active = {
                    orderBy === "uss_name"
                }
                direction = {
                    orderBy === "uss_name" ? order : "asc"
                }
                onClick = {
                    () => handleSort("uss_name")
                } >
                USS Name <
                /TableSortLabel> <
                /TableCell>

                <
                TableCell > {
                    " "
                } <
                TableSortLabel > Turbine < /TableSortLabel> <
                /TableCell> <
                TableCell align = "center" > {
                    " "
                } <
                TableSortLabel > Activities < /TableSortLabel> <
                /TableCell> <
                TableCell align = "center" > {
                    " "
                } <
                TableSortLabel > Submitted On < /TableSortLabel> <
                /TableCell> <
                TableCell align = "center" > {
                    " "
                } <
                TableSortLabel > Status < /TableSortLabel> <
                /TableCell> <
                TableCell align = "center" > {
                    " "
                } <
                TableSortLabel > Action < /TableSortLabel> <
                /TableCell> <
                /TableRow> <
                /TableHead> <
                TableBody > {
                    paginatedData.length === 0 ? ( <
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
                        Typography color = "text.secondary" >
                        No USS submissions found <
                        /Typography> <
                        /TableCell> <
                        /TableRow>
                    ) : (
                        paginatedData.map((uss, index) => {
                            const totalActivities = (uss.activities || []).length;
                            const status = getUSSStatus(uss);

                            return ( <
                                TableRow key = {
                                    uss.id
                                }
                                hover sx = {
                                    {
                                        "&:nth-of-type(odd)": {
                                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                                        },
                                        "&:hover": {
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        },
                                        transition: "background-color 0.2s ease",
                                    }
                                } >
                                <
                                TableCell > {
                                    uss.project_name
                                } < /TableCell> <
                                TableCell > {
                                    uss.windfarm_name
                                } < /TableCell> <
                                TableCell >
                                <
                                Chip label = {
                                    uss.cluster_name
                                }
                                size = "small"
                                variant = "outlined"
                                sx = {
                                    {
                                        fontWeight: 500
                                    }
                                }
                                /> <
                                /TableCell> <
                                TableCell >
                                <
                                Typography fontWeight = {
                                    600
                                }
                                color = "primary.main" > {
                                    uss.uss_name
                                } <
                                /Typography> <
                                /TableCell> <
                                TableCell >
                                <
                                Chip label = {
                                    uss.turbine_name
                                }
                                size = "small"
                                sx = {
                                    {
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        fontWeight: 500,
                                    }
                                }
                                /> <
                                /TableCell> <
                                TableCell align = "center" >
                                <
                                Chip label = {
                                    totalActivities
                                }
                                size = "small"
                                sx = {
                                    {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        fontWeight: 700,
                                        minWidth: 40,
                                    }
                                }
                                /> <
                                /TableCell> <
                                TableCell align = "center" >
                                <
                                Typography variant = "body2"
                                fontWeight = {
                                    500
                                } > {
                                    formatDate(uss.submitted_at)
                                } <
                                /Typography> <
                                /TableCell> <
                                TableCell align = "center" >
                                <
                                Chip size = "small"
                                label = {
                                    status.label
                                }
                                color = {
                                    status.color
                                }
                                icon = {
                                    status.icon
                                }
                                sx = {
                                    {
                                        fontWeight: 600
                                    }
                                }
                                /> <
                                /TableCell> <
                                TableCell align = "center" >
                                <
                                Button size = "small"
                                variant = "contained"
                                color = "primary"
                                startIcon = { < VisibilityIcon / >
                                }
                                onClick = {
                                    () => handleViewActivities(uss)
                                }
                                sx = {
                                    {
                                        textTransform: "none",
                                        minWidth: 80,
                                        borderRadius: 1.5,
                                        boxShadow: "none",
                                        "&:hover": {
                                            boxShadow: "none"
                                        },
                                    }
                                } >
                                View <
                                /Button> <
                                /TableCell> <
                                /TableRow>
                            );
                        })
                    )
                } <
                /TableBody> <
                /Table> <
                /TableContainer> <
                TablePagination component = "div"
                count = {
                    filteredData.length
                }
                page = {
                    page
                }
                onPageChange = {
                    (e, newPage) => setPage(newPage)
                }
                rowsPerPage = {
                    rowsPerPage
                }
                onRowsPerPageChange = {
                    (e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }
                }
                rowsPerPageOptions = {
                    [5, 10, 25, 50]
                }
                sx = {
                    {
                        borderTop: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                    }
                }
                /> <
                /Paper>

                { /* Activities Dialog */ } <
                ActivityDetailsDialog open = {
                    dialogOpen
                }
                onClose = {
                    () => setDialogOpen(false)
                }
                activities = {
                    selectedUSS ? .activities || []
                }
                ussInfo = {
                    selectedUSS
                }
                sqlist = {
                    sqlist
                }
                onApproveUSS = {
                    handleApproveUSS
                }
                actionLoading = {
                    actionLoading
                }
                />

                { /* Snackbar */ } <
                Snackbar open = {
                    snackbar.open
                }
                autoHideDuration = {
                    4000
                }
                onClose = {
                    () => setSnackbar((prev) => ({ ...prev,
                        open: false
                    }))
                }
                anchorOrigin = {
                    {
                        vertical: "bottom",
                        horizontal: "right"
                    }
                } >
                <
                Alert severity = {
                    snackbar.severity
                }
                variant = "filled"
                onClose = {
                    () => setSnackbar((prev) => ({ ...prev,
                        open: false
                    }))
                } >
                {
                    snackbar.message
                } <
                /Alert> <
                /Snackbar> <
                /Box>
            );
        };

        export default USSTab;