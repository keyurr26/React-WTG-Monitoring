import React, {
    useState,
    useEffect
} from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SearchIcon from "@mui/icons-material/Search";
import {
    useNavigate
} from "react-router-dom";
import ProjectTable from "./components/ProjectTable";
import ProjectDetailsDialog from "./components/ProjectDetailsDialog";

import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetMyProjectsData,
} from "../../../Redux/DmsData/AssignTask/AssignTaskAction";


const ProjectContainer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        projects = [],
            loading = false,
            // error = null,
    } = useSelector((state) => state.assignTask);

    const [search, setSearch] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    // ROLE FILTER
    const filteredProjects = projects.filter((p) =>
        `${p.name || ""} ${p.client || ""} ${p.location || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    // HANDLE ROW CLICK
    const handleRowClick = (project) => {
        setSelectedProject(project);
        setOpenDialog(true);
    };

    useEffect(() => {
        const loadProjects = async () => {
            try {
                await dispatch(GetMyProjectsData());
            } catch (error) {
                console.error(error);
            }
        };
        loadProjects();
    }, [dispatch]);


    return ( <
        >

        <
        Box sx = {
            {
                px: 5,
                py: 2,
                background: "#f4f6f8",
                minHeight: "100vh"
            }
        } > { /* HEADER */ } <
        Box sx = {
            {
                position: "relative",
                mb: 2
            }
        } >
        <
        Typography variant = "h5"
        fontWeight = {
            700
        }
        textAlign = "center"
        color = "#00416A"
        sx = {
            {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
            }
        } >
        <
        AssignmentTurnedInIcon sx = {
            {
                fontSize: 32
            }
        }
        />
        Projects <
        /Typography> <
        /Box>

        { /* SEARCH + TABLE */ } { /* <Paper sx={{ p: 3, borderRadius: 3 }}> */ } { /* Search Box */ } <
        TextField fullWidth size = "small"
        placeholder = "Search projects..."
        value = {
            search
        }
        onChange = {
            (e) => setSearch(e.target.value)
        }
        InputProps = {
            {
                startAdornment: ( <
                    InputAdornment position = "start" >
                    <
                    SearchIcon / >
                    <
                    /InputAdornment>
                ),
            }
        }
        sx = {
            {
                mb: 2,
                bgcolor: "#fff"
            }
        }
        />

        { /* Loading State */ } {
            loading && ( <
                Typography sx = {
                    {
                        mb: 2
                    }
                } >
                Loading projects...
                <
                /Typography>
            )
        }

        { /* Table */ } {
            !loading && ( <
                ProjectTable data = {
                    filteredProjects
                }
                onRowClick = {
                    handleRowClick
                }
                />
            )
        } { /* // </Paper> */ } <
        /Box>

        { /* PROJECT DETAILS DIALOG */ } <
        ProjectDetailsDialog open = {
            openDialog
        }
        onClose = {
            () => setOpenDialog(false)
        }
        project = {
            selectedProject
        }
        onViewDocuments = {
            (projectId, windfarmId) => {
                // 1. Close project details dialog
                setOpenDialog(false);

                // 2. Navigate to Documents tab with filters
                navigate(
                    `/dms-tab?tab=documents&projectId=${projectId}&windfarmId=${windfarmId}`
                );
            }
        }
        /> <
        />
    );
};

export default ProjectContainer;