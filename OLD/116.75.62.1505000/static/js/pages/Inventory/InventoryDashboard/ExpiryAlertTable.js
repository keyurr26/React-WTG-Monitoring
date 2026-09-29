import React from "react";
import {
    Paper,
    Typography
} from "@mui/material";
import {
    DataGrid
} from "@mui/x-data-grid";
import {
    styled
} from "@mui/material/styles";

const StyledDataGrid = styled(DataGrid)(({
    theme
}) => ({
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
    '& .MuiDataGrid-menuIconButton': {
        color: 'white',
    },
    '& .MuiDataGrid-columnHeader:focus': {
        outline: 'none',
    },
    '& .MuiDataGrid-cell:focus': {
        outline: 'none',
    },
}));

const ExpiryAlertTable = ({
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
            field: "expiry_date",
            headerName: "Expiry Date",
            flex: 1
        },
        {
            field: "balance_qty",
            headerName: "Balance Qty",
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
        },
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
        Expiry Alerts <
        /Typography>

        <
        div style = {
            {
                height: 350
            }
        } >
        <
        StyledDataGrid rows = {
            data.map((r, i) => ({
                id: i,
                ...r
            }))
        }
        columns = {
            columns
        }
        disableColumnMenu disableRowSelectionOnClick hideFooterSelectedRowCount pageSizeOptions = {
            [5, 10, 25]
        }
        initialState = {
            {
                pagination: {
                    paginationModel: {
                        pageSize: 5
                    }
                },
            }
        }
        sx = {
            {
                '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #e0e0e0',
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f5f5f5',
                },
            }
        }
        /> <
        /div> <
        /Paper>
    );
};

export default ExpiryAlertTable;