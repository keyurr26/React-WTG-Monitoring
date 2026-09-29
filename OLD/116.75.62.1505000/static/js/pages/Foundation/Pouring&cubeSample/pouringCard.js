import React, {
    useEffect,
    useMemo
} from "react";
import {
    useDispatch,
    useSelector
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
    Divider,
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
    getDateLimits
} from "../../../utils/dateLimits";
import {
    WEATHER_OPTIONS,
    ACCEPT_REJECT_CHOICES,
    STATUS_OPTIONS,
} from "../../../constants/choices";
import DynamicDataTable from "../../../components/comman/DynamicDataTable";
import DocumentAttachmentDialog from "../../MultipleDocumentUpload/DocumentAttachmentDialog";
import NumberTextField from "../../../components/comman/NumberTextField";
import DelayPopup from "../../../components/comman/DelayPopup";
import useDelayHandler from "../../../hooks/useDelayHandler";
import {
    GetPouringCards
} from "../../../Redux/InstallationData/FoundationData/foundationAction";
import {
    GetAttachmentMasterData
} from "../../../Redux/MasterData/masterAction";
import useKpiValidator from "../../../hooks/useKpiValidator";
import {
    getFormKpiFields
} from "../../../config/kpiFieldConfigs";

const PouringCardForm = ({
    filters,
    buildColumns,
    formData = {},
    onChange,
    turbines,
    onSubmitPouring,
    inspectors = [],
    kpiList = [],
    showSnackbar,
    isAcknowledged,
    setIsAcknowledged,

    delayCauses,
    getActivePlan,
    onDelaySubmit,
}) => {
    const limits = getDateLimits();
    const dispatch = useDispatch();
    const {
        delayOpen,
        delayData,
        delaySaved,
        checkDelay,
        handleDelaySubmit,
        openDelayPopup,
        closeDelayPopup,
        clearDelay,
    } = useDelayHandler({
        getActivePlan: getActivePlan,
        activityCode: "POUR",
        onDelaySubmit,
    });

    const {
        attachmentList,
        documentList
    } = useSelector(
        (state) => state.masterData || {},
    );
    const {
        pouringCards = [],
            cubeSamples = [],
            foundationLoading,
    } = useSelector((state) => state.foundationData || {});

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !formData.turbine) {
            return;
        }
        dispatch(GetAttachmentMasterData({
            activity: "POUR"
        }));

        const apiPayload = {
            ...filters,
            turbine: formData.turbine,
        };

        dispatch(GetPouringCards(apiPayload));
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

        if (name === "turbine") {
            onChange("turbine", value);
            return;
        }

        if (type === "file") {
            if (name === "cubePhotos") {
                const fileArray = Array.from(files);
                const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
                onChange("cubePhotos", [...(formData.cubePhotos || []), ...fileArray]);
                onChange("cubePhotoPreviews", [
                    ...(formData.cubePhotoPreviews || []),
                    ...previewUrls,
                ]);
            } else {
                onChange(name, files[0]);
            }
            return;
        }
        onChange(name, value);
    };

    useEffect(() => {
        // Destructure values for clarity
        const turbine = formData.turbine;
        const startDate = formData.pouring_start_time;
        const status = formData.pouring_status;

        // GUARD: Only call checkDelay if ALL required fields are present
        if (turbine && startDate && status) {
            checkDelay(startDate, turbine, status);
        }
    }, [
        formData.turbine,
        formData.pouring_start_time,
        formData.pouring_status,
        checkDelay,
    ]);

    const removeCubeImage = (index) => {
        onChange(
            "cubePhotos",
            formData.cubePhotos.filter((_, i) => i !== index),
        );
        onChange(
            "cubePhotoPreviews",
            formData.cubePhotoPreviews.filter((_, i) => i !== index),
        );
    };

    const handleRemovePhoto = () => onChange("evidence_photo", null);

    const POURING_CARD_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            tm_no: "TM No",
            concrete_temperature: "Concrete Temp",
            batch_serial_number: "Batch Serial No",
            time_left_plant: "Time Left Plant",
            time_arrived_site: "Time Arrived Site",
            pouring_start_time: "Pour Start",
            pouring_end_time: "Pour End",
            quantity_delivered: "Quantity",
            truck_mixer_capacity: "Truck Capacity",
            pouring_status: "Progress Status",
            // inspector_name: "Inspector",
            evidence_photo: "Pouring Photo",
            sample_name: "Cube Sample Name",
            No_of_cubes: "No of Cubes",
            photos: "Cube Photos",
            attachments_list: "Pouring Documents",
        }), [],
    );

    const pouringCardColumns = useMemo(
        () => buildColumns(POURING_CARD_HEADER_MAP, true), [buildColumns, POURING_CARD_HEADER_MAP],
    );

    const pouringCardRows = useMemo(() => {
        const cubeLookupMap = {};
        cubeSamples.forEach((sample) => {
            const cardId = String(sample.pouring_card_id || sample.pouring_card);
            cubeLookupMap[cardId] = sample;
        });
        return pouringCards.map((row) => {
            const attachments =
                row.id ===
                Math.max(
                    ...pouringCards
                    .filter((r) => r.turbine === row.turbine)
                    .map((r) => r.id),
                ) ?
                documentList
                .filter(
                    (doc) => doc.activity === "POUR" && doc.turbine === row.turbine,
                )
                .map((doc) => ({
                    url: doc.file,
                    name: doc.file_type || doc.name || doc.file.split("/").pop(),
                    doc_no: doc.doc_no || "N/A",
                    doc_date: doc.doc_date || "N/A",
                    remarks: doc.remarks || "",
                })) :
                [];
            const relatedSample = cubeLookupMap[String(row.id)];

            // console.log('relatedSample', relatedSample)
            return {
                ...row,
                // Existing fields
                turbine_name: row.turbine_name,
                inspector_name: row.inspector_name,
                attachments_list: attachments,
                canEdit: !row.approve_date,
                approved_status: row.approve_date ? "Approved" : "Pending",

                // --- Mapped Cube Sample Data ---
                // These keys MUST match your POURING_CARD_HEADER_MAP
                sample_name: relatedSample ? relatedSample.sample_id : "No Sample",
                No_of_cubes: relatedSample ? relatedSample.no_of_cubes : "0",
                // Pass the photos array (from your serializer) for the renderer
                // photos: relatedSample?.photos ? relatedSample.photos : [],
                photos: relatedSample ? .photos ?
                    relatedSample.photos.map((p) => p.image || p.photo) :
                    [],
            };
        });
    }, [pouringCards, cubeSamples, documentList]);

    const fieldsToTrack = useMemo(
        () => getFormKpiFields("POUR", formData, pouringCardRows), [formData, pouringCardRows],
    );

    const {
        kpiStatus,
        validateKpi
    } = useKpiValidator(
        kpiList,
        formData.turbine,
        fieldsToTrack,
    );

    const handlePouringSubmit = () => {
        if (!validateKpi("quantity_delivered", showSnackbar)) {
            return;
        }

        if (!formData.inspector) {
            showSnackbar(
                "Please select a Civil Engineer before submitting.",
                "error",
            );
            return;
        }

        if (onSubmitPouring) {
            onSubmitPouring(formData);
        }
    };

    // Filter logs for only the selected turbine
    const turbineSpecificLogs = pouringCardRows.filter(
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
                } > ⚡Pouring & TM Logs Active
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
                Select a turbine target parameter to track Transit Mixers(TM) <
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
                color = "primary.main" >
                Pouring Card <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    4
                } >
                Transit Mixer(TM) Tracking & Workability Log <
                /Typography>

                <
                Grid container spacing = {
                    2
                } > { /* --- Identification --- */ } {
                    /* <Grid item xs={12} md={3}>
                                <TextField select fullWidth label="Turbine Location" name="turbine"
                                required
                                 value={formData.turbine || ""} onChange={handleChange} size="small">
                                  {filteredTurbines.map((t) => (
                                    <MenuItem key={t.id} value={t.id}>{t.location_no}</MenuItem>
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
                TextField fullWidth label = "TM No"
                name = "tm_no"
                value = {
                    formData.tm_no || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {!formData.tm_no
                }
                helperText = {!formData.tm_no ? "Required" : ""
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
                TextField fullWidth label = "Quantity Delivered"
                name = "quantity_delivered"
                value = {
                    formData.quantity_delivered || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {
                    kpiStatus.quantity_delivered ? .isError
                }
                helperText = {
                    kpiStatus.quantity_delivered ? .isError ?
                    `${kpiStatus.quantity_delivered.min}m³ - ${kpiStatus.quantity_delivered.max}m³` :
                    `Design Max: ${kpiStatus.quantity_delivered?.max || 0}m³`
                }
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
                NumberTextField fullWidth label = "Truck Mixer Capacity"
                name = "truck_mixer_capacity"
                value = {
                    formData.truck_mixer_capacity || ""
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

                { /* --- Logistics & Timings --- */ } { /* --- Logistics & Timings --- */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth type = "datetime-local"
                label = "Time Left Plant"
                name = "time_left_plant"
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                value = {
                    formData.time_left_plant || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                inputProps = {
                    {
                        min: limits.dateTime.min,
                        max: limits.dateTime.max,
                    }
                }
                error = {!formData.time_left_plant
                }
                helperText = {!formData.time_left_plant ? "Required" : ""
                }
                /> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } > {
                    (() => {
                        const isMissing = !formData.time_arrived_site;
                        const isSequenceError =
                            formData.time_left_plant &&
                            formData.time_arrived_site &&
                            formData.time_arrived_site < formData.time_left_plant;
                        return ( <
                            TextField fullWidth type = "datetime-local"
                            label = "Time Arrived Site"
                            name = "time_arrived_site"
                            InputLabelProps = {
                                {
                                    shrink: true
                                }
                            }
                            value = {
                                formData.time_arrived_site || ""
                            }
                            onChange = {
                                handleChange
                            }
                            size = "small"
                            inputProps = {
                                {
                                    min: formData.time_left_plant || limits.dateTime.min,
                                    max: limits.dateTime.max,
                                }
                            }
                            error = {
                                isMissing || isSequenceError
                            }
                            helperText = {
                                isSequenceError ?
                                "Error: Arrival time cannot be before plant departure time!" :
                                    isMissing ?
                                    "Required" :
                                    ""
                            }
                            />
                        );
                    })()
                } <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } > {
                    (() => {
                        const isMissing = !formData.pouring_start_time;
                        const isSequenceError =
                            formData.time_arrived_site &&
                            formData.pouring_start_time &&
                            formData.pouring_start_time < formData.time_arrived_site;
                        return ( <
                            TextField fullWidth type = "datetime-local"
                            label = "Pouring Start"
                            name = "pouring_start_time"
                            InputLabelProps = {
                                {
                                    shrink: true
                                }
                            }
                            value = {
                                formData.pouring_start_time || ""
                            }
                            onChange = {
                                handleChange
                            }
                            size = "small"
                            inputProps = {
                                {
                                    min: formData.time_arrived_site || limits.dateTime.min,
                                    max: limits.dateTime.max,
                                }
                            }
                            error = {
                                isMissing || isSequenceError
                            }
                            helperText = {
                                isSequenceError ?
                                "Error: Pouring cannot start before arriving at site!" :
                                    isMissing ?
                                    "Required" :
                                    ""
                            }
                            />
                        );
                    })()
                } <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } > {
                    (() => {
                        const isMissing = !formData.pouring_end_time;
                        const isSequenceError =
                            formData.pouring_start_time &&
                            formData.pouring_end_time &&
                            formData.pouring_end_time < formData.pouring_start_time;
                        return ( <
                            TextField fullWidth type = "datetime-local"
                            label = "Pouring End"
                            name = "pouring_end_time"
                            InputLabelProps = {
                                {
                                    shrink: true
                                }
                            }
                            value = {
                                formData.pouring_end_time || ""
                            }
                            onChange = {
                                handleChange
                            }
                            size = "small"
                            inputProps = {
                                {
                                    min: formData.pouring_start_time || limits.dateTime.min,
                                    max: limits.dateTime.max,
                                }
                            }
                            error = {
                                isMissing || isSequenceError
                            }
                            helperText = {
                                isSequenceError ?
                                "Error: Pouring cannot end before it starts!" :
                                    isMissing ?
                                    "Required" :
                                    ""
                            }
                            />
                        );
                    })()
                } <
                /Grid>

                { /* --- Quality & Specs --- */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                NumberTextField fullWidth label = "Concrete Temp"
                name = "concrete_temperature"
                value = {
                    formData.concrete_temperature || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {!formData.concrete_temperature
                }
                helperText = {!formData.concrete_temperature ? "Required" : ""
                }
                InputProps = {
                    {
                        endAdornment: ( <
                            InputAdornment position = "end" > °C < /InputAdornment>
                        ),
                    }
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
                TextField fullWidth label = "Cone Test (Slump)"
                name = "cone_test"
                placeholder = "e.g. 120mm"
                value = {
                    formData.cone_test || ""
                }
                onChange = {
                    handleChange
                }
                required error = {!formData.cone_test
                }
                helperText = {!formData.cone_test ? "Required" : ""
                }
                size = "small" /
                >
                <
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth label = "Batching Slip No."
                name = "batch_serial_number"
                value = {
                    formData.batch_serial_number || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {!formData.batch_serial_number
                }
                helperText = {!formData.batch_serial_number ? "Required" : ""
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
                TextField select fullWidth label = "Weather Conditions"
                name = "weather_conditions"
                value = {
                    formData.weather_conditions || ""
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

                { /* --- Actions & Inspector --- */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth required label = "Action Taken"
                name = "action_taken"
                value = {
                    formData.action_taken || ""
                }
                onChange = {
                    handleChange
                }
                error = {!formData.action_taken
                }
                helperText = {!formData.action_taken ? "Required" : ""
                }
                size = "small"
                sx = {
                    {
                        "& .MuiSelect-select": {
                            color: formData.action_taken === "accept" ?
                                "success.main" :
                                formData.action_taken === "reject" ?
                                "error.main" :
                                "inherit",
                            fontWeight: 600,
                        },
                    }
                } >
                {
                    ACCEPT_REJECT_CHOICES.map((opt) => ( <
                        MenuItem key = {
                            opt.value
                        }
                        value = {
                            opt.value
                        }
                        sx = {
                            {
                                color: opt.value === "accept" ?
                                    "success.main" :
                                    "error.main",
                                fontWeight: 500,
                            }
                        } >
                        {
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
                    3
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
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth label = "Status *"
                name = "pouring_status"
                value = {
                    formData.pouring_status || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required
                // error={!formData.pouring_status}
                helperText = {
                    formData.pouring_status ?
                    "select completed only for last entry of this WTG" :
                        ""
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
                label = "Reason (if Rejected) / Remarks"
                name = "remarks"
                value = {
                    formData.remarks || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" /
                >
                <
                /Grid>

                { /* --- Evidence Photo --- */ } <
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
                        borderRadius: 1
                    }
                } >
                <
                Button component = "label"
                variant = "outlined"
                startIcon = { < UploadIcon / >
                }
                size = "small" >
                Upload Site Photo <
                input type = "file"
                hidden accept = "image/*"
                name = "evidence_photo"
                onChange = {
                    handleChange
                }
                /> <
                /Button> {
                    formData.evidence_photo && ( <
                        Box mt = {
                            2
                        }
                        sx = {
                            {
                                position: "relative",
                                display: "inline-block"
                            }
                        } >
                        <
                        img src = {
                            typeof formData.evidence_photo === "string" ?
                            formData.evidence_photo :
                                URL.createObjectURL(formData.evidence_photo)
                        }
                        alt = "Evidence"
                        style = {
                            {
                                width: 220,
                                height: "auto",
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

                { /* REUSABLE POPUP COMPONENT */ } <
                Grid item xs = {
                    12
                }
                md = {
                    6
                } >
                <
                DocumentAttachmentDialog activityCode = "POUR"
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
                    Check
                    if the time elapsed exceeds the maximum limit(90 - 120 mins). <
                    /Typography>
                }
                /> <
                /Alert> <
                /Grid> <
                /Grid>

                { /* --- MAIN POURING SUBMIT --- */ } {
                    /* <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                              <Button variant="contained" onClick={onSubmitPouring} disabled={loading}>
                                Submit Pouring Card
                              </Button>
                            </Box> */
                }

                { /* --- CUBE SAMPLING SECTION --- */ } <
                Box sx = {
                    {
                        mt: 5
                    }
                } >
                <
                Divider sx = {
                    {
                        mb: 2
                    }
                } >
                <
                FormControlLabel control = { <
                    Checkbox
                    checked = {
                        formData.is_cube_taken || false
                    }
                    onChange = {
                        (e) =>
                        onChange("is_cube_taken", e.target.checked)
                    }
                    color = "primary" /
                    >
                }
                label = { <
                    Typography fontWeight = "bold"
                    color = "primary.main" >
                    Add Cube Sample
                    for this TM ?
                    <
                    /Typography>
                }
                /> <
                /Divider>

                {
                    formData.is_cube_taken && ( <
                        Paper variant = "outlined"
                        sx = {
                            {
                                p: 3,
                                borderRadius: 2,
                                bgcolor: "#f9f9f9",
                                border: "1px solid #1976D2",
                            }
                        } >
                        <
                        Typography variant = "subtitle1"
                        fontWeight = {
                            600
                        }
                        color = "primary.main"
                        mb = {
                            2
                        } >
                        Cube Sampling Details <
                        /Typography> <
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
                        TextField fullWidth label = "Sample Name/ID"
                        name = "sample_id"
                        value = {
                            formData.sample_id || ""
                        }
                        onChange = {
                            handleChange
                        }
                        size = "small"
                        color = "secondary" /
                        >
                        <
                        /Grid> <
                        Grid item xs = {
                            12
                        }
                        md = {
                            4
                        } >
                        <
                        NumberTextField fullWidth type = "number"
                        label = "No of Cubes"
                        name = "no_of_cubes"
                        value = {
                            formData.no_of_cubes || ""
                        }
                        onChange = {
                            handleChange
                        }
                        size = "small"
                        color = "secondary" /
                        >
                        <
                        /Grid> <
                        Grid item xs = {
                            12
                        }
                        md = {
                            4
                        } > {
                            (() => {
                                // Automatically derive date from pouring_start_time if present
                                const derivedDate = formData.pouring_start_time ?
                                    formData.pouring_start_time.split("T")[0] :
                                    "";

                                return ( <
                                    TextField fullWidth type = "date"
                                    label = "Sample Date"
                                    name = "sample_date"
                                    InputLabelProps = {
                                        {
                                            shrink: true
                                        }
                                    }
                                    InputProps = {
                                        {
                                            readOnly: true
                                        }
                                    }
                                    // inputProps={{
                                    //   max: new Date().toISOString().split("T")[0],
                                    // }}
                                    // Prioritize explicit state, fallback to auto-derivedpouring start date
                                    value = {
                                        formData.sample_date || derivedDate
                                    }
                                    onChange = {
                                        handleChange
                                    }
                                    size = "small"
                                    color = "secondary" /
                                    >
                                );
                            })()
                        } <
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
                                border: "1px dashed",
                                borderColor: "primary.main",
                                borderRadius: 1,
                                bgcolor: "#fff",
                            }
                        } >
                        <
                        Button variant = "outlined"
                        component = "label"
                        color = "primary"
                        startIcon = { < UploadIcon / >
                        }
                        size = "small" >
                        Upload Cube Casting Photos <
                        input type = "file"
                        name = "cubePhotos"
                        multiple accept = "image/*"
                        hidden onChange = {
                            handleChange
                        }
                        /> <
                        /Button> <
                        Box sx = {
                            {
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                mt: 1,
                            }
                        } >
                        {
                            (formData.cubePhotoPreviews || []).map(
                                (url, index) => ( <
                                    Box key = {
                                        index
                                    }
                                    sx = {
                                        {
                                            position: "relative",
                                            width: 80,
                                            height: 80,
                                        }
                                    } >
                                    <
                                    img src = {
                                        url
                                    }
                                    alt = "cube-preview"
                                    style = {
                                        {
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: 4,
                                        }
                                    }
                                    /> <
                                    IconButton size = "small"
                                    sx = {
                                        {
                                            position: "absolute",
                                            top: -5,
                                            right: -5,
                                            bgcolor: "white",
                                        }
                                    }
                                    onClick = {
                                        () => removeCubeImage(index)
                                    } >
                                    <
                                    CloseIcon fontSize = "inherit" / >
                                    <
                                    /IconButton> <
                                    /Box>
                                ),
                            )
                        } <
                        /Box> <
                        /Box> <
                        /Grid> {
                            /* <Grid item xs={12} md={8}>
                                                            <DocumentAttachmentDialog activityCode="POUR" attachmentMasterList={attachmentMasterList} formData={formData} onDataChange={onChange} />
                                                        </Grid> */
                        } <
                        /Grid> <
                        /Paper>
                    )
                } <
                /Box>

                { /* --- SINGLE SUBMIT BUTTON --- */ } <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        mt: 3,
                        gap: 2,
                    }
                } >
                <
                Button variant = "contained"
                size = "large"
                onClick = {
                    handlePouringSubmit
                } // This should trigger the combined logic above
                // disabled={loading}
                color = "primary"
                disabled = {!isAcknowledged
                } >
                {
                    formData.is_cube_taken ?
                    "Save Pouring & Cube Sample" :
                        "Submit Pouring Card"
                } <
                /Button> <
                /Box>

                { /* --- DATA TABLE --- */ } {
                    /* <Box sx={{ mt: 4 }}>
                                    <DynamicDataTable
                                      columns={columnPour}
                                      rows={rowsPour}
                                      loading={loading}
                                    />
                                  </Box> */
                } <
                /Paper>

                { /* ================= STEP 3: LOG DATA OVERVIEW ================= */ } {
                    turbineSpecificLogs.length > 0 && ( <
                        Box sx = {
                            {
                                mt: 4
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
                        HistoryIcon fontSize = "small" / > Historic Pouring Logs(TM Batch Matrix) <
                        /Typography> <
                        DynamicDataTable loading = {
                            foundationLoading
                        }
                        columns = {
                            pouringCardColumns
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

export default PouringCardForm;