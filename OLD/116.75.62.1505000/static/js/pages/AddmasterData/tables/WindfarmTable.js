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
    Typography,
    TablePagination,
    TextField,
    Box,
    Tooltip,
} from "@mui/material";
import {
    useDispatch
} from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
    UpdateWindFarmData
} from "../../../Redux/MasterData/masterAction";
const WindfarmTable = ({
    data = [],
    onEdit
}) => {
    const dispatch = useDispatch();
    // 1. STATE FOR SEARCH AND PAGINATION
    const [searchTerm, setSearchTerm] = useState("");
    const [lockedRows, setLockedRows] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const handleLock = (id) => {
    //   setLockedRows((prev) => ({
    //     ...prev,
    //     [id]: true,
    //   }));
    // };
    const handleLock = async (row) => {
        if (
            window.confirm(
                `Are you sure you want to permanently lock "${row.windfarm_name}"? Edits will be permanently disabled.`,
            )
        ) {
            try {
                const formData = new FormData();
                formData.append("project", row.project);
                formData.append("windfarm_name", row.windfarm_name || "");
                formData.append("capacity_mw", row.capacity_mw || "");
                formData.append("no_of_locations", row.no_of_locations || "");
                formData.append("no_of_clusters", row.no_of_clusters || "");
                formData.append("windfarm_status", row.windfarm_status || "proposed");
                formData.append("country", row.country || "");
                formData.append("state", row.state || "");
                formData.append("district", row.district || "");
                formData.append("taluka", row.taluka || "");
                formData.append("is_locked", true); // Set locked in database
                await dispatch(UpdateWindFarmData(row.id, formData));
                // dispatch(GetWindFarmMasterData());
            } catch (err) {
                console.error("Failed to lock windfarm:", err);
            }
        }
    };
    // 2. FILTER LOGIC
    const filteredData = data.filter(
        (row) =>
        row.client_name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.project_name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.windfarm_name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.village ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.district ? .toLowerCase().includes(searchTerm.toLowerCase()),
    );
    // 3. PAGINATION LOGIC (Slice the filtered data)
    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );
    // 4. EVENT HANDLERS
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when changing row count
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0); // Reset to first page when searching
    };
    return ( <
        Paper sx = {
            {
                mt: 4,
                p: 3,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                borderRadius: 2,
                border: "1px solid #00416A",
            }
        } >
        { /* SEARCH BAR ROW */ } <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
            }
        } >
        <
        Typography variant = "h6"
        fontWeight = "bold"
        color = "#00416A" >
        Windfarm List <
        /Typography> <
        TextField label = "Search Windfarms..."
        variant = "outlined"
        size = "small"
        value = {
            searchTerm
        }
        onChange = {
            handleSearchChange
        }
        sx = {
            {
                width: {
                    xs: "100%",
                    sm: "300px"
                }
            }
        }
        /> <
        /Box> <
        TableContainer sx = {
            {
                maxHeight: 500
            }
        } >
        <
        Table stickyHeader sx = {
            {
                minWidth: 1200
            }
        }
        size = "small"
        aria - label = "windfarm table" >
        <
        TableHead >
        <
        TableRow > {
            [
                "Client Name",
                "Project Name",
                "Windfarm Name",
                "Utm Zone",
                "Capacity (MW)",
                // "Line (km)",
                "No of Clusters",
                "No of Locations",
                "Status",
                "Country",
                "State",
                "District",
                "Taluka",
                "View Report",
                "Action",
                "Disable Edit",
            ].map((header) => ( <
                TableCell key = {
                    header
                }
                sx = {
                    {
                        color: "#fff",
                        background: "#0f52ba",
                        fontWeight: "bold",
                        fontSize: 14,
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
            paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                    const isLocked = Boolean(row.is_locked);
                    return ( <
                        TableRow key = {
                            row.id || index
                        }
                        sx = {
                            {
                                backgroundColor: isLocked ?
                                    "#f8f9fa" :
                                    index % 2 === 0 ?
                                    "background.paper" :
                                    "#EBF3FF",
                                "&:hover": {
                                    backgroundColor: "#DEEBFF",
                                    cursor: "pointer",
                                },
                            }
                        } >
                        <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.client_name || "-"
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.project_name
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.windfarm_name
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.utm_zone
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.capacity_mw
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.no_of_clusters ? ? "-"
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.no_of_locations
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.windfarm_status
                        } <
                        /TableCell> { /* COUNTRY */ } <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.country || "-"
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.state
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.district
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                whiteSpace: "nowrap"
                            }
                        } > {
                            row.taluka
                        } <
                        /TableCell> { /* VIEW REPORT */ } <
                        TableCell >
                        <
                        IconButton color = "error"
                        disabled = {!row.feasibility_report
                        }
                        onClick = {
                            () =>
                            window.open(
                                row.feasibility_report,
                                "_blank",
                                "noopener,noreferrer",
                            )
                        } >
                        <
                        PictureAsPdfIcon / >
                        <
                        /IconButton> <
                        /TableCell> { /* EDIT ACTION */ } <
                        TableCell >
                        <
                        Tooltip title = {
                            isLocked ?
                            "This windfarm is permanently locked" :
                                "Edit Windfarm"
                        } >
                        <
                        span >
                        <
                        IconButton color = "primary"
                        disabled = {
                            isLocked
                        }
                        onClick = {
                            () => onEdit(row)
                        } >
                        <
                        EditIcon / >
                        <
                        /IconButton> <
                        /span> <
                        /Tooltip> <
                        /TableCell> { /* LOCK / UNLOCK STATUS */ } <
                        TableCell > {
                            isLocked ? ( <
                                Tooltip title = "Permanently Locked" >
                                <
                                LockIcon fontSize = "small"
                                color = "error" / >
                                <
                                /Tooltip>
                            ) : ( <
                                Tooltip title = "Click to lock permanently" >
                                <
                                IconButton color = "warning"
                                size = "small"
                                onClick = {
                                    () => handleLock(row)
                                } >
                                <
                                LockOpenIcon fontSize = "small" / >
                                <
                                /IconButton> <
                                /Tooltip>
                            )
                        } <
                        /TableCell> <
                        /TableRow>
                    );
                })
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    13
                }
                align = "center"
                sx = {
                    {
                        py: 3
                    }
                } >
                <
                Typography color = "textSecondary" >
                No records found matching your search. <
                /Typography> <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer> { /* PAGINATION COMPONENT */ } <
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
export default WindfarmTable;