import React, {
    useEffect,
    useState
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetWtgDprData
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
    Button,
    Box,
    Chip,
    Grid,
} from "@mui/material";

const WtgDprComponent = ({
    parentFilters = {}
}) => {
    const dispatch = useDispatch();

    // 1. Target the WTG specific states from Redux
    const {
        wtgDprData = [],
            wtgDprTotalCount = 0,
            loadingWtgDPR,
    } = useSelector((state) => state.dashboardData || {});

    // 2. Local state for date filter only
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

    // 3. Construct payload and dispatch
    const fetchDPR = () => {
        const combinedFilters = {
            project: parentFilters.project || "",
            windfarm: parentFilters.windfarm || "",
            cluster: parentFilters.cluster || "",
            date: dateFilter,
            //   category: "WTG_INSTALLATION",
        };
        dispatch(GetWtgDprData(combinedFilters));
    };

    useEffect(() => {
        fetchDPR();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        parentFilters.project,
        parentFilters.windfarm,
        parentFilters.cluster,
        dateFilter,
    ]);

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
        WTG Daily Progress Report(DPR) <
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
            10
        } >
        <
        Typography variant = "body2"
        color = "textSecondary" >
        Showing WTG installation DPR data filtered by the selected Project, Windfarm, and Cluster from the dashboard header. <
        /Typography> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            2
        } >
        <
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
        /> <
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
        Typography variant = "h6" > WTG Activity Logs < /Typography> <
        Chip label = {
            `Total Activities: ${wtgDprTotalCount}`
        }
        color = "secondary"
        variant = "filled" /
        >
        <
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
        b > Bolts Quantity < /b> <
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
            loadingWtgDPR ? ( <
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
            ) : wtgDprData.length === 0 ? ( <
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
                No WTG activities found
                for this filter combination. <
                /TableCell> <
                /TableRow>
            ) : (
                wtgDprData.map((row, index) => ( <
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
                            target = "_blank"
                            rel = "noopener noreferrer" >
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

export default WtgDprComponent;