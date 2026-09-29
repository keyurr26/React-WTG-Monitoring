import React from "react";
import {
    CardContent,
    Typography,
    Box,
    TextField,
    InputAdornment,
    Button,
    Menu,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Paper,
    Chip
} from "@mui/material";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    CheckCircle as CompletedIcon,
    Pending as PendingIcon,
    TableChart as TableIcon
} from "@mui/icons-material";
import {
    StyledCard,
    ProgressBar
} from "./FoundationStyles";
import {
    alpha
} from "@mui/material";

const calculateTotalTurbineDays = (turbine) => {
    // Collect all date fields that represent a "start" from your SQL
    const allDateKeys = [
        turbine.soil_date_of_sampling,
        turbine.ex_start, turbine.ex_latest_start,
        turbine.pcc_start, turbine.pcc_latest_start,
        turbine.re_start, turbine.re_latest_start,
        turbine.f_start, turbine.f_latest_start,
        turbine.pr_start, turbine.pr_latest_start,
        turbine.anc_start, turbine.anc_latest_start,
        turbine.cnd_start, turbine.cnd_latest_start
    ];

    // 1. Convert to timestamps and remove nulls
    const timestamps = allDateKeys
        .filter(Boolean)
        .map(d => new Date(d).getTime());

    // 2. If no dates exist, return 0
    if (timestamps.length === 0) return 0;

    // 3. Find the Earliest Start and the Latest Start
    const firstStart = Math.min(...timestamps);
    const lastStart = Math.max(...timestamps);

    // 4. Calculate Difference
    const diffInMs = lastStart - firstStart;

    // Convert MS to Days. Adding +1 ensures that if it started today, it shows "1 Day"
    const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return days >= 0 ? days + 1 : 0;
};

