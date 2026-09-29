import {
    Tabs,
    Tab,
    Box,
    Typography
} from "@mui/material";
import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    useTableViewer
} from "../hooks/useTableViewer";
import SoilReport from "../pages/Foundation/soilReport";
import ExcavationForm from "../pages/Foundation/Excavation";
import PCCForm from "../pages/Foundation/Pcclayer";
import {
    getAttachmentsForActivity
} from "../utils/documentHelpers";
import ConduitLayingForm from "../pages/Foundation/ConduitLaying";
import AnchorCageForm from "../pages/Foundation/AnchorCage";
import ReinforcementForm from "../pages/Foundation/Reinforcement";
import FoundationCasting from "../pages/Foundation/FoundationCasting";
import PouringAndCubeSampleTab from "../pages/Foundation/Pouring&cubeSample/PouringAndCubeSampleIndex";
import DynamicViewer from "../pages/MultipleDocumentUpload/DynamicViewer";
import LocationFilterBar from "./LocationFilterBar";
import {
    useFileUpload
} from "../hooks/useFileUpload";
import {
    createSoilEvaluation,
    postExcavation,
    postPCCLayer,
    postConductLaying,
    postAnchorCage,
    postReinforcement,
    postFoundation,
    PostPouringCard,
    PostCubeSample,
    PostWateringSchedule,
    PostCubeTestResult,
    updateSoilEvaluation,
    updateExcavation,
    updatePCCLayer,
    updateConductLaying,
    updateAnchorCage,
    updateReinforcement,
    updateFoundation,
    postDeshuttering,

    postBackfilling,
    postDelayAnalysis,
} from "../Redux/InstallationData/FoundationData/foundationAction";
import {
    CreateDocumentUpload
} from "../Redux/MasterData/masterAction";
import parseErrorMessage from "../utils/errorFunction";
import {
    fetchContractors,
    GetInspectors,
    GetVendorData,
    GetAttachmentMasterData,
    GetDocumentUploadList,
    GetKPIMasterList,
    GetComponentTypesList,
    getTurbinePlannedDates,
} from "../Redux/MasterData/masterAction";
import {
    getEligibleTurbines
} from "../Redux/TurbineMasterData/turbineAction";
import {
    autoBindAttachments
} from "../pages/MultipleDocumentUpload/autoBindAttachments";

const FOUNDATION_TABS = [
    "Soil Report",
    "Excavation Form",
    "PCC Form",
    "Conduit Laying",
    "Anchor Cage",
    "Reinforcement Form",
    "Pre Pouring Approval",
    "Pouring & Cube Sample",
];

