// components/ClusterMaster.js
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
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Table,
    TableContainer,
    TablePagination,
    Alert,
    InputAdornment, // ✅ Import InputAdornment for the search icon
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";

// ✅ Import Search Icon
import Search from "@mui/icons-material/Search";

import {
    getClusters,
    createBulkClusters,
} from "../../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    ZONE_OPTIONS
} from "../../../constants/choices";
import {
    GetWindFarmMasterData
} from "../../../Redux/MasterData/masterAction";

const ClusterMaster = () => {
    const dispatch = useDispatch();

    /* ---------------- REDUX STATE ---------------- */
    const {
        clusters: existingClusters = [],
        loading
    } = useSelector(
        (state) => state.cardRoad || {}
    );

    const {
        WindfarmData = []
    } = useSelector(
        (state) => state.masterData || {}
    );

    /* ---------------- LOCAL STATE ---------------- */
    const [selectedWindfarmId, setSelectedWindfarmId] = useState("");
    const [clusterCount, setClusterCount] = useState(0);
    const [maxClustersLimit, setMaxClustersLimit] = useState(0);
    const [alreadyCreatedCount, setAlreadyCreatedCount] = useState(0);
    const [bulkClusters, setBulkClusters] = useState([]);

    // ✅ Search State
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    /* ---------------- EFFECTS ---------------- */
    useEffect(() => {
        dispatch(GetWindFarmMasterData());
        dispatch(getClusters());
    }, [dispatch]);

    useEffect(() => {
        if (clusterCount > 0) {
            setBulkClusters(
                Array.from({
                    length: clusterCount
                }, () => ({
                    cluster_name: "",
                    description: "",
                    zone_code: "",
                }))
            );
        } else {
            setBulkClusters([]);
        }
    }, [clusterCount]);

    /* ---------------- HANDLERS ---------------- */
    const handleWindfarmChange = (e) => {
        const windfarmId = Number(e.target.value);
        setSelectedWindfarmId(windfarmId);
        setPage(0); // Reset table page 

        if (!windfarmId) {
            setMaxClustersLimit(0);
            setClusterCount(0);
            setAlreadyCreatedCount(0);
            return;
        }

        const wf = WindfarmData.find((w) => w.id === windfarmId);
        const totalAllowed = wf ? .no_of_clusters || 0;

        const existingCount = existingClusters.filter(
            (c) => c.windfarm === windfarmId
        ).length;

        const remainingSlots = totalAllowed - existingCount;
        const safeRemaining = remainingSlots > 0 ? remainingSlots : 0;

        setAlreadyCreatedCount(existingCount);
        setMaxClustersLimit(safeRemaining);
        setClusterCount(safeRemaining);
    };

    const handleClusterCountChange = (e) => {
        const inputValue = Number(e.target.value);

        if (inputValue < 0) {
            setClusterCount(0);
        } else if (inputValue > maxClustersLimit) {
            setClusterCount(maxClustersLimit);
        } else {
            setClusterCount(inputValue);
        }
    };

    const handleClusterChange = (index, e) => {
        const {
            name,
            value
        } = e.target;
        setBulkClusters((prev) => {
            const copy = [...prev];
            copy[index][name] = value;
            return copy;
        });
    };

    // ✅ Search Input Handler
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0); // Always reset back to page 1 on active typing
    };

    // Pagination Handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedWindfarmId) {
            alert("Please select windfarm");
            return;
        }

        const payload = bulkClusters.map((c) => ({
            windfarm: selectedWindfarmId,
            cluster_name: c.cluster_name,
            zone_code: c.zone_code,
            description: c.description,
        }));

        await dispatch(createBulkClusters(payload));

        setClusterCount(0);
        setMaxClustersLimit(0);
        setAlreadyCreatedCount(0);
        setSelectedWindfarmId("");
        setBulkClusters([]);

        dispatch(getClusters());
    };

    /* ---------------- DATA FILTERING & PAGINATION ---------------- */
    // ✅ Combined Filter: Dropdown selection + Text search box match evaluation
    const filteredClusters = existingClusters.filter((c) => {
        const matchesWindfarm = !selectedWindfarmId || c.windfarm === Number(selectedWindfarmId);

        const matchesSearch = Object.values(c || {}).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

        return matchesWindfarm && matchesSearch;
    });

    const paginatedClusters = filteredClusters.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return ( <
        >
        <
        Paper elevation = {
            1
        }
        sx = {
            {
                p: 2,
                px: 4,
                borderRadius: 2,
                border: "1px solid #00416A"
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A",
                mb: 2
            }
        } >
        Cluster Master(Bulk) <
        /Typography>

        <
        form onSubmit = {
            handleSubmit
        } >
        <
        Grid container spacing = {
            3
        }
        sx = {
            {
                p: 1
            }
        } >
        <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField select label = "Windfarm"
        value = {
            selectedWindfarmId
        }
        onChange = {
            handleWindfarmChange
        }
        fullWidth InputLabelProps = {
            {
                shrink: true
            }
        }
        SelectProps = {
            {
                displayEmpty: true
            }
        }
        required >
        <
        MenuItem value = "" > --All Windfarms-- < /MenuItem> {
            WindfarmData.map((wf) => ( <
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

        {
            selectedWindfarmId && maxClustersLimit > 0 && ( <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                } >
                <
                TextField label = "No Of Clusters to Create"
                type = "number"
                value = {
                    clusterCount
                }
                onChange = {
                    handleClusterCountChange
                }
                fullWidth inputProps = {
                    {
                        min: 0,
                        max: maxClustersLimit,
                    }
                }
                helperText = {
                    `Already created: ${alreadyCreatedCount}. Remaining slots: ${maxClustersLimit}`
                }
                /> <
                /Grid>
            )
        } <
        /Grid>

        {
            selectedWindfarmId && maxClustersLimit === 0 && ( <
                Box sx = {
                    {
                        mx: 2,
                        mb: 2
                    }
                } >
                <
                Alert severity = "warning"
                variant = "outlined" >
                All allowed clusters({
                        alreadyCreatedCount
                    }
                    / {
                        alreadyCreatedCount
                    }) have already been created
                for this windfarm configuration.No additional entry allocations can be mapped. <
                /Alert> <
                /Box>
            )
        }

        {
            bulkClusters.map((cluster, index) => ( <
                Paper key = {
                    index
                }
                sx = {
                    {
                        p: 2,
                        mt: 3,
                        border: "1px dashed #ccc"
                    }
                } >
                <
                Typography sx = {
                    {
                        mb: 2
                    }
                } > Cluster {
                    index + 1
                } < /Typography> <
                Grid container spacing = {
                    2
                } >
                <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                } >
                <
                TextField label = "Cluster Name"
                name = "cluster_name"
                value = {
                    cluster.cluster_name
                }
                onChange = {
                    (e) => handleClusterChange(index, e)
                }
                fullWidth required /
                >
                <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                } >
                <
                TextField select label = "Cluster Zone"
                name = "zone_code"
                value = {
                    cluster.zone_code || ""
                }
                onChange = {
                    (e) => handleClusterChange(index, e)
                }
                fullWidth required InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                SelectProps = {
                    {
                        displayEmpty: true
                    }
                } >
                <
                MenuItem value = "" > --Select Zone-- < /MenuItem> {
                    ZONE_OPTIONS.map((zone) => ( <
                        MenuItem key = {
                            zone.value
                        }
                        value = {
                            zone.value
                        } > {
                            zone.label
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                } >
                <
                TextField label = "Cluster Description"
                name = "description"
                value = {
                    cluster.description
                }
                onChange = {
                    (e) => handleClusterChange(index, e)
                }
                fullWidth /
                >
                <
                /Grid> <
                /Grid> <
                /Paper>
            ))
        }

        {
            bulkClusters.length > 0 && ( <
                Box textAlign = "center"
                mt = {
                    3
                } >
                <
                Button type = "submit"
                size = "small"
                variant = "contained"
                sx = {
                    {
                        textTransform: "none",
                        background: "#00416A"
                    }
                } >
                Save Clusters <
                /Button> <
                /Box>
            )
        } <
        /form> <
        /Paper>

        { /* LIST SECTION */ } <
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
        Box > { /* ✅ Search Layout header wrap matching WTG Component layout style */ } <
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
                color: "#00416A",
                fontWeight: 700
            }
        } >
        Cluster List <
        /Typography>

        <
        TextField size = "small"
        placeholder = "Search..."
        value = {
            searchTerm
        }
        onChange = {
            handleSearchChange
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
                    Search / >
                    <
                    /InputAdornment>
                ),
            }
        }
        /> <
        /Box>

        <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                mt: 1
            }
        } >
        <
        Table size = "small" >
        <
        TableHead sx = {
            {
                background: "#0f52ba"
            }
        } >
        <
        TableRow > {
            [
                "Sr No.",
                "Windfarm",
                "Cluster Name",
                "Cluster Code",
                "Description",
            ].map((head) => ( <
                TableCell key = {
                    head
                }
                sx = {
                    {
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 14
                    }
                } >
                {
                    head
                } <
                /TableCell>
            ))
        } <
        /TableRow> <
        /TableHead> <
        TableBody > {
            paginatedClusters.map((c, index) => ( <
                TableRow key = {
                    c.id
                } >
                <
                TableCell > {
                    page * rowsPerPage + index + 1
                } < /TableCell> <
                TableCell > {
                    c.windfarm_name
                } < /TableCell> <
                TableCell > {
                    c.cluster_name
                } < /TableCell> <
                TableCell > {
                    c.cluster_code
                } < /TableCell> <
                TableCell > {
                    c.description || "-"
                } < /TableCell> <
                /TableRow>
            ))
        } {
            !loading && filteredClusters.length === 0 && ( <
                TableRow >
                <
                TableCell colSpan = {
                    5
                }
                align = "center" >
                No Clusters Found <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25]
        }
        component = "div"
        count = {
            filteredClusters.length
        }
        rowsPerPage = {
            rowsPerPage
        }
        page = {
            page
        }
        onPageChange = {
            handleChangePage
        }
        onRowsPerPageChange = {
            handleChangeRowsPerPage
        }
        /> <
        /Box> <
        /Paper> <
        />
    );
};

export default ClusterMaster;