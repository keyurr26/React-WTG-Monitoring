import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Stack,
    Alert,
    Snackbar,
    Divider,
    Tabs,
    Tab,
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Save as SaveIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    CREATEPOLELINEMASTER,
    GetPoleLineMasterData,
} from "../../../../Redux/MasterData/masterAction";
import {
    GetTurbineFilterData
} from "../../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";
import PoleMasterLogsTable from "./PoleMasterLogsTable";

// Constants
const INITIAL_LINE_COMPONENTS = [{
        id: 1,
        name: "V Cross Arm",
        code: "VCA-001",
        type: "Structure",
        selected: false,
        quantity: 1,
        unit: "Nos",
    },
    {
        id: 2,
        name: "H Cross Arm",
        code: "HCA-002",
        type: "Structure",
        selected: false,
        quantity: 1,
        unit: "Nos",
    },
    {
        id: 3,
        name: "Pin Insulator",
        code: "PI-003",
        type: "Insulator",
        selected: false,
        quantity: 3,
        unit: "Nos",
    },
    {
        id: 4,
        name: "Pin Insulator Hardware",
        code: "PIH-004",
        type: "Hardware",
        selected: false,
        quantity: 3,
        unit: "Set",
    },
    {
        id: 5,
        name: "PG Clamp",
        code: "PGC-005",
        type: "Hardware",
        selected: false,
        quantity: 3,
        unit: "Nos",
    },
    {
        id: 6,
        name: "Wedge Clamp",
        code: "WC-006",
        type: "Hardware",
        selected: false,
        quantity: 3,
        unit: "Nos",
    },
    {
        id: 7,
        name: "Earthing Wire",
        code: "EW-007",
        type: "Earthing",
        selected: false,
        quantity: 1,
        unit: "Set",
    },
    {
        id: 8,
        name: "Stay Wire",
        code: "SW-008",
        type: "Stay Material",
        selected: false,
        quantity: 1,
        unit: "Nos",
    },
    {
        id: 9,
        name: "Stay Rod",
        code: "SR-009",
        type: "Stay Material",
        selected: false,
        quantity: 1,
        unit: "Nos",
    },
    {
        id: 10,
        name: "Stay Clamp",
        code: "SC-010",
        type: "Stay Material",
        selected: false,
        quantity: 2,
        unit: "Nos",
    },
    {
        id: 11,
        name: "Stay Thimble",
        code: "ST-011",
        type: "Stay Material",
        selected: false,
        quantity: 1,
        unit: "Nos",
    },
    {
        id: 12,
        name: "Stay Insulator",
        code: "SI-012",
        type: "Stay Material",
        selected: false,
        quantity: 1,
        unit: "Nos",
    },
    {
        id: 13,
        name: "Three Node Strip",
        code: "TNS-013",
        type: "Safety",
        selected: false,
        quantity: 1,
        unit: "Nos",
    },
    {
        id: 14,
        name: "Bird Guard",
        code: "BG-014",
        type: "Protection",
        selected: false,
        quantity: 3,
        unit: "Nos",
    },
    {
        id: 15,
        name: "Set Of Hardware",
        code: "SOH-015",
        type: "Hardware",
        selected: false,
        quantity: 1,
        unit: "Set",
    },
];

const INITIAL_CUT_COMPONENTS = [{
        id: 1,
        name: "H Frame",
        code: "HF-001",
        type: "Structure",
        selected: false,
        quantity: 1,
        unit: "Nos",
    },
    {
        id: 2,
        name: "Disc Insulator",
        code: "DI-002",
        type: "Insulator",
        selected: false,
        quantity: 6,
        unit: "Nos",
    },
    {
        id: 3,
        name: "Suspension Insulator",
        code: "SPI-003",
        type: "Insulator",
        selected: false,
        quantity: 3,
        unit: "Nos",
    },
    {
        id: 4,
        name: "Stay Pole",
        code: "SP-004",
        type: "Structure",
        selected: false,
        quantity: 1,
        unit: "Nos",
    },
    {
        id: 5,
        name: "Stay Wire",
        code: "SW-005",
        type: "Stay Material",
        selected: false,
        quantity: 2,
        unit: "Nos",
    },
    {
        id: 6,
        name: "Stay Rod",
        code: "SR-006",
        type: "Stay Material",
        selected: false,
        quantity: 2,
        unit: "Nos",
    },
    {
        id: 7,
        name: "Stay Clamp",
        code: "SC-007",
        type: "Stay Material",
        selected: false,
        quantity: 4,
        unit: "Nos",
    },
    {
        id: 8,
        name: "Stay Thimble",
        code: "ST-008",
        type: "Stay Material",
        selected: false,
        quantity: 2,
        unit: "Nos",
    },
    {
        id: 9,
        name: "Stay Insulator",
        code: "SI-009",
        type: "Stay Material",
        selected: false,
        quantity: 2,
        unit: "Nos",
    },
];

