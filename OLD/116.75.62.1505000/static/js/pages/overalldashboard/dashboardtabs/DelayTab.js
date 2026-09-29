import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    LinearProgress,
    Avatar,
    Stack,
} from "@mui/material";
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area,
    Label,
    ReferenceLine,
    LabelList
} from 'recharts';
import {
    getDelaySummary
} from "../../../Redux/DashboardData/dashboardAction";
import LocationFilterBar from '../../../components/LocationFilterBar';
import TurbineDelayDrilldown from './delayDashboard/TurbineDelayDrilldown';
import PlannedVsActualChart from './PlannedVsActualChart';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const formatTooltip = (value) => [`${value} Days`, "Impact"];

const DelayTab = ({
    turbineList
}) => {
    const dispatch = useDispatch();
    const {
        delaySummary,
        summaryLoading
    } = useSelector((state) => state.dashboardData);
    const [selectedTurbine, setSelectedTurbine] = useState("");

    const [filters, setFilters] = useState({
        project: "1",
        windfarm: "",
        cluster: "",
    });

    // useEffect(() => {
    //   if (turbineList?.length > 0 && !selectedTurbine) {
    //     setSelectedTurbine(String(turbineList[3].turbine_id));
    //   }
    // }, [turbineList]);

    const filteredTurbines = useMemo(() => {
        if (!turbineList || !Array.isArray(turbineList)) return [];

        return turbineList.filter((t) => {
            // Convert both to String to safely compare Number vs String
            const matchesProject = filters.project ?
                String(t.project_id) === String(filters.project) :
                true;

            const matchesWindfarm = filters.windfarm ?
                String(t.windfarm_id) === String(filters.windfarm) :
                true;

            const matchesCluster = filters.cluster ?
                String(t.cluster_id) === String(filters.cluster) :
                true;

            return matchesProject && matchesWindfarm && matchesCluster;
        });
    }, [turbineList, filters]);

    console.log("Original turbineList:", turbineList);
    console.log("Current filters:", filters);
    console.log("Filtered turbines result:", filteredTurbines);

    useEffect(() => {
        const apiFilters = {
            project: filters.project,
            windfarm: filters.windfarm,
            cluster: filters.cluster,
        };
        dispatch(getDelaySummary(apiFilters));
    }, [dispatch, filters]);

    const {
        summary = {},
            cause_distribution = [],
            turbine_drilldown = [],
            project_delays = [],
            windfarm_delays = [],
            monthly_trend = []
    } = delaySummary || {};


    const averageProjectDelay = useMemo(() => {
        if (!project_delays.length) return 0;
        const total = project_delays.reduce((sum, item) => sum + item.days, 0);
        return Math.round(total / project_delays.length);
    }, [project_delays]);

    if (summaryLoading && !turbine_drilldown.length) {
        return <LinearProgress sx = {
            {
                mt: 5,
                borderRadius: 2
            }
        }
        />;
    }

    return ( <
        Box > { /* HEADER SECTION */ } <
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
            3
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
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #F44336 0%, #D32F2F 100%)",
                boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
            }
        } >
        <
        RunningWithErrorsIcon sx = {
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
        }
        sx = {
            {
                color: "#00416A"
            }
        } >
        Delay Analysis Dashboard <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        Detailed bottleneck tracking and root cause analysis <
        /Typography> <
        /Box> <
        /Stack> <
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
        /Box>

        <
        Grid container spacing = {
            3
        } > { /* KPI: Total Impact */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        Card elevation = {
            0
        }
        sx = {
            {
                border: "1px solid #e0e0e0",
                borderRadius: 3,
                height: "100%",
                display: "flex",
                alignItems: "center",
            }
        } >
        <
        CardContent sx = {
            {
                width: "100%"
            }
        } >
        <
        Typography color = "textSecondary"
        variant = "overline"
        fontWeight = {
            700
        } >
        Cumulative Loss <
        /Typography> <
        Typography variant = "h2"
        fontWeight = {
            800
        }
        color = "error.main"
        sx = {
            {
                my: 1
            }
        } >
        {
            summary.total_days || 0
        } <
        /Typography> <
        Typography variant = "body2"
        color = "textSecondary"
        fontWeight = {
            500
        } >
        Across < b > {
            summary.total_incidents || 0
        } < /b> delay incidents <
        /Typography> <
        /CardContent> <
        /Card> <
        /Grid>

        { /* CHART: Monthly Trend (The New Area Chart) */ } <
        Grid item xs = {
            12
        }
        md = {
            8
        } >
        <
        Paper sx = {
            {
                p: 3,
                borderRadius: 3,
                border: "1px solid #e0e0e0"
            }
        }
        elevation = {
            0
        } >
        <
        Typography variant = "subtitle1"
        fontWeight = {
            700
        }
        gutterBottom >
        Monthly Delay Trend(Days Lost) <
        /Typography> <
        Box sx = {
            {
                height: 200
            }
        } >
        <
        ResponsiveContainer width = "100%"
        height = "100%" >
        <
        AreaChart data = {
            monthly_trend
        }
        margin = {
            {
                top: 10,
                right: 30,
                left: 20,
                bottom: 20
            }
        } >
        <
        defs >
        <
        linearGradient id = "colorDays"
        x1 = "0"
        y1 = "0"
        x2 = "0"
        y2 = "1" >
        <
        stop offset = "5%"
        stopColor = "#ef4444"
        stopOpacity = {
            0.2
        }
        /> <
        stop offset = "95%"
        stopColor = "#ef4444"
        stopOpacity = {
            0
        }
        /> <
        /linearGradient> <
        /defs> <
        CartesianGrid strokeDasharray = "3 3"
        vertical = {
            false
        }
        stroke = "#f0f0f0" /
        >
        <
        XAxis dataKey = "month"
        tick = {
            {
                fontSize: 11
            }
        }
        label = {
            {
                value: "Timeline",
                position: "insideBottom",
                offset: -10,
                fontSize: 12,
                fontWeight: 600,
            }
        }
        /> <
        YAxis tick = {
            {
                fontSize: 11
            }
        }
        label = {
            {
                value: "Days Lost",
                angle: -90,
                position: "insideLeft",
                fontSize: 12,
                fontWeight: 600,
            }
        }
        /> <
        Tooltip formatter = {
            formatTooltip
        }
        contentStyle = {
            {
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }
        }
        /> <
        Area type = "monotone"
        dataKey = "days"
        stroke = "#ef4444"
        fillOpacity = {
            1
        }
        fill = "url(#colorDays)"
        strokeWidth = {
            3
        }
        /> <
        /AreaChart> <
        /ResponsiveContainer> <
        /Box> <
        /Paper> <
        /Grid>

        { /* SECOND ROW: Project & Windfarm Breakdown */ } <
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
                border: "1px solid #e0e0e0"
            }
        }
        elevation = {
            0
        } >
        <
        Typography variant = "subtitle1"
        fontWeight = {
            700
        }
        gutterBottom >
        Delays by Project <
        /Typography> <
        Box sx = {
            {
                height: 250
            }
        } >
        <
        ResponsiveContainer width = "100%"
        height = "100%" >
        <
        BarChart data = {
            project_delays
        }
        margin = {
            {
                top: 20,
                right: 30,
                left: 20,
                bottom: 30
            }
        } >
        <
        CartesianGrid strokeDasharray = "3 3"
        vertical = {
            false
        }
        stroke = "#f0f0f0" /
        >
        <
        XAxis dataKey = "name"
        tick = {
            {
                fontSize: 11
            }
        }
        label = {
            {
                value: "Projects",
                position: "insideBottom",
                offset: -15,
                fontWeight: 600,
            }
        }
        /> <
        YAxis label = {
            {
                value: "Days",
                angle: -90,
                position: "insideLeft",
                fontWeight: 600,
            }
        }
        /> <
        Tooltip formatter = {
            (value) => [`${value} Days`, "Impact"]
        }
        />

        { /* THE COMPARATIVE LINE */ } <
        ReferenceLine y = {
            averageProjectDelay
        }
        stroke = "#ff7300"
        strokeDasharray = "5 5"
        strokeWidth = {
            2
        } >
        <
        Label value = {
            `Avg: ${averageProjectDelay}d`
        }
        position = "right"
        fill = "#ff7300"
        style = {
            {
                fontSize: "10px",
                fontWeight: 700
            }
        }
        /> <
        /ReferenceLine>

        <
        Bar dataKey = "days"
        fill = "#6366f1"
        radius = {
            [4, 4, 0, 0]
        }
        barSize = {
            40
        }
        /> <
        /BarChart> <
        /ResponsiveContainer> <
        /Box> <
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
                p: 3,
                borderRadius: 3,
                border: "1px solid #e0e0e0"
            }
        }
        elevation = {
            0
        } >
        <
        Typography variant = "subtitle1"
        fontWeight = {
            700
        }
        gutterBottom >
        Delays by Windfarm <
        /Typography> <
        Box sx = {
            {
                height: 250
            }
        } >
        <
        ResponsiveContainer width = "100%"
        height = "100%" >
        <
        BarChart data = {
            windfarm_delays
        } >
        <
        XAxis dataKey = "name"
        tick = {
            {
                fontSize: 10,
                angle: -15,
                textAnchor: "end"
            }
        }
        /> <
        YAxis / >
        <
        Tooltip cursor = {
            {
                fill: "transparent"
            }
        }
        /> <
        Bar dataKey = "days"
        fill = "#10b981"
        radius = {
            [4, 4, 0, 0]
        }
        barSize = {
            40
        }
        /> <
        /BarChart> <
        /ResponsiveContainer> <
        /Box> <
        /Paper> <
        /Grid>

        { /* THIRD ROW: Cause Distribution */ } <
        Grid item xs = {
            12
        } >
        <
        Paper sx = {
            {
                p: 3,
                borderRadius: 3,
                border: "1px solid #e0e0e0"
            }
        }
        elevation = {
            0
        } >
        <
        Typography variant = "subtitle1"
        fontWeight = {
            700
        }
        gutterBottom >
        Impact Breakdown by Root Cause <
        /Typography> <
        Box sx = {
            {
                height: 250,
                mt: 2
            }
        } > {
            " "
        } { /* Increased height slightly to fit labels */ } <
        ResponsiveContainer width = "100%"
        height = "100%" >
        <
        BarChart data = {
            cause_distribution
        }
        layout = "vertical"
        margin = {
            {
                right: 60
            }
        } // Extra margin on the right so labels don't get cut off
        >
        <
        CartesianGrid strokeDasharray = "3 3"
        horizontal = {
            false
        }
        stroke = "#f0f0f0" /
        >
        <
        XAxis type = "number"
        hide / >
        <
        YAxis dataKey = "name"
        type = "category"
        width = {
            180
        }
        tick = {
            {
                fontSize: 11,
                fontWeight: 600
            }
        }
        /> <
        Tooltip cursor = {
            {
                fill: "transparent"
            }
        }
        formatter = {
            (val) => [`${val} Days`, "Delay"]
        }
        />

        <
        Bar dataKey = "value"
        radius = {
            [0, 4, 4, 0]
        }
        barSize = {
            24
        } > {
            cause_distribution.map((entry, index) => ( <
                Cell key = {
                    `cell-${index}`
                }
                fill = {
                    COLORS[index % COLORS.length]
                }
                />
            ))
        }

        { /* --- ADD THIS SECTION --- */ } <
        LabelList dataKey = "value"
        position = "right" // Places it at the end of the bar
        formatter = {
            (value) => `${value} Days`
        }
        style = {
            {
                fontSize: "12px",
                fontWeight: 700,
                fill: "#333",
            }
        }
        /> <
        /Bar> <
        /BarChart> <
        /ResponsiveContainer> <
        /Box> <
        /Paper> <
        /Grid> <
        Grid item xs = {
            12
        } >
        <
        PlannedVsActualChart turbineList = {
            filteredTurbines
        }
        selectedTurbine = {
            selectedTurbine
        }
        setSelectedTurbine = {
            setSelectedTurbine
        }
        selectedProject = {
            filters.project
        }
        selectedWindfarm = {
            filters.windfarm
        }
        /> <
        /Grid>

        { /* BOTTOM SECTION: The Drill-Down */ } <
        Grid item xs = {
            12
        } >
        <
        TurbineDelayDrilldown data = {
            turbine_drilldown
        }
        /> <
        /Grid> <
        /Grid> <
        /Box>
    );
};

export default DelayTab;