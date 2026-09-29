import React, {
    useState
} from "react";
import {
    Box,
    Typography,
    Collapse,
    Chip,
    Paper,
    Grid,
    Stack,
    IconButton
} from "@mui/material";
import {
    ExpandMore as ExpandMoreIcon
} from "@mui/icons-material";
import {
    alpha,
    styled
} from "@mui/material/styles";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";

/* ================= STYLES ================= */
const ActivityCard = styled(Paper)(({
    theme,
    active,
    color
}) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: "16px",
    transition: "all 0.3s ease",
    borderLeft: `6px solid ${active ? color : "#e2e8f0"}`,
    border: "1px solid #f1f5f9",
    "&:hover": {
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
    }
}));

/* ================= RECHARTS RING COMPONENT ================= */
const ActivityRing = ({
    completed,
    total,
    color
}) => {
    const data = [{
            value: completed
        },
        {
            value: total - completed
        },
    ];

    return ( <
        Box sx = {
            {
                width: 60,
                height: 60,
                position: "relative",
                flexShrink: 0
            }
        } >
        <
        ResponsiveContainer width = "100%"
        height = "100%" >
        <
        PieChart >
        <
        Pie data = {
            data
        }
        innerRadius = {
            18
        }
        outerRadius = {
            26
        }
        paddingAngle = {
            2
        }
        dataKey = "value"
        startAngle = {
            90
        }
        endAngle = {-270
        }
        stroke = "none" >
        <
        Cell fill = {
            color
        }
        /> <
        Cell fill = "#f1f5f9" / >
        <
        /Pie> <
        /PieChart> <
        /ResponsiveContainer> <
        Box sx = {
            {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center"
            }
        } >
        <
        Typography variant = "caption"
        sx = {
            {
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "#1e293b"
            }
        } > {
            Math.round((completed / total) * 100)
        } %
        <
        /Typography> <
        /Box> <
        /Box>
    );
};


/* ================= HELPERS ================= */

const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date)) return "-";

    // Remove time part to avoid timezone shift
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return localDate.toLocaleDateString(); // Will respect user locale
};

const getDays = (start, end) => {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) return 0;

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
};



