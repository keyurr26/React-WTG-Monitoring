import React, {
    useEffect,
    useMemo
} from "react";
import {
    useSelector,
    useDispatch
} from "react-redux";
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
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    History as HistoryIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon
} from "@mui/icons-material";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import {
    getDateLimits
} from "../../utils/dateLimits";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import {
    fetchSoilEvaluations
} from "../../Redux/InstallationData/FoundationData/foundationAction";
import {
    GetAttachmentMasterData
} from "../../Redux/MasterData/masterAction";
import useKpiValidator from "../../hooks/useKpiValidator";
import {
    getFormKpiFields
} from "../../config/kpiFieldConfigs";

const nonNegativeNumberStyles = {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
};

const SoilReport = ({

    filters,
    formData = {},
    buildColumns,
    onChange,
    onSubmitSoil,
    turbines = [],
    kpiList = [],
    showSnackbar,
    delayCauses,
    // getActivePlan,
    onDelaySubmit,
    isAcknowledged,
    setIsAcknowledged,
}) => {
    const {
        delayOpen,
        delayData,
        checkDelay,
        handleDelaySubmit,
        openDelayPopup,
        closeDelayPopup,
        clearDelay,
    } = useDelayHandler({
        // getActivePlan: getActivePlan,
        activityCode: "SOIL",
        onDelaySubmit,
    });

    const dispatch = useDispatch();
    const {
        attachmentList,
        documentList
    } = useSelector(
        (state) => state.masterData || {},
    );
    const {
        soilEvaluations = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );


    useEffect(() => {

        if (!filters ? .project || !filters ? .windfarm || !formData.turbine) {
            return;
        }
        dispatch(GetAttachmentMasterData({
            activity: "SOIL"
        }));

        const apiPayload = {
            ...filters,
            turbine: formData.turbine,
        };

        dispatch(fetchSoilEvaluations(apiPayload));
    }, [
        dispatch,
        filters ? .project,
        filters ? .windfarm,
        filters ? .cluster,
        formData.turbine,
    ]);
    const limits = getDateLimits();

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
        if (formData.turbine && formData.date_of_sampling) {
            const currentStatus = formData.soil_status;
            checkDelay(formData.date_of_sampling, formData.turbine, currentStatus);
        }
    }, [
        formData.turbine,
        formData.date_of_sampling,
        formData.soil_status,
        checkDelay,
    ]);



    const handleRemovePhoto = () => onChange("evidence_photo", null);

    const SOIL_HEADER_MAP = {
        date_of_sampling: "Date of Sampling",
        turbine_name: "Turbine Location",
        depth_of_sample: "Depth of Sample",
        soil_type: "Soil Type",
        moisture_content: "Moisture Content",
        density: "Density",
        soil_status: "Progress Status",
        permeability: "Permeability",
        shear_strength: "Shear Strength",
        soil_bearing_capacity: "Soil Bearing Capacity",
        water_table_depth: "Water Table Depth",
        test_lab_name: "Test Lab Name",
        evidence_photo: "Photo",
        attachments_list: "Documents",
    };

    // Inside SoilForm component:
    const soilColumns = useMemo(
        () => buildColumns(SOIL_HEADER_MAP, true), [buildColumns],
    );

    const soilRows = useMemo(() => {

        return soilEvaluations.map((row) => {
            const attachments = documentList
                .filter((doc) => doc.activity === "SOIL" && doc.turbine === row.turbine)
                .map((doc) => ({
                    url: doc.file,
                    name: doc.file_type || doc.name || doc.file.split("/").pop(),
                }));

            return {
                ...row,
                turbine_name: row.turbine_name,
                approved_status: row.approve_date ? "Approved" : "Pending",
                canEdit: !row.approve_date,
                attachments_list: attachments,
            };
        });
    }, [soilEvaluations, documentList]);


    const fieldsToTrack = useMemo(
        () => getFormKpiFields("SOIL", formData, soilRows), [formData, soilRows]
    );

    const {
        kpiStatus,
        validateKpi
    } = useKpiValidator(
        kpiList,
        formData.turbine,
        fieldsToTrack
    );

    const handleSoilSubmit = () => {
        // Validate Soil KPIs before proceeding
        if (!validateKpi("soil_bearing_capacity", showSnackbar) ||
            !validateKpi("water_table_depth", showSnackbar)
        ) {
            return;
        }


        // If all checks pass, trigger the parent's API submission function
        if (onSubmitSoil) {
            onSubmitSoil(formData);
        }
    };

    // Filter logs for only the selected turbine
    const turbineSpecificLogs = soilRows.filter(
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
                } > ⚡Soil Evaluation Workspace Active
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
                Please select a turbine to load the evaluation workspace <
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
                }
                onKeyDown = {
                    (e) => {
                        if (
                            e.target.type === "number" &&
                            (e.key === "-" || e.key === "e" || e.key === "E")
                        ) {
                            e.preventDefault();
                        }
                    }
                }
                // 🔥 THE GLOBAL PASTE SHORTCUT: Catch and block negative pastes for ALL child fields
                onPaste = {
                    (e) => {
                        if (e.target.type === "number") {
                            const pasteData = e.clipboardData.getData("text");
                            if (pasteData.includes("-")) {
                                e.preventDefault();
                            }
                        }
                    }
                } >
                { /* Header */ } <
                Typography variant = "h5"
                fontWeight = {
                    600
                }
                color = "primary.main"
                mb = {
                    1
                } >
                Soil Evaluation Report <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    3
                } >
                Foundation Engineering & Site Analysis <
                /Typography>

                <
                Grid container spacing = {
                    2
                } > { /* Date of Sampling */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth type = "date"
                label = "Date of Sampling"
                size = "small"
                name = "date_of_sampling"
                value = {
                    formData.date_of_sampling || ""
                }
                onChange = {
                    handleChange
                }
                error = {!formData.date_of_sampling
                }
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                inputProps = {
                    {
                        min: limits.date.min,
                        max: limits.date.max,
                    }
                }
                /> <
                /Grid>

                { /* Turbine Location No */ } {
                    /* <Grid item xs={12} md={4}>
                                <TextField
                                  select
                                  fullWidth
                                  label="Turbine Location"
                                  size="small"
                                  name="turbine"
                                  required
                                  placeholder="TRB-XXXX"
                                  value={formData.turbine || ""}
                                  onChange={handleChange}
                                // disabled={!!editId}
                                >
                                  {filteredTurbines.map((t) => (
                                    <MenuItem key={t.id} value={t.id}>
                                      {t.location_no}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid> */
                }

                { /* Soil Type */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                FormControl fullWidth size = "small" >
                <
                InputLabel > Soil Type * < /InputLabel> <
                Select name = "soil_type"
                value = {
                    formData.soil_type || ""
                }
                onChange = {
                    handleChange
                }
                label = "Soil Type *"
                required >
                <
                MenuItem value = "" > Select Type < /MenuItem> <
                MenuItem value = "silt" > Silt < /MenuItem> <
                MenuItem value = "clay" > Clay < /MenuItem> <
                MenuItem value = "sand" > Sand < /MenuItem> <
                MenuItem value = "gravel" > Gravel < /MenuItem> <
                MenuItem value = "loam" > Loam < /MenuItem> <
                /Select> <
                /FormControl> <
                /Grid>

                { /* Depth of Sample */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth type = "number"
                label = "Depth of Sample (m)"
                size = "small"
                name = "depth_of_sample"
                value = {
                    formData.depth_of_sample || ""
                }
                onChange = {
                    handleChange
                }
                sx = {
                    nonNegativeNumberStyles
                }
                inputProps = {
                    {
                        step: "0.0001"
                    }
                }
                /> <
                /Grid>

                { /* Moisture Content */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth type = "number"
                label = "Moisture Content (%)"
                size = "small"
                name = "moisture_content"
                value = {
                    formData.moisture_content || ""
                }
                sx = {
                    nonNegativeNumberStyles
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* Density */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth type = "number"
                label = "Density (kg/m³)"
                size = "small"
                name = "density"
                value = {
                    formData.density || ""
                }
                sx = {
                    nonNegativeNumberStyles
                }
                onChange = {
                    handleChange
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
                TextField fullWidth type = "number"
                label = "Permiability (cm/s)"
                size = "small"
                name = "permeability"
                value = {
                    formData.permeability || ""
                }
                sx = {
                    nonNegativeNumberStyles
                }
                onChange = {
                    handleChange
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
                TextField fullWidth type = "number"
                label = "Shear Strength (kPa)"
                size = "small"
                name = "shear_strength"
                value = {
                    formData.shear_strength || ""
                }
                sx = {
                    nonNegativeNumberStyles
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid> { /* Water Table Depth */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth type = "number"
                label = "Water Table Depth (m)"
                size = "small"
                name = "water_table_depth"
                value = {
                    formData.water_table_depth || ""
                }
                error = {
                    kpiStatus.water_table_depth ? .isError
                }
                helperText = {
                    kpiStatus.water_table_depth ? .isError ?
                    `(Required Value not more or less: ${kpiStatus.water_table_depth.min}m - ${kpiStatus.water_table_depth.max}m)` :
                    `Required Range: ${kpiStatus.water_table_depth?.min || 0} to ${kpiStatus.water_table_depth?.max || 0} m`
                }
                onChange = {
                    handleChange
                }
                sx = {
                    nonNegativeNumberStyles
                }
                inputProps = {
                    {
                        step: "0.1"
                    }
                }
                /> <
                /Grid>

                { /* Bearing Capacity */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth type = "number"
                label = "Bearing Capacity (kN/m²)"
                size = "small"
                name = "soil_bearing_capacity"
                value = {
                    formData.soil_bearing_capacity || ""
                }
                error = {
                    kpiStatus.soil_bearing_capacity ? .isError
                }
                helperText = {
                    kpiStatus.soil_bearing_capacity ? .isError ?
                    `(Required Range: ${kpiStatus.soil_bearing_capacity.min} - ${kpiStatus.soil_bearing_capacity.max})` :
                    `Required Range: ${kpiStatus.soil_bearing_capacity?.min || 0} to ${kpiStatus.soil_bearing_capacity?.max || 0} kN/m²`
                }
                onChange = {
                    handleChange
                }
                sx = {
                    nonNegativeNumberStyles
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
                TextField fullWidth type = "text"
                label = "Test Lab Name"
                size = "small"
                name = "test_lab_name"
                value = {
                    formData.test_lab_name || ""
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth type = "text"
                label = "Sample Taken by "
                size = "small"
                name = "prepared_by"
                value = {
                    formData.prepared_by || ""
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select fullWidth label = "Status *"
                name = "soil_status"
                value = {
                    formData.soil_status || "completed"
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                size = "small"
                required >
                <
                MenuItem value = "completed" > Completed < /MenuItem> <
                /TextField> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    6
                } >
                <
                TextField fullWidth multiline rows = {
                    2
                }
                label = "Remark"
                size = "small"
                name = "remarks"
                value = {
                    formData.remarks || ""
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* Summary of Findings */ } <
                Grid item xs = {
                    12
                }
                md = {
                    6
                } >
                <
                TextField fullWidth multiline rows = {
                    2
                }
                label = "Summary of Findings"
                size = "small"
                name = "summary_of_findings"
                value = {
                    formData.summary_of_findings || ""
                }
                onChange = {
                    handleChange
                }
                /> <
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
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } > { /* REUSABLE POPUP COMPONENT */ } <
                DocumentAttachmentDialog activityCode = "SOIL"
                attachmentMasterList = {
                    attachmentList
                }
                formData = {
                    formData
                }
                onDataChange = {
                    onChange
                }
                // mainFormDate={formData.date_of_sampling}
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
                    I confirm that the bearing capacity and observed strata
                    are consistent with the data recorded in this report. <
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
                    handleSoilSubmit
                }
                disabled = {!isAcknowledged || foundationLoading
                } >
                Submit Soil Test <
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
                        HistoryIcon fontSize = "small" / > Previous Evaluations
                        for this Turbine <
                        /Typography> <
                        DynamicDataTable loading = {
                            foundationLoading
                        }
                        columns = {
                            soilColumns
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

export default SoilReport;