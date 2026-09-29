import React, {
    useEffect,
    useMemo,
    useRef
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import DynamicTablesRenderer from "../commoncomponents/DynamicTablesRenderer";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    GetFullTurbineInstallationData
} from "../../../Redux/DashboardData/dashboardAction";
import CancelIcon from '@mui/icons-material/Cancel';
import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Typography
} from "@mui/material";
import {
    FOUNDATION_ACTIVITY_MAP
} from "../../../constants/choices";
import TablePagination from "@mui/material/TablePagination";
import {
    GetSQRecords
} from "../../../Redux/SafetyQualityData/SafetyQualityAction";
import {
    useLocation
} from "react-router-dom";
import {
    refreshNotifications
} from "../../../Redux/DashboardData/dashboardAction";
import {
    fetchSoilEvaluations,
    fetchExcavations,
    getPCCLayers,
    getConductLaying,
    getAnchorCages,
    getReinforcements,
    getFoundationData,
    GetPouringCards,
    // GetCubeSamples,
    GetWateringSchedule,
    GetCubeTestResults,
    updateSoilEvaluation,
    patchExcavation,
    updatePCCLayer,
    patchConductLaying,
    patchAnchorCage,
    patchReinforcement,
    patchFoundation,
    patchPouringCard,
    // patchCubeSamples,
    patchWateringSchedule,
    patchCubeTestResults,
    getDeshuttering,
    getBackfilling,
    patchDeshuttering,
    patchBackfilling,
    getDelayAnalysis,
} from "../../../Redux/InstallationData/FoundationData/foundationAction";
import {
    getPlatformDPR,
    patchPlatformDPR
} from "../../../Redux/InstallationData/PlateformData/plateformAction";

const COMMON_COLUMNS = [{
        label: "Status",
        key: "status",
        type: "status"
    },
    {
        label: "View",
        key: "view",
        type: "view"
    },
];

// Table grouping configuration
const TABLE_GROUPING_CONFIG = {
    soil: {
        groupBy: "turbine_sr_no",
        statusField: "soil_status",
    },
    excavation: {
        groupBy: "turbine_sr_no",
        statusField: "excavation_status",
    },
    pcc: {
        groupBy: "turbine_sr_no",
        statusField: "pcc_status",
    },
    "Conduit laying": {
        groupBy: "turbine_sr_no",
        statusField: "conduct_status",
    },
    "anchor cage": {
        groupBy: "turbine_sr_no",
        statusField: "anchor_status",
    },
    reinforcement: {
        groupBy: "turbine_sr_no",
        statusField: "reinforcement_status",
    },
    "foundation & casting": {
        groupBy: "turbine_sr_no",
        statusField: "foundation_status",
    },
    "pouring card": {
        groupBy: "turbine_sr_no",
        statusField: "pouring_status",
    },
    // "cube sample pre-test": {
    //   groupBy: "turbine_sr_no",
    //   statusField: "cube_sample_status",
    // },
    deshuttering: {
        groupBy: "turbine_sr_no",
        statusField: "desh_status",
    },
    "watering schedule": {
        groupBy: "turbine_sr_no",
        statusField: "water_status",
    },
    "cube test results": {
        groupBy: "turbine_sr_no",
        statusField: "cr_status",
    },
    backfilling: {
        groupBy: "turbine_sr_no",
        statusField: "backfill_status",
    },
    platform: {
        groupBy: "turbine_sr_no",
        statusField: "activity_status",
    },
};

