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
    Container,
} from "@mui/material";
import parseErrorMessage from "../../../utils/errorFunction";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import {
    createUserMasterData,
    GetUserMasterData,
} from "../../../Redux/MasterData/masterAction";
import UserTable from "../tables/userTable";

const ROLE_CHOICES = [{
        value: "admin",
        label: "Admin"
    },
    {
        value: "manager",
        label: "Manager"
    },
    {
        value: "engineer",
        label: "Inspector"
    },
    {
        value: "technician",
        label: "Technician"
    },
    {
        value: "viewer",
        label: "Viewer"
    },
    {
        value: "inspector",
        label: "Engineer"
    },
    {
        value: "supervisor",
        label: "Supervisor"
    },
    {
        value: "safety_officer",
        label: "Safety Officer"
    },
    {
        value: "quality_officer",
        label: "Quality Officer"
    },
    {
        value: "store_keeper",
        label: "Store Keeper"
    },
    {
        value: "customer",
        label: "Customer"
    },
];

const UserMaster = () => {
    const dispatch = useDispatch();

    const {
        FetchUsermasterData = []
    } = useSelector(
        (state) => state.masterData || {},
    );

    useEffect(() => {
        dispatch(GetUserMasterData());
    }, [dispatch]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const initialState = {
        email: "",
        full_name: "",
        password: "",
        mobile: "",
        role: "viewer",
        profile_picture: null,
    };

    const [data, setData] = useState(initialState);
    const [preview, setPreview] = useState(null);

    // ✅ Tracks granular UI field validation errors
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => {
        let value =
            field === "profile_picture" ? e.target.files[0] : e.target.value;

        // ✅ Clean international mobile string inputs dynamically
        if (field === "mobile") {
            value = value.replace(/[^\d+]/g, "");
        }

        setData((prev) => ({ ...prev,
            [field]: value
        }));

        // Reset targeted inline field error warnings on active typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev,
                [field]: ""
            }));
        }

        if (field === "profile_picture" && e.target.files[0]) {
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    // ✅ Front-End Validation Handler Rules
    const validateForm = () => {
        let tempErrors = {};

        if (!data.full_name.trim()) {
            tempErrors.full_name = "Full name is required.";
        }

        // ✅ Password Check: Must have a number, letter, and special character
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!data.password) {
            tempErrors.password = "Password is required.";
        } else if (!passwordRegex.test(data.password)) {
            tempErrors.password =
                "Must be at least 6 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.";
        }

        // ✅ Mobile Check: Max 15 characters limit for international formats
        const rawDigits = data.mobile.replace(/\D/g, "");
        if (!data.mobile.trim()) {
            tempErrors.mobile = "Mobile number is required.";
        } else if (rawDigits.length < 7) {
            tempErrors.mobile =
                "International phone numbers must contain at least 7 digits.";
        } else if (data.mobile.length > 15) {
            tempErrors.mobile = "Total input string cannot exceed 15 characters.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // const handleSubmit = (e) => {
    //   if (e) e.preventDefault();

    //   if (!validateForm()) {
    //     setSnackbar({
    //       open: true,
    //       message: "Please correct form verification errors before saving.",
    //       severity: "warning",
    //     });
    //     return;
    //   }

    //   const formData = new FormData();
    //   formData.append("email", data.email.trim());
    //   formData.append("full_name", data.full_name.trim());
    //   formData.append("password", data.password);
    //   formData.append("mobile", data.mobile.trim());
    //   formData.append("role", data.role);

    //   if (data.profile_picture) {
    //     formData.append("profile_picture", data.profile_picture);
    //   }

    //   dispatch(createUserMasterData(formData))
    //     .then(() => {
    //       setSnackbar({
    //         open: true,
    //         message: "User registered successfully!",
    //         severity: "success",
    //       });
    //       setData(initialState);
    //       setPreview(null);
    //       setErrors({});
    //       dispatch(GetUserMasterData());
    //     })
    //     .catch((err) => {
    //       // ✅ Safely catch raw validation objects thrown by updated action dispatchers
    //       const backendErrors = err?.response?.data;

    //       if (
    //         backendErrors &&
    //         typeof backendErrors === "object" &&
    //         !Array.isArray(backendErrors)
    //       ) {
    //         let mappedErrors = {};
    //         Object.keys(backendErrors).forEach((key) => {
    //           mappedErrors[key] = Array.isArray(backendErrors[key])
    //             ? backendErrors[key][0]
    //             : backendErrors[key];
    //         });
    //         setErrors(mappedErrors);

    //         setSnackbar({
    //           open: true,
    //           message:
    //             "Registration rejected. Please resolve highlighted fields.",
    //           severity: "error",
    //         });
    //       } else {
    //         const generalErrorMsg = parseErrorMessage(
    //           backendErrors || err.message || err,
    //         );
    //         setSnackbar({
    //           open: true,
    //           message: generalErrorMsg,
    //           severity: "error",
    //         });
    //       }
    //     });
    // };


    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (!validateForm()) {
            setSnackbar({
                open: true,
                message: "Please correct form verification errors before saving.",
                severity: "warning",
            });
            return;
        }

        const formData = new FormData();
        formData.append('email', data.email.trim());
        formData.append('full_name', data.full_name.trim());
        formData.append('password', data.password);
        formData.append('mobile', data.mobile.trim());
        formData.append('role', data.role);

        if (data.profile_picture) {
            formData.append('profile_picture', data.profile_picture);
        }

        dispatch(createUserMasterData(formData))
            .then(() => {
                setSnackbar({
                    open: true,
                    message: 'User registered successfully!',
                    severity: 'success',
                });
                setData(initialState);
                setPreview(null);
                setErrors({});
                dispatch(GetUserMasterData());
            })
            .catch((err) => {
                const backendErrors = err ? .response ? .data;

                // ✅ Check if the backend returned a validation field dictionary object
                if (backendErrors && typeof backendErrors === 'object' && !Array.isArray(backendErrors)) {
                    let mappedErrors = {};
                    let firstErrorMessage = "";

                    Object.keys(backendErrors).forEach((key, index) => {
                        const currentError = Array.isArray(backendErrors[key]) ?
                            backendErrors[key][0] :
                            backendErrors[key];

                        mappedErrors[key] = currentError;

                        // Grab the very first backend error message to display in the snackbar
                        if (index === 0) {
                            // Clean up field names if necessary, e.g., "email: user with this email..."
                            firstErrorMessage = `${key.replace('_', ' ').toUpperCase()}: ${currentError}`;
                        }
                    });

                    setErrors(mappedErrors);

                    // ✅ Shows the exact backend message inside the snackbar
                    setSnackbar({
                        open: true,
                        message: firstErrorMessage || "Validation failed.",
                        severity: "error",
                    });
                } else {
                    // Fallback if the backend throws a string or standard 500 system crash message
                    const generalErrorMsg = parseErrorMessage(backendErrors || err.message || err);
                    setSnackbar({
                        open: true,
                        message: generalErrorMsg,
                        severity: "error",
                    });
                }
            });
    };
    return ( <
        >
        <
        Container maxWidth = "xl" >
        <
        Paper elevation = {
            3
        }
        sx = {
            {
                py: 3,
                px: 3.5,
                borderRadius: 2,
                mt: -2,
                border: "1px solid #00416A",
            }
        } >
        <
        Box component = "form"
        onSubmit = {
            handleSubmit
        }
        noValidate >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 0.2
            }
        } >
        <
        PersonAddAltIcon sx = {
            {
                color: "#00416A",
                fontSize: 28
            }
        }
        /> <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        Create New User <
        /Typography> <
        /Box>

        <
        Typography sx = {
            {
                color: "text.secondary",
                mb: 3
            }
        } >
        *
        Manage users, roles, and permissions in this section. <
        /Typography>

        <
        Grid container spacing = {
            2
        } > { /* Full Name */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField label = "Full Name"
        fullWidth value = {
            data.full_name
        }
        onChange = {
            handleChange("full_name")
        }
        placeholder = "Ex: Rahul Sharma"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        error = {
            Boolean(errors.full_name)
        }
        helperText = {
            errors.full_name
        }
        /> <
        /Grid>

        { /* Email */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField label = "Email"
        type = "email"

        fullWidth value = {
            data.email
        }
        onChange = {
            handleChange("email")
        }
        placeholder = "Ex: rahul123@domain.com"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        error = {
            Boolean(errors.email)
        }
        helperText = {
            errors.email
        }
        /> <
        /Grid>

        { /* Password */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField label = "Password"
        type = "password"
        fullWidth value = {
            data.password
        }
        onChange = {
            handleChange("password")
        }
        error = {
            Boolean(errors.password)
        }
        helperText = {
            errors.password
        }
        /> <
        /Grid>

        { /* Mobile */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField label = "Mobile"
        fullWidth value = {
            data.mobile
        }
        onChange = {
            handleChange("mobile")
        }
        placeholder = "Ex: +919876543210"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        error = {
            Boolean(errors.mobile)
        }
        helperText = {
            errors.mobile
        }
        inputProps = {
            {
                maxLength: 15
            }
        }
        /> <
        /Grid>

        { /* Role */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField label = "Role"

        select fullWidth value = {
            data.role
        }
        onChange = {
            handleChange("role")
        }
        error = {
            Boolean(errors.role)
        }
        helperText = {
            errors.role
        } >
        {
            ROLE_CHOICES.map(({
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
        /TextField> <
        /Grid>

        { /* Profile Image Input */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        Button variant = "outlined"
        component = "label"
        fullWidth sx = {
            {
                height: "56px"
            }
        } >
        Upload Profile Picture <
        input type = "file"
        hidden accept = "image/*"
        onChange = {
            handleChange("profile_picture")
        }
        /> <
        /Button>

        {
            data.profile_picture && ( <
                Typography variant = "body2"
                mt = {
                    1
                } >
                Selected: {
                    data.profile_picture.name
                } <
                /Typography>
            )
        }

        {
            preview && ( <
                Box mt = {
                    1
                } >
                <
                img src = {
                    preview
                }
                alt = "Profile Preview"
                style = {
                    {
                        maxWidth: "100%",
                        maxHeight: 150,
                        borderRadius: 8,
                    }
                }
                /> <
                /Box>
            )
        } <
        /Grid>

        { /* Submit Trigger Action */ } <
        Grid item xs = {
            12
        }
        textAlign = "center" >
        <
        Button type = "submit"
        variant = "contained"
        size = "small"
        sx = {
            {
                background: "#00416A",
                textTransform: "none"
            }
        } >
        Save User <
        /Button> <
        /Grid>

        <
        CustomSnackbar { ...snackbar
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        }
        /> <
        /Grid> <
        /Box>

        <
        /Paper> <
        Box sx = {
            {
                mt: 4,
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            }
        } >
        <
        UserTable Data = {
            FetchUsermasterData
        }
        />

        <
        /Box>

        <
        /Container> <
        />
    );
};

export default UserMaster;