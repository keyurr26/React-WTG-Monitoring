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
    IconButton
} from "@mui/material";
import {
    getAttachmentsForActivity
} from "../../utils/documentHelpers";
import {
    WEATHER_OPTIONS,
    TOWER_OPTIONS,
    STATUS_OPTIONS
} from "../../constants/choices";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import {
    getDateLimits
} from "../../utils/dateLimits";
import {
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon
} from "@mui/icons-material";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import NumberTextField from "../../components/comman/NumberTextField";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import {
    GetTowerInstallations
} from "../../Redux/InstallationData/WtgInstallationData/wtgInstallationAction";
import {
    GetMaterialIssueData,
    GetMaterialRecivedData
} from "../../Redux/MasterData/masterAction";

const TowerInstallationForm = ({
    data = {},
    onChange,
    filters,
    buildColumns,
    documentList,
    turbinesData = [],
    contractors = [],
    inspectors = [],
    // materialData,
    delayCauses,
    onDelaySubmit,
    onSubmitTowerInstallation,
    attachmentMasterList = [],
    isAcknowledged,
    setIsAcknowledged,
}) => {
    const limits = getDateLimits();

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
        activityCode: "TOWER_INSTALL",
        onDelaySubmit,
    });

    const dispatch = useDispatch();
    const {
        loading,
        towersInstallations = []
    } = useSelector(
        (state) => state.wtgInstallationData || {},
    );
    const {
        MaterialIssueData = [], FetchMaterialRecivedData = []
    } = useSelector(
        (state) => state.masterData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !data.turbine) {
            return;
        }
        const apiPayload = {
            ...filters,
            turbine: data.turbine,
        };

        dispatch(GetTowerInstallations(apiPayload));
    }, [
        dispatch,
        filters ? .project,
        filters ? .windfarm,
        filters ? .cluster,
        data.turbine,
    ]);

    // const handleChange = (e) => {
    //   const { name, value, type, files } = e.target;
    //   onChange(name, type === "file" ? files[0] : value);

    // };

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

        if (data.turbine) {
            issuePayload.issued_turbine = data.turbine;
        }

        dispatch(GetMaterialIssueData(issuePayload));
    }, [dispatch, filters ? .project, filters ? .windfarm, data.turbine]);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            files
        } = e.target;
        const val =
            type === "file" ? (files && files.length > 0 ? files[0] : null) : value;

        if (name === "turbine") {
            clearDelay();
        }

        onChange(name, val);
    };

    useEffect(() => {
        const turbine = data.turbine;
        const startDate = data.lifting_start;
        const status = data.tower_status;

        if (turbine && startDate && status) {
            checkDelay(startDate, turbine, status);
        }
    }, [data.turbine, data.lifting_start, data.tower_status, checkDelay]);

    // 1. Filter issued materials specifically for the active/selected turbine
    const turbineIssuedMaterials = useMemo(() => {
        if (!data.turbine) return [];
        return MaterialIssueData.filter(
            (m) => Number(m.issued_turbine) === Number(data.turbine),
        );
    }, [MaterialIssueData, data.turbine]);

    const usedMaterialIds = useMemo(() => {
        return towersInstallations
            .filter((row) => Number(row.turbine) !== Number(data.turbine)) // Exclude current turbine if editing
            .map((row) => row.bolt_id);
    }, [towersInstallations, data.turbine]);

    // Find max available quantity for the currently selected bolt batch ID
    const selectedBoltBatch = useMemo(() => {
        if (!data.bolt_id) return null;
        return turbineIssuedMaterials.find((m) => Number(m.id) === Number(data.bolt_id));
    }, [turbineIssuedMaterials, data.bolt_id]);

    const maxBoltsAllowed = selectedBoltBatch ? Number(selectedBoltBatch.quantity || selectedBoltBatch.qty || 0) : null;
    const isBoltQtyExceeded = maxBoltsAllowed !== null && Number(data.no_of_bolts) > maxBoltsAllowed;

    const TOWER_INSTALLATION_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            tower_no: "Tower No",
            bolt_id: "Bolt Batch",
            no_of_bolts: "No of Bolts",
            torque_value: "Torque Value",
            instrument_used: "Instrument Used",
            manufacturer: "Manufacturer",
            alignment_check: "Alignment Check",
            crane_id_model: "Crane ID / Model",
            lifting_start: "Lifting Start",
            lifting_end: "Lifting End",
            tower_status: "Progress Status",
            contractor_name: "Contractor",
            supervisor_name: "Supervisor",
            weather: "Weather",
            // remarks: "Remarks",
            evidence_photo: "Photo",
            attachments_list: "Documents",
        }), [],
    );

    const towerColumns = useMemo(
        () => buildColumns(TOWER_INSTALLATION_HEADER_MAP, true), [buildColumns, TOWER_INSTALLATION_HEADER_MAP],
    );

    const towersRows = useMemo(() => {
        return (
            towersInstallations
            // .filter((row) => Number(row.cluster) === Number(filters.cluster))
            .map((row) => ({
                ...row,
                turbine_name: row.turbine_name,
                contractor_name: row.contractor_name,
                supervisor_name: row.supervisor_name,
                canEdit: !row.approve_date,
                approved_status: row.approve_date ? "Approved" : "Pending",
                attachments_list: getAttachmentsForActivity(
                    "TOWER_INSTALL",
                    row.turbine,
                    documentList,
                ),
            }))
        );
    }, [towersInstallations, documentList]);



    const handleRemovePhoto = () => onChange("evidence_photo", null);

    // Filter logs for the selected turbine only
    const turbineSpecificLogs = towersRows.filter(
        (row) => Number(row.turbine) === Number(data.turbine),
    );

    const existingTowerNumbers = towersInstallations
        .filter((row) => Number(row.turbine) === Number(data.turbine))
        .map((row) => row.tower_no);

    return ( <
        Box sx = {
            {
                p: 3,
                maxWidth: "lg",
                mx: "auto"
            }
        } > { /* 1. TOP SELECTION BAR */ } <
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
            data.turbine || ""
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
            data.turbine && ( <
                Typography variant = "body2"
                color = "primary.main"
                fontWeight = {
                    600
                } > ⚡Workspace Active
                for: {
                    " "
                } {
                    turbinesData.find((t) => t.id === data.turbine) ? .location_no
                } <
                /Typography>
            )
        } <
        /Grid> <
        /Grid> <
        /Paper>

        { /* 2. DYNAMIC WORKSPACE */ } {
            !data.turbine ? ( <
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
                Please select a turbine to load the installation form <
                /Typography> <
                /Box>
            ) : ( <
                Box >
                <
                Paper sx = {
                    {
                        p: 3,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2
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
                Tower Installation Details <
                /Typography>

                <
                Grid container spacing = {
                    2
                } > { /* Row 1: Tower Selection & Bolts */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select required fullWidth size = "small"
                label = "Tower Section"
                name = "tower_no"
                value = {
                    data.tower_no
                }
                onChange = {
                    handleChange
                }
                error = {!data.tower_no
                }
                helperText = {!data.tower_no ? "Tower Section is required" : ""
                } >
                {
                    TOWER_OPTIONS.map((opt) => ( <
                        MenuItem key = {
                            opt.value
                        }
                        value = {
                            opt.value
                        }
                        disabled = {
                            existingTowerNumbers.includes(opt.value)
                        } >
                        {
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
                TextField select required fullWidth size = "small"
                label = "Bolt ID"
                name = "bolt_id"
                value = {
                    data.bolt_id
                }
                error = {!data.bolt_id
                }
                helperText = {!data.bolt_id ? "Bolt ID is required" : ""
                }
                onChange = {
                    handleChange
                } >
                {
                    turbineIssuedMaterials
                    .filter(
                        (m) =>
                        m.component_type === "Bolt" &&
                        !usedMaterialIds.includes(m.id),
                    )
                    .map((m) => ( <
                        MenuItem key = {
                            m.id
                        }
                        value = {
                            m.id
                        } > {
                            m.material_name
                        } {
                            " "
                        } {
                            m.material_sr_no ? `(batch no: ${m.material_sr_no})` : ""
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
                NumberTextField fullWidth required size = "small"
                type = "number"
                label = "No. of Bolts"
                name = "no_of_bolts"
                value = {
                    data.no_of_bolts
                }
                onChange = {
                    handleChange
                }
                error = {!data.no_of_bolts || isBoltQtyExceeded
                }
                helperText = {!data.no_of_bolts ?
                    "No. of Bolts is required" :
                        isBoltQtyExceeded ?
                        `Exceeds max available batch quantity (${maxBoltsAllowed})` :
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
                TextField fullWidth required size = "small"
                label = "Alignment Check"
                name = "alignment_check"
                value = {
                    data.alignment_check
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* Row 2: Torque & Technical */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                NumberTextField fullWidth required size = "small"
                type = "number"
                label = "Torque Value"
                name = "torque_value"
                value = {
                    data.torque_value
                }
                onChange = {
                    handleChange
                }
                error = {!data.torque_value
                }
                helperText = {!data.torque_value ? "Torque Value is required" : ""
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
                TextField select fullWidth required size = "small"
                label = "Instrument Used"
                name = "instrument_used"
                value = {
                    data.instrument_used || ""
                }
                error = {!data.instrument_used
                }
                helperText = {!data.instrument_used ? "Instrument required" : ""
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
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth size = "small"
                label = "Manufacturer"
                name = "manufacturer"
                value = {
                    data.manufacturer
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* Row 3: Crane Info & Weather */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select required fullWidth size = "small"
                label = "Crane ID / Model"
                name = "crane_id_model"
                value = {
                    data.crane_id_model
                }
                error = {!data.crane_id_model
                }
                helperText = {!data.crane_id_model ? "Crane ID is required" : ""
                }
                onChange = {
                    handleChange
                } >
                {
                    turbineIssuedMaterials
                    .filter((m) => m.component_type === "Crane")
                    .map((m) => ( <
                        MenuItem key = {
                            m.id
                        }
                        value = {
                            m.material
                        } > {
                            m.material_name
                        } {
                            " "
                        } {
                            m.material_sr_no ? `- [${m.material_sr_no}]` : ""
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
                NumberTextField fullWidth size = "small"
                label = "Crane Capacity"
                name = "crane_capacity"
                value = {
                    data.crane_capacity
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
                TextField select required fullWidth size = "small"
                label = "Weather"
                name = "weather"
                value = {
                    data.weather
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

                { /* Row 4: Lifting Timeline */ } <
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
                    data.lifting_start
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
                disabled = {!data.lifting_start
                }
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                inputProps = {
                    {
                        ...limits.dateTime,
                        min: data.lifting_start || undefined,
                    }
                }
                value = {
                    data.lifting_end
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* Row 5: Responsibility */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select required fullWidth size = "small"
                label = "Contractor"
                name = "contractor"
                value = {
                    data.contractor
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
                TextField select fullWidth required size = "small"
                label = "Supervisor"
                name = "supervisor"
                value = {
                    data.supervisor
                }
                onChange = {
                    handleChange
                }
                error = {!data.supervisor
                }
                helperText = {!data.supervisor ? "Supervisor is required" : ""
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
                TextField select fullWidth required size = "small"
                label = "Status"
                name = "tower_status"
                value = {
                    data.tower_status || ""
                }
                onChange = {
                    handleChange
                } >
                <
                MenuItem value = "" > Select Status < /MenuItem> {
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
                TextField fullWidth multiline rows = {
                    1
                }
                size = "small"
                label = "Remarks"
                name = "remarks"
                value = {
                    data.remarks
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

                { /* Realtime Display Preview Panel */ } {
                    data.evidence_photo && ( <
                        Box mt = {
                            2
                        }
                        sx = {
                            {
                                position: "relative",
                                width: 220
                            }
                        } >
                        <
                        img src = {
                            typeof data.evidence_photo === "string" ?
                            data.evidence_photo :
                                URL.createObjectURL(data.evidence_photo)
                        }
                        alt = "Evidence Preview"
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
                DocumentAttachmentDialog activityCode = "TOWER_INSTALL"
                attachmentMasterList = {
                    attachmentMasterList
                }
                formData = {
                    data
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

                { /* Row 7: Action Bar */ } <
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
                    size = "small" /
                    >
                }
                label = { <
                    Typography variant = "body2" >
                    Ensure all tower sections are installed and verified
                    before moving to nacelle installation. <
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
                    onSubmitTowerInstallation
                }
                disabled = {!isAcknowledged || loading || isBoltQtyExceeded
                } >
                Submit Installation <
                /Button> <
                /Box> <
                /Paper>

                { /* 3. HISTORY TABLE */ } {
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
                        for this Location <
                        /Typography> <
                        DynamicDataTable loading = {
                            loading
                        }
                        columns = {
                            towerColumns
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

export default TowerInstallationForm;