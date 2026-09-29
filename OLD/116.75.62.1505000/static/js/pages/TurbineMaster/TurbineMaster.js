// src/pages/TurbineLocationForm.jsx
import React, {
    useEffect,
    useState
} from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    Grid,
    Paper,
    MenuItem,
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    getClusters
} from "../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    GetProjectsData,
    GetWTGMakeModelData,
    GetWindFarmMasterData,
} from "../../Redux/MasterData/masterAction";
import {
    createBulkTurbineLocations,
    getTurbineLocations,
} from "../../Redux/TurbineMasterData/turbineAction";
import CustomSnackbar from "../../components/comman/CustomSnackbar";
import TurbineMasterTable from "./TurbineMasterTable";
import NumberTextField from "../../components/comman/NumberTextField";
const TurbineLocationForm = () => {
    const dispatch = useDispatch();
    /* ---------------- REDUX STATE ---------------- */
    const {
        clusters = []
    } = useSelector((state) => state.cardRoad || {});
    const {
        projects = [],
            WindfarmData = [],
            WTGMakeModelData = [],
    } = useSelector((state) => state.masterData || {});
    /* ---------------- GLOBAL FILTERS STATE ---------------- */
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedWindfarm, setSelectedWindfarm] = useState("");
    const [selectedCluster, setSelectedCluster] = useState("");
    const [locationCount, setLocationCount] = useState("");
    /* ---------------- Move WTG States to Top Global Layout ---------------- */
    const [topWtgMake, setTopWtgMake] = useState("");
    const [topWtgModel, setTopWtgModel] = useState("");
    const [topWtgCapacity, setTopWtgCapacity] = useState("");
    /* ---------------- DYNAMIC GENERATED GENERATORS STATE ---------------- */
    const [turbines, setTurbines] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    useEffect(() => {
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());
        dispatch(getClusters());
        dispatch(GetWTGMakeModelData());
    }, [dispatch]);
    /* 🔹 Calculate Dependent Dropdown Filter Arrays */
    const filteredWindfarms = WindfarmData.filter(
        (wf) => wf.project === parseInt(selectedProject),
    );
    const uniqueMakes = [...new Set(WTGMakeModelData.map((m) => m.wtg_make))];
    const topModelsOptions = WTGMakeModelData.filter(
        (m) => m.wtg_make === topWtgMake,
    );
    const topCapacitiesOptions = topModelsOptions.filter(
        (m) => m.wtg_model === topWtgModel,
    );
    /* 🔹 Generate Turbine Rows with Auto-Injected WTG data values */
    const handleGenerateForms = () => {
        if (!selectedProject ||
            !selectedWindfarm ||
            !selectedCluster ||
            !topWtgMake ||
            !topWtgModel ||
            !topWtgCapacity ||
            Number(locationCount) <= 0
        )
            return;
        setTurbines(
            Array.from({
                length: Number(locationCount)
            }, () => ({
                project: selectedProject,
                windfarm: selectedWindfarm,
                cluster: selectedCluster,
                // ✅ AUTO-INJECTED FROM THE TOP GLOBAL FILTERS CONTROLLER SELECTORS
                wtg_make: topWtgMake,
                turbine_model_planned: topWtgModel,
                wtg_capacity_mw: topWtgCapacity,
                survey_no: "",
                address: "",
                location_no: "",
                northing: "",
                easting: "",
                gps_coordinates: "",
                elevation_ground_level: "",
                // nearby_obstacles: "",
                // turbine_sr_no: "",
            })),
        );
    };
    // const handleChange = (index, e) => {
    //   const { name, value } = e.target;
    //   const copy = [...turbines];
    //   copy[index][name] = value;
    //   setTurbines(copy);
    // };
    const handleChange = (index, e) => {
        const {
            name,
            value
        } = e.target;
        const copy = [...turbines];
        copy[index][name] = value;
        // Automatically synchronize gps_coordinates whenever northing or easting is modified
        if (name === "northing" || name === "easting") {
            const currentNorthing =
                name === "northing" ? value : copy[index].northing;
            const currentEasting = name === "easting" ? value : copy[index].easting;
            if (currentNorthing.trim() && currentEasting.trim()) {
                copy[index].gps_coordinates =
                    `${currentNorthing.trim()}, ${currentEasting.trim()}`;
            } else {
                copy[index].gps_coordinates = "";
            }
        }
        setTurbines(copy);
    };
    const isFormValid = () => {
        if (turbines.length === 0) return false;
        return turbines.every((t) => [
            "location_no",
            "survey_no",

            "easting",
            "northing",
            // "gps_coordinates",
            "elevation_ground_level",
            "wtg_make",
            "address",
            "turbine_model_planned",
            "wtg_capacity_mw",
        ].every((f) => t[f] ? .toString().trim()), );
    };
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   try {
    //     await dispatch(createBulkTurbineLocations(turbines));
    //     setSnackbar({
    //       open: true,
    //       message: "Turbine locations submitted successfully!",
    //       severity: "success",
    //     });
    //     dispatch(getTurbineLocations());
    //     // Clean up States
    //     setTurbines([]);
    //     setLocationCount("");
    //     setSelectedCluster("");
    //     setTopWtgMake("");
    //     setTopWtgModel("");
    //     setTopWtgCapacity("");
    //   } catch {
    //     setSnackbar({
    //       open: true,
    //       message: "Submission failed!",
    //       severity: "error",
    //     });
    //   }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Await dispatch and grab the returned raw response object payload
            const response = await dispatch(createBulkTurbineLocations(turbines));
            // 2. Refresh database grid logs immediately
            dispatch(getTurbineLocations());
            // Case A: 100% complete clean success profile
            if (!response.success_type || response.success_type === "FULL") {
                setSnackbar({
                    open: true,
                    message: "All turbine locations submitted successfully!",
                    severity: "success",
                });
                // Wipe forms on absolute success
                setTurbines([]);
                setLocationCount("");
                setSelectedCluster("");
                setTopWtgMake("");
                setTopWtgModel("");
                setTopWtgCapacity("");
            }
            // Case B: 🔥 PARTIAL SAVE (Some posted successfully, some skipped)
            else if (response.success_type === "PARTIAL") {
                const firstErr = response.errors[0].errors;
                const rowNum = response.errors[0].index + 1;
                const exactReason = firstErr.non_field_errors ?
                    firstErr.non_field_errors[0] :
                    Object.values(firstErr)[0][0];
                setSnackbar({
                    open: true,
                    // Explicitly tells the user what made it into the DB and what didn't
                    message: `${response.detail} (Row #${rowNum}: ${exactReason})`,
                    severity: "warning", // Orange visual color highlight rule
                });
                // 💡 CRITICAL: We DO NOT clear the turbines state here!
                // This keeps the bad entries visible so the engineer can change their location numbers.
            }
        } catch (error) {
            // Case C: True 400 Bad Request error (zero rows were written)
            const responseData = error.response ? .data;
            setSnackbar({
                open: true,
                message: responseData ? .detail || "Submission failed completely!",
                severity: "error",
            });
        }
    };
    return ( <
        >
        <
        Paper elevation = {
            1
        }
        sx = {
            {
                p: 3,
                mt: -2,
                borderRadius: 2,
                border: "1px solid #00416A"
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
        Bulk Turbine Location Entry <
        /Typography> <
        Typography sx = {
            {
                color: "text.secondary",
                mb: 3
            }
        } >
        Configure global parameters once below to bulk create multiple turbine rows instantly. <
        /Typography> { /* 🔹 STEP 1-3 Global Selection Area Layout Controls */ } <
        Grid container spacing = {
            2
        }
        mb = {
            3
        } > { /* Project Selector */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        }
        md = {
            3
        } >
        <
        TextField select label = "Select Project"
        fullWidth value = {
            selectedProject
        }
        onChange = {
            (e) => {
                setSelectedProject(e.target.value);
                setSelectedWindfarm("");
                setSelectedCluster("");
                setTurbines([]);
            }
        } >
        {
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
        /Grid> { /* Windfarm Selector */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        }
        md = {
            3
        } >
        <
        TextField select fullWidth label = "Windfarm"
        value = {
            selectedWindfarm
        }
        disabled = {!selectedProject
        }
        onChange = {
            (e) => {
                setSelectedWindfarm(e.target.value);
                setSelectedCluster("");
                setTurbines([]);
            }
        } >
        {
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
        /Grid> { /* Cluster Selector */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        }
        md = {
            3
        } >
        <
        TextField select fullWidth label = "Cluster"
        value = {
            selectedCluster
        }
        onChange = {
            (e) => {
                setSelectedCluster(e.target.value);
                setTurbines([]);
            }
        }
        disabled = {!selectedWindfarm
        } >
        {
            clusters
            .filter((c) => c.windfarm === Number(selectedWindfarm))
            .map((c) => ( <
                MenuItem key = {
                    c.id
                }
                value = {
                    c.id
                } > {
                    c.cluster_name
                }({
                    c.cluster_code
                }) <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid> { /* ✅ MOVED WTG MAKE TO TOP */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        }
        md = {
            3
        } >
        <
        TextField select fullWidth label = "WTG Make"
        value = {
            topWtgMake
        }
        disabled = {!selectedCluster
        }
        onChange = {
            (e) => {
                setTopWtgMake(e.target.value);
                setTopWtgModel("");
                setTopWtgCapacity("");
                setTurbines([]);
            }
        } >
        {
            uniqueMakes.map((m) => ( <
                MenuItem key = {
                    m
                }
                value = {
                    m
                } > {
                    m
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid> { /* ✅ MOVED WTG MODEL TO TOP */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        }
        md = {
            3
        } >
        <
        TextField select fullWidth label = "WTG Model"
        value = {
            topWtgModel
        }
        disabled = {!topWtgMake
        }
        onChange = {
            (e) => {
                setTopWtgModel(e.target.value);
                setTopWtgCapacity("");
                setTurbines([]);
            }
        } >
        {
            topModelsOptions.map((m) => ( <
                MenuItem key = {
                    m.wtg_model
                }
                value = {
                    m.wtg_model
                } > {
                    m.wtg_model
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid> { /* ✅ MOVED WTG CAPACITY TO TOP */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        }
        md = {
            3
        } >
        <
        TextField select fullWidth label = "Capacity (MW)"
        value = {
            topWtgCapacity
        }
        disabled = {!topWtgModel
        }
        onChange = {
            (e) => {
                setTopWtgCapacity(e.target.value);
                setTurbines([]);
            }
        } >
        {
            topCapacitiesOptions.map((m) => ( <
                MenuItem key = {
                    m.capacity_mw
                }
                value = {
                    m.capacity_mw
                } > {
                    m.capacity_mw
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid> { /* Number of Turbine Locations */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        }
        md = {
            3
        } >
        <
        TextField type = "number"
        fullWidth label = "No. of Turbine Locations"
        value = {
            locationCount
        }
        inputProps = {
            {
                min: 1
            }
        }
        onChange = {
            (e) => {
                setLocationCount(e.target.value);
                setTurbines([]);
            }
        }
        disabled = {!topWtgCapacity
        }
        /> <
        /Grid> { /* Action Trigger Button */ } <
        Grid item xs = {
            12
        }
        md = {
            3
        }
        sx = {
            {
                display: "flex",
                alignItems: "center"
            }
        } >
        <
        Button variant = "contained"
        fullWidth size = "large"
        onClick = {
            handleGenerateForms
        }
        disabled = {!selectedProject ||
            !selectedWindfarm ||
            !selectedCluster ||
            !topWtgMake ||
            !topWtgModel ||
            !topWtgCapacity ||
            !locationCount
        } >
        Create WTG Locations <
        /Button> <
        /Grid> <
        /Grid> { /* 🔹 Dynamic Cards Form Section */ } <
        form onSubmit = {
            handleSubmit
        } > {
            turbines.map((t, idx) => ( <
                Paper key = {
                    idx
                }
                sx = {
                    {
                        p: 3,
                        mb: 3,
                        border: "1px dashed #00416A"
                    }
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2
                    }
                } >
                <
                Typography fontWeight = {
                    600
                }
                color = "#00416A" >
                Turbine Location Row# {
                    idx + 1
                } <
                /Typography> { /* Visual reference badge to show what model is auto-bound */ } <
                Typography variant = "caption"
                sx = {
                    {
                        fontStyle: "italic",
                        color: "text.secondary"
                    }
                } >
                Model Selected: {
                    t.wtg_make
                }({
                    t.turbine_model_planned
                }) - {
                    " "
                } {
                    t.wtg_capacity_mw
                }
                MW <
                /Typography> <
                /Box> <
                Grid container spacing = {
                    2
                } >
                <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                }
                md = {
                    2.4
                } >
                <
                TextField fullWidth label = "Location No"
                name = "location_no"
                value = {
                    t.location_no
                }
                required onChange = {
                    (e) => handleChange(idx, e)
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                }
                md = {
                    2.4
                } >
                <
                TextField fullWidth label = "Survey No"
                name = "survey_no"
                value = {
                    t.survey_no
                }
                required onChange = {
                    (e) => handleChange(idx, e)
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                }
                md = {
                    2.4
                } >
                <
                TextField fullWidth label = "Village"
                name = "address"
                value = {
                    t.address
                }
                // required
                onChange = {
                    (e) => handleChange(idx, e)
                }
                /> <
                /Grid> {
                    /* <Grid item xs={12} sm={6} md={2.4}>
                    <Typography
                                        variant="caption"
                                        display="block"
                                        color="text.secondary"
                                        sx={{ mb: -0.5, mt: -1 }}
                    >
                                        Format: Lat, Long
                    </Typography>
                    <TextField
                                        fullWidth
                                        label="GPS Coordinates"
                                        name="gps_coordinates"
                                        value={t.gps_coordinates}
                                        required
                                        onChange={(e) => handleChange(idx, e)}
                                      />
                    </Grid> */
                }

                { /* 🔹 SEPARATED EASTING FIELD */ } <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    2
                } >
                <
                TextField fullWidth label = "Easting (Latitude)"
                name = "easting"
                placeholder = "e.g. 78.0304"
                value = {
                    t.easting
                }
                required onChange = {
                    (e) => handleChange(idx, e)
                }
                /> <
                /Grid> { /* 🔹 SEPARATED NORTHING FIELD */ } <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    2
                } >
                <
                TextField fullWidth label = "Northing (Longitude)"
                name = "northing"
                placeholder = "e.g. 8.4311"
                value = {
                    t.northing
                }
                required onChange = {
                    (e) => handleChange(idx, e)
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    2.4
                } > {
                    /* <Typography
                                        variant="caption"
                                        display="block"
                                        color="text.secondary"
                                        sx={{ mb: -0.5, mt: -1 }}
                    >
                                        Value must be ≥ 0
                    </Typography> */
                } <
                NumberTextField fullWidth type = "number"
                label = "Elevation"
                name = "elevation_ground_level"
                value = {
                    t.elevation_ground_level
                }
                required onChange = {
                    (e) => handleChange(idx, e)
                }
                // onChange={(e) => {
                //   if (Number(e.target.value) < 0) return;
                //   handleChange(idx, e);
                // }}
                // inputProps={{ min: 0 }}
                /> <
                /Grid> <
                /Grid> <
                /Paper>
            ))
        } {
            turbines.length > 0 && ( <
                Box textAlign = "center"
                mt = {
                    2
                } >
                <
                Button type = "submit"
                variant = "contained"
                size = "large"
                sx = {
                    {
                        background: "#00416A",
                        px: 4
                    }
                }
                // disabled={!isFormValid()}
                >
                Submit All Turbines <
                /Button> <
                /Box>
            )
        } <
        /form> <
        /Paper> <
        CustomSnackbar open = {
            snackbar.open
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        }
        message = {
            snackbar.message
        }
        severity = {
            snackbar.severity
        }
        /> { /* LIST PREVIEW GRID TABLE SECTION */ } <
        Paper sx = {
            {
                mt: 4,
                p: 3,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                borderRadius: 2,
                border: "1px solid #00416A",
            }
        } >
        <
        TurbineMasterTable selectedProject = {
            selectedProject
        }
        selectedWindfarm = {
            selectedWindfarm
        }
        selectedCluster = {
            selectedCluster
        }
        /> <
        /Paper> <
        />
    );
};
export default TurbineLocationForm;