import React, {
    useMemo,
    useState
} from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Avatar,
    Stack,
    Button,
    CircularProgress,
    Tooltip,
    IconButton,
    Divider,
    Fade,
} from "@mui/material";
import {
    Bolt,
    CheckCircle,
    Pending,
    Engineering,
    Refresh,
    Speed,
    Assignment,
    DoneAll,
    HourglassEmpty,
    Block,
    Info,
    TrendingUp,
    TrendingDown,
    Build,
    ElectricalServices,
    Timeline,
    CheckBox,
    Warning,
} from "@mui/icons-material";
import {
    styled
} from "@mui/material/styles";
import LocationFilterBar from "../../../../components/LocationFilterBar";

// Styled components
const StyledCard = styled(Card)(({
    theme
}) => ({
    borderRadius: "12px",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows[8],
    },
}));

const GradientCard = styled(Paper)(({
    theme
}) => ({
    borderRadius: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: theme.spacing(2.5),
    position: "relative",
    overflow: "hidden",
}));

const StatusChip = styled(Chip)(({
    theme,
    status
}) => ({
    borderRadius: "6px",
    fontWeight: 600,
    ...(status === "completed" && {
        bgcolor: "#4caf50",
        color: "white"
    }),
    ...(status === "in_progress" && {
        bgcolor: "#ff9800",
        color: "white"
    }),
    ...(status === "pending" && {
        bgcolor: "#f44336",
        color: "white"
    }),
}));

