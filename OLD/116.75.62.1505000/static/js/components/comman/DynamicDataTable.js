import React, {
    useState,
    useMemo
} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Chip,
    TablePagination,
    Box,
    CircularProgress, // Added
    Typography, // Added
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function DynamicDataTable({
    columns = [],
    rows = [],
    onEdit,
    loading = false, // New Prop
    showStatus = false,
    approveField = "approve_date",
    rowsPerPageOptions = [5, 10, 25, 50],
    defaultRowsPerPage = 10,
}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedRows = useMemo(
        () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [rows, page, rowsPerPage]
    );

    // Calculate ColSpan for centering the loader/empty message
    const totalColumns = columns.length + (showStatus ? 1 : 0) + (onEdit ? 1 : 0);

    return ( <
            Paper sx = {
                {
                    width: "100%",
                    overflowX: "auto",
                    mt: 2,
                    position: "relative"
                }
            } >
            <
            TableContainer sx = {
                {
                    maxWidth: "100%",
                    overflowX: "auto",
                    minHeight: loading ? 300 : "auto"
                }
            } >
            <
            Table stickyHeader size = "small" >
            <
            TableHead >
            <
            TableRow > {
                columns.map((col) => ( <
                    TableCell key = {
                        col.id
                    }
                    align = {
                        col.align || "left"
                    }
                    sx = {
                        {
                            minWidth: col.minWidth || 120,
                            fontWeight: 600,
                            bgcolor: "#f8fafc"
                        }
                    } >
                    {
                        col.label
                    } <
                    /TableCell>
                ))
            } {
                showStatus && < TableCell sx = {
                    {
                        fontWeight: 600,
                        bgcolor: "#f8fafc"
                    }
                } > Approved Status < /TableCell>} {
                    onEdit && < TableCell align = "center"
                    sx = {
                            {
                                fontWeight: 600,
                                bgcolor: "#f8fafc"
                            }
                        } > Action < /TableCell>} <
                        /TableRow> <
                        /TableHead>

                        <
                        TableBody > {
                            loading ? (
                                /* --- LOADING STATE --- */
                                <
                                TableRow >
                                <
                                TableCell colSpan = {
                                    totalColumns
                                }
                                sx = {
                                    {
                                        height: 250
                                    }
                                } >
                                <
                                Box sx = {
                                    {
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 2
                                    }
                                } >
                                <
                                CircularProgress size = {
                                    35
                                }
                                thickness = {
                                    4
                                }
                                /> <
                                Typography variant = "body2"
                                color = "textSecondary" > Fetching records... < /Typography> <
                                /Box> <
                                /TableCell> <
                                /TableRow>
                            ) : paginatedRows.length === 0 ? (
                                /* --- EMPTY STATE --- */
                                <
                                TableRow >
                                <
                                TableCell colSpan = {
                                    totalColumns
                                }
                                align = "center"
                                sx = {
                                    {
                                        py: 8
                                    }
                                } >
                                <
                                Typography variant = "body1"
                                color = "textSecondary" > No Data Available
                                for this Cluster < /Typography> <
                                /TableCell> <
                                /TableRow>
                            ) : (
                                /* --- DATA STATE --- */
                                paginatedRows.map((row, index) => {
                                    const approved = Boolean(row[approveField]);
                                    return ( <
                                        TableRow key = {
                                            index
                                        }
                                        hover > {
                                            columns.map((col) => ( <
                                                TableCell key = {
                                                    col.id
                                                } > {
                                                    col.render ? col.render(row, index) : row[col.id]
                                                } <
                                                /TableCell>
                                            ))
                                        } {
                                            showStatus && ( <
                                                TableCell align = "left" >
                                                <
                                                Chip size = "small"
                                                label = {
                                                    approved ? "Approved" : "Pending"
                                                }
                                                color = {
                                                    approved ? "success" : "warning"
                                                }
                                                variant = "outlined" /
                                                >
                                                <
                                                /TableCell>
                                            )
                                        } {
                                            onEdit && ( <
                                                TableCell align = "center" >
                                                <
                                                Tooltip title = {
                                                    approved ? "Cannot edit approved record" : "Edit"
                                                } >
                                                <
                                                span >
                                                <
                                                IconButton size = "small"
                                                disabled = {
                                                    approved
                                                }
                                                onClick = {
                                                    () => onEdit(row, index)
                                                } >
                                                <
                                                EditIcon fontSize = "small"
                                                color = {
                                                    approved ? "disabled" : "primary"
                                                }
                                                /> <
                                                /IconButton> <
                                                /span> <
                                                /Tooltip> <
                                                /TableCell>
                                            )
                                        } <
                                        /TableRow>
                                    );
                                })
                            )
                        } <
                        /TableBody> <
                        /Table> <
                        /TableContainer>

                        <
                        TablePagination
                    component = "div"
                    count = {
                        rows.length
                    }
                    page = {
                        page
                    }
                    onPageChange = {
                        handleChangePage
                    }
                    rowsPerPage = {
                        rowsPerPage
                    }
                    onRowsPerPageChange = {
                        handleChangeRowsPerPage
                    }
                    rowsPerPageOptions = {
                        rowsPerPageOptions
                    }
                    /> <
                    /Paper>
                );
            }

            export default DynamicDataTable;