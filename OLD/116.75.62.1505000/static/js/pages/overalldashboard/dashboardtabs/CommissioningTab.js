import {
    Box,
    Typography,
    Grid,
    Paper,
    Avatar,
    Stack,
    Chip,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button
} from "@mui/material";
import {
    SettingsIcon
} from "../TabIcons";

const CommissioningTab = () => {
    const metrics = [{
            label: "Turbines Operational",
            value: "15/50",
            progress: 30
        },
        {
            label: "Performance Test",
            value: "88%",
            progress: 88
        },
        {
            label: "Handover Ready",
            value: "12/50",
            progress: 24
        },
        {
            label: "Documentation",
            value: "65%",
            progress: 65
        }
    ];

    const activities = [{
            title: "System Check",
            status: "Ongoing",
            date: "Daily"
        },
        {
            title: "Performance Test",
            status: "In Progress",
            date: "Ongoing"
        },
        {
            title: "Handover",
            status: "12 Completed",
            date: "Monthly"
        },
        {
            title: "Documentation",
            status: "65% Done",
            date: "Ongoing"
        }
    ];

    return ( <
        Box >
        <
        Box sx = {
            {
                mb: 4
            }
        } >
        <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            2
        }
        sx = {
            {
                mb: 2
            }
        } >
        <
        Avatar sx = {
            {
                bgcolor: "#E91E63",
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #E91E63 0%, #C2185B 100%)"
            }
        } >
        <
        SettingsIcon sx = {
            {
                fontSize: 28
            }
        }
        /> <
        /Avatar> <
        Box >
        <
        Typography variant = "h5"
        fontWeight = {
            700
        } >
        Commissioning <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        System commissioning and performance testing <
        /Typography> <
        /Box> <
        /Stack> <
        /Box>

        <
        Grid container spacing = {
            3
        }
        sx = {
            {
                mb: 4
            }
        } > {
            metrics.map((metric, index) => ( <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    3
                }
                key = {
                    index
                } >
                <
                Paper sx = {
                    {
                        p: 3,
                        borderRadius: 3,
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)'
                        }
                    }
                } >
                <
                Typography variant = "h4"
                fontWeight = {
                    700
                }
                color = "#E91E63" > {
                    metric.value
                } <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                sx = {
                    {
                        mb: 2
                    }
                } > {
                    metric.label
                } <
                /Typography> <
                LinearProgress variant = "determinate"
                value = {
                    metric.progress
                }
                sx = {
                    {
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(233, 30, 99, 0.15)',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: '#E91E63',
                            borderRadius: 3
                        }
                    }
                }
                /> <
                /Paper> <
                /Grid>
            ))
        } <
        /Grid>

        <
        Grid container spacing = {
            3
        } >
        <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        Paper sx = {
            {
                p: 3,
                borderRadius: 3,
                height: '100%'
            }
        } >
        <
        Typography variant = "h6"
        fontWeight = {
            600
        }
        sx = {
            {
                mb: 3
            }
        } >
        Recent Activities <
        /Typography> <
        List > {
            activities.map((activity, index) => ( <
                ListItem key = {
                    index
                }
                sx = {
                    {
                        px: 0,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': {
                            borderBottom: 'none'
                        }
                    }
                } >
                <
                ListItemIcon >
                <
                Box sx = {
                    {
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(233, 30, 99, 0.15)'
                    }
                } >
                <
                Typography variant = "caption"
                fontWeight = {
                    700
                }
                color = "#E91E63" > {
                    index + 1
                } <
                /Typography> <
                /Box> <
                /ListItemIcon> <
                ListItemText primary = { <
                    Typography fontWeight = {
                        600
                    } > {
                        activity.title
                    } <
                    /Typography>
                }
                secondary = { <
                    Stack direction = "row"
                    justifyContent = "space-between"
                    alignItems = "center" >
                    <
                    Typography variant = "body2"
                    color = "text.secondary" > {
                        activity.date
                    } <
                    /Typography> <
                    Chip
                    label = {
                        activity.status
                    }
                    size = "small"
                    sx = {
                        {
                            bgcolor: activity.status === 'Completed' ? '#4CAF50' : activity.status === 'In Progress' ? '#2196F3' : activity.status.includes('%') ? '#FF9800' : '#9C27B0',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 600
                        }
                    }
                    /> <
                    /Stack>
                }
                /> <
                /ListItem>
            ))
        } <
        /List> <
        /Paper> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        Paper sx = {
            {
                p: 4,
                borderRadius: 3,
                textAlign: 'center',
                height: '100%'
            }
        } >
        <
        Box sx = {
            {
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: 'rgba(233, 30, 99, 0.15)',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
            }
        } >
        <
        SettingsIcon sx = {
            {
                fontSize: 40,
                color: "#E91E63"
            }
        }
        /> <
        /Box>

        <
        Typography variant = "h5"
        color = "text.secondary"
        gutterBottom >
        Commissioning Module <
        /Typography>

        <
        Typography variant = "body1"
        color = "text.secondary"
        sx = {
            {
                mb: 3
            }
        } >
        Comprehensive tracking and management
        for system commissioning. <
        /Typography>

        <
        Stack direction = "row"
        spacing = {
            2
        }
        justifyContent = "center"
        sx = {
            {
                mb: 4
            }
        } >
        <
        Chip label = "Active"
        sx = {
            {
                fontWeight: 600,
                bgcolor: "#E91E63",
                color: 'white'
            }
        }
        /> <
        Chip label = "Real-time Updates"
        variant = "outlined"
        sx = {
            {
                fontWeight: 600,
                borderColor: "#E91E63",
                color: "#E91E63"
            }
        }
        /> <
        /Stack>

        <
        Button variant = "contained"
        sx = {
            {
                bgcolor: "#E91E63",
                background: "linear-gradient(135deg, #E91E63 0%, #C2185B 100%)",
                '&:hover': {
                    opacity: 0.9,
                    bgcolor: "#E91E63"
                }
            }
        } >
        View Detailed Report <
        /Button> <
        /Paper> <
        /Grid> <
        /Grid> <
        /Box>
    );
};

export default CommissioningTab;