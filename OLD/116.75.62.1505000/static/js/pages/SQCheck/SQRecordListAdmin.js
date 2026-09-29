import React, {
    useEffect,
    useState,
    useMemo
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    Container,
    LinearProgress,
    Stack
} from "@mui/material";
import ShieldMoonIcon from "@mui/icons-material/ShieldMoon";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocationFilterBar from "../../components/LocationFilterBar";
import {
    GetSQRecords,
    GetSQDashboard
} from "../../Redux/SafetyQualityData/SafetyQualityAction";
import {
    GetUserMasterData
} from "../../Redux/MasterData/masterAction";

import SQDashboard from "../overalldashboard/dashboardtabs/SQDashboard";
import SQRecordList from "./SQRecordList";

const SQRecordListAdmin = () => {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const {
        sqlist = [], loading, dashboard = {}
    } = useSelector((state) => state.sqData || {});

    // console.log("dashboard",dashboard)
    // console.log("sqlist",sqlist)
    const [filters, setFilters] = useState({
        project: '1',
        windfarm: '',
        cluster: '',
        // turbine: '',
        record_type: '',
    });
    useEffect(() => {

        dispatch(GetUserMasterData());
        //    dispatch(GetSQRecords());
    }, [dispatch]);

    useEffect(() => {
        dispatch(GetSQRecords(filters));
        dispatch(GetSQDashboard(filters));
    }, [dispatch, filters]);

    /* ================= DATA ================= */
    const safetyData = useMemo(
        () => sqlist.filter((r) => r.record_type === "safety"), [sqlist]
    );

    const qualityData = useMemo(
        () => sqlist.filter((r) => r.record_type === "quality"), [sqlist]
    );



    // const stats = useMemo(() => {
    //   return {
    //     total: sqlist.length,
    //     safety: safetyData.length,
    //     quality: qualityData.length,
    //     open: sqlist.filter((r) => r.status === "open").length,
    //     closed: sqlist.filter((r) => r.status === "closed").length,
    //   };
    // }, [sqlist, safetyData, qualityData]);

    /* ================= TABS ================= */
    const TABS_CONFIG = [{
            label: "Overview",
            icon: < DashboardIcon / > ,
            type: "overview",
        },
        {
            label: "Safety",
            icon: < ShieldMoonIcon / > ,
            data: safetyData,
        },
        {
            label: "Quality",
            icon: < VerifiedUserIcon / > ,
            data: qualityData,
        },
    ];

    //   if (loading) {
    //     return (
    //       <Typography sx={{ p: 5, textAlign: "center" }}>
    //         Loading SQ Data...
    //       </Typography>
    //     );
    //   }

    return ( <
        Container maxWidth = "xl"
        sx = {
            {
                py: 3
            }
        } >
        <
        Paper elevation = {
            2
        }
        sx = {
            {
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
            }
        } >
        { /* ================= HEADER ================= */ } <
        Box sx = {
            {
                background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
            }
        } >

        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "center"
            }
        } >
        <
        Tabs value = {
            tabIndex
        }
        onChange = {
            (e, v) => setTabIndex(v)
        }
        centered sx = {
            {
                "& .MuiTabs-indicator": {
                    height: 4,
                    backgroundColor: "#fff",
                },
                "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.7)",
                    minHeight: 70,
                    minWidth: 150,
                    textTransform: "none",
                    "&.Mui-selected": {
                        color: "#fff"
                    },
                },
            }
        } >
        {
            TABS_CONFIG.map((tab, index) => ( <
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
                        }
                    } >
                    <
                    Box
                    sx = {
                        {
                            transform: tabIndex === index ?
                                "scale(1.2)" :
                                "scale(1)",
                            transition: "0.3s",
                        }
                    } >
                    {
                        tab.icon
                    } <
                    /Box> <
                    Typography fontWeight = {
                        700
                    } > {
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


        { /* ================= CONTENT ================= */ } <
        Box sx = {
            {
                p: 3,
                minHeight: 600
            }
        } >

        <
        Box sx = {
            {
                mb: 2
            }
        } >
        <
        Stack direction = {
            {
                xs: "column",
                md: "row"
            }
        }
        justifyContent = "space-between"
        alignItems = {
            {
                xs: "flex-start",
                md: "center"
            }
        }
        spacing = {
            3
        } >
        { /* LEFT TITLE (dynamic based on tab) */ } <
        Box >
        <
        Typography variant = "h6"
        fontWeight = {
            700
        }
        sx = {
            {
                mb: 0.5,
                lineHeight: 1.2,
                color: "#00416A"
            }
        } >
        {
            tabIndex === 0 && "Safety & Quality Overview"
        } {
            tabIndex === 1 && "Safety Records"
        } {
            tabIndex === 2 && "Quality Records"
        } <
        /Typography>

        <
        Typography variant = "body1"
        color = "text.secondary" > {
            tabIndex === 0 &&
            "Track safety issues, quality defects and resolution status"
        } {
            tabIndex === 1 &&
                "Monitor all safety incidents and corrective actions"
        } {
            tabIndex === 2 &&
                "Track quality defects and inspection outcomes"
        } <
        /Typography> <
        /Box>

        { /* RIGHT FILTER */ } <
        Stack direction = "row"
        spacing = {
            2
        }
        alignItems = "center"
        sx = {
            {
                width: {
                    xs: "100%",
                    md: "auto"
                }
            }
        } >
        <
        Box sx = {
            {
                minWidth: {
                    md: 600
                }
            }
        } >
        <
        LocationFilterBar filters = {
            filters
        }
        setFilters = {
            setFilters
        }
        /> <
        /Box> <
        /Stack> <
        /Stack> <
        /Box>

        { /* Keeps layout stable: shows LinearProgress when loading, else an empty box of the same height */ } <
        Box sx = {
            {
                width: "100%",
                height: 4
            }
        } > {
            loading ? ( <
                LinearProgress sx = {
                    {
                        backgroundColor: "#e3f2fd",
                        "& .MuiLinearProgress-bar": {
                            backgroundColor: "#0d47a1"
                        },
                    }
                }
                />
            ) : null
        } <
        /Box>

        { /* ===== OVERVIEW ===== */ }

        {
            tabIndex === 0 && dashboard && ( <
                SQDashboard dashboard = {
                    dashboard
                }
                filters = {
                    filters
                }
                setFilters = {
                    setFilters
                }
                />
            )
        } { /* ===== SAFETY ===== */ } {
            tabIndex === 1 && ( <
                SQRecordList data = {
                    safetyData
                }
                //   title="Safety Records"
                themeColor = "#00416A" /
                >
            )
        }

        { /* ===== QUALITY ===== */ } {
            tabIndex === 2 && ( <
                SQRecordList data = {
                    qualityData
                }
                //   title="Quality Records"
                themeColor = "#00416A" /
                >
            )
        } <
        /Box> <
        /Paper> <
        /Container>
    );
};

export default SQRecordListAdmin;