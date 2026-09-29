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
    IconButton
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    History as HistoryIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon
} from "@mui/icons-material";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import {
    STATUS_OPTIONS
} from "../../constants/choices";
import {
    getDateLimits
} from "../../utils/dateLimits";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import {
    getBackfilling
} from "../../Redux/InstallationData/FoundationData/foundationAction";
import {
    GetAttachmentMasterData
} from "../../Redux/MasterData/masterAction";
import {
    useDispatch,
    useSelector
} from "react-redux";
// import NumberTextField from "../../components/comman/NumberTextField";

const BackfillingForm = ({
    filters,
    buildColumns,
    formData,
    onSubmitBackfill,
    onChangeBackfill,
    turbines = [],
    contractors = [],
    inspectors = [],
    isAcknowledged,
    setIsAcknowledged,
    delayCauses,
    onDelaySubmit
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
        activityCode: "BACKFILL",
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
        backfillingList = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );


    // useEffect(() => {
    //   if (!filters?.project || !filters?.windfarm || !formData.turbine) {
    //     return;
    //   }
    //   dispatch(GetAttachmentMasterData({ activity: "BACKFILL" }));
    //   const apiPayload = {
    //     ...filters,
    //     turbine: formData.turbine,
    //   };
    //   dispatch(getBackfilling(apiPayload));
    // }, [
    //   dispatch,
    //   filters?.project,
    //   filters?.windfarm,
    //   filters?.cluster,
    //   formData.turbine,
    // ]);

    useEffect(() => {
        // console.log(
        //   "🔍 useEffect triggered. Current filters:",
        //   filters,
        //   "Turbine:",
        //   formData.turbine,
        // );

        if (!filters ? .project || !filters ? .windfarm || !formData.turbine) {
            // console.warn("⚠️ Guard block triggered! Missing required value(s):", {
            //   project: filters?.project,
            //   windfarm: filters?.windfarm,
            //   turbine: formData.turbine,
            // });
            return;
        }

        dispatch(GetAttachmentMasterData({
            activity: "BACKFILL"
        }));

        const apiPayload = {
            ...filters,
            turbine: formData.turbine,
        };


        dispatch(getBackfilling(apiPayload));
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

        // if (name === "turbine") {
        //   clearDelay();
        //     onChangeBackfill("turbine", value);

        //     if (formData.backfilling_date) {
        //         checkDelay(formData.backfilling_date, value);
        //     }
        //     return;
        // }

        if (name === "turbine") {
            clearDelay();
            onChangeBackfill("turbine", value);
            return;
        }

        onChangeBackfill(name, val);

    };

    useEffect(() => {
        // Destructure values for clarity
        const turbine = formData.turbine;
        const startDate = formData.backfilling_date;
        const status = formData.backfill_status;

        // GUARD: Only call checkDelay if ALL required fields are present
        if (turbine && startDate && status) {
            checkDelay(startDate, turbine, status);
        }
    }, [
        formData.turbine,
        formData.backfilling_date,
        formData.backfill_status,
        checkDelay,
    ]);


    const handleRemovePhoto = () => onChangeBackfill("evidence_photo", null);

    const BACKFILLING_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            contractor_name: "Contractor",
            backfilling_date: "Backfilling Date",
            material_type: "Material Type",
            backfill_status: "Progress Status",
            // inspector_name: "Inspector",
            evidence_photo: "Photo",
            // fdd_backfill: "FDD Report",
            // mdd_backfill: "MDD Report",
            // remarks: "Remarks",
            attachments_list: "Documents",
        }), [],
    );

    const backfillingColumn = useMemo(
        () => buildColumns(BACKFILLING_HEADER_MAP, true), [buildColumns, BACKFILLING_HEADER_MAP],
    );

    const backfillingRows = useMemo(() => {
        return (
            backfillingList
            .map((row) => {
                const attachments =
                    row.id ===
                    Math.max(
                        ...backfillingList
                        .filter((r) => r.turbine === row.turbine)
                        .map((r) => r.id),
                    ) ?
                    documentList
                    .filter(
                        (doc) =>
                        doc.activity === "BACKFILL" &&
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
                    inspector_name: row.inspector_name,
                    contractor_name: row.contractor_name,
                    attachments_list: attachments,
                    canEdit: !row.approve_date,
                    approved_status: row.approve_date ? "Approved" : "Pending",
                }
            })
        )
    }, [backfillingList, documentList]);


    // Filter logs for only the selected turbine
    const turbineSpecificLogs = backfillingRows.filter(
        (row) => Number(row.turbine) === Number(formData.turbine),
    );

    // const hasMissingMandatoryDocs = () => {
    //     const selectedItems = formData.selected_items || [];
    //     return selectedItems.some((doc) => doc.is_mandatory && !doc.file);
    // };



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
                } >
                ⚡Backfilling Workspace Active
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
                Select a turbine target parameter to verify backfilling logs <
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
                Backfilling Details <
                /Typography>

                <
                Grid container spacing = {
                    2
                } > { /* Backfilling Date */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth label = "Backfilling Date"
                type = "date"
                name = "backfilling_date"
                value = {
                    formData.backfilling_date || ""
                }
                onChange = {
                    handleChange
                }
                error = {!formData.backfilling_date
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
                size = "small" /
                >
                <
                /Grid>

                { /* Material Type */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth label = "Material Type"
                name = "material_type"
                value = {
                    formData.material_type || ""
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
                TextField fullWidth label = "Compaction"
                name = "compaction_percentage"
                value = {
                    formData.compaction_percentage || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" /
                >
                <
                /Grid>

                { /* Contractor */ } <
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
                <
                MenuItem value = "" > Select Contractor < /MenuItem> {
                    contractors ? .map((item) => ( <
                        MenuItem key = {
                            item.id
                        }
                        value = {
                            item.id
                        } > {
                            item.firm_name
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                { /* Inspector */ } <
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
                helperText = {!formData.inspector === "" ? "Engineer is required *" : ""
                } >
                <
                MenuItem value = "" > Select Inspector < /MenuItem> {
                    inspectors ? .map((item) => ( <
                        MenuItem key = {
                            item.id
                        }
                        value = {
                            item.id
                        } > {
                            item.full_name
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                { /* Status */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select fullWidth label = "Status *"
                name = "backfill_status"
                value = {
                    formData.backfill_status || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {!formData.backfill_status
                }
                helperText = {!formData.backfill_status ? "Please select a status" : ""
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

                { /* Remarks */ } <
                Grid item xs = {
                    12
                } >
                <
                TextField fullWidth multiline rows = {
                    2
                }
                label = "Remarks"
                name = "remarks"
                value = {
                    formData.remarks || ""
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
                /Grid>

                { /* FDD Document */ } {
                    /* <Grid item xs={12} md={4}>
                                            <Button variant="outlined" component="label" fullWidth>
                                                Upload FDD Report
                                                <input
                                                    hidden
                                                    type="file"
                                                    name="fdd_backfill"
                                                    onChange={handleFileChange}
                                                />
                                            </Button>
                                        </Grid> */
                }

                { /* MDD Document */ } {
                    /* <Grid item xs={12} md={4}>
                                            <Button variant="outlined" component="label" fullWidth>
                                                Upload MDD Report
                                                <input
                                                    hidden
                                                    type="file"
                                                    name="mdd_backfill"
                                                    onChange={handleFileChange}
                                                />
                                            </Button>
                                        </Grid> */
                }

                <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } > { /* REUSABLE POPUP COMPONENT */ } <
                DocumentAttachmentDialog activityCode = "BACKFILL"
                attachmentMasterList = {
                    attachmentList
                }
                formData = {
                    formData
                }
                onDataChange = {
                    onChangeBackfill
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
                    The foundation is now certified ready
                    for systematic
                    backfilling and compaction. <
                    /Typography>
                }
                /> <
                /Alert> <
                /Grid> { /* Submit */ } <
                Grid item xs = {
                    12
                } >
                <
                Box textAlign = "center" >
                <
                Button variant = "contained"
                color = "primary"
                onClick = {
                    onSubmitBackfill
                }
                disabled = {!isAcknowledged || foundationLoading
                } >
                Submit Backfilling <
                /Button> <
                /Box> <
                /Grid> <
                /Grid> <
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
                        HistoryIcon fontSize = "small" / > Historic Earthwork Backfilling Logs <
                        /Typography> <
                        DynamicDataTable loading = {
                            foundationLoading
                        }
                        columns = {
                            backfillingColumn
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

        { /* ================= COMPLIANCE POPUPS DICTIONARY ================= */ } <
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

export default BackfillingForm;