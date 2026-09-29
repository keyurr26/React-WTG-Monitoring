import React, {
    useEffect,
    useState
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    PDFDownloadLink
} from "@react-pdf/renderer";
import FoundationDPRMonthlyPDF from "./FoundationDPRMonthlyPDF";
import {
    GetUnifiedDPRData
} from "../../../../Redux/DashboardData/dashboardAction";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TextField,
    Box,
    Chip,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
    Button
} from "@mui/material";

const FoundationDPR = ({
    parentFilters = {}
}) => {
    const dispatch = useDispatch();

    // 1. Get data from Redux
    const {
        dprData = [],
            dprTotalCount,
            loadingDPR,
    } = useSelector((state) => state.dashboardData || {});

    // 2. Local state for view mode ('daily' vs 'monthly') and filter values
    const [viewMode, setViewMode] = useState("daily"); // 'daily' or 'monthly'
    const [dateFilter, setDateFilter] = useState(
        new Date().toISOString().split("T")[0],
    ); // YYYY-MM-DD
    const [monthFilter, setMonthFilter] = useState(
        new Date().toISOString().slice(0, 7),
    ); // YYYY-MM

    // 3. Construct the combined payload based on the active view mode
    const fetchDPR = () => {
        const combinedFilters = {
            project: parentFilters.project || "",
            windfarm: parentFilters.windfarm || "",
            cluster: parentFilters.cluster || "",
        };

        if (viewMode === "daily") {
            combinedFilters.date = dateFilter;
            combinedFilters.month = ""; // Clear month if daily is selected
        } else {
            combinedFilters.month = monthFilter;
            combinedFilters.date = ""; // Clear date if monthly is selected
        }

        dispatch(GetUnifiedDPRData(combinedFilters));
    };

    // 4. Trigger fetch when filters, view mode, or specific date/month changes
    useEffect(() => {
        fetchDPR();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        parentFilters.project,
        parentFilters.windfarm,
        parentFilters.cluster,
        viewMode,
        dateFilter,
        monthFilter,
    ]);

    const handleViewModeChange = (event, newMode) => {
        if (newMode !== null) {
            setViewMode(newMode);
        }
    };

    return ( <
        Box sx = {
            {
                p: 2
            }
        } >
        <
        Typography variant = "h5"
        sx = {
            {
                fontWeight: "bold",
                mb: 3
            }
        } >
        Daily Progress Report(DPR) <
        /Typography>

        { /* --- Filter Section --- */ } <
        Paper sx = {
            {
                p: 2,
                mb: 3
            }
        } >
        <
        Grid container spacing = {
            2
        }
        alignItems = "center" >
        <
        Grid item xs = {
            12
        }
        md = {
            7
        } >
        <
        Typography variant = "body2"
        color = "textSecondary" >
        Showing DPR data filtered by Project, Windfarm, Cluster, and the selected {
            viewMode === "daily" ? "date" : "month"
        }. <
        /Typography> <
        /Grid>

        { /* View Mode Toggle (Daily vs Monthly) */ } <
        Grid item xs = {
            12
        }
        md = {
            3
        }
        sx = {
            {
                display: "flex",
                justifyContent: {
                    xs: "flex-start",
                    md: "flex-end"
                },
            }
        } >
        <
        ToggleButtonGroup value = {
            viewMode
        }
        exclusive onChange = {
            handleViewModeChange
        }
        size = "small" >
        <
        ToggleButton value = "daily" > Daily Report < /ToggleButton> <
        ToggleButton value = "monthly" > Monthly Report < /ToggleButton> <
        /ToggleButtonGroup> <
        /Grid>

        { /* Dynamic Input based on View Mode */ } <
        Grid item xs = {
            12
        }
        md = {
            2
        } > {
            viewMode === "daily" ? ( <
                TextField label = "Select Date"
                type = "date"
                fullWidth size = "small"
                value = {
                    dateFilter
                }
                onChange = {
                    (e) => setDateFilter(e.target.value)
                }
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                />
            ) : ( <
                TextField label = "Select Month"
                type = "month"
                fullWidth size = "small"
                value = {
                    monthFilter
                }
                onChange = {
                    (e) => setMonthFilter(e.target.value)
                }
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                />
            )
        } <
        /Grid> <
        /Grid> <
        /Paper>

        { /* --- Table Section --- */ } <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                maxHeight: "70vh"
            }
        } >
        <
        Box sx = {
            {
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }
        } >
        <
        Typography variant = "h6" >
        Activity Logs({
            viewMode === "daily" ? dateFilter : monthFilter
        }) <
        /Typography> <
        Chip label = {
            `Total Activities: ${dprTotalCount || 0}`
        }
        color = "secondary"
        variant = "filled" /
        > {
            viewMode === "monthly" && ( <
                PDFDownloadLink document = { <
                    FoundationDPRMonthlyPDF
                    data = {
                        dprData
                    }
                    month = {
                        monthFilter
                    }
                    totalCount = {
                        dprTotalCount || 0
                    }
                    filters = {
                        {
                            project: parentFilters.project,
                            windfarm: parentFilters.windfarm,
                            cluster: parentFilters.cluster,
                        }
                    }
                    />
                }
                fileName = {
                    `Foundation-DPR-${monthFilter}.pdf`
                } >
                {
                    ({
                        loading
                    }) => ( <
                        Button variant = "contained"
                        color = "primary"
                        size = "small"
                        disabled = {
                            loading
                        } >
                        {
                            loading ? "Generating PDF..." : "Download Monthly PDF"
                        } <
                        /Button>
                    )
                } <
                /PDFDownloadLink>
            )
        } <
        /Box> <
        Table stickyHeader >
        <
        TableHead >
        <
        TableRow >
        <
        TableCell >
        <
        b > Date < /b> <
        /TableCell> <
        TableCell >
        <
        b > Turbine No < /b> <
        /TableCell> <
        TableCell >
        <
        b > Activity < /b> <
        /TableCell> <
        TableCell >
        <
        b > Quantity Done < /b> <
        /TableCell> <
        TableCell >
        <
        b > Status < /b> <
        /TableCell> <
        TableCell >
        <
        b > Approval < /b> <
        /TableCell> <
        TableCell >
        <
        b > Photo < /b> <
        /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            loadingDPR ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    7
                }
                align = "center"
                sx = {
                    {
                        py: 3
                    }
                } >
                Loading Activities...
                <
                /TableCell> <
                /TableRow>
            ) : dprData.length === 0 ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    7
                }
                align = "center"
                sx = {
                    {
                        py: 3
                    }
                } >
                No activities found
                for this filter combination. <
                /TableCell> <
                /TableRow>
            ) : (
                dprData.map((row, index) => ( <
                    TableRow key = {
                        index
                    }
                    hover >
                    <
                    TableCell > {
                        row.date
                    } < /TableCell> <
                    TableCell > {
                        row.turbine_no
                    } < /TableCell> <
                    TableCell >
                    <
                    Chip label = {
                        row.activity
                    }
                    color = "primary"
                    variant = "outlined"
                    size = "small" /
                    >
                    <
                    /TableCell> <
                    TableCell >
                    <
                    Typography variant = "body2"
                    sx = {
                        {
                            fontWeight: "bold",
                            color: "#1e293b"
                        }
                    } >
                    {
                        row.quantity
                    } <
                    /Typography> <
                    /TableCell> <
                    TableCell > {
                        row.status
                    } < /TableCell> <
                    TableCell >
                    <
                    Chip label = {
                        row.is_approved ? "Approved" : "Pending"
                    }
                    color = {
                        row.is_approved ? "success" : "warning"
                    }
                    size = "small" /
                    >
                    <
                    /TableCell> <
                    TableCell > {
                        row.photo ? ( <
                            Button size = "small"
                            href = {
                                row.photo
                            }
                            target = "_blank" >
                            View Photo <
                            /Button>
                        ) : (
                            "-"
                        )
                    } <
                    /TableCell> <
                    /TableRow>
                ))
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer> <
        /Box>
    );
};

export default FoundationDPR;