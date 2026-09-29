import React, {
    useEffect
} from "react";
import Chart from "react-apexcharts";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetActivityTimelineData
} from "../../../Redux/DashboardData/dashboardAction";

const PlannedVsActualChart = ({
    turbineList = [],
    selectedTurbine,
    setSelectedTurbine,
    selectedProject,
    selectedWindfarm
}) => {
    const dispatch = useDispatch();
    const {
        timelineData,
        loading
    } = useSelector((state) => state.dashboardData);


    useEffect(() => {
        if (turbineList && turbineList.length > 0) {
            const isSelectedValid = turbineList.some(
                (t) => String(t.turbine_id) === String(selectedTurbine),
            );
            if (!selectedTurbine || !isSelectedValid) {
                setSelectedTurbine(String(turbineList[0].turbine_id));
            }
        } else {
            setSelectedTurbine("");
        }
    }, [turbineList, selectedTurbine, setSelectedTurbine]);


    useEffect(() => {
        if (selectedTurbine) {
            dispatch(
                GetActivityTimelineData(
                    selectedTurbine,
                    selectedProject,
                    selectedWindfarm,
                ),
            );
        }
    }, [selectedTurbine, selectedProject, selectedWindfarm, dispatch]);


    const series = [{
        name: 'Duration',
        data: (timelineData || []).map(item => {
            const startTime = new Date(item.start).getTime();
            let endTime = new Date(item.end).getTime();

            if (startTime === endTime) {
                endTime += 24 * 60 * 60 * 1000;
            }

            return {
                x: item.activity_name,
                y: [startTime, endTime],
                fillColor: item.type === 'planned' ? '#667eea' : '#4CAF50',
                label: item.label
            };
        })
    }];

    const options = {
        chart: {
            type: 'rangeBar',
            height: 900,
            toolbar: {
                show: true
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 5,
                barHeight: '80%',
                dataLabels: {
                    position: 'center'
                }
            }
        },
        dataLabels: {
            enabled: true,
            textAnchor: 'middle',
            formatter: function(val, opts) {
                return opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].label || '';
            },
            style: {
                fontSize: '11px',
                fontWeight: 700,
                colors: ['#fff']
            }
        },
        xaxis: {
            type: 'datetime',
            position: 'top', // Moves the primary dates to the top
            labels: {
                datetimeUTC: false,
                style: {
                    fontWeight: 600
                }
            },
            axisBorder: {
                show: true
            },
            axisTicks: {
                show: true
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 600
                }
            }
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
            padding: {
                bottom: 20
            } // Space for bottom view
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy'
            }
        }
    };

    return ( <
        Paper elevation = {
            0
        }
        sx = {
            {
                p: 3,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                mt: 3
            }
        } >
        <
        Stack direction = "row"
        justifyContent = "space-between"
        alignItems = "center"
        sx = {
            {
                mb: 2
            }
        } >
        <
        Box >
        <
        Typography variant = "h6"
        fontWeight = {
            800
        }
        sx = {
            {
                color: "#00416A"
            }
        } > Construction Timeline Analysis < /Typography> <
        Typography variant = "caption"
        color = "text.secondary" > Detailed Planned vs Actual comparison < /Typography> <
        /Box>

        { /* --- CUSTOM SQUARE LEGEND --- */ } <
        Stack direction = "row"
        spacing = {
            3
        }
        sx = {
            {
                mt: 1
            }
        } >
        <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            1
        } >
        <
        Box sx = {
            {
                width: 14,
                height: 14,
                bgcolor: '#667eea',
                borderRadius: '3px'
            }
        }
        /> <
        Typography variant = "caption"
        fontWeight = {
            700
        } > Planned < /Typography> <
        /Stack> <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            1
        } >
        <
        Box sx = {
            {
                width: 14,
                height: 14,
                bgcolor: '#4CAF50',
                borderRadius: '3px'
            }
        }
        /> <
        Typography variant = "caption"
        fontWeight = {
            700
        } > Actual < /Typography> <
        /Stack> <
        /Stack>

        <
        FormControl sx = {
            {
                minWidth: 220
            }
        }
        size = "small" >
        <
        InputLabel > Select Turbine < /InputLabel> <
        Select value = {
            selectedTurbine
        }
        label = "Select Turbine"
        onChange = {
            (e) => setSelectedTurbine(e.target.value)
        } >
        <
        MenuItem value = "" > < em > None < /em></MenuItem > {
            turbineList.map((t) => ( <
                MenuItem key = {
                    t.turbine_id
                }
                value = {
                    String(t.turbine_id)
                } > {
                    t.location_no
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        /Stack>

        <
        Divider sx = {
            {
                mb: 3
            }
        }
        />

        {
            loading ? ( <
                Box sx = {
                    {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 900
                    }
                } >
                <
                CircularProgress / >
                <
                /Box>
            ) : selectedTurbine && timelineData ? .length > 0 ? ( <
                Box >
                <
                Chart options = {
                    options
                }
                series = {
                    series
                }
                type = "rangeBar"
                height = {
                    900
                }
                /> { /* MIRRORED DATE LABELS (BOTTOM) */ } <
                Typography variant = "caption"
                align = "center"
                display = "block"
                color = "text.secondary"
                sx = {
                    {
                        mt: -2,
                        fontWeight: 600
                    }
                } >
                Timeline(Dates visible on top axis) <
                /Typography> <
                /Box>
            ) : ( <
                Box sx = {
                    {
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#fafafa',
                        borderRadius: 4,
                        border: '1px dashed #ccc'
                    }
                } >
                <
                Typography color = "text.secondary" > {
                    selectedTurbine ? "No data available for this turbine." : "Please select a turbine to view the timeline."
                } <
                /Typography> <
                /Box>
            )
        } <
        /Paper>
    );
};

export default PlannedVsActualChart;