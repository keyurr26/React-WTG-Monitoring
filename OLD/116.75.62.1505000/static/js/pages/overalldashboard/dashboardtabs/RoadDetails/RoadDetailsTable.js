import React, {
    useState
} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Box,
    Typography,
    LinearProgress,
    TablePagination,
} from "@mui/material";

const RoadDetailsTable = ({
    data,
    groupedData
}) => {
    const COLORS = {
        primary: "#1a237e",
    };

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    if (!data || data.length === 0) {
        return ( <
            Box sx = {
                {
                    p: 3
                }
            } >
            <
            Typography > No data available < /Typography> <
            /Box>
        );
    }

    // Flatten the clustered data entries to paginate rows sequentially across categories
    const groupedEntries = Object.entries(groupedData);

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calculate items to show based on flattened group rows matching pagination boundaries
    let globalRowIndex = 0;
    const startIdx = page * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;

    return ( <
        Paper sx = {
            {
                width: "100%",
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 4
            }
        } >
        <
        TableContainer sx = {
            {
                maxHeight: 600
            }
        } >
        <
        Table stickyHeader size = "small" >
        <
        TableHead >
        <
        TableRow > {
            [
                "Project",
                "Wind Farm",
                "Cluster",
                "Road Name",
                "Road Type",
                "Planned (km)",
                "Completed (km)",
                "Remaining (km)",
                "Progress",
                "Status",
            ].map((header) => ( <
                TableCell key = {
                    header
                }
                sx = {
                    {
                        bgcolor: COLORS.primary,
                        color: "#fff",
                        border: "1px solid #c0c0c0ff",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                    }
                } >
                {
                    header
                } <
                /TableCell>
            ))
        } <
        /TableRow> <
        /TableHead> <
        TableBody > {
            groupedEntries.map(([clusterName, rows]) => {
                // Filter rows belonging within the active viewport range window 
                const visibleRowsInGroup = rows.filter(() => {
                    const currentIdx = globalRowIndex;
                    globalRowIndex++;
                    return currentIdx >= startIdx && currentIdx < endIdx;
                });

                if (visibleRowsInGroup.length === 0) return null;

                return ( <
                    React.Fragment key = {
                        clusterName
                    } > { /* Category Section Group Header Row */ } <
                    TableRow >
                    <
                    TableCell colSpan = {
                        10
                    }
                    sx = {
                        {
                            bgcolor: "#e8eaf6",
                            fontWeight: "bold",
                            color: COLORS.primary,
                        }
                    } >
                    {
                        clusterName
                    } <
                    /TableCell> <
                    /TableRow>

                    {
                        visibleRowsInGroup.map((row, index) => {
                            const planned = parseFloat(row.plan_distance_km) || 0;
                            const completed = parseFloat(row.actual_completed_qty) || 0;
                            const remaining = parseFloat(row.remaining_qty) || 0;
                            const progress = parseFloat(row.progress_percent) || 0;

                            return ( <
                                TableRow key = {
                                    index
                                }
                                sx = {
                                    {
                                        "&:nth-of-type(odd)": {
                                            bgcolor: "#f9f9f9"
                                        },
                                        "&:hover": {
                                            bgcolor: "#e3f2fd"
                                        },
                                    }
                                } >
                                <
                                TableCell > {
                                    row.project_name
                                } < /TableCell> <
                                TableCell > {
                                    row.windfarm_name
                                } < /TableCell> <
                                TableCell > {
                                    row.cluster_name
                                } < /TableCell> <
                                TableCell sx = {
                                    {
                                        fontWeight: 600
                                    }
                                } > {
                                    row.road_name
                                } < /TableCell> <
                                TableCell sx = {
                                    {
                                        textTransform: "capitalize"
                                    }
                                } > {
                                    row.road_type
                                } < /TableCell> <
                                TableCell > {
                                    planned.toFixed(2)
                                } < /TableCell> <
                                TableCell sx = {
                                    {
                                        color: "success.main",
                                        fontWeight: "bold"
                                    }
                                } > {
                                    completed.toFixed(2)
                                } < /TableCell> <
                                TableCell sx = {
                                    {
                                        color: "error.main"
                                    }
                                } > {
                                    remaining.toFixed(2)
                                } < /TableCell> <
                                TableCell >
                                <
                                Box sx = {
                                    {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1
                                    }
                                } >
                                <
                                LinearProgress variant = "determinate"
                                value = {
                                    Math.min(progress, 100)
                                }
                                sx = {
                                    {
                                        width: 60,
                                        height: 6,
                                        borderRadius: 3
                                    }
                                }
                                /> <
                                Typography variant = "caption" > {
                                    progress.toFixed(1)
                                } % < /Typography> <
                                /Box> <
                                /TableCell> <
                                TableCell >
                                <
                                Chip label = {
                                    progress >= 100 ?
                                    "Completed" :
                                        progress > 0 ?
                                        "In Progress" :
                                        "Not Started"
                                }
                                size = "small"
                                color = {
                                    progress >= 100 ?
                                    "success" :
                                        progress > 0 ?
                                        "primary" :
                                        "default"
                                }
                                /> <
                                /TableCell> <
                                /TableRow>
                            );
                        })
                    } <
                    /React.Fragment>
                );
            })
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        { /* Simple Viewport Pagination Control */ } <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25, 50]
        }
        component = "div"
        count = {
            data.length
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
        labelRowsPerPage = "Rows per page:" /
        >
        <
        /Paper>
    );
};

export default RoadDetailsTable;