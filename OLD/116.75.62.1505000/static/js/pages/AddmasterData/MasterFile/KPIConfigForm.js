import React, {
    useState,
    useEffect,
    useCallback
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetProjectsData,
    GetActivityFieldList,
    CreateKPIMaster,
    GetKPIMasterList,
    UpdateKPIMaster,
    GetWindFarmMasterData,
    GetComponentTypesList,
} from "../../../Redux/MasterData/masterAction";
import {
    TextField,
    MenuItem,
    Button,
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import KPIMasterTable from "../tables/KPIMasterTable";
const KPIConfigForm = () => {
    const dispatch = useDispatch();
    // Added projects and windfarms from Redux state
    const {
        activityFields,
        kpiList,
        loading,
        success,
        projects,
        windfarms,
        componentTypesList,
    } = useSelector((state) => state.masterData || "");
    const initialFormState = {
        project: "",
        activity_code: "",
        field_name: "",
        min_value: "",
        max_value: "",
        msg: "",
    };
    const [formData, setFormData] = useState(initialFormState);
    const [editId, setEditId] = useState(null);
    // 🔥 NEW: State for filtering the table project-wise
    const [tableFilterProject, setTableFilterProject] = useState("");
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
    useEffect(() => {
        if (!tableFilterProject) return;
        const queryParams = `?project=${tableFilterProject}`;
        dispatch(GetKPIMasterList(queryParams));
    }, [dispatch, success, tableFilterProject]);
    const handleProjectChange = (e) => {
        const selectedProject = e.target.value;
        // 1. Update the form state for submissions
        setFormData((prev) => ({ ...prev,
            project: selectedProject
        }));
        // 2. Set the filter state to trigger your useEffect API call
        setTableFilterProject(selectedProject);
    };
    useEffect(() => {
        dispatch(GetProjectsData());
        dispatch(GetComponentTypesList());
    }, [dispatch]);
    useEffect(() => {
        if (success) {
            setFormData(initialFormState);
            setEditId(null);
        }
    }, [success]);
    const handleEditClick = (row) => {
        setEditId(row.id);
        dispatch(GetActivityFieldList(row.activity_code));
        setFormData({
            project: row.project || "",
            activity_code: row.activity_code,
            field_name: row.field_name,
            min_value: row.min_value || "",
            max_value: row.max_value || "",
            msg: row.msg || "",
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    const handleActivityChange = (e) => {
        const code = e.target.value;
        setFormData({ ...formData,
            activity_code: code,
            field_name: ""
        });
        dispatch(GetActivityFieldList(code));
    };
    const handleChange = (e) => {
        setFormData({ ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await dispatch(UpdateKPIMaster(editId, formData));
                showSnackbar("KPI Rule updated successfully!", "success");
                setEditId(null);
            } else {
                await dispatch(CreateKPIMaster(formData));
                showSnackbar("KPI Rule configuration saved!", "success");
            }
            setFormData((prev) => ({
                ...initialFormState,
                project: prev.project,
            }));
        } catch (err) {
            setSnackbar({
                open: true,
                message: String(err),
                severity: "error",
            });
        }
    };
    const filteredActivityTypes = componentTypesList.filter(
        (item) => item.type === "ACTIVITY",
    );
    return ( <
        Box sx = {
            {
                p: 2
            }
        } >
        <
        Paper elevation = {
            1
        }
        sx = {
            {
                p: 3,
                borderRadius: 2,
                mt: -2,
                border: "1px solid #00416A",
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A",
                mt: 0.5
            }
        } >
        KPI Rule Manager <
        /Typography> <
        Typography sx = {
            {
                color: "text.secondary",
                mb: 3
            }
        } >
        Define validation rules
        for specific project fields. <
        /Typography> <
        form onSubmit = {
            handleSubmit
        } >
        <
        Grid container spacing = {
            2
        } > { /* 1. Project Selection */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField select fullWidth label = "Select Project"
        name = "project"
        value = {
            formData.project
        }
        onChange = {
            handleProjectChange
        }
        required >
        {
            projects ? .map((proj) => ( <
                MenuItem key = {
                    proj.id
                }
                value = {
                    proj.id
                } > {
                    proj.project_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid> { /* 3. Activity Selection */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField select fullWidth label = "Activity"
        name = "activity_code"
        value = {
            formData.activity_code
        }
        onChange = {
            handleActivityChange
        }
        required >
        {
            filteredActivityTypes.map((option) => ( <
                MenuItem key = {
                    option.id
                }
                value = {
                    option.name
                } > {
                    option.label
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid> { /* 4. Dynamic Field Selection */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField select fullWidth label = "Database Field"
        name = "field_name"
        value = {
            formData.field_name
        }
        onChange = {
            handleChange
        }
        disabled = {!formData.activity_code || activityFields.length === 0
        }
        required helperText = "Numeric fields only" >
        {
            activityFields.map((field) => ( <
                MenuItem key = {
                    field.value
                }
                value = {
                    field.value
                } > {
                    field.label
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid> { /* Min/Max Values */ } <
        Grid item xs = {
            6
        }
        sm = {
            3
        } >
        <
        TextField fullWidth type = "number"
        label = "Min Value"
        name = "min_value"
        value = {
            formData.min_value
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid> <
        Grid item xs = {
            6
        }
        sm = {
            3
        } >
        <
        TextField fullWidth type = "number"
        label = "Max Value"
        name = "max_value"
        value = {
            formData.max_value
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid> { /* Error Message */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth label = "Validation Error Message"
        placeholder = "Ex: Temperature exceeds limit"
        name = "msg"
        value = {
            formData.msg
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /Grid> <
        Grid item xs = {
            12
        }
        textAlign = "right" > {
            editId && ( <
                Button onClick = {
                    () => {
                        setEditId(null);
                        setFormData(initialFormState);
                    }
                }
                sx = {
                    {
                        mr: 2,
                        color: "text.secondary"
                    }
                } >
                Cancel <
                /Button>
            )
        } <
        Button variant = "contained"
        type = "submit"
        disabled = {
            loading
        }
        sx = {
            {
                background: editId ? "#1976D2" : "#00416A",
                px: 4,
                "&:hover": {
                    background: editId ? "#115293" : "#003354"
                },
            }
        } >
        {
            loading ? ( <
                CircularProgress size = {
                    24
                }
                color = "inherit" / >
            ) : editId ? (
                "Update Version"
            ) : (
                "Create KPI Rule"
            )
        } <
        /Button> <
        /Grid> <
        /Grid> <
        /form> <
        /Paper> { /* --- Table Container --- */ } <
        Box sx = {
            {
                mt: 4,
                // p: 3,
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            }
        } >
        <
        KPIMasterTable selectedProjectId = {
            formData.project
        }
        kpiList = {
            kpiList
        }
        onEdit = {
            handleEditClick
        }
        componentTypesList = {
            filteredActivityTypes
        }
        /> <
        /Box> <
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
        /Box>
    );
};
export default KPIConfigForm;