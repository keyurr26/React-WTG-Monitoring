import {
    Tabs,
    Tab,
    Box,
    Paper,
    Typography,
    Container,
    alpha
} from "@mui/material";
import {
    useState,
    useMemo,
    useEffect
} from "react";
import React from "react";
import {
    useSelector,
    useDispatch
} from "react-redux";

import {
    RoadIcon,
    FoundationIcon,
    ElectricalIcon,
    SettingsIcon,
    AssessmentIcon,
    DashboardIcon,
    MapOutlinedIcon,
} from "./TabIcons";
import WindPowerIcon from '@mui/icons-material/WindPower';
import OverallTab from "./dashboardtabs/OverallTab";
import RoadDashboardTab from "./dashboardtabs/RoadDashboardTab";
import FoundationTab from "./dashboardtabs/FoundationTab";
import WTGInstallationTab from "./dashboardtabs/WTGInstallationTab";
import ElectricalTab from "./dashboardtabs/ElectricalTab";
import CommissioningTab from "./dashboardtabs/CommissioningTab";
import FinalMapView from "./dashboardtabs/FinalMap";
import DelayTab from "./dashboardtabs/DelayTab";
import {
    getCartRoadDPRView,
    GETPWCFilterData
} from "../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    GetFoundationSummaryData,
    getDelaySummary,
    GetWTGSummaryData
} from "../../Redux/DashboardData/dashboardAction";
import ElectricalUSSDashboard from "./dashboardtabs/UssDashboard/ussDashboard";
import {
    getRoadDPRDashboardData
} from "../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    GetElectricalDashboardData
} from "../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";
import {
    getUSSDashboardSummary
} from "../../Redux/InstallationData/UssData/UssAction";

