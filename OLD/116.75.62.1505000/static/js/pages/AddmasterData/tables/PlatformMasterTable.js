import React, {
    useState,
    useMemo
} from "react";
import {
    Stack,
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Tooltip
} from "@mui/material";
import {
    Edit,
    Visibility
} from "@mui/icons-material";
import {
    PLATFORM_TYPE_OPTIONS
} from "../../../constants/choices";

const PlatformMasterTable = ({
    rows = [],
    onEdit
}) => {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");

    // Pagination State Engine
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter Pipeline: Search by Turbine Location No and match Platform Type dropdown choices
    const filteredData = useMemo(() => {
        return rows.filter((item) => {
            const matchesSearch =
                (item.turbine_name ? .toLowerCase() || "").includes(
                    search.toLowerCase(),
                ) ||
                (item.platform_name ? .toLowerCase() || "").includes(
                    search.toLowerCase(),
                );
            const matchesType = filterType ? item.platform_type === filterType : true;
            return matchesSearch && matchesType;
        });
    }, [rows, search, filterType]);

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return ( <
        Paper sx = {
            {
                mt: 2,
                p: 3,
                borderRadius: 2,
                border: "1px solid #00416A"
            }
        } > { /* ================= HEADER CONTROL BAR ================= */ } <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 2,
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        Registered Platform Masters <
        /Typography>

        <
        Stack direction = "row"
        spacing = {
            2
        } >
        <
        TextField label = "Filter Type"
        select size = "small"
        value = {
            filterType
        }
        onChange = {
            (e) => {
                setFilterType(e.target.value);
                setPage(0);
            }
        }
        sx = {
            {
                minWidth: 160
            }
        } >
        <
        MenuItem value = "" > All Platform Types < /MenuItem> {
            PLATFORM_TYPE_OPTIONS.map((opt) => ( <
                MenuItem key = {
                    opt.value
                }
                value = {
                    opt.value
                } > {
                    opt.label
                } <
                /MenuItem>
            ))
        } <
        /TextField>

        <
        TextField label = "Search Location / Name"
        size = "small"
        value = {
            search
        }
        onChange = {
            (e) => {
                setSearch(e.target.value);
                setPage(0);
            }
        }
        /> <
        /Stack> <
        /Box>

        { /* ================= NATIVE DATATABLE CANVAS ================= */ } <
        TableContainer sx = {
            {
                maxHeight: 450,
                borderRadius: 1
            }
        } >
        <
        Table stickyHeader size = "small" >
        <
        TableHead >
        <
        TableRow >
        <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Turbine Location <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Platform Name <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Platform Type <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        }
        align = "right" >
        Length(m) <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        }
        align = "right" >
        Width(m) <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        }
        align = "right" >
        Depth(m) <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Crane Model <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        }
        align = "right" >
        Distance(m) <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Drainage <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Status <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        }
        align = "center" >
        FDD Document <
        /TableCell>{" "} <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        }
        align = "center" >
        MDD Document <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        }
        align = "center" >
        Action <
        /TableCell> <
        /TableRow> <
        /TableHead>

        <
        TableBody > {
            filteredData.length === 0 ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    13
                }
                align = "center"
                sx = {
                    {
                        py: 4,
                        color: "text.secondary"
                    }
                } >
                No platform records found matching current scope boundaries. <
                /TableCell> <
                /TableRow>
            ) : (
                filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => ( <
                    TableRow key = {
                        row.id
                    }
                    hover >
                    <
                    TableCell sx = {
                        {
                            fontWeight: 600
                        }
                    } > {
                        row.turbine_name
                    } <
                    /TableCell> <
                    TableCell > {
                        row.platform_name || "N/A"
                    } < /TableCell> <
                    TableCell sx = {
                        {
                            textTransform: "uppercase"
                        }
                    } > {
                        row.platform_type || "N/A"
                    } <
                    /TableCell> <
                    TableCell align = "right" > {
                        row.platform_length || "0"
                    } <
                    /TableCell> <
                    TableCell align = "right" > {
                        row.platform_width || "0"
                    } <
                    /TableCell> <
                    TableCell align = "right" > {
                        row.platform_depth || "0"
                    } <
                    /TableCell> <
                    TableCell > {
                        row.crane_model_name || "N/A"
                    } < /TableCell> <
                    TableCell align = "right" > {
                        row.distance_from_tower || "0"
                    } <
                    /TableCell> <
                    TableCell > {
                        row.drainage_provided
                    } < /TableCell> <
                    TableCell sx = {
                        {
                            textTransform: "capitalize",
                            fontWeight: 500
                        }
                    } >
                    {
                        row.activity_status
                    } <
                    /TableCell> { /* 🔥 Dedicated FDD Document Column Cell */ } <
                    TableCell align = "center" > {
                        row.fdd_attachment ? ( <
                            Tooltip title = "View Foundation Design Document (FDD)"
                            arrow >
                            <
                            IconButton size = "small"
                            color = "primary"
                            href = {
                                row.fdd_attachment
                            }
                            target = "_blank"
                            rel = "noopener noreferrer" >
                            <
                            Visibility fontSize = "small" / >
                            <
                            /IconButton> <
                            /Tooltip>
                        ) : ( <
                            Typography variant = "caption"
                            color = "text.disabled" >
                            No FDD <
                            /Typography>
                        )
                    } <
                    /TableCell>

                    { /* 🔥 Dedicated MDD Document Column Cell */ } <
                    TableCell align = "center" > {
                        row.mdd_attachment ? ( <
                            Tooltip title = "View Mounting Design Document (MDD)"
                            arrow >
                            <
                            IconButton size = "small"
                            color = "secondary"
                            href = {
                                row.mdd_attachment
                            }
                            target = "_blank"
                            rel = "noopener noreferrer" >
                            <
                            Visibility fontSize = "small" / >
                            <
                            /IconButton> <
                            /Tooltip>
                        ) : ( <
                            Typography variant = "caption"
                            color = "text.disabled" >
                            No MDD <
                            /Typography>
                        )
                    } <
                    /TableCell> <
                    TableCell align = "center" >
                    <
                    Stack direction = "row"
                    spacing = {
                        1
                    }
                    justifyContent = "center" >
                    <
                    IconButton color = "primary"
                    size = "small"
                    onClick = {
                        () => onEdit ? .(row)
                    } >
                    <
                    Edit fontSize = "small" / >
                    <
                    /IconButton> <
                    /Stack> <
                    /TableCell> <
                    /TableRow>
                ))
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        { /* ================= FOOTER PAGINATION LAYER ================= */ } <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25, 50]
        }
        component = "div"
        count = {
            filteredData.length
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
        /> <
        /Paper>
    );
};

export default PlatformMasterTable;