export default function ElectricalUSSDashboard({
    ussData,
    filters,
    setFilters,
}) {
    const [lastUpdated] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);

    // Process data
    const data = useMemo(() => {
        if (!ussData) return null;
        return ussData.data || ussData;
    }, [ussData]);

    if (!ussData) {
        return ( <
            Box sx = {
                {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }
            } >
            <
            CircularProgress size = {
                50
            }
            /> <
            Typography sx = {
                {
                    ml: 2
                }
            } > Loading Dashboard... < /Typography> <
            /Box>
        );
    }

    const {
        total_uss: totalUSS = 0,
        completed_uss: completedUSS = 0,
        in_progress_uss: inProgressUSS = 0,
        not_started_uss: notStartedUSS = 0,
        submitted = 0,
        approved = 0,
        approval_pending: approvalPending = 0,
        not_submitted: notSubmitted = 0,
        completion_percentage: completionPercentage = 0,
        total_activity_records: totalActivities = 0,
        completed_activity_records: completedActivities = 0,
        pending_activity_records: pendingActivities = 0,
        activity_completion_percentage: activityCompletionPercentage = 0,
        required_activities_per_uss: requiredActivities = 0,
        activity_progress: activityProgress = [],
    } = data;

    // KPI Cards
    const kpiCards = [{
            label: "Total USS",
            value: totalUSS,
            color: "#3b82f6",
            icon: < Engineering / > ,
            bg: "rgba(59, 130, 246, 0.1)",
            trend: `${activityProgress.length} Activities Each`,
        },
        {
            label: "Completed",
            value: completedUSS,
            color: "#10b981",
            icon: < DoneAll / > ,
            bg: "rgba(16, 185, 129, 0.1)",
            trend: `${((completedUSS / totalUSS) * 100).toFixed(1)}% Complete`,
        },
        {
            label: "In Progress",
            value: inProgressUSS,
            color: "#f59e0b",
            icon: < HourglassEmpty / > ,
            bg: "rgba(245, 158, 11, 0.1)",
            trend: `${((inProgressUSS / totalUSS) * 100).toFixed(1)}% Active`,
        },
        {
            label: "Not Started",
            value: notStartedUSS,
            color: "#ef4444",
            icon: < Block / > ,
            bg: "rgba(239, 68, 68, 0.1)",
            trend: `${((notStartedUSS / totalUSS) * 100).toFixed(1)}% Pending`,
        },
    ];

    // Progress metrics
    const metrics = [{
            label: "Overall USS Progress",
            value: completionPercentage,
            completed: completedUSS,
            total: totalUSS,
            color: "#3b82f6",
            icon: < Speed / > ,
        },
        {
            label: "Activity Completion",
            value: activityCompletionPercentage,
            completed: completedActivities,
            total: totalActivities,
            color: "#10b981",
            icon: < CheckCircle / > ,
        },
        {
            label: "Submission Status",
            value: (submitted / totalUSS) * 100,
            completed: submitted,
            total: totalUSS,
            color: "#f59e0b",
            icon: < Assignment / > ,
            sub: `${approved} Approved · ${approvalPending} Pending`,
        },
    ];

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    return ( <
        Box sx = {
            {
                p: {
                    xs: 1.5,
                    md: 3
                },
                bgcolor: "#f8fafc",
                minHeight: "100vh"
            }
        } > { /* Header */ } <
        GradientCard elevation = {
            0
        }
        sx = {
            {
                mb: 3
            }
        } >
        <
        Stack direction = {
            {
                xs: "column",
                md: "row"
            }
        }
        justifyContent = "space-between"
        alignItems = "center"
        spacing = {
            2
        } >
        <
        Box >
        <
        Typography variant = "h5"
        fontWeight = "700"
        sx = {
            {
                mb: 0.5
            }
        } > ⚡USS Progress Dashboard <
        Chip size = "small"
        label = "LIVE"
        sx = {
            {
                ml: 1.5,
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
            }
        }
        /> <
        /Typography> <
        Typography variant = "body2"
        sx = {
            {
                opacity: 0.9
            }
        } > {
            totalUSS
        }
        Units· {
            totalActivities
        }
        Activities· Updated {
            " "
        } {
            lastUpdated.toLocaleTimeString()
        } <
        /Typography> <
        /Box> <
        Stack direction = "row"
        spacing = {
            1
        } >
        <
        Button variant = "contained"
        startIcon = {
            refreshing ? ( <
                CircularProgress size = {
                    20
                }
                color = "inherit" / >
            ) : ( <
                Refresh / >
            )
        }
        onClick = {
            handleRefresh
        }
        disabled = {
            refreshing
        }
        sx = {
            {
                bgcolor: "rgba(255,255,255,0.2)",
                "&:hover": {
                    bgcolor: "rgba(255,255,255,0.3)"
                },
            }
        } >
        Refresh <
        /Button> <
        /Stack> <
        /Stack> <
        Box sx = {
            {
                mt: 2
            }
        } >
        <
        LocationFilterBar filters = {
            filters
        }
        setFilters = {
            setFilters
        }
        /> <
        /Box> <
        /GradientCard>

        { /* KPI Cards */ } <
        Grid container spacing = {
            3
        }
        sx = {
            {
                mb: 3
            }
        } > {
            kpiCards.map((card, i) => ( <
                Grid item xs = {
                    6
                }
                sm = {
                    6
                }
                md = {
                    3
                }
                key = {
                    i
                } >
                <
                Fade in timeout = {
                    300 + i * 100
                } >
                <
                StyledCard >
                <
                CardContent sx = {
                    {
                        p: 2.5
                    }
                } >
                <
                Stack spacing = {
                    1
                } >
                <
                Stack direction = "row"
                justifyContent = "space-between" >
                <
                Typography variant = "caption"
                color = "text.secondary"
                fontWeight = {
                    500
                } >
                {
                    card.label
                } <
                /Typography> <
                Avatar sx = {
                    {
                        width: 36,
                        height: 36,
                        bgcolor: card.bg,
                        color: card.color,
                    }
                } >
                {
                    card.icon
                } <
                /Avatar> <
                /Stack> <
                Typography variant = "h3"
                fontWeight = "700"
                sx = {
                    {
                        color: card.color
                    }
                } >
                {
                    card.value
                } <
                /Typography> <
                Typography variant = "caption"
                color = "text.secondary" > {
                    card.trend
                } <
                /Typography> <
                /Stack> <
                /CardContent> <
                /StyledCard> <
                /Fade> <
                /Grid>
            ))
        } <
        /Grid>

        { /* Progress Metrics */ } <
        Grid container spacing = {
            3
        }
        sx = {
            {
                mb: 3
            }
        } > {
            metrics.map((metric, i) => ( <
                Grid item xs = {
                    12
                }
                md = {
                    4
                }
                key = {
                    i
                } >
                <
                Paper sx = {
                    {
                        p: 2.5,
                        borderRadius: "12px"
                    }
                } >
                <
                Stack spacing = {
                    1.5
                } >
                <
                Stack direction = "row"
                justifyContent = "space-between"
                alignItems = "center" >
                <
                Typography variant = "body2"
                fontWeight = {
                    500
                }
                color = "text.secondary" >
                {
                    metric.label
                } <
                /Typography> <
                Avatar sx = {
                    {
                        width: 32,
                        height: 32,
                        bgcolor: `${metric.color}15`,
                        color: metric.color,
                    }
                } >
                {
                    metric.icon
                } <
                /Avatar> <
                /Stack> <
                Typography variant = "h4"
                fontWeight = "700"
                sx = {
                    {
                        color: metric.color
                    }
                } >
                {
                    metric.value.toFixed(1)
                } %
                <
                /Typography> <
                Box >
                <
                LinearProgress variant = "determinate"
                value = {
                    Math.min(metric.value, 100)
                }
                sx = {
                    {
                        height: 8,
                        borderRadius: "4px",
                        bgcolor: `${metric.color}20`,
                        "& .MuiLinearProgress-bar": {
                            bgcolor: metric.color
                        },
                    }
                }
                /> <
                /Box> <
                Stack direction = "row"
                justifyContent = "space-between" >
                <
                Typography variant = "caption"
                color = "text.secondary" > {
                    metric.completed
                }
                / {metric.total} Complete <
                /Typography> {
                    metric.sub && ( <
                        Typography variant = "caption"
                        color = "text.secondary" > {
                            metric.sub
                        } <
                        /Typography>
                    )
                } <
                /Stack> <
                /Stack> <
                /Paper> <
                /Grid>
            ))
        } <
        /Grid>

        { /* Activity Progress */ } <
        Paper sx = {
            {
                p: 3,
                borderRadius: "12px"
            }
        } >
        <
        Stack direction = "row"
        justifyContent = "space-between"
        alignItems = "center"
        sx = {
            {
                mb: 2.5
            }
        } >
        <
        Stack direction = "row"
        spacing = {
            2
        }
        alignItems = "center" >
        <
        Typography variant = "h6"
        fontWeight = "700" >
        Activity Progress <
        /Typography> <
        Chip size = "small"
        label = {
            `${activityProgress.length} Activities`
        }
        sx = {
            {
                bgcolor: "#f1f5f9",
                fontWeight: 600
            }
        }
        /> <
        Chip size = "small"
        label = {
            `${requiredActivities} per USS`
        }
        variant = "outlined" /
        >
        <
        /Stack> <
        Typography variant = "caption"
        color = "text.secondary" > {
            completedActivities
        } of {
            totalActivities
        }
        complete <
        /Typography> <
        /Stack>

        <
        Grid container spacing = {
            2
        } > {
            activityProgress.map((act, i) => {
                const percentage = act.percentage || 0;
                const isComplete = percentage === 100;
                const isHigh = percentage >= 70;

                return ( <
                    Grid item xs = {
                        12
                    }
                    sm = {
                        6
                    }
                    md = {
                        4
                    }
                    lg = {
                        3
                    }
                    key = {
                        i
                    } >
                    <
                    Fade in timeout = {
                        300 + i * 50
                    } >
                    <
                    Card variant = "outlined"
                    sx = {
                        {
                            borderRadius: "10px",
                            borderColor: isComplete ?
                                "#10b981" :
                                isHigh ?
                                "#3b82f6" :
                                "#e2e8f0",
                        }
                    } >
                    <
                    CardContent sx = {
                        {
                            p: 2
                        }
                    } >
                    <
                    Stack spacing = {
                        1.5
                    } >
                    <
                    Typography variant = "body2"
                    fontWeight = "600"
                    noWrap > {
                        act.activity
                    } <
                    /Typography>

                    <
                    Box >
                    <
                    Stack direction = "row"
                    justifyContent = "space-between"
                    sx = {
                        {
                            mb: 0.5
                        }
                    } >
                    <
                    Typography variant = "caption"
                    color = "text.secondary" >
                    Progress <
                    /Typography> <
                    Typography variant = "caption"
                    fontWeight = "700" > {
                        percentage
                    } %
                    <
                    /Typography> <
                    /Stack> <
                    LinearProgress variant = "determinate"
                    value = {
                        percentage
                    }
                    sx = {
                        {
                            height: 6,
                            borderRadius: "3px",
                            bgcolor: "#f1f5f9",
                            "& .MuiLinearProgress-bar": {
                                bgcolor: isComplete ?
                                    "#10b981" :
                                    isHigh ?
                                    "#3b82f6" :
                                    "#94a3b8",
                            },
                        }
                    }
                    /> <
                    /Box>

                    <
                    Stack direction = "row"
                    spacing = {
                        1
                    }
                    justifyContent = "space-between" >
                    <
                    Typography variant = "caption"
                    color = "text.secondary" > ✅{
                        act.completed || 0
                    }
                    Done <
                    /Typography> <
                    Typography variant = "caption"
                    color = "text.secondary" > ⏳{
                        act.pending || 0
                    }
                    Pending <
                    /Typography> <
                    /Stack>

                    {
                        isComplete && ( <
                            Chip size = "small"
                            label = "✓ Complete"
                            sx = {
                                {
                                    bgcolor: "#10b981",
                                    color: "white",
                                    fontWeight: 600,
                                }
                            }
                            />
                        )
                    } <
                    /Stack> <
                    /CardContent> <
                    /Card> <
                    /Fade> <
                    /Grid>
                );
            })
        } <
        /Grid> <
        /Paper>

        { /* Footer Stats */ } <
        Box sx = {
            {
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
            }
        } >
        <
        Stack direction = "row"
        spacing = {
            1
        } >
        <
        StatusChip status = "completed"
        label = {
            `${completedUSS} Completed`
        }
        size = "small" /
        >
        <
        StatusChip status = "in_progress"
        label = {
            `${inProgressUSS} In Progress`
        }
        size = "small" /
        >
        <
        StatusChip status = "pending"
        label = {
            `${notStartedUSS} Not Started`
        }
        size = "small" /
        >
        <
        /Stack> <
        Typography variant = "caption"
        color = "text.secondary" > {
            submitted
        }
        Submitted· {
            approvalPending
        }
        Pending Approval <
        /Typography> <
        /Box> <
        /Box>
    );
}