import React, {
    useState,
    useMemo,
    useEffect,
    useCallback
} from "react";
import {
    Box,
    Tabs,
    Tab
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    useTableViewer
} from "../hooks/useTableViewer";
import {
    getEligibleTurbines
} from "../Redux/TurbineMasterData/turbineAction";
import {
    postPlatformDPR,
    getPlatformDPR,
    getPlatformMaster,
} from "../Redux/InstallationData/PlateformData/plateformAction";
import PlatformDPRTable from "../pages/Platforms/PlatformDPRTable";
const MAIN_PLATFORM_TABS = ["Platform DPR"];

function PlateformTab({
    filters,
    setFilters,
    showSnackbar
}) {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [submittedPlatformMasterTab, setSubmittedPlatformMasterTab] = useState({}, );
    const [editId, setEditId] = useState(null);
    // 1. Redux Global Data Selectors
    const {
        eligibleTurbines
    } = useSelector((state) => state.turbineData || {});
    const {
        platforMasterData = [], platformDPRData = []
    } = useSelector(
        (state) => state.platformData || {},
    );
    // 2. Local State Isolation
    const initialPlatformDPR = useMemo(
        () => ({
            turbine: "",
            platform: "",
            work_date: new Date().toISOString().split("T")[0],
            level: "L1",
            work_done_desc: "",
            compaction_achieved: "",
            test_method: "Core Cutter",
            activity_status: "inprogress",
            remark: "",
            evidence_photo: null,
            document: null,
        }), [],
    );
    const [plateformDPRData, setPlateformDPRData] = useState(initialPlatformDPR);
    // 3. Sync Work Evaluation Logs On Filter Adjustments
    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm) return;
        dispatch(
            getPlatformDPR({
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: filters.cluster,
            }),
        );
        dispatch(
            getPlatformMaster({
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: filters.cluster,
                eligible_only: "true",
            }),
        );
    }, [dispatch, filters]);
    // 4. Automated Poll Pipeline Monitoring Workflow States
    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm) return;
        const fetchFreshWorkflowMatrix = () => {
            dispatch(
                getEligibleTurbines(filters.project, filters.windfarm, filters.cluster),
            );
        };
        fetchFreshWorkflowMatrix();
        const pollingIntervalId = setInterval(fetchFreshWorkflowMatrix, 30000);
        return () => clearInterval(pollingIntervalId);
    }, [filters, dispatch]);
    const plateformturbine = useMemo(
        () => eligibleTurbines ? .PLATFORM || [], [eligibleTurbines],
    );
    // 5. Input Interceptors & Row Mutations Click Handlers
    const handleEditplateformDPRClick = (row) => {
        setEditId(row.id);
        setPlateformDPRData((prev) => ({
            ...prev,
            platform: row.id,
            turbine: row.turbine,
            work_date: new Date().toISOString().split("T")[0],
            level: row.current_level || "L1",
            compaction_achieved: row.last_compaction || "",
        }));
    };
    const handlePlatformDPRChange = useCallback((field, value) => {
        setPlateformDPRData((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);
    const toFormData = (data) => {
        const fd = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                fd.append(key, value);
            }
        });
        return fd;
    };
    const handleSubmitPlatformDPR = useCallback(async () => {
        const missingFields = [];
        if (!plateformDPRData.level) missingFields.push("Soil Layer Level");
        if (!plateformDPRData.evidence_photo) missingFields.push("Evidence Photo");
        if (missingFields.length > 0) {
            showSnackbar(
                `${missingFields.join(" and ")} fields are mandatory! *`,
                "warning",
            );
            return;
        }
        try {
            const masterRow = platforMasterData.find(
                (m) => Number(m.id) === Number(editId),
            );
            const selectedTurbine = plateformturbine.find(
                (t) => Number(t.id) === Number(plateformDPRData.turbine),
            );
            const finalData = {
                ...plateformDPRData,
                platform: editId,
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster ||
                    masterRow ? .cluster ||
                    filters ? .cluster ||
                    null,
            };
            const formData = toFormData(finalData);
            await dispatch(postPlatformDPR(formData));
            setSubmittedPlatformMasterTab((prev) => ({ ...prev,
                1: true
            }));
            setEditId(null);
            showSnackbar("Platform DPR submitted successfully", "success");
            setPlateformDPRData(initialPlatformDPR);
            // Refresh local row logs immediately post dispatch save loop execution
            dispatch(
                getPlatformDPR({
                    project: filters.project,
                    windfarm: filters.windfarm,
                }),
            );
        } catch (err) {
            showSnackbar("Platform DPR submission failed", "error");
        }
    }, [
        plateformDPRData,
        editId,
        filters,
        dispatch,
        showSnackbar,
        plateformturbine,
        initialPlatformDPR,
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
            MAIN_PLATFORM_TABS.map((label, i) => ( <
                Tab key = {
                    i
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
                        borderColor: i === tabIndex ? "#3b82f6" : "#3954b7ff",
                        color: i === tabIndex ? "#3b82f6" : "#f34500ff",
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
        /Box> <
        Box sx = {
            {
                mt: 2
            }
        } >
        <
        PlatformDPRTable filters = {
            filters
        }
        MasterData = {
            platforMasterData
        }
        platformDPRData = {
            platformDPRData
        }
        plateformDPRData = {
            plateformDPRData
        }
        editingRow = {
            editId
        }
        onPlateformDPRChange = {
            handlePlatformDPRChange
        }
        onSubmitPlateformDPR = {
            handleSubmitPlatformDPR
        }
        handleEditplateformDPRClick = {
            handleEditplateformDPRClick
        }
        setEditId = {
            setEditId
        }
        submittedPlatformMasterTab = {
            submittedPlatformMasterTab
        }
        /> <
        /Box> <
        /Box>
    );
}
export default PlateformTab;