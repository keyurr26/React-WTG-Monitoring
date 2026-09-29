import {
    Tabs,
    Tab,
    Box,
    Typography
} from "@mui/material";
import {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback
} from "react";
import {
    useSelector,
    useDispatch
} from "react-redux";
// import { getAttachmentsForActivity } from "../utils/documentHelpers";
import {
    useTableViewer
} from "../hooks/useTableViewer";
import {
    useFileUpload
} from "../hooks/useFileUpload";
import DynamicViewer from "../pages/MultipleDocumentUpload/DynamicViewer";
import parseErrorMessage from "../utils/errorFunction";
import Tower1 from "../pages/WTGInstallation/Tower1";
import TowerInstallationForm from "../pages/WTGInstallation/TowerInstallation";
import RotorHubForm from "../pages/WTGInstallation/rotorHub";
import NacelleInstallationForm from "../pages/WTGInstallation/nacelle";
import BladeInstallationForm from "../pages/WTGInstallation/blade";
import {
    getEligibleTurbines
} from "../Redux/TurbineMasterData/turbineAction";
import {
    fetchContractors,
    GetInspectors,
    GetMaterialMasterData,
    GetVendorData,
    GetAttachmentMasterData,
    GetDocumentUploadList,
    GetKPIMasterList,
    GetComponentTypesList,
    GetMaterialIssueData,
    GetMaterialRecivedData,
    getTurbinePlannedDates,
} from "../Redux/MasterData/masterAction";
import {
    postDelayAnalysis
} from "../Redux/InstallationData/FoundationData/foundationAction";
import LocationFilterBar from "./LocationFilterBar";
import {
    createT1InstallationData,
    PostTowerInstallation,
    PostNacelleInstallation,
    PostRotorHubInstallation,
    PostBladeInstallation
} from "../Redux/InstallationData/WtgInstallationData/wtgInstallationAction";
import {
    autoBindAttachments
} from "../pages/MultipleDocumentUpload/autoBindAttachments";
/* ================= SUB TAB CONFIG ================= */
const WTG_INSTALLATION_TABS = [{
        label: "Tower1",
        key: "tower1",
        Component: Tower1
    },
    {
        label: "Tower Installations",
        key: "towers",
        Component: TowerInstallationForm
    },
    {
        label: "Nacelle Installation",
        key: "nacelle",
        Component: NacelleInstallationForm,
    },
    {
        label: "ROTOR HUB",
        key: "rotorHub",
        Component: RotorHubForm
    },
    {
        label: "Blade Installation",
        key: "blade",
        Component: BladeInstallationForm,
    },
];

