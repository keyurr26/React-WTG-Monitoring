import React from "react";
import {
    Grid,

    CardContent,
    Typography,
    Box,
    Avatar,

    Stack,

    CircularProgress
} from "@mui/material";
import {
    Foundation as FoundationIcon,
    Speed as SpeedIcon,
    Assessment as AssessmentIcon,
    Warning as WarningIcon,

    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Science as SoilIcon,
    PrecisionManufacturing as ExcavationIcon,
    Layers as PCCIcon,
    Anchor as AnchorIcon,
    LocalShipping as PouringIcon,
    Plumbing as ConduitIcon,
    CheckCircle as CompletedIcon
} from "@mui/icons-material";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import {
    alpha
} from "@mui/material/styles";
import {
    StyledCard,
    ProgressBar,
    StatusChip
} from "./FoundationStyles";

// const MetricCard = ({ icon, title, value, trend, color, subtitle }) => {
//   const cardColor = color || '#667eea';

//   return (
//     <StyledCard>
//       <CardContent sx={{ p: 2 }}>
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
//           <Box display="flex" alignItems="center" gap={1}>
//             <Avatar sx={{ bgcolor: alpha(cardColor, 0.1), color: cardColor, width: 36, height: 36 }}>
//               {icon}
//             </Avatar>
//             <Typography variant="body2" color="textSecondary">
//               {title}
//             </Typography>
//           </Box>
//           {trend && (
//             <Chip
//               size="small"
//               icon={trend > 0 ? <TrendingUpIcon sx={{ fontSize: '0.875rem' }} /> : <TrendingDownIcon sx={{ fontSize: '0.875rem' }} />}
//               label={`${Math.abs(trend)}%`}
//               color={trend > 0 ? "success" : "error"}
//               variant="outlined"
//               sx={{ height: 20, fontSize: '0.625rem' }}
//             />
//           )}
//         </Box>
//         <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
//           {value}
//         </Typography>
//         {subtitle && (
//           <Typography variant="caption" color="textSecondary">
//             {subtitle}
//           </Typography>
//         )}
//       </CardContent>
//     </StyledCard>
//   );
// };


const MetricCard = ({
    icon,
    title,
    value,
    trend,
    color,
    totalScope = 100
}) => {
    const cardColor = color || '#667eea';

    // 1. Convert value to a clean number for the ring
    const displayValue = typeof value === 'string' ? parseFloat(value) : value;
    const progressPercent = typeof value === 'string' && value.includes('%') ?
        displayValue :
        (displayValue / totalScope) * 100;

    // 2. Ensure trend is treated as a number
    const trendValue = parseFloat(trend);

    return ( <
        StyledCard sx = {
            {
                height: '100%'
            }
        } >
        <
        CardContent sx = {
            {
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }
        } >
        <
        Stack direction = "row"
        spacing = {
            1
        }
        alignItems = "center"
        mb = {
            2
        } >
        <
        Avatar sx = {
            {
                bgcolor: alpha(cardColor, 0.1),
                color: cardColor,
                width: 28,
                height: 28
            }
        } > {
            React.cloneElement(icon, {
                sx: {
                    fontSize: '1rem'
                }
            })
        } <
        /Avatar> <
        Typography variant = "caption"
        fontWeight = {
            700
        }
        color = "textSecondary"
        sx = {
            {
                textTransform: 'uppercase'
            }
        } > {
            title
        } <
        /Typography> <
        /Stack>

        <
        Box sx = {
            {
                position: 'relative',
                display: 'inline-flex',
                mb: 1
            }
        } >
        <
        CircularProgress variant = "determinate"
        value = {
            100
        }
        size = {
            100
        }
        thickness = {
            4
        }
        sx = {
            {
                color: '#F5F5F5'
            }
        }
        /> <
        CircularProgress variant = "determinate"
        value = {
            progressPercent > 100 ? 100 : progressPercent
        }
        size = {
            100
        }
        thickness = {
            4
        }
        sx = {
            {
                color: cardColor,
                position: 'absolute',
                left: 0,
                strokeLinecap: 'round',
                // Smooth ring fill
                '& .MuiCircularProgress-circle': {
                    transition: 'stroke-dashoffset 0.8s cubic-bezier(0, 0, 0.2, 1)',
                },
            }
        }
        /> <
        Box sx = {
            {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }
        } >
        <
        Typography variant = "h5"
        fontWeight = "bold"
        sx = {
            {
                color: '#1A237E',
                lineHeight: 1
            }
        } > {
            value
        } <
        /Typography>

        { /* DYNAMIC TREND LOGIC */ } {
            trendValue !== 0 && !isNaN(trendValue) && ( <
                Stack direction = "row"
                alignItems = "center"
                sx = {
                    {
                        mt: 0.5
                    }
                } > {
                    trendValue > 0 ?
                    <
                    TrendingUpIcon sx = {
                        {
                            fontSize: 14,
                            color: 'success.main'
                        }
                    }
                    /> : <
                    TrendingDownIcon sx = {
                        {
                            fontSize: 14,
                            color: 'error.main'
                        }
                    }
                    />
                } <
                Typography variant = "caption"
                fontWeight = "bold"
                sx = {
                    {
                        color: trendValue > 0 ? 'success.main' : 'error.main'
                    }
                } >
                {
                    Math.abs(trendValue).toFixed(1)
                } %
                <
                /Typography> <
                /Stack>
            )
        } <
        /Box> <
        /Box> <
        /CardContent> <
        /StyledCard>
    );
};

