import React, {
    useState,
    useMemo,
    useEffect
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    Tabs,
    Tab,
    Box,
    Button,
    Typography,
    TextField,
    MenuItem,
    Grid,
    Paper
} from "@mui/material";
import PouringCardForm from "./pouringCard";
import {
    History as HistoryIcon
} from "@mui/icons-material";
import {
    CUBE_TEST_RESULT_DAYS
} from "../../../constants/choices";
import WateringScheduleForm from "./wateringSchedule";
import CubeTestResultForm from "./cubetestResult";
import DynamicDataTable from "../../../components/comman/DynamicDataTable";
import DeshutteringForm from "../DeshutteringForm";
import BackfillingForm from "../BackfillingForm";
import {
    GetAttachmentMasterData
} from "../../../Redux/MasterData/masterAction";
import {
    GetCubeSamples,
    GetCubeTestResults
} from "../../../Redux/InstallationData/FoundationData/foundationAction";
import {
    getFormKpiFields
} from "../../../config/kpiFieldConfigs";
import useKpiValidator from "../../../hooks/useKpiValidator";

function TabPanel({
    children,
    value,
    index
}) {
    return value === index && < Box sx = {
        {
            pt: 2
        }
    } > {
        children
    } < /Box>;
}

export default function PouringAndCubeSampleTab({
    loading,
    filters,
    subTabIndex,
    setSubTabIndex,
    pouringData,
    turbines = [],
    kpiList,
    onPouringCardChange,
    onSubmitPouring,
    onSubmitCubeSample,
    onSubmitCubeResult,
    wateringData,
    onWateringChange,
    onSubmitWatering,

    cubeTestData,
    contractors,
    onCubeTestChange,
    removeCubeTest,
    inspectors = [],
    onPouringEdit,
    rowsPour,
    columnPour,
    columnWatering,
    rowsWater,
    onCubeSampleEdit,
    isAcknowledged,
    setIsAcknowledged,

    defects,
    addDefect,
    removeDefect,
    onDefectChange,
    formData,
    onDeshutteringChange,
    onSubmitDeshuttering,
    columnsDeshuttering,
    rowsDeshuttering,
    openDefectPopup,
    selectedDefects,
    setOpenDefectPopup,

    backfillingData,
    onSubmitBackfill,
    onChangeBackfill,
    rowsBackfill,
    columnsBackfill,
    delayCauses,
    getActivePlan,
    onDelaySubmit,

    emptyCubeTest,
    setCubeTestData,
    resetCubeSelection,
    setResetCubeSelection,
    buildColumns,
}) {

    const dispatch = useDispatch();

    const [selectedTurbine, setSelectedTurbine] = useState("");
    const [selectedSamples, setSelectedSamples] = useState([]);
    const {
        cubeSamples = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );
    const {
        attachmentList,
        documentList
    } = useSelector(
        (state) => state.masterData || {},
    );
    const cubeTestResults = useSelector((state) => {
        const data = state.foundationData ? .cubeTestResults;
        return Array.isArray(data) ? data : [];
    });

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm) {
            return;
        }
        dispatch(GetAttachmentMasterData({
            activity: "CUBE_RESULT"
        }));

        const apiPayload = {
            ...filters,
            // turbine: cubeTestData.turbine,
        };

        dispatch(GetCubeTestResults(apiPayload));
    }, [
        dispatch,
        filters ? .project,
        filters ? .windfarm,
        filters ? .cluster,
        // cubeTestData.turbine,
    ]);

    const CUBE_TEST_RESULT_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            sample_name: "Cube Sample",
            cr_status: "Progress Status",
            no_of_days_test: "Test Age (Days)",
            cube_weight: "Cube Weight",
            test_result: "Result",
            testing_lab_details: "Lab Details",
            completion_date: "Completion Date",
            // inspector_name: "Inspector",
            acceptance_criteria: "Acceptance",
            evidence_photo: "Pouring Photo",
            attachments_list: "Documents",

        }), [],
    );

    const cubeResultColumn = useMemo(
        () => buildColumns(CUBE_TEST_RESULT_HEADER_MAP, true), [buildColumns, CUBE_TEST_RESULT_HEADER_MAP],
    );

    const cubeTestResultRows = useMemo(() => {
        return (
            cubeTestResults
            // .filter((row) => Number(row.cluster) === Number(filters.cluster))
            .map((row) => {

                const formattedAttachments = (row.attachment_details || []).map(
                    (att) => {
                        const filePath = att.url || "";
                        const fileNameOnly = filePath ?
                            filePath.split("/").pop() :
                            "Document";

                        return {
                            id: att.id,

                            url: filePath,
                            name: att.name || fileNameOnly,
                            doc_no: att.doc_no || "N/A",
                            doc_date: att.doc_date || "N/A",
                        };
                    },
                );

                return {
                    ...row,
                    turbine_name: row.turbine_name,
                    sample_name: row.sample_name,
                    no_of_days_test: row.no_of_days_test,
                    test_result: row.test_result,
                    testing_lab_details: row.testing_lab_details,
                    completion_date: row.completion_date,
                    inspector: row.inspector,
                    inspector_name: row.inspector_name,
                    acceptance_criteria: row.acceptance_criteria,
                    cr_status: row.cr_status,
                    remark: row.remark,

                    // Inject the newly structured normalized array here
                    attachments_list: formattedAttachments,

                    approved_status: row.approve_date ? "Approved" : "Pending",
                };
            })
        );
    }, [cubeTestResults]);

    const fieldsToTrack = useMemo(
        () => getFormKpiFields("CUBE_RESULT", formData, cubeTestResultRows), [formData, cubeTestResultRows],
    );

    const {
        kpiStatus,
        validateKpi
    } = useKpiValidator(
        kpiList,
        formData.turbine,
        fieldsToTrack,
    );

    const handleChange = (event, newValue) => {
        setSubTabIndex(newValue);
    };

    const handleTurbineChange = (e) => {
        const turbineId = e.target.value;
        setSelectedTurbine(turbineId);

        // Clear out any previous selections/forms tied to the old turbine
        setSelectedSamples([]);
        setCubeTestData([]);
    };

    useEffect(() => {
        dispatch(GetCubeSamples());
    }, [dispatch])


    const handleRemoveTest = (index) => removeCubeTest && removeCubeTest(index);

    const isValid =
        Array.isArray(cubeTestData) &&
        cubeTestData.length > 0 &&
        cubeTestData.every(
            (t) =>
            t.cube_id &&
            t.no_of_days_test &&
            t.cube_size_dimension &&
            t.test_result !== "" &&
            t.test_result !== undefined &&
            t.testing_lab_details &&
            t.inspector &&
            t.cube_weight !== "" &&
            t.cube_weight !== undefined

        );

    const tabs = [
        "Pouring",
        "De shuttering",
        "Curing",
        "Cube Test Result",
        "Backfilling",
    ];

    const availableSamples = useMemo(() => {
        if (!selectedTurbine) return [];

        return cubeSamples.filter((sample) => {
            // Sample must belong to selected turbine
            if (Number(sample.turbine) !== Number(selectedTurbine)) {
                return false;
            }

            // Existing results for this sample
            const completedDays = cubeTestResultRows
                .filter((row) => Number(row.cube_id) === Number(sample.id))
                .map((row) => row.no_of_days_test);

            return CUBE_TEST_RESULT_DAYS.some(
                (day) => !completedDays.includes(day.value),
            );
        });
    }, [cubeSamples, cubeTestResultRows, selectedTurbine]);


    const turbineSpecificCubeLogs = useMemo(() => {
        if (!selectedTurbine) return [];

        // Safely fallback to an empty array
        const safeRowsCubeResult = Array.isArray(cubeTestResultRows) ?
            cubeTestResultRows :
            [];

        return safeRowsCubeResult.filter(
            (row) => Number(row.turbine) === Number(selectedTurbine),
        );
    }, [cubeTestResultRows, selectedTurbine]);

    const handleSampleToggle = (sampleId) => {
        setSelectedSamples((prev) =>
            prev.includes(sampleId) ?
            prev.filter((id) => id !== sampleId) :
            [...prev, sampleId],
        );
    };

    const turbineSamples = React.useMemo(() => {
        if (!selectedTurbine) return [];

        return cubeSamples.filter(
            (sample) => Number(sample.turbine) === Number(selectedTurbine),
        );
    }, [cubeSamples, selectedTurbine]);

    const handleGenerateForms = () => {
        const forms = selectedSamples.map((sampleId) => ({
            ...emptyCubeTest,
            turbine: selectedTurbine,
            cube_id: sampleId,
        }));

        setCubeTestData(forms);
    };


    useEffect(() => {
        if (resetCubeSelection) {
            setSelectedSamples([]);
            setCubeTestData([]);
            setResetCubeSelection(false);
        }
    }, [resetCubeSelection, setCubeTestData, setResetCubeSelection]);


    return ( <
        Box sx = {
            {
                width: "100%",
                p: 2
            }
        } > { /* ================= TABS ================= */ } <
        Tabs
        // value={value}
        value = {
            subTabIndex
        }
        onChange = {
            handleChange
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
                    gap: 2
                },
            }
        } >
        {
            tabs.map((label, index) => {
                const isActive = subTabIndex === index;
                return ( <
                    Tab key = {
                        label
                    }
                    label = {
                        label
                    }
                    disableRipple sx = {
                        {
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            px: 3,
                            py: 1.25,
                            minHeight: 44,
                            minWidth: 160,
                            borderRadius: 2,
                            border: "2px solid",
                            borderColor: isActive ? "primary.main" : "divider",
                            color: isActive ? "primary.main" : "#3cbe00ff",
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
        /Tabs>

        { /* ================= TAB CONTENT ================= */ } <
        TabPanel value = {
            subTabIndex
        }
        index = {
            0
        } >
        <
        PouringCardForm loading = {
            loading
        }
        filters = {
            filters
        }
        formData = {
            pouringData
        }
        turbines = {
            turbines
        }
        kpiList = {
            kpiList
        }
        buildColumns = {
            buildColumns
        }
        cubeSamples = {
            cubeSamples
        }
        // attachmentMasterList={attachmentMasterList}
        inspectors = {
            inspectors
        }
        onChange = {
            onPouringCardChange
        }
        onSubmitPouring = {
            onSubmitPouring
        }
        onSubmitCubeSample = {
            onSubmitCubeSample
        }
        rowsPour = {
            rowsPour
        }
        columnPour = {
            columnPour
        }
        // getActivePlan={getActivePlan}
        delayCauses = {
            delayCauses
        }
        onDelaySubmit = {
            onDelaySubmit
        }
        onPouringEdit = {
            onPouringEdit
        }
        isAcknowledged = {
            isAcknowledged
        }
        setIsAcknowledged = {
            setIsAcknowledged
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
        // kpiStatus={kpiStatus}
        /> <
        /TabPanel>

        <
        TabPanel value = {
            subTabIndex
        }
        index = {
            1
        } >
        <
        DeshutteringForm loading = {
            loading
        }
        // contractors={contractors}
        inspectors = {
            inspectors
        }
        filters = {
            filters
        }
        turbines = {
            turbines
        }
        kpiList = {
            kpiList
        }
        buildColumns = {
            buildColumns
        }
        formData = {
            formData
        }
        addDefect = {
            addDefect
        }
        removeDefect = {
            removeDefect
        }
        // getActivePlan={getActivePlan}
        delayCauses = {
            delayCauses
        }
        onDelaySubmit = {
            onDelaySubmit
        }
        defects = {
            defects
        }
        // attachmentMasterList={attachmentList}
        onDefectChange = {
            onDefectChange
        }
        onDeshutteringChange = {
            onDeshutteringChange
        }
        onSubmitDeshuttering = {
            onSubmitDeshuttering
        }
        rowsDeshuttering = {
            rowsDeshuttering
        }
        columnsDeshuttering = {
            columnsDeshuttering
        }
        isAcknowledged = {
            isAcknowledged
        }
        setIsAcknowledged = {
            setIsAcknowledged
        }
        /> <
        /TabPanel> <
        TabPanel value = {
            subTabIndex
        }
        index = {
            2
        } >
        <
        WateringScheduleForm loading = {
            loading
        }
        turbines = {
            turbines
        }
        kpiList = {
            kpiList
        }
        filters = {
            filters
        }
        buildColumns = {
            buildColumns
        }
        inspectors = {
            inspectors
        }
        wateringData = {
            wateringData
        }
        onWateringChange = {
            onWateringChange
        }
        onSubmitWatering = {
            onSubmitWatering
        }
        columnWatering = {
            columnWatering
        }
        // getActivePlan={getActivePlan}
        delayCauses = {
            delayCauses
        }
        onDelaySubmit = {
            onDelaySubmit
        }
        rowsWater = {
            rowsWater
        }
        isAcknowledged = {
            isAcknowledged
        }
        setIsAcknowledged = {
            setIsAcknowledged
        }
        /> <
        /TabPanel>

        <
        TabPanel value = {
            subTabIndex
        }
        index = {
            3
        } > { /* Turbine Selection */ } <
        Box sx = {
            {
                p: 2,
                maxWidth: "lg",
                mx: "auto"
            }
        } >
        <
        Paper elevation = {
            0
        }
        sx = {
            {
                p: 2,
                // mb: 3,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
            }
        } >
        <
        Grid container spacing = {
            2
        } > { /* TURBINE SELECT */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField size = "small"
        select fullWidth label = "Turbine"
        value = {
            selectedTurbine
        }
        sx = {
            {
                bgcolor: "white"
            }
        }
        onChange = {
            handleTurbineChange
        } >
        {
            turbines.map((t) => ( <
                MenuItem key = {
                    t.id
                }
                value = {
                    t.id
                } > {
                    t.location_no
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* SAMPLE CHECKBOX LIST */ } <
        Grid item xs = {
            12
        }
        md = {
            10
        } >
        <
        Typography variant = "subtitle2" > Available Samples < /Typography> <
        Box sx = {
            {
                display: "flex",
                flexWrap: "wrap",
                gap: 2
            }
        } > {
            availableSamples.map((s) => ( <
                Box key = {
                    s.id
                }
                sx = {
                    {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: "1px solid #ddd",
                        p: 1,
                        borderRadius: 1,
                    }
                } >
                <
                input type = "checkbox"
                checked = {
                    selectedSamples.includes(s.id)
                }
                onChange = {
                    () => handleSampleToggle(s.id)
                }
                /> <
                Typography variant = "body2" > {
                    s.sample_id
                } < /Typography> <
                /Box>
            ))
        } <
        Button variant = "contained"
        onClick = {
            handleGenerateForms
        }
        disabled = {!selectedSamples.length
        } >
        Generate Forms <
        /Button> <
        /Box> <
        /Grid> <
        /Grid> <
        /Paper> <
        /Box>

        {
            !cubeTestData || cubeTestData.length === 0 ? ( <
                Box sx = {
                    {
                        // p: 2,
                        textAlign: "center",
                        border: "2px dashed #e2e8f0",
                        py: 5,
                        borderRadius: 2,
                        maxWidth: "lg",
                        mx: "auto",
                    }
                } >
                <
                Typography variant = "h6"
                color = "text.secondary"
                gutterBottom >
                No Cube Test Data Found <
                /Typography>

                <
                Typography variant = "body2"
                color = "text.secondary" >
                Click "Add More Cube Test"
                to get started. <
                /Typography> <
                /Box>
            ) : ( <
                > {
                    cubeTestData.map((item, index) => ( <
                        Box key = {
                            item.cube_id
                        }
                        mb = {
                            3
                        } >
                        <
                        CubeTestResultForm index = {
                            index
                        }
                        turbine = {
                            item.turbine
                        }
                        cubeTestData = {
                            item
                        }
                        turbines = {
                            turbines
                        }
                        kpiList = {
                            kpiList
                        }
                        // buildColumns={buildColumns}
                        cubeSamplesGet = {
                            cubeSamples
                        }
                        rowsCubeResult = {
                            cubeTestResultRows
                        }
                        inspectors = {
                            inspectors
                        }
                        contractors = {
                            contractors
                        }
                        attachmentList = {
                            attachmentList
                        }
                        onCubeTestChange = {
                            onCubeTestChange
                        }
                        // getActivePlan={getActivePlan}
                        delayCauses = {
                            delayCauses
                        }
                        onDelaySubmit = {
                            onDelaySubmit
                        }
                        kpiStatus = {
                            kpiStatus
                        }
                        />

                        {
                            cubeTestData.length > 1 && ( <
                                Box textAlign = "right"
                                mt = {
                                    1
                                } >
                                <
                                Button color = "error"
                                size = "small"
                                onClick = {
                                    () => {
                                        setCubeTestData((prev) =>
                                            prev.filter((_, i) => i !== index),
                                        );
                                    }
                                } >
                                Remove <
                                /Button> <
                                /Box>
                            )
                        } <
                        /Box>
                    ))
                } <
                />
            )
        }

        <
        Box textAlign = "center"
        mt = {
            2
        }
        display = "flex"
        justifyContent = "center"
        gap = {
            2
        } >
        <
        Button variant = "contained"
        color = "success"
        disabled = {!isValid || loading
        }
        // onClick={() => onSubmitCubeResult(cubeTestData)}
        onClick = {
            () => {
                onSubmitCubeResult(cubeTestData);
            }
        } >
        {
            loading ? "Submitting..." : "Submit All Cube Tests"
        } <
        /Button> <
        /Box>

        {
            turbineSpecificCubeLogs.length > 0 && ( <
                Box sx = {
                    {
                        mt: 3,
                        p: 2,
                        maxWidth: "lg",
                        mx: "auto"
                    }
                } >
                <
                Typography variant = "subtitle2"
                color = "text.secondary"
                mb = {
                    1
                }
                sx = {
                    {
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }
                } >
                <
                HistoryIcon fontSize = "small" / > Previous cube test result Logs
                for this Turbine <
                /Typography> <
                DynamicDataTable columns = {
                    cubeResultColumn
                }
                rows = {
                    turbineSpecificCubeLogs
                }
                // loading={loading}
                /> <
                /Box>
            )
        } <
        /TabPanel>

        <
        TabPanel value = {
            subTabIndex
        }
        index = {
            4
        } >
        <
        BackfillingForm
        // loading={loading}
        filters = {
            filters
        }
        formData = {
            backfillingData
        }
        turbines = {
            turbines
        }
        kpiList = {
            kpiList
        }
        buildColumns = {
            buildColumns
        }
        inspectors = {
            inspectors
        }
        contractors = {
            contractors
        }
        onChangeBackfill = {
            onChangeBackfill
        }
        onSubmitBackfill = {
            onSubmitBackfill
        }
        rowsBackfill = {
            rowsBackfill
        }
        columnsBackfill = {
            columnsBackfill
        }
        // getActivePlan={getActivePlan}
        delayCauses = {
            delayCauses
        }
        onDelaySubmit = {
            onDelaySubmit
        }
        // columnPour={columnPour}
        // attachmentMasterList={attachmentMasterList}
        isAcknowledged = {
            isAcknowledged
        }
        setIsAcknowledged = {
            setIsAcknowledged
        }
        /> <
        /TabPanel> <
        /Box>
    );
}