const FoundationTable = ({
    filteredTurbines,
    page,
    rowsPerPage,
    searchTerm,
    setSearchTerm,
    filterAnchor,
    setFilterAnchor,
    selectedFilter,
    setSelectedFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    handleRowClick
}) => {
    return ( <
        StyledCard >
        <
        CardContent >
        <
        Box display = "flex"
        justifyContent = "space-between"
        alignItems = "center"
        mb = {
            2
        } >
        <
        Typography variant = "subtitle1"
        fontWeight = "600" >
        Foundation Wise Turbine Details <
        /Typography> <
        Box display = "flex"
        gap = {
            1
        } >
        <
        TextField size = "small"
        placeholder = "Search turbine..."
        value = {
            searchTerm
        }
        onChange = {
            (e) => setSearchTerm(e.target.value)
        }
        sx = {
            {
                width: 200
            }
        }
        InputProps = {
            {
                startAdornment: ( <
                    InputAdornment position = "start" >
                    <
                    SearchIcon sx = {
                        {
                            fontSize: '1rem'
                        }
                    }
                    /> <
                    /InputAdornment>
                ),
            }
        }
        /> <
        Button size = "small"
        variant = "outlined"
        startIcon = { < FilterIcon / >
        }
        onClick = {
            (e) => setFilterAnchor(e.currentTarget)
        } >
        Filter <
        /Button> <
        Menu anchorEl = {
            filterAnchor
        }
        open = {
            Boolean(filterAnchor)
        }
        onClose = {
            () => setFilterAnchor(null)
        } >
        <
        MenuItem onClick = {
            () => {
                setSelectedFilter('all');
                setFilterAnchor(null);
            }
        } >
        All <
        /MenuItem> <
        MenuItem onClick = {
            () => {
                setSelectedFilter('completed');
                setFilterAnchor(null);
            }
        } >
        Completed <
        /MenuItem> <
        MenuItem onClick = {
            () => {
                setSelectedFilter('pending');
                setFilterAnchor(null);
            }
        } >
        Pending <
        /MenuItem> <
        /Menu> <
        /Box> <
        /Box>

        {
            filteredTurbines.length > 0 ? ( <
                >
                <
                TableContainer >
                <
                Table size = "small" >
                <
                TableHead >
                <
                TableRow sx = {
                    {
                        backgroundColor: '#f8f9fa'
                    }
                } >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Total Days < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Turbine < /Typography></TableCell > { /* <TableCell><Typography variant="body2" fontWeight="600">Cluster</Typography></TableCell> */ } <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Soil < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Excavation < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > PCC < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Conduit < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Anchor < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Reinforcement < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Foundation < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Pouring < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Cube Result < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Backfilling < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Progress < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "600" > Actions < /Typography></TableCell >
                <
                /TableRow> <
                /TableHead> <
                TableBody > {
                    filteredTurbines
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((turbine, index) => {
                        const totalDays = calculateTotalTurbineDays(turbine);

                        // CHANGED: Use flat keys from your SQL aliases
                        const hasSoil = turbine.soil_status === "completed";
                        const hasExcavation = turbine.ex_status === 1;
                        const hasPCC = turbine.pcc_status === 1;
                        const hasReinforcement = turbine.re_status === 1;
                        const hasFoundation = turbine.f_status === 1;
                        const hasPouring = turbine.pr_status === 1;
                        const hasAnchor = turbine.anc_status === 1;
                        const hasConduit = turbine.cnd_status === 1;
                        const hasCuberesult = turbine.cnd_status === 1;
                        const hasBackfilling = turbine.cnd_status === 1;

                        const completedCount = [
                            hasSoil, hasExcavation, hasPCC, hasAnchor,
                            hasReinforcement, hasPouring, hasConduit, hasFoundation, hasCuberesult,
                            hasBackfilling

                        ].filter(Boolean).length;

                        const progress = (completedCount / 10) * 100;

                        return ( <
                            TableRow key = {
                                turbine.turbine_id || index
                            }
                            hover sx = {
                                {
                                    cursor: 'pointer'
                                }
                            } >
                            <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            Chip label = {
                                `${totalDays} Days`
                            }
                            size = "small"
                            sx = {
                                {
                                    fontWeight: 'bold',
                                    bgcolor: alpha('#667eea', 0.1),
                                    color: '#667eea'
                                }
                            }
                            /> <
                            /TableCell> <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            Typography variant = "body2"
                            fontWeight = "500" > {
                                turbine.location_no || 'N/A'
                            } < /Typography> <
                            /TableCell> {
                                /* <TableCell onClick={() => handleRowClick(turbine)}>
                                                            <Typography variant="body2">{turbine.cluster_name || 'N/A'}</Typography>
                                                          </TableCell> */
                            }

                            { /* Status Chips using the updated variables */ } <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            StatusChip done = {
                                hasSoil
                            }
                            /> <
                            /TableCell> <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            StatusChip done = {
                                hasExcavation
                            }
                            /> <
                            /TableCell> <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            StatusChip done = {
                                hasPCC
                            }
                            /> <
                            /TableCell> <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            StatusChip done = {
                                hasConduit
                            }
                            /> <
                            /TableCell> <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            StatusChip done = {
                                hasAnchor
                            }
                            /> <
                            /TableCell> <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            StatusChip done = {
                                hasReinforcement
                            }
                            /> <
                            /TableCell> <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            StatusChip done = {
                                hasFoundation
                            }
                            /> <
                            /TableCell> <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            StatusChip done = {
                                hasPouring
                            }
                            /> <
                            /TableCell> <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            StatusChip done = {
                                hasCuberesult
                            }
                            /> <
                            /TableCell> <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            StatusChip done = {
                                hasBackfilling
                            }
                            /> <
                            /TableCell>

                            <
                            TableCell onClick = {
                                () => handleRowClick(turbine)
                            } >
                            <
                            Box sx = {
                                {
                                    minWidth: 80
                                }
                            } > { /* CHANGED: barcolor must be lowercase for styled-components props usually */ } <
                            ProgressBar variant = "determinate"
                            value = {
                                progress
                            }
                            barcolor = {
                                progress === 100 ? "#4CAF50" : "#FF9800"
                            }
                            /> <
                            Typography variant = "caption"
                            display = "block"
                            align = "center" > {
                                Math.round(progress)
                            } %
                            <
                            /Typography> <
                            /Box> <
                            /TableCell> <
                            TableCell >
                            <
                            Button size = "small"
                            variant = "contained"
                            color = "primary"
                            startIcon = { < TableIcon / >
                            }
                            onClick = {
                                () => handleRowClick(turbine)
                            }
                            sx = {
                                {
                                    textTransform: 'none'
                                }
                            } >
                            View Details <
                            /Button> <
                            /TableCell> <
                            /TableRow>
                        );
                    })
                } <
                /TableBody> <
                /Table> <
                /TableContainer>

                <
                TablePagination rowsPerPageOptions = {
                    [5, 10, 25]
                }
                component = "div"
                count = {
                    filteredTurbines.length
                }
                rowsPerPage = {
                    rowsPerPage
                }
                page = {
                    page
                }
                onPageChange = {
                    handleChangePage
                }
                onRowsPerPageChange = {
                    handleChangeRowsPerPage
                }
                sx = {
                    {
                        mt: 2
                    }
                }
                /> <
                />
            ) : ( <
                Paper sx = {
                    {
                        p: 3,
                        textAlign: 'center',
                        bgcolor: '#f8f9fa'
                    }
                } >
                <
                Typography variant = "body1"
                color = "textSecondary" >
                No foundation data available <
                /Typography> <
                /Paper>
            )
        } <
        /CardContent> <
        /StyledCard>
    );
};

const StatusChip = ({
    done
}) => ( <
    Chip size = "small"
    icon = {
        done ? < CompletedIcon sx = {
            {
                fontSize: '0.875rem'
            }
        }
        /> : <PendingIcon sx={{ fontSize: '0.875rem' }} / >
    }
    label = {
        done ? "Done" : "Pending"
    }
    color = {
        done ? "success" : "warning"
    }
    variant = "outlined"
    sx = {
        {
            height: 20,
            fontSize: '0.625rem'
        }
    }
    />
);

export default FoundationTable;