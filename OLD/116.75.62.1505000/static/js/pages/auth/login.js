import React, {
    useState,
    useEffect
} from "react";
import {
    useNavigate
} from "react-router-dom";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Fade,
    InputAdornment,
} from "@mui/material";
import {
    EmailOutlined,
    LockOutlined,
    LoginOutlined,
    PersonAddOutlined,
} from "@mui/icons-material";
import logouges from "../../assets/l1.jpg";
import {
    login
} from "../../Redux/Authentication/authActions";
import {
    CircularProgress
} from "@mui/material";
import WindTurbines from "./turbine";
import CustomSnackbar from "../../components/comman/CustomSnackbar";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const {
        loading,
        isAuthenticated,
        user
    } = useSelector((state) => state.auth);
    useEffect(() => {
        if (isAuthenticated && user ? .role) {

            const role = user.role.toLowerCase();
            const currentPath = window.location.pathname;
            if (currentPath === "/") {
                switch (role) {
                    case "admin":
                        navigate("/dash-board");
                        break;

                    case "inspector":
                    case "supervisor":
                        navigate("/construction-stages");
                        break;

                    case "store_keeper":
                        navigate("/inventory-management");
                        break;

                    case "customer":
                        navigate("/dms-tab");
                        break;

                    case "quality_officer":
                    case "safety_officer":
                        navigate("/safety-quality");
                        break;

                    default:
                        navigate("/unauthorized");
                }
            }
        }
    }, [isAuthenticated, user, navigate]);

    // useEffect(() => {
    //   if (isAuthenticated && user?.role) {
    //     if (user.role === "admin") navigate("/dash-board");
    //     else if (user.role === "inspector") navigate("/construction-stages");
    //   }
    // }, [isAuthenticated,user, navigate]);

    const validateForm = () => {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const passwordValid = password.length >= 6;

        setEmailError(!emailValid);
        setPasswordError(!passwordValid);

        return emailValid && passwordValid;
    };


    // const handleLogin = (e) => {
    //   e.preventDefault();
    //   if (validateForm()) {
    //     dispatch(login(email, password));
    //   }
    // };
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await dispatch(login(email, password));

            setSnackbar({
                open: true,
                message: "Login successful",
                severity: "success",
            });

        } catch (err) {
            setSnackbar({
                open: true,
                message: err || "Login failed",
                severity: "error",
            });
        }
    };

    return ( <
        Box sx = {
            {
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                display: "flex",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
            }
        } >
        <
        WindTurbines / >

        <
        Container maxWidth = "md" >
        <
        Fade in = {
            true
        }
        timeout = {
            800
        } >
        <
        Box sx = {
            {
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr"
                },
                gap: 4,
                alignItems: "center",
            }
        } >
        { /* Left side - Branding */ } <
        Box sx = {
            {
                display: {
                    xs: "none",
                    md: "flex"
                },
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
            }
        } >
        <
        Box sx = {
            {
                width: "100%",
                maxWidth: 400,
                textAlign: "center",
            }
        } >
        <
        Box component = "img"
        src = {
            logouges
        }
        alt = "WTG Logo"
        sx = {
            {
                height: 120,
                width: "auto",
                objectFit: "contain",
                mb: 3,
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
            }
        }
        /> <
        Typography variant = "h4"
        sx = {
            {
                fontWeight: 700,
                background: "linear-gradient(45deg, #00416a 30%, #0080a8 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
            }
        } >
        WTG Construction Monitoring <
        /Typography> <
        Typography variant = "body1"
        sx = {
            {
                color: "text.secondary",
                lineHeight: 1.6,
                fontSize: "1.1rem",
            }
        } >
        Monitor and manage your wind turbine construction projects efficiently with our comprehensive platform. <
        /Typography> <
        /Box> <
        /Box>

        { /* Right side - Login Form */ } <
        Box sx = {
            {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                p: 2,
            }
        } >
        <
        Paper elevation = {
            8
        }
        sx = {
            {
                width: "100%",
                maxWidth: 420,
                p: {
                    xs: 3,
                    sm: 4
                },
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 65, 106, 0.1)",
                position: "relative",
                overflow: "hidden",
                "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: "linear-gradient(90deg, #00416a 0%, #0080a8 100%)",
                },
            }
        } >
        { /* Mobile Logo */ } <
        Box sx = {
            {
                display: {
                    xs: "flex",
                    md: "none"
                },
                justifyContent: "center",
                mb: 3,
            }
        } >
        <
        img src = {
            logouges
        }
        alt = "WTG Logo"
        style = {
            {
                height: 80,
                objectFit: "contain",
            }
        }
        /> <
        /Box>

        <
        Typography variant = "h4"
        align = "center"
        sx = {
            {
                fontWeight: 700,
                mb: 1,
                color: "#00416a",
            }
        } >
        Welcome Back <
        /Typography>

        <
        Typography variant = "body1"
        align = "center"
        sx = {
            {
                color: "text.secondary",
                mb: 4,
            }
        } >
        Sign in to access your dashboard <
        /Typography>

        <
        Box component = "form"
        noValidate autoComplete = "off"
        onSubmit = {
            handleLogin
        } >
        <
        TextField fullWidth margin = "normal"
        label = "Email Address"
        type = "email"
        variant = "outlined"
        value = {
            email
        }
        onChange = {
            (e) => {
                setEmail(e.target.value);
                setEmailError(false);
            }
        }
        error = {
            emailError
        }
        helperText = {
            emailError && "Please enter a valid email address"
        }
        InputProps = {
            {
                startAdornment: ( <
                    InputAdornment position = "start" >
                    <
                    EmailOutlined color = "action" / >
                    <
                    /InputAdornment>
                ),
            }
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(0, 65, 106, 0.02)",
                    "&:hover fieldset": {
                        borderColor: "#00416a",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#00416a",
                    },
                },
            }
        }
        />

        <
        TextField fullWidth margin = "normal"
        label = "Password"
        type = "password"
        variant = "outlined"
        value = {
            password
        }
        onChange = {
            (e) => {
                setPassword(e.target.value);
                setPasswordError(false);
            }
        }
        error = {
            passwordError
        }
        helperText = {
            passwordError && "Password must be at least 6 characters"
        }
        InputProps = {
            {
                startAdornment: ( <
                    InputAdornment position = "start" >
                    <
                    LockOutlined color = "action" / >
                    <
                    /InputAdornment>
                ),
            }
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(0, 65, 106, 0.02)",
                    "&:hover fieldset": {
                        borderColor: "#00416a",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#00416a",
                    },
                },
            }
        }
        />


        <
        Button fullWidth variant = "contained"
        size = "large"
        sx = {
            {
                mt: 4,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                background: "#00416a",
                backgroundImage: "linear-gradient(45deg, #00416a 0%, #005792 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(0, 65, 106, 0.4)",
                "&:hover": {
                    background: "#003153",
                    backgroundImage: "linear-gradient(45deg, #003153 0%, #00416a 100%)",
                    boxShadow: "0 6px 20px rgba(0, 65, 106, 0.5)",
                    transform: "translateY(-1px)",
                },
                "&:active": {
                    transform: "translateY(0)",
                },
                "&.Mui-disabled": {
                    background: "#e0e0e0",
                },
                transition: "all 0.3s ease",
            }
        }
        type = "submit"
        disabled = {
            loading
        }
        startIcon = {!loading && < LoginOutlined / >
        } >
        {
            loading ? ( <
                CircularProgress size = {
                    24
                }
                color = "inherit" / >
            ) : (
                "Sign In"
            )
        } <
        /Button>

        <
        Typography variant = "body2"
        align = "center"
        sx = {
            {
                mt: 3,
                color: "text.secondary",
                "& a": {
                    color: "#00416a",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                        textDecoration: "underline",
                    },
                },
            }
        } >
        Don 't have an account?{" "} <
        Button variant = "text"
        size = "small"
        onClick = {
            () => navigate("/signup")
        }
        startIcon = { < PersonAddOutlined / >
        }
        sx = {
            {
                color: "#00416a",
                fontWeight: 600,
                textTransform: "none",
                p: 0,
                "&:hover": {
                    background: "transparent",
                    textDecoration: "underline",
                },
            }
        } >
        Create Account <
        /Button> <
        /Typography> <
        /Box>

        <
        Box sx = {
            {
                mt: 4,
                pt: 2,
                borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                textAlign: "center",
            }
        } >
        <
        Typography variant = "caption"
        sx = {
            {
                color: "text.disabled",
            }
        } >
        ©2024 WTG Monitoring.All rights reserved. <
        /Typography> <
        /Box> <
        /Paper> <
        /Box> <
        /Box> <
        /Fade>

        <
        /Container> <
        CustomSnackbar { ...snackbar
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        }
        /> <
        /Box>
    );
};

export default Login;