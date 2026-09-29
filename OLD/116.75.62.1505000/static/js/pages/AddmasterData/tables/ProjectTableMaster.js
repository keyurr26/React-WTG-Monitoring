import React, {
    useState
} from "react";

import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    TablePagination,
} from "@mui/material";

import {
    updateProjectData
} from "../../../Redux/MasterData/masterAction";

import {
    useDispatch
} from "react-redux";

import EditIcon from "@mui/icons-material/Edit";

import IconButton from "@mui/material/IconButton";

import VisibilityIcon from "@mui/icons-material/Visibility";

import Tooltip from "@mui/material/Tooltip";

import LockIcon from "@mui/icons-material/Lock";

import LockOpenIcon from "@mui/icons-material/LockOpen";

const ProjectTable = ({
    projects = [],

    onEdit,

    onViewLogo,
}) => {
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState("");

    const [lockedRows, setLockedRows] = useState({});

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    //  const handleLock = (projectId) => {

    //    setLockedRows((prev) => ({

    //      ...prev,

    //      [projectId]: true, // permanently locked

    //    }));

    //  };

    const handleLock = async (project) => {
        if (
            window.confirm(
                `Are you sure you want to permanently lock "${project.project_name}"? Edits will be permanently disabled.`,
            )
        ) {
            try {
                const formData = new FormData();

                formData.append("project_name", project.project_name);

                formData.append("client_name", project.client_name);

                formData.append("address", project.address);

                formData.append("contact_person", project.contact_person || "");

                formData.append("contact_phone", project.contact_phone || "");

                formData.append("email", project.email || "");

                formData.append("is_locked", true); // Set to permanently locked

                await dispatch(updateProjectData(project.id, formData));
            } catch (err) {
                console.error("Failed to lock project:", err);
            }
        }
    };

    const filteredProjects = projects.filter(
        (project) =>
        project.client_name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.project_name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.contact_person ? .toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const paginatedProjects = filteredProjects.slice(
        page * rowsPerPage,

        page * rowsPerPage + rowsPerPage,
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));

        setPage(0);
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
        { /* HEADER */ } <
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
        Project List <
        /Typography>

        <
        TextField label = "Search"
        variant = "outlined"
        size = "small"
        value = {
            searchTerm
        }
        onChange = {
            (e) => {
                setSearchTerm(e.target.value);

                setPage(0);
            }
        }
        sx = {
            {
                width: {
                    xs: "100%",
                    sm: "250px"
                }
            }
        }
        /> <
        /Box>

        { /* TABLE */ } <
        TableContainer sx = {
            {
                maxHeight: 450
            }
        } >
        <
        Table stickyHeader size = "small"
        sx = {
            {
                minWidth: 700
            }
        } >
        <
        TableHead >
        <
        TableRow > {
            [
                "Client Name",

                "Project Name",

                "Address",

                "Contact Person",

                "Phone",

                "Email",

                "Logo",

                "Action",

                "Disable Edit",
            ].map((header) => ( <
                TableCell key = {
                    header
                }
                sx = {
                    {
                        background: "#0f52ba",

                        color: "#fff",

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
        /TableHead>

        <
        TableBody > {
            paginatedProjects.length > 0 ? (
                paginatedProjects.map((project, index) => {
                    const isLocked = Boolean(project.is_locked);

                    return ( <
                        TableRow key = {
                            project.id
                        }
                        sx = {
                            {
                                backgroundColor: isLocked ?
                                    "#f8f9fa" // Visual indication for locked row
                                    :
                                    index % 2 === 0 ?
                                    "background.paper" :
                                    "grey.100",

                                "&:hover": {
                                    backgroundColor: "action.hover",
                                },
                            }
                        } >
                        <
                        TableCell > {
                            project.client_name
                        } < /TableCell> <
                        TableCell > {
                            project.project_name
                        } < /TableCell> <
                        TableCell > {
                            project.address
                        } < /TableCell> <
                        TableCell > {
                            project.contact_person
                        } < /TableCell> <
                        TableCell > {
                            project.contact_phone
                        } < /TableCell> <
                        TableCell > {
                            project.email
                        } < /TableCell>

                        { /* LOGO */ } <
                        TableCell >
                        <
                        IconButton color = "info"
                        onClick = {
                            () => onViewLogo ? .(project)
                        }
                        disabled = {!project.customer_logo
                        } >
                        <
                        VisibilityIcon / >
                        <
                        /IconButton> <
                        /TableCell>

                        { /* EDIT ACTION */ } <
                        TableCell >
                        <
                        Tooltip title = {
                            isLocked ?
                            "This project is permanently locked" :
                                "Edit Project"
                        } >
                        <
                        span >
                        <
                        IconButton color = "primary"
                        onClick = {
                            () => onEdit(project)
                        }
                        disabled = {
                            isLocked
                        } // Disable button if is_locked is true
                        >
                        <
                        EditIcon / >
                        <
                        /IconButton> <
                        /span> <
                        /Tooltip> <
                        /TableCell>

                        { /* LOCK / UNLOCK STATUS */ } <
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
                                onClick = {
                                    () => handleLock(project)
                                }
                                size = "small" >
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
                    9
                }
                align = "center"
                sx = {
                    {
                        py: 3
                    }
                } >
                No projects found. <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        { /* PAGINATION COMPONENT */ } <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25]
        }
        component = "div"
        count = {
            filteredProjects.length
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

export default ProjectTable;