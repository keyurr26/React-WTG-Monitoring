import React, {
    useState,
    useEffect
} from "react";
import {
    Tabs,
    Tab,
    Box,
    Paper,
    Typography,
    Container,
    alpha,
    Button
} from "@mui/material";
import {
    RoadIcon,
    FoundationIcon,
    ConstructionIcon,
    ElectricalIcon,
    SettingsIcon,
    UssIcon,
    DownloadIcon,
} from "./ApproveTabIcon";
import {
    CloudUploadIcon
} from "lucide-react";
import {
    useLocation
} from "react-router-dom";
import {
    useNavigate
} from "react-router-dom";

import RoadTab from "./RoadTab";
import FoundationTab from "./foundations/FoundationTab";
import WtgInstallationTab from "./wtginstallations/WtgInstallationTab";
import ElectricalTab from "./Electrical/ElectricalTab";
import CommissioningTab from "./CommissioningTab";
import LocationFilterBar from "../../components/LocationFilterBar";
import USSTab from "./USSTab";
import PlatformMasterTab from "./PlatformMasterTab";
import PermitsAndApprovalTab from "./PermitsAndApprovalTab";

function ApprovedMainIndex() {
    const location = useLocation();
    const navigate = useNavigate();

    const [tabIndex, setTabIndex] = useState(0);
    const handleOverallReport = () => {
        navigate("/approved-reports-download");
    };
    const [electricalMainTab, setElectricalMainTab] = useState(0);
    const [filters, setFilters] = useState({
        project: "",
        windfarm: "",
        cluster: "",
    });
    useEffect(() => {
        if (location.state ? .mainTab !== undefined) {
            setTabIndex(location.state.mainTab);
        }
    }, [location.state]);
    // useEffect(() => {
    //   console.log("ApprovedMainIndex state:", location.state);
    // }, [location.state]);
    useEffect(() => {
        if (location.state) {
            setFilters({
                project: location.state.project || "",
                windfarm: location.state.windfarm || "",
                cluster: location.state.cluster || "",
            });
        }
    }, [location.state]);

    const TABS = [{
            label: "Permits & Approval",
            icon: < CloudUploadIcon / > ,
            component: < PermitsAndApprovalTab filters = {
                filters
            }
            />,
        },
        {
            label: "Road & Access",
            icon: < RoadIcon / > ,
            component: < RoadTab filters = {
                filters
            }
            />,
        },
        // { label: "Platform Master", icon: <FoundationIcon />, component: <PlatformMasterTab  filters={filters}/> },
        {
            label: "Foundation",
            icon: < FoundationIcon / > ,
            component: ( <
                FoundationTab filters = {
                    filters
                }
                notificationState = {
                    location.state
                }
                />
            ),
        },
        {
            label: "WTG Installation",
            icon: < ConstructionIcon / > ,
            component: ( <
                WtgInstallationTab filters = {
                    filters
                }
                notificationState = {
                    location.state
                }
                />
            ),
        },
        // {
        //   label: "Electrical",
        //   icon: <ElectricalIcon />,
        //   component: <ElectricalTab filters={filters} />,
        // },
        {
            label: "Electrical",
            icon: < ElectricalIcon / > ,
            component: ( <
                ElectricalTab filters = {
                    filters
                }
                setElectricalMainTab = {
                    setElectricalMainTab
                }
                notificationState = {
                    location.state
                }
                />
            ),
        },
        // {
        //   label: "USS",
        //   icon: <ElectricalIcon />,
        //   component: <USSTab filters={filters} />,
        // },
        {
            label: "USS",
            icon: < UssIcon / > ,
            component: ( <
                USSTab filters = {
                    filters
                }
                notificationState = {
                    location.state
                }
                />
            ),
        },
        {
            label: "Commissioning",
            icon: < SettingsIcon / > ,
            component: < CommissioningTab filters = {
                filters
            }
            />,
        },
        {
            label: "Download & View OverAll Report",
            icon: < DownloadIcon / > ,
            isButton: true,
        },
    ];
    // const currentTab = TABS[tabIndex];
    return ( <
        Container maxWidth = "xl"
        sx = {
            {
                py: 3
            }
        } >
        <
        Box sx = {
            {
                mb: 3
            }
        } >
        <
        LocationFilterBar filters = {
            filters
        }
        setFilters = {
            setFilters
        }
        showCluster = {!(
                tabIndex === 3 && // Electrical tab
                // DCOH
                (electricalMainTab === 2 ||
                    // MCOH
                    electricalMainTab === 3)
            )
        }
        /> <
        /Box> <
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
        { /* ================= MAIN TAB HEADER ================= */ } <
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
            (e, v) => setTabIndex(v)
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
                    backgroundColor: "#39f300ff",
                    bottom: 0,
                },
                "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.8)",
                    minHeight: 72,
                    minWidth: 160,
                    "&.Mui-selected": {
                        color: "#fff"
                    },
                    "&:hover": {
                        color: "#fff",
                        backgroundColor: "rgba(255,255,255,0.1)",
                    },
                },
            }
        } >
        {
            TABS.map((tab, index) => {
                if (tab.isButton) {
                    return ( <
                        Button key = {
                            index
                        }
                        variant = "contained"
                        startIcon = { < DownloadIcon / >
                        }
                        onClick = {
                            () => navigate("/approved-reports-download")
                        }
                        sx = {
                            {
                                alignSelf: "center",
                                ml: 2,
                                mr: 2,
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                                fontWeight: 700,
                                textTransform: "none",
                                backgroundColor: "#fff",
                                color: "#1a237e",
                                "&:hover": {
                                    backgroundColor: "#cacacaff",
                                },
                            }
                        } >
                        Download & View OverAll Report <
                        /Button>
                    );
                }

                return ( <
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
                                transform: tabIndex === index ? "scale(1.1)" : "scale(1)",
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
                );
            })
        } <
        /Tabs> <
        /Box> <
        /Box> { /* ================= TAB CONTENT ================= */ } <
        Box sx = {
            {
                p: {
                    xs: 2,
                    md: 4
                },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }
        } >
        {
            TABS.map((tab, index) => ( <
                Box key = {
                    index
                }
                hidden = {
                    tabIndex !== index
                }
                sx = {
                    {
                        width: "100%"
                    }
                } > {
                    tab.component
                } <
                /Box>
            ))
        } <
        /Box> <
        /Paper> <
        /Container>
    );
}
export default ApprovedMainIndex;