import React, {
    useState,
    useMemo,
    useEffect
} from "react";
import {
    useSelector
} from "react-redux";
import {
    useSearchParams
} from "react-router-dom";
import {
    Tabs,
    Tab,
    Box,
    Paper,
    Typography,
    Container,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
// Your DMS components
import DocumentContainer from "../DMS/documents/DocumentContainer"
import AssignedProjectContainer from "../DMS/assignprojects/AssignProjectContainer";
import ProjectContainer from "../DMS/projects/ProjectContainer";


const DMSMainIndex = () => {

    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");

    const [tabIndex, setTabIndex] = useState(0);
    // Logged-in user
    const {
        user
    } = useSelector((state) => state.auth);


    const TABS = useMemo(() => {
        const role = user ? .role;

        // ================= ADMIN =================
        if (role === "admin") {
            return [{
                    label: "Assign",
                    icon: < MoveToInboxIcon / > ,
                    component: < AssignedProjectContainer / > ,
                },
                {
                    label: "Documents",
                    icon: < DescriptionIcon / > ,
                    component: < DocumentContainer / > ,
                },
            ];
        }

        // ================= INSPECTOR =================
        if (role === "inspector") {
            return [{
                    label: "Projects",
                    icon: < MoveToInboxIcon / > ,
                    component: < ProjectContainer / > ,
                },
                {
                    label: "Documents",
                    icon: < DescriptionIcon / > ,
                    component: < DocumentContainer / > ,
                },
            ];
        }

        // ================= CUSTOMER =================
        if (role === "customer") {
            return [{
                    label: "Projects",
                    icon: < MoveToInboxIcon / > ,
                    component: < ProjectContainer / > ,
                },
                {
                    label: "Documents",
                    icon: < DescriptionIcon / > ,
                    component: < DocumentContainer / > ,
                },
            ];
        }

        // No tabs for unknown role
        return [];
    }, [user ? .role]);


    useEffect(() => {
        if (TABS.length === 0) {
            setTabIndex(0);
            return;
        }

        if (!tabParam) {
            setTabIndex(0);
            return;
        }

        const requestedTabIndex = TABS.findIndex(
            (tab) => tab.label.toLowerCase() === tabParam.toLowerCase()
        );

        if (requestedTabIndex !== -1) {
            setTabIndex(requestedTabIndex);
        } else {
            setTabIndex(0);
        }
    }, [tabParam, TABS]);

    return ( <
        Container maxWidth = "xl"
        sx = {
            {
                py: 3
            }
        } >

        { /* ================= DMS HEADER ================= */ } {
            /* <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color="#00416A"
                      textAlign="center"
                    >
                      Document Management System
                    </Typography>
                  </Box> */
        }

        { /* ================= MAIN CARD ================= */ } <
        Paper elevation = {
            2
        }
        sx = {
            {
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                bgcolor: "background.default",
            }
        } >

        { /* ================= TAB HEADER ================= */ } <
        Box sx = {
            {
                background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
                color: "#fff",
                position: "relative",

                "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                },
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }
        } >
        <
        Tabs value = {
            tabIndex
        }
        onChange = {
            (e, value) => setTabIndex(value)
        }
        variant = "scrollable"
        scrollButtons = "auto"
        sx = {
            {
                "& .MuiTabs-flexContainer": {
                    justifyContent: "center",
                },

                "& .MuiTabs-indicator": {
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                    backgroundColor: "#39f300",
                    bottom: 0,
                },

                "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.8)",
                    minHeight: 72,
                    minWidth: 160,

                    "&.Mui-selected": {
                        color: "#fff",
                    },

                    "&:hover": {
                        color: "#fff",
                        backgroundColor: "rgba(255,255,255,0.1)",
                    },
                },
            }
        } >
        {
            TABS.map((tab, index) => ( <
                Tab key = {
                    index
                }
                label = { <
                    Box
                    sx = {
                        {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                            transition: "transform 0.2s",

                            "&:hover": {
                                transform: "translateY(-2px)",
                            },
                        }
                    } >
                    <
                    Box
                    sx = {
                        {
                            transition: "all 0.2s",
                            transform: tabIndex === index ?
                                "scale(1.1)" :
                                "scale(1)",
                        }
                    } >
                    {
                        React.cloneElement(tab.icon, {
                            sx: {
                                fontSize: 24,
                                color: tabIndex === index ?
                                    "#fff" :
                                    "rgba(255,255,255,0.8)",
                            },
                        })
                    } <
                    /Box>

                    <
                    Typography
                    variant = "caption"
                    fontWeight = {
                        tabIndex === index ? 800 : 600
                    }
                    sx = {
                        {
                            fontSize: "0.75rem",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                        }
                    } >
                    {
                        tab.label
                    } <
                    /Typography> <
                    /Box>
                }
                />
            ))
        } <
        /Tabs> <
        /Box> <
        /Box>

        { /* ================= TAB CONTENT ================= */ } {
            TABS.map((tab, index) => ( <
                Box key = {
                    index
                }
                hidden = {
                    tabIndex !== index
                }
                sx = {
                    {
                        width: "100%",
                    }
                } >
                {
                    tab.component
                } <
                /Box>
            ))
        } <
        /Paper> <
        /Container>
    );
};

export default DMSMainIndex;