const transformFoundationData = (data, dataType) => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item) => {
        // --- UNIVERSAL FILE SCANNER ---
        // This finds ANY extra document fields (like .pdf or .xlsx) in the record
        const extraFiles = [];
        Object.keys(item).forEach(key => {
            const val = item[key];
            // If it's a string, looks like a path, and isn't the primary photo or turbine name
            if (typeof val === 'string' && val.includes('.') &&
                !['evidence_photo', 'turbine_name', 'status'].includes(key)) {

                // Only add if it's actually a file extension we care about
                if (val.match(/\.(pdf|xlsx|xls|csv|doc|docx|zip)$/i)) {
                    extraFiles.push({
                        file: val,
                        name: key.replace(/_/g, ' ').toUpperCase(),
                        is_extra: true
                    });
                }
            }
        });

        // --- BASE DATA ---
        const baseData = {
            ...item,
            id: item.id,
            turbine_id: item.turbine,
            turbine_sr_no: item.turbine_name,
            evidence_photo: item.evidence_photo,
            view: true,
            status: item.approve_date ? "Approved" : "Pending",
            submitted_at: item.submitted_at,
            attachments: [...(item.activity_files || []), ...extraFiles],
        };

        switch (dataType) {
            case "soil":
                return {
                    ...baseData,
                    sampling_date: item.date_of_sampling,
                    depth_of_sample: item.depth_of_sample,
                    soil_type: item.soil_type,
                    moisture_content: item.moisture_content,
                    density: item.density,
                    permeability: item.permeability,
                    shear_strength: item.shear_strength,
                    soil_bearing_capacity: item.soil_bearing_capacity,
                    water_table_depth: item.water_table_depth,
                    test_lab_name: item.test_lab_name,
                    prepared_by: item.prepared_by,
                    summary_of_findings: item.summary_of_findings,
                    remarks: item.remarks,
                    action_required: item.action_required,
                    soil_status: item.soil_status,

                };

            case "excavation":
                return {
                    ...baseData,
                    contractor: item.contractor_name,
                    start_date: item.start_date,
                    depth_m: item.depth_meters,
                    excavation_volume: item.volume_m3,
                    inspector: item.inspector_name,
                    excavation_status: item.excavation_status,
                };

            case "pcc":
                return {
                    ...baseData,
                    pcc_thickness_mm: item.pcc_layer_thickness,
                    start_date: item.start_date,
                    contractor: item.contractor_name,
                    inspector: item.inspector_name,
                    pcc_status: item.pcc_status,
                };

            case "Conduit laying":
                return {
                    ...baseData,
                    pipe_diameter: item.pipe_diameter,
                    pipe_material: item.pipe_material,
                    length_installed_m: item.length_installed,
                    start_date: item.start_date,
                    contractor: item.contractor_name,
                    inspector: item.inspector_name,
                    conduct_status: item.conduct_status,
                };

            case "anchor cage":
                return {
                    ...baseData,
                    bolt_size: item.bolt_size,
                    torquing: item.torquing,
                    start_date: item.start_date,
                    contractor: item.contractor_name,
                    inspector: item.inspector_name,
                    anchor_status: item.anchor_status,
                };

            case "reinforcement":
                return {
                    ...baseData,
                    contractor: item.contractor_name,
                    start_date: item.start_date,
                    quantity: item.quantity_reinforcement,
                    inspector: item.inspector_name,
                    observations: item.observations,
                    reinforcement_status: item.reinforcement_status,

                };

            case "foundation & casting":
                return {
                    ...baseData,
                    start_date: item.start_date,
                    contractor: item.contractor_name,
                    inspector: item.inspector_name,
                    foundation_volume: item.foundation_volume,
                    cement_grade: item.cement_grade,
                    cement_brand: item.cement_brand,
                    foundation_type: item.foundation_type,
                    remarks: item.remarks_observations,
                    foundation_status: item.foundation_status,
                };

            case "pouring card":
                return {
                    ...baseData,
                    tm_no: item.tm_no,
                    concrete_temp: item.concrete_temperature,
                    // delivery_note: item.delivery_note_no,
                    pour_start: item.pouring_start_time,
                    pour_end: item.pouring_end_time,
                    quantity: item.quantity_delivered,
                    inspector: item.inspector_name,
                    remarks: item.remarks,
                    pouring_status: item.pouring_status,
                };

                // case "cube sample pre-test":
                //   return data.map((item) => ({
                //     id: item.id,
                //     turbine_sr_no: item.turbine_name,
                //     sample_id: item.sample_id,
                //     no_of_cubes: item.no_of_cubes,
                //     curing_method: item.curing_method,
                //     test_age: item.test_age,
                //     inspector: item.inspector_name,
                //     location: item.sample_location,
                //       cube_sample_status:item.cube_sample_status,
                //     view: true,
                //     status: item.approve_date ? "Approved" : "Pending",
                //     file: item.photos?.map((p) => p.image) || [],
                //     submitted_at: item.submitted_at
                //   }));



            case "deshuttering":
                const firstDefect = item.defects ? .[0] || {};

                return {
                    ...baseData,
                    deshuttering_date: item.deshuttering_date,
                    // defect_found: item.defect_found,
                    defect_found: item.defect_found ? "Yes" : "No",
                    defect_location: firstDefect.defect_location,
                    defect_description: firstDefect.defect_description,
                    action_taken: firstDefect.action_taken,
                    inspector: item.inspector_name,
                    desh_status: item.desh_status,
                };

            case "watering schedule":
                return {
                    ...baseData,
                    id: item.id,
                    turbine_sr_no: item.turbine_name,
                    watering_number: item.watering_number,
                    watering_datetime: item.date_time,
                    inspector_name: item.inspector_name,
                    water_status: item.water_status,
                    submitted_at: item.submitted_at
                };

            case "cube test results":
                return {
                    ...baseData,
                    cube_sample: item.sample_name,
                    test_age_days: item.no_of_days_test,
                    test_result: item.test_result,
                    lab_details: item.testing_lab_details,
                    completion_date: item.completion_date,
                    inspector_name: item.inspector_name,
                    acceptance_status: item.acceptance_criteria,
                    remark: item.remark,
                    cr_status: item.cr_status,
                };

            case "backfilling":
                return {
                    ...baseData,
                    backfilling_date: item.backfilling_date,
                    material_type: item.material_type,
                    compaction_percentage: item.compaction_percentage,
                    inspector_name: item.inspector_name,
                    contractor: item.contractor_name,
                    remark: item.remark,
                    backfill_status: item.backfill_status,
                };

            case "platform":
                return {
                    ...baseData,
                    work_date: item.work_date,
                    level: item.level,
                    compaction_achieved: item.compaction_achieved,
                    // work_done_desc: item.work_done_desc,
                    contractor: item.contractor_name,
                    test_method: item.test_method,
                    activity_status: item.activity_status,
                };

            default:
                return baseData;
        }
    });
};

// Group records by table-specific configuration
const groupRecordsByConfig = (rows, tableId) => {
    if (!rows ? .length) return rows;

    const config = TABLE_GROUPING_CONFIG[tableId];
    if (!config) return rows;

    const {
        groupBy,
        statusField
    } = config;

    const groups = {};

    rows.forEach(row => {
        const key = row[groupBy];
        if (!key) return;

        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
    });

    const finalRows = [];

    Object.keys(groups).forEach(key => {
        const groupRecords = groups[key];

        // Single record → show as it is
        if (groupRecords.length === 1) {
            finalRows.push(groupRecords[0]);
            return;
        }

        // 🔥 If statusField exists → find completed record
        if (statusField) {
            const completedRecord = groupRecords.find(
                r => r[statusField] ? .toLowerCase() === "completed"
            );

            if (completedRecord) {
                finalRows.push({
                    ...completedRecord,
                    _groupedRecords: groupRecords,
                    _groupKey: key,
                    _groupCount: groupRecords.length
                });
                return;
            }
        }

        // ❗ If no completed record → show latest record
        const latestRecord = groupRecords.sort((a, b) => {
            const dateA = new Date(a.submitted_at || 0);
            const dateB = new Date(b.submitted_at || 0);
            return dateB - dateA;
        })[0];

        finalRows.push({
            ...latestRecord,
            _groupedRecords: groupRecords,
            _groupKey: key,
            _groupCount: groupRecords.length
        });
    });

    return finalRows;
};

