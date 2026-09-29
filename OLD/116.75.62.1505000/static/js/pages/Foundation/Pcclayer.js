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
    IconButton,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    History as HistoryIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon,
} from "@mui/icons-material";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import {
    getDateLimits
} from "../../utils/dateLimits";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import {
    STATUS_OPTIONS
} from "../../constants/choices";
import NumberTextField from "../../components/comman/NumberTextField";
import {
    getPCCLayers
} from "../../Redux/InstallationData/FoundationData/foundationAction";
import {
    GetAttachmentMasterData
} from "../../Redux/MasterData/masterAction";

const PCCForm = ({

    formData = {},
    onChange,
    onSubmitPCC,
    turbines = [],
    contractors = [],
    inspectors = [],
    buildColumns,
    delayCauses,
    // getActivePlan,
    onDelaySubmit,
    isAcknowledged,
    setIsAcknowledged,
    filters,
}) => {
    const dispatch = useDispatch();
    const limits = getDateLimits();

    const {
        attachmentList,
        documentList
    } = useSelector(
        (state) => state.masterData || {},
    );
    const {
        pccLayers = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );

    useEffect(() => {

        if (!filters ? .project || !filters ? .windfarm || !formData.turbine) {
            return;
        }
        dispatch(GetAttachmentMasterData({
            activity: "PCC"
        }));

        const apiPayload = {
            ...filters,
            turbine: formData.turbine,
        };

        dispatch(getPCCLayers(apiPayload));
    }, [
        dispatch,
        filters ? .project,
        filters ? .windfarm,
        filters ? .cluster,
        formData.turbine,
    ]);



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
        // getActivePlan: getActivePlan,
        activityCode: "PCC",
        onDelaySubmit,
    });

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
        }
        onChange(name, val);
    };

    useEffect(() => {
        const turbine = formData.turbine;
        const startDate = formData.start_date;
        const status = formData.pcc_status;

        if (turbine && startDate && status) {
            checkDelay(startDate, turbine, status);
        }
    }, [formData.turbine, formData.start_date, formData.pcc_status, checkDelay]);

    const handleRemovePhoto = () => onChange("evidence_photo", null);

    // 3. Header map for PCC table columns
    const PCC_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            start_date: "Working Date",
            contractor_name: "Contractor",
            inspector_name: "Civil Engineer",
            pcc_layer_thickness: "Thickness (mm)",
            pcc_length: "Length (m)",
            pcc_width: "Width (m)",
            pcc_status: "Status",
            work_description: "Remarks",
            evidence_photo: "Photo",
            attachments_list: "Documents",
        }), [],
    );

    // 4. Build columns using passed buildColumns helper
    const pccColumns = useMemo(() => {
        return buildColumns ? buildColumns(PCC_HEADER_MAP, true) : [];
    }, [buildColumns, PCC_HEADER_MAP]);

    // 5. Map rows and automatically attach dynamic documents from Redux
    const pccRows = useMemo(() => {
        return pccLayers.map((row) => {
            const attachments = documentList
                .filter((doc) => doc.activity === "PCC" && doc.turbine === row.turbine)
                .map((doc) => ({
                    url: doc.file,
                    name: doc.file_type || doc.name || doc.file.split("/").pop(),
                }));

            return {
                ...row,
                approved_status: row.approve_date ? "Approved" : "Pending",
                canEdit: !row.approve_date,
                attachments_list: attachments,
            };
        });
    }, [pccLayers, documentList]);

    // Filter history logs for only the selected turbine
    const turbineSpecificLogs = useMemo(() => {
        return pccRows.filter(
            (row) => Number(row.turbine) === Number(formData.turbine),
        );
    }, [pccRows, formData.turbine]);

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
                } > ⚡PCC Workspace Active
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
                Please select a turbine to load the PCC workspace <
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
                PCC Installation Report <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    3
                } >
                Plain Cement Concrete(PCC) Leveling & Foundation Readiness <
                /Typography>

                <
                Grid container spacing = {
                    3
                } > { /* Contractor Selection */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select fullWidth label = "Contractor"
                name = "contractor"
                size = "small"
                value = {
                    formData.contractor || ""
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
                            c.firm_firm_name || c.firm_name
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                { /* Inspector Selection */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField select fullWidth label = "Civil Engineer"
                name = "inspector"
                size = "small"
                value = {
                    formData.inspector || ""
                }
                onChange = {
                    handleChange
                }
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

                { /* Working Date */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                TextField fullWidth type = "date"
                label = "Working Date"
                name = "start_date"
                size = "small"
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                inputProps = {
                    limits.date
                }
                value = {
                    formData.start_date || ""
                }
                onChange = {
                    handleChange
                }
                error = {!delaySaved
                }
                helperText = {!delaySaved ? "Delay reason required" : ""
                }
                /> <
                /Grid>

                { /* Technical Details: Thickness */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                NumberTextField fullWidth type = "number"
                label = "PCC Thickness (mm)"
                name = "pcc_layer_thickness"
                size = "small"
                value = {
                    formData.pcc_layer_thickness || ""
                }
                onChange = {
                    handleChange
                }
                error = {!formData.pcc_layer_thickness
                }
                helperText = {!formData.pcc_layer_thickness ?
                    "PCC Thickness is required" :
                        ""
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
                NumberTextField fullWidth type = "number"
                label = "Length (m)"
                name = "pcc_length"
                size = "small"
                value = {
                    formData.pcc_length || ""
                }
                onChange = {
                    handleChange
                }
                error = {!formData.pcc_length
                }
                helperText = {!formData.pcc_length ? "Length is required" : ""
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
                NumberTextField fullWidth type = "number"
                label = "Width (m)"
                name = "pcc_width"
                size = "small"
                value = {
                    formData.pcc_width || ""
                }
                onChange = {
                    handleChange
                }
                error = {!formData.pcc_width
                }
                helperText = {!formData.pcc_width ? "Width is required" : ""
                }
                /> <
                /Grid>

                { /* Status Selection */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth label = "PCC Status *"
                name = "pcc_status"
                size = "small"
                value = {
                    formData.pcc_status || ""
                }
                onChange = {
                    handleChange
                }
                required error = {!formData.pcc_status
                }
                helperText = {!formData.pcc_status ? "Please select a status" : ""
                } >
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

                { /* Description/Remarks */ } <
                Grid item xs = {
                    12
                } >
                <
                TextField fullWidth multiline rows = {
                    2
                }
                label = "Work Description / Remarks"
                name = "work_description"
                size = "small"
                value = {
                    formData.work_description || ""
                }
                onChange = {
                    handleChange
                }
                /> <
                /Grid>

                { /* EVIDENCE PHOTO UPLOAD */ } <
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
                Upload PCC Photo <
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
                        alt = "PCC Preview"
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

                { /* Mandatory Documents */ } <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } >
                <
                DocumentAttachmentDialog activityCode = "PCC"
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
                        This activity is delayed by {
                            " "
                        } <
                        strong > {
                            delayData.delay_days
                        } < /strong> days. <
                        /Alert> <
                        /Grid>
                    )
                }

                { /* Acknowledgement */ } <
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
                    I verify that the PCC surface is leveled and thickness
                    is as per technical specifications. <
                    /Typography>
                }
                /> <
                /Alert> <
                /Grid> <
                /Grid>

                { /* Submit Button */ } <
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
                    onSubmitPCC
                }
                disabled = {!isAcknowledged || foundationLoading
                }
                sx = {
                    {
                        px: 4
                    }
                } >
                Submit PCC Report <
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
                        HistoryIcon fontSize = "small" / > Previous PCC Logs
                        for this Turbine <
                        /Typography> <
                        DynamicDataTable loading = {
                            foundationLoading
                        }
                        columns = {
                            pccColumns
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

export default PCCForm;