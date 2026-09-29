import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    DataGrid
} from "@mui/x-data-grid";
import {
    Paper,
    Alert,
    Snackbar
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetInventoryPlans
} from "../../Redux/MasterData/masterAction";

const InventoryPlanTable = ({
    selectedProject,
    selectedWindfarm
}) => {
    const dispatch = useDispatch();
    const {
        inventoryPlans = []
    } = useSelector((state) => state.masterData);
    const [notifications, setNotifications] = useState([]);
    const [alertInfo, setAlertInfo] = useState({
        open: false,
        message: "",
    });

    useEffect(() => {
        dispatch(GetInventoryPlans());
    }, [dispatch]);

    useEffect(() => {
        if (inventoryPlans.length > 0) {
            const lowStockItems = inventoryPlans.filter(
                (item) => item.available_stock < item.required_qty * 0.25
            );

            // 🔥 Build readable messages
            const dynamicMessages = lowStockItems.map(
                (item) =>
                `⚠ Safety stock below 25% for ${item.material_name} (Project: ${item.project_name}, Windfarm: ${item.windfarm_name})`
            );

            setNotifications(dynamicMessages);

            // Show alert popup only once
            if (lowStockItems.length > 0) {
                setAlertInfo({
                    open: true,
                    message: `⚠ ${lowStockItems.length} item(s) have stock below 25%!`,
                });
            }
        }
    }, [inventoryPlans]);


    // 🔄 Convert API data
    const rows = useMemo(
        () =>
        inventoryPlans.map((item, index) => ({
            id: item.id,
            sr_no: index + 1,

            project: item.project_name,
            project_id: item.project, // Add ID
            windfarm: item.windfarm_name,
            windfarm_id: item.windfarm, // Add ID

            material_name: item.material_name || "-",
            required_qty: item.required_qty ? ? 0,
            available_stock: item.available_stock ? ? 0,
            shortage_qty: item.shortage_qty ? ? 0,
            safety_stock: item.safety_stock ? ? 0,
            reorder_level: item.reorder_level ? ? 0,
            lead_time_days: item.lead_time_days ? ? 0,
            required_by_date: item.required_by_date || "-",
            planned_procurement_date: item.planned_procurement_date || "-",
        })), [inventoryPlans]
    );


    // 🔥 Filtered records for selected project & windfarm
    const filteredData = useMemo(() => {
        if (!selectedProject || !selectedWindfarm) return rows;

        return rows.filter(
            (item) =>
            item.project_id === selectedProject &&
            item.windfarm_id === selectedWindfarm
        );
    }, [rows, selectedProject, selectedWindfarm]);


    // Columns
    const columns = [{
            field: "sr_no",
            headerName: "Sr",
            width: 70
        },
        {
            field: "material_name",
            headerName: "Material",
            width: 160
        },
        {
            field: "project",
            headerName: "Project",
            width: 160
        },
        {
            field: "windfarm",
            headerName: "Windfarm",
            width: 160
        },
        {
            field: "required_qty",
            headerName: "Required Qty",
            width: 120
        },
        {
            field: "available_stock",
            headerName: "Available",
            width: 120
        },
        {
            field: "shortage_qty",
            headerName: "Shortage",
            width: 120,
            renderCell: (params) => ( <
                strong style = {
                    {
                        color: params.value > 0 ? "red" : "green"
                    }
                } > {
                    params.value
                } <
                /strong>
            ),
        },
        {
            field: "safety_stock",
            headerName: "Safety Stock",
            width: 120
        },
        {
            field: "reorder_level",
            headerName: "Reorder Level",
            width: 150
        },
        {
            field: "lead_time_days",
            headerName: "Lead Time",
            width: 140
        },
        {
            field: "required_by_date",
            headerName: "Required By",
            width: 150
        },
        {
            field: "planned_procurement_date",
            headerName: "Procurement Date",
            width: 170
        },
    ];

    return ( <
        Paper sx = {
            {
                p: 2,
                mt: 2
            }
        } >
        <
        DataGrid rows = {
            filteredData
        }
        columns = {
            columns
        }
        autoHeight pageSize = {
            10
        }
        sx = {
            {
                border: "1px solid #e0e0e0",

                /* FULL HEADER SOLID COLOR */
                "& .MuiDataGrid-columnHeaders": {
                    background: "#00416A", // solid navy blue
                    color: "#fff", // white text
                    fontWeight: "bold",
                },

                /* remove individual column header background */
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
        Snackbar open = {
            alertInfo.open
        }
        autoHideDuration = {
            5000
        }
        onClose = {
            () => setAlertInfo({ ...alertInfo,
                open: false
            })
        }
        anchorOrigin = {
            {
                vertical: "top",
                horizontal: "center"
            }
        } >
        <
        Alert severity = "error"
        variant = "filled"
        onClose = {
            () => setAlertInfo({ ...alertInfo,
                open: false
            })
        } >
        {
            alertInfo.message
        } <
        /Alert> <
        /Snackbar> <
        /Paper>
    );
};

export default InventoryPlanTable;