import React, {
    useState,
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
    History as HistoryIcon,
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon,
} from "@mui/icons-material";
import {
    PIPE_MATERIAL_OPTIONS,
    STATUS_OPTIONS
} from "../../constants/choices";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    getDateLimits
} from "../../utils/dateLimits";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import useDelayHandler from "../../hooks/useDelayHandler";
import NumberTextField from "../../components/comman/NumberTextField";
import DelayPopup from "../../components/comman/DelayPopup";
import {
    getConductLaying
} from "../../Redux/InstallationData/FoundationData/foundationAction";
import {
    GetAttachmentMasterData
} from "../../Redux/MasterData/masterAction";

const ConduitLayingForm = ({
    filters,
    buildColumns,
    formData = {},
    onChange,
    onSubmitConduit,
    turbines = [],
    contractors = [],
    inspectors = [],
    delayCauses,

    onDelaySubmit,

    isAcknowledged,
    setIsAcknowledged,
    showSnackbar,
}) => {
    const [selectedCause, setSelectedCause] = useState("");
    const [delayDescription, setDelayDescription] = useState("");
    const [isDelayPreSaved, setIsDelayPreSaved] = useState(false);
    const {
        delayOpen,
        delayData,
        //  delaySaved,
        checkDelay,
        handleDelaySubmit,
        openDelayPopup,
        closeDelayPopup,
        clearDelay,
    } = useDelayHandler({
        //  getActivePlan: getActivePlan,
        activityCode: "CONDUIT",
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
        conductLayings = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !formData.turbine) {
            return;
        }
        dispatch(GetAttachmentMasterData({
            activity: "CONDUIT"
        }));
        const apiPayload = {
            ...filters,
            turbine: formData.turbine,
        };
        dispatch(getConductLaying(apiPayload));
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
        const status = formData.conduct_status;

        // GUARD: Only call checkDelay if ALL required fields are present
        if (turbine && startDate && status) {
            checkDelay(startDate, turbine, status);
        }
    }, [
        formData.turbine,
        formData.start_date,
        formData.conduct_status,
        checkDelay,
    ]);


    const handleRemovePhoto = () => onChange("evidence_photo", null);


    const CONDUIT_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            pipe_diameter: "Pipe Diameter",
            pipe_material: "Pipe Material",
            length_installed: "Length Installed (m)",
            no_of_pipe: "No. of Pipe",
            start_date: "Working Date",
            conduct_status: "Progress Status",
            // end_date: "End Date",
            contractor_name: "Contractor",
            // inspector_name: "Inspector",
            evidence_photo: "Photo",
            attachments_list: "Documents",
            // document: "Conduit Document",
        }), [],
    );

    const conduitColumns = useMemo(
        () => buildColumns(CONDUIT_HEADER_MAP, true), [buildColumns, CONDUIT_HEADER_MAP],
    );


    // 4. Conduit Rows
    const conduitRows = useMemo(() => {
        return (
            conductLayings
            .map((row) => {
                const attachments =
                    row.id ===
                    Math.max(
                        ...conductLayings
                        .filter((r) => r.turbine === row.turbine)
                        .map((r) => r.id),
                    ) ?
                    documentList
                    .filter(
                        (doc) =>
                        doc.activity === "CONDUIT" &&
                        doc.turbine === row.turbine,
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
                    contractor_name: row.contractor_name,
                    inspector_name: row.inspector_name,
                    canEdit: !row.approve_date,
                    attachments_list: attachments,
                    approved_status: row.approve_date ? "Approved" : "Pending",
                }
            })
        );
    }, [conductLayings, documentList]);


    const turbineSpecificLogs = conduitRows.filter(
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
                } > ⚡Conduit Workspace Active
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
                Please select a turbine to load the workspace <
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
                Conduit Laying Log <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    4
                } >
                Pipe Installation, Cable Ducts & Drainage Documentation <
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
                md = {
                    4
                } >
                <
                NumberTextField fullWidth label = "Pipe Diameter"
                name = "pipe_diameter"
                value = {
                    formData.pipe_diameter || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                InputProps = {
                    {
                        endAdornment: ( <
                            InputAdornment position = "end" > mm < /InputAdornment>
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
                TextField select fullWidth label = "Pipe Material"
                name = "pipe_material"
                value = {
                    formData.pipe_material || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" >
                {
                    PIPE_MATERIAL_OPTIONS.map((opt) => ( <
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
                NumberTextField fullWidth label = "No. of Pipe"
                name = "no_of_pipe"
                type = "number"
                value = {
                    formData.no_of_pipe || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" /
                >
                <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                NumberTextField fullWidth label = "Length Installed"
                name = "length_installed"
                type = "number"
                value = {
                    formData.length_installed || ""
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
                md = {
                    4
                } >
                <
                TextField select fullWidth label = "Civil Engineer"
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
                    4
                } >
                <
                TextField select fullWidth label = "Status *"
                name = "conduct_status"
                value = {
                    formData.conduct_status || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {!formData.conduct_status
                }
                helperText = {!formData.conduct_status ? "Please select a status" : ""
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
                TextField fullWidth label = "Work Description"
                name = "work_description"
                multiline rows = {
                    2
                }
                value = {
                    formData.work_description || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" /
                >
                <
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
                    formData.evidence_photo && ( <
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
                DocumentAttachmentDialog activityCode = "CONDUIT"
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
                } { /* ================= 🔥 PERSISTENT INLINE DELAY ERROR SECTION ================= */ } {
                    /* {hasDelay && (
                                    <Grid item xs={12}>
                                      <Box
                                        sx={{
                                          p: 3,
                                          my: 1,
                                          border: isDelayPreSaved
                                            ? "2px solid #2e7d32"
                                            : "2px solid #d32f2f", // Green if linked, Red if required
                                          borderRadius: 2,
                                          bgcolor: isDelayPreSaved ? "#f1f8e9" : "#fff8f8",
                                        }}
                                      >
                                        {isDelayPreSaved ? (
                                          <Alert severity="success" sx={{ mb: 2 }}>
                                            ✓ Existing matching delay analysis entry located and
                                            auto-bound for this milestone tracking window.
                                          </Alert>
                                        ) : (
                                          <>
                                            <Typography
                                              variant="subtitle2"
                                              color="error"
                                              fontWeight="bold"
                                              gutterBottom
                                            >
                                              ⚠ Schedule Exception: This activity is delayed by{" "}
                                              {delayData.delay_days} days.
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                              sx={{ mb: 2 }}
                                            >
                                              Assigning a valid delay justification cause key is
                                              required to clear form verification limits.
                                            </Typography>
                                          </>
                                        )}

                                        <Grid container spacing={2}>
                                          <Grid item xs={12} md={6}>
                                            <TextField
                                              select
                                              fullWidth
                                              required
                                              disabled={isDelayPreSaved} // Lock input if bound
                                              size="small"
                                              label="Delay Cause Key"
                                              value={selectedCause}
                                              onChange={(e) => setSelectedCause(e.target.value)}
                                              error={!selectedCause && !isDelayPreSaved}
                                              helperText={
                                                !selectedCause && !isDelayPreSaved
                                                  ? "This field is required."
                                                  : ""
                                              }
                                              sx={{ bgcolor: "#fff" }}
                                            >
                                              {delayCauses
                                                ?.filter((c) => c.type === "Delay Cause")
                                                .map((c) => (
                                                  <MenuItem key={c.id} value={c.id}>
                                                    {c.name}
                                                  </MenuItem>
                                                ))}
                                            </TextField>
                                          </Grid>
                                          <Grid item xs={12}>
                                            <TextField
                                              fullWidth
                                              disabled={isDelayPreSaved} // Lock input if bound
                                              size="small"
                                              required
                                              label="Delay Analysis Remarks / Description"
                                              multiline
                                              rows={2}
                                              value={delayDescription}
                                              onChange={(e) => setDelayDescription(e.target.value)}
                                              sx={{ bgcolor: "#fff" }}
                                            />
                                          </Grid>
                                        </Grid>
                                      </Box>
                                    </Grid>
                                  )} */
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
                    Ensure all conduit joints are sealed and internal
                    pathways are clear before backfilling. <
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
                    onSubmitConduit
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
                        HistoryIcon fontSize = "small" / > Conduit Logs
                        for this Location <
                        /Typography> <
                        DynamicDataTable loading = {
                            foundationLoading
                        }
                        columns = {
                            conduitColumns
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

export default ConduitLayingForm;