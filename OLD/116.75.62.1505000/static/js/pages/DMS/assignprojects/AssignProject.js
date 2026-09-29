import React, {
    useState,
    useCallback
} from "react";
import {
    Box,
    Grid,
    TextField,
    Typography,
    Paper,
    Button,
    MenuItem,
    CircularProgress,
} from "@mui/material";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChecklistIcon from "@mui/icons-material/Checklist";
import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import {
    GetDataApiWTGM
} from "../../../utils/api";


const CreateAssignedProject = ({
    onAdd,
    users = [],
    projects = [],
    loading = false,
}) => {

    const [windfarmsData, setWindfarmsData] = useState([]);

    const [formData, setFormData] = useState({
        user: "",
        project: "",
        windfarm: "",
    });

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

    // Fetch windfarms when project changes
    const fetchWindfarms = async (projectId) => {
        try {
            const response = await GetDataApiWTGM(
                `/api/windfarm-master/?project_id=${projectId}`,
            );

            setWindfarmsData(response.results || response);
        } catch (error) {
            console.error(error);
            setWindfarmsData([]);
        }
    };

    // Handle field changes
    const handleChange = async (e) => {
        const {
            name,
            value
        } = e.target;

        const newValue = ["user", "project", "windfarm"].includes(name) ?
            value ?
            Number(value) :
            "" :
            value;

        // Project change → load windfarms
        if (name === "project") {
            setFormData((prev) => ({
                ...prev,
                project: newValue,
                windfarm: "",
            }));

            if (newValue) {
                await fetchWindfarms(newValue);
            } else {
                setWindfarmsData([]);
            }

            return;
        }

        // Normal field update
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    // Submit form
    const handleSubmit = async () => {
        // Required field validation
        if (!formData.user || !formData.project || !formData.windfarm) {
            showSnackbar("Please fill all required fields.", "warning");
            return;
        }

        const data = {
            user: formData.user,
            project: formData.project,
            windfarm: formData.windfarm,
        };

        try {
            await onAdd(data);

            const selectedUser = users.find((u) => u.id === formData.user);

            const selectedProject = projects.find((p) => p.id === formData.project);

            const selectedWindfarm = windfarmsData.find(
                (w) => w.id === formData.windfarm,
            );

            showSnackbar(
                `${selectedProject?.project_name} / ${selectedWindfarm?.windfarm_name} assigned to ${selectedUser?.full_name} successfully`,
                "success",
            );

            // Reset form
            setFormData({
                user: "",
                project: "",
                windfarm: "",
            });

            setWindfarmsData([]);
        } catch (error) {
            console.error("Error assigning project:", error);

            showSnackbar(
                error ? .response ? .data ? .message || "Failed to assign project",
                "error",
            );
        }
    };

    return ( <
        >
        <
        Paper sx = {
            {
                p: 3,
                borderRadius: 3
            }
        } > { /* Heading */ } <
        Typography variant = "h6"
        fontWeight = {
            600
        }
        mb = {
            2
        }
        color = "#00416A"
        display = "flex"
        alignItems = "center" >
        <
        ChecklistIcon sx = {
            {
                fontSize: 28,
                mr: 1
            }
        }
        />
        Assign Project <
        /Typography>

        { /* Form */ } <
        Grid container spacing = {
            3
        } > { /* User */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField select fullWidth size = "small"
        label = "Select User *"
        name = "user"
        value = {
            formData.user
        }
        onChange = {
            handleChange
        } >
        {
            users
            .filter((u) => ["inspector", "customer"].includes(u.role))
            .map((u) => ( <
                MenuItem key = {
                    u.id
                }
                value = {
                    u.id
                } > {
                    u.full_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Project */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField select fullWidth size = "small"
        label = "Select Project *"
        name = "project"
        value = {
            formData.project
        }
        onChange = {
            handleChange
        } >
        {
            projects.map((project) => ( <
                MenuItem key = {
                    project.id
                }
                value = {
                    project.id
                } > {
                    project.project_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Windfarm */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField select fullWidth size = "small"
        label = "Select Windfarm *"
        name = "windfarm"
        value = {
            formData.windfarm
        }
        onChange = {
            handleChange
        }
        disabled = {!formData.project
        } >
        {
            windfarmsData.length > 0 ? (
                windfarmsData.map((windfarm) => ( <
                    MenuItem key = {
                        windfarm.id
                    }
                    value = {
                        windfarm.id
                    } > {
                        windfarm.windfarm_name
                    } <
                    /MenuItem>
                ))
            ) : ( <
                MenuItem disabled > {
                    formData.project ?
                    "No Windfarms Found" :
                        "Select Project First"
                } <
                /MenuItem>
            )
        } <
        /TextField> <
        /Grid> <
        /Grid>

        { /* Submit Button */ } <
        Box mt = {
            3
        }
        display = "flex"
        justifyContent = "center" >
        <
        Button variant = "contained"
        startIcon = {
            loading ? ( <
                CircularProgress size = {
                    18
                }
                color = "inherit" / >
            ) : ( <
                AssignmentTurnedInIcon / >
            )
        }
        onClick = {
            handleSubmit
        }
        disabled = {
            loading
        }
        sx = {
            {
                borderRadius: 2,
                px: 3,
                textTransform: "none",
            }
        } >
        {
            loading ? "Assigning..." : "Assign Project"
        } <
        /Button> <
        /Box> <
        /Paper> <
        CustomSnackbar open = {
            snackbar.open
        }
        message = {
            snackbar.message
        }
        severity = {
            snackbar.severity
        }
        onClose = {
            () => setSnackbar((prev) => ({ ...prev,
                open: false
            }))
        }
        /> <
        />
    );
};

export default CreateAssignedProject;