const getTurbineActivitySummary = (activitiesData) => {
    const {
        soilEvaluations,
        excavations,
        pccLayers,
        conductLayings,
        anchorCages,
        reinforcements,
        foundations,
        pouringCards,
        cubeSamples,
        deshutteringList,
        // wateringSchedule,
        cubeTestResults,
        backfillingList,
        platformDPRData,
    } = activitiesData;

    const turbineMap = {};
    const allActivities = [{
            name: "Soil",
            data: soilEvaluations
        },
        {
            name: "Excavation",
            data: excavations
        },
        {
            name: "PCC Layer",
            data: pccLayers
        },
        {
            name: "Conduit",
            data: conductLayings
        },
        {
            name: "Anchor Cage",
            data: anchorCages
        },
        {
            name: "Reinforcement",
            data: reinforcements
        },
        {
            name: "Casting",
            data: foundations
        },
        {
            name: "Pouring",
            data: pouringCards
        },
        // { name: "Cube Samples", data: cubeSamples },
        {
            name: "Deshuttering",
            data: deshutteringList,
        },
        // { name: "Watering", data: wateringSchedule },
        {
            name: "Cube Result",
            data: cubeTestResults
        },
        {
            name: "Backfilling",
            data: backfillingList
        },
        {
            name: "Platform",
            data: platformDPRData
        },
    ];

    allActivities.forEach(({
        name,
        data
    }) => {
        if (!data) return;
        data.forEach((item) => {
            const turbineSn = item.turbine_name;
            if (!turbineMap[turbineSn]) {
                turbineMap[turbineSn] = {
                    turbine_sn: turbineSn
                };
            }

            if (item.approve_date) {
                turbineMap[turbineSn][name] = {
                    approve_date: item.approve_date
                };
            } else if (item.submitted_at) {
                turbineMap[turbineSn][name] = {
                    submitted_at: item.submitted_at
                };
            } else {
                turbineMap[turbineSn][name] = null;
            }
        });
    });

    return Object.values(turbineMap);
};

const getTableStatusSummary = (rows = []) => {
    const total = rows.length;
    const completed = rows.filter(r => r.status === "Approved").length;
    const pending = rows.filter(r => r.status === "Pending").length;
    const notStarted = total === 0 ? 0 : total - completed - pending;

    return {
        completed,
        pending,
        notStarted
    };
};

const getActivityStatus = (activityArray = []) => {
    if (!activityArray.length) return "notStarted";
    const lastRecord = activityArray[activityArray.length - 1];
    if (lastRecord ? .approve_date) return "completed";
    if (lastRecord ? .submitted_at) return "pending";
    return "notStarted";
};

const hasAnyActivityStarted = (turbine) => {
    return FOUNDATION_ACTIVITY_MAP.some((activity) => {
        const status = getActivityStatus(turbine[activity.key]);
        return status !== "notStarted";
    });
};

