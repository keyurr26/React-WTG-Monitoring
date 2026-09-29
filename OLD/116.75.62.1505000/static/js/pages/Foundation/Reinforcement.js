import React, {
    useEffect,
    useMemo
} from "react";
import {
    Box,
    TextField,
    Grid,
    Paper,
    Alert,
    Typography,
    Button,
    MenuItem,
    FormControlLabel,
    Checkbox,
    IconButton,
    InputAdornment,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    History as HistoryIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon
} from "@mui/icons-material";
import {
    STATUS_OPTIONS
} from "../../constants/choices";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import {
    getDateLimits
} from "../../utils/dateLimits";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import NumberTextField from "../../components/comman/NumberTextField";
import {
    getReinforcements
} from "../../Redux/InstallationData/FoundationData/foundationAction";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetAttachmentMasterData
} from "../../Redux/MasterData/masterAction";
import useKpiValidator from "../../hooks/useKpiValidator";
import {
    getFormKpiFields
} from "../../config/kpiFieldConfigs";

const ReinforcementForm = ({
    filters,
    buildColumns,
    formData = {},
    onChange,
    onSubmitReinforce,
    onEditReinf,
    delayCauses,
    onDelaySubmit,
    turbines = [],
    contractors = [],
    inspectors = [],
    kpiList = [],
    showSnackbar,
    isAcknowledged,
    setIsAcknowledged,
}) => {
    const {
        delayOpen,
        delayData,
        // delaySaved,
        checkDelay,
        handleDelaySubmit,
        openDelayPopup,
        closeDelayPopup,
        clearDelay,
    } = useDelayHandler({
        // getActivePlan: getActivePlan,
        activityCode: "REINF",
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
        reinforcements = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !formData.turbine) {
            return;
        }
        dispatch(GetAttachmentMasterData({
            activity: "REINF"
        }));

        const apiPayload = {
            ...filters,
            turbine: formData.turbine,
        };
        dispatch(getReinforcements(apiPayload));
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
            type,
            files
        } = e.target;
        const val = type === "file" ? files[0] : value;

        if (name === "turbine") {
            clearDelay();

            onChange("turbine", value);

            // If date already selected then check delay
            //  if (formData.start_date) {
            //    const selectedTurbine = turbines.find(
            //      (t) => Number(t.id) === Number(value),
            //    );

            //    if (selectedTurbine) {
            //      checkDelay(
            //        formData.start_date,
            //        value,
            //        selectedTurbine.project_id || selectedTurbine.project,
            //        selectedTurbine.windfarm_id || selectedTurbine.windfarm,
            //      );
            //    }
            //  }

            return;
        }

        onChange(name, val);
    };

    useEffect(() => {
        // Destructure values for clarity
        const turbine = formData.turbine;
        const startDate = formData.start_date;
        const status = formData.reinforcement_status;

        // GUARD: Only call checkDelay if ALL required fields are present
        if (turbine && startDate && status) {
            checkDelay(startDate, turbine, status);
        }
    }, [
        formData.turbine,
        formData.start_date,
        formData.reinforcement_status,
        checkDelay,
    ]);

    const handleRemovePhoto = () => onChange("evidence_photo", null);

    const REINFORCEMENT_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            contractor_name: "Contractor",
            start_date: "Working Date",
            reinforcement_status: "Progress Status",
            quantity_reinforcement: "Quantity",
            // inspector_name: "Inspector",
            evidence_photo: "Photo",
            attachments_list: "Documents",
            // observations: "Observations",
            // steel_consumption_report: "Steel Report",
        }), [],
    );

    const reinforcementColumns = useMemo(
        () => buildColumns(REINFORCEMENT_HEADER_MAP, true), [buildColumns, REINFORCEMENT_HEADER_MAP],
    );

    // 6. Reinforcement Rows
    const reinforcementRows = useMemo(() => {
        return reinforcements.map((row) => {
            const attachments = documentList
                .filter(
                    (doc) => doc.activity === "REINF" && doc.turbine === row.turbine,
                )
                .map((doc) => ({
                    url: doc.file,
                    name: doc.file_type || doc.name || doc.file.split("/").pop(),
                }));
            return {
                ...row,
                turbine_name: row.turbine_name,
                contractor_name: row.contractor_name,
                inspector_name: row.inspector_name,
                approved_status: row.approve_date ? "Approved" : "Pending",
                canEdit: !row.approve_date,
                attachments_list: attachments,
            };
        });
    }, [reinforcements, documentList]);

    const fieldsToTrack = useMemo(
        () => getFormKpiFields("REINF", formData, reinforcementRows), [formData, reinforcementRows],
    );

    const {
        kpiStatus,
        validateKpi
    } = useKpiValidator(
        kpiList,
        formData.turbine,
        fieldsToTrack,
    );


    const handleReinforcementSubmit = () => {
        if (!validateKpi("quantity_reinforcement", showSnackbar)) {
            return;
        }

        if (!formData.inspector) {
            showSnackbar(
                "Please select a Civil Engineer before submitting.",
                "error",
            );
            return;
        }

        if (onSubmitReinforce) {
            onSubmitReinforce(formData);
        }
    };

    // Filter logs for only the selected turbine
    const turbineSpecificLogs = reinforcementRows.filter(
        (row) => Number(row.turbine) === Number(formData.turbine),
    );

    return ( <
        Box sx = {
            {
                p: 2,
                maxWidth: "lg",
                mx: "auto"
            }
        } > { /* ================= STEP 1: TOP SELECTION BAR ================= */ } <
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
        value = {
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
        em > Choose Location... < /em> <
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
                color = "primary.main"
                fontWeight = {
                    600
                } > ⚡Reinforcement Workspace Active
                for: {
                    " "
                } {
                    turbines.find((t) => t.id === formData.turbine) ? .location_no
                } <
                /Typography>
            )
        } <
        /Grid> <
        /Grid> <
        /Paper>

        { /* ================= STEP 2: DYNAMIC WORKSPACE ================= */ } {
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
                Please select a turbine location to load rebar metrics <
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
                Reinforcement Log <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    4
                } >
                Rebar Installation & Steel Consumption Tracking <
                /Typography>

                <
                Grid container spacing = {
                    2
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
                {
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

                {
                    /* <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  type="date"
                                  label="End Date"
                                  name="end_date"
                                  InputLabelProps={{ shrink: true }}
                                  value={formData.end_date || ""}
                                  onChange={handleChange}
                                  size="small"
                                />
                              </Grid> */
                }

                { /* Timeline */ } <
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

                { /* Steel Specs */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                NumberTextField fullWidth label = "Steel Quantity"
                name = "quantity_reinforcement"
                value = {
                    formData.quantity_reinforcement || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {!!kpiStatus.quantity_reinforcement ? .isError
                }
                helperText = {
                    kpiStatus.quantity_reinforcement ? .isError ?
                    `${kpiStatus.quantity_reinforcement.msg} (Total: ${kpiStatus.quantity_reinforcement.actual} MT)` :
                    `Cumulative: ${kpiStatus.quantity_reinforcement?.actual || 0} / ${kpiStatus.quantity_reinforcement?.max || 0} MT`
                }
                InputProps = {
                    {
                        endAdornment: ( <
                            InputAdornment position = "end" > MT < /InputAdornment>
                        ),
                    }
                }
                placeholder = "Metric Tons" /
                >
                <
                /Grid>

                { /* Inspector & Remarks */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select required fullWidth label = "Civil Engineer"
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
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select fullWidth label = "Status *"
                name = "reinforcement_status"
                value = {
                    formData.reinforcement_status || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {!formData.reinforcement_status
                }
                helperText = {!formData.reinforcement_status ?
                    "Please select a status" :
                        ""
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

                <
                Grid item xs = {
                    12
                } >
                <
                TextField fullWidth label = "Observations / Remarks"
                name = "observations"
                value = {
                    formData.observations || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                multiline /
                >
                <
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
                                    color: "white",
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

                { /* File Upload */ } {
                    /* <Grid item xs={12}>
                                <Box
                                  sx={{
                                    p: 2,
                                    mt: 1,
                                    border: "1px dashed",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    bgcolor: "grey.50",
                                  }}
                                >
                                  <Box>
                                    <Typography variant="subtitle2">
                                      Steel Consumption Report
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {formData.steel_consumption_report
                                        ? `Selected: ${formData.steel_consumption_report.name}`
                                        : "Upload Mill Test Certificates or BBS (Bar Bending Schedule)"}
                                    </Typography>
                                  </Box>
                                  <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<UploadIcon />}
                                    size="small"
                                  >
                                    Upload File
                                    <input
                                      type="file"
                                      hidden
                                      name="steel_consumption_report"
                                      onChange={handleChange}
                                    />
                                  </Button>
                                </Box>
                              </Grid> */
                }

                <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } > { /* REUSABLE POPUP COMPONENT */ } <
                DocumentAttachmentDialog activityCode = "REINF"
                attachmentMasterList = {
                    attachmentList
                }
                formData = {
                    formData
                }
                onDataChange = {
                    onChange
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
                } <
                Grid item xs = {
                    12
                } >
                <
                Alert severity = "info"
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
                    Ensure all rebar overlaps and spacing meet the
                    structural design specifications before concrete
                    pouring. <
                    /Typography>
                }
                /> <
                /Alert> <
                /Grid> <
                /Grid> <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        mt: 3
                    }
                } >
                <
                Button variant = "contained"
                onClick = {
                    handleReinforcementSubmit
                }
                disabled = {!isAcknowledged || foundationLoading
                } >
                Submit <
                /Button> <
                /Box> <
                /Paper>

                { /* ================= STEP 3: HISTORY LOGS ================= */ } {
                    turbineSpecificLogs.length > 0 && ( <
                        Box sx = {
                            {
                                mt: 3
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
                        HistoryIcon fontSize = "small" / > Previous Reinforcement Logs
                        for this Location <
                        /Typography> <
                        DynamicDataTable loading = {
                            foundationLoading
                        }
                        columns = {
                            reinforcementColumns
                        }
                        rows = {
                            turbineSpecificLogs
                        }
                        /> <
                        /Box>
                    )
                } <
                /Box>
            )
        }

        <
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

export default ReinforcementForm;