/* ================= MAIN TIMELINE ================= */
const ActivityTimeline = ({
    turbines = [],
    progressData = [],
    totalTurbines = 86
}) => {
    const [openActivity, setOpenActivity] = useState(null);

    // Mapping UI Names to JSON data keys
    const keyMap = {
        "Soil Test": "soil",
        "Excavation": "ex",
        "PCC Layer": "pcc",
        "Conduit Laying": "cnd",
        "Anchor Cage": "anc",
        "Reinforcement": "re",
        "Foundation": "f",
        "Pouring": "pr",
        "Cube Result": "cube",
        "Backfilling": "backf"
    };

    return ( <
        Box sx = {
            {
                mt: 2
            }
        } > {
            progressData.map((stage) => {
                const isOpen = openActivity === stage.name;
                const activityKey = keyMap[stage.name];

                // Filter only turbines that have progress in THIS stage
                const relevantTurbines = turbines.filter(t =>
                    t[`${activityKey}_status`] !== null || t[`date_of_sampling`] && stage.name === "Soil Test"
                );

                return ( <
                    ActivityCard key = {
                        stage.name
                    }
                    elevation = {
                        0
                    }
                    active = {
                        isOpen
                    }
                    color = {
                        stage.color
                    } >
                    <
                    Box sx = {
                        {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // Ensures spacing between the 3 main sections
                            cursor: "pointer",
                            py: 1 // Slight vertical padding for breathing room
                        }
                    }
                    onClick = {
                        () => setOpenActivity(isOpen ? null : stage.name)
                    } >
                    { /* SECTION 1: Text Info (Left Aligned) */ } <
                    Box sx = {
                        {
                            flex: 1
                        }
                    } >
                    <
                    Typography variant = "subtitle1"
                    sx = {
                        {
                            fontWeight: 800,
                            color: "#1e293b",
                            lineHeight: 1.2
                        }
                    } > {
                        stage.name
                    } <
                    /Typography> <
                    Typography variant = "caption"
                    color = "text.secondary" >
                    <
                    b style = {
                        {
                            color: stage.color
                        }
                    } > {
                        stage.completed
                    }
                    Completed < /b> / {
                        totalTurbines
                    } <
                    /Typography> <
                    /Box>

                    { /* SECTION 2: The Ring Chart (Centered) */ } <
                    Box sx = {
                        {
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center'
                        }
                    } >
                    <
                    ActivityRing completed = {
                        stage.completed
                    }
                    total = {
                        totalTurbines
                    }
                    color = {
                        stage.color
                    }
                    /> <
                    /Box>

                    { /* SECTION 3: Action / Percentage (Right Aligned) */ } <
                    Stack direction = "row"
                    spacing = {
                        3
                    }
                    alignItems = "center"
                    sx = {
                        {
                            flex: 1,
                            justifyContent: 'flex-end'
                        }
                    } >
                    <
                    Box sx = {
                        {
                            textAlign: "right"
                        }
                    } >
                    <
                    Typography variant = "body2"
                    fontWeight = {
                        800
                    }
                    color = "text.primary"
                    sx = {
                        {
                            lineHeight: 1
                        }
                    } > {
                        totalTurbines - stage.completed
                    } <
                    /Typography> <
                    Typography variant = "caption"
                    color = "text.secondary"
                    sx = {
                        {
                            fontSize: '0.6rem',
                            fontWeight: 700
                        }
                    } >
                    PENDING <
                    /Typography> <
                    /Box> <
                    IconButton size = "small"
                    sx = {
                        {
                            transform: isOpen ? "rotate(180deg)" : "none",
                            transition: "0.3s",
                            bgcolor: isOpen ? alpha(stage.color, 0.08) : 'transparent'
                        }
                    } >
                    <
                    ExpandMoreIcon / >
                    <
                    /IconButton> <
                    /Stack> <
                    /Box>

                    { /* 4. Expandable Turbine Details */ } <
                    Collapse in = {
                        isOpen
                    } >
                    <
                    Box sx = {
                        {
                            mt: 2,
                            pt: 2,
                            borderTop: "1px dashed #e2e8f0"
                        }
                    } >
                    <
                    Grid container spacing = {
                        2
                    } > { /* Filter turbines that have at least started this stage */ } {
                        turbines.filter(t => t[`${activityKey}_start`] || (activityKey === 'soil' && t.date_of_sampling)).map((turbine) => {

                            // 1. Resolve Dynamic Dates based on activityKey
                            const start = activityKey === 'soil' ? turbine.date_of_sampling : turbine[`${activityKey}_start`];
                            const end = activityKey === 'soil' ? turbine.date_of_sampling : turbine[`${activityKey}_end`];
                            const isDone = !!end;

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
                                key = {
                                    turbine.turbine_id
                                } >
                                <
                                Box sx = {
                                    {
                                        p: 2,
                                        borderRadius: "12px",
                                        border: "1px solid #f1f5f9",
                                        bgcolor: isDone ? alpha(stage.color, 0.03) : "#fff"
                                    }
                                } > { /* Header: ID and Status */ } <
                                Stack direction = "row"
                                justifyContent = "space-between"
                                mb = {
                                    1.5
                                } >
                                <
                                Typography variant = "subtitle2"
                                fontWeight = {
                                    800
                                }
                                color = "#1e293b" > {
                                    turbine.location_no
                                } <
                                /Typography> <
                                Chip label = {
                                    isDone ? "Completed" : "In Progress"
                                }
                                size = "small"
                                sx = {
                                    {
                                        height: 18,
                                        fontSize: '0.6rem',
                                        fontWeight: 700,
                                        bgcolor: isDone ? stage.color : "#fef9c3",
                                        color: isDone ? "#fff" : "#854d0e"
                                    }
                                }
                                /> <
                                /Stack>

                                { /* Date Details Row */ } <
                                Stack direction = "row"
                                spacing = {
                                    2
                                }
                                justifyContent = "space-between" >
                                <
                                Box >
                                <
                                Typography variant = "caption"
                                color = "text.secondary"
                                display = "block" > Start Date < /Typography> <
                                Typography variant = "body2"
                                fontWeight = {
                                    600
                                } > {
                                    formatDate(start)
                                } < /Typography> <
                                /Box> <
                                Box >
                                <
                                Typography variant = "caption"
                                color = "text.secondary"
                                display = "block" > End Date < /Typography> <
                                Typography variant = "body2"
                                fontWeight = {
                                    600
                                } > {
                                    formatDate(end)
                                } < /Typography> <
                                /Box> <
                                Box sx = {
                                    {
                                        textAlign: 'right'
                                    }
                                } >
                                <
                                Typography variant = "caption"
                                color = "text.secondary"
                                display = "block" > Duration < /Typography> <
                                Typography variant = "body2"
                                sx = {
                                    {
                                        color: stage.color,
                                        fontWeight: 800
                                    }
                                } > {
                                    getDays(start, end)
                                }
                                Days <
                                /Typography> <
                                /Box> <
                                /Stack> <
                                /Box> <
                                /Grid>
                            );
                        })
                    } <
                    /Grid> <
                    /Box> <
                    /Collapse> <
                    /ActivityCard>
                );
            })
        } <
        /Box>
    );
};

export default ActivityTimeline;