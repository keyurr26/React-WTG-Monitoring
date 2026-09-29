import React, {
    useEffect
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    getProjectTransfers
} from "../../Redux/MasterData/masterAction";
import {
    DataGrid
} from "@mui/x-data-grid";
import {
    Typography,
    Box
} from "@mui/material";

function MaterialStockTransferTable() {
    const dispatch = useDispatch();

    const {
        projectTransfers = []
    } = useSelector(
        (state) => state.masterData || {}
    );

    useEffect(() => {
        dispatch(getProjectTransfers());
    }, [dispatch]);


    const columns = [{
            field: "id",
            headerName: "ID",
            width: 70
        },
        {
            field: "material_name",
            headerName: "Material",
            width: 150
        },
        {
            field: "source_project_name",
            headerName: "Source Project",
            width: 180
        },
        {
            field: "dest_project_name",
            headerName: "Destination Project",
            width: 180
        },
        {
            field: "source_windfarm_name",
            headerName: "Source Windfarm",
            width: 180
        },
        {
            field: "dest_windfarm_name",
            headerName: "Dest Windfarm",
            width: 180
        },
        {
            field: "transfer_type",
            headerName: "Transfer Type",
            width: 150
        },
        {
            field: "qty",
            headerName: "Qty",
            width: 100
        },
        {
            field: "reason",
            headerName: "Reason",
            width: 200
        },

    ];

    return ( <
        >
        <
        Typography variant = "h6"
        sx = {
            {
                mt: 4,
                fontWeight: 600,
                color: "#00416A",
            }
        } >
        Material Transfer Records <
        /Typography>

        <
        Box sx = {
            {
                width: "100%"
            }
        } >
        <
        DataGrid rows = {
            projectTransfers
        }
        columns = {
            columns
        }
        pageSize = {
            10
        }
        rowsPerPageOptions = {
            [10]
        }
        getRowId = {
            (row) => row.id
        }
        sx = {
            {
                height: 400,
                border: "1px solid #e0e0e0",

                /* FULL HEADER SOLID COLOR */
                "& .MuiDataGrid-columnHeaders": {
                    background: "#00416A", // solid navy blue
                    color: "#fff", // white text
                    fontWeight: "bold",
                },

                /* remove individual column header background to avoid broken look */
                "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "transparent !important",
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                },

                /* optional: column borders & hover effects */
                "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
                    borderRight: "1px solid rgba(255,255,255,0.15)",
                },

                "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f5f9fc",
                },

                "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #e0e0e0",
                },
            }
        }
        /> <
        /Box> <
        />
    );
}

export default MaterialStockTransferTable;