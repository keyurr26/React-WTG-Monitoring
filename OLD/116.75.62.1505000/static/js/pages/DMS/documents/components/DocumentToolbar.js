import React, {
    useState,
    useCallback
} from "react";
import {
    useSelector
} from "react-redux";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CustomSnackbar from "../../../../components/comman/CustomSnackbar";
import {
    exportAllDocumentsCommentsToExcel,
} from "../table/tabs/DownloadEx/AllDocumentsCommentsToExcel";
import {
    useDispatch
} from "react-redux";
import CreateDocument from "./CreateDocument";

// Material UI Components
import {
    Box,
    Paper,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
    Tooltip,
} from "@mui/material";
// Icons
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import {
    GetAllDocumentsCommentsData,
} from "../../../../Redux/DmsData/Document/DocumentAction";

const DocumentToolbar = ({
    // Search + Filters
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filterProject,
    setFilterProject,
    filterWindfarm,
    setFilterWindfarm,

    // Data from parent
    projects = [],
    windfarms = [],
    documents = [],

    // Callbacks
    onAdd,
    onUpdate,

    // Edit support
    editData = null,
}) => {
    const dispatch = useDispatch();

    // Logged-in user
    const {
        user
    } = useSelector((state) => state.auth);

    // Snackbar
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = useCallback((message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    }, []);

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
    };

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);

    // Loading state
    const [exportLoading, setExportLoading] = useState(false);

    const safeProjects = Array.isArray(projects) ? projects : [];

    // Handle Download All Comments
    const handleDownloadAllComments = async () => {
        if (
            filterProject === "All" ||
            !filterProject ||
            filterWindfarm === "All" ||
            !filterWindfarm
        ) {
            showSnackbar(
                "Please select both Project and Windfarm first.",
                "warning"
            );
            return;
        }

        try {
            setExportLoading(true);

            const selectedProject = safeProjects.find(
                (project) => Number(project.id) === Number(filterProject)
            );

            const selectedWindfarm = (
                Array.isArray(selectedProject ? .windfarms) ?
                selectedProject.windfarms :
                []
            ).find(
                (wf) => Number(wf.id) === Number(filterWindfarm)
            );

            const projectName =
                selectedProject ? .project_name ||
                selectedProject ? .name ||
                `Project_${filterProject}`;

            const windfarmName =
                selectedWindfarm ? .windfarm_name ||
                selectedWindfarm ? .name ||
                `Windfarm_${filterWindfarm}`;

            const selectedDocuments = documents.filter((doc) => {
                const docProjectId = doc.project ? .id || doc.project || doc.projectId;
                const docWindfarmId = doc.windfarm ? .id || doc.windfarm || doc.windfarmId;

                return (
                    Number(docProjectId) === Number(filterProject) &&
                    Number(docWindfarmId) === Number(filterWindfarm)
                );
            });

            if (!selectedDocuments.length) {
                showSnackbar(
                    "No documents found for the selected Project and Windfarm.",
                    "warning"
                );
                return;
            }

            const documentsComments = [];

            for (const doc of selectedDocuments) {
                try {
                    const response = await dispatch(
                        GetAllDocumentsCommentsData(doc.id)
                    );

                    let commentsData = [];
                    if (Array.isArray(response)) {
                        commentsData = response;
                    } else if (response ? .results) {
                        commentsData = response.results;
                    } else if (response ? .data ? .results) {
                        commentsData = response.data.results;
                    } else if (response ? .data) {
                        commentsData = Array.isArray(response.data) ? response.data : [];
                    } else if (response ? .payload) {
                        commentsData = Array.isArray(response.payload) ? response.payload : [];
                    }

                    documentsComments.push({
                        ...doc,
                        comments: commentsData,
                    });

                } catch (error) {
                    console.error(
                        `Failed to load comments for document ${doc.id}`,
                        error
                    );
                    documentsComments.push({
                        ...doc,
                        comments: [],
                    });
                }
            }

            const totalComments = documentsComments.reduce(
                (total, doc) => total + (doc.comments ? .length || 0),
                0
            );

            if (!totalComments) {
                showSnackbar(
                    "No comments found for the selected Project and Windfarm.",
                    "warning"
                );
                return;
            }

            exportAllDocumentsCommentsToExcel(
                documentsComments,
                projectName,
                windfarmName
            );

            showSnackbar(
                `Excel downloaded successfully. ${totalComments} comments exported.`,
                "success"
            );

        } catch (error) {
            console.error("Error downloading all document comments:", error);
            showSnackbar("Failed to download comments Excel.", "error");
        } finally {
            setExportLoading(false);
        }
    };

    return ( <
        >
        <
        Paper sx = {
            {
                // p: { xs: 2, sm: 2.5, md: 3 },
                p: {
                    xs: 1,
                    sm: 1.5,
                    md: 2
                },
                borderRadius: 2,
                mb: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                gap: {
                    xs: 1,
                    sm: 1.5,
                    md: 2
                },
                width: "100%",
                flexWrap: "nowrap",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                    height: 3,
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c4c4c4",
                    borderRadius: 4,
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f0f0f0",
                    borderRadius: 4,
                },
            }
        } >
        { /* SEARCH BAR  */ } <
        Box sx = {
            {
                flex: 1,
                minWidth: {
                    xs: "80px",
                    sm: "120px"
                },
                mt: 0.7,
                mb: 0.5
            }
        } >
        <
        TextField size = "small"
        placeholder = "Search documents..."
        value = {
            search
        }
        onChange = {
            (e) => setSearch(e.target.value)
        }
        fullWidth sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fafafa",
                    "& input": {
                        padding: "8.5px 0px",
                    },
                },
            }
        }
        InputProps = {
            {
                startAdornment: ( <
                    InputAdornment position = "start" >
                    <
                    SearchIcon fontSize = "small" / >
                    <
                    /InputAdornment>
                ),
            }
        }
        /> <
        /Box>

        { /* STATUS FILTER - fixed width */ } <
        Box sx = {
            {
                flex: "0 0 auto",
                width: {
                    xs: "120px",
                    sm: "140px",
                    md: "160px"
                }
            }
        } >
        <
        FormControl size = "small"
        fullWidth sx = {
            {
                mt: 0.7,
                mb: 0.5
            }
        } >
        <
        InputLabel > Status < /InputLabel> <
        Select value = {
            statusFilter
        }
        label = "Status"
        onChange = {
            (e) => setStatusFilter(e.target.value)
        }
        sx = {
            {
                borderRadius: "12px",
                backgroundColor: "#fafafa",
            }
        } >
        <
        MenuItem value = "All" > All < /MenuItem> <
        MenuItem value = "Pending" > Pending < /MenuItem> <
        MenuItem value = "Approved" > Approved < /MenuItem> <
        MenuItem value = "Rejected" > Rejected < /MenuItem> <
        MenuItem value = "in_review" > in_review < /MenuItem> <
        MenuItem value = "approved_level_1" > approved_level_1 < /MenuItem> <
        MenuItem value = "approved_with_flag" > approved_with_flag < /MenuItem> <
        MenuItem value = "approved_with_flag_level_1" > approved_with_flag_level_1 < /MenuItem> <
        /Select> <
        /FormControl> <
        /Box>

        { /* PROJECT FILTER - fixed width */ } <
        Box sx = {
            {
                flex: "0 0 auto",
                width: {
                    xs: "130px",
                    sm: "160px",
                    md: "200px"
                }
            }
        } >
        <
        FormControl size = "small"
        fullWidth sx = {
            {
                mt: 0.7,
                mb: 0.5
            }
        } >
        <
        InputLabel > Project < /InputLabel> <
        Select value = {
            filterProject
        }
        label = "Project"
        onChange = {
            (e) => {
                setFilterProject(e.target.value);
                setFilterWindfarm("All");
            }
        }
        sx = {
            {
                borderRadius: "12px",
                backgroundColor: "#fafafa",
            }
        } >
        <
        MenuItem value = "All" > All < /MenuItem> {
            safeProjects.map((project) => ( <
                MenuItem key = {
                    project.id
                }
                value = {
                    project.id
                } > {
                    project.project_name || project.name
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        /Box>

        { /* WINDFARM FILTER - fixed width */ } <
        Box sx = {
            {
                flex: "0 0 auto",
                width: {
                    xs: "130px",
                    sm: "160px",
                    md: "200px"
                }
            }
        } >
        <
        FormControl size = "small"
        fullWidth sx = {
            {
                mt: 0.7,
                mb: 0.5
            }
        } >
        <
        InputLabel > Windfarm < /InputLabel> <
        Select value = {
            filterWindfarm
        }
        label = "Windfarm"
        onChange = {
            (e) => setFilterWindfarm(e.target.value)
        }
        sx = {
            {
                borderRadius: "12px",
                backgroundColor: "#fafafa",
            }
        } >
        <
        MenuItem value = "All" > All < /MenuItem> {
            (filterProject === "All" ?
                safeProjects.flatMap((project) =>
                    Array.isArray(project.windfarms) ? project.windfarms : []
                ) :
                safeProjects.find(
                    (project) => Number(project.id) === Number(filterProject)
                ) ? .windfarms || []
            ).map((wf) => ( <
                MenuItem key = {
                    wf.id
                }
                value = {
                    wf.id
                } > {
                    wf.windfarm_name || wf.name
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        /Box>

        { /* CREATE DOCUMENT BUTTON - fixed width */ } {
            user ? .role !== "customer" && user ? .role !== "admin" && ( <
                Box sx = {
                    {
                        flex: "0 0 auto",
                        mt: 0.7,
                        mb: 0.5
                    }
                } >
                <
                Button variant = "contained"
                startIcon = { < AddIcon / >
                }
                onClick = {
                    () => setOpenDialog(true)
                }
                sx = {
                    {
                        borderRadius: "12px",
                        px: {
                            xs: 2,
                            sm: 2.5,
                            md: 3
                        },
                        py: 1,
                        textTransform: "none",
                        fontWeight: 600,
                        minWidth: {
                            xs: "70px",
                            sm: "120px",
                            md: "180px"
                        },
                        whiteSpace: "nowrap",
                    }
                } >
                {
                    window.innerWidth < 500 ? "Add" : window.innerWidth < 768 ? "Create" : "Create Document"
                } <
                /Button> <
                /Box>
            )
        }

        { /* DOWNLOAD BUTTON - fixed width */ } <
        Box sx = {
            {
                flex: "0 0 auto",
                mt: 0.7,
                mb: 0.5
            }
        } >
        <
        Tooltip title = {
            filterProject === "All" || filterWindfarm === "All" ?
            "Select Project and Windfarm to download comments" :
                "Download All Document Comments"
        }
        arrow >
        <
        span >
        <
        IconButton onClick = {
            handleDownloadAllComments
        }
        disabled = {
            exportLoading ||
            filterProject === "All" ||
            filterWindfarm === "All"
        }
        sx = {
            {
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "10px",
                width: 42,
                height: 42,
            }
        } >
        {
            exportLoading ? ( <
                CircularProgress size = {
                    20
                }
                />
            ) : ( <
                FileDownloadIcon / >
            )
        } <
        /IconButton> <
        /span> <
        /Tooltip> <
        /Box> <
        /Box> <
        /Paper>

        { /* CREATE/EDIT DIALOG */ } <
        CreateDocument open = {
            openDialog
        }
        onClose = {
            () => setOpenDialog(false)
        }
        editData = {
            editData
        }
        projects = {
            projects
        }
        filterProject = {
            filterProject
        }
        filterWindfarm = {
            filterWindfarm
        }
        onAdd = {
            onAdd
        }
        onUpdate = {
            onUpdate
        }
        showSnackbar = {
            showSnackbar
        }
        />

        { /* SNACKBAR */ } <
        CustomSnackbar open = {
            snackbar.open
        }
        onClose = {
            handleSnackbarClose
        }
        message = {
            snackbar.message
        }
        severity = {
            snackbar.severity
        }
        /> <
        />
    );
};

export default DocumentToolbar;