import React, {
    useState,
    useEffect
} from "react";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Box,
    Paper,
} from "@mui/material";
import {
    FaFileAlt
} from "react-icons/fa";
import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import {
    GetProjectsData,
    CreateWindFarmData,
    GetWindFarmMasterData,
    UpdateWindFarmData,
} from "../../../Redux/MasterData/masterAction";
import parseErrorMessage from "../../../utils/errorFunction";
import WindfarmTable from "../tables/WindfarmTable";
const fileFields = [{
    name: "feasibility_report",
    label: "Upload Feasibility Report Document",
    icon: < FaFileAlt style = {
        {
            marginRight: 8
        }
    }
    />,
    accept: "application/pdf",
    multiple: false,
}, ];
const STATUS_CHOICES = [{
        value: "proposed",
        label: "Proposed"
    },
    {
        value: "under_construction",
        label: "Under Construction"
    },
    {
        value: "commissioned",
        label: "Commissioned"
    },
];
const WTGMaster = () => {
    const dispatch = useDispatch();
    const {
        loading,
        projects,
        WindfarmData
    } = useSelector(
        (state) => state.masterData || {},
    );
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const initialForm = {
        project: "",
        state: "",
        windfarm_name: "",
        district: "",
        taluka: "",
        country: "",
        feasibility_report: null,
        no_of_locations: "",
        no_of_clusters: "",
        // line_km: '',
        capacity_mw: "",
        windfarm_status: "proposed",
        utm_zone: "",
    };
    const [data, setData] = useState(initialForm);
    // Track touched fields for real-time red validation
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => {
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());
    }, [dispatch]);
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
    const handleChange = (field) => (e) => {
        const isFileInput = e.target.type === "file";
        const value = isFileInput ? e.target.files[0] : e.target.value;
        if (isFileInput && value) {
            if (value.size > MAX_FILE_SIZE) {
                alert("File size must be under 2 MB");
                return; // file ko state me set mat karo
            }
        }
        setData((prev) => ({ ...prev,
            [field]: value
        }));
        setTouched((prev) => ({ ...prev,
            [field]: true
        }));
    };
    const handleBlur = (field) => () => {
        setTouched((prev) => ({ ...prev,
            [field]: true
        }));
    };
    const handleCancel = () => {
        setIsEdit(false);
        setEditId(null);
        setData(initialForm);
        setTouched({});
        setSubmitted(false);
    };
    // Check if field is empty & needs to turn red (Excludes 'taluka')
    const isFieldInvalid = (fieldName) => {
        if (fieldName === "taluka") return false; // Taluka is optional
        const value = data[fieldName];
        const isEmpty =
            value === undefined || value === null || value.toString().trim() === "";
        return isEmpty && (touched[fieldName] || submitted);
    };
    // Check if file is missing & needs to turn red
    const isFileInvalid = (fieldName) => {
        if (isEdit) return false; // Feasibility report optional in edit mode
        const isMissing = !data[fieldName];
        return isMissing && (touched[fieldName] || submitted);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Required fields check (taluka removed)
        const requiredKeys = [
            "project",
            "windfarm_name",
            "country",
            "state",
            "district",
            "capacity_mw",
            "no_of_locations",
            "no_of_clusters",
            "windfarm_status",
            "utm_zone",
        ];
        const isAnyFieldEmpty = requiredKeys.some(
            (key) => !data[key] || data[key].toString().trim() === "",
        );
        // Document mandatory
        if (!isEdit && !data.feasibility_report) {
            setSnackbarMsg(
                "Please upload Feasibility Report and fill all required fields.",
            );
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }
        if (isAnyFieldEmpty) {
            setSnackbarMsg("Please fill in all red required fields.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });
        // ✅ EDIT MODE
        if (isEdit) {
            dispatch(UpdateWindFarmData(editId, formData))
                .then(() => {
                    setSnackbarMsg("Windfarm updated successfully!");
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                    setIsEdit(false);
                    setEditId(null);
                    setData(initialForm);
                    setTouched({});
                    setSubmitted(false);
                    dispatch(GetWindFarmMasterData());
                })
                .catch((err) => {
                    const msg = parseErrorMessage(err ? .message);
                    setSnackbarMsg(msg);
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                });
        }
        // ✅ CREATE MODE
        else {
            dispatch(CreateWindFarmData(formData))
                .then(() => {
                    setSnackbarMsg("Windfarm saved successfully!");
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                    setData(initialForm);
                    setTouched({});
                    setSubmitted(false);
                    dispatch(GetWindFarmMasterData());
                })
                .catch((err) => {
                    const msg = parseErrorMessage(err ? .message);
                    setSnackbarMsg(msg);
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                });
        }
    };
    const handleEdit = (row) => {
        setIsEdit(true);
        setEditId(row.id);
        setTouched({});
        setSubmitted(false);
        setData({
            project: row.project,
            windfarm_name: row.windfarm_name || "",
            country: row.country || "",
            state: row.state || "",
            district: row.district || "",
            taluka: row.taluka || "",
            capacity_mw: row.capacity_mw || "",
            no_of_locations: row.no_of_locations || "",
            no_of_clusters: row.no_of_clusters || "",
            windfarm_status: row.windfarm_status || "proposed",
            feasibility_report: null,
            utm_zone: row.utm_zone || "",
        });
    };
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };
    const formFields = [{
            name: "project",
            label: "Project",
            type: "select",
            options: projects ?
                projects.map((p) => ({
                    value: p.id,
                    label: `${p.project_name} (${p.contact_person})`,
                })) :
                [],
        },
        {
            name: "windfarm_name",
            label: "Windfarm Name",
            type: "text"
        },
        {
            name: "country",
            label: "Country",
            type: "text"
        },
        {
            name: "state",
            label: "State / Province",
            type: "text"
        },
        {
            name: "district",
            label: "District / Region",
            type: "text"
        },
        {
            name: "taluka",
            label: "Taluka / City / Local Area",
            type: "text"
        },
        {
            name: "utm_zone",
            label: "UTM Zone",
            type: "text",
        },

        {
            name: "capacity_mw",
            label: "Capacity MW",
            type: "number"
        },
        // { name: "line_km", label: "Line KM", type: "number" },
        {
            name: "no_of_locations",
            label: "No Of Locations",
            type: "number"
        },
        {
            name: "no_of_clusters",
            label: "No Of Clusters",
            type: "number"
        },
        {
            name: "windfarm_status",
            label: "Status",
            type: "select",
            options: STATUS_CHOICES,
        },
    ];
    return ( <
        >
        <
        Paper elevation = {
            1
        }
        sx = {
            {
                p: 2,
                mt: -2,
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
        Box p = {
            2
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        Create New Windfarm <
        /Typography> <
        Typography variant = "body2"
        sx = {
            {
                color: "text.secondary",
                mb: 3
            }
        } >
        Define and organize windfarm assets and configurations. <
        /Typography> <
        Grid container spacing = {
            2
        } > {
            formFields.map(({
                name,
                label,
                type,
                options
            }) => {
                const hasError = isFieldInvalid(name);
                return ( <
                    Grid item xs = {
                        12
                    }
                    sm = {
                        2
                    }
                    key = {
                        name
                    } > {
                        type === "select" ? ( <
                            TextField select label = {
                                label
                            }
                            fullWidth value = {
                                data[name]
                            }
                            onChange = {
                                handleChange(name)
                            }
                            onBlur = {
                                handleBlur(name)
                            }
                            disabled = {
                                name === "project" && isEdit
                            }
                            InputLabelProps = {
                                {
                                    shrink: true
                                }
                            }
                            SelectProps = {
                                {
                                    displayEmpty: true
                                }
                            }
                            error = {
                                hasError
                            }
                            // helperText={hasError ? "This field is required" : ""}
                            >
                            <
                            MenuItem value = "" > --Select Project-- < /MenuItem> {
                                options.map(({
                                    value,
                                    label
                                }) => ( <
                                    MenuItem key = {
                                        value
                                    }
                                    value = {
                                        value
                                    } > {
                                        label
                                    } <
                                    /MenuItem>
                                ))
                            } <
                            /TextField>
                        ) : ( <
                            TextField label = {
                                label
                            }
                            fullWidth type = {
                                type
                            }
                            value = {
                                data[name]
                            }
                            onChange = {
                                handleChange(name)
                            }
                            onBlur = {
                                handleBlur(name)
                            }
                            error = {
                                hasError
                            }
                            // helperText={hasError ? "This field is required" : ""}
                            placeholder = {
                                name === "windfarm_name" ?
                                "Ex: Hornsea Offshore Wind Farm" :
                                    name === "country" ?
                                    "Ex: Denmark" :
                                    name === "state" ?
                                    "Ex: North Jutland Region" :
                                    name === "district" ?
                                    "Ex: Esbjerg Municipality" :
                                    name === "taluka" ?
                                    "Ex: Offshore Zone 3" :
                                    name === "utm_zone" ?
                                    "Ex: 43 or 43N"

                                    :
                                    name === "capacity_mw" ?
                                    "Ex: 1200" : // : // : name === "line_km"
                                    //   //   ? "Ex: 85.5"
                                    name === "no_of_locations" ?
                                    "Ex: 120" :
                                    name === "no_of_clusters" ?
                                    "Ex: 8" :
                                    ""
                            }
                            inputProps = {
                                type === "number" ?
                                {
                                    min: 0,
                                    step: name === "capacity_mw" ? "0.01" : "1",
                                } :
                                {}
                            }
                            InputLabelProps = {
                                {
                                    shrink: true
                                }
                            }
                            />
                        )
                    } <
                    /Grid>
                );
            })
        } {
            fileFields.map(({
                name,
                label,
                accept,
                multiple,
                icon
            }) => {
                const hasFileError = isFileInvalid(name);
                return ( <
                    Grid item xs = {
                        12
                    }
                    sm = {
                        4
                    }
                    key = {
                        name
                    } >
                    <
                    Button variant = "outlined"
                    component = "label"
                    fullWidth required startIcon = {
                        icon
                    }
                    color = {
                        hasFileError ? "error" : "primary"
                    }
                    sx = {
                        {
                            textTransform: "none",
                            borderColor: hasFileError ? "#d32f2f" : undefined,
                            color: hasFileError ? "#d32f2f" : undefined,
                        }
                    } >
                    {
                        label
                    } <
                    input type = "file"
                    hidden accept = {
                        accept
                    }
                    multiple = {
                        multiple
                    }
                    onChange = {
                        handleChange(name)
                    }
                    /> <
                    /Button> {
                        hasFileError && ( <
                            Typography mt = {
                                0.5
                            }
                            variant = "caption"
                            sx = {
                                {
                                    color: "#d32f2f",
                                    display: "block"
                                }
                            } >
                            Document is required. <
                            /Typography>
                        )
                    } {
                        data[name] && ( <
                            Typography mt = {
                                1
                            }
                            variant = "body2" >
                            Selected file: {
                                data[name].name
                            } <
                            /Typography>
                        )
                    } { /* Professional note */ } <
                    Typography mt = {
                        0.5
                    }
                    variant = "caption"
                    sx = {
                        {
                            color: "red",
                            display: "block"
                        }
                    } >
                    ⚠️Please upload file under 2 MB only. <
                    /Typography> <
                    /Grid>
                );
            })
        } <
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
        Button variant = "contained"
        onClick = {
            handleSubmit
        }
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
                "Update Windfarm" :
                "Save Windfarm"
        } <
        /Button> { /* SHOW CANCEL BUTTON ONLY WHEN EDITING */ } {
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
        CustomSnackbar open = {
            openSnackbar
        }
        onClose = {
            handleCloseSnackbar
        }
        message = {
            snackbarMsg
        }
        severity = {
            snackbarSeverity
        }
        /> <
        /Box> <
        /Paper> <
        WindfarmTable data = {
            WindfarmData
        }
        onEdit = {
            handleEdit
        }
        /> <
        />
    );
};
export default WTGMaster;