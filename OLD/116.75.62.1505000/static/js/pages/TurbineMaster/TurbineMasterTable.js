// src/pages/TurbineMasterTable.jsx

import React, {
    useEffect,
    useMemo,
    useState
} from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment
} from "@mui/material";
import {
    DataGrid
} from "@mui/x-data-grid";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    getTurbineLocations
} from "../../Redux/TurbineMasterData/turbineAction";

// ✅ Import Search Icon
import SearchIcon from "@mui/icons-material/Search";

function TurbineMasterTable({
    selectedProject,
    selectedWindfarm,
    selectedCluster,
}) {
    const dispatch = useDispatch();

    /* ---------------- REDUX STATE ---------------- */
    const {
        turbineLocations = [], loading
    } = useSelector(
        (state) => state.turbineData || {},
    );

    /* ---------------- LOCAL STATE ---------------- */
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ Track pagination model state for modern DataGrid
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    useEffect(() => {
        dispatch(getTurbineLocations());
    }, [dispatch]);

    /* 🔹 Apply Filters & Global Search */
    const filteredRows = useMemo(() => {
        return turbineLocations.filter((row) => {
            // Dropdown Project Filter
            const projectMatch = selectedProject ?
                row.project === Number(selectedProject) :
                true;

            // Dropdown Windfarm Filter
            const windfarmMatch = selectedWindfarm ?
                row.windfarm === Number(selectedWindfarm) :
                true;

            // Dropdown Cluster Filter
            const clusterMatch = selectedCluster ?
                row.cluster === Number(selectedCluster) :
                true;

            // ✅ Global Text Search Field Filter
            const matchesSearch = Object.values(row || {}).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase()),
            );

            return projectMatch && windfarmMatch && clusterMatch && matchesSearch;
        });
    }, [
        turbineLocations,
        selectedProject,
        selectedWindfarm,
        selectedCluster,
        searchTerm,
    ]);

    const columns = [{
            field: "id",
            headerName: "ID",
            width: 70
        },
        {
            field: "project_name",
            headerName: "Project",
            width: 160
        },
        {
            field: "windfarm_name",
            headerName: "Windfarm",
            width: 160
        },
        {
            field: "cluster_code",
            headerName: "Cluster",
            width: 120
        },
        {
            field: "location_no",
            headerName: "Location No",
            width: 130
        },
        {
            field: "survey_no",
            headerName: "Survey No",
            width: 120
        },
        {
            field: "address",
            headerName: "Village",
            width: 220
        },
        {
            field: "wtg_make",
            headerName: "WTG Make",
            width: 120
        },
        {
            field: "turbine_model_planned",
            headerName: "WTG Model",
            width: 150
        },
        {
            field: "wtg_capacity_mw",
            headerName: "Capacity (MW)",
            width: 140
        },
    ];

    return ( <
        Box mt = {
            1
        } > { /* ✅ Flex layout header matching your application layout pattern */ } <
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
        Turbine Master List <
        /Typography>

        { /* ✅ Added Global Search Input */ } <
        TextField size = "small"
        placeholder = "Search..."
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
                    SearchIcon / >
                    <
                    /InputAdornment>
                ),
            }
        }
        /> <
        /Box>

        { /* ✅ DataGrid Container Box */ } <
        Box sx = {
            {
                height: 500,
                width: "100%"
            }
        } >
        <
        DataGrid rows = {
            filteredRows
        }
        columns = {
            columns
        }
        loading = {
            loading
        }
        // ✅ Updated Pagination Configuration
        paginationModel = {
            paginationModel
        }
        onPaginationModelChange = {
            setPaginationModel
        }
        pageSizeOptions = {
            [10, 20, 50]
        }
        disableRowSelectionOnClick sx = {
            {
                border: "1px solid #00416A",
                "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#0f52ba",
                    color: "#fff",
                    fontWeight: "bold",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                },
            }
        }
        /> <
        /Box> <
        /Box>
    );
}

export default TurbineMasterTable;