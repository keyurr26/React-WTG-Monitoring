import React, {
    useState,
    useEffect
} from "react";
import {
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    InputAdornment,
    TableCell,
    TableBody,
    TableContainer,
    TableRow,
    TablePagination,
    TableHead,
    Table,
    MenuItem,
} from "@mui/material";
import {
    GetComponentTypesList
} from "../../../Redux/MasterData/masterAction";
import {
    Search
} from "lucide-react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetWTGMakeModelData,
    CreateWTGMakeModelData,
    DownloadWTGTemplate,
    BulkUploadWTG,
} from "../../../Redux/MasterData/masterAction";

const GEARED_TYPE_OPTIONS = [{
        value: "Geared",
        label: "Geared"
    },
    {
        value: "Direct Drive (Gearless)",
        label: "Direct Drive (Gearless)"
    },
];

const WTGMakeModelMaster = () => {
    const dispatch = useDispatch();

    const {
        WTGMakeModelData = [], componentTypesList = []
    } = useSelector(
        (state) => state.masterData || {},
    );
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [formData, setFormData] = useState({
        wtg_make: "",
        wtg_model: "",
        capacity_mw: "",
        rotor_diameter: "",
        hub_height: "",
        tower_type: "", // Will hold the dropdown value from API
        geared_type: "", // Will hold the static dropdown value
        technology: "",
    });

    const [searchTerm, setSearchTerm] = useState(""); // Search state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        dispatch(GetWTGMakeModelData());
        dispatch(GetComponentTypesList());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const key of Object.keys(formData)) {
            if (
                formData[key] === null ||
                formData[key] === undefined ||
                formData[key].toString().trim() === ""
            ) {
                const formattedLabel = key.replace(/_/g, " ").toUpperCase();
                setSnackbar({
                    open: true,
                    message: `Validation Error: The "${formattedLabel}" field is mandatory.`,
                    severity: "error",
                });
                return;
            }
        }
        const result = await dispatch(CreateWTGMakeModelData(formData));

        setSnackbar({
            open: true,
            message: result.message,
            severity: result.success ? "success" : "error",
        });

        if (result.success) {
            setFormData({
                wtg_make: "",
                wtg_model: "",
                capacity_mw: "",
                rotor_diameter: "",
                hub_height: "",
                tower_type: "",
                geared_type: "",
                technology: "",
            });
            dispatch(GetWTGMakeModelData());
        }
    };

    const columns = [{
            field: "wtg_make",
            label: "WTG Make",
            type: "string"
        },
        {
            field: "wtg_model",
            label: "WTG Model",
            type: "string"
        },
        {
            field: "capacity_mw",
            label: "Capacity (MW)",
            type: "number"
        },
        {
            field: "rotor_diameter",
            label: "Rotor Diameter (m)",
            type: "number"
        },
        {
            field: "hub_height",
            label: "Hub Height (m)",
            type: "number"
        },
        {
            field: "tower_type",
            label: "Tower Type",
            type: "string"
        },
        {
            field: "geared_type",
            label: "Geared Type",
            type: "string"
        },
        {
            field: "technology",
            label: "Technology",
            type: "string"
        },
    ];

    const filteredRows = WTGMakeModelData.filter((row) =>
        Object.values(row || {}).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    ).map((row, index) => ({
        id: index + 1,
        ...row
    }));

    const placeholders = {
        wtg_make: "Ex: Global Wind Systems",
        wtg_model: "Ex: GW-5.2-160",
        capacity_mw: "Ex: 5.2",
        rotor_diameter: "Ex: 160",
        hub_height: "Ex: 120",
        tower_type: "", // Dropdown
        geared_type: "", // Dropdown
        technology: "Ex: DFIG, PMSG, etc.",
    };

    const numericFields = [
        "capacity_mw",
        "rotor_diameter",
        "hub_height",
    ];

    const paginatedRows = filteredRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredTowerTypes = componentTypesList.filter(
        (item) => item.type === "TOWER",
    );

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
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
            }
        } >
        <
        Box >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        WTG Make & Model Form <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        Add or edit WTG make and model information. <
        /Typography> <
        /Box>

        <
        Box sx = {
            {
                display: "flex",
                gap: 2
            }
        } >
        <
        Button variant = "outlined"
        onClick = {
            () => dispatch(DownloadWTGTemplate())
        }
        sx = {
            {
                color: "#00416A",
                borderColor: "#00416A"
            }
        } >
        Template <
        /Button> <
        Button variant = "contained"
        component = "label"
        sx = {
            {
                background: "#00416A"
            }
        } >
        Bulk Upload <
        input type = "file"
        hidden accept = ".xlsx"
        onChange = {
            (e) => dispatch(BulkUploadWTG(e.target.files[0]))
        }
        /> <
        /Button> <
        /Box> <
        /Box>

        <
        form onSubmit = {
            handleSubmit
        } >
        <
        Grid container spacing = {
            2
        } > {
            Object.keys(formData).map((key) => {
                const isGearedType = key === "geared_type";
                const isTowerType = key === "tower_type";
                const isDropdown = isGearedType || isTowerType;
                const isNumber = numericFields.includes(key);

                return ( <
                    Grid item xs = {
                        12
                    }
                    sm = {
                        3
                    }
                    key = {
                        key
                    } >
                    <
                    TextField required select = {
                        isDropdown
                    }
                    type = {
                        isNumber ? "number" : "text"
                    }
                    fullWidth label = {
                        key.replace(/_/g, " ").toUpperCase()
                    }
                    name = {
                        key
                    }
                    value = {
                        formData[key]
                    }
                    onChange = {
                        handleChange
                    }
                    placeholder = {!isDropdown ? placeholders[key] : undefined
                    }
                    InputLabelProps = {
                        {
                            shrink: true
                        }
                    }
                    inputProps = {
                        isNumber ? {
                            min: 0,
                            step: "any"
                        } : undefined
                    }
                    SelectProps = {
                        isDropdown ? {
                            displayEmpty: true
                        } : undefined
                    } >
                    { /* 1. Handle Geared Type Dropdown */ } {
                        isGearedType && [ <
                            MenuItem key = "placeholder-geared"
                            value = ""
                            disabled >
                            <
                            em > --Select Geared Type-- < /em> <
                            /MenuItem>,
                            ...GEARED_TYPE_OPTIONS.map((opt) => ( <
                                MenuItem key = {
                                    opt.value
                                }
                                value = {
                                    opt.value
                                } > {
                                    opt.label
                                } <
                                /MenuItem>
                            )),
                        ]
                    }

                    { /* 2. ✅ Handle Tower Type API-Driven Dropdown */ } {
                        isTowerType && [ <
                            MenuItem key = "placeholder-tower"
                            value = ""
                            disabled >
                            <
                            em > --Select Tower Type-- < /em> <
                            /MenuItem>,
                            ...filteredTowerTypes.map((tower) => ( <
                                MenuItem key = {
                                    tower.id || tower.name
                                }
                                value = {
                                    tower.label
                                } >
                                {
                                    tower.label
                                } <
                                /MenuItem>
                            )),
                        ]
                    } <
                    /TextField> <
                    /Grid>
                );
            })
        } <
        /Grid> <
        Box sx = {
            {
                mt: 3,
                textAlign: "center"
            }
        } >
        <
        Button type = "submit"
        variant = "contained"
        sx = {
            {
                background: "#00416A",
                px: 4
            }
        } >
        Submit <
        /Button> <
        /Box> <
        /form> <
        /Paper>

        { /* List Section with Search */ } <
        Paper sx = {
            {
                mt: 3,
                p: 3,
                borderRadius: 2,
                border: "1px solid #00416A"
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
        WTG Make & Model List <
        /Typography>

        <
        TextField size = "small"
        placeholder = "Search Make or Model..."
        value = {
            searchTerm
        }
        onChange = {
            (e) => setSearchTerm(e.target.value)
        }
        sx = {
            {
                width: 300
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
                    /> <
                    /InputAdornment>
                ),
            }
        }
        /> <
        /Box>

        { /* ENHANCED MUI TABLE */ } <
        TableContainer sx = {
            {
                maxHeight: 500
            }
        } >
        <
        Table stickyHeader sx = {
            {
                minWidth: 1200
            }
        }
        size = "small"
        aria - label = "windfarm table" >
        <
        TableHead >
        <
        TableRow >
        <
        TableCell sx = {
            {
                fontWeight: "bold",
                backgroundColor: "#0f52ba",
                color: "#fff",
            }
        } >
        Sr No <
        /TableCell> {
            columns.map((col) => ( <
                TableCell key = {
                    col.field
                }
                align = {
                    col.type === "number" ? "right" : "left"
                }
                sx = {
                    {
                        fontWeight: "bold",
                        color: "#fff",
                        backgroundColor: "#0f52ba",
                    }
                } >
                {
                    col.label
                } <
                /TableCell>
            ))
        } <
        /TableRow> <
        /TableHead>

        <
        TableBody > {
            paginatedRows.length > 0 ? (
                paginatedRows.map((row, index) => ( <
                    TableRow key = {
                        index
                    }
                    hover sx = {
                        {
                            "&:last-child td, &:last-child th": {
                                border: 0
                            }
                        }
                    } >
                    <
                    TableCell > {
                        page * rowsPerPage + index + 1
                    } < /TableCell> {
                        columns.map((col) => ( <
                            TableCell key = {
                                col.field
                            }
                            align = {
                                col.type === "number" ? "right" : "left"
                            } >
                            {
                                row[col.field] !== undefined && row[col.field] !== "" ?
                                row[col.field] :
                                    "-"
                            } <
                            /TableCell>
                        ))
                    } <
                    /TableRow>
                ))
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    columns.length + 1
                }
                align = "center"
                sx = {
                    {
                        py: 3
                    }
                } >
                <
                Typography variant = "body1"
                color = "textSecondary" >
                No Data Found <
                /Typography> <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        { /* PAGINATION */ } <
        TablePagination component = "div"
        count = {
            filteredRows.length
        }
        page = {
            page
        }
        rowsPerPage = {
            rowsPerPage
        }
        onPageChange = {
            handleChangePage
        }
        onRowsPerPageChange = {
            handleChangeRowsPerPage
        }
        rowsPerPageOptions = {
            [5, 10, 20, 50]
        }
        />

        <
        Snackbar open = {
            snackbar.open
        }
        autoHideDuration = {
            4000
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        } >
        <
        Alert severity = {
            snackbar.severity
        }
        variant = "filled" > {
            snackbar.message
        } <
        /Alert> <
        /Snackbar> <
        /Paper> <
        />
    );
};

export default WTGMakeModelMaster;