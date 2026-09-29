import React, {
    useState,
    useEffect
} from "react";
import {
    Grid,
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    IconButton,
} from "@mui/material";
import {
    Close as CloseIcon,
    CloudUpload as UploadIcon,
} from "@mui/icons-material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    createProjectData,
    GetProjectsData,
    updateProjectData,
} from "../../../Redux/MasterData/masterAction";
import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import ProjectTable from "../tables/ProjectTableMaster";
const ProjectMaster = () => {
    const dispatch = useDispatch();
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const {
        loading,
        projects
    } = useSelector((state) => state.masterData || {});
    useEffect(() => {
        dispatch(GetProjectsData());
    }, [dispatch]);
    const initialForm = {
        project_name: "",
        client_name: "",
        address: "",
        contact_person: "",
        contact_phone: "",
        email: "",
        customer_logo: null,
    };
    const [data, setData] = useState(initialForm);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    // const isValidEmail = (email) => {
    //   try {
    //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    //   } catch {
    //     return false;
    //   }
    // };
    // ✅ TEXT INPUT HANDLER
    const handleChange = (field) => (e) => {
        setData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };
    // ✅ FILE UPLOAD HANDLER (FIXED)
    const handleFileChange = (e) => {
        const file = e.target.files ? .[0];
        if (!file) return;
        setData((prev) => ({
            ...prev,
            customer_logo: file,
        }));
    };
    // ✅ REMOVE IMAGE
    const handleRemovePhoto = () => {
        setData((prev) => ({
            ...prev,
            customer_logo: null,
        }));
    };
    const handleCancel = () => {
        setIsEdit(false);
        setEditId(null);
        setData(initialForm);
    };
    const handleViewLogo = (project) => {
        if (project ? .customer_logo) {
            window.open(project.customer_logo, "_blank");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("project_name", data.project_name);
            formData.append("client_name", data.client_name);
            formData.append("address", data.address);
            formData.append("contact_person", data.contact_person);
            formData.append("contact_phone", data.contact_phone);
            formData.append("email", data.email);
            if (data.customer_logo instanceof File) {
                formData.append("customer_logo", data.customer_logo);
            }
            if (isEdit) {
                await dispatch(updateProjectData(editId, formData));
                setSnackbar({
                    open: true,
                    message: "Project updated successfully",
                    severity: "success",
                });
            } else {
                await dispatch(createProjectData(formData));
                setSnackbar({
                    open: true,
                    message: "Project created successfully",
                    severity: "success",
                });
            }
            setData(initialForm);
            setIsEdit(false);
            setEditId(null);
        } catch (err) {
            setSnackbar({
                open: true,
                message: String(err),
                severity: "error",
            });
        }
    };
    const handleEdit = (project) => {
        setIsEdit(true);
        setEditId(project.id);
        setData({
            project_name: project.project_name,
            client_name: project.client_name,
            address: project.address,
            contact_person: project.contact_person,
            contact_phone: project.contact_phone,
            email: project.email,
            customer_logo: null,
        });
    };
    return ( <
        >
        <
        Paper elevation = {
            1
        }
        sx = {
            {
                mt: -2,
                p: 4,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.75)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                transition: "0.3s",
                border: "1px solid #00416A",
                "&:hover": {
                    boxShadow: "0 12px 45px rgba(0,0,0,0.14)"
                },
            }
        } >
        <
        Box component = "form"
        onSubmit = {
            handleSubmit
        } >
        <
        Box sx = {
            {
                mb: 1,
                textAlign: "left",
                pt: 0.2,
                pb: 2,
                px: 2,
                pl: 1,
                pr: 2,
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
        Create New Project <
        /Typography> <
        Typography sx = {
            {
                color: "text.secondary",
                mb: 0.2
            }
        } >
        *
        Add and manage all project details effortlessly. <
        /Typography> <
        /Box> <
        Grid container spacing = {
            3
        } > { /* TEXT FIELDS */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Project Name"
        fullWidth required value = {
            data.project_name
        }
        onChange = {
            handleChange("project_name")
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Client Name"
        fullWidth required value = {
            data.client_name
        }
        onChange = {
            handleChange("client_name")
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Contact Person"
        fullWidth required value = {
            data.contact_person
        }
        onChange = {
            handleChange("contact_person")
        }
        /> <
        /Grid> {
            /* <Grid item xs={12} sm={3}>
            <TextField
                            label="Phone"
                            fullWidth
                            required
                            value={data.contact_phone}
                            onChange={handleChange("contact_phone")}
                          />
            </Grid> */
        } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Phone"
        type = "tel"
        fullWidth required value = {
            data.contact_phone
        }
        onChange = {
            (e) => {
                let value = e.target.value;
                // Allow only digits, spaces, and +
                value = value.replace(/[^\d+ ]/g, "");
                // Only one + and only at the beginning
                if (/^\+?[\d ]*$/.test(value)) {
                    setData({
                        ...data,
                        contact_phone: value,
                    });
                }
            }
        }
        inputProps = {
            {
                maxLength: 15,
                inputMode: "numeric",
            }
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Email"
        type = "email"
        fullWidth required value = {
            data.email
        }
        // error={isValidEmail}
        onChange = {
            handleChange("email")
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        sm = {
            9
        } >
        <
        TextField label = "Address"
        fullWidth required value = {
            data.address
        }
        onChange = {
            handleChange("address")
        }
        /> <
        /Grid> { /* ✅ UPLOAD PHOTO (FIXED) */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        Box sx = {
            {
                p: 2,
                border: "1px dashed",
                borderRadius: 2
            }
        } >
        <
        Button component = "label"
        variant = "outlined"
        startIcon = { < UploadIcon / >
        }
        size = "small" >
        Upload Client Logo <
        input type = "file"
        hidden accept = "image/*"
        onChange = {
            handleFileChange
        }
        /> <
        /Button> { /* PREVIEW */ } {
            data.customer_logo && ( <
                Box mt = {
                    2
                }
                sx = {
                    {
                        position: "relative",
                        width: 220
                    }
                } >
                <
                img src = {
                    URL.createObjectURL(data.customer_logo)
                }
                alt = "preview"
                style = {
                    {
                        width: "100%",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                    }
                }
                /> <
                IconButton size = "small"
                onClick = {
                    handleRemovePhoto
                }
                sx = {
                    {
                        position: "absolute",
                        top: -10,
                        right: -10,
                        bgcolor: "white",
                    }
                } >
                <
                CloseIcon fontSize = "small" / >
                <
                /IconButton> <
                /Box>
            )
        } <
        /Box> <
        /Grid> { /* SUBMIT */ } {
            /* <Grid item xs={12} textAlign="center">
            <Button type="submit" variant="contained">
                            {isEdit ? "Update Project" : "Save Project"}
            </Button>
            </Grid> */
        } { /* SUBMIT & CANCEL BUTTONS */ } <
        Grid item xs = {
            12
        }
        textAlign = "center" >
        <
        Box display = "flex"
        justifyContent = "center"
        gap = {
            2
        } >
        <
        Button type = "submit"
        variant = "contained"
        disabled = {
            loading
        }
        sx = {
            {
                background: "#00416A",
                textTransform: "none"
            }
        } >
        {
            loading ?
            "Saving..." :
                isEdit ?
                "Update Project" :
                "Save Project"
        } <
        /Button> {
            isEdit && ( <
                Button variant = "outlined"
                color = "secondary"
                onClick = {
                    handleCancel
                }
                disabled = {
                    loading
                }
                sx = {
                    {
                        textTransform: "none"
                    }
                } >
                Cancel <
                /Button>
            )
        } <
        /Box> <
        /Grid> <
        /Grid> <
        CustomSnackbar { ...snackbar
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        }
        /> <
        /Box> <
        /Paper> <
        Box sx = {
            {
                mt: 4
            }
        } >
        <
        ProjectTable projects = {
            projects
        }
        onEdit = {
            handleEdit
        }
        onViewLogo = {
            handleViewLogo
        }
        /> <
        /Box> <
        />
    );
};
export default ProjectMaster;