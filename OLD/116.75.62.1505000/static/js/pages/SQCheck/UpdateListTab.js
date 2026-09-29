import React, {
    useEffect,
    useState
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
    Chip
} from "@mui/material";
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon'; // For Safety
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // For Quality
import {
    GetSQRecords
} from "../../Redux/SafetyQualityData/SafetyQualityAction";
import {
    GetUserMasterData
} from "../../Redux/MasterData/masterAction";

import SQRecordList from "./SQRecordList";

const UpdateListTab = () => {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const {
        sqlist = [], loading
    } = useSelector((state) => state.sqData || {});

    useEffect(() => {
        dispatch(GetSQRecords());
        dispatch(GetUserMasterData());
    }, [dispatch]);

    const safetyData = sqlist.filter((r) => r.record_type === "safety");
    const qualityData = sqlist.filter((r) => r.record_type === "quality");

    const TABS_CONFIG = [{
            label: "Safety Records",
            icon: < ShieldMoonIcon / > ,
            data: safetyData,
            color: "#1976d2"
        },
        {
            label: "Quality Records",
            icon: < VerifiedUserIcon / > ,
            data: qualityData,
            color: "#1976d2"
        },
    ];

    if (loading) {
        return <Typography sx = {
            {
                p: 5,
                textAlign: 'center'
            }
        } > Loading SQ Master Data... < /Typography>;
    }

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
                bgcolor: "background.default",
            }
        } >
        { /* ================= HEADER WITH GRADIENT ================= */ } <
        Box sx = {
            {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                width: "100%"
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
                    borderRadius: "4px 4px 0 0",
                    backgroundColor: "#fff", // Bright Green indicator like your ref
                },
                "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.7)",
                    minHeight: 80,
                    minWidth: 200,
                    textTransform: 'none',
                    "&.Mui-selected": {
                        color: "#fff"
                    },
                    "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)"
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
                    Box sx = {
                        {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }
                    } >
                    <
                    Box sx = {
                        {
                            transform: tabIndex === index ? "scale(1.2)" : "scale(1)",
                            transition: "0.3s"
                        }
                    } > {
                        tab.icon
                    } <
                    /Box> <
                    Typography variant = "subtitle2"
                    sx = {
                        {
                            fontWeight: 700
                        }
                    } > {
                        tab.label
                    } <
                    /Typography>

                    <
                    /Box>
                }
                />
            ))
        } <
        /Tabs> <
        /Box> <
        /Box>

        { /* ================= CONTENT BOX ================= */ } <
        Box sx = {
            {
                p: {
                    xs: 5,
                    md: 5
                },
                bgcolor: "background.paper",
                minHeight: 600
            }
        } >
        {
            TABS_CONFIG.map((tab, index) => ( <
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
                    tabIndex === index && ( <
                        SQRecordList data = {
                            tab.data
                        }
                        title = {
                            `${tab.label} Overview`
                        }
                        themeColor = {
                            tab.color
                        }
                        />
                    )
                } <
                /Box>
            ))
        } <
        /Box> <
        /Paper> <
        /Container>
    );
};

export default UpdateListTab;