function WTGinstallationTabs({
    filters,
    setFilters,
    showSnackbar,
    // contractors,
    // inspectors,
    // GETmaterialMaster,
    // attachmentList,
    // documentList,
    // componentTypesList = [],
    // activityPlannedDates = [],
}) {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    // const [editId, setEditId] = useState(null);
    const [submittedWtgTabs, setSubmittedWtgTabs] = useState({});
    const [isAcknowledged, setIsAcknowledged] = useState(false);
    const dataFetchedRef = useRef(null);
    const {
        viewer,
        closeViewer,
        buildColumns
    } = useTableViewer();
    const {
        uploadAttachments
    } = useFileUpload(filters);
    const {
        FetchMaterialRecivedData = [],
            MaterialIssueData = [],
            GETmaterialMaster = [],
            componentTypesList = [],
            inspectors = [],
            //  vendorData = [],
            //  kpiList = [],
            attachmentList = [],
            documentList = [],
            activityPlannedDates = [],
    } = useSelector((state) => state.masterData || {});

    const contractors = useSelector(
        (state) => state.masterData ? .ContractorData ? ? [],
    );
    const {
        eligibleTurbines
    } = useSelector((state) => state.turbineData);


    const initialT1InstallationData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            leveling: "",
            grouting: "",
            grouting_curing: "",
            alignment_check: "",
            no_of_bolts: "",
            torque_value: "",
            instrument_used: "",
            material: "",
            batch_no: "",
            grout_material_type: "",
            grouting_curing_days: "",
            lifting_start: "",
            lifting_end: "",
            bolt_size: "",
            contractor: "",
            weather_conditions: "",
            supervisor: "",
            remarks: "",
            t1_status: "completed",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );
    const [t1InstallationData, setT1InstallationData] = useState(
        initialT1InstallationData,
    );

    const resetTower1 = useCallback(() => {
        setT1InstallationData(initialT1InstallationData);
        // setEditId(null);
    }, [initialT1InstallationData]);

    // const handleT1InstallationChange = useCallback((field, value) => {
    //   setT1InstallationData((prev) => ({
    //     ...prev,
    //     [field]: value,
    //   }));
    // }, []);

    const handleT1InstallationChange = useCallback(
        (field, value) => {
            setT1InstallationData((prev) => {
                if (field === "turbine") {
                    return {
                        ...initialT1InstallationData,
                        turbine: value,
                    };
                }

                return {
                    ...prev,
                    [field]: value,
                };
            });
        }, [initialT1InstallationData],
    );

    const intialTowerInstallData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            tower_no: "",
            bolt_id: "",
            no_of_bolts: "",
            torque_value: "",
            instrument_used: "",
            manufacturer: "",
            alignment_check: "",
            crane_id_model: "",
            lifting_start: "",
            lifting_end: "",
            contractor: "",
            supervisor: "",
            weather: "",
            remarks: "",
            tower_status: "in_progress",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );

    const [towerInstallData, setTowerInstallData] = useState(
        intialTowerInstallData,
    );

    const resetTowers = useCallback(() => {
        setTowerInstallData(intialTowerInstallData);
        // setEditId(null);
    }, [intialTowerInstallData]);

    const handleTowerInstallChange = useCallback((field, value) => {
        setTowerInstallData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);



    const intialNacelleData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            nacelle_id: "",
            turbine: "",
            generator_id: "",
            gear_box_id: "",
            lift_id: "",
            bolt_id: "",

            sleving_rim: "",
            no_of_bolt: "",
            alignment_check: "",
            yaw_drive_details: "",
            torque_value: "",
            instrument_used: "",
            electrical_connection_with_tower: "",
            lifting_start: "",
            lifting_end: "",
            weather: "",
            nacelle_status: "in_progress",
            contractor: "",
            supervisor: "",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );

    const [nacelleData, setNacelleData] = useState(intialNacelleData);

    const resetNacelle = useCallback(() => {
        setNacelleData(intialNacelleData);
        // setEditId(null);
    }, [intialNacelleData]);

    // const handleNacelleChange = useCallback((field, value) => {
    //   setNacelleData((prev) => ({ ...prev, [field]: value }));
    // }, []);

    const handleNacelleChange = useCallback(
        (field, value) => {
            setNacelleData((prev) => {
                if (field === "turbine") {
                    return {
                        ...intialNacelleData,
                        turbine: value,
                    };
                }

                return {
                    ...prev,
                    [field]: value,
                };
            });
        }, [intialNacelleData],
    );
    const intialRotorHubData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            bolt_id: "",
            no_of_bolt: "",
            torque_value: "",
            bolt_size_grade: "",
            lubricant_used: "",
            instrument_used: "",
            hub_serial_number: "",
            material_grade: "",
            weight: "",
            pitch_type: "",
            lifting_start: "",
            lifting_end: "",
            weather: "",
            contractor: "",
            supervisor: "",
            remarks: "",
            rotor_status: "in_progress",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );
    const [rotorHubData, setRotorHubData] = useState(intialRotorHubData);

    const resetHub = useCallback(() => {
        setRotorHubData(intialRotorHubData);
        // setEditId(null);
    }, [intialRotorHubData]);

    // const handleRotorHubChange = useCallback((field, value) => {
    //   setRotorHubData((prev) => ({
    //     ...prev,
    //     [field]: value,
    //   }));
    // }, []);

    const handleRotorHubChange = useCallback(
        (field, value) => {
            setRotorHubData((prev) => {
                if (field === "turbine") {
                    return {
                        ...intialRotorHubData,
                        turbine: value,
                    };
                }

                return {
                    ...prev,
                    [field]: value,
                };
            });
        }, [intialRotorHubData],
    );

    const intialBladeData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            blade_no: "",
            blade_id: "",
            bolt_id: "",
            no_of_bolt: "",
            torque_value: "",
            instrument_used: "",
            weather: "",
            lifting_start: "",
            lifting_end: "",
            contractor: "",
            supervisor: "",
            blade_status: "in_progress",
            evidence_photo: null,
            selected_items: [],
        }), [],
    );
    const [bladeData, setBladeData] = useState(intialBladeData);

    const resetBlade = useCallback(() => {
        setBladeData(intialBladeData);
        // setEditId(null);
    }, [intialBladeData]);

    // const handleBladeChange = useCallback((field, value) => {
    //   setBladeData((prev) => ({
    //     ...prev,
    //     [field]: value,
    //   }));
    // }, []);

    const handleBladeChange = (name, value) => {
        const numericFields = [
            "turbine",
            "blade_id",
            "bolt_id",
            "contractor",
            "supervisor",
        ];

        setBladeData((prev) => ({
            ...prev,
            [name]: numericFields.includes(name) ?
                value === "" ?
                null :
                Number(value) :
                value,
        }));
    };

    // Reset all form states when project, windfarm, or cluster filters change
    useEffect(() => {

        dispatch({
            type: "CLEAR_ELIGIBLE_TURBINES"
        });
        // 1. Reset all WTG installation forms to their initial states
        setT1InstallationData(initialT1InstallationData);
        setTowerInstallData(intialTowerInstallData);
        setNacelleData(intialNacelleData);
        setRotorHubData(intialRotorHubData);
        setBladeData(intialBladeData);

        // 2. Clear acknowledgments and edit modes if applicable
        setIsAcknowledged(false);

        // 3. Optional: Smoothly scroll back to the top when location context changes
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [filters.project, filters.windfarm, filters.cluster]);

    const activeTab = WTG_INSTALLATION_TABS[tabIndex];
    const ActiveComponent = activeTab.Component;

    const WTG_ACTIVITIES = {
        0: "T1_INSTALL",
        1: "TOWER_INSTALL",
        2: "NACELLE",
        3: "ROTOR_HUB",
        4: "BLADES",
    };

    // ====== 2. DERIVE THE CURRENT ACTIVE CODE DYNAMICALLY ======
    const activityCode = useMemo(() => {
        return WTG_ACTIVITIES[tabIndex] || "";
    }, [tabIndex]);

    // SMART POLLING (Fetches data ONLY for the WTG_INSTALLATION category)
    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm) return;

        const fetchCategoryTurbines = () => {
            // Pass project, windfarm, cluster, activity (null), and category ("WTG_INSTALLATION")
            dispatch(
                getEligibleTurbines(
                    filters.project,
                    filters.windfarm,
                    filters.cluster,
                    null,
                    "WTG_INSTALLATION",
                ),
            );
        };

        fetchCategoryTurbines();

        const pollingIntervalId = setInterval(fetchCategoryTurbines, 15000);

        // Cleanup interval on unmount or filter change
        return () => clearInterval(pollingIntervalId);
    }, [filters.project, filters.windfarm, filters.cluster, dispatch]);


    const t1Turbines = useMemo(
        () => eligibleTurbines ? .T1_INSTALL || [], [eligibleTurbines],
    );
    const towerTurbines = useMemo(
        () => eligibleTurbines ? .TOWER_INSTALL || [], [eligibleTurbines],
    );
    const nacelleTurbines = useMemo(
        () => eligibleTurbines ? .NACELLE || [], [eligibleTurbines],
    );
    const rotorTurbines = useMemo(
        () => eligibleTurbines ? .ROTOR_HUB || [], [eligibleTurbines],
    );
    const bladeTurbines = useMemo(
        () => eligibleTurbines ? .BLADES || [], [eligibleTurbines],
    );


    useEffect(() => {
        // Compute active turbine ID depending on which panel/tab index the user is looking at
        let activeTurbineId = "";

        if (tabIndex === 0) activeTurbineId = t1InstallationData.turbine;
        else if (tabIndex === 1) activeTurbineId = towerInstallData.turbine;
        else if (tabIndex === 2) activeTurbineId = nacelleData.turbine;
        else if (tabIndex === 3) activeTurbineId = rotorHubData.turbine;
        else if (tabIndex === 4) activeTurbineId = bladeData.turbine;

        // Only dispatch if a valid location ID exists
        if (activeTurbineId) {
            dispatch(GetDocumentUploadList({
                turbine: activeTurbineId
            }));
        }
    }, [
        dispatch,
        tabIndex,
        // subTabIndex,
        t1InstallationData.turbine,
        towerInstallData.turbine,
        nacelleData.turbine,
        rotorHubData.turbine,
        bladeData.turbine,
    ]);

    const autoBindAttachments = useCallback(
        (turbineId, activityCode, currentItems, onDataChange) => {
            if (!turbineId || !attachmentList ? .length) return;

            const activityMasterItems = attachmentList.filter(
                (m) => m.activity === activityCode,
            );

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

            // Deep compare check to stop infinite React re-render loops
            const isSame =
                currentItems ? .length === mergedItems.length &&
                currentItems.every(
                    (item, i) =>
                    item.masterId === mergedItems[i] ? .masterId &&
                    item.file ? .url === mergedItems[i] ? .file ? .url &&
                    item.custom_name === mergedItems[i] ? .custom_name &&
                    item.doc_no === mergedItems[i] ? .doc_no &&
                    item.doc_date === mergedItems[i] ? .doc_date,
                );

            if (!isSame) {
                onDataChange("selected_items", mergedItems);
            }
        }, [documentList, attachmentList],
    );
    useEffect(() => {
        if (tabIndex === 0 && t1InstallationData.turbine)
            autoBindAttachments(
                t1InstallationData.turbine,
                "T1_INSTALL",
                t1InstallationData.selected_items,
                handleT1InstallationChange,
            );

        if (tabIndex === 1 && towerInstallData.turbine)
            autoBindAttachments(
                towerInstallData.turbine,
                "TOWER_INSTALL",
                towerInstallData.selected_items,
                handleTowerInstallChange,
            );

        if (tabIndex === 2 && nacelleData.turbine)
            autoBindAttachments(
                nacelleData.turbine,
                "NACELLE",
                nacelleData.selected_items,
                handleNacelleChange,
            );

        if (tabIndex === 3 && rotorHubData.turbine)
            autoBindAttachments(
                rotorHubData.turbine,
                "ROTOR_HUB",
                rotorHubData.selected_items,
                handleRotorHubChange,
            );

        if (tabIndex === 4 && bladeData.turbine)
            autoBindAttachments(
                bladeData.turbine,
                "BLADES",
                bladeData.selected_items,
                handleBladeChange,
            );
    }, [
        tabIndex,
        t1InstallationData.turbine,
        towerInstallData.turbine,
        nacelleData.turbine,
        rotorHubData.turbine,
        bladeData.turbine,
        documentList,
        attachmentList,
        autoBindAttachments,
    ]);


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
            // console.error("No planned activity found");
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
        };

        try {
            const resultAction = await dispatch(postDelayAnalysis(payload));

            if (resultAction ? .type ? .endsWith("/rejected") || resultAction ? .error) {
                throw resultAction.payload || resultAction.error;
            }

            showSnackbar("Delay analysis saved successfully!", "success");
            return true;
        } catch (error) {
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

    useEffect(() => {
        dispatch(GetAttachmentMasterData());
        dispatch(GetMaterialIssueData());
        dispatch(GetMaterialRecivedData());
        dispatch(fetchContractors());
        dispatch(GetInspectors());
        dispatch(GetVendorData());
        dispatch(GetMaterialMasterData());
        dispatch(GetKPIMasterList());
        // dispatch(GetDocumentUploadList());
        dispatch(GetComponentTypesList());
        dispatch(getTurbinePlannedDates());
    }, [dispatch]);


    //  submitting data

    const toFormData = (data) => {
        const fd = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            // 🔥 Skip selected_items because attachments are handled separately by your uploadAttachments function
            if (key === "selected_items") return;

            if (value !== null && value !== undefined) {
                fd.append(key, value);
            }
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

    // Tower 1 submission
    const handleSubmitTower1 = useCallback(async () => {
        if (!t1InstallationData.alignment_check ||
            !t1InstallationData.no_of_bolts ||
            !t1InstallationData.torque_value ||
            !t1InstallationData.instrument_used ||
            !t1InstallationData.batch_no ||
            !t1InstallationData.supervisor
        ) {
            showSnackbar("Please fill all mandatory fields.", "error");
            return;
        }

        if (!t1InstallationData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory evidence photo before submitting.",
                "error",
            );
            return; // Terminate execution early
        }
        if (hasMissingMandatoryDocs(t1InstallationData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }

        if (hasMissingJointReport(t1InstallationData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }

        try {
            const selectedTurbine = t1Turbines.find(
                (t) => Number(t.id) === Number(t1InstallationData.turbine),
            );

            const finalData = {
                ...t1InstallationData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            };
            await dispatch(createT1InstallationData(toFormData(finalData)));
            await uploadAttachments(
                t1InstallationData,
                t1InstallationData.t1_status,
                selectedTurbine,
            );
            setSubmittedWtgTabs((prev) => ({ ...prev,
                0: true
            }));
            showSnackbar("Tower 1 installation submitted successfully", "success");

            setT1InstallationData(initialT1InstallationData);
        } catch (err) {
            const errorMsg = parseErrorMessage(err.response ? .data);
            showSnackbar(errorMsg, "error");
        }
    }, [
        t1InstallationData,
        filters,
        t1Turbines,
        uploadAttachments,
        dispatch,
        resetTower1,
        showSnackbar,
    ]);

    // General Tower installation submission
    const handleSubmitTowerInstallation = useCallback(async () => {
        if (!towerInstallData.tower_no ||
            !towerInstallData.no_of_bolts ||
            !towerInstallData.torque_value ||
            !towerInstallData.instrument_used ||
            !towerInstallData.crane_id_model ||
            !towerInstallData.supervisor
        ) {
            showSnackbar("Please fill all mandatory fields.", "error");
            return;
        }

        if (!towerInstallData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory evidence photo before submitting.",
                "error",
            );
            return; // Terminate execution early
        }
        if (hasMissingMandatoryDocs(towerInstallData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }
        if (hasMissingJointReport(towerInstallData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }

        try {
            const selectedTurbine = towerTurbines.find(
                (t) => Number(t.id) === Number(towerInstallData.turbine),
            );

            const finalData = {
                ...towerInstallData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            };
            await dispatch(PostTowerInstallation(toFormData(finalData)));

            await uploadAttachments(
                towerInstallData,
                towerInstallData.tower_status,
                selectedTurbine,
            );
            setSubmittedWtgTabs((prev) => ({ ...prev,
                1: true
            }));
            showSnackbar("Tower installation submitted successfully", "success");
            resetTowers();
        } catch (err) {
            const errorMsg = parseErrorMessage(err.response ? .data);
            showSnackbar(errorMsg, "error");
        }
    }, [
        towerInstallData,
        filters,
        towerTurbines,
        uploadAttachments,
        dispatch,
        resetTowers,
        showSnackbar,
    ]);

    // Nacelle Installation Submission
    const handleSubmitNacelle = useCallback(async () => {
        if (!nacelleData.nacelle_id ||
            !nacelleData.generator_id ||
            !nacelleData.gear_box_id ||
            !nacelleData.lift_id ||
            !nacelleData.no_of_bolt ||
            !nacelleData.torque_value ||
            !nacelleData.instrument_used ||
            !nacelleData.alignment_check ||
            !nacelleData.yaw_drive_details ||
            !nacelleData.supervisor
        ) {
            showSnackbar("Please fill all mandatory fields.", "error");
            return;
        }

        if (!nacelleData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory evidence photo before submitting.",
                "error",
            );
            return; // Terminate execution early
        }
        if (hasMissingMandatoryDocs(nacelleData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }

        if (hasMissingJointReport(nacelleData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = nacelleTurbines.find(
                (t) => Number(t.id) === Number(nacelleData.turbine),
            );

            const finalData = {
                ...nacelleData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            };
            await dispatch(PostNacelleInstallation(toFormData(finalData)));
            await uploadAttachments(
                nacelleData,
                nacelleData.nacelle_status,
                selectedTurbine,
            );

            setSubmittedWtgTabs((prev) => ({ ...prev,
                1: true
            })); // tab index
            showSnackbar("Nacelle installation submitted successfully", "success");
            resetNacelle();
        } catch (err) {
            const errorMsg = parseErrorMessage(err.response ? .data);
            showSnackbar(errorMsg, "error");
        }
    }, [
        nacelleData,
        filters,
        nacelleTurbines,
        uploadAttachments,
        dispatch,
        resetNacelle,
        showSnackbar,
    ]);

    // Rotor Hub Installation Submission
    const handleSubmitRotor = useCallback(async () => {
        if (!rotorHubData.no_of_bolt ||

            !rotorHubData.instrument_used ||
            !rotorHubData.hub_serial_number ||
            !rotorHubData.bolt_id ||
            !rotorHubData.torque_value ||
            !rotorHubData.lubricant_used ||
            !rotorHubData.supervisor
        ) {
            showSnackbar("Please fill all mandatory fields.", "error");
            return;
        }

        if (!rotorHubData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory evidence photo before submitting.",
                "error",
            );
            return; // Terminate execution early
        }
        if (hasMissingMandatoryDocs(rotorHubData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }

        if (hasMissingJointReport(rotorHubData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = rotorTurbines.find(
                (t) => Number(t.id) === Number(rotorHubData.turbine),
            );

            const finalData = {
                ...rotorHubData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            };
            await dispatch(PostRotorHubInstallation(toFormData(finalData)));

            await uploadAttachments(
                rotorHubData,
                rotorHubData.rotor_status,
                selectedTurbine,
            );
            setSubmittedWtgTabs((prev) => ({ ...prev,
                2: true
            }));
            showSnackbar("Rotor hub installation submitted successfully", "success");
            resetHub();
        } catch (err) {
            const errorMsg = parseErrorMessage(err.response ? .data);
            showSnackbar(errorMsg, "error");
        }
    }, [
        rotorHubData,
        filters,
        rotorTurbines,
        uploadAttachments,
        dispatch,
        resetHub,
        showSnackbar,
    ]);

    // Blade Installation Submission
    const handleSubmitBlade = useCallback(async () => {
        if (!bladeData.blade_no ||
            !bladeData.blade_id ||
            !bladeData.bolt_id ||
            !bladeData.no_of_bolt ||
            !bladeData.torque_value ||
            !bladeData.instrument_used ||
            !bladeData.supervisor
        ) {
            showSnackbar("Please fill all mandatory fields.", "error");
            return;
        }
        if (!bladeData.evidence_photo) {
            showSnackbar(
                "Please upload a mandatory evidence photo before submitting.",
                "error",
            );
            return; // Terminate execution early
        }
        if (hasMissingMandatoryDocs(bladeData)) {
            showSnackbar("Please upload all mandatory documents", "error");
            return;
        }

        if (hasMissingJointReport(bladeData)) {
            showSnackbar(
                "Please upload the Jointly Signed Approval Report before marking status as Completed.",
                "error",
            );
            return;
        }
        try {
            const selectedTurbine = bladeTurbines.find(
                (t) => Number(t.id) === Number(bladeData.turbine),
            );

            const finalData = {
                ...bladeData,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            };
            await dispatch(PostBladeInstallation(toFormData(finalData)));
            await uploadAttachments(
                bladeData,
                bladeData.blade_status,
                selectedTurbine,
            );
            setSubmittedWtgTabs((prev) => ({ ...prev,
                3: true
            }));
            showSnackbar("Blade installation submitted successfully", "success");
            resetBlade();
        } catch (err) {
            const errorMsg = parseErrorMessage(err.response ? .data);
            showSnackbar(errorMsg, "error");
        }
    }, [
        bladeData,
        filters,
        bladeTurbines,
        uploadAttachments,
        dispatch,
        resetBlade,
        showSnackbar,
    ]);

    return ( <
        Box sx = {
            {
                width: "100%",
                mt: -2
            }
        } > { /* ================= TABS NAVIGATION ================= */ } <
        Box >
        <
        Tabs value = {
            tabIndex
        }
        onChange = {
            (e, v) => setTabIndex(v)
        }
        centered TabIndicatorProps = {
            {
                sx: {
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "primary.main",
                },
            }
        }
        sx = {
            {
                "& .MuiTabs-flexContainer": {
                    gap: 2,
                },
            }
        } >
        {
            WTG_INSTALLATION_TABS.map((tab, index) => {
                const isActive = index === tabIndex;

                return ( <
                    Tab key = {
                        tab.key
                    }
                    label = {
                        tab.label
                    }
                    disableRipple sx = {
                        {
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            px: 3,
                            py: 1.25,
                            minHeight: 44,
                            minWidth: 120,
                            borderRadius: 8,
                            border: "2px solid",
                            borderColor: isActive ? "primary.main" : "divider",
                            color: isActive ? "primary.main" : "#f34500ff",
                            backgroundColor: isActive ? "primary.50" : "transparent",
                            transition: "all 0.25s ease",

                            "&.Mui-selected": {
                                boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                            },

                            "&:hover": {
                                borderColor: "primary.main",
                                backgroundColor: "action.hover",
                            },
                        }
                    }
                    />
                );
            })
        } <
        /Tabs> <
        /Box>

        { /* ================= CONTENT AREA ================= */ }

        <
        Box sx = {
            {
                pt: 2
            }
        } > { /* <LocationFilterBar filters={filters} setFilters={setFilters} /> */ } <
        Box > {
            activeTab.key === "tower1" && ( <
                ActiveComponent t1Data = {
                    t1InstallationData
                }
                buildColumns = {
                    buildColumns
                }
                filters = {
                    filters
                }
                documentList = {
                    documentList
                }
                onT1Change = {
                    handleT1InstallationChange
                }
                // key={`${activeTab.key}-${filters.cluster}`}
                turbinesData = {
                    t1Turbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }
                onSubmitTower1 = {
                    (data) => {
                        handleSubmitTower1(data);
                        setIsAcknowledged(false);
                    }
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
                attachmentMasterList = {
                    attachmentList
                }
                submittedTabs = {
                    submittedWtgTabs
                }
                />
            )
        } {
            activeTab.key === "towers" && ( <
                ActiveComponent
                // key={`${activeTab.key}-${filters.cluster}`}
                data = {
                    towerInstallData
                }
                filters = {
                    filters
                }
                buildColumns = {
                    buildColumns
                }
                documentList = {
                    documentList
                }
                onChange = {
                    handleTowerInstallChange
                }
                turbinesData = {
                    towerTurbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }
                attachmentMasterList = {
                    attachmentList
                }
                delayCauses = {
                    componentTypesList
                }
                materialData = {
                    GETmaterialMaster
                }

                onDelaySubmit = {
                    handleDelaySubmit
                }
                onSubmitTowerInstallation = {
                    (data) => {
                        handleSubmitTowerInstallation(data);
                        setIsAcknowledged(false);
                    }
                }
                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                submittedTabs = {
                    submittedWtgTabs
                }
                />
            )
        } {
            activeTab.key === "nacelle" && ( <
                ActiveComponent
                // key={`${activeTab.key}-${filters.cluster}`}
                NacelleData = {
                    nacelleData
                }
                filters = {
                    filters
                }
                buildColumns = {
                    buildColumns
                }
                documentList = {
                    documentList
                }
                onNacelleChange = {
                    handleNacelleChange
                }
                onSubmitNacelle = {
                    (data) => {
                        handleSubmitNacelle(data);
                        setIsAcknowledged(false);
                    }
                }
                turbinesData = {
                    nacelleTurbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }

                delayCauses = {
                    componentTypesList
                }
                onDelaySubmit = {
                    handleDelaySubmit
                }
                attachmentMasterList = {
                    attachmentList
                }
                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                submittedTabs = {
                    submittedWtgTabs
                }
                />
            )
        } {
            activeTab.key === "rotorHub" && ( <
                ActiveComponent
                // key={`${activeTab.key}-${filters.cluster}`}
                rotorHubData = {
                    rotorHubData
                }
                filters = {
                    filters
                }
                buildColumns = {
                    buildColumns
                }
                documentList = {
                    documentList
                }
                onRotorHubChange = {
                    handleRotorHubChange
                }
                onSubmitRotorHub = {
                    (data) => {
                        handleSubmitRotor(data);
                        setIsAcknowledged(false);
                    }
                }
                // onSubmitRotorHub={handleSubmitRotor}
                turbinesData = {
                    rotorTurbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }
                materialData = {
                    GETmaterialMaster
                }
                delayCauses = {
                    componentTypesList
                }

                onDelaySubmit = {
                    handleDelaySubmit
                }
                attachmentMasterList = {
                    attachmentList
                }

                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                submittedTabs = {
                    submittedWtgTabs
                }
                />
            )
        } {
            activeTab.key === "blade" && ( <
                ActiveComponent
                // key={`${activeTab.key}-${filters.cluster}`}
                BladeData = {
                    bladeData
                }
                filters = {
                    filters
                }
                buildColumns = {
                    buildColumns
                }
                documentList = {
                    documentList
                }
                onBladeChange = {
                    handleBladeChange
                }
                onSubmitBlade = {
                    (data) => {
                        handleSubmitBlade(data);
                        setIsAcknowledged(false);
                    }
                }
                // onSubmitBlade={handleSubmitBlade}
                turbinesData = {
                    bladeTurbines
                }
                contractors = {
                    contractors
                }
                inspectors = {
                    inspectors
                }
                materialData = {
                    GETmaterialMaster
                }
                delayCauses = {
                    componentTypesList
                }
                // getActivePlan={getActivePlan}
                onDelaySubmit = {
                    handleDelaySubmit
                }
                attachmentMasterList = {
                    attachmentList
                }

                isAcknowledged = {
                    isAcknowledged
                }
                setIsAcknowledged = {
                    setIsAcknowledged
                }
                submittedTabs = {
                    submittedWtgTabs
                }
                />
            )
        } <
        /Box> <
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

export default WTGinstallationTabs;