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
    Chip,
    Typography,
    IconButton,
    Tooltip,
    Box,
    TextField,
    InputAdornment,
    TablePagination,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    useDispatch
} from "react-redux";
import {
    DeleteKPIMaster
} from "../../../Redux/MasterData/masterAction";
const KPIMasterTable = ({
    kpiList,
    onEdit,
    componentTypesList,
    selectedProjectId,
}) => {
    const dispatch = useDispatch();
    // --- State for Search and Pagination ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    // 🔥 1. Source array depends entirely on whether a project is selected
    const baseList = selectedProjectId ? kpiList || [] : [];
    const activityMap = React.useMemo(() => {
        const map = {};
        componentTypesList.forEach((item) => {
            map[item.name] = item.label || item.name;
        });
        return map;
    }, [componentTypesList]);
    const getActivityLabel = (code) => {
        return activityMap[code] || code;
    };
    const handleDelete = (id) => {
        if (
            window.confirm(
                "Are you sure you want to delete this KPI rule? It will be archived.",
            )
        ) {
            dispatch(DeleteKPIMaster(id));
        }
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const filteredList = baseList.filter((row) => {
        const rowProjectId =
            typeof row.project === "object" && row.project !== null ?
            row.project.id :
            row.project;
        if (String(rowProjectId) !== String(selectedProjectId)) {
            return false;
        }
        const activityLabel = getActivityLabel(row.activity_code).toLowerCase();
        const fieldName = (row.field_name || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        return activityLabel.includes(search) || fieldName.includes(search);
    });
    // Slice filtered list for current page
    const paginatedList = filteredList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );
    return ( <
        Paper sx = {
            {
                p: 3,
                borderRadius: 2,
                border: "1px solid #00416A"
            }
        } > { /* Header Section with Search */ } <
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
        Existing KPI Rules <
        /Typography> <
        TextField size = "small"
        placeholder = "Search Activity or Field..."
        value = {
            searchTerm
        }
        onChange = {
            handleSearchChange
        }
        disabled = {!selectedProjectId
        }
        sx = {
            {
                width: {
                    xs: "100%",
                    sm: "300px"
                }
            }
        }
        InputProps = {
            {
                startAdornment: ( <
                    InputAdornment position = "start" >
                    <
                    SearchIcon fontSize = "small"
                    sx = {
                        {
                            color: "#00416A"
                        }
                    }
                    /> <
                    /InputAdornment>
                ),
            }
        }
        /> <
        /Box> <
        TableContainer sx = {
            {
                borderRadius: 2,
                border: "1px solid #e0e0e0"
            }
        } >
        <
        Table sx = {
            {
                minWidth: 650
            }
        } >
        <
        TableHead sx = {
            {
                background: "#F4F7F9"
            }
        } >
        <
        TableRow >
        <
        TableCell sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        Activity <
        /TableCell> <
        TableCell sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        Field Name <
        /TableCell> <
        TableCell sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        }
        align = "center" >
        Min <
        /TableCell> <
        TableCell sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        }
        align = "center" >
        Max <
        /TableCell> <
        TableCell sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        Validation Message <
        /TableCell> <
        TableCell sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        }
        align = "center" >
        Actions <
        /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            paginatedList.length > 0 ? (
                paginatedList.map((row) => ( <
                    TableRow key = {
                        row.id
                    }
                    hover >
                    <
                    TableCell >
                    <
                    Chip label = {
                        getActivityLabel(row.activity_code)
                    }
                    size = "small"
                    sx = {
                        {
                            bgcolor: "#E3F2FD",
                            color: "#1976D2",
                            fontWeight: 600,
                        }
                    }
                    /> <
                    /TableCell> <
                    TableCell sx = {
                        {
                            fontFamily: "monospace",
                            fontWeight: 500
                        }
                    } > {
                        row.field_name
                    } <
                    /TableCell> <
                    TableCell align = "center" > {
                        row.min_value ? ? "-"
                    } < /TableCell> <
                    TableCell align = "center" > {
                        row.max_value ? ? "-"
                    } < /TableCell> <
                    TableCell sx = {
                        {
                            fontStyle: "italic",
                            color: "text.secondary"
                        }
                    } >
                    {
                        row.msg
                    } <
                    /TableCell> <
                    TableCell align = "center" >
                    <
                    Box sx = {
                        {
                            display: "flex",
                            justifyContent: "center",
                            gap: 1
                        }
                    } >
                    <
                    Tooltip title = "Edit / Update Version" >
                    <
                    IconButton size = "small"
                    color = "primary"
                    onClick = {
                        () => onEdit(row)
                    } >
                    <
                    EditIcon fontSize = "small" / >
                    <
                    /IconButton> <
                    /Tooltip> <
                    Tooltip title = "Delete" >
                    <
                    IconButton size = "small"
                    color = "error"
                    onClick = {
                        () => handleDelete(row.id)
                    } >
                    <
                    DeleteIcon fontSize = "small" / >
                    <
                    /IconButton> <
                    /Tooltip> <
                    /Box> <
                    /TableCell> <
                    /TableRow>
                ))
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    6
                }
                align = "center"
                sx = {
                    {
                        py: 4,
                        color: "text.secondary",
                        fontSize: "0.95rem"
                    }
                } >
                { /* 🔥 3. Smart messages depending on the current filtering state */ } {
                    !selectedProjectId
                        ?
                        "Please select a project from the configuration form to inspect rules." :
                        searchTerm ?
                        "No results match your search parameters." :
                        "No KPI validation rules configured for this project yet."
                } <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer> { /* Pagination Component */ } <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25]
        }
        component = "div"
        count = {
            filteredList.length
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
export default KPIMasterTable;