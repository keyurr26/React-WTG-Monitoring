import React, {
    useEffect,
    useState,
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    History as HistoryIcon,
    WarningAmber as WarningIcon,
    Engineering as EngineeringIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import DefectPopup from "./DefectPopup";
import {
    STATUS_OPTIONS
} from "../../constants/choices";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import {
    getDateLimits
} from "../../utils/dateLimits";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import {
    GetAttachmentMasterData
} from "../../Redux/MasterData/masterAction";
import {
    getDeshuttering
} from "../../Redux/InstallationData/FoundationData/foundationAction";

const DeshutteringForm = ({
    filters,
    buildColumns,
    turbines = [],
    inspectors = [],
    defects,
    addDefect,
    removeDefect,
    onDefectChange,
    formData = {},
    onDeshutteringChange,
    onSubmitDeshuttering,
    isAcknowledged,
    setIsAcknowledged,
    // columnsDeshuttering,
    delayCauses,
    onDelaySubmit,
    // rowsDeshuttering = [],
    openDefectPopup,
    selectedDefects,
    setOpenDefectPopup,
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
        activityCode: "DESHUTTER",
        onDelaySubmit,
    });

    const [openPopup, setOpenPopup] = useState(false);
    const limits = getDateLimits();
    const dispatch = useDispatch();
    const {
        attachmentList,
        documentList
    } = useSelector(
        (state) => state.masterData || {},
    );
    const {
        deshutteringList = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !formData.turbine) {
            return;
        }
        dispatch(GetAttachmentMasterData({
            activity: "DESHUTTER"
        }));
        const apiPayload = {
            ...filters,
            turbine: formData.turbine,
        };
        dispatch(getDeshuttering(apiPayload));
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
            checked,
            files
        } = e.target;

        let val;
        if (type === "checkbox") val = checked;
        else if (type === "file") val = files[0];
        else val = value;

        if (name === "turbine") {
            clearDelay();
        }

        onDeshutteringChange(name, val);

        if (name === "defect_found" && checked) {
            setOpenPopup(true);
        }
    };

    useEffect(() => {
        // Destructure values for clarity
        const turbine = formData.turbine;
        const startDate = formData.deshuttering_date;
        const status = formData.desh_status;

        // GUARD: Only call checkDelay if ALL required fields are present
        if (turbine && startDate && status) {
            checkDelay(startDate, turbine, status);
        }
    }, [
        formData.turbine,
        formData.deshuttering_date,
        formData.desh_status,
        checkDelay,
    ]);

    const handleRemovePhoto = () => onDeshutteringChange("evidence_photo", null);


    const DE_SHUTTERING_HEADER = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            deshuttering_date: "Deshuttering Date",
            defects: "Defect View",
            defect_found: "Defect Found",
            desh_status: "Progress Status",
            // inspector_name: "Inspector",
            remarks: "Remarks",
            attachments_list: "Documents",
        }), [],
    );
    const deshutteringColumns = useMemo(
        () => buildColumns(DE_SHUTTERING_HEADER, true), [buildColumns, DE_SHUTTERING_HEADER],
    );

    const deshutteringRows = useMemo(() => {
        return (
            deshutteringList
            .map((row) => {
                const attachments =
                    row.id ===
                    Math.max(
                        ...deshutteringList
                        .filter((r) => r.turbine === row.turbine)
                        .map((r) => r.id),
                    ) ?
                    documentList
                    .filter(
                        (doc) =>
                        doc.activity === "DESHUTTER" && doc.turbine === row.turbine,
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
                    inspector_name: row.inspector_name,
                    defect_found: row.defect_found ? "Yes" : "No",
                    attachments_list: attachments,
                    canEdit: !row.approve_date,
                    approved_status: row.approve_date ? "Approved" : "Pending",
                }

            }))
    }, [deshutteringList, documentList]);


    // Filter logs for only the selected turbine
    const turbineSpecificLogs = deshutteringRows.filter(
        (row) => Number(row.turbine) === Number(formData.turbine),
    );

    //  const filteredTurbines = turbines.filter((turbine) => {
    //     return !rowsDeshuttering.some(
    //         (desh) => desh.turbine === turbine.id && desh.desh_status === "completed"
    //     );
    // });

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
                } > ⚡Deshuttering Ledger Active
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
                Select a turbine target parameter to verify deshuttering logs <
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
                Deshuttering Activity Form <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    2
                } >
                If defects are found, ensure photos are uploaded. <
                /Typography> <
                Grid container spacing = {
                    2
                }
                mt = {
                    1
                } > {
                    /* <Grid item xs={12} md={3}>
                                      <TextField
                                        select
                                        label="Turbine Location"
                                        name="turbine"
                                        required
                                        value={formData.turbine || ""}
                                        fullWidth
                                        size="small"
                                        onChange={handleChange}
                                      >
                                        {filteredTurbines?.map((t) => (
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
                TextField type = "date"
                name = "deshuttering_date"
                value = {
                    formData.deshuttering_date || ""
                }
                fullWidth size = "small"
                onChange = {
                    handleChange
                }
                error = {!formData.deshuttering_date
                }
                inputProps = {
                    {
                        min: limits.date.min,
                        max: limits.date.max,
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
                TextField select required fullWidth label = "Civil Engineer"
                name = "inspector"
                value = {
                    formData.inspector || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                placeholder = "Verified by..."
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
                name = "desh_status"
                value = {
                    formData.desh_status || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {!formData.desh_status
                }
                helperText = {!formData.desh_status ? "Please select a status" : ""
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
                TextField label = "Remarks"
                name = "remarks"
                value = {
                    formData.remarks || ""
                }
                fullWidth size = "small"
                multiline onChange = {
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
                Upload Deshuttering Photo <
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
                                width: 200
                            }
                        } >
                        <
                        img src = {
                            typeof formData.evidence_photo === "string" ?
                            formData.evidence_photo :
                                URL.createObjectURL(formData.evidence_photo)
                        }
                        alt = "Deshutering Preview"
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
                /Grid>

                { /* Defect Checkbox */ }

                <
                FormControlLabel control = { <
                    Checkbox
                    name = "defect_found"
                    checked = {
                        formData ? .defect_found || false
                    }
                    onChange = {
                        handleChange
                    }
                    />
                }
                label = "Defect Found" /
                >

                <
                DefectPopup open = {
                    openPopup
                }
                handleClose = {
                    () => setOpenPopup(false)
                }
                defects = {
                    defects
                }
                addDefect = {
                    addDefect
                }
                removeDefect = {
                    removeDefect
                }
                onDefectChange = {
                    onDefectChange
                }
                />

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
                Box sx = {
                    {
                        mt: 4,
                        p: 2,
                        bgcolor: "#e3f2fd",
                        borderRadius: 1
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
                    Typography variant = "caption" > {
                        " "
                    }
                    I confirm that all defects observed have been accurately
                    documented and the turbine location is ready
                    for the next
                    stage of activity. <
                    /Typography>
                }
                /> <
                /Box>

                { /* Optional: Add a 'Confirmation' Checkbox */ }

                { /* Submit */ }

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
                    onSubmitDeshuttering
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
                        HistoryIcon fontSize = "small" / > Historic Formwork Deshuttering Database Rows <
                        /Typography> <
                        DynamicDataTable loading = {
                            foundationLoading
                        }
                        columns = {
                            deshutteringColumns
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

        { /* ================= POPUP / DIALOG DICTIONARIES ================= */ } <
        DefectPopup open = {
            openPopup
        }
        handleClose = {
            () => setOpenPopup(false)
        }
        defects = {
            defects
        }
        addDefect = {
            addDefect
        }
        removeDefect = {
            removeDefect
        }
        onDefectChange = {
            onDefectChange
        }
        />

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
        />

        { /* Historic Archive Defect View Dialog */ } <
        Dialog open = {
            openDefectPopup
        }
        onClose = {
            () => setOpenDefectPopup(false)
        }
        maxWidth = "md"
        fullWidth sx = {
            {
                "& .MuiPaper-root": {
                    borderRadius: 3
                }
            }
        } >
        <
        DialogTitle sx = {
            {
                fontWeight: 700,
                color: "primary.main",
                borderBottom: "1px solid #e2e8f0",
                py: 2,
            }
        } >
        Defect Details History <
        /DialogTitle> <
        DialogContent sx = {
            {
                mt: 2,
                p: 0
            }
        } >
        <
        Box sx = {
            {
                p: 2
            }
        } >
        <
        DynamicDataTable rows = {
            selectedDefects || []
        }
        getRowId = {
            (row) => row.id || Math.random()
        }
        columns = {
            [{
                    field: "defect_location",
                    headerName: "Location / Zone",
                    width: 200,
                },
                {
                    field: "defect_description",
                    headerName: "Description",
                    width: 350,
                },
                {
                    field: "action_taken",
                    headerName: "Corrective Action / Resolution Plan",
                    width: 250,
                },
            ]
        }
        /> <
        /Box> <
        /DialogContent> <
        DialogActions sx = {
            {
                borderTop: "1px solid #e2e8f0",
                p: 2
            }
        } >
        <
        Button onClick = {
            () => setOpenDefectPopup(false)
        }
        variant = "outlined"
        size = "small"
        sx = {
            {
                borderRadius: 1.5
            }
        } >
        Close Archive <
        /Button> <
        /DialogActions> <
        /Dialog> <
        /Box>
    );
};

export default DeshutteringForm;