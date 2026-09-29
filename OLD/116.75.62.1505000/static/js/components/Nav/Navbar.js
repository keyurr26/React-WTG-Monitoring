import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    useNavigate,
    useLocation
} from "react-router-dom";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    logout
} from "../../Redux/Authentication/authActions";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Badge,
    Button,
    alpha,
    Divider,
    Stack,
    Chip,
} from "@mui/material";
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
    MARK_NOTIFICATION_READ
} from "../../Redux/ActionTypes";
import {
    NotificationsActiveOutlined,
    LogoutRounded,
    AccountCircleOutlined,
    DashboardCustomizeOutlined,
} from "@mui/icons-material";
import {
    GetNotifications
} from "../../Redux/DashboardData/dashboardAction";
import {
    useRoleMenu
} from "../../hooks/useRoleMenu";
import ugeslogo from "./../../assets/image.jpg";
const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        pathname
    } = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifyAnchor, setNotifyAnchor] = useState(null);
    const user = JSON.parse(sessionStorage.getItem("authTokens")) ? .user || {};
    const userRole = user ? .role || "user";
    const menuItems = useRoleMenu();
    const {
        notifications = [],
            count = 0,
            loading = false,
            needsRefresh = false,
    } = useSelector((state) => state.dashboardData || {});

    // console.log({
    //   loading,
    //   count,
    //   notifications,
    //   needsRefresh,
    // });
    // useEffect(() => {
    //   if (notifications.length === 0) {
    //     dispatch(GetNotifications());
    //   }
    // }, [notifications.length]);
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

    const userRoleLabel = useMemo(() => {
        const found = ROLE_CHOICES.find(
            (role) => role.value.toLowerCase() === userRole.toLowerCase(),
        );
        return found ? found.label : userRole.toUpperCase();
    }, [userRole]);

    useEffect(() => {
        dispatch(GetNotifications());
    }, [dispatch]);
    useEffect(() => {
        if (needsRefresh) {
            dispatch(GetNotifications());
        }
    }, [needsRefresh, dispatch]);
    const handleMenu = (setter) => (e) => setter(e.currentTarget);
    const handleClose = (setter) => () => setter(null);
    // Added handleLogout function
    const handleLogout = () => {
        dispatch(logout());
        navigate("/"); // Assuming login route
        handleClose(setAnchorEl)();
    };
    const notificationRouteMap = {
        soil: {
            mainTab: 2,
            subTab: 1,
        },
        excavation: {
            mainTab: 2,
            subTab: 2,
        },
        pcc: {
            mainTab: 2,
            subTab: 3,
        },
        "conduit laying": {
            mainTab: 2,
            subTab: 4,
        },
        "anchor cage": {
            mainTab: 2,
            subTab: 5,
        },
        reinforcement: {
            mainTab: 2,
            subTab: 6,
        },
        "foundation & casting": {
            mainTab: 2,
            subTab: 7,
        },
        "pouring card": {
            mainTab: 2,
            subTab: 8,
        },
        deshuttering: {
            mainTab: 2,
            subTab: 9,
        },
        "cube test results": {
            mainTab: 2,
            subTab: 11,
        },
        backfilling: {
            mainTab: 2,
            subTab: 12,
        },
        platform: {
            mainTab: 2,
            subTab: 13,
        },
        "t1 installation": {
            mainTab: 3,
            subTab: 0,
        },
        "tower installation": {
            mainTab: 3,
            subTab: 1,
        },
        "nacelle installation": {
            mainTab: 3,
            subTab: 2,
        },
        "rotor hub installation": {
            mainTab: 3,
            subTab: 3,
        },
        "blade installation": {
            mainTab: 3,
            subTab: 4,
        },
        electrical: {
            mainTab: 4,
        },
        uss: {
            mainTab: 5,
        },
    };
    //   const handleNotificationClick = (notification) => {
    //      console.log(notification);
    //   const routeInfo =
    //     notificationRouteMap[notification.tableId.toLowerCase()];
    //   navigate("/approved-reports", {
    //     state: {
    //       tableId: notification.tableId,
    //       recordId: notification.id,
    //       mainTab: routeInfo?.mainTab ?? 0,
    //       subTab: routeInfo?.subTab ?? 0,
    //       project: notification.project,
    //       windfarm: notification.windfarm,
    //       cluster: notification.cluster,
    //     },
    //   });
    //   setNotifyAnchor(null);
    // };
    const handleNotificationClick = (notification) => {
        const routeInfo = notificationRouteMap[notification.tableId.toLowerCase()];
        const lineType = (notification.line_type || "").toLowerCase();
        let electricalTab = 0;
        if (lineType.includes("dog")) {
            electricalTab = 0;
        } else if (lineType.includes("scoh")) {
            electricalTab = 1;
        } else if (lineType.includes("dcoh")) {
            electricalTab = 2;
        } else if (lineType.includes("mcoh")) {
            electricalTab = 3;
        }
        let levelTab = 0;
        switch (notification.level) {
            case "L1":
                levelTab = 0;
                break;
            case "L2":
                levelTab = 1;
                break;
            case "L3":
                levelTab = 2;
                break;
            case "FINAL":
                levelTab = 3;
                break;
            default:
                levelTab = 0;
        }
        navigate("/approved-reports", {
            state: {
                tableId: notification.tableId,
                recordId: notification.id,
                mainTab: routeInfo ? .mainTab ? ? 0,
                electricalTab,
                levelTab,
                subTab: routeInfo ? .subTab ? ? 0,
                project: notification.project,
                windfarm: notification.windfarm,
                cluster: notification.cluster,
                // NEW
                line_type: notification.line_type,
                level: notification.level,
            },
        });
        setNotifyAnchor(null);
    };
    const renderNavTabs = () => ( <
        Stack direction = "row"
        spacing = {
            1
        }
        sx = {
            {
                px: 2
            }
        } > {
            menuItems.map(({
                text,
                icon,
                path,
                color
            }) => {
                const isActive = pathname === path;
                return ( <
                    Button key = {
                        text
                    }
                    onClick = {
                        () => navigate(path)
                    }
                    startIcon = {
                        isActive ? null : icon
                    }
                    sx = {
                        {
                            px: 2,
                            py: 1,

                            borderRadius: "50px", // Pill shape
                            textTransform: "none",
                            fontSize: "0.76rem",
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? "#fff" : "#475569",
                            background: isActive ?
                                `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)` :
                                "transparent",
                            boxShadow: isActive ? `0 4px 12px ${alpha(color, 0.4)}` : "none",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                                background: isActive ?
                                    `linear-gradient(135deg, ${color} 0%, ${color} 100%)` :
                                    alpha(color, 0.1),
                                transform: "translateY(-2px)",
                            },
                        }
                    } >
                    {
                        text
                    } <
                    /Button>
                );
            })
        } <
        /Stack>
    );
    return ( <
        AppBar position = "sticky"
        elevation = {
            0
        }
        sx = {
            {
                background: "linear-gradient(to right, #ffffff, #f8fafc)",
                borderBottom: "1px solid #e2e8f0",
                color: "#1e293b",
            }
        } >
        <
        Toolbar sx = {
            {
                justifyContent: "space-between",
                minHeight: 70
            }
        } > { /* LOGO SECTION */ } <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            3
        } >
        <
        Box component = "img"
        src = {
            ugeslogo
        }
        sx = {
            {
                height: 45,
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                transition: "transform 0.3s",
                "&:hover": {
                    transform: "scale(1.05)"
                },
            }
        }
        /> {
            /* <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a', lineHeight: 1 }}>
            <span style={{ color: "#00416A" }}>UGES</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          Infrastructure Management
            </Typography>
            </Box> */
        } <
        /Stack> { /* NAVIGATION */ } <
        Box sx = {
            {
                display: {
                    xs: "none",
                    lg: "block"
                }
            }
        } > {
            renderNavTabs()
        } <
        /Box> { /* ACTIONS */ } <
        Stack direction = "row"
        spacing = {
            2
        }
        alignItems = "center" >
        <
        IconButton onClick = {
            handleMenu(setNotifyAnchor)
        }
        sx = {
            {
                color: "#64748b",
                bgcolor: "#f1f5f9",
                "&:hover": {
                    bgcolor: "#e2e8f0",
                    color: "#2563EB",
                },
            }
        } >
        <
        Badge badgeContent = {
            count
        }
        color = "error" >
        <
        NotificationsActiveOutlined / >
        <
        /Badge> <
        /IconButton> <
        Box onClick = {
            handleMenu(setAnchorEl)
        }
        sx = {
            {
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                bgcolor: "#0f172a", // Dark mode profile pill
                color: "#fff",
                pl: 0.5,
                pr: 2,
                py: 0.5,
                borderRadius: "50px",
                transition: "0.3s",
                "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                },
            }
        } >
        <
        Avatar sx = {
            {
                width: 32,
                height: 32,
                border: "2px solid #3b82f6",
                bgcolor: "#3b82f6",
            }
        }
        src = {
            user.profile_picture ?
            `${process.env.REACT_APP_BACKEND_URL}${user.profile_picture}` :
                null
        } >
        {
            user.full_name ? .charAt(0)
        } <
        /Avatar> <
        Box sx = {
            {
                display: {
                    xs: "none",
                    sm: "block"
                }
            }
        } >
        <
        Typography variant = "caption"
        sx = {
            {
                display: "block",
                fontWeight: 700,
                lineHeight: 1
            }
        } >
        {
            user.full_name
        } <
        /Typography> <
        Typography variant = "caption"
        sx = {
            {
                color: "#94a3b8",
                fontSize: "0.65rem"
            }
        } >
        {
            userRoleLabel
        } <
        /Typography> <
        /Box> <
        /Box> <
        /Stack> { /* PROFILE MENU */ } <
        Menu anchorEl = {
            anchorEl
        }
        open = {
            Boolean(anchorEl)
        }
        onClose = {
            handleClose(setAnchorEl)
        }
        PaperProps = {
            {
                sx: {
                    mt: 1.5,
                    width: 360,
                    maxHeight: "70vh", // ✅ important fix
                    overflowY: "auto",
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                },
            }
        } >
        <
        Box sx = {
            {
                px: 2,
                py: 1.5
            }
        } >
        <
        Typography variant = "subtitle2"
        fontWeight = {
            700
        } >
        Account Settings <
        /Typography> <
        /Box> <
        Divider / >
        <
        MenuItem onClick = {
            () => navigate("/dash-board")
        }
        sx = {
            {
                py: 1.5
            }
        } >
        <
        DashboardCustomizeOutlined sx = {
            {
                mr: 2,
                color: "#64748b"
            }
        }
        />{" "}
        Dashboard <
        /MenuItem> <
        MenuItem onClick = {
            () => navigate("/my-account")
        }
        sx = {
            {
                py: 1.5
            }
        } >
        <
        AccountCircleOutlined sx = {
            {
                mr: 2,
                color: "#64748b"
            }
        }
        /> My
        Profile <
        /MenuItem> <
        Divider / >
        <
        MenuItem onClick = {
            handleLogout
        }
        sx = {
            {
                py: 1.5,
                color: "#ef4444",
                fontWeight: 600
            }
        } >
        <
        LogoutRounded sx = {
            {
                mr: 2
            }
        }
        /> Logout <
        /MenuItem> <
        /Menu> { /* Notification Menu */ } <
        Menu anchorEl = {
            notifyAnchor
        }
        open = {
            Boolean(notifyAnchor)
        }
        onClose = {
            handleClose(setNotifyAnchor)
        }
        disableScrollLock PaperProps = {
            {
                sx: {
                    mt: 1.5,
                    width: 360,
                    maxHeight: 480,
                    borderRadius: "16px",
                    overflowY: "auto",
                    border: "1px solid #f1f5f9",
                },
            }
        } >
        <
        Box sx = {
            {
                px: 2.5,
                py: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#f8fafc",
            }
        } >
        <
        Typography variant = "subtitle1"
        sx = {
            {
                fontWeight: 800,
                color: "#0f172a",
            }
        } >
        Pending Approvals <
        /Typography> <
        Chip label = {
            `${count} Actionable`
        }
        size = "small"
        sx = {
            {
                bgcolor: count > 0 ? "#fee2e2" : "#f1f5f9",
                color: count > 0 ? "#ef4444" : "#64748b",
                fontWeight: 700,
                fontSize: "0.7rem",
            }
        }
        /> <
        /Box> <
        Divider / > {
            /* {loading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography>Loading...</Typography>
            </Box>
                      ) : notifications.length === 0 ? ( */
        } {
            loading && notifications.length === 0 ? ( <
                Box sx = {
                    {
                        p: 4,
                        textAlign: "center"
                    }
                } >
                <
                Typography > Loading... < /Typography> <
                /Box>
            ) : notifications.length === 0 ? ( <
                Box sx = {
                    {
                        p: 4,
                        textAlign: "center"
                    }
                } >
                <
                Typography variant = "body2"
                fontWeight = {
                    600
                } >
                All caught up!🎉
                <
                /Typography> <
                Typography variant = "caption" >
                No operational entries are awaiting verification. <
                /Typography> <
                /Box>
            ) : ( <
                List sx = {
                    {
                        p: 0
                    }
                } > {
                    notifications.map((notification, index) => {
                        const getStageColor = (tableId) => {
                            if (tableId === "soil") return "#3b82f6";
                            if (tableId === "excavation") return "#f59e0b";
                            if (tableId === "foundation & casting") return "#10b981";
                            return "#6366f1";
                        };
                        const stageColor = getStageColor(notification.tableId);
                        return ( <
                            React.Fragment key = {
                                `${notification.tableId}-${notification.id}`
                            } >
                            <
                            ListItem button onClick = {
                                () => handleNotificationClick(notification)
                            }
                            sx = {
                                {
                                    px: 2.5,
                                    py: 1.75,
                                    borderLeft: `4px solid ${stageColor}`,
                                    "&:hover": {
                                        bgcolor: alpha(stageColor, 0.04),
                                    },
                                }
                            } >
                            <
                            ListItemAvatar >
                            <
                            Avatar sx = {
                                {
                                    width: 28,
                                    height: 28,
                                    bgcolor: alpha(stageColor, 0.1),
                                    color: stageColor,
                                }
                            } >
                            <
                            WarningAmberIcon sx = {
                                {
                                    fontSize: 16
                                }
                            }
                            /> <
                            /Avatar> <
                            /ListItemAvatar> <
                            ListItemText primary = { <
                                Typography
                                variant = "body2"
                                sx = {
                                    {
                                        fontWeight: 700,
                                        color: "#1e293b",
                                    }
                                } >
                                {
                                    notification.title
                                } <
                                /Typography>
                            }
                            secondary = { <
                                Stack
                                direction = "row"
                                spacing = {
                                    1
                                }
                                alignItems = "center"
                                sx = {
                                    {
                                        mt: 0.75
                                    }
                                } >
                                {!(
                                        notification.tableId === "electrical" &&
                                        notification.level === "FINAL"
                                    ) && ( <
                                        Chip label = {
                                            notification.tableId === "electrical" ?
                                            `Pole: ${notification.pole_number || "-"}` :
                                                notification.tableId === "uss" ?
                                                `USS: ${notification.uss_name || "-"}` :
                                                `WTG: ${notification.turbine || "-"}`
                                        }
                                        size = "small"
                                        sx = {
                                            {
                                                height: 18,
                                                fontSize: "10px",
                                                fontWeight: 700,
                                            }
                                        }
                                        />
                                    )
                                } <
                                /Stack>
                            }
                            /> <
                            /ListItem> {
                                index < notifications.length - 1 && < Divider / >
                            } <
                            /React.Fragment>
                        );
                    })
                } <
                /List>
            )
        } <
        /Menu> <
        /Toolbar> { /* MOBILE BOTTOM NAV */ } <
        Box sx = {
            {
                display: {
                    xs: "flex",
                    lg: "none"
                },
                borderTop: "1px solid #f1f5f9",
                overflowX: "auto",
                py: 1,
                bgcolor: "#fff",
            }
        } >
        {
            renderNavTabs()
        } <
        /Box> <
        /AppBar>
    );
};
export default Navbar;