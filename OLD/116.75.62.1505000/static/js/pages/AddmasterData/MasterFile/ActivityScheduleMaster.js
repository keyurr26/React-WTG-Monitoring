import React, {
    useEffect,
    useState,
    useMemo
} from "react";
import {
    Grid,
    TextField,
    Button,
    MenuItem,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    TablePagination,
    InputAdornment,
    Alert,
    LinearProgress,
    Chip,
} from "@mui/material";
import {
    Search
} from "lucide-react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import {
    CreateActivityScheduleData,
    GetActivityScheduleData,
    GetComponentTypesList,
    GetProjectsData,
    GetWindFarmMasterData,
} from "../../../Redux/MasterData/masterAction";

const CATEGORY_CHOICES = [{
        value: "ROAD",
        label: "Road Layouts"
    },
    {
        value: "FOUNDATION",
        label: "Civil Foundation"
    },
    {
        value: "WTG_INSTALLATION",
        label: "Turbine Installation"
    },
    {
        value: "COMMISSIONING",
        label: "Commissioning Details"
    },
    {
        value: "ELECTRICAL",
        label: "Electrical Works"
    },
];

const ActivityScheduleMaster = () => {
    const dispatch = useDispatch();

    // --- State Hooks ---
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedWindfarm, setSelectedWindfarm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [bulkRows, setBulkRows] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const {
        projects,
        WindfarmData,
        activitySchedule = [],
        componentTypesList = [],
        loading,
    } = useSelector((state) => state.masterData);

    useEffect(() => {
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());
        dispatch(GetActivityScheduleData());
        dispatch(GetComponentTypesList());
    }, [dispatch]);

    // =========================================================================
    // 🔄 DYNAMIC BULK MATRIX ROW GENERATOR EFFECT (With Defaults)
    // =========================================================================
    useEffect(() => {
        if (selectedProject && selectedWindfarm && selectedCategory) {
            const matchingActivityTypes = componentTypesList.filter(
                (item) =>
                item.type === "ACTIVITY" &&
                String(item.category).toUpperCase() ===
                String(selectedCategory).toUpperCase(),
            );

            const generatedRows = matchingActivityTypes.map((activityTemplate) => {
                const existingConfig = activitySchedule.find(
                    (sched) =>
                    Number(sched.project) === Number(selectedProject) &&
                    Number(sched.windfarm) === Number(selectedWindfarm) &&
                    String(sched.activity_name).toUpperCase() ===
                    String(activityTemplate.name).toUpperCase(),
                );

                return {
                    activity_name: activityTemplate.name,
                    label: activityTemplate.label,
                    category: selectedCategory,
                    // Fallback to existing project configuration if present, otherwise use template default
                    planned_duration: existingConfig ?
                        existingConfig.planned_duration :
                        (activityTemplate.planned_duration ? ? ""),
                    percentage: existingConfig ?
                        existingConfig.percentage :
                        (activityTemplate.percentage ? ? ""),
                    is_pre_saved: !!existingConfig,
                };
            });

            setBulkRows(generatedRows);
        } else {
            setBulkRows([]);
        }
    }, [
        selectedProject,
        selectedWindfarm,
        selectedCategory,
        componentTypesList,
        activitySchedule,
    ]);

    // 📊 Dynamically tracks the combined weightage of all interactive rows on screen
    const totalAssignedWeightage = useMemo(() => {
        return bulkRows.reduce((sum, row) => {
            const parsedVal = parseInt(row.percentage, 10);
            return sum + (isNaN(parsedVal) ? 0 : parsedVal);
        }, 0);
    }, [bulkRows]);

    // --- Dynamic Inline Spreadsheet Value Handlers ---
    const handleInlineRowChange = (index, fieldName, value) => {
        setBulkRows((prevRows) => {
            const updated = [...prevRows];
            updated[index] = {
                ...updated[index],
                [fieldName]: value,
            };
            return updated;
        });
    };

    // --- Dynamic Filters for Workspace Isolation Panels ---
    const filteredWindfarms = WindfarmData.filter(
        (wf) => Number(wf.project) === Number(selectedProject),
    );

    // --- History Table Logic ---
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredActivitiesHistory = activitySchedule.filter((item) => {
        const matchesWorkspace =
            (!selectedProject || Number(item.project) === Number(selectedProject)) &&
            (!selectedWindfarm || Number(item.windfarm) === Number(selectedWindfarm));

        const matchesSearch =
            item.activity_name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category ? .toLowerCase().includes(searchTerm.toLowerCase());

        return matchesWorkspace && matchesSearch;
    });

    const displayedActivitiesHistory = filteredActivitiesHistory.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    // --- Bulk Form Handler ---
    const handleBulkSubmit = async (e) => {
        e.preventDefault();

        const targetValidRows = bulkRows.filter(
            (row) => row.planned_duration !== "" && row.percentage !== "",
        );

        if (targetValidRows.length === 0) {
            setSnackbar({
                open: true,
                message: "Validation Failure: Please configure parameters for at least one activity item.",
                severity: "warning",
            });
            return;
        }

        for (const row of targetValidRows) {
            const days = parseInt(row.planned_duration, 10);
            const weight = parseInt(row.percentage, 10);

            if (isNaN(days) || days <= 0 || isNaN(weight) || weight <= 0) {
                setSnackbar({
                    open: true,
                    message: "Invalid Input: Values must be positive whole numbers.",
                    severity: "error",
                });
                return;
            }
        }

        if (totalAssignedWeightage > 100) {
            setSnackbar({
                open: true,
                message: `Weightage Bound Alert: Total Category Weightage (${totalAssignedWeightage}%) cannot cross 100%.`,
                severity: "error",
            });
            return;
        }

        try {
            let successCount = 0;
            for (const activeRow of targetValidRows) {
                const rowPayload = {
                    project: selectedProject,
                    windfarm: selectedWindfarm,
                    category: activeRow.category,
                    activity_name: activeRow.activity_name,
                    planned_duration: parseInt(activeRow.planned_duration, 10),
                    percentage: parseInt(activeRow.percentage, 10),
                };

                await dispatch(CreateActivityScheduleData(rowPayload));
                successCount++;
            }

            setSnackbar({
                open: true,
                message: `Bulk Config Success: Synchronized ${successCount} entries successfully.`,
                severity: "success",
            });

            setIsSubmitted(true);
            dispatch(GetActivityScheduleData());
        } catch (err) {
            console.error("Bulk upload batch error tracking:", err);
            const fallbackBackendError =
                err ? .response ? .data ? .detail || "Batch processing execution failed.";
            setSnackbar({
                open: true,
                message: fallbackBackendError,
                severity: "error",
            });
        }
    };

    return ( <
        > { /* ======================= CONTROL PANEL SELECTION BAR ======================= */ } <
        Paper elevation = {
            1
        }
        sx = {
            {
                p: 3,
                mt: -2,
                px: 4,
                borderRadius: 2,
                border: "1px solid #00416A",
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A",
                mb: 3
            }
        } >
        Activity Bulk Schedule Configuration Master Panel <
        /Typography>

        <
        Grid container spacing = {
            2
        }
        sx = {
            {
                mb: 4
            }
        } >
        <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField select label = "Target Scope Project"
        fullWidth value = {
            selectedProject
        }
        onChange = {
            (e) => {
                setSelectedProject(e.target.value);
                setSelectedWindfarm("");
                setSelectedCategory("");
                setIsSubmitted(false);
            }
        } >
        <
        MenuItem value = "" > --Select Master Project Context-- < /MenuItem> {
            projects.map((p) => ( <
                MenuItem key = {
                    p.id
                }
                value = {
                    p.id
                } > {
                    p.project_name
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
        TextField select fullWidth label = "Target Workspace Windfarm"
        value = {
            selectedWindfarm
        }
        disabled = {!selectedProject
        }
        onChange = {
            (e) => {
                setSelectedWindfarm(e.target.value);
                setSelectedCategory("");
                setIsSubmitted(false);
            }
        } >
        <
        MenuItem value = "" > --Select Target Windfarm Zone-- < /MenuItem> {
            filteredWindfarms.map((wf) => ( <
                MenuItem key = {
                    wf.id
                }
                value = {
                    wf.id
                } > {
                    wf.windfarm_name
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
        TextField select fullWidth label = "Target Setup Category Layer"
        value = {
            selectedCategory
        }
        disabled = {!selectedWindfarm
        }
        onChange = {
            (e) => {
                setSelectedCategory(e.target.value);
                setIsSubmitted(false);
            }
        } >
        <
        MenuItem value = "" >
        --Choose Category Workspace Blueprint--
        <
        /MenuItem> {
            CATEGORY_CHOICES.map((c) => ( <
                MenuItem key = {
                    c.value
                }
                value = {
                    c.value
                } > {
                    c.label
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid> <
        /Grid>

        { /* ======================= LIVE WEIGHTAGE SUMMARY HEADER ======================= */ } {
            selectedCategory && ( <
                Box sx = {
                    {
                        mb: 4,
                        p: 2,
                        bgcolor: "#f8fafc",
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                    }
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }
                } >
                <
                Typography variant = "subtitle2"
                sx = {
                    {
                        fontWeight: 600,
                        color: "#334155"
                    }
                } >
                Compiled Budget Allocation: < strong > {
                    selectedCategory
                } < /strong> <
                /Typography> <
                Chip label = {
                    `Total Weightage: ${totalAssignedWeightage} % / 100 %`
                }
                color = {
                    totalAssignedWeightage > 100 ?
                    "error" :
                        totalAssignedWeightage === 100 ?
                        "success" :
                        "primary"
                }
                variant = "filled"
                sx = {
                    {
                        fontWeight: 700,
                        fontSize: "13px",
                        p: 1
                    }
                }
                /> <
                /Box>

                <
                LinearProgress variant = "determinate"
                value = {
                    Math.min(totalAssignedWeightage, 100)
                }
                color = {
                    totalAssignedWeightage > 100 ?
                    "error" :
                        totalAssignedWeightage === 100 ?
                        "success" :
                        "primary"
                }
                sx = {
                    {
                        height: 12,
                        borderRadius: 6,
                        bgcolor: "#e2e8f0"
                    }
                }
                />

                {
                    isSubmitted && ( <
                        Typography variant = "body2"
                        color = "success.main"
                        sx = {
                            {
                                display: "block",
                                mt: 1.5,
                                fontWeight: 700
                            }
                        } >
                        ✓All data records have been successfully written to the database.Matrix table closed. <
                        /Typography>
                    )
                } <
                /Box>
            )
        }

        { /* ======================= BULK EDIT SPREADSHEET CANVAS ======================= */ } {
            bulkRows.length > 0 && !isSubmitted ? ( <
                form onSubmit = {
                    handleBulkSubmit
                } >
                <
                Table size = "small"
                sx = {
                    {
                        border: "1px solid #e2e8f0",
                        mb: 3
                    }
                } >
                <
                TableHead sx = {
                    {
                        bgcolor: "#00416A"
                    }
                } >
                <
                TableRow >
                <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 600
                    }
                } >
                Activity Task Template Name <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 600
                    }
                } >
                Category Scope <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 600,
                        width: "20%"
                    }
                } >
                Planned Schedule Days *
                <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 600,
                        width: "20%"
                    }
                } >
                Weightage Value( % ) *
                <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 600
                    }
                } >
                Data State Status <
                /TableCell> <
                /TableRow> <
                /TableHead> <
                TableBody > {
                    bulkRows.map((row, index) => ( <
                        TableRow key = {
                            row.activity_name
                        }
                        sx = {
                            {
                                bgcolor: row.is_pre_saved ? "#f8fafc" : "#ffffff"
                            }
                        } >
                        <
                        TableCell sx = {
                            {
                                fontWeight: 500,
                                color: "#334155"
                            }
                        } > {
                            row.label
                        } <
                        /TableCell> <
                        TableCell >
                        <
                        span style = {
                            {
                                fontSize: "11px",
                                background: "#e0f2fe",
                                color: "#0369a1",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontWeight: 600,
                            }
                        } >
                        {
                            row.category
                        } <
                        /span> <
                        /TableCell> <
                        TableCell >
                        <
                        TextField size = "small"
                        required placeholder = "e.g. 15"
                        value = {
                            row.planned_duration
                        }
                        onChange = {
                            (e) => {
                                const val = e.target.value;
                                if (val === "" || /^[0-9\b]+$/.test(val)) {
                                    handleInlineRowChange(
                                        index,
                                        "planned_duration",
                                        val,
                                    );
                                }
                            }
                        }
                        fullWidth /
                        >
                        <
                        /TableCell> <
                        TableCell >
                        <
                        TextField size = "small"
                        required placeholder = "e.g. 25"
                        value = {
                            row.percentage
                        }
                        onChange = {
                            (e) => {
                                const val = e.target.value;
                                if (val === "" || /^[0-9\b]+$/.test(val)) {
                                    handleInlineRowChange(index, "percentage", val);
                                }
                            }
                        }
                        fullWidth /
                        >
                        <
                        /TableCell> <
                        TableCell sx = {
                            {
                                fontWeight: 600,
                                color: row.is_pre_saved ? "#16a34a" : "#ea580c",
                            }
                        } >
                        {
                            row.is_pre_saved ?
                            "✓ Registered (Active)" :
                                "+ Default Loaded"
                        } <
                        /TableCell> <
                        /TableRow>
                    ))
                } <
                /TableBody> <
                /Table> <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        mt: 2
                    }
                } >
                <
                Button type = "submit"
                variant = "contained"
                disabled = {
                    loading || totalAssignedWeightage > 100
                }
                sx = {
                    {
                        bgcolor: "#1e3a8a",
                        textTransform: "none",
                        px: 4,
                        fontWeight: 600,
                    }
                } >
                Submit Bulk Schedule Settings <
                /Button> <
                /Box> <
                /form>
            ) : (
                selectedCategory &&
                !isSubmitted && ( <
                    Alert severity = "warning" >
                    No foundational activity template items mapped inside component definitions. <
                    /Alert>
                )
            )
        } <
        /Paper>

        { /* ======================= READ-ONLY HISTORICAL SYNC VIEW LOGS ======================= */ } <
        Paper sx = {
            {
                p: 3,
                borderRadius: 2,
                border: "1px solid #00416A",
                mt: 4
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        Active Configured Milestones Registry Sheet <
        /Typography> <
        TextField size = "small"
        placeholder = "Search Active Workspace Records..."
        value = {
            searchTerm
        }
        onChange = {
            (e) => setSearchTerm(e.target.value)
        }
        sx = {
            {
                width: "320px"
            }
        }
        InputProps = {
            {
                startAdornment: ( <
                    InputAdornment position = "start" >
                    <
                    Search size = {
                        18
                    }
                    color = "#00416A" / >
                    <
                    /InputAdornment>
                ),
            }
        }
        /> <
        /Box>

        <
        Box sx = {
            {
                mt: 1
            }
        } >
        <
        Table size = "small" >
        <
        TableHead sx = {
            {
                "& .MuiTableCell-root": {
                    backgroundColor: "#0f52ba",
                    color: "#fff",
                    fontWeight: 600,
                },
            }
        } >
        <
        TableRow >
        <
        TableCell > Project Workspace Source < /TableCell> <
        TableCell > Windfarm Sector < /TableCell> <
        TableCell > Category < /TableCell> <
        TableCell > Activity Pipeline Name < /TableCell> <
        TableCell > Planned Duration Limits < /TableCell> <
        TableCell > Assigned Weightage( % ) < /TableCell> <
        TableCell > Downstream Dependencies < /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            displayedActivitiesHistory.length > 0 ? (
                displayedActivitiesHistory.map((row) => ( <
                    TableRow key = {
                        row.id
                    } >
                    <
                    TableCell > {
                        row.project_name
                    } < /TableCell> <
                    TableCell > {
                        row.windfarm_name
                    } < /TableCell> <
                    TableCell > {
                        row.category
                    } < /TableCell> <
                    TableCell > {
                        row.activity_name
                    } < /TableCell> <
                    TableCell > {
                        row.planned_duration
                    }
                    Calendar Days < /TableCell> <
                    TableCell > {
                        row.percentage
                    } % < /TableCell> <
                    TableCell > {
                        row.dependent_activity_name || "-"
                    } < /TableCell> <
                    /TableRow>
                ))
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    7
                }
                align = "center"
                sx = {
                    {
                        py: 3,
                        color: "text.secondary"
                    }
                } >
                No active master scheduling rows mapped inside current parameter constraints. <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /Box>

        <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25]
        }
        component = "div"
        count = {
            filteredActivitiesHistory.length
        }
        rowsPerPage = {
            rowsPerPage
        }
        page = {
            page
        }
        onPageChange = {
            (e, newPage) => setPage(newPage)
        }
        onRowsPerPageChange = {
            (e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
            }
        }
        />

        <
        CustomSnackbar open = {
            snackbar.open
        }
        message = {
            snackbar.message
        }
        severity = {
            snackbar.severity
        }
        onClose = {
            () => setSnackbar((prev) => ({ ...prev,
                open: false
            }))
        }
        /> <
        /Paper> <
        />
    );
};

export default ActivityScheduleMaster;