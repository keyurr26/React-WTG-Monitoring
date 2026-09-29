import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    Tabs,
    Tab,
    Box,
    Table,
    Typography,
    Grid,
    Card,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Container,
    TextField,
    IconButton,
    Button,
    CircularProgress,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    alpha,
    Alert,
    Snackbar,
    Autocomplete,
    Switch,
    Stack,
    Checkbox
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
    PatchPoleLineMaterialData,
    GetPoleLinesData,
    BulkPatchPoleLineMaterialData,
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";
import {
    GetElectricalMasterData,
    GetPoleLineMasterData,

} from "../../../Redux/MasterData/masterAction";

const TABLE_CONFIG = {
    line_pole: ["Action", "Pole No", "Materials", "Fab Mounting Date", "Photo"],
    cut_pole: ["Action", "Pole No", "Materials", "Fab Mounting Date", "Photo"],
};

const DynamicPoleTable = ({
    filters
}) => {
    const dispatch = useDispatch();

    // State declarations
    const [tab, setTab] = useState("line_pole");
    const [rows, setRows] = useState([]);
    const [selectedLine, setSelectedLine] = useState("");

    const [loading, setLoading] = useState(false);
    const [editRowId, setEditRowId] = useState(null);
    const [editData, setEditData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [sendingId, setSendingId] = useState(null);

    const [bulkSendSelection, setBulkSendSelection] = useState([]);
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkSending, setBulkSending] = useState(false);

    const [errors, setErrors] = useState({});

    const [lineLoading, setLineLoading] = useState(false);

    const {
        getElectricalMaster = []
    } = useSelector((state) => state.masterData);
    const {
        getpoLineData = [], loading: apiLoading, patchLoading,
    } = useSelector(
        (state) => state.electricalData,
    );
    const {
        getpoleMasterData = []
    } = useSelector((state) => state.masterData);

    const isFilterIncomplete = !filters.project || !filters.windfarm || !filters.cluster;

    const getHelperText = () => {
        if (!filters.project) return "Select Project first";
        if (!filters.windfarm) return "Select Windfarm next";
        if (!filters.cluster) return "Select Cluster to enable lines";
        return "Select a line";
    };


    const handleBulkSend = async () => {
        try {
            setBulkSending(true);

            const payload = {
                ids: bulkSendSelection,
                submitted_l2_at: new Date().toISOString(),
            };

            const response = await dispatch(BulkPatchPoleLineMaterialData(payload));

            setSnackbar({
                open: true,
                severity: "success",
                message: response ? .message ||
                    `${response?.updated_count || bulkSendSelection.length} poles submitted successfully.`,
            });

            setBulkSendSelection([]);
            setBulkMode(false);

            // await dispatch(GetPoleLinesData());

            await dispatch(
                GetPoleLinesData({
                    cluster: filters.cluster,
                    line_id: selectedLine,
                })
            );



        } catch (err) {
            console.error("Bulk L2 submit error:", err);

            setSnackbar({
                open: true,
                severity: "error",
                message: "Bulk submit failed.",
            });
        } finally {
            setBulkSending(false);
        }
    };


    useEffect(() => {
        dispatch(GetElectricalMasterData());

        dispatch(GetPoleLineMasterData());
    }, [dispatch]);


    useEffect(() => {
        if (getpoLineData && getpoLineData.length > 0) {
            setRows(getpoLineData.map((pole) => ({ ...pole,
                isEdit: false
            })));
        }
    }, [getpoLineData]);

    // useEffect(() => {
    //   if (
    //     filters.project &&
    //     filters.windfarm &&
    //     filters.cluster &&
    //     selectedLine
    //   ) {
    //     dispatch(
    //       GetPoleLinesData({
    //         project: filters.project,
    //         windfarm: filters.windfarm,
    //         cluster: filters.cluster,
    //         electrical_line: selectedLine,
    //       }),
    //     );
    //   }
    // }, [
    //   dispatch,
    //   filters.project,
    //   filters.windfarm,
    //   filters.cluster,
    //   selectedLine,
    // ]);

    useEffect(() => {
        setSelectedLine("");
        setLineLoading(false);
        setEditRowId(null);
        setEditData({});
        setSelectedFile(null);
    }, [filters.project, filters.windfarm, filters.cluster]);





    useEffect(() => {
        if (!selectedLine || !filters.cluster) {
            setLineLoading(false);
            return;
        }

        let isMounted = true;

        const fetchLineData = async () => {
            setLineLoading(true);

            try {
                await dispatch(
                    GetPoleLinesData({
                        cluster: filters.cluster,
                        line_id: selectedLine,
                    })
                );
            } finally {
                if (isMounted) {
                    setLineLoading(false);
                }
            }
        };

        fetchLineData();

        return () => {
            isMounted = false;
        };
    }, [selectedLine, filters.cluster, dispatch]);




    const getToday = () => new Date().toISOString().split("T")[0];
    const getMinDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - 2);
        return date.toISOString().split("T")[0];
    };

    // Filter line options
    const lineOptions = useMemo(() => {
        return getElectricalMaster.filter((item) => {
            return (
                Number(item.project) === Number(filters.project) &&
                Number(item.windfarm) === Number(filters.windfarm) &&
                Number(item.cluster) === Number(filters.cluster) &&
                item.line_type === "SCOH (Single Circuit Overhead Line)"
            );
        });
    }, [getElectricalMaster, filters.project, filters.windfarm, filters.cluster]);

    // const rows = getpoLineData || [];

    // Filter poles by selected line
    const filteredPoles =
        selectedLine && rows.length > 0 ?
        rows.filter(
            (item) =>
            Number(item.electrical_line) === Number(selectedLine) &&
            item.approved_l1_at !== null,
        ) :
        [];

    const tabFilteredPoles = filteredPoles.filter(
        (pole) => pole.pole_type === tab,
    );



    // Get material options from PoleMaster
    const uniqueMaterialOptions = getpoleMasterData
        .filter(
            (item) =>
            item.pole_type === tab &&
            Number(item.cluster_id) === Number(filters.cluster),
        )
        .map((item) => ({
            label: item.component_name,
            value: item.component_name,
            quantity: item.quantity,
            unit: item.unit,
            code: item.code,
        }))
        .filter(
            (item, index, self) =>
            index === self.findIndex((t) => t.value === item.value),
        );




    const materialOptionsWithSelectAll = [{
            label: "Select All Materials",
            value: "__SELECT_ALL__",
            isSelectAll: true,
        },
        ...uniqueMaterialOptions,
    ];
    // Parse materials from backend
    const parseMaterials = (pole) => {
        if (!pole ? .materials) return [];

        // already array from backend
        if (Array.isArray(pole.materials)) {
            return pole.materials;
        }

        // string case
        if (typeof pole.materials === "string") {
            try {
                return JSON.parse(pole.materials);
            } catch {
                return [];
            }
        }

        return [];
    };

    const handleEditClick = (pole) => {
        if (!pole || !pole.id) return;
        setEditRowId(pole.id);

        const existingMaterials = parseMaterials(pole);
        const materialQuantities = {};

        existingMaterials.forEach((item) => {
            if (typeof item === "string") {
                materialQuantities[item] = 1;
            } else if (typeof item === "object" && item.name) {
                materialQuantities[item.name] = item.quantity || 1;
            }
        });

        setEditData({
            materials: existingMaterials.map((item) =>
                typeof item === "object" ? item.name : item,
            ),
            materialQuantities,
            "Fab Mounting Date": pole.fab_mounting_date || getToday(),
        });
        setSelectedFile(null);
    };

    const handleMaterialSelect = (newValue) => {
        setErrors((prev) => ({
            ...prev,
            materials: "",
        }));

        const selectedValues = newValue.map((item) => item.value);
        const newQuantities = { ...editData.materialQuantities
        };

        selectedValues.forEach((material) => {
            if (!newQuantities[material]) {
                const info = uniqueMaterialOptions.find((m) => m.value === material);
                newQuantities[material] = info ? info.quantity : 1;
            }
        });

        Object.keys(newQuantities).forEach((key) => {
            if (!selectedValues.includes(key)) {
                delete newQuantities[key];
            }
        });

        setEditData((prev) => ({
            ...prev,
            materials: selectedValues,
            materialQuantities: newQuantities,
        }));
    };

    const handleQuantityChange = (materialName, delta) => {
        setEditData((prev) => ({
            ...prev,
            materialQuantities: {
                ...prev.materialQuantities,
                [materialName]: Math.max(
                    0,
                    (prev.materialQuantities[materialName] || 0) + delta,
                ),
            },
        }));
    };

    const handleSaveClick = async (pole) => {
        if (!pole || !pole.id) return;

        // Validation
        const validationErrors = {};

        const existingPhoto = pole.fab_mounting_photo;
        if (!selectedFile && (!existingPhoto || existingPhoto === "null")) {
            validationErrors.photo = "Photo is required";
        }
        if (!editData.materials || editData.materials.length === 0) {
            validationErrors.materials = "At least one material is required";
        }

        if (!editData["Fab Mounting Date"]) {
            validationErrors["Fab Mounting Date"] = "Required";
        }
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setSnackbar({
                open: true,
                message: "Please fill all required fields.",
                severity: "error",
            });
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            let hasChanges = false;

            // Prepare materials with quantities
            const materialsWithQty = editData.materials.map((name) => ({
                name: name,
                quantity: editData.materialQuantities[name] || 1,
            }));

            const currentMaterials = parseMaterials(pole);
            const currentStr = JSON.stringify(currentMaterials);
            const newStr = JSON.stringify(materialsWithQty);

            if (currentStr !== newStr) {
                formData.append("materials", newStr);
                hasChanges = true;
            }

            // Date change
            if (editData["Fab Mounting Date"] !== pole.fab_mounting_date) {
                formData.append(
                    "fab_mounting_date",
                    editData["Fab Mounting Date"] || getToday(),
                );
                hasChanges = true;
            }

            // Photo change
            if (selectedFile) {
                formData.append("fab_mounting_photo", selectedFile);
                hasChanges = true;
            }

            if (hasChanges) {
                formData.append("saved_l2_at", new Date().toISOString());
            }

            if (!hasChanges) {
                setSnackbar({
                    open: true,
                    message: "No changes to save",
                    severity: "info",
                });
                setEditRowId(null);
                setSelectedFile(null);
                setEditData({});
                setLoading(false);
                return;
            }

            await dispatch(PatchPoleLineMaterialData(pole.id, formData));
            // await dispatch(GetPoleLinesData());
            await dispatch(GetPoleLinesData({
                cluster: filters.cluster,
                line_id: selectedLine,

            }));
            // setRefreshTrigger(prev => prev + 1);

            setSnackbar({
                open: true,
                message: "Data Saved Successfully",
                severity: "success",
            });
            setEditRowId(null);
            setSelectedFile(null);
            setEditData({});
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Failed to save data",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };




    const handlePoleApproval = async (pole) => {
        try {

            setSendingId(pole.id);
            const formData = new FormData();

            formData.append("submitted_l2_at", new Date().toISOString());

            await dispatch(PatchPoleLineMaterialData(pole.id, formData));

            // await dispatch(GetPoleLinesData());

            await dispatch(
                GetPoleLinesData({
                    cluster: filters.cluster,
                    line_id: selectedLine,
                })
            );

            setSnackbar({
                open: true,
                message: "Pole submitted successfully",
                severity: "success",
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Failed to submit pole",
                severity: "error",
            });
        } finally {
            // ✅ Loader sirf isi row se remove hoga
            setSendingId(null);
        }


    };

    const handleCancelClick = () => {
        setEditRowId(null);
        setSelectedFile(null);
        setEditData({});
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
        setErrors((prev) => ({ ...prev,
            photo: ""
        }));
    };

    const handleInputChange = (field, value) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };


    const handleBulkSendToggle = (pole) => {
        if (!pole ? .id) return;

        if (pole.submitted_l2_at || pole.approved_l2_at || !pole.saved_l2_at) {
            return;
        }

        setBulkSendSelection((prev) => {
            if (prev.includes(pole.id)) {
                return prev.filter((id) => id !== pole.id);
            }

            return [...prev, pole.id];
        });
    };



    const selectedLineId = selectedLine;
    const selectedLineData = getElectricalMaster.find(
        (item) => Number(item.id) === Number(selectedLine),
    );

    const headers = TABLE_CONFIG[tab];

    // if (apiLoading && rows.length === 0) {
    //   return (
    //     <Box
    //       display="flex"
    //       justifyContent="center"
    //       alignItems="center"
    //       minHeight="400px"
    //     >
    //       <CircularProgress />
    //     </Box>
    //   );
    // }

    return ( <
        Container maxWidth = "xl"
        sx = {
            {
                py: 3
            }
        } >
        <
        Snackbar open = {
            snackbar.open
        }
        autoHideDuration = {
            6000
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        }
        anchorOrigin = {
            {
                vertical: "top",
                horizontal: "right"
            }
        } >
        <
        Alert severity = {
            snackbar.severity
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        } >
        {
            snackbar.message
        } <
        /Alert> <
        /Snackbar>

        <
        Typography variant = "h6"
        mb = {
            2
        }
        fontWeight = {
            600
        } >
        Material Consumption Table <
        /Typography>

        { /* Line Selection Dropdown */ }

        <
        Box width = {
            300
        } >
        <
        FormControl fullWidth size = "small" >
        <
        InputLabel > Line Name < /InputLabel> <
        Select value = {
            selectedLine
        }
        label = "Line Name"
        onChange = {
            (e) => setSelectedLine(e.target.value)
        }
        disabled = {
            isFilterIncomplete
        } // 🔥 disable here
        >
        <
        MenuItem value = "" > Select a line < /MenuItem> {
            lineOptions.map((line) => ( <
                MenuItem key = {
                    line.id
                }
                value = {
                    line.id
                } > {
                    line.line_name
                } <
                /MenuItem>
            ))
        } <
        /Select>

        <
        Typography variant = "caption"
        color = "textSecondary" > {
            getHelperText()
        } <
        /Typography> <
        /FormControl> <
        /Box>

        { /* Tabs */ } <
        Box >
        <
        Paper elevation = {
            0
        }
        sx = {
            {
                borderBottom: "1px solid",
                borderColor: "divider"
            }
        } >
        <
        Tabs value = {
            tab
        }
        onChange = {
            (e, v) => {
                setTab(v);
                setEditRowId(null); // Reset edit mode when switching tabs
            }
        }
        centered sx = {
            {
                "& .MuiTabs-indicator": {
                    backgroundColor: "#3b82f6",
                    height: 3,
                    borderRadius: "3px",
                },
                "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    py: 2,
                    px: 3,
                    "&.Mui-selected": {
                        color: "#3b82f6",
                    },
                },
            }
        } >
        <
        Tab label = "Line Pole"
        value = "line_pole" / >
        <
        Tab label = "Cut Pole"
        value = "cut_pole" / >
        <
        /Tabs> <
        /Paper>


        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 1,
                // mb: 1,

                // ✅ bottom margin kam (4px)
                mt: 1, // ✅ uppar se margin (8px)
                // ✅ uppar se padding (4px) - extra space
            }
        } >
        {!bulkMode ? ( <
                Button variant = "outlined"
                startIcon = { < SendIcon / >
                }
                onClick = {
                    () => setBulkMode(true)
                } >
                Bulk Send For Approval <
                /Button>
            ) : ( <
                >
                <
                Button variant = "contained"
                color = "primary"
                onClick = {
                    handleBulkSend
                }
                disabled = {
                    bulkSendSelection.length === 0 || bulkSending
                }
                startIcon = {
                    bulkSending ? ( <
                        CircularProgress size = {
                            18
                        }
                        color = "inherit" / >
                    ) : ( <
                        SendIcon / >
                    )
                } >
                {
                    bulkSending ?
                    "Sending..." :
                        `Send Selected (${bulkSendSelection.length})`
                } <
                /Button>

                <
                Button variant = "text"
                color = "inherit"
                onClick = {
                    () => {
                        setBulkMode(false);
                        setBulkSendSelection([]);
                    }
                }
                disabled = {
                    bulkSending
                } >
                Cancel <
                /Button> <
                />
            )
        } <
        /Box>

        <
        Paper sx = {
            {
                mt: 1,
                overflowX: "auto",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
            }
        } >
        <
        Table size = "small"
        stickyHeader sx = {
            {
                borderCollapse: "separate",
                borderSpacing: 0,

                "& .MuiTableCell-root": {
                    borderRight: "1px solid rgba(224,224,224,0.8)",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center", // ✅ ALL TEXT CENTER
                    verticalAlign: "middle", // ✅ vertical center
                },

                "& thead .MuiTableCell-root": {
                    fontWeight: 600,
                    borderBottom: "2px solid #cfcfcf",
                    textAlign: "center", // header center fix
                },

                "& .MuiTableCell-root:last-child": {
                    borderRight: "none",
                },

                "& tbody tr:hover": {
                    backgroundColor: "#f5f9ff",
                },
            }
        } >
        <
        TableHead >
        <
        TableRow sx = {
            {
                bgcolor: "#f8fafc"
            }
        } > {
            headers.map((header) => ( <
                TableCell key = {
                    header
                }
                sx = {
                    {
                        bgcolor: "#1976d2",
                        color: "white",
                        py: 1,
                        fontSize: "0.85rem",
                        minWidth: header === "Materials" ?
                            350 :
                            header === "Pole No" ?
                            100 :
                            120,
                        fontWeight: "bold",
                    }
                } >
                {
                    header
                } <
                /TableCell>
            ))
        } <
        /TableRow> <
        /TableHead>

        <
        TableBody > {!selectedLine ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    headers.length
                }
                align = "center"
                sx = {
                    {
                        py: 6
                    }
                } >
                <
                Typography color = "textSecondary" >
                Please select a line to view poles <
                /Typography> <
                /TableCell> <
                /TableRow>
            )

            :
                lineLoading ? ( <
                    TableRow >
                    <
                    TableCell colSpan = {
                        headers.length
                    }
                    align = "center"
                    sx = {
                        {
                            py: 6
                        }
                    } >
                    <
                    CircularProgress size = {
                        28
                    }
                    /> <
                    /TableCell> <
                    /TableRow>
                )


                :
                tabFilteredPoles.length === 0 ? ( <
                    TableRow >
                    <
                    TableCell colSpan = {
                        headers.length
                    }
                    align = "center"
                    sx = {
                        {
                            py: 6
                        }
                    } >
                    <
                    Typography color = "textSecondary" >
                    No poles found
                    for {
                        " "
                    } {
                        tab === "line_pole" ? "Line Pole" : "Cut Pole"
                    }
                    type <
                    /Typography> <
                    /TableCell> <
                    /TableRow>
                ) :

                (
                    tabFilteredPoles.map((pole) => {
                        const isEditMode = editRowId === pole.id;
                        const isPoleLocked = !!pole.submitted_l2_at;
                        const displayMaterials = parseMaterials(pole);

                        // Prepare material display data
                        const materialDisplayItems = displayMaterials.map((item) => {
                            const name = typeof item === "string" ? item : item.name;
                            const qty = typeof item === "object" ? item.quantity : 1;
                            const info = uniqueMaterialOptions.find(
                                (m) => m.value === name,
                            );
                            return {
                                label: info ? .label || name,
                                quantity: qty,
                                unit: info ? .unit || "Nos",
                                displayText: `${info?.label || name} × ${qty}`,
                            };
                        });

                        // Tooltip text for all materials
                        const tooltipText = materialDisplayItems
                            .map((m) => `${m.label} × ${m.quantity} ${m.unit}`)
                            .join("\n");

                        return ( <
                            TableRow key = {
                                pole.id
                            }
                            sx = {
                                {
                                    height: 45,

                                    bgcolor: isEditMode ?
                                        "#fff3e0" :
                                        isPoleLocked ?
                                        "#f3f3f3" :
                                        "#fff",

                                    opacity: isPoleLocked ? 0.65 : 1,
                                    pointerEvents: isPoleLocked ? "none" : "auto",
                                }
                            } >
                            {
                                headers.map((header) => {
                                    // Action Column
                                    if (header === "Action") {
                                        return ( <
                                            TableCell key = {
                                                header
                                            }
                                            align = "center"
                                            sx = {
                                                {
                                                    py: 1,
                                                    minWidth: 180,
                                                    width: 180,
                                                    whiteSpace: "nowrap",
                                                }
                                            } >
                                            {
                                                isEditMode ? ( <
                                                    >
                                                    <
                                                    Tooltip title = "Save" >
                                                    <
                                                    IconButton color = "success"
                                                    onClick = {
                                                        () => handleSaveClick(pole)
                                                    }
                                                    size = "small"
                                                    disabled = {
                                                        loading
                                                    } >
                                                    {
                                                        loading ? ( <
                                                            CircularProgress size = {
                                                                18
                                                            }
                                                            />
                                                        ) : ( <
                                                            SaveIcon fontSize = "small" / >
                                                        )
                                                    } <
                                                    /IconButton> <
                                                    /Tooltip> <
                                                    Tooltip title = "Cancel" >
                                                    <
                                                    IconButton color = "default"
                                                    onClick = {
                                                        handleCancelClick
                                                    }
                                                    size = "small"
                                                    disabled = {
                                                        loading
                                                    } >
                                                    <
                                                    CancelIcon fontSize = "small" / >
                                                    <
                                                    /IconButton> <
                                                    /Tooltip> <
                                                    />
                                                ) : ( <
                                                    >
                                                    <
                                                    Tooltip title = "Edit" >
                                                    <
                                                    IconButton color = "primary"
                                                    onClick = {
                                                        () => handleEditClick(pole)
                                                    }
                                                    size = "small"
                                                    // disabled={isPoleLocked}
                                                    >
                                                    <
                                                    EditIcon fontSize = "small" / >
                                                    <
                                                    /IconButton> <
                                                    /Tooltip>

                                                    { /* ✅ Bulk selection checkbox - Action column ke andar */ } {
                                                        bulkMode && ( <
                                                            Checkbox size = "small"
                                                            checked = {
                                                                bulkSendSelection.includes(
                                                                    pole.id,
                                                                )
                                                            }
                                                            onChange = {
                                                                () =>
                                                                handleBulkSendToggle(pole)
                                                            }
                                                            disabled = {!pole.id ||
                                                                !pole.saved_l2_at ||
                                                                pole.submitted_l2_at ||
                                                                pole.approved_l2_at ||
                                                                editRowId === pole.id
                                                            }
                                                            />
                                                        )
                                                    }


                                                    {
                                                        pole.approved_l2_at ? ( <
                                                            Button size = "small"
                                                            color = "success"
                                                            variant = "contained"
                                                            disabled
                                                            // sx={{ ml: 1 }}
                                                            sx = {
                                                                {
                                                                    bgcolor: "success.main",
                                                                    color: "#fff",
                                                                    "&.Mui-disabled": {
                                                                        bgcolor: "success.main", // Green background even when disabled
                                                                        color: "#fff", // White text
                                                                        opacity: 1, // Remove default faded look
                                                                    },
                                                                }
                                                            } >
                                                            Approved <
                                                            /Button>
                                                        ) : pole.submitted_l2_at ? ( <
                                                            Button size = "small"
                                                            color = "info"
                                                            variant = "contained"
                                                            disabled sx = {
                                                                {
                                                                    ml: 1
                                                                }
                                                            } >
                                                            Submitted <
                                                            /Button>
                                                        ) : ( <
                                                            Button size = "small"
                                                            color = "primary"
                                                            variant = "contained"
                                                            onClick = {
                                                                () => handlePoleApproval(pole)
                                                            }
                                                            disabled = {
                                                                (patchLoading &&
                                                                    sendingId === pole.id) ||
                                                                !pole.id ||
                                                                !pole.saved_l2_at ||
                                                                pole.submitted_l2_at ||
                                                                editRowId === pole.id
                                                            }
                                                            startIcon = {
                                                                patchLoading &&
                                                                sendingId === pole.id ? ( <
                                                                    CircularProgress size = {
                                                                        16
                                                                    }
                                                                    color = "inherit" /
                                                                    >
                                                                ) : ( <
                                                                    SendIcon / >
                                                                )
                                                            }
                                                            sx = {
                                                                {
                                                                    ml: 1
                                                                }
                                                            } >
                                                            {
                                                                patchLoading && sendingId === pole.id ?
                                                                "Sending..." :
                                                                    "Send"
                                                            } <
                                                            /Button>
                                                        )
                                                    } <
                                                    />
                                                )
                                            } <
                                            /TableCell>
                                        );
                                    }

                                    // Photo Column
                                    if (header === "Photo") {
                                        const existingPhoto = pole.fab_mounting_photo;

                                        return ( <
                                            TableCell key = {
                                                header
                                            }
                                            sx = {
                                                {
                                                    py: 1
                                                }
                                            } > {
                                                isEditMode ? ( <
                                                    Box >
                                                    <
                                                    Button component = "label"
                                                    size = "small"
                                                    variant = "outlined"
                                                    startIcon = { <
                                                        CloudUploadIcon sx = {
                                                            {
                                                                fontSize: 16
                                                            }
                                                        }
                                                        />
                                                    }
                                                    sx = {
                                                        {
                                                            textTransform: "none",
                                                            fontSize: "0.7rem",
                                                            border: errors.photo ?
                                                                "1px solid red" :
                                                                "",
                                                            color: errors.photo ? "red" : "",
                                                        }
                                                    } >
                                                    Upload <
                                                    input type = "file"
                                                    hidden accept = "image/*"
                                                    onChange = {
                                                        (e) => {
                                                            if (e.target.files[0])
                                                                handleFileChange(e.target.files[0]);
                                                        }
                                                    }
                                                    /> <
                                                    /Button> {
                                                        selectedFile && ( <
                                                            Typography variant = "caption"
                                                            sx = {
                                                                {
                                                                    display: "block",
                                                                    mt: 0.5,
                                                                    color: "green",
                                                                }
                                                            } >
                                                            New: {
                                                                selectedFile.name
                                                            } <
                                                            /Typography>
                                                        )
                                                    } {
                                                        !selectedFile &&
                                                            existingPhoto &&
                                                            existingPhoto !== "null" && ( <
                                                                Typography variant = "caption"
                                                                sx = {
                                                                    {
                                                                        display: "block",
                                                                        mt: 0.5,
                                                                        color: "blue",
                                                                    }
                                                                } >
                                                                Current: {
                                                                    " "
                                                                } {
                                                                    typeof existingPhoto === "string" ?
                                                                        existingPhoto.split("/").pop() :
                                                                        "Photo exists"
                                                                } <
                                                                /Typography>
                                                            )
                                                    } <
                                                    /Box>
                                                ) : existingPhoto && existingPhoto !== "null" ? ( <
                                                    Typography variant = "caption"
                                                    sx = {
                                                        {
                                                            color: "green"
                                                        }
                                                    }
                                                    noWrap >
                                                    📷{
                                                        " "
                                                    } {
                                                        typeof existingPhoto === "string" ?
                                                            existingPhoto.split("/").pop() :
                                                            "Photo"
                                                    } <
                                                    /Typography>
                                                ) : ( <
                                                    Typography variant = "caption"
                                                    color = "textSecondary" >
                                                    No photo <
                                                    /Typography>
                                                )
                                            } <
                                            /TableCell>
                                        );
                                    }

                                    // Pole Number
                                    if (header === "Pole No") {
                                        return ( <
                                            TableCell key = {
                                                header
                                            }
                                            sx = {
                                                {
                                                    fontWeight: "bold",
                                                    fontSize: "0.8rem"
                                                }
                                            } >
                                            {
                                                pole ? .pole_number ? ( <
                                                    >
                                                    P {
                                                        pole.pole_number
                                                            .toString()
                                                            .replace(/^p/i, "")
                                                    } <
                                                    span style = {
                                                        {
                                                            fontSize: "0.7rem",
                                                            fontWeight: "normal",
                                                        }
                                                    } >
                                                    ({
                                                        pole.pole_type ?
                                                        .replace("_", " ")
                                                        .toLowerCase()
                                                    }) <
                                                    /span> <
                                                    />
                                                ) : (
                                                    "-"
                                                )
                                            } <
                                            /TableCell>
                                        );
                                    }

                                    // Materials Column - Option 3 + 4: First 3 Chips + More + Tooltip
                                    if (header === "Materials") {
                                        return ( <
                                            TableCell key = {
                                                header
                                            }
                                            sx = {
                                                {
                                                    py: 1,
                                                    minWidth: 350
                                                }
                                            } >
                                            {
                                                isEditMode ? ( <
                                                    Box > { /* Material Selection */ } {
                                                        /* <Autocomplete
                                                                                            multiple
                                                                                            size="small"
                                                                                            options={uniqueMaterialOptions}
                                                                                            value={uniqueMaterialOptions.filter(
                                                                                              (option) =>
                                                                                                (editData.materials || []).includes(
                                                                                                  option.value,
                                                                                                ),
                                                                                            )}
                                                                                            onChange={(e, newValue) =>
                                                                                              handleMaterialSelect(newValue)
                                                                                            }
                                                                                            getOptionLabel={(option) =>
                                                                                              `${option.label} (${option.quantity} ${option.unit})`
                                                                                            }
                                                                                            renderInput={(params) => (
                                                                                              <TextField
                                                                                                {...params}
                                                                                                size="small"
                                                                                                placeholder="Select materials..."
                                                                                                error={!!errors.materials}
                                                                                                helperText={errors.materials}
                                                                                              />
                                                                                            )}
                                                                                            renderTags={(value, getTagProps) =>
                                                                                              value.map((option, index) => (
                                                                                                <Chip
                                                                                                  key={index}
                                                                                                  label={option.label}
                                                                                                  size="small"
                                                                                                  {...getTagProps({ index })}
                                                                                                />
                                                                                              ))
                                                                                            }
                                                                                            disabled={loading}
                                                                                            fullWidth
                                                                                          /> */
                                                    }


                                                    <
                                                    Autocomplete multiple size = "small"
                                                    options = {
                                                        materialOptionsWithSelectAll
                                                    }
                                                    value = {
                                                        uniqueMaterialOptions.filter((option) =>
                                                            (editData.materials || []).includes(option.value)
                                                        )
                                                    }
                                                    onChange = {
                                                        (e, newValue) => {
                                                            const clickedSelectAll = newValue.some(
                                                                (item) => item.value === "__SELECT_ALL__"
                                                            );

                                                            if (clickedSelectAll) {
                                                                const allSelected =
                                                                    (editData.materials || []).length === uniqueMaterialOptions.length;

                                                                if (allSelected) {
                                                                    // Unselect all
                                                                    handleMaterialSelect([]);
                                                                } else {
                                                                    // Select all
                                                                    handleMaterialSelect(uniqueMaterialOptions);
                                                                }

                                                                return;
                                                            }

                                                            handleMaterialSelect(newValue);
                                                        }
                                                    }
                                                    getOptionLabel = {
                                                        (option) => {
                                                            if (option.isSelectAll) {
                                                                return "Select All Materials";
                                                            }

                                                            return `${option.label} (${option.quantity} ${option.unit})`;
                                                        }
                                                    }
                                                    isOptionEqualToValue = {
                                                        (option, value) =>
                                                        option.value === value.value
                                                    }
                                                    renderOption = {
                                                        (props, option) => {
                                                            if (option.isSelectAll) {
                                                                const allSelected =
                                                                    (editData.materials || []).length === uniqueMaterialOptions.length;

                                                                return ( <
                                                                    li { ...props
                                                                    } >
                                                                    <
                                                                    Checkbox size = "small"
                                                                    checked = {
                                                                        allSelected
                                                                    }
                                                                    indeterminate = {
                                                                        (editData.materials || []).length > 0 &&
                                                                        (editData.materials || []).length <
                                                                        uniqueMaterialOptions.length
                                                                    }
                                                                    />

                                                                    <
                                                                    Typography fontWeight = {
                                                                        600
                                                                    } > {
                                                                        allSelected ? "Unselect All Materials" : "Select All Materials"
                                                                    } <
                                                                    /Typography> <
                                                                    /li>
                                                                );
                                                            }

                                                            const selected = (editData.materials || []).includes(option.value);

                                                            return ( <
                                                                li { ...props
                                                                } >
                                                                <
                                                                Checkbox size = "small"
                                                                checked = {
                                                                    selected
                                                                }
                                                                /> <
                                                                Box >
                                                                <
                                                                Typography variant = "body2" > {
                                                                    option.label
                                                                } <
                                                                /Typography>

                                                                <
                                                                Typography variant = "caption"
                                                                color = "text.secondary" >
                                                                {
                                                                    option.quantity
                                                                } {
                                                                    option.unit
                                                                } <
                                                                /Typography> <
                                                                /Box> <
                                                                /li>
                                                            );
                                                        }
                                                    }
                                                    renderInput = {
                                                        (params) => ( <
                                                            TextField { ...params
                                                            }
                                                            size = "small"
                                                            placeholder = "Select materials..."
                                                            error = {!!errors.materials
                                                            }
                                                            helperText = {
                                                                errors.materials
                                                            }
                                                            />
                                                        )
                                                    }
                                                    renderTags = {
                                                        (value, getTagProps) =>
                                                        value.map((option, index) => ( <
                                                            Chip key = {
                                                                option.value
                                                            }
                                                            label = {
                                                                option.label
                                                            }
                                                            size = "small" { ...getTagProps({
                                                                    index
                                                                })
                                                            }
                                                            />
                                                        ))
                                                    }
                                                    disabled = {
                                                        loading
                                                    }
                                                    fullWidth /
                                                    >

                                                    { /* Quantity Controls */ } {
                                                        editData.materials &&
                                                            editData.materials.length > 0 && ( <
                                                                Stack direction = "row"
                                                                spacing = {
                                                                    1
                                                                }
                                                                sx = {
                                                                    {
                                                                        mt: 1,
                                                                        flexWrap: "wrap"
                                                                    }
                                                                } >
                                                                {
                                                                    editData.materials.map((material) => {
                                                                        const info =
                                                                            uniqueMaterialOptions.find(
                                                                                (m) => m.value === material,
                                                                            );
                                                                        const qty =
                                                                            editData.materialQuantities ? .[
                                                                                material
                                                                            ] || 1;
                                                                        return ( <
                                                                            Chip key = {
                                                                                material
                                                                            }
                                                                            label = { <
                                                                                Box
                                                                                sx = {
                                                                                    {
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        gap: 0.5,
                                                                                    }
                                                                                } >
                                                                                <
                                                                                span > {
                                                                                    info ? .label || material
                                                                                } <
                                                                                /span> <
                                                                                IconButton
                                                                                size = "small"
                                                                                onClick = {
                                                                                    () =>
                                                                                    handleQuantityChange(
                                                                                        material, -1,
                                                                                    )
                                                                                }
                                                                                disabled = {
                                                                                    qty <= 0 || loading
                                                                                }
                                                                                sx = {
                                                                                    {
                                                                                        p: 0,
                                                                                        m: 0,
                                                                                        width: 18,
                                                                                        height: 18,
                                                                                    }
                                                                                } >
                                                                                <
                                                                                RemoveIcon
                                                                                sx = {
                                                                                    {
                                                                                        fontSize: 14
                                                                                    }
                                                                                }
                                                                                /> <
                                                                                /IconButton> <
                                                                                TextField
                                                                                type = "number"
                                                                                size = "small"
                                                                                value = {
                                                                                    qty
                                                                                }
                                                                                onChange = {
                                                                                    (e) => {
                                                                                        const val = parseInt(
                                                                                            e.target.value,
                                                                                        );
                                                                                        if (!isNaN(val) &&
                                                                                            val >= 0
                                                                                        ) {
                                                                                            setEditData((prev) => ({
                                                                                                ...prev,
                                                                                                materialQuantities: {
                                                                                                    ...prev.materialQuantities,
                                                                                                    [material]: val,
                                                                                                },
                                                                                            }));
                                                                                        }
                                                                                    }
                                                                                }
                                                                                inputProps = {
                                                                                    {
                                                                                        style: {
                                                                                            width: "35px",
                                                                                            padding: "2px",
                                                                                            textAlign: "center",
                                                                                            fontSize: "0.75rem",
                                                                                        },
                                                                                        min: 0,
                                                                                    }
                                                                                }
                                                                                variant = "outlined"
                                                                                size = "small"
                                                                                disabled = {
                                                                                    loading
                                                                                }
                                                                                /> <
                                                                                IconButton
                                                                                size = "small"
                                                                                onClick = {
                                                                                    () =>
                                                                                    handleQuantityChange(
                                                                                        material,
                                                                                        1,
                                                                                    )
                                                                                }
                                                                                disabled = {
                                                                                    loading
                                                                                }
                                                                                sx = {
                                                                                    {
                                                                                        p: 0,
                                                                                        m: 0,
                                                                                        width: 18,
                                                                                        height: 18,
                                                                                    }
                                                                                } >
                                                                                <
                                                                                AddIcon
                                                                                sx = {
                                                                                    {
                                                                                        fontSize: 14
                                                                                    }
                                                                                }
                                                                                /> <
                                                                                /IconButton> <
                                                                                span
                                                                                style = {
                                                                                    {
                                                                                        fontSize: "0.65rem",
                                                                                        color: "#666",
                                                                                    }
                                                                                } >
                                                                                {
                                                                                    info ? .unit || "Nos"
                                                                                } <
                                                                                /span> <
                                                                                /Box>
                                                                            }
                                                                            sx = {
                                                                                {
                                                                                    height: "auto",
                                                                                    py: 0.5,
                                                                                    bgcolor: alpha("#1976d2", 0.08),
                                                                                    "& .MuiChip-label": {
                                                                                        px: 0.5
                                                                                    },
                                                                                }
                                                                            }
                                                                            />
                                                                        );
                                                                    })
                                                                } <
                                                                /Stack>
                                                            )
                                                    } <
                                                    /Box>
                                                ) : // Display Mode - Option 3 + 4: First 3 Chips + More + Tooltip
                                                    materialDisplayItems.length > 0 ? ( <
                                                        Tooltip title = {
                                                            tooltipText
                                                        }
                                                        placement = "top"
                                                        arrow >
                                                        <
                                                        Box sx = {
                                                            {
                                                                display: "flex",
                                                                gap: 0.5,
                                                                flexWrap: "nowrap",
                                                                alignItems: "center",
                                                            }
                                                        } >
                                                        { /* First 3 Chips */ } {
                                                            materialDisplayItems
                                                                .slice(0, 3)
                                                                .map((item, idx) => ( <
                                                                    Chip key = {
                                                                        idx
                                                                    }
                                                                    label = {
                                                                        item.displayText
                                                                    }
                                                                    size = "small"
                                                                    variant = "outlined"
                                                                    sx = {
                                                                        {
                                                                            fontSize: "0.7rem",
                                                                            height: 22,
                                                                        }
                                                                    }
                                                                    />
                                                                ))
                                                        }

                                                        { /* More Chip if more than 3 materials */ } {
                                                            materialDisplayItems.length > 3 && ( <
                                                                Chip label = {
                                                                    `+${materialDisplayItems.length - 3} More`
                                                                }
                                                                size = "small"
                                                                color = "primary"
                                                                sx = {
                                                                    {
                                                                        fontSize: "0.7rem",
                                                                        height: 22,
                                                                        fontWeight: 500,
                                                                    }
                                                                }
                                                                />
                                                            )
                                                        } <
                                                        /Box> <
                                                        /Tooltip>
                                                    ) : ( <
                                                        Typography variant = "caption"
                                                        color = "textSecondary" >
                                                        No materials <
                                                        /Typography>
                                                    )
                                            } <
                                            /TableCell>
                                        );
                                    }

                                    // Date Column
                                    if (header === "Fab Mounting Date") {
                                        const value = isEditMode ?
                                            editData[header] || getToday() :
                                            pole.fab_mounting_date || getToday();

                                        return ( <
                                            TableCell key = {
                                                header
                                            }
                                            sx = {
                                                {
                                                    py: 1
                                                }
                                            } >
                                            <
                                            TextField type = "date"
                                            variant = "standard"
                                            size = "small"
                                            fullWidth disabled = {!isEditMode || loading
                                            }
                                            value = {
                                                value
                                            }
                                            error = {!!errors["Fab Mounting Date"]
                                            }
                                            inputProps = {
                                                {
                                                    min: getMinDate(),
                                                    max: getToday(),
                                                }
                                            }
                                            onChange = {
                                                (e) =>
                                                handleInputChange(header, e.target.value)
                                            }
                                            InputProps = {
                                                {
                                                    disableUnderline: !isEditMode,
                                                    sx: {
                                                        fontSize: "0.8rem"
                                                    },
                                                }
                                            }
                                            /> <
                                            /TableCell>
                                        );
                                    }

                                    return null;
                                })
                            } <
                            /TableRow>
                        );
                    })
                )
        } <
        /TableBody> <
        /Table> <
        /Paper> <
        /Box> <
        /Container>
    );
};

export default DynamicPoleTable;