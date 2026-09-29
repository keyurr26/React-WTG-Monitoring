import React, {
    useState,
    useEffect
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    MenuItem,
    InputLabel,
    Stack,
    FormControl,
    Select,
} from "@mui/material";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SearchIcon from "@mui/icons-material/Search";

import CreateAssignedProject from "./AssignProject";
import AssignedProjectTable from "./AssignProjectTable";

import {
    CreateAssignTaskData,
    GetAssignTaskData,
} from "../../../Redux/DmsData/AssignTask/AssignTaskAction";

import {
    GetProjectsData,
    GetUserMasterData,
    GetWindFarmMasterData,
} from "../../../Redux/MasterData/masterAction";


const AssignedProjectContainer = () => {
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const [filterProject, setFilterProject] = useState("All");
    const [filterWindfarm, setFilterWindfarm] = useState("All");
    const [assigning, setAssigning] = useState(false);

    // Redux State
    const {
        assignedTasks = [],
    } = useSelector((state) => state.assignTask || {});

    const {
        FetchUsermasterData = [],
            projects = [],
            WindfarmData = [],
    } = useSelector((state) => state.masterData || {});

    const windFarms = WindfarmData;
    const users = FetchUsermasterData;

    // Load Data
    useEffect(() => {
        dispatch(GetAssignTaskData());
        dispatch(GetUserMasterData());
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());
    }, [dispatch]);

    // Create Assigned Project
    const handleAddTask = async (formData) => {
        try {
            setAssigning(true);
            await dispatch(CreateAssignTaskData(formData));
            await dispatch(GetAssignTaskData());
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setAssigning(false);
        }
    };

    // Filter Options
    const projectOptions = [
        "All",
        ...projects.map((project) => project.project_name),
    ];

    const windfarmOptions = [
        "All",
        ...windFarms.map((windfarm) => windfarm.windfarm_name),
    ];

    // Filter Data
    const filteredData = assignedTasks.filter((item) => {
        const userName = item.user_name || "";

        return (
            userName.toLowerCase().includes(search.toLowerCase()) &&
            (filterProject === "All" || item.project_name === filterProject) &&
            (filterWindfarm === "All" || item.windfarm_name === filterWindfarm)
        );
    });

    return ( <
        >
        <
        Box sx = {
            {
                px: 5,
                py: 2,
                backgroundColor: "#f4f6f8",
                minHeight: "100vh",
            }
        } >
        { /* Header */ } <
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
        Project Data <
        /Typography> <
        /Box>

        <
        Box sx = {
            {
                maxWidth: "100%",
                mx: "auto"
            }
        } > { /* Form */ } <
        Box sx = {
            {
                mb: 8
            }
        } >
        <
        CreateAssignedProject onAdd = {
            handleAddTask
        }
        users = {
            users
        }
        projects = {
            projects
        }
        windfarms = {
            windFarms
        }
        loading = {
            assigning
        }
        /> <
        /Box>

        { /* Search + Filters + Table */ } {
            /* <Paper
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          mb: 6,
                        }}
                      > */
        } <
        Stack direction = "row"
        spacing = {
            2
        }
        alignItems = "center"
        mb = {
            2
        }
        sx = {
            {
                width: "100%",
                flexWrap: "wrap",
            }
        } >
        { /* Search */ } <
        TextField size = "small"
        placeholder = "Search..."
        value = {
            search
        }
        onChange = {
            (e) => setSearch(e.target.value)
        }
        sx = {
            {
                flexGrow: 1,
                minWidth: 250,
                "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#fff",
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
        />

        { /* Project Filter */ } <
        FormControl size = "small"
        sx = {
            {
                width: 180
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
                borderRadius: "10px",
                backgroundColor: "#fff",
            }
        } >
        {
            projectOptions.map((project) => ( <
                MenuItem key = {
                    project
                }
                value = {
                    project
                } > {
                    project
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl>

        { /* Windfarm Filter */ } <
        FormControl size = "small"
        sx = {
            {
                width: 180
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
                borderRadius: "10px",
                backgroundColor: "#fff",
            }
        } >
        {
            windfarmOptions.map((windfarm) => ( <
                MenuItem key = {
                    windfarm
                }
                value = {
                    windfarm
                } > {
                    windfarm
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        /Stack> 

        { /* Table */ } <
        AssignedProjectTable data = {
            filteredData
        }
        users = {
            users
        }
        /> { /* </Paper> */ } <
        /Box> <
        /Box> <
        />
    );
};

export default AssignedProjectContainer;