function FoundationTabs({
    filters,
    setFilters,
    showSnackbar
}) {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [subTabIndex, setSubTabIndex] = useState(0);
    const [submittedFoundationTabs, setSubmittedFoundationTabs] = useState({});
    const [isAcknowledged, setIsAcknowledged] = useState(false);
    const [openDefectPopup, setOpenDefectPopup] = useState(false);
    const [selectedDefects, setSelectedDefects] = useState([]);
    const [resetCubeSelection, setResetCubeSelection] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [editId, setEditId] = useState(null);
    const {
        viewer,
        closeViewer,
        buildColumns
    } = useTableViewer();
    const submittingRef = useRef(false);
    const {
        uploadAttachments
    } = useFileUpload(filters);

    // const handleViewDefects = (defects) => {
    //   setSelectedDefects(defects || []);
    //   setOpenDefectPopup(true);
    // };
    // const [delayPopupOpen, setDelayPopupOpen] = useState(false);

    //  const {kpiList = [] } = useSelector((state) => state.masterData || {})

    const {
        eligibleTurbines
    } = useSelector((state) => state.turbineData);
    const {
        componentTypesList = [],
            inspectors = [],
            vendorData = [],
            kpiList = [],
            activityPlannedDates = [],
            attachmentList = [],
            documentList = [],
    } = useSelector((state) => state.masterData || {});
    const contractors = useSelector(
        (state) => state.masterData ? .ContractorData ? ? [],
    );


    // const cubeTestResults = useSelector((state) => {
    //   const data = state.foundationData?.cubeTestResults;
    //   return Array.isArray(data) ? data : [];
    // });

    // ------------------- Initial States -------------------
    const initialSoilData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            date_of_sampling: "",
            // turbine_name: "",
            turbine: "",
            depth_of_sample: "",
            soil_type: "",
            moisture_content: "",
            density: "",
            permeability: "",
            shear_strength: "",

            soil_bearing_capacity: "",
            water_table_depth: "",
            test_lab_name: "",
            prepared_by: "",
            summary_of_findings: "",
            remarks: "",
            soil_status: "completed",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );

    const initialExcavationData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            contractor: "",
            start_date: "",
            excavation_status: "",
            depth_meters: "",
            volume_m3: "",
            inspector: "",
            evidence_photo: null,
            // for file upload
            selected_items: [],
        }), [],
    );

    const initialPccData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            pcc_layer_thickness: "",
            pcc_length: "",
            pcc_width: "",
            // area_covered_sqm:"",
            start_date: "",
            pcc_status: "",
            contractor: "",
            inspector: "",
            work_description: "",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );

    const initialConduitData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            contractor: "",
            start_date: "",
            // end_date: "",
            conduct_status: "",
            pipe_diameter: "",
            pipe_material: "",
            no_of_pipe: "",
            length_installed: "",
            inspector: "",
            work_description: "",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );

    const initialAnchorCageData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            anchor_sr_no: "",
            torquing_sr_no: "",
            bolt_batch: "",
            no_of_bolts: "",
            contractor: "",
            start_date: "",
            anchor_status: "",
            // end_date: "",
            // bolt_size: "",
            torquing: "",
            inspector: "",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );

    const initialReinforcementData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            contractor: "",
            start_date: "",
            reinforcement_status: "",
            // end_date: "",
            quantity_reinforcement: "",
            inspector: "",
            observations: "",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );

    const initialFoundationCastingData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            temp: "",
            weather_condition: "",
            start_date: "",
            foundation_volume: "",
            foundation_status: "completed",
            contractor: "",
            inspector: "",
            rmc_supplier_name: "",
            // foundation_type: "",
            remarks_observations: "",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );

    const initialPouringCardData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            tm_no: "",
            concrete_temperature: "",
            time_left_plant: "",
            time_arrived_site: "",
            pouring_start_time: "",
            pouring_end_time: "",
            action_taken: "",
            cone_test: "",
            inspector: "",
            pouring_status: "in_progress",
            weather_conditions: "",
            quantity_delivered: "",
            truck_mixer_capacity: "",
            batch_serial_number: "",
            remarks: "",
            evidence_photo: null,
            is_cube_taken: false,
            sample_id: "",
            no_of_cubes: "",
            sample_date: "",
            cubePhotos: [],
            cubePhotoPreviews: [],
            selected_items: [],
        }), [],
    );

    const initialDeshutteringData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            deshuttering_date: "",
            inspector: "",
            desh_status: "",
            remarks: "",
            defect_found: false,
            evidence_photo: null,
            selected_items: [],
        }), [],
    );

    const initialDefectData = useMemo(
        () => ({
            defect_location: "",
            defect_description: "",
            action_taken: "",
            def_photo: null,
        }), [],
    );

    // const initialCubeSampleData = useMemo(() => ({
    //   turbine: "",
    //   pouring_card:"",
    //   sample_id: "",
    //   no_of_cubes: "",

    //   inspector: "",
    //   cube_sample_status: "",
    //   sample_date:"",

    //   cubePhotos: [],
    //   cubePhotoPreviews: [],
    // }), []);

    const initialWateringData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            watering_number: "1",
            date_time: "",
            inspector: "",
            water_status: "",
            watering_image: null,
        }), [],
    );

    const emptyCubeTest = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            cube_id: "",
            no_of_days_test: "",
            test_result: "",
            testing_lab_details: "",
            completion_date: "",
            completed_by: "",
            inspector: "",
            cr_status: "completed",
            acceptance_criteria: "",
            cube_size_dimension: "",
            cube_weight: "",
            witness_client_representative: "",
            remark: "",
            evidence_photo: null,
            attachment: [],
            selected_items: [],
        }), [],
    );

    const initialBackfillingData = {
        project: "",
        windfarm: "",
        cluster: "",
        turbine: "",
        backfilling_date: "",
        material_type: "",
        compaction_percentage: "",
        contractor: "",
        inspector: "",
        remarks: "",
        backfill_status: "",
        evidence_photo: null,
        selected_items: [],
    };

    const [soilData, setSoilData] = useState(initialSoilData);
    const [excavationData, setExcavationData] = useState(initialExcavationData);
    const [pccData, setPccData] = useState(initialPccData);
    const [conduitData, setConduitData] = useState(initialConduitData);
    const [anchorCageData, setAnchorCageData] = useState(initialAnchorCageData);
    const [reinforcementData, setReinforcementData] = useState(
        initialReinforcementData,
    );
    const [foundationCastingData, setFoundationCastingData] = useState(
        initialFoundationCastingData,
    );
    const [pouringCardData, setPouringCardData] = useState(
        initialPouringCardData,
    );
    // const [cubeSampleData, setCubeSampleData] = useState(initialCubeSampleData);
    const [deshutter, setDeshutter] = useState(initialDeshutteringData);
    const [defects, setDefects] = useState([{ ...initialDefectData
    }]);
    const [wateringData, setWateringData] = useState(initialWateringData);
    // const [cubeTestData, setCubeTestData] = useState([{ ...emptyCubeTest }]);
    const [cubeTestData, setCubeTestData] = useState([{ ...emptyCubeTest
    }]);
    const [backfillingData, setBackfillingData] = useState(
        initialBackfillingData,
    );

    // Reset all form states when project, windfarm, or cluster filters change
    useEffect(() => {
        dispatch({
            type: "CLEAR_ELIGIBLE_TURBINES"
        });
        // 1. Reset standard forms to initial states
        setSoilData(initialSoilData);
        setExcavationData(initialExcavationData);
        setPccData(initialPccData);
        setConduitData(initialConduitData);
        setAnchorCageData(initialAnchorCageData);
        setReinforcementData(initialReinforcementData);
        setFoundationCastingData(initialFoundationCastingData);
        setPouringCardData(initialPouringCardData);
        setDeshutter(initialDeshutteringData);
        setWateringData(initialWateringData);
        setBackfillingData(initialBackfillingData);

        // 2. Reset dynamic/array-based forms
        setCubeTestData([{ ...emptyCubeTest
        }]);
        setDefects([{ ...initialDefectData
        }]);

        // 3. Clear editing mode and acknowledgments
        setEditId(null);
        setIsAcknowledged(false);
        setSelectedDefects([]);
        setOpenDefectPopup(false);

        // Optional: Scroll back to top smoothly
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [filters.project, filters.windfarm, filters.cluster]);

    // 1. Activity mapping (static → keep outside component ideally)
    const mainActivities = [
        "SOIL",
        "EXC",
        "PCC",
        "CONDUIT",
        "ANCHOR",
        "REINF",
        "CAST",
    ];
    const pouringSubActivities = [
        "POUR",
        "DESHUTTER",
        "WATER",
        "CUBE_RESULT",
        "BACKFILL",
    ];

    // 2. Memoized activityCode (prevents unnecessary effect triggers)
    const activityCode = useMemo(() => {
        return tabIndex === 7 ?
            pouringSubActivities[subTabIndex] :
            mainActivities[tabIndex];
    }, [tabIndex, subTabIndex]);

    // 2. REAL-TIME WORKFLOW SYNC VIA POLLING (Path A)
    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm) return;

        const fetchCategoryTurbines = () => {
            // Pass project, windfarm, cluster, activity (null), and category ("FOUNDATION")
            dispatch(
                getEligibleTurbines(
                    filters.project,
                    filters.windfarm,
                    filters.cluster,
                    null, // activity is null
                    "FOUNDATION", // passes the category
                ),
            );
        };

        // Fetch immediately on mount or when filters change
        fetchCategoryTurbines();

        // Set up 15-second interval polling
        const pollingIntervalId = setInterval(fetchCategoryTurbines, 15000);

        // Cleanup interval on unmount or filter change
        return () => clearInterval(pollingIntervalId);
    }, [filters.project, filters.windfarm, filters.cluster, dispatch]);

    // 3. Update how lists are passed down to your children tabs
    const soilTurbines = useMemo(
        () => eligibleTurbines ? .SOIL || [], [eligibleTurbines],
    );
    const excavationTurbines = useMemo(
        () => eligibleTurbines ? .EXC || [], [eligibleTurbines],
    );
    const pccTurbines = useMemo(
        () => eligibleTurbines ? .PCC || [], [eligibleTurbines],
    );
    const conduitTurbines = useMemo(
        () => eligibleTurbines ? .CONDUIT || [], [eligibleTurbines],
    );
    const anchorTurbines = useMemo(
        () => eligibleTurbines ? .ANCHOR || [], [eligibleTurbines],
    );
    const reinforcementTurbines = useMemo(
        () => eligibleTurbines ? .REINF || [], [eligibleTurbines],
    );
    const castTurbines = useMemo(
        () => eligibleTurbines ? .CAST || [], [eligibleTurbines],
    );
    const pourTurbines = useMemo(
        () => eligibleTurbines ? .POUR || [], [eligibleTurbines],
    );

    const deshutterTurbines = useMemo(
        () => eligibleTurbines ? .DESHUTTER || [], [eligibleTurbines],
    );
    const waterCuringTurbines = useMemo(
        () => eligibleTurbines ? .WATER || [], [eligibleTurbines],
    );
    const cubeResultTurbines = useMemo(
        () => eligibleTurbines ? .CUBE_RESULT || [], [eligibleTurbines],
    );
    const backfillTurbines = useMemo(
        () => eligibleTurbines ? .BACKFILL || [], [eligibleTurbines],
    );

    const getActivePlan = useCallback(
        (selectedTurbineId) => {
            if (!selectedTurbineId || !activityPlannedDates ? .length) return null;

            return activityPlannedDates.find(
                (plan) =>
                String(plan.turbine) === String(selectedTurbineId) &&
                plan.activity_name === activityCode,
            );
        }, [activityPlannedDates, activityCode],
    );

    const handleDelaySubmit = async (delayData, turbineId) => {
        const rawDate = delayData.delay_log_date || delayData.actual_start_date;
        const formattedDate = rawDate ? rawDate.split("T")[0] : "";

        // ================= DATE VALIDATION =================
        if (!formattedDate) {
            showSnackbar("Please select a valid delay log date.", "error");
            return false;
        }

        const tId = turbineId || delayData ? .turbine;
        const plan = getActivePlan(tId);

        if (!plan ? .id) {
            console.error("No planned activity found");
            showSnackbar("No planned activity found for this turbine.", "error");
            return false;
        }

        const payload = {
            id: delayData.id || undefined,
            planned_activity: plan.id,
            delay_cause: delayData.delay_cause,
            description: delayData.description,
            delay_log_date: formattedDate,
            starting_delay_days: delayData.starting_delay_days || 0,
            working_delay_days: delayData.working_delay_days || 0,
            has_delay: true,
            cube_id: delayData.cube_id || undefined,
            no_of_days_test: delayData.no_of_days_test || undefined,
        };


        try {
            const resultAction = await dispatch(postDelayAnalysis(payload));

            if (resultAction ? .type ? .endsWith("/rejected") || resultAction ? .error) {
                // Throw the payload so the catch block can handle the backend error response
                throw resultAction.payload || resultAction.error;
            }

            showSnackbar("Delay analysis saved successfully!", "success");
            return true;
        } catch (error) {
            // 1. Check for the specific Django 'non_field_errors' array
            let errorMessage = "Failed to save delay records.";

            if (error ? .non_field_errors && Array.isArray(error.non_field_errors)) {
                errorMessage = error.non_field_errors[0];
            } else if (typeof error === "string") {
                errorMessage = error;
            } else if (error ? .message) {
                errorMessage = error.message;
            } else if (error ? .detail) {
                errorMessage = error.detail;
            }

            showSnackbar(errorMessage, "error");
            return false;
        }
    };



    // ------------------- Edit Handlers -------------------
    const handleEditSoil = (row) => {
        setEditId(row.id);
        setSoilData({
            date_of_sampling: row.date_of_sampling || "",
            turbine: row.turbine || "", // FK ID
            depth_of_sample: row.depth_of_sample || "",
            soil_type: row.soil_type || "",
            moisture_content: row.moisture_content || "",
            density: row.density || "",
            permeability: row.permeability || "",
            shear_strength: row.shear_strength || "",
            soil_bearing_capacity: row.soil_bearing_capacity || "",
            water_table_depth: row.water_table_depth || "",
            test_lab_name: row.test_lab_name || "",
            prepared_by: row.prepared_by || "",
            summary_of_findings: row.summary_of_findings || "",
            remarks: row.remarks || "",

            test_report_file: null,
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleEditExcavation = (row) => {
        setEditId(row.id);
        setExcavationData({
            turbine: row.turbine ? String(row.turbine) : "", // ✅ STRING
            contractor: row.contractor ? String(row.contractor) : "",
            inspector: row.inspector ? String(row.inspector) : "",

            start_date: row.start_date ?
                row.start_date.split(" ")[0] // ✅ DATE FIX
                :
                "",

            depth_meters: row.depth_meters || "",
            volume_m3: row.volume_m3 || "",
            evidence_photo: null,
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleEditPcc = (row) => {
        setEditId(row.id);
        setPccData({
            turbine: row.turbine || "",
            pcc_layer_thickness: row.pcc_layer_thickness || "",
            area_covered_sqm: row.area_covered_sqm,
            start_date: row.start_date || "",

            contractor: row.contractor || "",
            inspector: row.inspector || "",
            work_description: row.work_description || "",
            document: null,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    const handleEditConduit = (row) => {
        setEditId(row.id);
        setConduitData({
            turbine: row.turbine || "",
            contractor: row.contractor || "",
            start_date: row.start_date || "",
            // end_date: row.end_date || "",
            pipe_diameter: row.pipe_diameter || "",
            pipe_material: row.pipe_material || "",
            no_of_pipe: row.no_of_pipe || "",
            length_installed: row.length_installed || "",
            inspector: row.inspector || "",
            document: null,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleEditAnchorCage = (row) => {
        setEditId(row.id);
        setAnchorCageData({
            turbine: row.turbine || "",
            contractor: row.contractor || "",
            start_date: row.start_date || "",
            // end_date: row.end_date || "",
            bolt_size: row.bolt_size || "",
            torquing: row.torquing || "",
            inspector: row.inspector || "",
            document: null,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    const handleEditReinforcement = (row) => {
        setEditId(row.id);
        setReinforcementData({
            turbine: row.turbine,
            contractor: row.contractor,
            start_date: row.start_date || "",
            // end_date: row.end_date || "",
            quantity_reinforcement: row.quantity_reinforcement || "",

            inspector: row.inspector || "",
            observations: row.observations || "",
            steel_consumption_report: null,
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    const handleEditFoundationCasting = (row) => {
        setEditId(row.id);
        setFoundationCastingData({
            turbine: row.turbine,
            temp: row.temp || "",
            weather_condition: row.weather_condition || "",

            start_date: row.start_date || "",
            // end_date: row.end_date || "",
            contractor: row.contractor,
            status: row.status || "",
            inspector: row.inspector,
            rmc_supplier_name: row.rmc_supplier_name || "",
            batching_plant_location: row.batching_plant_location || "",
            distance_from_site_km: row.distance_from_site_km || "",

            foundation_type: row.foundation_type || "",
            foundation_reinforcement_details: row.foundation_reinforcement_details || "",
            remarks_observations: row.remarks_observations || "",
            document: null,
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    const handleEditPouringCard = (row) => {
        setEditId(row.id);
        setPouringCardData({
            turbine: row.turbine,
            tm_no: row.tm_no || "",
            concrete_temperature: row.concrete_temperature || "",

            time_left_plant: row.time_left_plant || "",
            time_arrived_site: row.time_arrived_site || "",
            pouring_start_time: row.pouring_start_time || "",
            pouring_end_time: row.pouring_end_time || "",
            action_taken: row.action_taken || "",
            cone_test: row.cone_test || "",
            inspector: row.inspector,
            weather_conditions: row.weather_conditions || "",
            quantity_delivered: row.quantity_delivered || "",
            truck_mixer_capacity: row.truck_mixer_capacity || "",
            batch_serial_number: row.batch_serial_number || "",
            remarks: row.remarks || "",
            pouring_status: row.pouring_status || "",
            cubePhotos: [],
            cubePhotoPreviews: [],
            evidence_photo: null,
            // batching_slip: null,
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };



    const handleCubeTestChange = useCallback((index, field, value) => {

        setCubeTestData((prev) =>
            prev.map((item, i) =>
                i === index ?
                {
                    ...item,
                    [field]: value,
                } :
                item,
            ),
        );
    }, []);
    const addCubeTest = useCallback(() => {
        setCubeTestData((prev) => [
            ...prev,
            {
                ...emptyCubeTest,
                // foundation: cubeSampleData.foundation,
                cubeTestNumber: String(prev.length + 1),
            },
        ]);
    }, []);

    const removeCubeTest = useCallback((index) => {
        setCubeTestData((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const addDefect = useCallback(() => {
        // setDefects([...defects, { ...initialDefectData }]);
        setDefects((prev) => [...prev, { ...initialDefectData
        }]);
    }, []);

    // const removeDefect = (index) => {
    //   setDefects(prev => prev.filter((_, i) => i !== index));
    // }; setDefects([{ ...initialDefectData }]);

    const removeDefect = useCallback((index) => {
        setDefects((prev) => prev.filter((_, i) => i !== index));
    }, []);

    // Initialize only once
    useEffect(() => {
        setDefects([{ ...initialDefectData
        }]);
    }, []);

    const resetCubeResultForm = useCallback(() => {
        setCubeTestData([{ ...emptyCubeTest
        }]);
        setEditId(null);
    }, []);

    const handleSoilDataChange = useCallback((field, value) => {
        setSoilData((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);

    const handleExcavationChange = useCallback((field, value) => {
        setExcavationData((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);

    // const handleExcavationChange = useCallback((fieldOrObject, value) => {
    //   setExcavationData((prev) => {
    //     // If the first argument is an object (e.g., { turbine: 1, row_files: {} })
    //     if (typeof fieldOrObject === 'object' && fieldOrObject !== null) {
    //       return { ...prev, ...fieldOrObject };
    //     }

    //     // Otherwise, handle it as a single field update like before
    //     return { ...prev, [fieldOrObject]: value };
    //   });
    // }, []);

    const handlePccChange = useCallback((field, value) => {
        setPccData((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);

    const handleConduitChange = useCallback((field, value) => {
        setConduitData((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);

    const handleAnchorChange = useCallback((field, value) => {
        setAnchorCageData((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);
    const handleReinforcementChange = useCallback((field, value) => {
        setReinforcementData((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);
    const handleFcChange = useCallback((field, value) => {
        setFoundationCastingData((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);

    // const handlePouringCardChange = useCallback((field, value) => {
    //   setPouringCardData((prev) => ({ ...prev, [field]: value }));
    // }, []);

    const handlePouringCardChange = useCallback((field, value) => {
        setPouringCardData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Logic: If user unchecks "is_cube_taken", clear the cube-related fields
        if (field === "is_cube_taken" && value === false) {
            setPouringCardData((prev) => ({
                ...prev,
                sample_id: "",
                no_of_cubes: "",
                sample_date: "",
                cubePhotos: [],
                cubePhotoPreviews: [],
            }));
        }
    }, []);

    // const handleCubeSampleChange = useCallback((name, value) => {
    //   setCubeSampleData((prev) => ({
    //     ...prev,
    //     [name]: value,
    //   }));
    // }, []);

    const handleDeshutteringChange = useCallback((field, value) => {
        setDeshutter((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);

    // const handleDefectChange = useCallback((index, field, value) => {
    //   const updated = [...defects];
    //   updated[index][field] = value;
    //   setDefects(updated);
    // }, []);

    const handleDefectChange = useCallback((index, field, value) => {
        setDefects((prev) => {
            const updated = [...prev];
            if (!updated[index]) {
                console.warn(`Defect at index ${index} does not exist!`);
                return updated;
            }
            updated[index] = { ...updated[index],
                [field]: value
            };
            return updated;
        });
    }, []);

    const handleWateringChange = useCallback((field, value) => {
        setWateringData((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);

    const handleBackfillingChange = (field, value) => {
        setBackfillingData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        dispatch(GetAttachmentMasterData());
        // dispatch(GetMaterialIssueData());
        // dispatch(GetMaterialRecivedData());
        dispatch(fetchContractors());
        dispatch(GetInspectors());
        dispatch(GetVendorData());
        // dispatch(GetMaterialMasterData());
        // dispatch(GetKPIMasterList());
        // dispatch(GetDocumentUploadList());
        dispatch(GetComponentTypesList("?type=Delay%20Cause"));
        dispatch(getTurbinePlannedDates());
    }, [dispatch]);

    useEffect(() => {
        // 1. 🛡️ Guard Clause: If no project is selected, do nothing
        if (!filters.project) return;

        // 2. Format the string containing the query parameters exactly as the backend wants it
        const queryString = `?project=${filters.project}`;

        // 3. Dispatch it. This forces the API path to combine into: /api/kpi-master/?project=7
        dispatch(GetKPIMasterList(queryString));
    }, [dispatch, filters.project]);


    useEffect(() => {
        // Whenever filters change, reset the specific turbine and material fields
        setAnchorCageData((prev) => ({
            ...prev,
            turbine: "",
            issued_turbine_id: "",
            anchor_sr_no: "",
            torquing_sr_no: "",
            bolt_batch: "",
            no_of_bolts: "",
        }));
    }, []);

    useEffect(() => {
        // Compute active turbine ID depending on which panel/tab index the user is looking at
        let activeTurbineId = "";



        if (tabIndex === 0) activeTurbineId = soilData.turbine;
        else if (tabIndex === 1) activeTurbineId = excavationData.turbine;
        else if (tabIndex === 2) activeTurbineId = pccData.turbine;
        else if (tabIndex === 3) activeTurbineId = conduitData.turbine;
        else if (tabIndex === 4) activeTurbineId = anchorCageData.turbine;
        else if (tabIndex === 5) activeTurbineId = reinforcementData.turbine;
        else if (tabIndex === 6) activeTurbineId = foundationCastingData.turbine;
        else if (tabIndex === 7) {
            if (subTabIndex !== 3) {
                activeTurbineId = pouringCardData.turbine;
            }
        }

        if (activeTurbineId) {
            dispatch(GetDocumentUploadList({
                turbine: activeTurbineId
            }));
        }
    }, [
        dispatch,
        tabIndex,
        subTabIndex,
        soilData.turbine,
        excavationData.turbine,
        pccData.turbine,
        conduitData.turbine,
        anchorCageData.turbine,
        reinforcementData.turbine,
        foundationCastingData.turbine,
        pouringCardData.turbine,
        cubeTestData[0] ? .turbine,
    ]);

    const autoBindAttachments = useCallback(
        (turbineId, activityCode, currentItems, onDataChange) => {
            if (!turbineId || !attachmentList ? .length) return;

            const activityMasterItems = attachmentList.filter(
                (m) => m.activity === activityCode,
            );

            const attachmentIds = documentList
                .filter(
                    (doc) =>
                    String(doc.turbine) === String(turbineId) &&
                    activityMasterItems.some((m) => m.id === doc.attachment_master) &&
                    !doc.is_deleted &&
                    doc.is_current,
                )
                .map((doc) => doc.id);

            const mergedItems = activityMasterItems
                .map((master) => {
                    const dbRecord = documentList ? .find(
                        (doc) =>
                        String(doc.turbine) === String(turbineId) &&
                        doc.attachment_master === master.id &&
                        !doc.is_deleted &&
                        doc.is_current,
                    );

                    if (dbRecord) {
                        return {
                            instanceId: `db_${dbRecord.id}`,
                            masterId: master.id,
                            documentId: dbRecord.id,
                            file_type_label: master.file_name,
                            is_mandatory: master.is_mandatory,
                            custom_name: dbRecord.name || "",
                            doc_no: dbRecord.doc_no || "",
                            doc_date: dbRecord.doc_date || "",
                            remarks: dbRecord.remarks || "",
                            file: {
                                name: dbRecord.file ?
                                    dbRecord.file.split("/").pop() :
                                    "Uploaded Document",
                                isExisting: true,
                                url: dbRecord.file,
                            },
                        };
                    } else if (master.is_mandatory) {
                        return {
                            instanceId: `req_${master.id}`,
                            masterId: master.id,
                            documentId: master.id,
                            file_type_label: master.file_name,
                            is_mandatory: true,
                            custom_name: "",
                            doc_no: "",
                            doc_date: "",
                            remarks: "",
                            file: null,
                        };
                    }
                    return null;
                })
                .filter(Boolean);


            // Don't overwrite rows that already contain locally selected files
            const hasLocalFiles = currentItems ? .some(
                (item) => item.file instanceof File || item.file instanceof Blob,
            );

            const isSame =
                currentItems ? .length === mergedItems.length &&
                currentItems.every((item, i) => {
                    const merged = mergedItems[i];

                    return (
                        item.masterId === merged ? .masterId &&
                        item.file ? .url === merged ? .file ? .url &&
                        item.custom_name === merged ? .custom_name &&
                        item.doc_no === merged ? .doc_no &&
                        item.doc_date === merged ? .doc_date
                    );
                });

            if (!hasLocalFiles && !isSame) {
                onDataChange("selected_items", mergedItems);
            }

            onDataChange("attachment", attachmentIds);
        }, [documentList, attachmentList],
    );

    const autoBindCubeAttachments = (row, index, handleCubeTestChange) => {
        if (!row.attachment ? .length) return;

        const mergedItems = row.attachment
            .map((id) => {
                const doc = documentList.find((d) => d.id === id);
                if (!doc) return null;

                const master = attachmentList.find(
                    (m) => m.id === doc.attachment_master,
                );

                if (!master) return null;

                return {
                    instanceId: `db_${doc.id}`,
                    masterId: master.id,
                    documentId: doc.id,
                    file_type_label: master.file_name,
                    is_mandatory: master.is_mandatory,
                    custom_name: doc.name || "",
                    doc_no: doc.doc_no || "",
                    doc_date: doc.doc_date || "",
                    remarks: doc.remarks || "",
                    file: {
                        name: doc.file.split("/").pop(),
                        url: doc.file,
                        isExisting: true,
                    },
                };
            })
            .filter(Boolean);

        handleCubeTestChange(index, "selected_items", mergedItems);
    };
    useEffect(() => {
        if (tabIndex === 0 && soilData.turbine)
            autoBindAttachments(
                soilData.turbine,
                "SOIL",
                soilData.selected_items,
                handleSoilDataChange,
            );

        if (tabIndex === 1 && excavationData.turbine)
            autoBindAttachments(
                excavationData.turbine,
                "EXC",
                excavationData.selected_items,
                handleExcavationChange,
            );

        if (tabIndex === 2 && pccData.turbine)
            autoBindAttachments(
                pccData.turbine,
                "PCC",
                pccData.selected_items,
                handlePccChange,
            );

        if (tabIndex === 3 && conduitData.turbine)
            autoBindAttachments(
                conduitData.turbine,
                "CONDUIT",
                conduitData.selected_items,
                handleConduitChange,
            );

        if (tabIndex === 4 && anchorCageData.turbine)
            autoBindAttachments(
                anchorCageData.turbine,
                "ANCHOR",
                anchorCageData.selected_items,
                handleAnchorChange,
            );

        if (tabIndex === 5 && reinforcementData.turbine)
            autoBindAttachments(
                reinforcementData.turbine,
                "REINF",
                reinforcementData.selected_items,
                handleReinforcementChange,
            );

        if (tabIndex === 6 && foundationCastingData.turbine)
            autoBindAttachments(
                foundationCastingData.turbine,
                "CAST",
                foundationCastingData.selected_items,
                handleFcChange,
            );

        if (tabIndex === 7 && pouringCardData.turbine)
            autoBindAttachments(
                pouringCardData.turbine,
                "POUR",
                pouringCardData.selected_items,
                handlePouringCardChange,
            );

        if (tabIndex === 7 && subTabIndex === 3) {
            cubeTestData.forEach((row, index) => {
                autoBindCubeAttachments(row, index, handleCubeTestChange);
            });
        }
    }, [
        tabIndex,
        subTabIndex,
        soilData.turbine,
        excavationData.turbine,
        pccData.turbine,
        conduitData.turbine,
        anchorCageData.turbine,
        reinforcementData.turbine,
        foundationCastingData.turbine,
        pouringCardData.turbine,
        cubeTestData.map((r) => r.turbine).join(","),

        documentList,
        attachmentList,
        autoBindAttachments,
    ]);

    // /* ================= kpi validation ================= */
    // const kpiStatus = useMemo(() => {
    //   const turbineId =
    //     soilData.turbine ||
    //     excavationData.turbine ||
    //     pouringCardData?.turbine ||
    //     anchorCageData.turbine ||
    //     foundationCastingData.turbine ||
    //     reinforcementData.turbine;
    //   if (!turbineId || !kpiList) return {};

    //   // Helper: Find KPI config from your DB list by field name
    //   const getKpiConfig = (field) => kpiList.find((k) => k.field_name === field);

    //   // Helper: Calculate actuals (History + Current Input)
    //   const calculateActual = (rows, field, currentVal, type = "sum") => {
    //     const history =
    //       rows?.filter((r) => Number(r.turbine) === Number(turbineId)) || [];
    //     // const pastTotal = history.reduce((acc, r) => acc + parseFloat(r[field] || 0), 0);
    //     const current = parseFloat(currentVal || 0);

    //     if (type === "max") {
    //       return Math.max(
    //         ...history.map((r) => parseFloat(r[field] || 0)),
    //         current,
    //         0,
    //       );
    //     }

    //     if (type === "min" || type === "current") {
    //       return current;
    //     }

    //     const pastTotal = history.reduce(
    //       (acc, r) => acc + parseFloat(r[field] || 0),
    //       0,
    //     );
    //     return pastTotal + current;
    //   };

    //   // Define every KPI based on your table
    //   const fieldsToTrack = [
    //     {
    //       id: "exc_vol",
    //       field: "volume_m3",
    //       state: excavationData.volume_m3,
    //       rows: excavationRows,
    //       type: "sum",
    //     },
    //     {
    //       id: "exc_depth",
    //       field: "depth_meters",
    //       state: excavationData.depth_meters,
    //       rows: excavationRows,
    //       type: "max",
    //     },
    //     {
    //       id: "soil_sbc",
    //       field: "soil_bearing_capacity",
    //       state: soilData.soil_bearing_capacity,
    //       rows: soilRows,
    //       type: "max",
    //     },
    //     {
    //       id: "soil_water_t_depth",
    //       field: "water_table_depth",
    //       state: soilData.water_table_depth,
    //       rows: soilRows,
    //       type: "max",
    //     },
    //     {
    //       id: "reinf_qty",
    //       field: "quantity_reinforcement",
    //       state: reinforcementData.quantity_reinforcement,
    //       rows: reinforcementRows,
    //       type: "sum",
    //     },
    //     {
    //       id: "pour_qty",
    //       field: "quantity_delivered",
    //       state: pouringCardData.quantity_delivered,
    //       rows: pouringCardRows,
    //       type: "current",
    //     },
    //     {
    //       id: "anchor_torque",
    //       field: "torquing",
    //       state: anchorCageData.torquing,
    //       rows: anchorCageRows,
    //       type: "min",
    //     },
    //     {
    //       id: "found_vol",
    //       field: "foundation_volume",
    //       state: foundationCastingData.foundation_volume,
    //       rows: foundationCastingRows,
    //       type: "sum",
    //     },
    //     // {
    //     //   id: "quantity_deliv",
    //     //   field: "quantity_delivered",
    //     //   state: soilData.quantity_delivered,
    //     //   rows: soilRows,
    //     //   type: "max",
    //     // },
    //     // { id: 't1_torque', field: 'torque_value', state: anchorCageData.torquing, rows: anchorCageRows, type: 'min' },
    //     // { id: 'tower_torque', field: 'torque_value', state: anchorCageData.torquing, rows: anchorCageRows, type: 'min' },
    //     // { id: 'nacelle_torque', field: 'torque_value', state: anchorCageData.torquing, rows: anchorCageRows, type: 'min' },
    //     // { id: 'rotor_torque', field: 'torque_value', state: anchorCageData.torquing, rows: anchorCageRows, type: 'min' },
    //     // { id: 'blade_torque', field: 'torque_value', state: anchorCageData.torquing, rows: anchorCageRows, type: 'min' },
    //   ];

    //   const results = {};
    //   fieldsToTrack.forEach((item) => {
    //     const config = getKpiConfig(item.field);
    //     if (config) {
    //       const actual = calculateActual(
    //         item.rows,
    //         item.field,
    //         item.state,
    //         item.type,
    //       );
    //       const isMinViolated =
    //         parseFloat(config.min_value) > 0 &&
    //         actual < parseFloat(config.min_value);
    //       const isMaxViolated =
    //         parseFloat(config.max_value) > 0 &&
    //         actual > parseFloat(config.max_value);

    //       results[item.field] = {
    //         actual,
    //         min: config.min_value,
    //         max: config.max_value,
    //         msg: config.msg,
    //         isError: isMinViolated || isMaxViolated,
    //         label: item.id,
    //       };
    //     }
    //   });

    //   return results;
    // }, [
    //   kpiList,
    //   // filters?.project,
    //   excavationData,
    //   soilData,
    //   reinforcementData,
    //   pouringCardData,
    //   anchorCageData,
    //   foundationCastingData,
    //   excavationRows,
    //   soilRows,
    //   reinforcementRows,
    //   pouringCardRows,
    //   anchorCageRows,
    //   foundationCastingRows,
    // ]);

    // // kpi validator
    // const validateKpi = (fieldName) => {
    //   const status = kpiStatus[fieldName];
    //   if (status && status.isError) {
    //     showSnackbar(`${status.msg} (Current: ${status.actual})`, "error");
    //     return false;
    //   }
    //   return true;
    // };

    /* ================= handle submitt ================= */
    // const toFormData = (data) => {
    //   const fd = new FormData();

    //   Object.entries(data).forEach(([key, value]) => {
    //     if (value !== null && value !== undefined) {
    //       fd.append(key, value);
    //     }
    //   });
    //   return fd;
    // };

    const sanitizeFiles = (data) => {
        return {
            ...data,
            evidence_photo: data.evidence_photo instanceof File ? data.evidence_photo : null,

            selected_items: (data.selected_items || []).map((item) => ({
                ...item,
                file: item.file instanceof File || item.file instanceof Blob ?
                    item.file :
                    null,
            })),
        };
    };

    /* ================= handle submitt ================= */
    // const toFormData = (data) => {
    //   const fd = new FormData();

    //   Object.entries(data).forEach(([key, value]) => {
    //     if (value !== null && value !== undefined) {
    //       fd.append(key, value);
    //     }
    //   });
    //   return fd;
    // };

    // const toFormData = (data) => {
    //   const fd = new FormData();

    //   Object.entries(data).forEach(([key, value]) => {
    //     if (value === null || value === undefined) return;

    //     if (Array.isArray(value) || typeof value === "object") {
    //       fd.append(key, JSON.stringify(value));
    //     } else {
    //       fd.append(key, value);
    //     }
    //   });

    //   return fd;
    // };

    const toFormData = (data) => {
        const fd = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === undefined) return;

            // ✅ FILE FIRST (MOST IMPORTANT RULE)
            if (value instanceof File || value instanceof Blob) {
                fd.append(key, value);
                return;
            }

            // ❌ NEVER stringify File-like objects
            if (typeof value === "object") {
                fd.append(key, JSON.stringify(value));
                return;
            }

            fd.append(key, value);
        });

        return fd;
    };

    const hasMissingMandatoryDocs = (currentFormData) => {
        const selectedItems = currentFormData ? .selected_items || [];
        return selectedItems.some((doc) => doc.is_mandatory && !doc.file);
    };

    const hasMissingJointReport = (currentFormData) => {
        const statusField = Object.keys(currentFormData).find((key) =>
            key.endsWith("_status"),
        );

        const status = currentFormData ? .[statusField];

        // Not required unless status is Completed
        if (status ? .toLowerCase() !== "completed") {
            return false;
        }

        const selectedItems = currentFormData ? .selected_items || [];

        return !selectedItems.some(
            (doc) =>
            doc.file_type_label === "Jointly Signed Approval Report" &&
            (doc.file || doc.url),
        );
    };

    const hasIncompleteDocuments = (currentFormData) => {
        const selectedItems = currentFormData ? .selected_items || [];

        return selectedItems.some((doc) => {
            // Existing uploaded documents are okay
            if (doc.isExisting || doc.url) {
                return false;
            }

            // New file selected but metadata missing
            if (doc.file) {
                return !doc.custom_name || !doc.doc_no || !doc.doc_date;
            }

            return false;
        });
    };

    const handleSubmitSoil = useCallback(async () => {
        if (hasMissingMandatoryDocs(soilData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }

        if (hasMissingJointReport(soilData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }

        if (hasIncompleteDocuments(soilData)) {
            showSnackbar(
                "Please fill document name, document number and document date for all uploaded documents.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = soilTurbines.find(
                (t) => Number(t.id) === Number(soilData.turbine),
            );
            // 1. Combine form data with hierarchy filters
            // const finalData = {
            //   ...soilData,
            //  project: filters.project,
            //  windfarm: filters.windfarm,
            //  cluster: selectedTurbine?.cluster || null,
            // };

            const finalData = sanitizeFiles({
                ...soilData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            });

            const formData = toFormData(finalData);

            if (editId) {
                await dispatch(updateSoilEvaluation(editId, formData));
                showSnackbar("Soil report updated successfully", "success");
            } else {
                await dispatch(createSoilEvaluation(formData));
                await uploadAttachments(
                    soilData,
                    soilData.soil_status,
                    selectedTurbine,
                );
                setSubmittedFoundationTabs((prev) => ({ ...prev,
                    0: true
                }));
                showSnackbar("Soil report submitted successfully", "success");
            }

            setSoilData(initialSoilData);
            setEditId(null);
        } catch (errorMsg) {
            showSnackbar(errorMsg || "Soil report submission failed", "error");
        }
    }, [
        soilData,
        soilTurbines,
        editId,
        uploadAttachments,
        dispatch,
        showSnackbar,
        initialSoilData,
    ]);

    const handleSubmitExcavation = useCallback(async () => {
        // if (!validateKpi("volume_m3") || !validateKpi("depth_meters")) return;

        if (!excavationData.inspector) {
            showSnackbar(
                "Please select a Civil Engineer before submitting.",
                "error",
            );
            return; // Terminate execution early
        }

        if (!excavationData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory evidence photo before submitting.",
                "error",
            );
            return; // Terminate execution early
        }

        //   NEW: Mandatory document validation
        if (hasMissingMandatoryDocs(excavationData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }
        if (hasMissingJointReport(excavationData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }

        if (hasIncompleteDocuments(excavationData)) {
            showSnackbar(
                "Please fill document name, document number and document date for all uploaded documents.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = excavationTurbines.find(
                (t) => Number(t.id) === Number(excavationData.turbine),
            );

            const finalData = sanitizeFiles({
                ...excavationData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            });
            if (editId) {
                await dispatch(updateExcavation(editId, toFormData(finalData)));
                showSnackbar("Excavation updated successfully", "success");
            } else {
                await dispatch(postExcavation(toFormData(finalData)));
                await uploadAttachments(
                    excavationData,
                    excavationData.excavation_status,
                    selectedTurbine,
                );
                setSubmittedFoundationTabs((prev) => ({ ...prev,
                    1: true
                }));
                showSnackbar("Excavation submitted successfully", "success");
            }

            setExcavationData(initialExcavationData);
        } catch (error) {
            const errorMsg =
                typeof error === "string" ?
                error :
                parseErrorMessage(error.response ? .data);

            showSnackbar(errorMsg, "error");
        }
        // const errorMsg = parseErrorMessage(error.response?.data);
        //       showSnackbar(errorMsg, "error");
    }, [
        editId,
        // kpiStatus,
        excavationData,
        excavationTurbines,
        uploadAttachments,
        dispatch,
        filters,
        showSnackbar,
    ]);

    const handleSubmitPCC = useCallback(async () => {
        if (!pccData.inspector) {
            showSnackbar(
                "Please select a Civil Engineer before submitting.",
                "error",
            );
            return;
        }

        if (!pccData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory PCC evidence photo before submitting.",
                "error",
            );
            return;
        }
        if (hasMissingMandatoryDocs(pccData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }
        if (hasMissingJointReport(pccData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = pccTurbines.find(
                (t) => Number(t.id) === Number(pccData.turbine),
            );
            const finalData = sanitizeFiles({
                ...pccData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
                // turbine: pccData.turbine,
            });

            if (editId) {
                await dispatch(updatePCCLayer(editId, toFormData(finalData)));
            } else {
                await dispatch(postPCCLayer(toFormData(finalData)));
                await uploadAttachments(pccData, pccData.pcc_status, selectedTurbine);
            }

            setSubmittedFoundationTabs((prev) => ({ ...prev,
                2: true
            }));
            showSnackbar("PCC layer data submitted successfully", "success");
            setPccData(initialPccData);
        } catch (err) {
            // This catches the backend "required" error if the frontend check fails
            const errorMsg = parseErrorMessage(err.response ? .data);
            showSnackbar(errorMsg, "error");
        }
    }, [editId, pccData, pccTurbines, uploadAttachments, dispatch, showSnackbar]);

    const handleSubmitConduit = useCallback(async () => {
        if (!conduitData.inspector) {
            showSnackbar(
                "Please select a Civil Engineer before submitting.",
                "error",
            );
            return;
        }
        if (!conduitData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory evidence photo before submitting.",
                "error",
            );
            return;
        }

        if (hasMissingMandatoryDocs(conduitData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }

        if (hasMissingJointReport(conduitData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = conduitTurbines.find(
                (t) => Number(t.id) === Number(conduitData.turbine),
            );

            const finalData = sanitizeFiles({
                ...conduitData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            });
            if (editId) {
                await dispatch(updateConductLaying(editId, toFormData(finalData)));
            } else {
                await dispatch(postConductLaying(toFormData(finalData)));
                await uploadAttachments(
                    conduitData,
                    conduitData.conduct_status,
                    selectedTurbine,
                );
            }

            setSubmittedFoundationTabs((prev) => ({ ...prev,
                3: true
            }));
            showSnackbar("Conduit Laying data submitted successfully", "success");
            setConduitData(initialConduitData);
        } catch (err) {
            const errorMsg = parseErrorMessage(err.response ? .data);
            showSnackbar(errorMsg, "error");
            // showSnackbar(errorMsg || 'Conduit Laying submission failed', 'error');
        }
    }, [
        editId,
        conduitData,
        conduitTurbines,
        uploadAttachments,
        dispatch,
        showSnackbar,
    ]);

    const handleSubmitAnchor = useCallback(async () => {
        // if (!validateKpi("torquing")) return;

        if (!anchorCageData.anchor_sr_no ||
            !anchorCageData.torquing_sr_no ||
            !anchorCageData.bolt_batch ||
            !anchorCageData.inspector
        ) {
            showSnackbar("Please fill all mandatory fields.", "error");
            return;
        }

        if (!anchorCageData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory evidence photo before submitting.",
                "error",
            );
            return; // Terminate execution early
        }

        if (hasMissingMandatoryDocs(anchorCageData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }
        if (hasMissingJointReport(anchorCageData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = anchorTurbines.find(
                (t) => Number(t.id) === Number(anchorCageData.turbine),
            );

            const finalData = sanitizeFiles({
                ...anchorCageData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            });

            if (editId) {
                await dispatch(updateAnchorCage(editId, toFormData(finalData)));
            } else {
                await dispatch(postAnchorCage(toFormData(finalData)));
                await uploadAttachments(
                    anchorCageData,
                    anchorCageData.anchor_status,
                    selectedTurbine,
                );
            }

            setSubmittedFoundationTabs((prev) => ({ ...prev,
                4: true
            }));
            showSnackbar("Anchor cage data submitted successfully", "success");

            setAnchorCageData(initialAnchorCageData);
        } catch (errorMsg) {
            showSnackbar(errorMsg || "Anchor Cage submission failed", "error");
        }
    }, [
        editId,
        anchorCageData,
        anchorTurbines,
        uploadAttachments,
        dispatch,

        showSnackbar,
    ]);

    const handleSubmitReinForce = useCallback(async () => {
        // if (!validateKpi("quantity_reinforcement")) return;

        if (!reinforcementData.inspector) {
            showSnackbar(
                "Please select a Civil Engineer before submitting.",
                "error",
            );
            return; // Terminate execution early
        }

        if (!reinforcementData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory  evidence photo before submitting.",
                "error",
            );
            return; // Terminate execution early
        }

        if (hasMissingMandatoryDocs(reinforcementData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }
        if (hasMissingJointReport(reinforcementData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = reinforcementTurbines.find(
                (t) => Number(t.id) === Number(reinforcementData.turbine),
            );

            const finalData = sanitizeFiles({
                ...reinforcementData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            });

            if (editId) {
                await dispatch(updateReinforcement(editId, toFormData(finalData)));
            } else {
                await dispatch(postReinforcement(toFormData(finalData)));
                await uploadAttachments(
                    reinforcementData,
                    reinforcementData.reinforcement_status,
                    selectedTurbine,
                );
            }

            setSubmittedFoundationTabs((prev) => ({ ...prev,
                5: true
            }));
            showSnackbar("Reinforcement data submitted successfully", "success");
            setReinforcementData(initialReinforcementData);
        } catch (errorMsg) {
            showSnackbar(errorMsg || "Reinforcement submission failed", "error");
        }
    }, [
        editId,
        reinforcementData,
        reinforcementTurbines,
        uploadAttachments,
        dispatch,
        // validateKpi,
        showSnackbar,
    ]);

    const handleSubmitFounCast = useCallback(async () => {
        // if (!validateKpi("foundation_volume")) return;
        if (!foundationCastingData.temp ||
            !foundationCastingData.rmc_supplier_name ||
            !foundationCastingData.inspector
        ) {
            showSnackbar("Please fill all mandatory fields.", "error");
            return;
        }

        if (!foundationCastingData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory  evidence photo before submitting.",
                "error",
            );
            return;
        }

        if (hasMissingMandatoryDocs(foundationCastingData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }
        if (hasMissingJointReport(foundationCastingData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = castTurbines.find(
                (t) => Number(t.id) === Number(foundationCastingData.turbine),
            );

            const finalData = sanitizeFiles({
                ...foundationCastingData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            });
            if (editId) {
                await dispatch(updateFoundation(editId, toFormData(finalData)));
            } else {
                await dispatch(postFoundation(toFormData(finalData)));
                await uploadAttachments(
                    foundationCastingData,
                    foundationCastingData.foundation_status,
                    selectedTurbine,
                );
            }

            setSubmittedFoundationTabs((prev) => ({ ...prev,
                6: true
            }));
            showSnackbar("Casting data submitted successfully", "success");
            setFoundationCastingData(initialFoundationCastingData);
        } catch (errorMsg) {
            showSnackbar(errorMsg || "Foundation Casting submission failed", "error");
        }
    }, [
        editId,
        foundationCastingData,
        castTurbines,
        uploadAttachments,

        dispatch,
        showSnackbar,
    ]);

    const handleSubmitPouring = async () => {
        setLoading(true);
        if (!pouringCardData.tm_no ||
            !pouringCardData.quantity_delivered ||
            !pouringCardData.cone_test ||
            !pouringCardData.batch_serial_number ||
            !pouringCardData.action_taken ||
            !pouringCardData.inspector
        ) {
            showSnackbar("Please fill all mandatory fields.", "error");
            return;
        }
        const {
            time_left_plant,
            time_arrived_site,
            pouring_start_time,
            pouring_end_time,
        } = pouringCardData;

        if (
            time_left_plant &&
            time_arrived_site &&
            time_arrived_site <= time_left_plant
        ) {
            showSnackbar(
                "Timeline Error: Arrival time cannot be before plant departure time!",
                "error",
            );
            setLoading(false);
            return;
        }

        if (
            time_arrived_site &&
            pouring_start_time &&
            pouring_start_time <= time_arrived_site
        ) {
            showSnackbar(
                "Timeline Error: Pouring cannot start before arriving at site!",
                "error",
            );
            setLoading(false);
            return;
        }

        if (
            pouring_start_time &&
            pouring_end_time &&
            pouring_end_time <= pouring_start_time
        ) {
            showSnackbar(
                "Timeline Error: Pouring cannot end before it starts!",
                "error",
            );
            setLoading(false);
            return;
        }

        if (!pouringCardData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory  evidence photo before submitting.",
                "error",
            );
            return;
        }

        if (hasMissingMandatoryDocs(pouringCardData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }
        if (hasMissingJointReport(pouringCardData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = pourTurbines.find(
                (t) => Number(t.id) === Number(pouringCardData.turbine),
            );

            const finalSampleDate =
                pouringCardData.sample_date ||
                (pouringCardData.pouring_start_time ?
                    pouringCardData.pouring_start_time.split("T")[0] :
                    "");

            const cubeFields = [
                "sample_id",
                "no_of_cubes",
                "sample_date",
                "cubePhotos",
                "is_cube_taken",
            ];
            const finalData = sanitizeFiles({
                ...pouringCardData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            });

            const pouringFormData = new FormData();

            // 3. Loop through and only add NON-CUBE fields to the Pouring request
            Object.entries(finalData).forEach(([key, value]) => {
                if (!cubeFields.includes(key) && value !== null && value !== "") {
                    pouringFormData.append(key, value);
                }
            });

            // 4. Dispatch and WAIT for the response
            const response = await dispatch(PostPouringCard(pouringFormData));

            // Extract ID (Using the log you shared, it's directly on the response)
            const newPouringId = response ? .id;

            if (!newPouringId) {
                throw new Error("Could not retrieve Pouring Card ID from server.");
            }

            await uploadAttachments(
                pouringCardData,
                pouringCardData.pouring_status,
                selectedTurbine,
            );

            // 5. If Cube checkbox is checked, submit the second record
            if (pouringCardData.is_cube_taken) {
                const cubeFormData = new FormData();

                // Link the IDs
                cubeFormData.append("pouring_card", newPouringId);
                cubeFormData.append("project", filters.project);
                cubeFormData.append("windfarm", filters.windfarm);
                cubeFormData.append("cluster", selectedTurbine ? .cluster);
                cubeFormData.append("turbine", pouringCardData.turbine);

                // Add Cube specifics
                cubeFormData.append("sample_id", pouringCardData.sample_id || "");
                cubeFormData.append("no_of_cubes", pouringCardData.no_of_cubes || "");
                cubeFormData.append("sample_date", finalSampleDate);
                // cubeFormData.append("sample_date", pouringCardData.sample_date || "");

                // Handle Multiple Cube Photos
                if (
                    pouringCardData.cubePhotos &&
                    pouringCardData.cubePhotos.length > 0
                ) {
                    pouringCardData.cubePhotos.forEach((file) => {
                        cubeFormData.append("cube_photos", file);
                    });
                }
                await dispatch(PostCubeSample(cubeFormData));
            }
            const successMsg = pouringCardData.is_cube_taken ?
                "Pouring Card & Cube Sample saved successfully!" :
                "Pouring Card saved successfully!";

            showSnackbar(successMsg, "success");

            setPouringCardData(initialPouringCardData);
            // dispatch(GetPouringCards());
            // dispatch(GetCubeSamples());
        } catch (error) {
            const errorMessage = error.response ? .data ?
                JSON.stringify(error.response.data) :
                error.message || "Save failed.";
            showSnackbar(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitDeshuttering = useCallback(async () => {
        if (!deshutter.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory  evidence photo before submitting.",
                "error",
            );
            return;
        }

        try {
            const selectedTurbine = deshutterTurbines.find(
                (t) => Number(t.id) === Number(deshutter.turbine),
            );
            const finalData = sanitizeFiles({
                ...deshutter,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            });

            const formData = new FormData();

            // 1. Append main fields (Turbine, Date, etc.)
            Object.entries(finalData).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    formData.append(key, value);
                }
            });

            // 2. Prepare Defects Metadata
            const defectsMetadata = defects.map((defect, index) => {
                if (defect.def_photo instanceof File) {
                    // Append the actual file with a unique reference key
                    formData.append(`file_at_index_${index}`, defect.def_photo);
                }
                return {
                    defect_location: defect.defect_location || "",
                    defect_description: defect.defect_description || "",
                    action_taken: defect.action_taken || "",
                    file_key: defect.def_photo ? `file_at_index_${index}` : null,
                };
            });

            // 3. Append the list as ONE string
            formData.append("defects_list_json", JSON.stringify(defectsMetadata));

            await dispatch(postDeshuttering(formData));
            showSnackbar("Deshuttering submitted successfully", "success");
            // reset form
            setDeshutter(initialDeshutteringData);
            setDefects([{ ...initialDefectData
            }]);
        } catch (err) {
            const errorMsg = parseErrorMessage(err.response ? .data);

            showSnackbar(errorMsg, "error");
            // showSnackbar(errorMsg || "Deshuttering submission failed", "error");
        }
    }, [deshutter, defects, deshutterTurbines, dispatch, showSnackbar]);

    // reset form
    // setDeshutter(initialDeshutteringData);
    // setDefects([{ ...initialDefectData }]);
    const handleSubmitWatering = useCallback(async () => {
        if (!wateringData.watering_image) {
            showSnackbar("Photo is mandatory for submitting watering log", "error");
            return;
        }
        try {
            const selectedTurbine = waterCuringTurbines.find(
                (t) => Number(t.id) === Number(wateringData.turbine),
            );

            const finalData = sanitizeFiles({
                ...wateringData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            });
            await dispatch(PostWateringSchedule(toFormData(finalData)));
            setSubmittedFoundationTabs((prev) => ({ ...prev,
                2: true
            }));
            showSnackbar("Watering Schedule submitted successfully", "success");
            setWateringData(initialWateringData);
        } catch (err) {
            const errorMsg = parseErrorMessage(err.response ? .data);
            showSnackbar(errorMsg, "error");
        }
    }, [wateringData, waterCuringTurbines, dispatch, showSnackbar]);

    const handleSubmitCubeResult = useCallback(async () => {
        if (submittingRef.current) return;

        //  submittingRef.current = true;
        if (!cubeTestData[0] ? .evidence_photo) {
            showSnackbar(
                "Please upload a mandatory  evidence photo before submitting.",
                "error",
            );
            return; // Terminate execution early
        }
        // ✅ Validation
        if (!cubeTestData.length) {
            showSnackbar("No data to submit", "error");
            return;
        }

        if (!cubeTestData.every((t) => t.cube_id && t.no_of_days_test)) {
            showSnackbar("Please fill all required fields", "error");
            return;
        }

        if (cubeTestData.some(hasMissingMandatoryDocs)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }

        if (cubeTestData.some(hasMissingJointReport)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }

        submittingRef.current = true;

        try {
            const selectedTurbine = cubeResultTurbines.find(
                (t) => Number(t.id) === Number(cubeTestData ? .[0] ? .turbine),
            );

            const updatedCubeData = [];

            for (const row of cubeTestData) {
                const attachmentIds = [];

                if (row.selected_items ? .length) {
                    for (const item of row.selected_items) {
                        if (!item.file ||
                            item.file.isExisting ||
                            !(item.file instanceof File || item.file instanceof Blob)
                        ) {
                            continue;
                        }

                        if (!item.custom_name || !item.doc_no || !item.doc_date) {
                            showSnackbar(
                                "Please fill document name, document number and document date for all attachments.",
                                "error",
                            );

                            //  submittingRef.current = false;
                            return;
                        }

                        const fd = new FormData();

                        fd.append("project", filters.project);
                        fd.append("windfarm", filters.windfarm);
                        fd.append("cluster", selectedTurbine ? .cluster || "");
                        fd.append("turbine", row.turbine);
                        fd.append("attachment_master", item.masterId);
                        fd.append("file", item.file);
                        fd.append("name", item.custom_name || "");
                        fd.append("doc_no", item.doc_no || "");
                        fd.append("doc_date", item.doc_date || "");
                        fd.append("remarks", item.remarks || "");
                        fd.append("is_deleted", "false");
                        fd.append("is_active", "true");
                        fd.append("activity_status", row.cr_status);

                        const response = await dispatch(CreateDocumentUpload(fd));
                        // console.log('response', response);
                        // Change this according to your action response
                        const attachmentId =
                            response ? .payload ? .data ? .id ? ?
                            response ? .payload ? .id ? ?
                            response ? .data ? .id ? ?
                            response ? .id;

                        if (attachmentId) {
                            attachmentIds.push(attachmentId);
                        }
                    }
                }

                updatedCubeData.push({
                    ...row,
                    attachment: attachmentIds || [],
                    project: filters.project,
                    windfarm: filters.windfarm,
                    cluster: selectedTurbine ? .cluster,
                });
            }
            const formData = new FormData();

            updatedCubeData.forEach((row, index) => {
                Object.entries(row).forEach(([key, value]) => {
                    if (value == null || value === "") return;

                    if (key === "selected_items") return;

                    if (key === "attachment") {
                        formData.append(`${index}[attachment]`, JSON.stringify(value));
                    } else if (key === "evidence_photo" && value instanceof File) {
                        formData.append(`${index}[evidence_photo]`, value);
                    } else {
                        formData.append(`${index}[${key}]`, value);
                    }
                });
            });

            await dispatch(PostCubeTestResult(formData));

            showSnackbar("Cube test results submitted successfully", "success");

            resetCubeResultForm();

            // Tell child to reset
            setResetCubeSelection(true);
        } catch (error) {
            const errorMsg = parseErrorMessage(error.response ? .data);
            showSnackbar(errorMsg, "error");
        } finally {
            submittingRef.current = false;
        }
    }, [
        cubeTestData,
        cubeResultTurbines,
        filters,
        dispatch,
        uploadAttachments,
        resetCubeResultForm,
        showSnackbar,
    ]);

    const handleSubmitBackfilling = useCallback(async () => {
        if (!backfillingData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory  evidence photo before submitting.",
                "error",
            );
            return; // Terminate execution early
        }

        if (hasMissingMandatoryDocs(backfillingData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }
        if (hasMissingJointReport(backfillingData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = backfillTurbines.find(
                (t) => Number(t.id) === Number(backfillingData.turbine),
            );
            const finalData = sanitizeFiles({
                ...backfillingData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            });

            await dispatch(postBackfilling(toFormData(finalData)));

            await uploadAttachments(
                backfillingData,
                backfillingData.backfill_status,
                selectedTurbine,
            );

            // setSubmittedFoundationTabs((prev) => ({
            //   ...prev,
            //   4: true   // change index according to your tab order
            // }));

            showSnackbar("Backfilling submitted successfully", "success");

            setBackfillingData(initialBackfillingData);
        } catch (err) {
            const errorMsg = parseErrorMessage(err.response ? .data);
            showSnackbar(errorMsg, "error");
        }
    }, [
        backfillingData,
        // filters,
        uploadAttachments,
        backfillTurbines,
        dispatch,
        setBackfillingData,
        showSnackbar,
    ]);

    return ( <
        Box sx = {
            {
                width: "100%",
                mt: -2.5
            }
        } >
        <
        Box >
        <
        Tabs value = {
            tabIndex
        }
        onChange = {
            (e, v) => setTabIndex(v)
        }
        variant = "scrollable"
        scrollButtons = "auto"
        // TabIndicatorProps={{
        //   sx: {
        //     height: 3,
        //     borderRadius: 2,
        //     backgroundColor: "primary.main",
        //   },
        // }}
        TabIndicatorProps = {
            {
                sx: {
                    height: 0
                }
            }
        }
        sx = {
            {
                "& .MuiTabs-flexContainer": {
                    gap: 1,
                    justifyContent: "center"
                },
            }
        } >
        {
            FOUNDATION_TABS.map((label, index) => ( <
                Tab key = {
                    index
                }
                label = {
                    label
                }
                disableRipple sx = {
                    {
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 8,
                        border: "2px solid",
                        borderColor: index === tabIndex ? "#3b82f6" : "#3954b7ff",
                        color: index === tabIndex ? "#3b82f6" : "#f34500ff",
                        transition: "all 0.3s ease",
                        "&.Mui-selected": {
                            transform: "translateY(-1px)"
                        },
                    }
                }
                />
            ))
        } <
        /Tabs> <
        /Box>

        { /* Inside FoundationTabs.js */ } {
            /* <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, mb: 2 }}>
                    {Object.keys(kpiStatus).map((key) => {
                      const item = kpiStatus[key];
                      return (
                        <Paper key={key} sx={{ p: 1.5, minWidth: 180, borderLeft: `4px solid ${item.isError ? '#d32f2f' : '#2e7d32'}` }}>
                          <Typography variant="caption" fontWeight="bold" color="textSecondary">
                            {key.replace('_', ' ').toUpperCase()}
                          </Typography>
                          <Typography variant="h6">
                            {item.actual}
                            <span style={{ fontSize: '12px', color: '#666' }}> / {item.max}</span>
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min((item.actual / item.max) * 100, 100)}
                            color={item.isError ? "error" : "success"}
                            sx={{ mt: 1, height: 6, borderRadius: 5 }}
                          />
                        </Paper>
                      );
                    })}
                  </Box> */
        }

        <
        Box sx = {
            {
                pt: 3
            }
        } >
        <
        > {
            tabIndex === 0 && ( <
                SoilReport
                // loading={foundationLoading}
                filters = {
                    filters
                }
                // attachmentMasterList={attachmentList}
                formData = {
                    soilData
                }
                onChange = {
                    handleSoilDataChange
                }
                onSubmitSoil = {
                    (data) => {
                        handleSubmitSoil(data);
                        setIsAcknowledged(false);
                    }
                }
                // kpiStatus={kpiStatus}
                kpiList = {
                    kpiList
                }
                showSnackbar = {
                    showSnackbar
                }
                viewer = {
                    viewer
                }
                buildColumns = {
                    buildColumns
                }
                submittedTabs = {
                    submittedFoundationTabs
                }
                turbines = {
                    soilTurbines
                }
                // SoliColumnData={soilColumns}
                // RowsColumnData={soilRows}
                delayCauses = {
                    componentTypesList
                }
                // getActivePlan={getActivePlan}
                onDelaySubmit = {
                    handleDelaySubmit
                }
                onEdit = {
                    handleEditSoil
                }
                editId = {
                    editId
                }
                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                />
            )
        }

        {
            tabIndex === 1 && ( <
                ExcavationForm filters = {
                    filters
                }
                // loading={foundationLoading}
                // attachmentMasterList={attachmentList}
                documentList = {
                    documentList
                }
                formData = {
                    excavationData
                }
                onExcChange = {
                    handleExcavationChange
                }
                onSubmitExcavation = {
                    (data) => {
                        handleSubmitExcavation(data);
                        setIsAcknowledged(false);
                    }
                }
                turbines = {
                    excavationTurbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }
                // excavationColumns={excavationColumns}
                // rowsExcavationData={excavationRows}
                onEditExcavation = {
                    handleEditExcavation
                }
                viewer = {
                    viewer
                }
                buildColumns = {
                    buildColumns
                }
                editId = {
                    editId
                }
                // kpiStatus={kpiStatus}
                kpiList = {
                    kpiList
                }
                showSnackbar = {
                    showSnackbar
                }
                submittedTabs = {
                    submittedFoundationTabs
                }
                delayCauses = {
                    componentTypesList
                }
                // getActivePlan={getActivePlan}
                onDelaySubmit = {
                    handleDelaySubmit
                }
                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                />
            )
        }

        {
            tabIndex === 2 && ( <
                PCCForm
                // loading={foundationLoading}
                filters = {
                    filters
                }
                // attachmentMasterList={attachmentList}
                formData = {
                    pccData
                }
                onChange = {
                    handlePccChange
                }
                onSubmitPCC = {
                    (data) => {
                        handleSubmitPCC(data);
                        setIsAcknowledged(false);
                    }
                }
                // kpiStatus={kpiStatus}
                kpiList = {
                    kpiList
                }
                showSnackbar = {
                    showSnackbar
                }
                submittedTabs = {
                    submittedFoundationTabs
                }
                turbines = {
                    pccTurbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }
                // pccColumns={pccColumns}
                // rowsPccData={pccRows}
                viewer = {
                    viewer
                }
                buildColumns = {
                    buildColumns
                }
                onEditPcc = {
                    handleEditPcc
                }
                delayCauses = {
                    componentTypesList
                }
                // getActivePlan={getActivePlan}
                onDelaySubmit = {
                    handleDelaySubmit
                }
                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                />
            )
        }

        {
            tabIndex === 3 && ( <
                ConduitLayingForm
                // loading={foundationLoading}
                filters = {
                    filters
                }
                // attachmentMasterList={attachmentList}
                formData = {
                    conduitData
                }
                onChange = {
                    handleConduitChange
                }
                onSubmitConduit = {
                    (data) => {
                        handleSubmitConduit(data);
                        setIsAcknowledged(false);
                    }
                }
                // kpiStatus={kpiStatus}
                kpiList = {
                    kpiList
                }
                showSnackbar = {
                    showSnackbar
                }
                submittedTabs = {
                    submittedFoundationTabs
                }
                turbines = {
                    conduitTurbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }
                viewer = {
                    viewer
                }
                buildColumns = {
                    buildColumns
                }
                // conduitColumns={conduitColumns}
                // rowsConduitData={conduitRows}
                onEditConduit = {
                    handleEditConduit
                }
                delayCauses = {
                    componentTypesList
                }
                // getActivePlan={getActivePlan}
                onDelaySubmit = {
                    handleDelaySubmit
                }
                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                />
            )
        }

        {
            tabIndex === 4 && ( <
                AnchorCageForm
                // loading={foundationLoading}
                filters = {
                    filters
                }
                // attachmentMasterList={attachmentList}
                formData = {
                    anchorCageData
                }
                onChange = {
                    handleAnchorChange
                }
                onSubmitAnchor = {
                    (data) => {
                        handleSubmitAnchor(data);
                        setIsAcknowledged(false);
                    }
                }
                turbines = {
                    anchorTurbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }
                // kpiStatus={kpiStatus}
                kpiList = {
                    kpiList
                }
                showSnackbar = {
                    showSnackbar
                }
                viewer = {
                    viewer
                }
                buildColumns = {
                    buildColumns
                }
                submittedTabs = {
                    submittedFoundationTabs
                }
                // anchorColumns={anchorCageColumns}
                // rowsAnchorData={anchorCageRows}
                onEditAnchor = {
                    handleEditAnchorCage
                }
                delayCauses = {
                    componentTypesList
                }
                // getActivePlan={getActivePlan}
                onDelaySubmit = {
                    handleDelaySubmit
                }
                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                />
            )
        }

        {
            tabIndex === 5 && ( <
                ReinforcementForm
                // loading={foundationLoading}
                filters = {
                    filters
                }
                formData = {
                    reinforcementData
                }
                // attachmentMasterList={attachmentList}
                onChange = {
                    handleReinforcementChange
                }
                onSubmitReinforce = {
                    (data) => {
                        handleSubmitReinForce(data);
                        setIsAcknowledged(false);
                    }
                }
                // kpiStatus={kpiStatus}
                kpiList = {
                    kpiList
                }
                showSnackbar = {
                    showSnackbar
                }
                viewer = {
                    viewer
                }
                buildColumns = {
                    buildColumns
                }
                submittedTabs = {
                    submittedFoundationTabs
                }
                turbines = {
                    reinforcementTurbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }
                // reinfColumns={reinforcementColumns}
                // rowsReinfData={reinforcementRows}
                onEditReinf = {
                    handleEditReinforcement
                }
                delayCauses = {
                    componentTypesList
                }
                // getActivePlan={getActivePlan}
                onDelaySubmit = {
                    handleDelaySubmit
                }
                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                />
            )
        }

        {
            tabIndex === 6 && ( <
                FoundationCasting filters = {
                    filters
                }
                // loading={foundationLoading}
                // attachmentMasterList={attachmentList}
                formData = {
                    foundationCastingData
                }
                onChange = {
                    handleFcChange
                }
                onSubmitFounCast = {
                    (data) => {
                        handleSubmitFounCast(data);
                        setIsAcknowledged(false);
                    }
                }
                // kpiStatus={kpiStatus}
                kpiList = {
                    kpiList
                }
                showSnackbar = {
                    showSnackbar
                }
                viewer = {
                    viewer
                }
                buildColumns = {
                    buildColumns
                }
                submittedTabs = {
                    submittedFoundationTabs
                }
                turbines = {
                    castTurbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }
                supplierData = {
                    vendorData
                }
                // castingColumns={foundationCastingColumns}
                // rowsCastingData={foundationCastingRows}
                delayCauses = {
                    componentTypesList
                }
                // getActivePlan={getActivePlan}
                onDelaySubmit = {
                    handleDelaySubmit
                }
                onEditCasting = {
                    handleEditFoundationCasting
                }
                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                />
            )
        }

        {
            tabIndex === 7 &&
                (() => {
                    let activeSubTabTurbines = pourTurbines;

                    if (subTabIndex === 0) activeSubTabTurbines = pourTurbines;
                    else if (subTabIndex === 1)
                        activeSubTabTurbines = deshutterTurbines;
                    else if (subTabIndex === 2)
                        activeSubTabTurbines = waterCuringTurbines;
                    else if (subTabIndex === 3)
                        activeSubTabTurbines = cubeResultTurbines;
                    else if (subTabIndex === 4)
                        activeSubTabTurbines = backfillTurbines;

                    return ( <
                        PouringAndCubeSampleTab
                        // loading={loading}
                        filters = {
                            filters
                        }
                        // attachmentMasterList={attachmentList}
                        // foundations={foundations}
                        turbines = {
                            activeSubTabTurbines
                        }
                        contractors = {
                            contractors
                        }
                        inspectors = {
                            inspectors
                        }
                        viewer = {
                            viewer
                        }
                        buildColumns = {
                            buildColumns
                        }
                        showSnackbar = {
                            showSnackbar
                        }
                        pouringData = {
                            pouringCardData
                        }
                        onPouringCardChange = {
                            handlePouringCardChange
                        }
                        // onCubeSampleChange={handleCubeSampleChange}
                        onSubmitPouring = {
                            (data) => {
                                handleSubmitPouring(data);
                                setIsAcknowledged(false);
                            }
                        }
                        // onSubmitCubeSample={(data) => {
                        //   onSubmitCubeSample(data);
                        //   setIsAcknowledged(false);
                        // }}
                        wateringData = {
                            wateringData
                        }
                        onWateringChange = {
                            handleWateringChange
                        }
                        onSubmitWatering = {
                            (data) => {
                                handleSubmitWatering(data);
                                setIsAcknowledged(false);
                            }
                        }
                        cubeTestData = {
                            cubeTestData
                        }
                        emptyCubeTest = {
                            emptyCubeTest
                        }
                        setCubeTestData = {
                            setCubeTestData
                        }
                        onCubeTestChange = {
                            handleCubeTestChange
                        }
                        // addCubeTest={addCubeTest}
                        removeCubeTest = {
                            removeCubeTest
                        }
                        onSubmitCubeResult = {
                            (data) => {
                                handleSubmitCubeResult(data);
                                // setIsAcknowledged(false);
                            }
                        }
                        // cubeSamplesGetData={cubeSamples}
                        // rowsPour={pouringCardRows}
                        // columnPour={pouringCardColumns}
                        // columnWatering={wateringColumn}
                        // columnCubeResult={cubeResultColumn}
                        // rowsWater={wateringRows}
                        // rowsCubeResult={cubeTestResultRows}
                        resetCubeSelection = {
                            resetCubeSelection
                        }
                        setResetCubeSelection = {
                            setResetCubeSelection
                        }
                        onPouringEdit = {
                            handleEditPouringCard
                        }
                        isAcknowledged = {
                            isAcknowledged
                        }
                        setIsAcknowledged = {
                            setIsAcknowledged
                        }
                        formData = {
                            deshutter
                        }
                        addDefect = {
                            addDefect
                        }
                        removeDefect = {
                            removeDefect
                        }
                        defects = {
                            defects
                        }
                        // rowsDeshuttering={deshutteringRows}
                        // columnsDeshuttering={deshutteringColumns}
                        onDefectChange = {
                            handleDefectChange
                        }
                        onDeshutteringChange = {
                            handleDeshutteringChange
                        }
                        onSubmitDeshuttering = {
                            (data) => {
                                handleSubmitDeshuttering(data);
                                setIsAcknowledged(false);
                            }
                        }
                        openDefectPopup = {
                            openDefectPopup
                        }
                        selectedDefects = {
                            selectedDefects
                        }
                        setOpenDefectPopup = {
                            setOpenDefectPopup
                        }
                        backfillingData = {
                            backfillingData
                        }
                        onChangeBackfill = {
                            handleBackfillingChange
                        }
                        onSubmitBackfill = {
                            (data) => {
                                handleSubmitBackfilling(data);
                                setIsAcknowledged(false);
                            }
                        }
                        // rowsBackfill={backfillingRows}
                        // columnsBackfill={backfillingColumn}
                        delayCauses = {
                            componentTypesList
                        }
                        // getActivePlan={getActivePlan}
                        onDelaySubmit = {
                            handleDelaySubmit
                        }
                        subTabIndex = {
                            subTabIndex
                        }
                        setSubTabIndex = {
                            setSubTabIndex
                        }
                        // kpiStatus={kpiStatus}
                        kpiList = {
                            kpiList
                        }
                        submittedTabs = {
                            submittedFoundationTabs
                        }
                        />
                    );
                })()
        } <
        /> <
        /Box> <
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
        /Box>
    );
}

export default FoundationTabs;