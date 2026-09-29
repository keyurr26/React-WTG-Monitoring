import {
    Tabs,
    Tab,
    Box,
    Paper,
    Typography,
    Container
} from "@mui/material";
import {
    useState,
    useMemo,
    useCallback
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import React, {
    useEffect
} from "react";
import RoadTabs from "./RoadTabs";
import {
    RoadIcon,
    ConstructionIcon,
    ElectricalIcon,
    SettingsIcon,
    UssIcon
} from "./TabIcons";
import WindPowerIcon from "@mui/icons-material/WindPower";
import BentoIcon from "@mui/icons-material/Bento";
import CellTowerIcon from "@mui/icons-material/CellTower";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FoundationIcon from "@mui/icons-material/Foundation";
import {
    CloudUploadIcon
} from "lucide-react";
import {
    useTableViewer
} from "../hooks/useTableViewer";
import CustomSnackbar from "./comman/CustomSnackbar";
import FoundationTabs from "./FoundationTab";
import WTGinstallationTabs from "./WTGInstallationTab";
import DynamicViewer from "../pages/MultipleDocumentUpload/DynamicViewer";
import {
    useFileUpload
} from "../hooks/useFileUpload";
import CommissioningForm from "../pages/Commissioning/CommissioningForm";
import {
    PostCommissioningDetails
} from "../Redux/InstallationData/WtgInstallationData/wtgInstallationAction";
import PlateformTab from "./PlateformTab";
import ElectricalTabPage from "../pages/Electrical Section/ElectricalTabIndex";
import LocationFilterBar from "./LocationFilterBar";
import PermitsAndApprovalDocument from "../pages/MultipleDocumentUpload/PermitsAndApprovalDocument";
import USSFormFeeding from "../pages/Uss/Uss";
import {
    getNestedProjects,
    //  GETPWCFilterData,
    postCartRoadDPR,
} from "../Redux/InstallationData/CartRoadData/cartroadAction";

function MainTabs() {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedRoad, setSelectedRoad] = useState(null);
    const [filters, setFilters] = useState({
        project: "",
        windfarm: "",
        cluster: "",
    });
    const {
        cartRoadDPR = [], cartRoadDPRLoading = false
    } = useSelector(
        (state) => state.cardRoad,
    );
    const {
        viewer,
        closeViewer,
        buildColumns
    } = useTableViewer();
    const [electricalSubTab, setElectricalSubTab] = useState(0);
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
    /* ================= DAILY PROGRESS FORM STATE ================= */
    const [dailyProgress, setDailyProgress] = useState({
        date: "",
        location: "",
        activity: "",
        completed_qty: "",
        inspector: "",
        level: "",
        road_length: "",
        remarks: "",
        photo: null,
    });

    const handleSetFilters = useCallback((newFilters) => {
        // console.log("🟢 [MainTabs] handleSetFilters called:", newFilters);
        setFilters((prev) => {
            // Only update if values actually changed
            if (JSON.stringify(prev) === JSON.stringify(newFilters)) {
                // console.log("🟢 [MainTabs] Filters unchanged, skipping update");
                return prev;
            }
            // console.log("🟢 [MainTabs] Filters updated");
            return newFilters;
        });
    }, []);
    const handleDailyProgressSubmit = async (formData) => {
        try {
            // Resolve the targeted Road ID correctly from either source
            const roadId = formData.get("road") || formData.get("road_id");
            if (!roadId) {
                alert("Road ID is missing. Please select a road.");
                return;
            }
            await dispatch(postCartRoadDPR(formData));
            // Keep state values sync-safe and decoupled
            setDailyProgress({
                date: "",
                location: "",
                activity: "",
                completed_qty: "",
                inspector: "",
                level: "",
                road_length: "",
                remarks: "",
                photo: null,
            });
            // alert("Daily progress saved successfully!");
        } catch (error) {
            alert(`Failed to save daily progress: ${error.message}`);
        }
    };
    const handleDailyProgressChange = (field, value) => {
        setDailyProgress((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setDailyProgress((prev) => ({
                ...prev,
                photo: file,
            }));
        }
    };
    const TABS = useMemo(
        () => [{
                label: "Permits & Approval",
                icon: < CloudUploadIcon / > ,
                component: ( <
                    PermitsAndApprovalDocument filters = {
                        filters
                    }
                    setFilters = {
                        setFilters
                    }
                    />
                ),
            },
            {
                label: "Road",
                icon: < RoadIcon / > ,
                component: ( <
                    RoadTabs key = "road-tabs"
                    dailyProgress = {
                        dailyProgress
                    }
                    onChange = {
                        handleDailyProgressChange
                    }
                    onPhotoUpload = {
                        handlePhotoUpload
                    }
                    onSubmit = {
                        handleDailyProgressSubmit
                    }
                    selectedRoad = {
                        selectedRoad
                    }
                    setSelectedRoad = {
                        setSelectedRoad
                    }
                    dprData = {
                        cartRoadDPR
                    }
                    dprLoading = {
                        cartRoadDPRLoading
                    }
                    // # inspectors={inspectors}
                    filters = {
                        filters
                    }
                    setFilters = {
                        setFilters
                    }
                    />
                ),
            },
            {
                label: "Foundation",
                icon: < FoundationIcon / > ,
                component: ( <
                    FoundationTabs key = {
                        `foundation-${filters.project}-${filters.windfarm}-${filters.cluster}`
                    }
                    filters = {
                        filters
                    }
                    setFilters = {
                        setFilters
                    }
                    showSnackbar = {
                        showSnackbar
                    }
                    />
                ),
            },
            {
                label: "Crane Platform",
                icon: < EngineeringIcon / > ,
                component: ( <
                    PlateformTab key = {
                        `wtg-${filters.project}-${filters.windfarm}-${filters.cluster}`
                    }
                    filters = {
                        filters
                    }
                    setFilters = {
                        setFilters
                    }
                    showSnackbar = {
                        showSnackbar
                    }
                    />
                ),
            },
            {
                label: "WTG Installation",
                icon: < WindPowerIcon / > ,
                component: ( <
                    WTGinstallationTabs key = {
                        `wtg-${filters.project}-${filters.windfarm}-${filters.cluster}`
                    }
                    filters = {
                        filters
                    }
                    setFilters = {
                        setFilters
                    }
                    // materialData={GETmaterialMaster}
                    // kpiList={kpiList}
                    showSnackbar = {
                        showSnackbar
                    }
                    // contractors={contractors}
                    // inspectors={inspectors}
                    // GETmaterialMaster={GETmaterialMaster}

                    // documentList={documentList}
                    // componentTypesList={componentTypesList}
                    // activityPlannedDates={activityPlannedDates}
                    />
                ),
            },
            {
                label: "Electrical",
                icon: < ElectricalIcon / > ,
                component: ( <
                    ElectricalTabPage filters = {
                        filters
                    }
                    setFilters = {
                        setFilters
                    }
                    electricalSubTab = {
                        electricalSubTab
                    }
                    setElectricalSubTab = {
                        setElectricalSubTab
                    }
                    />
                ),
            },
            {
                label: "Uss",
                icon: < UssIcon / > ,
                component: < USSFormFeeding filters = {
                    filters
                }
                setFilters = {
                    setFilters
                }
                />,
            },
            {
                label: "Commissioning",
                icon: < SettingsIcon / > ,
                component: ( <
                    CommissioningForm filters = {
                        filters
                    }
                    setFilters = {
                        setFilters
                    }
                    // inspectors={inspectors}
                    // turbinesData={turbineLocations}
                    showSnackbar = {
                        showSnackbar
                    }
                    // documentList={documentList}
                    />
                ),
            },
        ], [
            // filters,
            filters.project,
            filters.windfarm,
            filters.cluster,
            // filters.turbine,
            cartRoadDPR,
            cartRoadDPRLoading,
            selectedRoad,
            showSnackbar,
            electricalSubTab,
        ],
    );
    const currentTab = TABS[tabIndex];
    return ( <
        Container maxWidth = "xl" >
        <
        Box sx = {
            {
                position: "sticky",
                top: 70, // Adjust this number to match your global navbar height (e.g., 64, 72, or 80)
                zIndex: 1100,
                bgcolor: "background.default",
                py: 1.5,
                px: 0,
            }
        } >
        <
        LocationFilterBar filters = {
            filters
        }
        setFilters = {
            setFilters
        }
        showCluster = {!(tabIndex === 5 && [2, 3].includes(electricalSubTab)) &&
            tabIndex !== 0
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
        allowScrollButtonsMobile sx = {
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
                    /Box> <
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
            currentTab.component || ( <
                Box textAlign = "center"
                py = {
                    8
                } >
                <
                Box sx = {
                    {
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        bgcolor: "primary.50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                    }
                } >
                <
                ConstructionIcon sx = {
                    {
                        fontSize: 40,
                        color: "primary.main"
                    }
                }
                /> <
                /Box> <
                Typography variant = "h6"
                color = "text.secondary"
                gutterBottom >
                Module Under Development <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary" >
                This feature is coming soon <
                /Typography> <
                /Box>
            )
        } <
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
        DynamicViewer open = {
            viewer.open
        }
        onClose = {
            closeViewer
        }
        title = {
            viewer.title
        }
        data = {
            viewer.items
        }
        type = {
            viewer.type
        }
        /> <
        /Paper> <
        /Container>
    );
}
export default MainTabs;