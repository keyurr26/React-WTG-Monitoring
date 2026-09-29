import React, {
    useState,
    useMemo
} from "react";
import {
    Paper,
    Typography,
    Box,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import {
    DataGrid
} from "@mui/x-data-grid";
import {
    styled
} from "@mui/material/styles";
import MaterialAgingDashboard from "./MaterialAgingDashboard";



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

const MaterialAgingBucketChart = ({
    data
}) => {
    const [viewType, setViewType] = useState("table");
    const rows = useMemo(() => {

        const map = {};

        data.forEach(item => {
            const project = item.project_name;
            const windfarm = item.windfarm_name;
            const name = item.material_name;
            const qty = Number(item.balance_qty || 0);
            const days = Number(item.aging_days || 0);

            if (!map[name]) {
                map[name] = {
                    id: name,
                    project_name: project,
                    windfarm_name: windfarm,
                    material_name: name,
                    age_0_30: 0,
                    age_31_60: 0,
                    age_61_90: 0,
                    age_90_plus: 0,
                    age_120_plus: 0,
                    total_balance: 0
                };
            }

            if (days <= 30) map[name].age_0_30 += qty;
            else if (days <= 60) map[name].age_31_60 += qty;
            else if (days <= 90) map[name].age_61_90 += qty;
            else if (days <= 120) map[name].age_91_120 += qty;
            else map[name].age_120_plus += qty;

            map[name].total_balance += qty;

        });

        return Object.values(map);

    }, [data]);


    const columns = [{
            field: "project_name",
            headerName: "Project",
            flex: 1.5
        },
        {
            field: "windfarm_name",
            headerName: "Windfarm",
            flex: 1.5
        },
        {
            field: "material_name",
            headerName: "Material",
            flex: 1.5
        },

        {
            field: "age_0_30",
            headerName: "0-30 Days",
            flex: 1,
            type: "number"
        },
        {
            field: "age_31_60",
            headerName: "31-60 Days",
            flex: 1,
            type: "number"
        },
        {
            field: "age_61_90",
            headerName: "61-90 Days",
            flex: 1,
            type: "number"
        },
        {
            field: "age_90_plus",
            headerName: "91-120 Days",
            flex: 1,
            type: "number"
        },
        {
            field: "age_120_plus",
            headerName: "> 120 Days",
            flex: 1,
            type: "number"
        },
        {
            field: "total_balance",
            headerName: "Total Balance Qty",
            flex: 1,
            type: "number"
        }
    ];

    return ( <
        Paper sx = {
            {
                p: 2,
                borderRadius: 3
            }
        } > { /* ===== Header Row ===== */ } <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2
            }
        } >
        { /* ⭐ Dynamic Title */ } <
        Typography variant = "h6"
        sx = {
            {
                mb: 2,
                color: '#00416A',
                fontWeight: 'bold',
                borderBottom: '2px solid #1976d2',
                pb: 1
            }
        }

        >
        {
            viewType === "table" ?
            "Material Aging Bucket" :
                "Material Aging Chart"
        } <
        /Typography>




        { /* ⭐ Toggle Buttons */ } <
        ToggleButtonGroup size = "small"
        value = {
            viewType
        }
        exclusive onChange = {
            (e, newValue) => {
                if (newValue) setViewType(newValue);
            }
        }
        sx = {
            {
                background: "#f5f7fa",
                borderRadius: 10,
                p: 0.5,

                "& .MuiToggleButton-root": {
                    border: "none",
                    px: 2,
                    fontWeight: 600
                },

                "& .Mui-selected": {
                    background: "linear-gradient(135deg, #396afc, #00f2fe)",
                    color: "white !important"
                }
            }
        } >

        <
        ToggleButton value = "table"
        sx = {
            {
                borderRadius: 10
            }
        } >
        <
        TableChartIcon sx = {
            {
                mr: 1
            }
        }
        />
        Table <
        /ToggleButton>

        <
        ToggleButton value = "chart"
        sx = {
            {
                borderRadius: 10
            }
        } >
        <
        BarChartIcon sx = {
            {
                mr: 1
            }
        }
        />
        Chart <
        /ToggleButton> <
        /ToggleButtonGroup>

        <
        /Box>


        {
            viewType === "table" ? ( <
                Box sx = {
                    {
                        height: 400
                    }
                } >
                <
                StyledDataGrid rows = {
                    rows
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
                /Box>
            ) : ( <
                MaterialAgingDashboard data = {
                    data
                }
                />
            )
        }

        <
        /Paper>
    );
};

export default MaterialAgingBucketChart;