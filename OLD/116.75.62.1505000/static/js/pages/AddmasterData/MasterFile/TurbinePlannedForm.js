import React, {
    useState,
    useEffect
} from "react";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Box,
    Paper,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import parseErrorMessage from "../../../utils/errorFunction";
import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import TurbinePlanTable from "../tables/TurbinePlanTable";

import {
    GetProjectsData,
    GetWindFarmMasterData,
    CreateTurbinePlan,
    GetTurbinePlanList,
    getTurbinePlannedDates,
} from "../../../Redux/MasterData/masterAction";
import {
    getTurbineLocations
} from "../../../Redux/TurbineMasterData/turbineAction";
import {
    getClusters
} from "../../../Redux/InstallationData/CartRoadData/cartroadAction";

// Define your category choices consistently with your backend choices
const CATEGORY_CHOICES = [{
        value: "FOUNDATION",
        label: "Foundation"
    },
    {
        value: "WTG_INSTALLATION",
        label: "WTG Installation"
    },
    {
        value: "COMMISSIONING",
        label: "Commissioning Details"
    },
];

const TurbinePlannedForm = () => {
    const dispatch = useDispatch();

    // --- Store Subscriptions ---
    const {
        loading,
        turbinePlansList = [],
        activityPlannedDates = [],
    } = useSelector((state) => state.masterData || {});
    const {
        projects = [], WindfarmData = []
    } = useSelector(
        (state) => state.masterData || {},
    );
    const {
        turbineLocations = []
    } = useSelector(
        (state) => state.turbineData || {},
    );

    const {
        clusters = []
    } = useSelector((state) => state.cardRoad || {});

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const initialState = {
        project: "",
        windfarm: "",
        cluster: "",
        category: "",
        turbine: "",
        planned_start_date: "",
    };

    const [data, setData] = useState(initialState);
    const [turbineRows, setTurbineRows] = useState([]);

    useEffect(() => {
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());
        dispatch(getClusters());
        dispatch(getTurbineLocations());
    }, [dispatch]);

    useEffect(() => {
        const filters = {
            project: data.project,
            windfarm: data.windfarm,
            cluster: data.cluster,
            // category: data.category,
        };

        dispatch(GetTurbinePlanList(filters));
        dispatch(getTurbinePlannedDates(filters));
    }, [dispatch, data.project, data.windfarm, data.cluster, ]);

    const handleChange = (field) => (e) => {
        setData((prev) => {
            const updated = { ...prev,
                [field]: e.target.value
            };

            if (field === "project") {
                updated.windfarm = "";
                updated.cluster = "";
                updated.category = "";
            }
            if (field === "windfarm") {
                updated.cluster = "";
                updated.category = "";
            }
            if (field === "cluster") {
                updated.category = "";
            }
            return updated;
        });
    };

    const handleReset = () => {
        setData(initialState);
        setTurbineRows([]);
    };

    // 🔥 FILTERED CARD GRID LAYOUT GENERATOR
    useEffect(() => {
        if (!data.windfarm || !data.cluster || !data.category) {
            setTurbineRows([]);
            return;
        }

        // 1. Determine prerequisite category mapping rules
        let prerequisiteCategory = null;
        if (data.category === "WTG_INSTALLATION")
            prerequisiteCategory = "FOUNDATION";
        if (data.category === "COMMISSIONING")
            prerequisiteCategory = "WTG_INSTALLATION";

        // 2. Identify already scheduled turbine IDs for the CURRENT selected category
        const scheduledTurbineIdsForCategory = turbinePlansList
            .filter(
                (item) =>
                String(item.category || "").toUpperCase() ===
                String(data.category).toUpperCase(),
            )
            .map((item) => Number(item.turbine));

        // 3. Map out minimum allowable dates per turbine based on prerequisite completion
        const turbineMinDates = {};
        if (prerequisiteCategory) {
            const prereqPlans = turbinePlansList.filter(
                (item) =>
                String(item.category || "").toUpperCase() === prerequisiteCategory,
            );

            prereqPlans.forEach((plan) => {
                // 🔥 Read planned_end_date directly from the prerequisite plan model
                const prereqEndDate = plan.planned_end_date;

                if (prereqEndDate) {
                    const endDateObj = new Date(prereqEndDate);
                    endDateObj.setDate(endDateObj.getDate() + 1); // Day after prerequisite ends
                    turbineMinDates[Number(plan.turbine)] = endDateObj
                        .toISOString()
                        .split("T")[0];
                }
            });
        }

        // 4. Filter matching location targets
        const filteredLocations = turbineLocations.filter((t) => {
            const matchesWindfarm = Number(t.windfarm) === Number(data.windfarm);
            const matchesCluster = Number(t.cluster) === Number(data.cluster);
            const isAlreadyPlanned = scheduledTurbineIdsForCategory.includes(
                Number(t.id),
            );

            return matchesWindfarm && matchesCluster && !isAlreadyPlanned;
        });

        // 5. Build rows with dynamic min dates applied
        setTurbineRows((prevRows) => {
            return filteredLocations.map((t) => {
                const matchingExistingRow = prevRows.find((r) => r.turbine === t.id);
                const minAllowedDate = turbineMinDates[Number(t.id)] || "";

                return {
                    turbine: t.id,
                    location_no: t.location_no,
                    code: t.code,
                    cluster: t.cluster || null,
                    cluster_name: t.cluster_name || `Cluster #${t.cluster_name}`,
                    minDate: minAllowedDate,
                    planned_start_date: matchingExistingRow ?
                        matchingExistingRow.planned_start_date :
                        "",
                };
            });
        });
    }, [
        data.windfarm,
        data.cluster,
        data.category,
        turbineLocations,
        turbinePlansList,
    ]);

    const handleDateChange = (index, value) => {
        const updated = [...turbineRows];
        const currentRow = updated[index];

        // Check if selected date is earlier than the minimum allowed prerequisite date
        if (currentRow.minDate && value < currentRow.minDate) {
            setSnackbar({
                open: true,
                message: `Selected date cannot be before the prerequisite end date (${currentRow.minDate}).`,
                severity: "warning",
            });
            updated[index].planned_start_date = "";
        } else {
            updated[index].planned_start_date = value;
        }

        setTurbineRows(updated);
    };

    const handleSingleSubmit = async (row) => {
        if (!row.planned_start_date) {
            setSnackbar({
                open: true,
                message: "Please select a valid planned start date.",
                severity: "warning",
            });
            return;
        }

        // Additional safeguard check on submit
        if (row.minDate && row.planned_start_date < row.minDate) {
            setSnackbar({
                open: true,
                message: `Planned start date cannot be before the prerequisite end date (${row.minDate}).`,
                severity: "warning",
            });
            return;
        }

        const payload = {
            project: data.project,
            windfarm: data.windfarm,
            cluster: row.cluster,
            category: data.category,
            turbine: row.turbine,
            planned_start_date: row.planned_start_date,
        };

        try {
            await dispatch(CreateTurbinePlan(payload));
            setSnackbar({
                open: true,
                message: `${row.location_no} (${data.category}) plan initialized successfully.`,
                severity: "success",
            });
            const filters = {
                project: data.project,
                windfarm: data.windfarm,
                cluster: data.cluster,
                category: data.category,
            };
            dispatch(GetTurbinePlanList(filters));
            dispatch(getTurbinePlannedDates(filters));
        } catch (err) {
            setSnackbar({
                open: true,
                message: parseErrorMessage(err ? .response ? .data || err.message),
                severity: "error",
            });
        }
    };

    const filteredWindfarms = WindfarmData.filter(
        (wf) => Number(wf.project) === Number(data.project),
    );
    const filteredClusters = clusters.filter(
        (c) => Number(c.windfarm) === Number(data.windfarm),
    );

    return ( <
        >
        <
        Paper elevation = {
            3
        }
        sx = {
            {
                py: 3,
                px: 3.5,
                borderRadius: 2,
                mt: -2,
                border: "1px solid #00416A",
            }
        } >
        <
        Box component = "form"
        onSubmit = {
            (e) => e.preventDefault()
        } >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1
            }
        } >
        <
        CalendarMonthIcon sx = {
            {
                color: "#00416A",
                fontSize: 28
            }
        }
        /> <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        Turbine Installation Planning Workspace <
        /Typography> <
        /Box>

        <
        Typography sx = {
            {
                color: "text.secondary",
                mb: 3,
                fontSize: "14px"
            }
        } >
        Select Scope Boundaries, Cluster, and Category to manage deployment targets and generate baseline activity charts. <
        /Typography>

        <
        Grid container spacing = {
            2
        }
        alignItems = "center" > { /* Project Select */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Project"
        select fullWidth value = {
            data.project
        }
        onChange = {
            handleChange("project")
        } >
        <
        MenuItem value = "" >
        <
        em > Select Project... < /em> <
        /MenuItem> {
            projects.map((item) => ( <
                MenuItem key = {
                    item.id
                }
                value = {
                    item.id
                } > {
                    item.project_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Windfarm Select */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Windfarm"
        select fullWidth value = {
            data.windfarm
        }
        onChange = {
            handleChange("windfarm")
        }
        disabled = {!data.project
        } >
        <
        MenuItem value = "" >
        <
        em > Select Windfarm... < /em> <
        /MenuItem> {
            filteredWindfarms.map((item) => ( <
                MenuItem key = {
                    item.id
                }
                value = {
                    item.id
                } > {
                    item.windfarm_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Cluster Select - Now Required */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Cluster"
        select fullWidth value = {
            data.cluster
        }
        onChange = {
            handleChange("cluster")
        }
        disabled = {!data.windfarm
        } >
        <
        MenuItem value = "" >
        <
        em > Select Cluster... < /em> <
        /MenuItem> {
            filteredClusters.map((item) => ( <
                MenuItem key = {
                    item.id
                }
                value = {
                    item.id
                } > {
                    item.cluster_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Category Select */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Category Scope"
        select fullWidth value = {
            data.category
        }
        onChange = {
            handleChange("category")
        }
        disabled = {!data.cluster
        } >
        <
        MenuItem value = "" >
        <
        em > Select Category... < /em> <
        /MenuItem> {
            CATEGORY_CHOICES.map((cat) => ( <
                MenuItem key = {
                    cat.value
                }
                value = {
                    cat.value
                } > {
                    cat.label
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Reset Controller */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        }
        sx = {
            {
                mt: 1
            }
        } >
        <
        Button variant = "outlined"
        color = "error"
        fullWidth onClick = {
            handleReset
        }
        sx = {
            {
                height: "40px",
                textTransform: "none",
                fontWeight: 600
            }
        } >
        Clear Filters <
        /Button> <
        /Grid>

        { /* --- CARDS GRID ITERATION SHEET --- */ } <
        Grid container spacing = {
            2
        }
        sx = {
            {
                mt: 2,
                px: 2
            }
        } > {
            turbineRows.map((row, index) => ( <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    4
                }
                key = {
                    row.turbine
                } >
                <
                Paper elevation = {
                    2
                }
                sx = {
                    {
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                        bgcolor: "#fff",
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
                Typography variant = "subtitle1"
                sx = {
                    {
                        fontWeight: 700,
                        color: "#00416A"
                    }
                } >
                {
                    row.location_no
                } <
                /Typography> {
                    row.cluster && ( <
                        span style = {
                            {
                                fontSize: "11px",
                                background: "#f0f5ff",
                                color: "#1e3a8a",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: 700,
                            }
                        } >
                        {
                            row.cluster_name
                        } <
                        /span>
                    )
                } <
                /Box>

                <
                Typography variant = "body2"
                sx = {
                    {
                        color: "text.secondary",
                        mb: 2,
                        fontSize: "12px"
                    }
                } >
                Asset Code Vector: < strong > {
                    row.code
                } < /strong> <
                /Typography>

                <
                TextField fullWidth size = "small"
                type = "date"
                value = {
                    row.planned_start_date
                }
                inputProps = {
                    {
                        min: row.minDate
                    }
                }
                onChange = {
                    (e) => handleDateChange(index, e.target.value)
                }
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                />

                <
                Button fullWidth variant = "contained"
                size = "small"
                sx = {
                    {
                        mt: 2,
                        background: "#00416A",
                        textTransform: "none",
                        fontWeight: 600,
                    }
                }
                onClick = {
                    () => handleSingleSubmit(row)
                } >
                Generate Schedule Matrix <
                /Button> <
                /Paper> <
                /Grid>
            ))
        } <
        /Grid>

        <
        CustomSnackbar { ...snackbar
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        }
        /> <
        /Grid> <
        /Box> <
        /Paper>

        { /* --- TIMELINE SHEET DISPLAY DATA TABLE --- */ } <
        Box sx = {
            {
                mt: 4,
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            }
        } >
        <
        TurbinePlanTable Data = {
            turbinePlansList.filter((plan) => {
                if (!data.project || !data.windfarm) return false;

                const matchesProjectWindfarm =
                    Number(plan.project) === Number(data.project) &&
                    Number(plan.windfarm) === Number(data.windfarm);

                const matchesCluster = data.cluster ?
                    Number(plan.cluster) === Number(data.cluster) :
                    true;

                const matchesCategory = data.category ?
                    String(plan.category || "").toUpperCase() ===
                    String(data.category).toUpperCase() :
                    true;

                return matchesProjectWindfarm && matchesCluster && matchesCategory;
            })
        }
        activityData = {
            activityPlannedDates
        }
        /> <
        /Box> <
        />
    );
};

export default TurbinePlannedForm;