export default function PoleMasterIndex() {
    const dispatch = useDispatch();

    // ==================== STATE MANAGEMENT ====================
    const [linePoleState, setLinePoleState] = useState({
        form: {
            project: "",
            windfarm: "",
            cluster: ""
        },
        components: INITIAL_LINE_COMPONENTS,
        loading: false,
    });

    const [cutPoleState, setCutPoleState] = useState({
        form: {
            project: "",
            windfarm: "",
            cluster: ""
        },
        components: INITIAL_CUT_COMPONENTS,
        loading: false,
    });

    const [tab, setTab] = useState(0);
    const [materialMode, setMaterialMode] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        mode: null,
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // ==================== REDUX SELECTORS ====================
    const {
        getturbinefilter = []
    } = useSelector(
        (state) => state.electricalData || {},
    );
    const {
        getpoleMasterData = []
    } = useSelector(
        (state) => state.masterData || {},
    );

    // ==================== CURRENT STATE HELPERS ====================
    const currentState = tab === 0 ? linePoleState : cutPoleState;
    const setCurrentState = tab === 0 ? setLinePoleState : setCutPoleState;
    const isClusterRequired = materialMode === "different";

    // ==================== MEMOIZED DATA (ORDER MATTERS - CLUSTERS FIRST) ====================
    const getUnique = (data, key) => [
        ...new Map(data.map((item) => [item[key], item])).values(),
    ];

    const projects = useMemo(
        () => getUnique(getturbinefilter, "project_id"), [getturbinefilter],
    );

    const windfarms = useMemo(
        () =>
        getUnique(
            getturbinefilter.filter(
                (i) => i.project_id === currentState.form.project,
            ),
            "windfarm_id",
        ), [getturbinefilter, currentState.form.project],
    );

    // ✅ CLUSTERS - Pehle define karo
    const clusters = useMemo(
        () =>
        getUnique(
            getturbinefilter.filter(
                (i) =>
                i.project_id === currentState.form.project &&
                i.windfarm_id === currentState.form.windfarm,
            ),
            "cluster_id",
        ), [getturbinefilter, currentState.form.project, currentState.form.windfarm],
    );

    // ==================== STEP 1: INDUSTRY STANDARD canConfigure ====================
    const canConfigure =
        currentState.form.project &&
        currentState.form.windfarm &&
        materialMode !== null &&
        (materialMode === "same" || currentState.form.cluster);

    // ==================== STEP 7: AVAILABLE CLUSTERS FOR "SAME" MODE ====================
    // ✅ Ab clusters available hai, isliye error nahi aayega
    const availableClusters = useMemo(() => {
        if (
            materialMode !== "same" ||
            !currentState.form.project ||
            !currentState.form.windfarm
        )
            return [];

        return clusters.filter((cluster) => {
            return !getpoleMasterData.some(
                (item) =>
                item.project_id === currentState.form.project &&
                item.windfarm_id === currentState.form.windfarm &&
                item.cluster_id === cluster.cluster_id &&
                item.pole_type === (tab === 0 ? "line_pole" : "cut_pole"),
            );
        });
    }, [
        clusters,
        getpoleMasterData,
        currentState.form.project,
        currentState.form.windfarm,
        materialMode,
        tab,
    ]);

    // ==================== EXISTING DATA CHECK ====================
    const existingData = useMemo(() => {
        if (!canConfigure) return [];

        if (materialMode === "same") {
            return getpoleMasterData.filter(
                (item) =>
                item.project_id === currentState.form.project &&
                item.windfarm_id === currentState.form.windfarm &&
                item.pole_type === (tab === 0 ? "line_pole" : "cut_pole"),
            );
        }

        return getpoleMasterData.filter(
            (item) =>
            item.project_id === currentState.form.project &&
            item.windfarm_id === currentState.form.windfarm &&
            item.cluster_id === currentState.form.cluster &&
            item.pole_type === (tab === 0 ? "line_pole" : "cut_pole"),
        );
    }, [
        getpoleMasterData,
        currentState.form.project,
        currentState.form.windfarm,
        currentState.form.cluster,
        materialMode,
        tab,
        canConfigure,
    ]);

    // ==================== STEP 7: isFullyConfigured ====================
    const isFullyConfigured = useMemo(() => {
        if (!canConfigure) return false;

        if (materialMode === "same") {
            return availableClusters.length === 0;
        }

        return existingData.length > 0;
    }, [canConfigure, materialMode, availableClusters, existingData]);

    // ==================== LOG TABLE DATA ====================
    const linePoleLogs = useMemo(() => {
        return getpoleMasterData.filter((item) => item.pole_type === "line_pole");
    }, [getpoleMasterData]);

    const cutPoleLogs = useMemo(() => {
        return getpoleMasterData.filter((item) => item.pole_type === "cut_pole");
    }, [getpoleMasterData]);

    // ==================== EFFECTS ====================
    useEffect(() => {
        dispatch(GetTurbineFilterData());
        dispatch(GetPoleLineMasterData());
    }, [dispatch]);

    useEffect(() => {
        if (existingData.length > 0 && !isFullyConfigured) {
            const mappedComponents = (
                tab === 0 ? INITIAL_LINE_COMPONENTS : INITIAL_CUT_COMPONENTS
            ).map((comp) => {
                const match = existingData.find((item) => item.material_id === comp.id);
                if (match) {
                    return {
                        ...comp,
                        selected: true,
                        quantity: match.quantity,
                    };
                }
                return {
                    ...comp,
                    selected: false,
                    quantity: comp.quantity,
                };
            });

            const customRows = existingData
                .filter((item) => item.material_id === null)
                .map((item) => ({
                    id: Date.now() + Math.random(),
                    name: item.component_name,
                    code: item.code,
                    type: item.type,
                    quantity: item.quantity,
                    unit: item.unit,
                    selected: true,
                    isCustom: true,
                }));

            setCurrentState((prev) => ({
                ...prev,
                components: [...mappedComponents, ...customRows],
            }));

            showMessage("Existing data loaded (edit mode)", "info");
        }
    }, [existingData, tab, isFullyConfigured]);

    // ==================== EVENT HANDLERS ====================
    const handleCheckbox = (id) => (e) => {
        setCurrentState((prev) => ({
            ...prev,
            components: prev.components.map((comp) =>
                comp.id === id ? { ...comp,
                    selected: e.target.checked
                } : comp,
            ),
        }));
    };

    const handleQuantityChange = (id, newQuantity) => {
        setCurrentState((prev) => ({
            ...prev,
            components: prev.components.map((comp) =>
                comp.id === id ? { ...comp,
                    quantity: Math.max(0, newQuantity)
                } : comp,
            ),
        }));
    };

    const handleFormChange = (field, value) => {
        setCurrentState((prev) => ({
            ...prev,
            form: {
                ...prev.form,
                [field]: value,
                ...(field === "project" && {
                    windfarm: "",
                    cluster: ""
                }),
                ...(field === "windfarm" && {
                    cluster: ""
                }),
            },
        }));
    };

    const handleAddRow = () => {
        setCurrentState((prev) => ({
            ...prev,
            components: [
                ...prev.components,
                {
                    id: Date.now(),
                    name: "",
                    code: "",
                    type: "",
                    selected: true,
                    quantity: 1,
                    unit: "Nos",
                    isCustom: true,
                },
            ],
        }));
    };

    const handleDeleteRow = (id) => {
        setCurrentState((prev) => ({
            ...prev,
            components: prev.components.filter((c) => c.id !== id),
        }));
    };

    const showMessage = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    // ==================== SUBMIT HANDLER ====================
    const handleSubmit = async () => {
        const {
            form,
            components
        } = currentState;
        const selectedComponents = components.filter((c) => c.selected);

        if (!canConfigure) {
            showMessage("Please complete all required fields first", "error");
            return;
        }

        if (selectedComponents.length === 0) {
            showMessage("Please select at least one component", "error");
            return;
        }

        if (isFullyConfigured) {
            showMessage(
                materialMode === "same" ?
                "All clusters are already configured. No new records to create." :
                "Data already exists for selected cluster. Please use edit mode or delete existing data.",
                "warning",
            );
            return;
        }

        setCurrentState((prev) => ({ ...prev,
            loading: true
        }));

        try {
            let allPayloads = [];
            let targetClusters = [];

            if (materialMode === "same") {
                if (availableClusters.length === 0) {
                    showMessage(
                        "All clusters are already configured. No new records created.",
                        "warning",
                    );
                    setCurrentState((prev) => ({ ...prev,
                        loading: false
                    }));
                    return;
                }

                targetClusters = availableClusters;

                targetClusters.forEach((cluster) => {
                    const clusterPayload = selectedComponents.map((item) => ({
                        project_id: form.project,
                        windfarm_id: form.windfarm,
                        cluster_id: cluster.cluster_id,
                        material_id: item.isCustom ? null : item.id,
                        pole_type: tab === 0 ? "line_pole" : "cut_pole",
                        component_name: item.name,
                        code: item.code,
                        type: item.type,
                        quantity: item.quantity,
                        unit: item.unit,
                        status: "active",
                    }));
                    allPayloads = [...allPayloads, ...clusterPayload];
                });
            } else {
                targetClusters = [clusters.find((c) => c.cluster_id === form.cluster)];
                allPayloads = selectedComponents.map((item) => ({
                    project_id: form.project,
                    windfarm_id: form.windfarm,
                    cluster_id: form.cluster,
                    material_id: item.isCustom ? null : item.id,
                    pole_type: tab === 0 ? "line_pole" : "cut_pole",
                    component_name: item.name,
                    code: item.code,
                    type: item.type,
                    quantity: item.quantity,
                    unit: item.unit,
                    status: "active",
                }));
            }

            const response = await dispatch(CREATEPOLELINEMASTER(allPayloads));

            if (response ? .error) {
                throw new Error(response.error.message || "Failed to save data");
            }

            await dispatch(GetPoleLineMasterData());

            if (materialMode === "same") {
                showMessage(
                    `${tab === 0 ? "Line Pole" : "Cut Pole"} material configuration applied to ${targetClusters.length} cluster(s): ${targetClusters
            .map((c) => c.cluster_name)
            .join(", ")}.`,
                    "success",
                );
            } else {
                const selectedCluster = clusters.find(
                    (c) => c.cluster_id === form.cluster,
                );
                showMessage(
                    `${tab === 0 ? "Line Pole" : "Cut Pole"} material configuration saved for cluster "${selectedCluster?.cluster_name}".`,
                    "success",
                );
            }

            setCurrentState((prev) => ({ ...prev,
                loading: false
            }));
            handleReset();
        } catch (err) {
            showMessage(
                err.message || "Error saving data. Please try again.",
                "error",
            );
            setCurrentState((prev) => ({ ...prev,
                loading: false
            }));
        }
    };

    const handleReset = () => {
        setCurrentState((prev) => ({
            ...prev,
            form: {
                project: "",
                windfarm: "",
                cluster: ""
            },
            components: tab === 0 ? INITIAL_LINE_COMPONENTS : INITIAL_CUT_COMPONENTS,
        }));
        setMaterialMode(null);
    };

    // ==================== RENDER FUNCTIONS ====================
    const renderComponentTable = (components, type) => {
        const selectedCount = components.filter((c) => c.selected).length;

        return ( <
            Box sx = {
                {
                    mt: 0
                }
            } >
            <
            Stack direction = "row"
            justifyContent = "space-between"
            alignItems = "center"
            sx = {
                {
                    mb: 2
                }
            } >
            <
            Typography variant = "subtitle1"
            color = "text.secondary" >
            Selected: {
                " "
            } <
            Chip label = {
                selectedCount
            }
            size = "small"
            color = {
                selectedCount > 0 ? "primary" : "default"
            }
            /> <
            /Typography>

            { /* STEP 3: Add Row Button - Disabled when cannot configure or fully configured */ } <
            /Stack>

            { /* STEP 4 & 5: Alerts for configuration state */ } {
                !canConfigure && ( <
                    Alert severity = "info"
                    sx = {
                        {
                            mb: 2
                        }
                    } > {
                        materialMode === "different" ?
                        "Please select Cluster to configure material." :
                            "Please choose Yes/No to continue."
                    } <
                    /Alert>
                )
            }

            {
                isFullyConfigured && ( <
                    Alert severity = "warning"
                    sx = {
                        {
                            mb: 2
                        }
                    } > {
                        materialMode === "same" ?
                        "All clusters are already configured. No new configuration can be added." :
                            "Material configuration already exists."
                    } <
                    /Alert>
                )
            }

            <
            TableContainer component = {
                Paper
            }
            sx = {
                {
                    boxShadow: 3
                }
            } >
            <
            Table sx = {
                {
                    minWidth: 650
                }
            } >
            <
            TableHead sx = {
                {
                    bgcolor: "#00416a",
                    "& .MuiTableCell-root": {
                        color: "white",
                        fontWeight: "bold",
                    },
                }
            } >
            <
            TableRow >
            <
            TableCell padding = "checkbox"
            sx = {
                {
                    width: 50
                }
            } >
            <
            Typography fontWeight = "bold" > Select < /Typography> <
            /TableCell> <
            TableCell >
            <
            Typography fontWeight = "bold" > Component Name < /Typography> <
            /TableCell> <
            TableCell >
            <
            Typography fontWeight = "bold" > Code < /Typography> <
            /TableCell> <
            TableCell >
            <
            Typography fontWeight = "bold" > Type < /Typography> <
            /TableCell> <
            TableCell align = "center" >
            <
            Typography fontWeight = "bold" > Quantity < /Typography> <
            /TableCell> <
            TableCell align = "center" >
            <
            Typography fontWeight = "bold" > Unit < /Typography> <
            /TableCell> <
            TableCell align = "center" >
            <
            Typography fontWeight = "bold" > Status < /Typography> <
            /TableCell> <
            TableCell align = "center" >
            <
            Typography fontWeight = "bold" > Action < /Typography> <
            /TableCell> <
            /TableRow> <
            /TableHead> <
            TableBody > {
                components.map((component) => ( <
                    TableRow key = {
                        component.id
                    }
                    sx = {
                        {
                            bgcolor: component.selected ?
                                "rgba(25, 118, 210, 0.04)" :
                                "inherit",
                        }
                    } >
                    <
                    TableCell padding = "checkbox" >
                    <
                    Checkbox checked = {
                        component.selected
                    }
                    onChange = {
                        handleCheckbox(component.id)
                    }
                    color = "primary"
                    disabled = {
                        currentState.loading ||
                        !canConfigure ||
                        isFullyConfigured
                    }
                    /> <
                    /TableCell> <
                    TableCell > {
                        component.isCustom ? ( <
                            TextField value = {
                                component.name
                            }
                            disabled = {!canConfigure || isFullyConfigured
                            }
                            onChange = {
                                (e) =>
                                setCurrentState((prev) => ({
                                    ...prev,
                                    components: prev.components.map((c) =>
                                        c.id === component.id ?
                                        { ...c,
                                            name: e.target.value
                                        } :
                                        c,
                                    ),
                                }))
                            }
                            variant = "outlined"
                            size = "small"
                            fullWidth /
                            >
                        ) : ( <
                            Typography > {
                                component.name
                            } < /Typography>
                        )
                    } <
                    /TableCell> <
                    TableCell > {
                        component.isCustom ? ( <
                            TextField value = {
                                component.code
                            }
                            disabled = {!canConfigure || isFullyConfigured
                            }
                            onChange = {
                                (e) =>
                                setCurrentState((prev) => ({
                                    ...prev,
                                    components: prev.components.map((c) =>
                                        c.id === component.id ?
                                        { ...c,
                                            code: e.target.value
                                        } :
                                        c,
                                    ),
                                }))
                            }
                            variant = "outlined"
                            size = "small"
                            fullWidth /
                            >
                        ) : ( <
                            Chip label = {
                                component.code
                            }
                            size = "small"
                            variant = "outlined" /
                            >
                        )
                    } <
                    /TableCell> <
                    TableCell > {
                        component.isCustom ? ( <
                            TextField value = {
                                component.type
                            }
                            disabled = {!canConfigure || isFullyConfigured
                            }
                            onChange = {
                                (e) =>
                                setCurrentState((prev) => ({
                                    ...prev,
                                    components: prev.components.map((c) =>
                                        c.id === component.id ?
                                        { ...c,
                                            type: e.target.value
                                        } :
                                        c,
                                    ),
                                }))
                            }
                            variant = "outlined"
                            size = "small"
                            fullWidth /
                            >
                        ) : (
                            component.type
                        )
                    } <
                    /TableCell> <
                    TableCell align = "center" >
                    <
                    Box sx = {
                        {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                        }
                    } >
                    <
                    Button size = "small"
                    variant = "outlined"
                    onClick = {
                        () =>
                        handleQuantityChange(
                            component.id,
                            component.quantity - 1,
                        )
                    }
                    disabled = {
                        component.quantity <= 0 ||
                        currentState.loading ||
                        !canConfigure ||
                        isFullyConfigured
                    }
                    sx = {
                        {
                            minWidth: 30,
                            width: 30,
                            height: 30
                        }
                    } >
                    -
                    <
                    /Button> <
                    Typography sx = {
                        {
                            minWidth: 40,
                            textAlign: "center"
                        }
                    } > {
                        component.quantity
                    } <
                    /Typography> <
                    Button size = "small"
                    variant = "outlined"
                    onClick = {
                        () =>
                        handleQuantityChange(
                            component.id,
                            component.quantity + 1,
                        )
                    }
                    disabled = {
                        currentState.loading ||
                        !canConfigure ||
                        isFullyConfigured
                    }
                    sx = {
                        {
                            minWidth: 30,
                            width: 30,
                            height: 30
                        }
                    } >
                    +
                    <
                    /Button> <
                    /Box> <
                    /TableCell> <
                    TableCell align = "center" > {
                        component.isCustom ? ( <
                            TextField value = {
                                component.unit
                            }
                            disabled = {!canConfigure || isFullyConfigured
                            }
                            onChange = {
                                (e) =>
                                setCurrentState((prev) => ({
                                    ...prev,
                                    components: prev.components.map((c) =>
                                        c.id === component.id ?
                                        { ...c,
                                            unit: e.target.value
                                        } :
                                        c,
                                    ),
                                }))
                            }
                            variant = "outlined"
                            size = "small"
                            inputProps = {
                                {
                                    style: {
                                        textAlign: "center"
                                    },
                                }
                            }
                            sx = {
                                {
                                    width: 70
                                }
                            }
                            />
                        ) : (
                            component.unit
                        )
                    } <
                    /TableCell> <
                    TableCell align = "center" > {
                        component.selected ? ( <
                            CheckCircleIcon sx = {
                                {
                                    color: "success.main",
                                    fontSize: 20
                                }
                            }
                            />
                        ) : ( <
                            CancelIcon sx = {
                                {
                                    color: "grey.400",
                                    fontSize: 20
                                }
                            }
                            />
                        )
                    } <
                    /TableCell> <
                    TableCell align = "center" > {
                        component.isCustom && ( <
                            Button color = "error"
                            size = "small"
                            onClick = {
                                () => handleDeleteRow(component.id)
                            }
                            startIcon = { < DeleteIcon / >
                            }
                            disabled = {!canConfigure || isFullyConfigured
                            } >
                            Delete <
                            /Button>
                        )
                    } <
                    /TableCell> <
                    /TableRow>
                ))
            } <
            /TableBody> <
            /Table> <
            /TableContainer>

            {
                selectedCount === 0 && components.length > 0 && !isFullyConfigured && ( <
                    Alert severity = "info"
                    sx = {
                        {
                            mt: 2
                        }
                    } >
                    No components selected.Please check the boxes to add components to this pole configuration. <
                    /Alert>
                )
            } <
            /Box>
        );
    };

    return ( <
        Box sx = {
            {
                maxWidth: 1200,
                mx: "auto",
                p: 3
            }
        } >
        <
        Box sx = {
            {
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#fff"
            }
        } >
        <
        Typography variant = "h6"
        gutterBottom align = "center"
        sx = {
            {
                mb: 3,
                fontWeight: 600,
                color: "#00416a"
            }
        } >
        Electrical Pole Master Configuration <
        /Typography> <
        Divider sx = {
            {
                mb: 3
            }
        }
        />

        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "center",
                mb: 3
            }
        } >
        <
        Tabs value = {
            tab
        }
        onChange = {
            (e, v) => setTab(v)
        } >
        <
        Tab label = "Line Pole"
        sx = {
            {
                fontWeight: 600
            }
        }
        /> <
        Tab label = "Cut Pole"
        sx = {
            {
                fontWeight: 600
            }
        }
        /> <
        /Tabs> <
        /Box>

        <
        Box sx = {
            {
                p: 2,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 2
            }
        } >
        <
        Typography variant = "h6"
        gutterBottom sx = {
            {
                color: "#00416a",
                fontWeight: 600
            }
        } >
        Project Information - {
            tab === 0 ? "Line Pole" : "Cut Pole"
        } <
        /Typography> <
        Box sx = {
            {
                display: "flex",
                gap: 2,
                flexWrap: "wrap"
            }
        } >
        <
        FormControl sx = {
            {
                minWidth: 200,
                flex: 1
            }
        } >
        <
        InputLabel > Project * < /InputLabel> <
        Select value = {
            currentState.form.project
        }
        onChange = {
            (e) => handleFormChange("project", e.target.value)
        }
        label = "Project *"
        disabled = {
            currentState.loading
        } >
        {
            projects.map((item) => ( <
                MenuItem key = {
                    item.project_id
                }
                value = {
                    item.project_id
                } > {
                    item.project_name
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl>

        <
        FormControl sx = {
            {
                minWidth: 200,
                flex: 1
            }
        } >
        <
        InputLabel > Windfarm * < /InputLabel> <
        Select value = {
            currentState.form.windfarm
        }
        onChange = {
            (e) => handleFormChange("windfarm", e.target.value)
        }
        label = "Windfarm *"
        disabled = {
            currentState.loading || !currentState.form.project
        } >
        {
            windfarms.map((item) => ( <
                MenuItem key = {
                    item.windfarm_id
                }
                value = {
                    item.windfarm_id
                } > {
                    item.windfarm_name
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl>

        <
        FormControl sx = {
            {
                minWidth: 200,
                flex: 1
            }
        } >
        <
        InputLabel > {
            isClusterRequired ? "Cluster *" : "Cluster (Not Required)"
        } <
        /InputLabel> <
        Select value = {
            currentState.form.cluster
        }
        onChange = {
            (e) => handleFormChange("cluster", e.target.value)
        }
        label = {
            isClusterRequired ? "Cluster *" : "Cluster (Not Required)"
        }
        disabled = {
            currentState.loading ||
            !currentState.form.windfarm ||
            materialMode === "same"
        } >
        {
            clusters.map((item) => ( <
                MenuItem key = {
                    item.cluster_id
                }
                value = {
                    item.cluster_id
                } > {
                    item.cluster_name
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        /Box> <
        /Box>

        { /* STEP 1: Location Selection Check */ } {
            (!currentState.form.project || !currentState.form.windfarm) && ( <
                Alert severity = "info"
                sx = {
                    {
                        mb: 2
                    }
                } >
                Please select < strong > Project < /strong> and <strong>Windfarm</strong > {
                    " "
                }
                first. <
                /Alert>
            )
        }

        { /* MATERIAL CONFIGURATION - YES/NO BUTTONS */ } <
        Box sx = {
            {
                mt: 3,
                mb: 3,
                p: 2,
                border: "1px solid #00416a",
                borderRadius: 2,
                bgcolor: "#f8f9fa",
            }
        } >
        <
        Typography variant = "subtitle1"
        sx = {
            {
                fontWeight: 600,
                color: "#00416a",
                mb: 2
            }
        } >
        Apply Same Material to All Clusters ?
        <
        /Typography>

        <
        Stack direction = "row"
        spacing = {
            2
        }
        sx = {
            {
                mb: 2
            }
        } >
        <
        Button variant = {
            materialMode === "same" ? "contained" : "outlined"
        }
        color = "primary"
        disabled = {!currentState.form.project || !currentState.form.windfarm
        }
        onClick = {
            () =>
            setConfirmDialog({
                open: true,
                mode: "same",
            })
        }
        sx = {
            {
                minWidth: 120,
                py: 1,
                borderColor: materialMode === "same" ? "#00416a" : "#00416a",
            }
        }
        startIcon = { < CheckCircleIcon / >
        } >
        Yes <
        /Button> <
        Button variant = {
            materialMode === "different" ? "contained" : "outlined"
        }
        color = "secondary"
        disabled = {!currentState.form.project || !currentState.form.windfarm
        }
        onClick = {
            () =>
            setConfirmDialog({
                open: true,
                mode: "different",
            })
        }
        sx = {
            {
                minWidth: 120,
                py: 1,
            }
        }
        startIcon = { < CancelIcon / >
        } >
        No <
        /Button> <
        /Stack>

        {
            materialMode === null && ( <
                Alert severity = "warning"
                sx = {
                    {
                        mt: 2
                    }
                } >
                Please choose Yes or No before selecting any material configuration. <
                /Alert>
            )
        }

        {
            materialMode === "same" && availableClusters.length > 0 && ( <
                Alert severity = "success"
                sx = {
                    {
                        mt: 1
                    }
                } > ✅The selected material will be applied to {
                    " "
                } <
                strong > {
                    availableClusters.length
                } < /strong> remaining cluster(s) <
                br / >
                <
                small style = {
                    {
                        color: "#666"
                    }
                } > {
                    availableClusters.map((c) => c.cluster_name).join(", ")
                } <
                /small> <
                /Alert>
            )
        }

        {
            materialMode === "same" &&
                availableClusters.length === 0 &&
                clusters.length > 0 && ( <
                    Alert severity = "warning"
                    sx = {
                        {
                            mt: 1
                        }
                    } > ⚠️All clusters are already configured.No new configurations can be added. <
                    /Alert>
                )
        }

        {
            materialMode === "same" && clusters.length === 0 && ( <
                Alert severity = "warning"
                sx = {
                    {
                        mt: 1
                    }
                } > ⚠️No clusters found.Please select a windfarm with clusters. <
                /Alert>
            )
        }

        {
            materialMode === "different" && currentState.form.cluster && ( <
                Alert severity = "info"
                sx = {
                    {
                        mt: 1
                    }
                } >
                ℹ️ Material will be saved only
                for cluster: {
                    " "
                } <
                strong > {
                    clusters.find(
                        (c) => c.cluster_id === currentState.form.cluster,
                    ) ? .cluster_name
                } <
                /strong> <
                /Alert>
            )
        }

        {
            materialMode === "different" && !currentState.form.cluster && ( <
                Alert severity = "warning"
                sx = {
                    {
                        mt: 1
                    }
                } > ⚠️Please select a cluster first. <
                /Alert>
            )
        } <
        /Box>

        {
            renderComponentTable(
                currentState.components,
                tab === 0 ? "line" : "cut",
            )
        }

        <
        Box sx = {
            {
                mt: 3,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end"
            }
        } >
        <
        Button variant = "outlined"
        onClick = {
            handleReset
        }
        startIcon = { < DeleteIcon / >
        }
        color = "secondary"
        disabled = {
            currentState.loading
        } >
        Reset <
        /Button>

        <
        Button variant = "contained"
        onClick = {
            handleSubmit
        }
        disabled = {
            currentState.loading ||
            !canConfigure ||
            isFullyConfigured ||
            currentState.components.filter((c) => c.selected).length === 0
        }
        startIcon = {
            currentState.loading ? ( <
                CircularProgress size = {
                    20
                }
                />
            ) : ( <
                SaveIcon / >
            )
        } >
        {
            currentState.loading ?
            "Saving..." :
                isFullyConfigured ?
                "Already Configured" :
                "Save Configuration"
        } <
        /Button> <
        /Box> <
        /Box>

        { /* Logs Table */ } {
            tab === 0 ? ( <
                PoleMasterLogsTable rows = {
                    linePoleLogs
                }
                poleLabel = "Line Pole"
                masterLookup = {
                    getturbinefilter
                }
                />
            ) : ( <
                PoleMasterLogsTable rows = {
                    cutPoleLogs
                }
                poleLabel = "Cut Pole"
                masterLookup = {
                    getturbinefilter
                }
                />
            )
        }

        { /* Confirmation Dialog */ } <
        Dialog open = {
            confirmDialog.open
        }
        onClose = {
            () =>
            setConfirmDialog({
                open: false,
                mode: null,
            })
        }
        maxWidth = "sm"
        fullWidth >
        <
        DialogTitle > Confirm Material Configuration < /DialogTitle>

        <
        DialogContent >
        <
        DialogContentText > {
            confirmDialog.mode === "same" ?
            `You are about to apply the same material configuration to ALL remaining clusters under the selected windfarm. This action may affect ${availableClusters.length} cluster(s).

Are you sure you want to continue?` :
                `You are about to apply the material configuration only to the selected cluster.

Are you sure you want to continue?`
        } <
        /DialogContentText> <
        /DialogContent>

        <
        DialogActions >
        <
        Button onClick = {
            () =>
            setConfirmDialog({
                open: false,
                mode: null,
            })
        } >
        Cancel <
        /Button>

        <
        Button variant = "contained"
        onClick = {
            () => {
                setMaterialMode(confirmDialog.mode);

                if (confirmDialog.mode === "same") {
                    setCurrentState((prev) => ({
                        ...prev,
                        form: {
                            ...prev.form,
                            cluster: "",
                        },
                    }));
                }

                setConfirmDialog({
                    open: false,
                    mode: null,
                });
            }
        } >
        Yes, Continue {
            " "
        } <
        /Button> <
        /DialogActions> <
        /Dialog>

        <
        Snackbar open = {
            snackbar.open
        }
        autoHideDuration = {
            6000
        }
        onClose = {
            () => setSnackbar((prev) => ({ ...prev,
                open: false
            }))
        }
        anchorOrigin = {
            {
                vertical: "bottom",
                horizontal: "center"
            }
        } >
        <
        Alert onClose = {
            () => setSnackbar((prev) => ({ ...prev,
                open: false
            }))
        }
        severity = {
            snackbar.severity
        }
        variant = "filled" >
        {
            snackbar.message
        } <
        /Alert> <
        /Snackbar> <
        /Box>
    );
}