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
    WEATHER_OPTIONS
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
    GetAttachmentMasterData
} from "../../Redux/MasterData/masterAction";
import {
    getFoundationData
} from "../../Redux/InstallationData/FoundationData/foundationAction";
import {
    useDispatch,
    useSelector
} from "react-redux";
import useKpiValidator from "../../hooks/useKpiValidator";
import {
    getFormKpiFields
} from "../../config/kpiFieldConfigs";


const FoundationCasting = ({
    filters,
    buildColumns,
    formData = {},
    onChange,
    onSubmitFounCast,
    onEditCasting,
    turbines = [],
    contractors = [],
    inspectors = [],
    supplierData = [],
    delayCauses,
    onDelaySubmit,
    isAcknowledged,
    setIsAcknowledged,
    kpiList = [],
    showSnackbar,
}) => {
    const {
        delayOpen,
        delayData,
        // delaySaved,
        checkDelay,
        handleDelaySubmit,
        clearDelay,
        openDelayPopup,
        closeDelayPopup,
    } = useDelayHandler({
        // getActivePlan: getActivePlan,
        activityCode: "CAST",
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
        foundations = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !formData.turbine) {
            return;
        }
        dispatch(GetAttachmentMasterData({
            activity: "CAST"
        }));
        const apiPayload = {
            ...filters,
            turbine: formData.turbine,
        };
        dispatch(getFoundationData(apiPayload));
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
            return;
        }
        onChange(name, val);
    };

    useEffect(() => {
        // Destructure values for clarity
        const turbine = formData.turbine;
        const startDate = formData.start_date;
        const status = formData.foundation_status;

        // GUARD: Only call checkDelay if ALL required fields are present
        if (turbine && startDate && status) {
            checkDelay(startDate, turbine, status);
        }
    }, [
        formData.turbine,
        formData.start_date,
        formData.foundation_status,
        checkDelay,
    ]);

    const handleRemovePhoto = () => onChange("evidence_photo", null);

    const FOUNDATION_CASTING_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            start_date: "Working Date",
            inspector_name: "Inspector",
            rmc_supplier_name: "RMC Supplier",
            // distance_from_site_km: "Distance from Site (km)",
            foundation_volume: "Foundation Volumn",
            foundation_status: "Progress Status",
            temp: "Temperature",
            contractor_name: "Contractor",
            evidence_photo: "Photo",
            attachments_list: "Documents",
            // remarks_observations: "Remarks",
            // document: "Document",
        }), [],
    );

    const foundationCastingColumns = useMemo(
        () => buildColumns(FOUNDATION_CASTING_HEADER_MAP, true), [buildColumns, FOUNDATION_CASTING_HEADER_MAP],
    );

    const foundationCastingRows = useMemo(() => {
        return foundations.map((row) => {
            const attachments =
                row.id ===
                Math.max(
                    ...foundations
                    .filter((r) => r.turbine === row.turbine)
                    .map((r) => r.id),
                ) ?
                documentList
                .filter(
                    (doc) => doc.activity === "CAST" && doc.turbine === row.turbine,
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
                foundation_name: row.foundation_name,
                turbine_name: row.turbine_name,
                contractor_name: row.contractor_name,
                inspector_name: row.inspector_name,
                canEdit: !row.approve_date,
                attachments_list: attachments,
                approved_status: row.approve_date ? "Approved" : "Pending",
            };
        });
    }, [foundations, documentList]);

    const fieldsToTrack = useMemo(
        () => getFormKpiFields("CAST", formData, foundationCastingRows), [formData, foundationCastingRows],
    );

    const {
        kpiStatus,
        validateKpi
    } = useKpiValidator(
        kpiList,
        formData.turbine,
        fieldsToTrack,
    );

    const handleCastingSubmit = () => {
        if (!validateKpi("foundation_volume", showSnackbar)) {
            return;
        }

        if (!formData.inspector) {
            showSnackbar(
                "Please select a Civil Engineer before submitting.",
                "error",
            );
            return;
        }

        if (onSubmitFounCast) {
            onSubmitFounCast(formData);
        }
    };
    // Filter logs for only the selected turbine
    const turbineSpecificLogs = foundationCastingRows.filter(
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
                } > ⚡Casting Logs Active
                for Location: {
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
                Select a turbine target parameter to render the pour metrics <
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
                Foundation & Casting <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    4
                } >
                RMC Quality Control, Batching Details & Casting Records <
                /Typography>

                <
                Grid container spacing = {
                    2
                } > { /* Identification & Timeline */ } {
                    /* <Grid item xs={12} md={4}>
                                      <TextField
                                        select
                                        fullWidth
                                        label="Turbine Location"
                                        name="turbine"
                                        required
                                        value={formData.turbine || ""}
                                        onChange={handleChange}
                                        size="small"
                                      >
                                        {filteredTurbines.map((t) => (
                                          <MenuItem key={t.id} value={t.id}>
                                            {t.location_no}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </Grid> */
                }

                <
                Grid item xs = {
                    12
                }
                md = {
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
                /Grid> {
                    /* <Grid item xs={12} md={4}>
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

                { /* Environmental Conditions */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth required label = "Temperature"
                name = "temp"
                value = {
                    formData.temp || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {!formData.temp
                }
                helperText = {!formData.temp ? "Temperature is required" : ""
                }
                InputProps = {
                    {
                        endAdornment: ( <
                            InputAdornment position = "end" > °C < /InputAdornment>
                        ),
                    }
                }
                /> <
                /Grid>

                {
                    /* <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="Foundation Type"
                                  name="foundation_type"
                                  placeholder="e.g. Raft, Pile"
                                  value={formData.foundation_type || ""}
                                  onChange={handleChange}
                                  size="small"
                                />
                              </Grid> */
                }

                <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                NumberTextField fullWidth label = "Foundation Volume"
                name = "foundation_volume"
                value = {
                    formData.foundation_volume || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {!!kpiStatus.foundation_volume ? .isError
                }
                helperText = {
                    kpiStatus.foundation_volume ? .isError ?
                    `${kpiStatus.foundation_volume.msg} (Total: ${kpiStatus.foundation_volume.actual}/${kpiStatus.foundation_volume.max} m³)` :
                    `Design Total: ${kpiStatus.foundation_volume?.actual || 0} / ${kpiStatus.foundation_volume?.max || 0} m³`
                }
                // helperText={
                //   kpiStatus.volume_m3?.isError
                //     ? `${kpiStatus.volume_m3.msg} (Total: ${kpiStatus.volume_m3.actual}/${kpiStatus.volume_m3.max})`
                //     : `Cumulative Total: ${kpiStatus.volume_m3?.actual || 0} / ${kpiStatus.volume_m3?.max || 0} m³`
                // }
                InputProps = {
                    {
                        endAdornment: ( <
                            InputAdornment position = "end" > m³ < /InputAdornment>
                        ),
                    }
                }
                /> <
                /Grid>

                { /* Logistics */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select fullWidth label = "RMC Supplier Name"
                name = "rmc_supplier_name"
                value = {
                    formData.rmc_supplier_name || ""
                }
                onChange = {
                    handleChange
                }
                error = {!formData.rmc_supplier_name
                }
                helperText = {!formData.rmc_supplier_name ? "RMC Supplier Name" : ""
                }
                size = "small" >
                {
                    supplierData.map((u) => ( <
                        MenuItem key = {
                            u.id
                        }
                        value = {
                            u.name
                        } > {
                            u.name
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid> {
                    /* <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="Batching Plant Location"
                                  name="batching_plant_location"
                                  value={formData.batching_plant_location || ""}
                                  onChange={handleChange}
                                  size="small"
                                />
                              </Grid> */
                }

                { /* Structural Details */ } {
                    /* <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={2}
                                  label="Foundation Reinforcement Details"
                                  name="foundation_reinforcement_details"
                                  value={formData.foundation_reinforcement_details || ""}
                                  onChange={handleChange}
                                  size="small"
                                />
                              </Grid> */
                }

                { /* Personnel & Remarks */ } <
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
                /Grid> <
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
                TextField select fullWidth label = "Weather Condition"
                name = "weather_condition"
                placeholder = "e.g. Sunny, Humid"
                value = {
                    formData.weather_condition || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" >
                {
                    WEATHER_OPTIONS.map((opt) => ( <
                        MenuItem key = {
                            opt.value
                        }
                        value = {
                            opt.value
                        } > {
                            opt.label
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
                md = {
                    4
                } >
                <
                TextField select fullWidth label = "Status *"
                name = "foundation_status"
                // Link to state instead of a hardcoded string
                value = {
                    formData.foundation_status || "completed"
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                size = "small"
                required error = {!formData.foundation_status
                }
                helperText = {!formData.foundation_status ? "Please select a status" : ""
                } >
                <
                MenuItem value = "completed" > Completed < /MenuItem> <
                /TextField> <
                /Grid> <
                Grid item xs = {
                    12
                } >
                <
                TextField fullWidth label = "Remarks / Observations"
                name = "remarks_observations"
                value = {
                    formData.remarks_observations || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" /
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

                <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } > { /* REUSABLE POPUP COMPONENT */ } <
                DocumentAttachmentDialog activityCode = "CAST"
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
                }

                <
                Grid item xs = {
                    12
                } >
                <
                Alert severity = "info" >
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
                    Confirm that slump tests were performed
                    for every
                    transition mixer before pouring. <
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
                    handleCastingSubmit
                }
                disabled = {!isAcknowledged || foundationLoading
                } >
                Submit <
                /Button> <
                /Box> <
                /Paper>

                { /* ================= STEP 3: LOG DATA OVERVIEW ================= */ } {
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
                        HistoryIcon fontSize = "small" / > Previous Pouring History Logs
                        for this Location <
                        /Typography> <
                        DynamicDataTable loading = {
                            foundationLoading
                        }
                        columns = {
                            foundationCastingColumns
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

export default FoundationCasting;