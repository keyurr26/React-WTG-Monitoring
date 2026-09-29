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
    BLADE_NO_CHOICES,
    WEATHER_OPTIONS,
    STATUS_OPTIONS,
} from "../../constants/choices";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import {
    getDateLimits
} from "../../utils/dateLimits";
import {
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon,
} from "@mui/icons-material";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import {
    getAttachmentsForActivity
} from "../../utils/documentHelpers";
import NumberTextField from "../../components/comman/NumberTextField";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import {
    GetBladeInstallations
} from "../../Redux/InstallationData/WtgInstallationData/wtgInstallationAction";
import {
    GetMaterialIssueData,
    GetMaterialRecivedData,
} from "../../Redux/MasterData/masterAction";

const BladeInstallationForm = ({
    BladeData = {},
    filters,
    documentList,
    onBladeChange,
    buildColumns,
    turbinesData = [],
    contractors = [],
    inspectors = [],
    materialData = [],
    delayCauses,
    onDelaySubmit,
    onSubmitBlade,
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
        activityCode: "BLADES",
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
        bladeInstallations = []
    } = useSelector(
        (state) => state.wtgInstallationData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !BladeData.turbine) {
            return;
        }
        const apiPayload = {
            ...filters,
            turbine: BladeData.turbine,
        };

        dispatch(GetBladeInstallations(apiPayload));
    }, [
        dispatch,
        filters ? .project,
        filters ? .windfarm,
        filters ? .cluster,
        BladeData.turbine,
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

        if (BladeData.turbine) {
            issuePayload.issued_turbine = BladeData.turbine;
        }

        dispatch(GetMaterialIssueData(issuePayload));
    }, [dispatch, filters ? .project, filters ? .windfarm, BladeData.turbine]);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            files
        } = e.target;
        onBladeChange(name, type === "file" ? files[0] : value);
    };

    useEffect(() => {
        if (!BladeData.blade_id) return;

        // Find the selected material object from MaterialIssueData
        const selectedMaterial = MaterialIssueData.find(
            (m) => Number(m.material) === Number(BladeData.blade_id),
        );

        if (selectedMaterial && selectedMaterial.component_type) {
            // Automatically set Blade No (e.g. "Blade-A") based on component_type
            onBladeChange("blade_no", selectedMaterial.component_type);
        }
    }, [BladeData.blade_id, MaterialIssueData]);

    // Modify your turbine dropdown or add a handler for turbine change
    const handleTurbineChange = (e) => {
        const selectedTurbineId = e.target.value;

        // 1. Update turbine field standardly
        onBladeChange("turbine", selectedTurbineId);

        // 2. Find matching material issue records for this turbine
        const issuedBladesForTurbine = materialData.filter(
            (m) => Number(m.issued_turbine) === Number(selectedTurbineId),
        );

        // Example: If Blade-A exists in the issued data for this turbine, auto-bind it
        const bladeA = issuedBladesForTurbine.find(
            (m) => m.component_type === "Blade-A",
        );
        if (bladeA) {
            onBladeChange("blade_id", bladeA.material);
            onBladeChange("blade_no", "Blade-A");
            // You can also bind work_order_no if you have a field for it in BladeData
        }
    };

    // Add this near your other useMemos (like bladeRows)
    const usedBladeIds = useMemo(() => {
        return bladeInstallations.map((item) => Number(item.blade_id));
    }, [bladeInstallations]);

    useEffect(() => {
        if (BladeData.turbine && BladeData.lifting_start) {
            const currentStatus = BladeData.blade_status || "in_progress";
            checkDelay(BladeData.lifting_start, BladeData.turbine, currentStatus);
        }
    }, [
        BladeData.turbine,
        BladeData.lifting_start,
        BladeData.blade_status,
        checkDelay,
    ]);

    // 1. Get all issued bolt batches specifically for the selected turbine
    const availableBolts = useMemo(() => {
        if (!BladeData.turbine) return [];
        return MaterialIssueData.filter(
            (m) =>
            m.component_type === "Bolt" &&
            Number(m.issued_turbine) === Number(BladeData.turbine),
        );
    }, [MaterialIssueData, BladeData.turbine]);

    // 2. Find the specific bolt object currently selected by the user
    const selectedBoltObject = useMemo(() => {
        return availableBolts.find(
            (b) => Number(b.id) === Number(BladeData.bolt_id),
        );
    }, [availableBolts, BladeData.bolt_id]);

    // 3. Extract the available quantity for the selected bolt batch
    const maxAllowedBolts = selectedBoltObject ?
        Number(
            selectedBoltObject.quantity || selectedBoltObject.available_qty || 0,
        ) :
        0;

    // 4. Check if the entered bolt count is invalid
    const isBoltCountInvalid =
        Boolean(BladeData.bolt_id) &&
        (Number(BladeData.no_of_bolt) <= 0 ||
            Number(BladeData.no_of_bolt) > maxAllowedBolts);

    const BLADE_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            blade_no: "Blade No",
            blade_name: "Blade",
            bolt_name: "Bolt",
            no_of_bolt: "No of Bolts",
            torque_value: "Torque Value",
            instrument_used: "Instrument Used",
            weather: "Weather",
            blade_status: "Progress Status",
            lifting_start: "Lifting Start",
            lifting_end: "Lifting End",
            contractor_name: "Contractor",
            supervisor_name: "Supervisor",
            evidence_photo: "Photo",
            attachments_list: "Documents",
        }), [],
    );

    const bladeColumns = useMemo(
        () => buildColumns(BLADE_HEADER_MAP, true), [buildColumns, BLADE_HEADER_MAP],
    );

    // 5. Blade Installation
    const bladeRows = useMemo(() => {
        return bladeInstallations.map((row) => ({
            ...row,
            turbine_name: row.turbine_name,
            contractor_name: row.contractor_name,
            supervisor_name: row.supervisor_name,
            blade_name: row.blade_name,
            bolt_name: row.bolt_name,
            canEdit: !row.approve_date,
            approved_status: row.approve_date ? "Approved" : "Pending",
            attachments_list: getAttachmentsForActivity(
                "BLADES",
                row.turbine,
                documentList,
            ),
        }));
    }, [bladeInstallations, documentList]);

    const handleRemovePhoto = () => onBladeChange("evidence_photo", null);

    // Filter logs only for the currently selected turbine
    const turbineSpecificLogs = bladeRows.filter(
        (row) => Number(row.turbine) === Number(BladeData.turbine),
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
            BladeData.turbine || ""
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
            BladeData.turbine && ( <
                Typography variant = "body2"
                color = "primary.main"
                fontWeight = {
                    600
                } > ⚡Workspace Active
                for: {
                    " "
                } {
                    turbinesData.find((t) => t.id === BladeData.turbine) ?
                        .location_no
                } <
                /Typography>
            )
        } <
        /Grid> <
        /Grid> <
        /Paper>

        { /* ================= STEP 2: DYNAMIC WORKSPACE ================= */ } {
            !BladeData.turbine ? ( <
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
                Please select a turbine to load the blade installation form <
                /Typography> <
                /Box>
            ) : ( <
                Box >
                <
                Paper sx = {
                    {
                        p: 2.5,
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
                Blade Installation Details <
                /Typography>

                <
                Grid container spacing = {
                    1.5
                } > { /* Row 1: Blade Identification */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select required fullWidth size = "small"
                label = "Blade No"
                name = "blade_no"
                value = {
                    BladeData.blade_no
                }
                error = {!BladeData.blade_no
                }
                helperText = {!BladeData.blade_no ? "Blade No is required" : ""
                }
                onChange = {
                    handleChange
                } >
                {
                    BLADE_NO_CHOICES.map((opt) => ( <
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
                    4
                } > {
                    /* <TextField
                                      select
                                      required
                                      fullWidth
                                      size="small"
                                      label="Blade ID"
                                      name="blade_id"
                                      value={BladeData.blade_id}
                                      error={!BladeData.blade_id}
                                      helperText={!BladeData.blade_id ? "Blade ID is required" : ""}
                                      onChange={handleChange}
                                    >
                                      {materialData
                                        .filter((m) => m.component_type === "Blades")
                                        .map((m) => (
                                          <MenuItem key={m.id} value={m.id}>
                                            {m.name}
                                          </MenuItem>
                                        ))}
                                    </TextField> */
                }

                <
                TextField select required fullWidth size = "small"
                label = "Blade ID"
                name = "blade_id"
                value = {
                    BladeData.blade_id || ""
                }
                error = {!BladeData.blade_id
                }
                helperText = {!BladeData.blade_id ? "Blade ID is required" : ""
                }
                onChange = {
                    handleChange
                } >
                {
                    MaterialIssueData.filter((m) => {
                        // 1. Must be a blade component type
                        const isBladeType = [
                            "Blade-A",
                            "Blade-B",
                            "Blade-C",
                        ].includes(m.component_type);
                        // 2. Must match the currently selected turbine
                        const isTurbineMatch = !BladeData.turbine ||
                            Number(m.issued_turbine) === Number(BladeData.turbine);

                        return isBladeType && isTurbineMatch;
                    }).map((m) => {
                        // Check if this material ID (m.material) has already been saved/used
                        const isAlreadyUsed = usedBladeIds.includes(
                            Number(m.material),
                        );

                        return ( <
                            MenuItem key = {
                                m.id
                            }
                            value = {
                                m.id
                            }
                            disabled = {
                                isAlreadyUsed
                            }
                            sx = {
                                isAlreadyUsed ?
                                {
                                    color: "text.disabled",
                                    fontStyle: "italic"
                                } :
                                {}
                            } >
                            {
                                m.material_name
                            } - SR: {
                                m.material_sr_no
                            } {
                                " "
                            } {
                                isAlreadyUsed ? "[Already Used]" : ""
                            } <
                            /MenuItem>
                        );
                    })
                } <
                /TextField> <
                /Grid> {
                    /* <Grid item xs={12} md={4}>
                                    <TextField
                                      select
                                      required
                                      fullWidth
                                      size="small"
                                      label="Bolt ID"
                                      name="bolt_id"
                                      value={BladeData.bolt_id}
                                      error={!BladeData.bolt_id}
                                      helperText={!BladeData.bolt_id ? "Bolt ID is required" : ""}
                                      onChange={handleChange}
                                    >
                                      {materialData
                                        .filter((m) => m.component_type === "Bolt")
                                        .map((m) => (
                                          <MenuItem key={m.id} value={m.id}>
                                            {m.name}
                                          </MenuItem>
                                        ))}
                                    </TextField>
                                  </Grid>

                                  
                                  <Grid item xs={6} md={3}>
                                    <NumberTextField
                                      fullWidth
                                      size="small"
                                      type="number"
                                      label="No. of Bolts"
                                      name="no_of_bolt"
                                      value={BladeData.no_of_bolt}
                                      error={!BladeData.no_of_bolt}
                                      helperText={
                                        !BladeData.no_of_bolt ? "No. of Bolts is required" : ""
                                      }
                                      onChange={handleChange}
                                    />
                                  </Grid> */
                }

                { /* Row 1, Part 3: Selectable Turbine-wise Bolt ID Dropdown */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select required fullWidth size = "small"
                label = "Bolt ID (Turbine Issued)"
                name = "bolt_id"
                value = {
                    BladeData.bolt_id || ""
                }
                disabled = {!BladeData.turbine
                }
                error = {!BladeData.bolt_id
                }
                helperText = {!BladeData.turbine ?
                    "Select a turbine first" :
                        !BladeData.bolt_id ?
                        "Please select a bolt batch" :
                        `Selected Batch Available Qty: ${maxAllowedBolts}`
                }
                onChange = {
                    handleChange
                } >
                <
                MenuItem value = "" >
                <
                em > Choose Bolt Batch... < /em> <
                /MenuItem> {
                    availableBolts.map((b) => ( <
                        MenuItem key = {
                            b.id
                        }
                        value = {
                            b.id
                        } > {
                            b.material_name || "Bolt"
                        }(SR: {
                            " "
                        } {
                            b.material_sr_no || "N/A"
                        }) - Available: {
                            " "
                        } {
                            b.quantity || b.available_qty || 0
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                { /* Row 2, Part 1: No. of Bolts with Batch Limit Validation */ } <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                NumberTextField fullWidth size = "small"
                type = "number"
                label = "No. of Bolts"
                name = "no_of_bolt"
                value = {
                    BladeData.no_of_bolt || ""
                }
                disabled = {!BladeData.bolt_id
                }
                error = {
                    isBoltCountInvalid || !BladeData.no_of_bolt
                }
                helperText = {!BladeData.bolt_id ?
                    "Select Bolt ID first" :
                        !BladeData.no_of_bolt ?
                        "Enter number of bolts" :
                        isBoltCountInvalid ?
                        `Cannot exceed batch stock (${maxAllowedBolts})` :
                        `Max allowed: ${maxAllowedBolts}`
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
                TextField fullWidth size = "small"
                type = "number"
                label = "Torque Value"
                name = "torque_value"
                value = {
                    BladeData.torque_value
                }
                error = {!BladeData.torque_value
                }
                helperText = {!BladeData.torque_value ? "Torque Value is required" : ""
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
                TextField select fullWidth required size = "small"
                label = "Instrument Used"
                name = "instrument_used"
                value = {
                    BladeData.instrument_used
                }
                error = {!BladeData.instrument_used
                }
                helperText = {!BladeData.instrument_used ? "Instrument required" : ""
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
                TextField select fullWidth size = "small"
                label = "Weather"
                name = "weather"
                value = {
                    BladeData.weather
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

                { /* Row 3: Lifting Timeline */ } <
                Grid item xs = {
                    12
                }
                md = {
                    6
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
                    BladeData.lifting_start
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
                    6
                } >
                <
                TextField fullWidth size = "small"
                type = "datetime-local"
                label = "Lifting End"
                name = "lifting_end"
                disabled = {!BladeData.lifting_start
                }
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                inputProps = {
                    {
                        ...limits.dateTime,
                        min: BladeData.lifting_start || "",
                    }
                }
                value = {
                    BladeData.lifting_end
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* Row 4: Responsibility & Status */ } <
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
                    BladeData.contractor
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
                    BladeData.supervisor
                }
                error = {!BladeData.supervisor
                }
                helperText = {!BladeData.supervisor ? "Supervisor is required" : ""
                }
                onChange = {
                    handleChange
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
                name = "blade_status"
                value = {
                    BladeData.blade_status || ""
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
                    BladeData.remarks
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* Row 5: Attachments */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                Box sx = {
                    {
                        p: 2, // Increased padding slightly for better visual balance with previews
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
                } // 🔥 FIX: Process through local handleChange to unpack files[0] correctly
                /> <
                /Button>

                { /* 🔥 FIX: Real-time Live Image Preview Block */ } {
                    BladeData ? .evidence_photo && ( <
                        Box sx = {
                            {
                                position: "relative",
                                width: 220,
                                mt: 1
                            }
                        } >
                        <
                        img src = {
                            typeof BladeData.evidence_photo === "string" ?
                            BladeData.evidence_photo // Displays existing database image URL string
                            :
                                URL.createObjectURL(BladeData.evidence_photo) // Displays newly uploaded image file stream
                        }
                        alt = "Blade Evidence Preview"
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
                DocumentAttachmentDialog activityCode = "BLADES"
                attachmentMasterList = {
                    attachmentMasterList
                }
                formData = {
                    BladeData
                }
                onDataChange = {
                    onBladeChange
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

                { /* Action Bar with overflow prevention */ } <
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
                            gap: 1,
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
                    I verify proper alignment and secure blade fastening. <
                    /Typography>
                }
                sx = {
                    {
                        flex: "1 1 auto"
                    }
                }
                /> <
                Button variant = "contained"
                size = "small"
                onClick = {
                    onSubmitBlade
                }
                disabled = {!isAcknowledged || loading
                }
                sx = {
                    {
                        whiteSpace: "nowrap"
                    }
                } >
                Submit Blade Data <
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
                            bladeColumns
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

export default BladeInstallationForm;