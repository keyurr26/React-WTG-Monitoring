import React, {
    useEffect,
    useMemo
} from "react";
import {
    Box,
    TextField,
    Grid,
    Paper,
    Typography,
    Button,
    MenuItem,
    FormControlLabel,
    Checkbox,
    InputAdornment,
    Alert,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    History as HistoryIcon,
    // CheckCircle as CheckCircleIcon,
    Engineering as EngineeringIcon,
    // Save as SaveIcon,
    // LocationOn as LocationIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    getDateLimits
} from "../../utils/dateLimits";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import {
    STATUS_OPTIONS
} from "../../constants/choices";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import NumberTextField from "../../components/comman/NumberTextField";
import {
    fetchExcavations
} from "../../Redux/InstallationData/FoundationData/foundationAction";
import {
    GetAttachmentMasterData
} from "../../Redux/MasterData/masterAction";
import useKpiValidator from "../../hooks/useKpiValidator";
import {
    getFormKpiFields
} from "../../config/kpiFieldConfigs";

const ExcavationForm = ({
    formData = {},
    filters,
    buildColumns,
    onExcChange,
    onSubmitExcavation,
    turbines = [],
    contractors = [],
    inspectors = [],
    kpiList = [],
    showSnackbar,
    editId,
    delayCauses,
    onDelaySubmit,
    isAcknowledged,
    setIsAcknowledged,
}) => {
    // LOGIC PRESERVED: Delay Handler
    const {
        delayOpen,
        delayData,
        // delaySaved,
        checkDelay,
        closeDelayPopup,
        openDelayPopup,
        handleDelaySubmit,
        clearDelay,
    } = useDelayHandler({
        // getActivePlan,
        activityCode: "EXC",
        onDelaySubmit,
    });



    const limits = getDateLimits();
    const dispatch = useDispatch();

    const {
        attachmentList,
        documentList
    } = useSelector(
        (state) => state.masterData || {},
    );
    const {
        list = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !formData.turbine) {
            return;
        }

        dispatch(GetAttachmentMasterData({
            activity: "EXC"
        }));

        const apiPayload = { ...filters,
            turbine: formData.turbine
        };

        dispatch(fetchExcavations(apiPayload));
    }, [
        dispatch,
        filters ? .project,
        filters ? .windfarm,
        filters ? .cluster,
        formData.turbine,
    ]);

    const handleChange = (e) => {
        const {
            name,
            value,
            files,
            type
        } = e.target;

        if (name === "turbine") {
            // 1. Reset delay hook internal states
            clearDelay();
            onExcChange("turbine", value);
        }

        if (type === "file") {
            onExcChange(name, files[0]);
            return;
        }
        onExcChange(name, value);
    };
    const handleRemovePhoto = () => {
        onExcChange("evidence_photo", null);
    };

    const EXCAVATION_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            contractor_name: "Contractor",
            start_date: "Working Date",
            excavation_status: "Progress Status",
            depth_meters: "Depth (m)",
            volume_m3: "Excavation Volume (m³)",
            // inspector_name: "Inspector",
            evidence_photo: "Photo",
            attachments_list: "Documents",
        }), [],
    );

    const excavationColumns = useMemo(
        () => buildColumns(EXCAVATION_HEADER_MAP, true), [buildColumns, EXCAVATION_HEADER_MAP],
    );
    // 2. Excavation Rows
    const excavationRows = useMemo(() => {
        return (
            list
            // .filter((row) => Number(row.cluster) === Number(filters.cluster))
            .map((row) => {
                const attachments =
                    row.id ===
                    Math.max(
                        ...list.filter((r) => r.turbine === row.turbine).map((r) => r.id),
                    ) ?
                    documentList
                    .filter(
                        (doc) =>
                        doc.activity === "EXC" && doc.turbine === row.turbine,
                    )
                    .map((doc) => ({
                        url: doc.file,
                        name: doc.file_type || doc.name || doc.file.split("/").pop(),
                        doc_no: doc.doc_no || "N/A",
                        doc_date: doc.doc_date || "N/A",
                        remarks: doc.remarks || "",
                    })) :
                    [];

                return {
                    ...row,
                    turbine_name: row.turbine_name,
                    inspector_name: row.inspector_name,
                    canEdit: !row.approve_date,
                    approved_status: row.approve_date ? "Approved" : "Pending",

                    // This will trigger the "View" button
                    attachments_list: attachments,
                };
            })
        );
    }, [list, documentList]);

    const fieldsToTrack = useMemo(
        () => getFormKpiFields("EXC", formData, excavationRows), [formData, excavationRows],
    );

    const {
        kpiStatus,
        validateKpi
    } = useKpiValidator(
        kpiList,
        formData.turbine,
        fieldsToTrack,
    );


    // 5. Local Submit handler that runs validation first
    const handleFormSubmit = () => {
        // Validate KPIs before doing anything else
        if (!validateKpi("volume_m3", showSnackbar) ||
            !validateKpi("depth_meters", showSnackbar)
        ) {
            return;
        }

        onSubmitExcavation(formData);
    };

    useEffect(() => {
        // Destructure values for clarity
        const turbine = formData.turbine;
        const startDate = formData.start_date;
        const status = formData.excavation_status;

        // GUARD: Only call checkDelay if ALL required fields are present
        if (turbine && startDate && status) {
            checkDelay(startDate, turbine, status);
        }
    }, [
        formData.turbine,
        formData.start_date,
        formData.excavation_status,
        checkDelay,
    ]);

    const turbineSpecificLogs = excavationRows.filter(
        (row) => Number(row.turbine) === Number(formData.turbine),
    );
    // const hasDelay = !!delayData;

    return ( <
        Box sx = {
            {
                maxWidth: "lg",
                mx: "auto",
                p: 2
            }
        } >
        <
        Paper elevation = {
            0
        }
        sx = {
            {
                p: 2,
                mb: 2,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
            }
        } >
        <
        Grid container spacing = {
            2
        }
        alignItems = "center" >
        <
        Grid item xs = {
            12
        }
        md = {
            5
        } >
        <
        TextField select fullWidth label = "Select Turbine Location"
        name = "turbine"
        required value = {
            formData.turbine || ""
        }
        onChange = {
            handleChange
        }
        size = "small"
        sx = {
            {
                bgcolor: "white"
            }
        } >
        <
        MenuItem value = "" >
        <
        em > Select a Turbine... < /em> <
        /MenuItem> {
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
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            7
        } > {
            formData.turbine && ( <
                Typography variant = "body2"
                color = "text.secondary" >
                Excavation analysis
                for Location: {
                    " "
                } <
                strong > {
                    turbines.find((t) => t.id === formData.turbine) ? .location_no
                } <
                /strong> <
                /Typography>
            )
        } <
        /Grid> <
        /Grid> <
        /Paper>

        {
            !formData.turbine ? ( <
                Box sx = {
                    {
                        textAlign: "center",
                        py: 8,
                        border: "2px dashed #e2e8f0",
                        borderRadius: 2,
                        bgcolor: "#fcfcfc",
                    }
                } >
                <
                EngineeringIcon sx = {
                    {
                        fontSize: 48,
                        mb: 2,
                        color: "text.disabled"
                    }
                }
                /> <
                Typography color = "text.secondary" >
                Select a turbine to load the workspace <
                /Typography> <
                /Box>
            ) : ( <
                Box >
                <
                Paper variant = "outlined"
                sx = {
                    {
                        p: 3,
                        borderRadius: 2,
                        bgcolor: "#fff"
                    }
                } >
                <
                Typography variant = "h5"
                fontWeight = {
                    600
                }
                color = "primary.main"
                mb = {
                    1
                } >
                Excavation Report <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    3
                } >
                Site Preparation, Excavation & Foundation Engineering <
                /Typography>

                <
                Grid container spacing = {
                    3
                } >
                <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select fullWidth label = "Contractor"
                name = "contractor"
                value = {
                    formData.contractor || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" >
                <
                MenuItem value = "" > Select Contractor < /MenuItem> {
                    contractors.map((c) => ( <
                        MenuItem key = {
                            c.id
                        }
                        value = {
                            c.id
                        } > {
                            c.firm_name
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                } >
                <
                TextField fullWidth type = "date"
                label = "Working Date"
                name = "start_date"
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                value = {
                    formData.start_date || ""
                }
                onChange = {
                    handleChange
                }
                error = {!formData.start_date
                }
                size = "small"
                inputProps = {
                    {
                        min: limits.date.min,
                        max: limits.date.max,
                    }
                }
                /> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                } >
                <
                TextField required select fullWidth label = "Civil Engineer"
                name = "inspector"
                value = {
                    formData.inspector || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {!formData.inspector
                }
                helperText = {!formData.inspector ? "Civil Engineer is required" : ""
                } >
                {
                    inspectors.map((u) => ( <
                        MenuItem key = {
                            u.id
                        }
                        value = {
                            u.id
                        } > {
                            u.full_name
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                } >
                <
                NumberTextField fullWidth label = "Depth"
                name = "depth_meters"
                error = {
                    kpiStatus.depth_meters ? .isError
                }
                helperText = {
                    kpiStatus.depth_meters ? .isError ?
                    `${kpiStatus.depth_meters.msg} (Min: ${kpiStatus.depth_meters.min}m, Max: ${kpiStatus.depth_meters.max}m)` :
                    `Progressive Range: ${kpiStatus.depth_meters?.min || 0}m - ${kpiStatus.depth_meters?.max || 4}m`
                }
                type = "number"
                value = {
                    formData.depth_meters || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                InputProps = {
                    {
                        endAdornment: ( <
                            InputAdornment position = "end" > m < /InputAdornment>
                        ),
                    }
                }
                /> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                } >
                <
                NumberTextField fullWidth label = "Volume"
                name = "volume_m3"
                error = {
                    kpiStatus.volume_m3 ? .isError
                }
                helperText = {
                    kpiStatus.volume_m3 ? .isError ?
                    `${kpiStatus.volume_m3.msg} (Total: ${kpiStatus.volume_m3.actual}/${kpiStatus.volume_m3.max})` :
                    `Cumulative Total: ${kpiStatus.volume_m3?.actual || 0} / ${kpiStatus.volume_m3?.max || 0} m³`
                }
                type = "number"
                value = {
                    formData.volume_m3 || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                InputProps = {
                    {
                        endAdornment: ( <
                            InputAdornment position = "end" > m³ < /InputAdornment>
                        ),
                    }
                }
                /> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select fullWidth label = "Status *"
                name = "excavation_status"
                value = {
                    formData.excavation_status || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {!formData.excavation_status
                }
                helperText = {!formData.excavation_status ? "Please select a status" : ""
                } >
                { /* <MenuItem value="">Select Status</MenuItem> */ } {
                    STATUS_OPTIONS.map((option) => ( <
                        MenuItem key = {
                            option.value
                        }
                        value = {
                            option.value
                        } > {
                            option.label
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                { /* --- EVIDENCE PHOTO UPLOAD --- */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                Box sx = {
                    {
                        p: 2,
                        border: "1px dashed",

                        borderRadius: 1,
                    }
                } >
                <
                Button component = "label"
                variant = "outlined"
                startIcon = { < UploadIcon / >
                }
                size = "small" >
                Upload Photo <
                input type = "file"
                hidden accept = "image/*"
                name = "evidence_photo"
                onChange = {
                    handleChange
                }
                /> <
                /Button>

                { /* Preview Section */ } {
                    formData.evidence_photo && ( <
                        Box mt = {
                            2
                        }
                        sx = {
                            {
                                position: "relative",
                                width: 220,
                            }
                        } >
                        <
                        img src = {
                            typeof formData.evidence_photo === "string" ?
                            formData.evidence_photo :
                                URL.createObjectURL(formData.evidence_photo)
                        }
                        alt = "Evidence Preview"
                        style = {
                            {
                                width: "100%",
                                borderRadius: 8,
                                border: "1px solid #ccc",
                            }
                        }
                        />

                        { /* Remove Button */ } <
                        IconButton size = "small"
                        onClick = {
                            handleRemovePhoto
                        }
                        sx = {
                            {
                                position: "absolute",
                                top: -10,
                                right: -10,
                                bgcolor: "white",
                                boxShadow: 1,
                                "&:hover": {
                                    bgcolor: "error.main",
                                    color: "white"
                                },
                            }
                        } >
                        <
                        CloseIcon fontSize = "small" / >
                        <
                        /IconButton> <
                        /Box>
                    )
                } <
                /Box> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } > { /* REUSABLE POPUP COMPONENT */ } <
                DocumentAttachmentDialog activityCode = "EXC"
                attachmentMasterList = {
                    attachmentList
                }
                formData = {
                    formData
                }
                onDataChange = {
                    onExcChange
                }
                /> <
                /Grid>

                {
                    delayData && !delayOpen && ( <
                        Grid item xs = {
                            12
                        } >
                        <
                        Alert severity = "warning"
                        action = { <
                            Button
                            color = "inherit"
                            size = "small"
                            onClick = {
                                openDelayPopup
                            }
                            sx = {
                                {
                                    border: "1px solid #f59e0b",
                                    backgroundColor: "#fff7ed",
                                }
                            } >
                            View Delay <
                            /Button>
                        } >
                        This activity is delayed by <
                        strong > {
                            delayData.delay_days
                        } < /strong>
                        days. <
                        /Alert> <
                        /Grid>
                    )
                }

                <
                Grid item xs = {
                    12
                } >
                <
                Alert severity = "info"
                variant = "standard"
                sx = {
                    {
                        mt: 1
                    }
                } >
                <
                FormControlLabel control = { <
                    Checkbox
                    checked = {
                        isAcknowledged
                    }
                    onChange = {
                        (e) => setIsAcknowledged(e.target.checked)
                    }
                    />
                }
                label = { <
                    Typography variant = "body2" >
                    Verify measurements against foundation design before
                    submission. <
                    /Typography>
                }
                /> <
                /Alert> <
                /Grid> <
                /Grid> {
                    /* <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                  <Button
                                    variant="contained"
                                    onClick={onSubmitExcavation}
                                    // disabled={
                                    //   !isAcknowledged ||
                                    //   hasMissingMandatoryDocs() ||
                                    //   (hasDelay && !formData.delay_cause)
                                    // }
                                    disabled={!isAcknowledged || hasMissingMandatoryDocs()}
                                    sx={{ px: 4 }}
                                  >
                                    {editId ? "Update Excavation" : "Submit Excavation"}
                                  </Button>
                                </Box> */
                }

                <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        mt: 3,
                    }
                } >
                <
                Button variant = "contained"
                onClick = {
                    handleFormSubmit
                }
                // disabled={!isAcknowledged || hasMissingMandatoryDocs()}
                disabled = {!isAcknowledged || foundationLoading
                } >
                {
                    editId ? "Update Excavation" : "Submit Excavation"
                } <
                /Button> <
                /Box> <
                /Paper>

                { /* PREVIOUS LOGS SECTION */ } {
                    turbineSpecificLogs.length > 0 && (
                        // <Paper sx={{ mt: 3, p: 4, borderRadius: 3, border: "1px solid #eee"}}>
                        <
                        Box sx = {
                            {
                                mt: 4
                            }
                        } >
                        <
                        Box display = "flex"
                        alignItems = "center"
                        mb = {
                            1
                        }
                        gap = {
                            1
                        } >
                        <
                        HistoryIcon fontSize = "small"
                        color = "action" / >
                        <
                        Typography variant = "subtitle2"
                        color = "primary"
                        fontWeight = {
                            700
                        } >
                        Recent Activity History <
                        /Typography> <
                        /Box> <
                        DynamicDataTable columns = {
                            excavationColumns
                        }
                        rows = {
                            turbineSpecificLogs
                        }
                        loading = {
                            foundationLoading
                        }
                        /> <
                        /Box>
                    )
                } <
                /Box>
            )
        }

        { /* POPUP LOGIC PRESERVED */ } <
        DelayPopup open = {
            delayOpen
        }
        onClose = {
            closeDelayPopup
        }
        delayData = {
            delayData
        }
        delayCauses = {
            delayCauses
        }
        onSubmit = {
            handleDelaySubmit
        }
        /> <
        /Box>
    );
};

export default ExcavationForm;