function FoundationBase({
    tableIds,
    showTurbineSummary,
    appliedFilters
}) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const fetchedRef = useRef({});
    const dispatch = useDispatch();

    const location = useLocation();

    const targetRecordId = location.state ? .recordId;
    const targetTableId = location.state ? .tableId;

    const {
        foundationLoading,
        soilEvaluations = [],
        list: excavations = [],
        pccLayers = [],
        conductLayings = [],
        anchorCages = [],
        reinforcements = [],
        foundations = [],
        pouringCards = [],
        cubeSamples = [],
        deshutteringList = [],
        wateringSchedule = [],
        cubeTestResults = [],
        backfillingList = [],

        delays = [],
        error
    } = useSelector((state) => state.foundationData || {});
    const {
        platformDPRData = []
    } = useSelector(
        (state) => state.platformData || {},
    );
    const {
        sqlist = []
    } = useSelector((state) => state.sqData || {});

    const {
        fullData = []
    } = useSelector((state) => state.dashboardData || {});
    // console.log('excavations', excavations)

    const turbineSummary = getTurbineActivitySummary({
        soilEvaluations,
        excavations,
        pccLayers,
        conductLayings,
        anchorCages,
        reinforcements,
        foundations,
        pouringCards,
        cubeSamples,
        deshutteringList,
        wateringSchedule,
        cubeTestResults,
        backfillingList,
        platformDPRData,
    });


    useEffect(() => {


        if (!appliedFilters ? .project) return;
        dispatch(GetFullTurbineInstallationData(appliedFilters));
        // dispatch(GetSQRecords(appliedFilters));
        // dispatch(getDelayAnalysis(appliedFilters))

    }, [dispatch, appliedFilters]);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = fullData.filter((turbine) =>
        hasAnyActivityStarted(turbine)
    );

    // Fetch data only for the active tab
    // useEffect(() => {
    //   tableIds.forEach((id) => {
    //     if (fetchedRef.current[id]) return;

    //     fetchedRef.current[id] = true;

    //     switch (id) {
    //       case "soil":
    //         dispatch(fetchSoilEvaluations());
    //         break;
    //       case "excavation":
    //         dispatch(fetchExcavations());
    //         break;
    //       case "pcc":
    //         dispatch(getPCCLayers());
    //         break;
    //       case "Conduit laying":
    //         dispatch(getConductLaying());
    //         break;
    //       case "anchor cage":
    //         dispatch(getAnchorCages());
    //         break;
    //       case "reinforcement":
    //         dispatch(getReinforcements());
    //         break;
    //       case "foundation & casting":
    //         dispatch(getFoundationData());
    //         break;
    //       case "pouring card":
    //         dispatch(GetPouringCards());
    //         break;
    //       // case "cube sample pre-test":
    //       //   dispatch(GetCubeSamples());
    //       //   break;
    //       case "deshuttering":
    //         dispatch(getDeshuttering());
    //         break;
    //       // case "watering schedule":
    //       //   dispatch(GetWateringSchedule());
    //       //   break;
    //       case "cube test results":
    //         dispatch(GetCubeTestResults());
    //         break;
    //       case "backfilling":
    //         dispatch(getBackfilling());
    //         break;
    //       default:
    //         break;
    //     }
    //   });
    // }, [dispatch, tableIds]);

    useEffect(() => {
        if (!appliedFilters ? .project) return;
        let isMounted = true;
        // tableIds[0] is the current sub-tab ID
        const activeId = tableIds[0];

        // Create params
        const params = {
            project: appliedFilters.project,
            windfarm: appliedFilters.windfarm || undefined,
            cluster: appliedFilters.cluster || undefined,
        };

        // Unique key for THIS tab + THIS filter set
        // const fetchKey = `${activeId}-${appliedFilters.project}-${appliedFilters.windfarm}-${appliedFilters.cluster}`;

        // if (fetchedRef.current[fetchKey]) return;
        // fetchedRef.current[fetchKey] = true;

        // Dispatch ONLY for the active tab
        const actions = {
            soil: fetchSoilEvaluations,
            excavation: fetchExcavations,
            pcc: getPCCLayers,
            "Conduit laying": getConductLaying,
            "anchor cage": getAnchorCages,
            reinforcement: getReinforcements,
            "foundation & casting": getFoundationData,
            "pouring card": GetPouringCards,
            deshuttering: getDeshuttering,
            "watering schedule": GetWateringSchedule,
            "cube test results": GetCubeTestResults,
            backfilling: getBackfilling,
            platform: getPlatformDPR,
        };

        const currentAction = actions[activeId];

        if (currentAction) {
            // 2. Reset page to 0 immediately when filters change
            // This prevents being 'stuck' on page 5 of a cluster that only has 1 page
            setPage(0);

            // 3. Dispatch only if mounted
            if (isMounted) {
                dispatch(currentAction(params));
            }

            dispatch(getDelayAnalysis(params));
            dispatch(GetSQRecords(params));
        }
        return () => {
            isMounted = false;
        };

    }, [dispatch, tableIds, appliedFilters]);

    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const tables = useMemo(
        () => [{
                id: "soil",
                title: "Soil Evaluation Report",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Soil Status",
                        key: "soil_status",
                        editable: false
                    },
                    {
                        label: "Date of Sampling",
                        key: "date_of_sampling",
                        editable: true,
                    },

                    {
                        label: "Depth of Sample",
                        key: "depth_of_sample",
                        editable: true
                    },
                    {
                        label: "Soil Type",
                        key: "soil_type",
                        editable: true
                    },
                    {
                        label: "Moisture Content",
                        key: "moisture_content",
                        editable: true,
                    },
                    {
                        label: "Density",
                        key: "density",
                        editable: true
                    },
                    {
                        label: "Permeability",
                        key: "permeability",
                        editable: true
                    },
                    {
                        label: "Shear Strength",
                        key: "shear_strength",
                        editable: true
                    },
                    {
                        label: "Soil Bearing Capacity",
                        key: "soil_bearing_capacity",
                        editable: true,
                    },
                    {
                        label: "Water Table Depth",
                        key: "water_table_depth",
                        editable: true,
                    },
                    {
                        label: "Test Lab Name",
                        key: "test_lab_name",
                        editable: true
                    },
                    {
                        label: "Prepared By",
                        key: "prepared_by",
                        editable: true
                    },
                    {
                        label: "Summary of Findings",
                        key: "summary_of_findings",
                        editable: true,
                    },
                    {
                        label: "Remarks",
                        key: "remarks",
                        editable: true
                    },
                    {
                        label: "Action Required",
                        key: "action_required",
                        editable: true
                    },

                    // ...COMMON_COLUMNS,
                ],
                rows: [],
            },

            {
                id: "excavation",
                title: "Excavation Report",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Excavation Status",
                        key: "excavation_status",
                        editable: false,
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Working Date",
                        key: "start_date",
                        editable: true
                    },
                    {
                        label: "Depth (m)",
                        key: "depth_meters",
                        editable: true
                    },
                    {
                        label: "Excavation Volume (m³)",
                        key: "volume_m3",
                        editable: true,
                    },
                    {
                        label: "Inspector",
                        key: "inspector",
                        editable: false
                    },

                    // ...COMMON_COLUMNS,
                ],
                rows: [],
            },
            {
                id: "pcc",
                title: "PCC Form",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "PCC Status",
                        key: "pcc_status",
                        editable: false
                    },
                    {
                        label: "PCC Thickness (mm)",
                        key: "pcc_layer_thickness",
                        editable: true,
                    },
                    {
                        label: "Working Date",
                        key: "start_date",
                        editable: true
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Inspector",
                        key: "inspector",
                        editable: false
                    },
                ],
                rows: [],
            },
            {
                id: "Conduit laying",
                title: "Conduit Laying",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Conduit Status",
                        key: "conduct_status",
                        editable: false
                    },

                    {
                        label: "Pipe Diameter",
                        key: "pipe_diameter",
                        editable: true
                    },
                    {
                        label: "Pipe Material",
                        key: "pipe_material",
                        editable: true
                    },
                    {
                        label: "Length Installed (m)",
                        key: "length_installed",
                        editable: true,
                    },
                    {
                        label: "Working Date",
                        key: "start_date",
                        editable: true
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Inspector",
                        key: "inspector",
                        editable: false
                    },
                ],
                rows: [],
            },
            {
                id: "anchor cage",
                title: "Anchor Cage",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Anchor Status",
                        key: "anchor_status",
                        editable: false
                    },
                    {
                        label: "Anchor Cage",
                        key: "anchor_name"
                    },
                    {
                        label: "Torquing Range",
                        key: "torquing",
                        editable: true
                    },
                    {
                        label: "Torque Used",
                        key: "torquing_sr_no"
                    },

                    {
                        label: "Bolt Batch",
                        key: "bolt_name"
                    },

                    {
                        label: "Working Date",
                        key: "start_date",
                        editable: false
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Inspector",
                        key: "inspector",
                        editable: false
                    },
                ],
                rows: [],
            },
            {
                id: "reinforcement",
                title: "Reinforcement",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Reinforcement Status",
                        key: "reinforcement_status",
                        editable: false,
                    },

                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Working Date",
                        key: "start_date",
                        editable: true
                    },
                    {
                        label: "Quantity",
                        key: "quantity_reinforcement",
                        editable: true
                    },

                    {
                        label: "Inspector",
                        key: "inspector",
                        editable: false
                    },
                    {
                        label: "Observations",
                        key: "observations",
                        editable: false
                    },
                ],
                rows: [],
            },
            {
                id: "foundation & casting",
                title: "Foundation & Casting",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Foundation Status",
                        key: "foundation_status",
                        editable: false,
                    },
                    {
                        label: "Working Date",
                        key: "start_date",
                        editable: true
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Inspector",
                        key: "inspector",
                        editable: false
                    },
                    {
                        label: "Foundation Volume",
                        key: "foundation_volume",
                        editable: true,
                    },

                    // { label: "Foundation Type", key: "foundation_type" },
                    {
                        label: "Remarks",
                        key: "remarks",
                        editable: false
                    },
                ],
                rows: [],
            },
            {
                id: "pouring card",
                title: "Pouring Card",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc.",
                        key: "turbine_sr_no",
                        editable: false
                    },

                    {
                        label: "TM No",
                        key: "tm_no",
                        editable: false
                    },
                    {
                        label: "Pouring Status",
                        key: "pouring_status",
                        editable: false
                    },
                    {
                        label: "Concrete Temp",
                        key: "concrete_temperature",
                        editable: true,
                    },
                    // { label: "Delivery Note", key: "delivery_note", editable: true },
                    {
                        label: "Pour Start",
                        key: "pouring_start_time",
                        editable: true
                    },
                    {
                        label: "Pour End",
                        key: "pouring_end_time",
                        editable: true
                    },
                    {
                        label: "Quantity",
                        key: "quantity_delivered",
                        editable: true
                    },
                    {
                        label: "Inspector",
                        key: "inspector",
                        editable: false
                    },
                    {
                        label: "Remarks",
                        key: "remarks",
                        editable: false
                    },
                ],
                rows: [],
            },
            // {
            //   id: "cube sample pre-test",
            //   title: "Cube Sample (Pre-Test)",
            //   columns: [
            //     { label: "Turbine Loc", key: "turbine_sr_no" },
            //     { label: "Sample ID", key: "sample_id" },
            //     { label: "No of Cubes", key: "no_of_cubes" },
            //     { label: "Inspector", key: "inspector" },
            //     { label: "Cube Sample Status", key: "cube_sample_status"  },
            //     ...COMMON_COLUMNS,
            //   ],
            //   rows: [],
            // },

            {
                id: "deshuttering",
                title: "Deshuttering & Defect",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc.",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Deshutter Status",
                        key: "desh_status",
                        editable: false
                    },
                    {
                        label: "Deshutter Date",
                        key: "deshuttering_date",
                        editable: true
                    },
                    {
                        label: "Defect Found",
                        key: "defect_found",
                        editable: true
                    },
                    {
                        label: "Defect Location",
                        key: "defect_location",
                        editable: true
                    },
                    {
                        label: "Action Taken",
                        key: "action_taken",
                        editable: false
                    },
                    // { label: "Defect Photo", key: "def_photo" },
                    {
                        label: "Inspector",
                        key: "inspector_name",
                        editable: false
                    },
                ],
                rows: [],
            },
            {
                id: "watering schedule",
                title: "Watering Schedule",
                columns: [{
                        label: "Turbine Loc.",
                        key: "turbine_sr_no"
                    },
                    {
                        label: "Watering No",
                        key: "watering_number"
                    },
                    {
                        label: "Date & Time",
                        key: "watering_datetime"
                    },
                    {
                        label: "Inspector",
                        key: "inspector_name"
                    },
                    {
                        label: "Water Status",
                        key: "water_status"
                    },

                    // ...COMMON_COLUMNS,
                ],
                rows: [],
            },
            {
                id: "cube test results",
                title: "Cube Test Results",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Cube Sample",
                        key: "cube_sample",
                        editable: false
                    },
                    {
                        label: "Test Age (Days)",
                        key: "no_of_days_test",
                        editable: true
                    },
                    {
                        label: "Result",
                        key: "test_result",
                        editable: true
                    },
                    {
                        label: "Lab Details",
                        key: "testing_lab_details",
                        editable: true
                    },
                    {
                        label: "Completion Date",
                        key: "completion_date",
                        editable: true
                    },
                    {
                        label: "Inspector",
                        key: "inspector_name",
                        editable: false
                    },
                    {
                        label: "Acceptance",
                        key: "acceptance_status",
                        editable: false
                    },
                    {
                        label: "Remark",
                        key: "remark",
                        editable: false
                    },
                    {
                        label: "Cube Result Status",
                        key: "cr_status",
                        editable: false
                    },
                ],
                rows: [],
            },
            {
                id: "backfilling",
                title: "Backfilling",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Backfill Status",
                        key: "backfill_status",
                        editable: false
                    },
                    {
                        label: "Compaction",
                        key: "compaction_percentage",
                        editable: true
                    },
                    {
                        label: "Material Type",
                        key: "material_type",
                        editable: true
                    },
                    {
                        label: "Backfilling Date",
                        key: "backfilling_date",
                        editable: true,
                    },
                    {
                        label: "Inspector",
                        key: "inspector_name",
                        editable: false
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Remarks",
                        key: "remarks",
                        editable: true
                    },
                ],
                rows: [],
            },
            {
                id: "platform",
                title: "platform",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Loc",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Platform Status",
                        key: "activity_status",
                        editable: false
                    },
                    {
                        label: "Compaction",
                        key: "compaction_achieved",
                        editable: true
                    },
                    {
                        label: "Test Method",
                        key: "test_method",
                        editable: true
                    },
                    {
                        label: "work_date",
                        key: "work_date",
                        editable: true,
                    },
                    {
                        label: "Level",
                        key: "level",
                        editable: false
                    },
                    // { label: "work_done_desc", key: "work_done_desc", editable: false },
                    // { label: "Remark", key: "remark", editable: true },
                ],
                rows: [],
            },
        ], [],
    );

    // Transform and prepare data for tables with grouping
    const tablesWithRows = useMemo(() => {
        if (!appliedFilters ? .project) {
            //  if (!appliedFilters) {
            return tables.map((table) => ({ ...table,
                rows: []
            }));
        }
        return tables.map((table) => {
            let rawData = [];

            switch (table.id) {
                case "soil":
                    rawData = soilEvaluations;
                    break;
                case "excavation":
                    rawData = excavations;
                    break;
                case "pcc":
                    rawData = pccLayers;
                    break;
                case "Conduit laying":
                    rawData = conductLayings;
                    break;
                case "anchor cage":
                    rawData = anchorCages;
                    break;
                case "reinforcement":
                    rawData = reinforcements;
                    break;
                case "foundation & casting":
                    rawData = foundations;
                    break;
                case "pouring card":
                    rawData = pouringCards;
                    break;
                case "deshuttering":
                    rawData = deshutteringList;
                    break;
                case "watering schedule":
                    rawData = wateringSchedule;
                    break;
                case "cube test results":
                    rawData = cubeTestResults;
                    break;
                case "backfilling":
                    rawData = backfillingList;
                    break;
                case "platform":
                    rawData = platformDPRData;
                    break;
                default:
                    rawData = [];
            }

            const filteredData = rawData.filter((item) => {
                // 1. Project is REQUIRED (already checked by guard clause)
                const matchProject =
                    Number(item.project) === Number(appliedFilters.project);

                // 2. Windfarm: Match only if windfarm filter is selected, otherwise allow all
                const matchWindfarm = !appliedFilters.windfarm ||
                    Number(item.windfarm) === Number(appliedFilters.windfarm);

                // 3. Cluster: Match only if cluster filter is selected, otherwise allow all
                const matchCluster = !appliedFilters.cluster ||
                    Number(item.cluster) === Number(appliedFilters.cluster);

                return matchProject && matchWindfarm && matchCluster;
            });

            let rows = transformFoundationData(filteredData, table.id);
            rows = groupRecordsByConfig(rows, table.id);

            return { ...table,
                rows
            };
        });
    }, [
        tables,
        appliedFilters,
        soilEvaluations,
        excavations,
        pccLayers,
        conductLayings,
        anchorCages,
        reinforcements,
        foundations,
        pouringCards,
        deshutteringList,
        wateringSchedule,
        cubeTestResults,
        backfillingList,
        platformDPRData,
    ]);

    const handleUpdate = async (tableId, rowId, updatedData) => {
        try {
            // 1. Find the table config
            const tableConfig = tables.find((t) => t.id === tableId);
            if (!tableConfig) throw new Error(`Table config not found for ${tableId}`);

            // 2. Automatically build payload using ONLY columns marked 'editable: true'
            const payload = {};
            tableConfig.columns.forEach((col) => {
                if (col.editable === true && updatedData[col.key] !== undefined) {
                    payload[col.key] = updatedData[col.key];
                }
            });

            // We use a switch only for the Action names, not for building the payload
            switch (tableId) {
                case "soil":

                    await dispatch(updateSoilEvaluation(rowId, payload));
                    await dispatch(fetchSoilEvaluations());
                    break;

                case "excavation":
                    await dispatch(patchExcavation(rowId, payload));
                    await dispatch(fetchExcavations());
                    break;

                case "pcc":
                    await dispatch(updatePCCLayer(rowId, payload));
                    await dispatch(getPCCLayers());
                    break;

                case "Conduit laying":
                    await dispatch(patchConductLaying(rowId, payload));
                    await dispatch(getConductLaying());
                    break;

                case "anchor cage":
                    await dispatch(patchAnchorCage(rowId, payload));
                    await dispatch(getAnchorCages());
                    break;

                case "reinforcement":
                    await dispatch(patchReinforcement(rowId, payload));
                    await dispatch(getReinforcements());
                    break;

                case "foundation & casting":
                    await dispatch(patchFoundation(rowId, payload));
                    await dispatch(getFoundationData());
                    break;

                case "pouring card":
                    await dispatch(patchPouringCard(rowId, payload));
                    await dispatch(GetPouringCards());
                    break;

                case "deshuttering":
                    await dispatch(patchDeshuttering(rowId, payload));
                    await dispatch(getDeshuttering());
                    break;

                case "watering schedule":
                    await dispatch(patchWateringSchedule(rowId, payload));
                    dispatch(GetWateringSchedule());
                    break;

                case "cube test results":
                    await dispatch(patchCubeTestResults(rowId, payload));
                    await dispatch(GetCubeTestResults());
                    break;

                case "backfilling":

                    await dispatch(patchBackfilling(rowId, payload));
                    await dispatch(getBackfilling());
                    break;

                case "platform":

                    await dispatch(patchPlatformDPR(rowId, payload));
                    await dispatch(getPlatformDPR());
                    break;


                default:
                    console.warn(`No update handler for table: ${tableId}`);
            }

            return {
                success: true
            };
        } catch (err) {
            console.error(`Update failed for ${tableId}:`, err);
            return {
                success: false,
                error: err
            };
        }
    };

    // Approve handler
    const handleApprove = async (tableId, rowId, rowData = null) => {
        if (tableId === "platform") {
            const targetPlatformRecord = platformDPRData.find(
                (item) => item.id === rowId,
            );

            if (targetPlatformRecord) {
                const currentLevel = targetPlatformRecord.level ?
                    targetPlatformRecord.level.trim().toUpperCase() :
                    "";
                if (currentLevel !== "LF") {
                    alert(
                        `Approval Denied: Only Level 'LF' reports can be approved. Current level is '${targetPlatformRecord.level}'.`,
                    );
                    return;
                }
            }
        }
        const payload = {
            status: "approved"
        };

        try {
            switch (tableId) {
                case "soil":
                    await dispatch(updateSoilEvaluation(rowId, payload));
                    dispatch(fetchSoilEvaluations());

                    break;
                case "excavation":
                    await dispatch(patchExcavation(rowId, payload));
                    dispatch(fetchExcavations());

                    break;
                case "pcc":
                    await dispatch(updatePCCLayer(rowId, payload));
                    dispatch(getPCCLayers());

                    break;
                case "Conduit laying":
                    await dispatch(patchConductLaying(rowId, payload));
                    dispatch(getConductLaying());

                    break;
                case "anchor cage":
                    await dispatch(patchAnchorCage(rowId, payload));
                    dispatch(getAnchorCages());

                    break;
                case "reinforcement":
                    await dispatch(patchReinforcement(rowId, payload));
                    dispatch(getReinforcements());

                    break;
                case "foundation & casting":
                    await dispatch(patchFoundation(rowId, payload));
                    dispatch(getFoundationData());

                    break;
                case "pouring card":
                    await dispatch(patchPouringCard(rowId, payload));
                    dispatch(GetPouringCards());

                    break;
                    // case "cube sample pre-test":
                    //   await dispatch(patchCubeSamples(rowId, payload));
                    //   dispatch(GetCubeSamples());
                    //   break;
                case "deshuttering":
                    await dispatch(patchDeshuttering(rowId, payload));
                    dispatch(getDeshuttering());

                    break;
                case "watering schedule":
                    await dispatch(patchWateringSchedule(rowId, payload));
                    dispatch(GetWateringSchedule());
                    break;
                case "cube test results":
                    await dispatch(patchCubeTestResults(rowId, payload));
                    dispatch(GetCubeTestResults());

                    break;
                case "backfilling":
                    await dispatch(patchBackfilling(rowId, payload));
                    dispatch(getBackfilling());

                    break;

                case "platform":
                    await dispatch(patchPlatformDPR(rowId, payload));
                    await dispatch(getPlatformDPR());

                    break;
                default:
                    console.warn(`No approve handler for table: ${tableId}`);
                    break;
            }
            dispatch(refreshNotifications());
        } catch (err) {
            console.error(`Approve failed for ${tableId}:`, err);
        }
    };

    // Filter tables based on active tab
    const filteredTables = useMemo(
        () => tablesWithRows.filter((t) => tableIds.includes(t.id)), [tablesWithRows, tableIds]
    );

    return ( <
        Box > { /* Render only if showTurbineSummary is true */ } {
            showTurbineSummary && ( <
                Paper sx = {
                    {
                        mb: 2,
                        mt: 2,
                        p: 0,
                        borderRadius: 3,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "white",
                        overflow: "hidden",
                    }
                } >
                { /* <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}> */ } <
                Box sx = {
                    {
                        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                        px: 3,
                        py: 2.0,
                        display: "flex", // Added Flex
                        justifyContent: "space-between", // Pushes summary to the right
                        alignItems: "center",
                    }
                } >
                <
                Typography variant = "h6"
                sx = {
                    {
                        fontWeight: 700,
                        color: "white"
                    }
                } >
                Turbine Activity Progress <
                /Typography>

                { /* Legend */ } <
                Box sx = {
                    {
                        display: "flex",
                        gap: 2
                    }
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5
                    }
                } >
                <
                CheckCircleIcon sx = {
                    {
                        color: "#4ade80"
                    }
                }
                /> <
                Typography variant = "caption"
                sx = {
                    {
                        color: "white",
                        fontWeight: 600
                    }
                } > Approved < /Typography> <
                /Box> <
                Box sx = {
                    {
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5
                    }
                } >
                <
                CancelIcon sx = {
                    {
                        color: "#fbbf24"
                    }
                }
                /> <
                Typography variant = "caption"
                sx = {
                    {
                        color: "white",
                        fontWeight: 600
                    }
                } > Pending
                for Approval < /Typography> <
                /Box> <
                Box sx = {
                    {
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5
                    }
                } >
                <
                CancelIcon sx = {
                    {
                        color: "#94a3b8"
                    }
                }
                /> <
                Typography variant = "caption"
                sx = {
                    {
                        color: "white",
                        fontWeight: 600
                    }
                } > Not Started < /Typography> <
                /Box> <
                /Box> <
                /Box>

                <
                Paper sx = {
                    {
                        p: 2,
                        overflowX: "auto"
                    }
                } >
                <
                Table >
                <
                TableHead >
                <
                TableRow >
                <
                TableCell sx = {
                    {
                        fontWeight: "bold"
                    }
                } >
                Turbine Location <
                /TableCell> {
                    FOUNDATION_ACTIVITY_MAP.map((activity) => ( <
                        TableCell key = {
                            activity.key
                        }
                        align = "center"
                        sx = {
                            {
                                fontWeight: "bold"
                            }
                        } > {
                            activity.label
                        } <
                        /TableCell>
                    ))
                } <
                /TableRow> <
                /TableHead>

                <
                TableBody >

                {
                    paginatedData.length > 0 ? (
                        paginatedData.map((turbine) => {
                            const turbineCode = turbine ? .turbine_task ? .location_no;

                            return ( <
                                TableRow key = {
                                    turbineCode
                                } >
                                <
                                TableCell sx = {
                                    {
                                        color: "#1e3a8a",
                                        fontWeight: "bold"
                                    }
                                } > {
                                    turbineCode
                                } < /TableCell>

                                {
                                    FOUNDATION_ACTIVITY_MAP.map((activity) => {
                                        const status = getActivityStatus(turbine[activity.key]);

                                        return ( <
                                            TableCell key = {
                                                activity.key
                                            }
                                            align = "center" > {
                                                status === "completed" ? ( <
                                                    CheckCircleIcon color = "success" / >
                                                ) : status === "pending" ? ( <
                                                    CancelIcon color = "warning" / >
                                                ) : ( <
                                                    CancelIcon color = "disabled" / >
                                                )
                                            } <
                                            /TableCell>
                                        );
                                    })
                                } <
                                /TableRow>
                            );
                        })
                    ) : ( <
                        TableRow >
                        <
                        TableCell colSpan = {
                            FOUNDATION_ACTIVITY_MAP.length + 1
                        }
                        align = "center"
                        sx = {
                            {
                                py: 3
                            }
                        } >
                        <
                        Typography variant = "body2"
                        color = "textSecondary" >
                        No turbines found matching these filters. <
                        /Typography> <
                        /TableCell> <
                        /TableRow>
                    )
                } <
                /TableBody> <
                /Table>

                { /* ✅ Pagination */ } <
                TablePagination component = "div"
                count = {
                    filteredData.length
                }
                page = {
                    page
                }
                onPageChange = {
                    handleChangePage
                }
                rowsPerPage = {
                    rowsPerPage
                }
                onRowsPerPageChange = {
                    handleChangeRowsPerPage
                }
                rowsPerPageOptions = {
                    [5, 10, 25, 50]
                }
                /> <
                /Paper> <
                /Paper>
            )
        }

        {
            filteredTables.map((table) => {
                const summary = getTableStatusSummary(table.rows);
                return ( <
                    Box key = {
                        table.id
                    }
                    sx = {
                        {
                            mb: 5
                        }
                    } > { /* Activity Status Summary */ } {
                        /* <Box sx={{ display: "flex", gap: 2.0, alignItems: "center", justifyContent: "center", mb: 2 }}>
                                      <Box
                                        sx={{
                                          px: 2,
                                          py: 0.5,
                                          p: 1,
                                          borderRadius: 20,
                                          bgcolor: "#E8F5E9",
                                          color: "#2E7D32",
                                          fontSize: 13,
                                          fontWeight: 700,
                                        }}
                                      >
                                        {summary.completed} Approved
                                      </Box>
                                      <Box
                                        sx={{
                                          px: 2,
                                          py: 0.5,
                                          p: 1,
                                          borderRadius: 20,
                                          bgcolor: "#FFF8E1",
                                          color: "#EF6C00",
                                          fontSize: 13,
                                          fontWeight: 700,
                                        }}
                                      >
                                        {summary.pending} Pending for Approval
                                      </Box>
                                      <Box
                                        sx={{
                                          px: 2,
                                          py: 0.5,
                                          p: 1,
                                          borderRadius: 20,
                                          bgcolor: "#E3F2FD",
                                          color: "#1565C0",
                                          fontSize: 13,
                                          fontWeight: 700,
                                        }}
                                      >
                                        {summary.notStarted} Not Started
                                      </Box>
                                    </Box> */
                    }

                    { /* Table Renderer */ } <
                    DynamicTablesRenderer tables = {
                        [table]
                    }
                    onApprove = {
                        handleApprove
                    }
                    loading = {
                        foundationLoading
                    }
                    error = {
                        error
                    }
                    onUpdate = {
                        handleUpdate
                    }
                    sqlist = {
                        sqlist
                    }
                    delays = {
                        delays
                    }
                    /> <
                    /Box>
                );
            })
        } <
        /Box>
    );
}

export default FoundationBase;