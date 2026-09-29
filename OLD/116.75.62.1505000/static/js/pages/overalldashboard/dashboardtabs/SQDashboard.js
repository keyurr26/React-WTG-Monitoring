import React from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LabelList,
    CartesianGrid,
    Label,
} from "recharts";

/* ================= COLORS ================= */
const SEVERITY_COLORS = {
    low: "#2e7d32",
    medium: "#f9a825",
    high: "#d32f2f",
    critical: "#6a1b9a",
};

const SQDashboard = ({
    dashboard = {},
    filters,
    setFilters
}) => {
    const typeFilter = filters.record_type || "all";

    /* ================= FILTER ================= */
    //   const filteredData = useMemo(() => {
    //     if (typeFilter === "all") return sqlist;
    //     return sqlist.filter((r) => r.record_type === typeFilter);
    //   }, [sqlist, typeFilter]);

    /* ================= SEVERITY ================= */
    const severityData = [{
            name: "Low",
            value: dashboard.low || 0
        },
        {
            name: "Medium",
            value: dashboard.medium || 0
        },
        {
            name: "High",
            value: dashboard.high || 0
        },
        {
            name: "Critical",
            value: dashboard.critical || 0
        },
    ];

    const categoryData = (dashboard.by_category || []).map(item => ({
        name: item.category,
        value: item.count,
    }));

    // const activityData = (dashboard.by_activity || []).map(item => ({
    //   name: item.turbine_activity,
    //   value: item.count,
    // }));

    const activityData = (dashboard.by_activity || [])
        .map(item => ({
            name: item.turbine_activity,
            value: item.count,
        }))
        .sort((a, b) => b.value - a.value);

    return ( <
        Box sx = {
            {
                p: 1
            }
        } > { /* ================= FILTER ================= */ } <
        Box sx = {
            {
                mb: 2
            }
        } >
        <
        ToggleButtonGroup value = {
            typeFilter
        }
        exclusive onChange = {
            (e, v) => {
                if (v === "all") {
                    setFilters((prev) => ({ ...prev,
                        record_type: ""
                    }));
                } else if (v) {
                    setFilters((prev) => ({ ...prev,
                        record_type: v
                    }));
                }
            }
        }
        size = "small" >
        <
        ToggleButton value = "all" > All < /ToggleButton> <
        ToggleButton value = "safety" > Safety < /ToggleButton> <
        ToggleButton value = "quality" > Quality < /ToggleButton> <
        /ToggleButtonGroup> <
        /Box>

        { /* ================= KPI ================= */ } <
        Grid container spacing = {
            2
        }
        sx = {
            {
                mb: 2
            }
        } > {
            [{
                    label: "Total",
                    value: dashboard.total,
                    color: "#1a237e"
                },
                {
                    label: "Safety",
                    value: dashboard.safety,
                    color: "#1976d2"
                },
                {
                    label: "Quality",
                    value: dashboard.quality,
                    color: "#7b1fa2"
                },
                {
                    label: "Open",
                    value: dashboard.open,
                    color: "#d32f2f"
                },
                {
                    label: "Closed",
                    value: dashboard.closed,
                    color: "#2e7d32"
                },
            ].map((item, i) => ( <
                Grid item xs = {
                    6
                }
                md = {
                    2.4
                }
                key = {
                    i
                } >
                <
                Paper sx = {
                    {
                        p: 2,
                        textAlign: "center",
                        background: item.color,
                        color: "#fff",
                        borderRadius: 3,
                    }
                } >
                <
                Typography variant = "h5" > {
                    item.value
                } < /Typography> <
                Typography variant = "caption" > {
                    item.label
                } < /Typography> <
                /Paper> <
                /Grid>
            ))
        } <
        /Grid>

        { /* ================= CHARTS ================= */ } <
        Grid container spacing = {
            3
        } > { /* ================= SEVERITY BAR ================= */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        Paper elevation = {
            2
        }
        sx = {
            {
                p: 3,
                height: 380,
                minHeight: 380,
                borderRadius: 3
            }
        } >
        <
        Typography fontWeight = {
            700
        }
        sx = {
            {
                mb: 1,
                color: "#00416A"
            }
        } >
        Severity Analysis <
        /Typography>

        <
        ResponsiveContainer width = "100%"
        height = {
            350
        } >
        <
        BarChart data = {
            severityData
        }
        barSize = {
            35
        }
        margin = {
            {
                top: 20,
                right: 20,
                left: 0,
                bottom: 20
            }
        } >
        <
        CartesianGrid strokeDasharray = "3 3"
        opacity = {
            0.3
        }
        />

        <
        XAxis dataKey = "name" >
        <
        Label value = "Severity Level"
        offset = {-5
        }
        position = "insideBottom" /
        >
        <
        /XAxis>

        <
        YAxis allowDecimals = {
            false
        } >
        <
        Label value = "Count"
        angle = {-90
        }
        position = "insideLeft" / >
        <
        /YAxis>

        <
        Tooltip formatter = {
            (value) => [`${value} Issues`, "Count"]
        }
        />

        <
        Bar dataKey = "value"
        radius = {
            [6, 6, 0, 0]
        } >
        <
        LabelList dataKey = "value"
        position = "top"
        style = {
            {
                fontWeight: 700
            }
        }
        /> {
            severityData.map((entry, index) => ( <
                Cell key = {
                    index
                }
                fill = {
                    SEVERITY_COLORS[entry.name.toLowerCase()]
                }
                />
            ))
        } <
        /Bar> <
        /BarChart> <
        /ResponsiveContainer> <
        /Paper> <
        /Grid>

        { /* ================= CATEGORY PIE ================= */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        Paper elevation = {
            2
        }
        sx = {
            {
                p: 3,
                height: 380,
                minHeight: 380,
                borderRadius: 3
            }
        } >
        <
        Typography fontWeight = {
            700
        }
        sx = {
            {
                mb: 1,
                color: "#00416A"
            }
        } >
        Category Breakdown <
        /Typography>

        <
        ResponsiveContainer width = "100%"
        height = {
            350
        } >
        <
        PieChart >
        <
        Pie data = {
            categoryData
        }
        dataKey = "value"
        nameKey = "name"
        outerRadius = {
            120
        }

        label = {
            ({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                index,
            }) => {
                const RADIAN = Math.PI / 180;

                const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return ( <
                    text x = {
                        x
                    }
                    y = {
                        y
                    }
                    fill = "white"
                    textAnchor = "middle"
                    dominantBaseline = "central"
                    fontSize = {
                        12
                    }
                    fontWeight = {
                        600
                    } >
                    {
                        `${(percent * 100).toFixed(0)}%`
                    }

                    <
                    /text>
                );
            }
        }
        labelLine = {
            false
        } >
        {
            categoryData.map((_, i) => ( <
                Cell key = {
                    i
                }
                fill = {
                    [
                        "#1a237e",
                        "#1976d2",
                        "#7b1fa2",
                        "#d32f2f",
                        "#2e7d32",
                        "#f9a825",
                    ][i % 6]
                }
                />
            ))
        } <
        /Pie>

        <
        Tooltip / >
        <
        Legend / >
        <
        /PieChart> <
        /ResponsiveContainer> <
        /Paper> <
        /Grid> { /* ================= ACTIVITY CHART ================= */ } <
        Grid item xs = {
            12
        } >
        <
        Paper elevation = {
            2
        }
        sx = {
            {
                p: 3,
                height: 420,
                borderRadius: 3
            }
        } >

        <
        Typography fontWeight = {
            700
        }
        sx = {
            {
                mb: 1,
                color: "#00416A"
            }
        } >
        Activity Wise Issues <
        /Typography>

        <
        ResponsiveContainer width = "100%"
        height = {
            380
        } >
        <
        BarChart layout = "vertical"
        data = {
            activityData
        }
        margin = {
            {
                top: 20,
                right: 30,
                left: 40,
                bottom: 20
            }
        } >
        { /* GRID */ } <
        CartesianGrid strokeDasharray = "3 3"
        opacity = {
            0.3
        }
        />

        { /* X AXIS (Count) */ } <
        XAxis type = "number"
        allowDecimals = {
            false
        } >
        <
        Label value = "Issues Count"
        position = "insideBottom"
        offset = {-5
        }
        /> <
        /XAxis>

        { /* Y AXIS (Activity Names) */ } <
        YAxis type = "category"
        dataKey = "name"
        width = {
            120
        } // important for long labels
        >
        <
        Label value = "Turbine Activity"
        angle = {-90
        }
        position = "insideLeft" /
        >
        <
        /YAxis>

        { /* TOOLTIP */ } <
        Tooltip formatter = {
            (value) => [`${value} Issues`, "Count"]
        }
        />

        { /* BAR */ } <
        Bar dataKey = "value"
        fill = "#7b1fa2"
        radius = {
            [0, 6, 6, 0]
        } // rounded right side
        >
        <
        LabelList dataKey = "value"
        position = "right"
        style = {
            {
                fontWeight: 700
            }
        }
        /> <
        /Bar> <
        /BarChart> <
        /ResponsiveContainer> {
            /* <ResponsiveContainer width="100%" height="90%">
                        <BarChart
                            data={activityData}
                            barSize={30}
                            margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
                        >
                           
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

                            <XAxis
                            dataKey="name"
                            interval={0}
                            angle={-25}
                            textAnchor="end"
                            >
                            <Label
                                value="Turbine Activity"
                                position="insideBottom"
                                offset={-5}
                            />
                            </XAxis>

                        
                            <YAxis allowDecimals={false}>
                            <Label
                                value="Issues Count"
                                angle={-90}
                                position="insideLeft"
                            />
                            </YAxis>

                           
                            <Tooltip
                            formatter={(value) => [`${value} Issues`, "Count"]}
                            />

                          
                            <Bar
                            dataKey="value"
                            fill="#7b1fa2"
                            radius={[6, 6, 0, 0]}
                            >
                            <LabelList
                                dataKey="value"
                                position="top"
                                style={{ fontWeight: 700 }}
                            />
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer> */
        } <
        /Paper> <
        /Grid> <
        /Grid> <
        /Box>
    );
};

export default SQDashboard;