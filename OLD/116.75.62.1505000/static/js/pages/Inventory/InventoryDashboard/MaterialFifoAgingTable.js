import React from "react";
import {
    Box,
    Paper,
    Typography
} from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import {
    DataGrid
} from "@mui/x-data-grid";

const MaterialFifoAgingTable = ({
    data
}) => {

    const columns = [{
            field: "material_name",
            headerName: "Material",
            flex: 1
        },
        {
            field: "project_name",
            headerName: "Project",
            flex: 1
        },
        {
            field: "windfarm_name",
            headerName: "Windfarm",
            flex: 1
        },
        {
            field: "grn",
            headerName: "GRN",
            flex: 1
        },
        {
            field: "batch_qty",
            headerName: "Batch Qty",
            flex: 1
        },
        {
            field: "balance_qty",
            headerName: "Balance Qty",
            flex: 1
        },

        {
            field: "aging_days",
            headerName: "Aging (Days)",
            flex: 1
        },

        {
            field: "expiry_status",
            headerName: "Expiry Status",
            flex: 1,
            renderCell: (params) => {

                let color = "green";

                if (params.value === "Near Expiry") color = "orange";
                if (params.value === "Expired") color = "red";

                return ( <
                    Typography sx = {
                        {
                            color,
                            fontWeight: 600
                        }
                    } > {
                        params.value
                    } <
                    /Typography>
                );
            }
        }
    ];

    return ( <
        Paper sx = {
            {
                p: 2,
                borderRadius: 3
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                mb: 2,
                color: '#00416A',
                fontWeight: 'bold',
                borderBottom: '2px solid #1976d2',
                pb: 1


            }
        } >
        FIFO Batch Aging <
        /Typography>

        <
        Box sx = {
            {
                height: 400
            }
        } >
        <
        DataGrid rows = {
            data.map((row, index) => ({
                id: index,
                ...row
            }))
        }
        columns = {
            columns
        }
        pageSize = {
            5
        }
        sx = {
            {
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    color: 'white',
                    fontWeight: 'bold',
                },
                '& .MuiDataGrid-iconSeparator': {
                    color: 'white',
                },
                '& .MuiDataGrid-sortIcon': {
                    color: 'white',
                },
                '& .MuiDataGrid-menuIcon': {
                    color: 'white',
                },
                '& .MuiDataGrid-columnHeader:focus': {
                    outline: 'none',
                },
                '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                },
            }
        }
        /> <
        /Box> <
        /Paper>
    );
};

export default MaterialFifoAgingTable;