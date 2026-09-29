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
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon,
} from "@mui/icons-material";
import {
    getAttachmentsForActivity
} from "../../utils/documentHelpers";
import IconButton from "@mui/material/IconButton";
import {
    WEATHER_OPTIONS
} from "../../constants/choices";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import {
    getDateLimits
} from "../../utils/dateLimits";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import NumberTextField from "../../components/comman/NumberTextField";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import {
    GetT1InstalltionData
} from "../../Redux/InstallationData/WtgInstallationData/wtgInstallationAction";
import {
    GetMaterialIssueData,
    GetMaterialRecivedData,
} from "../../Redux/MasterData/masterAction";

const Tower1 = ({
    t1Data = {},
    filters,
    buildColumns,
    documentList,
    turbinesData = [],
    contractors = [],
    inspectors = [],
    onT1Change,
    columnsT1Data = [],
    delayCauses,
    onDelaySubmit,
    onSubmitTower1,
    isAcknowledged,
    setIsAcknowledged,
    attachmentMasterList = [],
}) => {
    const limits = getDateLimits();

    const {
        delayOpen,
        delayData,
        delaySaved,
        checkDelay,
        closeDelayPopup,
        openDelayPopup,
        handleDelaySubmit,
        clearDelay,
    } = useDelayHandler({
        activityCode: "T1_INSTALL",
        onDelaySubmit,
    });

    const dispatch = useDispatch();
    const {
        loading,
        t1installation = []
    } = useSelector(
        (state) => state.wtgInstallationData || {},
    );

    const {
        MaterialIssueData = [], FetchMaterialRecivedData = []
    } = useSelector(
        (state) => state.masterData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !t1Data.turbine) {
            return;
        }
        const apiPayload = {
            ...filters,
            turbine: t1Data.turbine,
        };

        dispatch(GetT1InstalltionData(apiPayload));
    }, [
        dispatch,
        filters ? .project,
        filters ? .windfarm,
        filters ? .cluster,
        t1Data.turbine,
    ]);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            files
        } = e.target;
        const val = type === "file" ? files[0] : value;

        if (name === "no_of_bolts") {
            const numericVal = value === "" ? "" : Math.max(0, Number(value));
            onT1Change(name, numericVal);
            return;
        }

        onT1Change(name, val);
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

        if (t1Data.turbine) {
            issuePayload.issued_turbine = t1Data.turbine;
        }

        dispatch(GetMaterialIssueData(issuePayload));
    }, [dispatch, filters ? .project, filters ? .windfarm, t1Data.turbine]);

    // 1. Filter material issues strictly for the currently selected turbine
    const issuedForThisTurbine = useMemo(() => {
        if (!t1Data.turbine) return [];
        return MaterialIssueData.filter(
            (item) => Number(item.issued_turbine) === Number(t1Data.turbine),
        );
    }, [MaterialIssueData, t1Data.turbine]);

    // 2. Find specific components for this turbine
    const autoTowerMaterial = useMemo(() => {
        return issuedForThisTurbine.find((i) =>
            i.component_type ? .toLowerCase().includes("tower 1"),
        );
    }, [issuedForThisTurbine]);

    const availableBatches = useMemo(() => {
        return issuedForThisTurbine.filter(
            (i) =>
            i.component_type ? .toLowerCase().includes("bolt") ||
            i.component_type ? .toLowerCase().includes("batch"),
        );
    }, [issuedForThisTurbine]);

    // Find the currently selected batch object based on t1Data.batch_no
    const selectedBatchObject = useMemo(() => {
        return availableBatches.find((b) => b.id === t1Data.batch_no);
    }, [availableBatches, t1Data.batch_no]);

    // 3. Auto-bind effect for material selection
    useEffect(() => {
        if (!t1Data.turbine) {
            if (t1Data.material || t1Data.batch_no || t1Data.no_of_bolts) {
                onT1Change("material", "");
                onT1Change("batch_no", "");
                onT1Change("no_of_bolts", "");
            }
            return;
        }

        // Bind Tower 1 Material ID
        onT1Change("material", autoTowerMaterial ? .id || "");
    }, [t1Data.turbine, autoTowerMaterial, onT1Change]);

    const maxBoltQuantity = selectedBatchObject ? .quantity || 0;
    const isBoltsInvalid = !t1Data.no_of_bolts ||
        Number(t1Data.no_of_bolts) <= 0 ||
        Number(t1Data.no_of_bolts) > maxBoltQuantity;

    useEffect(() => {
        if (t1Data.turbine && t1Data.lifting_start) {
            const currentStatus = t1Data.t1_status || "in_progress";
            checkDelay(t1Data.lifting_start, t1Data.turbine, currentStatus);
        }
    }, [t1Data.turbine, t1Data.lifting_start, t1Data.t1_status, checkDelay]);

    const T1_INSTALLATION_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            leveling: "Leveling",
            grouting: "Grouting",
            grouting_curing: "Grouting Curing",
            alignment_check: "Alignment Check",
            no_of_bolts: "No of Bolts",
            torque_value: "Torque Value",
            instrument_used: "Instrument Used",
            material: "Material",
            batch_no: "Batch No",
            grout_material_type: "Grout Material Type",
            grouting_curing_days: "Curing Days",
            lifting_start: "Lifting Start",
            lifting_end: "Lifting End",
            bolt_size: "Bolt Size",
            weather_conditions: "Weather",
            supervisor_name: "Supervisor",
            t1_status: "Progress Status",
            contractor_name: "Contractor",
            evidence_photo: "Photo",
            attachments_list: "Documents",
        }), [],
    );

    const t1Columns = useMemo(
        () => buildColumns(T1_INSTALLATION_HEADER_MAP, true), [buildColumns, T1_INSTALLATION_HEADER_MAP],
    );

    const t1Rows = useMemo(() => {
        return t1installation.map((row) => ({
            ...row,
            turbine_name: row.turbine_name,
            contractor_name: row.contractor_name,
            supervisor_name: row.supervisor_name,
            canEdit: !row.approve_date,
            approved_status: row.approve_date ? "Approved" : "Pending",
            attachments_list: getAttachmentsForActivity(
                "T1_INSTALL",
                row.turbine,
                documentList,
            ),
        }));
    }, [t1installation, documentList]);

    const handleRemovePhoto = () => {
        onT1Change("evidence_photo", null);
    };

    const formatToDateTimeLocal = (value) => {
        if (!value) return "";
        return value.replace(" ", "T").slice(0, 16);
    };

    const turbineSpecificLogs = t1Rows.filter(
        (row) => Number(row.turbine) === Number(t1Data.turbine),
    );


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
        required value = {
            t1Data.turbine || ""
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
            t1Data.turbine && ( <
                Typography variant = "body2"
                color = "text.secondary" >
                Tower1 analysis
                for Location: {
                    " "
                } <
                strong > {
                    turbinesData.find((t) => t.id === t1Data.turbine) ?
                    .location_no
                } <
                /strong> <
                /Typography>
            )
        } <
        /Grid> <
        /Grid> <
        /Paper>

        { /* 2. DYNAMIC WORKSPACE */ } {
            !t1Data.turbine ? ( <
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
                    600
                }
                color = "primary.main" >
                T1 Installation Details <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    2
                } >
                Tower Installation Process <
                /Typography>

                <
                Grid container spacing = {
                    2
                } > { /* Material */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth size = "small"
                name = "material"
                label = "Material"
                value = {
                    MaterialIssueData.find(
                        (m) =>
                        Number(m.issued_turbine) === Number(t1Data.turbine) &&
                        m.component_type ? .toLowerCase().includes("tower 1"),
                    ) ? .material_name || "No Tower 1 material issued"
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                error = {!t1Data.material
                }
                helperText = {!t1Data.material ?
                    "Required: Tower 1 material not issued" :
                        ""
                }
                /> <
                /Grid>

                { /* Batch No / Bolt Dropdown */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Batch No / Serial No"
                name = "batch_no"
                value = {
                    t1Data.batch_no || ""
                }
                onChange = {
                    (e) => {
                        handleChange(e);
                        // Automatically grab and sync max quantity when batch changes
                        const selectedBatch = availableBatches.find(
                            (b) => b.id === e.target.value,
                        );
                        if (selectedBatch && selectedBatch.quantity !== undefined) {
                            onT1Change("no_of_bolts", selectedBatch.quantity);
                        } else {
                            onT1Change("no_of_bolts", "");
                        }
                    }
                }
                required error = {!t1Data.batch_no
                }
                helperText = {!t1Data.batch_no ? "Required: Select batch" : ""
                } >
                <
                MenuItem value = "" >
                <
                em > Select Batch... < /em> <
                /MenuItem> {
                    availableBatches.map((batch) => ( <
                        MenuItem key = {
                            batch.id
                        }
                        value = {
                            batch.id
                        } > {
                            batch.material_name
                        }—
                        Batch: {
                            " "
                        } {
                            batch.batch_no || batch.id
                        }(Avail: {
                            batch.quantity
                        }) <
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
                name = "leveling"
                label = "Leveling"
                value = {
                    t1Data.leveling || ""
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
                TextField fullWidth required size = "small"
                name = "alignment_check"
                label = "Alignment Check"
                value = {
                    t1Data.alignment_check || ""
                }
                onChange = {
                    handleChange
                }
                error = {!t1Data.alignment_check
                }
                helperText = {!t1Data.alignment_check ? "Alignment Check is required" : ""
                }
                /> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                NumberTextField fullWidth required size = "small"
                type = "number"
                name = "no_of_bolts"
                label = "No of Bolts"
                value = {
                    t1Data.no_of_bolts || ""
                }
                error = {
                    isBoltsInvalid
                }
                helperText = {!t1Data.batch_no ?
                    "Select a batch first" :
                        isBoltsInvalid ?
                        `Cannot exceed issued quantity (${maxBoltQuantity})` :
                        `Max allowed: ${maxBoltQuantity}`
                }
                onChange = {
                    handleChange
                }
                inputProps = {
                    {
                        min: 1,
                        max: maxBoltQuantity,
                    }
                }
                /> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth size = "small"
                label = "Bolt Size"
                name = "bolt_size"
                value = {
                    t1Data.bolt_size || ""
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
                    3
                } >
                <
                NumberTextField fullWidth required size = "small"
                type = "number"
                label = "Torque Value"
                name = "torque_value"
                value = {
                    t1Data.torque_value || ""
                }
                error = {!t1Data.torque_value
                }
                helperText = {!t1Data.torque_value ? "Torque Value is required" : ""
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
                    3
                } >
                <
                TextField select fullWidth required size = "small"
                label = "Instrument Used"
                name = "instrument_used"
                value = {
                    t1Data.instrument_used || ""
                }
                onChange = {
                    handleChange
                }
                error = {!t1Data.instrument_used
                }
                helperText = {!t1Data.instrument_used ? "Instrument is required" : ""
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
                            tool.id
                        } > {
                            tool.material_name
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
                    3
                } >
                <
                TextField fullWidth size = "small"
                label = "Grouting"
                name = "grouting"
                value = {
                    t1Data.grouting || ""
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
                label = "Grouting Curing"
                name = "grouting_curing"
                value = {
                    t1Data.grouting_curing || ""
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
                name = "grout_material_type"
                label = "Grout Material Type"
                value = {
                    t1Data.grout_material_type || ""
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
                NumberTextField fullWidth size = "small"
                type = "number"
                name = "grouting_curing_days"
                label = "Grouting Curing Days"
                value = {
                    t1Data.grouting_curing_days || ""
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
                    3
                } >
                <
                TextField fullWidth size = "small"
                type = "datetime-local"
                name = "lifting_start"
                label = "Lifting Start"
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                inputProps = {
                    limits.dateTime
                }
                value = {
                    formatToDateTimeLocal(t1Data.lifting_start)
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
                value = {
                    formatToDateTimeLocal(t1Data.lifting_end)
                }
                disabled = {!t1Data.lifting_start
                }
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                inputProps = {
                    {
                        ...limits.dateTime,
                        min: formatToDateTimeLocal(t1Data.lifting_start),
                    }
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
                TextField fullWidth select size = "small"
                label = "Weather Conditions"
                name = "weather_conditions"
                value = {
                    t1Data.weather_conditions || ""
                }
                onChange = {
                    handleChange
                } >
                {
                    WEATHER_OPTIONS.map((option) => ( <
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
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Status *"
                name = "t1_status"
                value = {
                    t1Data.t1_status || "completed"
                }
                onChange = {
                    handleChange
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
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
                TextField select fullWidth size = "small"
                name = "contractor"
                label = "Contractor"
                value = {
                    t1Data.contractor || ""
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
                    6
                } >
                <
                TextField select fullWidth size = "small"
                name = "supervisor"
                label = "Supervisor"
                value = {
                    t1Data.supervisor || ""
                }
                onChange = {
                    handleChange
                }
                error = {!t1Data.supervisor
                }
                helperText = {!t1Data.supervisor ? "Supervisor is required" : ""
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
                } >
                <
                TextField fullWidth multiline name = "remarks"
                rows = {
                    2
                }
                size = "small"
                label = "Remarks"
                value = {
                    t1Data.remarks || ""
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
                Box sx = {
                    {
                        p: 2,
                        border: "1px dashed #ccc",
                        borderRadius: 1
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

                {
                    t1Data.evidence_photo && ( <
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
                            typeof t1Data.evidence_photo === "string" ?
                            t1Data.evidence_photo :
                                URL.createObjectURL(t1Data.evidence_photo)
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
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } >
                <
                DocumentAttachmentDialog activityCode = "T1_INSTALL"
                attachmentMasterList = {
                    attachmentMasterList
                }
                formData = {
                    t1Data
                }
                onDataChange = {
                    onT1Change
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
                    Ensure alignment,
                    bolt tightening,
                    and base readiness
                    are verified before proceeding. <
                    /Typography>
                }
                /> <
                /Alert> <
                /Grid> <
                /Grid>

                <
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
                    onSubmitTower1
                }
                disabled = {!isAcknowledged || loading || isBoltsInvalid
                } >
                Submit Tower1 <
                /Button> <
                /Box> <
                /Paper>

                {
                    turbineSpecificLogs.length > 0 && ( <
                        Box sx = {
                            {
                                display: "flex",
                                justifyContent: "center",
                                mt: 3
                            }
                        } >
                        <
                        DynamicDataTable loading = {
                            loading
                        }
                        columns = {
                            t1Columns
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

export default Tower1;