function DashboardMainTabs() {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);

    const {
        getpwc = []
    } = useSelector((state) => state.cardRoad || {});
    const {
        delays = [], loading: delayLoading
    } = useSelector((state) => state.foundationData);

    const {
        electricalDashboardData,
        loading: electricalLoading
    } = useSelector(
        (state) => state.electricalData
    );

    const {
        dashboardLoading,
        UssdashboardData = [],
        dashboardError,
    } = useSelector((state) => state.ussActivityData);

    const [filters, setFilters] = useState({
        project: '',
        windfarm: '',
        cluster: '',
    });

    // console.log("ussdashboard", UssdashboardData);

    const {
        statistics = {
                completedStages: {}
            },
            progressData = [],
            turbineList = [],
            recentActivities = [],
            wtgData = {},
            loading
    } = useSelector((state) => state.dashboardData);

    const {
        roadDashboard = [], error
    } = useSelector(
        (state) => state.cartRoad || state.cardRoad
    );

    const filteredRoadDashboard = useMemo(() => {
        if (!roadDashboard || roadDashboard.length === 0) return [];

        return roadDashboard.filter(road => {
            if (!filters.project && !filters.windfarm && !filters.cluster) {
                return true;
            }

            let matches = true;

            if (filters.project) {
                const projectId = parseInt(filters.project);
                const roadProjectId = parseInt(road.project_id);
                matches = matches && (roadProjectId === projectId);
            }

            if (filters.windfarm) {
                const windfarmId = parseInt(filters.windfarm);
                const roadWindfarmId = parseInt(road.windfarm_id);
                matches = matches && (roadWindfarmId === windfarmId);
            }

            if (filters.cluster) {
                const clusterId = parseInt(filters.cluster);
                const roadClusterId = parseInt(road.cluster_id);
                matches = matches && (roadClusterId === clusterId);
            }

            return matches;
        });
    }, [roadDashboard, filters]);

    const roadProgress = useMemo(() => {
        if (!filteredRoadDashboard || filteredRoadDashboard.length === 0) return 0;

        let totalDistance = 0;
        let completedDistance = 0;

        filteredRoadDashboard.forEach(road => {
            const distance = parseFloat(road.plan_distance_km) || 0;
            const completed = parseFloat(road.actual_completed_qty) || 0;
            totalDistance += distance;
            completedDistance += completed;
        });

        return totalDistance > 0 ? Math.round((completedDistance / totalDistance) * 100) : 0;
    }, [filteredRoadDashboard]);

    const electricalProgress = useMemo(() => {
        if (!electricalDashboardData || !electricalDashboardData.overview) return 0;
        return electricalDashboardData.overview.completion_percent || 0;
    }, [electricalDashboardData]);

    const totalProgress = useMemo(() => {
        const f = statistics ? .completionRate || 0;
        const wtgMetric = wtgData ? .metrics ? .find(m =>
            m.label === "Turbines Installed" || m.label === "WTG Installed"
        );
        const w = wtgMetric ? .progress || 0;
        const r = roadProgress || 0;
        const e = electricalProgress || 0;

        const sections = [];
        if (f > 0) sections.push(f);
        if (w > 0) sections.push(w);
        if (r > 0) sections.push(r);
        if (e > 0) sections.push(e);

        if (sections.length === 0) return 0;
        return Math.round(sections.reduce((sum, val) => sum + val, 0) / sections.length);
    }, [statistics, wtgData, roadProgress, electricalProgress]);

    // --- FETCHING LOGIC ---
    useEffect(() => {
        dispatch(GETPWCFilterData({}));
        dispatch(getCartRoadDPRView());
        dispatch(getRoadDPRDashboardData());


        const initialFilters = {
            project_id: filters.project || '',
            windfarm_id: filters.windfarm || '',
            cluster_id: filters.cluster || ''
        };

        dispatch(GetFoundationSummaryData(initialFilters));
        // dispatch(getRoadDashboardSummary(initialFilters));
        dispatch(GetWTGSummaryData(initialFilters));

        // USS filters - use the correct keys that the API expects
        const ussFilters = {
            project: filters.project || '',
            windfarm: filters.windfarm || '',
            cluster: filters.cluster || ''
        };
        dispatch(getUSSDashboardSummary(ussFilters));

        // Electrical filters
        const electricalFilters = {
            project: filters.project || '',
            windfarm: filters.windfarm || '',
            cluster: filters.cluster || ''
        };
        dispatch(GetElectricalDashboardData(electricalFilters));
    }, [dispatch]);

    useEffect(() => {
        if (!filters.project && !filters.windfarm && !filters.cluster) {
            // Fetch all data when filters are cleared
            const allFilters = {
                project_id: '',
                windfarm_id: '',
                cluster_id: ''
            };
            dispatch(GetFoundationSummaryData(allFilters));
            dispatch(getRoadDPRDashboardData(allFilters));
            // dispatch(getRoadDashboardSummary(allFilters));

            // USS filters - empty filters
            dispatch(getUSSDashboardSummary({
                project: '',
                windfarm: '',
                cluster: ''
            }));

            dispatch(GetElectricalDashboardData({
                project: '',
                windfarm: '',
                cluster: ''
            }));
            return;
        }

        const apiFilters = {
            project_id: filters.project,
            windfarm_id: filters.windfarm,
            cluster_id: filters.cluster
        };

        dispatch(GetFoundationSummaryData(apiFilters));
        dispatch(getRoadDPRDashboardData(apiFilters));
        // dispatch(getRoadDashboardSummary(apiFilters));
        dispatch(GetWTGSummaryData(apiFilters));



        // USS filters - use the correct keys
        const ussFilters = {
            project: filters.project,
            windfarm: filters.windfarm,
            cluster: filters.cluster
        };
        dispatch(getUSSDashboardSummary(ussFilters));

        const electricalFilters = {
            project: filters.project,
            windfarm: filters.windfarm,
            cluster: filters.cluster
        };
        dispatch(GetElectricalDashboardData(electricalFilters));

    }, [dispatch, filters.project, filters.windfarm, filters.cluster]);

    const handleRefresh = () => {
        dispatch(GetFoundationSummaryData(filters));
    };

    // console.log("progressData",progressData)
    // console.log("turbineList",turbineList)
    // console.log("recentActivities",recentActivities)


    const TABS = useMemo(() => [{
            label: "Overall Summary",
            icon: < DashboardIcon / > ,
            color: "#667eea",
            component: < OverallTab
            roadDashboard = {
                filteredRoadDashboard
            }
            statistics = {
                statistics
            }
            wtgData = {
                wtgData
            }
            filters = {
                filters
            }
            setFilters = {
                setFilters
            }
            turbineList = {
                turbineList
            }
            electricalData = {
                electricalDashboardData
            }
            electricalProgress = {
                electricalProgress
            }
            ussData = {
                UssdashboardData
            }
            loading = {
                loading
            }
            />
        },
        {
            label: "Road & Access",
            icon: < RoadIcon / > ,
            color: "#4CAF50",
            component: < RoadDashboardTab roadDashboard = {
                filteredRoadDashboard
            }
            />
        },
        {
            label: "Foundation",
            icon: < FoundationIcon / > ,
            color: "#FF9800",
            component: < FoundationTab
            statistics = {
                statistics
            }
            progressData = {
                progressData
            }
            turbineList = {
                turbineList
            }
            recentActivities = {
                recentActivities
            }
            onRefresh = {
                handleRefresh
            }
            />
        },
        {
            label: "WTG Installation",
            icon: < WindPowerIcon / > ,
            color: "#2196F3",
            component: < WTGInstallationTab / >
        },
        {
            label: "Electrical",
            icon: < ElectricalIcon / > ,
            color: "#9C27B0",
            component: < ElectricalTab
            electricalData = {
                electricalDashboardData
            }
            loading = {
                electricalLoading
            }
            filters = {
                filters
            }
            setFilters = {
                setFilters
            }
            />
        },
        {
            label: "USS",
            icon: < ElectricalIcon / > ,
            color: "#9C27B0",
            component: < ElectricalUSSDashboard
            ussData = {
                UssdashboardData
            }
            filters = {
                filters
            }
            setFilters = {
                setFilters
            }
            />
        },
        {
            label: "Commissioning",
            icon: < SettingsIcon / > ,
            color: "#E91E63",
            component: < CommissioningTab / >
        },
        {
            label: "Delay Analysis",
            icon: < AssessmentIcon / > ,
            color: "#00BCD4",
            component: < DelayTab
            // filters={filters}
            // setFilters={setFilters}
            turbineList = {
                turbineList
            }
            />
        },
        {
            label: "Map View",
            icon: < MapOutlinedIcon / > ,
            color: "#00BCD4",
            component: < FinalMapView / >
        },
    ], [filteredRoadDashboard, statistics, wtgData, loading, filters, turbineList, electricalLoading, electricalDashboardData, electricalProgress, UssdashboardData]);

    const currentTab = TABS[tabIndex];

    return ( <
        Container maxWidth = "xl"
        sx = {
            {
                py: 2,
                mt: -4
            }
        } >
        <
        Paper elevation = {
            0
        }
        sx = {
            {
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "background.default",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid",
                borderColor: "divider",
            }
        } >
        <
        Box sx = {
            {
                position: "relative",
                overflow: "hidden",
                background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
            }
        } >
        <
        Box sx = {
            {
                position: "relative",
                zIndex: 2
            }
        } >
        <
        Box sx = {
            {
                px: {
                    xs: 2,
                    md: 4
                },
                pt: 2,
                pb: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.5,
            }
        } >
        <
        Box >
        <
        Typography variant = "h6"
        fontWeight = {
            600
        }
        sx = {
            {
                color: "white",
                letterSpacing: "-0.3px"
            }
        } >
        Project Monitoring Dashboard <
        /Typography> <
        Typography variant = "body2"
        sx = {
            {
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.8rem"
            }
        } >
        Comprehensive project tracking & management system <
        /Typography> <
        /Box>

        {
            /* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                               <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: 2, px: 2, py: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                                 <Typography variant="caption" sx={{ color: 'rgba(112, 37, 37, 0.7)', display: 'block', fontSize: '0.7rem' }}>
                                   Overall Progress
                                 </Typography>
                                 <Typography variant="h6" sx={{ color: '#39f300', fontWeight: 700, fontSize: '1.1rem' }}>
                                   {totalProgress}%
                                 </Typography>
                               </Box>
                             </Box> */
        } <
        /Box>

        { /* Navigation Tabs */ } <
        Box sx = {
            {
                px: {
                    xs: 2,
                    md: 4
                },
                pb: 2
            }
        } >
        <
        Paper elevation = {
            0
        }
        sx = {
            {
                bgcolor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.15)",
                overflow: "hidden",
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
                minHeight: 52,
                "& .MuiTabs-indicator": {
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    zIndex: 1,
                },
                "& .MuiTab-root": {
                    zIndex: 2,
                    minHeight: 48,
                    minWidth: 140,
                    mx: 0.25,
                    borderRadius: 2,
                    transition: "all 0.3s",
                },
                "& .Mui-selected": {
                    backgroundColor: "white"
                },
            }
        } >
        {
            TABS.map((tab, index) => ( <
                Tab key = {
                    index
                }
                iconPosition = "start"
                sx = {
                    {
                        textTransform: "none",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.9)",
                    }
                }
                icon = { <
                    Box
                    className = "tab-icon"
                    sx = {
                        {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: tabIndex === index ?
                                alpha(tab.color, 0.1) :
                                "rgba(255,255,255,0.1)",
                            mr: 1,
                        }
                    } >
                    {
                        React.cloneElement(tab.icon, {
                            sx: {
                                fontSize: 18,
                                color: tabIndex === index ? tab.color : "white",
                            },
                        })
                    } <
                    /Box>
                }
                label = { <
                    Typography
                    variant = "body2"
                    fontWeight = {
                        tabIndex === index ? 800 : 600
                    }
                    sx = {
                        {
                            fontSize: "0.78rem",
                            color: tabIndex === index ? tab.color : "white",
                        }
                    } >
                    {
                        tab.label
                    } <
                    /Typography>
                }
                />
            ))
        } <
        /Tabs> <
        /Paper> <
        /Box> <
        /Box> <
        /Box>

        { /* Tab Content Rendering */ } <
        Box sx = {
            {
                p: {
                    xs: 2,
                    md: 4
                },
                bgcolor: "background.paper",
                //  backgroundColor: "#f5f5f5",
                minHeight: "calc(100vh - 240px)",
            }
        } >
        {
            currentTab.component
        } <
        /Box> <
        /Paper> <
        /Container>

    );
}

export default DashboardMainTabs;