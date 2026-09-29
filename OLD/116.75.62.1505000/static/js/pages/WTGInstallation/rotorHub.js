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
    GetRotorHubInstallations
} from "../../Redux/InstallationData/WtgInstallationData/wtgInstallationAction";
import {
    GetMaterialIssueData,
    GetMaterialRecivedData,
} from "../../Redux/MasterData/masterAction";

const RotorHubForm = ({
    rotorHubData = {},
    filters,
    documentList,
    onRotorHubChange,
    turbinesData = [],
    contractors = [],
    buildColumns,
    inspectors = [],
    delayCauses,
    onDelaySubmit,
    onSubmitRotorHub,
    attachmentMasterList = [],
    isAcknowledged,
    setIsAcknowledged,
}) => {
    const limits = getDateLimits();

    const {
        delayOpen,
        delayData,
        //  delaySaved,
        checkDelay,
        closeDelayPopup,
        openDelayPopup,
        handleDelaySubmit,
        clearDelay,
    } = useDelayHandler({
        activityCode: "ROTOR_HUB",
        onDelaySubmit,
    });

    const dispatch = useDispatch();
    const {
        MaterialIssueData = [], FetchMaterialRecivedData = []
    } = useSelector(
        (state) => state.masterData || {},
    );
    const {
        loading,
        rotorHubInstallations = []
    } = useSelector(
        (state) => state.wtgInstallationData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !rotorHubData.turbine) {
            return;
        }
        const apiPayload = {
            ...filters,
            turbine: rotorHubData.turbine,
        };

        dispatch(GetRotorHubInstallations(apiPayload));
    }, [
        dispatch,
        filters ? .project,
        filters ? .windfarm,
        filters ? .cluster,
        rotorHubData.turbine,
    ]);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            files
        } = e.target;
        onRotorHubChange(name, type === "file" ? files[0] : value);
    };

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

        if (rotorHubData.turbine) {
            issuePayload.issued_turbine = rotorHubData.turbine;
        }

        dispatch(GetMaterialIssueData(issuePayload));
    }, [dispatch, filters ? .project, filters ? .windfarm, rotorHubData.turbine]);

    // 1. Filter material issues strictly tied to the selected turbine using issued_turbine
    const turbineMaterialIssues = useMemo(() => {
        if (!rotorHubData.turbine) return [];
        return MaterialIssueData.filter(
            (m) => Number(m.issued_turbine) === Number(rotorHubData.turbine),
        );
    }, [MaterialIssueData, rotorHubData.turbine]);

    // 2. Find specific component records for Hub and Bolt
    const autoHub = useMemo(
        () => turbineMaterialIssues.find((m) => m.component_type === "Hub"), [turbineMaterialIssues],
    );

    // 3. Get all issued bolts for this turbine location
    const availableBolts = useMemo(() => {
        return turbineMaterialIssues.filter((m) => m.component_type === "Bolt");
    }, [turbineMaterialIssues]);

    // 4. Find the currently selected bolt object based on form state's bolt_id
    const selectedBoltObject = useMemo(() => {
        return availableBolts.find(
            (b) => Number(b.id) === Number(rotorHubData.bolt_id),
        );
    }, [availableBolts, rotorHubData.bolt_id]);

    // 5. Auto-bind Hub, but let Bolt ID be selectable by user
    useEffect(() => {
        if (!rotorHubData.turbine) {
            onRotorHubChange("hub_serial_number", "");
            onRotorHubChange("bolt_id", "");
            onRotorHubChange("no_of_bolt", "");
            return;
        }

        if (!rotorHubData.hub_serial_number && autoHub) {
            onRotorHubChange("hub_serial_number", autoHub.id);
        }
    }, [
        rotorHubData.turbine,
        autoHub,
        rotorHubData.hub_serial_number,
        onRotorHubChange,
    ]);
    useEffect(() => {
        if (rotorHubData.turbine && rotorHubData.lifting_start) {
            const currentStatus = rotorHubData.rotor_status || "in_progress";
            checkDelay(
                rotorHubData.lifting_start,
                rotorHubData.turbine,
                currentStatus,
            );
        }
    }, [
        rotorHubData.turbine,
        rotorHubData.lifting_start,
        rotorHubData.rotor_status,
        checkDelay,
    ]);

    const ROTOR_HUB_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            bolt_name: "Bolt",
            no_of_bolt: "No of Bolts",
            torque_value: "Torque Value",
            bolt_size_grade: "Bolt Size / Grade",
            lubricant_used: "Lubricant Used",
            instrument_used: "Instrument Used",
            hub_name: "Hub Name",
            material_grade: "Material Grade",
            weight: "Weight",
            pitch_type: "Pitch Type",
            lifting_start: "Lifting Start",
            lifting_end: "Lifting End",
            weather: "Weather",
            contractor_name: "Contractor",
            supervisor_name: "Supervisor",
            // remarks: "Remarks",
            rotor_status: "Progress Status",
            evidence_photo: "Photo",
            attachments_list: "Documents",
        }), [],
    );

    const rotorHubColumns = useMemo(
        () => buildColumns(ROTOR_HUB_HEADER_MAP, true), [buildColumns, ROTOR_HUB_HEADER_MAP],
    );

    // 4. Rotor Hub Installation
    const rotorRows = useMemo(() => {
        return (
            rotorHubInstallations
            // .filter((row) => Number(row.cluster) === Number(filters.cluster))
            .map((row) => ({
                ...row,
                turbine_name: row.turbine_name,
                contractor_name: row.contractor_name,
                supervisor_name: row.supervisor_name,
                nacelle_name: row.nacelle_name,
                bolt_name: row.bolt_name,
                canEdit: !row.approve_date,
                approved_status: row.approve_date ? "Approved" : "Pending",
                attachments_list: getAttachmentsForActivity(
                    "ROTOR_HUB",
                    row.turbine,
                    documentList,
                ),
            }))
        );
    }, [rotorHubInstallations, documentList]);

    const handleRemovePhoto = () => onRotorHubChange("evidence_photo", null);

    const maxAllowedBolts =
        selectedBoltObject ? .quantity || selectedBoltObject ? .available_qty || 0;
    const isBoltCountInvalid =
        Boolean(rotorHubData.bolt_id) &&
        (Number(rotorHubData.no_of_bolt) <= 0 ||
            Number(rotorHubData.no_of_bolt) > maxAllowedBolts);

    // Filter logs for the selected turbine only
    const turbineSpecificLogs = rotorRows.filter(
        (row) => Number(row.turbine) === Number(rotorHubData.turbine),
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
            rotorHubData.turbine || ""
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
            rotorHubData.turbine && ( <
                Typography variant = "body2"
                color = "primary.main"
                fontWeight = {
                    600
                } > ⚡Workspace Active
                for: {
                    " "
                } {
                    turbinesData.find((t) => t.id === rotorHubData.turbine) ?
                        .location_no
                } <
                /Typography>
            )
        } <
        /Grid> <
        /Grid> <
        /Paper>

        { /* ================= STEP 2: DYNAMIC WORKSPACE ================= */ } {
            !rotorHubData.turbine ? ( <
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
                Please select a turbine to load the rotor hub installation form <
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
                Rotor Hub Installation Details <
                /Typography>

                <
                Grid container spacing = {
                    2
                } > { /* Row 1: Rotor Hub & Components */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth size = "small"
                label = "Hub Serial Number"
                name = "hub_serial_number"
                value = {
                    autoHub ?
                    `${autoHub.material_name}` :
                        rotorHubData.hub_serial_number ?
                        "Selected (ID)" :
                        "Not Issued"
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                error = {!rotorHubData.hub_serial_number
                }
                helperText = {!rotorHubData.hub_serial_number ?
                    "Hub Serial Number required" :
                        "Auto-bound"
                }
                /> <
                /Grid> { /* Row: Selectable Bolt ID Dropdown */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select fullWidth size = "small"
                label = "Select Bolt Batch (Turbine Wise)"
                name = "bolt_id"
                value = {
                    rotorHubData.bolt_id || ""
                }
                onChange = {
                    handleChange
                }
                error = {!rotorHubData.bolt_id
                }
                helperText = {!rotorHubData.bolt_id ? "Bolt ID required" : "Select batch"
                } >
                <
                MenuItem value = "" >
                <
                em > Choose Bolt Batch... < /em> <
                /MenuItem> {
                    availableBolts.map((bolt) => ( <
                        MenuItem key = {
                            bolt.id
                        }
                        value = {
                            bolt.id
                        } > {
                            bolt.material_sr_no || bolt.material_name
                        }(Avail: {
                            " "
                        } {
                            bolt.quantity || bolt.available_qty || 0
                        }) <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                { /* Row: No. of Bolts with Batch Limit Validation */ } <
                Grid item xs = {
                    6
                }
                md = {
                    4
                } >
                <
                TextField fullWidth required size = "small"
                type = "number"
                label = "No. of Bolts"
                name = "no_of_bolt"
                value = {
                    rotorHubData.no_of_bolt || ""
                }
                onChange = {
                    handleChange
                }
                disabled = {!rotorHubData.bolt_id
                }
                error = {
                    isBoltCountInvalid || !rotorHubData.no_of_bolt
                }
                helperText = {!rotorHubData.no_of_bolt ?
                    "Add No. of Bolts" :
                        isBoltCountInvalid ?
                        `Cannot exceed batch max limit (${maxAllowedBolts})` :
                        ""
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
                TextField fullWidth size = "small"
                label = "Bolt Size & Grade"
                name = "bolt_size_grade"
                value = {
                    rotorHubData.bolt_size_grade
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
                type = "number"
                label = "Torque Value"
                name = "torque_value"
                value = {
                    rotorHubData.torque_value
                }
                onChange = {
                    handleChange
                }
                error = {!rotorHubData.torque_value
                }
                helperText = {!rotorHubData.torque_value ?
                    "Torque Value Used is required" :
                        ""
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
                TextField select fullWidth required size = "small"
                label = "Instrument Used"
                name = "instrument_used"
                value = {
                    rotorHubData.instrument_used || ""
                }
                error = {!rotorHubData.instrument_used
                }
                helperText = {!rotorHubData.instrument_used ? "Instrument required" : ""
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
                /Grid> { /* Row 3: Material & Pitch */ } <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                TextField fullWidth required size = "small"
                label = "Lubricant Used"
                name = "lubricant_used"
                value = {
                    rotorHubData.lubricant_used
                }
                error = {!rotorHubData.lubricant_used
                }
                helperText = {!rotorHubData.lubricant_used ?
                    "Lubricant Used is required" :
                        ""
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
                    4
                } >
                <
                TextField fullWidth size = "small"
                label = "Material Grade"
                name = "material_grade"
                value = {
                    rotorHubData.material_grade
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
                    4
                } >
                <
                NumberTextField fullWidth size = "small"
                label = "Weight"
                name = "weight"
                value = {
                    rotorHubData.weight
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
                    4
                } >
                <
                TextField fullWidth size = "small"
                label = "Pitch Type"
                name = "pitch_type"
                value = {
                    rotorHubData.pitch_type
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* Row 4: Lifting & Weather */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
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
                    rotorHubData.lifting_start
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
                TextField fullWidth size = "small"
                type = "datetime-local"
                label = "Lifting End"
                name = "lifting_end"
                disabled = {!rotorHubData.lifting_start
                }
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                inputProps = {
                    {
                        ...limits.dateTime,
                        min: rotorHubData.lifting_start || "",
                    }
                }
                value = {
                    rotorHubData.lifting_end
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
                TextField select fullWidth size = "small"
                label = "Weather"
                name = "weather"
                value = {
                    rotorHubData.weather
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

                { /* Row 5: Responsibility & Status */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select fullWidth size = "small"
                label = "Contractor"
                name = "contractor"
                value = {
                    rotorHubData.contractor
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
                    4
                } >
                <
                TextField select required fullWidth size = "small"
                label = "Supervisor"
                name = "supervisor"
                value = {
                    rotorHubData.supervisor
                }
                onChange = {
                    handleChange
                }
                error = {!rotorHubData.supervisor
                }
                helperText = {!rotorHubData.supervisor ? "Supervisor is required" : ""
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
                TextField select fullWidth size = "small"
                label = "Status"
                name = "rotor_status"
                value = {
                    rotorHubData.rotor_status || ""
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
                /Grid>

                <
                Grid item xs = {
                    12
                } >
                <
                TextField fullWidth multiline name = "remarks"
                rows = {
                    1
                }
                size = "small"
                label = "Remarks"
                value = {
                    rotorHubData.remarks
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* Row 6: Attachments */ } <
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
                        flexDirection: "column", // Stacks button and image vertically
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
                } // 🔥 FIX: Switch to local handleChange to unpack files[0] correctly
                /> <
                /Button>

                { /* 🔥 FIX: Real-time Live Image Preview Block */ } {
                    rotorHubData ? .evidence_photo && ( <
                        Box sx = {
                            {
                                position: "relative",
                                width: 220,
                                mt: 1
                            }
                        } >
                        <
                        img src = {
                            typeof rotorHubData.evidence_photo === "string" ?
                            rotorHubData.evidence_photo // Renders database link if editing an existing row
                            :
                                URL.createObjectURL(rotorHubData.evidence_photo) // Renders newly selected image file
                        }
                        alt = "Rotor Hub Evidence Preview"
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
                DocumentAttachmentDialog activityCode = "ROTOR_HUB"
                attachmentMasterList = {
                    attachmentMasterList
                }
                formData = {
                    rotorHubData
                }
                onDataChange = {
                    onRotorHubChange
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
                }
                sx = {
                    {
                        mt: 1,
                        width: "97%",
                        "& .MuiAlert-message": {
                            width: "100%",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                        },
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
                    size = "small" /
                    >
                }
                label = { <
                    Typography variant = "body2" >
                    Ensure proper alignment and secure fastening before
                    blade installation. <
                    /Typography>
                }
                /> <
                Button variant = "contained"
                size = "small"
                onClick = {
                    onSubmitRotorHub
                }
                disabled = {!isAcknowledged || loading
                } >
                Submit Rotor Hub <
                /Button> <
                /Alert> <
                /Grid> <
                /Grid> <
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
                            rotorHubColumns
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

export default RotorHubForm;