const getActivityIcon = (type) => {
    switch (type) {
        case 'foundation':
            return <FoundationIcon sx = {
                {
                    fontSize: '1rem'
                }
            }
            />;
        case 'pouring':
            return <PouringIcon sx = {
                {
                    fontSize: '1rem'
                }
            }
            />;
        case 'excavation':
            return <ExcavationIcon sx = {
                {
                    fontSize: '1rem'
                }
            }
            />;
        case 'soil':
            return <SoilIcon sx = {
                {
                    fontSize: '1rem'
                }
            }
            />;
        case 'anchor':
            return <AnchorIcon sx = {
                {
                    fontSize: '1rem'
                }
            }
            />;
        case 'conduit':
            return <ConduitIcon sx = {
                {
                    fontSize: '1rem'
                }
            }
            />;
        case 'pcc':
            return <PCCIcon sx = {
                {
                    fontSize: '1rem'
                }
            }
            />;
        case 'reinforcement':
            return <PrecisionManufacturingIcon sx = {
                {
                    fontSize: '1rem'
                }
            }
            />;
        default:
            return <CompletedIcon sx = {
                {
                    fontSize: '1rem'
                }
            }
            />;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString();
    } catch {
        return 'Invalid Date';
    }
};

const FoundationHeader = ({
    statistics,
    progressData,
    recentActivities,
    onRefresh
}) => {
    const totalActivities = Object.values(statistics.completedStages).reduce((a, b) => a + b, 0);


    return ( <
        Box mb = {
            3
        } >

        { /* Statistics Cards */ } {
            /* <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricCard
                        icon={<FoundationIcon />}
                        title="Completed Foundations"
                        value={statistics.totalFoundations}
                        trend={+12}
                        color="#667eea"
                        subtitle={`${statistics.totalFoundations} of ${statistics.totalTurbines} turbines fully completed`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricCard
                        icon={<SpeedIcon />}
                        title="Overall Progress"
                        value={`${statistics.completionRate}%`}
                        trend={+5}
                        color="#4CAF50"
                        subtitle="Stage-wise completion rate"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricCard
                        icon={<AssessmentIcon />}
                        title="Completed Activities"
                        value={Object.values(statistics.completedStages).reduce((a, b) => a + b, 0)}
                        trend={-2}
                        color="#FF9800"
                        subtitle="Across all stages"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricCard
                        icon={<WarningIcon />}
                        title="Pending Foundations"
                        value={statistics.pendingFoundations}
                        trend={-8}
                        color="#f44336"
                        subtitle={`${statistics.pendingFoundations} turbines not fully completed`}
                      />
                    </Grid>
                  </Grid> */
        } { /* Statistics Cards with Rings */ } <
        Grid container spacing = {
            2
        } > { /* 1. Completed Foundations */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        }
        md = {
            3
        } >
        <
        MetricCard icon = { < FoundationIcon / >
        }
        title = "Completed Foundations"
        value = {
            statistics.totalFoundations
        }
        totalScope = {
            statistics.totalTurbines
        }
        // Since we don't have "yesterday's" data, we show overall % progress as trend
        trend = {
            ((statistics.totalFoundations / statistics.totalTurbines) * 100).toFixed(1)
        }
        color = "#667eea" /
        >
        <
        /Grid>

        { /* 2. Overall Progress Rate */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        }
        md = {
            3
        } >
        <
        MetricCard icon = { < SpeedIcon / >
        }
        title = "Overall Progress"
        value = {
            `${statistics.completionRate}%`
        }
        // Trend is the same as value here since value is already a %
        trend = {
            statistics.completionRate
        }
        color = "#4CAF50" /
        >
        <
        /Grid>

        { /* 3. Soil Evaluations (Highest Activity) */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        }
        md = {
            3
        } >
        <
        MetricCard icon = { < AssessmentIcon / >
        }
        title = "Soil Evaluations"
        value = {
            statistics.completedStages.soil
        }
        totalScope = {
            statistics.totalTurbines
        }
        trend = {
            ((statistics.completedStages.soil / statistics.totalTurbines) * 100).toFixed(1)
        }
        color = "#FF9800" /
        >
        <
        /Grid>

        { /* 4. Pending Foundations */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        }
        md = {
            3
        } >
        <
        MetricCard icon = { < WarningIcon / >
        }
        title = "Pending Foundations"
        value = {
            statistics.pendingFoundations
        }
        totalScope = {
            statistics.totalTurbines
        }
        // Trend for pending is negative (remaining work)
        trend = {-((statistics.pendingFoundations / statistics.totalTurbines) * 100).toFixed(1)
        }
        color = "#f44336" /
        >
        <
        /Grid> <
        /Grid>

        { /* Progress Section */ } <
        Grid container spacing = {
            2
        }
        mt = {
            0
        } >
        <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        StyledCard >
        <
        CardContent >
        <
        Typography variant = "subtitle1"
        fontWeight = "600"
        gutterBottom >
        Foundation Stages completed Count <
        /Typography> <
        Stack spacing = {
            2
        } > {
            progressData.map((stage) => {
                const progressValue = stage.total > 0 ? (stage.completed / stage.total) * 100 : 0;
                return ( <
                    Box key = {
                        stage.name
                    } >
                    <
                    Box display = "flex"
                    justifyContent = "space-between"
                    alignItems = "center"
                    mb = {
                        1
                    } >
                    <
                    Typography variant = "body2"
                    sx = {
                        {
                            color: 'text.secondary',
                            fontWeight: 500
                        }
                    } > {
                        stage.name
                    } <
                    /Typography>

                    { /* HIGHLIGHTED QUANTITY SECTION */ } <
                    Box sx = {
                        {
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 0.5
                        }
                    } >
                    <
                    Typography variant = "h6"
                    sx = {
                        {
                            color: stage.color, // Matches the bar color
                            fontWeight: 800,
                            lineHeight: 1,
                            fontSize: '1.1rem'
                        }
                    } >
                    {
                        stage.completed
                    }
                    /{statistics.totalTurbines} <
                    /Typography>

                    <
                    /Box> <
                    /Box> <
                    ProgressBar variant = "determinate"
                    value = {
                        progressValue
                    }
                    barColor = {
                        stage.color
                    }
                    /> <
                    /Box>
                );
            })
        } <
        /Stack> <
        /CardContent> <
        /StyledCard> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        StyledCard >
        <
        CardContent >
        <
        Typography variant = "subtitle1"
        fontWeight = "600"
        gutterBottom >
        Recent Activities <
        /Typography> <
        Stack spacing = {
            2
        } > {
            recentActivities.length > 0 ? (
                recentActivities.map((activity) => ( <
                    Box key = {
                        activity.id
                    }
                    display = "flex"
                    alignItems = "center"
                    gap = {
                        1
                    } >
                    <
                    Avatar sx = {
                        {
                            width: 28,
                            height: 28,
                            bgcolor: alpha('#667eea', 0.1),
                            color: '#667eea'
                        }
                    } >
                    {
                        getActivityIcon(activity.type)
                    } <
                    /Avatar> <
                    Box flex = {
                        1
                    } >
                    <
                    Typography variant = "body2"
                    fontWeight = "500" > {
                        activity.activity
                    } - {
                        activity.turbine
                    } <
                    /Typography> <
                    Typography variant = "caption"
                    color = "textSecondary" > {
                        formatDate(activity.date)
                    } <
                    /Typography> <
                    /Box> <
                    StatusChip size = "small"
                    label = {
                        activity.status === 'completed' ? 'Done' : activity.status === 'in_progress' ? 'In Progress' : 'Pending'
                    }
                    status = {
                        activity.status
                    }
                    sx = {
                        {
                            height: 20
                        }
                    }
                    /> <
                    /Box>
                ))
            ) : ( <
                Typography variant = "body2"
                color = "textSecondary"
                align = "center" >
                No recent activities <
                /Typography>
            )
        } <
        /Stack> <
        /CardContent> <
        /StyledCard> <
        /Grid> <
        /Grid> <
        /Box>
    );
};

export default FoundationHeader;