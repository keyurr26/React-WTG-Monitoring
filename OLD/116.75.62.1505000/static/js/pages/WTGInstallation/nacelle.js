import React, {
    useEffect,
    useMemo
} from "react";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    Grid,
    TextField,
    Typography,
    Box,
    Button,
    Paper,
    MenuItem,
    Alert,
    FormControlLabel,
    Checkbox,
    IconButton,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon,
} from "@mui/icons-material";
import {
    WEATHER_OPTIONS,
    STATUS_OPTIONS
} from "../../constants/choices";
import {
    getAttachmentsForActivity
} from "../../utils/documentHelpers";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import {
    getDateLimits
} from "../../utils/dateLimits";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import NumberTextField from "../../components/comman/NumberTextField";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import {
    GetNacelleInstallation
} from "../../Redux/InstallationData/WtgInstallationData/wtgInstallationAction";
import {
    GetMaterialIssueData,
    GetMaterialRecivedData,
} from "../../Redux/MasterData/masterAction";

const NacelleInstallationForm = ({
    NacelleData = {},
    filters,
    documentList,
    buildColumns,
    turbinesData = [],
    contractors = [],
    inspectors = [],
    onNacelleChange,
    delayCauses,
    onDelaySubmit,
    onSubmitNacelle,
    attachmentMasterList = [],
    isAcknowledged,
    setIsAcknowledged,
}) => {
    const limits = getDateLimits();

    const {
        delayOpen,
        delayData,
        checkDelay,
        closeDelayPopup,
        openDelayPopup,
        handleDelaySubmit,
    } = useDelayHandler({
        activityCode: "NACELLE",
        onDelaySubmit,
    });

    const dispatch = useDispatch();

    // Fetch Material Issue and Receive Data from Redux Store
    const {
        MaterialIssueData = [], FetchMaterialRecivedData = []
    } = useSelector(
        (state) => state.masterData || {},
    );
    const {
        loading,
        nacelleInstallation = []
    } = useSelector(
        (state) => state.wtgInstallationData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !NacelleData.turbine) {
            return;
        }
        const apiPayload = {
            ...filters,
            turbine: NacelleData.turbine,
        };

        dispatch(GetNacelleInstallation(apiPayload));
    }, [
        dispatch,
        filters ? .project,
        filters ? .windfarm,
        filters ? .cluster,
        NacelleData.turbine,
    ]);

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm) return;

        dispatch(
            GetMaterialRecivedData({
                project: filters.project,
                windfarm: filters.windfarm,
                component_type: "Torque",
            }),
        );

        const issuePayload = {
            project: filters.project,
            windfarm: filters.windfarm,
        };

        if (NacelleData.turbine) {
            issuePayload.issued_turbine = NacelleData.turbine;
        }

        dispatch(GetMaterialIssueData(issuePayload));
    }, [dispatch, filters ? .project, filters ? .windfarm, NacelleData.turbine]);

    // 1. Filter material issues strictly for the currently selected turbine (Safe type casting)
    const issuedForThisTurbine = useMemo(() => {
        if (!NacelleData.turbine || !Array.isArray(MaterialIssueData)) return [];
        return MaterialIssueData.filter(
            (item) => Number(item.issued_turbine) === Number(NacelleData.turbine),
        );
    }, [MaterialIssueData, NacelleData.turbine]);

    // 2. Find specific components safely using case-insensitive partial matching
    const autoNacelle = useMemo(() => {
        return issuedForThisTurbine.find((i) =>
            i.component_type ? .toLowerCase().includes("nacelle"),
        );
    }, [issuedForThisTurbine]);

    const autoGenerator = useMemo(() => {
        return issuedForThisTurbine.find((i) =>
            i.component_type ? .toLowerCase().includes("generator"),
        );
    }, [issuedForThisTurbine]);

    const autoGearbox = useMemo(() => {
        return issuedForThisTurbine.find((i) =>
            i.component_type ? .toLowerCase().includes("gearbox"),
        );
    }, [issuedForThisTurbine]);

    const autoLift = useMemo(() => {
        return issuedForThisTurbine.find((i) =>
            i.component_type ? .toLowerCase().includes("lift"),
        );
    }, [issuedForThisTurbine]);

    // Get all bolt batches issued to this specific turbine
    const availableBolts = useMemo(() => {
        return issuedForThisTurbine.filter((i) =>
            i.component_type ? .toLowerCase().includes("bolt"),
        );
    }, [issuedForThisTurbine]);

    // 3. Auto-bind Effect for components except selectable bolts
    useEffect(() => {
        if (!NacelleData.turbine) {
            onNacelleChange("nacelle_id", "");
            onNacelleChange("generator_id", "");
            onNacelleChange("gear_box_id", "");
            onNacelleChange("lift_id", "");
            onNacelleChange("bolt_id", "");
            onNacelleChange("no_of_bolt", "");
            return;
        }

        onNacelleChange("nacelle_id", autoNacelle ? autoNacelle.id : "");
        onNacelleChange("generator_id", autoGenerator ? autoGenerator.id : "");
        onNacelleChange("gear_box_id", autoGearbox ? autoGearbox.id : "");
        onNacelleChange("lift_id", autoLift ? autoLift.id : "");
    }, [
        NacelleData.turbine,
        autoNacelle,
        autoGenerator,
        autoGearbox,
        autoLift,
        onNacelleChange,
    ]);

    // Handle changes and automatically populate no_when bolt_id changes
    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            files
        } = e.target;

        if (name === "bolt_id") {
            // Find the selected bolt batch object from available bolts
            const selectedBoltObj = availableBolts.find((b) => b.id === value);
            onNacelleChange("bolt_id", value);
            // Automatically update no_of_bolt based on the selected batch quantity
            onNacelleChange("no_of_bolt", selectedBoltObj ? .quantity || "");
        } else {
            onNacelleChange(name, type === "file" ? files[0] : value);
        }
    };

    useEffect(() => {
        if (NacelleData.turbine && NacelleData.lifting_start) {
            const currentStatus = NacelleData.nacelle_status || "in_progress";
            checkDelay(NacelleData.lifting_start, NacelleData.turbine, currentStatus);
        }
    }, [
        NacelleData.turbine,
        NacelleData.lifting_start,
        NacelleData.nacelle_status,
        checkDelay,
    ]);

    const NACELLE_HEADER_MAP = useMemo(
        () => ({
            nacelle_name: "Nacelle",
            turbine_name: "Turbine Location",
            generator_name: "Generator",
            gear_box_name: "Gear Box",
            lift_name: "Lift",
            bolt_name: "Bolt Batch no.",
            sleving_rim: "Slewing Rim",
            no_of_bolt: "No of Bolts",
            alignment_check: "Alignment Check",
            yaw_drive_details: "Yaw Drive Details",
            torque_value: "Torque Value",
            instrument_used: "Instrument Used",
            lifting_start: "Lifting Start",
            lifting_end: "Lifting End",
            weather: "Weather",
            contractor_name: "Contractor",
            supervisor_name: "Supervisor",
            nacelle_status: "Progress Status",
            evidence_photo: "Photo",
            attachments_list: "Documents",
        }), [],
    );

    const nacelleColumns = useMemo(
        () => buildColumns(NACELLE_HEADER_MAP, true), [buildColumns, NACELLE_HEADER_MAP],
    );

    const nacelleRows = useMemo(() => {
        return nacelleInstallation.map((row) => ({
            ...row,
            turbine_name: row.turbine_name,
            contractor_name: row.contractor_name,
            supervisor_name: row.supervisor_name,
            nacelle_name: row.nacelle_name,
            generator_name: row.generator_name,
            gear_box_name: row.gear_box_name,
            lift_name: row.lift_name,
            bolt_name: row.bolt_name,
            canEdit: !row.approve_date,
            approved_status: row.approve_date ? "Approved" : "Pending",
            attachments_list: getAttachmentsForActivity(
                "NACELLE",
                row.turbine,
                documentList,
            ),
        }));
    }, [nacelleInstallation, documentList]);

    const handleRemovePhoto = () => onNacelleChange("evidence_photo", null);

    const turbineSpecificLogs = nacelleRows.filter(
        (row) => Number(row.turbine) === Number(NacelleData.turbine),
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
            4
        } >
        <
        TextField select fullWidth label = "Select Turbine Location"
        name = "turbine"
        value = {
            NacelleData.turbine || ""
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
        em > Choose a Location... < /em> <
        /MenuItem> {
            turbinesData.map((t) => ( <
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
            8
        } > {
            NacelleData.turbine && ( <
                Typography variant = "body2"
                color = "primary.main"
                fontWeight = {
                    600
                } > ⚡Workspace Active
                for: {
                    " "
                } {
                    turbinesData.find((t) => t.id === NacelleData.turbine) ?
                        .location_no
                } <
                /Typography>
            )
        } <
        /Grid> <
        /Grid> <
        /Paper>

        { /* ================= STEP 2: DYNAMIC WORKSPACE ================= */ } {
            !NacelleData.turbine ? ( <
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
                Please select a turbine to load the nacelle installation form <
                /Typography> <
                /Box>
            ) : ( <
                Box >
                <
                Paper sx = {
                    {
                        p: 3,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        mb: 3
                    }
                } >
                <
                Typography variant = "h6"
                fontWeight = {
                    700
                }
                color = "primary.main"
                mb = {
                    2
                } >
                Nacelle Installation Details <
                /Typography>

                <
                Grid container spacing = {
                    2
                } > { /* Row 1: Auto-Bound Material Identification (Read-only setup matching Tower 1) */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth size = "small"
                label = "Nacelle ID"
                value = {
                    autoNacelle ? `${autoNacelle.material_name}` : "Not Issued"
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                error = {!NacelleData.nacelle_id
                }
                helperText = {!NacelleData.nacelle_id ?
                    "Nacelle ID required" :
                        "Auto-bound"
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth size = "small"
                label = "Generator ID"
                value = {
                    autoGenerator ?
                    `${autoGenerator.material_name}` :
                        "Not Issued"
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                error = {!NacelleData.generator_id
                }
                helperText = {!NacelleData.generator_id ?
                    "Generator ID required" :
                        "Auto-bound"
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth size = "small"
                label = "Gear Box ID"
                value = {
                    autoGearbox ? `${autoGearbox.material_name}` : "Not Issued"
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                error = {!NacelleData.gear_box_id
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth size = "small"
                label = "Lift ID"
                value = {
                    autoLift ? `${autoLift.material_name}` : "Not Issued"
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                error = {!NacelleData.lift_id
                }
                /> <
                /Grid>

                { /* Selectable Bolt Batch No. */ } <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Bolt Batch No."
                name = "bolt_id"
                value = {
                    NacelleData.bolt_id || ""
                }
                onChange = {
                    handleChange
                }
                error = {!NacelleData.bolt_id
                }
                helperText = {!NacelleData.bolt_id ? "Bolt ID required" : "Select batch"
                } >
                <
                MenuItem value = "" >
                <
                em > Select Bolt Batch... < /em> <
                /MenuItem> {
                    availableBolts.map((bolt) => ( <
                        MenuItem key = {
                            bolt.id
                        }
                        value = {
                            bolt.id
                        } > {
                            bolt.material_name
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                { /* Row 2: Technical & Lifting */ } <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                NumberTextField fullWidth required size = "small"
                type = "number"
                label = "No. of Bolts"
                name = "no_of_bolt"
                value = {
                    NacelleData.no_of_bolt || ""
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                error = {!NacelleData.no_of_bolt
                }
                helperText = "Auto-populated from batch"
                onChange = {
                    handleChange
                }
                /> <
                /Grid> <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                NumberTextField fullWidth size = "small"
                type = "number"
                required label = "Torque Value"
                name = "torque_value"
                value = {
                    NacelleData.torque_value || ""
                }
                error = {!NacelleData.torque_value
                }
                helperText = {!NacelleData.torque_value ? "Torque Value required" : ""
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid> { /* Instrument Used Dropdown populated from MaterialRecivedData */ } <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth required size = "small"
                label = "Instrument Used"
                name = "instrument_used"
                value = {
                    NacelleData.instrument_used || ""
                }
                error = {!NacelleData.instrument_used
                }
                helperText = {!NacelleData.instrument_used ? "Instrument required" : ""
                }
                onChange = {
                    handleChange
                } >
                <
                MenuItem value = "" >
                <
                em > Select Torque Tool... < /em> <
                /MenuItem> {
                    FetchMaterialRecivedData.map((tool) => ( <
                        MenuItem key = {
                            tool.id
                        }
                        value = {
                            tool.material_name
                        } > {
                            tool.material_name
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid> <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                TextField fullWidth size = "small"
                label = "Slewing Rim"
                name = "sleving_rim"
                value = {
                    NacelleData.sleving_rim || ""
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid> <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                TextField fullWidth required size = "small"
                label = "Alignment"
                name = "alignment_check"
                value = {
                    NacelleData.alignment_check || ""
                }
                onChange = {
                    handleChange
                }
                error = {!NacelleData.alignment_check
                }
                helperText = {!NacelleData.alignment_check ? "Alignment required" : ""
                }
                /> <
                /Grid>

                { /* Row 3: Timings & Weather */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth size = "small"
                type = "datetime-local"
                label = "Lifting Start"
                name = "lifting_start"
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                inputProps = {
                    limits.dateTime
                }
                value = {
                    NacelleData.lifting_start || ""
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
                    3
                } >
                <
                TextField fullWidth size = "small"
                type = "datetime-local"
                label = "Lifting End"
                name = "lifting_end"
                disabled = {!NacelleData.lifting_start
                }
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                inputProps = {
                    {
                        ...limits.dateTime,
                        min: NacelleData.lifting_start || "",
                    }
                }
                value = {
                    NacelleData.lifting_end || ""
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
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Weather"
                name = "weather"
                value = {
                    NacelleData.weather || ""
                }
                onChange = {
                    handleChange
                } >
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

                { /* Row 4: Responsibility & Status */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Contractor"
                name = "contractor"
                value = {
                    NacelleData.contractor || ""
                }
                onChange = {
                    handleChange
                } >
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
                    3
                } >
                <
                TextField select required fullWidth size = "small"
                label = "Supervisor"
                name = "supervisor"
                value = {
                    NacelleData.supervisor || ""
                }
                onChange = {
                    handleChange
                }
                error = {!NacelleData.supervisor
                }
                helperText = {!NacelleData.supervisor ? "Supervisor required" : ""
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
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Status"
                name = "nacelle_status"
                value = {
                    NacelleData.nacelle_status || ""
                }
                onChange = {
                    handleChange
                }
                required >
                {
                    STATUS_OPTIONS.map((opt) => ( <
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
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth size = "small"
                label = "Yaw Drive Details"
                name = "yaw_drive_details"
                value = {
                    NacelleData.yaw_drive_details || ""
                }
                onChange = {
                    handleChange
                }
                error = {!NacelleData.yaw_drive_details
                }
                helperText = {!NacelleData.yaw_drive_details ? "Details required" : ""
                }
                /> <
                /Grid>

                <
                Grid item xs = {
                    9
                } >
                <
                TextField fullWidth multiline name = "remarks"
                rows = {
                    1
                }
                size = "small"
                label = "Remarks"
                value = {
                    NacelleData.remarks || ""
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* Row 5: Photo & Attachments */ } <
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
                        border: "1px dashed #ccc",
                        borderRadius: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 1.5,
                    }
                } >
                <
                Button component = "label"
                variant = "outlined"
                startIcon = { < UploadIcon / >
                }
                size = "small" >
                Evidence Photo <
                input type = "file"
                hidden accept = "image/*"
                name = "evidence_photo"
                onChange = {
                    handleChange
                }
                /> <
                /Button>

                {
                    NacelleData ? .evidence_photo && ( <
                        Box sx = {
                            {
                                position: "relative",
                                width: 220,
                                mt: 1
                            }
                        } >
                        <
                        img src = {
                            typeof NacelleData.evidence_photo === "string" ?
                            NacelleData.evidence_photo :
                                URL.createObjectURL(NacelleData.evidence_photo)
                        }
                        alt = "Nacelle Evidence Preview"
                        style = {
                            {
                                width: "100%",
                                borderRadius: 8,
                                border: "1px solid #ccc",
                            }
                        }
                        /> <
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
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } >
                <
                DocumentAttachmentDialog activityCode = "NACELLE"
                attachmentMasterList = {
                    attachmentMasterList
                }
                formData = {
                    NacelleData
                }
                onDataChange = {
                    onNacelleChange
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

                { /* Action Bar */ } <
                Grid item xs = {
                    12
                } >
                <
                Alert severity = "info"
                icon = {
                    false
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
                    size = "small" /
                    >
                }
                label = { <
                    Typography variant = "body2" >
                    I verify mechanical / electrical connections & safety
                    checks. <
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
                        mt: 2
                    }
                } >
                <
                Button variant = "contained"
                size = "small"
                onClick = {
                    onSubmitNacelle
                }
                disabled = {!isAcknowledged || loading
                } >
                Submit Nacelle <
                /Button> <
                /Box> <
                /Paper>

                { /* ================= STEP 3: FILTERED HISTORY ================= */ } {
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
                        } > 📋Installation History
                        for this Turbine <
                        /Typography> <
                        DynamicDataTable loading = {
                            loading
                        }
                        columns = {
                            nacelleColumns
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
        } <
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

export default NacelleInstallationForm;