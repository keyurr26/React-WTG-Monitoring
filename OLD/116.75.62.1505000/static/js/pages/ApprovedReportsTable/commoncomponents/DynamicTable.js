import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    IconButton,
    Chip,
    Typography,
    Box,
    Tooltip,
    Badge,
} from "@mui/material";
import {
    useState,
    useMemo
} from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import GroupedRecordViewer from "./GroupedRecordViewer";
import BoltIcon from "@mui/icons-material/Bolt";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import {
    alpha
} from "@mui/material/styles";


const calculateDays = (startDate, endDate) => {
    if (!startDate) return "-";
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(); // Use current date if not approved

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

function DynamicTable({
    title,
    columns,
    rows,
    tableId,
    onApprove,
    isAdmin,
    onUpdate,
    sqlist,
    delays
}) {
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const getTableStatusSummary = (data) => {
        return data.reduce(
            (acc, row) => {
                const status = row.status ? .toLowerCase();
                if (status === "approved") {
                    acc.completed++;
                } else if (status === "pending" || !status) {
                    acc.pending++;
                } else {
                    acc.notStarted++;
                }
                return acc;
            }, {
                completed: 0,
                pending: 0,
                notStarted: 0
            }
        );
    };



    const summary = getTableStatusSummary(rows);

    const filteredRows = useMemo(() => {
        if (!searchQuery) return rows;
        return rows.filter((row) =>
            columns.some((col) => {
                const value = row[col.key];
                return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [searchQuery, rows, columns]);

    const paginatedRows = filteredRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    const handleView = (row) => {
        // Agar grouped records hain to sab dikhao, nahi to sirf ye record
        if (row._groupedRecords && row._groupedRecords.length > 1) {
            setSelectedRecords(row._groupedRecords);
        } else {
            setSelectedRecords([row]);
        }
        setViewerOpen(true);
    };

    const handleCloseViewer = () => {
        setViewerOpen(false);
        setSelectedRecords([]);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const canFastApprove = rows.some(row => {
        const statusField = row.excavation_status || row.pcc_status || row.conduct_status || row.soil_status; // and so on
        return statusField ? .toLowerCase() === "completed" && row.status !== "Approved";
    });

    const headerGradients = {
        navy: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    };

    return ( <
            Paper sx = {
                {
                    mb: 2,
                    p: 0,
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "white",
                    overflow: "hidden",
                }
            } >
            { /* Header */ } {
                /* <Box
                        sx={{
                          background: headerGradients.navy,
                          px: 3,
                          py: 2.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box
                            sx={{
                              width: 4,
                              height: 32,
                              background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0.5))",
                              borderRadius: 2,
                            }}
                          />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
                              {title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                              {rows.length} records
                            </Typography>
                          </Box>
                        </Box>
                      </Box> */
            }

            {
                /* <Box
                        sx={{
                          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                          px: 3,
                          py: 2.0,
                          display: "flex", // Added Flex
                          justifyContent: "space-between", // Pushes summary to the right
                          alignItems: "center",
                        }}
                      > */
            } { /* Left Side: Title and Record Count */ } {
                /* <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box
                            sx={{
                              width: 4, height: 32,
                              background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0.5))",
                              borderRadius: 2,
                            }}
                          />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
                              {title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                              {rows.length} total records
                            </Typography>
                          </Box>
                        </Box> */
            }

            { /* Right Side: Status Badges and Fast Approve */ } { /* <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}> */ }

            { /* Summary Badges */ } {
                /* <Box sx={{ display: "flex", gap: 1 }}>
                            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 4, bgcolor: "#065f46", color: "#bbf7d0", fontSize: 12, fontWeight: 700, border: "1px solid rgba(255,255,255,0.2)" }}>
                              {summary.completed} Approved
                            </Box>
                            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 4, bgcolor: "#92400e", color: "#fef3c7", fontSize: 12, fontWeight: 700, border: "1px solid rgba(255,255,255,0.2)" }}>
                              {summary.pending} Pending
                            </Box>
                          </Box> */
            }

            { /* Fast Approve Button */ } {
                /* {isAdmin && canFastApprove && (
                            <Tooltip title="Approve Full Turbine Activity">
                              <IconButton
                                onClick={() => onApprove(tableId, rows[0], true)}
                                sx={{
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  color: 'white',
                                  ml: 1,
                                  '&:hover': { bgcolor: '#22c55e' }
                                }}
                              >
                                <BoltIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box> */
            }

            { /* Header */ }



            <
            Box sx = {
                {
                    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                    px: 3,
                    py: 2.0,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }
            } >
            { /* Left Side: Title */ } <
            Box sx = {
                {
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }
            } >
            <
            Box sx = {
                {
                    width: 4,
                    height: 32,
                    bgcolor: "#39f300",
                    borderRadius: 2
                }
            }
            /> <
            Box >
            <
            Typography variant = "h6"
            sx = {
                {
                    fontWeight: 700,
                    color: "white"
                }
            } > {
                title
            } <
            /Typography> <
            Typography variant = "caption"
            sx = {
                {
                    color: "rgba(255,255,255,0.8)"
                }
            } > {
                filteredRows.length
            } {
                filteredRows.length === 1 ? 'record' : 'records'
            } <
            /Typography> <
            /Box> <
            /Box>

            { /* Right Side: Search + Summary + Bolt */ } <
            Box sx = {
                {
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }
            } >

            { /* SLEEK SEARCH BAR */ } <
            Box sx = {
                {
                    position: "relative",
                    borderRadius: "20px",
                    backgroundColor: alpha("#fff", 0.15),
                    "&:hover": {
                        backgroundColor: alpha("#fff", 0.25)
                    },
                    transition: "all 0.2s",
                    width: "250px",
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    border: "1px solid rgba(255,255,255,0.2)"
                }
            } >
            <
            SearchIcon sx = {
                {
                    color: "white",
                    fontSize: 20,
                    mr: 1
                }
            }
            /> <
            InputBase placeholder = "Search records..."
            value = {
                searchQuery
            }
            onChange = {
                (e) => {
                    setSearchQuery(e.target.value);
                    setPage(0); // Reset to first page on search
                }
            }
            sx = {
                {
                    color: "white",
                    fontSize: "0.875rem",
                    width: "100%",
                    "& .MuiInputBase-input::placeholder": {
                        color: "rgba(255,255,255,0.7)",
                        opacity: 1,
                    },
                }
            }
            /> <
            /Box>

            { /* Summary Badges */ } <
            Box sx = {
                {
                    display: "flex",
                    gap: 1
                }
            } >
            <
            Box sx = {
                {
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 4,
                    bgcolor: "#065f46",
                    color: "#bbf7d0",
                    fontSize: 12,
                    fontWeight: 700,
                    border: "1px solid rgba(255,255,255,0.2)"
                }
            } > {
                summary.completed
            }
            Approved <
            /Box> <
            Box sx = {
                {
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 4,
                    bgcolor: "#92400e",
                    color: "#fef3c7",
                    fontSize: 12,
                    fontWeight: 700,
                    border: "1px solid rgba(255,255,255,0.2)"
                }
            } > {
                summary.pending
            }
            Pending <
            /Box> <
            /Box>

            { /* Fast Approve Bolt */ } {
                isAdmin && canFastApprove && ( <
                    IconButton onClick = {
                        () => onApprove(tableId, rows[0], true)
                    }
                    sx = {
                        {
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#22c55e'
                            }
                        }
                    } >
                    <
                    BoltIcon fontSize = "small" / >
                    <
                    /IconButton>
                )
            } <
            /Box> <
            /Box>

            { /* NEW: Fast Approve Button for Admins */ } {
                isAdmin && canFastApprove && ( <
                    Tooltip title = "Approve Full Turbine Activity" >
                    <
                    IconButton onClick = {
                        () => onApprove(tableId, rows[0], true)
                    } // Pass 'true' for fastApprove flag
                    sx = {
                        {
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#22c55e'
                            } // Turns green on hover
                        }
                    } >
                    <
                    BoltIcon / >
                    <
                    /IconButton> <
                    /Tooltip>
                )
            }


            { /* Table */ } <
            Box sx = {
                {
                    overflowX: "auto"
                }
            } >
            <
            Table sx = {
                {
                    minWidth: 1200
                }
            } >
            <
            TableHead >
            <
            TableRow sx = {
                {
                    backgroundColor: "#f8fafc"
                }
            } > {
                columns.map((col, index) => ( <
                    TableCell key = {
                        index
                    }
                    onClick = {
                        () => col.sortable && handleSort(col.key)
                    }
                    sx = {
                        {
                            py: 2.5,
                            px: 3,
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            cursor: col.sortable ? "pointer" : "default",
                        }
                    } >
                    <
                    Box sx = {
                        {
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }
                    } > {
                        col.label
                    } {
                        col.sortable && ( <
                            Box sx = {
                                {
                                    display: "flex",
                                    flexDirection: "column",
                                    ml: 0.5
                                }
                            } >
                            <
                            ArrowUpwardIcon sx = {
                                {
                                    fontSize: 12,
                                    color: sortField === col.key && sortDirection === "asc" ?
                                        "#3b82f6" : "action.disabled",
                                }
                            }
                            /> <
                            ArrowDownwardIcon sx = {
                                {
                                    fontSize: 12,
                                    mt: -0.5,
                                    color: sortField === col.key && sortDirection === "desc" ?
                                        "#3b82f6" : "action.disabled",
                                }
                            }
                            /> <
                            /Box>
                        )
                    } <
                    /Box> <
                    /TableCell>
                ))
            } <
            /TableRow> <
            /TableHead>

            <
            TableBody > {
                paginatedRows.map((row, rowIndex) => ( <
                        TableRow key = {
                            rowIndex
                        }
                        sx = {
                            {
                                backgroundColor: rowIndex % 2 === 0 ? "white" : "#fafbfc",
                                "&:hover": {
                                    backgroundColor: "#f0f9ff"
                                },
                            }
                        } >
                        {
                            columns.map((col, colIndex) => {
                                    // Status chip - sirf display, koi button nahi
                                    if (col.type === "status") {
                                        const isApproved = row.status ? .toLowerCase() === "approved";

                                        // Calculate duration
                                        // submitted_at: When the record was first created
                                        // approve_date: When the admin clicked approve
                                        const days = calculateDays(row.submitted_at, row.approve_date);

                                        return ( <
                                            TableCell key = {
                                                colIndex
                                            } >
                                            <
                                            Box sx = {
                                                {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }
                                            } > {
                                                isApproved ? ( <
                                                    >
                                                    <
                                                    Chip icon = { < CheckCircleIcon sx = {
                                                            {
                                                                fontSize: 14
                                                            }
                                                        }
                                                        />}
                                                        label = "Approved"
                                                        color = "success"
                                                        size = "small"
                                                        sx = {
                                                            {
                                                                fontWeight: 700,
                                                                minWidth: 90,
                                                                height: 20,
                                                                fontSize: '0.7rem'
                                                            }
                                                        }
                                                        /> <
                                                        Typography variant = "caption"
                                                        sx = {
                                                            {
                                                                fontSize: '10px',
                                                                color: 'text.secondary',
                                                                fontWeight: 600
                                                            }
                                                        } >
                                                        Approved in {
                                                            days
                                                        }
                                                        days <
                                                        /Typography> <
                                                        />
                                                    ): ( <
                                                        >
                                                        <
                                                        Chip icon = { < CancelIcon sx = {
                                                                {
                                                                    fontSize: 14
                                                                }
                                                            }
                                                            />}
                                                            label = "Pending"
                                                            color = "warning"
                                                            size = "small"
                                                            sx = {
                                                                {
                                                                    fontWeight: 700,
                                                                    minWidth: 90,
                                                                    height: 20,
                                                                    fontSize: '0.7rem'
                                                                }
                                                            }
                                                            /> <
                                                            Typography variant = "caption"
                                                            sx = {
                                                                {
                                                                    fontSize: '10px',
                                                                    color: days > 5 ? 'error.main' : 'warning.main',
                                                                    fontWeight: 700
                                                                }
                                                            } >
                                                            Pending
                                                            for {
                                                                days
                                                            }
                                                            days <
                                                            /Typography> <
                                                            />
                                                        )
                                                    } <
                                                    /Box> <
                                                    /TableCell>
                                                );
                                            }

                                            // View button - popup kholta hai
                                            if (col.type === "view") {
                                                const hasMultiple = row._groupedRecords ? .length > 1;
                                                return ( <
                                                    TableCell key = {
                                                        colIndex
                                                    } >
                                                    <
                                                    Tooltip title = {
                                                        hasMultiple ? "View & Approve Records" : "View & Approve"
                                                    } >
                                                    <
                                                    IconButton onClick = {
                                                        () => handleView(row)
                                                    }
                                                    size = "small"
                                                    sx = {
                                                        {
                                                            background: hasMultiple ?
                                                                "linear-gradient(135deg, #9333ea, #7e22ce)" :
                                                                "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                                                            color: "white",
                                                            '&:hover': {
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }
                                                    } >
                                                    <
                                                    VisibilityIcon sx = {
                                                        {
                                                            fontSize: 18
                                                        }
                                                    }
                                                    /> {
                                                        hasMultiple && ( <
                                                            Badge badgeContent = {
                                                                row._groupedRecords.length
                                                            }
                                                            color = "warning"
                                                            sx = {
                                                                {
                                                                    position: "absolute",
                                                                    top: -5,
                                                                    right: -5,
                                                                    "& .MuiBadge-badge": {
                                                                        fontSize: 10,
                                                                        height: 18,
                                                                        minWidth: 18,
                                                                    },
                                                                }
                                                            }
                                                            />
                                                        )
                                                    } <
                                                    /IconButton> <
                                                    /Tooltip> <
                                                    /TableCell>
                                                );
                                            }

                                            // Group count indicator for identifier columns
                                            if ((col.key === "turbine_sr_no" || col.key === "foundation_name" || col.key === "sample_id") &&
                                                row._groupCount > 1) {
                                                return ( <
                                                    TableCell key = {
                                                        colIndex
                                                    } >
                                                    <
                                                    Box sx = {
                                                        {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1
                                                        }
                                                    } >
                                                    <
                                                    Typography variant = "body2"
                                                    sx = {
                                                        {
                                                            fontWeight: 600
                                                        }
                                                    } > {
                                                        row[col.key]
                                                    } <
                                                    /Typography> <
                                                    Chip label = {
                                                        `${row._groupCount} records`
                                                    }
                                                    size = "small"
                                                    sx = {
                                                        {
                                                            fontSize: '0.65rem',
                                                            height: 20,
                                                            bgcolor: '#e9d5ff',
                                                            color: '#6b21a8',
                                                            fontWeight: 600
                                                        }
                                                    }
                                                    /> <
                                                    /Box> <
                                                    /TableCell>
                                                );
                                            }

                                            // Regular cell
                                            return ( <
                                                TableCell key = {
                                                    colIndex
                                                } >
                                                <
                                                Typography variant = "body2" > {
                                                    row[col.key] ? ? "-"
                                                } <
                                                /Typography> <
                                                /TableCell>
                                            );
                                        })
                                } <
                                /TableRow>
                            ))
                    } <
                    /TableBody> <
                    /Table> <
                    /Box>

                    { /* Pagination */ } <
                    Box sx = {
                        {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 3,
                            py: 2,
                            bgcolor: "#f9fafb"
                        }
                    } >
                    <
                    Typography variant = "caption" > Showing {
                        rows.length
                    }
                    records < /Typography> <
                    Box sx = {
                        {
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }
                    } >
                    <
                    Typography variant = "caption" >
                    Page {
                        page + 1
                    } of {
                        totalPages
                    }

                    <
                    /Typography> <
                    IconButton size = "small"
                    disabled = {
                        page === 0
                    }
                    onClick = {
                        () => setPage(page - 1)
                    } > ◀ < /IconButton> <
                    IconButton size = "small"
                    disabled = {
                        page + 1 >= totalPages
                    }
                    onClick = {
                        () => setPage(page + 1)
                    } > ▶ < /IconButton> <
                    /Box> <
                    /Box>

                    { /* Single Popup for all approvals */ } <
                    GroupedRecordViewer open = {
                        viewerOpen
                    }
                    onClose = {
                        handleCloseViewer
                    }
                    records = {
                        selectedRecords
                    }
                    tableId = {
                        tableId
                    }
                    onApprove = {
                        onApprove
                    }
                    columns = {
                        columns
                    }
                    isAdmin = {
                        isAdmin
                    }
                    onUpdate = {
                        onUpdate
                    }
                    sqlist = {
                        sqlist
                    }
                    delayList = {
                        delays
                    }
                    /> <
                    /Paper>
                );
            }

            export default DynamicTable;