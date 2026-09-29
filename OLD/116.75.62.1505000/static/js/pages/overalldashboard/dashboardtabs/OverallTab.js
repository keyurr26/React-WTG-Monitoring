import React, {
    useEffect,
    useState
} from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    Stack,
    Chip,
    LinearProgress,
    Avatar,
} from "@mui/material";
import {
    DashboardIcon,
    RoadIcon,
    FoundationIcon,
    ElectricalIcon,
    SettingsIcon,
} from "../TabIcons";
import WindPowerIcon from "@mui/icons-material/WindPower";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";
import LocationFilterBar from "../../../components/LocationFilterBar";
import DashboardLoader from "./DashboardLoader";

// --- 1. Needle Helper Logic ---
const RADIAN = Math.PI / 180;

const renderNeedle = (value, data, cx, cy, iR, oR, color) => {
    let total = 0;
    data.forEach((v) => {
        total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx;
    const y0 = cy;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [ <
        circle key = "c"
        cx = {
            x0
        }
        cy = {
            y0
        }
        r = {
            r
        }
        fill = "#333"
        stroke = "none" / > , <
        path
        key = "p"
        d = {
            `M${x0 - r * sin} ${y0 + r * cos}L${x0 + r * sin} ${y0 - r * cos}L${xp} ${yp}Z`
        }
        fill = "#333"
        stroke = "none" /
        > ,
    ];
};

// --- 2. Updated SummaryTile Component ---
const SummaryTile = ({
    label,
    value,
    color,
    progress,
    completed,
    total,
    subStats = [],
}) => {
    const gradientId = `gradient-${label.replace(/\s+/g, "-")}`;

    const safeSubStats = Array.isArray(subStats) ? subStats : [];

    return ( <
        Paper elevation = {
            0
        }
        sx = {
            {
                p: 2,
                borderRadius: 4,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                transition: "0.3s",
                minHeight: 160,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                },
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }
        } >
        <
        Box >
        <
        Typography variant = "body2"
        color = "text.secondary"
        fontWeight = {
            600
        }
        sx = {
            {
                fontSize: "0.8rem",
                textTransform: "uppercase"
            }
        } >
        {
            label
        } <
        /Typography> <
        Typography variant = "h4"
        fontWeight = {
            800
        }
        sx = {
            {
                color: color,
                mt: 0.5
            }
        } >
        {
            value
        } <
        /Typography> {
            total !== undefined && total !== null && ( <
                Typography variant = "caption"
                color = "text.secondary"
                sx = {
                    {
                        display: "block",
                        mt: 0.5,
                        fontWeight: 700
                    }
                } >
                {
                    completed
                }
                / {total} Done <
                /Typography>
            )
        } <
        /Box>

        <
        Box sx = {
            {
                width: 100,
                height: 80
            }
        } >
        <
        ResponsiveContainer width = "100%"
        height = "100%" >
        <
        PieChart >
        <
        defs >
        <
        linearGradient id = {
            gradientId
        }
        x1 = "0%"
        y1 = "0%"
        x2 = "100%"
        y2 = "0%" >
        <
        stop offset = "0%"
        stopColor = {
            color
        }
        stopOpacity = {
            0.3
        }
        /> <
        stop offset = "100%"
        stopColor = {
            color
        }
        stopOpacity = {
            1
        }
        /> <
        /linearGradient> <
        /defs> <
        Pie dataKey = "value"
        startAngle = {
            180
        }
        endAngle = {
            0
        }
        data = {
            [{
                value: 100
            }]
        }
        cx = "50%"
        cy = "80%"
        innerRadius = {
            28
        }
        outerRadius = {
            42
        }
        stroke = "none" >
        <
        Cell fill = {
            `url(#${gradientId})`
        }
        /> <
        /Pie> {
            renderNeedle(progress, [{
                value: 100
            }], 50, 64, 28, 42, "#333")
        } <
        /PieChart> <
        /ResponsiveContainer> <
        /Box> <
        /Box>

        <
        Stack direction = "row"
        spacing = {
            0.5
        }
        flexWrap = "wrap"
        sx = {
            {
                mt: 0.5
            }
        } > {
            safeSubStats.map((stat, i) => ( <
                Chip key = {
                    i
                }
                label = {
                    stat
                }
                size = "small"
                sx = {
                    {
                        fontSize: "0.8rem",
                        height: 30,
                        bgcolor: `${color}15`,
                        color: color,
                        fontWeight: 600,
                        border: `1px solid ${color}30`,
                    }
                }
                />
            ))
        } <
        /Stack> <
        /Paper>
    );
};

// --- 3. Helper Functions for Road Data ---
const calculateRoadMetrics = (roadData) => {
    if (!roadData || roadData.length === 0) {
        return {
            totalRoadKm: 0,
            completedKm: 0,
            overallProgress: 0,
            remainingKm: 0,
            mainRoads: {
                total: 0,
                completed: 0,
                progress: 0
            },
            approachRoads: {
                total: 0,
                completed: 0,
                progress: 0
            },
            accessRoads: {
                total: 0,
                completed: 0,
                progress: 0
            },
            levels: [],
        };
    }

    let totalDistance = 0;
    let completedDistance = 0;
    let mainTotal = 0,
        mainCompleted = 0;
    let approachTotal = 0,
        approachCompleted = 0;
    let accessTotal = 0,
        accessCompleted = 0;

    roadData.forEach((road) => {
        const distance = parseFloat(road.plan_distance_km) || 0;
        const completed = parseFloat(road.actual_completed_qty) || 0;

        totalDistance += distance;
        completedDistance += completed;

        if (road.road_type === "main") {
            mainTotal += distance;
            mainCompleted += completed;
        } else if (road.road_type === "approach") {
            approachTotal += distance;
            approachCompleted += completed;
        } else if (road.road_type === "access") {
            accessTotal += distance;
            accessCompleted += completed;
        }
    });

    const overallProgress =
        totalDistance > 0 ? (completedDistance / totalDistance) * 100 : 0;

    const levels = [{
            level: "Main Roads",
            total: mainTotal,
            completed: mainCompleted,
            percentage: mainTotal > 0 ? Math.round((mainCompleted / mainTotal) * 100) : 0,
            color: "#4CAF50",
        },
        {
            level: "Approach Roads",
            total: approachTotal,
            completed: approachCompleted,
            percentage: approachTotal > 0 ?
                Math.round((approachCompleted / approachTotal) * 100) :
                0,
            color: "#FF9800",
        },
        {
            level: "Access Roads",
            total: accessTotal,
            completed: accessCompleted,
            percentage: accessTotal > 0 ? Math.round((accessCompleted / accessTotal) * 100) : 0,
            color: "#2196F3",
        },
    ];

    return {
        totalRoadKm: totalDistance,
        completedKm: completedDistance,
        remainingKm: totalDistance - completedDistance,
        overallProgress: Math.round(overallProgress),
        mainRoads: {
            total: mainTotal,
            completed: mainCompleted,
            progress: mainTotal > 0 ? Math.round((mainCompleted / mainTotal) * 100) : 0,
        },
        approachRoads: {
            total: approachTotal,
            completed: approachCompleted,
            progress: approachTotal > 0 ?
                Math.round((approachCompleted / approachTotal) * 100) :
                0,
        },
        accessRoads: {
            total: accessTotal,
            completed: accessCompleted,
            progress: accessTotal > 0 ? Math.round((accessCompleted / accessTotal) * 100) : 0,
        },
        levels: levels,
    };
};

const calculateUSSMetrics = (ussData) => {
    if (!ussData) {
        // console.log('USS Data is null or undefined');
        return {
            totalUSS: 0,
            submitted: 0,
            approved: 0,
            pending: 0,
            approvalPending: 0,
            notSubmitted: 0,
            completedUSS: 0,
            totalActivities: 0,
            completedActivities: 0,
            completionPercentage: 0,
            activityProgress: [],
            stats: ["No USS data"],
        };
    }

    const data = ussData.total_uss !== undefined ? ussData : ussData.data;

    if (!data || data.total_uss === undefined) {
        // console.log('USS Data structure invalid:', ussData);
        return {
            totalUSS: 0,
            submitted: 0,
            approved: 0,
            pending: 0,
            approvalPending: 0,
            notSubmitted: 0,
            completedUSS: 0,
            totalActivities: 0,
            completedActivities: 0,
            completionPercentage: 0,
            activityProgress: [],
            stats: ["No USS data"],
        };
    }

    // console.log('USS Data processed:', data);

    const activityProgress = data.activity_progress || [];
    const topActivities = activityProgress
        .slice(0, 4)
        .map((act) => `${act.activity}: ${Math.round(act.percentage)}%`);

    const stats = [
        `Total USS: ${data.total_uss || 0}`,
        `Submitted: ${data.submitted || 0}`,
        `Approved: ${data.approved || 0}`,
        `Completed USS: ${data.completed_uss || 0}`,
        `Pending: ${data.pending || 0}`,
        `Not Submitted: ${data.not_submitted || 0}`,
        `Approval Pending: ${data.approval_pending || 0}`,
        ...topActivities,
    ].slice(0, 6);

    return {
        totalUSS: data.total_uss || 0,
        submitted: data.submitted || 0,
        approved: data.approved || 0,
        pending: data.pending || 0,
        approvalPending: data.approval_pending || 0,
        notSubmitted: data.not_submitted || 0,
        completedUSS: data.completed_uss || 0,
        totalActivities: data.total_activities || 0,
        completedActivities: data.completed_activities || 0,
        completionPercentage: data.completion_percentage || 0,
        activityProgress: activityProgress,
        stats: stats,
    };
};

// ✅ NEW: Calculate Electrical Metrics with proper percentage
// const calculateElectricalMetrics = (electricalData) => {
//   if (!electricalData || !electricalData.overview) {
//     return {
//       completionPercent: 0,
//       totalLines: 0,
//       totalKm: 0,
//       totalPoles: 0,
//       completedLines: 0,
//       pendingLines: 0,
//       inProgressLines: 0,
//       calculatedLines: 0,
//       pendingCalculatedLines: 0,
//       linePoles: 0,
//       cutPoles: 0,
//       lineTypes: {},
//       towerTypes: {},
//       submitted: 0,
//       submittedL1: 0,
//       submittedL2: 0,
//       submittedL3: 0,
//       approved: 0,
//       approvedL1: 0,
//       approvedL2: 0,
//       approvedL3: 0,
//       stats: ['No electrical data']
//     };
//   }

//   const overview = electricalData.overview || {};
//   const lineStatus = electricalData.line_status || {};
//   const lineSummary = electricalData.line_summary || {};
//   const poleSummary = electricalData.pole_summary || {};
//   const submissionSummary = electricalData.submission_summary || {};
//   const approvalSummary = electricalData.approval_summary || {};
//   const lineTypeSummary = electricalData.line_type_summary || {};
//   const towerTypeSummary = electricalData.tower_type_summary || {};

//   // ✅ Calculate completion percentage based on line status
//   const totalLines = lineStatus.pending + lineStatus.inprogress + lineStatus.completed || overview.total_lines || 0;
//   const completedLines = lineStatus.completed || 0;
//   const inProgressLines = lineStatus.inprogress || 0;
//   const pendingLines = lineStatus.pending || 0;

//   // ✅ Calculate percentage from line status
//   let completionPercent = 0;
//   if (totalLines > 0) {
//     // Consider in-progress as 50% complete
//     const weightedCompleted = completedLines + (inProgressLines * 0.5);
//     completionPercent = Math.round((weightedCompleted / totalLines) * 100);
//   }

//   // ✅ Alternative: Calculate from submission summary if available
//   const totalSubmitted = submissionSummary.submitted || 0;
//   const totalApproved = approvalSummary.approved || 0;

//   // If we have submission data, use it for additional metrics
//   const submissionBasedProgress = totalLines > 0 ? Math.round((totalSubmitted / totalLines) * 100) : 0;
//   const approvalBasedProgress = totalLines > 0 ? Math.round((totalApproved / totalLines) * 100) : 0;

//   // ✅ Use the best available metric
//   const finalCompletionPercent = completionPercent > 0 ? completionPercent :
//                                  submissionBasedProgress > 0 ? submissionBasedProgress :
//                                  overview.completion_percent || 0;

//   const lineTypeStats = Object.entries(lineTypeSummary)
//     .map(([type, count]) => `${type.split('(')[0].trim()}: ${count}`)
//     .slice(0, 2);

//   const towerTypeStats = Object.entries(towerTypeSummary)
//     .filter(([type]) => type !== 'A' && type !== 'B' && type !== 'C' && type !== 'D')
//     .map(([type, count]) => `Type ${type}: ${count}`)
//     .slice(0, 2);

//   const stats = [
//     `Lines: ${totalLines}`,
//     `Poles: ${overview.total_poles || 0}`,
//     `${overview.total_km || 0} km`,
//     `Completed: ${completedLines}`,
//     `In Progress: ${inProgressLines}`,
//     `Pending: ${pendingLines}`,
//     ...lineTypeStats,
//     ...towerTypeStats,
//     `Submitted: ${totalSubmitted}`,
//     `Approved: ${totalApproved}`
//   ].filter(Boolean);

//   if (stats.length === 0) {
//     stats.push('No data available');
//   }

//   return {
//     completionPercent: finalCompletionPercent,
//     totalLines: totalLines,
//     totalKm: overview.total_km || 0,
//     totalPoles: overview.total_poles || 0,
//     completedLines: completedLines,
//     pendingLines: pendingLines,
//     inProgressLines: inProgressLines,
//     calculatedLines: lineSummary.calculated_lines || 0,
//     pendingCalculatedLines: lineSummary.pending_lines || 0,
//     linePoles: poleSummary.line_pole_total || 0,
//     cutPoles: poleSummary.cut_pole_total || 0,
//     lineTypes: lineTypeSummary,
//     towerTypes: towerTypeSummary,
//     submitted: totalSubmitted,
//     submittedL1: submissionSummary.submitted_l1 || 0,
//     submittedL2: submissionSummary.submitted_l2 || 0,
//     submittedL3: submissionSummary.submitted_l3 || 0,
//     approved: totalApproved,
//     approvedL1: approvalSummary.approved_l1 || 0,
//     approvedL2: approvalSummary.approved_l2 || 0,
//     approvedL3: approvalSummary.approved_l3 || 0,
//     stats: stats.slice(0, 6)
//   };
// };

const calculateElectricalMetrics = (electricalData) => {
    if (!electricalData ? .overview) {
        return {
            completionPercent: 0,
            totalLines: 0,
            completedLines: 0,
            inProgressLines: 0,
            pendingLines: 0,
            totalKm: 0,
            totalPoles: 0,
            stats: ["No electrical data"],
        };
    }

    const overview = electricalData.overview;

    return {
        completionPercent: overview.completed_percentage || 0,

        totalLines: overview.total_lines || 0,
        completedLines: overview.completed_lines || 0,
        inProgressLines: overview.under_execution || 0,
        pendingLines: overview.not_started || 0,

        totalKm: overview.total_km || 0,
        totalPoles: overview.planned_poles || 0,

        stats: [
            `${overview.total_km || 0} km`,
            `${overview.planned_poles || 0} Poles`,
            `Completed: ${overview.completed_lines || 0}`,
            `Under Execution: ${overview.under_execution || 0}`,
            `Not Started: ${overview.not_started || 0}`,
        ],
    };
};

const OverallTab = ({
    statistics,
    wtgData,
    roadDashboard,
    filters,
    setFilters,
    loading,
    turbineList,
    electricalData,
    electricalProgress,
    ussData,
}) => {
    const [selectedTurbine, setSelectedTurbine] = useState("");

    useEffect(() => {
        if (turbineList ? .length > 0 && !selectedTurbine) {
            setSelectedTurbine(String(turbineList[0].turbine_id));
        }
    }, [turbineList]);

    const stats = statistics;
    const totalTarget = stats ? .totalTurbines || 0;
    const foundationsDone = stats ? .totalFoundations || 0;
    const foundationProgress = stats ? .completionRate || 0;

    const wtgMainMetric = wtgData ? .metrics ? .find(
        (m) => m.label === "Turbines Installed" || m.label === "WTG Installed",
    );
    const wtgProgress = wtgMainMetric ? wtgMainMetric.progress : 0;

    let wtgCompleted = 0;
    let wtgTotal = 0;

    if (wtgMainMetric ? .value) {
        const parts = wtgMainMetric.value.split("/");
        wtgCompleted = parseInt(parts[0], 10) || 0;
        wtgTotal = parseInt(parts[1], 10) || 0;
    }

    const roadMetrics = calculateRoadMetrics(roadDashboard);
    const roadProgress = roadMetrics.overallProgress || 0;
    const roadTotalKm = roadMetrics.totalRoadKm || 0;
    const roadCompletedKm = roadMetrics.completedKm || 0;

    const electricalMetrics = calculateElectricalMetrics(electricalData);
    // console.log("Electrical Metrics:", electricalMetrics);

    const ussMetrics = calculateUSSMetrics(ussData);
    // console.log('USS Metrics:', ussMetrics);

    const overallProjectProgress =
        Math.round(
            (foundationProgress +
                wtgProgress +
                roadProgress +
                electricalMetrics.completionPercent +
                ussMetrics.completionPercentage) /
            5,
        ) || 0;

    const dashboardCards = [{
            title: "Overall Progress",
            value: `${overallProjectProgress}%`,
            icon: < DashboardIcon sx = {
                {
                    color: "#667eea"
                }
            }
            />,
            color: "#667eea",
            subtext: "Combined Construction Status",
            progress: overallProjectProgress,
            stats: [
                `Foundations: ${foundationProgress}%`,
                `WTG: ${wtgProgress}%`,
                `Roads: ${roadProgress}%`,
                `Electrical: ${electricalMetrics.completionPercent}%`,
                `USS: ${ussMetrics.completionPercentage}%`,
            ],
        },
        {
            title: "Foundation",
            value: `${foundationProgress}%`,
            icon: < FoundationIcon sx = {
                {
                    color: "#FF9800"
                }
            }
            />,
            color: "#FF9800",
            subtext: `${statistics?.totalFoundations || 0} foundations total`,
            progress: foundationProgress,
            stats: (statistics ? .progressData || [])
                .slice(0, 3)
                .map((p) => `${p.name}: ${p.completed}`),
        },
        {
            title: "WTG Installation",
            value: `${wtgProgress}%`,
            icon: < WindPowerIcon sx = {
                {
                    color: "#2196F3"
                }
            }
            />,
            color: "#2196F3",
            subtext: wtgMainMetric ? .value || "0/0 installed",
            progress: wtgProgress,
            stats: (wtgData ? .activities || [])
                .slice(0, 3)
                .map((act) => `${act.title}: ${act.completed}`),
        },
        {
            title: "Road & Access",
            value: `${roadProgress}%`,
            icon: < RoadIcon sx = {
                {
                    color: "#4CAF50"
                }
            }
            />,
            color: "#4CAF50",
            subtext: `${roadCompletedKm.toFixed(2)} / ${roadTotalKm.toFixed(2)} km completed`,
            progress: roadProgress,
            stats: roadMetrics.levels.map(
                (lvl) => `${lvl.level}: ${lvl.percentage}%`,
            ),
        },
        // {
        //   title: "Electrical",
        //   value: `${electricalMetrics.completionPercent}%`,
        //   icon: <ElectricalIcon sx={{ color: "#9C27B0" }} />,
        //   color: "#9C27B0",
        //   subtext: `${electricalMetrics.completedLines} / ${electricalMetrics.totalLines} lines completed`,
        //   progress: electricalMetrics.completionPercent,
        //   stats: electricalMetrics.stats || ['No data']
        // },

        {
            title: "Electrical",
            value: `${electricalMetrics.completionPercent}%`,
            icon: < ElectricalIcon sx = {
                {
                    color: "#9C27B0"
                }
            }
            />,
            color: "#9C27B0",
            subtext: `${electricalMetrics.completedLines} / ${electricalMetrics.totalLines} Lines Completed`,
            progress: electricalMetrics.completionPercent,
            stats: electricalMetrics.stats || ["No data"],
        },

        {
            title: "USS",
            value: `${ussMetrics.completionPercentage}%`,
            icon: < SettingsIcon sx = {
                {
                    color: "#E91E63"
                }
            }
            />,
            color: "#E91E63",
            subtext: `${ussMetrics.submitted} / ${ussMetrics.totalUSS} submitted`,
            progress: ussMetrics.completionPercentage,
            stats: ussMetrics.stats || ["No data"],
        },
    ];

    return ( <
        Box sx = {
            {
                position: "relative",
                minHeight: "400px"
            }
        } > { /* Global Loading Bar */ } {
            loading && ( <
                LinearProgress sx = {
                    {
                        position: "absolute",
                        top: -20,
                        left: 0,
                        right: 0,
                        height: 4,
                        borderRadius: 2,
                        zIndex: 1000,
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                        "& .MuiLinearProgress-bar": {
                            bgcolor: "#667eea",
                        },
                    }
                }
                />
            )
        }

        {
            loading ? ( <
                DashboardLoader / >
            ) : ( <
                Box > { /* Header Section */ } <
                Box sx = {
                    {
                        mb: 4
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
                alignItems = {
                    {
                        xs: "flex-start",
                        md: "center"
                    }
                }
                spacing = {
                    2
                } >
                <
                Stack direction = "row"
                alignItems = "center"
                spacing = {
                    2.5
                } >
                <
                Avatar sx = {
                    {
                        width: 64,
                        height: 64,
                        background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                        boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
                    }
                } >
                <
                DashboardIcon sx = {
                    {
                        fontSize: 32
                    }
                }
                /> <
                /Avatar> <
                Box >
                <
                Typography variant = "h4"
                fontWeight = {
                    700
                }
                sx = {
                    {
                        mb: 0.5,
                        color: "#00416A"
                    }
                } >
                Overall Summary Dashboard <
                /Typography> <
                Typography variant = "body1"
                color = "text.secondary" >
                Project health monitoring <
                /Typography> <
                /Box> <
                /Stack> <
                Stack direction = "row"
                spacing = {
                    2
                }
                alignItems = "center" >
                <
                Box sx = {
                    {
                        minWidth: {
                            md: 600
                        }
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
                /Stack> <
                /Stack> <
                /Box>

                { /* Top Highlight Tiles */ } <
                Grid container spacing = {
                    3
                }
                sx = {
                    {
                        mb: 4
                    }
                } >
                <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    4
                } >
                <
                SummaryTile label = "Overall Status"
                value = {
                    `${overallProjectProgress}%`
                }
                color = "#667eea"
                progress = {
                    overallProjectProgress
                }
                subStats = {
                    [
                        `Road: ${roadProgress}%`,
                        `Foundations: ${foundationsDone || 0}`,
                        `WTG: ${wtgCompleted || 0}`,
                        `Electrical: ${electricalMetrics.completionPercent || 0}%`,
                        `USS: ${ussMetrics.completionPercentage}%`,
                    ]
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    4
                } >
                <
                SummaryTile label = "Roads Completion"
                value = {
                    `${roadProgress}%`
                }
                color = "#4CAF50"
                progress = {
                    roadProgress
                }
                completed = {
                    roadCompletedKm.toFixed(2)
                }
                total = {
                    `${roadTotalKm.toFixed(2)} km`
                }
                subStats = {
                    roadMetrics.levels.map(
                        (lvl) => `${lvl.level}: ${lvl.percentage}%`,
                    )
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    4
                } >
                <
                SummaryTile label = "WTG Foundations"
                value = {
                    `${foundationProgress}%`
                }
                color = "#FF9800"
                progress = {
                    foundationProgress
                }
                completed = {
                    foundationsDone
                }
                total = {
                    totalTarget
                }
                subStats = {
                    [
                        `Excavation: ${statistics?.completedStages?.excavation || 0}`,
                        `Found Casting: ${statistics?.completedStages?.foundation || 0}`,
                        `Backfilling: ${statistics?.completedStages?.backfilling || 0}`,
                    ]
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    4
                } >
                <
                SummaryTile label = "WTG Status"
                value = {
                    `${wtgProgress}%`
                }
                color = "#2196F3"
                progress = {
                    wtgProgress
                }
                completed = {
                    wtgCompleted
                }
                total = {
                    wtgTotal
                }
                subStats = {
                    (wtgData ? .activities || [])
                    .filter((act) => ["T1 Base", "Nacelle", "Blades"].includes(act.title), )
                    .map((act) => `${act.title}: ${act.completed}`)
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    4
                } > {
                    /* <SummaryTile
                                    label="Electrical"
                                    value={`${electricalMetrics.completionPercent}%`}
                                    color="#9C27B0"
                                    progress={electricalMetrics.completionPercent}
                                    completed={electricalMetrics.completedLines}
                                    total={electricalMetrics.totalLines}
                                    subStats={[
                                      `${electricalMetrics.totalKm} km`,
                                      `${electricalMetrics.totalPoles} poles`,
                                      `In Progress: ${electricalMetrics.inProgressLines}`,
                                      `Submitted: ${electricalMetrics.submitted}`,
                                      `Approved: ${electricalMetrics.approved}`,
                                    ]}
                                  /> */
                }


                <
                SummaryTile label = "Electrical"
                value = {
                    `${electricalMetrics.completionPercent}%`
                }
                color = "#9C27B0"
                progress = {
                    electricalMetrics.completionPercent
                }
                completed = {
                    electricalMetrics.completedLines
                }
                total = {
                    electricalMetrics.totalLines
                }
                subStats = {
                    [
                        `${electricalMetrics.totalKm} km`,
                        `${electricalMetrics.totalPoles} Poles`,
                        `Under Execution: ${electricalMetrics.inProgressLines}`,
                        `Not Started: ${electricalMetrics.pendingLines}`,
                    ]
                }
                />




                <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    4
                } >
                <
                SummaryTile label = "USS"
                value = {
                    `${ussMetrics.completionPercentage}%`
                }
                color = "#E91E63"
                progress = {
                    ussMetrics.completionPercentage
                }
                completed = {
                    ussMetrics.submitted
                }
                total = {
                    ussMetrics.totalUSS
                }
                subStats = {
                    [
                        `Total USS: ${ussMetrics.totalUSS}`,
                        `Submitted: ${ussMetrics.submitted}`,
                        `Approved: ${ussMetrics.approved}`,
                        `Completed: ${ussMetrics.completedUSS}`,
                        `Pending: ${ussMetrics.pending}`,
                        `Not Submitted: ${ussMetrics.notSubmitted}`,
                    ]
                }
                /> <
                /Grid> <
                /Grid>

                { /* Detailed Task Cards */ } <
                Grid container spacing = {
                    3
                } >
                <
                Grid item xs = {
                    12
                }
                md = {
                    12
                } >
                <
                Grid container spacing = {
                    2
                } > {
                    dashboardCards.map((card, index) => {
                        const safeStats = Array.isArray(card.stats) ?
                            card.stats :
                            ["No data"];

                        return ( <
                            Grid item xs = {
                                12
                            }
                            sm = {
                                6
                            }
                            lg = {
                                4
                            }
                            key = {
                                index
                            } >
                            <
                            Card sx = {
                                {
                                    borderRadius: 3,
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: 6,
                                    },
                                    borderLeft: `4px solid ${card.color}`,
                                    height: "100%",
                                }
                            } >
                            <
                            CardContent >
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
                            Box sx = {
                                {
                                    bgcolor: `${card.color}15`,
                                    p: 1,
                                    borderRadius: 2,
                                }
                            } >
                            {
                                card.icon
                            } <
                            /Box> <
                            Box sx = {
                                {
                                    flexGrow: 1
                                }
                            } >
                            <
                            Typography variant = "subtitle2"
                            fontWeight = {
                                700
                            } > {
                                card.title
                            } <
                            /Typography> <
                            Typography variant = "caption"
                            color = "text.secondary" >
                            {
                                card.subtext
                            } <
                            /Typography> <
                            /Box> <
                            Chip label = {
                                card.value
                            }
                            size = "small"
                            sx = {
                                {
                                    bgcolor: card.color,
                                    color: "white",
                                    fontWeight: 700,
                                    fontSize: "0.7rem",
                                }
                            }
                            /> <
                            /Stack>

                            <
                            LinearProgress variant = "determinate"
                            value = {
                                Math.min(card.progress, 100)
                            }
                            sx = {
                                {
                                    height: 6,
                                    borderRadius: 3,
                                    mb: 2,
                                    bgcolor: `${card.color}20`,
                                    "& .MuiLinearProgress-bar": {
                                        bgcolor: card.color,
                                    },
                                }
                            }
                            />

                            <
                            Stack direction = "row"
                            spacing = {
                                1
                            }
                            flexWrap = "wrap"
                            gap = {
                                0.5
                            } >
                            {
                                safeStats.map((stat, i) => ( <
                                    Chip key = {
                                        i
                                    }
                                    label = {
                                        stat
                                    }
                                    size = "small"
                                    sx = {
                                        {
                                            fontSize: "0.6rem",
                                            height: 20,
                                            bgcolor: `${card.color}10`,
                                            color: card.color,
                                        }
                                    }
                                    />
                                ))
                            } <
                            /Stack> <
                            /CardContent> <
                            /Card> <
                            /Grid>
                        );
                    })
                } <
                /Grid> <
                /Grid> <
                /Grid> <
                /Box>
            )
        } <
        /Box>
    );
};

export default OverallTab;