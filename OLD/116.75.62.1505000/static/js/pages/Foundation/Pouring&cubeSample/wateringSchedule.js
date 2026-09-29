import React, {
    useState,
    useMemo,
    useEffect
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
    Tab,
    Tabs,
    Stack,
    IconButton
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    AddCircleOutline as AddIcon,
    History as HistoryIcon,
    Close as CloseIcon,
    Engineering as EngineeringIcon
} from "@mui/icons-material";
import DynamicDataTable from "../../../components/comman/DynamicDataTable";
import {
    STATUS_OPTIONS
} from "../../../constants/choices";
import NumberTextField from "../../../components/comman/NumberTextField";
import {
    GetWateringSchedule
} from "../../../Redux/InstallationData/FoundationData/foundationAction";
import {
    getDateLimits
} from "../../../utils/dateLimits";

// Helper to extract day number from strings like "Day 7", "7 Mor"
const getDayNum = (str) => {
    if (!str) return 0;
    const match = str.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
};

const WateringScheduleForm = ({
    filters,
    buildColumns,
    wateringData = {},
    turbines,
    onWateringChange,
    inspectors = [],
    onSubmitWatering,
    isAcknowledged,
    setIsAcknowledged
}) => {
    const [tabValue, setTabValue] = useState(0);
    const dispatch = useDispatch();
    const limits = getDateLimits();

    // const { attachmentList, documentList } = useSelector(
    //   (state) => state.masterData || {},
    // );
    const {
        wateringSchedule = [], foundationLoading
    } = useSelector(
        (state) => state.foundationData || {},
    );

    useEffect(() => {
        if (!filters ? .project || !filters ? .windfarm || !wateringData.turbine) {
            return;
        }
        // dispatch(GetAttachmentMasterData({ activity: "PCC" }));

        const apiPayload = {
            ...filters,
            turbine: wateringData.turbine,
        };

        dispatch(GetWateringSchedule(apiPayload));
    }, [
        dispatch,
        filters ? .project,
        filters ? .windfarm,
        filters ? .cluster,
        wateringData.turbine,
    ]);
    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            files
        } = e.target;
        const val = type === "file" ? files[0] : value;
        onWateringChange(name, val);
    };

    const handleRemovePhoto = () => onWateringChange("watering_image", null);

    const WATERING_HEADER_MAP = useMemo(
        () => ({
            turbine_name: "Turbine Location",
            watering_number: "Watering No",
            date_time: "Date & Time",
            water_status: "Progress Status",
            // inspector_name: "Inspector",
            watering_image: "Photo",
        }), [],
    );

    const wateringColumn = useMemo(
        () => buildColumns(WATERING_HEADER_MAP, true), [buildColumns, WATERING_HEADER_MAP],
    );
    const wateringRows = useMemo(() => {
        return (
            wateringSchedule
            // .filter((row) => Number(row.cluster) === Number(filters.cluster))
            .map((row) => ({
                ...row,
                // sample_name:row.sample_name,
                turbine_name: row.turbine_name,
                watering_number: row.watering_number,
                water_status: row.water_status,
                date_time: row.date_time,
                inspector: row.inspector, // keep ID
                inspector_name: row.inspector_name,
                watering_image: row.watering_image,

                approved_status: row.approve_date ? "Approved" : "Pending",
                canEdit: !row.approve_date,
            }))
        );
    }, [wateringSchedule]);

    const filteredTurbines = turbines.filter((turbine) => {
        return !wateringRows.some(
            (wat) =>
            wat.turbine === turbine.id && wat.water_status === "completed",
        );
    });
    // Filter logs for ONLY the selected turbine
    const turbineSpecificLogs = useMemo(() => {
        return wateringRows.filter(
            (r) => Number(r.turbine) === Number(wateringData.turbine),
        );
    }, [wateringRows, wateringData.turbine]);


    // Split turbine-specific logs into 7-day segments
    const filteredLogs = useMemo(() => {
        return {
            logs7: turbineSpecificLogs.filter(r => getDayNum(r.watering_number) <= 7),
            logs14: turbineSpecificLogs.filter(r => {
                const d = getDayNum(r.watering_number);
                return d > 7 && d <= 14;
            }),
            logs21: turbineSpecificLogs.filter(r => {
                const d = getDayNum(r.watering_number);
                return d > 14 && d <= 21;
            }),
            logs28: turbineSpecificLogs.filter(r => {
                const d = getDayNum(r.watering_number);
                return d > 21 && d <= 28;
            }),
        };
    }, [turbineSpecificLogs]);

    const isLastRecord = getDayNum(wateringData.watering_number) === 28;

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
            wateringData.turbine || ""
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
            filteredTurbines.map((t) => ( <
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
            wateringData.turbine && ( <
                Typography variant = "body2"
                color = "primary.main"
                fontWeight = {
                    600
                } >
                ⚡Hydration & Curing Log Active
                for Location: {
                    " "
                } {
                    turbines.find((t) => t.id === wateringData.turbine) ?
                        .location_no
                } <
                /Typography>
            )
        } <
        /Grid> <
        /Grid> <
        /Paper>

        { /* ================= STEP 2: DYNAMIC WORKSPACE ================= */ } {
            !wateringData.turbine ? ( <
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
                Select a turbine location to load 28 - day concrete hydration logs <
                /Typography> <
                /Box>
            ) : ( <
                Box > { /* ================= DATA ENTRY WORKSPACE PANEL ================= */ } <
                Paper sx = {
                    {
                        p: 2.5,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        mb: 4,
                    }
                } >
                <
                Typography variant = "subtitle1"
                fontWeight = {
                    700
                }
                color = "primary.main"
                mb = {
                    2
                } >
                Log New Hydration / Watering Cycle <
                /Typography>

                <
                Grid container spacing = {
                    3
                } >
                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                NumberTextField fullWidth label = "Watering Day"
                name = "watering_number"
                value = {
                    wateringData.watering_number || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                placeholder = "e.g. Day 1 Morning..." /
                >
                <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth type = "datetime-local"
                label = "Date & Time"
                name = "date_time"
                inputProps = {
                    limits.date
                }
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                // inputProps={{
                //   max: new Date().toISOString().slice(0, 16),
                // }}
                value = {
                    wateringData.date_time || ""
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
                    3
                } >
                <
                TextField select required fullWidth label = "Civil Engineer"
                name = "inspector"
                value = {
                    wateringData.inspector || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {!wateringData.inspector
                }
                helperText = {!wateringData.inspector ?
                    "Civil Engineer is required" :
                        ""
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
                name = "water_status"
                value = {
                    wateringData.water_status || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required error = {
                    wateringData.water_status === "completed" && !isLastRecord
                }
                helperText = {
                    wateringData.water_status === "completed" && !isLastRecord ?
                    "Only the final record can be marked as completed." :
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
                        }
                        disabled = {
                            option.value === "completed" && !isLastRecord
                        } >
                        {
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
                Box sx = {
                    {
                        p: 2,
                        mt: 1,
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "grey.50",
                    }
                } >
                <
                Box >
                <
                Typography variant = "subtitle2" >
                Curing Evidence <
                /Typography> <
                Typography variant = "caption"
                color = "text.secondary" > {
                    wateringData.watering_image ?
                    typeof wateringData.watering_image === "string" ?
                    `Uploaded: ${wateringData.watering_image}` :
                    `Selected: ${wateringData.watering_image.name}` :
                        "Upload site photos showing wet hessian or ponding"
                } <
                /Typography> <
                /Box>

                <
                Button component = "label"
                variant = "outlined"
                startIcon = { < UploadIcon / >
                }
                size = "small" >
                Upload Photo <
                input type = "file"
                hidden name = "watering_image"
                accept = "image/*"
                onChange = {
                    handleChange
                }
                /> <
                /Button> <
                /Box> <
                Typography variant = "caption"
                color = "error" >
                *
                Photo is mandatory <
                /Typography> <
                /Grid> <
                /Grid>

                { /* Action Footer */ } <
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
                    I verify that the structural hydration levels are
                    maintained as per curing engineering standards. <
                    /Typography>
                }
                /> <
                Button variant = "contained"
                size = "small"
                onClick = {
                    onSubmitWatering
                }
                disabled = {!isAcknowledged || foundationLoading
                }
                color = "primary"
                startIcon = { < AddIcon / >
                } >
                {
                    foundationLoading ?
                    "Submitting Cycle..." :
                        "Submit Log Entry"
                } <
                /Button> <
                /Alert> <
                /Grid> <
                /Paper>

                { /* ================= STEP 3: TABS-SEGMENTED HISTORY METRIC LOGS ================= */ } <
                Box sx = {
                    {
                        mt: 2
                    }
                } >
                <
                Box display = "flex"
                alignItems = "center"
                mb = {
                    1
                } >
                <
                HistoryIcon sx = {
                    {
                        fontSize: 20,
                        mr: 1,
                        color: "text.secondary"
                    }
                }
                /> <
                Typography variant = "subtitle2"
                color = "text.secondary"
                fontWeight = {
                    700
                } >
                Historic 28 - Day Curing Archives <
                /Typography> <
                /Box>

                <
                Tabs value = {
                    tabValue
                }
                onChange = {
                    (e, v) => setTabValue(v)
                }
                variant = "scrollable"
                scrollButtons = "auto"
                textColor = "primary"
                indicatorColor = "primary"
                sx = {
                    {
                        borderBottom: 1,
                        borderColor: "divider",
                        mb: 2,
                        bgcolor: "#f8fafc",
                        borderRadius: 1,
                    }
                } >
                <
                Tab label = {
                    `0-7 Days (${filteredLogs.logs7.length})`
                }
                sx = {
                    {
                        textTransform: "none",
                        fontWeight: 600
                    }
                }
                /> <
                Tab label = {
                    `8-14 Days (${filteredLogs.logs14.length})`
                }
                sx = {
                    {
                        textTransform: "none",
                        fontWeight: 600
                    }
                }
                /> <
                Tab label = {
                    `15-21 Days (${filteredLogs.logs21.length})`
                }
                sx = {
                    {
                        textTransform: "none",
                        fontWeight: 600
                    }
                }
                /> <
                Tab label = {
                    `22-28 Days (${filteredLogs.logs28.length})`
                }
                sx = {
                    {
                        textTransform: "none",
                        fontWeight: 600
                    }
                }
                /> <
                /Tabs>

                <
                Box sx = {
                    {
                        minHeight: 150
                    }
                } > {
                    [
                        filteredLogs.logs7,
                        filteredLogs.logs14,
                        filteredLogs.logs21,
                        filteredLogs.logs28,
                    ].map((currentRows, idx) => ( <
                        div key = {
                            idx
                        }
                        role = "tabpanel"
                        hidden = {
                            tabValue !== idx
                        } > {
                            tabValue === idx &&
                            (currentRows.length > 0 ? ( <
                                DynamicDataTable columns = {
                                    wateringColumn
                                }
                                rows = {
                                    currentRows
                                }
                                loading = {
                                    foundationLoading
                                }
                                />
                            ) : ( <
                                Box sx = {
                                    {
                                        textAlign: "center",
                                        py: 6,
                                        bgcolor: "#fafafa",
                                        borderRadius: 2,
                                        border: "1px dashed #ccc",
                                    }
                                } >
                                <
                                Typography variant = "body2"
                                color = "text.disabled" >
                                No irrigation cycles recorded
                                for the Day {
                                    " "
                                } {
                                    idx * 7 + 1
                                }
                                to Day {
                                    (idx + 1) * 7
                                }
                                timeline span. <
                                /Typography> <
                                /Box>
                            ))
                        } <
                        /div>
                    ))
                } <
                /Box> <
                /Box> <
                /Box>
            )
        } <
        /Box>
    );
};

export default WateringScheduleForm;