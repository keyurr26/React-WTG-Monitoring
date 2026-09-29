import React, {
    useState,
    useMemo,
    useEffect,
    useCallback
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Typography,
    Stack,
} from "@mui/material";
// Components & Hooks
import {
    useTableViewer
} from "../../hooks/useTableViewer";
import parseErrorMessage from "../../utils/errorFunction";
import CustomSnackbar from "../../components/comman/CustomSnackbar";
import PlatformMasterTable from "../AddmasterData/tables/PlatformMasterTable";
// Redux Actions
import {
    postPlatformMaster,
    getPlatformMaster,
} from "../../Redux/InstallationData/PlateformData/plateformAction";
import {
    fetchContractors,
    GetMaterialMasterData,
    GetComponentTypesList,
    getTurbinePlannedDates,
    GetProjectsData,
    GetWindFarmMasterData,
} from "../../Redux/MasterData/masterAction";
import {
    getTurbineLocations,
    getEligibleTurbines,
} from "../../Redux/TurbineMasterData/turbineAction";
import {
    getClusters
} from "../../Redux/InstallationData/CartRoadData/cartroadAction";
// Constants
import {

    PLATFORM_TYPE_OPTIONS,
} from "../../constants/choices";

const nonNegativeNumberStyles = {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
};
const PlatformMasterForm = () => {
    const dispatch = useDispatch();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const showSnackbar = useCallback((message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    }, []);
    // 1. Redux Store Subscriptions
    const {
        projects = [], WindfarmData = []
    } = useSelector(
        (state) => state.masterData || {},
    );
    const {
        clusters = []
    } = useSelector((state) => state.cardRoad || {});
    const {
        turbineLocations = []
    } = useSelector(
        (state) => state.turbineData || {},
    );
    const {
        platforMasterData = []
    } = useSelector(
        (state) => state.platformData || {},
    );
    const contractors = useSelector(
        (state) => state.masterData ? .ContractorData ? ? [],
    );
    const {
        GETmaterialMaster = []
    } = useSelector(
        (state) => state.masterData || {},
    );
    const initialPlatformMasterData = useMemo(
        () => ({
            project: "",
            windfarm: "",
            cluster: "",
            turbine: "",
            platform_name: "",
            platform_type: "",
            platform_length: "",
            platform_width: "",
            platform_depth: "",
            crane_model: "",
            contractor: "",
            activity_status: "planned",
            distance_from_tower: "",
            drainage_provided: false,
            fdd_attachment: null,
            mdd_attachment: null,
            selected_items: [],
        }), [],
    );
    const [formData, setFormData] = useState(initialPlatformMasterData);
    const [editId, setEditId] = useState(null);
    // 3. Mount Lifecycle Dependencies
    useEffect(() => {
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());
        dispatch(getClusters());
        dispatch(fetchContractors());
        dispatch(GetMaterialMasterData());
        dispatch(GetComponentTypesList());
        dispatch(getTurbinePlannedDates());
    }, [dispatch]);
    // 4. Cascade Parameter Mutations Listener
    useEffect(() => {
        if (!formData.project || !formData.windfarm) return;
        const params = {
            project: formData.project,
            windfarm: formData.windfarm,
            cluster: formData.cluster,
        };
        dispatch(getPlatformMaster(params));
        dispatch(getTurbineLocations(params));
    }, [dispatch, formData.project, formData.windfarm, formData.cluster]);
    // Automated workflow background monitoring loop
    useEffect(() => {
        if (!formData.project || !formData.windfarm) return;
        const fetchWorkflowData = () => {
            dispatch(
                getEligibleTurbines(
                    formData.project,
                    formData.windfarm,
                    formData.cluster,
                ),
            );
        };
        fetchWorkflowData();
        const intervalId = setInterval(fetchWorkflowData, 30000);
        return () => clearInterval(intervalId);
    }, [formData.project, formData.windfarm, formData.cluster, dispatch]);
    // 5. Cascading Dropdown Filters
    const filteredWindfarms = useMemo(
        () =>
        WindfarmData.filter(
            (wf) => Number(wf.project) === Number(formData.project),
        ), [WindfarmData, formData.project],
    );
    const filteredClusters = useMemo(
        () =>
        clusters.filter((c) => Number(c.windfarm) === Number(formData.windfarm)), [clusters, formData.windfarm],
    );
    const filteredTurbines = useMemo(() => {
        const assignedTurbineIds = new Set(
            platforMasterData.map((item) => Number(item.turbine)),
        );
        return turbineLocations.filter((t) => {
            if (formData.project && Number(t.project) !== Number(formData.project))
                return false;
            if (formData.windfarm && Number(t.windfarm) !== Number(formData.windfarm))
                return false;
            if (formData.cluster && Number(t.cluster) !== Number(formData.cluster))
                return false;
            // Keep its own turbine selection visible if editing an item
            if (editId && Number(t.id) === Number(formData.turbine)) return true;
            return !assignedTurbineIds.has(Number(t.id));
        });
    }, [
        turbineLocations,
        formData.project,
        formData.windfarm,
        formData.cluster,
        formData.turbine,
        platforMasterData,
        editId,
    ]);
    // 6. Universal Form Control Mutators
    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            files,
            checked
        } = e.target;
        let val =
            type === "file" ? files[0] : type === "checkbox" ? checked : value;
        if (
            type === "number" || [
                "platform_length",
                "platform_width",
                "platform_depth",
                "distance_from_tower",
            ].includes(name)
        ) {
            if (value !== "" && parseFloat(value) < 0) {
                val = 0;
            }
        }
        setFormData((prev) => {
            const updated = { ...prev,
                [name]: val
            };
            // Cascading Reset Rules
            if (name === "project") {
                updated.windfarm = "";
                updated.cluster = "";
                updated.turbine = "";
            }
            if (name === "windfarm") {
                updated.cluster = "";
                updated.turbine = "";
            }
            if (name === "cluster") {
                updated.turbine = "";
            }
            return updated;
        });
    };
    const rowsPlatformMaster = useMemo(
        () =>
        platforMasterData.map((row) => ({
            ...row,
            turbine_id: row.turbine,
            drainage_provided: row.drainage_provided ? "Yes" : "No",
        })), [platforMasterData],
    );
    const toFormData = (data) => {
        const fd = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                fd.append(key, value);
            }
        });
        return fd;
    };
    const handleSubmit = async () => {
        const missingFields = [];
        if (!formData.project) missingFields.push("Project Scope");
        if (!formData.windfarm) missingFields.push("Windfarm Scope");
        if (!formData.turbine) missingFields.push("Turbine Location");
        if (!formData.platform_width && formData.platform_width !== 0)
            missingFields.push("Width");
        if (!formData.platform_depth && formData.platform_depth !== 0)
            missingFields.push("Depth");
        if (!formData.crane_model) missingFields.push("Crane Model");
        if (!formData.drainage_provided) missingFields.push("Drainage Provided");
        if (!editId) {
            if (!formData.fdd_attachment) missingFields.push("FDD Attachment");
            if (!formData.mdd_attachment) missingFields.push("MDD Attachment");
        }
        if (missingFields.length > 0) {
            showSnackbar(
                `Please fill in all required fields: ${missingFields.join(", ")} *`,
                "warning",
            );
            return;
        }
        try {
            const selectedTurbine = turbineLocations.find(
                (t) => Number(t.id) === Number(formData.turbine),
            );
            const finalPayload = {
                ...formData,
                cluster: selectedTurbine ? .cluster || formData.cluster || null,
            };
            if (editId) {
                finalPayload.id = editId;
            }
            const multiformPayload = toFormData(finalPayload);
            await dispatch(postPlatformMaster(multiformPayload));
            showSnackbar(
                editId ?
                "Platform Master configured row updated successfully" :
                "Platform Master configuration row saved successfully",
                "success",
            );
            setFormData({
                ...initialPlatformMasterData,
                project: formData.project,
                windfarm: formData.windfarm,
                cluster: formData.cluster,
            });
            setEditId(null);
            dispatch(
                getPlatformMaster({
                    project: formData.project,
                    windfarm: formData.windfarm,
                    cluster: formData.cluster,
                }),
            );
        } catch (err) {
            const errorMsg = parseErrorMessage(err.response ? .data);
            showSnackbar(errorMsg, "error");
        }
    };
    return ( <
        Box sx = {
            {
                maxWidth: "xl",
                mx: "auto",
                mt: 2
            }
        }
        onKeyDown = {
            (e) => {
                if (
                    e.target.type === "number" &&
                    (e.key === "-" || e.key === "e" || e.key === "E")
                ) {
                    e.preventDefault();
                }
            }
        }
        onPaste = {
            (e) => {
                if (e.target.type === "number") {
                    const pasteData = e.clipboardData.getData("text");
                    if (pasteData.includes("-")) {
                        e.preventDefault();
                    }
                }
            }
        } >
        { /* ================= PLATFORM MASTER CONFIGURATION FORM ================= */ } <
        Paper elevation = {
            1
        }
        sx = {
            {
                p: 3,
                mt: -2,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.75)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                transition: "0.3s",
                border: "1px solid #00416A",
                "&:hover": {
                    boxShadow: "0 12px 45px rgba(0,0,0,0.14)"
                },
            }
        } >
        <
        Stack direction = "row"
        justifyContent = "space-between"
        alignItems = "center" >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A",
                mt: 1
            }
        } >
        Platform Master Configuration {
            editId && "(Lock-on-Edit Mode)"
        } <
        /Typography> {
            editId && ( <
                Button variant = "outlined"
                color = "secondary"
                size = "small"
                onClick = {
                    () => {
                        setFormData(initialPlatformMasterData);
                        setEditId(null);
                    }
                } >
                Exit Edit Mode <
                /Button>
            )
        } <
        /Stack> <
        Typography sx = {
            {
                color: "text.secondary",
                mb: 3,
                mt: 0.5
            }
        } >
        Establish foundational crane pad layouts, engineered dimensions, and structural specifications
        for each WTG location. <
        /Typography> <
        Grid container spacing = {
            2
        } > { /* Project Select — 🔥 disabled={Boolean(editId)} prevents editing */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField select fullWidth size = "small"
        label = "Project *"
        name = "project"
        value = {
            formData.project
        }
        onChange = {
            handleChange
        }
        disabled = {
            Boolean(editId)
        }
        error = {!formData.project
        }
        helperText = {!formData.project ? "Project is required *" : ""
        } >
        <
        MenuItem value = "" >
        <
        em > Choose Project... < /em> <
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
        /Grid> { /* Windfarm Select — 🔥 disabled={Boolean(editId) || !formData.project} prevents editing */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField select fullWidth size = "small"
        label = "Windfarm *"
        name = "windfarm"
        value = {
            formData.windfarm
        }
        onChange = {
            handleChange
        }
        disabled = {
            Boolean(editId) || !formData.project
        }
        error = {
            formData.project && !formData.windfarm
        }
        helperText = {
            formData.project && !formData.windfarm ?
            "Windfarm is required *" :
                ""
        } >
        <
        MenuItem value = "" >
        <
        em > Choose Windfarm... < /em> <
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
        /Grid> { /* Cluster Select — 🔥 disabled={Boolean(editId) || !formData.windfarm} prevents editing */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField select fullWidth size = "small"
        label = "Cluster (Optional)"
        name = "cluster"
        value = {
            formData.cluster
        }
        onChange = {
            handleChange
        }
        disabled = {
            Boolean(editId) || !formData.windfarm
        } >
        <
        MenuItem value = "" > All Clusters / Zones < /MenuItem> {
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
        /Grid> { /* Turbine Select — 🔥 disabled={Boolean(editId) || !formData.windfarm} prevents editing */ } <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        TextField select fullWidth size = "small"
        label = "Turbine Location *"
        name = "turbine"
        value = {
            formData.turbine || ""
        }
        onChange = {
            handleChange
        }
        disabled = {
            Boolean(editId) || !formData.project || !formData.windfarm
        }
        error = {
            formData.windfarm && !formData.turbine
        }
        helperText = {
            formData.windfarm && !formData.turbine ?
            "Turbine field is required *" :
                ""
        } >
        {
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
            3
        } >
        <
        TextField fullWidth label = "Platform Name (T01-MC)"
        name = "platform_name"
        size = "small"
        value = {
            formData.platform_name || ""
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        TextField fullWidth select size = "small"
        label = "Platform Type"
        name = "platform_type"
        value = {
            formData.platform_type || ""
        }
        onChange = {
            handleChange
        } >
        {
            PLATFORM_TYPE_OPTIONS.map((opt) => ( <
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
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        TextField fullWidth type = "number"
        label = "Platform Length (m)"
        name = "platform_length"
        size = "small"
        value = {
            formData.platform_length || ""
        }
        onChange = {
            handleChange
        }
        sx = {
            nonNegativeNumberStyles
        }
        inputProps = {
            {
                min: "0",
                step: "0.1"
            }
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        TextField fullWidth type = "number"
        label = "Platform Width (m) *"
        name = "platform_width"
        size = "small"
        value = {
            formData.platform_width || ""
        }
        onChange = {
            handleChange
        }
        sx = {
            nonNegativeNumberStyles
        }
        inputProps = {
            {
                min: "0",
                step: "0.1"
            }
        }
        error = {
            formData.platform_width === "" ||
            formData.platform_width === undefined
        }
        helperText = {
            formData.platform_width === "" ||
            formData.platform_width === undefined ?
            "Platform Width is required *" :
                ""
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        TextField fullWidth type = "number"
        label = "Platform Depth (m) *"
        name = "platform_depth"
        size = "small"
        value = {
            formData.platform_depth || ""
        }
        onChange = {
            handleChange
        }
        sx = {
            nonNegativeNumberStyles
        }
        inputProps = {
            {
                min: "0",
                step: "0.1"
            }
        }
        error = {
            formData.platform_depth === "" ||
            formData.platform_depth === undefined
        }
        helperText = {
            formData.platform_depth === "" ||
            formData.platform_depth === undefined ?
            "Platform Depth is required *" :
                ""
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        TextField fullWidth select label = "Crane Model & Capacity *"
        size = "small"
        name = "crane_model"
        value = {
            formData.crane_model || ""
        }
        onChange = {
            handleChange
        }
        error = {!formData.crane_model
        }
        helperText = {!formData.crane_model ? "Crane Selection is required *" : ""
        } >
        {
            GETmaterialMaster.filter((m) => m.component_type === "Lift").map(
                (m) => ( <
                    MenuItem key = {
                        m.id
                    }
                    value = {
                        m.id
                    } > {
                        m.manufacturer
                    } - {
                        m.model_per_oem
                    } <
                    /MenuItem>
                ),
            )
        } <
        /TextField> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        TextField fullWidth label = "Distance from Center of Foundation (m)"
        size = "small"
        type = "number"
        name = "distance_from_tower"
        value = {
            formData.distance_from_tower || ""
        }
        onChange = {
            handleChange
        }
        sx = {
            nonNegativeNumberStyles
        }
        inputProps = {
            {
                min: "0",
                step: "0.1"
            }
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
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
                    c.firm_name
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
            4
        } >
        <
        TextField fullWidth select size = "small"
        label = "Activity Status"
        name = "activity_status"
        value = {
            formData.activity_status || ""
        }
        onChange = {
            handleChange
        } >
        <
        MenuItem value = "planned" > Planned < /MenuItem> <
        /TextField> <
        /Grid> { /* FDD Attachment Input */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth type = "file"
        name = "fdd_attachment"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        onChange = {
            handleChange
        }
        error = {!editId && !formData.fdd_attachment
        }
        helperText = {!editId && !formData.fdd_attachment ?
            "FDD Attachment is required *" :
                "FDD Attachment Blueprint Layout"
        }
        FormHelperTextProps = {
            {
                sx: {
                    color:
                        !editId && !formData.fdd_attachment ?
                        "error.main" :
                        "success.main",
                },
            }
        }
        /> <
        /Grid> { /* MDD Attachment Input */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth type = "file"
        name = "mdd_attachment"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        onChange = {
            handleChange
        }
        error = {!editId && !formData.mdd_attachment
        }
        helperText = {!editId && !formData.mdd_attachment ?
            "MDD Attachment is required *" :
                "MDD Attachment Blueprint Layout"
        }
        FormHelperTextProps = {
            {
                sx: {
                    color:
                        !editId && !formData.mdd_attachment ?
                        "error.main" :
                        "success.main",
                },
            }
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        } >
        <
        FormControlLabel control = { <
            Checkbox
            name = "drainage_provided"
            checked = {!!formData.drainage_provided
            }
            onChange = {
                handleChange
            }
            />
        }
        label = "Drainage Provided" /
        >
        <
        /Grid> <
        Grid item xs = {
            12
        } >
        <
        Box display = "flex"
        justifyContent = "flex-end"
        gap = {
            2
        } >
        <
        Button variant = "outlined"
        onClick = {
            () => {
                setFormData(initialPlatformMasterData);
                setEditId(null);
            }
        } >
        Reset Form <
        /Button> <
        Button variant = "contained"
        color = "primary"
        onClick = {
            handleSubmit
        } >
        {
            editId ? "Update Platform" : "Save Platform"
        } <
        /Button> <
        /Box> <
        /Grid> <
        /Grid> <
        /Paper> { /* ================= SECTION 3: PLATFORM MASTER DATA GRID TABLE LIST ================= */ } <
        PlatformMasterTable rows = {
            rowsPlatformMaster
        }
        onEdit = {
            (row) => {
                setEditId(row.id); // Secure the row ID context flag
                setFormData({
                    project: row.project || "",
                    windfarm: row.windfarm || "",
                    cluster: row.cluster || "",
                    turbine: row.turbine_id || "",
                    platform_name: row.platform_name || "",
                    platform_type: row.platform_type || "",
                    platform_length: row.platform_length || "",
                    platform_width: row.platform_width || "",
                    platform_depth: row.platform_depth || "",
                    crane_model: row.crane_model || "",
                    contractor: row.contractor || "",
                    activity_status: row.activity_status || "planned",
                    distance_from_tower: row.distance_from_tower || "",
                    drainage_provided: row.drainage_provided === "Yes",
                    fdd_attachment: null,
                    mdd_attachment: null,
                    selected_items: [],
                });
            }
        }
        /> <
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
        /Box>
    );
};
export default PlatformMasterForm;