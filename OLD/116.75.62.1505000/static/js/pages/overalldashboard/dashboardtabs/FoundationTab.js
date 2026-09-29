import React, {
    useState,
    useEffect
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    Box,
    Grid,
    Typography,
    Stack,
    Avatar,
    LinearProgress,
} from "@mui/material";
import {
    StyledCard
} from "./foundation-components/FoundationStyles";
import FoundationHeader from "./foundation-components/FoundationHeader";
import FoundationTable from "./foundation-components/FoundationTable";
import FoundationModal from "./foundation-components/FoundationModal";
import ActivityTimeline from "./foundation-components/ActivityTimeline";

import LocationFilterBar from "../../../components/LocationFilterBar";
import {
    GetFoundationSummaryData
} from "../../../Redux/DashboardData/dashboardAction";
import {
    FoundationIcon
} from "../TabIcons";

import {
    fetchSoilEvaluations,
    fetchExcavations,
    getPCCLayers,
    getConductLaying,
    getAnchorCages,
    getReinforcements,
    getFoundationData,
    GetPouringCards,
    GetCubeTestResults,
    getBackfilling,
} from "../../../Redux/InstallationData/FoundationData/foundationAction";
import FoundationDPR from "./foundation-components/FoundationDPR";

const FoundationTab = ({
    statistics,
    progressData,
    turbineList,
    recentActivities,
    onRefresh,
}) => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedTurbine, setSelectedTurbine] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const [activeLoadingTable, setActiveLoadingTable] = useState(null);
    const [prevLoading, setPrevLoading] = useState(false);
    const [filters, setFilters] = useState({
        project: "1",
        windfarm: "",
        cluster: "",
    });

    const foundationData = useSelector((state) => state.foundationData) || {};

    const {
        loading = false, // 👈 ADD THIS

            soilEvaluations = [],
            list: excavations = [],
            pccLayers = [],
            conductLayings = [],
            anchorCages = [],
            reinforcements = [],
            foundations = [],
            pouringCards = [],
            cubeTestResults = [],
            backfillingList = [],
    } = foundationData;

    useEffect(() => {
        const apiFilters = {
            project_id: filters.project,
            windfarm_id: filters.windfarm,
            cluster_id: filters.cluster,
        };
        dispatch(GetFoundationSummaryData(apiFilters));
    }, [dispatch, filters]);

    useEffect(() => {
        dispatch(fetchSoilEvaluations());
        dispatch(fetchExcavations());
        dispatch(getPCCLayers());
        dispatch(getConductLaying());
        dispatch(getAnchorCages());
        dispatch(getReinforcements());
        dispatch(getFoundationData());
        dispatch(GetPouringCards());
        dispatch(GetCubeTestResults());
        dispatch(getBackfilling());
    }, [dispatch]);

    useEffect(() => {
        if (prevLoading && !loading) {
            setActiveLoadingTable(null);
        }
        setPrevLoading(loading);
    }, [loading]);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (turbine) => {
        setSelectedTurbine(turbine);
        setModalOpen(true);
        setActiveTab(0);
    };

    // const handleCloseModal = () => {
    //   setModalOpen(false);
    //   setSelectedTurbine(null);
    // };

    const handleCloseModal = () => {
        // Blur the currently focused element to prevent aria-hidden focus violations
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        setModalOpen(false);
        setSelectedTurbine(null);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSoilFilter = (fromDate, toDate) => {
        setActiveLoadingTable("Soil Data"); // 👈 ADD THIS
        if (fromDate && toDate) {
            dispatch(fetchSoilEvaluations(fromDate, toDate));
        } else {
            dispatch(fetchSoilEvaluations()); // reset
        }
    };

    const handleAnchorFilter = (fromDate, toDate) => {
        setActiveLoadingTable("Anchor Cage Data");
        if (fromDate && toDate) {
            dispatch(getAnchorCages(fromDate, toDate));
        } else {
            dispatch(getAnchorCages()); // reset
        }
    };

    const handleExcavationFilter = (fromDate, toDate) => {
        setActiveLoadingTable("Excavation");

        const filterParams = {
            from_date: fromDate,
            to_date: toDate,
        };
        if (fromDate && toDate) {
            dispatch(fetchExcavations(filterParams));
        } else {
            dispatch(fetchExcavations({})); // reset
        }
    };

    const handlePCCFilter = (fromDate, toDate) => {
        setActiveLoadingTable("PCC Data");
        if (fromDate && toDate) {
            dispatch(getPCCLayers(fromDate, toDate));
        } else {
            dispatch(getPCCLayers()); // reset
        }
    };

    const handleConductLayingFilter = (fromDate, toDate) => {
        setActiveLoadingTable("Conduit Data");
        if (fromDate && toDate) {
            dispatch(getConductLaying(fromDate, toDate));
        } else {
            dispatch(getConductLaying()); // reset
        }
    };

    const handleReinforcementFilter = (fromDate, toDate) => {
        setActiveLoadingTable("Reinforcement Data");

        if (fromDate && toDate) {
            dispatch(getReinforcements(fromDate, toDate));
        } else {
            dispatch(getReinforcements());
        }
    };

    const handleFoundationFilter = (fromDate, toDate) => {
        setActiveLoadingTable("Foundation Data");
        if (fromDate && toDate) {
            dispatch(getFoundationData(fromDate, toDate));
        } else {
            dispatch(getFoundationData());
        }
    };

    // Dynamic table logic for selected turbine
    const turbineId = selectedTurbine ? .turbine_id;

    const turbineSoil = soilEvaluations.filter(
        (item) => item.turbine === turbineId,
    );

    const turbineExcavation = excavations.filter(
        (item) => item.turbine === turbineId,
    );

    const turbinePcc = pccLayers.filter((item) => item.turbine === turbineId);

    const turbineConduit = conductLayings.filter(
        (item) => item.turbine === turbineId,
    );

    const turbineAnchor = anchorCages.filter(
        (item) => item.turbine === turbineId,
    );

    const turbineReinforcement = reinforcements.filter(
        (item) => item.turbine === turbineId,
    );

    const turbineFoundation = foundations.filter(
        (item) => item.turbine === turbineId,
    );

    const turbinePouring = pouringCards.filter(
        (item) => item.turbine === turbineId,
    );
    const turbineCubeResult = cubeTestResults.filter(
        (item) => item.turbine === turbineId,
    );
    const turbineBackfilling = backfillingList.filter(
        (item) => item.turbine === turbineId,
    );
    // Prepare sections for DynamicStageTables
    const sections = [{
            title: "Soil Data",
            headers: [{
                    label: "Soil Type",
                    key: "soil_type"
                },
                {
                    label: "Bearing Capacity",
                    key: "soil_bearing_capacity"
                },
                {
                    label: "Date of Sampling",
                    key: "date_of_sampling"
                },
                // { label: "Depth of Sample", key: "depth_of_sample" },
                {
                    label: "Water Table Depth",
                    key: "water_table_depth"
                },

                {
                    label: "Density",
                    key: "density"
                },
                {
                    label: "Moisture Content",
                    key: "moisture_content"
                },
                {
                    label: "Permeability",
                    key: "permeability"
                },
                {
                    label: "Shear Strength",
                    key: "shear_strength"
                },

                {
                    label: "Test Lab Name",
                    key: "test_lab_name"
                },
                {
                    label: "Prepared By",
                    key: "prepared_by"
                },
                // { label: "Remarks", key: "remarks" },
                {
                    label: "Summary of Findings",
                    key: "summary_of_findings"
                },

                {
                    label: "Status",
                    key: "status"
                },
                // { label: "Approved Date", key: "approve_date" },
                // { label: "Approved By", key: "approved_by" },
                // { label: "Created At", key: "created_at" },
                // { label: "Created By", key: "created_by" },
                // { label: "Submitted At", key: "submitted_at" },
                // { label: "Action Required", key: "action_required" },
                // { label: "Activity", key: "activity" },
            ],

            data: turbineSoil.map((item) => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                status: item.soil_status || "Completed",
            })),
        },
        {
            title: "Excavation",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Depth (m)",
                    key: "depth_meters"
                },
                {
                    label: "Volume (m³)",
                    key: "volume_m3"
                },
                {
                    label: "Start Date",
                    key: "start_date"
                },
                {
                    label: "Status",
                    key: "status"
                },
                {
                    label: "Contractor",
                    key: "contractor_name"
                },
                {
                    label: "Inspector",
                    key: "inspector_name"
                },
                {
                    label: "Approved Date",
                    key: "approve_date"
                },
            ],

            data: turbineExcavation.map((item) => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                depth_meters: item.depth_meters || "-",
                volume_m3: item.volume_m3 || "-",

                status: item.excavation_status === "completed" ?
                    "Completed" :
                    item.excavation_status === "in_progress" ?
                    "In Progress" :
                    "Pending",
            })),
        },
        {
            title: "PCC Data",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Thickness (mm)",
                    key: "pcc_layer_thickness"
                },
                {
                    label: "Work Description",
                    key: "work_description"
                },
                {
                    label: "Start Date",
                    key: "start_date"
                },
                // { label: "End Date", key: "end_date" },
                {
                    label: "Area (sqm)",
                    key: "area_covered_sqm"
                },
                {
                    label: "Contractor",
                    key: "contractor_name"
                },
                {
                    label: "Inspector",
                    key: "inspector_name"
                },
                {
                    label: "Status",
                    key: "status"
                },
            ],

            data: turbinePcc.map((item) => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                pcc_layer_thickness: item.pcc_layer_thickness ? ? "-",
                end_date: item.end_date ? ? "-",
                area_covered_sqm: item.area_covered_sqm ? ? "-",

                status: item.pcc_status === "completed" ?
                    "Completed" :
                    item.pcc_status === "in_progress" ?
                    "In Progress" :
                    "Pending",
            })),
        },
        {
            title: "Conduit Data",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Length (m)",
                    key: "length_installed"
                },
                {
                    label: "Diameter",
                    key: "pipe_diameter"
                },
                {
                    label: "Material",
                    key: "pipe_material"
                },
                {
                    label: "Start Date",
                    key: "start_date"
                },

                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: turbineConduit.map((item) => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                length_installed: item.length_installed || item.conduct_laying_length_installed,
                pipe_diameter: item.pipe_diameter || item.conduct_laying_pipe_diameter,
                start_date: item.start_date || "-",

                status: item.conduct_status === "completed" ? "Completed" : "Pending",
            })),
        },
        {
            title: "Anchor Cage Data",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                // { label: "Bolt Size", key: "bolt_size" },
                {
                    label: "Anchor Cage",
                    key: "anchor_name"
                },
                {
                    label: "Torquing Range",
                    key: "torquing"
                },
                {
                    label: "Torque Used",
                    key: "torquing_sr_no"
                },
                {
                    label: "Start Date",
                    key: "start_date"
                },
                {
                    label: "Bolt Batch",
                    key: "bolt_name"
                },
                // { label: "End Date", key: "end_date" },
                {
                    label: "Inspector",
                    key: "inspector_name"
                },
                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: turbineAnchor.map((item) => ({
                ...item,
                // end_date: item.end_date ?? "-",
                status: item.anchor_status === "completed" ?
                    "Completed" :
                    item.anchor_status === "in_progress" ?
                    "In Progress" :
                    "Pending",
            })),
        },

        {
            title: "Reinforcement Data",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Bar Grade",
                    key: "bar_grade"
                },
                {
                    label: "Bar Size",
                    key: "bar_size"
                },
                {
                    label: "Quantity",
                    key: "quantity_reinforcement"
                },
                {
                    label: "Start Date",
                    key: "start_date"
                },

                {
                    label: "Contractor",
                    key: "contractor_name"
                },
                {
                    label: "Inspector",
                    key: "inspector_name"
                },
                {
                    label: "Observations",
                    key: "observations"
                },
                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: turbineReinforcement.map((item) => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                start_date: item.start_date || "-",
                end_date: item.end_date || "-",
                status: item.reinforcement_status === "completed" ?
                    "Completed" :
                    item.reinforcement_status === "in_progress" ?
                    "In Progress" :
                    "Pending",
            })),
        },
        {
            title: "Foundation Data",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Foundation Volume (m³)",
                    key: "total_volume"
                },
                {
                    label: "Start Date",
                    key: "start_date"
                },
                // { label: "End Date", key: "end_date" },
                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: turbineFoundation.map((item) => ({
                ...item,
                turbine_name: item.turbine_name || `Turbine ${item.turbine}`,
                total_volume: item.foundation_volume || "-",
                status: item.foundation_status === "completed" ? "Completed" : "Pending",
            })),
        },

        {
            title: "Pouring Data",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Quantity (m³)",
                    key: "quantity_delivered"
                },
                {
                    label: "Start Time",
                    key: "pouring_start_time"
                },
                {
                    label: "End Time",
                    key: "pouring_end_time"
                },
                {
                    label: "Concrete Temp (°C)",
                    key: "concrete_temperature"
                },
                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: turbinePouring.map((item) => ({
                ...item,
                status: item.pouring_status === "completed" ?
                    "Completed" :
                    item.pouring_status === "in_progress" ?
                    "In Progress" :
                    "Pending",
            })),
        },
        {
            title: "Cube Result Data",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Sample Name",
                    key: "sample_name"
                },
                {
                    label: "Test Days",
                    key: "no_of_days_test"
                },
                {
                    label: "Completion Date",
                    key: "completion_date"
                },
                {
                    label: "Cube Weight",
                    key: "cube_weight"
                },
                {
                    label: "Test Result",
                    key: "test_result"
                },
                {
                    label: "Lab Name",
                    key: "testing_lab_details"
                },
                {
                    label: "Acceptance Criteria",
                    key: "acceptance_criteria"
                },
                {
                    label: "Witness",
                    key: "witness_client_representative"
                },
                {
                    label: "Cube Size",
                    key: "cube_size_dimension"
                },
                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: turbineCubeResult.map((item) => ({
                ...item,
                status: item.cr_status === "completed" ?
                    "Completed" :
                    item.cr_status === "in_progress" ?
                    "In Progress" :
                    "Pending",
            })),
        },
        {
            title: "Backfilling Data",
            headers: [{
                    label: "Turbine",
                    key: "turbine_name"
                },
                {
                    label: "Backfilling Date",
                    key: "backfilling_date"
                },
                {
                    label: "Material Type",
                    key: "material_type"
                },
                {
                    label: "Compaction",
                    key: "compaction_percentage"
                },

                {
                    label: "Status",
                    key: "status"
                },
            ],
            data: turbineBackfilling.map((item) => ({
                ...item,
                status: item.backfill_status === "completed" ?
                    "Completed" :
                    item.backfill_status === "in_progress" ?
                    "In Progress" :
                    "Pending",
            })),
        },
    ];

    // 4. Loading State
    // if (loading && !statistics.totalTurbines) {
    //   return (
    //     <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
    //       <CircularProgress />
    //     </Box>
    //   );
    // }

    return ( <
        Box sx = {
            {
                p: 2,
                backgroundColor: "#f5f5f5",
                minHeight: "100vh"
            }
        } > {
            loading && ( <
                Box sx = {
                    {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2000
                    }
                } >
                <
                LinearProgress / >
                <
                /Box>
            )
        } { /* {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} */ } <
        Box sx = {
            {
                mb: 4
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
        { /* LEFT SIDE: Icon + Title Group */ } <
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
                background: "#FF9800",
                boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
            }
        } >
        <
        FoundationIcon sx = {
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
        Foundation Dashboard <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        Track foundation activities across {
            statistics.totalTurbines
        } {
            " "
        }
        turbines <
        /Typography> <
        /Box> <
        /Stack>

        { /* RIGHT SIDE: Filters + Action Group */ } <
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
        /Box> {
            /* <Button
                          variant="outlined"
                          onClick={() => setFilters({ project: '', windfarm: '', cluster: '' })}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            height: 45,
                            px: 3,
                            fontWeight: 600
                          }}
                        >
                          Reset
                        </Button> */
        } <
        /Stack> <
        /Stack> <
        /Box>

        <
        FoundationHeader statistics = {
            statistics
        }
        progressData = {
            progressData
        }
        recentActivities = {
            recentActivities
        }
        onRefresh = {
            onRefresh
        }
        />

        <
        FoundationTable filteredTurbines = {
            turbineList
        }
        page = {
            page
        }
        rowsPerPage = {
            rowsPerPage
        }
        searchTerm = {
            searchTerm
        }
        setSearchTerm = {
            setSearchTerm
        }
        filterAnchor = {
            filterAnchor
        }
        setFilterAnchor = {
            setFilterAnchor
        }
        selectedFilter = {
            selectedFilter
        }
        setSelectedFilter = {
            setSelectedFilter
        }
        handleChangePage = {
            handleChangePage
        }
        handleChangeRowsPerPage = {
            handleChangeRowsPerPage
        }
        handleRowClick = {
            handleRowClick
        }
        />

        <
        FoundationModal open = {
            modalOpen
        }
        onClose = {
            handleCloseModal
        }
        selectedTurbine = {
            selectedTurbine
        }
        activeTab = {
            activeTab
        }
        onTabChange = {
            handleTabChange
        }
        sections = {
            sections
        }
        onSoilFilter = {
            handleSoilFilter
        }
        onAnchorFilter = {
            handleAnchorFilter
        }
        onExcavationFilter = {
            handleExcavationFilter
        }
        onPCCFilter = {
            handlePCCFilter
        }
        onConductLayingFilter = {
            handleConductLayingFilter
        }
        onReinforcementFilter = {
            handleReinforcementFilter
        }
        onFoundationFilter = {
            handleFoundationFilter
        }
        loading = {
            loading
        }
        activeLoadingTable = {
            activeLoadingTable
        }
        />

        {
            /* <Box mt={3}>
                    <StyledCard
                      sx={{
                        // maxWidth: 500,
                        width: "100%",
                        maxHeight: "80vh",
                        overflowY: "auto"
                      }}
                    >
                      <ActivityTimeline turbines={filteredTurbines} />
                    </StyledCard>
                    
                  </Box> */
        }

        <
        Grid container spacing = {
            2
        }
        alignItems = "center"
        mb = {
            2
        } >
        <
        Grid item xs = {
            12
        } >
        <
        StyledCard sx = {
            {
                maxHeight: "80vh",
                overflowY: "auto",
                p: 2,
                mt: 2
            }
        } >
        <
        Typography variant = "h6"
        fontWeight = "700" >
        Detailed Foundation Progress <
        /Typography> <
        ActivityTimeline turbines = {
            turbineList
        }
        progressData = {
            progressData
        }
        totalTurbines = {
            statistics.totalTurbines
        }
        /> <
        /StyledCard> <
        /Grid> <
        /Grid>

        <
        Box mt = {
            3
        } >
        <
        StyledCard sx = {
            {
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
            }
        } >
        <
        FoundationDPR parentFilters = {
            filters
        }
        /> <
        /StyledCard> <
        /Box> <
        /Box>
    );
};

export default FoundationTab;