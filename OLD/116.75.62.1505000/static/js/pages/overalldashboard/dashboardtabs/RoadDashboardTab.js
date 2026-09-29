import React, {
    useEffect,
    useState,
    useMemo,
    useCallback
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    getRoadDPRDashboardData
} from "../../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
    CircularProgress,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from "@mui/material";
import {
    GetTurbineFilterData
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";
import RoadStatistics from "./RoadDetails/RoadStatistics";
import RoadDetailsTable from "./RoadDetails/RoadDetailsTable";
// Constants

const COLORS = {
    completed: "#4CAF50",
    inProgress: "#FFA726",
    notStarted: "#9E9E9E",
    primary: "#1a237e",
    background: "#fff",
};

const ROAD_TYPES = ["all", "main", "approach", "access"];

// Custom Hooks
const useFilters = (data, filters) => {
    return useMemo(() => {
        let result = data;
        const {
            project,
            windfarm,
            cluster,
            roadType
        } = filters;

        if (project)
            result = result.filter((r) => r.project_id === Number(project));
        if (windfarm)
            result = result.filter((r) => r.windfarm_id === Number(windfarm));
        if (cluster)
            result = result.filter((r) => r.cluster_id === Number(cluster));
        if (roadType !== "all")
            result = result.filter((r) => r.road_type === roadType);

        return result;
    }, [data, filters]);
};

// Chart Components
const RoadProgressChart = ({
    data,
    height
}) => ( <
    Box sx = {
        {
            width: "100%",
            maxHeight: 500,
            overflowY: "auto",
            pr: 1
        }
    } >
    <
    ResponsiveContainer width = "100%"
    height = {
        height
    } >
    <
    BarChart data = {
        data
    }
    layout = "vertical"
    margin = {
        {
            top: 5,
            right: 30,
            left: 40,
            bottom: 5
        }
    } >
    <
    CartesianGrid strokeDasharray = "3 3" / >
    <
    XAxis type = "number"
    label = {
        {
            value: "Distance (km)",
            position: "insideBottom",
            offset: -5,
        }
    }
    /> <
    YAxis dataKey = "name"
    type = "category"
    tick = {
        {
            fontSize: 11
        }
    }
    width = {
        100
    }
    /> <
    Tooltip formatter = {
        (val, name) => [`${Number(val).toFixed(2)} km`, name]
    }
    contentStyle = {
        {
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
        }
    }
    /> <
    Legend verticalAlign = "top"
    height = {
        36
    }
    /> <
    Bar dataKey = "completed"
    stackId = "a"
    fill = {
        COLORS.completed
    }
    name = "Completed" /
    >
    <
    Bar dataKey = "remaining"
    stackId = "a"
    fill = {
        COLORS.inProgress
    }
    name = "Remaining" /
    >
    <
    /BarChart> <
    /ResponsiveContainer> <
    /Box>
);

const StatusPieChart = ({
    data
}) => ( <
    ResponsiveContainer width = "100%"
    height = {
        300
    } >
    <
    PieChart >
    <
    Pie data = {
        data
    }
    dataKey = "value"
    nameKey = "name"
    innerRadius = {
        60
    }
    outerRadius = {
        80
    }
    label = {
        ({
            name,
            value
        }) => `${name}: ${value}`
    } >
    {
        data.map((entry, index) => ( <
            Cell key = {
                `cell-${index}`
            }
            fill = {
                entry.color
            }
            />
        ))
    } <
    /Pie> <
    Tooltip formatter = {
        (value) => [`${value} roads`, "Count"]
    }
    /> <
    Legend / >
    <
    /PieChart> <
    /ResponsiveContainer>
);

// Filter Component
const FilterSelect = ({
    label,
    value,
    options,
    onChange,
    disabled = false
}) => ( <
    FormControl fullWidth size = "small"
    disabled = {
        disabled
    } >
    <
    InputLabel > {
        label
    } < /InputLabel> <
    Select value = {
        value
    }
    label = {
        label
    }
    onChange = {
        onChange
    } >
    <
    MenuItem value = "" > All {
        label
    }
    s < /MenuItem> {
        options.map((option) => ( <
            MenuItem key = {
                option.id
            }
            value = {
                option.id
            } > {
                option.name
            } <
            /MenuItem>
        ))
    } <
    /Select> <
    /FormControl>
);

// Main Component
const RoadDashboardTab = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const [filters, setFilters] = useState({
        project: "",
        windfarm: "",
        cluster: "",
        roadType: "all",
    });

    const {
        loading,
        roadDashboard = [],
        error
    } = useSelector(
        (state) => state.cartRoad || state.cardRoad
    );
    const {
        getturbinefilter = []
    } = useSelector((state) => state.electricalData);

    // console.log("roadDashboard",roadDashboard)
    useEffect(() => {
        dispatch(getRoadDPRDashboardData());
        dispatch(GetTurbineFilterData({}));
    }, [dispatch]);

    // Memoized filter options
    const filterOptions = useMemo(() => {
        const projects = [
            ...new Map(getturbinefilter.map((i) => [i.project_id, i])).values(),
        ];
        const windfarms = getturbinefilter
            .filter((i) => !filters.project || i.project_id === Number(filters.project))
            .reduce((acc, curr) => {
                if (!acc.find((w) => w.windfarm_id === curr.windfarm_id)) acc.push(curr);
                return acc;
            }, []);
        const clusters = getturbinefilter
            .filter((i) => !filters.windfarm || i.windfarm_id === Number(filters.windfarm))
            .reduce((acc, curr) => {
                if (!acc.find((c) => c.cluster_id === curr.cluster_id)) acc.push(curr);
                return acc;
            }, []);
        return {
            projects,
            windfarms,
            clusters
        };
    }, [getturbinefilter, filters.project, filters.windfarm]);

    // Filter data
    const filteredData = useFilters(roadDashboard, filters);

    // Chart data preparation
    const chartData = useMemo(
        () =>
        filteredData.map((row) => ({
            name: row.road_name || `Road ${row.road_id}`,
            planned: parseFloat(row.plan_distance_km) || 0,
            completed: parseFloat(row.actual_completed_qty) || 0,
            remaining: parseFloat(row.remaining_qty) || 0,
            progress: parseFloat(row.progress_percent) || 0,
            roadType: row.road_type,
            cluster: row.cluster_name,
            project: row.project_name,
        })), [filteredData]
    );

    // Calculate pie data based on actual progress
    const pieData = useMemo(() => {
        const statusCounts = filteredData.reduce(
            (acc, row) => {
                const progress = parseFloat(row.progress_percent) || 0;
                if (progress >= 100) acc.completed++;
                else if (progress > 0) acc.inProgress++;
                else acc.notStarted++;
                return acc;
            }, {
                completed: 0,
                inProgress: 0,
                notStarted: 0
            }
        );

        return [{
                name: "Completed",
                value: statusCounts.completed,
                color: COLORS.completed
            },
            {
                name: "In Progress",
                value: statusCounts.inProgress,
                color: COLORS.inProgress
            },
            {
                name: "Not Started",
                value: statusCounts.notStarted,
                color: COLORS.notStarted
            },
        ];
    }, [filteredData]);

    // Group data by cluster for table
    const groupedData = useMemo(
        () =>
        filteredData.reduce((acc, row) => {
            const cluster = row.cluster_name || "Unknown Cluster";
            if (!acc[cluster]) acc[cluster] = [];
            acc[cluster].push(row);
            return acc;
        }, {}), [filteredData]
    );

    // Handlers
    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => {
            const newFilters = { ...prev,
                [key]: value
            };
            if (key === "project") newFilters.windfarm = "";
            if (key === "windfarm") newFilters.cluster = "";
            return newFilters;
        });
    }, []);

    // Loading state
    if (loading) {
        return ( <
            Box display = "flex"
            justifyContent = "center"
            alignItems = "center"
            minHeight = "400px" >
            <
            CircularProgress / >
            <
            /Box>
        );
    }

    // Error state - but still show filters
    if (error) {
        return ( <
            Box sx = {
                {
                    p: 3
                }
            } >
            <
            Typography variant = "h5"
            sx = {
                {
                    fontWeight: 700,
                    color: COLORS.primary,
                    mb: 3
                }
            } >
            Road Construction DPR Dashboard <
            /Typography>

            { /* Render filters even in error state */ } <
            Grid container spacing = {
                2
            }
            sx = {
                {
                    mb: 3
                }
            } >
            <
            Grid item xs = {
                12
            }
            md = {
                3
            } >
            <
            FilterSelect label = "Project"
            value = {
                filters.project
            }
            options = {
                filterOptions.projects.map((p) => ({
                    id: p.project_id,
                    name: p.project_name,
                }))
            }
            onChange = {
                (e) => handleFilterChange("project", e.target.value)
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            md = {
                3
            } >
            <
            FilterSelect label = "Wind Farm"
            value = {
                filters.windfarm
            }
            options = {
                filterOptions.windfarms.map((w) => ({
                    id: w.windfarm_id,
                    name: w.windfarm_name,
                }))
            }
            onChange = {
                (e) => handleFilterChange("windfarm", e.target.value)
            }
            disabled = {!filters.project
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            md = {
                3
            } >
            <
            FilterSelect label = "Cluster"
            value = {
                filters.cluster
            }
            options = {
                filterOptions.clusters.map((c) => ({
                    id: c.cluster_id,
                    name: c.cluster_name,
                }))
            }
            onChange = {
                (e) => handleFilterChange("cluster", e.target.value)
            }
            disabled = {!filters.windfarm
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            md = {
                3
            } >
            <
            FormControl fullWidth size = "small" >
            <
            InputLabel > Road Type < /InputLabel> <
            Select value = {
                filters.roadType
            }
            label = "Road Type"
            onChange = {
                (e) => handleFilterChange("roadType", e.target.value)
            } >
            {
                ROAD_TYPES.map((type) => ( <
                    MenuItem key = {
                        type
                    }
                    value = {
                        type
                    } > {
                        type === "all" ?
                        "All Types" :
                            `${type.charAt(0).toUpperCase() + type.slice(1)} Road`
                    } <
                    /MenuItem>
                ))
            } <
            /Select> <
            /FormControl> <
            /Grid> <
            /Grid>

            <
            Alert severity = "error" > Failed to load dashboard: {
                error
            } < /Alert> <
            /Box>
        );
    }

    // No data state - but still show filters
    if (!filteredData ? .length) {
        return ( <
            Box sx = {
                {
                    p: 3
                }
            } >
            <
            Typography variant = "h5"
            sx = {
                {
                    fontWeight: 700,
                    color: COLORS.primary,
                    mb: 3
                }
            } >
            Road Construction DPR Dashboard <
            /Typography>

            { /* Render filters always */ } <
            Grid container spacing = {
                2
            }
            sx = {
                {
                    mb: 3
                }
            } >
            <
            Grid item xs = {
                12
            }
            md = {
                3
            } >
            <
            FilterSelect label = "Project"
            value = {
                filters.project
            }
            options = {
                filterOptions.projects.map((p) => ({
                    id: p.project_id,
                    name: p.project_name,
                }))
            }
            onChange = {
                (e) => handleFilterChange("project", e.target.value)
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            md = {
                3
            } >
            <
            FilterSelect label = "Wind Farm"
            value = {
                filters.windfarm
            }
            options = {
                filterOptions.windfarms.map((w) => ({
                    id: w.windfarm_id,
                    name: w.windfarm_name,
                }))
            }
            onChange = {
                (e) => handleFilterChange("windfarm", e.target.value)
            }
            disabled = {!filters.project
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            md = {
                3
            } >
            <
            FilterSelect label = "Cluster"
            value = {
                filters.cluster
            }
            options = {
                filterOptions.clusters.map((c) => ({
                    id: c.cluster_id,
                    name: c.cluster_name,
                }))
            }
            onChange = {
                (e) => handleFilterChange("cluster", e.target.value)
            }
            disabled = {!filters.windfarm
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            md = {
                3
            } >
            <
            FormControl fullWidth size = "small" >
            <
            InputLabel > Road Type < /InputLabel> <
            Select value = {
                filters.roadType
            }
            label = "Road Type"
            onChange = {
                (e) => handleFilterChange("roadType", e.target.value)
            } >
            {
                ROAD_TYPES.map((type) => ( <
                    MenuItem key = {
                        type
                    }
                    value = {
                        type
                    } > {
                        type === "all" ?
                        "All Types" :
                            `${type.charAt(0).toUpperCase() + type.slice(1)} Road`
                    } <
                    /MenuItem>
                ))
            } <
            /Select> <
            /FormControl> <
            /Grid> <
            /Grid>

            <
            Alert severity = "info"
            sx = {
                {
                    mt: 2
                }
            } >
            No road data available
            for the selected filters.Please adjust your filters. <
            /Alert> <
            /Box>
        );
    }

    // Main render with data
    return ( <
        Box sx = {
            {
                p: 3,
                bgcolor: COLORS.background,
                minHeight: "100vh"
            }
        } >
        <
        Typography variant = "h5"
        sx = {
            {
                fontWeight: 700,
                color: COLORS.primary,
                mb: 3
            }
        } >
        Road Construction DPR Dashboard <
        /Typography>

        { /* Filters */ } <
        Grid container spacing = {
            2
        }
        sx = {
            {
                mb: 3
            }
        } >
        <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        FilterSelect label = "Project"
        value = {
            filters.project
        }
        options = {
            filterOptions.projects.map((p) => ({
                id: p.project_id,
                name: p.project_name,
            }))
        }
        onChange = {
            (e) => handleFilterChange("project", e.target.value)
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        FilterSelect label = "Wind Farm"
        value = {
            filters.windfarm
        }
        options = {
            filterOptions.windfarms.map((w) => ({
                id: w.windfarm_id,
                name: w.windfarm_name,
            }))
        }
        onChange = {
            (e) => handleFilterChange("windfarm", e.target.value)
        }
        disabled = {!filters.project
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        FilterSelect label = "Cluster"
        value = {
            filters.cluster
        }
        options = {
            filterOptions.clusters.map((c) => ({
                id: c.cluster_id,
                name: c.cluster_name,
            }))
        }
        onChange = {
            (e) => handleFilterChange("cluster", e.target.value)
        }
        disabled = {!filters.windfarm
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        FormControl fullWidth size = "small" >
        <
        InputLabel > Road Type < /InputLabel> <
        Select value = {
            filters.roadType
        }
        label = "Road Type"
        onChange = {
            (e) => handleFilterChange("roadType", e.target.value)
        } >
        {
            ROAD_TYPES.map((type) => ( <
                MenuItem key = {
                    type
                }
                value = {
                    type
                } > {
                    type === "all" ?
                    "All Types" :
                        `${type.charAt(0).toUpperCase() + type.slice(1)} Road`
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        /Grid> <
        /Grid>

        { /* Statistics Component */ } <
        RoadStatistics data = {
            filteredData
        }
        />

        { /* Tabs */ } <
        Box sx = {
            {
                display: "flex",
                justifyContent: "center",
                mb: 4
            }
        } >
        <
        Tabs value = {
            activeTab
        }
        onChange = {
            (_, v) => setActiveTab(v)
        }
        variant = "scrollable"
        scrollButtons = "auto"
        sx = {
            {
                bgcolor: "#f5f6fa",
                borderRadius: "12px",
                p: 0.5,
                minHeight: "44px",
                boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.06)",
                "& .MuiTabs-indicator": {
                    bgcolor: "#1a237e",
                    height: "100%",
                    borderRadius: "10px",
                    zIndex: 0,
                    boxShadow: "0px 2px 6px rgba(26, 35, 126, 0.2)",
                },
            }
        } >
        <
        Tab label = "Visual Analytics"
        sx = {
            {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                minHeight: "36px",
                px: 3,
                borderRadius: "10px",
                zIndex: 1,
                transition: "all 0.2s ease",
                color: "#616161",
                "&.Mui-selected": {
                    color: "#fff !important",
                },
                "&:hover": {
                    color: activeTab === 0 ? "#fff" : "#1a237e",
                    opacity: 0.85,
                },
            }
        }
        /> <
        Tab label = "Detailed Table"
        sx = {
            {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                minHeight: "36px",
                px: 3,
                borderRadius: "10px",
                zIndex: 1,
                transition: "all 0.2s ease",
                color: "#616161",
                "&.Mui-selected": {
                    color: "#fff !important",
                },
                "&:hover": {
                    color: activeTab === 1 ? "#fff" : "#1a237e",
                    opacity: 0.85,
                },
            }
        }
        /> <
        /Tabs> <
        /Box> {
            activeTab === 0 ? ( <
                Grid container spacing = {
                    3
                }
                sx = {
                    {
                        border: "1px solid #ddd"
                    }
                } >
                <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } >
                <
                Card sx = {
                    {
                        p: 2
                    }
                } >
                <
                Typography variant = "h6"
                gutterBottom >
                Road - wise Progress <
                /Typography> <
                RoadProgressChart data = {
                    chartData
                }
                height = {
                    Math.max(400, chartData.length * 35)
                }
                /> <
                /Card> <
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                Card sx = {
                    {
                        p: 2,
                        height: "94%"
                    }
                } >
                <
                Typography variant = "h6"
                gutterBottom >
                Status Distribution <
                /Typography> <
                StatusPieChart data = {
                    pieData
                }
                /> <
                /Card> <
                /Grid> <
                /Grid>
            ) : ( <
                RoadDetailsTable data = {
                    filteredData
                }
                groupedData = {
                    groupedData
                }
                />
            )
        } <
        /Box>
    );
};

export default RoadDashboardTab;