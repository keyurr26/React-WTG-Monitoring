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
    Divider,
    IconButton,
    Stack,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    AddCircleOutline as AddIcon,
    History as HistoryIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon,
} from "@mui/icons-material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    getDateLimits
} from "../../utils/dateLimits";
import DocumentAttachmentDialog from "../MultipleDocumentUpload/DocumentAttachmentDialog";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import {
    STATUS_OPTIONS
} from "../../constants/choices";
import useDelayHandler from "../../hooks/useDelayHandler";
import DelayPopup from "../../components/comman/DelayPopup";
import {
    GetMaterialIssueData,
    GetMaterialRecivedData,
} from "../../Redux/MasterData/masterAction";
import NumberTextField from "../../components/comman/NumberTextField";
import {
    GetAttachmentMasterData
} from "../../Redux/MasterData/masterAction";
import {
    getAnchorCages
} from "../../Redux/InstallationData/FoundationData/foundationAction";
import useKpiValidator from "../../hooks/useKpiValidator";
import {
    getFormKpiFields
} from "../../config/kpiFieldConfigs";

const AnchorCageForm = ({
    filters,
    buildColumns,
    formData = {},
    onChange,
    onSubmitAnchor,
    turbines = [],
    contractors = [],
    inspectors = [],
    kpiList = [],
    showSnackbar,
    delayCauses,
    onDelaySubmit,
    isAcknowledged,
    setIsAcknowledged,
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
        activityCode: "ANCHOR",
        onDelaySubmit,
    });

    const limits = getDateLimits();
    const dispatch = useDispatch();
    const {
        attachmentList,
        documentList,
        MaterialIssueData = [],
        FetchMaterialRecivedData = [],
        loading,
    } = useSelector((state) => state.masterData || {});

    const {
        anchorCages = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !formData.turbine) {
            return;
        }
        dispatch(GetAttachmentMasterData({
            activity: "ANCHOR"
        }));
        const apiPayload = {
            ...filters,
            turbine: formData.turbine,
        };
        dispatch(getAnchorCages(apiPayload));
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
            onChange("bolt_batch", "");
            onChange("no_of_bolts", "");
        } else {
            onChange(name, val);
        }
    };

    useEffect(() => {
        const turbine = formData.turbine;
        const startDate = formData.start_date;
        const status = formData.anchor_status;

        if (turbine && startDate && status) {
            checkDelay(startDate, turbine, status);
        }
    }, [
        formData.turbine,
        formData.start_date,
        formData.anchor_status,
        checkDelay,
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

        if (formData.turbine) {
            issuePayload.issued_turbine = formData.turbine;
        }

        dispatch(GetMaterialIssueData(issuePayload));
    }, [dispatch, filters ? .project, filters ? .windfarm, formData.turbine]);

    const turbineIssuedMaterials = useMemo(() => {
        if (!formData.turbine) return [];
        return MaterialIssueData.filter(
            (item) => String(item.issued_turbine) === String(formData.turbine),
        );
    }, [MaterialIssueData, formData.turbine]);

    const availableAnchorCages = useMemo(() => {
        return turbineIssuedMaterials.filter(
            (i) => i.component_type === "Anchor Cage",
        );
    }, [turbineIssuedMaterials]);

    const availableBoltBatches = useMemo(() => {
        return turbineIssuedMaterials.filter((i) => i.component_type === "Bolt");
    }, [turbineIssuedMaterials]);

    const autoAnchor = useMemo(() => {
        return (
            availableAnchorCages.find(
                (i) => String(i.id) === String(formData.anchor_sr_no),
            ) || availableAnchorCages[0]
        );
    }, [availableAnchorCages, formData.anchor_sr_no]);

    useEffect(() => {
        if (!formData.turbine) return;
        if (autoAnchor && !formData.anchor_sr_no) {
            onChange("anchor_sr_no", autoAnchor.id);
        }
    }, [formData.turbine, autoAnchor, formData.anchor_sr_no, onChange]);

    const selectedBoltBatchObj = useMemo(() => {
        return MaterialIssueData.find(
            (i) => String(i.id) === String(formData.bolt_batch),
        );
    }, [MaterialIssueData, formData.bolt_batch]);

    const maxIssuedQuantity = selectedBoltBatchObj ? .quantity || 0;

    const previouslyUsedBolts = useMemo(() => {
        if (!formData.bolt_batch) return 0;
        return (anchorCages || []).reduce((total, entry) => {
            const matchesTurbine = String(entry.turbine) === String(formData.turbine);
            const matchesBatch =
                String(entry.bolt_batch) === String(formData.bolt_batch) ||
                String(entry.bolt_batch_id) === String(formData.bolt_batch);
            const isNotCurrentEdit = String(entry.id) !== String(formData.id);

            if (matchesTurbine && matchesBatch && isNotCurrentEdit) {
                return total + Number(entry.no_of_bolts || 0);
            }
            return total;
        }, 0);
    }, [anchorCages, formData.turbine, formData.id, formData.bolt_batch]);

    const currentEnteredBolts = Number(formData.no_of_bolts || 0);
    const remainingAllowedQuantity = Math.max(
        0,
        maxIssuedQuantity - previouslyUsedBolts,
    );

    const isQuantityExceeded =
        remainingAllowedQuantity === 0 ||
        currentEnteredBolts > remainingAllowedQuantity;

    const ANCHOR_CAGE_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Location No",
            // bolt_size: "Bolt Size",
            anchor_sr_no: "Anchor Sr No.",
            torquing_sr_no: "Torque Sr No.",
            torquing: "Torquing Range",
            bolt_batch: "Bolt Batch No.",
            no_of_bolts: "No of Bolts",
            start_date: "Working Date",
            anchor_status: "Progress Status",
            // end_date: "End Date",
            contractor_name: "Contractor",
            // inspector_name: "Inspector",
            evidence_photo: "Photo",
            attachments_list: "Documents",
            // document: "Anchor Cage Document",
        }), [],
    );

    const anchorCageColumns = useMemo(
        () => buildColumns(ANCHOR_CAGE_HEADER_MAP, true), [buildColumns, ANCHOR_CAGE_HEADER_MAP],
    );

    // 5. Anchor Cage Rows
    const anchorCageRows = useMemo(() => {
        return anchorCages.map((row) => {
            const attachments =
                row.id ===
                Math.max(
                    ...anchorCages
                    .filter((r) => r.turbine === row.turbine)
                    .map((r) => r.id),
                ) ?
                documentList
                .filter(
                    (doc) =>
                    doc.activity === "ANCHOR" && doc.turbine === row.turbine,
                )
                .map((doc) => ({
                    url: doc.file,
                    name: doc.file_type || doc.name || doc.file.split("/").pop(),
                    doc_no: doc.doc_no || "N/A",
                    doc_date: doc.doc_date || "N/A",
                    remarks: doc.remarks || "",
                })) :
                [];
            const findSerial = (id) => {
                const item = MaterialIssueData.find((i) => String(i.id) === String(id));
                return item ? item.material_sr_no : id;
            };

            return {
                ...row,
                turbine_name: row.turbine_name,
                contractor_name: row.contractor_name,
                inspector_name: row.inspector_name,
                anchor_sr_no: findSerial(row.anchor_sr_no),
                torquing_sr_no: findSerial(row.torquing_sr_no),
                bolt_batch: findSerial(row.bolt_batch),
                attachments_list: attachments,
                canEdit: !row.approve_date,
                approved_status: row.approve_date ? "Approved" : "Pending",
            };
        });
    }, [anchorCages, MaterialIssueData, documentList]);

    const fieldsToTrack = useMemo(
        () => getFormKpiFields("ANCHOR", formData, anchorCageRows), [formData, anchorCageRows],
    );

    const {
        kpiStatus,
        validateKpi
    } = useKpiValidator(
        kpiList,
        formData.turbine,
        fieldsToTrack,
    );

    const handleAnchorSubmit = () => {
        if (!validateKpi("torquing", showSnackbar)) {
            return;
        }

        if (!formData.inspector) {
            showSnackbar(
                "Please select a Civil Engineer before submitting.",
                "error",
            );
            return;
        }

        if (onSubmitAnchor) {
            onSubmitAnchor(formData);
        }
    };

    // Filter logs for only the selected turbine
    const turbineSpecificLogs = anchorCageRows.filter(
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
        } >
        <
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
                } > ⚡Anchor Cage Workspace Active
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

        {
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
                Anchor Cage Placement <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    4
                } >
                Foundation Bolt Assembly & Structural Alignment <
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
                TextField fullWidth required label = "Anchor Serial No"
                size = "small"
                value = {
                    autoAnchor ? .material_sr_no || ""
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                sx = {
                    {
                        bgcolor: "#f9f9f9"
                    }
                }
                error = {!autoAnchor ? .material_sr_no
                }
                helperText = {!autoAnchor ? .material_sr_no ?
                    "Anchor Serial No is required" :
                    ""
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
                TextField select fullWidth required label = "Torquing SR No"
                name = "torquing_sr_no"
                value = {
                    formData.torquing_sr_no || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {!formData.torquing_sr_no
                }
                helperText = {!formData.torquing_sr_no ? "Torquing SR No is required" : ""
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
                    4
                } >
                <
                TextField select fullWidth required label = "Bolt Batch"
                name = "bolt_batch"
                value = {
                    formData.bolt_batch || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {!formData.bolt_batch
                }
                helperText = {!formData.bolt_batch ? "Bolt Batch is required" : ""
                } >
                <
                MenuItem value = "" >
                <
                em > Select Bolt Batch... < /em> <
                /MenuItem> {
                    availableBoltBatches.map((batch) => ( <
                        MenuItem key = {
                            batch.id
                        }
                        value = {
                            batch.id
                        } > {
                            batch.material_sr_no
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
                TextField fullWidth type = "number"
                label = "No of Bolts"
                name = "no_of_bolts"
                value = {
                    remainingAllowedQuantity === 0 ?
                    0 :
                        formData.no_of_bolts || ""
                }
                onChange = {
                    (e) => {
                        onChange("no_of_bolts", e.target.value);
                    }
                }
                size = "small"
                disabled = {!formData.bolt_batch || remainingAllowedQuantity === 0
                }
                error = {
                    isQuantityExceeded
                }
                helperText = {!formData.bolt_batch ?
                    "Please select a bolt batch first" :
                        remainingAllowedQuantity === 0 ?
                        "⚠️ All issued bolts for this batch have already been used (Available: 0)." :
                        `Issued: ${maxIssuedQuantity} | Already logged: ${previouslyUsedBolts} | Available: ${remainingAllowedQuantity}`
                }
                inputProps = {
                    {
                        max: remainingAllowedQuantity,
                        min: remainingAllowedQuantity > 0 ? 1 : 0,
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
                NumberTextField fullWidth required label = "Torquing Range"
                name = "torquing"
                type = "number"
                placeholder = "e.g. 350 Nm / Pre-tensioned"
                value = {
                    formData.torquing || ""
                }
                error = {!!kpiStatus.torquing ? .isError
                }
                helperText = {
                    kpiStatus.torquing ? .isError ?
                    `${kpiStatus.torquing.msg}: ${kpiStatus.torquing.min} to ${kpiStatus.torquing.max} Nm` :
                    `Target: Min ${kpiStatus.torquing?.min || 0} Nm / Max ${kpiStatus.torquing?.max || "N/A"} Nm`
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
                required label = "Working Date"
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
                    4
                } >
                <
                TextField select fullWidth label = "Status *"
                name = "anchor_status"
                value = {
                    formData.anchor_status || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {!formData.anchor_status
                }
                helperText = {!formData.anchor_status ? "Please select a status" : ""
                } >
                {
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

                {
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
                        /> <
                        IconButton size = "small"
                        onClick = {
                            () => onChange("evidence_photo", null)
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

                <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } >
                <
                DocumentAttachmentDialog activityCode = "ANCHOR"
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
                    CRITICAL: Verify verticality and center - alignment of the
                    cage before finalizing the placement. <
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
                    handleAnchorSubmit
                }
                disabled = {!isAcknowledged || foundationLoading
                } >
                Submit <
                /Button> <
                /Box> <
                /Paper>

                {
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
                        HistoryIcon fontSize = "small" / > Previous Anchor Cage Logs
                        for this Location <
                        /Typography> <
                        DynamicDataTable loading = {
                            foundationLoading
                        }
                        columns = {
                            anchorCageColumns
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

export default AnchorCageForm;