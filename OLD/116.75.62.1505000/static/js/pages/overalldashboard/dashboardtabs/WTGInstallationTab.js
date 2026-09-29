import React, {
    useEffect,
    useState
} from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Avatar,
    Stack,
    LinearProgress
} from "@mui/material";
import WindPowerIcon from '@mui/icons-material/WindPower';
import {
    GetWTGSummaryData
} from '../../../Redux/DashboardData/dashboardAction';
import WTGActivityBarChart from './WTGInstalltionDashboard/WTGActivityBarChart';
import WTGRecentActivityList from './WTGInstalltionDashboard/WTGRecentActivityList';
import WTGInstallationTable from './WTGInstalltionDashboard/WTGInstallationTable'; // Import the new table
import DashbLoader from './DashbLoader';
import LocationFilterBar from '../../../components/LocationFilterBar';
import WTGInstallationModal from './WTGInstalltionDashboard/WTGInstallationModal';
import {
    GetBladeInstallations,
    GetNacelleInstallation,
    GetRotorHubInstallations,
    GetT1InstalltionData,
    GetTowerInstallations
} from '../../../Redux/InstallationData/WtgInstallationData/wtgInstallationAction';
import WtgDprComponent from './WTGInstalltionDashboard/WtgDprComponent';


const WTGInstallationTab = ({
    selectedFilters
}) => {
    const dispatch = useDispatch();

    // Existing Filter State
    const [filters, setFilters] = useState({
        project: '1',
        windfarm: '',
        cluster: '',
    });


    const installtionData = useSelector((state) => state.wtgInstallationData) || {};


    const {

        t1installation = [],
            towersInstallations = [],
            nacelleInstallation = [],
            rotorHubInstallations = [],
            bladeInstallations = [],

    } = installtionData;

    // --- TABLE STATES ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        wtgData,
        loading
    } = useSelector((state) => state.dashboardData);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTurbine, setSelectedTurbine] = useState(null);
    const [modalTab, setModalTab] = useState(0);



    useEffect(() => {

        dispatch(GetT1InstalltionData());
        dispatch(GetTowerInstallations());
        dispatch(GetNacelleInstallation());
        dispatch(GetRotorHubInstallations());
        dispatch(GetBladeInstallations());
    }, [dispatch]);

    const handleOpenModal = (turbine) => {
        setSelectedTurbine(turbine); // Set the specific WTG data
        setModalTab(0); // Default to first tab
        setModalOpen(true); // Open the dialog
    };

    useEffect(() => {
        const apiFilters = {
            project_id: filters.project,
            windfarm_id: filters.windfarm,
            cluster_id: filters.cluster
        };
        dispatch(GetWTGSummaryData(apiFilters));
    }, [dispatch, filters]);

    // Handle Loading State
    if (loading || !wtgData || !wtgData.metrics) {
        return <DashbLoader / > ;
    }

    const metrics = wtgData.metrics || [];

    // Table Handlers
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Dynamic filtering logic for the selected turbine
    const turbineId = selectedTurbine ? .turbine_id;

    const t1Records = t1installation.filter(item => item.turbine === turbineId);
    const towerRecords = towersInstallations.filter(item => item.turbine === turbineId);
    const nacelleRecords = nacelleInstallation.filter(item => item.turbine === turbineId);
    const rotorRecords = rotorHubInstallations.filter(item => item.turbine === turbineId);
    const bladeRecords = bladeInstallations.filter(item => item.turbine === turbineId);

    const installationsections = [{
            title: "T1 Installation",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Leveling",
                    key: "leveling"
                },
                {
                    label: "Grouting",
                    key: "grouting"
                },
                {
                    label: "Bolt Size",
                    key: "bolt_size"
                },
                {
                    label: "Torque (Nm)",
                    key: "torque_value"
                },
                {
                    label: "Lifting End",
                    key: "lifting_end"
                },
                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: t1Records.map(item => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                status: item.t1_status || "Pending",
            })),
        },
        {
            title: "Tower Installation",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Tower No",
                    key: "tower_no"
                },
                {
                    label: "Crane Model",
                    key: "crane_id_model"
                },
                {
                    label: "Bolts",
                    key: "no_of_bolts"
                },
                {
                    label: "Instrument",
                    key: "instrument_used"
                },
                {
                    label: "Lifting End",
                    key: "lifting_end"
                },
                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: towerRecords.map(item => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                status: item.tower_status || "Pending",
            })),
        },
        {
            title: "Nacelle Detail",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Nacelle ID",
                    key: "nacelle_id_name"
                }, // Map the MaterialMaster name
                {
                    label: "Alignment",
                    key: "alignment_check"
                },
                {
                    label: "Torque",
                    key: "torque_value"
                },
                {
                    label: "Lifting End",
                    key: "lifting_end"
                },
                {
                    label: "Weather",
                    key: "weather"
                },
                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: nacelleRecords.map(item => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                status: item.nacelle_status || "Pending",
            })),
        },
        {
            title: "Rotor Hub Installation",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Hub Serial",
                    key: "hub_serial_number"
                },
                {
                    label: "Pitch Type",
                    key: "pitch_type"
                },
                {
                    label: "Weight",
                    key: "weight"
                },
                {
                    label: "Lifting End",
                    key: "lifting_end"
                },
                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: rotorRecords.map(item => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                status: item.rotor_status || "Pending",
            })),
        },
        {
            title: "Blade Installation",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Blade No",
                    key: "blade_no"
                },
                {
                    label: "Bolt Qty",
                    key: "no_of_bolt"
                },
                {
                    label: "Torque",
                    key: "torque_value"
                },
                {
                    label: "Weather",
                    key: "weather"
                },
                {
                    label: "Lifting End",
                    key: "lifting_end"
                },
                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: bladeRecords.map(item => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                status: item.blade_status || "Pending",
            })),
        }
    ];

    return ( <
        Box >
        <
        Box sx = {
            {
                mb: 4
            }
        } >
        <
        Stack direction = {
            {
                xs: 'column',
                md: 'row'
            }
        }
        justifyContent = "space-between"
        alignItems = {
            {
                xs: 'flex-start',
                md: 'center'
            }
        }
        spacing = {
            3
        } >
        <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            2.5
        } >
        <
        Avatar sx = {
            {
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)"
            }
        } >
        <
        WindPowerIcon sx = {
            {
                fontSize: 28
            }
        }
        /> <
        /Avatar>

        <
        Box >
        <
        Typography variant = "h5"
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
        WTG Installation Dashboard <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        Tower assembly, nacelle and blade installation <
        /Typography> <
        /Box> <
        /Stack>

        <
        Stack direction = "row"
        spacing = {
            2
        }
        alignItems = "center"
        sx = {
            {
                width: {
                    xs: '100%',
                    md: 'auto'
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
        /Box> {
            /* <Button
                          variant="outlined"
                          onClick={() => setFilters({ project: '', windfarm: '', cluster: '' })}
                          sx={{ borderRadius: 2, textTransform: 'none', height: 45, px: 3, fontWeight: 600 }}
                        >
                          Reset
                        </Button> */
        } <
        /Stack> <
        /Stack> <
        /Box>

        { /* --- METRIC CARDS --- */ } <
        Grid container spacing = {
            3
        }
        sx = {
            {
                mb: 4
            }
        } > {
            metrics.map((metric, index) => ( <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    3
                }
                key = {
                    index
                } >
                <
                Paper sx = {
                    {
                        p: 3,
                        borderRadius: 3,
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)'
                        }
                    }
                } >
                <
                Typography variant = "h3"
                fontWeight = {
                    700
                }
                color = "#2196F3" > {
                    metric.value
                } <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                sx = {
                    {
                        mb: 2
                    }
                } > {
                    metric.label
                } <
                /Typography> <
                LinearProgress variant = "determinate"
                value = {
                    metric.progress
                }
                sx = {
                    {
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(33, 150, 243, 0.15)',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: '#2196F3',
                            borderRadius: 3
                        }
                    }
                }
                /> <
                /Paper> <
                /Grid>
            ))
        } <
        /Grid>

        { /* --- CHARTS SECTION --- */ } <
        Grid container spacing = {
            3
        }
        sx = {
            {
                mb: 4
            }
        } >
        <
        Grid item xs = {
            12
        }
        md = {
            7
        } >
        <
        WTGActivityBarChart data = {
            wtgData.activities
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            5
        } >
        <
        WTGRecentActivityList recentActivities = {
            wtgData.recentActivities
        }
        /> <
        /Grid> <
        /Grid>

        { /* --- DETAILED TABLE SECTION --- */ } <
        Grid container spacing = {
            3
        } >
        <
        Grid item xs = {
            12
        } >
        <
        WTGInstallationTable turbineList = {
            wtgData.turbineList || []
        }
        searchTerm = {
            searchTerm
        }
        setSearchTerm = {
            setSearchTerm
        }
        page = {
            page
        }
        rowsPerPage = {
            rowsPerPage
        }
        handleChangePage = {
            handleChangePage
        }
        handleChangeRowsPerPage = {
            handleChangeRowsPerPage
        }
        handleRowClick = {
            handleOpenModal
        }
        /> <
        /Grid> <
        WTGInstallationModal sections = {
            installationsections
        }
        open = {
            modalOpen
        }
        onClose = {
            () => setModalOpen(false)
        }
        selectedTurbine = {
            selectedTurbine
        }
        activeTab = {
            modalTab
        }
        onTabChange = {
            (e, val) => setModalTab(val)
        }
        /> <
        /Grid>

        { /* --- DPR REPORT SECTION --- */ } <
        Box mt = {
            3
        } >
        <
        Paper elevation = {
            2
        }
        sx = {
            {
                width: "auto",
                maxHeight: "80vh",
                overflowY: "auto",
                borderRadius: 3,
                p: 2
            }
        } >
        <
        WtgDprComponent parentFilters = {
            filters
        }
        /> <
        /Paper> <
        /Box> <
        /Box>
    );
};

export default WTGInstallationTab;